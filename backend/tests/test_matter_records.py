from __future__ import annotations

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.models.api import ChatChoice, IntakeReportedFact, IntakeTurn, MatterCreate, QuestionCard
from app.routers import files
from app.services.matter_records import MatterRecordService


def test_question_without_choices_becomes_write_in():
    question = QuestionCard(question_id="Q-EMPTY", text="What happened?", selection_mode="single")

    assert question.selection_mode == "free_text"


def test_stopping_intake_on_new_matter_replaces_orientation_action(app_context):
    matter = app_context.matters.create(
        MatterCreate(title="Stop intake regression", request_text="Can this launch?")
    )

    app_context.matter_records.set_intake_state(matter["matter_id"], "complete")
    detail = app_context.matters.get(matter["matter_id"])

    assert detail["work_state"]["next_action"] == "Review the dossier and continue the legal work."
    orientation = next(
        item for item in detail["work_items"] if item["title"] == "Orient to the request"
    )
    assert orientation["status"] == "done"


def test_completed_intake_rejects_stale_card_action_without_mutating_chat(app_context):
    conversation = app_context.chat_history.append(
        "MAT-DEMO-BEACON",
        None,
        role="assistant",
        content="One last question.",
        cards=[{
            "type": "question",
            "question_id": "Q-STALE",
            "text": "Who owns the launch?",
            "selection_mode": "free_text",
            "choices": [],
        }],
        conversation_kind="intake",
        intake_state="active",
        active_agent_id="intake-agent",
    )
    app_context.chat_history.update_state(
        "MAT-DEMO-BEACON",
        conversation["conversation_id"],
        intake_state="complete",
        active_agent_id="counsel-copilot",
    )

    with pytest.raises(ValueError, match="Intake is complete"):
        app_context.chat_history.append(
            "MAT-DEMO-BEACON",
            conversation["conversation_id"],
            role="user",
            content="Legal owns it.",
            card_action={"card_id": "Q-STALE", "action": "answer", "values": ["Legal"]},
        )

    saved = app_context.chat_history.get(
        "MAT-DEMO-BEACON", conversation["conversation_id"]
    )
    assert len(saved["messages"]) == 1


def test_explicit_intake_answer_projects_its_named_matter_field(app_context):
    result = app_context.matter_records.record_intake_answers(
        "MAT-DEMO-BEACON",
        [{
            "question_id": "intake-recovery-jurisdiction",
            "question": "Which countries or regions are in scope?",
            "answer": "United States only",
            "values": ["United States only"],
            "status": "answered",
            "record_target": "jurisdiction_scope",
        }],
        source_id="MSG-JURISDICTION",
        source_action_key="chat:jurisdiction",
    )

    assert result["changed"] is True
    assert app_context.matters.get("MAT-DEMO-BEACON")["jurisdiction_scope"] == [
        "United States only"
    ]
    assert app_context.matter_records.get("MAT-DEMO-BEACON")["intake_answers"][-1][
        "record_target"
    ] == "jurisdiction_scope"


def test_intake_turn_does_not_save_model_paraphrase_for_saved_answer_source(app_context):
    source_id = "MSG-EXACT-ANSWER"
    app_context.matter_records.record_intake_answers(
        "MAT-DEMO-BEACON",
        [{
            "question_id": "Q-TIMING",
            "question": "When is the launch?",
            "answer": "Friday",
            "values": ["Friday"],
            "status": "answered",
            "record_target": "fact",
        }],
        source_id=source_id,
        source_action_key="chat:exact-answer",
    )

    app_context.matter_records.apply_intake_turn(
        "MAT-DEMO-BEACON",
        IntakeTurn(
            working_ask="Assess the launch.",
            reported_facts=[IntakeReportedFact(
                statement="The launch will definitely occur on Friday."
            )],
            intake_state="active",
            source_action_key="chat:model-follow-up",
        ),
        source_id=source_id,
    )

    record = app_context.matter_records.get("MAT-DEMO-BEACON")
    assert any(
        answer["question"] == "When is the launch?" and answer["answer"] == "Friday"
        for answer in record["intake_answers"]
    )
    assert "The launch will definitely occur on Friday." not in {
        fact["text"] for fact in record["facts"]
    }


