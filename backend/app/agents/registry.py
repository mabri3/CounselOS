from __future__ import annotations

from dataclasses import dataclass
import logging
from pathlib import Path
from typing import Any

import yaml

from app.services.vault import VaultService
from app.utils.ids import slugify
from app.utils.time import iso_now


APP_CONTRACT_ROOT = Path(__file__).resolve().parents[1] / "blank_vault_template"
logger = logging.getLogger(__name__)


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
    provider: str = ""
    model: str = ""
    reasoning_effort: str = ""


class AgentRegistry:
    def __init__(self, vault: VaultService, default_max_steps: int = 6):
        self.vault = vault
        self.default_max_steps = default_max_steps
        self.app_contract = VaultService(APP_CONTRACT_ROOT)
        self._cached_agents: dict[str, AgentDefinition] | None = None
        self._cached_fingerprint: tuple[tuple[str, str, int, int], ...] | None = None

    def list(self) -> list[dict[str, Any]]:
        return [
            {
                **definition.__dict__,
                "runtime_managed": self.is_runtime_managed(definition.agent_id),
            }
            for definition in self._load_all().values()
        ]

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
        provider: str | None = None,
        model: str | None = None,
        reasoning_effort: str | None = None,
    ) -> dict[str, Any]:
        self._validate_tool_ids(allowed_tools)
        clean_id = slugify(agent_id, fallback="custom-agent")
        path = f"00_System/agents/{clean_id}.md"
        if self.is_runtime_managed(clean_id) or self.vault.exists(path):
            raise ValueError(f"Agent ID already exists or is runtime-managed: {clean_id}")
        metadata = {
            "agent_id": clean_id,
            "name": name,
            "description": description,
            "allowed_tools": allowed_tools,
            "max_steps": max_steps,
            "created_at": iso_now(),
            "enabled": True,
        }
        metadata.update(_selection_metadata(provider, model, reasoning_effort))
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
            "provider",
            "model",
            "reasoning_effort",
        }
        updates = {key: value for key, value in fields.items() if key in editable}
        if "allowed_tools" in updates:
            self._validate_tool_ids(list(updates["allowed_tools"] or []))
        if self.is_runtime_managed(agent_id):
            updates.pop("allowed_tools", None)
            updates.pop("max_steps", None)
        for key in ("provider", "model", "reasoning_effort"):
            if key not in updates:
                continue
            normalized = str(updates.pop(key) or "").strip()
            if normalized:
                metadata[key] = normalized
            else:
                metadata.pop(key, None)
        metadata.update(updates)

        content = document["content"]
        if "instructions" in fields:
            name = str(metadata.get("name") or definition.name)
            instructions = str(fields["instructions"]).strip()
            lines = instructions.splitlines()
            if lines and lines[0].startswith("# "):
                instructions = "\n".join(lines[1:]).lstrip()
            content = f"# {name}\n\n{instructions}\n"

        self.vault.write_markdown(definition.path, content, metadata)
        saved = self.get(agent_id)
        return {
            **saved.__dict__,
            "runtime_managed": self.is_runtime_managed(agent_id),
        }

    def global_standards(self) -> str:
        path = "00_System/Agents.md"
        return self.vault.read_text(path) if self.vault.exists(path) else ""

    def is_runtime_managed(self, agent_id: str) -> bool:
        return self.app_contract.exists(f"00_System/agents/{agent_id}.md")

    def runtime_contract(self, agent_id: str) -> str:
        path = f"00_System/agents/{agent_id}.md"
        if not self.app_contract.exists(path):
            return ""
        return self.app_contract.read_markdown(path)["content"]

    def _runtime_metadata(self, agent_id: str) -> dict[str, Any]:
        path = f"00_System/agents/{agent_id}.md"
        if not self.app_contract.exists(path):
            return {}
        return self.app_contract.read_markdown(path)["metadata"]

    def _load_all(self) -> dict[str, AgentDefinition]:
        fingerprint = self._fingerprint()
        if self._cached_agents is not None and fingerprint == self._cached_fingerprint:
            return self._cached_agents
        root = self.vault.resolve("00_System/agents")
        agents: dict[str, AgentDefinition] = {}
        if not root.exists():
            self._cached_fingerprint = fingerprint
            self._cached_agents = agents
            return agents
        for path in sorted(root.glob("*.md")):
            try:
                document = self.vault.read_markdown(self.vault.relative(path))
                metadata = document["metadata"]
                if not isinstance(metadata, dict):
                    raise ValueError("Agent metadata is not a mapping")
                if not metadata.get("enabled", True):
                    continue
                agent_id = str(metadata.get("agent_id") or path.stem).strip()
                if not agent_id:
                    raise ValueError("Agent ID is empty")
                runtime_metadata = self._runtime_metadata(agent_id)
                raw_tools = runtime_metadata.get("allowed_tools", metadata.get("allowed_tools", []))
                if not isinstance(raw_tools, list):
                    raise ValueError("Agent tools are not a list")
                agents[agent_id] = AgentDefinition(
                    agent_id=agent_id,
                    name=str(metadata.get("name") or path.stem),
                    description=str(metadata.get("description") or ""),
                    instructions=document["content"],
                    allowed_tools=[str(item) for item in raw_tools],
                    max_steps=int(runtime_metadata.get(
                        "max_steps", metadata.get("max_steps", self.default_max_steps)
                    )),
                    path=self.vault.relative(path),
                    audience_id=str(metadata.get("audience_id") or ""),
                    audience_prompt=str(metadata.get("audience_prompt") or ""),
                    provider=str(metadata.get("provider") or "").strip(),
                    model=str(metadata.get("model") or "").strip(),
                    reasoning_effort=str(metadata.get("reasoning_effort") or "").strip(),
                )
            except (OSError, UnicodeError, ValueError, TypeError, KeyError, yaml.YAMLError):
                logger.warning("Skipped malformed agent registry entry")
        self._cached_fingerprint = fingerprint
        self._cached_agents = agents
        return agents

    def _fingerprint(self) -> tuple[tuple[str, str, int, int], ...]:
        entries: list[tuple[str, str, int, int]] = []
        for label, source in (("bundled", self.app_contract), ("vault", self.vault)):
            root = source.resolve("00_System/agents")
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

    def _validate_tool_ids(self, allowed_tools: list[str]) -> None:
        unknown = sorted(set(str(tool_id) for tool_id in allowed_tools) - self._known_tool_ids())
        if unknown:
            raise ValueError(f"Unknown tool IDs: {', '.join(unknown)}")

    def _known_tool_ids(self) -> set[str]:
        known: set[str] = set()
        for source in (self.app_contract, self.vault):
            root = source.resolve("00_System/tools")
            if not root.exists():
                continue
            for path in sorted(root.glob("*.md")):
                try:
                    document = source.read_markdown(source.relative(path))
                    metadata = document.get("metadata")
                    if isinstance(metadata, dict):
                        tool_id = str(metadata.get("tool_id") or path.stem).strip()
                        if tool_id:
                            known.add(tool_id)
                except (OSError, UnicodeError, ValueError, TypeError, KeyError, yaml.YAMLError):
                    logger.warning("Skipped malformed tool registry entry")
        return known


def _selection_metadata(
    provider: str | None,
    model: str | None,
    reasoning_effort: str | None,
) -> dict[str, str]:
    values = {
        "provider": provider,
        "model": model,
        "reasoning_effort": reasoning_effort,
    }
    return {
        key: normalized
        for key, value in values.items()
        if (normalized := str(value or "").strip())
    }
