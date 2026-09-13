"""Keep large, frozen execution inputs out of frequently read Markdown records.

The payloads are immutable Markdown source files in the same vault. References
are content hashes, not executable paths. Old inline records remain readable.
"""
from __future__ import annotations

from collections import OrderedDict
from hashlib import sha256
from pathlib import Path
import re
from threading import RLock
from typing import Any, Callable

import frontmatter


ROOT = "00_System/.execution-inputs"
REFERENCE = "$themis_execution_input"
FIELDS = {"frozen_context", "frozen_template_use", "snapshot", "batch_candidates"}
RECORD_TYPES = {"chat_transcript", "chat_run", "research_run", "dossier_request", "dossier_research_request"}
MIN_BYTES = 32 * 1024


class ExecutionInputs:
    def __init__(self, resolve: Callable[[str], Path], write: Callable[[str, bytes], str]):
        self.resolve, self.write = resolve, write
        self._cache: OrderedDict[str, tuple[tuple[int, ...], int, Any]] = OrderedDict()
        self._bytes = 0
        self._lock = RLock()

    def separate(self, metadata: dict[str, Any]) -> dict[str, Any]:
        if metadata.get("record_type") not in RECORD_TYPES:
            return metadata

        def visit(value):
            if isinstance(value, list):
                return [visit(item) for item in value]
            if not isinstance(value, dict):
                return value
            result = {}
            for key, item in value.items():
                if key in FIELDS and isinstance(item, (dict, list)) and REFERENCE not in item:
                    payload = frontmatter.dumps(frontmatter.Post("# Saved execution inputs\n", payload=item)).encode()
                    if len(payload) >= MIN_BYTES:
                        digest = sha256(payload).hexdigest()
                        path = f"{ROOT}/{digest}.md"
                        if not self.resolve(path).exists():
                            self.write(path, payload)
                        result[key] = {REFERENCE: digest}
                        # Question cards need this small revision baseline when
                        # projecting saved history, without reopening all inputs.
                        if isinstance(item, dict) and "intake_publication_baseline" in item:
                            result[key]["intake_publication_baseline"] = item["intake_publication_baseline"]
                        continue
                result[key] = visit(item)
            return result

        return visit(metadata)

    def restore(self, value: Any) -> Any:
        if isinstance(value, list):
            return [self.restore(item) for item in value]
        if not isinstance(value, dict):
            return value
        if REFERENCE in value:
            digest = value[REFERENCE]
            if not isinstance(digest, str) or not re.fullmatch(r"[0-9a-f]{64}", digest):
                raise ValueError("Invalid saved execution input reference.")
            path = self.resolve(f"{ROOT}/{digest}.md")
            with self._lock:
                stat = path.stat()
                stamp = (stat.st_dev, stat.st_ino, stat.st_size, stat.st_mtime_ns, stat.st_ctime_ns)
                cached = self._cache.get(digest)
                if cached and cached[0] == stamp:
                    self._cache.move_to_end(digest)
                    return cached[2]
                raw = path.read_bytes()
                if sha256(raw).hexdigest() != digest:
                    raise ValueError("Saved execution inputs no longer match their recorded version.")
                payload = frontmatter.loads(raw.decode()).metadata["payload"]
                if cached:
                    self._bytes -= self._cache.pop(digest)[1]
                if len(raw) <= 64 * 1024 * 1024:
                    self._cache[digest] = (stamp, len(raw), payload)
                    self._bytes += len(raw)
                    while self._bytes > 64 * 1024 * 1024 or len(self._cache) > 128:
                        _, removed = self._cache.popitem(last=False)
                        self._bytes -= removed[1]
                return payload
        return {key: self.restore(item) for key, item in value.items()}
