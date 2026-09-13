from __future__ import annotations

import json

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.models.api import ChatRequest
from app.providers.base import ProviderReply
from app.routers import matters
from app.services.chat_runs import ChatRunService
from app.services.workspace_actions import extract_claim_support


MATTER = "MAT-DEMO-RELAY"


def test_runtime_connects_review_after_scenario_service(app_context):
    assert app_context.workspace_review.scenarios is app_context.workspace_scenarios


def test_claim_support_transport_keeps_prose_and_malformed_output_useful():
    text = "Useful answer.\n\n```claim-support\n{\"claims\": [{\"claim_id\": \"CLM-1\"}]}\n```"
    prose, structure, warnings = extract_claim_support(text)
    assert prose == "Useful answer."
    assert structure == {"claims": [{"claim_id": "CLM-1"}]}
    assert warnings == []

    malformed = "Useful answer.\n\n```claim-support\n{bad json}\n```"
    prose, structure, warnings = extract_claim_support(malformed)
    assert prose == malformed
    assert structure is None
    assert warnings


def test_issue_mitigation_creates_canonical_work_without_closing_issue_or_matter(app_context):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(matters.router, prefix="/api")
    client = TestClient(app)
    issue = app_context.workspace.issues(MATTER)[0]
    matter_before = app_context.matters.get(MATTER)
    decisions_before = app_context.index.list_decisions(MATTER)
    disposition_before = issue.get("disposition")

    response = client.post(
        f"/api/matters/{MATTER}/work-items",
        json={
            "matter_id": MATTER,
            "title": "Confirm child-audience controls",
            "description": "Review the product controls before launch.",
            "item_type": "mitigation",
            "status": "open",
            "priority": "normal",
            "owner": "Alex Morgan",
            "required": True,
            "issue_id": issue["issue_id"],
            "source_action_key": "integration-mitigation-work",
        },
    )
    assert response.status_code == 201
    saved = response.json()
    expected_path = f"{matter_before['path']}/work-items/{saved['work_item_id']}.md"
    assert saved["path"] == expected_path
    assert saved["issue_id"] == issue["issue_id"]
    assert saved["owner"] == "Alex Morgan"
    assert saved["required"] is True
    assert saved["status"] == "open"

    completed = client.post(
        f"/api/matters/{MATTER}/work-items/complete",
        json={"work_item_id": saved["work_item_id"], "actor": "Alex Morgan"},
    )
    assert completed.status_code == 200
    assert app_context.matters.get(MATTER)["status"] == matter_before["status"]
    assert app_context.workspace.issues(MATTER)[0].get("disposition") == disposition_before
    assert app_context.index.list_decisions(MATTER) == decisions_before

    wrong_issue = client.post(
        f"/api/matters/{MATTER}/work-items",
        json={
            "matter_id": MATTER,
            "title": "Invalid issue work",
            "issue_id": "ISS-NOT-IN-MATTER",
        },
    )
    assert wrong_issue.status_code == 422

    blank_owner = client.post(
        f"/api/matters/{MATTER}/work-items",
        json={
            "matter_id": MATTER,
            "title": "Unowned mitigation",
            "description": "This required work needs an owner.",
            "item_type": "mitigation",
            "required": True,
            "issue_id": issue["issue_id"],
            "owner": "   ",
        },
    )
    assert blank_owner.status_code == 422

    for missing_issue in (None, "   "):
        unlinked = client.post(
            f"/api/matters/{MATTER}/work-items",
            json={
                "matter_id": MATTER,
                "title": "Unlinked mitigation",
                "description": "This work must stay linked to its issue.",
                "item_type": "mitigation",
                "required": True,
                "issue_id": missing_issue,
                "owner": "Alex Morgan",
            },
        )
        assert unlinked.status_code == 422


def test_scenario_result_keeps_original_baseline_and_optional_fields(app_context):
    scenario = app_context.workspace_scenarios.save(
        MATTER,
        {
            "title": "Settlement control changes",
            "issue_ids": [app_context.workspace.issues(MATTER)[0]["issue_id"]],
            "proposed_fact_changes": [
                {"change_id": "CHANGE-1", "text": "The partner controls settlement."}
            ],
        },
        source_action_key="integration-create",
    )
    baseline = dict(scenario["baseline_revisions"])
    running = app_context.workspace_scenarios.begin_analysis(
        MATTER,
        scenario["scenario_id"],
        {
            "instruction": "Analyze this saved assumption.",
            "expected_scenario_revision": scenario["revision"],
            "baseline_revisions": baseline,
            "source_action_key": "integration-analysis",
        },
    )
    app_context.workspace_scenarios.bind_analysis_run(
        MATTER,
        scenario["scenario_id"],
        source_action_key="integration-analysis",
        run_id="RUN-INTEGRATION",
    )
    saved = app_context.workspace_scenarios.persist_analysis(
        MATTER,
        scenario["scenario_id"],
        "The control conclusion changes if the partner controls settlement.",
        expected_revision=running["scenario"]["revision"],
        source_action_key="integration-analysis",
        run_id="RUN-INTEGRATION",
        analysis_baseline_revisions=baseline,
        affected_issue_ids=scenario["issue_ids"],
        affected_branch_ids=["fact:FACT-CONTROL"],
        claim_ids=[],
        proposed_outcomes=[
            {
                "outcome_id": "OUTCOME-1",
                "label": "Review the partner control route.",
                "issue_ids": scenario["issue_ids"],
                "work_item_ids": [],
            }
        ],
        unresolved_conditions=["The agreement is not signed."],
        source_links=["03_Matters/relay/sources/agreement.md"],
    )
    assert saved["analysis_state"] == "completed"
    assert saved["analysis_run_id"] == "RUN-INTEGRATION"
    assert saved["analysis_baseline_revisions"] == baseline
    assert saved["affected_issue_ids"] == scenario["issue_ids"]
    assert saved["affected_branch_ids"] == ["fact:FACT-CONTROL"]
    assert saved["proposed_outcomes"][0]["label"] == "Review the partner control route."
    assert saved["unresolved_conditions"] == ["The agreement is not signed."]
    assert saved["source_links"] == ["03_Matters/relay/sources/agreement.md"]
    assert app_context.workspace.issues(MATTER)[0].get("disposition") is None


