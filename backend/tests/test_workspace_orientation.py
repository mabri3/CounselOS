from __future__ import annotations

from copy import deepcopy

from app.models.continuity import ActionActor
from app.services.workspace_orientation import WorkspaceOrientationService


MATTER = "MAT-DEMO-RELAY"
ACTOR = ActionActor(person_id="alex", display_name="Alex Morgan", mode="demo")


def snapshot(**changes):
    item = {
        "matter_id": MATTER,
        "revision": "basis-1",
        "question": {"question_id": "BQ-1", "revision": "question-1", "text": "Can we launch?"},
        "short_answer": "Launch only after the required controls are complete.",
        "answer_links": ["03_Matters/relay/analysis.md"],
        "stale": False,
        "receipts": [],
        "work_products": [],
        "recap": {"current_revision": "recap-1", "changes": [], "new_outputs": []},
    }
    item.update(changes)
    return item


def matter(**changes):
    item = {
        "matter_id": MATTER,
        "path": "03_Matters/relay",
        "status": "research",
        "legal_owner": "Jordan Lee",
        "legal_owner_id": "jordan",
        "next_action": "Review the matter.",
        "work_state": {"next_action": "Review the matter.", "execution_state": "not_running"},
    }
    item.update(changes)
    return item


def work_item(item_id="WI-1", **changes):
    item = {
        "work_item_id": item_id,
        "matter_id": MATTER,
        "path": f"03_Matters/relay/work-items/{item_id}.md",
        "title": "Confirm launch controls",
        "description": "Resolve the controls required before launch.",
        "status": "open",
        "priority": "high",
        "required": True,
        "owner": "Jordan Lee",
        "owner_id": "jordan",
    }
    item.update(changes)
    return item


def derive(*, snap=None, current_matter=None, items=(), **kwargs):
    return WorkspaceOrientationService.derive(
        snapshot=snap or snapshot(),
        matter=current_matter or matter(),
        work_items=list(items),
        actor=ACTOR,
        **kwargs,
    )


def test_full_answer_long_question_caveat_and_action_budget_are_preserved():
    question = "Should the product launch " + "with the supplied control " * 30 + "in the United States?"
    answer = (
        "The product can launch after the listed control is implemented.\n\n"
        "Working assumption: support access has not been confirmed. This could change the result."
    )
    result = derive(snap=snapshot(
        question={"question_id": "BQ-1", "revision": "question-1", "text": question},
        short_answer=answer,
    ), items=[work_item()])

    assert result["question_text"] == question
    assert result["question_is_preview"] is True
    assert result["question_preview"].endswith("…")
    assert result["answer"] == answer
    assert any("support access" in caveat for caveat in result["caveats"])
    assert result["primary_action"]["target"]["target_id"] == "WI-1"
    assert len(result["secondary_actions"]) == 2


def test_required_work_after_delivery_targets_the_actual_item_and_keeps_owner_truth():
    current = matter(
        status="respond",
        response_sent_at="2026-09-05T10:00:00Z",
        current_work_product_final_path="03_Matters/relay/work-product/final/FINAL-1.md",
        work_state={
            "next_action": "Complete required work before closing the matter.",
            "next_work_item_id": "WI-REQUIRED",
            "execution_state": "not_running",
        },
    )
    result = derive(
        current_matter=current,
        items=[
            work_item("WI-OPTIONAL", required=False, priority="urgent"),
            work_item("WI-REQUIRED", owner=None, owner_id=None),
        ],
    )

    action = result["primary_action"]
    assert action["target"]["kind"] == "work_item"
    assert action["target"]["target_id"] == "WI-REQUIRED"
    assert action["required"] is True
    assert action["owner_id"] is None
    assert action["owner_name"] is None
    assert action["actor_kind"] == "unknown"


def test_active_run_is_agent_work_with_its_real_run_target():
    result = derive(current_matter=matter(work_state={
        "next_action": "Wait for research.",
        "execution_state": "running",
        "active_run_id": "RUN-7",
    }), items=[work_item()])

    assert result["primary_action"]["state"] == "running"
    assert result["primary_action"]["actor_kind"] == "agent"
    assert result["primary_action"]["target"]["kind"] == "run"
    assert result["primary_action"]["target"]["target_id"] == "RUN-7"