def test_intake_repair_merges_semantic_question_and_exact_assumption_duplicates(app_context):
    record = app_context.matter_records.get("MAT-DEMO-BEACON")
    first_assumption = {
        "assumption_id": "ASM-FIRST",
        "text": "The provider can process the last four digits.",
        "reason": "Needed to continue",
        "material": True,
        "status": "open",
        "created_at": None,
        "resolved_at": None,
        "withdrawn_at": None,
        "action_id": None,
    }
    record["assumptions"].extend([
        first_assumption,
        {**first_assumption, "assumption_id": "ASM-DUPLICATE"},
    ])
    record["open_questions"] = [
        "Whether the account is subject to a Customer Identification Program under the BSA and whether the entity is a bank, broker-dealer, FCM, mutual fund, or money services business.",
        "Is the account subject to a Customer Identification Program under the BSA and is the entity a bank, broker-dealer, futures commission merchant, mutual fund, or money services business?",
    ]
    app_context.matter_records._save("MAT-DEMO-BEACON", record)

    changed = app_context.matter_records.deduplicate_intake_record("MAT-DEMO-BEACON")
    saved = app_context.matter_records.get("MAT-DEMO-BEACON")

    assert changed
    assert len(saved["open_questions"]) == 1
    active_matches = [
        item for item in saved["assumptions"]
        if item.get("status") == "open"
        and item.get("text") == first_assumption["text"]
    ]
    assert len(active_matches) == 1


def test_final_intake_is_monotonic_and_retry_key_is_idempotent(app_context):
    service = app_context.matter_records
    final = IntakeTurn(
        working_ask="Decide whether the launch can proceed.",
        reported_facts=[IntakeReportedFact(statement="The launch is Friday.")],
        intake_state="complete",
        source_action_key="chat:RUN-1:tool-1",
    )

    first = service.apply_intake_turn("MAT-DEMO-BEACON", final, source_id="MSG-FINAL")
    retry = service.apply_intake_turn("MAT-DEMO-BEACON", final, source_id="MSG-FINAL")
    stale = service.apply_intake_turn(
        "MAT-DEMO-BEACON",
        IntakeTurn(
            working_ask="Reopen intake.",
            next_questions=[QuestionCard(
                question_id="Q-STALE",
                text="Can this old question become active again?",
                selection_mode="free_text",
            )],
            intake_state="active",
            source_action_key="chat:RUN-OLD:tool-1",
        ),
        source_id="MSG-STALE",
    )

    saved = service.get("MAT-DEMO-BEACON")
    assert first.intake_state == retry.intake_state == stale.intake_state == "complete"
    assert retry.changed_paths == []
    assert stale.changed_paths == []
    assert stale.questions == []
    assert len([item for item in saved["facts"] if item["text"] == "The launch is Friday."]) == 1
    assert len([
        action for action in saved["actions"]
        if action.get("source_action_key") == "chat:RUN-1:tool-1"
    ]) == 1
    with pytest.raises(ValueError, match="cannot become active"):
        service.set_intake_state("MAT-DEMO-BEACON", "active")


def test_new_matter_has_structured_participants(app_context):
    matter = app_context.matters.create(MatterCreate(
        title="Participant structure",
        request_text="Assess the launch.",
        requester="Avery Requester",
        legal_owner="Lee Lawyer",
        business_owner="Bailey Business",
    ))

    assert matter["participants"] == [
        {"name": "Avery Requester", "role": "requester"},
        {"name": "Lee Lawyer", "role": "legal_owner"},
        {"name": "Bailey Business", "role": "business_owner"},
    ]
    saved = app_context.vault.read_markdown(f"{matter['path']}/participants.md")
    assert saved["metadata"]["record_type"] == "participants"
    assert saved["metadata"]["participants"] == matter["participants"]


def test_intake_question_set_keeps_model_priority_order(app_context):
    service = MatterRecordService(app_context.vault, app_context.matters)
    turn = IntakeTurn(
        working_ask="Decide whether the pilot can launch.",
        next_questions=[
            QuestionCard(question_id="Q-HIGH", text="What fact changes the launch decision most?", selection_mode="free_text"),
            QuestionCard(question_id="Q-NEXT", text="Who owns the control?", selection_mode="free_text"),
        ],
    )

    result = service.apply_intake_turn("MAT-DEMO-BEACON", turn)

    assert [question.question_id for question in result.questions] == ["Q-HIGH", "Q-NEXT"]
    matter = app_context.matters.get("MAT-DEMO-BEACON")
    matter_record = app_context.vault.read_markdown(f"{matter['path']}/matter.md")
    assert matter_record["metadata"]["next_action"] == "What fact changes the launch decision most?"


