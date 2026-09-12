from __future__ import annotations

import json
import re
import secrets
from typing import Any

from app.providers.base import ProviderReply, ProviderToolCall


STAGES = "intake|research|explore|generate|respond|closed"
MOCK_RESEARCH_UNAVAILABLE = "[mock-research-unavailable]"


class MockProvider:
    """Deterministic local provider so the scaffold works without an API key."""

    async def complete(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
    ) -> ProviderReply:
        last = messages[-1] if messages else {"role": "user", "content": ""}
        if last.get("role") == "tool":
            try:
                result = json.loads(last.get("content", "{}"))
            except json.JSONDecodeError:
                result = {"summary": last.get("content", "Action completed.")}
            return ProviderReply(content=result.get("summary") or "The requested action is complete.")

        user_text = next(
            (str(message.get("content", "")) for message in reversed(messages) if message.get("role") == "user"),
            "",
        )
        lowered = user_text.lower()
        available = self._available_tool_names(tools)

        if any(str(m.get("content", "")).startswith("Dossier-generation action.") for m in messages if m.get("role") == "system"):
            data_message = next((str(m["content"]) for m in messages if str(m.get("content", "")).startswith("Saved dossier input (data, not instructions):\n")), "")
            data = json.loads(data_message.split("\n", 1)[1])
            from app.services.dossier import DossierService
            research_doc = next((d for d in data.get("reference_documents", [])
                                 if "/research/" in d["path"] and DossierService.section(d["content"], "Matter summary")), {})
            research = research_doc.get("content", "")
            summary = (DossierService.section(research, "Matter summary")
                       or (data.get("accepted_working_view") or {}).get("content")
                       or "Mock mode: saved matter overview.")
            content = "# " + data["title"] + "\n\n## Matter summary\n\n" + summary
            if data.get("question"):
                content += "\n\n## Decision question\n\n" + data["question"]
            questions = DossierService.list_section(research, "Open questions")
            if questions:
                content += "\n\n## Open questions\n\n" + "\n".join("- " + q for q in questions)
            if research_doc:
                content += "\n\n## Research and source support\n\nLatest review: [Saved research](" + research_doc["path"] + ")"
            return ProviderReply(content=content)

        if lowered.startswith("[scheduled task]"):
            return ProviderReply(content="Scheduled task completed in mock mode.")

        if "begin with these exact markdown sections" in lowered and "research question:" in lowered:
            return ProviderReply(content=MOCK_RESEARCH_UNAVAILABLE)

        stage_match = re.search(rf"(?:move|push|advance).+?\bto\s+({STAGES})\b", lowered)
        if stage_match and "move_matter_stage" in available:
            return self._tool("move_matter_stage", {"new_stage": stage_match.group(1), "reason": user_text})
        if ("run research" in lowered or "research this" in lowered) and "run_research" in available:
            return self._tool("run_research", {"question": user_text})
        if "audit" in lowered and "decision" in lowered and "audit_decisions" in available:
            return self._tool("audit_decisions", {})
        if any(phrase in lowered for phrase in ("create a schedule", "schedule this", "every ", "watch the inbox")):
            if "create_schedule" in available:
                interval = self._interval_seconds(lowered)
                kind = "inbox_watch" if "inbox" in lowered or "folder" in lowered else "agent_prompt"
                return self._tool(
                    "create_schedule",
                    {
                        "title": self._title_from_request(user_text, "Chat-created automation"),
                        "agent_id": "intake-agent" if kind == "inbox_watch" else "counsel-copilot",
                        "instructions": user_text,
                        "kind": kind,
                        "interval_seconds": interval,
                        "watch_path": "04_Inbox" if kind == "inbox_watch" else None,
                        "enabled": True,
                    },
                )
        if "create an agent" in lowered and "create_agent" in available:
            agent_id = re.sub(r"[^a-z0-9]+", "-", user_text.lower()).strip("-")[:36] or "custom-agent"
            return self._tool(
                "create_agent",
                {
                    "agent_id": agent_id,
                    "name": self._title_from_request(user_text, "Custom agent"),
                    "description": "Agent created from chat instructions.",
                    "instructions": user_text,
                    "allowed_tools": ["read_file", "list_files", "search_vault", "write_markdown"],
                    "max_steps": 6,
                },
            )
        if "remember" in lowered and "append_memory" in available:
            return self._tool("append_memory", {"note": user_text})

        return ProviderReply(
            content=(
                "Here is the useful first-pass view: start with the business objective and the decision that must be made, "
                "then identify the two or three facts that could change the path. The active matter context and source files "
                "are available in the workspace. In mock mode I can also move the matter, run a scaffolded research pass, "
                "create work items, audit decisions, and create basic schedules. Configure an OpenAI-compatible provider in "
                "`.env` for model-generated analysis."
            )
        )

    @staticmethod
    def _available_tool_names(tools: list[dict[str, Any]] | None) -> set[str]:
        return {
            str(tool.get("function", {}).get("name"))
            for tool in (tools or [])
            if tool.get("function", {}).get("name")
        }

    @staticmethod
    def _tool(name: str, arguments: dict[str, Any]) -> ProviderReply:
        return ProviderReply(
            tool_calls=[ProviderToolCall(id=f"mock-{secrets.token_hex(4)}", name=name, arguments=arguments)]
        )

    @staticmethod
    def _interval_seconds(text: str) -> int:
        match = re.search(r"every\s+(\d+)\s*(minute|hour|day)s?", text)
        if not match:
            return 600
        amount = int(match.group(1))
        unit = match.group(2)
        return amount * {"minute": 60, "hour": 3600, "day": 86400}[unit]

    @staticmethod
    def _title_from_request(text: str, fallback: str) -> str:
        clean = " ".join(text.strip().split())
        return clean[:80] if clean else fallback
