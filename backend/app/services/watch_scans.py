from __future__ import annotations

import asyncio
import hashlib
import logging
from datetime import UTC, datetime, timedelta

from pydantic import ValidationError

from app.models.awareness import (
    BriefingItem, CompanyConnection, Development, DevelopmentBatch, MatchResult,
    ProviderScanResult, Scan, ScanMode, ScanResult, Watch,
)
from app.utils.ids import new_id


logger = logging.getLogger(__name__)


class WatchScanService:
    """Coordinates one privacy-safe, durable Watch run."""

    def __init__(
        self, watches, briefing, developments, registry, outbound_policy,
        internal_knowledge, matcher, review_packets, index,
    ):
        self.watches = watches
        self.briefing = briefing
        self.developments = developments
        self.registry = registry
        self.outbound_policy = outbound_policy
        self.internal_knowledge = internal_knowledge
        self.matcher = matcher
        self.review_packets = review_packets
        self.index = index
        self._locks: dict[str, asyncio.Lock] = {}

    async def run_watch(self, watch_id: str, mode: ScanMode) -> ScanResult:
        lock = self._locks.setdefault(watch_id, asyncio.Lock())
        if lock.locked():
            raise ValueError(f"active scan conflict for Watch {watch_id}")
        await lock.acquire()
        try:
            return await self._run_locked(watch_id, mode)
        finally:
            lock.release()

    async def _run_locked(self, watch_id: str, mode: ScanMode) -> ScanResult:
        watch = self.watches.get(watch_id)
        # Fail closed before a task or coroutine for a provider is created.
        try:
            corpus = self.internal_knowledge.forbidden_corpus(watch)
            if not corpus.terms and not corpus.fragments and not corpus.proved_no_private_identifiers:
                raise ValueError("empty forbidden corpus lacks explicit local proof")
            outbound = self.outbound_policy.prepare(watch, corpus)
        except Exception as exc:
            scan = self._running_scan(watch, mode, None)
            scan = self.briefing.append_scan(scan)
            failed = scan.model_copy(update={
                "status": "failed", "warnings": [self._warning("Outbound query validation failed", exc)],
                "completed_at": datetime.now(UTC),
            })
            saved = self.briefing.update_scan(failed)
            try:
                await self.index.rebuild_async()
            except Exception as rebuild_exc:
                logger.warning("Awareness index rebuild failed: %s", type(rebuild_exc).__name__)
                saved = self._append_terminal_warning(
                    saved, self._warning("Awareness index rebuild failed", rebuild_exc),
                )
            return ScanResult(scan=saved)

        scan = self.briefing.append_scan(self._running_scan(watch, mode, outbound))
        provider_ids = ["native", "polaris"] if watch.provider == "both" else [watch.provider]
        results = await asyncio.gather(
            *(self._scan_provider(provider_id, outbound, watch) for provider_id in provider_ids)
        )

        warnings: list[str] = []
        batches: list[DevelopmentBatch] = []
        created_paths: list[str] = []
        for result in results:
            warnings.extend(result.warnings)
            if result.candidates:
                try:
                    batch = self.developments.record_candidates(
                        watch.watch_id, result.provider_id, result.candidates
                    )
                    batches.append(batch)
                    warnings.extend(batch.warnings)
                    created_paths.extend(item.path for item in batch.developments)
                except Exception as exc:
                    warnings.append(self._warning(f"{result.provider_id} candidate persistence failed", exc))

        combined = self._rematch_batch(watch, batches, warnings)
        preview_items: list[BriefingItem] = []
        preview_packets = []
        snapshot = None
        try:
            snapshot = self.internal_knowledge.snapshot(watch.internal_scope)
            matches = self.matcher.match(combined, snapshot)
            warnings.extend(matches.warnings)
        except Exception as exc:
            matches = MatchResult(warnings=[self._warning("Internal matching failed", exc)])
            warnings.extend(matches.warnings)

        try:
            preview_items = self._put_items(watch, combined, matches, snapshot)
            created_paths.extend(item.path for item in preview_items)
        except Exception as exc:
            warnings.append(self._warning("Briefing item persistence failed", exc))

        try:
            packet_matches = self._without_existing_packets(matches, preview_items)
            preview_packets = self.review_packets.build(packet_matches)
            self._connect_packets(preview_packets, preview_items)
            created_paths.extend(packet.path for packet in preview_packets)
        except Exception as exc:
            warnings.append(self._warning("Review packet generation failed", exc))

        output_checkpoints = {
            result.provider_id: result.next_checkpoint
            for result in results
            if result.status == "success" and result.next_checkpoint is not None
        }
        status = self._terminal_status(results)
        current_run_material = any(
            result.candidates or result.bounded_excerpt.strip() for result in results
        )
        if warnings and current_run_material and status == "success":
            status = "partial"
        terminal = scan.model_copy(update={
            "status": status,
            "provider_results": results,
            "source_coverage": [coverage for result in results for coverage in result.source_coverage],
            "output_checkpoints": output_checkpoints,
            "development_count": len({item.development_id for item in combined.developments}),
            "briefing_item_count": len(preview_items),
            "review_packet_count": len(preview_packets),
            "warnings": self._unique(warnings),
            "created_paths": self._unique(created_paths),
            "completed_at": datetime.now(UTC),
        })
        saved = self.briefing.update_scan(terminal)
        self._advance_watch(saved, output_checkpoints)
        try:
            await self.index.rebuild_async()
        except Exception as exc:
            logger.warning("Awareness index rebuild failed: %s", type(exc).__name__)
            saved = self._append_terminal_warning(saved, self._warning("Awareness index rebuild failed", exc))
        return ScanResult(scan=saved, preview_items=preview_items, preview_packets=preview_packets)

    async def _scan_provider(self, provider_id, outbound, watch) -> ProviderScanResult:
        try:
            provider = self.registry.resolve(provider_id)
            result = await provider.scan(outbound, watch.checkpoints.get(provider_id))
            if result.provider_id != provider_id:
                raise ValueError(f"provider returned mismatched ID {result.provider_id}")
            return result
        except Exception as exc:
            return ProviderScanResult(
                provider_id=provider_id, status="failed",
                warnings=[self._warning(f"{provider_id} provider failed", exc)],
            )

    def mark_interrupted_runs(self) -> int:
        count = 0
        cursor = None
        while True:
            page = self.briefing.list_scans(cursor=cursor, limit=100)
            for scan in page.items:
                if scan.status != "running":
                    continue
                interrupted = scan.model_copy(update={
                    "status": "interrupted", "completed_at": datetime.now(UTC),
                    "warnings": [*scan.warnings, "The application restarted before this scan finished."],
                })
                self.briefing.update_scan(interrupted)
                count += 1
            if not page.next_cursor:
                break
            cursor = page.next_cursor
        if count:
            self.index.rebuild()
        return count

    def _running_scan(self, watch: Watch, mode: ScanMode, outbound) -> Scan:
        return Scan(
            scan_id=new_id("SCAN"), path="pending", watch_id=watch.watch_id,
            mode=mode, status="running", watch_revision=watch.revision,
            outbound_query=outbound, input_checkpoints=dict(watch.checkpoints),
            started_at=datetime.now(UTC),
        )

    def _rematch_batch(self, watch, batches, warnings) -> DevelopmentBatch:
        developments = {item.development_id: item for batch in batches for item in batch.developments}
        cutoff = datetime.now(UTC) - timedelta(days=watch.internal_scope.lookback_days)
        vault = self.briefing.vault
        for path in vault.iter_files("05_Briefing/developments", {".md"}):
            relative = vault.relative(path)
            try:
                item = Development.model_validate(vault.read_markdown(relative)["metadata"])
                relevant_at = item.occurred_at or item.updated_at
                if watch.watch_id in item.watch_ids and relevant_at >= cutoff:
                    developments.setdefault(item.development_id, item)
            except (OSError, ValueError, ValidationError) as exc:
                warnings.append(f"{relative}: {exc}")
        return DevelopmentBatch(developments=list(developments.values()), warnings=self._unique(warnings))

    def _put_items(self, watch, batch, matches, snapshot):
        connection_by_id = {item.development_id: item for item in matches.connections}
        records_by_id = {
            record.record_id: record for record in (snapshot.records if snapshot else [])
        }
        now = datetime.now(UTC)
        items = []
        for development in batch.developments:
            connection = connection_by_id.get(development.development_id)
            internal_ids = connection.internal_record_ids if connection else []
            classified = {
                "product": [], "policy": [], "matter": [], "decision": [], "mitigation": [],
            }
            for record_id in internal_ids:
                record = records_by_id.get(record_id)
                if record and record.record_type in classified:
                    classified[record.record_type].append(record_id)
            company = CompanyConnection(
                products=classified["product"], policies=classified["policy"],
                matters=classified["matter"], decisions=classified["decision"],
                mitigations=classified["mitigation"],
                reason=connection.reason if connection else "",
            ) if any(classified.values()) else None
            sources = [source for observation in development.observations for source in observation.sources]
            digest = hashlib.sha256(f"{watch.watch_id}\0{development.development_id}".encode()).hexdigest()[:16]
            item = BriefingItem(
                item_id=f"ITEM-{digest}", path="pending", development_id=development.development_id,
                watch_id=watch.watch_id, title=development.title,
                summary=development.summary or development.title,
                why_shown=connection.reason if connection else f"Collected by Watch {watch.title}.",
                topics=list(watch.public_query.topics),
                jurisdictions=list(watch.public_query.jurisdictions), sources=sources,
                published_at=development.occurred_at, company_connection=company,
                attention_state=connection.attention_state if connection else "briefing_only",
                potential_impact=(
                    {"required": "high", "this_week": "medium", "monitor": "low"}.get(connection.attention_state)
                    if connection else None
                ), legal_status=development.legal_status, created_at=now, updated_at=now,
            )
            items.append(self.briefing.put_item(item))
        return items

    @staticmethod
    def _without_existing_packets(matches, items):
        blocked = {item.development_id for item in items if item.review_packet_id}
        return MatchResult(
            connections=[item for item in matches.connections if item.development_id not in blocked],
            warnings=matches.warnings,
        )

    def _connect_packets(self, packets, items):
        by_development = {item.development_id: item for item in items}
        for packet in packets:
            for development_id in packet.development_ids:
                item = by_development.get(development_id)
                if item:
                    updated = item.model_copy(update={"review_packet_id": packet.packet_id})
                    saved = self.briefing.put_item(updated)
                    by_development[development_id] = saved
                    items[items.index(item)] = saved

    def _advance_watch(self, scan, checkpoints):
        return self.watches.apply_scan_result(scan, checkpoints)

    def _append_terminal_warning(self, scan, warning):
        # A terminal Scan is immutable. Keep the in-memory result honest without
        # pretending that the failed disposable-index update changed Markdown.
        return scan.model_copy(update={"warnings": self._unique([*scan.warnings, warning])})

    @staticmethod
    def _terminal_status(results):
        success = sum(result.status in {"success", "partial"} for result in results)
        failed = sum(result.status == "failed" for result in results)
        if failed and success:
            return "partial"
        if failed and not success:
            return "failed"
        return "partial" if any(result.status == "partial" for result in results) else "success"

    @staticmethod
    def _warning(prefix, exc):
        logger.warning("Watch scan step failed: %s", type(exc).__name__)
        return f"{prefix}: {type(exc).__name__}: {exc}"

    @staticmethod
    def _unique(values):
        return list(dict.fromkeys(value for value in values if value))
