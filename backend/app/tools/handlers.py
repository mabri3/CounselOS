from __future__ import annotations

from pathlib import Path
from typing import Any

from app.models.api import AgentCreate, DecisionCreate, ScheduleCreate, WorkItemCreate
from app.tools.registry import Handler, ToolExecutionContext
from app.utils.time import iso_now


def build_handlers() -> dict[str, Handler]:
    return {
        "read_file": read_file,
        "list_files": list_files,
        "search_vault": search_vault,
        "write_markdown": write_markdown,
        "move_matter_stage": move_matter_stage,
        "create_work_item": create_work_item,
        "run_research": run_research,
        "record_decision": record_decision,
        "audit_decisions": audit_decisions,
        "create_agent": create_agent,
        "create_schedule": create_schedule,
        "append_memory": append_memory,
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
    results = context.app.vault.lexical_search(query, relative_path=str(path or ""), limit=10)
    return {"summary": f"Found {len(results)} internal result(s) for '{query}'.", "data": {"results": results}}


async def write_markdown(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    raw_path = str(arguments.get("path") or "").strip()
    if not raw_path:
        title = str(arguments.get("title") or "agent-draft")
        if not context.matter_id:
            raise ValueError("A path or active matter is required.")
        base = context.app.matters.matter_path(context.matter_id)
        raw_path = f"{base}/drafts/{_filename(title)}.md"
    if context.app.vault.exists(raw_path):
        current = context.app.vault.read_document(raw_path)
        if current.get("metadata", {}).get("immutable"):
            raise ValueError("The original request is immutable. Create a new version or event instead.")
    content = str(arguments.get("content") or "")
    metadata = arguments.get("metadata") or {}
    path = context.app.vault.write_markdown(raw_path, content, metadata)
    context.app.index.rebuild()
    return {
        "summary": f"Wrote {path}.",
        "changed_paths": [path],
        "refresh": ["tree", "matter"],
        "data": {"path": path},
    }


async def move_matter_stage(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    matter_id = str(arguments.get("matter_id") or context.matter_id or "")
    if not matter_id:
        raise ValueError("An active matter is required.")
    stage = str(arguments.get("new_stage") or arguments.get("stage") or "")
    matter = context.app.matters.move_stage(
        matter_id,
        stage,
        reason=str(arguments.get("reason") or "Moved through chat"),
        actor="agent",
    )
    return {
        "summary": f"Moved {matter['title']} to {stage.title()}.",
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
    )
    item = context.app.matters.create_work_item(request)
    return {
        "summary": f"Created work item: {item['title']}.",
        "changed_paths": [item["path"]],
        "refresh": ["matter", "kanban"],
        "data": item,
    }


async def run_research(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    matter_id = str(arguments.get("matter_id") or context.matter_id or "")
    if not matter_id:
        raise ValueError("An active matter is required.")
    result = await context.app.research.run(matter_id, str(arguments.get("question") or ""))
    return {
        "summary": result["summary"],
        "changed_paths": [result["path"]],
        "refresh": ["matter", "kanban", "tree"],
        "data": result,
    }


async def record_decision(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    matter_id = str(arguments.get("matter_id") or context.matter_id or "")
    if not matter_id:
        raise ValueError("An active matter is required.")
    request = DecisionCreate(
        matter_id=matter_id,
        title=str(arguments.get("title") or "Recorded legal decision"),
        chosen_path=str(arguments.get("chosen_path") or ""),
        rationale=str(arguments.get("rationale") or ""),
        decision_maker=str(arguments.get("decision_maker") or "User instructed the chat"),
        decision_type=str(arguments.get("decision_type") or "legal_decision"),
        conditions=[str(item) for item in arguments.get("conditions", [])],
        linked_paths=[str(item) for item in arguments.get("linked_paths", [])],
        next_review_at=arguments.get("next_review_at"),
        risk_level=str(arguments.get("risk_level") or "unknown"),
    )
    decision = context.app.decisions.record(request)
    return {
        "summary": f"Recorded decision: {decision['title']}.",
        "changed_paths": [decision["path"]],
        "refresh": ["matter", "decisions"],
        "data": decision,
    }


async def audit_decisions(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    result = context.app.decisions.audit()
    return {
        "summary": f"Audited {result['reviewed']} decision(s); {result['flagged']} need review.",
        "refresh": ["decisions", "dashboard"],
        "data": result,
    }


async def create_agent(context: ToolExecutionContext, arguments: dict[str, Any]) -> dict[str, Any]:
    request = AgentCreate(**arguments)
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
