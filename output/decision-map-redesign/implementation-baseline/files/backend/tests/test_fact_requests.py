from __future__ import annotations

import pytest

from app.models.continuity import ActionActor
from app.services.fact_requests import FactRequestService
from app.services.workspace import WorkspaceConflict


MATTER = "MAT-DEMO-BEACON"


@pytest.fixture()
def actor() -> ActionActor:
    return ActionActor(person_id="alex", display_name="Alex Morgan", mode="demo")


@pytest.fixture()
def service(app_context) -> FactRequestService:
    return FactRequestService(
        app_context.vault, app_context.matters,
        app_context.workspace, app_context.matter_records,
    )


@pytest.fixture()
def question(service) -> dict:
    business = service.workspace.business_question(MATTER)
    return service.workspace.save_question(MATTER, {
        "question_id": "WQ-fact-request",
        "business_question_id": business["question_id"],
        "business_question_revision": business["revision"],
        "text": "Who controls settlement, and when does the launch start?",
    })


def create_request(service, actor, question, *, key="request:create") -> dict:
    return service.create(MATTER, {
        "question_id": question["question_id"],
        "expected_question_revision": question["source_revision"],
        "business_question_revision": question["business_question_revision"],
        "wording": "Please confirm who controls settlement and the launch date.",
        "requested_person": "Bailey Business",
        "due_at": None,
        "source_action_key": key,
    }, actor=actor)["request"]


def save_reply(service, actor, request, *, key="reply:save", text="The bank controls settlement. Launch timing is still open.") -> dict:
    return service.save_reply(MATTER, request["request_id"], {
        "expected_revision": request["revision"],
        "text": text,
        "reported_speaker": "Bailey Business",
        "reported_at": "2026-09-04",
        "source_action_key": key,
    }, actor=actor)["request"]


def record_command(request, question, *, key="reply:record", coverage="partial") -> dict:
    return {
        "expected_revision": request["revision"],
        "expected_question_revision": question["source_revision"],
        "business_question_revision": question["business_question_revision"],
        "answer_text": "The partner bank controls settlement.",
        "coverage": coverage,
        "remaining_question": "When does the launch start?" if coverage == "partial" else None,
        "source_action_key": key,
    }


def test_prepare_edit_and_external_request_are_explicit_and_merge_fresh_metadata(
    service, actor, question,
):
    request = create_request(service, actor, question)
    assert request["state"] == "prepared"
    assert request["created_by"] == actor.model_dump()

    path = service.workspace._path(MATTER, "workspace.md")
    service.vault.update_markdown(path, metadata_updates={
        "sentinel": {"keep": True},
        "context_selections": [{"reference_id": "SRC-concurrent", "selected": True}],
    })
    edited = service.edit(MATTER, request["request_id"], {
        "expected_revision": request["revision"],
        "wording": "Edited wording that the browser may copy.",
        "requested_person": "Bailey Business",
        "due_at": "2026-09-10",
        "source_action_key": "request:edit",
    }, actor=actor)["request"]
    assert edited["state"] == "prepared"
    requested = service.act(MATTER, edited["request_id"], {
        "action": "requested_externally", "expected_revision": edited["revision"],
        "source_action_key": "request:external",
    }, actor=actor)["request"]
    assert requested["state"] == "requested_externally"
    assert requested["requested_at"]
    metadata = service.vault.read_markdown(path)["metadata"]
    assert metadata["sentinel"] == {"keep": True}
    assert metadata["context_selections"] == [{"reference_id": "SRC-concurrent", "selected": True}]
    saved_operation = next(item for item in metadata["continuity_operations"]
                           if item["source_action_key"] == "request:external")
    assert saved_operation["receipt"]["after_revision"] == requested["revision"]


def test_request_projection_rereads_workspace_after_journal_and_preserves_concurrent_metadata(
    service, actor, question, monkeypatch,
):
    request = create_request(service, actor, question)
    find = service._find
    path = service.workspace._path(MATTER, "workspace.md")
    injected = False

    def inject_after_journal(matter_id, request_id):
        nonlocal injected
        result = find(matter_id, request_id)
        if not injected:
            injected = True
            doc = service.vault.read_markdown(path)
            doc["metadata"]["sentinel_after_journal"] = "preserve"
            doc["metadata"]["interaction_receipts"] = [{"receipt_id": "IRC-concurrent"}]
            service.vault.write_markdown(path, doc["content"], doc["metadata"])
        return result

    monkeypatch.setattr(service, "_find", inject_after_journal)
    edited = service.edit(MATTER, request["request_id"], {
        "expected_revision": request["revision"], "wording": "Fresh merged wording",
        "source_action_key": "request:fresh-merge",
    }, actor=actor)["request"]
    metadata = service.vault.read_markdown(path)["metadata"]
    assert edited["wording"] == "Fresh merged wording"
    assert metadata["sentinel_after_journal"] == "preserve"
    assert metadata["interaction_receipts"] == [{"receipt_id": "IRC-concurrent"}]


