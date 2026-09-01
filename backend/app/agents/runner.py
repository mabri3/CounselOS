from __future__ import annotations

import json
import re
import hashlib
from copy import deepcopy
from dataclasses import dataclass, field
from typing import Any, Callable

from app.agents.context import ContextBuilder
from app.agents.output import clean_user_facing_reply, correct_unsupported_workspace_claims
from app.agents.registry import AgentDefinition, AgentRegistry
from app.models.api import AppliedSkillSummary, ChatChoice, ChatRequest, ChatResponse, MatterUpdateCard, QuestionCard, ResearchStatusCard, ToolTrace, WorkProductCard
from app.models.awareness import WatchDraftCard, WatchScanCard
from app.providers.base import LLMProvider, ProviderSelection
from app.providers.catalog import ProviderAdapterError
from app.tools.registry import ToolExecutionContext, ToolExecutionResult, ToolRegistry
from app.skills.registry import SkillRegistry


@dataclass
class RunnerExecutionState:
    messages: list[dict[str, Any]] = field(default_factory=list)
    trace: list[ToolTrace] = field(default_factory=list)
    changed_paths: list[str] = field(default_factory=list)
    refresh: list[str] = field(default_factory=list)
    cards: list[Any] = field(default_factory=list)
    completed_mutations: dict[str, dict[str, str]] = field(default_factory=dict)
    useful_content: str = ""


class AgentExecutionError(Exception):
    def __init__(self, state: RunnerExecutionState, safe_detail: str | None = None):
        super().__init__("Agent execution did not finish.")
        self.state = state
        self.safe_detail = safe_detail


@dataclass(frozen=True)
class ResolvedAgentProvider:
    provider: LLMProvider
    selection: ProviderSelection


