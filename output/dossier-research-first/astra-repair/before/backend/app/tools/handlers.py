from __future__ import annotations

import json
import re
import unicodedata
from datetime import UTC, datetime
from pathlib import Path, PurePosixPath
from typing import Any

from app.models.api import AgentCreate, DecisionCreate, IntakeTurn, ScheduleCreate, WorkItemCreate
from app.models.awareness import (
    BriefingBehavior,
    InternalScope,
    PublicWatchQuery,
    ReviewBehavior,
    ScheduleRecurrence,
    Watch,
    WatchDraftCreate,
    WatchPatch,
    WatchSource,
)
from app.tools.registry import Handler, ToolExecutionContext
from app.utils.time import iso_now
from app.services.recommendations import RecommendationService


def build_handlers() -> dict[str, Handler]:
    from app.tools.research_investigation import collect_research_evidence, read_research_source, search_research_sources
    return {
        "select_conversation_scope": select_conversation_scope,
        "workspace_action": workspace_action,
        "manage_output_template": manage_output_template,
        "change_business_question": change_business_question,
        "propose_business_question": propose_business_question,
        "act_on_question_proposal": act_on_question_proposal,
        "restore_business_question": restore_business_question,
        "answer_workspace_question": answer_workspace_question,
        "read_file": read_file,
        "list_files": list_files,
        "search_vault": search_vault,
        "write_markdown": write_markdown,
        "save_work_product": save_work_product,
        "complete_work_item": complete_work_item,
        "approve_response": approve_response,
        "mark_response_sent": mark_response_sent,
        "close_matter": close_matter,
        "move_matter_stage": move_matter_stage,
        "create_work_item": create_work_item,
        "run_research": run_research,
        "collect_research_evidence": collect_research_evidence,
        "read_research_source": read_research_source,
        "search_research_sources": search_research_sources,
        "stop_research": stop_research,
        "record_decision": record_decision,
        "audit_decisions": audit_decisions,
        "create_agent": create_agent,
        "create_schedule": create_schedule,
        "create_watch_draft": create_watch_draft,
        "scan_watch": scan_watch,
        "activate_watch": activate_watch,
        "append_memory": append_memory,
        "update_matter_intake": update_matter_intake,
    }


async def _rebuild_index(context: ToolExecutionContext) -> None:
    """Use the required non-blocking index rebuild contract."""
    await context.app.index.rebuild_async()


def _observe_problem_inputs(context, groups):
    """Return the exact permitted records added to this run's input basis."""
    capture = context.frozen_context["problem_analysis_capture"]
    observed = context.app.problem_analysis.capture(context.matter_id, frozen_context=context.frozen_context)
    for group in groups:
        capture["inputs"][group] = observed["inputs"][group]
        capture["input_basis"]["hashes"][group] = observed["input_basis"]["hashes"][group]
    capture["references"].update(observed["references"])
    return {group: observed["inputs"][group] for group in groups}