def test_reply_is_immutable_exact_source_and_keeps_speaker_separate_from_actor(
    service, actor, question,
):
    request = create_request(service, actor, question)
    text = "Bailey says: the partner bank controls settlement.\nThis is supplied data."
    saved = save_reply(service, actor, request, text=text)
    reply = saved["replies"][0]
    source = service.vault.read_markdown(reply["path"])
    assert source["content"] == text
    assert source["metadata"]["immutable"] is True
    assert reply["entered_by"]["display_name"] == "Alex Morgan"
    assert reply["reported_speaker"] == "Bailey Business"
    assert saved["state"] == "reply_saved"
    assert saved["requested_at"] is None


def test_crlf_reply_and_trailing_whitespace_survive_source_projection_reload_and_fact_link(
    service, actor, question,
):
    request = create_request(service, actor, question)
    text = "The partner bank controls settlement.  \r\nLaunch timing is open.\t\r\n  "
    saved = save_reply(service, actor, request, key="reply:crlf", text=text)
    reply = saved["replies"][0]
    raw = service.vault.resolve(reply["path"]).read_bytes()
    assert raw.endswith(text.encode("utf-8"))

    reloaded_service = FactRequestService(
        service.vault, service.matters, service.workspace, service.records,
    )
    reloaded = reloaded_service.get(MATTER, request["request_id"])
    assert reloaded["replies"][0]["text"] == text

    result = reloaded_service.record_reply(
        MATTER, request["request_id"], reply["reply_id"], {
            "expected_revision": reloaded["revision"],
            "expected_question_revision": question["source_revision"],
            "business_question_revision": question["business_question_revision"],
            "answer_text": "The partner bank controls settlement.",
            "coverage": "partial",
            "remaining_question": "When does the launch start?",
            "source_action_key": "reply:record-crlf",
        }, actor=actor,
    )
    linked = reloaded_service.get(MATTER, request["request_id"])["replies"][0]
    assert linked["text"] == text
    assert linked["linked_fact_ids"] == result["request"]["linked_fact_ids"]


def test_partial_record_uses_canonical_action_and_returns_reassessment_without_other_mutation(
    service, actor, question, monkeypatch,
):
    request = save_reply(service, actor, create_request(service, actor, question))
    apply_update = service.records.apply_update

    def assert_journal_first(*args, **kwargs):
        operations = service.vault.read_markdown(
            service.workspace._path(MATTER, "workspace.md"),
        )["metadata"]["continuity_operations"]
        assert any(item["source_action_key"] == "reply:record" for item in operations)
        return apply_update(*args, **kwargs)

    monkeypatch.setattr(service.records, "apply_update", assert_journal_first)
    result = service.record_reply(
        MATTER, request["request_id"], request["replies"][0]["reply_id"],
        record_command(request, question), actor=actor,
    )
    assert result["request"]["state"] == "partly_answered"
    assert result["request"]["remaining_question"] == "When does the launch start?"
    assert result["receipt"]["completed_parts"] == [
        "reply_source", "reported_fact", "supporting_question", "fact_request",
    ]
    saved_question = service.workspace.questions(MATTER)[0]
    assert saved_question["state"] == "open"
    assert saved_question["text"] == question["text"]
    assert len(saved_question["linked_fact_ids"]) == 1
    action = next(item for item in service.records.get(MATTER)["actions"]
                  if item.get("source_action_key") == "continuity:reply:record:fact")
    assert action["actor"] == "Alex Morgan"
    assert action["action_actor"] == actor.model_dump()
    assert result["reassessment"]["source_action_key"] == "reply:record:reassess"
    assert result["reassessment"]["fact_ids"] == saved_question["linked_fact_ids"]
    persisted = next(item for item in service.vault.read_markdown(
        service.workspace._path(MATTER, "workspace.md"))["metadata"]["continuity_operations"]
                     if item["source_action_key"] == "reply:record")
    assert persisted["receipt"]["after_revision"] == result["request"]["revision"]


