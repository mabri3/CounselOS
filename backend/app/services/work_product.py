from __future__ import annotations

import hashlib
from pathlib import PurePosixPath
from typing import Any

from app.services.matters import MatterService
from app.services.matter_paths import MatterPathPolicy
from app.services.vault import VaultService
from app.utils.ids import new_id, slugify
from app.utils.time import iso_now


class WorkProductService:
    def __init__(self, vault: VaultService, matters: MatterService, matter_paths: MatterPathPolicy):
        self.vault = vault
        self.matters = matters
        self.matter_paths = matter_paths

    def create_draft(self, matter_id: str, *, title: str, content: str, summary: str = "") -> dict[str, Any]:
        work_product_id = new_id("WP")
        filename = f"{slugify(title)}-{work_product_id[-6:]}.md"
        folder = self.matter_paths.folder(matter_id, "matter_files.draft_outputs_dir")
        path = f"{folder}/{filename}"
        self.vault.write_markdown(path, content, {
            "work_product_id": work_product_id, "matter_id": matter_id, "title": title,
            "record_type": "work_product", "state": "draft", "summary": summary,
            "created_at": iso_now(), "immutable": False,
        })
        self.matters.append_event(matter_id, "work_product_drafted", {"path": path, "title": title})
        return {
            "record_type": "work_product",
            "work_product_id": work_product_id,
            "title": title,
            "vault_path": path,
            "state": "draft",
            "summary": summary,
        }

    def mutable_draft(self, matter_id: str, draft_path: str) -> dict[str, Any]:
        """Load one canonical mutable draft owned by the selected matter."""
        if "\\" in draft_path:
            raise ValueError("The existing draft path must use forward slashes.")
        supplied = PurePosixPath(draft_path)
        matter_root = PurePosixPath(self.matters.matter_path(matter_id))
        if (
            supplied.is_absolute()
            or ".." in supplied.parts
            or supplied.suffix.lower() != ".md"
            or matter_root not in supplied.parents
            or not self.vault.exists(draft_path)
        ):
            raise ValueError("Only a canonical draft from this matter can be revised.")
        relative = supplied.relative_to(matter_root)
        if (
            relative.parts[0] in MatterPathPolicy.PROTECTED_ROOTS
            or not self._is_draft_location(matter_id, supplied)
        ):
            raise ValueError("Only a canonical draft from this matter can be revised.")
        draft = self.vault.read_markdown(draft_path)
        metadata = draft["metadata"]
        if (
            metadata.get("matter_id") != matter_id
            or metadata.get("record_type") != "work_product"
            or metadata.get("state") != "draft"
            or metadata.get("immutable") is not False
            or not metadata.get("work_product_id")
        ):
            raise ValueError("The selected file is not a mutable canonical draft for this matter.")
        return draft

    def finalize(self, matter_id: str, draft_path: str) -> dict[str, Any]:
        base = PurePosixPath(self.matters.matter_path(matter_id))
        supplied = PurePosixPath(draft_path)
        if (
            supplied.is_absolute()
            or ".." in supplied.parts
            or supplied.suffix != ".md"
            or base not in supplied.parents
            or not self.vault.exists(draft_path)
            or not self._is_draft_location(matter_id, supplied)
        ):
            raise ValueError("Only a draft from this matter can be finalized.")
        draft = self.vault.read_markdown(draft_path)
        metadata = draft["metadata"]
        is_legacy_draft = supplied.parent == base / "work-product" / "draft"
        if (
            metadata.get("matter_id") != matter_id
            or metadata.get("state") != "draft"
            or (metadata.get("record_type") != "work_product" and not is_legacy_draft)
        ):
            raise ValueError("The selected file is not a draft for this matter.")
        content_hash = hashlib.sha256(draft["content"].encode("utf-8")).hexdigest()
        existing = self._existing_final(base, draft_path, content_hash)
        if existing:
            return existing
        final_id = new_id("FINAL")
        final_folder = self.matter_paths.folder(matter_id, "matter_files.final_outputs_dir")
        final_path = f"{final_folder}/{supplied.stem}-{final_id[-6:]}.md"
        now = iso_now()
        final_metadata = {**metadata, "record_type": "work_product", "state": "final",
                          "immutable": True, "final_id": final_id, "finalized_at": now,
                          "source_draft": draft_path, "source_content_hash": content_hash}
        self.vault.write_markdown(final_path, draft["content"], final_metadata)
        self.matters.append_event(matter_id, "work_product_finalized", {
            "draft_path": draft_path, "final_path": final_path, "title": draft["metadata"].get("title", supplied.stem),
        })
        return {
            "record_type": "work_product",
            "work_product_id": metadata.get("work_product_id", ""),
            "title": metadata.get("title", supplied.stem),
            "vault_path": final_path,
            "state": "final",
            "summary": metadata.get("summary", ""),
            "final_id": final_id,
        }

    def _is_draft_location(self, matter_id: str, supplied: PurePosixPath) -> bool:
        matter_root = PurePosixPath(self.matters.matter_path(matter_id))
        configured = PurePosixPath(
            self.matter_paths.folder(matter_id, "matter_files.draft_outputs_dir")
        )
        legacy = matter_root / "work-product" / "draft"
        return configured in supplied.parents or legacy in supplied.parents

    def _existing_final(
        self, base: PurePosixPath, draft_path: str, content_hash: str
    ) -> dict[str, Any] | None:
        for path in self.vault.iter_files(str(base), {".md"}):
            document = self.vault.read_markdown(self.vault.relative(path))
            metadata = document["metadata"]
            if (
                metadata.get("state") == "final"
                and metadata.get("source_draft") == draft_path
                and metadata.get("source_content_hash") == content_hash
                and metadata.get("final_id")
            ):
                return {
                    "record_type": "work_product",
                    "work_product_id": metadata.get("work_product_id", ""),
                    "title": metadata.get("title", PurePosixPath(draft_path).stem),
                    "vault_path": document["path"], "state": "final",
                    "summary": metadata.get("summary", ""), "final_id": metadata["final_id"],
                }
        return None
