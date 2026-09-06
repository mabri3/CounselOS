from app.services.recommendations import RecommendationService
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.routers import files, matters


MATTER_ID = "MAT-DEMO-BEACON"


def service(app_context):
    return RecommendationService(app_context.vault, app_context.matters)


def client(app_context):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(files.router, prefix="/api")
    app.include_router(matters.router, prefix="/api")
    return TestClient(app)


def test_initial_recommendation_and_work_product_share_exact_version(app_context):
    draft = app_context.work_products.create_draft(
        MATTER_ID,
        title="Response",
        content="Send the response.",
        recommendation_content="Ship with a short notice.",
    )
    recommendation = service(app_context).get(MATTER_ID)
    saved_draft = app_context.vault.read_markdown(draft["vault_path"])

    assert recommendation["current_version_id"]
    assert saved_draft["metadata"]["recommendation_version_id"] == recommendation["current_version_id"]
    assert saved_draft["metadata"]["recommendation_snapshot"] == "Ship with a short notice."


def test_agent_revision_is_only_a_proposal_until_lawyer_accepts(app_context):
    recommendations = service(app_context)
    initial = recommendations.set_working(
        MATTER_ID, "Use the existing flow.", actor="Themis.ai", origin="initial_agent"
    )
    proposed = recommendations.propose(MATTER_ID, "Use the revised flow.", actor="Themis.ai")

    assert proposed["content"] == "Use the existing flow."
    assert proposed["current_version_id"] == initial["current_version_id"]
    assert proposed["proposal"]["content"] == "Use the revised flow."

    accepted = recommendations.accept(MATTER_ID, actor="Counsel")
    assert accepted["content"] == "Use the revised flow."
    assert accepted["current_version_id"] != initial["current_version_id"]
    assert accepted["proposal"] is None


def test_direct_lawyer_edit_snapshots_a_new_version(app_context):
    recommendations = service(app_context)
    first = recommendations.set_working(
        MATTER_ID, "First recommendation.", actor="Themis.ai", origin="initial_agent"
    )
    second = recommendations.set_working(
        MATTER_ID, "Lawyer-edited recommendation.", actor="Counsel", origin="lawyer_edit"
    )

    assert len(second["versions"]) == len(first["versions"]) + 1
    assert second["versions"][-1]["origin"] == "lawyer_edit"
    assert second["versions"][-1]["content"] == "Lawyer-edited recommendation."
    assert second["dossier_projection"]["state"] == "applied"
    assert "Lawyer-edited recommendation." in app_context.dossiers.get(MATTER_ID)["content"]


def test_recommendation_projection_runs_once_and_failure_preserves_save(app_context, monkeypatch):
    calls = []

    def fail_projection(matter_id, *, expected_hash):
        calls.append((matter_id, expected_hash))
        raise RuntimeError("projection offline")

    monkeypatch.setattr(app_context.dossiers, "project_current_work_state", fail_projection)
    saved = service(app_context).set_working(
        MATTER_ID, "Primary recommendation survives.", actor="Counsel", origin="lawyer_edit"
    )

    assert len(calls) == 1
    assert saved["content"] == "Primary recommendation survives."
    assert saved["dossier_projection"]["state"] == "failed"
    assert "path" not in saved["dossier_projection"]
    assert "revision_path" not in saved["dossier_projection"]
    assert saved["changed_paths"] == [saved["path"]]


def test_old_draft_basis_is_explicitly_marked_for_review(app_context):
    recommendations = service(app_context)
    recommendations.set_working(
        MATTER_ID, "Initial recommendation.", actor="Themis.ai", origin="initial_agent"
    )
    app_context.work_products.create_draft(MATTER_ID, title="Response", content="Draft")
    recommendations.set_working(
        MATTER_ID, "Updated recommendation.", actor="Counsel", origin="lawyer_edit"
    )

    assert app_context.matters.get(MATTER_ID)["recommendation_review_needed"] is True


def test_final_pins_recommendation_snapshot_after_later_update(app_context):
    recommendations = service(app_context)
    recommendations.set_working(
        MATTER_ID, "Pinned recommendation.", actor="Themis.ai", origin="initial_agent"
    )
    draft = app_context.work_products.create_draft(MATTER_ID, title="Response", content="Final body")
    final = app_context.work_products.finalize(MATTER_ID, draft["vault_path"])
    recommendations.propose(MATTER_ID, "Later proposal.", actor="Themis.ai")

    saved = app_context.vault.read_markdown(final["vault_path"])
    assert saved["metadata"]["recommendation_snapshot"] == "Pinned recommendation."