class AgentRunner:
    def __init__(
        self,
        provider: LLMProvider,
        agents: AgentRegistry,
        tools: ToolRegistry,
        context_builder: ContextBuilder,
        skills: SkillRegistry,
        app_context: Any,
        provider_resolver: Callable[[AgentDefinition], ResolvedAgentProvider] | None = None,
    ):
        self._provider = provider
        self.agents = agents
        self.tools = tools
        self.context_builder = context_builder
        self.skills = skills
        self.app_context = app_context
        self.provider_resolver = provider_resolver

    @property
    def provider(self) -> LLMProvider:
        return self._provider

    @provider.setter
    def provider(self, provider: LLMProvider) -> None:
        """Replace routing with one provider, preserving the existing test seam."""
        self._provider = provider
        self.provider_resolver = None

    def resolve(self, agent_id: str) -> ResolvedAgentProvider:
        """Resolve one provider selection for reuse throughout a single run."""
        return self._resolve_agent(self.agents.get(agent_id))

    def _resolve_agent(self, agent: AgentDefinition) -> ResolvedAgentProvider:
        if self.provider_resolver is not None:
            resolved = self.provider_resolver(agent)
            if resolved.selection.agent_id != agent.agent_id:
                raise ValueError("The resolved provider selection does not match the agent.")
            return resolved
        return ResolvedAgentProvider(
            provider=self.provider,
            selection=ProviderSelection(
                agent_id=agent.agent_id,
                provider=agent.provider or "workspace_default",
                model=agent.model,
                reasoning_effort=agent.reasoning_effort,
            ),
        )

    async def run(
        self,
        request: ChatRequest,
        *,
        execution_state: RunnerExecutionState | None = None,
        checkpoint: Callable[[RunnerExecutionState], None] | None = None,
        resolved_provider: ResolvedAgentProvider | None = None,
    ) -> ChatResponse:
        state = execution_state or RunnerExecutionState()
        try:
            return await self._run(
                request,
                state=state,
                checkpoint=checkpoint,
                resolved_provider=resolved_provider,
            )
        except AgentExecutionError:
            raise
        except Exception as exc:
            safe_detail = str(exc) if isinstance(exc, ProviderAdapterError) else None
            raise AgentExecutionError(state, safe_detail=safe_detail) from exc

    async def _run(
        self,
        request: ChatRequest,
        *,
        state: RunnerExecutionState,
        checkpoint: Callable[[RunnerExecutionState], None] | None,
        resolved_provider: ResolvedAgentProvider | None,
    ) -> ChatResponse:
        review_author = _resolved_review_author(request)
        agent = self.agents.get(request.agent_id)
        resolved = resolved_provider or self._resolve_agent(agent)
        if resolved.selection.agent_id != agent.agent_id:
            raise ValueError("The resolved provider selection does not match the requested agent.")
        provider = resolved.provider
        skill = self.skills.get(request.skill_id) if request.skill_id else None
        applied_skills = (
            [AppliedSkillSummary(skill_id=skill.skill_id, name=skill.name)] if skill else []
        )
        messages: list[dict[str, Any]] = [
            {
                "role": "system",
                "content": self.context_builder.build(
                    agent,
                    matter_id=request.matter_id,
                    active_file=request.active_file,
                    skill=skill,
                ),
            }
        ]
        messages.extend(message.model_dump() for message in request.history[-12:])
        messages.append({"role": "user", "content": request.message})
        state.messages = messages
        decision_recording_allowed = _explicit_decision_recording_requested(request.message)
        lifecycle_permissions = _lifecycle_permissions(request.message)
        watch_activation_allowed = _explicit_watch_activation_requested(request)
        provider_tools = self.tools.provider_tools(agent)
        if not decision_recording_allowed:
            provider_tools = [
                tool for tool in provider_tools
                if tool.get("function", {}).get("name") != "record_decision"
            ]
        if not watch_activation_allowed:
            provider_tools = [
                tool for tool in provider_tools
                if tool.get("function", {}).get("name") != "activate_watch"
            ]
        provider_tools = [
            tool for tool in provider_tools
            if tool.get("function", {}).get("name") not in lifecycle_permissions
            or lifecycle_permissions[tool["function"]["name"]]
        ]
        trace = state.trace
        changed_paths = state.changed_paths
        refresh = state.refresh
        cards = state.cards
        if not cards:
            cards.extend(_cards_for(request))
        intake_structure_retry = False

        if request.card_action and request.card_action.action in {"save_draft", "change_something"}:
            reply = (
                "The Watch is saved as a disabled draft. No schedule was created."
                if request.card_action.action == "save_draft"
                else (
                    f"What should the {request.card_action.values[0]} be?"
                    if request.card_action.values
                    else "What would you like to change? I will update one material part at a time."
                )
            )
            return ChatResponse(
                reply=reply, cards=cards, applied_skills=applied_skills, review_author=review_author,
            )

        direct_action = _watch_card_tool(request)
        if direct_action:
            tool_name, arguments = direct_action
            normalized_arguments = _normalized_tool_arguments(
                self.tools, tool_name, arguments, matter_id=request.matter_id
            )
            fingerprint = _tool_fingerprint(tool_name, normalized_arguments)
            result = await self.tools.execute(
                agent,
                ToolExecutionContext(
                    app=self.app_context,
                    matter_id=request.matter_id,
                    source_action_key=_tool_source_action_key(
                        request.source_action_key, fingerprint
                    ),
                ),
                tool_name,
                arguments,
            )
            trace.append(_tool_trace(self.tools, tool_name, result))
            changed_paths.extend(result.changed_paths)
            refresh.extend(result.refresh)
            cards.extend(_cards_from_tool_data(result.data))
            return ChatResponse(
                reply=result.summary,
                trace=trace, changed_paths=_unique(changed_paths), refresh=_unique(refresh),
                cards=cards, applied_skills=applied_skills, review_author=review_author,
            )

        for _ in range(agent.max_steps):
            reply = await provider.complete(messages, provider_tools)
            if not isinstance(reply.content, str) or not isinstance(reply.tool_calls, list):
                raise ValueError("The provider returned a malformed reply.")
            user_facing_content = clean_user_facing_reply(reply.content)
            if not reply.tool_calls:
                user_facing_content = correct_unsupported_workspace_claims(
                    user_facing_content,
                    _successful_mutation_tools(trace),
                )
            if user_facing_content:
                state.useful_content = user_facing_content
                if checkpoint:
                    checkpoint(state)
            if not reply.tool_calls:
                intake_updated = any(
                    item.tool == "update_matter_intake" and item.status == "success"
                    for item in trace
                )
                intake_question_ready = any(isinstance(card, QuestionCard) for card in cards)
                if (
                    agent.agent_id == "intake-agent"
                    and request.matter_id
                    and not intake_updated
                    and not intake_question_ready
                ):
                    if not intake_structure_retry:
                        messages.append({"role": "assistant", "content": user_facing_content or None})
                        messages.append({
                            "role": "system",
                            "content": (
                                "This intake turn is not complete. Use update_matter_intake now. "
                                "If intake remains active, include at least one structured next_questions item. "
                                "If no material question remains, set intake_state to complete. "
                                "Do not ask an intake question only in prose."
                            ),
                        })
                        intake_structure_retry = True
                        continue
                    return ChatResponse(
                        reply="The intake turn could not be saved or presented as a structured question. Please retry.",
                        trace=trace,
                        changed_paths=_unique(changed_paths),
                        refresh=_unique(refresh),
                        cards=cards,
                        applied_skills=applied_skills,
                        review_author=review_author,
                    )
                return ChatResponse(
                    reply=user_facing_content or "I completed the available work but did not receive a final model response.",
                    trace=trace,
                    changed_paths=_unique(changed_paths),
                    refresh=_unique(refresh),
                    cards=cards,
                    applied_skills=applied_skills,
                    review_author=review_author,
                )
            messages.append(
                {
                    "role": "assistant",
                    "content": user_facing_content or None,
                    "tool_calls": [
                        {
                            "id": call.id,
                            "type": "function",
                            "function": {"name": call.name, "arguments": json.dumps(call.arguments)},
                        }
                        for call in reply.tool_calls
                    ],
                }
            )
            for call in reply.tool_calls:
                normalized_arguments = _normalized_tool_arguments(
                    self.tools, call.name, call.arguments, matter_id=request.matter_id
                )
                fingerprint = _tool_fingerprint(call.name, normalized_arguments)
                mutation = _is_mutation_tool(self.tools, call.name)
                completed = state.completed_mutations.get(fingerprint) if mutation else None
                if completed:
                    result = ToolExecutionResult(
                        tool=call.name,
                        status="success",
                        summary=f"Already completed in this chat run: {completed['summary']}",
                    )
                elif call.name in lifecycle_permissions and not lifecycle_permissions[call.name]:
                    result = ToolExecutionResult(
                        tool=call.name,
                        status="error",
                        summary=f"{call.name} was not allowed because the current message did not explicitly request that separate action.",
                    )
                elif call.name == "activate_watch" and not watch_activation_allowed:
                    result = ToolExecutionResult(
                        tool=call.name,
                        status="error",
                        summary=(
                            "The Watch was not started because activation was not explicit. "
                            "It remains a disabled draft."
                        ),
                    )
                elif call.name == "record_decision" and not decision_recording_allowed:
                    result = ToolExecutionResult(
                        tool=call.name,
                        status="error",
                        summary=(
                            "A durable decision was not recorded because the user did not explicitly "
                            "ask to record one. Recommend a path and ask whether it should become durable."
                        ),
                    )
                else:
                    result = await self.tools.execute(
                        agent,
                        ToolExecutionContext(
                            app=self.app_context,
                            matter_id=request.matter_id,
                            active_file=request.active_file,
                            review_author=review_author,
                            lawyer_author=request.lawyer_author,
                            source_action_key=_tool_source_action_key(
                                request.source_action_key, fingerprint
                            ),
                            trusted_source_id=request.trusted_source_id,
                            expected_dossier_hash=request.expected_dossier_hash,
                        ),
                        call.name,
                        call.arguments,
                    )
                trace.append(_tool_trace(self.tools, call.name, result, completed=bool(completed)))
                if result.status == "success" and mutation and not completed:
                    state.completed_mutations[fingerprint] = {
                        "tool": call.name,
                        "summary": result.summary,
                    }
                    if checkpoint:
                        checkpoint(state)
                if (
                    result.status == "success"
                    and review_author != "Themis.ai"
                    and request.lawyer_author
                    and review_author == request.lawyer_author
                    and result.changed_paths
                ):
                    trace.append(ToolTrace(
                        tool=call.name,
                        status="success",
                        summary="Created by Themis.ai at the lawyer's direction",
                    ))
                changed_paths.extend(result.changed_paths)
                refresh.extend(result.refresh)
                cards.extend(_cards_from_tool_data(result.data))
                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": call.id,
                        "name": call.name,
                        "content": json.dumps(
                            {
                                "summary": result.summary,
                                "status": result.status,
                                "data": result.data,
                            },
                            default=str,
                        ),
                    }
                )
        messages.append(
            {
                "role": "system",
                "content": (
                    "The tool-step limit has been reached. Do not call more tools. Deliver the best useful answer or work "
                    "product available from the conversation and tool observations. State only material remaining gaps."
                ),
            }
        )
        final_reply = await provider.complete(messages, None)
        return ChatResponse(
            reply=(
                correct_unsupported_workspace_claims(
                    clean_user_facing_reply(final_reply.content),
                    _successful_mutation_tools(trace),
                )
                or "The available actions are complete; use the trace and updated matter state as the working result."
            ),
            trace=trace,
            changed_paths=_unique(changed_paths),
            refresh=_unique(refresh),
            cards=cards,
            applied_skills=applied_skills,
            review_author=review_author,
        )


