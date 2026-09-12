"""Business-question scope and complete, read-only matter history access."""
import json
import asyncio

import pytest

from app.agents.runner import RunnerExecutionState
from app.providers.base import ProviderReply, ProviderToolCall
from app.services.dossier_generation import generate_dossier
from app.services.dossier_generation_context import capture, input_text
from app.services.dossier_records import DossierRecordReader


MATTER = "MAT-DEMO-RELAY"


def test_hidden_retention_marker_is_not_a_business_question(app_context):
    assert app_context.dossiers.section(
        "## Decision question\n\n<!-- saved-issue-analysis:start -->\n\n## Issues\n\nSaved work.",
        "Decision question") == ""


def test_unaccepted_proposal_is_readable_without_becoming_the_working_view():
    snapshot = {"data": {"title": "Synthetic matter", "accepted_working_view": {"content": "Keep the current plan."},
        "proposed_working_view": {"content": "UNACCEPTED_ANALYSIS: consider a different route.", "version_id": "REC-proposed"}}}
    supplied = json.loads(input_text(snapshot).split("\n", 1)[1])
    assert supplied["accepted_working_view"]["content"] == "Keep the current plan."
    pointer = supplied["proposed_working_view_record"]
    assert "not accepted" in pointer["role"]
    text = DossierRecordReader(snapshot).execute({"record_id": pointer["record_id"], "query": "UNACCEPTED_ANALYSIS"})["text"]
    assert "UNACCEPTED_ANALYSIS" in text and "REC-proposed" in text
    assert "proposed_working_view" in text


def test_generation_considers_other_conversations_and_old_assistant_analysis(app_context):
    app = app_context
    question = app.workspace.business_question(MATTER)["text"]
    earlier = app.chat_history.append(MATTER, None, role="user",
        content="A signed exit letter is also needed. This was not put on the issue list.")
    earlier = app.chat_history.append(MATTER, earlier["conversation_id"], role="assistant",
        content="The exit letter is a separate dependency. A vendor switch alone does not end the old agreement.")
    current = app.chat_history.append(MATTER, None, role="user", content="What does an API token mean?")
    for n in range(10):
        current = app.chat_history.append(MATTER, current["conversation_id"], role="user", content=f"Formatting follow-up {n}.")
    snap = capture(app, MATTER, {"conversation_id": current["conversation_id"]})
    supplied = json.loads(input_text(snap).split("\n", 1)[1])
    assert supplied["question"] == question
    messages = {m["message_id"]: m for m in supplied["conversation_messages"]}
    for message in earlier["messages"]:
        assert messages[message["message_id"]]["content"] == message["content"]
        assert messages[message["message_id"]]["conversation_id"] == earlier["conversation_id"]
        assert messages[message["message_id"]]["created_at"] == message["created_at"]
        assert messages[message["message_id"]]["role"] == message["role"]


def test_dossier_uses_original_request_but_not_prior_synthesis_as_primary_input(app_context):
    app = app_context
    root = app.matters.matter_path(MATTER)
    original = "Can we leave the supplier without renewing, while keeping the service available?"
    app.vault.write_markdown(root + "/request.md", original, {"immutable": True})
    old = app.dossiers.get(MATTER)
    app.vault.write_markdown(root + "/dossier.md", old["content"] + "\n\nA_STALE_PRIOR_CONCLUSION.", old["metadata"])
    snap = capture(app, MATTER)
    supplied = input_text(snap)
    assert original in supplied
    assert "A_STALE_PRIOR_CONCLUSION" not in supplied
    assert "A_STALE_PRIOR_CONCLUSION" in snap["data"]["prior_dossier"]


