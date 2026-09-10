from __future__ import annotations

import hashlib
import json
import threading

from app.models.api import CompanyProfile
from app.services.vault import VaultService
from app.utils.time import iso_now


class CompanyProfileVersionConflictError(Exception):
    """The submitted profile was based on an older saved profile."""


class CompanyProfileReplacementConfirmationError(Exception):
    """Replacing a different company was not explicitly confirmed."""

    def __init__(self, current_name: str, replacement_name: str):
        self.current_name = current_name
        self.replacement_name = replacement_name
        super().__init__(f"Confirm replacement of {current_name} with {replacement_name}.")


class CompanyProfileService:
    PATH = "00_System/company.md"
    SOURCE_ID = "SRC-COMPANY"

    def __init__(self, vault: VaultService):
        self.vault = vault
        self._write_lock = threading.Lock()

    def read(self) -> CompanyProfile:
        if not self.vault.exists(self.PATH):
            return CompanyProfile()
        document = self.vault.read_markdown(self.PATH)
        metadata = document["metadata"]
        fields = metadata.get("profile") if isinstance(metadata.get("profile"), dict) else {}
        return CompanyProfile(
            source_id=str(metadata.get("source_id") or self.SOURCE_ID),
            version=self._version(document["content"], fields),
            **{name: str(fields.get(name) or "") for name in CompanyProfile.model_fields if name not in {"source_id", "version"}},
        )

    def saved_at(self) -> str:
        if not self.vault.exists(self.PATH):
            return ""
        document = self.vault.read_markdown(self.PATH)
        return str(document["metadata"].get("updated_at") or "")

    def write(
        self,
        profile: CompanyProfile,
        *,
        replacement_confirmation: str = "",
    ) -> CompanyProfile:
        with self._write_lock:
            current = self.read()
            if profile.version and profile.version != current.version:
                raise CompanyProfileVersionConflictError
            current_name = self._display_name(current.company_name)
            replacement_name = self._display_name(profile.company_name)
            if (
                current_name
                and replacement_name
                and self._normalized_name(current_name) != self._normalized_name(replacement_name)
                and replacement_confirmation
                != self.replacement_confirmation(current_name, replacement_name)
            ):
                raise CompanyProfileReplacementConfirmationError(
                    current_name,
                    replacement_name,
                )
            fields = profile.model_dump(exclude={"source_id", "version"})
            content = "# Company profile\n\n" + "\n\n".join(
                f"## {name.replace('_', ' ').title()}\n\n{value or 'Not provided.'}"
                for name, value in fields.items()
            )
            version = self._version(content, fields)
            self.vault.write_markdown(self.PATH, content, {
                "record_type": "company_profile",
                "source_id": self.SOURCE_ID,
                "version": version,
                "updated_at": iso_now(),
                "profile": fields,
            })
            return profile.model_copy(update={"source_id": self.SOURCE_ID, "version": version})

    @classmethod
    def replacement_confirmation(cls, current_name: str, replacement_name: str) -> str:
        return (
            f"Replace the company profile for {cls._display_name(current_name)} "
            f"with {cls._display_name(replacement_name)}?"
        )

    @staticmethod
    def _display_name(name: str) -> str:
        return " ".join(name.strip().split())

    @classmethod
    def _normalized_name(cls, name: str) -> str:
        return cls._display_name(name).casefold()

    @staticmethod
    def _version(content: str, fields: dict) -> str:
        canonical = json.dumps(
            {"content": content.strip(), "profile": fields},
            sort_keys=True,
            separators=(",", ":"),
            default=str,
        )
        return hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:16]
