"""Connected HTTP chat/runner acceptance; fixtures replace only the provider."""
from __future__ import annotations

import asyncio
import copy
import json

import httpx
import pytest
from fastapi import FastAPI

from app.models.workspace import WorkspaceQuestion, ConversationTarget
from app.providers.base import ProviderReply, ProviderToolCall
from app.routers import chat, workspace
from app.tools.registry import ToolExecutionContext

MATTER = "MAT-DEMO-RELAY"
BASE = f"/api/matters/{MATTER}/workspace"


@pytest.fixture
def http_app(app_context):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(chat.router, prefix="/api")
    app.include_router(workspace.router, prefix="/api")
    return app


class Provider:
    def __init__(self, message, calls=(), *, scope="actual", reply="The useful analysis remains available.", hook=None):
        self.message, self.calls, self.scope, self.reply = message, list(calls), scope, reply
        self.seen = []
        self.hook = hook

    async def complete(self, messages, tools=None):
        self.seen.append((copy.deepcopy(messages), copy.deepcopy(tools)))
        index = len(self.seen)
        if index == 1:
            return ProviderReply(tool_calls=[ProviderToolCall(id="scope", name="select_conversation_scope", arguments={"scope": self.scope, "instruction_quote": self.message})])
        if self.hook and index == 2:
            await self.hook()
        if index == 2 and self.calls:
            return ProviderReply(content="Account control changes the analysis.", tool_calls=[ProviderToolCall(id=f"action-{i}", name=name, arguments=args) for i, (name, args) in enumerate(self.calls)])
        return ProviderReply(content=self.reply)


async def turn(client, ctx, message, calls=(), *, key=None, scope="actual", reply="The useful analysis remains available.", extra=None, hook=None):
    provider = Provider(message, calls, scope=scope, reply=reply, hook=hook)
    ctx.runner.provider = provider
    response = await client.post("/api/chat", json={"matter_id": MATTER, "message": message, **({"source_action_key": key} if key else {}), **(extra or {})})
    assert response.status_code == 200, response.text
    return response.json(), provider


def supporting(ctx):
    q = ctx.workspace.business_question(MATTER)
    issue = ctx.workspace.issues(MATTER)[0]
    return ctx.workspace.save_question(MATTER, WorkspaceQuestion(question_id="Q-CONTROL", business_question_id=q["question_id"], business_question_revision=q["revision"], issue_id=issue["issue_id"], text="Who controls the settlement account?"))


def receipts(result):
    return [operation["receipt"] for operation in result["operation_results"] if operation.get("receipt")]


@pytest.mark.asyncio
@pytest.mark.parametrize("message", ["Change the business question to which settlement structure we should use.", "Please make our decision question: Which settlement structure should we use?", "Replace the question we are deciding with which settlement structure we should use."])
async def test_q1_explicit_chat_change_next_context_and_q6_retry(http_app, app_context, message):
    ctx = app_context
    original = ctx.workspace.business_question(MATTER)
    request = ctx.matters.get(MATTER)["original_request"]
    text = "Which settlement structure should we use?"
    calls = [("change_business_question", {"text": text, "instruction_quote": message})]
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=http_app), base_url="http://testserver") as client:
        result, _ = await turn(client, ctx, message, calls, key="q1-retry")
        assert receipts(result)[0]["state"] == "applied"
        current = (await client.get(BASE)).json()
        assert current["question"]["text"] == text
        assert current["question"]["question_id"] == original["question_id"]
        assert ctx.matters.get(MATTER)["original_request"] == request
        retry, _ = await turn(client, ctx, message, calls, key="q1-retry")
        assert receipts(retry)[0]["receipt_id"] == receipts(result)[0]["receipt_id"]
        assert len(ctx.workspace.question_history(MATTER)) == 2
        assert len(ctx.workspace.get(MATTER)["receipts"]) == 1
        _, provider = await turn(client, ctx, "Explain the choice.")
        supplied = json.dumps(provider.seen[0][0])
        assert text in supplied and "Current business question" in supplied