def test_combined_save_rolls_back_every_record_when_event_write_fails(
    app_context, monkeypatch
):
    matter_path = f"{app_context.matters.matter_path(MATTER_ID)}/matter.md"
    recommendation_path = f"{app_context.matters.matter_path(MATTER_ID)}/recommendations.md"
    draft_folder = app_context.matter_paths.folder(MATTER_ID, "matter_files.draft_outputs_dir")
    event_folder = f"{app_context.matters.matter_path(MATTER_ID)}/events"
    before_matter = app_context.vault.resolve(matter_path).read_bytes()
    before_recommendation = app_context.vault.resolve(recommendation_path).read_bytes()
    before_drafts = {app_context.vault.relative(path) for path in app_context.vault.resolve(draft_folder).glob("*.md")}
    before_events = {app_context.vault.relative(path) for path in app_context.vault.resolve(event_folder).glob("*.md")}
    before_version = service(app_context).get(MATTER_ID)["current_version_id"]
    original_append = app_context.matters.append_event

    def write_then_fail(*args, **kwargs):
        original_append(*args, **kwargs)
        raise RuntimeError("injected failure after event write")

    monkeypatch.setattr(app_context.matters, "append_event", write_then_fail)

    with pytest.raises(RuntimeError, match="injected failure"):
        app_context.work_products.create_draft(
            MATTER_ID,
            title="Atomic response",
            content="Draft body.",
            recommendation_content="New structured recommendation.",
        )

    assert app_context.vault.resolve(matter_path).read_bytes() == before_matter
    assert app_context.vault.resolve(recommendation_path).read_bytes() == before_recommendation
    assert {app_context.vault.relative(path) for path in app_context.vault.resolve(draft_folder).glob("*.md")} == before_drafts
    assert {app_context.vault.relative(path) for path in app_context.vault.resolve(event_folder).glob("*.md")} == before_events
    assert service(app_context).get(MATTER_ID)["current_version_id"] == before_version


def test_combined_revision_rolls_back_draft_recommendation_and_matter(app_context, monkeypatch):
    draft = app_context.work_products.create_draft(
        MATTER_ID, title="Original", content="Original body"
    )
    matter_path = f"{app_context.matters.matter_path(MATTER_ID)}/matter.md"
    recommendation_path = service(app_context).get(MATTER_ID)["path"]
    before_draft = app_context.vault.resolve(draft["vault_path"]).read_bytes()
    before_matter = app_context.vault.resolve(matter_path).read_bytes()
    before_recommendation = app_context.vault.resolve(recommendation_path).read_bytes()

    def fail_event(*_args, **_kwargs):
        raise RuntimeError("revision event failed")

    monkeypatch.setattr(app_context.matters, "append_event", fail_event)
    with pytest.raises(RuntimeError, match="revision event failed"):
        app_context.work_products.revise_draft(
            MATTER_ID,
            draft["vault_path"],
            title="Renamed",
            content="Revised body",
            recommendation_content="New recommendation",
            document_reviews=app_context.document_reviews,
        )

    assert app_context.vault.resolve(draft["vault_path"]).read_bytes() == before_draft
    assert app_context.vault.resolve(matter_path).read_bytes() == before_matter
    assert app_context.vault.resolve(recommendation_path).read_bytes() == before_recommendation


def test_recommendation_mutations_return_common_typed_results(app_context):
    api = client(app_context)
    path = f"/api/matters/{MATTER_ID}/recommendation"

    changed = api.put(path, json={"content": "Use the typed path.", "actor": "Counsel"})
    assert changed.status_code == 200
    first = changed.json()
    assert first["status"] == "changed"
    assert first["operation"] == first["action"] == "update_recommendation"
    assert first["matter_id"] == MATTER_ID
    assert first["entity_refs"] == [{
        "type": "recommendation_version",
        "id": first["data"]["current_version_id"],
        "path": first["data"]["path"],
    }]
    for field in (
        "source_action_key", "summary", "changed_paths", "resulting_matter_state",
        "available_next_actions", "required_user_action", "error", "recovery",
    ):
        assert field in first

    unchanged = api.put(path, json={"content": "Use the typed path.", "actor": "Counsel"}).json()
    assert unchanged["status"] == "no_change"
    assert unchanged["changed_paths"] == []

    proposal_path = f"{path}/proposals"
    proposed = api.post(proposal_path, json={"content": "Use the proposed path.", "actor": "Themis.ai"}).json()
    proposal_id = proposed["data"]["proposal"]["version_id"]
    assert proposed["status"] == "proposed"
    assert proposed["required_user_action"] == "Accept recommendation update with the direct control."
    assert proposed["entity_refs"][0]["id"] == proposal_id
    repeated = api.post(proposal_path, json={"content": "Use the proposed path.", "actor": "Themis.ai"}).json()
    assert repeated["status"] == "no_change"
    assert repeated["entity_refs"][0]["id"] == proposal_id

    accepted = api.post(f"{path}/accept", json={"actor": "Counsel"}).json()
    assert accepted["status"] == "changed"
    assert accepted["data"]["current_version_id"] == proposal_id
    assert accepted["entity_refs"][0]["id"] == proposal_id