def test_records_keep_sources_support_and_grouped_withdrawal(app_context):
    service = MatterRecordService(app_context.vault, app_context.matters)
    action = service.apply_update(
        "MAT-DEMO-BEACON",
        sources=[{"source_id": "SRC-FILE-1", "kind": "file", "label": "Plan", "path": "plan.md", "content_hash": "abc"}],
        facts=[{"fact_id": "FACT-1", "text": "Launch is planned for Friday.", "source_ids": ["SRC-FILE-1"]}],
        support=[{"fact_id": "FACT-1", "source_id": "SRC-FILE-1", "relationship": "qualify", "statement": "Timing can move."}],
        assumptions=[{"text": "The launch is US-only."}],
    )

    saved = service.get("MAT-DEMO-BEACON")
    assert any(item["fact_id"] == "FACT-1" for item in saved["facts"])
    assert saved["support"][0]["relationship"] == "qualify"
    assert saved["assumptions"][0]["status"] == "open"

    service.withdraw_action("MAT-DEMO-BEACON", action["action_id"])
    withdrawn = service.get("MAT-DEMO-BEACON")
    assert next(item for item in withdrawn["facts"] if item["fact_id"] == "FACT-1")["status"] == "withdrawn"
    assert withdrawn["sources"][0]["withdrawn_at"]
    assert withdrawn["actions"][0]["status"] == "withdrawn"
    assert app_context.vault.exists("03_Matters/beacon-instant-onboarding/events")


def test_correction_supersedes_and_undo_restores_prior_fact(app_context):
    service = MatterRecordService(app_context.vault, app_context.matters)
    service.apply_update("MAT-DEMO-BEACON", facts=[{"fact_id": "FACT-OLD", "text": "Launch is Friday."}])
    correction = service.apply_update(
        "MAT-DEMO-BEACON", facts=[{"fact_id": "FACT-NEW", "text": "Launch is Monday.", "supersedes": "FACT-OLD"}]
    )
    assert next(item for item in service.get("MAT-DEMO-BEACON")["facts"] if item["fact_id"] == "FACT-OLD")["status"] == "superseded"
    service.withdraw_action("MAT-DEMO-BEACON", correction["action_id"])
    facts = service.get("MAT-DEMO-BEACON")["facts"]
    assert next(item for item in facts if item["fact_id"] == "FACT-OLD")["status"] == "active"
    assert next(item for item in facts if item["fact_id"] == "FACT-NEW")["status"] == "withdrawn"


def test_assumption_and_conflict_need_explicit_user_resolution(app_context):
    service = MatterRecordService(app_context.vault, app_context.matters)
    update = service.apply_update(
        "MAT-DEMO-BEACON",
        facts=[{"fact_id": "FACT-A", "text": "Launch is Friday."}, {"fact_id": "FACT-B", "text": "Launch is Monday."}],
        assumptions=[{"assumption_id": "ASM-1", "text": "The launch is US-only."}],
    )
    resolved = service.resolve_assumption("MAT-DEMO-BEACON", "ASM-1", "confirm", responder="lawyer")
    assert resolved["status"] == "confirmed"
    assert resolved["resulting_fact_id"]

    conflict = service.create_conflict("MAT-DEMO-BEACON", fact_ids=["FACT-A", "FACT-B"], question="Which date controls?")
    with pytest.raises(ValueError, match="explicit user"):
        service.resolve_conflict("MAT-DEMO-BEACON", conflict["conflict_id"], "Friday", responder="assistant")
    result = service.resolve_conflict("MAT-DEMO-BEACON", conflict["conflict_id"], "Monday controls", responder="lawyer")
    assert result["status"] == "resolved"
    assert update["created"]["facts"] == ["FACT-A", "FACT-B"]


def test_save_facts_from_chat_excludes_questions_hypotheticals_and_assistant_analysis(app_context):
    service = MatterRecordService(app_context.vault, app_context.matters)
    service.save_facts_from_messages("MAT-DEMO-BEACON", [
        {"role": "user", "content": "The launch is Friday."},
        {"role": "user", "content": "What is the risk?"},
        {"role": "user", "content": "What if we launch Monday"},
        {"role": "assistant", "content": "The product probably uses biometrics."},
    ], conversation_id="CONV-1")
    facts = service.get("MAT-DEMO-BEACON")["facts"]
    assert "The launch is Friday." in [item["text"] for item in facts]
    assert "What is the risk?" not in [item["text"] for item in facts]