async def update_matter_intake(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    if not context.matter_id:
        raise ValueError("An active matter is required.")
    turn = IntakeTurn.model_validate({
        **_normalize_nested_intake_questions(arguments),
        "source_action_key": context.source_action_key,
    })
    if turn.intake_state == "active" and not turn.next_questions:
        raise ValueError(
            "Active intake must include at least one structured next_questions item. "
            "If there are no more questions, set intake_state to complete. "
            "Do not ask a follow-up question only in prose."
        )
    before_revisions = context.app.workspace.source_revisions(context.matter_id)
    problem_capture = context.frozen_context.get("problem_analysis_capture")
    problem_was_current = bool(problem_capture and context.app.problem_analysis._fresh(context.matter_id, problem_capture["input_basis"]))
    result = context.app.matter_records.apply_intake_turn(
        context.matter_id,
        turn,
        source_id=context.trusted_source_id,
        expected_dossier_hash=context.expected_dossier_hash,
    )
    payload = result.model_dump(mode="json") if hasattr(result, "model_dump") else dict(result)
    question_scope = context.app.workspace.business_question(context.matter_id)
    try:
        if question_scope["revision"] == context.expected_question_revision:
            existing = {item["question_id"]: item for item in context.app.workspace.questions(context.matter_id)}
            for card in payload.get("questions", []):
                if card["question_id"] not in existing:
                    context.app.workspace.save_question(context.matter_id, {
                        "question_id": card["question_id"], "text": card["text"],
                        "consequence": card.get("reason") or "This answer can change the conditional analysis.",
                        "business_question_id": question_scope["question_id"],
                        "business_question_revision": question_scope["revision"],
                        "source_message_id": context.trusted_message_id, "source_action_key": context.source_action_key,
                        "choices": card.get("choices", []), "record_target": card.get("record_target", "fact"),
                    })
    except (OSError, ValueError):
        payload["workspace_warning"] = "Intake work is saved. Its supporting question could not be saved to Understand."
    # Intake's own recorded facts can support its answer. A concurrent change
    # before this tool call must still make publication historical.
    baseline = context.frozen_context.get("intake_publication_baseline") or context.frozen_context.get("publication_baseline")
    if baseline == before_revisions:
        context.frozen_context["intake_publication_baseline"] = context.app.workspace.source_revisions(context.matter_id)
    if problem_was_current and baseline == before_revisions:
        # Only this tool's actual returned observations amend the original basis.
        # Preserve the original time, prior pointer and immutable context identity.
        payload["observed_problem_inputs"] = _observe_problem_inputs(context, ("facts", "assumptions", "issues", "questions", "business_question"))
    return {
        "summary": "Updated the matter intake record.",
        "changed_paths": payload.get("changed_paths", []),
        "refresh": ["matter", "tree"],
        "data": payload,
    }


def _normalize_nested_intake_questions(arguments: dict[str, Any]) -> dict[str, Any]:
    """Decode only the two provider fields that may contain one JSON object."""
    normalized = dict(arguments)

    def decode(value: Any) -> Any:
        if not isinstance(value, str):
            return value
        decoded = json.loads(value)
        if not isinstance(decoded, dict):
            raise ValueError("An encoded intake question must contain one JSON object.")
        return decoded

    if "next_question" in normalized:
        normalized["next_question"] = decode(normalized["next_question"])
    if isinstance(normalized.get("next_questions"), list):
        normalized["next_questions"] = [decode(item) for item in normalized["next_questions"]]
    return normalized


async def read_file(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    path = str(arguments.get("path") or context.active_file or "")
    if not path:
        raise ValueError("A file path is required.")
    if _needs_other_matter_choice(context, path):
        return await run_research(context, {"question": context.trusted_user_message or "Review relevant material from other matters."})
    if _excluded_tool_path(context, path):
        raise ValueError("This file was excluded from the submitted inquiry.")
    document = context.app.vault.read_document(path)
    if context.frozen_context.get("withhold_unattributed_history") and context.matter_id and context.app.vault.relative(context.app.vault.resolve(path)) in {f"{context.app.matters.matter_path(context.matter_id)}/{name}" for name in ("facts.md", "dossier.md", "issues.md", "matter.md")}:
        document = {**document, "content": context.frozen_context.get("context", ""), "metadata": {"context_filtered": True}}
    # Conversation metadata contains nested runs and traces, not just source text.
    # Never feed that recursive execution history back into the model.
    if len(json.dumps(document, default=str)) > 60000:
        content = str(document.get("content") or "")
        # Investigation capture saves this full, already scope-filtered text,
        # then returns a bounded passage. Do not snapshot a clipped tool view.
        clipped = len(content) > 40000 and context.investigation is None
        document = {**document, "metadata": {
            key: value for key, value in document.get("metadata", {}).items()
            if isinstance(value, (str, int, float, bool)) and len(str(value)) < 1000
        }, "content": content if not clipped else content[:20000] + "\n\n[Middle omitted from this tool view. Full file remains saved.]\n\n" + content[-20000:],
            "tool_view_notice": "Large file: nested metadata omitted; content may show only the beginning and end. Do not claim to have reviewed omitted text."}
    return {"summary": f"Read {path}.", "data": document}


async def list_files(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    path = str(arguments.get("path") or "")
    if not path and context.matter_id:
        path = context.app.matters.matter_path(context.matter_id)
    if _needs_other_matter_choice(context, path):
        return await run_research(context, {"question": context.trusted_user_message or "Find relevant material in other matters."})
    tree = context.app.vault.list_tree(path)
    return {"summary": f"Listed files under {path or 'the vault'}.", "data": {"tree": tree}}


async def search_vault(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    query = str(arguments.get("query") or "").strip()
    if not query:
        raise ValueError("A search query is required.")
    path = arguments.get("path")
    if not path and context.matter_id:
        path = context.app.matters.matter_path(context.matter_id)
    if _needs_other_matter_choice(context, str(path or "")):
        return await run_research(context, {"question": query})
    results = context.app.search.search_internal(
        query, matter_path=str(path or "") or None, limit=10
    )
    results = [item for item in results if not _excluded_tool_path(context, str(item.get("path") or ""))]
    return {"summary": f"Found {len(results)} internal result(s).", "data": {"results": results}}


def _needs_other_matter_choice(context: ToolExecutionContext, path: str) -> bool:
    if not context.matter_id:
        return False
    canonical = context.app.vault.relative(context.app.vault.resolve(path))
    current = context.app.matters.matter_path(context.matter_id)
    if canonical == current or canonical.startswith(current + "/"):
        return False
    if canonical.startswith("99_Trash"):
        raise ValueError("Trashed matters are not research sources.")
    if canonical not in {".", "", "03_Matters"} and not canonical.startswith("03_Matters/"):
        return False
    allowed = (context.frozen_context.get("research_scope") or {}).get("other_matters") is True
    if allowed:
        roots = [item["path"] for item in context.app.index.list_matters()]
        if any(canonical == root or canonical.startswith(root + "/") for root in roots):
            return False
    return True


async def write_markdown(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    raw_path = str(arguments.get("path") or "").strip()
    if not raw_path:
        raise ValueError("A note path is required. Use save_work_product for recommendations, drafts, or responses.")
    if not context.matter_id:
        raise ValueError("An active matter is required.")
    _validate_generic_write_path(context, raw_path)
    existing = context.app.vault.exists(raw_path)
    if existing:
        current = context.app.vault.read_document(raw_path)
        if current.get("metadata", {}).get("immutable"):
            raise ValueError("The original request is immutable. Create a new version or event instead.")
        if not _is_reviewable_work_product(raw_path, current):
            return _confirmation_result(
                context,
                operation="overwrite_markdown",
                summary=f"Review the proposed replacement of {raw_path}.",
                required_user_action="Confirm replacement with a direct workspace control.",
                proposal={"path": raw_path, "content": str(arguments.get("content") or "")},
            )
    content = str(arguments.get("content") or "")
    metadata = arguments.get("metadata") or {}
    if existing and raw_path.lower().endswith(".md") and _is_reviewable_work_product(raw_path, current):
        if not context.target or context.target.artifact_path != raw_path or not context.target.artifact_review_revision:
            raise ValueError("Select this document before proposing a revision.")
        if context.target.local_draft_snapshot is not None and context.target.local_draft_snapshot != current["content"]:
            return _confirmation_result(context, operation="revise_document", summary="Local edits retained. Proposed wording is available separately.", required_user_action="Review the proposed wording with your local edits.", proposal={"path": raw_path, "content": content})
        path = context.app.document_reviews.propose_agent_revision(
            raw_path,
            content,
            metadata,
            author_name=context.review_author or "Themis.ai",
            lawyer_author=context.lawyer_author,
            expected_revision=context.target.artifact_revision, expected_review_revision=context.target.artifact_review_revision,
            selected_range=context.target.selected_range,
        )
    else:
        path = context.app.vault.write_markdown(raw_path, content, metadata)
    await _rebuild_index(context)
    return {
        "summary": f"Wrote {path}.",
        "changed_paths": [path],
        "refresh": ["tree", "matter"],
        "data": {"path": path},
    }


def _validate_generic_write_path(context: ToolExecutionContext, raw_path: str) -> None:
    if "\\" in raw_path:
        raise ValueError("The note path must use forward slashes.")
    base = PurePosixPath(context.app.matters.matter_path(context.matter_id))
    supplied = PurePosixPath(raw_path)
    if (
        supplied.is_absolute()
        or ".." in supplied.parts
        or supplied.suffix.lower() != ".md"
        or base not in supplied.parents
    ):
        raise ValueError("The note path must be a Markdown file inside the active matter.")
    # Resolve symlinks before checking canonical storage boundaries.
    resolved_base = context.app.vault.resolve(str(base))
    try:
        relative = context.app.vault.resolve(raw_path).relative_to(resolved_base).as_posix().casefold()
    except ValueError as exc:
        raise ValueError("The note must stay inside the active matter.") from exc
    protected_files = {"matter.md", "request.md", "facts.md", "issues.md", "participants.md", "recommendations.md", "dossier.md", "workspace.md", "flow.md"}
    protected_roots = {
        "research", "decisions", "work-items", "events", "conversations", "documents/batches",
        "work-product/draft", "work-product/final", "dossier-revisions", "scenarios",
        "workspace-revisions", "flow-revisions",
    }
    configured = {
        Path(context.app.matter_paths.folder(context.matter_id, key)).relative_to(base).as_posix()
        for key in ("matter_files.draft_outputs_dir", "matter_files.final_outputs_dir")
    }
    if (
        relative.casefold() == "work-product.md"
        or relative in protected_files
        or any(relative == root or relative.startswith(f"{root.casefold()}/") for root in protected_roots | configured)
    ):
        raise ValueError("Use a typed tool for protected matter records and work products.")


async def save_work_product(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    matter_id = str(arguments.get("matter_id") or context.matter_id or "")
    if not matter_id:
        raise ValueError("An active matter is required.")
    continuity = context.frozen_context.get("continuity") or {}
    if continuity.get("draft_update"):
        if arguments.get("kind") != "draft" or arguments.get("operation") != "revise" or not context.target or arguments.get("existing_draft_path") != context.target.artifact_path:
            raise ValueError("This comparison update can only propose edits to its frozen draft target.")
    if arguments.get("kind") != "recommendation" and context.frozen_context.get("draft_updates_require_offer") and not context.update_offer_id:
        raise ValueError("The facts changed. Offer a draft update before creating or revising a document.")
    kind = str(arguments.get("kind") or "").strip()
    title = str(arguments.get("title") or "").strip()
    content = str(arguments.get("content") or "")
    existing_draft_path = str(arguments.get("existing_draft_path") or "").strip()
    if kind not in {"recommendation", "draft", "response"}:
        raise ValueError("kind must be recommendation, draft, or response.")
    if not content.strip():
        raise ValueError("The deliverable body is required.")
    if kind == "recommendation":
        if context.preview:
            raise ValueError("A preview does not update the working recommendation.")
        if existing_draft_path:
            raise ValueError("Recommendations are revised in recommendations.md, not as work-product drafts.")
        recommendations = RecommendationService(context.app.vault, context.app.matters)
        existing = recommendations.get(matter_id)
        if existing["current_version_id"]:
            saved_recommendation = recommendations.propose(
                matter_id, content, actor=context.review_author or "Themis.ai", next_action=str(arguments.get("next_action") or "")
            )
        else:
            saved_recommendation = recommendations.set_working(
                matter_id, content, actor=context.review_author or "Themis.ai", origin="initial_agent", next_action=str(arguments.get("next_action") or "")
            )
        path = saved_recommendation["path"]
        result = {
            "record_type": "recommendation",
            "title": title or "Recommendations",
            "path": path,
            "current_version_id": saved_recommendation["current_version_id"],
            "proposal": saved_recommendation["proposal"],
        }
    else:
        target = context.target
        if context.matter_id and matter_id != context.matter_id:
            raise ValueError("Use the selected matter for this draft.")
        selected_path = target.artifact_path if target else None
        internal_legacy = not context.run_id and not context.trusted_user_message and target is None
        own_created = context.frozen_context.get("last_created_draft")
        current_legacy = context.app.work_products.current_draft(matter_id, legacy_fallback=False) if internal_legacy else None
        if not arguments.get("operation") and not existing_draft_path and (own_created or current_legacy):
            existing_draft_path = own_created or current_legacy["path"]
        operation = arguments.get("operation") or ("revise" if existing_draft_path else "create")
        if operation == "revise" and not internal_legacy and (not target or not target.artifact_path) and own_created:
            from app.models.workspace import ConversationTarget
            reference = context.app.work_products.reference(matter_id, own_created)
            target = ConversationTarget(matter_id=matter_id, artifact_path=own_created, artifact_revision=reference["revision"], artifact_review_revision=reference["review_revision"])
        if operation not in {"create", "revise"}:
            raise ValueError("Choose create or revise.")
        if context.preview:
            operation = "create"
        output_type = str(arguments.get("output_type") or context.output_type)
        template_id = arguments.get("template_id")
        template_use = context.template_use
        if template_id or (template_use or {}).get("state") != "applied":
            candidates = context.frozen_context.get("templates", [])
            chosen = next((item for item in candidates if item["template_id"] == template_id), None) if template_id else next((item for item in candidates if item.get("output_type") == output_type and item.get("is_default")), None)
            if chosen:
                template_use = context.frozen_context.get("template_uses", {}).get(chosen["template_id"])
            elif template_id:
                raise ValueError("The requested template was unavailable at submission. Choose an available template.")
        if template_use:
            template_use = {**template_use, "overrides": {**template_use.get("overrides", {}), **(arguments.get("overrides") or {}), **(context.template_use or {}).get("overrides", {})}}
        draft_path = existing_draft_path or selected_path
        if target and target.artifact_path:
            source_document = context.app.vault.read_document(target.artifact_path)
            original_path = source_document.get("metadata", {}).get("source_path")
            companion_path = target.artifact_path + ".extracted.md"
            supplied_original = False
            if source_document.get("metadata", {}).get("record_type") != "work_product" and context.app.vault.exists(companion_path):
                companion = context.app.vault.read_markdown(companion_path)
                supplied_original = companion["metadata"].get("record_type") == "extracted_document" and companion["metadata"].get("source_path") == target.artifact_path
            if source_document.get("metadata", {}).get("record_type") == "extracted_document" or supplied_original:
                if operation == "revise" or arguments.get("source_document_path") in {original_path, target.artifact_path}:
                    operation = "create"
                    arguments = {**arguments, "source_document_path": target.artifact_path}
        if operation == "revise":
            if not draft_path or (not internal_legacy and (not target or target.artifact_path != draft_path or not target.artifact_review_revision)):
                raise ValueError("Select the draft to revise so its content and review version are visible.")
            result = context.app.work_products.revise_draft(matter_id, draft_path, title=title, content=content,
                source_action_key=context.source_action_key, recommendation_content=str(arguments.get("recommendation") or "") or None,
                recommendation_actor=context.review_author or "Themis.ai", lawyer_author=context.lawyer_author,
                document_reviews=context.app.document_reviews, target=target,
                expected_revision=target.artifact_revision if target else None, expected_review_revision=target.artifact_review_revision if target else None,
                reason=str(arguments.get("reason") or context.trusted_user_message or "Requested draft update"),
                update_offer_id=context.update_offer_id, workspace_action=context.workspace_action)
        else:
            source_path = arguments.get("source_document_path")
            if source_path and (not target or target.artifact_path != source_path or not target.artifact_review_revision):
                raise ValueError("Select the supplied document before making an editable revision copy.")
            if output_type == "outside_counsel_brief" and arguments.get("cover_email_content") and not context.preview:
                packet = context.app.work_products.prepare_outside_counsel_packet(matter_id, title=title or "Outside counsel brief", brief_content=content,
                    cover_email_content=str(arguments["cover_email_content"]), attachments=[], source_action_key=context.source_action_key,
                    template_use=template_use, draft_context={"source_run_id": context.run_id})
                result = {"vault_path": packet["brief"]["path"], "work_product_id": packet["brief"]["work_product_id"], "record_type": "work_product", "title": packet["brief"]["title"], "state": "draft", "artifact": packet["brief"], "changed_paths": [packet["brief"]["path"], packet["cover_email"]["path"]]}
            else:
                result = context.app.work_products.create_draft(matter_id, title=title or "Draft", content=content,
                    source_action_key=context.source_action_key, recommendation_content=None if context.preview else str(arguments.get("recommendation") or "") or None,
                    recommendation_actor=context.review_author or "Themis.ai", output_type=output_type,
                    template_use=template_use, preview=context.preview, source_run_id=context.run_id,
                    draft_context=None if internal_legacy else {"target": target.model_dump(mode="json") if target else None, "source_revisions": context.frozen_context.get("publication_baseline", {})},
                    workspace_action=context.workspace_action, source_document_path=source_path,
                    source_revision=target.artifact_revision if source_path else None,
                    source_review_revision=target.artifact_review_revision if source_path else None)
        if context.preview:
            result = {**result, "preview": True, "summary": "Saved an editable preview. Not kept as current work product."}
        path = result["vault_path"]
        if operation == "create":
            context.frozen_context["last_created_draft"] = path
        changed_paths = result["changed_paths"]
    await _rebuild_index(context)
    if kind == "recommendation":
        changed_paths = saved_recommendation["changed_paths"]
    return {"summary": f"Saved preview: {result['title']}. Not kept." if context.preview else f"Saved {kind}: {result['title']}.", "changed_paths": changed_paths, "refresh": ["tree", "matter"], "data": result}


def _lawyer_actor(context: ToolExecutionContext) -> str:
    actor = str(context.lawyer_author or "").strip()
    if not actor:
        raise ValueError("A lawyer author is required for this lifecycle action.")
    return actor


async def complete_work_item(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    matter_id = str(arguments.get("matter_id") or context.matter_id or "")
    result = context.app.matters.complete_work_item(matter_id, str(arguments.get("work_item_id") or ""), actor=_lawyer_actor(context))
    return {"summary": "Completed the selected work item.", "changed_paths": result["changed_paths"], "refresh": ["matter", "kanban"], "data": result}


async def approve_response(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    return _lifecycle_confirmation(context, arguments, "approve_response", "Approve the final response")


async def mark_response_sent(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    return _lifecycle_confirmation(context, arguments, "mark_as_sent", "Record manual delivery")


async def close_matter(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    matter_id = str(arguments.get("matter_id") or context.matter_id or "")
    if not matter_id:
        raise ValueError("An active matter is required.")
    if prerequisite := context.app.matters.closure_prerequisite(matter_id):
        return {
            "summary": "The matter is not ready to close.",
            "changed_paths": [],
            "refresh": ["matter"],
            "data": {"matter_id": matter_id},
            "operation_status": "no_change",
            "required_user_action": prerequisite,
            "recovery": prerequisite,
        }
    return _lifecycle_confirmation(context, arguments, "close_matter", "Close the matter")


def _lifecycle_confirmation(
    context: ToolExecutionContext, arguments: dict[str, Any], action: str, label: str
) -> dict[str, Any]:
    matter_id = str(arguments.get("matter_id") or context.matter_id or "")
    if not matter_id:
        raise ValueError("An active matter is required.")
    return _confirmation_result(
        context,
        operation=action,
        summary=f"{label} requires your confirmation.",
        required_user_action=f"Use the direct {label.lower()} control to confirm.",
        proposal={"matter_id": matter_id, **arguments},
    )


def _confirmation_result(
    context: ToolExecutionContext,
    *,
    operation: str,
    summary: str,
    required_user_action: str,
    proposal: dict[str, Any],
) -> dict[str, Any]:
    return {
        "summary": summary,
        "changed_paths": [],
        "refresh": [],
        "data": {"proposal": proposal},
        "operation_status": "confirmation_required",
        "required_user_action": required_user_action,
        "recovery": "No workspace change was recorded.",
    }


def _is_reviewable_work_product(path: str, document: dict[str, Any]) -> bool:
    record_type = str(document.get("metadata", {}).get("record_type") or "")
    return (
        record_type in {"extracted_document", "work_product", "draft"}
        or any(part in path for part in ("/documents/", "/drafts/", "/work-product/"))
    )


async def move_matter_stage(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    matter_id = str(arguments.get("matter_id") or context.matter_id or "")
    if not matter_id:
        raise ValueError("An active matter is required.")
    stage = str(arguments.get("new_stage") or arguments.get("stage") or "")
    if stage.strip().casefold() == "closed":
        prerequisite = context.app.matters.closure_prerequisite(matter_id)
        recovery = prerequisite or "Use the Close matter action to confirm closure."
        return {
            "summary": "Closure is not a generic stage change.",
            "changed_paths": [],
            "refresh": ["matter"],
            "data": {"matter_id": matter_id},
            "operation_status": "no_change",
            "required_user_action": recovery,
            "recovery": recovery,
        }
    matter = context.app.matters.move_stage(
        matter_id,
        stage,
        reason=str(arguments.get("reason") or "Moved through chat"),
        actor="agent",
    )
    changed_paths = matter.get("changed_paths", [])
    return {
        "summary": (
            f"Moved {matter['title']} to {stage.title()}." if changed_paths
            else f"Kept {matter['title']} in {matter['status'].title()} so background work did not move it backward."
        ),
        "changed_paths": changed_paths,
        "refresh": ["kanban", "matter"],
        "data": matter,
    }


async def create_work_item(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    matter_id = str(arguments.get("matter_id") or context.matter_id or "")
    if not matter_id:
        raise ValueError("An active matter is required.")
    request = WorkItemCreate(
        matter_id=matter_id,
        title=str(arguments.get("title") or "Follow-up work"),
        description=str(arguments.get("description") or ""),
        item_type=str(arguments.get("item_type") or arguments.get("type") or "question"),
        status=str(arguments.get("status") or "open"),
        priority=str(arguments.get("priority") or "normal"),
        owner=str(arguments.get("owner") or ""),
        due_at=arguments.get("due_at"),
        required=bool(arguments.get("required", False)),
        issue_id=arguments.get("issue_id"),
        source_action_key=context.source_action_key,
    )
    existing_items = context.app.index.list_work_items(matter_id)
    source_keys = {
        item["work_item_id"]: str(
            context.app.vault.read_markdown(item["path"])["metadata"].get("source_action_key") or ""
        )
        for item in existing_items
    }
    same_source = next(
        (
            item for item in existing_items
            if context.source_action_key
            and source_keys[item["work_item_id"]] == context.source_action_key
        ),
        None,
    )
    duplicate = same_source or next(
        (
            item for item in existing_items
            if str(item.get("status") or "").casefold() not in {"done", "closed"}
            and source_keys[item["work_item_id"]].startswith("chat:")
            and _normalized_work_item_title(item.get("title"))
            == _normalized_work_item_title(request.title)
            and item.get("issue_id") == request.issue_id
            and bool(item.get("required")) is bool(request.required)
        ),
        None,
    )
    if duplicate:
        return {
            "summary": f"Reused existing work item: {duplicate['title']}.",
            "changed_paths": [],
            "refresh": ["matter", "kanban"],
            "data": duplicate,
            "operation_status": "no_change",
        }
    item = context.app.matters.create_work_item(request)
    return {
        "summary": f"Created work item: {item['title']}.",
        "changed_paths": [item["path"]],
        "refresh": ["matter", "kanban"],
        "data": item,
    }


def _normalized_work_item_title(value: Any) -> str:
    normalized = unicodedata.normalize("NFKC", str(value or "")).casefold()
    normalized = normalized.replace("/", " and ")
    return " ".join(re.sub(r"[\W_]+", " ", normalized, flags=re.UNICODE).split())


async def run_research(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    matter_id = str(arguments.get("matter_id") or context.matter_id or "")
    if not matter_id:
        raise ValueError("An active matter is required.")
    question = str(arguments.get("question") or context.app.matters.get(matter_id)["title"])
    options = context.app.research_runs.research.search_options()
    from app.services.native_research import native_options
    try:
        collector = context.app.research_runs.resolve_agent()
        collector_selection = context.app.research_runs._selection_values(collector)
    except Exception:
        collector_selection = None
        options["collection_warning"] = "Collection model unavailable; main analysis can still use available context."
    options.update(native_options(collector_selection, context.app.settings))
    options["native"] = False
    options.update(main_model_selection=context.model_selection,
                   collector_model_selection=options["model_selection"],
                   allow_followup_queries=True)
    # Suggestions are not authorization. Only the direct card action starts a run.
    user_text = context.trusted_user_message or ""
    external = bool(re.search(r"\b(?:external(?:ly)?|outside research|web|internet|online|public sources)\b", user_text, re.I))
    other = bool(re.search(r"\b(?:other|prior|across) matters\b", user_text, re.I))
    if re.search(r"\b(?:not|don't|do not|without)\b|\bonly\s+(?:the\s+)?(?:current|this)\s+matter\b", user_text, re.I):
        external = other = False
    return {
        "summary": "Where should I look for this research?",
        "operation": "run_research",
        "operation_status": "confirmation_required",
        "required_user_action": "Choose sources for this request. No research has started yet.",
        "changed_paths": [],
        "data": {"proposal": {
            "matter_id": matter_id, "question": question,
            "public_query": str(arguments.get("public_query") or ""),
            "external": external, "other_matters": other,
            "expected_question_revision": context.expected_question_revision,
            **options,
        }},
    }


async def stop_research(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    if not context.matter_id:
        raise ValueError("An active matter is required.")
    before = context.app.research_runs.list(context.matter_id)
    active_ids = {
        str(item.get("run_id")) for item in before
        if item.get("state") in {"queued", "running"}
    }
    stopped = await context.app.research_runs.stop(context.matter_id)
    changed_paths = [
        str(item["path"]) for item in stopped
        if item.get("path") and str(item.get("run_id")) in active_ids
    ]
    return {
        "summary": (
            "Stopped the active research. Saved packets remain available."
            if active_ids else "Research was already stopped. Saved packets remain available."
        ),
        "changed_paths": changed_paths,
        "refresh": ["matter", "kanban", "tree"],
        "data": {"runs": stopped},
    }


async def record_decision(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    matter_id = str(arguments.get("matter_id") or context.matter_id or "")
    if not matter_id:
        raise ValueError("An active matter is required.")
    proposal = DecisionCreate(
        matter_id=matter_id,
        title=str(arguments.get("title") or "Proposed legal decision"),
        chosen_path=str(arguments.get("chosen_path") or ""),
        rationale=str(arguments.get("rationale") or ""),
        decision_maker=str(arguments.get("decision_maker") or context.lawyer_author or ""),
        decision_type=str(arguments.get("decision_type") or "legal_decision"),
        conditions=[str(item) for item in arguments.get("conditions", [])],
        linked_paths=[str(item) for item in arguments.get("linked_paths", [])],
        next_review_at=arguments.get("next_review_at"),
        risk_level=str(arguments.get("risk_level") or "unknown"),
        source_action_key=context.source_action_key,
    )
    return _confirmation_result(
        context,
        operation="record_decision",
        summary=f"Decision proposal ready: {proposal.title}.",
        required_user_action="Review and confirm the decision with the direct decision control.",
        proposal=proposal.model_dump(mode="json"),
    )


async def audit_decisions(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    result = context.app.decisions.audit(persist=False)
    return {
        "summary": f"Checked {result['reviewed']} decision(s); {result['flagged']} need review.",
        "data": result,
    }


async def create_agent(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    request = AgentCreate(**arguments)
    requested_tools = set(request.allowed_tools)
    if not requested_tools <= context.allowed_tools:
        raise ValueError("An agent created by a tool may use only the creator's allowed tools.")
    result = context.app.agents.create(**request.model_dump())
    return {
        "summary": f"Created agent {result['name']}.",
        "changed_paths": [result["path"]],
        "refresh": ["agents", "tree"],
        "data": result,
    }


async def create_schedule(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    if not arguments.get("matter_id") and context.matter_id:
        arguments["matter_id"] = context.matter_id
    request = ScheduleCreate(**arguments)
    result = context.app.scheduler.create(request)
    return {
        "summary": f"Created schedule {result['title']}.",
        "changed_paths": [result["path"]],
        "refresh": ["automations", "tree"],
        "data": result,
    }


async def create_watch_draft(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    """Persist an editable Watch draft. This action never creates a schedule."""
    standing_question = str(
        arguments.get("standing_question") or arguments.get("question") or "What material legal developments changed?"
    ).strip()
    title = str(arguments.get("title") or _watch_title(standing_question)).strip()
    query_values = dict(arguments.get("public_query") or {})
    query_values.setdefault("standing_question", standing_question)
    for key in ("keywords", "topics", "jurisdictions", "regulators", "courts", "industries"):
        if key in arguments and key not in query_values:
            query_values[key] = arguments[key]
    request = WatchDraftCreate(
        title=title,
        standing_question=standing_question,
        public_query=PublicWatchQuery.model_validate(query_values),
        purposes=arguments.get("purposes") or ["awareness"],
        provider=str(arguments.get("provider") or "native"),
    )
    watch = context.app.watches.create_draft(request)
    changes: dict[str, Any] = {}
    model_fields = {
        "sources": WatchSource,
        "internal_scope": InternalScope,
        "recurrence": ScheduleRecurrence,
        "briefing": BriefingBehavior,
        "review": ReviewBehavior,
    }
    for key, model in model_fields.items():
        if key in arguments and arguments[key] is not None:
            value = arguments[key]
            changes[key] = [model.model_validate(item) for item in value] if key == "sources" else model.model_validate(value)
    if changes:
        watch = context.app.watches.update(
            watch.watch_id,
            WatchPatch(expected_revision=watch.revision, **changes),
            watch.revision,
        )
    await _rebuild_index(context)
    return {
        "summary": f"Saved Watch draft: {watch.title}. It is disabled and has no schedule.",
        "changed_paths": [watch.path],
        "refresh": ["watches", "briefing", "tree"],
        "data": {"watch": watch.model_dump(mode="json"), "card": _watch_draft_card(watch)},
    }


async def scan_watch(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    """Run one draft scan without enabling the Watch or changing its schedule."""
    watch_id = str(arguments.get("watch_id") or "").strip()
    if not watch_id:
        draft = await create_watch_draft(context, arguments)
        watch_id = str(draft["data"]["watch"]["watch_id"])
    before = context.app.watches.get(watch_id)
    result = await context.app.watch_scans.run_watch(watch_id, "draft")
    after = context.app.watches.get(watch_id)
    # Scan services may update checkpoints, but a draft scan must never activate.
    if after.enabled or after.schedule_id:
        raise ValueError("Draft scan attempted to activate or schedule the Watch")
    scan = result.scan
    sources_checked = [
        coverage.model_dump(mode="json")
        for coverage in scan.source_coverage
    ]
    failures = [
        warning for warning in scan.warnings
        if any(word in warning.lower() for word in ("fail", "unavailable", "error", "could not"))
    ]
    summary = (
        f"Scanned draft {before.title}: {len(sources_checked)} source result(s), "
        f"{len(result.preview_items)} sample Briefing item(s), and "
        f"{len(result.preview_packets)} possible review connection(s). The Watch remains disabled."
    )
    return {
        "summary": summary,
        "changed_paths": list(dict.fromkeys([scan.path, *scan.created_paths, after.path])),
        "refresh": ["watches", "briefing", "tree"],
        "data": {
            "watch": after.model_dump(mode="json"),
            "scan": scan.model_dump(mode="json"),
            "sources_checked": sources_checked,
            "failures": failures,
            "sample_briefing_items": [item.model_dump(mode="json") for item in result.preview_items[:5]],
            "possible_review_connections": [packet.model_dump(mode="json") for packet in result.preview_packets[:5]],
            "card": _watch_scan_card(after, result),
        },
    }


async def activate_watch(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    """Create a schedule and explicitly activate an existing Watch draft."""
    watch_id = str(arguments.get("watch_id") or "").strip()
    if not watch_id:
        raise ValueError("watch_id is required; save the draft before starting it")
    watch = context.app.watches.get(watch_id)
    if watch.enabled and watch.schedule_id:
        return {
            "summary": f"Watch {watch.title} is already active.",
            "data": {"watch": watch.model_dump(mode="json"), "card": _watch_draft_card(watch)},
        }
    recurrence = ScheduleRecurrence.model_validate(arguments.get("recurrence") or watch.recurrence.model_dump())
    # Create first. If this fails, no Watch state is changed.
    schedule = context.app.scheduler.create(ScheduleCreate(
        title=str(arguments.get("schedule_title") or f"{watch.title} scan"),
        agent_id="research-agent",
        instructions=f"Run the scheduled scan for Watch {watch.watch_id}.",
        kind="watch_scan",
        target_watch_id=watch.watch_id,
        recurrence=recurrence,
        interval_seconds=recurrence.interval_seconds or 3600,
        enabled=True,
    ))
    activated = watch.model_copy(update={
        "enabled": True,
        "schedule_id": schedule["schedule_id"],
        "status": "healthy",
        "recurrence": recurrence,
        "revision": watch.revision + 1,
        "updated_at": datetime.now(UTC),
    })
    context.app.watches._write(Watch.model_validate(activated))
    await _rebuild_index(context)
    return {
        "summary": f"Started Watch: {watch.title}.",
        "changed_paths": [watch.path, schedule["path"]],
        "refresh": ["watches", "briefing", "automations", "tree"],
        "data": {"watch": activated.model_dump(mode="json"), "schedule": schedule, "card": _watch_draft_card(activated)},
    }


def _watch_title(question: str) -> str:
    clean = question.rstrip(" ?.!").strip()
    return (clean[:140] + " Watch") if clean else "Legal developments Watch"


def _watch_draft_card(watch: Watch) -> dict[str, Any]:
    return {
        "type": "watch_draft", "card_id": f"watch-draft:{watch.watch_id}",
        "watch_id": watch.watch_id, "status": "success", "title": watch.title,
        "summary": "Active Watch" if watch.enabled else "Saved draft · Disabled · No schedule" if not watch.schedule_id else "Saved draft · Disabled",
        "watch_path": watch.path, "vault_path": watch.path, "watch_url": f"/watches/{watch.watch_id}",
        "allowed_actions": ["change_something"] if watch.enabled else ["save_draft", "scan_now", "change_something", "start_watch"],
    }


def _watch_scan_card(watch: Watch, result: Any) -> dict[str, Any]:
    scan = result.scan
    return {
        "type": "watch_scan", "card_id": f"watch-scan:{watch.watch_id}:{scan.scan_id}",
        "watch_id": watch.watch_id, "scan_id": scan.scan_id,
        "status": scan.status if scan.status in {"partial", "success", "failed"} else "pending",
        "summary": f"{scan.briefing_item_count} Briefing item(s); {scan.review_packet_count} possible review connection(s).",
        "warnings": scan.warnings, "vault_path": scan.path,
        "watch_url": f"/watches/{watch.watch_id}", "scan_url": f"/briefing/scans/{scan.scan_id}",
        "allowed_actions": ["open_watch", "open_scan", "scan_again"],
    }


async def append_memory(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    note = str(arguments.get("note") or "").strip()
    if not note:
        raise ValueError("A memory note is required.")
    path = "00_System/memory.md"
    current = context.app.vault.read_text(path) if context.app.vault.exists(path) else "# Memory\n"
    updated = current.rstrip() + f"\n\n## {iso_now()}\n\n- {note}\n"
    context.app.vault.write_bytes(path, updated.encode("utf-8"))
    return {
        "summary": "Appended the instruction to memory.md.",
        "changed_paths": [path],
        "refresh": ["tree"],
        "data": {"path": path},
    }


def _filename(value: str) -> str:
    clean = "-".join(value.lower().split())
    return "".join(character for character in clean if character.isalnum() or character in "-_" )[:80] or "draft"



def _instruction(context: ToolExecutionContext, arguments: dict[str, Any]) -> str:
    quote = str(arguments.get("instruction_quote") or "").strip()
    message = context.trusted_user_message or ""
    if not context.trusted_message_id or not quote or quote not in message:
        raise ValueError("This action needs its exact instruction from the current user message.")
    return quote


async def select_conversation_scope(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    _instruction(context, arguments)
    scope = arguments.get("scope")
    if scope not in {"actual", "scenario"}:
        raise ValueError("Choose actual or scenario context.")
    current = context.scope_state.get("scope")
    if current and current != scope:
        raise ValueError("This run scope is frozen. Use narrow path or explicit correction actions.")
    context.scope_state["scope"] = scope
    data = {"scope": scope}
    intent = arguments.get("path_intent", "none")
    if intent not in {"new", "existing", "none"}:
        raise ValueError("Choose new, existing or none for path_intent.")
    if scope == "actual" and intent != "none":
        raise ValueError("Hypothetical paths require scenario scope.")
    if scope == "scenario" and intent != "none":
        from app.tools.matter_paths import path_action
        action = "explore_path" if intent == "new" else "select_working_path"
        values = arguments.get("new_path") if intent == "new" else {"path_id": arguments.get("path_id")}
        result = await path_action(context, {"action": action, "values": values or {},
            "instruction_quote": arguments["instruction_quote"]})
        return {"summary": result["summary"], "data": {"scope": scope, **result["data"]},
                "changed_paths": result.get("changed_paths", []), "refresh": result.get("refresh", [])}
    if scope == "scenario":
        data["path_saved_by_this_action"] = False
        data["continuation"] = (
            "Scope selection does not save assumptions or a path. For a concrete hypothetical with new "
            "assumptions, call workspace_action explore_path next, using the relevant saved parent ID "
            "and revision. Save the new assumptions there before saving its working note. "
            "Reuse an existing path only if its material assumptions already match; a shared topic is not enough. "
            "For a general conceptual question or an explicit no-save request, answer without creating a path."
        )
        if context.matter_id and not context.frozen_context.get("excluded_paths"):
            data["saved_paths"] = context.app.solution_paths.inspect(context.matter_id)
    return {"summary": "Hypothetical scope selected." if scope == "scenario" else "Current matter context selected.", "data": data}


def _workspace_command(context: ToolExecutionContext, arguments: dict[str, Any], *, explicit: bool = True) -> dict[str, Any]:
    if not context.matter_id or not context.expected_question_revision or not context.source_action_key:
        raise ValueError("A saved matter, question version and source action are required.")
    if explicit:
        _instruction(context, arguments)
    if context.target:
        context.app.workspace.validate_target(context.matter_id, context.target)
    return {
        "expected_revision": context.expected_question_revision,
        "source_action_key": context.source_action_key,
        "source_message_id": context.trusted_message_id,
        "run_id": context.run_id,
    }


def _workspace_result(receipt: dict[str, Any], summary: str) -> dict[str, Any]:
    failed = receipt["state"] == "not_saved"
    if failed:
        summary = "Fact saved. Question update not saved." if "reported_fact" in receipt.get("completed_parts", []) else "Question change not saved."
    return {"summary": summary, "receipt": receipt, "data": {"receipt": receipt},
            "operation_status": "failed" if failed else "changed",
            "changed_paths": receipt.get("changed_links", []), "refresh": ["matter", "tree"],
            "error": receipt.get("failure_detail")}


async def change_business_question(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    command = _workspace_command(context, arguments)
    command.update(text=arguments.get("text"), reason=str(arguments.get("reason") or ""))
    receipt = context.app.workspace.change_business_question(context.matter_id, command)
    return _workspace_result(receipt, "Business question saved.")


async def propose_business_question(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    command = _workspace_command(context, arguments, explicit=False)
    command.update(text=arguments.get("text"), reason=str(arguments.get("reason") or ""))
    receipt = context.app.workspace.propose_business_question(context.matter_id, command)
    return _workspace_result(receipt, "Question reframe proposed. Current question unchanged.")


async def act_on_question_proposal(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    command = _workspace_command(context, arguments)
    command.pop("run_id")
    command.update(action=arguments.get("action"), text=arguments.get("text"))
    receipt = context.app.workspace.act_on_proposal(context.matter_id, str(arguments.get("proposal_id") or ""), command)
    return _workspace_result(receipt, "Question proposal applied." if arguments.get("action") == "apply" else "Question proposal rejected.")


async def restore_business_question(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    command = _workspace_command(context, arguments)
    command.pop("run_id")
    command["revision"] = arguments.get("revision")
    receipt = context.app.workspace.restore_business_question(context.matter_id, command)
    return _workspace_result(receipt, "Previous business question restored as a new version.")


async def answer_workspace_question(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    command = _workspace_command(context, arguments)
    question_id = str(arguments.get("question_id") or "")
    question = next((q for q in context.app.workspace.questions(context.matter_id) if q["question_id"] == question_id), None)
    if question is None:
        raise ValueError("Supporting question not found. Ask one focused question if the answer target is unclear.")
    if question["business_question_revision"] != context.expected_question_revision:
        raise ValueError("This supporting question belongs to an earlier business question.")
    command.update(expected_revision=arguments.get("expected_revision"), state=arguments.get("state"), answer=arguments.get("answer"))
    capture = context.frozen_context.get("problem_analysis_capture")
    was_current = bool(capture and context.app.problem_analysis._fresh(context.matter_id, capture["input_basis"]))
    receipt = context.app.workspace.answer_question(context.matter_id, question_id, command)
    result = _workspace_result(receipt, "Question left open." if command["state"] == "left_open" else "Answer saved as a reported fact. The issue remains open.")
    if was_current and receipt["state"] != "not_saved":
        # Return the exact records used to amend this run's captured basis.
        # A correction that preceded this tool call remains a stale baseline.
        result["data"]["observed_problem_inputs"] = _observe_problem_inputs(context, ("facts", "assumptions", "questions"))
    return result


def _excluded_tool_path(context, path: str) -> bool:
    resolved = context.app.vault.resolve(path)
    normalized = context.app.vault.relative(resolved)
    if "/research/source-library/" in normalized:
        if not normalized.endswith("/source-library/index.md") or context.frozen_context.get("excluded_paths") or context.frozen_context.get("excluded_reference_ids"):
            return True
    if any(resolved == context.app.vault.resolve(item) for item in context.frozen_context.get("excluded_paths", [])):
        return True
    if context.frozen_context.get("withhold_unattributed_history"):
        normalized = context.app.vault.relative(resolved)
        if "/conversations/" in normalized:
            return True
        if any(part in normalized for part in ("/research/", "/draft/", "/drafts/", "/notes/", "/batches/")):
            return not any(item.get("path") == normalized and item.get("state") in {"included", "truncated"} for item in context.frozen_context.get("manifest", {}).get("entries", []))
    return False


async def manage_output_template(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    operation = arguments.get("operation")
    registry = context.app.skills
    values = dict(arguments.get("values") or {})
    template_id = str(arguments.get("template_id") or "")
    keys = ("audience", "purpose", "tone", "length", "exclusions", "source_presentation", "sample_wording")
    if operation in {"create", "update"} and any(key in values for key in keys):
        current = registry.get_output_template(template_id) if operation == "update" else None
        defaults = {key: str(getattr(current, key, "") or "") for key in keys} if current else {}
        defaults.update(values.pop("defaults", {}) or {})
        defaults.update({key: values.pop(key) for key in keys if key in values})
        values["defaults"] = defaults
    if operation == "list":
        saved = registry.list_output_templates()
    elif operation == "create":
        saved = registry.create_output_template(**values).model_dump(mode="json")
    elif operation == "duplicate":
        saved = registry.duplicate_output_template(template_id, **values).model_dump(mode="json")
    elif operation == "update":
        saved = registry.update_output_template(template_id, **values).model_dump(mode="json")
    elif operation == "set_default":
        saved = registry.set_default_output_template(values["output_type"], template_id)
    else:
        raise ValueError("Unknown output template action.")
    return {"summary": "Output templates available." if operation == "list" else "Output template saved.", "data": {"templates" if operation == "list" else "template": saved}, "operation_status": "no_change" if operation == "list" else "changed", "refresh": ["workspace", "skills"]}


async def workspace_action(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    """Small typed composition boundary; no arbitrary service or file dispatch."""
    from app.services.workspace import digest
    from app.models.awareness import WatchDraftCreate
    action = arguments.get("action")
    from app.tools.matter_paths import PATH_ACTIONS, path_action
    if action in PATH_ACTIONS:
        return await path_action(context, arguments)
    if action == "correct_fact":
        _instruction(context, arguments)
    values = dict(arguments.get("values") or {})
    matter_id = context.matter_id
    if not matter_id:
        raise ValueError("Select a matter first.")
    app = context.app
    workspace = app.workspace
    problem_capture = context.frozen_context.get("problem_analysis_capture")
    problem_was_current = bool(problem_capture and app.problem_analysis._fresh(matter_id, problem_capture["input_basis"]))
    metadata = workspace._document(matter_id, "workspace.md")["metadata"]
    revision_map = context.frozen_context.get("mutation_revisions") or context.frozen_context.get("publication_baseline") or workspace.source_revisions(matter_id)
    if action == "inspect":
        saved = {"workspace": workspace.get(matter_id), "records": app.matter_records.get(matter_id), "flow": app.workspace_flow.get(matter_id), "scenarios": app.workspace_scenarios.list(matter_id), "context": app.workspace_evidence.selection(matter_id), "preferences_revision": digest(metadata.get("output_preferences", {})), "contributions_revision": digest(metadata.get("lawyer_contributions", []))}
        if context.frozen_context.get("withhold_unattributed_history"):
            saved = {"context_filtered": True, "submitted_context": context.frozen_context.get("context", ""),
                "source_revisions": revision_map, "context": {"revision": saved["context"]["revision"]},
                "preferences_revision": saved["preferences_revision"], "contributions_revision": saved["contributions_revision"]}
    elif action == "correct_fact":
        saved = app.workspace_scenarios.correct_fact(matter_id, fact_id=values.get("fact_id"), replacement=values.get("replacement", ""), expected_revisions=revision_map, source_action_key=context.source_action_key, trusted_user_action=True, source_message_id=context.trusted_message_id)
    elif action == "save_scenario":
        scenario = dict(values.get("scenario", values))
        scenario.pop("adopted_fact_ids", None)
        scenario["baseline_revisions"] = context.frozen_context.get("publication_baseline") or workspace.source_revisions(matter_id)
        saved = app.workspace_scenarios.save(matter_id, scenario, expected_revision=values.get("expected_revision"), source_action_key=context.source_action_key)
    elif action == "save_flow":
        saved = app.workspace_flow.save(matter_id, values["flow"], expected_revision=values["expected_revision"])
    elif action == "adopt_scenario":
        saved = app.workspace_scenarios.adopt_fact_changes(matter_id, values["scenario_id"], values["change_ids"], expected_revisions=revision_map, source_action_key=context.source_action_key, trusted_user_action=True, source_message_id=context.trusted_message_id)
    elif action == "accept_flow_facts":
        saved = app.workspace_flow.accept_proposed_fact_changes(matter_id, values["change_ids"], expected_revisions=revision_map, source_action_key=context.source_action_key, trusted_user_action=True, source_message_id=context.trusted_message_id)
    elif action == "save_preferences":
        saved = app.workspace_actions.save_preferences(matter_id, values["preferences"], expected_revision=values["expected_revision"])
    elif action == "save_contribution":
        saved = app.workspace_actions.save_contribution(matter_id, text=values["text"], kind=values["kind"], expected_revision=values["expected_revision"], source_message_id=context.trusted_message_id, source_action_key=context.source_action_key, source_ids=values.get("source_ids"), supersedes=values.get("supersedes"))
    elif action == "set_context":
        saved = app.workspace_evidence.save_selection(matter_id, values["selections"], expected_revision=values["expected_revision"])
    elif action == "prior_work":
        if not (context.frozen_context.get("research_scope") or {}).get("other_matters"):
            return await run_research(context, {"question": values.get("query") or context.trusted_user_message or "Find relevant prior work in other matters."})
        saved = [item for item in app.workspace_reuse.prior_work(matter_id, values.get("query", "")) if not _excluded_tool_path(context, item["path"])]
    elif action == "draft_practice_note":
        saved = app.workspace_reuse.draft_practice_note(**values)
    elif action == "save_practice_note":
        saved = app.workspace_reuse.save_practice_note(values)
    elif action == "apply_practice_note":
        saved = app.workspace_reuse.apply_practice_note(matter_id, values["skill_id"])
    elif action == "create_assumption_watch":
        saved = app.workspace_reuse.create_assumption_watch(matter_id, WatchDraftCreate.model_validate(values["request"]), assumption_ids=values["assumption_ids"], decision_ids=values.get("decision_ids"))
    elif action == "offer_update":
        saved = app.workspace_actions.offer_update(matter_id, values)
    elif action == "save_question":
        saved = app.workspace_actions.save_useful_question(matter_id, text=values["text"], consequence=values["consequence"], expected_question_revision=context.expected_question_revision, issue_id=values.get("issue_id"))
    else:
        raise ValueError("Unknown workspace action.")
    if action in {"correct_fact", "adopt_scenario", "accept_flow_facts"}:
        context.frozen_context["draft_updates_require_offer"] = True
        saved = fact_update_details(app, matter_id, saved, source_action_key=context.source_action_key,
            selected_path=context.target.artifact_path if context.target else None, instruction=context.trusted_user_message or "")
        if context.frozen_context.get("withhold_unattributed_history"):
            saved.pop("matching_scenarios", None)
    if action in {"correct_fact", "adopt_scenario", "accept_flow_facts", "save_flow", "save_scenario"}:
        context.frozen_context["mutation_revisions"] = workspace.source_revisions(matter_id)
    if saved is None:
        return {"summary": "The question was not saved because its scope changed or its required text was missing. Useful analysis is retained.", "operation_status": "no_change", "data": {"state": "not_saved"}}
    read_only = action in {"inspect", "prior_work", "draft_practice_note"}
    data = {"result": saved}
    if problem_was_current and action in {"correct_fact", "adopt_scenario", "accept_flow_facts"} and saved.get("state") not in {"not_saved", "conflict"}:
        data["observed_problem_inputs"] = _observe_problem_inputs(context, ("facts", "assumptions", "questions"))
    return {"summary": "Workspace context available." if read_only else "Workspace action saved.", "data": data, "operation_status": "no_change" if read_only else "changed", "refresh": ["workspace", "matter"]}


def fact_update_details(app, matter_id: str, result: dict, *, source_action_key: str, selected_path: str | None = None, instruction: str = "") -> dict:
    """Shared composition for actual chat and direct fact controls; never edits drafts."""
    from app.services.workspace import digest
    saved = dict(result)
    fact_ids = saved.get("fact_ids") or saved.get("adopted_fact_ids") or []
    facts = [fact for fact in app.matter_records.get(matter_id)["facts"] if fact["fact_id"] in fact_ids]
    matches = {}
    for fact in facts:
        for match in app.workspace_scenarios.find_relevant(matter_id, fact["text"]):
            matches[match["scenario"]["scenario_id"]] = match
    saved["matching_scenarios"] = list(matches.values())
    drafts = app.work_products.list_drafts(matter_id)
    selected = next((draft for draft in drafts if draft["path"] == selected_path), None)
    if selected is None:
        current = app.work_products.current_draft(matter_id, legacy_fallback=False)
        selected = next((draft for draft in drafts if current and draft["path"] == current["path"]), None)
    if selected and not selected.get("preview"):
        reason = "Reported facts changed. Review whether the draft needs an update."
        saved["update_offer"] = app.workspace_actions.offer_update(matter_id, {"offer_id": "OFFER-" + digest(source_action_key)[:20],
            "artifact_path": selected["path"], "base_revision": selected["revision"], "reason": reason,
            "change": {"reason": reason, "before_revision": selected["revision"], "trigger_fact_ids": fact_ids,
                       "instruction": instruction, "affected_analysis": [selected["path"]]}})
        saved["affected_analysis"] = list(dict.fromkeys([*saved.get("affected_analysis", []), selected["path"]]))
        saved["update_offer_required"] = True
    return saved
