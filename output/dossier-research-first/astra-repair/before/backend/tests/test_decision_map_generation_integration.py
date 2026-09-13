"""Exercise real inquiry HTTP, runner and publication; double only the provider."""
import json

import httpx
import pytest
from fastapi import FastAPI

from app.providers.base import ProviderReply, ProviderToolCall
from app.routers import chat, workspace


@pytest.mark.asyncio
async def test_issue_action_publishes_paths_and_malformed_followup_retains_them(app_context):
    ctx = app_context
    matter_id = "MAT-DEMO-BEACON"
    issue_id = ctx.workspace.issues(matter_id)[0]["issue_id"]
    fact_id = ctx.workspace.records.get(matter_id)["facts"][0]["fact_id"]
    analysis = {
        "issue_id": issue_id, "explanation": "Timing changes the available release path.",
        "tests": [{"test_id": "timing", "title": "Screen before release", "kind": "contract", "condition_ids": ["before"], "claim_ids": ["CLM-TIMING"]}],
        "conditions": [{"condition_id": "before", "question": "Is screening complete?", "assessment": "unknown", "fact_ids": [fact_id]}],
        "options": [
            {"option_id": "release", "title": "Release after screening", "requirements": [{"condition_id": "before", "state": "met"}], "combination": "all"},
            {"option_id": "wait", "title": "Wait for screening", "requirements": [{"condition_id": "before", "state": "not_met"}], "combination": "all"},
        ],
    }

    class Provider:
        def __init__(self, reply):
            self.reply, self.calls = reply, 0

        async def complete(self, messages, tools=None):
            self.calls += 1
            if self.calls == 1:
                return ProviderReply(tool_calls=[ProviderToolCall(
                    id="actual-scope", name="select_conversation_scope",
                    arguments={"scope": "actual", "instruction_quote": "Explain this issue."},
                )])
            return ProviderReply(content=self.reply)

    application = FastAPI()
    application.state.context = ctx
    for router in (chat.router, workspace.router):
        application.include_router(router, prefix="/api")
    before_decisions = ctx.decisions.list()
    before_disposition = ctx.workspace.issues(matter_id)[0].get("disposition")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=application), base_url="http://test") as client:
        for index, prose in enumerate((
            "Useful conditional answer.\n\n```decision-paths\n" + json.dumps({"issue_analysis": analysis}) + "\n```\n\n```claim-support\n"
            + json.dumps({"claims": [{"claim_id": "CLM-TIMING", "text": "Useful conditional answer.", "support_gap": "Fictional example; source support is not supplied."}]}) + "\n```",
            "Useful follow-up even though structure failed.\n\n```decision-paths\n{invalid}\n```",
        )):
            provider = Provider(prose)
            ctx.runner.provider = provider
            response = await client.post(f"/api/matters/{matter_id}/workspace/actions", json={
                "action": "explain", "instruction": "Explain this issue.",
                "target": {"matter_id": matter_id, "issue_id": issue_id},
                "source_action_key": f"map-generation-http-{index}",
            })
            assert response.status_code == 200, response.text
            run_id = response.json()["run_id"]
            await ctx.chat_runs.wait(run_id)
            run = ctx.chat_runs.get(matter_id, run_id)
            assert run["state"] == "completed", run.get("failure_detail")
            assert provider.calls >= 2
            assert "Useful" in run["response"]["reply"]
            status = ctx.issue_analysis.resolve(matter_id, issue_id)
            assert status["state"] == "saved", status
            assert len(status["analysis"]["options"]) == 2
            assert status["analysis"]["conditions"][0]["assessment"] == "unknown"
            if index == 0:
                reference = status["reference"]
                output = ctx.vault.read_markdown(reference["source_path"])
                assert "Useful conditional answer." in output["content"]
                assert "decision-paths" not in output["content"]
                assert "claim-support" not in output["content"]
                assert status["analysis"]["source_revisions"]["claim:CLM-TIMING"] == reference["output_revision"]
                assert output["metadata"]["claims"][0]["claim_id"] == "CLM-TIMING"
                assert output["metadata"]["claims"][0]["output_revision"] == reference["output_revision"]
            else:
                assert status["reference"] == reference
        assert ctx.decisions.list() == before_decisions
        assert ctx.workspace.issues(matter_id)[0].get("disposition") == before_disposition


@pytest.mark.asyncio
async def test_research_runner_publishes_analysis_with_only_provider_doubled(app_context):
    ctx = app_context
    matter_id = "MAT-DEMO-BEACON"
    issue_id = ctx.workspace.issues(matter_id)[0]["issue_id"]
    calls = []

    class Provider:
        async def complete(self, messages, tools=None):
            calls.append(messages)
            return ProviderReply(content="Useful research answer.\n\n```decision-paths\n" + json.dumps({
                "issue_analysis": {
                    "issue_id": issue_id, "explanation": "Research keeps the unanswered condition visible.",
                    "tests": [{"test_id": "rule", "title": "Timing rule", "condition_ids": ["timing"]}],
                    "conditions": [{"condition_id": "timing", "question": "Is timing confirmed?", "assessment": "unknown"}],
                    "options": [{"option_id": "clarify", "title": "Confirm timing", "kind": "clarify", "remaining_work": ["Ask Product for timing evidence."]}],
                },
            }) + "\n```")

    ctx.runner.provider = Provider()
    result = await ctx.research.run(matter_id, "Which timing rule applies?", issue_id=issue_id, change_stage=False, run_id="RUN-provider-only-research")
    assert calls
    saved = ctx.issue_analysis.resolve(matter_id, issue_id)
    assert saved["state"] == "saved", saved
    assert saved["analysis"]["run_id"] == "RUN-provider-only-research"
    assert saved["analysis"]["conditions"][0]["assessment"] == "unknown"
    packet = ctx.vault.read_markdown(result["path"])
    assert "Useful research answer." in packet["content"]
    assert "decision-paths" not in packet["content"]