def _unique(values: list[str]) -> list[str]:
    return list(dict.fromkeys(values))


def _successful_mutation_tools(trace: list[ToolTrace]) -> set[str]:
    return {
        item.tool
        for item in trace
        if item.status == "success" and item.mutation_status in {"changed", "no_change"}
    }


def _tool_fingerprint(name: str, arguments: dict[str, Any]) -> str:
    normalized = json.dumps(arguments, sort_keys=True, separators=(",", ":"), default=str)
    return hashlib.sha256(f"{name}:{normalized}".encode("utf-8")).hexdigest()


_HANDLER_ARGUMENT_DEFAULTS: dict[str, dict[str, Any]] = {
    "create_work_item": {
        "description": "",
        "item_type": "question",
        "status": "open",
        "priority": "normal",
        "owner": "",
        "due_at": None,
        "required": False,
        "issue_id": None,
    },
    "record_decision": {
        "rationale": "",
        "decision_maker": "User instructed the chat",
        "decision_type": "legal_decision",
        "conditions": [],
        "linked_paths": [],
        "next_review_at": None,
        "risk_level": "unknown",
    },
    "run_research": {"question": ""},
    "save_work_product": {"existing_draft_path": ""},
    "update_matter_intake": {
        "reported_facts": [],
        "issues": [],
        "assumptions": [],
        "material_missing_facts": [],
        "human_questions": [],
        "public_research_questions": [],
        "next_questions": [],
        "next_question": None,
        "intake_state": "active",
        "dossier_orientation": None,
    },
}


