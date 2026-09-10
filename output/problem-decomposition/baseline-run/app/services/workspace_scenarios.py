"""Matter-local saved hypotheticals.

Scenarios are historical overlays.  They never become canonical facts unless an
explicit caller selects individual proposed changes for adoption.
"""
from __future__ import annotations

import re
from typing import Any, Iterable

from app.models.workspace import Scenario, ScenarioAnalyzeCommand, ScenarioFactChange, ScenarioOutcome
from app.services.dossier import serialized
from app.services.matter_records import MatterRecordService
from app.services.matters import MatterService
from app.services.vault import VaultService
from app.services.workspace import WorkspaceConflict, WorkspaceService, digest
from app.utils.ids import new_id
from app.utils.time import iso_now


class WorkspaceScenarioService:
    def __init__(self, vault: VaultService, matters: MatterService,
                 workspace: WorkspaceService | None = None,
                 records: MatterRecordService | None = None):
        self.vault, self.matters = vault, matters
        self.records = records or MatterRecordService(vault, matters)
        self.workspace = workspace or WorkspaceService(vault, matters, records=self.records)

    def _path(self, matter_id: str, scenario_id: str) -> str:
        if not re.fullmatch(r"[A-Za-z0-9_-]+", scenario_id):
            raise ValueError("Invalid scenario ID.")
        base = self.matters.matter_path(matter_id)
        path = f"{base}/scenarios/{scenario_id}.md"
        self.vault.resolve(path).relative_to(self.vault.resolve(base))
        return path

    def _revision(self, content: str, metadata: dict[str, Any]) -> str:
        stable = {key: value for key, value in metadata.items()
                  if key not in {"revision", "updated_at", "analysis_operations"}}
        if isinstance(stable.get("scenario"), dict):
            stable["scenario"] = {key: value for key, value in stable["scenario"].items()
                                  if key not in {"analysis_state", "analysis_run_id", "failure_detail"}}
        return digest({"content": content, "metadata": stable})

    def _document(self, matter_id: str, scenario_id: str) -> dict[str, Any]:
        path = self._path(matter_id, scenario_id)
        if not self.vault.exists(path):
            raise KeyError("Scenario not found in this matter.")
        document = self.vault.read_markdown(path)
        if document["metadata"].get("matter_id") != matter_id:
            raise ValueError("Scenario belongs to another matter.")
        return document

    def _project(self, matter_id: str, document: dict[str, Any]) -> dict[str, Any]:
        metadata = document["metadata"]
        raw = metadata.get("scenario") if isinstance(metadata.get("scenario"), dict) else metadata
        data = dict(raw)
        data.update({"matter_id": matter_id, "analysis": document["content"].strip() or str(data.get("analysis") or "")})
        data.setdefault("scenario_id", str(metadata.get("scenario_id") or ""))
        data.setdefault("title", "Saved scenario")
        data.setdefault("baseline_revisions", {})
        data.setdefault("created_at", metadata.get("created_at") or iso_now())
        data["revision"] = self._revision(document["content"], metadata)
        scenario = Scenario.model_validate(data).model_dump()
        scenario["stale"] = self._stale(matter_id, scenario["baseline_revisions"])
        return scenario

    def _stale(self, matter_id: str, baseline: dict[str, str]) -> dict[str, Any]:
        current = self.workspace.source_revisions(matter_id)
        changed = {
            key: {"before": value, "after": current.get(key)}
            for key, value in baseline.items() if current.get(key) != value
        }
        return {"is_stale": bool(changed), "changed_revisions": changed}

    def _check_expected_facts(self, matter_id: str, current: dict[str, str], expected: dict[str, str]) -> None:
        facts_path = self.records._path(matter_id)
        if expected.get(facts_path) != current.get(facts_path):
            raise WorkspaceConflict("Matter facts changed. Refresh before correcting facts.", current.get(facts_path, ""))
        for key, value in expected.items():
            if current.get(key) != value:
                raise WorkspaceConflict("Matter sources changed. Refresh before correcting facts.", current.get(key, ""))

    def get(self, matter_id: str, scenario_id: str) -> dict[str, Any]:
        return self._project(matter_id, self._document(matter_id, scenario_id))

    def list(self, matter_id: str, *, issue_id: str | None = None) -> list[dict[str, Any]]:
        base = f"{self.matters.matter_path(matter_id)}/scenarios"
        root = self.vault.resolve(base)
        result: list[dict[str, Any]] = []
        for path in self.vault.iter_files(base, {".md"}):
            try:
                if path.parent != root:
                    continue
                document = self.vault.read_markdown(self.vault.relative(path))
                if document["metadata"].get("record_type") != "scenario" or document["metadata"].get("matter_id") != matter_id:
                    continue
                item = self._project(matter_id, document)
            except (KeyError, ValueError, TypeError):
                continue
            if issue_id is None or issue_id in item["issue_ids"]:
                result.append(item)
        return sorted(result, key=lambda item: (item.get("created_at") or "", item["scenario_id"]), reverse=True)

    @serialized
    def save(self, matter_id: str, scenario: Scenario | dict[str, Any], *,
             expected_revision: str | None = None, source_action_key: str | None = None) -> dict[str, Any]:
        supplied = scenario.model_dump() if isinstance(scenario, Scenario) else dict(scenario)
        for derived in ("stale", "historical_analysis_path", "not_current", "conflict"):
            supplied.pop(derived, None)
        scenario_id = str(supplied.get("scenario_id") or (
            f"SCN-{digest(matter_id + ':' + source_action_key)[:24]}" if source_action_key else new_id("SCN")
        ))
        path = self._path(matter_id, scenario_id)
        if supplied.get("matter_id") not in {None, "", matter_id}:
            raise ValueError("Scenario belongs to another matter.")
        current = self.vault.read_markdown(path) if self.vault.exists(path) else None
        if current and current["metadata"].get("matter_id") != matter_id:
            raise ValueError("Scenario belongs to another matter.")
        current_revision = self._revision(current["content"], current["metadata"]) if current else ""
        payload = {key: value for key, value in supplied.items() if key not in {"revision", "created_at"}}
        fingerprint = digest(payload)
        if current and source_action_key:
            prior = current["metadata"].get("source_action") or {}
            if prior.get("key") == source_action_key:
                if prior.get("fingerprint") != fingerprint:
                    raise WorkspaceConflict("This action key was already used for a different scenario.", current_revision, code="action_key_conflict")
                return self._project(matter_id, current)
        if current and expected_revision is None:
            raise ValueError("An existing scenario needs its current revision.")
        if expected_revision is not None and expected_revision != current_revision:
            raise WorkspaceConflict("This scenario changed. Refresh before saving.", current_revision)
        baseline = supplied.get("baseline_revisions") or self.workspace.source_revisions(matter_id)
        changes = [ScenarioFactChange.model_validate(item).model_dump() for item in supplied.get("proposed_fact_changes", [])]
        issue_ids = [str(item) for item in supplied.get("issue_ids", [])]
        known_issues = {item["issue_id"] for item in self.workspace.issues(matter_id)}
        if any(item not in known_issues for item in issue_ids):
            raise ValueError("Scenario issue not found in this matter.")
        content = str(supplied.get("analysis") or "").strip()
        created_at = (current["metadata"].get("created_at") if current else None) or supplied.get("created_at") or iso_now()
        known_fields = {
            "scenario_id", "matter_id", "title", "baseline_revisions", "issue_ids",
            "proposed_fact_changes", "unresolved_conditions", "analysis", "source_links",
            "created_at", "adopted_fact_ids", "related_analysis", "revision",
        }
        extras = {key: value for key, value in supplied.items() if key not in known_fields}
        data = Scenario(
            scenario_id=scenario_id, matter_id=matter_id, title=str(supplied.get("title") or "Saved scenario").strip(),
            baseline_revisions={str(k): str(v) for k, v in dict(baseline).items()}, issue_ids=issue_ids,
            proposed_fact_changes=changes, unresolved_conditions=[str(item) for item in supplied.get("unresolved_conditions", [])],
            analysis=content, source_links=[str(item) for item in supplied.get("source_links", [])],
            created_at=created_at, adopted_fact_ids=list((current or {"metadata": {}})["metadata"].get("adopted_fact_ids", supplied.get("adopted_fact_ids", []))),
            related_analysis=list((current or {"metadata": {}})["metadata"].get("related_analysis", supplied.get("related_analysis", []))),
            **extras,
        ).model_dump()
        metadata = dict(current["metadata"]) if current else {}
        metadata.update({"matter_id": matter_id, "record_type": "scenario", "scenario_id": scenario_id,
                         "created_at": created_at, "updated_at": iso_now(), "scenario": data,
                         "adopted_fact_ids": data["adopted_fact_ids"], "related_analysis": data["related_analysis"]})
        if source_action_key:
            metadata["source_action"] = {"key": source_action_key, "fingerprint": fingerprint}
        metadata["revision"] = self._revision(content, metadata)
        self.vault.write_markdown(path, content or "# Saved scenario\n", metadata)
        return self.get(matter_id, scenario_id)

    def readonly_overlay(self, matter_id: str, scenario_id: str) -> dict[str, Any]:
        scenario = self.get(matter_id, scenario_id)
        record = self.records.get(matter_id)
        return {"scenario": scenario, "canonical_facts": [fact for fact in record["facts"] if fact.get("status") == "active" and not fact.get("withdrawn_at")],
                "proposed_fact_changes": scenario["proposed_fact_changes"], "actual_matter_unchanged": True}

    @serialized
    def begin_analysis(self, matter_id: str, scenario_id: str,
                       command: ScenarioAnalyzeCommand | dict[str, Any]) -> dict[str, Any]:
        data = ScenarioAnalyzeCommand.model_validate(command).model_dump()
        document = self._document(matter_id, scenario_id)
        scenario = self._project(matter_id, document)
        operations = list(document["metadata"].get("analysis_operations", []))
        fingerprint = digest({"scenario_id": scenario_id, "instruction": data["instruction"].strip(),
                              "expected_scenario_revision": data["expected_scenario_revision"],
                              "baseline_revisions": data["baseline_revisions"]})
        prior = next((item for item in operations if item.get("source_action_key") == data["source_action_key"]), None)
        if prior:
            if prior.get("fingerprint") != fingerprint:
                raise WorkspaceConflict("This action key was already used for different scenario analysis.", scenario["revision"], code="action_key_conflict")
            return {"scenario": scenario, "instruction": prior["instruction"], "retry": True,
                    "run_id": prior.get("run_id")}
        if data["expected_scenario_revision"] != scenario["revision"]:
            raise WorkspaceConflict("This scenario changed. Refresh before analysis.", scenario["revision"])
        if not data["baseline_revisions"]:
            raise ValueError("Scenario analysis needs its frozen baseline revisions.")
        scenario.update(analysis_state="queued", analysis_source_action_key=data["source_action_key"],
                        analysis_baseline_revisions=dict(data["baseline_revisions"]), failure_detail=None)
        metadata = document["metadata"]
        metadata["scenario"] = {key: value for key, value in scenario.items() if key not in {"revision", "stale"}}
        metadata["analysis_operations"] = [*operations, {
            "source_action_key": data["source_action_key"], "fingerprint": fingerprint,
            "instruction": data["instruction"].strip(), "scenario_revision": data["expected_scenario_revision"],
            "analysis_baseline_revisions": dict(data["baseline_revisions"]), "state": "queued",
            "created_at": iso_now(),
        }]
        metadata["updated_at"] = iso_now()
        self.vault.write_markdown(document["path"], document["content"], metadata)
        return {"scenario": self.get(matter_id, scenario_id), "instruction": data["instruction"].strip(),
                "retry": False, "run_id": None}

    @serialized
    def bind_analysis_run(self, matter_id: str, scenario_id: str, *, source_action_key: str,
                          run_id: str) -> dict[str, Any]:
        document = self._document(matter_id, scenario_id)
        operations = list(document["metadata"].get("analysis_operations", []))
        operation = next((item for item in operations if item.get("source_action_key") == source_action_key), None)
        if operation is None:
            raise ValueError("Scenario analysis action not found.")
        if operation.get("run_id") not in {None, run_id}:
            raise WorkspaceConflict("This scenario analysis already has a different run.", self._project(matter_id, document)["revision"], code="action_key_conflict")
        operation["run_id"] = run_id
        if operation.get("state") == "queued":
            operation["state"] = "running"
        scenario = document["metadata"].setdefault("scenario", {})
        if scenario.get("analysis_source_action_key") == source_action_key and scenario.get("analysis_state") in {"queued", "running"}:
            scenario["analysis_run_id"], scenario["analysis_state"] = run_id, "running"
        document["metadata"]["updated_at"] = iso_now()
        self.vault.write_markdown(document["path"], document["content"], document["metadata"])
        return self.get(matter_id, scenario_id)

    @serialized
    def fail_analysis(self, matter_id: str, scenario_id: str, *, source_action_key: str,
                      failure_detail: str, run_id: str | None = None) -> dict[str, Any]:
        """Record a failed run without removing its instruction or prior result."""
        document = self._document(matter_id, scenario_id)
        operations = list(document["metadata"].get("analysis_operations", []))
        operation = next((item for item in operations if item.get("source_action_key") == source_action_key), None)
        if operation is None:
            raise ValueError("Scenario analysis action not found.")
        if run_id and operation.get("run_id") not in {None, run_id}:
            raise WorkspaceConflict("This failure belongs to a different scenario run.", self._project(matter_id, document)["revision"], code="action_key_conflict")
        operation["state"] = "failed"
        operation["failure_detail"] = failure_detail
        if run_id:
            operation["run_id"] = run_id
        scenario = document["metadata"].setdefault("scenario", {})
        if scenario.get("analysis_source_action_key") == source_action_key and scenario.get("analysis_state") != "completed":
            scenario["analysis_state"] = "failed"
            scenario["failure_detail"] = failure_detail
            if run_id:
                scenario["analysis_run_id"] = run_id
        document["metadata"]["updated_at"] = iso_now()
        self.vault.write_markdown(document["path"], document["content"], document["metadata"])
        return self.get(matter_id, scenario_id)

    def find_relevant(self, matter_id: str, actual_fact: str, *, limit: int = 5) -> list[dict[str, Any]]:
        terms = {term for term in re.findall(r"[a-z0-9]{3,}", actual_fact.casefold())}
        matches: list[dict[str, Any]] = []
        for scenario in self.list(matter_id):
            changes = scenario["proposed_fact_changes"]
            text = " ".join(change["text"] for change in changes).casefold()
            matched = sorted(term for term in terms if term in text)
            if not matched:
                continue
            matches.append({"scenario": scenario, "match": matched, "differences": [change["text"] for change in changes if actual_fact.casefold() not in change["text"].casefold()],
                            "stale_sources": scenario["stale"], "historical_analysis_only": True})
        return sorted(matches, key=lambda item: (-len(item["match"]), item["scenario"]["scenario_id"]))[:limit]

    @serialized
    def adopt_fact_changes(self, matter_id: str, scenario_id: str, change_ids: Iterable[str], *,
                           expected_revisions: dict[str, str], source_action_key: str,
                           trusted_user_action: bool, source_message_id: str | None = None,
                           related_analysis: Iterable[str] = ()) -> dict[str, Any]:
        if not trusted_user_action:
            raise ValueError("A current lawyer instruction is required to adopt scenario facts.")
        scenario_doc = self._document(matter_id, scenario_id)
        scenario = self._project(matter_id, scenario_doc)
        chosen = [change for change in scenario["proposed_fact_changes"] if change["change_id"] in set(change_ids)]
        if not chosen:
            raise ValueError("Choose at least one scenario fact change.")
        if len({change["change_id"] for change in chosen}) != len(set(change_ids)):
            raise ValueError("Scenario fact change not found.")
        payload = {"scenario_id": scenario_id, "change_ids": sorted(change["change_id"] for change in chosen), "expected_revisions": expected_revisions,
                   "source_message_id": source_message_id, "related_analysis": list(related_analysis)}
        fingerprint = digest(payload)
        receipts = scenario_doc["metadata"].get("adoption_receipts", [])
        prior = next((item for item in receipts if item.get("source_action_key") == source_action_key), None)
        if prior:
            if prior.get("fingerprint") != fingerprint:
                raise WorkspaceConflict("This action key was already used for a different correction.", scenario["revision"], code="action_key_conflict")
            return prior["result"]
        action_key = f"scenario:{scenario_id}:{source_action_key}:adopt"
        desired = [{"text": change["text"], "supersedes": change.get("fact_id"), "source_ids": [source_message_id] if source_message_id else []} for change in chosen]
        record = self.records.get(matter_id)
        existing = next((item for item in record["actions"] if item.get("source_action_key") == action_key), None)
        if existing:
            created = [fact for fact in record["facts"] if fact.get("fact_id") in existing.get("created", {}).get("facts", [])]
            if existing.get("scenario_adoption") != fingerprint or [(item.get("text"), item.get("supersedes"), item.get("source_ids")) for item in created] != [(item["text"], item.get("supersedes"), item["source_ids"]) for item in desired]:
                raise WorkspaceConflict("This action key was already used for a different correction.", scenario["revision"], code="action_key_conflict")
            action = existing
        else:
            self._check_expected_facts(matter_id, self.workspace.source_revisions(matter_id), expected_revisions)
            action = self.records.apply_update(matter_id, facts=desired, summary="Adopted selected saved-scenario facts", actor="user", source_action_key=action_key,
                                               action_metadata={"scenario_adoption": fingerprint})
        adopted = list(dict.fromkeys([*scenario["adopted_fact_ids"], *action["created"]["facts"]]))
        links = list(dict.fromkeys([*scenario["related_analysis"], *[str(item) for item in related_analysis]]))
        metadata = scenario_doc["metadata"]
        metadata["adopted_fact_ids"], metadata["related_analysis"] = adopted, links
        scenario_metadata = metadata.setdefault("scenario", scenario)
        scenario_metadata["adopted_fact_ids"], scenario_metadata["related_analysis"] = adopted, links
        result = {"state": "applied", "scenario_id": scenario_id, "adopted_fact_ids": action["created"]["facts"],
                  "affected_analysis": links, "update_offer_required": bool(links), "scenario_remains_historical": True}
        metadata["adoption_receipts"] = [*receipts, {"source_action_key": source_action_key, "fingerprint": fingerprint, "result": result}]
        metadata["updated_at"] = iso_now()
        self.vault.write_markdown(scenario_doc["path"], scenario_doc["content"], metadata)
        return result

    @serialized
    def persist_analysis(self, matter_id: str, scenario_id: str, analysis: str, *, expected_revision: str,
                         source_action_key: str | None = None, run_id: str | None = None,
                         analysis_baseline_revisions: dict[str, str] | None = None,
                         affected_issue_ids: Iterable[str] | None = None,
                         affected_branch_ids: Iterable[str] | None = None,
                         claim_ids: Iterable[str] | None = None,
                         proposed_outcomes: Iterable[dict[str, Any]] | None = None,
                         unresolved_conditions: Iterable[str] | None = None,
                         source_links: Iterable[str] | None = None) -> dict[str, Any]:
        """Persist useful scenario prose plus any valid explicit branch structure."""
        scenario = self.get(matter_id, scenario_id)
        affected_issues = list(dict.fromkeys(str(item) for item in (
            affected_issue_ids if affected_issue_ids is not None else scenario.get("affected_issue_ids", []))))
        known_issues = {item["issue_id"] for item in self.workspace.issues(matter_id)}
        if any(item not in known_issues for item in affected_issues):
            raise ValueError("Scenario analysis issue not found in this matter.")
        outcomes = [ScenarioOutcome.model_validate(item).model_dump() for item in (
            proposed_outcomes if proposed_outcomes is not None else scenario.get("proposed_outcomes", []))]
        known_work_ids = set()
        for path in self.vault.iter_files(f"{self.matters.matter_path(matter_id)}/work-items", {".md"}):
            metadata = self.vault.read_markdown(self.vault.relative(path))["metadata"]
            if metadata.get("matter_id") == matter_id and metadata.get("work_item_id"):
                known_work_ids.add(str(metadata["work_item_id"]))
        if any(issue_id not in known_issues for outcome in outcomes for issue_id in outcome["issue_ids"]):
            raise ValueError("Scenario outcome issue not found in this matter.")
        if any(work_id not in known_work_ids for outcome in outcomes for work_id in outcome["work_item_ids"]):
            raise ValueError("Scenario outcome work item not found in this matter.")
        result_fields = {
            "analysis": analysis, "analysis_state": "completed", "analysis_run_id": run_id,
            "analysis_baseline_revisions": dict(analysis_baseline_revisions or scenario.get("analysis_baseline_revisions") or scenario.get("baseline_revisions") or {}),
            "affected_issue_ids": affected_issues,
            "affected_branch_ids": list(dict.fromkeys(str(item) for item in (
                affected_branch_ids if affected_branch_ids is not None else scenario.get("affected_branch_ids", [])))),
            "claim_ids": list(dict.fromkeys(str(item) for item in (
                claim_ids if claim_ids is not None else scenario.get("claim_ids", [])))),
            "proposed_outcomes": outcomes,
            "unresolved_conditions": list(dict.fromkeys(str(item) for item in (
                unresolved_conditions if unresolved_conditions is not None else scenario.get("unresolved_conditions", [])))),
            "source_links": list(dict.fromkeys(str(item) for item in (
                source_links if source_links is not None else scenario.get("source_links", [])))),
            "failure_detail": None,
        }
        persist_payload = {"scenario_id": scenario_id, "expected_revision": expected_revision,
                           "source_action_key": source_action_key, **result_fields}
        persist_fingerprint = digest(persist_payload)
        document = self._document(matter_id, scenario_id)
        operation = next((item for item in document["metadata"].get("analysis_operations", [])
                          if item.get("source_action_key") == source_action_key), None) if source_action_key else None
        if operation and operation.get("persist_fingerprint"):
            if operation["persist_fingerprint"] != persist_fingerprint:
                raise WorkspaceConflict("This action key was already used for different scenario analysis.", scenario["revision"], code="action_key_conflict")
            historical_path = operation.get("historical_analysis_path")
            return {**scenario, **({"historical_analysis_path": historical_path, "not_current": True}
                                   if historical_path else {})}
        try:
            saved = self.save(matter_id, {**scenario, **result_fields}, expected_revision=expected_revision,
                              source_action_key=source_action_key)
            if operation:
                fresh = self._document(matter_id, scenario_id)
                current_operation = next(item for item in fresh["metadata"].get("analysis_operations", [])
                                         if item.get("source_action_key") == source_action_key)
                current_operation.update(state="completed", run_id=run_id or current_operation.get("run_id"),
                                         persist_fingerprint=persist_fingerprint)
                self.vault.write_markdown(fresh["path"], fresh["content"], fresh["metadata"])
                saved = self.get(matter_id, scenario_id)
            return saved
        except WorkspaceConflict as exc:
            if exc.detail.get("code") == "action_key_conflict":
                raise
            # A late readonly run is still useful evidence.  Preserve it next
            # to its frozen scenario rather than replacing newer lawyer work.
            fingerprint = persist_fingerprint
            identity = source_action_key or fingerprint
            path = f"{self.matters.matter_path(matter_id)}/scenarios/revisions/{scenario_id}-{digest(identity)[:20]}.md"
            if self.vault.exists(path):
                prior = self.vault.read_markdown(path)
                if prior["metadata"].get("persist_analysis_fingerprint") != fingerprint:
                    raise WorkspaceConflict("This action key was already used for different scenario analysis.", expected_revision, code="action_key_conflict")
            else:
                self.vault.write_markdown(path, analysis, {"matter_id": matter_id, "record_type": "scenario_analysis_revision",
                                          "scenario_id": scenario_id, "frozen_scenario_revision": expected_revision,
                                          "analysis_result": result_fields,
                                          "source_action_key": source_action_key, "persist_analysis_fingerprint": fingerprint,
                                          "immutable": True, "stale": True, "created_at": iso_now()})
            if operation:
                fresh = self._document(matter_id, scenario_id)
                current_operation = next(item for item in fresh["metadata"].get("analysis_operations", [])
                                         if item.get("source_action_key") == source_action_key)
                current_operation.update(state="completed", run_id=run_id or current_operation.get("run_id"),
                                         persist_fingerprint=persist_fingerprint, historical_analysis_path=path)
                self.vault.write_markdown(fresh["path"], fresh["content"], fresh["metadata"])
            return {**scenario, "historical_analysis_path": path, "not_current": True,
                    "conflict": exc.detail}

    @serialized
    def correct_fact(self, matter_id: str, *, fact_id: str | None, replacement: str,
                     expected_revisions: dict[str, str], source_action_key: str,
                     trusted_user_action: bool, source_message_id: str | None = None,
                     affected_analysis: Iterable[str] = ()) -> dict[str, Any]:
        """Apply one actual correction; it does not alter scenarios or drafts."""
        if not trusted_user_action:
            raise ValueError("A current lawyer instruction is required to correct a fact.")
        current = self.workspace.source_revisions(matter_id)
        text = replacement.strip()
        if not text:
            raise ValueError("A correction needs replacement text.")
        record = self.records.get(matter_id)
        if fact_id and not any(item.get("fact_id") == fact_id for item in record["facts"]):
            raise ValueError("Fact not found in this matter.")
        key = f"workspace:{source_action_key}:fact-correction"
        existing = next((item for item in record["actions"] if item.get("source_action_key") == key), None)
        desired = (text, fact_id)
        if existing:
            created = [item for item in record["facts"] if item.get("fact_id") in existing.get("created", {}).get("facts", [])]
            fingerprint = digest({"fact_id": fact_id, "replacement": text, "source_message_id": source_message_id,
                                  "affected_analysis": list(affected_analysis), "expected_revisions": expected_revisions})
            if existing.get("fact_correction") != fingerprint or [(item.get("text"), item.get("supersedes")) for item in created] != [desired]:
                raise WorkspaceConflict("This action key was already used for a different correction.", current.get("facts.md", ""), code="action_key_conflict")
            action = existing
        else:
            fingerprint = digest({"fact_id": fact_id, "replacement": text, "source_message_id": source_message_id,
                                  "affected_analysis": list(affected_analysis), "expected_revisions": expected_revisions})
            self._check_expected_facts(matter_id, current, expected_revisions)
            action = self.records.apply_update(
                matter_id, facts=[{"text": text, "supersedes": fact_id,
                                   "source_ids": [source_message_id] if source_message_id else []}],
                summary="Corrected a reported matter fact", actor="user", source_action_key=key,
                action_metadata={"fact_correction": fingerprint},
            )
        links = list(dict.fromkeys(str(item) for item in affected_analysis))
        return {"state": "applied", "fact_ids": action["created"]["facts"], "affected_analysis": links,
                "update_offer_required": bool(links), "draft_unchanged": True}
