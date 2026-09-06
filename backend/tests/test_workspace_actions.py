import asyncio
import pytest
from app.models.api import ChatResponse
from app.services.workspace_actions import WorkspaceActionsService
from app.services.workspace import digest
from app.services.workspace_evidence import WorkspaceEvidenceService

MATTER = "MAT-DEMO-BEACON"


def service(app, **kwargs):
    return WorkspaceActionsService(app.vault, app.matters, app.workspace, **kwargs)


@pytest.mark.asyncio
async def test_inquiry_uses_existing_durable_run_and_replay_key(app_context, monkeypatch):
    app = app_context
    async def run(request, **kwargs):
        return ChatResponse(reply="Useful explanation of the selected issue.")
    monkeypatch.setattr(app.runner, "run", run)
    s = service(app, run_starter=app.chat_runs.start)
    target = {"matter_id": MATTER}
    first = s.start(MATTER, "explain", target=target, source_action_key="inquiry:one")
    await app.chat_runs.wait(first["run_id"])
    retry = s.start(MATTER, "explain", target=target, source_action_key="inquiry:one")
    assert retry["run_id"] == first["run_id"]
    saved = app.chat_runs.get(MATTER, first["run_id"])
    assert saved["state"] == "completed"
    assert saved["response"]["reply"] == "Useful explanation of the selected issue."
    assert saved["request"]["expected_question_revision"] == app.workspace.business_question(MATTER)["revision"]


def test_prose_saved_before_bad_structure_and_late_scope_cannot_publish(app_context):
    app = app_context
    s = service(app)
    question = app.workspace.business_question(MATTER)
    baseline = app.workspace.source_revisions(MATTER)
    result = s.publish_result(MATTER, run_id="RUN-first", text="Useful conditional answer.", source_revisions=baseline,
                              expected_question_revision=question["revision"], structure="bad JSON")
    assert app.vault.read_markdown(result["path"])["content"].strip() == "Useful conditional answer."
    assert result["warnings"] and app.workspace.get(MATTER)["short_answer"] == "Useful conditional answer."
    app.workspace.change_business_question(MATTER, {"text": "Can we launch in Canada?", "expected_revision": question["revision"], "source_action_key": "scope:new"})
    late = s.publish_result(MATTER, run_id="RUN-late", text="Old scope response.", source_revisions=baseline,
                           expected_question_revision=question["revision"])
    assert late["historical"] and app.vault.exists(late["path"])
    assert app.workspace.get(MATTER)["run_id"] != "RUN-late"


def test_claims_link_real_answer_spans_and_preserve_missing_references(app_context):
    app = app_context
    source = WorkspaceEvidenceService.source_record({"source_id": "SRC-one", "path": "supplied.txt", "excerpt": "Actual passage", "support_state": "supplied"})
    result = service(app).publish_result(MATTER, run_id="RUN-claim", text="On the reported facts, launch is possible.",
        source_revisions=app.workspace.source_revisions(MATTER), expected_question_revision=app.workspace.business_question(MATTER)["revision"],
        sources=[source], structure={"claims": [{"text": "launch is possible", "source_ids": ["SRC-one", "SRC-missing"]}, {"text": "Never in answer", "source_ids": []}]})
    assert len(result["claims"]) == 1
    assert result["claims"][0]["claim_id"].startswith("CLM-")
    assert result["claims"][0]["evidence"][1]["support_state"] == "unknown"


def test_contribution_is_retry_safe_current_and_matter_local(app_context):
    app = app_context
    s = service(app)
    one = s.save_contribution(MATTER, text="For the board", source_message_id="msg1", source_action_key="contrib:1", kind="audience", expected_revision=digest([]))
    two = s.save_contribution(MATTER, text="For product", source_message_id="msg2", source_action_key="contrib:2", kind="audience", expected_revision=digest([one]))
    doc = app.workspace._document(MATTER, "workspace.md")
    assert doc["metadata"]["lawyer_contributions"][0]["state"] == "superseded"
    assert not app.workspace._document("MAT-DEMO-APEX", "workspace.md")["metadata"].get("lawyer_contributions")
    retried = s.save_contribution(MATTER, text="For product", source_message_id="msg2", source_action_key="contrib:2", kind="audience", expected_revision=digest([]))
    assert retried == two


def test_offer_and_decline_never_modify_artifact(app_context):
    from app.services.dossier import DossierService
    app = app_context
    s = service(app)
    path = app.workspace._path(MATTER, "custom-output/memo.md")
    app.vault.write_markdown(path, "The lawyer's existing draft.", {"record_type": "work_product", "matter_id": MATTER})
    before = app.vault.resolve(path).read_bytes()
    revision = DossierService._hash(app.vault.read_markdown(path)["content"])
    offer = {"offer_id": "OFF-one", "artifact_path": path, "base_revision": revision,
             "reason": "The launch date moved.", "change": {"reason": "The current deadline allows review.", "trigger_fact_ids": ["FACT-real"],
             "before_revision": revision, "affected_analysis": ["Launch timing"]}}
    s.offer_update(MATTER, offer)
    s.decline_offer(MATTER, "OFF-one", base_revision=revision)
    again = s.offer_update(MATTER, offer)
    assert again["state"] == "declined"
    assert app.vault.resolve(path).read_bytes() == before