def _normalized_tool_arguments(
    tools: ToolRegistry,
    name: str,
    arguments: dict[str, Any],
    *,
    matter_id: str | None,
) -> dict[str, Any]:
    """Return the effective arguments used to identify one retry-safe action."""
    normalized = deepcopy(arguments)
    for key, value in _HANDLER_ARGUMENT_DEFAULTS.get(name, {}).items():
        normalized.setdefault(key, deepcopy(value))
    definition = next((item for item in tools.list() if item.get("tool_id") == name), None)
    if definition:
        _apply_schema_defaults(normalized, definition.get("parameters", {}))
    if matter_id and "matter_id" not in normalized:
        normalized["matter_id"] = matter_id
    return normalized


def _apply_schema_defaults(values: dict[str, Any], schema: dict[str, Any]) -> None:
    for key, property_schema in schema.get("properties", {}).items():
        if key not in values and "default" in property_schema:
            values[key] = deepcopy(property_schema["default"])
        if key in values and isinstance(values[key], dict):
            _apply_schema_defaults(values[key], property_schema)


def _tool_source_action_key(base_key: str | None, fingerprint: str) -> str | None:
    if not base_key:
        return None
    candidate = f"{base_key}:tool:{fingerprint[:24]}"
    if len(candidate) <= 256:
        return candidate
    digest = hashlib.sha256(candidate.encode("utf-8")).hexdigest()
    return f"chat-action:{digest}"


