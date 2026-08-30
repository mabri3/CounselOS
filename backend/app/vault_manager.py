from __future__ import annotations

import json
import os
import shutil
import tempfile
from pathlib import Path

from app.config import PROJECT_ROOT


TEMPLATE_ROOT = Path(__file__).with_name("blank_vault_template")
CORE_FILES = (
    "00_System/Agents.md", "00_System/Soul.md",
    "00_System/workflows/product-counsel.md",
)
CORE_TREES = ("00_System/agents", "00_System/tools")
EMPTY_DIRS = (
    "00_System/conversations", "00_System/legal-awareness/views",
    "00_System/legal-awareness/watches", "00_System/schedules", "00_System/skills",
    "01_Playbooks", "02_Company_Knowledge", "03_Matters", "04_Inbox",
    "05_Briefing",
)


class VaultManager:
    def __init__(self, current_vault: Path):
        self.current_vault = current_vault.resolve()

    def create(self, requested: str) -> Path:
        target = self._new_target(requested)
        staging = Path(tempfile.mkdtemp(prefix=f".{target.name}.counsel-os-", dir=target.parent))
        try:
            self._populate(staging)
            self.validate(staging)
            staging.rename(target)
            return target.resolve()
        except Exception:
            shutil.rmtree(staging, ignore_errors=True)
            raise

    def load(self, requested: str) -> Path:
        target = self._absolute_clean_path(requested)
        if not target.is_dir():
            raise ValueError("Select an existing vault directory.")
        self.validate(target)
        return target.resolve()

    def validate(self, root: Path) -> None:
        canonical = root.resolve()
        marker = canonical / ".counsel-os-vault.json"
        current_format = all((canonical / item).is_file() for item in CORE_FILES) and all(
            (canonical / item).is_dir() for item in CORE_TREES
        )
        marked = False
        if marker.is_file():
            try:
                marked = json.loads(marker.read_text(encoding="utf-8")).get("schema_version") == 1
            except (OSError, ValueError, TypeError):
                pass
        if not (marked or current_format):
            raise ValueError("This directory is not a current Counsel OS vault.")
        for relative in (*CORE_FILES, *CORE_TREES):
            item = canonical / relative
            if not item.exists():
                raise ValueError(f"The vault is missing {relative}.")
            resolved = item.resolve()
            if resolved != canonical and canonical not in resolved.parents:
                raise ValueError(f"The required vault path {relative} points outside the vault.")

    def _new_target(self, requested: str) -> Path:
        target = self._absolute_clean_path(requested)
        if target.exists() or target.is_symlink():
            raise ValueError("Create new vault requires a path that does not exist.")
        if target in {Path("/"), Path.home().resolve(), PROJECT_ROOT.resolve(), self.current_vault}:
            raise ValueError("That path is reserved and cannot be used as a vault.")
        if target in self.current_vault.parents or self.current_vault in target.parents:
            raise ValueError("A new vault cannot contain, or be inside, the current vault.")
        if not target.parent.is_dir():
            raise ValueError("The parent directory must already exist.")
        return target

    @staticmethod
    def _absolute_clean_path(requested: str) -> Path:
        if requested.strip().startswith("~"):
            raise ValueError("Enter an absolute path without '~'.")
        raw = Path(requested).expanduser()
        if not raw.is_absolute():
            raise ValueError("Enter an absolute path.")
        normalized = Path(os.path.abspath(raw))
        if raw != normalized:
            raise ValueError("Enter a direct path without aliases such as '..'.")
        canonical = normalized.resolve(strict=False)
        if normalized != canonical:
            raise ValueError("Enter a direct path without symbolic-link aliases.")
        return canonical

    def _populate(self, staging: Path) -> None:
        manifest = json.loads((TEMPLATE_ROOT / "manifest.json").read_text(encoding="utf-8"))
        if manifest.get("schema_version") != 1:
            raise ValueError("The blank-vault template is invalid.")
        files = manifest.get("files")
        if not isinstance(files, dict):
            raise ValueError("The blank-vault template has no files.")
        for relative, content in files.items():
            if not isinstance(relative, str) or not isinstance(content, str):
                raise ValueError("The blank-vault template contains an invalid file.")
            destination = staging / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_text(content, encoding="utf-8")
        for relative in EMPTY_DIRS:
            (staging / relative).mkdir(parents=True, exist_ok=True)
