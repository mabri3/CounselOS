from __future__ import annotations

import os
import tempfile
from collections import OrderedDict
from copy import deepcopy
from dataclasses import dataclass
from pathlib import Path
from threading import RLock
from typing import Any, Iterable

import frontmatter

from app.services.execution_inputs import ExecutionInputs
from app.utils.paths import ensure_within


@dataclass(frozen=True)
class _MarkdownRead:
    stamp: tuple[int, ...]
    size: int
    document: dict[str, Any]


class VaultService:
    """Safe, atomic access to the Markdown-first vault."""

    # Bound retained source bytes and entry count; parsed metadata adds overhead.
    # Long conversations include their frozen audit inputs. Keep room for a
    # transcript above 32 MiB so each submit does not repeatedly parse it.
    MARKDOWN_CACHE_MAX_BYTES = 64 * 1024 * 1024
    MARKDOWN_CACHE_MAX_FILES = 1024

    def __init__(self, root: Path):
        self.root = root.resolve()
        self.root.mkdir(parents=True, exist_ok=True)
        self._markdown_cache: OrderedDict[Path, _MarkdownRead] = OrderedDict()
        self._markdown_cache_bytes = 0
        self._markdown_cache_lock = RLock()
        self.execution_inputs = ExecutionInputs(self.resolve, self.write_bytes)

    def resolve(self, relative_path: str | Path) -> Path:
        return ensure_within(self.root, relative_path)

    def relative(self, path: Path) -> str:
        return path.resolve().relative_to(self.root).as_posix()

    def exists(self, relative_path: str | Path) -> bool:
        return self.resolve(relative_path).exists()

    def read_text(self, relative_path: str | Path) -> str:
        path = self.resolve(relative_path)
        return path.read_text(encoding="utf-8")

    def read_markdown(self, relative_path: str | Path, *, include_execution: bool = True) -> dict[str, Any]:
        path = self.resolve(relative_path)
        # Parallel page requests must not parse the same large transcript again.
        with self._markdown_cache_lock:
            stat = path.stat()
            stamp = self._markdown_stamp(stat)
            cached = self._markdown_cache.get(path)
            if cached is not None and cached.stamp == stamp:
                self._markdown_cache.move_to_end(path)
                document = cached.document
            else:
                if cached is not None:
                    self._markdown_cache_bytes -= self._markdown_cache.pop(path).size
                post = frontmatter.loads(path.read_text(encoding="utf-8"))
                document = {
                    "path": self.relative(path), "name": path.name,
                    "content": post.content, "metadata": dict(post.metadata),
                    "updated_at": stat.st_mtime,
                }
                # An external edit during parsing belongs to the next read.
                if (stat.st_size <= self.MARKDOWN_CACHE_MAX_BYTES
                        and self._markdown_stamp(path.stat()) == stamp):
                    self._markdown_cache[path] = _MarkdownRead(stamp, stat.st_size, document)
                    self._markdown_cache_bytes += stat.st_size
                    while (len(self._markdown_cache) > self.MARKDOWN_CACHE_MAX_FILES
                           or self._markdown_cache_bytes > self.MARKDOWN_CACHE_MAX_BYTES):
                        _, removed = self._markdown_cache.popitem(last=False)
                        self._markdown_cache_bytes -= removed.size
        # Callers often edit nested metadata before saving. Never share that state.
        if include_execution:
            document = {**document, "metadata": self.execution_inputs.restore(document["metadata"])}
        return deepcopy(document)

    @staticmethod
    def _markdown_stamp(stat: os.stat_result) -> tuple[int, ...]:
        return stat.st_dev, stat.st_ino, stat.st_mtime_ns, stat.st_ctime_ns, stat.st_size

    def read_document(self, relative_path: str | Path, *, include_execution: bool = True) -> dict[str, Any]:
        path = self.resolve(relative_path)
        suffix = path.suffix.lower()
        if suffix == ".md":
            result = self.read_markdown(relative_path, include_execution=include_execution)
            result.update({"editable": not (bool(result["metadata"].get("immutable")) or self._in_source_library(self.relative(path))), "kind": "markdown"})
            return result
        if suffix in {".txt", ".csv", ".json", ".yaml", ".yml"}:
            return {
                "path": self.relative(path),
                "name": path.name,
                "content": path.read_text(encoding="utf-8", errors="replace"),
                "metadata": {},
                "updated_at": path.stat().st_mtime,
                "editable": suffix == ".txt",
                "kind": "text",
            }
        return {
            "path": self.relative(path),
            "name": path.name,
            "content": "",
            "metadata": {},
            "updated_at": path.stat().st_mtime,
            "editable": False,
            "kind": suffix.lstrip(".") or "binary",
        }

    def write_markdown(
        self,
        relative_path: str | Path,
        content: str,
        metadata: dict[str, Any] | None = None,
    ) -> str:
        path = self.resolve(relative_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        post = frontmatter.Post(content.strip() + "\n", **self.execution_inputs.separate(metadata or {}))
        self._atomic_write(path, frontmatter.dumps(post))
        return self.relative(path)

    def update_markdown(
        self,
        relative_path: str | Path,
        *,
        content: str | None = None,
        metadata_updates: dict[str, Any] | None = None,
    ) -> str:
        current = self.read_markdown(relative_path)
        metadata = current["metadata"]
        metadata.update(metadata_updates or {})
        return self.write_markdown(
            relative_path,
            current["content"] if content is None else content,
            metadata,
        )

    def write_bytes(self, relative_path: str | Path, data: bytes) -> str:
        path = self.resolve(relative_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        fd, temp_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
        try:
            with os.fdopen(fd, "wb") as handle:
                handle.write(data)
                handle.flush()
                os.fsync(handle.fileno())
            os.replace(temp_name, path)
        finally:
            if os.path.exists(temp_name):
                os.unlink(temp_name)
        return self.relative(path)

    def move(self, source: str | Path, destination: str | Path) -> str:
        source_path = self.resolve(source)
        destination_path = self.resolve(destination)
        destination_path.parent.mkdir(parents=True, exist_ok=True)
        os.replace(source_path, destination_path)
        return self.relative(destination_path)

    def list_tree(self, relative_path: str = "", *, max_depth: int = 8) -> list[dict[str, Any]]:
        root = self.resolve(relative_path)
        if not root.exists():
            return []

        def build(path: Path, depth: int) -> list[dict[str, Any]]:
            if depth > max_depth:
                return []
            entries = [entry for entry in path.iterdir()
                       if not entry.name.startswith(".")
                       and not (entry.is_dir() and self._in_source_library(self.relative(entry)))]
            entries.sort(key=lambda item: (not item.is_dir(), item.name.lower()))
            nodes: list[dict[str, Any]] = []
            for entry in entries:
                node: dict[str, Any] = {
                    "name": entry.name,
                    "path": self.relative(entry),
                    "type": "folder" if entry.is_dir() else "file",
                }
                if entry.is_dir():
                    node["children"] = build(entry, depth + 1)
                else:
                    node["extension"] = entry.suffix.lower()
                    node["updated_at"] = entry.stat().st_mtime
                nodes.append(node)
            return nodes

        return build(root, 0)

    SOURCE_LIBRARY_SEGMENT = "/research/source-library/"

    @classmethod
    def _in_source_library(cls, relative: str) -> bool:
        return cls.SOURCE_LIBRARY_SEGMENT in f"/{relative.strip('/')}/"

    def iter_files(
        self,
        relative_path: str = "",
        suffixes: set[str] | None = None,
        *,
        include_source_library: bool = False,
    ) -> Iterable[Path]:
        """Walk vault files.

        The internal source library holds one Markdown file per extracted page, so a
        large source would otherwise make every matter-wide walk read thousands of
        records. It is skipped unless the caller asks for it or walks into it directly;
        its content stays reachable through the library service and the search index.
        """
        root = self.resolve(relative_path)
        if not root.exists():
            return []
        def visible_files():
            for directory, children, names in os.walk(root):
                # Historical document versions remain addressable by reference.
                # Only frozen execution inputs are outside ordinary file walks.
                children[:] = [name for name in children if name != ".execution-inputs"]
                for name in names:
                    if not name.startswith("."):
                        path = Path(directory) / name
                        if path.is_file():
                            yield path
        files = visible_files()
        if not include_source_library and not self._in_source_library(str(relative_path)):
            files = (path for path in files if not self._in_source_library(self.relative(path)))
        if suffixes is None:
            return files
        normalized = {suffix.lower() for suffix in suffixes}
        return (path for path in files if path.suffix.lower() in normalized)

    def lexical_search(self, query: str, *, relative_path: str = "", limit: int = 10) -> list[dict[str, Any]]:
        terms = [term.lower() for term in query.split() if len(term) > 1]
        if not terms:
            return []
        scored: list[tuple[int, dict[str, Any]]] = []
        for path in self.iter_files(relative_path, {".md", ".txt"}):
            if self.relative(path).startswith("99_Trash/"):
                continue
            try:
                text = path.read_text(encoding="utf-8", errors="replace")
            except OSError:
                continue
            lowered = text.lower()
            score = sum(lowered.count(term) for term in terms)
            if score == 0:
                continue
            first = min((lowered.find(term) for term in terms if term in lowered), default=0)
            start = max(0, first - 120)
            end = min(len(text), first + 360)
            snippet = " ".join(text[start:end].split())
            scored.append(
                (
                    score,
                    {
                        "path": self.relative(path),
                        "title": path.stem.replace("-", " ").replace("_", " ").title(),
                        "snippet": snippet,
                        "score": score,
                    },
                )
            )
        scored.sort(key=lambda item: (-item[0], item[1]["path"]))
        return [item for _, item in scored[:limit]]

    @staticmethod
    def _atomic_write(path: Path, text: str) -> None:
        fd, temp_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent, text=True)
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as handle:
                handle.write(text)
                handle.flush()
                os.fsync(handle.fileno())
            os.replace(temp_name, path)
        finally:
            if os.path.exists(temp_name):
                os.unlink(temp_name)
