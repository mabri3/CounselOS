"""Strict local links and captured canonical references; no model repair call."""
import json
from app.models.problem_analysis import ProblemAnalysisPayload


def normalize(structure, capture):
    if len(json.dumps(structure)) > 200000:
        raise ValueError("Problem breakdown exceeds transport limit.")
    value = ProblemAnalysisPayload.model_validate(structure).model_dump(mode="json")
    parts = {p["key"] for p in value["parts"]}
    questions = {q["key"] for q in value["questions"]}
    if len(parts) != len(value["parts"]) or len(questions) != len(value["questions"]):
        raise ValueError("Duplicate local keys.")
    def links(actual, known):
        if set(actual) - known:
            raise ValueError("Unknown local reference.")
    graph = {}
    for q in value["questions"]:
        links(q["part_keys"], parts)
        parents = [q["parent_key"]] if q["parent_key"] else []
        links(q["depends_on"] + parents, questions)
        graph[q["key"]] = q["depends_on"] + parents
    visiting, visited = set(), set()
    def visit(key):
        if key in visiting:
            raise ValueError("Cyclic question links.")
        if key in visited:
            return
        visiting.add(key)
        for target in graph[key]:
            visit(target)
        visiting.remove(key)
        visited.add(key)
    for key in graph:
        visit(key)
    for c in value["coverage"]:
        links(c["part_keys"], parts)
        links(c["question_keys"], questions)
    for a in value["alternative_paths"]:
        links(a["question_keys"], questions)
    prior_keys = set(capture.get("prior_question_keys", []))
    for c in value["changes"]:
        links(c["prior_question_keys"], prior_keys)
        links(c["current_question_keys"], questions)
    known = capture.get("references", {})
    resolved = {}
    warnings = []
    def resolve(ref):
        key = ref["kind"] + ":" + ref["record_id"]
        if key not in known:
            raise ValueError("Reference is outside captured permitted matter context.")
        resolved[key] = known[key]
        return known[key]
    for item in [*value["parts"], *value["questions"], *value["changes"]]:
        refs = [resolve(r) for r in item["references"]]
        if item.get("issue_id"):
            resolve({"kind": "issue", "record_id": item["issue_id"]})
        if item.get("status") == "reported" and not any(r.get("reported") for r in refs):
            item["status"] = "assumed"
            warnings.append(f"{item['label']}: retained as assumed because reported support was not supplied.")
    return value, list(resolved.values()), warnings
