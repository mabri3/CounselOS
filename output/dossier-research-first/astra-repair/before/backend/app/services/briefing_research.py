from __future__ import annotations

from datetime import UTC, datetime

from app.models.awareness import DurableResult
from app.utils.ids import new_id


class BriefingResearchService:
    """Appends generated analysis without changing stored source-backed items."""

    def __init__(self, briefing):
        self.briefing = briefing
        self._agent_runner = None

    def bind_agent_runner(self, runner) -> None:
        self._agent_runner = runner

    async def run(
        self,
        item_id: str,
        question: str = "",
        history: list[DurableResult] | None = None,
    ) -> DurableResult:
        item = self.briefing.get_item(item_id)
        result_id = new_id("BRIEF-RES")
        text = ""
        warnings: list[str] = []
        sources = list(item.sources)
        if self._agent_runner is None:
            warnings.append("Briefing research agent is not configured.")
        else:
            try:
                prompt = question
                if history:
                    prior = "\n".join(
                        f"User: {result.question}\nAssistant: {result.text}"
                        for result in history[-6:]
                    )
                    prompt = f"Previous Briefing chat:\n{prior}\n\nCurrent request:\n{question}"
                response = await self._agent_runner(item, prompt)
                text = self._response_text(response)
                response_sources = getattr(response, "sources", None)
                if response_sources:
                    sources.extend(source for source in response_sources if source not in sources)
                warnings.extend(str(value) for value in getattr(response, "warnings", []) if value)
            except Exception as exc:
                warnings.append(f"Additional research failed: {type(exc).__name__}: {exc}")
        if not text:
            text = (
                f"Stored source-backed analysis remains available for {item.title}. "
                "No additional generated analysis was produced."
            )
        status = "success" if not warnings else "partial"
        durable = DurableResult(
            result_id=result_id, path="pending", status=status, text=text,
            warnings=warnings, sources=sources, briefing_item_id=item_id,
            question=question, kind="research", created_at=datetime.now(UTC),
        )
        return self.briefing.append_research(durable)

    research = run

    @staticmethod
    def _response_text(response) -> str:
        if isinstance(response, str):
            return response.strip()
        for field in ("text", "reply", "content"):
            value = getattr(response, field, None)
            if isinstance(value, str) and value.strip():
                return value.strip()
        if isinstance(response, dict):
            for field in ("text", "reply", "content"):
                value = response.get(field)
                if isinstance(value, str) and value.strip():
                    return value.strip()
        return ""
