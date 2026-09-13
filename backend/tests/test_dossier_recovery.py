"""Recovery must make progress without discarding saved work or looping forever."""
import asyncio

import pytest

from app.services.research_checkpoints import ResearchCheckpoints
from tests.test_dossier_request_lifecycle import (
    MATTER, CountingProvider, _install, _issue_ids, _prepared,
    _prime_running_parent, _wait,
)


@pytest.mark.asyncio
@pytest.mark.parametrize("interrupted", [False, True])
async def test_resume_completed_parent_with_partial_child_gets_time_and_keeps_usage(app_context, interrupted):
    app = app_context
    ids = _issue_ids(app, 2)
    status = _prepared(app, ids, action="exhausted-recovery")
    children = _prime_running_parent(app, status, ids)
    provider = CountingProvider()
    _install(app, provider)
    await app.research_runs.launch_managed_child(MATTER, children[0]["run_id"])
    checks = ResearchCheckpoints(app.research_runs)
    failed_id = children[1]["run_id"]
    cp = checks.load(MATTER, failed_id)
    used_time, used_calls = (22.6, 2) if interrupted else (600.12, 13)
    cp["budget_used"].update(active_seconds=used_time, main_calls=used_calls)
    if interrupted:
        cp["active_time_reservation"] = 487.4
    else:
        cp.update(final_attempt_started=True, final_call_key="main:lost", analysis_failure="AgentExecutionError")
    cp["pending_calls"] = [
        {"key": "main:lost", "request_digest": "main:lost", "state": "outcome_unknown", "error_class": "TimeoutError", "attempts": 1},
        {"key": "request:saved", "request_digest": "saved", "state": "completed", "result_ref": {"candidates": []}},
    ]
    cp["completed_call_keys"] = ["request:saved"]
    checks.save(MATTER, failed_id, cp, expected_sequence=cp["sequence"])
    child_state = "interrupted" if interrupted else "partial"
    app.research_runs._write(MATTER, failed_id, state="interrupted" if interrupted else "completed", managed_state=child_state)
    record = app.dossier_requests.get_record(MATTER, status["request_id"])
    md = record["metadata"]
    md.update(state="interrupted" if interrupted else "completed", phase="finished")  # Legacy parents incorrectly say complete.
    md["issues"][ids[0]]["state"] = "saved"
    md["issues"][ids[1]]["state"] = child_state
    app.dossier_requests.save_record(MATTER, status["request_id"], metadata=md, expected_sequence=None)
    before = provider.research_calls
    current = app.dossier_requests.get(MATTER, status["request_id"])
    resumed = await app.dossier_requests.resume(
        MATTER, status["request_id"], expected_sequence=current["sequence"],
        retry_issue_ids=[ids[1]], retry_unknown=True,
    )
    assert resumed["state"] == "running"
    fresh = app.research_runs.get(MATTER, failed_id)
    assert fresh["investigation_limits"]["active_seconds"] == fresh["checkpoint"]["budget_used"]["active_seconds"] + 600
    await _wait(app)
    final = app.dossier_requests.get(MATTER, status["request_id"])
    assert final["state"] == "completed"
    assert all(issue["state"] == "saved" for issue in final["issues"])
    assert provider.research_calls == before + 1, "Only the unfinished issue runs again."
    after = checks.load(MATTER, failed_id)
    assert after["budget_used"]["active_seconds"] >= used_time + (487.4 if interrupted else 0)
    assert after["budget_used"]["main_calls"] == used_calls + 1
    assert "request:saved" in after["completed_call_keys"]
    assert app.research_runs.get(MATTER, failed_id)["investigation_limits"]["active_seconds"] > 600.12


class FaultProvider(CountingProvider):
    def __init__(self, failures=3, error=TimeoutError, wrapped=False):
        super().__init__()
        self.failures, self.error, self.calls = failures, error, 0
        self.wrapped = wrapped

    async def complete(self, messages, tools=None):
        if not any("Dossier-generation action" in str(m.get("content")) for m in messages):
            self.calls += 1
            if self.calls <= self.failures:
                if self.wrapped:
                    from app.providers.catalog import ProviderAdapterError
                    raise ProviderAdapterError("Synthetic wrapped failure") from self.error()
                raise self.error("Synthetic service failure")
        return await super().complete(messages, tools)


def _launch_queued(app, status):
    def queue(md, body):
        for issue in md["issues"].values():
            issue["state"] = "queued"
        return md, body
    app.dossier_requests._mutate(MATTER, status["request_id"], queue, expected_sequence=None)
    app.dossier_requests._launch_coordinator(MATTER, status["request_id"])


