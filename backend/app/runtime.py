from __future__ import annotations

from app.agents.context import ContextBuilder
from app.agents.registry import AgentRegistry
from app.agents.runner import AgentRunner
from app.config import Settings, get_settings
from app.intelligence.fetch import SafeHttpFetcher
from app.intelligence.native import NativeIntelligenceProvider
from app.intelligence.outbound_policy import OutboundQueryPolicy
from app.intelligence.polaris import PolarisIntelligenceProvider
from app.intelligence.registry import IntelligenceRegistry
from app.intelligence.source_support import SourceSupportService
from app.models.api import ChatRequest
from app.models.awareness import SafeFetchLimits
from app.providers.factory import ProviderRouter, build_provider
from app.providers.openai_compatible import OpenAICompatibleProvider
from app.services.annotations import AnnotationService
from app.services.awareness_matching import AwarenessMatcher
from app.services.briefing_query import BriefingQueryService
from app.services.briefing_research import BriefingResearchService
from app.services.briefing_store import BriefingStore
from app.services.chat_history import ChatHistoryService
from app.services.chat_runs import ChatRunService
from app.services.company import CompanyProfileService
from app.services.company_interview import CompanyInterviewService
from app.services.decisions import DecisionService
from app.services.developments import DevelopmentService
from app.services.document_export import DocumentExportService
from app.services.document_review import DocumentReviewService
from app.services.dossier import DossierService
from app.services.index import IndexService
from app.services.ingestion import IngestionService
from app.services.internal_knowledge import InternalKnowledgeService
from app.services.matters import MatterService
from app.services.matter_paths import MatterPathPolicy
from app.services.mitigations import MitigationService
from app.services.matter_state import MatterStateService
from app.services.matter_records import MatterRecordService
from app.services.research import ResearchService
from app.services.research_runs import ResearchRunService
from app.services.review_outcomes import ReviewOutcomeService
from app.services.review_packets import ReviewPacketService
from app.services.scheduler import SchedulerService
from app.services.search import SearchService
from app.services.settings import SettingsService
from app.services.skill_builder import SkillBuilderService
from app.services.vault import VaultService
from app.services.watch_scans import WatchScanService
from app.services.watches import WatchStore
from app.services.workflow import WorkflowService
from app.services.work_product import WorkProductService
from app.tools.handlers import build_handlers
from app.tools.registry import ToolRegistry
from app.skills.registry import SkillRegistry