def test_failed_run_reconciles_only_its_frozen_scenario_operation(app_context, monkeypatch):
    calls: list[dict[str, object]] = []
    monkeypatch.setattr(
        app_context.workspace_scenarios,
        "fail_analysis",
        lambda matter_id, scenario_id, **values: calls.append(
            {"matter_id": matter_id, "scenario_id": scenario_id, **values}
        ),
    )
    service = ChatRunService(app_context.vault, app_context)
    service._fail_scenario_analysis(
        {
            "matter_id": MATTER,
            "run_id": "RUN-FAILED",
            "request": {
                "source_action_key": "analysis-key",
                "target": {"matter_id": MATTER, "scenario_id": "SCN-1"},
            },
        },
        "Provider failed.",
    )
    service._fail_scenario_analysis(
        {
            "matter_id": MATTER,
            "run_id": "RUN-NORMAL",
            "request": {"source_action_key": "chat-key", "target": {"matter_id": MATTER}},
        },
        "Provider failed.",
    )
    assert calls == [
        {
            "matter_id": MATTER,
            "scenario_id": "SCN-1",
            "source_action_key": "analysis-key",
            "failure_detail": "Provider failed.",
            "run_id": "RUN-FAILED",
        }
    ]


@pytest.mark.asyncio
async def test_scenario_chat_drops_invalid_optional_rows_and_unrequested_sources(app_context):
    issue_id = app_context.workspace.issues(MATTER)[0]["issue_id"]
    app_context.matter_records.apply_update(
        MATTER,
        sources=[
            {"source_id": "SRC-UNRELATED-A", "kind": "url", "label": "Unrelated A", "url": "https://example.test/a"},
            {"source_id": "SRC-UNRELATED-B", "kind": "url", "label": "Unrelated B", "url": "https://example.test/b"},
        ],
    )
    scenario = app_context.workspace_scenarios.save(
        MATTER,
        {"title": "Invalid optional result", "issue_ids": [issue_id]},
        source_action_key="invalid-result-create",
    )
    command = {
        "instruction": "Analyze the conditional route.",
        "expected_scenario_revision": scenario["revision"],
        "baseline_revisions": scenario["baseline_revisions"],
        "source_action_key": "invalid-result-analysis",
    }
    app_context.workspace_scenarios.begin_analysis(MATTER, scenario["scenario_id"], command)
    transport = {
        "claims": [],
        "proposed_outcomes": [
            {
                "outcome_id": "OUTCOME-BAD-WORK",
                "label": "Use work that does not exist.",
                "issue_ids": [issue_id],
                "work_item_ids": ["WORK-NOT-IN-MATTER"],
            },
            {"outcome_id": "OUTCOME-MALFORMED"},
        ],
    }

    class ScenarioProvider:
        async def complete(self, messages, tools=None):
            return ProviderReply(
                content=(
                    "Useful conditional analysis remains visible.\n\n"
                    "```claim-support\n"
                    + json.dumps(transport)
                    + "\n```"
                )
            )

    app_context.runner.provider = ScenarioProvider()
    started = app_context.chat_runs.start(
        MATTER,
        ChatRequest(
            matter_id=MATTER,
            message="Analyze only this saved hypothetical.",
            target={"matter_id": MATTER, "scenario_id": scenario["scenario_id"]},
            workspace_action="analyze_scenario",
            source_action_key=command["source_action_key"],
        ),
    )
    app_context.workspace_scenarios.bind_analysis_run(
        MATTER,
        scenario["scenario_id"],
        source_action_key=command["source_action_key"],
        run_id=started["run_id"],
    )
    await app_context.chat_runs.wait(started["run_id"])

    run = app_context.chat_runs.get(MATTER, started["run_id"])
    saved = app_context.workspace_scenarios.get(MATTER, scenario["scenario_id"])
    assert run["state"] == "completed"
    assert run["response"]["reply"] == "Useful conditional analysis remains visible."
    assert any(item["operation"] == "save_scenario_analysis" and item["status"] == "changed"
               for item in run["response"]["operation_results"])
    assert saved["analysis_state"] == "completed"
    assert saved["proposed_outcomes"] == []
    assert saved["source_links"] == []
    assert len(app_context.matter_records.get(MATTER)["sources"]) >= 2
