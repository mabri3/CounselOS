from __future__ import annotations

import pytest

from app.services.matter_records import MatterRecordService


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