def test_later_reply_completes_a_partial_request_without_treating_its_own_question_update_as_stale(
    service, actor, question,
):
    first_reply = save_reply(service, actor, create_request(service, actor, question))
    partial = service.record_reply(
        MATTER, first_reply["request_id"], first_reply["replies"][0]["reply_id"],
        record_command(first_reply, question, key="reply:first-part"), actor=actor,
    )["request"]
    current_question = service.workspace.questions(MATTER)[0]
    second_reply = save_reply(
        service, actor, partial, key="reply:second-part", text="The launch starts Monday.",
    )
    command = record_command(
        second_reply, current_question, key="reply:finish-partial", coverage="full",
    )
    command["answer_text"] = "The launch starts Monday."
    completed = service.record_reply(
        MATTER, second_reply["request_id"], second_reply["replies"][-1]["reply_id"],
        command, actor=actor,
    )["request"]
    assert completed["state"] == "answer_recorded"
    assert completed["remaining_question"] is None
    assert len(completed["linked_fact_ids"]) == 2


def test_failure_after_fact_save_retries_with_original_actor_and_no_duplicate(
    service, actor, question, monkeypatch,
):
    request = save_reply(service, actor, create_request(service, actor, question))
    command = record_command(request, question, key="reply:recover", coverage="full")
    original = service.workspace.save_question
    calls = 0

    def fail_once(*args, **kwargs):
        nonlocal calls
        calls += 1
        if calls == 1:
            raise OSError("injected question save failure")
        return original(*args, **kwargs)

    monkeypatch.setattr(service.workspace, "save_question", fail_once)
    partial = service.record_reply(
        MATTER, request["request_id"], request["replies"][0]["reply_id"],
        command, actor=actor,
    )
    assert partial["receipt"]["state"] == "not_saved"
    assert partial["receipt"]["completed_parts"] == ["reply_source", "reported_fact"]
    fact_count = len(service.records.get(MATTER)["facts"])

    different_actor = ActionActor(person_id="jordan", display_name="Jordan Lee", mode="demo")
    completed = service.record_reply(
        MATTER, request["request_id"], request["replies"][0]["reply_id"],
        command, actor=different_actor,
    )
    assert completed["receipt"]["state"] == "applied"
    assert len(service.records.get(MATTER)["facts"]) == fact_count
    action = next(item for item in service.records.get(MATTER)["actions"]
                  if item.get("source_action_key") == "continuity:reply:recover:fact")
    assert action["action_actor"] == actor.model_dump()


def test_left_open_can_receive_a_later_full_reply_and_requested_state_cannot_regress(
    service, actor, question,
):
    request = create_request(service, actor, question)
    left_open = service.act(MATTER, request["request_id"], {
        "action": "leave_open", "expected_revision": request["revision"],
        "source_action_key": "request:leave-open",
    }, actor=actor)["request"]
    assert left_open["state"] == "left_open"
    replied = save_reply(service, actor, left_open, key="reply:after-open")
    full = service.record_reply(
        MATTER, replied["request_id"], replied["replies"][0]["reply_id"],
        record_command(replied, question, key="reply:full-after-open", coverage="full"),
        actor=actor,
    )["request"]
    assert full["state"] == "answer_recorded"
    assert full["remaining_question"] is None
    left_again = service.act(MATTER, full["request_id"], {
        "action": "leave_open", "expected_revision": full["revision"],
        "source_action_key": "request:leave-open-again",
    }, actor=actor)["request"]
    assert left_again["state"] == "left_open"
    assert left_again["linked_fact_ids"] == full["linked_fact_ids"]
    with pytest.raises(ValueError, match="cannot replace"):
        service.act(MATTER, left_again["request_id"], {
            "action": "requested_externally", "expected_revision": left_again["revision"],
            "source_action_key": "request:invalid-regression",
        }, actor=actor)