def _is_mutation_tool(tools: ToolRegistry, name: str) -> bool:
    read_only_handlers = {"audit_decisions", "list_files", "read_file", "search_vault"}
    definition = next((item for item in tools.list() if item.get("tool_id") == name), None)
    return bool(definition and definition.get("handler") not in read_only_handlers)


def _tool_trace(
    tools: ToolRegistry,
    tool_name: str,
    result: ToolExecutionResult,
    *,
    completed: bool = False,
) -> ToolTrace:
    mutation_status = None
    if _is_mutation_tool(tools, tool_name):
        if result.status != "success":
            mutation_status = "failed"
        elif result.changed_paths or completed:
            mutation_status = "changed"
        else:
            mutation_status = "no_change"
    return ToolTrace(
        tool=tool_name,
        status="success" if result.status == "success" else "error",
        summary=result.summary,
        mutation_status=mutation_status,
    )


def _resolved_review_author(request: ChatRequest) -> str:
    normalized = " ".join(request.message.lower().split())
    if any(phrase in normalized for phrase in (
        "use themis as the review author",
        "use themis.ai as the review author",
    )):
        return "Themis.ai"
    if any(phrase in normalized for phrase in (
        "make these changes in my name",
        "make these comments in my name",
    )):
        author = (request.lawyer_author or request.review_author or "Themis.ai").strip() or "Themis.ai"
    else:
        author = (request.review_author or "Themis.ai").strip() or "Themis.ai"
    return "Themis.ai" if author.casefold() in {"themis", "themis.ai"} else author


def _explicit_decision_recording_requested(message: str) -> bool:
    normalized = " ".join(message.lower().split())
    if re.search(r"\b(do not|don't|dont|never)\b.{0,40}\b(record|save|log|capture|memorialize)\b", normalized):
        return False
    if re.search(r"\bshould (this|that|it|i|we)\b.{0,40}\b(durable|record|decision)\b", normalized):
        return False
    if re.search(r"\b(make|treat)\b.{0,40}\bdurable\b", normalized):
        return True
    return bool(
        re.search(
            r"\b(record|save|log|capture|memorialize)\b.{0,60}\b(decision|policy|position|risk acceptance)\b",
            normalized,
        )
    )


def _explicit_watch_activation_requested(request: ChatRequest) -> bool:
    if request.card_action and request.card_action.action == "start_watch":
        return True
    normalized = " ".join(request.message.lower().split())
    if re.search(r"\b(do not|don't|dont|not yet)\b.{0,40}\b(start|activate|enable)\b", normalized):
        return False
    return bool(re.search(r"\b(start|activate|enable)\b.{0,50}\b(this |the |my )?watch\b", normalized))


