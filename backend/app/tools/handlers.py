from __future__ import annotations

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
    return {
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


async def update_matter_intake(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    if not context.matter_id:
        raise ValueError("An active matter is required.")
    turn = IntakeTurn.model_validate({
        **arguments,
        "source_action_key": context.source_action_key,
    })
    if turn.intake_state == "active" and not turn.next_questions:
        raise ValueError(
            "Active intake must include at least one structured next_questions item. "
            "If there are no more questions, set intake_state to complete. "
            "Do not ask a follow-up question only in prose."
        )
    result = context.app.matter_records.apply_intake_turn(
        context.matter_id,
        turn,
        source_id=context.trusted_source_id,
        expected_dossier_hash=context.expected_dossier_hash,
    )
    payload = result.model_dump(mode="json") if hasattr(result, "model_dump") else dict(result)
    return {
        "summary": "Updated the matter intake record.",
        "changed_paths": payload.get("changed_paths", []),
        "refresh": ["matter", "tree"],
        "data": payload,
    }


async def read_file(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    path = str(arguments.get("path") or context.active_file or "")
    if not path:
        raise ValueError("A file path is required.")
    document = context.app.vault.read_document(path)
    return {"summary": f"Read {path}.", "data": document}


async def list_files(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    path = str(arguments.get("path") or "")
    if not path and context.matter_id:
        path = context.app.matters.matter_path(context.matter_id)
    tree = context.app.vault.list_tree(path)
    return {"summary": f"Listed files under {path or 'the vault'}.", "data": {"tree": tree}}


async def search_vault(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    query = str(arguments.get("query") or "").strip()
    if not query:
        raise ValueError("A search query is required.")
    path = arguments.get("path")
    results = context.app.search.search_internal(
        query, matter_path=str(path or "") or None, limit=10
    )
    return {"summary": f"Found {len(results)} internal result(s) for '{query}'.", "data": {"results": results}}


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
        path = context.app.document_reviews.propose_agent_revision(
            raw_path,
            content,
            metadata,
            author_name=context.review_author or "Themis.ai",
            lawyer_author=context.lawyer_author,
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
    relative = supplied.relative_to(base).as_posix()
    protected_files = {"matter.md", "request.md", "facts.md", "issues.md", "participants.md", "recommendations.md"}
    protected_roots = {
        "research", "decisions", "work-items", "events", "conversations", "documents/batches",
        "work-product/draft", "work-product/final",
    }
    configured = {
        Path(context.app.matter_paths.folder(context.matter_id, key)).relative_to(base).as_posix()
        for key in ("matter_files.draft_outputs_dir", "matter_files.final_outputs_dir")
    }
    if (
        relative.casefold() == "work-product.md"
        or relative in protected_files
        or any(relative == root or relative.startswith(f"{root}/") for root in protected_roots | configured)
    ):
        raise ValueError("Use a typed tool for protected matter records and work products.")


async def save_work_product(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    matter_id = str(arguments.get("matter_id") or context.matter_id or "")
    if not matter_id:
        raise ValueError("An active matter is required.")
    kind = str(arguments.get("kind") or "").strip()
    title = str(arguments.get("title") or "").strip()
    content = str(arguments.get("content") or "")
    existing_draft_path = str(arguments.get("existing_draft_path") or "").strip()
    if kind not in {"recommendation", "draft", "response"}:
        raise ValueError("kind must be recommendation, draft, or response.")
    if not content.strip():
        raise ValueError("The deliverable body is required.")
    if kind == "recommendation":
        if existing_draft_path:
            raise ValueError("Recommendations are revised in recommendations.md, not as work-product drafts.")
        recommendations = RecommendationService(context.app.vault, context.app.matters)
        existing = recommendations.get(matter_id)
        if existing["current_version_id"]:
            saved_recommendation = recommendations.propose(
                matter_id, content, actor=context.review_author or "Themis.ai"
            )
        else:
            saved_recommendation = recommendations.set_working(
                matter_id, content, actor=context.review_author or "Themis.ai", origin="initial_agent"
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
        current = context.app.work_products.current_draft(
            matter_id, legacy_fallback=False
        )
        if existing_draft_path:
            draft_path = existing_draft_path
        elif current:
            draft_path = current["path"]
        else:
            draft_path = ""
    if kind != "recommendation" and draft_path:
        result = context.app.work_products.revise_draft(
            matter_id,
            draft_path,
            title=title,
            content=content,
            source_action_key=context.source_action_key,
            recommendation_content=str(arguments.get("recommendation") or "") or None,
            recommendation_actor=context.review_author or "Themis.ai",
            lawyer_author=context.lawyer_author,
            document_reviews=context.app.document_reviews,
        )
        path = result["vault_path"]
        changed_paths = result["changed_paths"]
    elif kind != "recommendation":
        result = context.app.work_products.create_draft(
            matter_id,
            title=title or ("Response" if kind == "response" else "Draft"),
            content=content,
            source_action_key=context.source_action_key,
            recommendation_content=str(arguments.get("recommendation") or "") or None,
            recommendation_actor=context.review_author or "Themis.ai",
        )
        path = result["vault_path"]
        changed_paths = result["changed_paths"]
    await _rebuild_index(context)
    if kind == "recommendation":
        changed_paths = saved_recommendation["changed_paths"]
    return {"summary": f"Saved {kind}: {result['title']}.", "changed_paths": changed_paths, "refresh": ["tree", "matter"], "data": result}


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
    duplicate = next(
        (
            item for item in context.app.index.list_work_items(matter_id)
            if str(item.get("status") or "").casefold() not in {"done", "closed"}
            and _normalized_work_item_title(item.get("title"))
            == _normalized_work_item_title(request.title)
            and str(item.get("item_type") or "").strip().casefold()
            == request.item_type.strip().casefold()
            and str(item.get("issue_id") or "").strip().casefold()
            == str(request.issue_id or "").strip().casefold()
            and bool(item.get("required")) is bool(request.required)
        ),
        None,
    )
    if duplicate:
        return {
            "summary": f"Reused open work item: {duplicate['title']}.",
            "changed_paths": [],
            "refresh": ["matter", "kanban"],
            "data": duplicate,
        }
    item = context.app.matters.create_work_item(request)
    return {
        "summary": f"Created work item: {item['title']}.",
        "changed_paths": [item["path"]],
        "refresh": ["matter", "kanban"],
        "data": item,
    }


def _normalized_work_item_title(value: Any) -> str:
    return " ".join(str(value or "").split()).casefold()


async def run_research(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    matter_id = str(arguments.get("matter_id") or context.matter_id or "")
    if not matter_id:
        raise ValueError("An active matter is required.")
    started = context.app.research_runs.start(
        matter_id,
        [str(arguments.get("question") or context.app.matters.get(matter_id)["title"])],
        source_action_key=context.source_action_key,
    )
    return {
        "summary": (
            f"Research started in the background as {started['run_id']}. "
            "The saved run status will update when it finishes."
        ),
        "changed_paths": [str(started["path"])],
        "refresh": ["matter", "kanban", "tree"],
        "data": started,
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
