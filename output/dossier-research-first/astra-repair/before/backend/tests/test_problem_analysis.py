import json
from copy import deepcopy
import pytest
from app.services.problem_analysis import extract_problem_analysis
from app.services.problem_analysis_validation import normalize

MATTER = "MAT-DEMO-BEACON"


def payload():
    return {"schema_version": 1, "objective": "Improve support", "integrated_answer": "Separate internal evaluation and vendor reuse.",
            "parts": [{"key": "use", "label": "Vendor use", "description": "Use of chats", "category": "activity", "status": "unknown"}],
            "questions": [{"key": "purpose", "question": "Does the vendor reuse chats?", "why_it_matters": "Separate reuse may change the permitted pilot.", "kind": "characterization", "part_keys": ["use"], "state": "open", "priority": "decision_changing", "next_action": "ask_business", "next_action_reason": "Determine the vendor purpose."}]}


def capture(app):
    return app.agent_context.build_run_context(app.agents.get("counsel-copilot"), matter_id=MATTER)["problem_analysis_capture"]


def test_valid_transport_and_no_issue_capture(app_context):
    p = payload()
    text, parsed, warnings = extract_problem_analysis("Useful answer.\n\n```problem-analysis\n" + json.dumps(p) + "\n```")
    assert text == "Useful answer." and not warnings
    from app.models.api import MatterCreate
    matter = app_context.matters.create(MatterCreate(title="Synthetic no-issue intake", request_text="Assess a support pilot"))
    c = app_context.agent_context.build_run_context(app_context.agents.get("intake-agent"), matter_id=matter["matter_id"])["problem_analysis_capture"]
    assert c["inputs"]["issues"] == []
    assert normalize(parsed, c)[0]["questions"][0]["issue_id"] is None


@pytest.mark.parametrize("mutation", [
    lambda p: p.update(objective=" "), lambda p: p.update(server_path="foreign"),
    lambda p: p["parts"][0].update(status="verified"), lambda p: p["parts"].append(deepcopy(p["parts"][0])),
    lambda p: p["questions"][0].update(depends_on=["purpose"]),
    lambda p: p["questions"][0].update(part_keys=["absent"]),
    lambda p: p["questions"][0].update(issue_id="foreign"),
    lambda p: p.update(objective="x"*4001),
    lambda p: p["parts"][0].update(references=[{"kind":"fact", "record_id":"foreign"}]),
    lambda p: p.update(parts=p["parts"]*41),
])
def test_invalid_payload_cannot_change_records(app_context, mutation):
    c = capture(app_context)
    before = app_context.matter_records.get(MATTER)
    p = payload(); mutation(p)
    with pytest.raises(ValueError): normalize(p, c)
    assert app_context.matter_records.get(MATTER) == before


@pytest.mark.parametrize("body", ['{bad}', '{"schema_version":1,"objective":"one","objective":"two","integrated_answer":"answer"}', 'x'*200001])
def test_malformed_transport_preserves_prose(body):
    prose, parsed, warnings = extract_problem_analysis("Useful answer.\n\n```problem-analysis\n"+body+"\n```")
    assert prose == "Useful answer." and parsed is None and warnings


def test_unsupported_reported_downgrade(app_context):
    p=payload(); p["parts"][0]["status"]="reported"
    normalized, _, warnings=normalize(p,capture(app_context))
    assert normalized["parts"][0]["status"] == "assumed" and warnings


def test_capture_excludes_hidden_facts_and_output_only_writes(app_context):
    app=app_context; initial=capture(app)
    app.vault.write_markdown(app.workspace._path(MATTER), "", {"matter_id": MATTER, "snapshot":{"short_answer":"Generated orientation"}})
    assert capture(app)["input_basis"] == initial["input_basis"]
    fact=initial["inputs"]["facts"][0]
    frozen=app.agent_context.build_run_context(app.agents.get("counsel-copilot"),matter_id=MATTER,selections=[{"reference_id":fact["fact_id"],"selected":False}])
    c=frozen["problem_analysis_capture"]
    assert fact["fact_id"] not in {f["fact_id"] for f in c["inputs"]["facts"]}
    p=payload(); p["parts"][0]["references"]=[{"kind":"fact","record_id":fact["fact_id"]}]
    with pytest.raises(ValueError): normalize(p,c)