def test_changed_question_after_partial_save_preserves_new_scope_and_fact(
    service, actor, question, monkeypatch,
):
    request = save_reply(service, actor, create_request(service, actor, question))
    command = record_command(request, question, key="reply:scope-race", coverage="full")
    original = service.workspace.save_question
    monkeypatch.setattr(service.workspace, "save_question",
                        lambda *args, **kwargs: (_ for _ in ()).throw(OSError("stop after fact")))
    partial = service.record_reply(
        MATTER, request["request_id"], request["replies"][0]["reply_id"], command, actor=actor,
    )
    assert partial["receipt"]["state"] == "not_saved"
    monkeypatch.setattr(service.workspace, "save_question", original)
    current = service.workspace.questions(MATTER)[0]
    current["text"] = "Which party can release settlement funds?"
    changed = original(MATTER, current, expected_revision=current["source_revision"])

    retry = service.record_reply(
        MATTER, request["request_id"], request["replies"][0]["reply_id"], command, actor=actor,
    )
    assert retry["receipt"]["state"] == "not_saved"
    assert retry["receipt"]["completed_parts"] == ["reply_source", "reported_fact"]
    assert service.workspace.questions(MATTER)[0]["text"] == changed["text"]
    assert any(item["text"] == command["answer_text"] for item in service.records.get(MATTER)["facts"])


def test_reassessment_journal_failure_keeps_fact_and_resumes_without_duplicate(
    service, actor, question, monkeypatch,
):
    request = save_reply(service, actor, create_request(service, actor, question))
    command = record_command(request, question, key="reply:reassess-recovery", coverage="full")
    write = service.vault.write_markdown
    workspace_path = service.workspace._path(MATTER, "workspace.md")
    workspace_writes = 0

    def fail_reassessment_write(path, content, metadata=None):
        nonlocal workspace_writes
        if str(path) == workspace_path:
            workspace_writes += 1
            if workspace_writes == 4:
                raise OSError("injected reassessment journal failure")
        return write(path, content, metadata)

    monkeypatch.setattr(service.vault, "write_markdown", fail_reassessment_write)
    partial = service.record_reply(
        MATTER, request["request_id"], request["replies"][0]["reply_id"], command,
        actor=actor,
    )
    assert partial["receipt"]["state"] == "not_saved"
    assert partial["receipt"]["completed_parts"] == [
        "reply_source", "reported_fact", "supporting_question", "fact_request",
    ]
    fact_count = len(service.records.get(MATTER)["facts"])
    completed = service.record_reply(
        MATTER, request["request_id"], request["replies"][0]["reply_id"], command,
        actor=actor,
    )
    assert completed["receipt"]["state"] == "applied"
    assert completed["reassessment"] is not None
    assert len(service.records.get(MATTER)["facts"]) == fact_count


def test_reframe_before_record_conflicts_but_keeps_reply_and_contradiction_supersedes(
    service, actor, question,
):
    old = service.records.apply_update(MATTER, facts=[{"text": "The company controls settlement."}])
    old_fact = old["created"]["facts"][0]
    request = save_reply(service, actor, create_request(service, actor, question))
    current = service.workspace.questions(MATTER)[0]
    current["text"] = "Who can release settlement funds?"
    service.workspace.save_question(MATTER, current, expected_revision=current["source_revision"])
    command = record_command(request, question, key="reply:stale")
    command["supersedes_fact_id"] = old_fact
    with pytest.raises(WorkspaceConflict):
        service.record_reply(
            MATTER, request["request_id"], request["replies"][0]["reply_id"], command,
            actor=actor,
        )
    assert service.vault.exists(request["replies"][0]["path"])
    assert next(item for item in service.records.get(MATTER)["facts"]
                if item["fact_id"] == old_fact)["status"] == "active"

    changed_question = service.workspace.questions(MATTER)[0]
    correction = save_reply(
        service, actor,
        create_request(service, actor, changed_question, key="request:correction"),
        key="reply:correction",
        text="The partner bank, not the company, can release settlement funds.",
    )
    correction_command = record_command(
        correction, changed_question, key="reply:record-correction", coverage="full",
    )
    correction_command["supersedes_fact_id"] = old_fact
    recorded = service.record_reply(
        MATTER, correction["request_id"], correction["replies"][0]["reply_id"],
        correction_command, actor=actor,
    )
    facts = service.records.get(MATTER)["facts"]
    prior = next(item for item in facts if item["fact_id"] == old_fact)
    replacement = next(item for item in facts if item["fact_id"] in recorded["request"]["linked_fact_ids"])
    assert prior["status"] == "superseded"
    assert prior["superseded_by"] == replacement["fact_id"]
    assert replacement["supersedes"] == old_fact
