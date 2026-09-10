from __future__ import annotations

import re
import secrets
from datetime import UTC, datetime


def slugify(value: str, *, fallback: str = "item") -> str:
    clean = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower()).strip("-")
    return clean[:64] or fallback


def new_id(prefix: str) -> str:
    stamp = datetime.now(UTC).strftime("%Y%m%d")
    return f"{prefix}-{stamp}-{secrets.token_hex(3)}"
