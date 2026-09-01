from __future__ import annotations

import re
from collections.abc import Awaitable, Callable
from datetime import UTC, datetime
from typing import Any

from app.intelligence.outbound_policy import OutboundQueryPolicy, PublicResearchQuery
from app.intelligence.polaris import PolarisIntelligenceProvider
from app.models.api import ChatRequest, WorkItemCreate
from app.models.awareness import InternalScope, OutboundWatchQuery, PublicWatchQuery, Watch
from app.agents.runner import ResolvedAgentProvider
from app.providers.base import LLMProvider
from app.providers.mock import MOCK_RESEARCH_UNAVAILABLE
from app.services.dossier import DossierService
from app.services.index import IndexService
from app.services.internal_knowledge import InternalKnowledgeService
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
        self._agent_runner: Callable[..., Awaitable[Any]] | None = None
        self._polaris: PolarisIntelligenceProvider | None = None
        self._outbound_policy = OutboundQueryPolicy()

    def bind_agent_runner(self, runner: Callable[..., Awaitable[Any]]) -> None:
        """Bind the configured agent runner after the application container is built."""
        self._agent_runner = runner

    def bind_polaris(
        self,
        provider: PolarisIntelligenceProvider,
        outbound_policy: OutboundQueryPolicy | None = None,
    ) -> None:
        """Bind public research after runtime construction without changing manual defaults."""
        self._polaris = provider
        if outbound_policy is not None:
            self._outbound_policy = outbound_policy

    async def run(
        self,
        matter_id: str,
        question: str = "",
        *,
        change_stage: bool = True,
        work_item_id: str | None = None,
        resolved_provider: ResolvedAgentProvider | None = None,
    ) -> dict[str, Any]:
        matter = self.index.get_matter(matter_id)
        if not matter:
            raise KeyError(f"Matter not found: {matter_id}")
        original_stage = matter["status"]

        request_path = f"{matter['path']}/request.md"
        request_text = self.vault.read_markdown(request_path)["content"] if self.vault.exists(request_path) else ""
        research_question = question.strip() or matter["title"]
        if (
            self.search.settings.search_provider.lower() == "tavily"
            and self.search.settings.tavily_api_key
        ):
            search_result = {
                "query": research_question,
                "internal": self.vault.lexical_search(
                    research_question, relative_path=matter["path"], limit=8
                ),
                "external": [],
                "warning": None,
            }
        else:
            try:
                search_result = await self.search.search(
                    research_question, matter_path=matter["path"]
                )
            except Exception:
                search_result = {
                    "query": research_question,
                    "internal": [],
                    "external": [],
                    "warning": "Research search failed.",
                }
        if search_result.get("warning"):
            search_result["warning"] = self._safe_public_warning(
                str(search_result["warning"])
            )
        polaris_status = "not_configured"
        public_query = self._prepare_public_query(matter_id, research_question, search_result)
        if public_query is None:
            polaris_status = "privacy_blocked"
        else:
            if self._polaris is not None and getattr(self._polaris, "configured", True):
                polaris_status = await self._add_polaris_research(public_query, search_result)
            if polaris_status in {"not_configured", "failed"}:
                try:
                    native = await self.search.search_external(public_query.standing_question)
                    search_result["external"].extend(native.get("external", []))
                    if native.get("warning"):
                        self._append_warning(
                            search_result,
                            self._safe_public_warning(str(native["warning"])),
                        )
                except Exception:
                    self._append_warning(search_result, "External research failed.")
        search_result["internal"] = self._eligible_internal_sources(
            search_result.get("internal", []), matter["path"]
        )
        search_result["external"] = self._eligible_external_sources(search_result.get("external", []))
        public_status = self._public_research_status(search_result, polaris_status)
        external_authority_retrieved = any(
            item.get("support_state") in {"retrieved", "verified"}
            for item in search_result.get("external", [])
        )
        prompt = self._prompt(matter, request_text, research_question, search_result)
        analysis_warning: str | None = None
        try:
            if self._agent_runner is not None:
                request = ChatRequest(
                    message=prompt, matter_id=matter_id, agent_id="research-agent"
                )
                reply = (
                    await self._agent_runner(request, resolved_provider=resolved_provider)
                    if resolved_provider is not None
                    else await self._agent_runner(request)
                )
                body = str(reply.reply).strip()
            else:
                reply = await self.provider.complete(
                    [{"role": "user", "content": prompt}]
                )
                body = reply.content.strip()
        except Exception:
            body = ""
            analysis_warning = (
                "Research analysis failed. Useful source material and fallback work were preserved."
            )
        if body == MOCK_RESEARCH_UNAVAILABLE:
            body = ""
            analysis_warning = (
                "The Research Agent used Mock. No model-generated research analysis was filed."
            )
        fallback_status = "analysis_preserved" if body else "scaffold_saved"
        if not body:
            body = self._fallback_packet(research_question, search_result)
        polaris_observability = search_result.get("polaris_observability")
        if isinstance(polaris_observability, dict) and polaris_observability.get("failure_class"):
            polaris_observability = {
                **polaris_observability,
                "fallback_status": fallback_status,
            }
            search_result["polaris_observability"] = polaris_observability
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
        packet_title = self._packet_title(research_question)
        packet_status = "first_pass_complete" if public_status == "retrieved" else "first_pass_partial"
        self.vault.write_markdown(
            path,
            (
                f"# {packet_title}\n\n"
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
                "title": packet_title,
                "question": research_question,
                "status": packet_status,
                "created_at": iso_now(),
                "external_search_enabled": bool(search_result.get("external")),
                "warning": search_result.get("warning"),
                "analysis_warning": analysis_warning,
                "citation_warning": citation_warning,
                "polaris_status": polaris_status,
                "polaris_observability": polaris_observability,
                "public_research_status": public_status,
                "external_authority_retrieved": external_authority_retrieved,
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
                research_support=source_lines,
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
                if public_status == "retrieved":
                    self._upsert_research_review(matter, packet_id, path)
            except Exception as exc:
                warnings.append(f"Research review work item update failed: {exc}")
        try:
            self.vault.update_markdown(
                f"{matter['path']}/matter.md",
                metadata_updates={
                    "public_research_status": public_status,
                    "external_authority_retrieved": external_authority_retrieved,
                    "latest_research_path": path,
                },
            )
            self.matters.append_event(
                matter_id,
                "research_completed",
                {"title": "Research packet saved", "path": path, "public_research_status": public_status},
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
                "A partial research packet is saved; no public source was retrieved."
                if public_status != "retrieved"
                else (
                    "First-pass research is complete and the matter moved to Explore."
                    if moved_to_explore
                    else "First-pass research is complete. The matter stage did not change."
                )
            ),
            "path": path,
            "warning": " ".join(warnings) or None,
            "internal_sources": len(search_result.get("internal", [])),
            "external_sources": len(search_result.get("external", [])),
            "external_authority_retrieved": external_authority_retrieved,
            "public_research_status": public_status,
            "research_warnings": warnings,
            "polaris_status": polaris_status,
            "polaris_observability": polaris_observability,
            "analysis_warning": analysis_warning,
            "orientation_warning": orientation_warning,
        }

    def _prepare_public_query(
        self,
        matter_id: str,
        question: str,
        search_result: dict[str, Any],
    ) -> OutboundWatchQuery | None:
        try:
            public_query = PublicResearchQuery(question=question)
            now = datetime.now(UTC)
            privacy_watch = Watch(
                watch_id="matter-research-privacy-check",
                path="privacy-check.md",
                title="Matter research privacy check",
                standing_question=question,
                public_query=PublicWatchQuery(standing_question=question),
                purposes=["awareness"],
                internal_scope=InternalScope(matter_ids=[matter_id]),
                created_at=now,
                updated_at=now,
            )
            corpus = InternalKnowledgeService(self.vault).forbidden_corpus(privacy_watch)
            return self._outbound_policy.prepare_public(public_query, corpus)
        except Exception:
            self._append_warning(
                search_result,
                "External research privacy check blocked this question. It remains available for local research.",
            )
            return None

    async def _add_polaris_research(
        self,
        outbound: OutboundWatchQuery,
        search_result: dict[str, Any],
    ) -> str:
        assert self._polaris is not None
        try:
            result = await self._polaris.research(outbound)
        except Exception:
            self._append_warning(
                search_result,
                "Polaris public research failed. Local and native research were preserved.",
            )
            search_result["polaris_observability"] = {
                "failure_class": "request_failure",
                "attempt_count": 1,
                "elapsed_ms": 0,
                "fallback_status": "pending",
            }
            return "failed"
        observation = getattr(result, "observability", None)
        if isinstance(observation, dict):
            search_result["polaris_observability"] = dict(observation)
        for warning in result.warnings:
            self._append_warning(search_result, f"Polaris: {warning}")
        for candidate in result.candidates:
            if candidate.sources:
                for source in candidate.sources:
                    search_result.setdefault("external", []).append({
                        "title": source.title,
                        "url": str(source.canonical_url),
                        "excerpt": source.excerpt,
                        "support_state": "supplied",
                        "provider": "polaris",
                        "provider_observation": candidate.provider_observation,
                    })
            elif candidate.provider_observation:
                search_result.setdefault("external", []).append({
                    "title": candidate.title,
                    "url": "",
                    "excerpt": candidate.provider_observation,
                    "support_state": "supplied",
                    "provider": "polaris",
                })
        return result.status

    @staticmethod
    def _append_warning(search_result: dict[str, Any], warning: str) -> None:
        current = str(search_result.get("warning") or "").strip()
        search_result["warning"] = f"{current} {warning}".strip()

    @staticmethod
    def _safe_public_warning(warning: str) -> str:
        lowered = warning.lower()
        if "not configured" in lowered:
            return "External research provider is not configured."
        if "unavailable" in lowered:
            return "External research was unavailable."
        if "failed" in lowered:
            return "External research failed."
        return "External research returned a warning."

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

    def _source_lines(self, search_result: dict[str, Any]) -> str:
        lines: list[str] = []
        for item in search_result.get("internal", []):
            path = item["path"]
            raw_excerpt = ""
            if self.vault.exists(path):
                try:
                    raw_excerpt = str(self.vault.read_markdown(path).get("content") or "")
                except (OSError, ValueError):
                    pass
            label = self._source_label(item, path)
            excerpt = self._clean_source_excerpt(raw_excerpt)
            lines.append(f"- Internal support: **{label}**{f' — {excerpt}' if excerpt else ''}")
        for item in search_result.get("external", []):
            title = str(item.get("title") or "Source")
            url = str(item.get("url") or "")
            state = str(item.get("support_state") or "unverified")
            support = {
                "supplied": "Supplied source",
                "retrieved": "Retrieved external authority",
                "verified": "Verified external authority",
            }.get(state, "Unverified external lead")
            excerpt = self._clean_source_excerpt(str(item.get("excerpt") or ""))
            rendered = f"[{title}]({url})" if url else f"**{title}**"
            lines.append(f"- {support}: {rendered}{f' — {excerpt}' if excerpt else ''}")
        if search_result.get("warning"):
            lines.append(f"- Research warning: {search_result['warning']}")
        observation = search_result.get("polaris_observability")
        if isinstance(observation, dict) and observation.get("failure_class"):
            lines.append(
                "- Polaris status: failed; "
                f"class: {observation.get('failure_class')}; "
                f"attempts: {observation.get('attempt_count')}; "
                f"elapsed: {observation.get('elapsed_ms')} ms; "
                f"fallback: {observation.get('fallback_status')}."
            )
        return "\n".join(lines) or "- No source results were returned. The packet is an issue-spotting scaffold only."

    def _eligible_internal_sources(
        self, items: list[dict[str, Any]], matter_path: str
    ) -> list[dict[str, Any]]:
        eligible: list[dict[str, Any]] = []
        dossier_seen = False
        for item in items:
            path = str(item.get("path") or "")
            if not path:
                eligible.append(item)
                continue
            if not path.startswith(f"{matter_path}/"):
                continue
            lowered = path.lower()
            if "/conversations/" in lowered or "/research/" in lowered:
                continue
            try:
                metadata = self.vault.read_markdown(path)["metadata"]
            except (OSError, ValueError, KeyError):
                metadata = {}
            if metadata.get("record_type") in {"chat_transcript", "research_run"} or metadata.get("research_id"):
                continue
            if path.endswith("/dossier.md") or "/dossiers/" in lowered:
                if dossier_seen:
                    continue
                dossier_seen = True
            eligible.append(item)
        return eligible

    @staticmethod
    def _eligible_external_sources(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
        eligible: list[dict[str, Any]] = []
        seen: set[str] = set()
        for item in items:
            url = str(item.get("url") or "").strip()
            title = str(item.get("title") or "").strip()
            key = url.split("#", 1)[0] or title.casefold()
            if not key or key in seen:
                continue
            seen.add(key)
            eligible.append(item)
        return eligible

    @staticmethod
    def _public_research_status(search_result: dict[str, Any], polaris_status: str) -> str:
        if search_result.get("external"):
            return "retrieved"
        if polaris_status == "privacy_blocked":
            return "unavailable"
        warning = str(search_result.get("warning") or "").lower()
        if polaris_status == "failed" or "external research failed" in warning:
            return "failed"
        return "unavailable"

    @staticmethod
    def _packet_title(question: str) -> str:
        words = " ".join(question.strip().split()).rstrip("?.!")
        if not words:
            return "Research note"
        return " ".join(words.split()[:10])[:80].rstrip(" ,;:-")

    @staticmethod
    def _source_label(item: dict[str, Any], path: str) -> str:
        fallback = path.rsplit("/", 1)[-1].rsplit(".", 1)[0].replace("-", " ").replace("_", " ").title()
        label = " ".join(str(item.get("title") or fallback or "Internal source").split())
        return label.replace("[", "").replace("]", "").replace("`", "")

    @staticmethod
    def _clean_source_excerpt(raw: str, limit: int = 200) -> str:
        text = raw.strip()
        if "---" in text:
            text = text.rsplit("---", 1)[-1]
        text = re.sub(r"```(?:[a-zA-Z0-9_-]+)?", " ", text)
        text = re.sub(r"^\s{0,3}(?:#{1,6}|[-*+] |\d+[.)] )\s*", "", text, flags=re.MULTILINE)
        text = re.sub(r"\[([^]]+)]\([^)]+\)", r"\1", text)
        text = re.sub(r"[*_`>]", "", text)
        text = " ".join(text.split())
        if len(text) <= limit:
            return text
        shortened = text[: limit + 1].rsplit(" ", 1)[0].rstrip(" ,;:-")
        return f"{shortened}…"

    @staticmethod
    def _fallback_packet(question: str, search_result: dict[str, Any]) -> str:
        internal_count = len(search_result.get("internal", []))
        external_count = len(search_result.get("external", []))
        return (
            "**Orientation (not substantive research).** No model-generated analysis is available.\n\n"
            f"**Research question.** {question}\n\n"
            "**Likely workstreams.** Confirm product facts, identify the governing legal framework, test the main path and "
            "one practical alternative, and translate the result into launch conditions or a clear escalation.\n\n"
            f"**Research available.** The system surfaced {internal_count} internal and {external_count} external source(s).\n\n"
            "**Open questions.** Which facts are outcome-determinative? What authority must be verified before counsel relies "
            "on the answer? What risk is the business prepared to accept?"
        )
