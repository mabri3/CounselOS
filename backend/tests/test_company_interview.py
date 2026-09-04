from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor

import json

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.api import CompanyProfile
from app.models.awareness import SafeFetchResult
from app.providers.base import ProviderReply
from app.services.company import CompanyProfileVersionConflictError


FIELDS = ["company_name", "website_url", "summary", "business_model", "products_services", "jurisdictions", "regulatory_context", "data_practices", "risk_posture"]


def _client(context):
    app.state.context = context
    return TestClient(app)


def _profile(**updates):
    values = {field: "" for field in FIELDS}
    values.update(updates)
    return values


def _clear_company(context):
    context.vault.resolve("00_System/company.md").unlink(missing_ok=True)


def _payload(message="Acme makes payment tools for shops.", **updates):
    payload = {"message": message, "website_url": None, "history": [], "current_profile": _profile(), "question_id": "overview", "finish": False}
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


def test_long_overview_uses_concise_local_summary_without_model(app_context):
    overview = (
        "Acme provides payment tools to small shops in the United States. "
        "It also handles a long list of operational details that belong in the structured profile, not the summary. "
        + "More detail. " * 40
    )
    response = _client(app_context).post(
        "/api/settings/company/interview", json=_payload(message=overview)
    )

    assert response.status_code == 200
    assert response.json()["draft"]["summary"] == (
        "Acme provides payment tools to small shops in the United States."
    )


def test_model_summary_replaces_only_temporary_overview_fallback(app_context):
    provider = ProviderFake(_model_result(profile={"summary": "Concise model orientation."}))
    _use_model(app_context, provider)

    response = _client(app_context).post(
        "/api/settings/company/interview",
        json=_payload(message="Acme provides payment tools. It serves many customer groups and has detailed operations."),
    )

    assert response.status_code == 200
    assert response.json()["draft"]["summary"] == "Concise model orientation."


def test_model_generates_one_tailored_follow_up(app_context):
    provider = ProviderFake(_model_result())
    _use_model(app_context, provider)
    response = _client(app_context).post("/api/settings/company/interview", json=_payload())
    result = response.json()
    assert result["question"]["text"] == "Where does Acme operate or plan to launch?"
    assert result["draft"]["company_name"] == "Acme"
    assert "latest_answer" in provider.messages[1]["content"]


def test_http_blank_website_intent_stays_blank_and_is_not_fetched(app_context):
    fetcher = FetcherFake()
    app_context.company_interview.fetcher = fetcher
    response = _client(app_context).post(
        "/api/settings/company/interview",
        json=_payload(
            message="leave blank",
            website_url="leave blank",
            question_id="website_url",
            current_profile=_profile(company_name="Acme", website_url="none"),
        ),
    )
    assert response.status_code == 200
    assert response.json()["draft"]["website_url"] == ""
    assert response.json()["question"]["question_id"] != "website_url"
    assert fetcher.calls == []


def test_http_valid_dedicated_website_is_stored_and_fetched(app_context):
    fetched = SafeFetchResult(
        requested_url="https://acme.example",
        final_url="https://acme.example",
        status_code=200,
        content_type="text/html",
        content_hash="a" * 64,
        excerpt="<h1>Acme</h1>",
    )
    fetcher = FetcherFake(fetched)
    app_context.company_interview.fetcher = fetcher
    response = _client(app_context).post(
        "/api/settings/company/interview",
        json=_payload(
            message="Our website is supplied separately.",
            website_url="https://acme.example",
            question_id="website_url",
        ),
    )
    assert response.status_code == 200
    assert response.json()["draft"]["website_url"] == "https://acme.example"
    assert fetcher.calls[0][0] == "https://acme.example"


@pytest.mark.asyncio
async def test_public_url_is_read_and_can_remove_more_questions(app_context):
    fetched = SafeFetchResult(requested_url="https://acme.example", final_url="https://acme.example", status_code=200, content_type="text/html", content_hash="a" * 64, excerpt="<script>bad prompt</script><h1>Acme</h1><p>Payments in California.</p>")
    provider = ProviderFake(_model_result(complete=True, focus_field=None, next_question=None, next_question_reason=None))
    fetcher = FetcherFake(fetched)
    _use_model(app_context, provider, fetcher)
    result = await app_context.company_interview.draft(
        "We are Acme.", [], CompanyProfile(), "overview",
        website_url="https://acme.example",
    )
    assert result.complete is True and result.question is None
    assert result.website_used is True
    assert result.draft.website_url == "https://acme.example"
    model_input = provider.messages[1]["content"]
    assert "Payments in California" in model_input
    assert "bad prompt" not in model_input