@pytest.mark.asyncio
@pytest.mark.parametrize("failures,expected_calls,expected_recoveries,state,wrapped", [(3, 4, 1, "saved", False), (100, 9, 2, "partial", False), (3, 4, 1, "saved", True)])
async def test_automatic_recovery_is_bounded_and_manual_resume_still_works(
    app_context, monkeypatch, failures, expected_calls, expected_recoveries, state, wrapped,
):
    import app.services.research_recovery as recovery
    monkeypatch.setattr(recovery, "AUTO_RECOVERY_DELAY_SECONDS", 0)
    app = app_context
    ids = _issue_ids(app, 1)
    status = _prepared(app, ids, action="auto-recovery")
    child, = _prime_running_parent(app, status, ids)
    provider = FaultProvider(failures, wrapped=wrapped)
    _install(app, provider)
    _launch_queued(app, status)
    await _wait(app)
    final = app.dossier_requests.get(MATTER, status["request_id"])
    cp = ResearchCheckpoints(app.research_runs).load(MATTER, child["run_id"])
    assert provider.calls == expected_calls
    assert len(cp["recovery_attempts"]) == expected_recoveries
    assert final["issues"][0]["state"] == state
    if state == "partial":
        assert final["state"] == "partial", "A saved scaffold is not a complete dossier."
        assert "Saved work is kept" in final["issues"][0]["last_error"]
        provider.failures = 0
        await app.dossier_requests.resume(MATTER, status["request_id"], expected_sequence=final["sequence"], retry_issue_ids=ids, retry_unknown=True)
        await _wait(app)
        final = app.dossier_requests.get(MATTER, status["request_id"])
        assert final["issues"][0]["state"] == "saved"
        assert provider.calls == expected_calls + 1
        assert len(final["publications"]) == 2, "Publish the recovered answer as well as the earlier partial result."


@pytest.mark.asyncio
async def test_permanent_failure_does_not_auto_resume(app_context, monkeypatch):
    import app.services.research_recovery as recovery
    monkeypatch.setattr(recovery, "AUTO_RECOVERY_DELAY_SECONDS", 0)
    app = app_context
    status = _prepared(app, _issue_ids(app, 1), action="permanent-failure")
    child, = _prime_running_parent(app, status, _issue_ids(app, 1))
    provider = FaultProvider(100, PermissionError)
    _install(app, provider)
    await app.research_runs.launch_managed_child(MATTER, child["run_id"])
    cp = ResearchCheckpoints(app.research_runs).load(MATTER, child["run_id"])
    assert not cp.get("recovery_attempts")
    assert provider.calls == 3  # Existing within-allowance final-answer fallback only.


@pytest.mark.asyncio
async def test_stop_cancels_auto_resume_backoff(app_context, monkeypatch):
    import app.services.research_recovery as recovery
    monkeypatch.setattr(recovery, "AUTO_RECOVERY_DELAY_SECONDS", 30)
    app = app_context
    ids = _issue_ids(app, 1)
    status = _prepared(app, ids, action="stop-recovery")
    child, = _prime_running_parent(app, status, ids)
    provider = FaultProvider(100)
    _install(app, provider)
    _launch_queued(app, status)
    async with asyncio.timeout(5):
        while True:
            current = app.dossier_requests.get(MATTER, status["request_id"])
            if current["issues"][0].get("recovery_status"):
                break
            await asyncio.sleep(.01)
    await app.dossier_requests.stop(MATTER, status["request_id"], expected_sequence=current["sequence"])
    await _wait(app)
    assert provider.calls == 3
    assert app.dossier_requests.get(MATTER, status["request_id"])["state"] == "stopped"
    assert ResearchCheckpoints(app.research_runs).load(MATTER, child["run_id"])["stop_requested"]