def test_reader_reaches_full_old_passages_and_keeps_the_captured_version(app_context):
    app = app_context
    content = "Opening discussion.\n\n" * 700 + "Hidden exception: export requires both delivery and a successful restore.\n\n" + "Remaining conditions. " * 500
    conv = app.chat_history.append(MATTER, None, role="assistant", content=content)
    message = conv["messages"][0]
    snap = capture(app, MATTER)
    reader = DossierRecordReader(snap)
    hit = reader.execute({"query": "Hidden"})["hits"][0]
    assert hit["record_id"] == message["message_id"]
    passage = reader.execute({"record_id": hit["record_id"], "query": "Hidden", "max_chars": 900})
    assert "both delivery and a successful restore" in passage["text"]
    assert passage["text"] == content[passage["start"]:passage["end"]]
    tail = reader.execute({"record_id": hit["record_id"], "start": passage["next_start"]})
    assert tail["start"] == passage["end"]
    app.vault.write_markdown(conv["path"], "Changed after capture", {"matter_id": MATTER})
    assert reader.execute({"record_id": hit["record_id"], "query": "Hidden", "max_chars": 900}) == passage
    assert snap["references"][message["message_id"]]["captured_record"]["content"] == content


def test_scope_order_exclusions_and_other_matters_are_preserved(app_context):
    app = app_context
    conv = app.chat_history.append(MATTER, None, role="user", content="The service ends on December 1.")
    conv = app.chat_history.append(MATTER, conv["conversation_id"], role="user", content="Correction: it ends on January 1.")
    doc = app.vault.read_markdown(conv["path"])
    doc["metadata"]["messages"][-1]["workspace_submission"] = {"scope": "scenario", "target": {"scenario_id": "SCN-hypothetical"}}
    app.vault.write_markdown(doc["path"], doc["content"], doc["metadata"])
    foreign = app.chat_history.append("MAT-DEMO-BEACON", None, role="user", content="FOREIGN_PRIVATE_MATERIAL")
    snap = capture(app, MATTER)
    messages = [m for m in snap["data"]["conversation_messages"] if m["conversation_id"] == conv["conversation_id"]]
    assert [m["content"] for m in messages] == [m["content"] for m in conv["messages"]]
    assert messages[-1]["submitted_scope"] == "scenario"
    assert messages[-1]["submitted_path_id"] == "SCN-hypothetical"
    reader = DossierRecordReader(snap)
    assert reader.execute({"query": "FOREIGN_PRIVATE_MATERIAL"})["matches"] == 0
    with pytest.raises(ValueError):
        reader.execute({"record_id": foreign["messages"][0]["message_id"]})
    for exclusion in ({"excluded_paths": [conv["path"]]}, {"excluded_reference_ids": [messages[0]["message_id"]]}):
        restricted = capture(app, MATTER, {**exclusion, "context": "Only permitted source text."})
        limited = DossierRecordReader(restricted)
        assert limited.execute({"query": "January"})["matches"] == 0
        assert "Correction:" not in input_text(restricted)


def test_documents_outside_initial_excerpt_are_available_and_new_edits_require_review(app_context):
    app = app_context
    root = app.matters.matter_path(MATTER)
    path = root + "/documents/exit-letter.md"
    full = "Long preamble. " * 900 + "Exit letter: both parties must sign."
    app.vault.write_markdown(path, full, {"title": "Exit letter", "source_id": "SRC-exit"})
    snap = capture(app, MATTER)
    reader = DossierRecordReader(snap)
    hit = next(h for h in reader.execute({"query": "Exit letter"})["hits"] if h.get("path") == path)
    assert "both parties must sign" in reader.execute({"record_id": hit["record_id"], "query": "parties"})["text"]
    assert reader.execute({"record_id": "prior-dossier"})["text"]
    app.vault.write_markdown(path, "Different signed terms", {"title": "Exit letter", "source_id": "SRC-exit"})
    result = asyncio.run(generate_dossier(app, MATTER, prepared_content="# Updated dossier\n\nCurrent answer.", frozen_context={"dossier_inputs": snap}))
    assert result["state"] == "review_required"
    assert any("inputs changed" in warning.lower() for warning in result["warnings"])


