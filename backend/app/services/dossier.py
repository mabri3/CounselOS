from __future__ import annotations

import hashlib
from typing import Any

from app.services.matters import MatterService
from app.services.vault import VaultService
from app.utils.ids import new_id
from app.utils.time import iso_now


class DossierService:
    def __init__(self, vault: VaultService, matters: MatterService):
        self.vault = vault
        self.matters = matters

    def get(self, matter_id: str) -> dict[str, Any] | None:
        path = self._path(matter_id)
        return self.vault.read_markdown(path) if self.vault.exists(path) else None

    def content_hash(self, matter_id: str) -> str | None:
        dossier = self.get(matter_id)
        return self._hash(dossier["content"]) if dossier else None

    def propose_update(
        self, matter_id: str, content: str, *, expected_hash: str | None,
        material: bool = True, force: bool = False,
    ) -> dict[str, Any]:
        current = self.get(matter_id)
        current_hash = self._hash(current["content"]) if current else None
        guard_failed = current is not None and expected_hash != current_hash
        if current is not None and not material and not force:
            return {"state": "not_required", "path": self._path(matter_id), "content_hash": current_hash}
        revision = self._write_revision(matter_id, content, current_hash, "draft" if guard_failed else "applied")
        if guard_failed:
            return {"state": "review_required", "revision_path": revision, "content_hash": current_hash}
        self._write_current(matter_id, content, revision)
        self.matters.append_event(matter_id, "dossier_updated", {"revision_path": revision, "title": "Dossier updated"})
        return {"state": "applied", "path": self._path(matter_id), "revision_path": revision,
                "content_hash": self._hash(content)}

    def apply_revision(self, matter_id: str, revision_path: str, *, expected_hash: str | None) -> dict[str, Any]:
        current_hash = self.content_hash(matter_id)
        if current_hash != expected_hash:
            raise ValueError("The dossier changed. Review the draft revision against the current dossier.")
        revision = self.vault.read_markdown(revision_path)
        if revision["metadata"].get("matter_id") != matter_id:
            raise ValueError("The revision belongs to a different matter.")
        self._write_current(matter_id, revision["content"], revision_path)
        self.vault.update_markdown(revision_path, metadata_updates={"status": "applied", "applied_at": iso_now()})
        self.matters.append_event(matter_id, "dossier_revision_applied", {"revision_path": revision_path})
        return {"state": "applied", "path": self._path(matter_id), "content_hash": self._hash(revision["content"])}

    def _write_current(self, matter_id: str, content: str, revision_path: str) -> None:
        self.vault.write_markdown(self._path(matter_id), content, {
            "matter_id": matter_id, "record_type": "dossier", "editable": True,
            "source_revision": revision_path, "updated_at": iso_now(), "content_hash": self._hash(content),
        })

    def _write_revision(self, matter_id: str, content: str, base_hash: str | None, status: str) -> str:
        revision_id = new_id("DOS")
        path = f"{self.matters.matter_path(matter_id)}/dossier-revisions/{revision_id}.md"
        return self.vault.write_markdown(path, content, {
            "revision_id": revision_id, "matter_id": matter_id, "record_type": "dossier_revision",
            "status": status, "base_content_hash": base_hash or "", "content_hash": self._hash(content),
            "created_at": iso_now(), "immutable": True,
        })

    def _path(self, matter_id: str) -> str:
        return f"{self.matters.matter_path(matter_id)}/dossier.md"

    @staticmethod
    def _hash(content: str) -> str:
        stored_content = content.strip() + "\n"
        return hashlib.sha256(stored_content.encode("utf-8")).hexdigest()
