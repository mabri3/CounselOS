from __future__ import annotations

from datetime import UTC, datetime

from app.models.awareness import BriefingQuery, Digest
from app.utils.ids import new_id


class BriefingQueryService:
    """Executes canonical Briefing queries and stores immutable view snapshots."""

    def __init__(self, briefing, index, query_parser=None):
        self.briefing = briefing
        self.index = index
        self._query_parser = query_parser

    def bind_query_parser(self, parser) -> None:
        self._query_parser = parser

    def query(self, query: BriefingQuery):
        resolved = query
        if query.view:
            view = self.briefing.get_view(query.view)
            # URL paging controls may change while saved semantics stay fixed.
            resolved = view.query.model_copy(update={
                "view": view.view_id, "cursor": query.cursor, "limit": query.limit,
            })
        return self.index.query_briefing(resolved)

    async def query_text(self, text: str, *, limit: int = 25):
        """Use a bound parser when valid, otherwise keep stable text-search semantics."""
        fallback = BriefingQuery(q=text, limit=limit)
        if self._query_parser is None:
            return self.query(fallback)
        try:
            proposed = await self._query_parser(text)
            if isinstance(proposed, BriefingQuery):
                parsed = proposed
            elif isinstance(proposed, dict):
                parsed = BriefingQuery.model_validate(proposed)
            else:
                raise ValueError("query parser returned an unsupported value")
            parsed = parsed.model_copy(update={"limit": limit})
            return self.query(parsed)
        except Exception:
            return self.query(fallback)

    def create_digest(self, view_id: str) -> Digest:
        view = self.briefing.get_view(view_id)
        snapshot_query = view.query.model_copy(update={"view": view.view_id, "cursor": None, "limit": 100})
        page = self.index.query_briefing(snapshot_query)
        now = datetime.now(UTC)
        digest = Digest(
            digest_id=new_id("DIGEST"), path="pending", view_id=view.view_id,
            view_name=view.name, resolved_query=page.resolved_query,
            item_ids=[item.item_id for item in page.items],
            title=f"{view.name} — {now.date().isoformat()}",
            summary=f"{page.total} Briefing item{'s' if page.total != 1 else ''} matched this saved view.",
            warnings=list(getattr(self.index, "last_report", ()).errors) if getattr(self.index, "last_report", None) else [],
            created_at=now,
        )
        return self.briefing.put_digest(digest)
