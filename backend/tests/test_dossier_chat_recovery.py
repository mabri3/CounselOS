"""Dossier controls and useful planning output survive partial and historical runs."""
from copy import deepcopy

import pytest

from app.models.api import ChatRequest
from app.providers.base import ProviderReply, ProviderToolCall
from app.routers import chat, matters

MATTER = "MAT-DEMO-BEACON"


@pytest.mark.asyncio
async def test_dossier_setup_survives_a_conversation_on_another_path(app_context):
    app = app_context
    payload = chat.freeze_workspace_request(ChatRequest(matter_id=MATTER,
        message="Generate dossier", experimental_chat=True), app)
    payload = chat.freeze_run_context(payload, app, "RUN-scenario-dossier")
    payload.frozen_context["active_path"]["path_id"] = "SCN-prior-exploration"
    response = await chat.execute_chat(payload, app)
    card = next(card for card in response.cards if card.type == "dossier_research")
    assert card.state == "awaiting_choices"
    saved = app.chat_history.get(MATTER, response.conversation_id)
    assert saved["messages"][-1]["cards"][0]["request_id"] == card.request_id
    assert app.research_runs.managed_children(MATTER, card.request_id) == []

    # Simulate the old scenario filter: the receipt survives but the card did not.
    document = app.vault.read_markdown(saved["path"])
    document["metadata"]["messages"][-1]["cards"] = []
    app.vault.write_markdown(saved["path"], document["content"], document["metadata"])
    before = app.vault.read_text(saved["path"])
    restored = matters.get_conversation(MATTER, response.conversation_id, app)
    restored_card = restored["messages"][-1]["cards"][0]
    assert restored_card["request_id"] == card.request_id
    assert restored_card["status"]["origin"]["conversation_id"] == response.conversation_id
    assert app.vault.read_text(saved["path"]) == before, "Reading must not rewrite historical evidence"

    from app.services.dossier_generation_chat import restore_dossier_cards
    assert restore_dossier_cards(app, MATTER, restored)["messages"][-1]["cards"] == [restored_card]
    wrong_origin = deepcopy(restored)
    wrong_origin["conversation_id"] = "CONV-another"
    wrong_origin["messages"][-1]["cards"] = []
    assert restore_dossier_cards(app, MATTER, wrong_origin)["messages"][-1]["cards"] == []


@pytest.mark.asyncio
async def test_preparation_timeout_keeps_prior_text_and_record_read_warnings(app_context):
    app = app_context
    useful = "## Useful preparation\n\nThe launch depends on the terms already saved."

    class PartialPlanner:
        calls = 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(content=useful, tool_calls=[ProviderToolCall(
                    id="read-1", name="read_dossier_record", arguments={"record_id": "missing-record"})])
            raise TimeoutError("No final answer arrived")

    provider = PartialPlanner()
    app.runner.provider = provider
    before = app.dossiers.get(MATTER)
    result = await app.dossier_requests.prepare(ChatRequest(matter_id=MATTER,
        message="Generate dossier", source_action_key="partial-preparation"))
    assert result["state"] == "awaiting_choices"
    assert useful in result["preparation"]
    record = app.dossier_requests.get_record(MATTER, result["request_id"])["metadata"]
    assert record["raw_preparation_output"] == useful
    assert any("TimeoutError" in warning for warning in record["preparation_warnings"])
    assert any("saved-record read" in warning.lower() for warning in record["preparation_warnings"])
    assert app.dossiers.get(MATTER) == before
    assert provider.calls == 3, "After a read failure, still try one answer without tools"
