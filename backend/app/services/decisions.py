from __future__ import annotations

import fcntl
import hashlib
from contextlib import contextmanager
from datetime import timedelta
from pathlib import Path
from typing import Any

from app.models.api import DecisionCreate
from app.services.dossier import serialized
from app.services.index import IndexService
from app.services.issue_analysis import IssueAnalysisService
from app.services.matters import MatterService
from app.services.vault import VaultService
from app.services.workspace import WorkspaceConflict, digest
from app.utils.ids import new_id
from app.utils.time import iso_now, parse_iso, utc_now


class DecisionService:
    def __init__(
        self,
        vault: VaultService,
        index: IndexService,
        matters: MatterService,
        review_age_days: int = 180,
    ):
        self.vault = vault
        self.index = index
        self.matters = matters
        self.review_age_days = review_age_days
        self.issue_analysis = IssueAnalysisService(vault, matters)

    def list(self, status: str | None = None) -> list[dict[str, Any]]:
        return [self._with_links(item) for item in self.index.list_decisions(status)]

    def get(self, decision_id: str) -> dict[str, Any]:
        decision = next(
            (item for item in self.index.list_decisions() if item["decision_id"] == decision_id),
            None,
        )
        if decision is None:
            raise KeyError(f"Decision not found: {decision_id}")
        return self._with_links(decision)

    @serialized
    def record(
        self,
        request: DecisionCreate,
        *,
        revises_decision_id: str | None = None,
        mitigation_ids: list[str] | None = None,
        review_packet_ids: list[str] | None = None,
    ) -> dict[str, Any]:
        base = self.matters.matter_path(request.matter_id)
        with self._record_lock():
            if request.source_action_key:
                existing = self._find_by_source_action_key(base, request.source_action_key)
                if existing is not None:
                    prior_fingerprint = existing["metadata"].get("request_fingerprint")
                    if prior_fingerprint:
                        canonical_replay_basis = self._replay_map_basis(request, existing["metadata"])
                        replay_fingerprint = self._request_fingerprint(
                            request, canonical_replay_basis, revises_decision_id,
                            mitigation_ids or [], review_packet_ids or [],
                        )
                        if prior_fingerprint != replay_fingerprint:
                            self._action_key_conflict(existing["metadata"])
                    return self._finish_record(existing["path"], existing["metadata"])
            canonical_basis = self._canonical_map_basis(request)
            fingerprint = self._request_fingerprint(
                request, canonical_basis, revises_decision_id,
                mitigation_ids or [], review_packet_ids or [],
            )
            self._validate_current_map_basis(request, canonical_basis)
            self._validate_recommendation_version(base, request.recommendation_version_id)
            if revises_decision_id:
                prior = self.get(revises_decision_id)
                if prior["matter_id"] != request.matter_id:
                    raise ValueError("A decision revision must stay in the original matter.")
            decision_id = self._decision_id(request.matter_id, request.source_action_key)
            now = iso_now()
            path = f"{base}/decisions/{decision_id}.md"
            metadata = {
                "decision_id": decision_id,
                "matter_id": request.matter_id,
                "title": request.title,
                "decision_type": request.decision_type,
                "chosen_path": request.chosen_path,
                "rationale": request.rationale,
                "decision_maker": request.decision_maker,
                "conditions": request.conditions,
                "not_decided": request.not_decided,
                "linked_paths": request.linked_paths,
                "mitigation_ids": list(dict.fromkeys(mitigation_ids or [])),
                "review_packet_ids": list(dict.fromkeys(review_packet_ids or [])),
                "revises_decision_id": revises_decision_id,
                "decided_at": now,
                "next_review_at": request.next_review_at,
                "last_reviewed_at": now,
                "risk_level": request.risk_level,
                "review_status": "fresh",
                "staleness_reason": "",
                "privilege": request.privilege,
                "source_action_key": request.source_action_key,
                "recorded_event_id": f"EVT-{decision_id}",
                "recording_complete": False,
                "recommendation_disposition": request.recommendation_disposition,
                "recommendation_disposition_reason": request.recommendation_disposition_reason.strip(),
                "recommendation_version_id": request.recommendation_version_id,
                "map_basis": canonical_basis,
                "request_fingerprint": fingerprint,
            }
            conditions = "\n".join(f"- {item}" for item in request.conditions) or "- None recorded"
            not_decided = "\n".join(f"- {item}" for item in request.not_decided) or "- None recorded"
            self.vault.write_markdown(
                path,
                (
                    f"# {request.title}\n\n"
                    f"## Chosen path\n\n{request.chosen_path}\n\n"
                    f"## Rationale\n\n{request.rationale or 'No rationale recorded.'}\n\n"
                    f"## Recommendation disposition\n\n{request.recommendation_disposition.replace('_', ' ').title()}"
                    f"{f': {request.recommendation_disposition_reason.strip()}' if request.recommendation_disposition_reason.strip() else ''}\n\n"
                    f"## Conditions\n\n{conditions}\n\n"
                    f"## Not decided\n\n{not_decided}\n"
                ),
                metadata,
            )
            return self._finish_record(path, metadata)

    def _canonical_map_basis(self, request: DecisionCreate) -> dict[str, Any] | None:
        if request.map_basis is None:
            return None
        supplied = request.map_basis.model_dump(mode="json")
        analysis = self.issue_analysis.load(
            request.matter_id,
            supplied["analysis_path"],
            supplied["analysis_id"],
            supplied["analysis_revision"],
        )
        if analysis["issue_id"] != supplied["issue_id"]:
            raise ValueError("The selected analysis does not belong to this issue.")
        if analysis["output_revision"] != supplied["output_revision"]:
            raise ValueError("The selected analysis output revision does not match.")
        option = next((item for item in analysis["options"]
                       if item["option_id"] == supplied["selected_option_id"]), None)
        if option is None:
            raise ValueError("The selected option does not belong to this analysis.")
        computed_option_revision = digest({
            "analysis_revision": analysis["analysis_revision"],
            "option": {key: value for key, value in option.items() if key != "option_revision"},
        })
        if (option["option_revision"] != computed_option_revision
                or supplied["selected_option_revision"] != computed_option_revision):
            raise ValueError("The selected option revision does not match.")
        return {
            "issue_id": analysis["issue_id"],
            "analysis_id": analysis["analysis_id"],
            "analysis_revision": analysis["analysis_revision"],
            "analysis_path": analysis["source_path"],
            "output_revision": analysis["output_revision"],
            "selected_option_id": option["option_id"],
            "selected_option_revision": option["option_revision"],
            "use_historical_basis": bool(supplied.get("use_historical_basis")),
            "canonical_option": option,
            "input_basis": dict(analysis["input_basis"]),
        }

    def _replay_map_basis(
        self, request: DecisionCreate, metadata: dict[str, Any],
    ) -> dict[str, Any] | None:
        prior = metadata.get("map_basis")
        if request.map_basis is None and prior is None:
            return None
        if request.map_basis is None or not isinstance(prior, dict):
            self._action_key_conflict(metadata)
        supplied = request.map_basis.model_dump(mode="json")
        identity_fields = (
            "issue_id", "analysis_id", "analysis_revision", "analysis_path",
            "output_revision", "selected_option_id", "selected_option_revision",
        )
        if (any(supplied.get(key) != prior.get(key) for key in identity_fields)
                or bool(supplied.get("use_historical_basis")) != bool(prior.get("use_historical_basis"))):
            self._action_key_conflict(metadata)
        return dict(prior)

    @staticmethod
    def _action_key_conflict(metadata: dict[str, Any]) -> None:
        basis = metadata.get("map_basis") if isinstance(metadata.get("map_basis"), dict) else {}
        raise WorkspaceConflict(
            "This action key was already used for a different decision request.",
            str(basis.get("analysis_revision") or ""),
            code="action_key_conflict",
        )

    def _validate_current_map_basis(
        self, request: DecisionCreate, canonical_basis: dict[str, Any] | None,
    ) -> None:
        if canonical_basis is None or canonical_basis["use_historical_basis"]:
            return
        status = self.issue_analysis.resolve(request.matter_id, canonical_basis["issue_id"])
        current = status.get("analysis") if isinstance(status.get("analysis"), dict) else {}
        exact = (
            current.get("analysis_id") == canonical_basis["analysis_id"]
            and current.get("analysis_revision") == canonical_basis["analysis_revision"]
            and current.get("source_path") == canonical_basis["analysis_path"]
            and current.get("output_revision") == canonical_basis["output_revision"]
        )
        if not exact or status.get("state") in {"needs_review", "missing", "historical", "not_mapped"}:
            current_revision = str(current.get("analysis_revision")
                                   or (status.get("reference") or {}).get("analysis_revision") or "")
            raise WorkspaceConflict(
                "This analysis basis changed. Refresh it or explicitly use the historical basis.",
                current_revision,
                code="stale_analysis_basis",
            )

    @staticmethod
    def _request_fingerprint(
        request: DecisionCreate, canonical_basis: dict[str, Any] | None,
        revises_decision_id: str | None, mitigation_ids: list[str],
        review_packet_ids: list[str],
    ) -> str:
        submitted = request.model_dump(mode="json", exclude={"source_action_key", "map_basis"})
        submitted["recommendation_disposition_reason"] = request.recommendation_disposition_reason.strip()
        submitted.update({
            "map_basis": canonical_basis,
            "revises_decision_id": revises_decision_id,
            "mitigation_ids": list(dict.fromkeys(mitigation_ids)),
            "review_packet_ids": list(dict.fromkeys(review_packet_ids)),
        })
        return digest(submitted)

    def _validate_recommendation_version(
        self, matter_path: str, recommendation_version_id: str | None
    ) -> None:
        if recommendation_version_id is None:
            return
        path = f"{matter_path}/recommendations.md"
        if not self.vault.exists(path):
            raise ValueError("The referenced recommendation version does not belong to this matter.")
        metadata = self.vault.read_markdown(path)["metadata"]
        versions = metadata.get("recommendation_versions")
        known_ids = {
            str(item.get("version_id"))
            for item in versions if isinstance(item, dict) and item.get("version_id")
        } if isinstance(versions, list) else set()
        if recommendation_version_id not in known_ids:
            raise ValueError("The referenced recommendation version does not belong to this matter.")

    def _finish_record(self, path: str, metadata: dict[str, Any]) -> dict[str, Any]:
        decision_id = str(metadata["decision_id"])
        if not metadata.get("recording_complete"):
            self.matters.note_durable_decision_recorded(str(metadata["matter_id"]))
            self.matters.append_event(
                str(metadata["matter_id"]),
                "decision_recorded",
                {"title": metadata["title"], "decision_id": decision_id},
                event_id=str(metadata.get("recorded_event_id") or f"EVT-{decision_id}"),
                timestamp=str(metadata["decided_at"]),
                rebuild=False,
            )
            self.vault.update_markdown(path, metadata_updates={"recording_complete": True})
        self.index.rebuild()
        return self.get(decision_id)

    def _find_by_source_action_key(self, base: str, source_action_key: str) -> dict[str, Any] | None:
        directory = self.vault.resolve(f"{base}/decisions")
        for path in directory.glob("*.md") if directory.exists() else []:
            document = self.vault.read_markdown(self.vault.relative(path))
            if document["metadata"].get("source_action_key") == source_action_key:
                return document
        return None

    @staticmethod
    def _decision_id(matter_id: str, source_action_key: str | None) -> str:
        if source_action_key is None:
            return new_id("DEC")
        digest = hashlib.sha256(f"{matter_id}\0{source_action_key}".encode()).hexdigest()[:20]
        return f"DEC-{digest.upper()}"

    @contextmanager
    def _record_lock(self):
        lock_path = Path(f"{self.index.db_path}.decisions.lock")
        lock_path.parent.mkdir(parents=True, exist_ok=True)
        with lock_path.open("a+b") as lock_file:
            fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX)
            try:
                yield
            finally:
                fcntl.flock(lock_file.fileno(), fcntl.LOCK_UN)

    def revise(self, decision_id: str, request: DecisionCreate) -> dict[str, Any]:
        """Create a linked successor. The prior Markdown record is never changed."""
        return self.record(request, revises_decision_id=decision_id)

    def mark_reviewed(
        self,
        decision_id: str,
        packet_id: str,
        *,
        next_review_at: str | None = None,
        rebuild: bool = True,
    ) -> dict[str, Any]:
        decision = self.get(decision_id)
        packet_ids = list(decision.get("review_packet_ids") or [])
        if packet_id not in packet_ids:
            packet_ids.append(packet_id)
        updates: dict[str, Any] = {
            "last_reviewed_at": iso_now(),
            "review_status": "fresh",
            "staleness_reason": "",
            "review_packet_ids": packet_ids,
        }
        if next_review_at is not None:
            updates["next_review_at"] = next_review_at
        self.vault.update_markdown(decision["path"], metadata_updates=updates)
        if rebuild:
            self.index.rebuild()
        return self.get(decision_id)

    def link_mitigation(self, decision_id: str, mitigation_id: str) -> dict[str, Any]:
        decision = self.get(decision_id)
        mitigation_ids = list(decision.get("mitigation_ids") or [])
        if mitigation_id not in mitigation_ids:
            mitigation_ids.append(mitigation_id)
            self.vault.update_markdown(
                decision["path"], metadata_updates={"mitigation_ids": mitigation_ids}
            )
            self.index.rebuild()
        return self.get(decision_id)

    def _with_links(self, decision: dict[str, Any]) -> dict[str, Any]:
        metadata = self.vault.read_markdown(decision["path"])["metadata"]
        mitigation_ids = list(metadata.get("mitigation_ids") or [])
        matter_root = decision["path"].rsplit("/decisions/", 1)[0]
        for path in self.vault.iter_files(f"{matter_root}/mitigations", {".md"}):
            mitigation = self.vault.read_markdown(self.vault.relative(path))["metadata"]
            if decision["decision_id"] in (mitigation.get("decision_ids") or []):
                mitigation_id = str(mitigation.get("mitigation_id") or path.stem)
                if mitigation_id not in mitigation_ids:
                    mitigation_ids.append(mitigation_id)
        return {
            **decision,
            "conditions": list(metadata.get("conditions") or []),
            "not_decided": list(metadata.get("not_decided") or []),
            "mitigation_ids": mitigation_ids,
            "review_packet_ids": list(metadata.get("review_packet_ids") or []),
            "revises_decision_id": metadata.get("revises_decision_id"),
            "recommendation_disposition": metadata.get("recommendation_disposition", "not_applicable"),
            "recommendation_disposition_reason": metadata.get("recommendation_disposition_reason", ""),
            "recommendation_version_id": metadata.get("recommendation_version_id"),
            "map_basis": metadata.get("map_basis"),
            "request_fingerprint": metadata.get("request_fingerprint"),
        }

    def audit(self, *, persist: bool = True) -> dict[str, Any]:
        now = utc_now()
        reviewed = 0
        flagged = 0
        changes: list[dict[str, Any]] = []
        for decision in self.index.list_decisions():
            reviewed += 1
            status, reason = self._evaluate(decision, now)
            if status != "fresh":
                flagged += 1
            if persist:
                self.vault.update_markdown(
                    decision["path"],
                    metadata_updates={
                        "review_status": status,
                        "staleness_reason": reason,
                        "audited_at": iso_now(),
                    },
                )
            if status != decision.get("review_status") or reason != decision.get("staleness_reason"):
                changes.append(
                    {
                        "decision_id": decision["decision_id"],
                        "title": decision["title"],
                        "review_status": status,
                        "reason": reason,
                    }
                )
        if persist:
            self.index.rebuild()
        return {"reviewed": reviewed, "flagged": flagged, "changes": changes}

    def _evaluate(self, decision: dict[str, Any], now) -> tuple[str, str]:
        parsed_dates: dict[str, Any] = {}
        for field in ("next_review_at", "last_reviewed_at", "decided_at"):
            value = decision.get(field)
            if value is None or value == "":
                parsed_dates[field] = None
                continue
            if not isinstance(value, str):
                return "review_recommended", f"Invalid {field}; review is recommended."
            try:
                parsed_dates[field] = parse_iso(value)
            except ValueError:
                return "review_recommended", f"Invalid {field}; review is recommended."

        next_review = parsed_dates["next_review_at"]
        if next_review and next_review <= now:
            return "stale", f"Scheduled review date passed on {next_review.date().isoformat()}."

        anchor = parsed_dates["last_reviewed_at"] or parsed_dates["decided_at"]
        if anchor and now - anchor >= timedelta(days=self.review_age_days):
            return "review_recommended", f"Decision has not been reviewed in {self.review_age_days} days."

        import json

        try:
            linked_paths = json.loads(decision.get("linked_paths") or "[]")
        except json.JSONDecodeError:
            linked_paths = []
        if anchor:
            for linked_path in linked_paths:
                if not self.vault.exists(linked_path):
                    return "review_recommended", f"Linked source is missing: {linked_path}."
                modified = self.vault.resolve(linked_path).stat().st_mtime
                if modified > anchor.timestamp():
                    return "review_recommended", f"Linked source changed after the decision: {linked_path}."
        return "fresh", ""
