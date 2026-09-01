from __future__ import annotations

import hashlib
from datetime import datetime
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

    def create_draft(
        self,
        matter_id: str,
        *,
        title: str,
        content: str,
        summary: str = "",
        source_action_key: str | None = None,
    ) -> dict[str, Any]:
        source_action_key = str(source_action_key or "") or None
        folder = self.matter_paths.folder(matter_id, "matter_files.draft_outputs_dir")
        if source_action_key:
            existing = self._draft_for_source_action(folder, source_action_key)
            if existing is not None:
                return existing
            digest = hashlib.sha256(
                f"{matter_id}\0{source_action_key}".encode("utf-8")
            ).hexdigest()[:12]
            work_product_id = f"WP-{digest}"
        else:
            work_product_id = new_id("WP")
        filename = f"{slugify(title)}-{work_product_id[-6:]}.md"
        path = f"{folder}/{filename}"
        if self.vault.exists(path):
            raise ValueError("The work-product retry key conflicts with an existing record.")
        now = iso_now()
        lifecycle_updates = self.draft_change_updates(matter_id)
        self.vault.write_markdown(path, content, {
            "work_product_id": work_product_id, "matter_id": matter_id, "title": title,
            "record_type": "work_product", "state": "draft", "summary": summary,
            "created_at": now, "updated_at": now, "immutable": False,
            "source_action_key": source_action_key,
        })
        matter_path = f"{self.matters.matter_path(matter_id)}/matter.md"
        self.vault.update_markdown(
            matter_path,
            metadata_updates={
                **lifecycle_updates,
                "current_work_product_draft_path": path,
                "current_work_product_id": work_product_id,
                "updated_at": now,
            },
        )
        event_path = self.matters.append_event(
            matter_id, "work_product_drafted", {"path": path, "title": title}
        )
        return {
            "record_type": "work_product",
            "work_product_id": work_product_id,
            "title": title,
            "vault_path": path,
            "state": "draft",
            "summary": summary,
            "source_action_key": source_action_key,
            "changed_paths": [path, matter_path, event_path],
        }

    def draft_change_updates(self, matter_id: str) -> dict[str, Any]:
        """Validate a canonical draft change and invalidate stale approval state."""
        matter_path = f"{self.matters.matter_path(matter_id)}/matter.md"
        metadata = self.vault.read_markdown(matter_path)["metadata"]
        if metadata.get("closed_at") or metadata.get("status") == "closed":
            raise ValueError("Reopen the matter before changing its canonical work product.")
        if metadata.get("response_sent_at"):
            raise ValueError("Reopen the delivered response before changing its canonical work product.")
        if not metadata.get("response_approved_at"):
            return {}
        return {
            "response_approved_at": None,
            "response_approved_by": None,
            "response_approved_artifact_path": None,
            "response_approved_artifact_id": None,
            "response_approved_final_id": None,
            "next_action": "Review and finalize the current draft.",
        }

    def _draft_for_source_action(
        self, folder: str, source_action_key: str
    ) -> dict[str, Any] | None:
        for path in self.vault.iter_files(folder, {".md"}):
            document = self.vault.read_markdown(self.vault.relative(path))
            metadata = document["metadata"]
            if metadata.get("source_action_key") != source_action_key:
                continue
            if metadata.get("record_type") != "work_product" or metadata.get("state") != "draft":
                raise ValueError("The work-product retry key belongs to a different record.")
            return {
                "record_type": "work_product",
                "work_product_id": metadata["work_product_id"],
                "title": metadata.get("title", PurePosixPath(document["path"]).stem),
                "vault_path": document["path"],
                "state": "draft",
                "summary": metadata.get("summary", ""),
                "source_action_key": source_action_key,
                "changed_paths": [],
            }
        return None

    def current_draft(
        self, matter_id: str, *, legacy_fallback: bool = True
    ) -> dict[str, Any] | None:
        """Return the current canonical draft, or a read-only legacy root fallback."""
        matter_root = PurePosixPath(self.matters.matter_path(matter_id))
        matter_document = self.vault.read_markdown(f"{matter_root}/matter.md")
        selected_path = str(
            matter_document["metadata"].get("current_work_product_draft_path") or ""
        )
        if selected_path:
            try:
                selected = self.mutable_draft(matter_id, selected_path, require_current=False)
                return {**selected, "read_only": False}
            except ValueError:
                pass

        candidates: list[dict[str, Any]] = []
        for path in self.vault.iter_files(str(matter_root), {".md"}):
            relative = self.vault.relative(path)
            try:
                draft = self.mutable_draft(matter_id, relative, require_current=False)
            except ValueError:
                continue
            candidates.append(draft)
        if candidates:
            selected = max(candidates, key=self._draft_sort_key)
            return {**selected, "read_only": False}

        legacy_path = f"{matter_root}/work-product.md"
        if legacy_fallback and self.vault.exists(legacy_path):
            legacy = self.vault.read_markdown(legacy_path)
            return {**legacy, "read_only": True}
        return None

    @staticmethod
    def _draft_sort_key(draft: dict[str, Any]) -> tuple[float, str, str]:
        metadata = draft.get("metadata", {})
        value = (
            metadata.get("updated_at")
            or metadata.get("created_at")
            or draft.get("updated_at")
            or 0
        )
        if isinstance(value, (int, float)):
            return (float(value), "", str(draft.get("path") or ""))
        text = str(value)
        try:
            timestamp = datetime.fromisoformat(text.replace("Z", "+00:00")).timestamp()
        except (ValueError, OverflowError):
            timestamp = 0.0
        return (timestamp, text, str(draft.get("path") or ""))

    def mutable_draft(
        self, matter_id: str, draft_path: str, *, require_current: bool = True
    ) -> dict[str, Any]:
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
        if require_current:
            matter = self.vault.read_markdown(f"{matter_root}/matter.md")["metadata"]
            current_path = str(matter.get("current_work_product_draft_path") or "")
            if current_path and current_path != draft_path:
                raise ValueError("Only the current canonical draft for this matter can be revised.")
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
        adopted_matter_path: str | None = None
        if is_legacy_draft and metadata.get("record_type") != "work_product":
            matter_path = f"{base}/matter.md"
            matter_metadata = self.vault.read_markdown(matter_path)["metadata"]
            current_path = str(matter_metadata.get("current_work_product_draft_path") or "")
            if current_path and current_path != draft_path:
                raise ValueError("Only the current canonical draft for this matter can be finalized.")
            if not current_path:
                self.vault.update_markdown(
                    matter_path,
                    metadata_updates={
                        "current_work_product_draft_path": draft_path,
                        "current_work_product_id": None,
                        "updated_at": iso_now(),
                    },
                )
                adopted_matter_path = matter_path
        if metadata.get("record_type") == "work_product":
            self.mutable_draft(matter_id, draft_path)
        content_hash = hashlib.sha256(draft["content"].encode("utf-8")).hexdigest()
        existing = self._existing_final(base, draft_path, content_hash)
        if existing:
            return self._advance_after_finalize(
                matter_id,
                {**existing, "changed_paths": [adopted_matter_path] if adopted_matter_path else []},
            )
        lifecycle_updates = self.draft_change_updates(matter_id)
        final_id = new_id("FINAL")
        final_folder = self.matter_paths.folder(matter_id, "matter_files.final_outputs_dir")
        final_path = f"{final_folder}/{supplied.stem}-{final_id[-6:]}.md"
        now = iso_now()
        final_metadata = {**metadata, "record_type": "work_product", "state": "final",
                          "immutable": True, "final_id": final_id, "finalized_at": now,
                          "source_draft": draft_path, "source_content_hash": content_hash}
        self.vault.write_markdown(final_path, draft["content"], final_metadata)
        event_path = self.matters.append_event(matter_id, "work_product_finalized", {
            "draft_path": draft_path, "final_path": final_path, "title": draft["metadata"].get("title", supplied.stem),
        })
        lifecycle_path: str | None = None
        if lifecycle_updates:
            lifecycle_path = f"{base}/matter.md"
            self.vault.update_markdown(
                lifecycle_path,
                metadata_updates={**lifecycle_updates, "updated_at": now},
            )
        return self._advance_after_finalize(matter_id, {
            "record_type": "work_product",
            "work_product_id": metadata.get("work_product_id", ""),
            "title": metadata.get("title", supplied.stem),
            "vault_path": final_path,
            "state": "final",
            "summary": metadata.get("summary", ""),
            "final_id": final_id,
            "changed_paths": [
                path for path in (adopted_matter_path, final_path, event_path, lifecycle_path) if path
            ],
        })

    def _advance_after_finalize(
        self, matter_id: str, result: dict[str, Any]
    ) -> dict[str, Any]:
        matter = self.vault.read_markdown(
            f"{self.matters.matter_path(matter_id)}/matter.md"
        )["metadata"]
        if matter.get("status") != "generate":
            return result
        moved = self.matters.move_stage(
            matter_id,
            "respond",
            reason="Canonical work product finalized",
            actor="system",
        )
        result["changed_paths"] = list(dict.fromkeys([
            *result.get("changed_paths", []),
            *moved.get("changed_paths", []),
        ]))
        return result

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
