from __future__ import annotations

from dataclasses import dataclass, field
import logging
from pathlib import Path
from typing import Any, Awaitable, Callable, FrozenSet

import yaml

from app.agents.registry import AgentDefinition
from app.services.vault import VaultService
from app.tools.capabilities import ToolCapabilities
from app.tools.matter_paths import SCENARIO_ACTIONS, PATH_READ_ACTIONS


Handler = Callable[["ToolExecutionContext", dict[str, Any]], Awaitable[dict[str, Any]]]
APP_CONTRACT_ROOT = Path(__file__).resolve().parents[1] / "blank_vault_template"
logger = logging.getLogger(__name__)
# Research entry presents source choices; it does not publish actual matter facts.
SCENARIO_RESEARCH_TOOLS = frozenset({"run_research"})
SCENARIO_READ_TOOLS = frozenset({"list_files", "read_file", "search_vault"})
# run_research only presents source choices; confirmation starts the actual run.
UNSCOPED_TOOLS = SCENARIO_READ_TOOLS | {"select_conversation_scope", "run_research"}


@dataclass
class ToolExecutionContext:
    app: ToolCapabilities
    matter_id: str | None = None
    active_file: str | None = None
    review_author: str | None = None
    lawyer_author: str | None = None
    source_action_key: str | None = None
    trusted_source_id: str | None = None
    expected_dossier_hash: str | None = None
    allowed_tools: FrozenSet[str] = frozenset()
    expected_question_revision: str | None = None
    target: Any = None
    trusted_user_message: str | None = None
    trusted_message_id: str | None = None
    run_id: str | None = None
    scope_state: dict[str, str] = field(default_factory=dict)
    frozen_context: dict[str, Any] = field(default_factory=dict)
    template_use: dict[str, Any] | None = None
    output_type: str = "general"
    preview: bool = False
    model_selection: dict[str, str] | None = None
    workspace_action: str | None = None
    update_offer_id: str | None = None
    investigation: Any = None
    call_journal: Any = None



@dataclass
class ToolExecutionResult:
    tool: str
    status: str
    summary: str
    data: dict[str, Any] = field(default_factory=dict)
    changed_paths: list[str] = field(default_factory=list)
    refresh: list[str] = field(default_factory=list)
    operation_result: dict[str, Any] = field(default_factory=dict)


@dataclass
class ToolDefinition:
    tool_id: str
    description: str
    parameters: dict[str, Any]
    handler: str
    path: str


