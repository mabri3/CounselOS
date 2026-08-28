from fastapi.testclient import TestClient

from app.main import app


def _client(context):
    app.state.context = context
    return TestClient(app)


def test_create_matter_starts_persisted_intake_card(app_context):
    response = _client(app_context).post("/api/matters", json={
        "title": "Card contract matter",
        "request_text": "Can we launch this change?",
    })
    assert response.status_code == 201
    matter_id = response.json()["matter_id"]
    conversations = _client(app_context).get(f"/api/matters/{matter_id}/conversations").json()["conversations"]
    conversation = _client(app_context).get(
        f"/api/matters/{matter_id}/conversations/{conversations[0]['conversation_id']}"
    ).json()
    card = conversation["messages"][0]["cards"][0]
    assert card["type"] == "question"
    assert card["text"] == "Here is what I understand you are asking. Is that correct?"
    assert 3 <= len(card["choices"]) <= 7


def test_card_action_and_attachment_metadata_survive_reload(app_context):
    client = _client(app_context)
    response = client.post("/api/chat", json={
        "matter_id": "MAT-DEMO-BEACON",
        "message": "",
        "card_action": {"card_id": "intake-confirm-ask", "action": "answer", "values": ["yes"]},
        "attachments": [{"source_id": "SRC-1", "path": "documents/example.txt", "name": "example.txt", "version": "abc"}],
    })
    assert response.status_code == 200
    payload = response.json()
    conversation = client.get(
        f"/api/matters/MAT-DEMO-BEACON/conversations/{payload['conversation_id']}"
    ).json()
    assert conversation["messages"][0]["attachments"][0]["source_id"] == "SRC-1"
    assert conversation["messages"][1]["cards"][0]["type"] == "matter_update"


def test_company_profile_is_vault_backed_and_versioned(app_context):
    client = _client(app_context)
    response = client.put("/api/settings/company", json={
        "summary": "Makes payment tools.",
        "business_model": "Subscription",
        "products_services": "Payments API",
        "jurisdictions": "US and UK",
        "regulatory_context": "Financial services",
        "data_practices": "Processes account data",
        "risk_posture": "Moderate",
    })
    assert response.status_code == 200
    profile = response.json()
    assert profile["source_id"] == "SRC-COMPANY"
    assert profile["version"]
    assert client.get("/api/settings/company").json() == profile
    assert app_context.vault.exists("00_System/company.md")


def test_multi_upload_batch_apply_undo_and_finalize_endpoints(app_context):
    client = _client(app_context)
    uploaded = client.post(
        "/api/matters/MAT-DEMO-BEACON/uploads",
        files=[("files", ("plan.md", b"Launch is Friday.", "text/markdown")), ("files", ("notes.txt", b"Owner is Sam.", "text/plain"))],
    )
    assert uploaded.status_code == 201
    batch_id = uploaded.json()["batch_id"]
    preview = client.post("/api/matters/MAT-DEMO-BEACON/batches", json={"batch_id": batch_id, "action": "preview"})
    assert preview.json()["state"] == "preview"
    applied = client.post("/api/matters/MAT-DEMO-BEACON/batches", json={"batch_id": batch_id, "action": "apply"})
    assert applied.json()["state"] == "applied"
    duplicate = client.post("/api/matters/MAT-DEMO-BEACON/batches", json={"batch_id": batch_id, "action": "apply"})
    assert duplicate.status_code == 400
    undone = client.post("/api/matters/MAT-DEMO-BEACON/batches", json={"batch_id": batch_id, "action": "undo"})
    assert undone.json()["state"] == "withdrawn"

    draft = app_context.work_products.create_draft("MAT-DEMO-BEACON", title="Launch note", content="Draft")
    final = client.post(
        "/api/matters/MAT-DEMO-BEACON/work-product/finalize",
        json={"draft_path": draft["vault_path"]},
    )
    assert final.status_code == 200
    assert final.json()["state"] == "final"


def test_workspace_upload_returns_chat_attachment_references(app_context):
    response = _client(app_context).post(
        "/api/daily-uploads",
        files=[("files", ("meeting.txt", b"Meeting notes", "text/plain"))],
    )
    assert response.status_code == 201
    attachment = response.json()["attachments"][0]
    assert attachment["source_id"].startswith("SRC-")
    assert app_context.vault.exists(attachment["path"])
