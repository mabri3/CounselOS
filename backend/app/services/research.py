from __future__ import annotations

import asyncio
import json
import logging
import re
from collections.abc import Awaitable, Callable
from datetime import UTC, datetime
from typing import Any

from app.intelligence.outbound_policy import OutboundQueryPolicy, PublicResearchQuery
from app.intelligence.polaris import PolarisIntelligenceProvider
from app.models.api import MAX_CHAT_MESSAGE_CHARS, ChatRequest, WorkItemCreate
from app.models.research_scope import ResearchScope
from app.models.workspace import ConversationTarget
from app.models.awareness import InternalScope, OutboundWatchQuery, PublicWatchQuery, Watch
from app.agents.runner import ResolvedAgentProvider
from app.providers.base import LLMProvider
from app.providers.mock import MOCK_RESEARCH_UNAVAILABLE, MockProvider
from app.services.dossier import DossierService
from app.services.index import IndexService
from app.services.internal_knowledge import InternalKnowledgeService
from app.services.matters import MatterService
from app.services.search import SearchService
from app.services.vault import VaultService
from app.services.workspace_evidence import WorkspaceEvidenceService
from app.services.workspace import digest
from app.services.issue_analysis import IssueAnalysisService, extract_decision_paths
from app.services.workspace_actions import WorkspaceActionsService, extract_claim_support
from app.utils.ids import new_id
from app.utils.time import iso_now


logger = logging.getLogger(__name__)


