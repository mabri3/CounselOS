from __future__ import annotations

import json
import re
from typing import Any

from app.agents.context import ContextBuilder
from app.agents.registry import AgentRegistry
from app.models.api import AppliedSkillSummary, ChatChoice, ChatRequest, ChatResponse, MatterUpdateCard, QuestionCard, ToolTrace
from app.models.awareness import WatchDraftCard, WatchScanCard
from app.providers.base import LLMProvider
from app.tools.registry import ToolExecutionContext, ToolExecutionResult, ToolRegistry
from app.skills.registry import SkillRegistry


class AgentRunner:
    def __init__(
        self,
        provider: LLMProvider,
        agents: AgentRegistry,
        tools: ToolRegistry,
        context_builder: ContextBuilder,
        skills: SkillRegistry,
        app_context: Any,
    ):
        self.provider = provider
        self.agents = agents
        self.tools = tools
        self.context_builder = context_builder
        self.skills = skills
        self.app_context = app_context

    async def run(self, request: ChatRequest) -> ChatResponse:
        review_author = _resolved_review_author(request)
        agent = self.agents.get(request.agent_id)
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
        decision_recording_allowed = _explicit_decision_recording_requested(request.message)
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
        trace: list[ToolTrace] = []
        changed_paths: list[str] = []
        refresh: list[str] = []
        cards: list[QuestionCard | MatterUpdateCard | WatchDraftCard | WatchScanCard] = list(_cards_for(request))

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
            result = await self.tools.execute(
                agent,
                ToolExecutionContext(app=self.app_context, matter_id=request.matter_id),
                tool_name,
                arguments,
            )
            trace.append(ToolTrace(tool=tool_name, status=result.status, summary=result.summary))
            changed_paths.extend(result.changed_paths)
            refresh.extend(result.refresh)
            card = _watch_card_from_data(result.data)
            if card:
                cards.append(card)
            return ChatResponse(
                reply=result.summary,
                trace=trace, changed_paths=_unique(changed_paths), refresh=_unique(refresh),
                cards=cards, applied_skills=applied_skills, review_author=review_author,
            )

        for _ in range(agent.max_steps):
            reply = await self.provider.complete(messages, provider_tools)
            if not reply.tool_calls:
                return ChatResponse(
                    reply=reply.content or "I completed the available work but did not receive a final model response.",
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
                    "content": reply.content or None,
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
                if call.name == "activate_watch" and not watch_activation_allowed:
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
                        ),
                        call.name,
                        call.arguments,
                    )
                trace.append(
                    ToolTrace(
                        tool=call.name,
                        status="success" if result.status == "success" else "error",
                        summary=result.summary,
                    )
                )
                if (
                    result.status == "success"
                    and review_author != "Themis"
                    and request.lawyer_author
                    and review_author == request.lawyer_author
                    and result.changed_paths
                ):
                    trace.append(ToolTrace(
                        tool=call.name,
                        status="success",
                        summary="Created by Themis at the lawyer's direction",
                    ))
                changed_paths.extend(result.changed_paths)
                refresh.extend(result.refresh)
                card = _watch_card_from_data(result.data)
                if card:
                    cards.append(card)
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
        final_reply = await self.provider.complete(messages, None)
        return ChatResponse(
            reply=final_reply.content or "The available actions are complete; use the trace and updated matter state as the working result.",
            trace=trace,
            changed_paths=_unique(changed_paths),
            refresh=_unique(refresh),
            cards=cards,
            applied_skills=applied_skills,
            review_author=review_author,
        )


def _unique(values: list[str]) -> list[str]:
    return list(dict.fromkeys(values))


def _resolved_review_author(request: ChatRequest) -> str:
    normalized = " ".join(request.message.lower().split())
    if "use themis as the review author" in normalized:
        return "Themis"
    if any(phrase in normalized for phrase in (
        "make these changes in my name",
        "make these comments in my name",
    )):
        return (request.lawyer_author or request.review_author or "Themis").strip() or "Themis"
    return (request.review_author or "Themis").strip() or "Themis"


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


def _cards_for(request: ChatRequest) -> list[QuestionCard | MatterUpdateCard]:
    if not request.matter_id:
        return []
    if request.card_action:
        if request.card_action.action == "stop":
            return [MatterUpdateCard(action_id=request.card_action.card_id, summary="Intake questions stopped", changed_sections=["Working ask"], can_edit=False)]
        if request.card_action.action in {"answer", "skip"}:
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


def _watch_card_from_data(data: dict[str, Any]) -> WatchDraftCard | WatchScanCard | None:
    card = data.get("card") if isinstance(data, dict) else None
    if not isinstance(card, dict):
        return None
    if card.get("type") == "watch_draft":
        return WatchDraftCard.model_validate(card)
    if card.get("type") == "watch_scan":
        return WatchScanCard.model_validate(card)
    return None
