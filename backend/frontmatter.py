"""Tiny python-frontmatter-compatible subset used by the MVP.

The project keeps this local adapter to minimize dependencies. It supports the
Post, loads, load, and dumps APIs used by the application.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, TextIO

import yaml


@dataclass
class Post:
    content: str
    metadata: dict[str, Any] = field(default_factory=dict)

    def __init__(self, content: str, **metadata: Any):
        self.content = content
        self.metadata = metadata

    def get(self, key: str, default: Any = None) -> Any:
        return self.metadata.get(key, default)


def loads(text: str) -> Post:
    normalized = text.lstrip("\ufeff")
    if not normalized.startswith("---"):
        return Post(normalized)
    lines = normalized.splitlines(keepends=True)
    if not lines or lines[0].strip() != "---":
        return Post(normalized)
    closing = next(
        (
            index
            for index, line in enumerate(lines[1:], start=1)
            if line.rstrip("\r\n") == "---"
        ),
        None,
    )
    if closing is None:
        return Post(normalized)
    raw_metadata = "".join(lines[1:closing])
    metadata = yaml.safe_load(raw_metadata) or {}
    if not isinstance(metadata, dict):
        raise ValueError("Markdown frontmatter must be a YAML mapping.")
    content = "".join(lines[closing + 1 :]).lstrip("\n")
    return Post(content, **metadata)


def load(source: str | Path | TextIO) -> Post:
    if hasattr(source, "read"):
        return loads(source.read())
    return loads(Path(source).read_text(encoding="utf-8"))


def dumps(post: Post) -> str:
    metadata = yaml.safe_dump(
        post.metadata,
        sort_keys=False,
        allow_unicode=True,
        default_flow_style=False,
    ).strip()
    return f"---\n{metadata}\n---\n{post.content.lstrip()}"