@pytest.mark.asyncio
async def test_q2_proposal_reject_apply_q6_stale_and_restore(http_app, app_context):
    ctx = app_context
    original = ctx.workspace.business_question(MATTER)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=http_app), base_url="http://testserver") as client:
        msg = "We may actually be choosing between two account structures."
        result, _ = await turn(client, ctx, msg, [("propose_business_question", {"text": "Which account structure fits our flow?", "reason": "Two structures are under discussion."})])
        assert receipts(result)[0]["state"] == "proposed"
        assert ctx.workspace.business_question(MATTER)["text"] == original["text"]
        proposal = (await client.get(BASE)).json()["pending_reframes"][0]
        msg = "Reject that proposed question."
        await turn(client, ctx, msg, [("act_on_question_proposal", {"proposal_id": proposal["proposal_id"], "action": "reject", "instruction_quote": msg})])
        assert (await client.get(BASE)).json()["question_changes"][0]["state"] == "rejected"
        msg = "Maybe the question is which account design works."
        await turn(client, ctx, msg, [("propose_business_question", {"text": "Which account design works?", "reason": "Account choice"})])
        proposal = (await client.get(BASE)).json()["pending_reframes"][0]
        before = ctx.dossiers.get(MATTER)["content"]
        msg = "Apply the proposed account-design question."
        await turn(client, ctx, msg, [("act_on_question_proposal", {"proposal_id": proposal["proposal_id"], "action": "apply", "instruction_quote": msg})])
        after = ctx.dossiers.get(MATTER)["content"]
        assert ctx.dossiers._remove_section(before, "Decision question") == ctx.dossiers._remove_section(after, "Decision question")
        msg = "Undo the last question change."
        await turn(client, ctx, msg, [("restore_business_question", {"revision": original["revision"], "instruction_quote": msg})])
        restored = ctx.workspace.business_question(MATTER)
        assert restored["text"] == original["text"] and restored["revision"] != original["revision"]
        msg = "Maybe ask about licensing instead."
        await turn(client, ctx, msg, [("propose_business_question", {"text": "Do we need a license?", "reason": "Alternative scope"})])
        proposal = (await client.get(BASE)).json()["pending_reframes"][0]
        edited = await client.patch(BASE + "/business-question", json={"text": "Which bank partner fits?", "expected_revision": restored["revision"], "source_action_key": "direct-edit"})
        assert edited.status_code == 200
        conflict = await client.patch(BASE + f"/business-question/proposals/{proposal['proposal_id']}", json={"action": "apply", "expected_revision": restored["revision"], "source_action_key": "stale-apply"})
        assert conflict.status_code == 409
        assert ctx.workspace.business_question(MATTER)["text"] == "Which bank partner fits?"


@pytest.mark.asyncio
@pytest.mark.parametrize("message", ["Only the bank can move money from that account.", "The bank has sole withdrawal control.", "Our company cannot release funds; the bank does that."])
async def test_q4_prose_answer_links_reported_fact_trusted_message_and_next_context(http_app, app_context, message):
    ctx = app_context
    question = supporting(ctx)
    issue_before = ctx.workspace.issues(MATTER)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=http_app), base_url="http://testserver") as client:
        result, _ = await turn(client, ctx, message, [("answer_workspace_question", {"question_id": question["question_id"], "expected_revision": question["source_revision"], "state": "answered", "answer": message, "instruction_quote": message, "source_message_id": "FORGED"})])
        assert receipts(result)[0]["state"] == "applied"
        answered = (await client.get(BASE)).json()["questions"][0]
        assert answered["question_id"] == question["question_id"] and answered["state"] == "answered"
        assert answered["answer_origin"] == "reported"
        user = ctx.chat_history.get(MATTER, result["conversation_id"])["messages"][0]
        assert answered["source_message_id"] == user["message_id"] != "FORGED"
        fact = next(f for f in ctx.matter_records.get(MATTER)["facts"] if f["fact_id"] in answered["linked_fact_ids"])
        assert user["message_id"] in fact["source_ids"]
        assert ctx.workspace.issues(MATTER) == issue_before
        _, provider = await turn(client, ctx, "How does that change the analysis?")
        context = json.dumps(provider.seen[0][0])
        assert message in context and question["question_id"] in context and "reported" in context


