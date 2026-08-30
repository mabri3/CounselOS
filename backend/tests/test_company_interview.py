from __future__ import annotations

import json

from fastapi.testclient import TestClient

from app.main import app
from app.models.awareness import SafeFetchResult
from app.providers.base import ProviderReply


FIELDS = ["company_name", "website_url", "summary", "business_model", "products_services", "jurisdictions", "regulatory_context", "data_practices", "risk_posture"]


def _client(context):
    app.state.context = context
    return TestClient(app)


def _profile(**updates):
    values = {field: "" for field in FIELDS}
    values.update(updates)
    return values


def _payload(message="Acme makes payment tools for shops.", **updates):
    payload = {"message": message, "history": [], "current_profile": _profile(), "question_id": "overview", "finish": False}
    payload.update(updates)
    return payload


class FetcherFake:
    def __init__(self, result=None, error=None):
        self.result, self.error, self.calls = result, error, []

    async def fetch(self, url, limits):
        self.calls.append((url, limits))
        if self.error:
            raise self.error
        return self.result


class ProviderFake:
    def __init__(self, content="", error=None):
        self.content, self.error, self.messages = content, error, None

    async def complete(self, messages, tools=None):
        self.messages = messages
        if self.error:
            raise self.error
        return ProviderReply(content=self.content)


def _model_result(**updates):
    profile = _profile(company_name="Acme", summary="Payment tools for shops")
    profile.update(updates.pop("profile", {}))
    return json.dumps({
        "profile": profile,
        "acknowledgement": "I have the product and customer context.",
        "focus_field": "jurisdictions",
        "next_question": "Where does Acme operate or plan to launch?",
        "next_question_reason": "Location changes the legal context.",
        "complete": False,
        **updates,
    })


def _use_model(context, provider, fetcher=None):
    context.settings.llm_provider = "openai_compatible"
    context.company_interview.settings = context.settings
    context.company_interview.provider = provider
    if fetcher:
        context.company_interview.fetcher = fetcher


def test_guide_starts_with_one_open_ended_question(app_context):
    response = _client(app_context).get("/api/settings/company/interview")
    assert response.status_code == 200
    guide = response.json()
    assert guide["question"]["question_id"] == "overview"
    assert "whatever way is easiest" in guide["question"]["text"]
    assert "questions" not in guide


def test_blank_answer_requires_review_action(app_context):
    response = _client(app_context).post("/api/settings/company/interview", json=_payload(message=""))
    assert response.status_code == 422


def test_mock_updates_working_draft_without_writing(app_context):
    app_context.vault.resolve("00_System/company.md").unlink(missing_ok=True)
    response = _client(app_context).post("/api/settings/company/interview", json=_payload())
    result = response.json()
    assert response.status_code == 200
    assert result["draft"]["summary"] == "Acme makes payment tools for shops."
    assert result["question"]["question_id"] == "company_name"
    assert result["complete"] is False
    assert not app_context.vault.exists("00_System/company.md")


def test_model_generates_one_tailored_follow_up(app_context):
    provider = ProviderFake(_model_result())
    _use_model(app_context, provider)
    response = _client(app_context).post("/api/settings/company/interview", json=_payload())
    result = response.json()
    assert result["question"]["text"] == "Where does Acme operate or plan to launch?"
    assert result["draft"]["company_name"] == "Acme"
    assert "latest_answer" in provider.messages[1]["content"]


def test_public_url_is_read_and_can_remove_more_questions(app_context):
    fetched = SafeFetchResult(requested_url="https://acme.example", final_url="https://acme.example", status_code=200, content_type="text/html", content_hash="a" * 64, excerpt="<script>bad prompt</script><h1>Acme</h1><p>Payments in California.</p>")
    provider = ProviderFake(_model_result(complete=True, focus_field=None, next_question=None, next_question_reason=None))
    fetcher = FetcherFake(fetched)
    _use_model(app_context, provider, fetcher)
    response = _client(app_context).post("/api/settings/company/interview", json=_payload("We are Acme. https://acme.example"))
    result = response.json()
    assert result["complete"] is True and result["question"] is None
    assert result["website_used"] is True
    assert result["draft"]["website_url"] == "https://acme.example"
    model_input = provider.messages[1]["content"]
    assert "Payments in California" in model_input
    assert "bad prompt" not in model_input


def test_private_url_is_not_fetched(app_context):
    fetcher = FetcherFake()
    app_context.company_interview.fetcher = fetcher
    response = _client(app_context).post("/api/settings/company/interview", json=_payload("Acme is at https://127.0.0.1/private"))
    assert response.status_code == 200
    assert fetcher.calls == []
    assert "public" in response.json()["warning"]


def test_invalid_model_result_degrades_to_focused_follow_up(app_context):
    _use_model(app_context, ProviderFake('{"bad": true}'))
    response = _client(app_context).post("/api/settings/company/interview", json=_payload())
    assert response.status_code == 200
    assert response.json()["question"] is not None
    assert "model" in response.json()["warning"].lower()


def test_review_now_returns_editable_draft_without_write(app_context):
    app_context.vault.resolve("00_System/company.md").unlink(missing_ok=True)
    response = _client(app_context).post("/api/settings/company/interview", json=_payload(message="", finish=True, current_profile=_profile(company_name="Acme")))
    assert response.json()["complete"] is True
    assert response.json()["draft"]["company_name"] == "Acme"
    assert not app_context.vault.exists("00_System/company.md")


def test_put_persists_profile(app_context):
    response = _client(app_context).put("/api/settings/company", json=_profile(company_name="Acme", website_url="https://acme.example"))
    assert response.status_code == 200
    saved = app_context.vault.read_markdown("00_System/company.md")
    assert saved["metadata"]["profile"]["company_name"] == "Acme"