def test_file_source_requires_version(app_context):
    service = MatterRecordService(app_context.vault, app_context.matters)
    with pytest.raises(ValueError, match="version or content hash"):
        service.apply_update("MAT-DEMO-BEACON", sources=[{"kind": "file", "path": "plan.md"}])


def test_existing_markdown_facts_survive_first_structured_update(app_context):
    service = MatterRecordService(app_context.vault, app_context.matters)
    before = service.get("MAT-DEMO-BEACON")
    assert any(item["text"] == "The change applies only to the low-risk segment." for item in before["facts"])
    service.save_facts_from_source(
        "MAT-DEMO-BEACON", source_id="SRC-COMPANY", source_kind="company_profile",
        source_label="company profile", statements=["The company operates in the US."], version="v1",
    )
    after = service.get("MAT-DEMO-BEACON")
    texts = [item["text"] for item in after["facts"]]
    assert "The change applies only to the low-risk segment." in texts
    assert "The company operates in the US." in texts


def test_intake_turn_links_request_records_and_creates_provisional_dossier(app_context):
    service = MatterRecordService(app_context.vault, app_context.matters)
    request = app_context.vault.read_markdown(
        "03_Matters/beacon-instant-onboarding/request.md"
    )
    request_id = request["metadata"]["request_id"]
    turn = IntakeTurn(
        working_ask="Decide whether the limited biometric pilot can launch.",
        reported_facts=[
            IntakeReportedFact(statement="The pilot is limited to a low-risk segment."),
        ],
        issues=["Biometric notice and consent", "Retention controls"],
        assumptions=["The pilot remains limited to the United States."],
        material_missing_facts=["Which states are in scope?"],
        human_questions=["Who owns the launch decision?"],
        next_question=QuestionCard(
            question_id="intake-jurisdictions",
            text="Which states are in scope?",
            reason="State law can change the notice and consent analysis.",
            choices=[
                ChatChoice(value="california", label="California"),
                ChatChoice(value="other", label="Something else"),
                ChatChoice(value="skip", label="Skip"),
                ChatChoice(value="stop", label="No more questions"),
            ],
        ),
    )

    result = service.apply_intake_turn(
        "MAT-DEMO-BEACON", turn, source_id=request_id, expected_dossier_hash=None
    )

    saved = service.get("MAT-DEMO-BEACON")
    fact = next(
        item for item in saved["facts"]
        if item["text"] == "The pilot is limited to a low-risk segment."
    )
    assert fact["source_ids"] == [request_id]
    assert saved["working_ask"] == turn.working_ask
    assert saved["issues"] == turn.issues
    assert saved["open_questions"] == [
        "Which states are in scope?",
        "Who owns the launch decision?",
    ]
    assert result.question == turn.next_question
    assert result.matter_update is not None

    dossier = app_context.dossiers.get("MAT-DEMO-BEACON")["content"]
    for heading in (
        "Matter summary", "Decision question", "Material facts", "Assumptions",
        "Issues and workstreams", "Open questions", "Research and source support",
        "Options or working recommendation", "Next counsel action", "Work product links",
    ):
        assert f"## {heading}" in dossier


def test_repeated_intake_fact_adds_source_support_without_duplicate_fact(app_context):
    service = MatterRecordService(app_context.vault, app_context.matters)
    turn = IntakeTurn(
        working_ask="Confirm launch timing.",
        reported_facts=[IntakeReportedFact(statement="Launch is planned for Friday.")],
    )
    service.apply_intake_turn("MAT-DEMO-BEACON", turn, source_id="MSG-ONE")
    service.apply_intake_turn("MAT-DEMO-BEACON", turn, source_id="MSG-TWO")

    saved = service.get("MAT-DEMO-BEACON")
    facts = [item for item in saved["facts"] if item["text"] == "Launch is planned for Friday."]
    assert len(facts) == 1
    supports = [item for item in saved["support"] if item["fact_id"] == facts[0]["fact_id"]]
    assert {item["source_id"] for item in supports} == {"MSG-ONE", "MSG-TWO"}


