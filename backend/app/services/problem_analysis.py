"""Optional matter-level analysis saved beside existing immutable answer prose."""
from copy import deepcopy
import json
import re
from datetime import UTC, datetime
from yaml import YAMLError

from app.models.problem_analysis import ProblemAnalysisPayload
from app.services.dossier import serialized
from app.services.workspace import WorkspaceService, digest
from app.services.problem_analysis_validation import normalize

FENCE = re.compile(r"(?ms)^```problem-analysis[^\n]*\n(.*?)(?:\n```[ \t]*(?:\n|$)|\Z)")


def _unique_pairs(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("Duplicate JSON key.")
        result[key] = value
    return result


def extract_problem_analysis(text: str):
    matches = list(FENCE.finditer(text))
    if not matches:
        return text, None, []
    prose = FENCE.sub("", text).rstrip()
    warning = ["Problem breakdown could not be saved. The useful answer was retained."]
    if len(matches) != 1 or len(matches[0][1]) > 200000:
        return prose, None, warning
    try:
        raw = json.loads(matches[0][1], object_pairs_hook=_unique_pairs)
        return prose, ProblemAnalysisPayload.model_validate(raw).model_dump(mode="json"), []
    except (ValueError, TypeError):
        return prose, None, warning


class ProblemAnalysisService:
    def __init__(self, vault, matters, workspace=None):
        self.vault, self.matters = vault, matters
        self.workspace = workspace or WorkspaceService(vault, matters)

    def _file_hash(self, path):
        try:
            return digest(self.vault.read_document(path)["content"])
        except (OSError, ValueError, KeyError, TypeError, YAMLError):
            return "unavailable"

    def _inputs(self, matter_id, scope):
        records = self.workspace.records.get(matter_id)
        excluded = set(scope.get("excluded_reference_ids", []))
        excluded_paths = set(scope.get("excluded_paths", []))
        sources = {s["source_id"]: s for s in records.get("sources", [])}
        def eligible(item):
            return not (any(str(item.get(k) or "") in excluded for k in ("fact_id", "source_id", "source_message_id", "contribution_id"))
                        or any(s in excluded or sources.get(s, {}).get("path") in excluded_paths for s in item.get("source_ids", [])))
        def select(items, fields, role, id_field):
            rule = scope.get("roles", {}).get(role)
            if rule is None:
                return []
            return [{k: i.get(k) for k in fields} for i in items if eligible(i) and (rule == "all" or i.get(id_field) in rule)]
        question = self.workspace.business_question(matter_id)
        facts = select([f for f in records.get("facts", []) if f.get("status") == "active" and not f.get("withdrawn_at")],
                       ("fact_id", "text", "source_ids", "origin", "verification_status"), "current_facts", "fact_id")
        assumptions = select([a for a in records.get("assumptions", []) if a.get("status") == "open" and not a.get("withdrawn_at")],
                             ("assumption_id", "text", "reason"), "working_assumptions", "assumption_id")
        issues = select(self.workspace.issues(matter_id), ("issue_id", "title", "why_it_matters", "parent_issue_id", "fact_ids", "disposition"), "issues", "issue_id")
        questions = select([q for q in self.workspace.questions(matter_id) if q.get("business_question_revision") == question["revision"]],
                           ("question_id", "text", "consequence", "state", "answer", "answer_kind", "linked_fact_ids"), "supporting_questions", "question_id")
        decisions = []
        for d in scope.get("decisions", []):
            path = d.get("path")
            if path:
                decisions.append({"path": path, "revision": self._file_hash(path)})
        return {"business_question": {k: question[k] for k in ("question_id", "text", "revision")},
                "facts": facts, "assumptions": assumptions, "issues": issues, "questions": questions,
                "decisions": decisions, "files": {p: self._file_hash(p) for p in scope.get("paths", [])}}

    def capture(self, matter_id, *, frozen_context):
        frozen = frozen_context or {}
        entries = (frozen.get("manifest") or {}).get("entries", []) or (frozen.get("research_inputs") or {}).get("manifest_entries", [])
        text = str(frozen.get("context") or "")
        records = self.workspace.records.get(matter_id)
        candidates = {"current_facts": (records.get("facts", []), "fact_id"), "working_assumptions": (records.get("assumptions", []), "assumption_id"),
                      "issues": (self.workspace.issues(matter_id), "issue_id"), "supporting_questions": (self.workspace.questions(matter_id), "question_id")}
        scope = {"roles": {}, "paths": [], "decisions": [], "excluded_reference_ids": frozen.get("excluded_reference_ids", []), "excluded_paths": frozen.get("excluded_paths", [])}
        # Only roles actually supplied may ground this analysis. Truncated lists
        # retain only fully supplied records, never unread canonical tails.
        for entry in entries:
            role = entry.get("role", "")
            if role.startswith("Supporting questions"):
                role = "supporting_questions"
            if entry.get("state") not in {"included", "truncated"}:
                continue
            if role in candidates:
                items, key = candidates[role]
                scope["roles"][role] = "all" if entry["state"] == "included" and not (role == "issues" and frozen.get("issue_id")) else [i[key] for i in items if json.dumps(i.get("text", i.get("title", "")), ensure_ascii=False) in text and i[key] in text]
            path = entry.get("path")
            if path and role not in candidates and path not in scope["excluded_paths"]:
                self.vault.resolve(path)
                # Selected company material is permitted; another matter is not.
                if path.startswith("03_Matters/"):
                    try:
                        self.workspace._validate_path(matter_id, path)
                    except ValueError:
                        # Authorized prior-matter research still proceeds. Its
                        # records cannot become this matter's canonical map IDs.
                        continue
                scope["paths"].append(path)
        if any(e.get("role") == "Recorded durable decisions" and e.get("state") == "included" for e in entries):
            for decision in self.matters.index.list_decisions(matter_id=matter_id):
                if decision.get("decision_id") in text and decision.get("path"):
                    self.workspace._validate_path(matter_id, decision["path"])
                    scope["decisions"].append({"decision_id": decision["decision_id"], "path": decision["path"]})
        inputs = self._inputs(matter_id, scope)
        references = {}
        for kind, group, id_field in (("fact", "facts", "fact_id"), ("issue", "issues", "issue_id"), ("question", "questions", "question_id")):
            for item in inputs[group]:
                references[kind + ":" + item[id_field]] = {"kind": kind, "record_id": item[id_field], "revision": digest(item), "path": self.workspace._path(matter_id, {"fact": "facts.md", "issue": "issues.md", "question": "workspace.md"}[kind]), "text": item.get("text") or item.get("title"), "reported": kind == "fact", "availability": "supplied", "source_class": "reported_fact" if kind == "fact" else "canonical_record"}
        for decision in scope["decisions"]:
            references["decision:" + decision["decision_id"]] = {"kind": "decision", "record_id": decision["decision_id"], "path": decision["path"], "revision": self._file_hash(decision["path"]), "source_class": "recorded_decision", "availability": "supplied", "reported": False}
        for source in records.get("sources", []):
            if source.get("path") in scope["paths"] and source["source_id"] not in scope["excluded_reference_ids"]:
                references["source:" + source["source_id"]] = {"kind": "source", "record_id": source["source_id"], "path": source["path"], "revision": inputs["files"][source["path"]], "source_class": "supplied_source", "availability": "supplied", "reported": source.get("kind") in {"upload", "file", "document", "request"}}
        for entry in entries:
            if entry.get("path") in scope["paths"] and entry.get("reference_id"):
                key = "source:" + entry["reference_id"]
                references.setdefault(key, {"kind": "source", "record_id": entry["reference_id"], "path": entry["path"], "revision": entry.get("supplied_revision") or entry.get("revision"), "source_class": "supplied_context", "availability": "supplied", "reported": entry.get("role") in {"attachment", "active_file", "source_file"}})
        prior = self.workspace._document(matter_id, "workspace.md")["metadata"].get("problem_analysis_reference")
        prior_keys = []
        if prior and any(e.get("role") == "prior_generated_problem_analysis" and e.get("state") == "included" for e in entries) and not scope["excluded_paths"] and not scope["excluded_reference_ids"]:
            try:
                prior_keys = [q["key"] for q in self.load(matter_id, reference=prior)["questions"]]
            except (OSError, ValueError, KeyError, TypeError, YAMLError):
                pass
        return {"matter_id": matter_id, "captured_at": datetime.now(UTC).isoformat(), "inputs": inputs,
                "input_basis": {"scope": scope, "hashes": {k: digest(v) for k, v in inputs.items()}, "supplied_context_revision": digest(text)},
                "references": references, "prior_reference": prior, "prior_question_keys": prior_keys}

    def prior_context(self, matter_id, frozen):
        if frozen.get("excluded_paths") or frozen.get("excluded_reference_ids"):
            return "", "Prior breakdown omitted because source lineage may include excluded context."
        reference = self.workspace._document(matter_id, "workspace.md")["metadata"].get("problem_analysis_reference")
        if not reference:
            return "", ""
        try:
            analysis = self.load(matter_id, reference=reference)
            value = {"reference": reference, **{k: analysis[k] for k in ProblemAnalysisPayload.model_fields}}
            text = json.dumps(value, ensure_ascii=False)
            if len(text) > 12000:
                from app.agents.context_selection import pack
                compact = {"reference":reference, "detail_available":True}
                remaining = 7500
                for key, item in value.items():
                    if key == "reference": continue
                    selected, _ = pack(json.dumps(item,ensure_ascii=False),remaining)
                    if selected:
                        compact[key] = json.loads(selected)
                        remaining -= len(selected)
                return json.dumps(compact,ensure_ascii=False), "Compact prior generated analysis; retrieve omitted detail by reference."
            return text, "Generated analysis from the stated prior inputs; reassess it against current facts."
        except (OSError, ValueError, KeyError, TypeError, YAMLError):
            return "", "Prior breakdown unavailable."

    def _output(self, matter_id, path, run_id, revision):
        self.workspace._validate_path(matter_id, path)
        document = self.vault.read_markdown(path)
        meta = document["metadata"]
        if meta.get("matter_id") != matter_id or meta.get("run_id") != run_id:
            raise ValueError("Saved output belongs to another matter or run.")
        if meta.get("output_revision") != revision or digest(document["content"].strip()) != revision:
            raise ValueError("Saved output content changed.")
        return document

    def _fresh(self, matter_id, basis):
        current = self._inputs(matter_id, basis["scope"])
        return {k: digest(v) for k, v in current.items()} == basis["hashes"]

    @staticmethod
    def _reference(analysis):
        return {k: analysis[k] for k in ("analysis_id", "analysis_revision", "source_path", "output_revision", "run_id", "captured_at")}

    @serialized
    def publish(self, matter_id, *, path, run_id, output_revision, structure, capture, current_eligible=True):
        document = self._output(matter_id, path, run_id, output_revision)
        if not isinstance(capture, dict) or capture.get("matter_id") != matter_id:
            return {"state": "not_analyzed", "warnings": ["Captured problem inputs unavailable. Prior breakdown retained."]}
        try:
            value, references, warnings = normalize(structure, capture)
        except (ValueError, TypeError, KeyError):
            return {"state": "not_analyzed", "warnings": ["Problem breakdown could not be saved. Useful prose and prior breakdown retained."]}
        if not value["parts"] and not value["questions"]:
            return {"state": "not_analyzed", "warnings": []}
        analysis = {**value, "analysis_id": "PA-" + digest(matter_id + ":" + run_id)[:24],
                    "analysis_revision": digest({"payload": value, "basis": capture["input_basis"], "references": references, "prior_reference": capture.get("prior_reference")}),
                    "matter_id": matter_id, "run_id": run_id, "source_path": path, "output_revision": output_revision,
                    "captured_at": capture["captured_at"], "input_basis": deepcopy(capture["input_basis"]),
                    "prior_reference": capture.get("prior_reference"), "resolved_references": references, "warnings": warnings}
        old = document["metadata"].get("problem_analysis")
        if old:
            if old != analysis:
                raise ValueError("This run already has a different saved problem breakdown.")
        else:
            self.vault.update_markdown(path, metadata_updates={"problem_analysis": analysis})
        reference = self._reference(analysis)
        workspace = self.workspace._document(matter_id, "workspace.md")
        pointer = workspace["metadata"].get("problem_analysis_reference")
        eligible = current_eligible and self._fresh(matter_id, analysis["input_basis"]) and pointer in (capture.get("prior_reference"), reference)
        if eligible and pointer != reference:
            try:
                self.vault.write_markdown(workspace["path"], workspace["content"], {**workspace["metadata"], "problem_analysis_reference": reference})
            except OSError:
                return {"state": "historical", "analysis": analysis, "reference": reference, "saved": True, "projection_saved": False,
                        "warnings": [*warnings, "Breakdown saved. Current pointer could not be updated; retry publication."]}
        return {"state": self._saved_state(analysis) if eligible else "historical", "analysis": analysis, "reference": reference,
                "saved": True, "projection_saved": bool(eligible), "warnings": warnings if eligible else [*warnings, "Saved on earlier or scoped inputs; current breakdown retained."]}

    def load(self, matter_id, *, reference):
        keys = {"analysis_id", "analysis_revision", "source_path", "output_revision", "run_id", "captured_at"}
        if not isinstance(reference, dict) or set(reference) != keys or not all(isinstance(v, str) and v for v in reference.values()):
            raise ValueError("Invalid saved breakdown reference.")
        from app.models.problem_analysis import SavedProblemAnalysis
        document = self._output(matter_id, reference["source_path"], reference["run_id"], reference["output_revision"])
        analysis = SavedProblemAnalysis.model_validate(document["metadata"]["problem_analysis"]).model_dump(mode="json")
        if self._reference(analysis) != reference or analysis["matter_id"] != matter_id:
            raise ValueError("Problem breakdown reference does not match saved output.")
        value = {k: analysis[k] for k in ProblemAnalysisPayload.model_fields}
        if analysis["analysis_revision"] != digest({"payload": value, "basis": analysis["input_basis"], "references": analysis["resolved_references"], "prior_reference": analysis.get("prior_reference")}):
            raise ValueError("Saved problem breakdown changed.")
        return analysis

    @staticmethod
    def _saved_state(analysis):
        return "partial" if analysis["warnings"] or any(c["state"] == "unresolved" for c in analysis["coverage"]) else "saved"

    def resolve(self, matter_id):
        reference = None
        try:
            reference = self.workspace._document(matter_id, "workspace.md")["metadata"].get("problem_analysis_reference")
            if not reference:
                return {"state": "not_analyzed", "warnings": []}
            analysis = self.load(matter_id, reference=reference)
            fresh = self._fresh(matter_id, analysis["input_basis"]) and all(not r.get("file_revision") or self._file_hash(r["path"]) == r["file_revision"] for r in analysis["resolved_references"])
            return {"state": self._saved_state(analysis) if fresh else "needs_review", "analysis": analysis, "reference": reference,
                    "warnings": analysis["warnings"] if fresh else [*analysis["warnings"], "Matter inputs changed since this analysis. Reassess the breakdown."]}
        except (OSError, ValueError, KeyError, TypeError, YAMLError):
            return {"state": "missing", "reference": reference, "warnings": ["Saved breakdown unavailable. The matter answer remains available."]}
