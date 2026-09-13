"""Assembled run: upload → search → cross-page read → interrupt → resume → publish → reload."""
import io
import json
from dataclasses import replace

import pytest
from fastapi import UploadFile

from app.models.research_scope import ResearchScope
from app.providers.base import ProviderReply, ProviderToolCall
from test_main_agent_research import RoutingSpy

MATTER = "MAT-DEMO-BEACON"
MARKER = "LATE EXCEPTION: consent is not required once the regulator has published the order"


def long_pdf(pages=1000, marker_page=900):
    import pymupdf as fitz
    document = fitz.open()
    for number in range(1, pages + 1):
        page = document.new_page()
        body = (f"Page {number} of the synthetic authority. Clause {number} governs ordinary "
                f"operation, records and notice.")
        if number == marker_page:
            body += "\n" + MARKER + ", and the obligation"
        if number == marker_page + 1:
            body += "\ncontinues until the order is withdrawn."
        page.insert_text((72, 100), body, fontsize=10)
    data = document.tobytes()
    document.close()
    return data


async def upload(app_context, name, data):
    return await app_context.ingestion.upload_to_matter(
        MATTER, UploadFile(filename=name, file=io.BytesIO(data)))


@pytest.mark.asyncio
async def test_assembled_lifecycle_answers_from_a_late_page_and_survives_restart(app_context, monkeypatch):
    source = await upload(app_context, "authority.pdf", long_pdf())
    assert source["library_extraction_state"] == "complete"
    source_id, version = source["library_source_id"], source["library_source_version"]

    question = "When is consent not required?"
    spy = RoutingSpy([
        ProviderReply(tool_calls=[ProviderToolCall(
            id="search", name="search_research_sources",
            arguments={"query": "LATE EXCEPTION regulator published order"})]),
        ProviderReply(tool_calls=[ProviderToolCall(
            id="read", name="read_research_source",
            arguments={"source_id": source_id, "source_version": version, "unit_id": "p000900"})]),
        ProviderReply(tool_calls=[ProviderToolCall(
            id="next", name="read_research_source",
            arguments={"source_id": source_id, "source_version": version, "unit_id": "p000901"})]),
        ProviderReply(content=(
            "Consent is not required once the regulator has published the order, and the obligation "
            "continues until that order is withdrawn. Condition: this rests on page 900-901 of the "
            "saved authority; confirm the order is published before relying on it.\n"
            "```research-synthesis\n{not valid json\n```")),
    ])
    main = replace(app_context.runner.resolve("counsel-copilot"), provider=spy)
    app_context.research_runs.resolve_main = lambda: main
    app_context.research_runs.resolve_selection = lambda selection: replace(main, selection=selection)

    run = app_context.research_runs.start(
        MATTER, [question], search_scope=ResearchScope(external=False, native=False, public_query=""))
    await app_context.research_runs.wait_for_active_work()
    saved = app_context.research_runs.get(MATTER, run["run_id"])
    assert saved["state"] == "completed", saved

    # Malformed structured metadata must not erase the useful prose.
    packet = app_context.vault.read_markdown(saved["results"][0]["path"])
    assert "Consent is not required once the regulator has published the order" in packet["content"]
    assert "obligation continues until that order is withdrawn" in packet["content"]

    checkpoint = saved["checkpoint"]
    pinned = checkpoint["library_sources"]
    assert [entry["source_id"] for entry in pinned] == [source_id]
    assert pinned[0]["source_version"] == version
    units = {passage["unit_id"] for passage in pinned[0]["selected_passages"]}
    assert units == {"p000900", "p000901"}
    assert MARKER in " ".join(passage["text"] for passage in pinned[0]["selected_passages"])

    # Evidence stayed bounded: no whole page array or manifest reached the provider.
    serialized = json.dumps(spy.calls, default=str)
    described_all = app_context.source_library.describe(MATTER, source_id, version)
    assert len(described_all["units"]) == 1000
    # Only the two deliberately read pages appear; no bulk page or manifest injection.
    assert "Page 500 of the synthetic authority" not in serialized
    assert "Page 900 of the synthetic authority" in serialized
    assert described_all["units"][500]["body_sha256"] not in serialized
    assert described_all["units"][500]["path"] not in serialized
    # Keep the investigation's original total limit. The separate dossier write
    # has its own dispatch limit and still must not receive bulk source content.
    assert len(spy.calls) == 5
    refresh = spy.calls[-1]
    assert refresh["tools"] is None
    assert refresh["messages"][0]["content"].startswith("Dossier-generation action.")
    assert len(json.dumps(spy.calls[:-1], default=str)) < 400_000
    assert len(json.dumps(refresh, default=str).encode()) <= app_context.settings.model_dispatch_max_bytes
    assert checkpoint["budget_used"]["evidence_chars"] <= 48000

    # Published once: a second wait does not add another packet or dossier revision.
    before = len(app_context.research_runs.get(MATTER, run["run_id"])["results"])
    await app_context.research_runs.wait_for_active_work()
    assert len(app_context.research_runs.get(MATTER, run["run_id"])["results"]) == before
    assert len(spy.calls) == 5

    # Reload the app and rebuild the disposable index from Markdown alone.
    from app.runtime import AppContext
    reopened = AppContext(app_context.settings)
    reopened.index.db_path.unlink()
    report = reopened.index.rebuild()
    assert report.error_count == 0

    reloaded = reopened.research_runs.get(MATTER, run["run_id"])
    assert reloaded["checkpoint"]["library_sources"] == pinned
    described = reopened.source_library.describe(MATTER, source_id, version)
    assert described["source_version"] == version
    assert described["original_sha256"] == app_context.source_library.describe(MATTER, source_id, version)["original_sha256"]

    # The citation reopens the exact saved passage.
    citation = pinned[0]["selected_passages"][0]
    reopened_read = reopened.source_library.read(MATTER, source_id, version, citation["unit_id"],
                                                 start=citation["start"])
    assert reopened_read["status"] in {"read", "partial"}
    assert reopened_read["body_hash"] == citation["body_hash"]
    assert MARKER in reopened_read["text"]
    assert reopened.vault.exists(described["original_path"])
    assert reopened.vault.read_markdown(citation["path"])["content"][citation["start"]:citation["end"]] == citation["text"]