@pytest.mark.asyncio
async def test_q5_scenario_runner_and_executor_deny_mutations_and_alias_then_adopt(http_app, app_context):
    ctx = app_context
    question = supporting(ctx)
    before = ctx.workspace.business_question(MATTER)
    facts = ctx.matter_records.get(MATTER)["facts"]
    msg = "What if the bank alone controlled that settlement account?"
    mutations = [("answer_workspace_question", {"question_id": question["question_id"], "expected_revision": question["source_revision"], "state": "answered", "answer": "Bank alone", "instruction_quote": msg}), ("write_markdown", {"path": ctx.matters.matter_path(MATTER) + "/facts.md", "content": "hypothesis"}), ("run_research", {"question": "hypothesis"}), ("select_conversation_scope", {"scope": "actual", "instruction_quote": msg})]
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=http_app), base_url="http://testserver") as client:
        result, provider = await turn(client, ctx, msg, mutations, scope="scenario", reply="If only the bank controls releases, the custody analysis changes.")
        assert "custody analysis" in result["reply"]
        assert ctx.workspace.business_question(MATTER) == before
        assert ctx.matter_records.get(MATTER)["facts"] == facts
        assert {t["function"]["name"] for t in provider.seen[1][1]} == {"list_files", "read_file", "search_vault", "workspace_action"}
        assert next(t for t in provider.seen[1][1] if t["function"]["name"] == "workspace_action")["function"]["parameters"]["properties"]["action"]["enum"] == ["save_scenario"]
        agent = ctx.agents.get("counsel-copilot")
        for name in ["write_markdown", "run_research", "save_fact_alias", "change_business_question"]:
            blocked = await ctx.tools.execute(agent, ToolExecutionContext(app=ctx, matter_id=MATTER, scope_state={"scope": "scenario"}), name, {})
            assert blocked.status == "error"
        msg = "That is the actual arrangement. Record my answer: the bank alone controls releases."
        adopted, _ = await turn(client, ctx, msg, [("answer_workspace_question", {"question_id": question["question_id"], "expected_revision": question["source_revision"], "state": "answered", "answer": "The bank alone controls releases.", "instruction_quote": msg})])
        assert receipts(adopted)[0]["state"] == "applied"
        assert len(ctx.matter_records.get(MATTER)["facts"]) == len(facts) + 1


@pytest.mark.asyncio
async def test_q7_leave_open_and_partial_failure_retry_keeps_one_fact(http_app, app_context, monkeypatch):
    ctx = app_context
    question = supporting(ctx)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=http_app), base_url="http://testserver") as client:
        msg = "I don't know yet; leave that open."
        result, _ = await turn(client, ctx, msg, [("answer_workspace_question", {"question_id": question["question_id"], "expected_revision": question["source_revision"], "state": "left_open", "instruction_quote": msg})])
        question = (await client.get(BASE)).json()["questions"][0]
        assert question["state"] == "left_open" and not question["linked_fact_ids"]
        assert "useful analysis" in result["reply"]
        original_write = ctx.vault.write_markdown
        def fail_workspace(path, *args, **kwargs):
            if str(path).endswith("/workspace.md"):
                raise OSError("Disk write failed")
            return original_write(path, *args, **kwargs)
        monkeypatch.setattr(ctx.vault, "write_markdown", fail_workspace)
        msg = "The bank controls all withdrawals."
        calls = [("answer_workspace_question", {"question_id": question["question_id"], "expected_revision": question["source_revision"], "state": "answered", "answer": msg, "instruction_quote": msg})]
        result, _ = await turn(client, ctx, msg, calls, key="partial-answer")
        assert receipts(result)[0]["state"] == "not_saved"
        assert receipts(result)[0]["completed_parts"] == ["reported_fact"]
        assert "Fact saved. Question update not saved." in result["reply"]
        assert "useful analysis" in result["reply"]
        count = len(ctx.matter_records.get(MATTER)["facts"])
        monkeypatch.setattr(ctx.vault, "write_markdown", original_write)
        retried, _ = await turn(client, ctx, msg, calls, key="partial-answer")
        assert receipts(retried)[0]["state"] == "applied"
        assert len(ctx.matter_records.get(MATTER)["facts"]) == count


