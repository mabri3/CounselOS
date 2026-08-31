from __future__ import annotations

import pytest

from app.models.api import ChatChoice, IntakeReportedFact, IntakeTurn, QuestionCard
from app.services.matter_records import MatterRecordService


def test_question_without_choices_becomes_write_in():
    question = QuestionCard(question_id="Q-EMPTY", text="What happened?", selection_mode="single")

    assert question.selection_mode == "free_text"


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