class ToolRegistry:
    def __init__(self, vault: VaultService, handlers: dict[str, Handler]):
        self.vault = vault
        self.handlers = handlers
        self.app_contract = VaultService(APP_CONTRACT_ROOT)
        self._cached_definitions: dict[str, ToolDefinition] | None = None
        self._cached_fingerprint: tuple[tuple[str, str, int, int], ...] | None = None

    def list(self) -> list[dict[str, Any]]:
        return [definition.__dict__ for definition in self._load().values()]

    def provider_tools(self, agent: AgentDefinition) -> list[dict[str, Any]]:
        definitions = self._load()
        tools: list[dict[str, Any]] = []
        for tool_id in self.allowed_tools(agent):
            definition = definitions.get(tool_id)
            if not definition:
                continue
            tools.append(
                {
                    "type": "function",
                    "function": {
                        "name": definition.tool_id,
                        "description": definition.description,
                        "parameters": definition.parameters,
                    },
                }
            )
        return tools

    async def execute(
        self,
        agent: AgentDefinition,
        context: ToolExecutionContext,
        tool_id: str,
        arguments: dict[str, Any],
    ) -> ToolExecutionResult:
        from app.services.research_collection import INVESTIGATION_TOOLS
        investigation_tools = {"collect_research_evidence", "read_research_source", "search_research_sources"}
        if context.investigation is not None or tool_id in investigation_tools:
            try:
                from app.tools.research_investigation import authorized
                authorized(context)
                if agent.agent_id != "counsel-copilot" or tool_id not in INVESTIGATION_TOOLS:
                    raise ValueError("This investigation only permits main-agent evidence and local read tools.")
            except ValueError as exc:
                return _failed_tool_result(tool_id, context, str(exc))
        scope = context.scope_state.get("scope")
        if "research_scope" in context.frozen_context and tool_id not in SCENARIO_READ_TOOLS and context.investigation is None:
            return _failed_tool_result(tool_id, context, "This research run uses only its confirmed search sources. Do not start another search or workflow; answer from the available material.")
        if (scope == "scenario" or (context.target and context.target.scenario_id)) and tool_id not in SCENARIO_READ_TOOLS | SCENARIO_RESEARCH_TOOLS | {"select_conversation_scope"} and not (tool_id == "workspace_action" and arguments.get("action") in SCENARIO_ACTIONS):
            return _failed_tool_result(tool_id, context, "Scenario analysis can only read saved context. No actual matter change was made.")
        if context.trusted_user_message and not scope and tool_id not in UNSCOPED_TOOLS and not (tool_id == "workspace_action" and arguments.get("action") in PATH_READ_ACTIONS):
            return _failed_tool_result(tool_id, context, "First interpret this turn with select_conversation_scope. No change was made.")
        if tool_id not in self.allowed_tools(agent):
            return _failed_tool_result(
                tool_id, context, f"Agent is not allowed to use {tool_id}."
            )
        definition = self._load().get(tool_id)
        if not definition:
            return _failed_tool_result(
                tool_id, context, f"Tool is not registered: {tool_id}."
            )
        handler = self.handlers.get(definition.handler)
        if not handler:
            return _failed_tool_result(
                tool_id,
                context,
                f"Tool specification points to an unknown handler: {definition.handler}.",
            )
        try:
            if context.call_journal is not None or context.investigation is not None:
                from app.services.workspace import digest
                import json
                access = context.investigation or context.call_journal
                if context.investigation is not None and tool_id in SCENARIO_READ_TOOLS:
                    path = str(arguments.get("path") or context.app.matters.matter_path(context.matter_id))
                    canonical = context.app.vault.relative(context.app.vault.resolve(path))
                    roots = [context.app.matters.matter_path(context.matter_id)]
                    if access.scope.other_matters:
                        roots.extend((access.run.get("frozen_context") or {}).get("allowed_matter_roots", []))
                    if not any(canonical == root or canonical.startswith(root + "/") for root in roots):
                        raise ValueError("Local read is outside this investigation scope.")
                cp = access.checkpoints.load(access.matter_id, access.run_id)
                tool_key = digest(tool_id + json.dumps(arguments, sort_keys=True) + (context.source_action_key or ""))
                cached = cp.get("tool_results", {}).get(tool_key)
                if cached is not None:
                    payload = cached
                else:
                    payload = await handler(context, arguments)
                    if context.investigation is not None and tool_id == "read_file" and isinstance(payload.get("data"), dict):
                        payload["data"] = access.capture_local(payload["data"])
                    cp = access.checkpoints.load(access.matter_id, access.run_id)
                    cp.setdefault("tool_results", {})[tool_key] = payload
                    access.checkpoints.save(access.matter_id, access.run_id, cp, expected_sequence=cp["sequence"])
            else:
                payload = await handler(context, arguments)
            changed_paths = [str(path) for path in payload.get("changed_paths", [])]
            operation_status = str(
                payload.get("operation_status")
                or ("changed" if changed_paths else "no_change")
            )
            matter_state: dict[str, Any] = {}
            available_next_actions: list[str] = []
            if context.matter_id:
                try:
                    matter = context.app.matters.get(context.matter_id)
                    matter_state = {
                        "stage": matter["status"],
                        "next_action": matter["work_state"]["next_action"],
                        "work_state": matter["work_state"],
                        "consistency_issues": matter.get("consistency_issues", []),
                    }
                    available_next_actions = context.app.matters.available_next_actions(matter)
                except (KeyError, ValueError):
                    pass
            operation_result = {
                "action": context.source_action_key or tool_id,
                "source_action_key": context.source_action_key,
                "operation": str(payload.get("operation") or tool_id),
                "status": operation_status,
                "summary": str(payload.get("summary") or f"{tool_id} completed."),
                "matter_id": context.matter_id,
                "entity_refs": list(payload.get("entity_refs", [])),
                "changed_paths": changed_paths,
                "resulting_matter_state": matter_state,
                "available_next_actions": available_next_actions,
                "required_user_action": payload.get("required_user_action"),
                "error": payload.get("error"),
                "recovery": payload.get("recovery"),
                **({"receipt": payload["receipt"]} if payload.get("receipt") else {}),
            }
            return ToolExecutionResult(
                tool=tool_id,
                status="error" if operation_status == "failed" else "success",
                summary=operation_result["summary"],
                data=payload.get("data", payload),
                changed_paths=changed_paths,
                refresh=[str(item) for item in payload.get("refresh", [])],
                operation_result=operation_result,
            )
        except Exception as exc:
            logger.warning("Tool handler failed: %s", type(exc).__name__)
            summary = f"{tool_id} failed: {exc}"
            result = _failed_tool_result(tool_id, context, summary)
            if hasattr(exc, "detail"):
                result.data["conflict"] = exc.detail
                result.operation_result["conflict"] = exc.detail
                result.operation_result["recovery"] = exc.detail.get("proposal_path") or exc.detail.get("proposal_content")
            return result

    def _load(self) -> dict[str, ToolDefinition]:
        fingerprint = self._fingerprint()
        if self._cached_definitions is not None and fingerprint == self._cached_fingerprint:
            return self._cached_definitions
        # The running application owns executable tool capabilities. A vault is
        # content and may contain an older snapshot, so bundled declarations
        # win. Vault-only declarations remain available for registered custom
        # aliases without replacing current built-in schemas.
        definitions = self._load_from(self.app_contract)
        for tool_id, definition in self._load_from(self.vault).items():
            definitions.setdefault(tool_id, definition)
        self._cached_fingerprint = fingerprint
        self._cached_definitions = definitions
        return definitions

    def _fingerprint(self) -> tuple[tuple[str, str, int, int], ...]:
        entries: list[tuple[str, str, int, int]] = []
        for label, source in (("bundled", self.app_contract), ("vault", self.vault)):
            root = source.resolve("00_System/tools")
            if not root.exists():
                entries.append((label, str(source.root), -1, -1))
                continue
            for path in sorted(root.glob("*.md")):
                try:
                    stat = path.stat()
                except OSError:
                    continue
                entries.append((label, source.relative(path), stat.st_mtime_ns, stat.st_size))
            entries.append((label, str(source.root), 0, 0))
        return tuple(entries)

    def allowed_tools(self, agent: AgentDefinition) -> list[str]:
        """Return current app permissions for built-ins and vault permissions for custom agents."""
        path = f"00_System/agents/{agent.agent_id}.md"
        if self.app_contract.exists(path):
            metadata = self.app_contract.read_markdown(path)["metadata"]
            allowed = [str(item) for item in metadata.get("allowed_tools", [])]
        else:
            allowed = list(agent.allowed_tools)
        # Scope declares capability restrictions; it grants no new mutation permission.
        return list(dict.fromkeys([*allowed, "select_conversation_scope"]))

    @staticmethod
    def _load_from(source: VaultService) -> dict[str, ToolDefinition]:
        root = source.resolve("00_System/tools")
        definitions: dict[str, ToolDefinition] = {}
        if not root.exists():
            return definitions
        for path in sorted(root.glob("*.md")):
            try:
                relative_path = source.relative(path)
                document = source.read_markdown(relative_path)
                metadata = document["metadata"]
                if not isinstance(metadata, dict):
                    raise ValueError("Tool metadata is not a mapping")
                tool_id = str(metadata.get("tool_id") or path.stem).strip()
                if not tool_id:
                    raise ValueError("Tool ID is empty")
                parameters = metadata.get("parameters")
                if not isinstance(parameters, dict):
                    parameters = {"type": "object", "properties": {}, "additionalProperties": True}
                definitions[tool_id] = ToolDefinition(
                    tool_id=tool_id,
                    description=str(metadata.get("description") or document["content"][:400]),
                    parameters=parameters,
                    handler=str(metadata.get("handler") or tool_id),
                    path=relative_path,
                )
            except (OSError, UnicodeError, ValueError, TypeError, KeyError, yaml.YAMLError):
                logger.warning("Skipped malformed tool registry entry")
        return definitions


def _failed_tool_result(
    tool_id: str,
    context: ToolExecutionContext,
    error: str,
) -> ToolExecutionResult:
    return ToolExecutionResult(
        tool_id,
        "error",
        error,
        operation_result={
            "action": context.source_action_key or tool_id,
            "source_action_key": context.source_action_key,
            "operation": tool_id,
            "status": "failed",
            "summary": "No workspace change recorded.",
            "matter_id": context.matter_id,
            "entity_refs": [],
            "changed_paths": [],
            "resulting_matter_state": {},
            "available_next_actions": [],
            "required_user_action": None,
            "error": error,
            "recovery": "Review the input and try the action again.",
        },
    )