def _lifecycle_permissions(message: str) -> dict[str, bool]:
    normalized = " ".join(message.lower().split())
    # These state changes need a direct instruction from the current user. Anchoring
    # prevents permissions from being granted by pasted text, quotations, advice
    # questions, or hypothetical clauses later in the message.
    direct = normalized.strip()
    if (
        "?" in message
        or any(mark in message for mark in ('"', "“", "”", "'"))
        or re.search(r"\b(if|would|could|might|hypothetically|suppose)\b", direct)
    ):
        direct = ""
    prefix = r"^(?:please\s+|kindly\s+)?"
    return {
        "approve_response": bool(re.search(prefix + r"approve\b.{0,40}\b(response|final|answer|it)\b", direct)),
        "mark_response_sent": bool(re.search(prefix + r"(mark|record|log)\b.{0,50}\b(sent|delivered|delivery)\b", direct)),
        "close_matter": bool(re.search(prefix + r"(close|finish)\b.{0,30}\b(this |the )?matter\b", direct)),
    }


def _cards_for(request: ChatRequest) -> list[QuestionCard | MatterUpdateCard]:
    if not request.matter_id:
        return []
    if request.card_action and request.card_action.card_id.startswith("intake-"):
        if request.card_action.action == "stop":
            return [MatterUpdateCard(action_id=request.card_action.card_id, summary="Intake questions stopped", changed_sections=["Working ask"], can_edit=False)]
        if request.card_action.action in {"answer", "answer_set", "skip"}:
            return [MatterUpdateCard(action_id=request.card_action.card_id, summary="Matter updated", changed_sections=["Facts", "Missing information"])]
    if request.attachments and not request.message.strip():
        count = len(request.attachments)
        label = "this file" if count == 1 else ("these files" if count <= 3 else "this document set")
        return [QuestionCard(question_id=f"upload-{request.attachments[0].source_id}", text=f"What would you like me to do with {label}?", reason="Your instruction controls whether I only summarize the sources or propose matter changes.", selection_mode="single", choices=[ChatChoice(value="summarize", label="Tell me what is here", suggested=True), ChatChoice(value="compare", label="Compare or find conflicts"), ChatChoice(value="updates", label="Propose matter updates"), ChatChoice(value="draft", label="Draft work product"), ChatChoice(value="research", label="Research from these sources"), ChatChoice(value="other", label="Something else")])]
    return []


def _watch_card_tool(request: ChatRequest) -> tuple[str, dict[str, Any]] | None:
    action = request.card_action
    if not action:
        return None
    mapping = {"scan_now": "scan_watch", "scan_again": "scan_watch", "start_watch": "activate_watch"}
    tool_name = mapping.get(action.action)
    if not tool_name:
        return None
    watch_id = _watch_id_from_card(action.card_id, action.values)
    return tool_name, {"watch_id": watch_id}


def _watch_id_from_card(card_id: str, values: list[str]) -> str:
    if values and values[0].startswith("WATCH-"):
        return values[0]
    for part in card_id.split(":"):
        if part.startswith("WATCH-"):
            return part
    raise ValueError("The Watch card does not identify a Watch.")


def _cards_from_tool_data(data: dict[str, Any]) -> list[Any]:
    if isinstance(data, dict) and data.get("record_type") == "research_run":
        return [ResearchStatusCard.model_validate(data)]
    if (
        isinstance(data, dict)
        and data.get("record_type") == "work_product"
        and all(data.get(key) for key in ("title", "vault_path", "state"))
        and data.get("state") in {"draft", "final"}
    ):
        return [WorkProductCard.model_validate(data)]
    intake_cards: list[Any] = []
    if isinstance(data, dict):
        if isinstance(data.get("questions"), list):
            intake_cards.extend(
                QuestionCard.model_validate(question)
                for question in data["questions"]
                if isinstance(question, dict)
            )
        if not intake_cards and isinstance(data.get("question"), dict):
            intake_cards.append(QuestionCard.model_validate(data["question"]))
        if isinstance(data.get("matter_update"), dict):
            intake_cards.append(MatterUpdateCard.model_validate(data["matter_update"]))
    if intake_cards:
        return intake_cards
    card = data.get("card") if isinstance(data, dict) else None
    if not isinstance(card, dict):
        return []
    if card.get("type") == "watch_draft":
        return [WatchDraftCard.model_validate(card)]
    if card.get("type") == "watch_scan":
        return [WatchScanCard.model_validate(card)]
    return []
