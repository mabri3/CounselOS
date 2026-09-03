from __future__ import annotations

import hashlib
from datetime import datetime
from pathlib import PurePosixPath
from typing import Any

from app.services.matters import MatterService
from app.services.matter_paths import MatterPathPolicy
from app.services.recommendations import RecommendationService
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
        recommendation_content: str | None = None,
        recommendation_actor: str = "Themis.ai",
    ) -> dict[str, Any]:
        source_action_key = str(source_action_key or "") or None
        expected_dossier_hash = (
            self.matters._dossiers.content_hash(matter_id)
            if self.matters._dossiers else None
        )
        folder = self.matter_paths.folder(matter_id, "matter_files.draft_outputs_dir")
        if source_action_key:
            existing = self._draft_for_source_action(folder, source_action_key)
            if existing is not None:
                existing["dossier_projection"] = {"state": "not_required"}
                return self._draft_operation_result(matter_id, existing)
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
        # Validate the lifecycle before changing either half of the combined save.
        lifecycle_updates = self.draft_change_updates(matter_id)
        matter_path = f"{self.matters.matter_path(matter_id)}/matter.md"
        recommendation = RecommendationService(self.vault, self.matters)
        recommendation_path = recommendation.get(matter_id)["path"]
        snapshot = self._combined_save_snapshot(
            recommendation_path=recommendation_path,
            matter_path=matter_path,
        )
        event_id = new_id("EVT")
        event_timestamp = iso_now()
        event_path = (
            f"{self.matters.matter_path(matter_id)}/events/"
            f"{event_timestamp[:10]}-{event_id}.md"
        )
        try:
            recommendation_result = None
            if recommendation_content and recommendation_content.strip():
                existing_recommendation = recommendation.get(matter_id)
                if existing_recommendation["current_version_id"]:
                    recommendation_result = recommendation.propose(
                        matter_id, recommendation_content, actor=recommendation_actor,
                        rebuild=False,
                    )
                else:
                    recommendation_result = recommendation.set_working(
                        matter_id,
                        recommendation_content,
                        actor=recommendation_actor,
                        origin="initial_agent",
                        project_dossier=False,
                        rebuild=False,
                    )
            recommendation_state = recommendation.get(matter_id)
            now = iso_now()
            self.vault.write_markdown(path, content, {
                "work_product_id": work_product_id, "matter_id": matter_id, "title": title,
                "record_type": "work_product", "state": "draft", "summary": summary,
                "created_at": now, "updated_at": now, "immutable": False,
                "source_action_key": source_action_key,
                "recommendation_version_id": recommendation_state["current_version_id"],
                "recommendation_snapshot": recommendation_state["content"],
            })
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
                matter_id, "work_product_drafted", {"path": path, "title": title},
                event_id=event_id, timestamp=event_timestamp,
            )
            saved_result = {
                "record_type": "work_product",
                "work_product_id": work_product_id,
                "title": title,
                "vault_path": path,
                "state": "draft",
                "summary": summary,
                "source_action_key": source_action_key,
                "recommendation_version_id": recommendation_state["current_version_id"],
                "recommendation_proposal_id": (
                    recommendation_result.get("proposal", {}).get("version_id")
                    if recommendation_result and recommendation_result.get("proposal") else None
                ),
                "changed_paths": list(dict.fromkeys([
                    *(recommendation_result.get("changed_paths", []) if recommendation_result else []),
                    path, matter_path, event_path,
                ])),
            }
        except Exception:
            self._rollback_combined_save(
                snapshot,
                draft_path=path,
                event_path=event_path,
            )
            raise
        dossier_projection = self._project_dossier_work_state(
            matter_id, expected_hash=expected_dossier_hash,
        )
        dossier_paths = self._projection_changed_paths(dossier_projection)
        saved_result["changed_paths"] = list(dict.fromkeys([
            *saved_result["changed_paths"], *dossier_paths,
        ]))
        saved_result["dossier_projection"] = dossier_projection
        return self._draft_operation_result(matter_id, saved_result)

    def _combined_save_snapshot(
        self, *, recommendation_path: str, matter_path: str, draft_path: str | None = None
    ) -> dict[str, Any]:
        return {
            "recommendation_path": recommendation_path,
            "recommendation_bytes": self.vault.resolve(recommendation_path).read_bytes(),
            "matter_path": matter_path,
            "matter_bytes": self.vault.resolve(matter_path).read_bytes(),
            "draft_path": draft_path,
            "draft_bytes": (
                self.vault.resolve(draft_path).read_bytes() if draft_path else None
            ),
        }

    def _rollback_combined_save(
        self, snapshot: dict[str, Any], *, draft_path: str, event_path: str
    ) -> None:
        # Restore source records byte-for-byte. Remove only files created by this failed operation.
        self.vault.write_bytes(snapshot["recommendation_path"], snapshot["recommendation_bytes"])
        self.vault.write_bytes(snapshot["matter_path"], snapshot["matter_bytes"])
        draft = self.vault.resolve(draft_path)
        if snapshot.get("draft_bytes") is not None:
            self.vault.write_bytes(draft_path, snapshot["draft_bytes"])
        elif draft.exists():
            draft.unlink()
        event = self.vault.resolve(event_path)
        if event.exists():
            event.unlink()
        try:
            self.matters.index.rebuild()
        except Exception:
            # Markdown is authoritative. Do not hide the original combined-save failure.
            pass

    def revise_draft(
        self,
        matter_id: str,
        draft_path: str,
        *,
        title: str,
        content: str,
        source_action_key: str | None = None,
        recommendation_content: str | None = None,
        recommendation_actor: str = "Themis.ai",
        lawyer_author: str | None = None,
        document_reviews: Any,
    ) -> dict[str, Any]:
        """Revise one canonical draft and its optional recommendation atomically."""
        draft = self.mutable_draft(matter_id, draft_path)
        metadata = draft["metadata"]
        if source_action_key and source_action_key in {
            metadata.get("source_action_key"), metadata.get("last_source_action_key"),
        }:
            return self._draft_operation_result(matter_id, {
                "record_type": "work_product",
                "work_product_id": metadata["work_product_id"],
                "title": metadata.get("title", PurePosixPath(draft_path).stem),
                "vault_path": draft_path,
                "state": "draft",
                "summary": metadata.get("summary", ""),
                "source_action_key": source_action_key,
                "changed_paths": [],
            })
        expected_dossier_hash = (
            self.matters._dossiers.content_hash(matter_id)
            if self.matters._dossiers else None
        )
        lifecycle_updates = self.draft_change_updates(matter_id)
        matter_path = f"{self.matters.matter_path(matter_id)}/matter.md"
        recommendation = RecommendationService(self.vault, self.matters)
        recommendation_path = recommendation.get(matter_id)["path"]
        snapshot = self._combined_save_snapshot(
            recommendation_path=recommendation_path,
            matter_path=matter_path,
            draft_path=draft_path,
        )
        event_id = new_id("EVT")
        event_timestamp = iso_now()
        event_path = (
            f"{self.matters.matter_path(matter_id)}/events/"
            f"{event_timestamp[:10]}-{event_id}.md"
        )
        resolved_title = title.strip() or str(
            metadata.get("title") or PurePosixPath(draft_path).stem
        )
        try:
            recommendation_result = None
            if recommendation_content and recommendation_content.strip():
                current_recommendation = recommendation.get(matter_id)
                recommendation_result = (
                    recommendation.propose(
                        matter_id, recommendation_content, actor=recommendation_actor,
                        rebuild=False,
                    )
                    if current_recommendation["current_version_id"]
                    else recommendation.set_working(
                        matter_id, recommendation_content, actor=recommendation_actor,
                        origin="initial_agent",
                        project_dossier=False,
                        rebuild=False,
                    )
                )
            recommendation_state = recommendation.get(matter_id)
            now = iso_now()
            document_reviews.propose_agent_revision(
                draft_path,
                content,
                {
                    "title": resolved_title,
                    "updated_at": now,
                    "last_source_action_key": source_action_key,
                    "recommendation_version_id": recommendation_state["current_version_id"],
                    "recommendation_snapshot": recommendation_state["content"],
                },
                author_name=recommendation_actor,
                lawyer_author=lawyer_author,
            )
            self.vault.update_markdown(
                matter_path,
                metadata_updates={
                    **lifecycle_updates,
                    "current_work_product_draft_path": draft_path,
                    "current_work_product_id": metadata["work_product_id"],
                    "updated_at": now,
                },
            )
            event_path = self.matters.append_event(
                matter_id,
                "work_product_revised",
                {"path": draft_path, "title": resolved_title,
                 "work_product_id": metadata["work_product_id"]},
                event_id=event_id,
                timestamp=event_timestamp,
                rebuild=False,
            )
        except Exception:
            self._rollback_combined_save(
                snapshot, draft_path=draft_path, event_path=event_path
            )
            raise
        changed_paths = list(dict.fromkeys([
            *(recommendation_result.get("changed_paths", []) if recommendation_result else []),
            draft_path, matter_path, event_path,
        ]))
        dossier_projection = self._project_dossier_work_state(
            matter_id, expected_hash=expected_dossier_hash,
        )
        changed_paths.extend(self._projection_changed_paths(dossier_projection))
        return self._draft_operation_result(matter_id, {
            "record_type": "work_product",
            "work_product_id": metadata["work_product_id"],
            "title": resolved_title,
            "vault_path": draft_path,
            "state": "draft",
            "summary": metadata.get("summary", ""),
            "source_action_key": source_action_key,
            "recommendation_version_id": recommendation_state["current_version_id"],
            "recommendation_proposal_id": (
                recommendation_result.get("proposal", {}).get("version_id")
                if recommendation_result and recommendation_result.get("proposal") else None
            ),
            "changed_paths": list(dict.fromkeys(changed_paths)),
            "dossier_projection": dossier_projection,
        })

    def _draft_operation_result(
        self, matter_id: str, result: dict[str, Any]
    ) -> dict[str, Any]:
        detail = self.matters.get(matter_id)
        paths = list(result.get("changed_paths", []))
        return {
            **result,
            "action": result.get("source_action_key") or "save_work_product_draft",
            "source_action_key": result.get("source_action_key"),
            "operation": "save_work_product_draft",
            "status": "changed" if paths else "no_change",
            "summary": result.get("summary") or (
                "Saved the canonical work-product draft." if paths
                else "The canonical work-product draft was already saved."
            ),
            "matter_id": matter_id,
            "entity_refs": [{"type": "work_product", "id": str(result["work_product_id"])}],
            "resulting_matter_state": {
                "stage": detail["status"],
                "next_action": detail["work_state"]["next_action"],
                "work_state": detail["work_state"],
                "consistency_issues": detail.get("consistency_issues", []),
            },
            "available_next_actions": self.matters.available_next_actions(detail),
            "recommendation_review_needed": bool(detail.get("recommendation_review_needed")),
            "required_user_action": None,
            "error": None,
            "recovery": None,
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
                "recommendation_version_id": metadata.get("recommendation_version_id"),
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
        expected_dossier_hash = (
            self.matters._dossiers.content_hash(matter_id)
            if self.matters._dossiers else None
        )
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
                {
                    **existing,
                    "changed_paths": [adopted_matter_path] if adopted_matter_path else [],
                    "_expected_dossier_hash": expected_dossier_hash,
                },
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
            "_expected_dossier_hash": expected_dossier_hash,
        })

    def _advance_after_finalize(
        self, matter_id: str, result: dict[str, Any]
    ) -> dict[str, Any]:
        expected_dossier_hash = result.pop("_expected_dossier_hash", None)
        matter_path = f"{self.matters.matter_path(matter_id)}/matter.md"
        matter = self.vault.read_markdown(matter_path)["metadata"]
        changed_paths = list(result.get("changed_paths", []))
        pointer_changed = (
            matter.get("current_work_product_final_path") != result["vault_path"]
            or matter.get("current_work_product_final_id") != result["final_id"]
        )
        if pointer_changed:
            self.vault.update_markdown(
                matter_path,
                metadata_updates={
                    "current_work_product_final_path": result["vault_path"],
                    "current_work_product_final_id": result["final_id"],
                    "updated_at": iso_now(),
                },
            )
            changed_paths.append(matter_path)
            matter = self.vault.read_markdown(matter_path)["metadata"]

        if matter.get("status") not in {"respond", "closed"}:
            moved = self.matters.move_stage(
                matter_id,
                "respond",
                reason="Canonical work product finalized",
                actor="system",
                rebuild=False,
            )
            changed_paths.extend(moved.get("changed_paths", []))

        detail = self.matters.get(matter_id)
        if changed_paths:
            dossier_projection = self._project_dossier_work_state(
                matter_id, expected_hash=expected_dossier_hash,
            )
            changed_paths.extend(self._projection_changed_paths(dossier_projection))
            result["dossier_projection"] = dossier_projection
        else:
            result["dossier_projection"] = {"state": "not_required"}
        paths = list(dict.fromkeys(path for path in changed_paths if path))
        if paths:
            self.matters.index.rebuild()
        detail = self.matters.get(matter_id)
        return {
            **result,
            "action": "finalize_work_product",
            "operation": "finalize_work_product",
            "status": "changed" if paths else "no_change",
            "summary": (
                "Finalized the canonical work product and reconciled the matter to Respond."
                if paths
                else "The canonical final was already recorded."
            ),
            "matter_id": matter_id,
            "source_action_key": None,
            "entity_refs": [
                {"type": "work_product", "id": str(result.get("work_product_id") or "")},
                {"type": "final", "id": str(result["final_id"])},
            ],
            "changed_paths": paths,
            "resulting_matter_state": {
                "stage": detail["status"],
                "next_action": detail["work_state"]["next_action"],
                "work_state": detail["work_state"],
                "consistency_issues": detail.get("consistency_issues", []),
            },
            "available_next_actions": self.matters.available_next_actions(detail),
            "required_user_action": (
                "Approve the final response with the direct approval control."
                if detail["status"] == "respond" and not detail.get("response_approved_at")
                else None
            ),
            "error": None,
            "recovery": None,
        }

    def _project_dossier_work_state(
        self,
        matter_id: str,
        *,
        expected_hash: str | None,
    ) -> dict[str, Any]:
        dossier = self.matters._dossiers
        if not dossier:
            return {"state": "not_required"}
        try:
            return dossier.project_current_work_state(
                matter_id, expected_hash=expected_hash,
            )
        except Exception as exc:
            # The draft or final is already authoritative. A derived dossier
            # failure must not discard it.
            return {
                "state": "failed",
                "error": f"Dossier projection failed: {type(exc).__name__}",
            }

    @staticmethod
    def _projection_changed_paths(projection: dict[str, Any]) -> list[str]:
        if projection.get("error"):
            return []
        changed = projection.get("path") if projection.get("state") == "applied" else projection.get("revision_path")
        return [str(changed)] if changed else []

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
