from __future__ import annotations

import hashlib

from app.models.api import CompanyProfile
from app.services.vault import VaultService
from app.utils.time import iso_now


class CompanyProfileService:
    PATH = "00_System/company.md"
    SOURCE_ID = "SRC-COMPANY"

    def __init__(self, vault: VaultService):
        self.vault = vault

    def read(self) -> CompanyProfile:
        if not self.vault.exists(self.PATH):
            return CompanyProfile()
        document = self.vault.read_markdown(self.PATH)
        metadata = document["metadata"]
        fields = metadata.get("profile") if isinstance(metadata.get("profile"), dict) else {}
        return CompanyProfile(
            source_id=str(metadata.get("source_id") or self.SOURCE_ID),
            version=str(metadata.get("version") or self._version(document["content"])),
            **{name: str(fields.get(name) or "") for name in CompanyProfile.model_fields if name not in {"source_id", "version"}},
        )

    def write(self, profile: CompanyProfile) -> CompanyProfile:
        fields = profile.model_dump(exclude={"source_id", "version"})
        content = "# Company profile\n\n" + "\n\n".join(
            f"## {name.replace('_', ' ').title()}\n\n{value or 'Not provided.'}"
            for name, value in fields.items()
        )
        version = self._version(content)
        self.vault.write_markdown(self.PATH, content, {
            "record_type": "company_profile",
            "source_id": self.SOURCE_ID,
            "version": version,
            "updated_at": iso_now(),
            "profile": fields,
        })
        return profile.model_copy(update={"source_id": self.SOURCE_ID, "version": version})

    @staticmethod
    def _version(content: str) -> str:
        return hashlib.sha256(content.encode("utf-8")).hexdigest()[:16]
