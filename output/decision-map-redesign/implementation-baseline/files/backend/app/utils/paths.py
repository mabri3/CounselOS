from __future__ import annotations

import re
from pathlib import Path


SAFE_FILENAME = re.compile(r"[^a-zA-Z0-9._ -]+")


def safe_filename(name: str) -> str:
    cleaned = SAFE_FILENAME.sub("-", Path(name).name).strip(" .-")
    return cleaned[:180] or "uploaded-file"


def ensure_within(root: Path, relative_path: str | Path) -> Path:
    relative = Path(str(relative_path).replace("\\", "/"))
    if relative.is_absolute() or ".." in relative.parts:
        raise ValueError("Path must remain inside the vault.")

    root_resolved = root.resolve()
    candidate = (root_resolved / relative).resolve()
    try:
        candidate.relative_to(root_resolved)
    except ValueError as exc:
        raise ValueError("Path must remain inside the vault.") from exc
    return candidate