def test_unreadable_agent_status_has_a_local_recovery_action_and_warning():
    result = derive(
        current_matter=matter(work_state={
            "next_action": "Review research.",
            "execution_state": "unknown",
            "active_run_id": None,
            "execution_note": "One research-run record could not be read.",
        }),
        warnings=["One research-run record could not be read."],
    )
    assert result["primary_action"]["state"] == "unavailable"
    assert result["primary_action"]["target"]["kind"] == "matter"
    assert result["primary_action"]["target"]["view"] == "discuss"
    assert result["warnings"] == ["One research-run record could not be read."]


def test_incoming_handoff_and_real_external_request_use_concrete_targets():
    handoff_action = {
        "action_id": "accept-handoff",
        "label": "Review incoming handoff",
        "reason": "Jordan asked Alex to review this work.",
        "state": "ready",
        "target": {"matter_id": MATTER, "kind": "work_item", "target_id": "WI-OLD"},
        "owner_id": "alex",
        "owner_name": "Alex Morgan",
        "actor_kind": "lawyer",
    }
    handoff = derive(team_items=[{
        "matter_id": MATTER, "queue": "my_work", "handoff_id": "HOF-1", "action": handoff_action,
    }])
    assert handoff["primary_action"]["target"]["kind"] == "handoff"
    assert handoff["primary_action"]["target"]["target_id"] == "HOF-1"

    waiting = derive(requests=[{
        "matter_id": MATTER, "request_id": "FR-1", "state": "requested_externally",
        "requested_person": "Priya", "path": "03_Matters/relay/continuity/fact-requests/FR-1.md",
        "requested_at": "2026-09-05T10:00:00Z",
    }])
    assert waiting["primary_action"]["label"] == "Waiting on Priya"
    assert waiting["primary_action"]["owner_name"] == "Priya"
    assert waiting["primary_action"]["actor_kind"] == "business"
    assert waiting["primary_action"]["target"]["target_id"] == "FR-1"


def test_prepared_request_does_not_claim_waiting_and_closed_has_no_fake_action():
    prepared = derive(requests=[{
        "matter_id": MATTER, "request_id": "FR-1", "state": "prepared", "requested_person": "Priya",
    }])
    assert prepared["primary_action"]["target"]["kind"] == "matter"
    closed = derive(current_matter=matter(status="closed", work_state={
        "next_action": "No active action.", "execution_state": "not_running",
    }))
    assert closed["primary_action"] is None


def test_reply_without_an_external_request_does_not_claim_waiting_on_contact():
    result = derive(requests=[{
        "matter_id": MATTER, "request_id": "FR-1", "state": "reply_saved", "requested_person": "Priya",
        "requested_at": None,
    }])
    assert result["primary_action"]["label"] != "Waiting on Priya"
    assert result["primary_action"]["target"]["kind"] == "matter"


def test_cross_matter_handoff_and_request_cannot_replace_current_required_work():
    unrelated_action = {
        "action_id": "accept-other-handoff",
        "label": "Review other handoff",
        "reason": "This belongs to another matter.",
        "state": "ready",
        "target": {"matter_id": "MAT-OTHER", "kind": "handoff", "target_id": "HOF-OTHER"},
        "owner_id": "alex",
        "owner_name": "Alex Morgan",
        "actor_kind": "lawyer",
    }
    result = derive(
        items=[work_item("WI-CURRENT")],
        team_items=[{
            "matter_id": "MAT-OTHER", "queue": "my_work",
            "handoff_id": "HOF-OTHER", "action": unrelated_action,
        }],
        requests=[{
            "matter_id": "MAT-OTHER", "request_id": "FR-OTHER",
            "state": "requested_externally", "requested_person": "Priya",
            "requested_at": "2026-09-05T10:00:00Z",
        }],
    )
    assert result["primary_action"]["target"]["kind"] == "work_item"
    assert result["primary_action"]["target"]["target_id"] == "WI-CURRENT"


def test_saved_advice_is_full_stale_and_provenanced_when_snapshot_answer_is_blank():
    advice = (
        "The launch can proceed only after support access is limited.\n\n"
        "Not examined: the vendor contract. That missing source could change this advice."
    )
    result = derive(
        snap=snapshot(short_answer="", answer_links=[]),
        saved_advice={
            "text": advice,
            "path": "03_Matters/relay/conversations/CONV-1.md",
            "revision": "MSG-1",
            "label": "Earlier saved assistant advice",
        },
        warnings=["The historical context manifest is unavailable."],
    )

    assert result["answer"] == advice
    assert result["answer_path"].endswith("CONV-1.md")
    assert result["answer_label"] == "Earlier saved assistant advice"
    assert result["answer_state"] == "stale"
    assert any("unknown question basis" in warning for warning in result["warnings"])
    assert any("vendor contract" in caveat for caveat in result["caveats"])
    assert "historical context manifest" in result["warnings"][0]