@pytest.mark.asyncio
async def test_an_interrupted_run_resumes_without_repeating_a_completed_call(app_context):
    from app.services.research_checkpoints import ResearchCheckpoints
    from test_main_agent_research import prepared_collection
    source = await upload(app_context, "resume.pdf", long_pdf(pages=40, marker_page=30))
    access = prepared_collection(app_context)
    hits = access.search_sources({"query": "LATE EXCEPTION regulator published order"})
    assert hits["hits"][0]["unit_id"] == "p000030"
    passage = access.read(hits["hits"][0]["next_read"])
    charged = access.remaining()["evidence_chars"]

    # Interrupt after the evidence receipt, then recover the same run.
    checkpoints = ResearchCheckpoints(app_context.research_runs)
    checkpoints.recover(access.matter_id, access.run_id)
    from app.services.research_collection import ResearchCollection
    resumed = ResearchCollection(app_context, access.matter_id, access.run_id)
    assert resumed.remaining()["evidence_chars"] == charged
    assert resumed.read(hits["hits"][0]["next_read"])["text"] == passage["text"]
    assert resumed.remaining()["evidence_chars"] == charged
    assert resumed.search_sources({"query": "LATE EXCEPTION regulator published order"})["hits"] == hits["hits"]
    assert resumed.remaining()["evidence_chars"] == charged
    cp = resumed.checkpoints.load(access.matter_id, access.run_id)
    assert cp["library_sources"][0]["source_version"] == source["library_source_version"]


@pytest.mark.asyncio
async def test_a_source_edited_outside_the_app_marks_that_source_unavailable_only(app_context):
    good = await upload(app_context, "good-authority.pdf", long_pdf(pages=20, marker_page=10))
    other = await upload(app_context, "other.txt", b"An unrelated saved source about audit rights.\n")
    library = app_context.source_library
    described = library.describe(MATTER, good["library_source_id"], good["library_source_version"])
    unit = next(u for u in described["units"] if u["unit_id"] == "p000010")
    app_context.vault.resolve(unit["path"]).write_text(
        "---\nrecord_type: source_unit\n---\nFabricated replacement text.\n", encoding="utf-8")
    stale = library.read(MATTER, good["library_source_id"], good["library_source_version"], "p000010")
    assert stale["status"] == "stale_source"
    assert "Fabricated" not in json.dumps(stale)
    assert library.search(MATTER, "audit rights")["hits"][0]["source_id"] == other["library_source_id"]
    assert library.read(MATTER, good["library_source_id"], good["library_source_version"],
                        "p000011")["status"] in {"read", "partial"}