@pytest.mark.asyncio
async def test_private_url_is_not_fetched(app_context):
    fetcher = FetcherFake()
    app_context.company_interview.fetcher = fetcher
    result = await app_context.company_interview.draft(
        "Acme is private.", [], CompanyProfile(), "overview",
        website_url="https://127.0.0.1/private",
    )
    assert fetcher.calls == []
    assert "public" in result.warning


@pytest.mark.asyncio
async def test_free_form_url_is_not_treated_as_website_input(app_context):
    fetcher = FetcherFake()
    app_context.company_interview.fetcher = fetcher
    result = await app_context.company_interview.draft(
        "A vendor link is https://vendor.example, not our website.",
        [], CompanyProfile(), "overview",
    )
    assert fetcher.calls == []
    assert result.draft.website_url == ""


@pytest.mark.asyncio
async def test_absent_website_phrases_are_not_stored_or_fetched(app_context):
    for absent_value in ("", "leave blank", "none", "no website"):
        fetcher = FetcherFake()
        app_context.company_interview.fetcher = fetcher
        result = await app_context.company_interview.draft(
            "Acme makes payment tools.", [], CompanyProfile(), "overview",
            website_url=absent_value,
        )
        assert fetcher.calls == []
        assert result.draft.website_url == ""


@pytest.mark.asyncio
async def test_malformed_and_unreadable_websites_continue_with_warning(app_context):
    malformed_fetcher = FetcherFake()
    app_context.company_interview.fetcher = malformed_fetcher
    malformed = await app_context.company_interview.draft(
        "Acme makes payment tools.", [], CompanyProfile(), "overview",
        website_url="not a URL",
    )
    assert malformed_fetcher.calls == []
    assert malformed.website_used is False
    assert "HTTPS" in malformed.warning

    unreadable_fetcher = FetcherFake(error=RuntimeError("unreadable"))
    app_context.company_interview.fetcher = unreadable_fetcher
    unreadable = await app_context.company_interview.draft(
        "Acme makes payment tools.", [], CompanyProfile(), "overview",
        website_url="https://acme.example",
    )
    assert unreadable.website_used is False
    assert "could not be read" in unreadable.warning


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
    _clear_company(app_context)
    response = _client(app_context).put("/api/settings/company", json=_profile(company_name="Acme", website_url="https://acme.example"))
    assert response.status_code == 200
    saved = app_context.vault.read_markdown("00_System/company.md")
    assert saved["metadata"]["profile"]["company_name"] == "Acme"


def test_same_company_edit_saves_with_current_version(app_context):
    _clear_company(app_context)
    client = _client(app_context)
    current = client.put(
        "/api/settings/company",
        json=_profile(company_name="Acme", summary="Original summary"),
    ).json()

    response = client.put(
        "/api/settings/company",
        json={**current, "company_name": "  ACME  ", "summary": "Updated summary"},
    )

    assert response.status_code == 200
    assert response.json()["summary"] == "Updated summary"


def test_saved_profile_returns_version_and_save_time(app_context):
    _clear_company(app_context)
    client = _client(app_context)

    saved = client.put(
        "/api/settings/company",
        json=_profile(company_name="Acme"),
    ).json()
    loaded = client.get("/api/settings/company").json()

    assert loaded["version"] == saved["version"]
    assert loaded["saved_at"] == saved["saved_at"]
    assert loaded["saved_at"]


def test_replacing_a_different_company_requires_exact_named_confirmation(app_context):
    _clear_company(app_context)
    client = _client(app_context)
    current = client.put(
        "/api/settings/company",
        json=_profile(company_name="Acme", summary="Original profile"),
    ).json()
    path = app_context.vault.resolve("00_System/company.md")
    before = path.read_bytes()

    rejected = client.put(
        "/api/settings/company",
        json={**current, "company_name": "Beta", "summary": "Replacement profile"},
    )

    assert rejected.status_code == 409
    assert rejected.json()["detail"] == "Confirm replacement of Acme with Beta."
    assert path.read_bytes() == before

    accepted = client.put(
        "/api/settings/company",
        json={
            **current,
            "company_name": "Beta",
            "summary": "Replacement profile",
            "replacement_confirmation": "Replace the company profile for Acme with Beta?",
        },
    )

    assert accepted.status_code == 200
    assert accepted.json()["company_name"] == "Beta"


