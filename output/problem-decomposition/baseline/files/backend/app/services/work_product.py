from __future__ import annotations

import hashlib
import json
from copy import deepcopy
import re
from datetime import datetime
from pathlib import PurePosixPath
from typing import Any

from app.services.matters import MatterService
from app.services.dossier import serialized
from app.services.document_review import DocumentReviewService
from app.models.workspace import TemplateUse
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

    @serialized
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
        output_type: str = "general",
        template_use: Any = None,
        preview: bool = False,
        source_run_id: str | None = None,
        claim_ids: list[str] | None = None,
        draft_context: dict[str, Any] | None = None,
        workspace_action: str | None = None,
        source_document_path: str | None = None,
        source_revision: str | None = None,
        source_review_revision: str | None = None,
    ) -> dict[str, Any]:
        self._check_draft_action(workspace_action)
        template_snapshot = self._template_snapshot(template_use)
        payload_hash = self._payload_hash({"operation": "create", "title": title, "content": content,
            "summary": summary, "recommendation": recommendation_content, "actor": recommendation_actor,
            "output_type": output_type, "template_use": template_snapshot, "preview": preview,
            "source_run_id": source_run_id, "claim_ids": claim_ids, "draft_context": draft_context,
            "source_document_path": source_document_path, "source_revision": source_revision,
            "source_review_revision": source_review_revision})
        source_action_key = str(source_action_key or "") or None
        self._check_action_key(matter_id, source_action_key, payload_hash)
        expected_dossier_hash = (
            self.matters._dossiers.content_hash(matter_id)
            if self.matters._dossiers else None
        )
        folder = self.matter_paths.folder(matter_id, "matter_files.draft_outputs_dir")
        if source_action_key:
            existing = self._draft_for_source_action(self.matters.matter_path(matter_id), source_action_key, payload_hash)
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
        supplied = None
        if source_document_path:
            from app.services.workspace import WorkspaceConflict
            self._attachment_path(matter_id, source_document_path)
            supplied = self.vault.read_document(source_document_path)
            if supplied["kind"] != "markdown" or not source_revision or not source_review_revision:
                raise ValueError("A supplied document needs its saved Markdown text and both revision values.")
            actual = DocumentReviewService.content_revision(supplied["content"])
            if source_revision != actual or source_review_revision != DocumentReviewService(self.vault).revision(source_document_path):
                raise WorkspaceConflict("The supplied document changed. Review its current version before drafting.", actual)
        # Validate the lifecycle before changing either half of the combined save.
        lifecycle_updates = {} if preview else self.draft_change_updates(matter_id)
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
            if not preview and recommendation_content and recommendation_content.strip():
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
            self.vault.write_markdown(path, supplied["content"] if supplied else content, {
                **({"review": deepcopy(supplied["metadata"].get("review", {})),
                    "supplied_original": {"path": source_document_path, "revision": source_revision,
                        "review_revision": source_review_revision, "metadata": deepcopy(supplied["metadata"])}}
                   if supplied else {}),
                "work_product_id": work_product_id, "matter_id": matter_id, "title": title,
                "record_type": "work_product", "state": "draft", "summary": summary,
                "created_at": now, "updated_at": now, "immutable": False,
                "source_action_key": source_action_key, "source_action_payload": payload_hash,
                "output_type": output_type, "template_use": template_snapshot, "preview": preview,
                "source_run_id": source_run_id, "claim_ids": list(claim_ids or (supplied["metadata"].get("claim_ids", []) if supplied else [])),
                "draft_context": deepcopy(draft_context or {}),
                "recommendation_version_id": recommendation_state["current_version_id"],
                "recommendation_snapshot": recommendation_state["content"],
            })
            if supplied and supplied["content"] != content.strip() + "\n":
                DocumentReviewService(self.vault).propose_agent_revision(path, content,
                    author_name=recommendation_actor, reason="Requested revision of the supplied document")
            if not preview:
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
                    path, *([] if preview else [matter_path]), event_path,
                ])),
            }
        except Exception:
            self._rollback_combined_save(
                snapshot,
                draft_path=path,
                event_path=event_path,
            )
            raise
        dossier_projection = ({"state": "not_required"} if preview else self._project_dossier_work_state(
            matter_id, expected_hash=expected_dossier_hash,
        ))
        dossier_paths = self._projection_changed_paths(dossier_projection)
        saved_result["changed_paths"] = list(dict.fromkeys([
            *saved_result["changed_paths"], *dossier_paths,
        ]))
        saved_result["dossier_projection"] = dossier_projection
        return self._draft_operation_result(matter_id, saved_result)

    @serialized
    def prepare_outside_counsel_packet(self, matter_id: str, *, title: str, brief_content: str,
                                       cover_email_content: str, attachments: list[Any], source_action_key: str,
                                       template_use: Any = None, draft_context: dict[str, Any] | None = None) -> dict[str, Any]:
        """Persist assistant-authored cover and brief, plus the explicit outgoing selection.

        Each part has a stable action key. A retry after a partial write resumes those parts.
        Internal context is never promoted into outgoing attachments.
        """
        manifest = []
        for value in attachments:
            item = value.model_dump(mode="json") if hasattr(value, "model_dump") else deepcopy(value)
            self._attachment_path(matter_id, item["path"])
            if not all(item.get(key) for key in ("title", "revision", "relevance")):
                raise ValueError("Every outgoing attachment needs its title, saved version and relevance.")
            item.update({"selected": bool(item.get("selected")), "export_state": "not_exported"})
            manifest.append(item)
        context = {**deepcopy(draft_context or {}), "outgoing_attachments": manifest}
        brief = self.create_draft(matter_id, title=title, content=brief_content,
            output_type="outside-counsel-brief", source_action_key=source_action_key + ":brief",
            template_use=template_use, draft_context=context, source_run_id=context.get("source_run_id"))
        cover = self.create_draft(matter_id, title=title + " — cover email", content=cover_email_content,
            output_type="short-business-email", source_action_key=source_action_key + ":cover",
            draft_context=context, source_run_id=context.get("source_run_id"))
        packet = {"brief": brief["artifact"], "cover_email": cover["artifact"], "attachments": manifest}
        doc = self.vault.read_markdown(brief["vault_path"])
        # Preserve an existing review/export manifest when a completed creation request is replayed.
        if not doc["metadata"].get("outside_counsel_packet"):
            self.vault.update_markdown(brief["vault_path"], metadata_updates={"outside_counsel_packet": packet})
        return self.vault.read_markdown(brief["vault_path"])["metadata"]["outside_counsel_packet"]

    def _attachment_path(self, matter_id: str, path: str, *, must_exist: bool = True) -> None:
        root = self.vault.resolve(self.matters.matter_path(matter_id))
        resolved = self.vault.resolve(path)
        if root not in resolved.parents or (must_exist and not resolved.is_file()):
            raise ValueError("Select an existing attachment from this matter.")

    @serialized
    def export_outside_counsel_packet(self, matter_id: str, brief_path: str, *,
                                     reviewed_brief_revision: str, reviewed_cover_revision: str,
                                     attachments: list[Any], output_format: str, mode: str,
                                     document_exports: Any) -> dict[str, Any]:
        """Export individually reviewed parts and report partial failure without changing draft text."""
        doc = self.mutable_draft(matter_id, brief_path, require_current=False)
        packet = deepcopy(doc["metadata"].get("outside_counsel_packet"))
        if not packet:
            raise ValueError("This draft has no outside-counsel packet.")
        cover_path = packet["cover_email"]["path"]
        self.mutable_draft(matter_id, cover_path, require_current=False)
        review = DocumentReviewService(self.vault)
        # Both visible document reviews, including unresolved changes, must match the selected saved files.
        review.validate_revision(brief_path, expected_review_revision=reviewed_brief_revision)
        review.validate_revision(cover_path, expected_review_revision=reviewed_cover_revision)
        selected = []
        for value in attachments:
            item = value.model_dump(mode="json") if hasattr(value, "model_dump") else deepcopy(value)
            self._attachment_path(matter_id, item["path"], must_exist=False)
            if item.get("selected") and (not item.get("revision") or item.get("reviewed_revision") != item.get("revision")):
                raise ValueError("Review each selected attachment version before exporting.")
            selected.append(item)
        results = []
        for path, revision in ((brief_path, reviewed_brief_revision), (cover_path, reviewed_cover_revision)):
            try:
                output, media_type = document_exports.export(path, output_format, mode=mode,
                    expected_review_revision=revision)
                results.append({"path": path, "output_path": output, "media_type": media_type, "export_state": "exported"})
            except Exception as exc:
                results.append({"path": path, "export_state": "failed", "failure_detail": str(exc)})
        for item in selected:
            item.update({"export_state": "not_exported", "failure_detail": None})
            if item.get("selected"):
                try:
                    output, media_type = document_exports.export_original(item["path"], expected_revision=item["revision"])
                    item.update({"output_path": output, "media_type": media_type, "export_state": "exported"})
                except Exception as exc:
                    item.update({"export_state": "failed", "failure_detail": str(exc)})
        packet.update({"brief": self.reference(matter_id, brief_path), "cover_email": self.reference(matter_id, cover_path),
            "attachments": selected, "export_results": results,
            "reviewed_brief_revision": reviewed_brief_revision, "reviewed_cover_revision": reviewed_cover_revision})
        # This records files prepared for download. It does not record delivery, approval or a decision.
        self.vault.update_markdown(brief_path, metadata_updates={"outside_counsel_packet": packet})
        return packet

    @staticmethod
    def _check_draft_action(action: str | None) -> None:
        if action in {"reassess_changed_facts", "reassess", "scenario"}:
            raise ValueError("This analysis run can offer a draft update but cannot change documents.")

    def _check_action_key(self, matter_id: str, key: str | None, payload_hash: str) -> None:
        if not key:
            return
        from app.services.workspace import WorkspaceConflict
        for path in self.vault.iter_files(self.matters.matter_path(matter_id), {".md"}):
            metadata = self.vault.read_markdown(self.vault.relative(path))["metadata"]
            if metadata.get("record_type") not in {"work_product", "work_product_proposal"}:
                continue
            previous = metadata.get("draft_action_receipts", {}).get(key)
            if metadata.get("source_action_key") == key:
                previous = metadata.get("source_action_payload") or "legacy-request"
            if previous and previous != payload_hash:
                raise WorkspaceConflict("This action key was already used for a different draft request or different draft text.",
                                        "", code="action_key_conflict")

    @staticmethod
    def _payload_hash(payload: dict[str, Any]) -> str:
        return hashlib.sha256(json.dumps(payload, sort_keys=True, default=str).encode("utf-8")).hexdigest()

    @staticmethod
    def _template_snapshot(value: Any) -> dict[str, Any] | None:
        if value is None:
            return None
        raw = value.model_dump(mode="json") if hasattr(value, "model_dump") else deepcopy(value)
        try:
            return TemplateUse.model_validate(raw).model_dump(mode="json")
        except (ValueError, TypeError):
            # Optional template failure must never discard an otherwise useful assistant draft.
            return {"template_id": str(raw.get("template_id", "")) if isinstance(raw, dict) else "",
                "output_type": str(raw.get("output_type", "general")) if isinstance(raw, dict) else "general",
                "revision": "", "content_hash": "", "instructions_snapshot": "",
                "state": "failed", "failure_detail": "The submitted template snapshot was malformed.",
                "submitted_snapshot": raw}

    def list_drafts(self, matter_id: str) -> list[dict[str, Any]]:
        result = []
        for path in self.vault.iter_files(self.matters.matter_path(matter_id), {".md"}):
            relative = self.vault.relative(path)
            if ".history" in PurePosixPath(relative).parts or ".proposals" in PurePosixPath(relative).parts:
                continue
            try:
                result.append(self.reference(matter_id, relative))
            except ValueError:
                continue
        return sorted(result, key=lambda item: (item["title"], item["path"]))

    def get_outside_counsel_packet(self, matter_id: str, brief_path: str) -> dict[str, Any]:
        doc = self.mutable_draft(matter_id, brief_path, require_current=False)
        packet = deepcopy(doc["metadata"].get("outside_counsel_packet"))
        if not packet:
            raise ValueError("This draft has no outside-counsel packet.")
        packet["brief"] = self.reference(matter_id, brief_path)
        packet["cover_email"] = self.reference(matter_id, packet["cover_email"]["path"])
        return packet

    def reference(self, matter_id: str, path: str) -> dict[str, Any]:
        draft = self.mutable_draft(matter_id, path, require_current=False)
        metadata = draft["metadata"]
        review = metadata.get("review", {})
        from app.services.workspace import WorkspaceService
        current = WorkspaceService(self.vault, self.matters).decision_revisions(matter_id)
        captured = (metadata.get("draft_context") or {}).get("source_revisions", {})
        decision_review = any("/decisions/" in key and captured.get(key) != value for key, value in current.items())
        return {"work_product_id": metadata["work_product_id"], "path": path,
            "decision_review_required": decision_review,
            "title": metadata.get("title", PurePosixPath(path).stem),
            "output_type": metadata.get("output_type", "general"),
            "revision": DocumentReviewService.content_revision(draft["content"]),
            "review_revision": DocumentReviewService(self.vault).revision(path),
            "pending_review": any(item.get("kind") in {"insert", "delete"} for item in review.get("segments", [])),
            "source_run_id": metadata.get("source_run_id"), "claim_ids": metadata.get("claim_ids", []),
            "template_use": metadata.get("template_use"), "preview": metadata.get("preview", False),
            "version_changes": metadata.get("version_changes", []),
            "proposal_paths": [self.vault.relative(item) for item in self.vault.iter_files(
                f"{PurePosixPath(path).parent}/.proposals/{PurePosixPath(path).stem}", {".md"})]}

    @serialized
    def keep_preview(self, matter_id: str, path: str, *, expected_revision: str) -> dict[str, Any]:
        draft = self.mutable_draft(matter_id, path, require_current=False)
        DocumentReviewService(self.vault).validate_revision(path, expected_revision)
        if draft["metadata"].get("preview"):
            matter_path = f"{self.matters.matter_path(matter_id)}/matter.md"
            before_draft = self.vault.resolve(path).read_bytes()
            before_matter = self.vault.resolve(matter_path).read_bytes()
            try:
                self.vault.update_markdown(path, metadata_updates={"preview": False})
                self.vault.update_markdown(matter_path, metadata_updates={
                    "current_work_product_draft_path": path, "current_work_product_id": draft["metadata"]["work_product_id"]})
            except Exception:
                self.vault.write_bytes(path, before_draft)
                self.vault.write_bytes(matter_path, before_matter)
                raise
        return self.reference(matter_id, path)

    def _preserve_proposal(self, path: str, content: str, payload_hash: str,
                           source_action_key: str | None, reason: str, base_revision: str | None,
                           local_draft_snapshot: str | None) -> str:
        saved = f"{PurePosixPath(path).parent}/.proposals/{PurePosixPath(path).stem}/{payload_hash}.md"
        if not self.vault.exists(saved):
            self.vault.write_markdown(saved, content, {"record_type": "work_product_proposal", "source_path": path,
                "source_action_key": source_action_key, "source_action_payload": payload_hash, "base_revision": base_revision, "reason": reason,
                "state": "stale", "local_draft_snapshot": local_draft_snapshot, "immutable": True})
        return saved

    def _validate_offer(self, matter_id: str, path: str, offer_id: str | None, revision: str | None) -> None:
        if not offer_id:
            return
        from app.services.workspace import WorkspaceConflict
        workspace_path = f"{self.matters.matter_path(matter_id)}/workspace.md"
        offers = self.vault.read_markdown(workspace_path)["metadata"].get("update_offers", [])
        offer = next((item for item in offers if item.get("offer_id") == offer_id), None)
        if not offer or offer.get("artifact_path") != path or offer.get("base_revision") != revision or offer.get("state") != "offered":
            raise WorkspaceConflict("This draft update offer is no longer current.", revision or "")

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
        if snapshot.get("workspace_path"):
            self.vault.write_bytes(snapshot["workspace_path"], snapshot["workspace_bytes"])
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

    @serialized
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
        expected_revision: str | None = None,
        expected_review_revision: str | None = None,
        target: Any = None,
        selected_range: Any = None,
        local_draft_snapshot: str | None = None,
        reason: str = "Requested draft update",
        version_change: dict[str, Any] | None = None,
        update_offer_id: str | None = None,
        workspace_action: str | None = None,
    ) -> dict[str, Any]:
        """Propose against the submitted artifact; never redirect to the latest draft."""
        self._check_draft_action(workspace_action)
        from app.services.workspace import WorkspaceConflict, WorkspaceService
        frozen_target = target.model_dump() if hasattr(target, "model_dump") else target
        if frozen_target is not None:
            if frozen_target.get("artifact_path") != draft_path or frozen_target.get("matter_id") != matter_id:
                raise ValueError("The submitted target does not match this draft and matter.")
            expected_revision = expected_revision or frozen_target.get("artifact_revision")
            expected_review_revision = expected_review_revision or frozen_target.get("artifact_review_revision")
            selected_range = selected_range or frozen_target.get("selected_range")
            local_draft_snapshot = frozen_target.get("local_draft_snapshot", local_draft_snapshot)
        draft = self.mutable_draft(matter_id, draft_path, require_current=expected_revision is None)
        metadata = draft["metadata"]
        preview = bool(metadata.get("preview"))
        if (source_action_key and source_action_key == metadata.get("source_action_key")
                and frozen_target is None and expected_revision is None and expected_review_revision is None
                and selected_range is None and local_draft_snapshot is None and update_offer_id is None):
            # Legacy save_work_product selects the new current draft on a reconnect. Replay its
            # original creation request, with the same strict payload check, instead of revising it.
            original = metadata.get("supplied_original", {})
            return self.create_draft(matter_id, title=title, content=content,
                summary=metadata.get("summary", ""), source_action_key=source_action_key,
                recommendation_content=recommendation_content, recommendation_actor=recommendation_actor,
                output_type=metadata.get("output_type", "general"), template_use=metadata.get("template_use"),
                preview=metadata.get("preview", False), source_run_id=metadata.get("source_run_id"),
                claim_ids=metadata.get("claim_ids") or None, draft_context=metadata.get("draft_context") or None,
                source_document_path=original.get("path"), source_revision=original.get("revision"),
                source_review_revision=original.get("review_revision"))
        payload_hash = self._payload_hash({"operation": "revise", "path": draft_path, "title": title,
            "content": content, "recommendation": recommendation_content, "actor": recommendation_actor,
            "expected_revision": expected_revision, "expected_review_revision": expected_review_revision,
            "target": frozen_target, "selected_range": selected_range, "local_draft_snapshot": local_draft_snapshot,
            "reason": reason, "version_change": version_change, "update_offer_id": update_offer_id})
        self._check_action_key(matter_id, source_action_key, payload_hash)
        receipts = dict(metadata.get("draft_action_receipts") or {})
        prior_payload = receipts.get(source_action_key) if source_action_key else None
        if source_action_key == metadata.get("source_action_key") and source_action_key:
            raise WorkspaceConflict("This action key was used to create the draft.", "", code="action_key_conflict")
        if prior_payload and prior_payload != payload_hash:
            raise WorkspaceConflict("This action key was already used for different draft text.", "", code="action_key_conflict")
        if prior_payload:
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
        try:
            if frozen_target is not None and not expected_review_revision:
                raise ValueError("An artifact edit needs its saved review revision.")
            if frozen_target is not None:
                WorkspaceService(self.vault, self.matters).validate_target(matter_id, frozen_target, mutation=True)
            document_reviews.validate_revision(draft_path, expected_revision, expected_review_revision, selected_range)
            if local_draft_snapshot is not None and local_draft_snapshot != draft["content"]:
                raise WorkspaceConflict("Local unsaved text is retained. Save or review it before applying this proposal.",
                                        DocumentReviewService.content_revision(draft["content"]))
            if selected_range is not None:
                selection = selected_range.model_dump() if hasattr(selected_range, "model_dump") else selected_range
                start, end = selection["start"], selection["end"]
                # For range requests the generated output is the replacement range, not a new whole document.
                content = draft["content"][:start] + content + draft["content"][end:]
            self._validate_offer(matter_id, draft_path, update_offer_id, expected_revision)
        except WorkspaceConflict as exc:
            if content.strip():
                try:
                    proposal_path = self._preserve_proposal(draft_path, content, payload_hash, source_action_key,
                        reason, expected_revision, local_draft_snapshot)
                    exc.detail["proposal_path"] = proposal_path
                except OSError as save_error:
                    exc.detail.update({"proposal_content": content, "preservation_failure": str(save_error)})
            raise
        if source_action_key:
            receipts[source_action_key] = payload_hash
        expected_dossier_hash = (
            self.matters._dossiers.content_hash(matter_id)
            if self.matters._dossiers else None
        )
        lifecycle_updates = {} if preview else self.draft_change_updates(matter_id)
        matter_path = f"{self.matters.matter_path(matter_id)}/matter.md"
        recommendation = RecommendationService(self.vault, self.matters)
        recommendation_path = recommendation.get(matter_id)["path"]
        snapshot = self._combined_save_snapshot(
            recommendation_path=recommendation_path,
            matter_path=matter_path,
            draft_path=draft_path,
        )
        workspace_path = f"{self.matters.matter_path(matter_id)}/workspace.md"
        if update_offer_id:
            snapshot["workspace_path"] = workspace_path
            snapshot["workspace_bytes"] = self.vault.resolve(workspace_path).read_bytes()
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
            if not preview and recommendation_content and recommendation_content.strip():
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
                    "draft_action_receipts": receipts,
                    "last_version_change": deepcopy(version_change or {"reason": reason}),
                    "recommendation_version_id": recommendation_state["current_version_id"],
                    "recommendation_snapshot": recommendation_state["content"],
                },
                author_name=recommendation_actor,
                lawyer_author=lawyer_author,
                expected_revision=expected_revision,
                expected_review_revision=expected_review_revision,
                reason=reason,
            )
            if not preview:
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
            if update_offer_id:
                workspace = self.vault.read_markdown(workspace_path)
                for offer in workspace["metadata"].get("update_offers", []):
                    if offer.get("offer_id") == update_offer_id:
                        offer["state"] = "accepted"
                        offer["change"] = {**(version_change or {}), "reason": reason,
                            "before_revision": expected_revision,
                            "after_revision": DocumentReviewService.content_revision(self.vault.read_document(draft_path)["content"])}
                self.vault.write_markdown(workspace_path, workspace["content"], workspace["metadata"])
        except Exception:
            self._rollback_combined_save(
                snapshot, draft_path=draft_path, event_path=event_path
            )
            raise
        changed_paths = list(dict.fromkeys([
            *(recommendation_result.get("changed_paths", []) if recommendation_result else []),
            draft_path, *([] if preview else [matter_path]), event_path,
        ]))
        dossier_projection = ({"state": "not_required"} if preview else self._project_dossier_work_state(
            matter_id, expected_hash=expected_dossier_hash,
        ))
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
        path = result.get("vault_path")
        if path and self.vault.exists(path):
            result["artifact"] = self.reference(matter_id, path)
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
        self, folder: str, source_action_key: str, payload_hash: str
    ) -> dict[str, Any] | None:
        for path in self.vault.iter_files(folder, {".md"}):
            document = self.vault.read_markdown(self.vault.relative(path))
            metadata = document["metadata"]
            if metadata.get("source_action_key") != source_action_key:
                continue
            if metadata.get("record_type") != "work_product" or metadata.get("state") != "draft":
                continue
            if metadata.get("source_action_payload") != payload_hash:
                from app.services.workspace import WorkspaceConflict
                raise WorkspaceConflict("This action key was already used for a different draft request.", "", code="action_key_conflict")
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
                if not selected["metadata"].get("preview"):
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
            if not draft["metadata"].get("preview"):
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

    @serialized
    def finalize(self, matter_id: str, draft_path: str, *, action_actor: dict | None = None) -> dict[str, Any]:
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
        self._validate_leading_lifecycle_status(draft["content"])
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
        if action_actor:
            final_metadata.update({"finalized_by": action_actor["display_name"], "finalized_actor": action_actor})
        self.vault.write_markdown(final_path, draft["content"], final_metadata)
        event_path = self.matters.append_event(matter_id, "work_product_finalized", {
            **({"actor": action_actor["display_name"], "action_actor": action_actor} if action_actor else {}),
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

    @staticmethod
    def _validate_leading_lifecycle_status(content: str) -> None:
        leading = "\n".join(content.splitlines()[:40])
        match = re.search(
            r"^\s*(?:\*\*)?Status(?:\*\*)?\s*:\s*(?P<value>.+?)\s*$",
            leading,
            flags=re.IGNORECASE | re.MULTILINE,
        )
        if match and re.search(
            r"\bdraft\b|\bnot\s+(?:final|approved)\b",
            match.group("value"),
            flags=re.IGNORECASE,
        ):
            raise ValueError("Update the draft status before finalizing. The draft is still editable.")

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
