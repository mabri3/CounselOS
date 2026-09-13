from __future__ import annotations

from pathlib import PurePosixPath

from app.services.matters import MatterService
from app.services.settings import SettingsService


class MatterPathPolicy:
    """Resolve configurable user-file folders inside one selected matter."""

    PROTECTED_ROOTS = {
        "matter.md", "request.md", "facts.md", "issues.md", "participants.md",
        "recommendations.md", "work-items", "research", "decisions", "events",
        "conversations", "dossier-revisions", "mitigations",
    }
    RESERVED_BATCHES = PurePosixPath("documents/batches")

    def __init__(self, settings: SettingsService, matters: MatterService):
        self.settings = settings
        self.matters = matters

    @classmethod
    def validate_values(cls, values: dict[str, object]) -> dict[str, str]:
        configured = {
            key: cls._validate_relative(key, values.get(key, default))
            for key, default in SettingsService.MATTER_FILE_DEFAULTS.items()
        }
        paths = {key: PurePosixPath(value) for key, value in configured.items()}
        for key, path in paths.items():
            if path == cls.RESERVED_BATCHES or cls.RESERVED_BATCHES in path.parents:
                raise ValueError(f"{key} cannot use the reserved documents/batches location.")
            first = path.parts[0]
            if first in cls.PROTECTED_ROOTS:
                raise ValueError(f"{key} cannot use the protected matter record '{first}'.")
        for left_key, left in paths.items():
            for right_key, right in paths.items():
                if left_key >= right_key:
                    continue
                if left == right or left in right.parents or right in left.parents:
                    raise ValueError(f"{left_key} and {right_key} must not overlap.")
        return configured

    @classmethod
    def _validate_relative(cls, key: str, raw: object) -> str:
        if not isinstance(raw, str) or not raw.strip():
            raise ValueError(f"{key} must not be empty.")
        if "\\" in raw:
            raise ValueError(f"{key} must use forward slashes.")
        path = PurePosixPath(raw)
        if path.is_absolute() or raw.startswith("/"):
            raise ValueError(f"{key} must be relative to a matter.")
        if raw in {".", ".."} or any(part in {"", ".", ".."} for part in raw.split("/")):
            raise ValueError(f"{key} contains an invalid path segment.")
        return path.as_posix()

    def folder(self, matter_id: str, key: str) -> str:
        if key not in SettingsService.MATTER_FILE_DEFAULTS:
            raise ValueError(f"Unknown matter file setting: {key}")
        configured = self.validate_values(self.settings.read()["values"])
        base = PurePosixPath(self.matters.matter_path(matter_id))
        resolved = base / configured[key]
        matter_directory = self.matters.vault.resolve(base)
        configured_directory = (matter_directory / configured[key]).resolve()
        try:
            configured_directory.relative_to(matter_directory)
        except ValueError as exc:
            raise ValueError(
                "Configured path must stay inside the selected matter."
            ) from exc
        return resolved.as_posix()
