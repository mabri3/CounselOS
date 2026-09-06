"""Prepare explicit fictional records in the isolated acceptance vault only."""
import json, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))
from app.config import Settings
from app.runtime import AppContext
from app.models.api import DecisionCreate

env = json.loads((Path(__file__).parent / "environment.json").read_text())
assert "themis-matter-a-" in env["vault"]
from isolation import isolated_settings
app = AppContext(isolated_settings())
mid, base = env["matter_id"], env["matter_path"]
assert mid != "MAT-20260904-abf788"
v, ws = app.vault, app.workspace
issues = ws.issues(mid)
bq = ws.business_question(mid)
for qid, text, kind, links in [
    ("Q-DEMO-AUDIENCE", "Will the US launch include children under 13?", "factual", [issues[0]["issue_id"], issues[2]["issue_id"]]),
    ("Q-DEMO-IDENTIFIER", "Does this identifier use fit a permitted internal-operations purpose under the rule?", "legal", [issues[1]["issue_id"]]),
]:
    old = next((q for q in ws.questions(mid) if q["question_id"] == qid), None)
    if not old:
        ws.save_question(mid, {"question_id": qid, "business_question_id": bq["question_id"],
            "business_question_revision": bq["revision"], "issue_ids": links, "question_kind": kind,
            "text": text, "consequence": "The answer can change the required launch controls.", "state": "open"})
decision = app.decisions.record(DecisionCreate(matter_id=mid, title="Do not add advertising use to this launch",
    chosen_path="Keep advertising use outside the initial launch scope.",
    rationale="Product has not selected an advertising vendor. Any later use needs a separate review.",
    decision_maker="Alex Morgan", not_decided=["Audience coverage and parental consent remain open."],
    linked_paths=[base + "/documents/product-spec.md"], source_action_key="demo-no-advertising-decision"))
issues[4]["linked_decision_ids"] = [decision["decision_id"]]
issues[0]["claim_ids"] = ["CLM-DEMO-CHILD"]
issues[1]["claim_ids"] = ["CLM-DEMO-IDENTIFIER"]
ws.save_issues(mid, issues, expected_revision=ws.issues_revision(mid))
claims = []
for cid, text, locator, excerpt, application in [
    ("CLM-DEMO-CHILD", "The rule defines a child as an individual under 13.", "Child",
     "Child means an individual under the age of 13.",
     "Lumen proposes a commercial US online service. Audience age is unknown. This definition alone does not establish coverage or a consent duty."),
    ("CLM-DEMO-IDENTIFIER", "The rule includes certain persistent identifiers in personal information.", "Personal information (7)",
     "A persistent identifier that can be used to recognize a user over time and across different websites or online services.",
     "Lumen uses an identifier across sessions. Whether it meets the full definition and whether an exception applies remain legal questions."),
]:
    claims.append({"claim_id": cid, "text": text, "claim_revision": "demo-claim-1", "output_revision": "demo-output-1",
        "applicability": {"regulated_actor": "Lumen, proposed online service operator", "jurisdiction": "United States",
            "explanation": application}, "support_gap": "Coverage and exceptions require further analysis.",
        "evidence": [{"claim_id": cid, "claim_revision": "demo-claim-1", "output_revision": "demo-output-1",
            "source_id": "SRC-COPPA", "source_label": "16 CFR 312.2 — definitions", "locator": locator,
            "available_excerpt": excerpt, "support_state": "supplied", 
            "path": base + "/documents/coppa-definitions.md",
            "url": "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-312/section-312.2",
            "explanation": "The saved passage supports this narrow definition. It does not establish applicability."}]})
doc = ws._document(mid, "workspace.md")
doc["metadata"]["claims"] = claims
doc["metadata"]["snapshot"] = {**doc["metadata"].get("snapshot", {}),
    "short_answer": "Confirm the launch audience and identifier purpose before choosing the controls. A child is under 13 under the rule [source:SRC-COPPA|Child].",
    "qualification": "Working analysis. Audience coverage and the internal-operations question remain open.", "claims": claims}
doc["metadata"]["options"] = [{"option_id": "OPT-DEMO-NOTICE", "label": "Prepare parental notice and consent controls",
    "condition": "If the launch includes a covered child audience", "issue_ids": [issues[0]["issue_id"], issues[2]["issue_id"]]}]
v.write_markdown(doc["path"], doc["content"] or "# Workspace\n", doc["metadata"])
env["decision_id"] = decision["decision_id"]
(Path(__file__).parent / "environment.json").write_text(json.dumps(env, indent=2, default=str))
print("Enriched isolated matter", mid)