@pytest.mark.asyncio
async def test_q3_active_queued_chat_freezes_target_and_late_research_is_historical(http_app, app_context):
    ctx = app_context
    initial = ctx.workspace.business_question(MATTER)
    entered, release = asyncio.Event(), asyncio.Event()
    async def wait_for_edit():
        entered.set()
        await release.wait()
    msg = "Change the question to the old scope."
    ctx.runner.provider = Provider(msg, [("change_business_question", {"text": "Old scope", "instruction_quote": msg})], hook=wait_for_edit)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=http_app), base_url="http://testserver") as client:
        run = (await client.post(f"/api/matters/{MATTER}/chat-runs", json={"message": msg})).json()
        await asyncio.wait_for(entered.wait(), 5)
        await client.patch(BASE + "/business-question", json={"text": "Lawyer's current question", "expected_revision": initial["revision"], "source_action_key": "q3-direct"})
        summary = ctx.dossiers.orientation(MATTER)["summary"]
        release.set()
        await ctx.chat_runs.wait(run["run_id"])
        saved_run = ctx.chat_runs.get(MATTER, run["run_id"])
        assert saved_run["request"]["expected_question_revision"] == initial["revision"]
        assert saved_run["request"]["target"]["business_question_revision"] == initial["revision"]
        assert ctx.workspace.business_question(MATTER)["text"] == "Lawyer's current question"
        assert "useful analysis" in saved_run["response"]["reply"]
        _, provider = await turn(client, ctx, "Explain our current scope.")
        assert "Lawyer's current question" in json.dumps(provider.seen[0][0])
        # Exercise the real research-run -> ResearchService -> runner -> dossier path.
        entered.clear(); release.clear()
        class ResearchProvider:
            async def complete(self, messages, tools=None):
                entered.set(); await release.wait()
                return ProviderReply(content="## Matter summary\nOld research summary\n\n## Analysis\nUseful old-scope analysis.")
        ctx.runner.provider = ResearchProvider()
        ctx.research_runs.resolve_agent = lambda: ctx.runner.resolve("research-agent")
        ctx.research_runs.resolve_selection = lambda selection: ctx.runner.resolve("research-agent")
        research = ctx.research_runs.start(MATTER, ["Account control"], source_action_key="q3-research")
        await asyncio.wait_for(entered.wait(), 5)
        previous = ctx.workspace.business_question(MATTER)
        await client.patch(BASE + "/business-question", json={"text": "Newest lawyer question", "expected_revision": previous["revision"], "source_action_key": "q3-newer"})
        summary = ctx.dossiers.orientation(MATTER)["summary"]
        release.set()
        await ctx.research_runs.wait(research["run_id"])
        done = ctx.research_runs.get(MATTER, research["run_id"])
        assert done["state"] == "completed"
        assert done["results"][0]["orientation_state"] == "historical"
        assert ctx.workspace.business_question(MATTER)["text"] == "Newest lawyer question"
        assert ctx.dossiers.orientation(MATTER)["summary"] == summary
        assert ctx.vault.exists(done["results"][0]["path"])


@pytest.mark.asyncio
async def test_q3_later_intake_preserves_question_and_summary(http_app, app_context):
    ctx = app_context
    current = ctx.workspace.business_question(MATTER)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=http_app), base_url="http://testserver") as client:
        await client.patch(BASE + "/business-question", json={"text": "Choose the settlement structure.", "expected_revision": current["revision"], "source_action_key": "intake-owner"})
        summary = ctx.dossiers.orientation(MATTER)["summary"]
        message = "Continue the intake analysis from the available facts."
        await turn(client, ctx, message, [("update_matter_intake", {"working_ask": "Can we launch the original flow?", "dossier_orientation": "Old-scope intake summary.", "intake_state": "complete"})], extra={"agent_id": "intake-agent"})
        assert ctx.workspace.business_question(MATTER)["text"] == "Choose the settlement structure."
        assert ctx.dossiers.orientation(MATTER)["summary"] == summary