@pytest.mark.asyncio
async def test_failed_search_can_retry_exact_scope_without_repeating_success(app_context, monkeypatch):
    from app.models.research_scope import ResearchScope
    from app.models.research_investigation import ResearchEvidenceRequest
    from app.services.research_collection import ResearchCollection
    from app.services.research_recovery import prepare_recovery
    app = app_context
    ids = _issue_ids(app, 1)
    status = _prepared(app, ids, action="retry-search")
    child, = _prime_running_parent(app, status, ids)
    run_id = child["run_id"]
    query = "United States public licensing requirements"
    app.research_runs._write(MATTER, run_id, search_scope=ResearchScope(external=True, public_query=query).model_dump())
    calls = []

    async def search(self, outbound, result, key):
        calls.append(outbound.standing_question)
        if len(calls) == 1:
            raise TimeoutError()
        result["external"] = [{"url": "https://example.org/rule"}]
        return result

    async def fetch(self, candidate):
        return {"source_id": "synthetic", "url": candidate["url"], "support_state": "retrieved"}

    monkeypatch.setattr(ResearchCollection, "service_search", search)
    monkeypatch.setattr(ResearchCollection, "_fetch", fetch)
    request = ResearchEvidenceRequest(proposition_id="rule", proposition=query, public_query=query, source_goal="operative_rule")
    batch = {"requests": [request.model_dump()]}
    first = await ResearchCollection(app, MATTER, run_id).collect(batch)
    assert first["requests"][0]["status"] == "failed"
    app.research_runs._write(MATTER, run_id, state="completed", managed_state="partial")
    assert prepare_recovery(app.research_runs, MATTER, run_id, explicit_retry=True)
    second = await ResearchCollection(app, MATTER, run_id).collect(batch)
    assert second["status"] == "retrieved"
    assert await ResearchCollection(app, MATTER, run_id).collect(batch) == second
    assert calls == [query, query]
    cp = ResearchCheckpoints(app.research_runs).load(MATTER, run_id)
    assert len(cp["requests"]) == 2, "Keep the failed request receipt alongside its recovery."
    assert cp["budget_used"]["requests"] == 2


@pytest.mark.asyncio
async def test_exhausted_collection_does_not_start_one_second_search(app_context, monkeypatch):
    from app.models.research_scope import ResearchScope
    from app.services.research_collection import ResearchCollection
    app = app_context
    ids = _issue_ids(app, 1)
    status = _prepared(app, ids, action="reserve-final-answer")
    child, = _prime_running_parent(app, status, ids)
    app.research_runs._write(MATTER, child["run_id"], search_scope=ResearchScope(external=True, public_query="public rules").model_dump())
    checks = ResearchCheckpoints(app.research_runs)
    cp = checks.load(MATTER, child["run_id"])
    cp["budget_used"]["active_seconds"] = 510
    checks.save(MATTER, child["run_id"], cp, expected_sequence=cp["sequence"])

    async def unexpected(*args):
        pytest.fail("No collection can start in the final answer's reserved time.")

    monkeypatch.setattr(ResearchCollection, "_request", unexpected)
    assert await ResearchCollection(app, MATTER, child["run_id"]).recover_before_synthesis() is None


def test_recovered_output_still_needs_publication_after_restart():
    from app.services.dossier_request_execution import _next_unpublished_batch
    md = {"first_issue_ids": ["one", "two"], "planned_issue_ids": ["one", "two"],
          "issues": {"one": {"state": "saved", "publication_pending": True}, "two": {"state": "saved"}},
          "publications": [{"issue_ids": ["one", "two"], "state": "applied"}]}
    assert _next_unpublished_batch(md) == ["one"]


@pytest.mark.asyncio
async def test_resume_one_issue_joins_active_parent_without_duplicate_workers(app_context):
    from app.models.dossier_request import DossierRequestConflict
    app = app_context
    ids = _issue_ids(app, 2)
    status = _prepared(app, ids, action="resume-with-sibling")
    children = _prime_running_parent(app, status, ids)
    app.research_runs._write(MATTER, children[0]["run_id"], state="completed", managed_state="partial")
    record = app.dossier_requests.get_record(MATTER, status["request_id"])
    md = record["metadata"]
    md["issues"][ids[0]]["state"] = "partial"
    md["issues"][ids[1]]["state"] = "queued"
    md["publications"] = [{"key": "earlier", "issue_ids": [ids[0]], "state": "applied"}]
    app.dossier_requests.save_record(MATTER, status["request_id"], metadata=md, expected_sequence=None)
    gate = asyncio.Event()
    provider = CountingProvider(gate)
    _install(app, provider)
    task = app.dossier_requests._launch_coordinator(MATTER, status["request_id"])
    await asyncio.wait_for(provider.entered.wait(), 5)
    current = app.dossier_requests.get(MATTER, status["request_id"])
    await app.dossier_requests.resume(MATTER, status["request_id"], expected_sequence=current["sequence"], retry_issue_ids=[ids[0]], retry_unknown=True)
    assert app.dossier_requests._active[status["request_id"]] is task
    with pytest.raises(DossierRequestConflict):
        await app.dossier_requests.resume(MATTER, status["request_id"], expected_sequence=current["sequence"], retry_issue_ids=[ids[0]], retry_unknown=True)
    gate.set()
    await _wait(app)
    assert provider.research_calls == 2
    assert all(i["state"] == "saved" for i in app.dossier_requests.get(MATTER, status["request_id"])["issues"])
