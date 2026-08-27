from __future__ import annotations

from typing import Any

from app.agents.registry import AgentDefinition, AgentRegistry
from app.services.index import IndexService
from app.services.vault import VaultService


class ContextBuilder:
    CORE_FILES = ["Soul.md", "user.md", "company.md", "memory.md"]

    def __init__(self, vault: VaultService, index: IndexService, agents: AgentRegistry):
        self.vault = vault
        self.index = index
        self.agents = agents

    def build(
        self,
        agent: AgentDefinition,
        *,
        matter_id: str | None = None,
        active_file: str | None = None,
    ) -> str:
        parts = [
            "# Operating standards",
            self.agents.global_standards(),
            f"# Active agent: {agent.name}\n{agent.instructions}",
        ]
        if agent.audience_prompt.strip():
            parts.append(f"# Written for\n{agent.audience_prompt.strip()}")
        for filename in self.CORE_FILES:
            path = f"00_System/{filename}"
            if self.vault.exists(path):
                parts.append(f"# {filename}\n{self.vault.read_text(path)[:12000]}")
        if matter_id:
            matter = self.index.get_matter(matter_id)
            if matter:
                parts.append(f"# Active matter record\n{matter}")
                for filename in ("matter.md", "request.md", "facts.md", "issues.md", "recommendations.md"):
                    path = f"{matter['path']}/{filename}"
                    if self.vault.exists(path):
                        parts.append(f"# {filename}\n{self.vault.read_text(path)[:12000]}")
        if active_file and self.vault.exists(active_file):
            document = self.vault.read_document(active_file)
            parts.append(f"# Active file: {active_file}\n{document.get('content', '')[:18000]}")
        parts.append(
            "# Execution rule\nAnswer directly and usefully. Legal perfection is not a precondition to producing work. "
            "Surface assumptions or missing facts when they matter, but do not block on them. Use tools when an action is requested."
        )
        return "\n\n---\n\n".join(part for part in parts if part.strip())
