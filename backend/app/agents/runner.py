from __future__ import annotations

import json
import re
from typing import Any

from app.agents.context import ContextBuilder
from app.agents.registry import AgentRegistry
from app.models.api import ChatChoice, ChatRequest, ChatResponse, MatterUpdateCard, QuestionCard, ToolTrace
from app.providers.base import LLMProvider
from app.tools.registry import ToolExecutionContext, ToolExecutionResult, ToolRegistry


class AgentRunner:
    def __init__(
        self,
        provider: LLMProvider,
        agents: AgentRegistry,
        tools: ToolRegistry,
        context_builder: ContextBuilder,
        app_context: Any,
    ):
        self.provider = provider
        self.agents = agents
        self.tools = tools
        self.context_builder = context_builder
        self.app_context = app_context

    async def run(self, request: ChatRequest) -> ChatResponse:
        agent = self.agents.get(request.agent_id)
        messages: list[dict[str, Any]] = [
            {
                "role": "system",
                "content": self.context_builder.build(
                    agent,
                    matter_id=request.matter_id,
                    active_file=request.active_file,
                ),
            }
        ]
        messages.extend(message.model_dump() for message in request.history[-12:])
        messages.append({"role": "user", "content": request.message})
        decision_recording_allowed = _explicit_decision_recording_requested(request.message)
        provider_tools = self.tools.provider_tools(agent)
        if not decision_recording_allowed:
            provider_tools = [
                tool for tool in provider_tools
                if tool.get("function", {}).get("name") != "record_decision"
            ]
        trace: list[ToolTrace] = []
        changed_paths: list[str] = []
        refresh: list[str] = []

        for _ in range(agent.max_steps):
            reply = await self.provider.complete(messages, provider_tools)
            if not reply.tool_calls:
                return ChatResponse(
                    reply=reply.content or "I completed the available work but did not receive a final model response.",
                    trace=trace,
                    changed_paths=_unique(changed_paths),
                    refresh=_unique(refresh),
                    cards=_cards_for(request),
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
                if call.name == "record_decision" and not decision_recording_allowed:
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
                changed_paths.extend(result.changed_paths)
                refresh.extend(result.refresh)
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
            cards=_cards_for(request),
        )


def _unique(values: list[str]) -> list[str]:
    return list(dict.fromkeys(values))


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