def test_unavailable_answer_has_real_discuss_recovery_and_never_fabricates_text():
    result = derive(snap=snapshot(short_answer="", answer_links=[]))
    assert result["answer"] == ""
    assert result["answer_state"] == "unavailable"
    assert any(action["target"]["view"] == "discuss" for action in result["secondary_actions"])


def test_optional_load_warning_does_not_erase_a_current_answer():
    result = derive(warnings=["Could not read this optional file."])
    assert result["answer"] == "Launch only after the required controls are complete."
    assert result["answer_state"] == "current"
    assert result["warnings"] == ["Could not read this optional file."]


def test_first_visit_is_one_honest_event_and_does_not_call_all_sources_new():
    changed = snapshot(recap={
        "current_revision": "recap-2",
        "changes": [
            {"path": "03_Matters/relay/facts.md", "before_revision": None, "after_revision": "facts-2"},
            {"path": "03_Matters/relay/issues.md", "before_revision": None, "after_revision": "issues-2"},
        ],
        "new_outputs": ["03_Matters/relay/research/RES-1.md"],
    })
    result = derive(snap=changed, seen=None)
    assert result["first_visit"] is True
    assert len(result["changes"]) == 1
    assert result["changes"][0]["basis"] == "first_visit"
    assert result["current_revision"] == "recap-2"


def test_hash_only_and_receipt_changes_use_meaningful_titles_and_complete_wording():
    snap = snapshot(
        receipts=[{
            "receipt_id": "R-1", "operation": "answer_question",
            "changed_links": ["03_Matters/relay/facts.md"],
        }],
        recap={
            "current_revision": "recap-2",
            "changes": [
                {"path": "03_Matters/relay/facts.md", "before_revision": "f1", "after_revision": "f2"},
                {"path": "03_Matters/relay/issues.md", "before_revision": "i1", "after_revision": "i2"},
            ],
            "new_outputs": [],
        },
    )
    result = derive(snap=snap, seen={
        "revision": "recap-1", "source_revisions": {
            "03_Matters/relay/facts.md": "f1", "03_Matters/relay/issues.md": "i1",
        },
    })

    assert result["first_visit"] is False
    assert result["seen_revision"] == "recap-1"
    assert result["changes"][0]["title"] == "Facts"
    assert result["changes"][0]["basis"] == "saved_receipt"
    assert result["changes"][0]["detail"] == "Saved action: answer question."
    assert result["changes"][1]["title"] == "Issue map"
    assert result["changes"][1]["basis"] == "hash_only"
    assert result["changes"][1]["detail"] == "Issue map changed; earlier text is unavailable."
    assert not any(change["title"].endswith(".md") for change in result["changes"])


def test_demo_seen_cursor_uses_current_sources_even_when_legacy_recap_has_no_changes():
    snap = snapshot(
        source_revisions={
            "03_Matters/relay/facts.md": "f2",
            "03_Matters/relay/issues.md": "i2",
        },
        recap={"current_revision": "recap-2", "changes": [], "new_outputs": []},
    )
    result = derive(snap=snap, seen={
        "revision": "recap-1",
        "source_revisions": {
            "03_Matters/relay/facts.md": "f1",
            "03_Matters/relay/issues.md": "i2",
        },
    })
    assert [(item["title"], item["basis"]) for item in result["changes"]] == [
        ("Facts", "hash_only"),
    ]


def test_projection_keeps_changes_after_the_three_item_default_display_budget():
    paths = [
        "facts.md", "issues.md", "matter.md", "dossier.md", "recommendations.md",
    ]
    snap = snapshot(recap={
        "current_revision": "recap-2",
        "changes": [
            {"path": f"03_Matters/relay/{path}", "before_revision": "old", "after_revision": "new"}
            for path in paths
        ],
        "new_outputs": [],
    })
    result = derive(snap=snap, seen={"revision": "recap-1"})
    assert len(result["changes"]) == 5


def test_matching_seen_revision_has_no_changes():
    result = derive(seen={"revision": "recap-1"})
    assert result["first_visit"] is False
    assert result["changes"] == []


