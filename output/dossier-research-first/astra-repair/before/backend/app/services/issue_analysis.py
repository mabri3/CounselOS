from __future__ import annotations

import base64
import json
import re
from yaml import YAMLError
from datetime import UTC, datetime
from typing import Any

from app.models.workspace import IssueAnalysis, IssueOption, LegalTest, PathCondition
from app.services.dossier import serialized
from app.services.workspace import WorkspaceService, digest


DECISION_PATHS_FENCE = re.compile(
    r"(?ms)^```decision-paths[ \t]*\n(?P<payload>.*?)\n```[ \t]*(?:\n|$)"
)
_CONTEXT_ROLES = {
    "company_context", "workspace_reference", "explicit_practice_note",
    "attachment", "active_file", "source_file", "selected_passage", "unsaved_editor_text",
}


def extract_decision_paths(text: str) -> tuple[str, dict[str, Any] | None, list[str]]:
    """Remove one valid optional decision-path block without affecting prose."""
    warnings: list[str] = []
    for match in DECISION_PATHS_FENCE.finditer(text):
        try:
            parsed = json.loads(match.group("payload"))
        except (TypeError, ValueError):
            warnings.append("Optional decision-paths block is malformed. Useful prose was retained.")
            continue
        if not isinstance(parsed, dict) or not (
            isinstance(parsed.get("issue_analysis"), dict)
            or isinstance(parsed.get("issue_analyses"), list)
        ):
            warnings.append("Optional decision-paths block has an invalid shape. Useful prose was retained.")
            continue
        return (text[:match.start()] + text[match.end():]).rstrip(), parsed, warnings
    return text, None, warnings


