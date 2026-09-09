"""Derived matter-review, decision-map, and document projections.

Markdown records remain authoritative.  This service only writes an issue
disposition after a direct, revision-checked lawyer command.
"""
from __future__ import annotations

import hashlib
from datetime import date
from pathlib import PurePosixPath
from typing import Any
from yaml import YAMLError

from app.models.workspace import (
    DecisionMapEdge, DecisionMapNode, DecisionMapSnapshot, DocumentIdentity,
    DocumentReferenceTarget, IssueDispositionCommand, IssueDispositionRecord,
    IssueAnalysis, IssueDispositionResult, IssueReviewItem, ResolvedDocumentReference,
    WorkspaceClaim,
)
from app.services.dossier import serialized
from app.services.matter_records import MatterRecordService
from app.services.matters import MatterService
from app.services.vault import VaultService
from app.services.workspace import WorkspaceConflict, WorkspaceService, digest
from app.utils.time import iso_now


class WorkspaceReviewService:
    def __init__(self, vault: VaultService, matters: MatterService,
                 workspace: WorkspaceService | None = None,
                 records: MatterRecordService | None = None,
                 scenarios: Any | None = None):
        self.vault, self.matters = vault, matters
        self.records = records or MatterRecordService(vault, matters)
        self.workspace = workspace or WorkspaceService(vault, matters, records=self.records)
        self.scenarios = scenarios

    def _base(self, matter_id: str) -> str:
        return self.matters.matter_path(matter_id)

    def _records_in(self, matter_id: str, folder: str, id_key: str) -> list[dict[str, Any]]:
        base = self._base(matter_id)
        result = []
        for path in self.vault.iter_files(f"{base}/{folder}", {".md"}):
            document = self.vault.read_markdown(self.vault.relative(path))
            metadata = document["metadata"]
            if metadata.get("matter_id") != matter_id or not metadata.get(id_key):
                continue
            result.append({**metadata, "path": document["path"], "content": document["content"]})
        return result

    def work_items(self, matter_id: str) -> list[dict[str, Any]]:
        return self._records_in(matter_id, "work-items", "work_item_id")

    def decisions(self, matter_id: str) -> list[dict[str, Any]]:
        return self._records_in(matter_id, "decisions", "decision_id")

    @staticmethod
    def _actor(actor: Any) -> tuple[str, str]:
        data = actor.model_dump() if hasattr(actor, "model_dump") else dict(actor)
        return str(data.get("person_id") or data.get("actor_id") or ""), str(data.get("display_name") or data.get("actor_name") or "")

    @serialized
    def record_disposition(self, matter_id: str, issue_id: str,
                           command: IssueDispositionCommand | dict[str, Any], *, actor: Any) -> dict[str, Any]:
        data = IssueDispositionCommand.model_validate(command).model_dump()
        nodes = self.workspace.issues(matter_id)
        issue = next((item for item in nodes if item["issue_id"] == issue_id), None)
        if issue is None:
            raise KeyError("Issue not found in this matter.")
        actor_id, actor_name = self._actor(actor)
        if not actor_id or not actor_name:
            raise ValueError("A trusted local lawyer identity is required.")
        work_ids = {item["work_item_id"] for item in self.work_items(matter_id)}
        decision_ids = {item["decision_id"] for item in self.decisions(matter_id)}
        supplied_work = list(dict.fromkeys(data["linked_work_item_ids"]))
        supplied_decisions = list(dict.fromkeys(data["linked_decision_ids"]))
        if not data["reason"].strip():
            raise ValueError("A disposition reason is required.")
        if not set(supplied_work) <= work_ids or not set(supplied_decisions) <= decision_ids:
            raise ValueError("Disposition links must belong to this matter.")
        if data["disposition"] == "risk_accepted" and not supplied_decisions:
            raise ValueError("Risk acceptance needs a recorded decision from this matter.")
        fingerprint = digest({"issue_id": issue_id, "disposition": data["disposition"],
            "reason": data["reason"].strip(), "linked_work_item_ids": supplied_work,
            "linked_decision_ids": supplied_decisions})
        issues_doc = self.workspace._document(matter_id, "issues.md")
        operations = issues_doc["metadata"].get("disposition_operations", [])
        prior = next((item for item in operations if item.get("source_action_key") == data["source_action_key"]), None)
        prior_history = next((item for item in issue.get("disposition_history", [])
                              if item.get("source_action_key") == data["source_action_key"]), None)
        def ensure_event(entry: dict[str, Any]) -> str:
            return self.matters.append_event(matter_id, "issue_disposition_recorded", {
                "title": "Issue disposition recorded", "actor": entry["actor_name"],
                "issue_id": issue_id, "disposition_id": entry["disposition_id"],
                "disposition": entry["disposition"], "reason": entry["reason"],
            }, event_id=f"EVT-{entry['disposition_id']}", timestamp=entry["recorded_at"])
        if prior and prior_history:
            ensure_event(prior_history)
        if prior_history and prior is None:
            if prior_history.get("request_fingerprint") != fingerprint:
                raise WorkspaceConflict("This action key was used for a different disposition.", self.workspace.issues_revision(matter_id), code="action_key_conflict")
            current_revision = self.workspace.issues_revision(matter_id)
            event_path = ensure_event(prior_history)
            receipt = {"receipt_id": f"IRC-{digest(matter_id + ':' + data['source_action_key'])[:24]}",
                "source_action_key": data["source_action_key"], "operation": "record_issue_disposition",
                "target": {"matter_id": matter_id, "issue_id": issue_id}, "state": "applied",
                "before_revision": prior_history["issue_revision"], "after_revision": current_revision,
                "changed_links": [self.workspace._path(matter_id, "issues.md"), event_path],
                "completed_parts": ["issue_disposition"], "created_at": prior_history["recorded_at"]}
            return IssueDispositionResult(issue=issue, receipt=receipt).model_dump()
        if prior:
            if prior.get("fingerprint") != fingerprint:
                raise WorkspaceConflict("This action key was used for a different disposition.", self.workspace.issues_revision(matter_id), code="action_key_conflict")
            saved_issue = prior.get("issue") or next(item for item in self.workspace.issues(matter_id) if item["issue_id"] == issue_id)
            return IssueDispositionResult(issue=saved_issue, receipt=prior["receipt"]).model_dump()
        current_revision = self.workspace.issues_revision(matter_id)
        if data["expected_revision"] != current_revision:
            raise WorkspaceConflict("This issue changed. Refresh before recording its disposition.", current_revision)
        history = list(issue.get("disposition_history") or [])
        action = "reopened" if data["disposition"] == "unresolved" and issue.get("disposition") not in {None, "unresolved"} else "recorded"
        disposition_id = f"DSP-{digest(matter_id + ':' + issue_id + ':' + data['source_action_key'])[:24]}"
        entry = IssueDispositionRecord(
            disposition_id=disposition_id, disposition=data["disposition"], reason=data["reason"].strip(),
            actor_id=actor_id, actor_name=actor_name, recorded_at=iso_now(),
            source_action_key=data["source_action_key"], issue_revision=current_revision, action=action,
            linked_work_item_ids=supplied_work, linked_decision_ids=supplied_decisions,
            supersedes_disposition_id=history[-1].get("disposition_id") if history else None,
        ).model_dump()
        entry["request_fingerprint"] = fingerprint
        issue.update(disposition=data["disposition"], disposition_reason=data["reason"].strip(),
                     disposition_history=[*history, entry], linked_work_item_ids=supplied_work,
                     linked_decision_ids=supplied_decisions)
        self.workspace.save_issues(matter_id, nodes, expected_revision=current_revision)
        after_revision = self.workspace.issues_revision(matter_id)
        event_path = ensure_event(entry)
        receipt = {
            "receipt_id": f"IRC-{digest(matter_id + ':' + data['source_action_key'])[:24]}",
            "source_action_key": data["source_action_key"], "operation": "record_issue_disposition",
            "target": {"matter_id": matter_id, "issue_id": issue_id}, "state": "applied",
            "before_revision": current_revision, "after_revision": after_revision,
            "changed_links": [self.workspace._path(matter_id, "issues.md"), event_path],
            "completed_parts": ["issue_disposition"], "created_at": iso_now(),
        }
        # The operation ledger is part of issues.md and makes the direct action retry safe.
        fresh = self.workspace._document(matter_id, "issues.md")
        result_issue = next(item for item in self.workspace.issues(matter_id) if item["issue_id"] == issue_id)
        fresh["metadata"]["disposition_operations"] = [*operations, {
            "source_action_key": data["source_action_key"], "fingerprint": fingerprint,
            "issue_id": issue_id, "disposition_id": disposition_id, "receipt": receipt, "issue": result_issue,
        }]
        self.vault.write_markdown(fresh["path"], fresh["content"], fresh["metadata"])
        receipt["after_revision"] = self.workspace.issues_revision(matter_id)
        result_issue = next(item for item in self.workspace.issues(matter_id) if item["issue_id"] == issue_id)
        return IssueDispositionResult(issue=result_issue, receipt=receipt).model_dump()

    def claims(self, matter_id: str) -> list[dict[str, Any]]:
        workspace_doc = self.workspace._document(matter_id, "workspace.md")
        snapshot = workspace_doc["metadata"].get("snapshot") or {}
        if not isinstance(snapshot, dict):
            snapshot = {}
        direct_claims = workspace_doc["metadata"].get("claims", [])
        if not isinstance(direct_claims, list):
            direct_claims = []
        snapshot_claims = snapshot.get("claims", [])
        if not isinstance(snapshot_claims, list):
            snapshot_claims = []
        pointer_values = workspace_doc["metadata"].get("issue_analyses")
        current_paths = {
            str(item.get("source_path")): str(item.get("captured_at") or "")
            for item in pointer_values.values()
            if isinstance(item, dict) and item.get("source_path")
        } if isinstance(pointer_values, dict) else {}
        candidates: list[tuple[tuple[int, str, str], Any]] = [
            ((0, "", f"direct:{index:08d}"), raw)
            for index, raw in enumerate(direct_claims)
        ]
        candidates.extend(
            ((1, "", f"snapshot:{index:08d}"), raw)
            for index, raw in enumerate(snapshot_claims)
        )
        for path in sorted(self.vault.iter_files(self._base(matter_id), {".md"}), key=str):
            try:
                document = self.vault.read_markdown(self.vault.relative(path))
            except (OSError, UnicodeError, ValueError, TypeError, YAMLError):
                continue
            if document["metadata"].get("matter_id") in {None, matter_id}:
                saved_claims = document["metadata"].get("claims", [])
                if isinstance(saved_claims, list):
                    relative = document["path"]
                    timestamp = current_paths.get(relative) or str(
                        document["metadata"].get("generated_at")
                        or document["metadata"].get("updated_at")
                        or document["metadata"].get("created_at") or ""
                    )
                    priority = 3 if relative in current_paths else 2
                    candidates.extend(
                        ((priority, timestamp, f"{relative}:{index:08d}"), raw)
                        for index, raw in enumerate(saved_claims)
                    )
        result: dict[tuple[str, str], tuple[tuple[int, str, str], dict[str, Any]]] = {}
        for rank, raw in candidates:
            if not isinstance(raw, dict) or not raw.get("claim_id") or not raw.get("text"):
                continue
            try:
                claim = WorkspaceClaim.model_validate(raw).model_dump()
            except (TypeError, ValueError):
                repaired = dict(raw)
                repaired["evidence"] = [item for item in repaired.get("evidence", []) if isinstance(item, dict)] if isinstance(repaired.get("evidence"), list) else []
                repaired["applicability"] = repaired.get("applicability") if isinstance(repaired.get("applicability"), dict) else {}
                repaired["support_gap"] = str(repaired.get("support_gap") or "Some saved claim support details are unavailable.")
                try:
                    claim = WorkspaceClaim.model_validate(repaired).model_dump()
                except (TypeError, ValueError):
                    continue
            key = (claim["claim_id"], claim["output_revision"])
            if key not in result or rank > result[key][0]:
                result[key] = (rank, claim)
        return [result[key][1] for key in sorted(result)]

    def review_items(self, matter_id: str, issues: list[dict[str, Any]] | None = None) -> list[dict[str, Any]]:
        issues = issues if issues is not None else self.workspace.issues(matter_id)
        work_by_id = {item["work_item_id"]: item for item in self.work_items(matter_id)}
        today = date.today().isoformat()
        ranked = []
        for order, issue in enumerate(issues):
            linked_ids = set(issue.get("linked_work_item_ids", []))
            linked = [item for work_id, item in work_by_id.items()
                      if work_id in linked_ids or item.get("issue_id") == issue["issue_id"]
                      or issue["issue_id"] in (item.get("issue_ids") or [])]
            open_work = [item for item in linked if item.get("status") not in {"done", "closed", "complete", "completed"}]
            open_work.sort(key=lambda item: bool(item.get("choice_review_for")))
            if not open_work and (issue.get("disposition") in {"resolved", "risk_accepted", "not_applicable"} or issue.get("lawyer_state") == "set_aside"):
                continue
            required = next((item for item in open_work if item.get("required")), None)
            material = bool(issue.get("why_it_matters") or issue.get("fact_ids") or issue.get("assumption_ids"))
            category = 0 if required else (1 if material else 2)
            work = required or (open_work[0] if open_work else None)
            due_at = str((work or {}).get("due_at") or "") or None
            failed = bool(work and work.get("status") in {"failed", "blocked"})
            overdue = bool(due_at and due_at[:10] < today and work and work.get("status") not in {"done", "closed"})
            state = "failed" if failed else ("overdue" if overdue else "needs_attention")
            fallback = "Review the completed follow-up and record your conclusion." if issue.get("disposition") == "mitigation_in_progress" else "Review the open question." if issue.get("disposition") else "No disposition is recorded."
            reason = str((work or {}).get("description") or issue.get("priority_reason") or issue.get("why_it_matters") or fallback)
            actor = str((work or {}).get("owner") or issue.get("action_owner") or "Lawyer")
            label = str((work or {}).get("title") or issue.get("next_action") or (fallback if issue.get("disposition") else "Review and record a disposition"))
            item = IssueReviewItem(issue_id=issue["issue_id"], reason=reason, actor=actor,
                action_label=label, state=state, saved_order=order, due_at=due_at).model_dump()
            ranked.append((category, due_at or "9999-12-31", order, item))
        return [item for _, _, _, item in sorted(ranked, key=lambda row: row[:3])]

    @staticmethod
    def _edge(from_node: str, to_node: str, relationship: str, label: str,
              state: str = "active") -> dict[str, Any]:
        return DecisionMapEdge(edge_id=f"edge:{digest([relationship, from_node, to_node])[:24]}",
            from_node_id=from_node, to_node_id=to_node, relationship=relationship,
            label=label, state=state).model_dump()

    def _historical_analyses(
        self, matter_id: str, current: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        current_keys = {
            (item["analysis_id"], item["analysis_revision"]) for item in current
        }
        found: dict[tuple[str, str], dict[str, Any]] = {}
        for path in self.vault.iter_files(self._base(matter_id), {".md"}):
            try:
                document = self.vault.read_markdown(self.vault.relative(path))
                metadata = document["metadata"]
                raw_items = metadata.get("issue_analyses")
                if metadata.get("matter_id") != matter_id or not isinstance(raw_items, list):
                    continue
                output_revision = metadata.get("output_revision")
                if not isinstance(output_revision, str) or digest(document["content"].strip()) != output_revision:
                    continue
                for raw in raw_items:
                    analysis = IssueAnalysis.model_validate(raw).model_dump(mode="json")
                    key = (analysis["analysis_id"], analysis["analysis_revision"])
                    if (analysis["source_path"] == document["path"]
                            and analysis["output_revision"] == output_revision
                            and key not in current_keys):
                        found.setdefault(key, analysis)
            except (OSError, UnicodeError, TypeError, ValueError, KeyError, YAMLError):
                continue
        return list(found.values())

    def decision_map(self, matter_id: str, *, issue_id: str | None = None) -> dict[str, Any]:
        issues = self.workspace.issues(matter_id)
        if issue_id and issue_id not in {item["issue_id"] for item in issues}:
            raise KeyError("Issue not found in this matter.")
        record = self.records.get(matter_id)
        questions = self.workspace.questions(matter_id)
        scenarios = self.scenarios.list(matter_id) if self.scenarios is not None else []
        work_items, decisions = self.work_items(matter_id), self.decisions(matter_id)
        workspace_doc = self.workspace._document(matter_id, "workspace.md")
        saved = workspace_doc["metadata"].get("snapshot") or {}
        if not isinstance(saved, dict):
            saved = {}
        direct_options = workspace_doc["metadata"].get("options", [])
        saved_options = saved.get("options", [])
        options = [item for item in [*(direct_options if isinstance(direct_options, list) else []),
                                     *(saved_options if isinstance(saved_options, list) else [])]
                   if isinstance(item, dict) and item.get("option_id")]
        raw_pointers = workspace_doc["metadata"].get("issue_analyses")
        pointer_issue_ids = set(raw_pointers) if isinstance(raw_pointers, dict) else set()
        issue_analyses = self.workspace.issue_analyses(matter_id, issues=issues)
        current_analyses = [status["analysis"] for status in issue_analyses.values()
                            if isinstance(status.get("analysis"), dict)]
        analysis_records = [
            *(('current', item) for item in current_analyses),
            *(('historical', item) for item in self._historical_analyses(matter_id, current_analyses)),
        ]
        for scenario in scenarios:
            proposed_outcomes = scenario.get("proposed_outcomes")
            for outcome in proposed_outcomes if isinstance(proposed_outcomes, list) else []:
                if not isinstance(outcome, dict) or not outcome.get("outcome_id"):
                    continue
                options.append({**outcome, "option_id": outcome["outcome_id"],
                                "_scenario_id": scenario["scenario_id"],
                                "_historical": bool(scenario.get("stale", {}).get("is_stale"))})
        nodes: dict[str, dict[str, Any]] = {}
        edges: dict[str, dict[str, Any]] = {}
        missing: set[str] = set()

        def string_ids(value: Any) -> list[str]:
            return list(dict.fromkeys(
                item for item in value if isinstance(item, str) and item
            )) if isinstance(value, list) else []

        def add(record_type: str, record_id: str, label: str, state: str, **extra: Any) -> str:
            node_id = f"{record_type}:{record_id}"
            if node_id in nodes:
                if nodes[node_id].get("missing_reference") and not extra.get("missing_reference"):
                    prior = nodes[node_id]
                    nodes[node_id] = DecisionMapNode(node_id=node_id, record_type=record_type,
                        record_id=record_id, label=label or record_id, state=state, **extra).model_dump()
                    for key in ("issue_ids", "claim_ids"):
                        nodes[node_id][key] = list(dict.fromkeys([
                            *prior.get(key, []), *nodes[node_id].get(key, []),
                        ]))
                    missing.discard(node_id)
                    return node_id
                for key in ("issue_ids", "claim_ids"):
                    nodes[node_id][key] = list(dict.fromkeys([
                        *nodes[node_id].get(key, []), *extra.get(key, []),
                    ]))
                return node_id
            nodes[node_id] = DecisionMapNode(node_id=node_id, record_type=record_type,
                record_id=record_id, label=label or record_id, state=state, **extra).model_dump()
            return node_id

        business = self.workspace.business_question(matter_id)
        add("business_question", business["question_id"], business["text"], "current", source_revision=business["revision"])
        for item in issues:
            status = issue_analyses.get(item["issue_id"], {})
            analysis = status.get("analysis") if isinstance(status.get("analysis"), dict) else None
            add("issue", item["issue_id"], item["title"], item.get("disposition") or item.get("lawyer_state") or "open",
                detail=item.get("why_it_matters", ""), issue_ids=[item["issue_id"]], claim_ids=item.get("claim_ids", []),
                source_revision=self.workspace.issues_revision(matter_id), data={"issue": item, "analysis_state": status.get("state", "not_mapped")},
                analysis_id=(analysis or {}).get("analysis_id"), analysis_revision=(analysis or {}).get("analysis_revision"),
                analysis_path=(analysis or {}).get("source_path"), output_revision=(analysis or {}).get("output_revision"))
        for item in record.get("facts", []):
            add("fact", item["fact_id"], item.get("text", ""), item.get("status", "unknown"))
        for item in questions:
            links = list(dict.fromkeys(value for value in [item.get("issue_id"), *item.get("issue_ids", [])] if value))
            detail_parts = [str(item.get("consequence") or "")]
            if item.get("answer"):
                detail_parts.append(f"Saved answer ({item.get('answer_kind') or 'unknown provenance'}): {item['answer']}")
            if item.get("answer_source_ids"):
                detail_parts.append("Sources: " + ", ".join(item["answer_source_ids"]))
            if item.get("answer_claim_ids"):
                detail_parts.append("Claims: " + ", ".join(item["answer_claim_ids"]))
            add("question", item["question_id"], item["text"], item.get("state", "open"), detail="\n".join(part for part in detail_parts if part),
                issue_ids=links, source_revision=item.get("source_revision"))
        for item in options:
            linked_issues = string_ids(item.get("issue_ids"))
            legacy_group = "historical" if any(value in pointer_issue_ids for value in linked_issues) else "legacy"
            item["_map_group"] = ("historical" if item.get("_historical") else "hypothetical") if item.get("_scenario_id") else legacy_group
            add("option", str(item["option_id"]), str(item.get("label") or item.get("title") or item["option_id"]),
                "historical" if item["_map_group"] == "historical" else str(item.get("state") or "proposed"),
                group=item["_map_group"],
                data=dict(item), issue_ids=linked_issues,
                claim_ids=string_ids(item.get("claim_ids")),
                hypothetical=bool(item.get("_scenario_id")))
        for item in scenarios:
            scenario_stale = bool(item.get("stale", {}).get("is_stale"))
            add("scenario", item["scenario_id"], item["title"], item.get("analysis_state", "not_started"),
                issue_ids=item.get("issue_ids", []), claim_ids=item.get("claim_ids", []), hypothetical=True,
                source_revision=item.get("revision"), detail="Hypothetical · Agent analysis",
                group="historical" if scenario_stale else "hypothetical")
        for item in work_items:
            add("work", item["work_item_id"], item.get("title", item["work_item_id"]), item.get("status", "open"),
                issue_ids=[item["issue_id"]] if item.get("issue_id") else [],
                detail=("Owner: " + str(item["owner"])) if item.get("owner") else "", data=item)
        for item in decisions:
            map_basis = item.get("map_basis") if isinstance(item.get("map_basis"), dict) else None
            decision_issues = string_ids(item.get("issue_ids")) or ([item["issue_id"]] if isinstance(item.get("issue_id"), str) and item.get("issue_id") else [])
            if map_basis and map_basis.get("issue_id"):
                decision_issues = list(dict.fromkeys([*decision_issues, str(map_basis["issue_id"])]))
            add("decision", item["decision_id"], item.get("title", item["decision_id"]), "recorded",
                data=item, issue_ids=decision_issues)

        analysis_claims: dict[tuple[str, str], dict[str, dict[str, Any]]] = {}

        def analysis_extra(analysis: dict[str, Any], item: dict[str, Any], group: str) -> dict[str, Any]:
            key = (analysis["analysis_id"], analysis["analysis_revision"])
            if key not in analysis_claims:
                analysis_claims[key] = {
                    claim["claim_id"]: claim
                    for claim in self.workspace.analysis_claims(matter_id, analysis)
                }
            support = [analysis_claims[key][claim_id] for claim_id in item.get("claim_ids", [])
                       if claim_id in analysis_claims[key]]
            return {
                "analysis_id": analysis["analysis_id"],
                "analysis_revision": analysis["analysis_revision"],
                "analysis_path": analysis["source_path"],
                "output_revision": analysis["output_revision"],
                "group": group,
                "data": {**item, "claim_support": support},
                "issue_ids": [analysis["issue_id"]],
                "claim_ids": list(item.get("claim_ids") or []),
            }

        def missing_node(node_id: str) -> None:
            if node_id in nodes:
                return
            if ":" not in node_id:
                return
            record_type, record_id = node_id.split(":", 1)
            if record_type not in {"business_question", "issue", "fact", "question", "option", "scenario", "work", "decision", "legal_test", "condition"}:
                return
            add(record_type, record_id, f"Missing reference: {record_id}", "missing",
                group="missing", missing_reference=True)
            missing.add(node_id)

        def relate(start: str, end: str, relationship: str, label: str, state: str = "active") -> None:
            missing_node(start); missing_node(end)
            if start not in nodes or end not in nodes:
                return
            actual_state = state if state in {"active", "inactive", "unknown", "hypothetical", "historical", "missing"} else "active"
            actual_state = "missing" if nodes[start]["missing_reference"] or nodes[end]["missing_reference"] else actual_state
            edge = self._edge(start, end, relationship, label, actual_state)
            edges.setdefault(edge["edge_id"], edge)

        for group, analysis in analysis_records:
            analysis_state = issue_analyses.get(analysis["issue_id"], {}).get("state", "historical")
            if group == "historical":
                analysis_state = "historical"
            issue_node_id = f"issue:{analysis['issue_id']}"
            condition_by_id = {item["condition_id"]: item for item in analysis["conditions"]}
            linked_conditions: set[str] = set()
            for condition in analysis["conditions"]:
                add("condition", condition["condition_id"], condition["question"],
                    "historical" if group == "historical" else condition.get("assessment", "unknown"),
                    detail=condition.get("assessment_basis", ""),
                    **analysis_extra(analysis, condition, group))
            for test in analysis["tests"]:
                test_id = add("legal_test", test["test_id"], test["title"], analysis_state,
                    detail=test.get("summary", ""), **analysis_extra(analysis, test, group))
                relate(issue_node_id, test_id, "assessed_under", "Assessed under",
                       "historical" if group == "historical" else "active")
                for condition_id in test.get("condition_ids", []):
                    linked_conditions.add(condition_id)
                    condition = condition_by_id.get(condition_id, {})
                    state = "historical" if group == "historical" else (
                        "unknown" if condition.get("assessment") in {"unknown", "conflicting"} else "active"
                    )
                    relate(test_id, f"condition:{condition_id}", "depends_on", "Depends on whether", state)
            for condition in analysis["conditions"]:
                condition_id = add("condition", condition["condition_id"], condition["question"],
                    "historical" if group == "historical" else condition.get("assessment", "unknown"),
                    detail=condition.get("assessment_basis", ""),
                    **analysis_extra(analysis, condition, group))
                if condition["condition_id"] not in linked_conditions:
                    relate(issue_node_id, condition_id, "depends_on", "Depends on whether",
                           "historical" if group == "historical" else (
                               "unknown" if condition.get("assessment") in {"unknown", "conflicting"} else "active"))
                for fact_id in condition.get("fact_ids", []):
                    relate(f"fact:{fact_id}", condition_id, "supports", "Supports assessment",
                           "historical" if group == "historical" else "active")
                    add("fact", fact_id, f"Missing reference: {fact_id}", "missing",
                        group="missing", issue_ids=[analysis["issue_id"]], missing_reference=True)
                for question_id in condition.get("question_ids", []):
                    relate(f"question:{question_id}", condition_id, "supports", "Supports assessment",
                           "historical" if group == "historical" else "active")
            for option in analysis["options"]:
                option_id = add("option", option["option_id"], option["title"],
                    "historical" if group == "historical" else option.get("recommendation", "candidate"),
                    detail=option.get("consequence", ""), **analysis_extra(analysis, option, group))
                requirements = option.get("requirements", [])
                combination = option.get("combination")
                if not requirements:
                    relate(issue_node_id, option_id, "if",
                           "Alternative" if option.get("kind") == "business_alternative" else "Candidate path",
                           "historical" if group == "historical" else "active")
                requirement_results = []
                for requirement in requirements:
                    assessment = condition_by_id.get(requirement["condition_id"], {}).get("assessment")
                    if assessment not in {"met", "not_met"}:
                        requirement_results.append("unresolved")
                    elif assessment == requirement["state"]:
                        requirement_results.append("match")
                    else:
                        requirement_results.append("mismatch")
                if (combination or "all") == "all":
                    if "mismatch" in requirement_results:
                        route_states = ["inactive"] * len(requirements)
                    elif "unresolved" in requirement_results:
                        route_states = ["unknown"] * len(requirements)
                    else:
                        route_states = ["active"] * len(requirements)
                else:
                    route_states = [
                        "active" if result == "match" else "inactive" if result == "mismatch" else "unknown"
                        for result in requirement_results
                    ]
                for requirement, evaluated_state in zip(requirements, route_states, strict=True):
                    route_state = "historical" if group == "historical" else evaluated_state
                    prefix = (combination or "all").title()
                    label = f"{prefix} · if {requirement['state'].replace('_', ' ')}"
                    relate(f"condition:{requirement['condition_id']}", option_id, "if", label, route_state)
                for work_id in option.get("work_item_ids", []):
                    relate(option_id, f"work:{work_id}", "requires", "Requires",
                           "historical" if group == "historical" else "active")

        for item in issues:
            node_id = f"issue:{item['issue_id']}"
            relate(f"business_question:{business['question_id']}", node_id, "depends_on", "Includes issue")
            if item.get("parent_issue_id"):
                relate(node_id, f"issue:{item['parent_issue_id']}", "depends_on", "Depends on")
            for fact_id in item.get("fact_ids", []):
                relate(f"fact:{fact_id}", node_id, "supports", "Supports")
            for work_id in item.get("linked_work_item_ids", []):
                relate(node_id, f"work:{work_id}", "mitigated_by", "Mitigated by")
            for decision_id in item.get("linked_decision_ids", []):
                relate(node_id, f"decision:{decision_id}", "decided_by", "Decided by")
            for dependency in item.get("depends_on", []):
                relate(node_id, str(dependency), "depends_on", "Depends on")
        for item in questions:
            qid = f"question:{item['question_id']}"
            state = "unknown" if item.get("state") != "answered" else "active"
            for linked_issue in list(dict.fromkeys(value for value in [item.get("issue_id"), *item.get("issue_ids", [])] if value)):
                relate(f"issue:{linked_issue}", qid, "depends_on", "Depends on", state)
            for fact_id in item.get("linked_fact_ids", []):
                relate(f"fact:{fact_id}", qid, "supports", "Supports answer")
        for item in options:
            option_id = f"option:{item['option_id']}"
            branch_state = "historical" if item.get("_map_group") == "historical" else ("hypothetical" if item.get("_scenario_id") else "unknown" if item.get("condition") else "active")
            if item.get("_scenario_id"):
                relate(f"scenario:{item['_scenario_id']}", option_id, "if", str(item.get("condition") or "If selected"), branch_state)
            for linked_issue in string_ids(item.get("issue_ids")):
                relate(f"issue:{linked_issue}", option_id, "if", str(item.get("condition") or "If selected"), branch_state)
            for work_id in string_ids(item.get("work_item_ids")):
                relate(option_id, f"work:{work_id}", "mitigated_by", "Mitigated by")
            for decision_id in string_ids(item.get("decision_ids")):
                relate(option_id, f"decision:{decision_id}", "decided_by", "Decided by")
        for item in scenarios:
            scenario_id = f"scenario:{item['scenario_id']}"
            scenario_state = "historical" if item.get("stale", {}).get("is_stale") else "hypothetical"
            for linked_issue in item.get("issue_ids", []):
                relate(f"issue:{linked_issue}", scenario_id, "if", "Hypothetical", scenario_state)
            for branch_id in item.get("affected_branch_ids", []):
                target = str(branch_id)
                if ":" not in target:
                    target = f"option:{target}"
                relate(scenario_id, target, "if", "Affected hypothetical branch", scenario_state)
        for item in work_items:
            if item.get("issue_id"):
                relate(f"issue:{item['issue_id']}", f"work:{item['work_item_id']}", "mitigated_by", "Mitigated by")
            if item.get("decision_id"):
                relate(f"decision:{item['decision_id']}", f"work:{item['work_item_id']}", "requires", "Follow-up work")
                decision = next((value for value in decisions if value["decision_id"] == item["decision_id"]), {})
                basis = decision.get("map_basis") or {}
                if basis.get("selected_option_id"):
                    relate(f"option:{basis['selected_option_id']}", f"work:{item['work_item_id']}", "requires", "Confirmed follow-up")
        revised_ids = {item.get("revises_decision_id") for item in decisions if item.get("revises_decision_id")}
        for item in decisions:
            for linked_issue in string_ids(item.get("issue_ids")) or ([item["issue_id"]] if isinstance(item.get("issue_id"), str) and item.get("issue_id") else []):
                relate(f"issue:{linked_issue}", f"decision:{item['decision_id']}", "decided_by", "Decided by")
            basis = item.get("map_basis") if isinstance(item.get("map_basis"), dict) else None
            if basis and basis.get("selected_option_id"):
                status = issue_analyses.get(str(basis.get("issue_id") or ""), {})
                current = status.get("analysis") if isinstance(status.get("analysis"), dict) else {}
                exact_current = (current.get("analysis_id") == basis.get("analysis_id")
                                 and current.get("analysis_revision") == basis.get("analysis_revision")
                                 and current.get("output_revision") == basis.get("output_revision")
                                 and status.get("state") in {"saved", "partial", "needs_review"}
                                 and item["decision_id"] not in revised_ids)
                relate(f"option:{basis['selected_option_id']}", f"decision:{item['decision_id']}",
                       "decided_by", "Recorded as", "active" if exact_current else "historical")
        direct_edges = workspace_doc["metadata"].get("decision_map_edges", [])
        saved_edges = saved.get("decision_map_edges", [])
        for raw in [*(direct_edges if isinstance(direct_edges, list) else []),
                    *(saved_edges if isinstance(saved_edges, list) else [])]:
            if not isinstance(raw, dict):
                continue
            relationship = raw.get("relationship")
            if relationship in {"depends_on", "if", "supports", "mitigated_by", "decided_by", "assessed_under", "requires"}:
                relate(str(raw.get("from_node_id") or ""), str(raw.get("to_node_id") or ""), relationship,
                    str(raw.get("label") or relationship.replace("_", " ").title()), str(raw.get("state") or "active"))

        visible = set(nodes)
        if issue_id:
            visible, queue = set(), [f"issue:{issue_id}"]
            adjacency: dict[str, set[str]] = {}
            for edge in edges.values():
                adjacency.setdefault(edge["from_node_id"], set()).add(edge["to_node_id"])
                adjacency.setdefault(edge["to_node_id"], set()).add(edge["from_node_id"])
            while queue:
                current = queue.pop()
                if current in visible:
                    continue
                visible.add(current)
                if current.startswith("business_question:"):
                    continue
                queue.extend(sorted(adjacency.get(current, set()) - visible))
        from app.services.condition_questions import question_view
        for status in issue_analyses.values():
            analysis = status.get("analysis")
            if not analysis:
                continue
            answers = [a for a in workspace_doc["metadata"].get("path_condition_answers", []) if a.get("issue_id") == analysis["issue_id"]]
            for number, condition in enumerate(analysis["conditions"], 1):
                node = nodes.get(f"condition:{condition['condition_id']}")
                if node:
                    node.setdefault("data", {}).update(question_view(condition, number, answers))
        for answer in workspace_doc["metadata"].get("path_condition_answers", []):
            node = nodes.get(f"condition:{answer.get('condition_id')}")
            if node and node.get("analysis_revision") == answer.get("analysis_revision"):
                node.setdefault("data", {})["reported_answer"] = answer
        for assessment in workspace_doc["metadata"].get("path_condition_assessments", []):
            node = nodes.get(f"condition:{assessment.get('condition_id')}")
            if node and node.get("analysis_revision") == assessment.get("analysis_revision") and node.get("group") != "historical":
                node.setdefault("data", {})["lawyer_assessment"] = assessment
                node["state"] = assessment["assessment"]
                node["detail"] = assessment["reason"]
        for edge in edges.values():
            condition = nodes.get(edge["from_node_id"], {})
            target = nodes.get(edge["to_node_id"], {})
            if edge["relationship"] == "if" and edge["state"] != "historical" and condition.get("data", {}).get("lawyer_assessment"):
                requirement = next((req for req in target.get("data", {}).get("requirements", []) if req["condition_id"] == condition.get("record_id")), None)
                if requirement:
                    edge["state"] = "unknown" if condition["state"] in {"unknown", "conflicting"} else "active" if condition["state"] == requirement["state"] else "inactive"
        projected_nodes = [node for key, node in nodes.items() if key in visible]
        projected_edges = [edge for edge in edges.values() if edge["from_node_id"] in visible and edge["to_node_id"] in visible]
        revisions = self.workspace.source_revisions(matter_id)
        return DecisionMapSnapshot(matter_id=matter_id, revision=digest({"sources": revisions, "nodes": projected_nodes, "edges": projected_edges, "issue_analyses": issue_analyses}),
            source_revisions=revisions, issue_analyses=issue_analyses,
            nodes=projected_nodes, edges=projected_edges,
            selected_issue_id=issue_id, missing_references=sorted(item for item in missing if item in visible)).model_dump()

    def documents(self, matter_id: str) -> list[dict[str, Any]]:
        base = self._base(matter_id)
        matter_metadata = self.vault.read_markdown(f"{base}/matter.md")["metadata"]
        approved_path = str(matter_metadata.get("response_approved_artifact_path") or "")
        sources = {str(item.get("path")): item for item in self.records.get(matter_id).get("sources", []) if item.get("path")}
        companions: dict[str, str] = {}
        for path in self.vault.iter_files(base, {".md"}):
            if not path.name.endswith(".extracted.md"):
                continue
            try:
                document = self.vault.read_markdown(self.vault.relative(path))
            except (OSError, UnicodeError, ValueError, TypeError, YAMLError):
                continue
            source_path = document["metadata"].get("source_path")
            if source_path and document["metadata"].get("record_type") == "extracted_document":
                companions[str(source_path)] = document["path"]
        result = []
        excluded = {"events", "conversations", "dossier-revisions", "continuity", "scenarios"}
        for path in self.vault.iter_files(base):
            relative = self.vault.relative(path)
            local = PurePosixPath(relative).relative_to(PurePosixPath(base))
            if any(part.startswith(".") for part in local.parts) or (local.parts and local.parts[0] in excluded):
                continue
            try:
                document = self.vault.read_document(relative)
            except (OSError, UnicodeError, ValueError, TypeError, YAMLError):
                result.append(DocumentIdentity(document_id=f"FILE-{digest(relative)[:24]}", path=relative,
                    title=path.stem, kind="matter_record", revision=hashlib.sha256(path.read_bytes()).hexdigest(),
                    lifecycle_state="matter_record", editable=False, immutable=True).model_dump())
                continue
            metadata = document.get("metadata", {})
            if metadata.get("matter_id") not in {None, matter_id}:
                continue
            source = sources.get(relative) or sources.get(str(metadata.get("source_path") or ""))
            work_product_id = metadata.get("work_product_id")
            source_id = (source or {}).get("source_id") or metadata.get("source_id")
            if work_product_id:
                kind, document_id = "work_product", str(work_product_id)
            elif source_id or metadata.get("record_type") in {"extracted_document", "source_document"} or "source" in local.parts or "documents" in local.parts:
                kind, document_id = "source", str(source_id or f"FILE-{digest(relative)[:24]}")
            else:
                kind, document_id = "matter_record", f"FILE-{digest(relative)[:24]}"
            if kind == "work_product":
                state = str(metadata.get("state") or "draft")
                lifecycle = "approved" if relative == approved_path else ("final" if state == "final" else "editing_draft")
            elif kind == "source":
                lifecycle = "reading_source"
            else:
                lifecycle = "matter_record"
            immutable = bool(metadata.get("immutable")) or lifecycle in {"final", "approved"} or not document.get("editable", False)
            revision = hashlib.sha256(document.get("content", "").encode("utf-8")).hexdigest() if document.get("kind") in {"markdown", "text"} else hashlib.sha256(path.read_bytes()).hexdigest()
            result.append(DocumentIdentity(document_id=document_id, path=relative,
                title=str(metadata.get("title") or path.stem), kind=kind, revision=revision,
                version_id=metadata.get("version_id") or metadata.get("final_id") or (source or {}).get("version"),
                work_product_id=work_product_id, lifecycle_state=lifecycle,
                source_url=metadata.get("url") if kind == "source" else None,
                editable=bool(document.get("editable", False)) and not immutable and kind != "source", immutable=immutable,
                original_path=metadata.get("source_path") if metadata.get("record_type") == "extracted_document" else metadata.get("original_path"),
                extracted_path=metadata.get("extracted_path") or companions.get(relative)).model_dump())
        return sorted(result, key=lambda item: (item["kind"], item["title"].casefold(),
            item["document_id"], not item["editable"], item["path"]))

    def resolve_document(self, matter_id: str, target: DocumentReferenceTarget | dict[str, Any]) -> dict[str, Any]:
        requested = DocumentReferenceTarget.model_validate(target)
        self.workspace._validate_path(matter_id, requested.path)
        document = next((item for item in self.documents(matter_id)
                         if item["document_id"] == requested.document_id and item["path"] == requested.path), None)
        if not self.vault.exists(requested.path):
            return ResolvedDocumentReference(target=requested, document=None, passage_state="missing",
                message="Document unavailable.").model_dump()
        if document is None:
            raise ValueError("Document identity and path do not match this matter.")
        try:
            content = self.vault.read_document(requested.path).get("content", "")
        except (OSError, UnicodeError, ValueError, TypeError, YAMLError):
            return ResolvedDocumentReference(target=requested, document=document, passage_state="document_only",
                message="Document found. Preview unavailable.").model_dump()
        historical = False
        if requested.revision and requested.revision != document["revision"]:
            current_id = document["document_id"]
            for path in self.vault.iter_files(self._base(matter_id), {".md"}):
                try:
                    candidate = self.vault.read_markdown(self.vault.relative(path))
                except (OSError, UnicodeError, ValueError, TypeError, YAMLError):
                    continue
                metadata = candidate["metadata"]
                candidate_id = metadata.get("work_product_id") or metadata.get("source_id")
                candidate_revision = hashlib.sha256(candidate["content"].encode("utf-8")).hexdigest()
                if str(candidate_id or "") == current_id and candidate_revision == requested.revision:
                    content, historical = candidate["content"], True
                    historical_state = "final" if metadata.get("state") == "final" else document["lifecycle_state"]
                    document = {**document, "path": candidate["path"], "revision": requested.revision,
                                "version_id": metadata.get("version_id") or metadata.get("final_id") or document.get("version_id"),
                                "lifecycle_state": historical_state, "editable": False, "immutable": True}
                    break
            if not historical:
                return ResolvedDocumentReference(target=requested, document=document, passage_state="document_only",
                    message="Requested revision unavailable. The current document is open.").model_dump()
        locator = requested.locator.strip()
        excerpt = (requested.available_excerpt or "").strip()
        passage = excerpt or locator
        exact = bool(passage and content.count(passage) == 1)
        passage_state = "exact" if exact else "document_only"
        message = "Historical revision." if historical and exact else ("" if exact or not (locator or excerpt or requested.exact_passage_available) else "Exact passage unavailable.")
        return ResolvedDocumentReference(target=requested, document=document,
            passage_state=passage_state, message=message).model_dump()