def test_participant_mutation_returns_changed_then_no_change(app_context):
    api = client(app_context)
    path = f"/api/matters/{MATTER_ID}/participants"
    payload = {"name": "Avery Smith", "role": "product", "actor": "Counsel"}

    changed = api.post(path, json=payload).json()
    assert changed["status"] == "changed"
    assert changed["operation"] == "add_participant"
    assert changed["entity_refs"] == [{"type": "participant", "id": "Avery Smith"}]
    assert changed["data"]["participants"][-1] == {"name": "Avery Smith", "role": "product"}

    unchanged = api.post(path, json=payload).json()
    assert unchanged["status"] == "no_change"
    assert unchanged["changed_paths"] == []
    assert unchanged["data"]["participants"] == changed["data"]["participants"]


def test_legacy_recommendation_stays_unversioned_until_explicit_lawyer_save(app_context):
    recommendations = service(app_context)
    path = recommendations.get(MATTER_ID)["path"]
    app_context.vault.write_bytes(path, b"# Recommendations\n\nUse the existing process.\n")

    legacy = recommendations.get(MATTER_ID)
    assert legacy["content"] == "# Recommendations\n\nUse the existing process."
    assert legacy["current_version_id"] is None
    assert legacy["versions"] == []

    saved = recommendations.set_working(
        MATTER_ID, legacy["content"], actor="Counsel", origin="lawyer_edit"
    )

    assert saved["current_version_number"] == 1
    assert saved["versions"][-1]["origin"] == "lawyer_edit"
    assert saved["versions"][-1]["number"] == 1


@pytest.mark.parametrize(
    "method,path_suffix,payload",
    [
        ("get", "", None),
        ("get", "/review", None),
        ("put", "", {"content": "Generic overwrite.", "metadata": {}}),
        ("put", "/review", {"action": "save_untracked", "content": "Untracked overwrite."}),
        ("put", "/review", {
            "action": "save_revision", "content": "Tracked overwrite.",
            "author_id": "author-counsel", "author_name": "Counsel",
        }),
    ],
)
def test_generic_endpoints_reject_legacy_recommendations_without_changing_bytes(
    app_context, method, path_suffix, payload
):
    api = client(app_context)
    path = service(app_context).get(MATTER_ID)["path"]
    original = b"# Recommendations\n\nLegacy recommendation without metadata.\n"
    app_context.vault.write_bytes(path, original)

    request = getattr(api, method)
    kwargs = {"params": {"path": path}}
    if payload is not None:
        kwargs["json"] = payload
    response = request(f"/api/files{path_suffix}", **kwargs)

    assert response.status_code == 400
    assert "typed recommendation endpoint" in response.json()["detail"]
    assert app_context.vault.resolve(path).read_bytes() == original


def test_generic_file_api_still_allows_an_ordinary_editable_note(app_context):
    api = client(app_context)
    path = f"{app_context.matters.matter_path(MATTER_ID)}/documents/ordinary-note.md"
    app_context.vault.write_markdown(path, "# Ordinary note\n\nBefore.", {"record_type": "note"})

    loaded = api.get("/api/files", params={"path": path})
    saved = api.put("/api/files", params={"path": path}, json={
        "content": "# Ordinary note\n\nAfter.", "metadata": {"record_type": "note"},
    })

    assert loaded.status_code == 200
    assert saved.status_code == 200
    assert api.get("/api/files", params={"path": path}).json()["content"] == "# Ordinary note\n\nAfter.\n"
