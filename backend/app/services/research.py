from __future__ import annotations

from collections.abc import Awaitable, Callable
from typing import Any

from app.models.api import ChatRequest, WorkItemCreate
from app.providers.base import LLMProvider
from app.services.index import IndexService
from app.services.matters import MatterService
from app.services.search import SearchService
from app.services.vault import VaultService
from app.utils.ids import new_id
from app.utils.time import iso_now


class ResearchService:
    """Creates a useful, inspectable first-pass research packet."""

    def __init__(
        self,
        vault: VaultService,
        index: IndexService,
        matters: MatterService,
        search: SearchService,
        provider: LLMProvider,
    ):
        self.vault = vault
        self.index = index
        self.matters = matters
        self.search = search
        self.provider = provider
        self._agent_runner: Callable[[ChatRequest], Awaitable[Any]] | None = None

    def bind_agent_runner(self, runner: Callable[[ChatRequest], Awaitable[Any]]) -> None:
        """Bind the configured agent runner after the application container is built."""
        self._agent_runner = runner

    async def run(
        self,
        matter_id: str,
        question: str = "",
        *,
        change_stage: bool = True,
    ) -> dict[str, Any]:
        matter = self.index.get_matter(matter_id)
        if not matter:
            raise KeyError(f"Matter not found: {matter_id}")
        if change_stage and matter["status"] != "research":
            self.matters.move_stage(matter_id, "research", reason="Research run started", actor="research-agent")
            matter = self.index.get_matter(matter_id) or matter

        request_path = f"{matter['path']}/request.md"
        request_text = self.vault.read_markdown(request_path)["content"] if self.vault.exists(request_path) else ""
        research_question = question.strip() or matter["title"]
        try:
            search_result = await self.search.search(research_question, matter_path=matter["path"])
        except Exception as exc:
            search_result = {
                "query": research_question,
                "internal": [],
                "external": [],
                "warning": f"Research search failed: {exc}",
            }
        prompt = self._prompt(matter, request_text, research_question, search_result)
        analysis_warning: str | None = None
        try:
            if self._agent_runner is not None:
                reply = await self._agent_runner(
                    ChatRequest(message=prompt, matter_id=matter_id, agent_id="research-agent")
                )
                body = str(reply.reply).strip()
            else:
                reply = await self.provider.complete(
                    [{"role": "user", "content": prompt}]
                )
                body = reply.content.strip()
        except Exception as exc:
            body = ""
            analysis_warning = f"Research analysis failed: {exc}"
        if not body:
            body = self._fallback_packet(research_question, search_result)
        if analysis_warning:
            body = f"**Generated analysis warning.** {analysis_warning}\n\n{body}"
        packet_id = new_id("RES")
        path = f"{matter['path']}/research/{packet_id}.md"
        source_lines = self._source_lines(search_result)
        self.vault.write_markdown(
            path,
            (
                f"# First-Pass Research Packet\n\n"
                f"## Question\n\n{research_question}\n\n"
                f"## Working Analysis\n\n{body}\n\n"
                f"## Sources surfaced\n\n{source_lines}\n\n"
                f"## Last-mile work for counsel\n\n"
                "- Confirm the facts that could change the recommendation.\n"
                "- Verify any authority that will carry the final answer.\n"
                "- Decide the acceptable risk and the business path.\n"
            ),
            {
                "research_id": packet_id,
                "matter_id": matter_id,
                "question": research_question,
                "status": "first_pass_complete",
                "created_at": iso_now(),
                "external_search_enabled": bool(search_result.get("external")),
                "warning": search_result.get("warning"),
                "analysis_warning": analysis_warning,
            },
        )
        if change_stage:
            self.matters.complete_open_work_items(matter_id, item_type="research")
            self.matters.create_work_item(
                WorkItemCreate(
                    matter_id=matter_id,
                    title="Review the first-pass research packet",
                    description="Confirm the key facts, authorities, and viable paths before generating the response.",
                    item_type="counsel_review",
                    priority=matter.get("priority") or "normal",
                    owner=matter.get("legal_owner") or "",
                    required=True,
                ),
                rebuild=False,
            )
        self.matters.append_event(
            matter_id,
            "research_completed",
            {"title": "First-pass research completed", "path": path},
            rebuild=False,
        )
        self.index.rebuild()
        if change_stage:
            self.matters.move_stage(
                matter_id,
                "explore",
                reason="First-pass research packet is ready for counsel exploration",
                actor="research-agent",
            )
        return {
            "summary": (
                "First-pass research is complete and the matter moved to Explore."
                if change_stage
                else "First-pass research is complete. The matter stage did not change."
            ),
            "path": path,
            "warning": search_result.get("warning"),
            "internal_sources": len(search_result.get("internal", [])),
            "external_sources": len(search_result.get("external", [])),
            "analysis_warning": analysis_warning,
        }

    @staticmethod
    def _prompt(
        matter: dict[str, Any],
        request_text: str,
        question: str,
        search_result: dict[str, Any],
    ) -> str:
        return (
            f"Matter: {matter['title']}\n"
            f"Matter type: {matter.get('matter_type')}\n"
            f"Business objective / original request:\n{request_text[:10000]}\n\n"
            f"Research question:\n{question}\n\n"
            f"Internal search results:\n{search_result.get('internal', [])}\n\n"
            f"External search results:\n{search_result.get('external', [])}\n\n"
            "Return: (1) executive orientation, (2) likely rules/issues, (3) viable paths, "
            "(4) facts that could change the answer, and (5) recommended last-mile verification."
        )

    @staticmethod
    def _source_lines(search_result: dict[str, Any]) -> str:
        lines: list[str] = []
        for item in search_result.get("internal", []):
            lines.append(f"- Internal: `{item['path']}` — {item.get('snippet', '')[:240]}")
        for item in search_result.get("external", []):
            lines.append(f"- External: [{item.get('title', 'Source')}]({item.get('url', '')})")
        if search_result.get("warning"):
            lines.append(f"- Research warning: {search_result['warning']}")
        return "\n".join(lines) or "- No source results were returned. The packet is an issue-spotting scaffold only."

    @staticmethod
    def _fallback_packet(question: str, search_result: dict[str, Any]) -> str:
        internal_count = len(search_result.get("internal", []))
        external_count = len(search_result.get("external", []))
        return (
            f"**Orientation.** The immediate job is to frame the decision behind: {question}\n\n"
            "**Likely workstreams.** Confirm product facts, identify the governing legal framework, test the main path and "
            "one practical alternative, and translate the result into launch conditions or a clear escalation.\n\n"
            f"**Research available.** The system surfaced {internal_count} internal and {external_count} external source(s).\n\n"
            "**Open questions.** Which facts are outcome-determinative? What authority must be verified before counsel relies "
            "on the answer? What risk is the business prepared to accept?"
        )
