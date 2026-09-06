from __future__ import annotations

from datetime import UTC, datetime

from app.models.awareness import MatchResult, ReviewPacket, SourceReference
from app.services.briefing_store import BriefingStore
from app.services.developments import DevelopmentService
from app.services.vault import VaultService
from app.services.watches import WatchStore
from app.utils.ids import new_id


class ReviewPacketService:
    """Builds generated review packets. It does not record lawyer actions."""

    def __init__(self, vault: VaultService, store: BriefingStore):
        self.vault = vault
        self.store = store
        self.developments = DevelopmentService(vault)
        self.watches = WatchStore(vault)

    def build(self, match_result: MatchResult) -> list[ReviewPacket]:
        packets: list[ReviewPacket] = []
        for connection in match_result.connections:
            if connection.attention_state == "briefing_only":
                continue
            warnings = list(match_result.warnings)
            try:
                development = self.developments.get(connection.development_id)
            except (KeyError, OSError, ValueError) as exc:
                warnings.append(f"Development details unavailable: {exc}")
                continue

            records = [record for rid in connection.internal_record_ids if (record := self._find_record(rid))]
            decisions = [record for record in records if record[0] == "decision"]
            mitigations = [record for record in records if record[0] == "mitigation"]
            assumption_links = self._assumption_links(development.watch_ids)
            linked_decision_ids = {str(item) for link in assumption_links for item in link.get("decision_ids", [])}
            linked_matter_ids = {str(link.get("matter_id")) for link in assumption_links if link.get("matter_id")}
            briefing_items = self._briefing_items(development.development_id)
            source_roles, role_warnings = self._source_roles(briefing_items)
            warnings.extend(role_warnings)
            sources = self._ordered_sources(
                [source for obs in development.observations for source in obs.sources], source_roles
            )
            excluded_urls = {
                url for url, role in source_roles.items() if role == "excluded" and url in {str(source.canonical_url) for source in sources}
            }
            if excluded_urls:
                warnings.append("Excluded Watch sources were retained at the end for provenance.")
            warnings.extend(source.warning for source in sources if source.warning)
            warnings.extend(obs_warning for obs in development.observations for obs_warning in obs.warnings)
            basis = "; ".join(str(data.get("rationale") or data.get("chosen_path") or "") for _, _, data in decisions if data.get("rationale") or data.get("chosen_path"))
            existing = [f"{data.get('title', rid)} — {data.get('status', 'status unknown')}" for _, rid, data in mitigations]
            dates = sorted({source.effective_at.date() for source in sources if source.effective_at})
            if development.occurred_at:
                timing = f"Occurred {development.occurred_at.date().isoformat()}."
            else:
                timing = "No occurrence date was supplied."
                warnings.append("The development has no occurrence date.")
            now = datetime.now(UTC)
            packet_data = dict(
                packet_id=new_id("PKT"), path="pending", development_ids=[development.development_id],
                briefing_item_ids=[item.item_id for item in briefing_items],
                potential_impact={"required": "high", "this_week": "medium", "monitor": "low"}[connection.attention_state],
                review_priority={"required": "today", "this_week": "this_week", "monitor": "monitor"}[connection.attention_state],
                attention_state=connection.attention_state, what_happened=development.summary or development.title,
                legal_status=development.legal_status, why_surfaced=connection.reason,
                affected_products=self._ids(records, "product"), affected_policies=self._ids(records, "policy"),
                affected_matters=sorted({*self._ids(records, "matter"), *linked_matter_ids}),
                affected_decisions=sorted({*self._ids(records, "decision"), *linked_decision_ids}),
                affected_mitigations=self._ids(records, "mitigation"), prior_decision_basis=basis,
                existing_mitigations=existing,
                possible_tension=" ".join(connection.evidence) or "Review the development against the linked internal records.",
                timing=timing, effective_dates=dates, sources=sources, warnings=[str(item) for item in warnings if item],
                status="monitoring" if connection.attention_state == "monitor" else "open", created_at=now, updated_at=now,
            )
            # The coordinator added this additive field after the awareness
            # models were frozen. Retaining the guard keeps this service usable
            # with an older model during an incremental checkout update.
            if "affected_assumption_ids" in ReviewPacket.model_fields:
                packet_data["affected_assumption_ids"] = sorted({
                    assumption_id for link in assumption_links for assumption_id in link.get("assumption_ids", [])
                })
            if assumption_links:
                packet_data["possible_tension"] = (
                    f"{packet_data['possible_tension']} Affected assumption IDs: "
                    f"{', '.join(packet_data.get('affected_assumption_ids', []))}."
                ).strip()
            packet = ReviewPacket(**packet_data)
            packets.append(self.store.put_review_packet(packet))
        return packets

    def _find_record(self, record_id: str):
        for path in self.vault.iter_files("", {".md"}):
            relative = self.vault.relative(path)
            if not (relative.startswith("00_System/") or relative.startswith("02_Company_Knowledge/") or relative.startswith("03_Matters/")):
                continue
            try:
                doc = self.vault.read_markdown(relative)
            except (OSError, ValueError):
                continue
            data = doc["metadata"]
            candidates = {relative, str(data.get("matter_id", "")), str(data.get("decision_id", "")), str(data.get("mitigation_id", "")), str(data.get("product_id", "")), str(data.get("policy_id", ""))}
            if record_id not in candidates:
                continue
            if "/decisions/" in relative:
                kind = "decision"
            elif "/mitigations/" in relative:
                kind = "mitigation"
            elif relative.startswith("03_Matters/"):
                kind = "matter"
            elif "product" in relative.casefold():
                kind = "product"
            else:
                kind = "policy"
            return kind, record_id, data
        return None

    def _briefing_items(self, development_id: str):
        from app.models.awareness import BriefingQuery
        return [item for item in self.store.list_items(BriefingQuery(limit=100)).items if item.development_id == development_id]

    def _assumption_links(self, watch_ids: list[str]) -> list[dict[str, object]]:
        links: list[dict[str, object]] = []
        for watch_id in watch_ids:
            try:
                links.extend(self.watches.workspace_assumption_links(watch_id))
            except (KeyError, OSError, ValueError):
                continue
        return links

    def _source_roles(self, briefing_items) -> tuple[dict[str, str], list[str]]:
        roles: dict[str, str] = {}
        warnings: list[str] = []
        rank = {"primary": 0, "secondary": 1, "discovery_only": 2, "excluded": 3}
        for item in briefing_items:
            try:
                watch = self.watches.get(item.watch_id)
            except (KeyError, OSError, ValueError) as exc:
                warnings.append(f"Watch source roles unavailable for {item.watch_id}: {exc}")
                continue
            for source in watch.sources:
                url = str(source.canonical_url)
                current = roles.get(url)
                if current is None or rank[source.role] < rank[current]:
                    roles[url] = source.role
        return roles, warnings

    @staticmethod
    def _ids(records, kind: str) -> list[str]:
        return [rid for record_kind, rid, _ in records if record_kind == kind]

    @staticmethod
    def _ordered_sources(sources: list[SourceReference], source_roles: dict[str, str]) -> list[SourceReference]:
        unique: dict[str, SourceReference] = {}
        for source in sources:
            unique.setdefault(str(source.canonical_url), source)
        def rank(source: SourceReference):
            role_rank = {"primary": 0, "secondary": 1, "discovery_only": 2, "excluded": 4}.get(
                source_roles.get(str(source.canonical_url), ""), 3
            )
            official = any(token in str(source.canonical_url).casefold() or token in source.publisher.casefold() for token in (".gov", "court", "legislature", "regulator"))
            return (role_rank, not official, source.support_state not in {"verified", "retrieved"}, source.title.casefold())
        return sorted(unique.values(), key=rank)