class AppContext:
    """Explicit service container; keeps the MVP modular without a DI framework."""

    def __init__(self, settings: Settings | None = None, *, recover_interrupted: bool = True):
        self.settings = settings or get_settings()
        self.vault = VaultService(self.settings.resolved_vault_path)
        self.settings_store = SettingsService(self.vault)
        self._load_saved_model_settings()
        self.index = IndexService(self.settings.cache_db_path, self.vault)
        self.workflow = WorkflowService(self.vault)
        self.index.rebuild()

        self.matter_state = MatterStateService(self.vault)
        self.matters = MatterService(self.vault, self.index, self.workflow, self.matter_state)
        self.matter_paths = MatterPathPolicy(self.settings_store, self.matters)
        self.chat_history = ChatHistoryService(self.vault, self.matters)
        self.company = CompanyProfileService(self.vault)
        self.matter_records = MatterRecordService(self.vault, self.matters)
        self.dossiers = DossierService(self.vault, self.matters)
        self.matters.bind_dossiers(self.dossiers)
        self.work_products = WorkProductService(self.vault, self.matters, self.matter_paths)
        self.document_reviews = DocumentReviewService(self.vault)
        self.document_exports = DocumentExportService(self.vault)
        self.ingestion = IngestionService(
            self.vault,
            self.index,
            self.matters,
            self.matter_paths,
            max_upload_mb=self.settings.max_upload_mb,
        )
        self.decisions = DecisionService(
            self.vault,
            self.index,
            self.matters,
            review_age_days=self.settings.decision_review_age_days,
        )
        self.provider = build_provider(self.settings)
        self.search = SearchService(self.settings, self.vault)
        self.watches = WatchStore(self.vault)
        self.briefing = BriefingStore(self.vault)
        self.developments = DevelopmentService(self.vault)
        self.internal_knowledge = InternalKnowledgeService(self.vault)
        self.awareness_matcher = AwarenessMatcher()
        self.review_packets = ReviewPacketService(self.vault, self.briefing)
        self.mitigations = MitigationService(self.vault)
        limits = SafeFetchLimits(
            request_timeout_seconds=self.settings.intelligence_request_timeout_seconds,
            run_timeout_seconds=self.settings.intelligence_run_timeout_seconds,
            max_redirects=self.settings.intelligence_max_redirects,
            max_compressed_bytes=self.settings.intelligence_max_compressed_bytes,
            max_decompressed_bytes=self.settings.intelligence_max_decompressed_bytes,
            max_excerpt_characters=self.settings.intelligence_max_excerpt_characters,
        )
        self.safe_fetch_limits = limits
        self.intelligence_fetcher = SafeHttpFetcher()
        self.company_interview = CompanyInterviewService(
            self.provider,
            self.settings,
            self.intelligence_fetcher,
            self.safe_fetch_limits,
        )
        self.native_intelligence = NativeIntelligenceProvider(
            self.intelligence_fetcher,
            self.search,
            limits=limits,
            max_discovery_urls=self.settings.intelligence_max_discovery_urls,
            max_candidates=self.settings.intelligence_max_candidates,
        )
        self.polaris_intelligence = PolarisIntelligenceProvider(self.settings.polaris_api_key)
        self.intelligence = IntelligenceRegistry(
            self.native_intelligence, self.polaris_intelligence
        )
        self.outbound_query_policy = OutboundQueryPolicy()
        self.source_support = SourceSupportService(self.intelligence_fetcher, limits=limits)
        self.watch_scans = WatchScanService(
            self.watches,
            self.briefing,
            self.developments,
            self.intelligence,
            self.outbound_query_policy,
            self.internal_knowledge,
            self.awareness_matcher,
            self.review_packets,
            self.index,
        )
        # Recover durable runs before any router can query awareness records.
        if recover_interrupted:
            self.watch_scans.mark_interrupted_runs()
        self.briefing_query = BriefingQueryService(self.briefing, self.index)
        self.briefing_research = BriefingResearchService(self.briefing)
        self.research = ResearchService(
            self.vault,
            self.index,
            self.matters,
            self.search,
            self.provider,
            self.dossiers,
        )
        self.research.bind_polaris(
            self.polaris_intelligence,
            self.outbound_query_policy,
        )
        self.annotations = AnnotationService(self.vault, self.matters)
        self.agents = AgentRegistry(self.vault, self.settings.max_agent_steps)
        self.provider_router = ProviderRouter(self.settings, self.provider)
        self.skills = SkillRegistry(self.vault)
        self.skill_builder = SkillBuilderService(
            self.skills,
            self.chat_history,
            self.provider,
            self.settings,
        )
        self.tools = ToolRegistry(self.vault, build_handlers())
        self.agent_context = ContextBuilder(self.vault, self.index, self.agents, self.matter_state)
        self.scheduler = SchedulerService(
            self.vault,
            self.index,
            poll_seconds=self.settings.scheduler_poll_seconds,
        )
        self.runner = AgentRunner(
            self.provider,
            self.agents,
            self.tools,
            self.agent_context,
            self.skills,
            self,
            provider_resolver=self.provider_router.resolve,
        )
        self.research.bind_agent_runner(self.runner.run)
        self.research_runs = ResearchRunService(
            self.vault,
            self.research,
            resolve_agent=lambda: self.runner.resolve("research-agent"),
            resolve_selection=self.provider_router.resolve_selection,
        )
        if recover_interrupted:
            self.research_runs.mark_running_interrupted()
        self.chat_runs = ChatRunService(
            self.vault, self, timeout_seconds=self.settings.chat_run_timeout_seconds
        )
        if recover_interrupted:
            self.chat_runs.mark_running_interrupted()
        self.scheduler.bind(self)
        self.scheduler.bind_watch_runner(
            lambda watch_id: self.watch_scans.run_watch(watch_id, "scheduled")
        )
        self.scheduler.bind_digest_runner(self._run_briefing_digest)
        self.briefing_research.bind_agent_runner(self._run_briefing_research)
        self.review_outcomes = ReviewOutcomeService(
            self.briefing, self.decisions, self.matters, self.index
        )
        self.annotations.bind(self.runner)

    def recover_interrupted_work(self) -> None:
        self.watch_scans.mark_interrupted_runs()
        self.research_runs.mark_running_interrupted()
        self.chat_runs.mark_running_interrupted()

    def has_active_work(self) -> bool:
        return self.scheduler.has_active_work or self.research_runs.has_active_work or self.chat_runs.has_active_work

    def validate_runtime(self) -> None:
        if not self.workflow.stages():
            raise ValueError("The vault workflow has no stages.")
        self.agents.get("counsel-copilot")
        self.tools.list()

    async def _run_briefing_research(self, item, question: str):
        return await self.runner.run(
            ChatRequest(
                message=question or f"Research this Briefing item further: {item.title}",
                active_file=item.path,
                agent_id="research-agent",
            )
        )

    async def _run_briefing_digest(self, view_id: str):
        return self.briefing_query.create_digest(view_id)

    def _load_saved_model_settings(self) -> None:
        values = self.settings_store.read()["values"]
        provider = values.get("agents.provider")
        if provider not in {"mock", "openai_compatible", "polaris", "opencode_go", "codex", "antigravity_cli"}:
            return
        updates: dict[str, str | None] = {"llm_provider": provider}
        if provider != "mock" and values.get("agents.reasoning_model"):
            updates["llm_model"] = str(values["agents.reasoning_model"])
        effort = str(values.get("agents.reasoning_effort", "default"))
        updates["llm_reasoning_effort"] = (
            effort
            if provider != "mock"
            and effort in {"none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"}
            else None
        )
        self.settings = self.settings.model_copy(update=updates)

    async def configure_model(self, provider: str, model: str, effort: str) -> None:
        if provider not in {"mock", "openai_compatible", "polaris", "opencode_go", "codex", "antigravity_cli"}:
            raise ValueError(f"Unsupported model provider: {provider}")
        if effort not in {"default", "none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"}:
            raise ValueError(f"Unsupported reasoning effort: {effort}")
        if provider != "mock" and not model:
            raise ValueError("Select a model for this provider.")

        updates: dict[str, str | None] = {
            "llm_provider": provider,
            "llm_reasoning_effort": None if provider == "mock" or effort == "default" else effort,
        }
        if provider != "mock":
            updates["llm_model"] = model
        next_settings = self.settings.model_copy(update=updates)
        next_provider = build_provider(next_settings)

        await self.provider_router.update_workspace(next_settings, next_provider)
        self.settings = next_settings
        self.provider = next_provider
        self.research.provider = next_provider
        self.skill_builder.provider = next_provider
        self.skill_builder.settings = next_settings
        self.company_interview.provider = next_provider
        self.company_interview.settings = next_settings
        # The bound adapter uses the current runner, whose provider was refreshed above.
        self.briefing_research.bind_agent_runner(self._run_briefing_research)

    async def model_catalog(self) -> dict[str, object]:
        self.provider_router.settings = self.settings
        saved = {
            definition.provider: definition.model
            for definition in (self.agents.get(item["agent_id"]) for item in self.agents.list())
            if definition.provider and definition.model
        }
        if self.settings.llm_model:
            saved.setdefault(self.settings.llm_provider, self.settings.llm_model)
        return await self.provider_router.catalog(saved)

    async def close_providers(self) -> None:
        await self.provider_router.close()
