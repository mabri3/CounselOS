from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from app.services.vault import VaultService
from app.utils.ids import slugify
from app.utils.time import iso_now


@dataclass
class AgentDefinition:
    agent_id: str
    name: str
    description: str
    instructions: str
    allowed_tools: list[str]
    max_steps: int
    path: str
    audience_id: str = ""
    audience_prompt: str = ""
    schedule_text: str = ""


class AgentRegistry:
    def __init__(self, vault: VaultService, default_max_steps: int = 6):
        self.vault = vault
        self.default_max_steps = default_max_steps

    def list(self) -> list[dict[str, Any]]:
        return [definition.__dict__ for definition in self._load_all().values()]

    def get(self, agent_id: str) -> AgentDefinition:
        agents = self._load_all()
        if agent_id not in agents:
            raise KeyError(f"Agent not found: {agent_id}")
        return agents[agent_id]

    def create(
        self,
        *,
        agent_id: str,
        name: str,
        description: str,
        instructions: str,
        allowed_tools: list[str],
        max_steps: int,
    ) -> dict[str, Any]:
        clean_id = slugify(agent_id, fallback="custom-agent")
        path = f"00_System/agents/{clean_id}.md"
        metadata = {
            "agent_id": clean_id,
            "name": name,
            "description": description,
            "allowed_tools": allowed_tools,
            "max_steps": max_steps,
            "created_at": iso_now(),
            "enabled": True,
        }
        self.vault.write_markdown(path, f"# {name}\n\n{instructions}\n", metadata)
        return {**metadata, "path": path}

    def audiences(self) -> list[dict[str, Any]]:
        path = "00_System/audiences.md"
        if not self.vault.exists(path):
            return []
        audiences = self.vault.read_markdown(path)["metadata"].get("audiences", [])
        return [dict(entry) for entry in audiences if isinstance(entry, dict)]

    def update(self, agent_id: str, **fields: Any) -> dict[str, Any]:
        definition = self.get(agent_id)
        document = self.vault.read_markdown(definition.path)
        metadata = document["metadata"]
        editable = {
            "name",
            "description",
            "allowed_tools",
            "max_steps",
            "audience_id",
            "audience_prompt",
            "schedule_text",
        }
        metadata.update({key: value for key, value in fields.items() if key in editable})

        content = document["content"]
        if "instructions" in fields:
            name = str(metadata.get("name") or definition.name)
            content = f"# {name}\n\n{fields['instructions']}\n"

        self.vault.write_markdown(definition.path, content, metadata)
        return self.get(agent_id).__dict__

    def global_standards(self) -> str:
        path = "00_System/Agents.md"
        return self.vault.read_text(path) if self.vault.exists(path) else ""

    def _load_all(self) -> dict[str, AgentDefinition]:
        root = self.vault.resolve("00_System/agents")
        agents: dict[str, AgentDefinition] = {}
        if not root.exists():
            return agents
        for path in sorted(root.glob("*.md")):
            document = self.vault.read_markdown(self.vault.relative(path))
            metadata = document["metadata"]
            if not metadata.get("enabled", True):
                continue
            agent_id = str(metadata.get("agent_id") or path.stem)
            agents[agent_id] = AgentDefinition(
                agent_id=agent_id,
                name=str(metadata.get("name") or path.stem),
                description=str(metadata.get("description") or ""),
                instructions=document["content"],
                allowed_tools=[str(item) for item in metadata.get("allowed_tools", [])],
                max_steps=int(metadata.get("max_steps", self.default_max_steps)),
                path=self.vault.relative(path),
                audience_id=str(metadata.get("audience_id") or ""),
                audience_prompt=str(metadata.get("audience_prompt") or ""),
                schedule_text=str(metadata.get("schedule_text") or ""),
            )
        return agents
