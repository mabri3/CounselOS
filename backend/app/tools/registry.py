from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Awaitable, Callable

from app.agents.registry import AgentDefinition
from app.services.vault import VaultService


Handler = Callable[["ToolExecutionContext", dict[str, Any]], Awaitable[dict[str, Any]]]


@dataclass
class ToolExecutionContext:
    app: Any
    matter_id: str | None = None
    active_file: str | None = None
    review_author: str | None = None
    lawyer_author: str | None = None
    trusted_source_id: str | None = None
    expected_dossier_hash: str | None = None


@dataclass
class ToolExecutionResult:
    tool: str
    status: str
    summary: str
    data: dict[str, Any] = field(default_factory=dict)
    changed_paths: list[str] = field(default_factory=list)
    refresh: list[str] = field(default_factory=list)


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

    def list(self) -> list[dict[str, Any]]:
        return [definition.__dict__ for definition in self._load().values()]

    def provider_tools(self, agent: AgentDefinition) -> list[dict[str, Any]]:
        definitions = self._load()
        tools: list[dict[str, Any]] = []
        for tool_id in agent.allowed_tools:
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
        if tool_id not in agent.allowed_tools:
            return ToolExecutionResult(tool_id, "error", f"Agent is not allowed to use {tool_id}.")
        definition = self._load().get(tool_id)
        if not definition:
            return ToolExecutionResult(tool_id, "error", f"Tool is not registered: {tool_id}.")
        handler = self.handlers.get(definition.handler)
        if not handler:
            return ToolExecutionResult(
                tool_id,
                "error",
                f"Tool specification points to an unknown handler: {definition.handler}.",
            )
        try:
            payload = await handler(context, arguments)
            return ToolExecutionResult(
                tool=tool_id,
                status="success",
                summary=str(payload.get("summary") or f"{tool_id} completed."),
                data=payload.get("data", payload),
                changed_paths=[str(path) for path in payload.get("changed_paths", [])],
                refresh=[str(item) for item in payload.get("refresh", [])],
            )
        except Exception as exc:
            return ToolExecutionResult(tool_id, "error", f"{tool_id} failed: {exc}")

    def _load(self) -> dict[str, ToolDefinition]:
        root = self.vault.resolve("00_System/tools")
        definitions: dict[str, ToolDefinition] = {}
        if not root.exists():
            return definitions
        for path in sorted(root.glob("*.md")):
            document = self.vault.read_markdown(self.vault.relative(path))
            metadata = document["metadata"]
            tool_id = str(metadata.get("tool_id") or path.stem)
            parameters = metadata.get("parameters")
            if not isinstance(parameters, dict):
                parameters = {"type": "object", "properties": {}, "additionalProperties": True}
            definitions[tool_id] = ToolDefinition(
                tool_id=tool_id,
                description=str(metadata.get("description") or document["content"][:400]),
                parameters=parameters,
                handler=str(metadata.get("handler") or tool_id),
                path=self.vault.relative(path),
            )
        return definitions