def test_direct_structured_record_edits_reconcile_visible_and_typed_state(app_context):
    matter = app_context.matters.get("MAT-DEMO-BEACON")
    facts_path = f'{matter["path"]}/facts.md'
    issues_path = f'{matter["path"]}/issues.md'
    participants_path = f'{matter["path"]}/participants.md'

    facts_content = "# Known Facts\n\n- New visible lawyer fact.\n\n## Assumptions\n\n- [Assumption] Launch stays in the US.\n"
    app_context.vault.update_markdown(facts_path, content=facts_content)
    app_context.matter_records.reconcile_edited_document(facts_path, actor="Brian Harris")
    facts = app_context.matter_records.get("MAT-DEMO-BEACON")
    assert [item["text"] for item in facts["facts"] if item["status"] == "active"] == ["New visible lawyer fact."]
    assert [item["text"] for item in facts["assumptions"] if item["status"] == "open"] == ["Launch stays in the US."]

    app_context.vault.update_markdown(issues_path, content="# Issues and workstreams\n\n- Privacy notice\n- Retention\n")
    app_context.matter_records.reconcile_edited_document(issues_path, actor="Brian Harris")
    assert app_context.matter_records.get("MAT-DEMO-BEACON")["issues"] == ["Privacy notice", "Retention"]

    app_context.vault.update_markdown(participants_path, content="# Participants\n\n- **Alex Kim** — product owner\n")
    app_context.matter_records.reconcile_edited_document(participants_path, actor="Brian Harris")
    assert app_context.matters.get("MAT-DEMO-BEACON")["participants"] == [
        {"name": "Alex Kim", "role": "product_owner"}
    ]


def test_generic_file_api_reconciles_a_structured_fact_edit(app_context):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(files.router, prefix="/api")
    client = TestClient(app)
    path = "03_Matters/beacon-instant-onboarding/facts.md"
    loaded = client.get("/api/files", params={"path": path}).json()

    response = client.put("/api/files", params={"path": path}, json={
        "content": "# Known Facts\n\n- API-edited fact.\n\n## Assumptions\n\nNo open assumptions.\n",
        "metadata": loaded["metadata"],
    })

    assert response.status_code == 200
    record = app_context.matter_records.get("MAT-DEMO-BEACON")
    assert [item["text"] for item in record["facts"] if item["status"] == "active"] == [
        "API-edited fact."
    ]


def test_direct_filesystem_fact_edit_is_the_resolved_read_value(app_context):
    service = app_context.matter_records
    service.apply_update(
        "MAT-DEMO-BEACON", facts=[{"text": "Old structured fact."}], actor="assistant"
    )
    path = "03_Matters/beacon-instant-onboarding/facts.md"
    app_context.vault.update_markdown(
        path,
        content="# Known Facts\n\n- New filesystem fact.\n\n## Assumptions\n\nNo open assumptions.\n",
    )

    record = service.get("MAT-DEMO-BEACON")

    assert [item["text"] for item in record["facts"] if item["status"] == "active"] == [
        "New filesystem fact."
    ]


def test_required_open_questions_include_exact_work_item_identity(app_context):
    matter = app_context.matters.get("MAT-DEMO-BEACON")
    identified = matter["orientation"]["open_question_items"]

    assert identified
    assert [item["text"] for item in identified] == matter["orientation"]["open_questions"][:4]
    for item in identified:
        if item["work_item_id"]:
            assert item["id"] == item["work_item_id"]
            assert any(work["work_item_id"] == item["work_item_id"] for work in matter["work_items"])


def test_intake_update_preserves_lawyer_edit_as_review_draft(app_context):
    service = app_context.dossiers
    matter_id = "MAT-DEMO-BEACON"
    service.update_from_intake(
        matter_id,
        working_ask="Decide whether to launch.",
        facts=[], assumptions=[], issues=[], open_questions=[], orientation="",
        expected_hash=None,
    )
    current = service.get(matter_id)
    assert current is not None
    edited = current["content"] + "\n## Lawyer note\n\nKeep this judgment call.\n"
    app_context.vault.update_markdown(current["path"], content=edited)

    result = service.update_from_intake(
        matter_id,
        working_ask="Decide whether to launch Friday.",
        facts=[], assumptions=[], issues=[], open_questions=[], orientation="",
        expected_hash=service.content_hash(matter_id),
    )

    assert result["state"] == "review_required"
    assert "Keep this judgment call." in service.get(matter_id)["content"]
    assert "Keep this judgment call." in app_context.vault.read_markdown(result["revision_path"])["content"]
