from __future__ import annotations

from app.agents.context import ContextBuilder
from app.agents.registry import AgentRegistry
from app.agents.runner import AgentRunner
from app.config import Settings, get_settings
from app.providers.factory import build_provider
from app.providers.openai_compatible import OpenAICompatibleProvider
from app.services.annotations import AnnotationService
from app.services.chat_history import ChatHistoryService
from app.services.company import CompanyProfileService
from app.services.decisions import DecisionService
from app.services.dossier import DossierService
from app.services.index import IndexService
from app.services.ingestion import IngestionService
from app.services.matters import MatterService
from app.services.matter_records import MatterRecordService
from app.services.research import ResearchService
from app.services.research_runs import ResearchRunService
from app.services.scheduler import SchedulerService
from app.services.search import SearchService
from app.services.settings import SettingsService
from app.services.vault import VaultService
from app.services.workflow import WorkflowService
from app.services.work_product import WorkProductService
from app.tools.handlers import build_handlers
from app.tools.registry import ToolRegistry


class AppContext:
    """Explicit service container; keeps the MVP modular without a DI framework."""

    def __init__(self, settings: Settings | None = None):
        self.settings = settings or get_settings()
        self.vault = VaultService(self.settings.resolved_vault_path)
        self.settings_store = SettingsService(self.vault)
        self._load_saved_model_settings()
        self.index = IndexService(self.settings.cache_db_path, self.vault)
        self.workflow = WorkflowService(self.vault)
        self.index.rebuild()

        self.matters = MatterService(self.vault, self.index, self.workflow)
        self.chat_history = ChatHistoryService(self.vault, self.matters)
        self.company = CompanyProfileService(self.vault)
        self.matter_records = MatterRecordService(self.vault, self.matters)
        self.dossiers = DossierService(self.vault, self.matters)
        self.work_products = WorkProductService(self.vault, self.matters)
        self.ingestion = IngestionService(
            self.vault,
            self.index,
            self.matters,
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
        self.research = ResearchService(
            self.vault,
            self.index,
            self.matters,
            self.search,
            self.provider,
        )
        self.annotations = AnnotationService(self.vault, self.matters)
        self.agents = AgentRegistry(self.vault, self.settings.max_agent_steps)
        self.tools = ToolRegistry(self.vault, build_handlers())
        self.agent_context = ContextBuilder(self.vault, self.index, self.agents)
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
            self,
        )
        self.research.bind_agent_runner(self.runner.run)
        self.research_runs = ResearchRunService(self.vault, self.research)
        self.research_runs.mark_running_interrupted()
        self.scheduler.bind(self)
        self.annotations.bind(self.runner)

    def _load_saved_model_settings(self) -> None:
        values = self.settings_store.read()["values"]
        provider = values.get("agents.provider")
        if provider not in {"mock", "openai_compatible"}:
            return
        updates: dict[str, str | None] = {"llm_provider": provider}
        if provider == "openai_compatible" and values.get("agents.reasoning_model"):
            updates["llm_model"] = str(values["agents.reasoning_model"])
        effort = str(values.get("agents.reasoning_effort", "default"))
        updates["llm_reasoning_effort"] = (
            effort
            if provider == "openai_compatible"
            and effort in {"none", "minimal", "low", "medium", "high", "xhigh", "max"}
            else None
        )
        self.settings = self.settings.model_copy(update=updates)

    def configure_model(self, provider: str, model: str, effort: str) -> None:
        if provider not in {"mock", "openai_compatible"}:
            raise ValueError(f"Unsupported model provider: {provider}")
        if effort not in {"default", "none", "minimal", "low", "medium", "high", "xhigh", "max"}:
            raise ValueError(f"Unsupported reasoning effort: {effort}")
        if provider == "openai_compatible" and not model:
            raise ValueError("Select a model for the OpenAI-compatible provider.")

        updates: dict[str, str | None] = {
            "llm_provider": provider,
            "llm_reasoning_effort": None if provider == "mock" or effort == "default" else effort,
        }
        if provider == "openai_compatible":
            updates["llm_model"] = model
        next_settings = self.settings.model_copy(update=updates)
        next_provider = build_provider(next_settings)

        self.settings = next_settings
        self.provider = next_provider
        self.research.provider = next_provider
        self.runner.provider = next_provider

    async def model_catalog(self) -> dict[str, object]:
        compatible_models: list[dict[str, object]] = []
        catalog_warning: str | None = None
        if self.settings.llm_api_key:
            try:
                compatible_models = await OpenAICompatibleProvider.available_models(self.settings)
            except Exception as exc:
                catalog_warning = f"Could not refresh the provider model list: {exc}"
        compatible_ids = {str(model["id"]) for model in compatible_models}
        if self.settings.llm_model and self.settings.llm_model not in compatible_ids:
            fallback_efforts = ["default"]
            if self.settings.llm_reasoning_effort:
                fallback_efforts.append(self.settings.llm_reasoning_effort)
            compatible_models.append(
                {
                    "id": self.settings.llm_model,
                    "label": self.settings.llm_model,
                    "efforts": fallback_efforts,
                }
            )
        compatible_models.sort(key=lambda model: str(model["id"]))

        providers: list[dict[str, object]] = [
            {
                "id": "mock",
                "label": "Mock (offline)",
                "models": [{"id": "mock", "label": "Mock demo", "efforts": ["default"]}],
            }
        ]
        if self.settings.llm_api_key and compatible_models:
            host = self.settings.llm_base_url.split("//", 1)[-1].split("/", 1)[0]
            label = self.settings.llm_provider_label or f"OpenAI-compatible ({host})"
            if self.settings.llm_provider_label:
                label = f"{label} (OpenAI-compatible)"
            providers.append(
                {
                    "id": "openai_compatible",
                    "label": label,
                    "models": compatible_models,
                }
            )
        return {"providers": providers, "warning": catalog_warning}