def test_later_distinct_answer_is_merged_into_populated_topic(app_context):
    response = _client(app_context).post(
        "/api/settings/company/interview",
        json=_payload(
            message="Federal money-transmission registration also applies.",
            question_id="regulatory_context",
            current_profile=_profile(
                company_name="Acme",
                regulatory_context="State lending licenses apply.",
            ),
        ),
    )

    assert response.status_code == 200
    regulatory_context = response.json()["draft"]["regulatory_context"]
    assert "State lending licenses apply." in regulatory_context
    assert "Federal money-transmission registration also applies." in regulatory_context


def test_unrelated_later_answer_does_not_replace_settled_licensing_fact(app_context):
    provider = ProviderFake(
        _model_result(
            profile={
                "regulatory_context": "Card-network rules apply.",
                "data_practices": "Payment-card and device data.",
            },
            focus_field="regulatory_context",
            next_question="Which licenses apply?",
            next_question_reason="Licensing affects the analysis.",
        )
    )
    _use_model(app_context, provider)
    response = _client(app_context).post(
        "/api/settings/company/interview",
        json=_payload(
            message="We process payment-card and device data.",
            question_id="data_practices",
            current_profile=_profile(
                company_name="Acme",
                website_url="https://acme.example",
                summary="Payment tools.",
                business_model="Merchant subscriptions.",
                products_services="Payment tools.",
                jurisdictions="United States.",
                regulatory_context="State lending licenses apply.",
                risk_posture="Balanced.",
            ),
        ),
    )

    assert response.status_code == 200
    result = response.json()
    assert result["draft"]["regulatory_context"] == "State lending licenses apply."
    assert result["question"] is None
    assert result["complete"] is True


def test_stale_version_returns_conflict_without_changing_company_file(app_context):
    _clear_company(app_context)
    client = _client(app_context)
    first = client.put(
        "/api/settings/company",
        json=_profile(company_name="Acme", summary="First summary"),
    ).json()
    latest = client.put(
        "/api/settings/company",
        json={**first, "summary": "Latest summary"},
    ).json()
    path = app_context.vault.resolve("00_System/company.md")
    before = path.read_bytes()

    response = client.put(
        "/api/settings/company",
        json={**first, "company_name": "Beta", "summary": "Stale summary"},
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "The company profile changed. Reload it and try again."
    assert path.read_bytes() == before
    assert app_context.company.read().version == latest["version"]


def test_empty_first_run_profile_saves_without_version(app_context):
    app_context.vault.resolve("00_System/company.md").unlink(missing_ok=True)

    response = _client(app_context).put(
        "/api/settings/company",
        json=_profile(company_name="Acme"),
    )

    assert response.status_code == 200
    assert response.json()["company_name"] == "Acme"
    assert response.json()["version"]


def test_external_markdown_edit_invalidates_saved_version(app_context):
    _clear_company(app_context)
    client = _client(app_context)
    current = client.put(
        "/api/settings/company",
        json=_profile(company_name="Acme", summary="Original summary"),
    ).json()
    document = app_context.vault.read_markdown("00_System/company.md")
    app_context.vault.write_markdown(
        "00_System/company.md",
        document["content"] + "\n\nExternally added context.",
        document["metadata"],
    )
    before = app_context.vault.resolve("00_System/company.md").read_bytes()

    response = client.put(
        "/api/settings/company",
        json={**current, "summary": "Stale overwrite"},
    )

    assert response.status_code == 409
    assert app_context.vault.resolve("00_System/company.md").read_bytes() == before


def test_concurrent_company_writes_allow_only_one_matching_version(app_context):
    _clear_company(app_context)
    current = app_context.company.write(
        CompanyProfile(**_profile(company_name="Acme", summary="Original summary"))
    )
    first = current.model_copy(update={"summary": "First update"})
    second = current.model_copy(update={"summary": "Second update"})

    def save(profile):
        try:
            return app_context.company.write(profile).summary
        except CompanyProfileVersionConflictError:
            return "conflict"

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(save, [first, second]))

    assert results.count("conflict") == 1
    assert app_context.company.read().summary in {"First update", "Second update"}
