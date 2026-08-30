from __future__ import annotations

import hashlib
import json
import threading

from app.models.api import CompanyProfile
from app.services.vault import VaultService
from app.utils.time import iso_now


class CompanyProfileVersionConflictError(Exception):
    """The submitted profile was based on an older saved profile."""


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

    def write(self, profile: CompanyProfile) -> CompanyProfile:
        with self._write_lock:
            if profile.version:
                current = self.read()
                if profile.version != current.version:
                    raise CompanyProfileVersionConflictError
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

    @staticmethod
    def _version(content: str, fields: dict) -> str:
        canonical = json.dumps(
            {"content": content.strip(), "profile": fields},
            sort_keys=True,
            separators=(",", ":"),
            default=str,
        )
        return hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:16]
