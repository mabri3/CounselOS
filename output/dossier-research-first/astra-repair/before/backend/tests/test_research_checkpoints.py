"""Durable call reservations survive a new application context over the same vault."""
import pytest

from app.runtime import AppContext
from app.services.research_checkpoints import ResearchCheckpoints

MATTER = "MAT-DEMO-BEACON"


def checkpoint(app):
    app.research_runs._write(MATTER, "RUN-CHECKPOINT", state="running", status="Synthetic", execution_version=2)
    service = ResearchCheckpoints(app.research_runs)
    service.initialize(MATTER, "RUN-CHECKPOINT", {})
    return service


def test_reservations_replay_completed_and_require_explicit_retry_after_restart(app_context):
    service = checkpoint(app_context)
    service.reserve_call(MATTER, "RUN-CHECKPOINT", "main:one", "digest", {"main_calls": 1})
    service.complete_call(MATTER, "RUN-CHECKPOINT", "main:one", {"content": "Saved answer"})
    service.reserve_call(MATTER, "RUN-CHECKPOINT", "main:two", "digest2", {"main_calls": 1})
    reopened = AppContext(app_context.settings, recover_interrupted=False)
    recovered = ResearchCheckpoints(reopened.research_runs)
    recovered.recover(MATTER, "RUN-CHECKPOINT")
    assert recovered.reserve_call(MATTER, "RUN-CHECKPOINT", "main:one", "digest", {"main_calls": 1})["result_ref"]["content"] == "Saved answer"
    with pytest.raises(ValueError, match="explicit retry"):
        recovered.reserve_call(MATTER, "RUN-CHECKPOINT", "main:two", "digest2", {"main_calls": 1})
    recovered.recover(MATTER, "RUN-CHECKPOINT", explicit_retry=True)
    recovered.reserve_call(MATTER, "RUN-CHECKPOINT", "main:two", "digest2", {"main_calls": 1})
    assert recovered.load(MATTER, "RUN-CHECKPOINT")["budget_used"]["main_calls"] == 3


def test_stale_sequences_stop_and_bad_versions_do_not_reset_budget(app_context):
    service = checkpoint(app_context)
    original = service.load(MATTER, "RUN-CHECKPOINT")
    service.update(MATTER, "RUN-CHECKPOINT", stop_requested=True)
    with pytest.raises(ValueError, match="Stale"):
        service.save(MATTER, "RUN-CHECKPOINT", original, expected_sequence=original["sequence"])
    with pytest.raises(ValueError, match="stopped"):
        service.reserve_call(MATTER, "RUN-CHECKPOINT", "paid", "digest", {"main_calls": 1})
    run = app_context.research_runs.get(MATTER, "RUN-CHECKPOINT")
    app_context.vault.update_markdown(run["path"], metadata_updates={"checkpoint_version": 99})
    with pytest.raises(ValueError, match="version"):
        service.load(MATTER, "RUN-CHECKPOINT")


def test_corrupt_snapshot_is_not_silently_refetched(app_context):
    from app.services.workspace import digest
    service = checkpoint(app_context)
    path = "03_Matters/beacon-instant-onboarding/research/sources/synthetic.md"
    app_context.vault.write_markdown(path, "Synthetic original source.")
    text = app_context.vault.read_markdown(path)["content"]
    service.update(MATTER, "RUN-CHECKPOINT", sources=[{"path": path, "source_hash": digest(text)}])
    app_context.vault.update_markdown(path, content="Changed source.")
    with pytest.raises(ValueError, match="hash changed"):
        service.load(MATTER, "RUN-CHECKPOINT")


def test_restart_conservatively_keeps_active_time_and_monotonic_budget(app_context):
    service = checkpoint(app_context)
    service.update(MATTER, "RUN-CHECKPOINT", active_time_reservation=90)
    service.recover(MATTER, "RUN-CHECKPOINT")
    cp = service.load(MATTER, "RUN-CHECKPOINT")
    assert cp["budget_used"]["active_seconds"] == 90
    service.recover(MATTER, "RUN-CHECKPOINT", explicit_retry=True)
    assert service.load(MATTER, "RUN-CHECKPOINT")["budget_used"]["active_seconds"] == 90
    cp["budget_used"]["active_seconds"] = 0
    cp["sequence"] = service.load(MATTER, "RUN-CHECKPOINT")["sequence"]
    with pytest.raises(ValueError, match="cannot decrease"):
        service.save(MATTER, "RUN-CHECKPOINT", cp, expected_sequence=cp["sequence"])


@pytest.mark.asyncio
@pytest.mark.parametrize("completed", [False, True])
async def test_fallback_call_interruption_requires_retry_or_replays_saved_text(app_context, monkeypatch, completed):
    from app.models.research_scope import ResearchScope
    from app.services.research_collection import ResearchCollection
    from app.services.workspace import digest
    import app.services.research_reader as reader
    service = checkpoint(app_context)
    app_context.research_runs._write(MATTER, "RUN-CHECKPOINT", search_scope=ResearchScope(external=True, allow_firecrawl=True).model_dump())
    class ProcessDeath(BaseException):
        pass
    calls = []
    interrupt = True
    async def source(url, settings, **kwargs):
        async def paid():
            calls.append(url)
            if interrupt and not completed:
                raise ProcessDeath()
            return "Synthetic saved operative passage. " * 20
        text = await kwargs["fallback_call"]("firecrawl", paid)
        if interrupt:
            raise ProcessDeath()
        return {"retrieved_content": text, "content": text, "support_state": "retrieved", "retrieval_method": "firecrawl", "source_hash": digest(text)}
    monkeypatch.setattr(reader, "read_source", source)
    candidate = {"url": "https://example.com/synthetic-rule"}
    with pytest.raises(ProcessDeath):
        await ResearchCollection(app_context, MATTER, "RUN-CHECKPOINT")._fetch(candidate)
    reopened = AppContext(app_context.settings, recover_interrupted=False)
    recovered = ResearchCheckpoints(reopened.research_runs)
    recovered.recover(MATTER, "RUN-CHECKPOINT")
    cp = recovered.load(MATTER, "RUN-CHECKPOINT")
    fallback = next(c for c in cp["pending_calls"] if c["key"].endswith(":firecrawl"))
    assert fallback["state"] == ("completed" if completed else "outcome_unknown")
    assert cp["budget_used"]["fetches"] == 1
    with pytest.raises(ValueError, match="explicit retry"):
        await ResearchCollection(reopened, MATTER, "RUN-CHECKPOINT")._fetch(candidate)
    assert len(calls) == 1
    recovered.recover(MATTER, "RUN-CHECKPOINT", explicit_retry=True)
    interrupt = False
    result = await ResearchCollection(reopened, MATTER, "RUN-CHECKPOINT")._fetch(candidate)
    assert "operative passage" in result["available_excerpt"]
    assert len(calls) == (1 if completed else 2)
    assert recovered.load(MATTER, "RUN-CHECKPOINT")["budget_used"]["fetches"] == 2
