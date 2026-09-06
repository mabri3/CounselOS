import json
from app.services.workspace_actions import WorkspaceActionsService
from app.services.workspace import digest

MATTER = "MAT-DEMO-BEACON"


def build(app, **kwargs):
    return app.agent_context.build_run_context(app.agents.get("counsel-copilot"), matter_id=MATTER, run_id="RUN-context", **kwargs)


def test_context_uses_current_facts_and_persistent_preferences_beyond_history(app_context):
    app = app_context
    actions = WorkspaceActionsService(app.vault, app.matters, app.workspace)
    actions.save_preferences(MATTER, {"audience": "Payments board", "business_constraint": "No consumer credit"}, expected_revision=digest({}))
    record = app.workspace.records
    old = record.apply_update(MATTER, facts=[{"text": "Launch on 2026-10-01."}], summary="Old date")
    record.apply_update(MATTER, facts=[{"text": "Launch on 2026-11-03.", "supersedes": old["created"]["facts"][0]}], summary="Date correction")
    frozen = build(app)
    assert "Payments board" in frozen["context"] and "No consumer credit" in frozen["context"]
    assert "2026-11-03" in frozen["context"] and "2026-10-01" not in frozen["context"]
    assert '"verification_status": "reported"' in frozen["context"]
    assert "Current business question" in frozen["context"]
    assert frozen["publication_baseline"] == app.workspace.source_revisions(MATTER)


def test_negative_selection_blocks_active_file_attachment_editor_and_legacy_history(app_context):
    app = app_context
    path = "03_Matters/beacon-instant-onboarding/documents/secret.txt"
    app.vault.write_bytes(path, b"EXCLUDED-EXACT-PASSAGE")
    app.vault.write_markdown(path + ".extracted.md", "EXCLUDED-EXACT-PASSAGE")
    frozen = build(app, active_file=path, selections=[{"reference_id": "SRC-secret", "path": path, "role": "source", "selected": False}],
                   attachments=[{"source_id": "SRC-secret", "path": path + ".extracted.md"}],
                   target={"matter_id": MATTER, "artifact_path": path, "local_draft_snapshot": "EXCLUDED-EXACT-PASSAGE"})
    assert "EXCLUDED-EXACT-PASSAGE" not in frozen["context"]
    assert path in frozen["excluded_paths"] and path + ".extracted.md" in frozen["excluded_paths"]
    assert app.agent_context.filter_history([{"role": "user", "content": "EXCLUDED-EXACT-PASSAGE"}], frozen) == []
    assert app.vault.exists(path)
    assert any(e["state"] == "omitted" and not e["selected"] for e in frozen["manifest"]["entries"])


def test_manifest_records_actual_truncation_unavailable_and_selected_passage(app_context):
    app = app_context
    path = "03_Matters/beacon-instant-onboarding/documents/long.txt"
    app.vault.write_bytes(path, b"a" * 20000)
    result = build(app, budget=100000, selections=[{"reference_id": "long", "path": path, "role": "source"},
                                                 {"reference_id": "missing", "path": "absent.txt", "role": "source"}],
                   target={"matter_id": MATTER, "selected_range": {"start": 0, "end": 12, "text": "REAL PASSAGE"}})
    entries = {e["reference_id"]: e for e in result["manifest"]["entries"]}
    assert entries["long"]["state"] == "truncated" and entries["long"]["supplied_chars"] == 12000
    assert entries["missing"]["state"] == "unavailable"
    assert "REAL PASSAGE" in result["context"]
    assert entries["business_question"]["mandatory"]


def test_exclusion_normalizes_aliases_and_source_only_selection(app_context):
    app = app_context
    path = "03_Matters/beacon-instant-onboarding/documents/alias.txt"
    app.vault.write_bytes(path, b"ALIAS-SECRET")
    result = build(app, active_file="./" + path, selections=[{"reference_id": "SRC-alias", "role": "source", "selected": False}],
                   attachments=[{"source_id": "SRC-alias", "path": path}],
                   target={"matter_id": MATTER, "artifact_path": "./" + path, "local_draft_snapshot": "ALIAS-SECRET"})
    assert "ALIAS-SECRET" not in result["context"]
    assert path in result["excluded_paths"] and "SRC-alias" in result["excluded_reference_ids"]


def test_only_explicit_selected_enabled_notes_become_working_guidance(app_context):
    notes = [{"skill_id": "note-yes", "instructions": "Explain payment timing first.", "revision": "r1", "status": "available", "enabled": True},
             {"skill_id": "note-no", "instructions": "EXCLUDED NOTE", "revision": "r2", "status": "available", "enabled": True},
             {"skill_id": "note-disabled", "instructions": "DISABLED NOTE", "revision": "r3", "status": "disabled", "enabled": False}]
    frozen = build(app_context, applied_notes=notes, selections=[{"reference_id": "note-no", "role": "explicit_practice_note", "selected": False}])
    prompt = app_context.agent_context.build_system(app_context.agents.get("counsel-copilot"), practice_note_context=frozen["practice_note_context"])
    assert "Explain payment timing first." in prompt
    assert "EXCLUDED NOTE" not in prompt and "DISABLED NOTE" not in prompt


def test_excluded_answer_source_cannot_reenter_through_supporting_questions(app_context):
    app = app_context
    actions = WorkspaceActionsService(app.vault, app.matters, app.workspace)
    revision = app.workspace.business_question(MATTER)["revision"]
    question = actions.save_useful_question(MATTER, text="Who controls settlement?", consequence="Control affects the analysis.", expected_question_revision=revision)
    app.workspace.answer_question(MATTER, question["question_id"], {"expected_revision": question["source_revision"], "source_action_key": "answer:excluded",
        "state": "answered", "answer": "EXCLUDED-ANSWER-SECRET", "source_message_id": "MSG-X"})
    frozen = build(app, selections=[{"reference_id": "MSG-X", "role": "conversation", "selected": False}])
    assert "EXCLUDED-ANSWER-SECRET" not in frozen["context"]
    omitted = next(e for e in frozen["manifest"]["entries"] if e["reference_id"] == f"supporting_answer:{question['question_id']}")
    assert omitted["state"] == "omitted" and "source was excluded" in omitted["reason"]