def test_template_snapshot_is_used_without_reading_current_default(app_context):
    from app.models.workspace import TemplateUse
    class Registry:
        text = "Use three short sections."
        def resolve_template_use(self, template_id, *, output_type, overrides):
            return TemplateUse(template_id=template_id, output_type=output_type, revision="r1", content_hash="hash1",
                               instructions_snapshot=self.text, overrides=overrides)
    registry = Registry()
    frozen = WorkspaceActionsService.freeze_template(registry, "memo", output_type="memo", overrides={"length": "one page"})
    registry.text = "Use ten long sections."
    prompt = app_context.agent_context.build_system(app_context.agents.get("counsel-copilot"), template_use=frozen)
    assert "Use three short sections." in prompt and "one page" in prompt
    assert "Use ten long sections." not in prompt
    assert frozen["revision"] == "r1"


def test_useful_question_reuses_existing_answer(app_context):
    app = app_context
    s = service(app)
    revision = app.workspace.business_question(MATTER)["revision"]
    first = s.save_useful_question(MATTER, text="Who controls settlement?", consequence="Control affects the analysis.", expected_question_revision=revision)
    app.workspace.answer_question(MATTER, first["question_id"], {"expected_revision": first["source_revision"], "source_action_key": "answer:one",
        "state": "answered", "answer": "The bank controls settlement.", "source_message_id": "MSG-real"})
    reused = s.save_useful_question(MATTER, text="Who controls settlement?", consequence="Control affects the analysis.", expected_question_revision=revision)
    assert reused["question_id"] == first["question_id"] and reused["state"] == "answered"


def test_new_source_key_after_submission_makes_result_historical(app_context):
    app = app_context
    s = service(app)
    baseline = app.workspace.source_revisions(MATTER)
    revision = app.workspace.business_question(MATTER)["revision"]
    flow = app.workspace._path(MATTER, "flow.md")
    assert flow not in baseline
    app.vault.write_markdown(flow, "# New flow", {"matter_id": MATTER, "record_type": "flow"})
    result = s.publish_result(MATTER, run_id="RUN-before-flow", text="Answer from the earlier matter.",
                              source_revisions=baseline, expected_question_revision=revision)
    assert result["historical"] is True
    assert app.workspace.get(MATTER)["run_id"] != "RUN-before-flow"
    saved = app.vault.read_markdown(result["path"])["metadata"]
    assert saved["source_revisions"] == baseline and flow not in saved["source_revisions"]


def test_failed_output_save_retains_prose_with_truthful_receipt(app_context, monkeypatch):
    app = app_context
    baseline = app.workspace.source_revisions(MATTER)
    revision = app.workspace.business_question(MATTER)["revision"]
    def fail(*args, **kwargs):
        raise OSError("Disk failure")
    monkeypatch.setattr(app.vault, "write_markdown", fail)
    result = service(app).publish_result(MATTER, run_id="RUN-save-failure", text="Useful answer is still available.",
                                        source_revisions=baseline, expected_question_revision=revision)
    assert result["text"] == "Useful answer is still available."
    assert result["state"] == result["receipt"]["state"] == "not_saved"
    assert result["receipt"]["changed_links"] == []


def test_plain_answer_inline_source_ids_create_claim_links_without_json(app_context):
    app = app_context
    text = "The conditional answer follows the supplied policy. [source:SRC-policy]"
    source = WorkspaceEvidenceService.source_record({"source_id": "SRC-policy", "path": "policy.txt", "excerpt": "Exact policy text", "support_state": "supplied"})
    result = service(app).publish_result(MATTER, run_id="RUN-inline", text=text, sources=[source],
        source_revisions=app.workspace.source_revisions(MATTER), expected_question_revision=app.workspace.business_question(MATTER)["revision"])
    assert result["claims"][0]["text"] == text
    assert result["claims"][0]["evidence"][0]["source_id"] == "SRC-policy"
    assert result["claims"][0]["evidence"][0]["available_excerpt"] == "Exact policy text"