class IssueAnalysisService:
    """Capture, validate, publish, and resolve optional issue-path analysis."""

    def __init__(self, vault, matters, workspace=None):
        self.vault, self.matters = vault, matters
        self.workspace = workspace or WorkspaceService(vault, matters)

    def capture(
        self, matter_id: str, issue_id: str | None = None, *,
        frozen_context: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        issues = self.workspace.issues(matter_id)
        if issue_id and issue_id not in {item["issue_id"] for item in issues}:
            raise ValueError("Issue not found in this matter.")
        selected = [item for item in issues if not issue_id or item["issue_id"] == issue_id]
        question = self.workspace.business_question(matter_id)
        records = self.workspace.records.get(matter_id)
        questions = self.workspace.questions(matter_id)
        context_projection = self._context_projection(frozen_context)
        captured_at = datetime.now(UTC).isoformat(timespec="microseconds")
        workspace_doc = self.workspace._document(matter_id, "workspace.md")
        pointers = workspace_doc["metadata"].get("issue_analyses") or {}
        if not isinstance(pointers, dict):
            pointers = {}
        issue_captures: dict[str, dict[str, Any]] = {}
        for issue in selected:
            basis, inputs = self._basis(
                question, issue, records, questions, context_projection
            )
            choices = self._recorded_choices(matter_id)
            if choices:
                basis["recorded_choices"] = digest(choices)
                inputs["recorded_choices"] = choices
            issue_captures[issue["issue_id"]] = {
                "issue_id": issue["issue_id"],
                "input_basis": basis,
                "inputs": inputs,
                "prior_reference": self._pointer_identity(pointers.get(issue["issue_id"])),
            }
        return {
            "matter_id": matter_id,
            "issue_id": issue_id,
            "captured_at": captured_at,
            "business_question": {k: question.get(k) for k in ("question_id", "text", "revision")},
            "issues": issue_captures,
            "supplied_context": context_projection,
        }

    @serialized
    def publish(
        self, matter_id: str, *, path: str, run_id: str,
        output_revision: str, structure: Any, capture: Any,
        claims: list[dict[str, Any]] | None = None,
    ) -> dict[str, Any]:
        warnings: list[str] = []
        if not isinstance(capture, dict) or capture.get("matter_id") != matter_id:
            return {"warnings": ["Decision paths were not saved because their captured input was unavailable."], "issue_analyses": [], "historical": True}
        document = self._output_document(matter_id, path, run_id, output_revision)
        raw_items = self._structure_items(structure)
        if raw_items is None:
            return {"warnings": ["Optional decision-path structure is unavailable. Prior analysis was retained."], "issue_analyses": [], "historical": False}
        exact_claims = claims if claims is not None else document["metadata"].get("claims", [])
        claim_revisions = self._claim_revisions(matter_id, exact_claims, output_revision)
        known = self._known_ids(matter_id, claim_revisions)
        saved: list[dict[str, Any]] = []
        current_eligible: dict[str, bool] = {}
        for index, raw in enumerate(raw_items):
            try:
                analysis, item_warnings, eligible = self._analysis(
                    matter_id, path, run_id, output_revision, raw, capture,
                    known, claim_revisions,
                )
            except (TypeError, ValueError, KeyError) as exc:
                warnings.append(f"Optional issue analysis {index + 1} unavailable: {exc}")
                continue
            warnings.extend(item_warnings)
            saved.append(analysis)
            current_eligible[analysis["analysis_id"]] = eligible
        if not saved:
            return {"warnings": warnings, "issue_analyses": [], "historical": False}

        metadata = document["metadata"]
        prior_saved = metadata.get("issue_analyses") or []
        if not isinstance(prior_saved, list):
            prior_saved = []
        by_id = {
            item.get("analysis_id"): item for item in prior_saved
            if isinstance(item, dict) and item.get("analysis_id")
        }
        for item in saved:
            prior = by_id.get(item["analysis_id"])
            if prior and prior.get("analysis_revision") != item["analysis_revision"]:
                raise ValueError("This run already contains a different issue analysis.")
            by_id[item["analysis_id"]] = item
        metadata["issue_analyses"] = list(by_id.values())
        metadata["output_revision"] = output_revision
        if claims is not None:
            metadata["claims"] = claims
        self.vault.write_markdown(path, document["content"], metadata)

        workspace_doc = self.workspace._document(matter_id, "workspace.md")
        pointers = workspace_doc["metadata"].get("issue_analyses") or {}
        pointers = dict(pointers) if isinstance(pointers, dict) else {}
        historical = False
        for analysis in saved:
            issue_id = analysis["issue_id"]
            if not current_eligible.get(analysis["analysis_id"], True):
                historical = True
                continue
            captured_issue = capture["issues"][issue_id]
            current_basis = self._current_basis(
                matter_id, issue_id, captured_issue["input_basis"]
            )
            if current_basis != captured_issue["input_basis"]:
                historical = True
                continue
            current_pointer = self._pointer_identity(pointers.get(issue_id))
            prior_pointer = self._pointer_identity(captured_issue.get("prior_reference"))
            current_time = str((current_pointer or {}).get("captured_at") or "")
            candidate_time = str(capture.get("captured_at") or "")
            candidate_pointer = {
                "analysis_id": analysis["analysis_id"],
                "analysis_revision": analysis["analysis_revision"],
                "source_path": path,
                "output_revision": output_revision,
                "run_id": run_id,
                "captured_at": candidate_time,
            }
            if current_pointer == candidate_pointer:
                continue
            if current_pointer != prior_pointer and current_time >= candidate_time:
                historical = True
                continue
            pointers[issue_id] = candidate_pointer
        workspace_doc["metadata"]["issue_analyses"] = pointers
        self.vault.write_markdown(
            workspace_doc["path"], workspace_doc["content"], workspace_doc["metadata"]
        )
        return {"warnings": warnings, "issue_analyses": saved, "historical": historical}

    def resolve(self, matter_id: str, issue_id: str) -> dict[str, Any]:
        if issue_id not in {item["issue_id"] for item in self.workspace.issues(matter_id)}:
            raise ValueError("Issue not found in this matter.")
        doc = self.workspace._document(matter_id, "workspace.md")
        pointers = doc["metadata"].get("issue_analyses") or {}
        reference = pointers.get(issue_id) if isinstance(pointers, dict) else None
        if not isinstance(reference, dict):
            return {"issue_id": issue_id, "state": "not_mapped", "analysis": None, "warnings": [], "reference": None}
        try:
            analysis = self.load(
                matter_id, str(reference.get("source_path") or ""),
                str(reference.get("analysis_id") or ""),
                str(reference.get("analysis_revision") or ""),
            )
        except (OSError, TypeError, ValueError, KeyError):
            return {"issue_id": issue_id, "state": "missing", "analysis": None,
                    "warnings": ["The saved issue analysis could not be loaded."], "reference": reference}
        if (analysis["output_revision"] != reference.get("output_revision")
                or analysis["run_id"] != reference.get("run_id")
                or analysis["source_path"] != reference.get("source_path")):
            return {"issue_id": issue_id, "state": "missing", "analysis": None,
                    "warnings": ["The current issue-analysis pointer does not match its exact saved output."],
                    "reference": reference}
        current = self._current_basis(matter_id, issue_id, analysis["input_basis"])
        state = "needs_review" if current != analysis["input_basis"] else (
            "partial" if analysis.get("warnings") or not analysis.get("tests") or not analysis.get("options") else "saved"
        )
        return {"issue_id": issue_id, "state": state, "analysis": analysis,
                "warnings": list(analysis.get("warnings") or []), "reference": reference}

    def load(self, matter_id: str, path: str, analysis_id: str, analysis_revision: str) -> dict[str, Any]:
        document = self._output_document(matter_id, path, None, None)
        analyses = document["metadata"].get("issue_analyses") or []
        if not isinstance(analyses, list):
            raise ValueError("Saved issue analysis metadata is invalid.")
        item = next((entry for entry in analyses if isinstance(entry, dict)
                     and entry.get("analysis_id") == analysis_id
                     and entry.get("analysis_revision") == analysis_revision), None)
        if item is None:
            raise ValueError("Exact saved issue analysis revision not found.")
        parsed = IssueAnalysis.model_validate(item).model_dump(mode="json")
        if parsed["source_path"] != path or parsed["output_revision"] != document["metadata"].get("output_revision"):
            raise ValueError("Saved analysis support reference does not match its output.")
        if digest(document["content"].strip()) != parsed["output_revision"]:
            raise ValueError("Saved analysis output content changed.")
        if parsed["issue_id"] not in {issue["issue_id"] for issue in self.workspace.issues(matter_id)}:
            raise ValueError("Saved analysis points to a foreign issue.")
        return parsed

    def _analysis(self, matter_id: str, path: str, run_id: str, output_revision: str,
                  raw: Any, capture: dict[str, Any], known: dict[str, set[str]],
                  claim_revisions: dict[str, str]) -> tuple[dict[str, Any], list[str], bool]:
        if not isinstance(raw, dict):
            raise TypeError("analysis is not an object")
        issue_id = str(raw.get("issue_id") or "")
        captured = (capture.get("issues") or {}).get(issue_id)
        if not captured:
            raise ValueError("analysis issue was not captured for this run")
        warnings: list[str] = []
        tests = self._normalize_records(raw.get("tests", []), LegalTest, "test_id")
        conditions = self._normalize_records(raw.get("conditions", []), PathCondition, "condition_id")
        raw_options = raw.get("options", [])
        options = self._normalize_options(raw_options, warnings)
        current_eligible = not (isinstance(raw_options, list) and raw_options and not options)
        all_local_ids = [item["test_id"] for item in tests] + [item["condition_id"] for item in conditions] + [item["option_id"] for item in options]
        if len(all_local_ids) != len(set(all_local_ids)):
            raise ValueError("duplicate local IDs are not allowed")
        condition_ids = {item["condition_id"] for item in conditions}
        self._validate_links(tests, conditions, options, known, condition_ids)
        connections = None
        if isinstance(raw.get("connections"), list):
            from app.models.workspace import IssueConnection
            try:
                connections = [IssueConnection.model_validate(item).model_dump(mode="json") for item in raw["connections"]]
                valid_issues = {item["issue_id"] for item in self.workspace.issues(matter_id)}
                if any(item["target_issue_id"] not in valid_issues or item["target_issue_id"] == issue_id or not item["reason"].strip() for item in connections):
                    raise ValueError("Invalid related issue or missing reason")
            except ValueError:
                connections = None
                warnings.append("Connections need assessment: invalid connection structure was omitted.")
        provider = {
            "connections": connections,
            "display_title": str(raw.get("display_title") or "").strip(),
            "explanation": str(raw.get("explanation") or "").strip(),
            "business_effect": str(raw.get("business_effect") or "").strip(),
            "tests": tests, "conditions": conditions, "options": options,
        }
        basis = dict(captured["input_basis"])
        analysis_revision = digest({"provider": provider, "issue_id": issue_id, "run_id": run_id, "input_basis": basis})
        analysis_id = "IAN-" + digest([matter_id, issue_id, run_id])[:24]
        mappings = {
            **{item["test_id"]: "TST-" + digest([analysis_id, "test", item["test_id"]])[:20] for item in tests},
            **{item["condition_id"]: "CON-" + digest([analysis_id, "condition", item["condition_id"]])[:20] for item in conditions},
            **{item["option_id"]: "OPT-" + digest([analysis_id, "option", item["option_id"]])[:20] for item in options},
        }
        for item in tests:
            item["test_id"] = mappings[item["test_id"]]
            item["condition_ids"] = [mappings[value] for value in item["condition_ids"]]
        for item in conditions:
            item["condition_id"] = mappings[item["condition_id"]]
        for item in options:
            item["option_id"] = mappings[item["option_id"]]
            for requirement in item["requirements"]:
                requirement["condition_id"] = mappings[requirement["condition_id"]]
            for effect in item.get("effects", []):
                effect["target_option_id"] = mappings[effect["target_option_id"]]
                if effect.get("condition_id"):
                    effect["condition_id"] = mappings[effect["condition_id"]]
            item["option_revision"] = digest({
                "analysis_revision": analysis_revision,
                "option": {key: value for key, value in item.items() if key != "option_revision"},
            })
        pinned_claims = {f"claim:{claim_id}": revision for claim_id, revision in claim_revisions.items()
                         if any(claim_id in item.get("claim_ids", []) for item in [*tests, *conditions, *options])}
        return IssueAnalysis(
            issue_id=issue_id, analysis_id=analysis_id, analysis_revision=analysis_revision,
            source_path=path, output_revision=output_revision,
            source_revisions=pinned_claims, input_basis=basis, run_id=run_id,
            warnings=warnings, **provider,
        ).model_dump(mode="json"), warnings, current_eligible

    @staticmethod
    def _normalize_records(raw_items: Any, model, id_key: str) -> list[dict[str, Any]]:
        if not isinstance(raw_items, list):
            raise ValueError(f"{id_key} records must be a list")
        result = []
        fields = set(model.model_fields)
        for raw in raw_items:
            if not isinstance(raw, dict) or not str(raw.get(id_key) or "").strip():
                raise ValueError(f"each {id_key} record needs a local ID")
            clean = {key: value for key, value in raw.items() if key in fields}
            result.append(model.model_validate(clean).model_dump(mode="json"))
        return result

    def _normalize_options(self, raw_items: Any, warnings: list[str]) -> list[dict[str, Any]]:
        if not isinstance(raw_items, list):
            raise ValueError("options must be a list")
        result = []
        fields = set(IssueOption.model_fields) - {"option_revision"}
        for index, raw in enumerate(raw_items):
            if not isinstance(raw, dict) or not str(raw.get("option_id") or "").strip():
                raise ValueError("each option needs a local ID")
            requirements = raw.get("requirements", [])
            combination = raw.get("combination")
            nested = any(not isinstance(item, dict) or set(item) - {"condition_id", "state"} for item in requirements) if isinstance(requirements, list) else True
            if requirements and (combination not in {"all", "any"} or nested):
                warnings.append(f"Option {index + 1} was omitted because its condition logic is incomplete or nested.")
                continue
            clean = {key: value for key, value in raw.items() if key in fields}
            clean["option_revision"] = ""
            result.append(IssueOption.model_validate(clean).model_dump(mode="json"))
        return result

    @staticmethod
    def _validate_links(tests: list[dict[str, Any]], conditions: list[dict[str, Any]],
                        options: list[dict[str, Any]], known: dict[str, set[str]],
                        condition_ids: set[str]) -> None:
        for test in tests:
            if set(test["condition_ids"]) - condition_ids:
                raise ValueError("test points to an unknown condition")
            if set(test["claim_ids"]) - known["claims"]:
                raise ValueError("test points to a foreign claim")
        for condition in conditions:
            if set(condition["fact_ids"]) - known["facts"] or set(condition["question_ids"]) - known["questions"]:
                raise ValueError("condition points to a foreign fact or question")
            if set(condition["claim_ids"]) - known["claims"]:
                raise ValueError("condition points to a foreign claim")
        option_ids = {option["option_id"] for option in options}
        for option in options:
            for effect in option.get("effects", []):
                if effect["target_option_id"] not in option_ids or effect["target_option_id"] == option["option_id"]:
                    raise ValueError("effect must point to another option in this analysis")
                if not effect["reason"].strip():
                    raise ValueError("effect requires a reason")
                if effect["trigger"] == "condition" and effect.get("condition_id") not in condition_ids:
                    raise ValueError("effect points to an unknown condition")
                if effect.get("condition_id") and effect["condition_id"] not in condition_ids:
                    raise ValueError("effect points to an unknown condition")
            if any(item["condition_id"] not in condition_ids for item in option["requirements"]):
                raise ValueError("option points to an unknown condition")
            if set(option["claim_ids"]) - known["claims"] or set(option["work_item_ids"]) - known["work"]:
                raise ValueError("option points to a foreign claim or work item")

    def _known_ids(self, matter_id: str, claims: dict[str, str]) -> dict[str, set[str]]:
        records = self.workspace.records.get(matter_id)
        return {
            "facts": {str(item.get("fact_id")) for item in records.get("facts", [])},
            "questions": {str(item.get("question_id")) for item in self.workspace.questions(matter_id)},
            "work": {str(item.get("work_item_id")) for item in self.workspace.matters.index.list_work_items(matter_id)},
            "claims": set(claims),
        }

    def _claim_revisions(self, matter_id: str, claims: Any, output_revision: str) -> dict[str, str]:
        result: dict[str, str] = {}
        for issue in self.workspace.issues(matter_id):
            revisions = issue.get("claim_output_revisions") or {}
            if isinstance(revisions, dict):
                for claim_id, revision in revisions.items():
                    if self._saved_claim_exists(matter_id, str(claim_id), str(revision)):
                        result[str(claim_id)] = str(revision)
        for item in claims if isinstance(claims, list) else []:
            if isinstance(item, dict) and item.get("claim_id") and item.get("output_revision") == output_revision:
                result[str(item["claim_id"])] = output_revision
        return result

    def _saved_claim_exists(self, matter_id: str, claim_id: str, output_revision: str) -> bool:
        for path in self.vault.iter_files(self.matters.matter_path(matter_id), {".md"}):
            try:
                document = self.vault.read_markdown(self.vault.relative(path))
                metadata = document["metadata"]
            except (OSError, ValueError, TypeError):
                continue
            if metadata.get("output_revision") != output_revision:
                continue
            if digest(document["content"].strip()) != output_revision:
                continue
            if any(isinstance(item, dict) and item.get("claim_id") == claim_id
                   and item.get("output_revision") == output_revision
                   for item in metadata.get("claims", [])):
                return True
        return False

    def _output_document(self, matter_id: str, path: str, run_id: str | None,
                         output_revision: str | None) -> dict[str, Any]:
        self.workspace._validate_path(matter_id, path)
        if not self.vault.exists(path):
            raise ValueError("Saved output was not found.")
        document = self.vault.read_markdown(path)
        metadata = document["metadata"]
        if metadata.get("matter_id") != matter_id:
            raise ValueError("Saved output belongs to another matter.")
        if run_id is not None and metadata.get("run_id") != run_id:
            raise ValueError("Saved output belongs to another run.")
        if output_revision is not None and metadata.get("output_revision") != output_revision:
            raise ValueError("Saved output revision does not match.")
        if output_revision is not None and digest(document["content"].strip()) != output_revision:
            raise ValueError("Saved output content does not match its revision.")
        return document

    @staticmethod
    def _structure_items(structure: Any) -> list[Any] | None:
        if not isinstance(structure, dict):
            return None
        if isinstance(structure.get("issue_analysis"), dict):
            return [structure["issue_analysis"]]
        if isinstance(structure.get("issue_analyses"), list):
            return structure["issue_analyses"]
        return None

    @staticmethod
    def _pointer_identity(value: Any) -> dict[str, Any] | None:
        if not isinstance(value, dict):
            return None
        keys = ("analysis_id", "analysis_revision", "source_path", "output_revision", "run_id", "captured_at")
        return {key: value.get(key) for key in keys}

    def _context_projection(self, frozen: dict[str, Any] | None) -> dict[str, Any]:
        frozen = frozen if isinstance(frozen, dict) else {}
        if "entries" in frozen and "included_roles" in frozen:
            return {
                "entries": [dict(item) for item in frozen.get("entries", []) if isinstance(item, dict)],
                "excluded_reference_ids": sorted(str(value) for value in frozen.get("excluded_reference_ids", [])),
                "excluded_paths": sorted(str(value) for value in frozen.get("excluded_paths", [])),
                "research_question": str(frozen.get("research_question") or ""),
                "manifest_present": bool(frozen.get("manifest_present")),
                "included_roles": sorted(str(value) for value in frozen.get("included_roles", [])),
                "text": str(frozen.get("text") or ""),
            }
        manifest = frozen.get("manifest") or ({"entries": frozen.get("entries", [])} if "entries" in frozen else {})
        entries = []
        manifest_entries = manifest.get("entries", []) if isinstance(manifest, dict) else []
        included_roles: list[str] = []
        for item in manifest_entries:
            if isinstance(item, dict) and item.get("state") in {"included", "truncated"}:
                included_roles.append(str(item.get("role") or ""))
            if not isinstance(item, dict) or item.get("role") not in _CONTEXT_ROLES or item.get("state") not in {"included", "truncated"}:
                continue
            entries.append({key: item.get(key) for key in (
                "reference_id", "path", "role", "state", "revision", "supplied_revision", "supplied_chars", "canonical_full"
            )})
        return {
            "entries": entries,
            "excluded_reference_ids": sorted(str(value) for value in frozen.get("excluded_reference_ids", [])),
            "excluded_paths": sorted(str(value) for value in frozen.get("excluded_paths", [])),
            "research_question": str(frozen.get("research_question") or ""),
            "manifest_present": bool(manifest_entries),
            "included_roles": sorted(set(included_roles)),
            "text": str(frozen.get("context") or ""),
        }

    def _basis(self, question: dict[str, Any], issue: dict[str, Any], records: dict[str, Any],
               questions: list[dict[str, Any]], projection: dict[str, Any]) -> tuple[dict[str, str], dict[str, Any]]:
        excluded = set(projection.get("excluded_reference_ids", []))
        sources = {str(item.get("source_id")): item for item in records.get("sources", [])}
        excluded_paths = set(projection.get("excluded_paths", []))
        def eligible(item: dict[str, Any]) -> bool:
            if any(str(item.get(key) or "") in excluded for key in ("fact_id", "source_id", "source_message_id", "contribution_id")):
                return False
            return not any(str(source_id) in excluded or str(sources.get(str(source_id), {}).get("path") or "") in excluded_paths for source_id in item.get("source_ids", []))
        included_roles = set(projection.get("included_roles", []))
        manifest_present = bool(projection.get("manifest_present"))
        include_facts = not manifest_present or "current_facts" in included_roles
        include_assumptions = not manifest_present or "working_assumptions" in included_roles
        include_questions = not manifest_present or "Supporting questions (answered is not independently verified or issue resolved)" in included_roles
        facts = [{"fact_id": item.get("fact_id"), "text": item.get("text"), "source_ids": item.get("source_ids", [])}
                 for item in records.get("facts", []) if item.get("status") == "active" and not item.get("withdrawn_at") and eligible(item)]
        assumptions = [{"assumption_id": item.get("assumption_id"), "text": item.get("text"), "reason": item.get("reason")}
                       for item in records.get("assumptions", []) if item.get("status") == "open" and not item.get("withdrawn_at") and eligible(item)]
        supplied_questions = [{key: item.get(key) for key in ("question_id", "text", "consequence", "state", "answer", "answer_kind", "linked_fact_ids")}
                              for item in questions if item.get("business_question_revision") == question.get("revision") and eligible(item)]
        facts = facts if include_facts else []
        assumptions = assumptions if include_assumptions else []
        supplied_questions = supplied_questions if include_questions else []
        issue_value = {key: issue.get(key) for key in ("issue_id", "title", "why_it_matters", "parent_issue_id", "fact_ids")}
        basis = {
            "business_question": digest({"question_id": question.get("question_id"), "text": question.get("text")}),
            "issue": digest(issue_value), "facts": digest(facts),
            "assumptions": digest(assumptions), "questions": digest(supplied_questions),
        }
        exclusions = {
            "reference_ids": sorted(excluded),
            "paths": sorted(excluded_paths),
            "manifest_present": manifest_present,
            "included_roles": sorted(included_roles),
        }
        projection_token = base64.urlsafe_b64encode(
            json.dumps(exclusions, sort_keys=True).encode()
        ).decode()
        basis["projection:" + projection_token] = digest(exclusions)
        for entry in projection.get("entries", []):
            descriptor = {key: entry.get(key) for key in ("reference_id", "path", "role", "supplied_chars", "canonical_full")}
            token = base64.urlsafe_b64encode(json.dumps(descriptor, sort_keys=True).encode()).decode()
            role = entry.get("role")
            basis["context:" + token] = str(
                entry.get("supplied_revision") or entry.get("revision") or ""
            )
            if entry.get("path") and role in {"selected_passage", "unsaved_editor_text"}:
                basis["context-file:" + token] = self._file_revision(str(entry["path"]))
        if projection.get("research_question"):
            basis["research_question"] = digest(projection["research_question"])
        return basis, {"business_question": question, "issue": issue_value, "facts": facts,
                       "assumptions": assumptions, "questions": supplied_questions,
                       "context": projection}

    def _recorded_choices(self, matter_id: str) -> list[dict[str, Any]]:
        result = []
        for path in sorted(self.vault.iter_files(f"{self.matters.matter_path(matter_id)}/decisions", {".md"}), key=str):
            try:
                record = self.vault.read_markdown(self.vault.relative(path))["metadata"]
            except (OSError, UnicodeError, ValueError, TypeError, YAMLError):
                result.append({"path": self.vault.relative(path), "state": "unavailable"})
                continue
            if record.get("matter_id") == matter_id and record.get("issue_id"):
                result.append({key: record.get(key) for key in ("decision_id", "issue_id", "chosen_path", "rationale", "conditions", "revises_decision_id")})
        return result

    def _current_basis(self, matter_id: str, issue_id: str, saved: dict[str, str]) -> dict[str, str]:
        projection = {"entries": [], "excluded_reference_ids": [], "excluded_paths": [],
                      "research_question": "", "manifest_present": False,
                      "included_roles": [], "text": ""}
        for key in saved:
            if key.startswith("context:"):
                try:
                    projection["entries"].append(json.loads(base64.urlsafe_b64decode(key[8:]).decode()))
                except (ValueError, TypeError, json.JSONDecodeError):
                    pass
            elif key.startswith("projection:"):
                try:
                    exclusions = json.loads(base64.urlsafe_b64decode(key[11:]).decode())
                    projection["excluded_reference_ids"] = exclusions.get("reference_ids", [])
                    projection["excluded_paths"] = exclusions.get("paths", [])
                    projection["manifest_present"] = bool(exclusions.get("manifest_present"))
                    projection["included_roles"] = exclusions.get("included_roles", [])
                except (ValueError, TypeError, json.JSONDecodeError):
                    pass
            elif key == "research_question":
                projection["research_question"] = "__captured_research_question__"
        issue = next(item for item in self.workspace.issues(matter_id) if item["issue_id"] == issue_id)
        basis, _ = self._basis(self.workspace.business_question(matter_id), issue,
                               self.workspace.records.get(matter_id), self.workspace.questions(matter_id), projection)
        choices = self._recorded_choices(matter_id)
        if choices or "recorded_choices" in saved:
            basis["recorded_choices"] = digest(choices)
        # A research question is immutable run input, not mutable matter state.
        if "research_question" in saved:
            basis["research_question"] = saved["research_question"]
        for key in list(basis):
            if key.startswith("context:"):
                descriptor = next((item for item in projection["entries"] if
                    "context:" + base64.urlsafe_b64encode(json.dumps(item, sort_keys=True).encode()).decode() == key), None)
                if descriptor and descriptor.get("role") in {"selected_passage", "unsaved_editor_text"}:
                    # The exact selected or unsaved bytes are immutable run
                    # input. File freshness is tracked by a separate basis key.
                    basis[key] = saved[key]
                elif descriptor and descriptor.get("path"):
                    try:
                        content = str(self.vault.read_document(descriptor["path"]).get("content") or "")
                        if descriptor.get("canonical_full"):
                            basis[key] = digest(content)
                        else:
                            chars = int(descriptor.get("supplied_chars") or len(content))
                            basis[key] = digest(content[:chars])
                    except (OSError, ValueError, TypeError):
                        basis[key] = ""
                elif descriptor:
                    # Ephemeral selected text and remote observations have no
                    # mutable local record to compare. Their captured revision
                    # stays pinned to this immutable output.
                    basis[key] = saved[key]
        return {key: basis.get(key, "") for key in {*saved, *(["recorded_choices"] if choices else [])}}

    def _file_revision(self, path: str) -> str:
        try:
            content = str(self.vault.read_document(path).get("content") or "")
            return digest(content.strip() + "\n")
        except (OSError, ValueError, TypeError, KeyError):
            return ""