def _bounded_agent_message(message: str) -> str:
    """Fit an internally generated prompt within the public chat request limit."""
    if len(message) <= MAX_CHAT_MESSAGE_CHARS:
        return message
    marker = "\n\n[Middle of generated research context omitted to fit the message limit.]\n\n"
    available = MAX_CHAT_MESSAGE_CHARS - len(marker)
    head = available * 3 // 4
    return message[:head] + marker + message[-(available - head):]


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
        self._settings: dict[str, object] = {
            "primary_external_provider": "polaris",
            "fallback_external_provider": "tavily",
            "model_fallback_enabled": True,
            "external_timeout_seconds": 90,
            "external_retry_count": 2,
        }

    def configure(self, values: dict[str, object]) -> None:
        self._settings = {**self._settings, **values}

    def search_options(self) -> dict[str, Any]:
        providers = list(dict.fromkeys(
            str(self._settings.get(key) or "none")
            for key in ("primary_external_provider", "fallback_external_provider")
            if str(self._settings.get(key) or "none") != "none"
        ))
        return {
            "provider_ids": providers,
            "cost_notice": "External search may incur provider charges, including fallback searches and retries. No price estimate is available. This does not authorize future databases.",
            "sensitivity_notice": "Other matters may contain sensitive information. Relevant saved records from active matters will be included in this matter's analysis. This is not an access-control system.",
        }

    def internal_sources(self, question: str, matter_path: str, *, other_matters: bool = False) -> list[dict[str, Any]]:
        items = []
        roots = [matter_path]
        if other_matters:
            roots.extend(matter["path"] for matter in self.index.list_matters() if matter["path"] != matter_path)
        # Search each active matter so current-matter hits cannot crowd out prior work.
        for root in roots:
            try:
                items.extend(self.search.search_internal(question, matter_path=root, limit=8 if root == matter_path else 3))
            except Exception as exc:
                logger.warning("Internal research search failed: %s", type(exc).__name__)
        return self._eligible_internal_sources(items, matter_path, other_matters=other_matters)

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
        on_packet_saved: Callable[[dict[str, Any]], None] | None = None,
        expected_question_revision: str | None = None,
        issue_id: str | None = None,
        run_id: str | None = None,
        frozen_context: dict[str, Any] | None = None,
        search_scope: ResearchScope | None = None,
        execution_version: int = 2,
        managed: bool = False,
    ) -> dict[str, Any]:
        # A parent-managed dossier child saves its packet and sources but must not
        # perform any shared workspace effect (latest-research pointer, stage,
        # index rebuild, or workspace projection). The parent's checked
        # publication owns those, so an incidental sibling write cannot change the
        # parent's basis mid-batch.
        dossier_since = self.dossiers.generation_sequence
        search_scope = search_scope or ResearchScope()
        matter = self.index.get_matter(matter_id)
        if not matter:
            raise KeyError(f"Matter not found: {matter_id}")
        from app.services.workspace import WorkspaceService
        workspace = WorkspaceService(self.vault, self.matters, self.dossiers)
        issue_analysis = IssueAnalysisService(self.vault, self.matters, workspace)
        frozen_context = dict(frozen_context or {})
        if hasattr(self, "app") and "dossier_skill" not in frozen_context:
            frozen_context["dossier_skill"] = self.app.skills.dossier_generation_snapshot()
        frozen_context["research_scope"] = search_scope.model_dump()
        research_inputs = frozen_context.get("research_inputs")
        research_inputs = research_inputs if isinstance(research_inputs, dict) else None
        issue_id = issue_id or frozen_context.get("issue_id")
        capture = frozen_context.get("issue_analysis_capture")
        if not isinstance(capture, dict):
            capture = issue_analysis.capture(
                matter_id, issue_id, frozen_context=frozen_context
            )
            frozen_context["issue_analysis_capture"] = capture
        frozen_context.setdefault("issue_id", issue_id)
        frozen_question = workspace.business_question(matter_id)
        captured_question = capture.get("business_question") or {}
        if captured_question.get("text"):
            frozen_question = {**frozen_question, **captured_question}
        if expected_question_revision and frozen_question["revision"] != expected_question_revision:
            frozen_question = next((q for q in workspace.question_history(matter_id) if q["revision"] == expected_question_revision), frozen_question)
        expected_question_revision = expected_question_revision or frozen_question["revision"]
        original_stage = matter["status"]

        request_path = f"{matter['path']}/request.md"
        request_text = (
            str(research_inputs.get("request_text") or "") if research_inputs is not None
            else self.vault.read_markdown(request_path)["content"] if self.vault.exists(request_path) else ""
        )
        prompt_matter = {**matter, **(research_inputs.get("matter") or {})} if research_inputs else matter
        research_question = question.strip() or matter["title"]
        correlation_id = new_id("RC")
        if research_inputs is not None:
            search_result = {
                "query": research_question,
                "internal": list(research_inputs.get("internal") or []),
                "external": [], "warning": None,
            }
        else:
            search_result = {
                "query": research_question,
                "internal": self.internal_sources(
                    research_question, matter["path"], other_matters=search_scope.other_matters
                ),
                "external": [], "warning": None,
            }
        search_result["execution_version"] = execution_version
        search_result["provider_legs"] = []
        search_result["correlation_id"] = correlation_id
        if search_result.get("warning"):
            search_result["warning"] = self._safe_public_warning(
                str(search_result["warning"])
            )
        investigation_result = None
        polaris_status = "not_requested"
        if execution_version == 2 and hasattr(self, "app"):
            from app.services.main_agent_research import run_main_research
            investigation_result = await run_main_research(self, matter_id, research_question, run_id=run_id, frozen_context=frozen_context, scope=search_scope, resolved_provider=resolved_provider, initial_search=search_result)
            search_result["external"] = investigation_result["external"]
            search_result["warning"] = investigation_result["warning"] or None
            search_result["provider_legs"] = investigation_result["provider_legs"]
            search_result["polaris_observability"] = investigation_result["polaris_observability"]
        else:
            polaris_status = "not_requested"
            public_query = self._prepare_public_query(matter_id, search_scope.public_query or research_question, search_result) if search_scope.external else None
            if not search_scope.external:
                self._append_warning(search_result, "External search was not selected. Analysis uses saved internal material only.")
            elif public_query is None:
                polaris_status = "privacy_blocked"
            elif search_scope.native:
                from app.services.native_research import search_native
                try:
                    async with asyncio.timeout(180):
                        await search_native(public_query.standing_question, search_scope, self.search.settings, self.search, search_result)
                        if search_result.get("native_warning"):
                            self._append_warning(search_result, search_result["native_warning"])
                except Exception as exc:
                    self._append_warning(search_result, f"Native research did not finish ({type(exc).__name__}). Available analysis is preserved.")
            else:
                providers = search_scope.provider_ids
                active_provider = ""
                try:
                    async with asyncio.timeout(
                        float(self._settings["external_timeout_seconds"])
                    ):
                        for provider_id in dict.fromkeys(providers):
                            has_authority = any(
                                item.get("support_state") in {"retrieved", "verified"}
                                for item in search_result["external"]
                            )
                            if provider_id == "none" or has_authority:
                                continue
                            active_provider = provider_id
                            status = await self._run_external_provider(
                                provider_id, public_query, search_result
                            )
                            if provider_id == "polaris":
                                polaris_status = status
                            active_provider = ""
                except TimeoutError:
                    warning = (
                        f"{active_provider.title() or 'External'} research timed out within the "
                        "total external research budget. Local and model research continued."
                    )
                    self._append_warning(search_result, warning)
                    search_result.setdefault("provider_legs", []).append({
                        "provider": active_provider or "external",
                        "status": "timeout",
                        "authority_retrieved": any(
                            item.get("support_state") in {"retrieved", "verified"}
                            for item in search_result.get("external", [])
                        ),
                        "attempt_count": None,
                        "elapsed_ms": int(
                            float(self._settings["external_timeout_seconds"]) * 1000
                        ),
                        "timeout_seconds": self._settings.get("external_timeout_seconds"),
                        "correlation_id": search_result.get("correlation_id"),
                        "warning": warning,
                    })
                    if active_provider == "polaris":
                        polaris_status = "timeout"
        search_result["internal"] = self._eligible_internal_sources(
            search_result.get("internal", []), matter["path"], other_matters=search_scope.other_matters
        )
        # These are trusted, hashed copies of actual reads in this run. The
        # historical-research filter above deliberately excludes their folder.
        local_snapshots = (investigation_result or {}).get("local_sources", [])
        library_records = []
        for source in (investigation_result or {}).get("library_sources", []):
            for passage in source.get("selected_passages", []):
                if not passage.get("text") or not passage.get("path"):
                    continue
                locator = (f"Page {passage['page_number']}" if passage.get("page_number") else passage.get("section_label") or passage["unit_id"])
                locator += f", characters {passage['start']}–{passage['end']}"
                library_records.append({**source, "source_label": f"{source['title']} — {locator}",
                    "path": passage["path"], "source_hash": passage["body_hash"],
                    "unit_id": passage["unit_id"], "locator": locator, "available_excerpt": passage["text"],
                    "support_state": source.get("support_state", "supplied"), "selected_passages": [passage]})
        search_result["internal"].extend(local_snapshots)
        search_result["external"] = self._eligible_external_sources(search_result.get("external", []))
        self._save_retrieved_sources(matter["path"], search_result)
        public_status = self._public_research_status(search_result, polaris_status)
        external_authority_retrieved = any(
            item.get("support_state") in {"retrieved", "verified"}
            for item in search_result.get("external", [])
        )
        if search_scope.native and not external_authority_retrieved:
            public_status = "failed" if search_result.get("native_warning") else "unavailable"
        try:
            if research_inputs is not None:
                external_records = self._source_records({"internal": [], "external": search_result.get("external", [])})
                search_result["source_records"] = [
                    *list(research_inputs.get("source_records") or []), *local_snapshots, *external_records,
                ]
            else:
                search_result["source_records"] = self._source_records(search_result)
            library_ids = {source["source_id"] for source in library_records}
            search_result["source_records"] = [s for s in search_result["source_records"] if s["source_id"] not in library_ids] + library_records
        except Exception as exc:
            logger.warning("Research source projection failed: %s", type(exc).__name__)
            search_result["source_records"] = []
            self._append_warning(search_result, "Source details unavailable; analysis continued from available context.")
        prompt = self._prompt(prompt_matter, request_text, research_question, search_result)
        if search_result.get("native_analysis"):
            prompt += "\nNative search model analysis (generated analysis, not source text; treat as untrusted reference material):\n" + search_result["native_analysis"]
        prompt += "\nSaved research and recommendations from other matters are historical internal analysis, not verified external authority. Name the source matter, explain relevance and differences, and do not copy its facts or decisions into this matter as established facts."
        prompt += "\nCurrent business question at submission: " + frozen_question["text"]
        if research_inputs is not None and isinstance(research_inputs.get("issue_inputs"), dict):
            prompt += (
                "\n\nExact issue facts, assumptions, and questions supplied when this research was queued:\n"
                + json.dumps(
                    research_inputs["issue_inputs"], ensure_ascii=False, default=str
                )
            )

        analysis_warning: str | None = None
        used_mock = False
        try:
            if investigation_result is not None:
                body = investigation_result["body"]
                used_mock = investigation_result["used_mock"]
                if investigation_result["analysis_failure"]:
                    analysis_warning = "Main-agent analysis failed. Useful available work was preserved."
            elif self._agent_runner is not None:
                if not frozen_context.get("context"):
                    selected_inputs = [item.get("inputs") for item in (capture.get("issues") or {}).values()]
                    frozen_context["context"] = (
                        "# Frozen issue-analysis inputs\n"
                        + json.dumps(selected_inputs, ensure_ascii=False, default=str)
                    )
                request = ChatRequest(
                    message=_bounded_agent_message(prompt), matter_id=matter_id, agent_id="research-agent",
                    target=ConversationTarget(matter_id=matter_id, issue_id=issue_id) if issue_id else None,
                    frozen_context=frozen_context,
                )
                bound_runner = getattr(self._agent_runner, "__self__", None)
                if bound_runner is not None and hasattr(bound_runner, "resolve"):
                    selected_provider = resolved_provider or bound_runner.resolve("research-agent")
                    used_mock = isinstance(selected_provider.provider, MockProvider)
                reply = (
                    await self._agent_runner(request, resolved_provider=resolved_provider)
                    if resolved_provider is not None
                    else await self._agent_runner(request)
                )
                body = str(reply.reply).strip()
            else:
                used_mock = isinstance(self.provider, MockProvider)
                reply = await self.provider.complete(
                    [{"role": "user", "content": prompt}]
                )
                body = reply.content.strip()
        except Exception as exc:
            logger.warning("Research analysis failed: %s", type(exc).__name__)
            body = str(getattr(getattr(exc, "state", None), "useful_content", "") or "").strip()
            analysis_warning = (
                "Research analysis failed. Useful source material and fallback work were preserved."
            )
        problem_structure = investigation_result.get("problem_analysis_structure") if investigation_result else None
        problem_capture = investigation_result.get("problem_analysis_capture") if investigation_result else frozen_context.get("problem_analysis_capture")
        from app.services.problem_analysis import extract_problem_analysis, ProblemAnalysisService
        body, transported_problem, problem_warnings = extract_problem_analysis(body)
        problem_structure = problem_structure or transported_problem
        decision_structure = None
        claim_structure = None
        structure_warnings: list[str] = list(problem_warnings)
        if body and body != MOCK_RESEARCH_UNAVAILABLE and not used_mock:
            body, decision_structure, decision_warnings = extract_decision_paths(body)
            body, claim_structure, claim_warnings = extract_claim_support(body)
            structure_warnings.extend([*decision_warnings, *claim_warnings])
        if body == MOCK_RESEARCH_UNAVAILABLE or used_mock:
            body = ""
            analysis_warning = (
                "The Research Agent used Mock. No model-generated research analysis was filed."
            )
        if not body and search_result.get("native_analysis"):
            body = "Public-query research analysis (matter-specific analysis did not finish):\n\n" + search_result["native_analysis"]
        question_answered = bool(body)
        model_only = question_answered and not external_authority_retrieved
        fallback_status = "analysis_preserved" if body else "scaffold_saved"
        if not body:
            body = search_result.get("native_analysis") or self._fallback_packet(research_question, search_result)
        polaris_observability = search_result.get("polaris_observability")
        if isinstance(polaris_observability, dict) and polaris_observability.get("failure_class"):
            polaris_observability = {
                **polaris_observability,
                "fallback_status": fallback_status,
            }
            search_result["polaris_observability"] = polaris_observability
        if model_only:
            body = f"**No external authority retrieved**\n\n{body}"
        if analysis_warning:
            body = f"**Generated analysis warning.** {analysis_warning}\n\n{body}"
        packet_id = new_id("RES")
        analysis_run_id = run_id or correlation_id
        path = f"{matter['path']}/research/{packet_id}.md"
        citation_warning: str | None = None
        if any(not item.get("path") and not item.get("url") for item in search_result.get("source_records", [])):
            citation_warning = "Research citation formatting failed for a source with no available location."
        try:
            source_lines = self._source_lines(search_result)
        except Exception as exc:
            logger.warning("Research citation formatting failed: %s", type(exc).__name__)
            citation_warning = f"Research citation formatting failed: {exc}"
            source_lines = "- Source details could not be formatted. Review the research warning metadata."
        packet_title = self._packet_title(research_question)
        packet_status = "first_pass_complete" if public_status == "retrieved" else "first_pass_partial"
        packet_content = (
                f"# {packet_title}\n\n"
                f"## Question\n\n{research_question}\n\n"
                f"## Working Analysis\n\n{body}\n\n"
                f"## Sources surfaced\n\n{source_lines}\n\n"
                f"## Last-mile work for counsel\n\n"
                "- Confirm the facts that could change the recommendation.\n"
                "- Verify any authority that will carry the final answer.\n"
                "- Decide the acceptable risk and the business path.\n\n"
                "## Research status\n\n"
                f"- Question answered: {'Yes' if question_answered else 'No'}\n"
                f"- External authority retrieved: {'Yes' if external_authority_retrieved else 'No'}\n"
                f"- Internal support used: {'Yes' if search_result.get('internal') else 'No'}\n"
                f"- Model-only: {'Yes' if model_only else 'No'}\n"
                "- Assumptions: See the Working Analysis.\n"
                "- Remaining gaps: Verify material facts and any authority used for the final answer.\n"
            )
        if investigation_result and investigation_result.get("research_synthesis"):
            known_sources = {s.get("source_id") for s in search_result.get("source_records", [])}
            for assessment in investigation_result["research_synthesis"].get("proposition_assessments", []):
                invalid = set(assessment.get("source_ids", [])) - known_sources
                if invalid:
                    assessment["source_ids"] = [s for s in assessment["source_ids"] if s in known_sources]
                    assessment["status"] = "unresolved"
                    assessment["remaining_gap"] = "The assessment referred to a source outside the saved evidence. " + assessment.get("remaining_gap", "")
                    investigation_result["structure_warnings"].append("Unknown assessment sources ignored; useful analysis retained.")
        output_revision = digest(packet_content.strip())
        claim_publisher = WorkspaceActionsService(self.vault, self.matters, workspace)
        claims: list[dict[str, Any]] = []
        raw_claims = claim_structure.get("claims", []) if isinstance(claim_structure, dict) else claim_publisher._inline_claims(body)
        for index, raw_claim in enumerate(raw_claims if isinstance(raw_claims, list) else []):
            try:
                claim, claim_warnings = claim_publisher._parse_claim(
                    raw_claim, text=packet_content,
                    sources=search_result.get("source_records", []),
                    output_revision=output_revision,
                )
                claims.append(claim)
                structure_warnings.extend(
                    f"Optional claim {index + 1}: {warning}" for warning in claim_warnings
                )
            except (TypeError, ValueError, KeyError) as exc:
                structure_warnings.append(
                    f"Optional claim {index + 1} unavailable: {type(exc).__name__}. Useful research prose was retained."
                )
        self.vault.write_markdown(
            path, packet_content,
            {
                "research_id": packet_id,
                "execution_version": execution_version,
                "raw_final_output": investigation_result["raw_final_output"] if investigation_result else None,
                "problem_analysis_structure": problem_structure,
                "problem_analysis_capture": problem_capture,
                "research_synthesis": investigation_result["research_synthesis"] if investigation_result else None,
                "research_prose": body if investigation_result and not used_mock else None,
                "research_structure_warnings": investigation_result["structure_warnings"] if investigation_result else [],
                "checkpoint_run_id": investigation_result["checkpoint_run_id"] if investigation_result else None,
                "run_id": analysis_run_id,
                "output_revision": output_revision,
                "claims": claims,
                "source_records": search_result.get("source_records", []),
                "matter_id": matter_id,
                "title": packet_title,
                "question": research_question,
                "search_scope": search_scope.model_dump(),
                "native_analysis": search_result.get("native_analysis", ""),
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
                "question_answered": question_answered,
                "supplied_sources_used": sum(1 for item in search_result.get("external", []) if item.get("support_state") == "supplied"),
                "internal_support_used": bool(search_result.get("internal")),
                "assumptions_used": "See Working Analysis.",
                "remaining_gaps": "Verify authority and facts identified in the packet.",
                "model_only": model_only,
                "provider_legs": search_result.get("provider_legs", []),
                "correlation_id": correlation_id,
            },
        )
        published_analysis: dict[str, Any] = {"warnings": [], "issue_analyses": [], "historical": False}
        if decision_structure is not None and not managed:
            try:
                published_analysis = issue_analysis.publish(
                    matter_id, path=path, run_id=analysis_run_id,
                    output_revision=output_revision, structure=decision_structure,
                    capture=capture, claims=claims,
                )
                structure_warnings.extend(published_analysis["warnings"])
            except (OSError, TypeError, ValueError, KeyError) as exc:
                structure_warnings.append(
                    f"Optional decision paths unavailable: {type(exc).__name__}. Useful research prose and prior analysis were retained."
                )
        if problem_structure is not None and not managed and (not investigation_result or investigation_result.get("direct_packet_only")):
            try:
                ProblemAnalysisService(self.vault, self.matters, workspace).publish(matter_id,
                    path=path, run_id=analysis_run_id, output_revision=output_revision,
                    structure=problem_structure, capture=problem_capture, current_eligible=not bool(issue_id))
            except (OSError, ValueError, KeyError, TypeError):
                structure_warnings.append("Breakdown publication failed; useful research retained.")
        if on_packet_saved is not None:
            on_packet_saved({
                "path": path,
                "public_research_status": public_status,
                "internal_sources": len(search_result.get("internal", [])),
                "external_sources": len(search_result.get("external", [])),
                "model_only": model_only,
            })
        warnings = [warning for warning in (search_result.get("warning"), analysis_warning, citation_warning) if warning]
        warnings.extend(structure_warnings)
        orientation_warning: str | None = None
        orientation_result: dict[str, Any] = {}
        if execution_version == 1:
            try:
                generated_summary = DossierService.section(body, "Matter summary")
                generated_open_questions = DossierService.list_section(body, "Open questions")
                current_orientation = self.dossiers.orientation(matter_id)
                orientation_result = self.dossiers.update_orientation(
                    matter_id,
                    summary=(
                        generated_summary
                        or current_orientation["summary"]
                        or matter.get("description")
                        or matter["title"]
                    ),
                    decision_question=(
                        frozen_question["text"]
                        if decision_structure is not None
                        else (
                            current_orientation["decision_question"]
                            or matter.get("next_action")
                            or research_question
                        )
                    ),
                    open_questions=generated_open_questions or current_orientation["open_questions"],
                    research_path=path,
                    research_support=source_lines,
                    expected_question_revision=expected_question_revision,
                )
            except Exception as exc:
                logger.warning("Research orientation update failed: %s", type(exc).__name__)
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
                logger.warning("Research work-item update failed: %s", type(exc).__name__)
                warnings.append(f"Research review work item update failed: {exc}")
        if not managed:
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
            except Exception as exc:
                logger.warning("Research completion record update failed: %s", type(exc).__name__)
                warnings.append(f"Research completion record update failed: {exc}")
        moved_to_explore = False
        if change_stage and original_stage in {"intake", "research"}:
            try:
                self.matters.move_stage(
                    matter_id,
                    "explore",
                    reason="First-pass research packet is ready for counsel exploration",
                    actor="research-agent",
                    rebuild=False,
                )
                moved_to_explore = True
            except Exception as exc:
                logger.warning("Research stage update failed: %s", type(exc).__name__)
                warnings.append(f"Matter stage update failed: {exc}")
        dossier_projection: dict[str, Any] = {"state": "not_required"}
        expected_work_state_hash = self.dossiers.content_hash(matter_id)
        if execution_version == 1:
            try:
                dossier_projection = self.dossiers.project_current_work_state(
                    matter_id, expected_hash=expected_work_state_hash,
                )
            except Exception as exc:
                logger.warning("Research dossier projection failed: %s", type(exc).__name__)
                dossier_projection = {
                    "state": "failed",
                    "error": f"Dossier projection failed: {type(exc).__name__}",
                }
                warnings.append("The research packet was saved, but the dossier did not refresh.")
        if warnings:
            try:
                self.vault.update_markdown(path, metadata_updates={"warnings": warnings})
            except Exception:
                pass
        if execution_version == 1 and hasattr(self, "app"):
            from app.services.dossier_generation import generate_pending, generation_owner
            await generate_pending(self.app, since=dossier_since, matter_id=matter_id,
                owner=generation_owner.get(), resolved_provider=resolved_provider,
                snapshot=frozen_context.get("dossier_skill"),
                allowed=not (frozen_context.get("excluded_paths") or frozen_context.get("withhold_unattributed_history")))
        if not managed:
            try:
                await self.index.rebuild_async()
            except Exception as exc:
                logger.warning("Research index rebuild failed: %s", type(exc).__name__)
                warnings.append("Research index rebuild failed.")
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
            "source_records": search_result.get("source_records", []),
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
            "orientation_state": orientation_result.get("state"),
            "expected_question_revision": expected_question_revision,
            "question_answered": question_answered,
            "supplied_sources_used": sum(1 for item in search_result.get("external", []) if item.get("support_state") == "supplied"),
            "internal_support_used": bool(search_result.get("internal")),
            "assumptions_used": "See Working Analysis.",
            "remaining_gaps": "Verify authority and facts identified in the packet.",
            "model_only": model_only,
            "provider_legs": search_result.get("provider_legs", []),
            "correlation_id": correlation_id,
            "output_revision": output_revision,
            "claims": claims,
            "issue_analyses": published_analysis["issue_analyses"],
            "historical_analysis": bool(published_analysis.get("historical")),
            "dossier_projection": dossier_projection,
        }

    async def _run_external_provider(
        self, provider_id: str, outbound: OutboundWatchQuery,
        search_result: dict[str, Any], *, transport_retry_count: int | None = None,
    ) -> str:
        if provider_id == "polaris":
            if self._polaris is None or not getattr(self._polaris, "configured", True):
                status = "not_configured"
            else:
                provider = self._polaris
                if transport_retry_count is not None and hasattr(provider, "configure"):
                    from copy import copy
                    provider = copy(provider)
                    provider.configure(timeout_seconds=int(self._settings["external_timeout_seconds"]), retry_count=transport_retry_count)
                status = await self._add_polaris_research(outbound, search_result, provider=provider)
        elif provider_id in {"tavily", "firecrawl"}:
            try:
                try:
                    result = await self.search.search_external(
                        outbound.standing_question, provider=provider_id,
                        timeout_seconds=int(self._settings["external_timeout_seconds"]),
                        retry_count=int(self._settings["external_retry_count"]) if transport_retry_count is None else transport_retry_count,
                    )
                except TypeError:  # Preserve narrow test and extension seams.
                    result = await self.search.search_external(outbound.standing_question)
                search_result["external"].extend(result.get("external", []))
                if result.get("warning") and "not configured" not in str(result["warning"]).lower():
                    self._append_warning(search_result, self._safe_public_warning(str(result["warning"])))
                status = "retrieved" if result.get("external") else "failed"
            except Exception as exc:
                logger.warning("Native external research failed: %s", type(exc).__name__)
                status = "failed"
                self._append_warning(search_result, "External research failed.")
        else:
            status = "not_configured"
        observation = (
            search_result.get("polaris_observability")
            if provider_id == "polaris" else locals().get("result", {}).get("observability")
        )
        search_result.setdefault("provider_legs", []).append({
            "provider": provider_id, "status": status,
            "authority_retrieved": any(
                item.get("support_state") in {"retrieved", "verified"}
                for item in search_result.get("external", [])
            ),
            "attempt_count": (observation or {}).get("attempt_count"),
            "elapsed_ms": (observation or {}).get("elapsed_ms"),
            "timeout_seconds": self._settings.get("external_timeout_seconds"),
            "correlation_id": search_result.get("correlation_id"),
        })
        return status

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
        search_result: dict[str, Any], *, provider=None,
    ) -> str:
        provider = provider or self._polaris
        assert provider is not None
        try:
            result = await provider.research(outbound)
        except Exception as exc:
            logger.warning("Polaris research failed: %s", type(exc).__name__)
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
                        "content": candidate.provider_observation,
                    })
            elif candidate.provider_observation:
                search_result.setdefault("external", []).append({
                    "title": "Supplied public legal research",
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
            "Source records (cite beside each supported claim as "
            "[source:SOURCE_ID|exact locator], using the exact saved source_id and locator; "
            "omit |exact locator only when the record has no locator):\n"
            f"{search_result.get('source_records', [])}\n\n"
            f"Internal search results:\n{search_result.get('internal', [])}\n\n"
            f"External search results:\n{ResearchService._prompt_external_sources(search_result)}\n\n"
            "Deliver the strongest useful first-pass answer. Separate retrieved external authority, supplied public sources, "
            "internal support, assumptions, and remaining gaps. Generated analysis is not retrieved authority. If no external "
            "authority was retrieved, say exactly: No external authority retrieved.\n\n"
            "Begin with the likely answer and a short conditional alternative when a missing fact matters. "
            "Use at most one optional question and state its consequence; no minimum caveat count. "
            "Do not invent an objection. Keep the current business question unchanged. "
            "For a research packet, these optional sections can help orientation:\n\n"
            "## Matter summary\n"
            "Write 2–4 short sentences explaining who is involved, what is happening, why counsel is involved, "
            "and the important timing or consequence. Use only matter facts.\n\n"
            "## Decision question\n"
            "Write one direct question that names the concrete choices, scale or deadline when material, and the "
            "business consequence. It must make sense without another file. Avoid generic verbs such as review, "
            "assess, consider, or approve the path. Keep it under 90 words.\n\n"
            "## Open questions\n"
            "Include at most one material unanswered question, only if useful. Include missing business facts and "
            "research questions only when the answer could change the recommendation or decision. Use Markdown bullets.\n\n"
            "Then return: likely rules/issues, viable paths, facts that could change the answer, and recommended "
            "last-mile verification. Keep the recommendation separate from the lawyer's decision. "
            "After the useful prose, you may append one optional decision-paths fenced JSON object for the captured real issue IDs. "
            "Use unique local IDs and real supplied record IDs. Unknown does not choose a route. Requirements need all or any; split mixed nested logic."
        )

    def _save_retrieved_sources(self, matter_path: str, search_result: dict[str, Any]) -> None:
        """Keep full retrieved pages on disk; send only bounded excerpts to the model."""
        for item in search_result.get("external", []):
            text = item.pop("retrieved_content", None)
            if not isinstance(text, str) or not text.strip():
                continue
            source_id = "SRC-" + digest(item.get("url") or item.get("title"))[:20]
            # Hash the same canonical text that Markdown readers return.
            text = text.replace("\r\n", "\n").replace("\r", "\n").strip() + "\n"
            version = digest(text)
            path = f"{matter_path}/research/sources/{source_id}-{version[:12]}.md"
            try:
                if not self.vault.exists(path):
                    self.vault.write_markdown(path, text, {
                        "record_type": "retrieved_source", "source_id": source_id, "immutable": True, "editable": False,
                        "title": item.get("title"), "url": item.get("url"),
                        "retrieved_at": item.get("retrieved_at"),
                        "source_hash": version, "source_version": version,
                        "support_state": "retrieved",
                    })
                item.update(source_id=source_id, path=path, source_hash=version, source_version=version, support_state="retrieved")
            except (OSError, ValueError):
                self._append_warning(search_result, "Full source copy could not be saved; the retrieved excerpt was preserved.")

    def _source_records(self, search_result: dict[str, Any]) -> list[dict[str, Any]]:
        records = []
        for item in search_result.get("internal", []):
            supplied = dict(item)
            path = str(item.get("path") or "")
            if path:
                try:
                    document = self.vault.read_document(path)
                    text = str(document.get("content") or "")
                    metadata = document.get("metadata") or {}
                    if not metadata.get("source_id") and self.vault.exists(path + ".extracted.md"):
                        metadata = self.vault.read_markdown(path + ".extracted.md")["metadata"]
                    supplied.update(available_excerpt=text[:800] or None,
                                    source_version=metadata.get("source_version") or digest(text),
                                    source_hash=digest(text), locator="Start of document")
                    if metadata.get("source_id"):
                        supplied["source_id"] = metadata["source_id"]
                except (OSError, ValueError, TypeError):
                    supplied.update(available_excerpt=None)
            record = WorkspaceEvidenceService.source_record(supplied, internal=True)
            record["source_label"] = self._source_label(item, path)
            records.append(record)
        records.extend({**item, **WorkspaceEvidenceService.source_record(item)} for item in search_result.get("external", []))
        return records

    def _source_lines(self, search_result: dict[str, Any]) -> str:
        lines: list[str] = []
        records = search_result.get("source_records")
        if records is None:
            records = self._source_records(search_result)
        for item in records:
            if not isinstance(item, dict):
                continue
            support = {"supplied": "Internal support" if item.get("path") else "Supplied source",
                       "retrieved": "Retrieved external authority", "verified": "Verified external authority"}.get(item.get("support_state"), "Unverified external lead")
            if search_result.get("execution_version") == 2:
                support = {"supplied": "Supplied source", "retrieved": "Retrieved source", "verified": "Retrieved source"}.get(item.get("support_state"), "Unverified lead")
            title = str(item.get("source_label") or item.get("title") or item.get("url") or item.get("path") or "Unidentified source").replace("[", "").replace("]", "")
            location = item.get("url") or item.get("path")
            rendered = f"[{title}]({location})" if location else f"**{title}**"
            locator = str(item.get("locator") or "").replace("]", "").strip()
            marker = (f"[source:{item['source_id']}" + (f"|{locator}]" if locator else "]")) if item.get("source_id") else ""
            lines.append(f"- {support}: {rendered} {marker}")
            if search_result.get("execution_version") == 2 and not item.get("selected_passages"):
                lines.append("  No relevant passage has been selected; open the source.")
            elif item.get("available_excerpt"):
                # Preserve literal source text; the structured record carries its
                # exact full excerpt. No Markdown cleanup creates fake quotations.
                lines.append("  Available excerpt:\n" + "\n".join("  > " + line for line in item["available_excerpt"][:200].splitlines()))
            else:
                lines.append("  No source excerpt available.")
        return "\n".join(lines) or "- No source results were returned."

    @staticmethod
    def _prompt_external_sources(search_result: dict[str, Any]) -> list[dict[str, Any]]:
        allowed = ("title", "url", "excerpt", "content", "support_state")
        return [
            {key: item[key] for key in allowed if key in item}
            for item in search_result.get("external", [])
            if isinstance(item, dict)
        ]

    def _eligible_internal_sources(
        self, items: list[dict[str, Any]], matter_path: str, *, other_matters: bool = False
    ) -> list[dict[str, Any]]:
        eligible: list[dict[str, Any]] = []
        dossier_seen: set[str] = set()
        allowed_paths = {matter_path}
        if other_matters:
            allowed_paths.update(str(matter["path"]) for matter in self.index.list_matters())
        for item in items:
            path = str(item.get("path") or "")
            if not path:
                eligible.append(item)
                continue
            source_matter = next((root for root in allowed_paths if path.startswith(f"{root}/")), None)
            if source_matter is None:
                continue
            lowered = path.lower()
            if "/conversations/" in lowered or "/research/runs/" in lowered or "/dossier-revisions/" in lowered:
                continue
            if "/research/" in lowered and source_matter == matter_path:
                continue
            try:
                metadata = self.vault.read_markdown(path)["metadata"]
            except (OSError, ValueError, KeyError):
                metadata = {}
            if metadata.get("record_type") in {"chat_transcript", "research_run"}:
                continue
            if path.endswith("/dossier.md") or "/dossiers/" in lowered:
                if source_matter in dossier_seen:
                    continue
                dossier_seen.add(source_matter)
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
        if search_result.get("execution_version") == 2:
            return "retrieved" if any(s.get("support_state") == "retrieved" for s in search_result.get("external", [])) else "unavailable"
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