def test_plain_provider_transport_saves_claims_and_decision_paths_independently(app_context):
    app = app_context
    issue_id = app.workspace.issues(MATTER)[0]["issue_id"]
    frozen = app.agent_context.build_run_context(
        app.agents.get("counsel-copilot"), matter_id=MATTER,
        run_id="RUN-provider-boundary", target={"matter_id": MATTER, "issue_id": issue_id},
    )
    text = """The flow may be covered.

```claim-support
{"claims":[{"claim_id":"CLM-flow","text":"flow may be covered"}]}
```

```decision-paths
{"issue_analysis":{"issue_id":"%s","explanation":"Coverage changes notice duties.","tests":[{"test_id":"t1","title":"Coverage","condition_ids":["c1"],"claim_ids":["CLM-flow"]}],"conditions":[{"condition_id":"c1","question":"Is eligibility decided?","assessment":"unknown","claim_ids":["CLM-flow"]}],"options":[{"option_id":"yes","title":"Covered path","requirements":[{"condition_id":"c1","state":"met"}],"combination":"all"},{"option_id":"no","title":"Outside path","requirements":[{"condition_id":"c1","state":"not_met"}],"combination":"all"}]}}
```
""" % issue_id
    result = service(app).publish_result(
        MATTER, run_id="RUN-provider-boundary", text=text,
        source_revisions=app.workspace.source_revisions(MATTER),
        expected_question_revision=app.workspace.business_question(MATTER)["revision"],
        target={"matter_id": MATTER, "issue_id": issue_id}, frozen_context=frozen,
    )
    saved = app.vault.read_markdown(result["path"])
    assert saved["content"].strip() == "The flow may be covered."
    assert saved["metadata"]["claims"][0]["output_revision"] == result["output_revision"]
    assert saved["metadata"]["issue_analyses"][0]["tests"][0]["claim_ids"] == ["CLM-flow"]
    assert app.workspace._document(MATTER, "workspace.md")["metadata"]["issue_analyses"][issue_id]["run_id"] == "RUN-provider-boundary"


def test_malformed_paths_do_not_block_valid_claim_transport(app_context):
    app = app_context
    text = """A useful supported answer.

```decision-paths
{bad json}
```

```claim-support
{"claims":[{"claim_id":"CLM-useful","text":"useful supported answer"}]}
```
"""
    result = service(app).publish_result(
        MATTER, run_id="RUN-independent", text=text,
        source_revisions=app.workspace.source_revisions(MATTER),
        expected_question_revision=app.workspace.business_question(MATTER)["revision"],
    )
    assert result["claims"][0]["claim_id"] == "CLM-useful"
    assert "{bad json}" in app.vault.read_markdown(result["path"])["content"]


def test_same_output_replay_without_structure_keeps_saved_analysis(app_context):
    app = app_context
    issue_id = app.workspace.issues(MATTER)[0]["issue_id"]
    source = WorkspaceEvidenceService.source_record({
        "source_id": "SRC-replay", "path": "replay-policy.txt",
        "excerpt": "The policy supports stable prose.", "support_state": "supplied",
    })
    frozen = app.agent_context.build_run_context(
        app.agents.get("counsel-copilot"), matter_id=MATTER,
        run_id="RUN-replay-analysis", target={"matter_id": MATTER, "issue_id": issue_id},
    )
    paths = {"claims": [{"claim_id": "CLM-replay", "text": "Stable prose.",
                          "source_ids": ["SRC-replay"]}],
        "issue_analysis": {"issue_id": issue_id, "explanation": "A useful map.",
        "tests": [{"test_id": "t", "title": "Test", "condition_ids": ["c"]}],
        "conditions": [{"condition_id": "c", "question": "Which path?", "assessment": "unknown"}],
        "options": [{"option_id": "a", "title": "Path A", "requirements": [{"condition_id": "c", "state": "met"}], "combination": "all"},
                    {"option_id": "b", "title": "Path B", "requirements": [{"condition_id": "c", "state": "not_met"}], "combination": "all"}]}}
    first = service(app).publish_result(
        MATTER, run_id="RUN-replay-analysis", text="Stable prose.", structure=paths,
        sources=[source],
        source_revisions=app.workspace.source_revisions(MATTER),
        expected_question_revision=app.workspace.business_question(MATTER)["revision"],
        target={"matter_id": MATTER, "issue_id": issue_id}, frozen_context=frozen,
    )
    before_meta = app.vault.read_markdown(first["path"])["metadata"]
    service(app).publish_result(
        MATTER, run_id="RUN-replay-analysis", text="Stable prose.",
        source_revisions=app.workspace.source_revisions(MATTER),
        expected_question_revision=app.workspace.business_question(MATTER)["revision"],
        target={"matter_id": MATTER, "issue_id": issue_id}, frozen_context=frozen,
    )
    after_meta = app.vault.read_markdown(first["path"])["metadata"]
    assert after_meta["issue_analyses"] == before_meta["issue_analyses"]
    assert after_meta["sources"] == before_meta["sources"]
    assert after_meta["claims"] == before_meta["claims"]
    assert after_meta["claims"][0]["evidence"][0]["source_id"] == "SRC-replay"