def test_get_prefers_working_recommendation_and_performs_no_writes(app_context, monkeypatch):
    service = WorkspaceOrientationService(app_context.vault, app_context.matters, app_context.workspace)
    workspace_doc = app_context.workspace._document(MATTER, "workspace.md")
    metadata = deepcopy(workspace_doc["metadata"])
    metadata["snapshot"] = {**(metadata.get("snapshot") or {}), "short_answer": ""}
    app_context.vault.write_markdown(workspace_doc["path"], workspace_doc["content"], metadata)

    calls = []
    monkeypatch.setattr(app_context.vault, "write_markdown", lambda *args, **kwargs: calls.append(args) or "")
    monkeypatch.setattr(app_context.vault, "update_markdown", lambda *args, **kwargs: calls.append(args) or "")
    result = service.get(MATTER, actor=ACTOR)

    assert result["answer_label"] == "Current working recommendation"
    assert "Recommended path" in result["answer"]
    assert result["answer_path"].endswith("recommendations.md")
    assert calls == []


def test_get_uses_latest_useful_assistant_advice_and_skips_tool_error_text(app_context, monkeypatch):
    service = WorkspaceOrientationService(app_context.vault, app_context.matters, app_context.workspace)
    base = app_context.matters.matter_path(MATTER)
    app_context.vault.write_markdown(
        f"{base}/recommendations.md", "# Recommendations\n\nNo recommendation has been drafted yet.",
        {"matter_id": MATTER, "record_type": "recommendations"},
    )
    workspace_doc = app_context.workspace._document(MATTER, "workspace.md")
    workspace_metadata = deepcopy(workspace_doc["metadata"])
    workspace_metadata["snapshot"] = {**(workspace_metadata.get("snapshot") or {}), "short_answer": ""}
    app_context.vault.write_markdown(workspace_doc["path"], workspace_doc["content"], workspace_metadata)
    full_advice = (
        "Proceed only if support access is limited and logged.\n\n"
        "Working assumption: the support role still has production access."
    )
    conversation_path = f"{base}/conversations/CONV-legacy.md"
    app_context.vault.write_markdown(conversation_path, "# Matter chat", {
        "matter_id": MATTER,
        "conversation_id": "CONV-legacy",
        "record_type": "chat_transcript",
        "updated_at": "2026-09-05T12:00:00Z",
        "messages": [
            {"message_id": "MSG-1", "role": "assistant", "content": full_advice,
             "created_at": "2026-09-05T11:00:00Z"},
            {"message_id": "MSG-2", "role": "assistant", "content":
             "TOOL ERROR: Historical context manifest could not be loaded and the run failed.",
             "created_at": "2026-09-05T12:00:00Z"},
        ],
    })

    calls = []
    monkeypatch.setattr(app_context.vault, "write_markdown", lambda *args, **kwargs: calls.append(args) or "")
    monkeypatch.setattr(app_context.vault, "update_markdown", lambda *args, **kwargs: calls.append(args) or "")
    result = service.get(MATTER, actor=ACTOR)

    assert result["answer"] == full_advice
    assert result["answer_label"] == "Earlier saved assistant advice"
    assert result["answer_path"] == conversation_path
    assert "TOOL ERROR" not in result["answer"]
    assert calls == []