@pytest.mark.asyncio
async def test_q4_ambiguous_prose_asks_one_question_without_fact(http_app, app_context):
    ctx = app_context
    supporting(ctx)
    facts = ctx.matter_records.get(MATTER)["facts"]
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=http_app), base_url="http://testserver") as client:
        result, _ = await turn(client, ctx, "They handle it.", reply="Does ‘they’ mean the bank or your company? Meanwhile, withdrawal control remains the material distinction.")
        assert result["reply"].count("?") == 1
        assert ctx.matter_records.get(MATTER)["facts"] == facts
        assert ctx.workspace.questions(MATTER)[0]["state"] == "open"


@pytest.mark.asyncio
async def test_q6_model_cannot_use_new_payload_for_same_action_key(http_app, app_context):
    ctx = app_context
    msg = "Change our question to the settlement structure."
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=http_app), base_url="http://testserver") as client:
        await turn(client, ctx, msg, [("change_business_question", {"text": "Which settlement structure?", "instruction_quote": msg})], key="fixed-question-action")
        result, _ = await turn(client, ctx, msg, [("change_business_question", {"text": "Which license?", "instruction_quote": msg})], key="fixed-question-action")
        assert any(item["status"] == "failed" for item in result["operation_results"])
        assert ctx.workspace.business_question(MATTER)["text"] == "Which settlement structure?"
        assert len(ctx.workspace.question_history(MATTER)) == 2
        reused = await client.post("/api/chat", json={"matter_id": MATTER, "message": "Change to another question.", "source_action_key": "fixed-question-action"})
        assert reused.status_code == 409


@pytest.mark.asyncio
async def test_q5_saved_scenario_and_recovery_remain_read_only(http_app, app_context):
    from app.agents.runner import RunnerExecutionState
    from app.models.api import ChatRequest
    ctx = app_context
    scenario_id = "SCN-READONLY"
    ctx.vault.write_markdown(f"{ctx.matters.matter_path(MATTER)}/scenarios/{scenario_id}.md", "# Hypothetical bank control\n", {"matter_id": MATTER, "scenario_id": scenario_id})
    target = ConversationTarget(matter_id=MATTER, scenario_id=scenario_id)
    message = "Could that arrangement work?"
    ctx.runner.provider = Provider(message, [("write_markdown", {"path": ctx.matters.matter_path(MATTER) + "/escape.md", "content": "bad"})], scope="actual")
    response = await ctx.runner.run(ChatRequest(matter_id=MATTER, message=message, target=target), execution_state=RunnerExecutionState(scope_state={"scope": "scenario"}))
    assert not ctx.vault.exists(ctx.matters.matter_path(MATTER) + "/escape.md")
    assert "useful analysis" in response.reply
    # Also hit the HTTP path with an already selected scenario.
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=http_app), base_url="http://testserver") as client:
        result, provider = await turn(client, ctx, message, [("run_research", {"question": "control"})], extra={"target": target.model_dump()})
        assert all({t["function"]["name"] for t in tools} <= {"list_files", "read_file", "search_vault", "workspace_action"} for _, tools in provider.seen)
        assert all(t["function"]["parameters"]["properties"]["action"]["enum"] == ["save_scenario"] for _, tools in provider.seen for t in tools if t["function"]["name"] == "workspace_action")
        assert not result["cards"]


