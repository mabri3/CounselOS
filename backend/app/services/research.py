from __future__ import annotations

from collections.abc import Awaitable, Callable
from typing import Any

from app.models.api import ChatRequest, WorkItemCreate
from app.providers.base import LLMProvider
from app.services.dossier import DossierService
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
        dossiers: DossierService,
    ):
        self.vault = vault
        self.index = index
        self.matters = matters
        self.search = search
        self.provider = provider
        self.dossiers = dossiers
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
        work_item_id: str | None = None,
    ) -> dict[str, Any]:
        matter = self.index.get_matter(matter_id)
        if not matter:
            raise KeyError(f"Matter not found: {matter_id}")
        original_stage = matter["status"]

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
        citation_warning: str | None = None
        try:
            source_lines = self._source_lines(search_result)
        except Exception as exc:
            citation_warning = f"Research citation formatting failed: {exc}"
            source_lines = "- Source details could not be formatted. Review the research warning metadata."
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
                "citation_warning": citation_warning,
            },
        )
        warnings = [warning for warning in (search_result.get("warning"), analysis_warning, citation_warning) if warning]
        orientation_warning: str | None = None
        try:
            generated_summary = DossierService.section(body, "Matter summary")
            generated_question = DossierService.section(body, "Decision question")
            generated_open_questions = DossierService.list_section(body, "Open questions")
            current_orientation = self.dossiers.orientation(matter_id)
            self.dossiers.update_orientation(
                matter_id,
                summary=(
                    generated_summary
                    or current_orientation["summary"]
                    or matter.get("description")
                    or matter["title"]
                ),
                decision_question=(
                    generated_question
                    or current_orientation["decision_question"]
                    or matter.get("next_action")
                    or research_question
                ),
                open_questions=generated_open_questions or current_orientation["open_questions"],
                research_path=path,
            )
        except Exception as exc:
            orientation_warning = f"Matter orientation update failed: {exc}"
            warnings.append(orientation_warning)
            try:
                self.vault.update_markdown(path, metadata_updates={"orientation_warning": orientation_warning})
            except Exception:
                pass
        if change_stage:
            try:
                if work_item_id:
                    self._complete_exact_work_item(matter_id, work_item_id)
                self._upsert_research_review(matter, packet_id, path)
            except Exception as exc:
                warnings.append(f"Research review work item update failed: {exc}")
        try:
            self.matters.append_event(
                matter_id,
                "research_completed",
                {"title": "First-pass research completed", "path": path},
                rebuild=False,
            )
            self.index.rebuild()
        except Exception as exc:
            warnings.append(f"Research completion record update failed: {exc}")
        moved_to_explore = False
        if change_stage and original_stage in {"intake", "research"}:
            try:
                self.matters.move_stage(
                    matter_id,
                    "explore",
                    reason="First-pass research packet is ready for counsel exploration",
                    actor="research-agent",
                )
                moved_to_explore = True
            except Exception as exc:
                warnings.append(f"Matter stage update failed: {exc}")
        if warnings:
            try:
                self.vault.update_markdown(path, metadata_updates={"warnings": warnings})
            except Exception:
                pass
        return {
            "summary": (
                "First-pass research is complete and the matter moved to Explore."
                if moved_to_explore
                else "First-pass research is complete. The matter stage did not change."
            ),
            "path": path,
            "warning": " ".join(warnings) or None,
            "internal_sources": len(search_result.get("internal", [])),
            "external_sources": len(search_result.get("external", [])),
            "analysis_warning": analysis_warning,
            "orientation_warning": orientation_warning,
        }

    def _complete_exact_work_item(self, matter_id: str, work_item_id: str) -> None:
        item = next(
            (item for item in self.index.list_work_items(matter_id) if item["work_item_id"] == work_item_id),
            None,
        )
        if not item or item["status"] in {"done", "closed"}:
            return
        self.vault.update_markdown(
            item["path"],
            metadata_updates={"status": "done", "completed_at": iso_now()},
        )

    def _upsert_research_review(self, matter: dict[str, Any], packet_id: str, path: str) -> None:
        review_item = None
        for item in self.index.list_work_items(matter["matter_id"]):
            if item["item_type"] != "counsel_review" or item["status"] in {"done", "closed"}:
                continue
            metadata = self.vault.read_markdown(item["path"])["metadata"]
            if metadata.get("source_kind") == "research_review":
                review_item = item
                break
        if review_item is None:
            review_item = self.matters.create_work_item(
                WorkItemCreate(
                    matter_id=matter["matter_id"],
                    title="Review the first-pass research packet",
                    description="Confirm the key facts, authorities, and viable paths before generating the response.",
                    item_type="counsel_review",
                    priority=matter.get("priority") or "normal",
                    owner=matter.get("legal_owner") or "",
                    required=True,
                ),
                rebuild=False,
            )
        self.vault.update_markdown(
            review_item["path"],
            metadata_updates={
                "source_kind": "research_review",
                "research_id": packet_id,
                "research_path": path,
            },
        )

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
            "Begin with these exact Markdown sections:\n\n"
            "## Matter summary\n"
            "Write 2–4 short sentences explaining who is involved, what is happening, why counsel is involved, "
            "and the important timing or consequence. Use only matter facts.\n\n"
            "## Decision question\n"
            "Write one direct question that names the concrete choices, scale or deadline when material, and the "
            "business consequence. It must make sense without another file. Avoid generic verbs such as review, "
            "assess, consider, or approve the path. Keep it under 90 words.\n\n"
            "## Open questions\n"
            "List 1–5 material questions that remain unresolved after this review. Include missing business facts and "
            "research questions only when the answer could change the recommendation or decision. Use Markdown bullets.\n\n"
            "Then return: likely rules/issues, viable paths, facts that could change the answer, and recommended "
            "last-mile verification. Keep the recommendation separate from the lawyer's decision."
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