def publish(app, run="RUN-problem", c=None, p=None):
    from app.services.workspace import digest
    c = c or capture(app)
    path=app.workspace._path(MATTER, f"inquiries/{run}.md")
    if not app.vault.exists(path):
        app.vault.write_markdown(path, "Useful prose.", {"matter_id":MATTER,"run_id":run,"output_revision":digest("Useful prose."),"unrelated":"preserved"})
    return app.problem_analysis.publish(MATTER,path=path,run_id=run,output_revision=digest("Useful prose."),structure=p or payload(),capture=c)


def test_publication_retry_conflict_and_read_only_projection(app_context):
    app=app_context; c=capture(app); result=publish(app,c=c)
    assert result["state"] == "saved"
    reference=result["reference"]
    before=app.vault.read_text(reference["source_path"])
    assert publish(app,c=c) == result
    assert app.problem_analysis.load(MATTER,reference=reference) == result["analysis"]
    assert app.workspace.get(MATTER)["problem_analysis"]["state"] == "saved"
    app.index.rebuild()
    assert app.problem_analysis.resolve(MATTER)["analysis"] == result["analysis"]
    assert app.vault.read_text(reference["source_path"]) == before
    assert app.vault.read_markdown(reference["source_path"])["metadata"]["unrelated"] == "preserved"
    changed=payload();changed["objective"]="Changed objective"
    with pytest.raises(ValueError): publish(app,c=c,p=changed)
    assert app.vault.read_text(reference["source_path"]) == before


def test_late_and_changed_inputs_preserve_current(app_context):
    app=app_context; older=capture(app); newer=capture(app)
    current=publish(app,"RUN-newer",newer)
    assert publish(app,"RUN-older",older)["state"] == "historical"
    record=app.matter_records.get(MATTER);record["facts"][0]["text"] += " Corrected."
    app.matter_records._save(MATTER,record)
    assert app.problem_analysis.resolve(MATTER)["state"] == "needs_review"
    assert publish(app,"RUN-late-fact",newer)["state"] == "historical"
    assert app.problem_analysis.resolve(MATTER)["reference"] == current["reference"]


def test_missing_corrupt_and_lawyer_edited_output(app_context):
    app=app_context;result=publish(app);path=result["reference"]["source_path"]
    app.vault.write_markdown(path,"Lawyer changed prose.",app.vault.read_markdown(path)["metadata"])
    assert app.problem_analysis.resolve(MATTER)["state"] == "missing"
    app.vault.resolve(path).unlink()
    assert app.problem_analysis.resolve(MATTER)["state"] == "missing"


def test_pointer_failure_retry_only_updates_pointer(app_context, monkeypatch):
    app=app_context;c=capture(app);original=app.vault.write_markdown
    def fail(path,*args,**kwargs):
        if path == app.workspace._path(MATTER): raise OSError("synthetic pointer failure")
        return original(path,*args,**kwargs)
    monkeypatch.setattr(app.vault,"write_markdown",fail)
    result=publish(app,c=c)
    assert result["saved"] and not result["projection_saved"]
    before=app.vault.read_text(result["reference"]["source_path"])
    monkeypatch.setattr(app.vault,"write_markdown",original)
    assert publish(app,c=c)["projection_saved"]
    assert app.vault.read_text(result["reference"]["source_path"]) == before


def test_path_escape_and_cross_matter_output_rejected(app_context):
    from app.services.workspace import digest
    app=app_context;c=capture(app)
    for path in ("../escape.md", app.workspace._path("MAT-DEMO-ORBIT","dossier.md")):
        with pytest.raises((ValueError,KeyError)):
            app.problem_analysis.publish(MATTER,path=path,run_id="RUN",output_revision=digest("prose"),structure=payload(),capture=c)


def test_selected_source_edit_and_exclusion_of_prior_map(app_context):
    app=app_context; path=app.workspace._path(MATTER,"documents/synthetic-source.md")
    app.vault.write_markdown(path,"Fictional supplied rule version one.",{})
    frozen=app.agent_context.build_run_context(app.agents.get("counsel-copilot"),matter_id=MATTER,active_file=path)
    result=publish(app,c=frozen["problem_analysis_capture"])
    assert result["state"] == "saved"
    app.vault.write_markdown(path,"Fictional supplied rule version two.",{})
    assert app.problem_analysis.resolve(MATTER)["state"] == "needs_review"
    excluded=app.agent_context.build_run_context(app.agents.get("counsel-copilot"),matter_id=MATTER,selections=[{"reference_id":path,"path":path,"role":"source_file","selected":False}])
    assert "Separate internal evaluation and vendor reuse." not in excluded["context"]
    assert any(e["reference_id"] == "prior_problem_analysis" and e["state"] == "unavailable" for e in excluded["manifest"]["entries"])