@pytest.mark.asyncio
async def test_generic_note_tools_cannot_create_or_replace_workspace_records_or_aliases(app_context):
    ctx = app_context
    base = ctx.matters.matter_path(MATTER)
    # A custom alias must receive the handler's same canonical path checks.
    ctx.vault.write_markdown("00_System/tools/note_alias.md", "# Note alias", {"tool_id": "note_alias", "handler": "write_markdown"})
    ctx.vault.write_markdown("00_System/agents/note-agent.md", "# Note agent", {"agent_id": "note-agent", "name": "Note agent", "allowed_tools": ["note_alias", "write_markdown"]})
    agent = ctx.agents.get("note-agent")
    context = ToolExecutionContext(app=ctx, matter_id=MATTER, scope_state={"scope": "actual"})
    for leaf in ["workspace.md", "flow.md", "dossier.md", "dossier-revisions/new.md", "scenarios/new.md", "workspace-revisions/new.md", "flow-revisions/new.md"]:
        path = f"{base}/{leaf}"
        before = ctx.vault.read_text(path) if ctx.vault.exists(path) else None
        for tool in ["write_markdown", "note_alias"]:
            result = await ctx.tools.execute(agent, context, tool, {"path": path, "content": "forged", "metadata": {"snapshot": {"short_answer": "forged"}}})
            assert result.status == "error"
            assert (ctx.vault.read_text(path) if ctx.vault.exists(path) else None) == before
    ctx.vault.resolve(f"{base}/scenarios").mkdir(exist_ok=True)
    ctx.vault.resolve(f"{base}/scenario-link").symlink_to(ctx.vault.resolve(f"{base}/scenarios"), target_is_directory=True)
    result = await ctx.tools.execute(agent, context, "note_alias", {"path": f"{base}/scenario-link/escape.md", "content": "forged"})
    assert result.status == "error"
    result = await ctx.tools.execute(agent, context, "note_alias", {"path": f"{base}/notes/ordinary.md", "content": "Useful ordinary note."})
    assert result.status == "success"
    assert "Useful ordinary note" in ctx.vault.read_text(f"{base}/notes/ordinary.md")


@pytest.mark.asyncio
async def test_q6_queued_submission_replay_reuses_original_run(http_app, app_context):
    ctx = app_context
    message = "Change the question to which account structure fits."
    entered, release = asyncio.Event(), asyncio.Event()
    async def wait_for_release():
        entered.set()
        await release.wait()
    ctx.runner.provider = Provider(message, [("change_business_question", {"text": "Which account structure fits?", "instruction_quote": message})], hook=wait_for_release)
    payload = {"message": message, "source_action_key": "queued-repeat"}
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=http_app), base_url="http://testserver") as client:
        original = (await client.post(f"/api/matters/{MATTER}/chat-runs", json=payload)).json()
        await asyncio.wait_for(entered.wait(), 5)
        active = (await client.post(f"/api/matters/{MATTER}/chat-runs", json=payload)).json()
        assert active["run_id"] == original["run_id"] and active["state"] == "running"
        release.set()
        await ctx.chat_runs.wait(original["run_id"])
        again = (await client.post(f"/api/matters/{MATTER}/chat-runs", json=payload)).json()
        assert original["run_id"] == again["run_id"]
        assert len(ctx.workspace.get(MATTER)["receipts"]) == 1
        messages = ctx.chat_history.get(MATTER, original["conversation_id"])["messages"]
        assert sum(m["role"] == "user" for m in messages) == 1
        conflict = await client.post(f"/api/matters/{MATTER}/chat-runs", json={**payload, "message": "Change the question to another scope."})
        assert conflict.status_code == 409
        assert len(ctx.workspace.get(MATTER)["receipts"]) == 1


@pytest.mark.asyncio
async def test_q5_direct_scenario_retry_cannot_unlock_actual_scope(http_app, app_context):
    ctx = app_context
    question = supporting(ctx)
    before = ctx.matter_records.get(MATTER)["facts"]
    msg = "What if the bank controls all withdrawals?"
    calls = [("answer_workspace_question", {"question_id": question["question_id"], "expected_revision": question["source_revision"], "state": "answered", "answer": "Bank controls withdrawals", "instruction_quote": msg})]
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=http_app), base_url="http://testserver") as client:
        await turn(client, ctx, msg, scope="scenario", key="scenario-retry")
        _, provider = await turn(client, ctx, msg, calls, scope="actual", key="scenario-retry")
        assert ctx.matter_records.get(MATTER)["facts"] == before
        assert all({t["function"]["name"] for t in tools} <= {"list_files", "read_file", "search_vault", "workspace_action"} for _, tools in provider.seen)
        assert all(t["function"]["parameters"]["properties"]["action"]["enum"] == ["save_scenario"] for _, tools in provider.seen for t in tools if t["function"]["name"] == "workspace_action")