def test_get_skips_communication_runs_but_keeps_unknown_legacy_advice(app_context, monkeypatch):
    service = WorkspaceOrientationService(app_context.vault, app_context.matters, app_context.workspace)
    base = app_context.matters.matter_path(MATTER)
    app_context.vault.write_markdown(
        f"{base}/recommendations.md", "# Recommendations\n\nNo recommendation has been drafted yet.",
        {"matter_id": MATTER, "record_type": "recommendations"},
    )
    workspace_doc = app_context.workspace._document(MATTER, "workspace.md")
    workspace_metadata = deepcopy(workspace_doc["metadata"])
    workspace_metadata["snapshot"] = {**(workspace_metadata.get("snapshot") or {}), "short_answer": ""}
    app_context.vault.write_markdown(workspace_doc["path"], workspace_doc["content"], workspace_metadata)

    legal_advice = (
        "Proceed only if support access is limited and logged. "
        "Confirm the production access list before approval."
    )
    conversation_path = f"{base}/conversations/CONV-orientation.md"
    app_context.vault.write_markdown(conversation_path, "# Matter chat", {
        "matter_id": MATTER,
        "conversation_id": "CONV-orientation",
        "record_type": "chat_transcript",
        "updated_at": "2026-09-05T14:00:00Z",
        "messages": [
            {"message_id": "MSG-legal", "role": "assistant", "run_id": "RUN-legacy",
             "content": legal_advice, "created_at": "2026-09-05T11:00:00Z"},
            {"message_id": "MSG-handoff-user", "role": "user", "run_id": "RUN-handoff-local",
             "content": "Prepare handoff wording.", "created_at": "2026-09-05T12:00:00Z",
             "workspace_submission": {"workspace_action": "prepare_handoff"}},
            {"message_id": "MSG-handoff-local", "role": "assistant", "run_id": "RUN-handoff-local",
             "content": "Jordan, please take this matter and review the access controls before Friday.",
             "created_at": "2026-09-05T12:01:00Z"},
            {"message_id": "MSG-handoff-run", "role": "assistant", "run_id": "RUN-handoff-saved",
             "content": "Handoff brief: review the access controls, open questions, and launch deadline.",
             "created_at": "2026-09-05T13:01:00Z"},
        ],
    })
    app_context.vault.write_markdown(
        f"{base}/conversations/runs/RUN-handoff-saved.md", "# Chat run RUN-handoff-saved", {
            "record_type": "chat_run", "run_id": "RUN-handoff-saved", "matter_id": MATTER,
            "request": {"workspace_action": "prepare_handoff"},
        },
    )

    calls = []
    monkeypatch.setattr(app_context.vault, "write_markdown", lambda *args, **kwargs: calls.append(args) or "")
    monkeypatch.setattr(app_context.vault, "update_markdown", lambda *args, **kwargs: calls.append(args) or "")
    result = service.get(MATTER, actor=ACTOR)

    assert result["answer"] == legal_advice
    assert result["answer_path"] == conversation_path
    assert calls == []


def test_get_replaces_saved_service_placeholder_with_prior_advice_without_writes(app_context):
    service = WorkspaceOrientationService(app_context.vault, app_context.matters, app_context.workspace)
    base = app_context.matters.matter_path(MATTER)
    placeholder = (
        "The available actions are complete; use the trace and updated matter state "
        "as the working result."
    )
    app_context.vault.write_markdown(
        f"{base}/recommendations.md", "# Recommendations\n\nNo recommendation has been drafted yet.",
        {"matter_id": MATTER, "record_type": "recommendations"},
    )
    workspace_doc = app_context.workspace._document(MATTER, "workspace.md")
    workspace_metadata = deepcopy(workspace_doc["metadata"])
    workspace_metadata["snapshot"] = {
        **(workspace_metadata.get("snapshot") or {}),
        "short_answer": placeholder,
    }
    app_context.vault.write_markdown(workspace_doc["path"], workspace_doc["content"], workspace_metadata)

    prior_advice = "Do not launch."
    conversation_path = f"{base}/conversations/CONV-placeholder.md"
    app_context.vault.write_markdown(conversation_path, "# Matter chat", {
        "matter_id": MATTER,
        "conversation_id": "CONV-placeholder",
        "record_type": "chat_transcript",
        "updated_at": "2026-09-05T15:00:00Z",
        "messages": [
            {"message_id": "MSG-prior", "role": "assistant", "run_id": "RUN-prior",
             "content": prior_advice, "created_at": "2026-09-05T11:00:00Z"},
            {"message_id": "MSG-handoff-user", "role": "user", "run_id": "RUN-handoff",
             "content": "Prepare handoff wording.", "created_at": "2026-09-05T12:00:00Z",
             "workspace_submission": {"workspace_action": "prepare_handoff"}},
            {"message_id": "MSG-handoff", "role": "assistant", "run_id": "RUN-handoff",
             "content": "Jordan, please review the matter and open questions before Friday.",
             "created_at": "2026-09-05T12:01:00Z"},
            {"message_id": "MSG-placeholder", "role": "assistant", "run_id": "RUN-placeholder",
             "content": placeholder, "created_at": "2026-09-05T14:00:00Z"},
        ],
    })
    matter_directory = app_context.vault.resolve(base)
    before = {
        path.relative_to(matter_directory).as_posix(): path.read_bytes()
        for path in matter_directory.rglob("*") if path.is_file()
    }

    result = service.get(MATTER, actor=ACTOR)

    after = {
        path.relative_to(matter_directory).as_posix(): path.read_bytes()
        for path in matter_directory.rglob("*") if path.is_file()
    }
    assert result["answer"] == prior_advice
    assert result["answer_label"] == "Earlier saved assistant advice"
    assert result["answer_path"] == conversation_path
    assert result["answer_state"] == "stale"
    assert before == after


