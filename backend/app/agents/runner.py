from __future__ import annotations

import json
from typing import Any

from app.agents.context import ContextBuilder
from app.agents.registry import AgentRegistry
from app.models.api import ChatRequest, ChatResponse, ToolTrace
from app.providers.base import LLMProvider
from app.tools.registry import ToolExecutionContext, ToolRegistry


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
        provider_tools = self.tools.provider_tools(agent)
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
        )


def _unique(values: list[str]) -> list[str]:
    return list(dict.fromkeys(values))
