from __future__ import annotations

from app.agents.context import ContextBuilder
from app.agents.registry import AgentRegistry
from app.agents.runner import AgentRunner
from app.config import Settings, get_settings
from app.providers.factory import build_provider
from app.services.decisions import DecisionService
from app.services.index import IndexService
from app.services.ingestion import IngestionService
from app.services.matters import MatterService
from app.services.research import ResearchService
from app.services.scheduler import SchedulerService
from app.services.search import SearchService
from app.services.vault import VaultService
from app.services.workflow import WorkflowService
from app.tools.handlers import build_handlers
from app.tools.registry import ToolRegistry


class AppContext:
    """Explicit service container; keeps the MVP modular without a DI framework."""

    def __init__(self, settings: Settings | None = None):
        self.settings = settings or get_settings()
        self.vault = VaultService(self.settings.resolved_vault_path)
        self.index = IndexService(self.settings.cache_db_path, self.vault)
        self.workflow = WorkflowService(self.vault)
        self.index.rebuild()

        self.matters = MatterService(self.vault, self.index, self.workflow)
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
        self.scheduler.bind(self)
