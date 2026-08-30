from __future__ import annotations

from collections.abc import Callable
from datetime import UTC, datetime
from typing import Any, TypeVar

from pydantic import BaseModel, ValidationError

from app.models.awareness import (
    BriefingItem, BriefingPage, BriefingQuery, Digest, DurableResult, ListResponse,
    ProviderObservation, ReviewOutcome, ReviewPacket, SavedView, Scan,
)
from app.services.vault import VaultService


ROOTS = {
    "scan": "05_Briefing/scans",
    "development": "05_Briefing/developments",
    "item": "05_Briefing/items",
    "research": "05_Briefing/research",
    "packet": "05_Briefing/review-packets",
    "digest": "05_Briefing/digests",
    "view": "00_System/legal-awareness/views",
}
T = TypeVar("T", bound=BaseModel)


class BriefingStore:
    """Direct Markdown persistence for Briefing records."""

    def __init__(self, vault: VaultService):
        self.vault = vault
        self.warnings: list[str] = []

    def append_scan(self, scan: Scan) -> Scan:
        scan = self._fixed_path(scan, "scan", scan.scan_id)
        if self.vault.exists(scan.path):
            raise ValueError(f"Scan is append-only and already exists: {scan.scan_id}")
        self._write(scan.path, f"# Scan {scan.scan_id}", scan)
        return scan

    def update_scan(self, scan: Scan) -> Scan:
        """Finish one running scan without replacing its run identity or collected evidence."""
        path = f"{ROOTS['scan']}/{scan.scan_id}.md"
        current = self.get_scan(scan.scan_id)
        if current.status != "running":
            raise ValueError(f"Completed scan cannot be changed: {scan.scan_id}")
        if scan.status not in {"success", "partial", "failed", "interrupted"}:
            raise ValueError(f"Invalid scan transition: running to {scan.status}")

        immutable_fields = (
            "scan_id", "path", "watch_id", "mode", "watch_revision",
            "outbound_query", "input_checkpoints", "started_at",
        )
        for field in immutable_fields:
            expected = path if field == "path" else getattr(current, field)
            if getattr(scan, field) != expected:
                raise ValueError(f"Scan {field} cannot be changed")

        data = scan.model_dump()
        data.update({
            "provider_results": self._additive_models(
                current.provider_results, scan.provider_results
            ),
            "source_coverage": self._additive_models(
                current.source_coverage, scan.source_coverage
            ),
            "warnings": self._additive_values(current.warnings, scan.warnings),
            "created_paths": self._additive_values(
                current.created_paths, scan.created_paths
            ),
        })
        updated = Scan.model_validate(data)
        self._write(updated.path, f"# Scan {updated.scan_id}", updated)
        return updated

    def get_scan(self, scan_id: str) -> Scan:
        return self._get("scan", scan_id, Scan, "Scan")

    def list_scans(
        self, cursor: str | None = None, limit: int = 25
    ) -> ListResponse[Scan]:
        return self._page(
            self._list("scan", Scan), cursor, limit, lambda item: item.scan_id
        )

    def append_observation(self, development_id: str, observation: ProviderObservation) -> None:
        # Local import avoids making this store a second identity owner.
        from app.services.developments import DevelopmentService

        DevelopmentService(self.vault).append_observation(development_id, observation)

    def append_research(self, result: DurableResult) -> DurableResult:
        result = self._fixed_path(result, "research", result.result_id)
        if self.vault.exists(result.path):
            raise ValueError(f"Research result is append-only and already exists: {result.result_id}")
        self._write(result.path, f"# Research {result.result_id}\n\n{result.text}", result)
        return result

    def list_research(self, item_id: str) -> list[DurableResult]:
        records = [
            result for result in self._list("research", DurableResult)
            if result.briefing_item_id == item_id
        ]
        records.sort(key=lambda result: (
            result.created_at or datetime.min.replace(tzinfo=UTC), result.path
        ))
        return records

    def append_outcome(self, outcome: ReviewOutcome) -> ReviewOutcome:
        path = f"{ROOTS['packet']}/outcomes/{outcome.outcome_id}.md"
        if self.vault.exists(path):
            raise ValueError(f"Review outcome is append-only and already exists: {outcome.outcome_id}")
        self._write(path, f"# Review outcome {outcome.outcome_id}", outcome)
        return outcome

    def put_item(self, item: BriefingItem) -> BriefingItem:
        item = self._fixed_path(item, "item", item.item_id)
        if self.vault.exists(item.path):
            current = self.get_item(item.item_id)
            # Provider/generated refreshes cannot erase lawyer-owned triage fields.
            item = item.model_copy(update={
                "read": current.read,
                "saved": current.saved,
                "usefulness": current.usefulness,
                "review_packet_id": current.review_packet_id or item.review_packet_id,
                "revision": current.revision,
                "created_at": current.created_at,
            })
            item = BriefingItem.model_validate(item.model_dump())
        self._write(item.path, f"# {item.title}\n\n{item.summary}", item)
        return item

    def put_view(self, view: SavedView) -> SavedView:
        view = self._fixed_path(view, "view", view.view_id)
        view = SavedView.model_validate(view.model_dump(mode="json"))
        self._guard_revision(view.path, view.revision, "Saved view")
        self._write(view.path, f"# {view.name}", view)
        return view

    def put_digest(self, digest: Digest) -> Digest:
        digest = self._fixed_path(digest, "digest", digest.digest_id)
        if self.vault.exists(digest.path):
            raise ValueError(f"Digest is immutable and already exists: {digest.digest_id}")
        # The full resolved query and item IDs are copied into this immutable snapshot.
        snapshot = Digest.model_validate(digest.model_dump(mode="json"))
        self._write(snapshot.path, f"# {snapshot.title}\n\n{snapshot.summary}", snapshot)
        return snapshot

    def put_review_packet(self, packet: ReviewPacket) -> ReviewPacket:
        packet = self._fixed_path(packet, "packet", packet.packet_id)
        if self.vault.exists(packet.path):
            current = self.get_review_packet(packet.packet_id)
            packet = packet.model_copy(update={
                "status": current.status,
                "revision": current.revision,
                "created_at": current.created_at,
            })
            packet = ReviewPacket.model_validate(packet.model_dump())
        self._write(packet.path, f"# Review packet {packet.packet_id}\n\n{packet.what_happened}", packet)
        return packet

    # Alias used by generated packet builders.
    put_packet = put_review_packet

    def get_item(self, item_id: str) -> BriefingItem:
        return self._get("item", item_id, BriefingItem, "Briefing item")

    def get_view(self, view_id: str) -> SavedView:
        return self._get("view", view_id, SavedView, "Saved view")

    def get_digest(self, digest_id: str) -> Digest:
        return self._get("digest", digest_id, Digest, "Digest")

    def get_review_packet(self, packet_id: str) -> ReviewPacket:
        return self._get("packet", packet_id, ReviewPacket, "Review packet")

    get_packet = get_review_packet

    def list_items(self, query: BriefingQuery) -> BriefingPage:
        resolved = BriefingQuery.model_validate(query.model_dump(mode="json"))
        records = self._list("item", BriefingItem)
        records = [item for item in records if self._matches(item, resolved)]
        records.sort(key=self._sort_key(resolved.sort), reverse=resolved.sort != "unread")
        start = self._cursor_start(records, resolved.cursor, lambda item: item.item_id)
        page = records[start : start + resolved.limit]
        next_cursor = page[-1].item_id if start + resolved.limit < len(records) and page else None
        return BriefingPage(
            items=page,
            next_cursor=next_cursor,
            total=len(records),
            resolved_query=resolved,
        )

    def list_views(self, cursor: str | None = None, limit: int = 25) -> ListResponse[SavedView]:
        return self._page(self._list("view", SavedView), cursor, limit, lambda item: item.view_id)

    def list_digests(self, cursor: str | None = None, limit: int = 25) -> ListResponse[Digest]:
        return self._page(self._list("digest", Digest), cursor, limit, lambda item: item.digest_id)

    def list_review_packets(self, cursor: str | None = None, limit: int = 25) -> ListResponse[ReviewPacket]:
        return self._page(self._list("packet", ReviewPacket), cursor, limit, lambda item: item.packet_id)

    def _list(self, kind: str, model: type[T]) -> list[T]:
        self.warnings = []
        records: list[T] = []
        for path in self.vault.iter_files(ROOTS[kind], {".md"}):
            relative = self.vault.relative(path)
            if "/outcomes/" in relative:
                continue
            try:
                record = model.model_validate(self.vault.read_markdown(relative)["metadata"])
                expected_path = getattr(record, "path", relative)
                if expected_path != relative:
                    raise ValueError(f"record path {expected_path!r} does not match {relative!r}")
                records.append(record)
            except (OSError, ValueError, ValidationError) as exc:
                self.warnings.append(f"{relative}: {exc}")
        return records

    def _get(self, kind: str, record_id: str, model: type[T], label: str) -> T:
        path = f"{ROOTS[kind]}/{record_id}.md"
        if not self.vault.exists(path):
            raise KeyError(f"{label} not found: {record_id}")
        record = model.model_validate(self.vault.read_markdown(path)["metadata"])
        if getattr(record, "path", path) != path:
            raise ValueError(f"record path does not match {path!r}")
        return record

    def _guard_revision(self, path: str, revision: int, label: str) -> None:
        if not self.vault.exists(path):
            if revision != 1:
                raise ValueError(f"{label} must start at revision 1")
            return
        current = self.vault.read_markdown(path)["metadata"]
        expected = int(current.get("revision", 0)) + 1
        if revision != expected:
            raise ValueError(f"{label} revision conflict: expected {expected}, found {revision}")

    @staticmethod
    def _fixed_path(record: T, kind: str, record_id: str) -> T:
        data = record.model_dump()
        data["path"] = f"{ROOTS[kind]}/{record_id}.md"
        return type(record).model_validate(data)

    def _write(self, path: str, content: str, record: BaseModel) -> None:
        self.vault.write_markdown(path, content, record.model_dump(mode="json"))

    @staticmethod
    def _additive_values(existing: list[T], incoming: list[T]) -> list[T]:
        combined = list(existing)
        for value in incoming:
            if value not in combined:
                combined.append(value)
        return combined

    @staticmethod
    def _additive_models(existing: list[T], incoming: list[T]) -> list[T]:
        combined = list(existing)
        fingerprints = {
            repr(value.model_dump(mode="json")) for value in existing
        }
        for value in incoming:
            fingerprint = repr(value.model_dump(mode="json"))
            if fingerprint not in fingerprints:
                combined.append(value)
                fingerprints.add(fingerprint)
        return combined

    @staticmethod
    def _cursor_start(items: list[T], cursor: str | None, get_id: Callable[[T], str]) -> int:
        if not cursor:
            return 0
        return next((index + 1 for index, item in enumerate(items) if get_id(item) == cursor), 0)

    def _page(
        self, records: list[T], cursor: str | None, limit: int, get_id: Callable[[T], str]
    ) -> ListResponse[T]:
        records.sort(
            key=lambda item: getattr(item, "created_at", None)
            or getattr(item, "started_at"),
            reverse=True,
        )
        start = self._cursor_start(records, cursor, get_id)
        page = records[start : start + limit]
        next_cursor = get_id(page[-1]) if start + limit < len(records) and page else None
        return ListResponse(items=page, next_cursor=next_cursor, total=len(records))

    @staticmethod
    def _matches(item: BriefingItem, query: BriefingQuery) -> bool:
        haystack = " ".join([item.title, item.summary, item.why_shown]).casefold()
        if query.q and query.q.casefold() not in haystack:
            return False
        if query.watch and item.watch_id not in query.watch:
            return False
        if query.topic and not set(query.topic).intersection(item.topics):
            return False
        if query.jurisdiction and not set(query.jurisdiction).intersection(item.jurisdictions):
            return False
        if query.status and item.attention_state not in query.status:
            return False
        if query.read != "any" and item.read != (query.read == "yes"):
            return False
        if query.saved != "any" and item.saved != (query.saved == "yes"):
            return False
        if query.company_connection != "any" and bool(item.company_connection) != (query.company_connection == "yes"):
            return False
        if query.packet == "none" and item.review_packet_id is not None:
            return False
        if query.packet in {"connected", "required"} and item.review_packet_id is None:
            return False
        if query.packet == "required" and item.attention_state != "required":
            return False
        if query.impact and item.potential_impact != query.impact:
            return False
        if query.legal_status and item.legal_status != query.legal_status:
            return False
        if query.source:
            source_values = {
                value
                for source in item.sources
                for value in (str(source.canonical_url), source.publisher, source.title)
            }
            if not set(query.source).intersection(source_values):
                return False
        return True

    @staticmethod
    def _sort_key(sort: str) -> Callable[[BriefingItem], Any]:
        if sort == "potential_impact":
            rank = {None: 0, "low": 1, "medium": 2, "high": 3}
            return lambda item: (rank[item.potential_impact], item.created_at)
        if sort == "effective_date":
            return lambda item: (item.effective_at or item.created_at, item.created_at)
        if sort == "unread":
            return lambda item: (item.read, -item.created_at.timestamp())
        if sort == "primary_sources":
            return lambda item: (len(item.sources), item.created_at)
        if sort == "connected_decisions":
            return lambda item: (
                bool(item.company_connection and item.company_connection.decisions), item.created_at
            )
        return lambda item: item.created_at