def test_get_attributes_current_answer_to_matching_saved_run_without_writes(app_context):
    service = WorkspaceOrientationService(app_context.vault, app_context.matters, app_context.workspace)
    base = app_context.matters.matter_path(MATTER)
    old_path = f"{base}/conversations/inquiries/RUN-old.md"
    current_path = f"{base}/conversations/inquiries/RUN-current.md"
    app_context.vault.write_markdown(old_path, "Old status-only output.", {
        "record_type": "workspace_inquiry", "matter_id": MATTER, "run_id": "RUN-old",
    })
    app_context.vault.write_markdown(current_path, "Current useful legal answer.", {
        "record_type": "workspace_inquiry", "matter_id": MATTER, "run_id": "RUN-current",
    })
    workspace_doc = app_context.workspace._document(MATTER, "workspace.md")
    workspace_metadata = deepcopy(workspace_doc["metadata"])
    workspace_metadata["snapshot"] = {
        **(workspace_metadata.get("snapshot") or {}),
        "short_answer": "Current useful legal answer.",
        "answer_links": [old_path, current_path],
        "run_id": "RUN-current",
    }
    app_context.vault.write_markdown(workspace_doc["path"], workspace_doc["content"], workspace_metadata)
    matter_directory = app_context.vault.resolve(base)
    before = {
        path.relative_to(matter_directory).as_posix(): path.read_bytes()
        for path in matter_directory.rglob("*") if path.is_file()
    }

    result = service.get(MATTER, actor=ACTOR)

    after = {
        path.relative_to(matter_directory).as_posix(): path.read_bytes()
        for path in matter_directory.rglob("*") if path.is_file()
    }
    assert result["answer"] == "Current useful legal answer."
    assert result["answer_label"] == "Current workspace answer"
    assert result["answer_path"] == current_path
    assert before == after


def test_closed_matter_has_no_primary_action_despite_historical_open_inputs():
    external = {"matter_id": MATTER, "request_id": "FR-old", "state": "requested_externally", "requested_person": "Sam", "requested_at": "2026-09-05T10:00:00Z"}
    handoff = {"matter_id": MATTER, "queue": "my_work", "handoff_id": "HOF-old", "action": {"label": "Review handoff"}}
    for extra in [
        {"requests": [external]},
        {"items": [work_item()]},
        {"team_items": [handoff]},
        {"requests": [external], "items": [work_item()], "team_items": [handoff]},
    ]:
        result = derive(snap=snapshot(stale=True), current_matter=matter(status="closed", work_state={"execution_state": "running", "active_run_id": "RUN-historical"}), **extra)
        assert result["primary_action"] is None
        assert result["answer"] == snapshot()["short_answer"]
        assert result["answer_state"] == "stale"
        assert {action["target"]["view"] for action in result["secondary_actions"]} == {"discuss", "draft"}
    # A live matter still exposes the real waiting request.
    assert derive(requests=[external])["primary_action"]["label"] == "Waiting on Sam"


def test_closed_orientation_get_keeps_saved_answer_and_open_request_bytes(app_context):
    ctx = app_context
    base = ctx.matters.matter_path(MATTER)
    answer = "Useful saved advice.\n\nAssumption: access remains restricted."
    workspace_doc = ctx.workspace._document(MATTER, "workspace.md")
    ctx.vault.write_markdown(workspace_doc["path"], workspace_doc["content"], {
        **workspace_doc["metadata"], "snapshot": {"short_answer": answer, "source_revisions": {"business_question": "earlier"}},
    })
    ctx.vault.update_markdown(f"{base}/matter.md", metadata_updates={"status": "closed", "closed_at": "2026-09-05T12:00:00Z", "closed_by": "Alex Morgan"})
    request_path = f"{base}/continuity/fact-requests/FR-historical.md"
    saved_request = {"matter_id": MATTER, "request_id": "FR-historical", "state": "partly_answered", "requested_person": "Sam", "requested_at": "2026-09-05T10:00:00Z"}
    ctx.vault.write_markdown(request_path, "Retain the unanswered follow-up as historical context.", {"record_type": "fact_request", "request": saved_request})
    before = {path: path.read_bytes() for path in ctx.vault.iter_files(base)}
    result = ctx.workspace_orientation.get(MATTER, actor=ACTOR, requests=[ctx.vault.read_markdown(request_path)["metadata"]["request"]])
    assert result["primary_action"] is None
    assert result["answer"] == answer and result["answer_state"] == "stale"
    assert len(result["secondary_actions"]) == 2
    assert {path: path.read_bytes() for path in ctx.vault.iter_files(base)} == before