@pytest.mark.asyncio
async def test_writer_reads_old_record_and_rejects_mutations_without_changing_question(app_context):
    app = app_context
    conv = app.chat_history.append(MATTER, None, role="assistant", content="Earlier scope check. " * 1000 + "EXIT_LETTER_REQUIRED.")
    identity = conv["messages"][0]["message_id"]
    question = app.workspace.business_question(MATTER)["text"]
    before = app.matter_records.get(MATTER)
    state = RunnerExecutionState()

    class Writer:
        calls = 0
        async def complete(self, messages, tools=None):
            self.calls += 1
            assert [tool["function"]["name"] for tool in tools] == ["read_dossier_record"]
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall("read-1", "read_dossier_record", {"record_id": identity, "query": "EXIT_LETTER"}),
                    ProviderToolCall("bad-2", "write_markdown", {"path": "facts.md", "content": "not authorized"})])
            observations = [json.loads(m["content"]) for m in messages if m["role"] == "tool"]
            assert "EXIT_LETTER_REQUIRED" in observations[0]["text"]
            assert "Only captured-record reads" in observations[1]["error"]
            return ProviderReply(content="# Dossier\n\n## Current position\n\nThe exit letter remains needed. " + identity + "\n\n## Decision question\n\nAn unrelated token question?")

    app.runner.provider = Writer()
    result = await generate_dossier(app, MATTER, execution_state=state)
    assert result["state"] == "applied"
    assert app.workspace.business_question(MATTER)["text"] == question
    assert app.matter_records.get(MATTER) == before
    assert "[source:" + identity + "]" in result["content"]
    assert [read["status"] for read in state.frozen_context["dossier_record_reads"]] == ["success", "error"]


@pytest.mark.asyncio
async def test_read_deadline_reserves_an_answer_only_attempt(app_context):
    app = app_context
    app.settings.dossier_timeout_seconds = .16

    class Writer:
        calls = []
        async def complete(self, messages, tools=None):
            self.calls.append(bool(tools))
            if tools:
                await asyncio.sleep(.2)
            return ProviderReply(content="# Dossier\n\nBest answer from saved facts.")

    writer = Writer()
    app.runner.provider = writer
    result = await generate_dossier(app, MATTER, save=False)
    assert result["content"].startswith("# Dossier")
    assert writer.calls == [True, False]
    assert result["warnings"]


@pytest.mark.asyncio
async def test_read_failure_and_read_limit_do_not_prevent_final_answer(app_context, monkeypatch):
    app = app_context
    monkeypatch.setattr(DossierRecordReader, "execute", lambda *a: (_ for _ in ()).throw(OSError("record unavailable")))

    class Writer:
        calls = 0
        async def complete(self, messages, tools=None):
            self.calls += 1
            if tools:
                return ProviderReply(tool_calls=[ProviderToolCall("read-" + str(self.calls), "read_dossier_record", {})])
            assert any("record unavailable" in m.get("content", "") for m in messages if m["role"] == "tool")
            return ProviderReply(content="# Dossier\n\nConditional answer despite the missing record.")

    writer = Writer()
    app.runner.provider = writer
    result = await generate_dossier(app, MATTER, save=False)
    assert writer.calls == 5
    assert "Conditional answer" in result["content"]


@pytest.mark.asyncio
async def test_failed_final_attempt_keeps_partial_analysis_and_the_prior_dossier(app_context):
    app = app_context
    before = app.dossiers.get(MATTER)

    class Writer:
        calls = 0
        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(content="Useful partial observation: notice receipt is still unconfirmed.",
                    tool_calls=[ProviderToolCall("read-1", "read_dossier_record", {"record_id": "prior-dossier"})])
            raise OSError("model unavailable")

    app.runner.provider = Writer()
    result = await generate_dossier(app, MATTER, save=False)
    assert "Useful partial observation" in result["content"]
    assert "Partial generated analysis — generation did not finish" in result["content"]
    assert app.workspace.business_question(MATTER)["text"] in result["content"]
    assert any(w.startswith("Dossier generation did not complete") for w in result["warnings"])
    assert app.dossiers.get(MATTER) == before
