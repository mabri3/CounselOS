"""Tool contracts: offsets, budgets, pinning, permissions and serialized request size."""
import io
import json

import pytest
from fastapi import UploadFile
from pydantic import ValidationError

from app.models.research_investigation import ResearchSourceRead
from app.models.source_library import SourceSearchRequest
from app.tools.registry import ToolExecutionContext
from app.tools.research_investigation import read_research_source, search_research_sources
from test_main_agent_research import prepared_collection

MATTER = "MAT-DEMO-BEACON"
OTHER = "MAT-DEMO-HARBOR"


async def upload(app_context, name, data, matter_id=MATTER):
    return await app_context.ingestion.upload_to_matter(
        matter_id, UploadFile(filename=name, file=io.BytesIO(data)))


def paged_pdf(pages, marker_page, marker):
    import pymupdf as fitz
    document = fitz.open()
    for number in range(1, pages + 1):
        page = document.new_page()
        body = (f"Page {number} of the synthetic agreement. Clause {number} governs "
                f"ordinary operation and record keeping.")
        if number == marker_page:
            body += "\n" + marker
        page.insert_text((72, 100), body, fontsize=11)
    data = document.tobytes()
    document.close()
    return data


@pytest.mark.asyncio
async def test_search_returns_bounded_hits_with_next_read_and_the_read_matches_exactly(app_context):
    body = ("Preamble about scope.\n\n" + "Filler paragraph.\n\n" * 50
            + "NOTICE EXCEPTION: consent is not required when the regulator has published the order.\n\n"
            + "Trailing paragraph.\n").encode()
    result = await upload(app_context, "regulation.txt", body)
    access = prepared_collection(app_context)
    hits = access.search_sources({"query": "NOTICE EXCEPTION regulator"})
    assert hits["status"] == "hits"
    top = hits["hits"][0]
    assert top["source_id"] == result["library_source_id"]
    assert top["source_version"] == result["library_source_version"]
    assert len(top["snippet"]) <= 400
    assert len(json.dumps(hits)) <= 6000
    passage = access.read(top["next_read"])
    saved = app_context.vault.read_markdown(
        app_context.source_library.describe(MATTER, top["source_id"], top["source_version"])["units"][0]["path"])["content"]
    assert saved[passage["start"]:passage["end"]] == passage["text"]
    assert "NOTICE EXCEPTION" in passage["text"]
    assert passage["body_hash"] and passage["status"] in {"read", "partial"}


@pytest.mark.asyncio
async def test_multibyte_offsets_end_of_unit_and_repeated_phrases_are_exact(app_context):
    text = ("α" * 500 + "\n\nrepeated phrase here\n\n" + "β" * 400 + "\n\nrepeated phrase here\n\n" + "ω" * 50)
    result = await upload(app_context, "unicode.txt", text.encode())
    library = app_context.source_library
    unit = library.describe(MATTER, result["library_source_id"], result["library_source_version"])["units"][0]
    saved = app_context.vault.read_markdown(unit["path"])["content"]
    first = library.read(MATTER, result["library_source_id"], result["library_source_version"], unit["unit_id"])
    assert first["text"] == saved[first["start"]:first["end"]]
    assert first["start"] == 0 and first["end"] == len(saved)
    assert not first["has_more_in_unit"]
    second = library.read(MATTER, result["library_source_id"], result["library_source_version"],
                          unit["unit_id"], start=saved.find("repeated phrase", 600), max_chars=30)
    assert second["text"] == saved[second["start"]:second["end"]]
    assert saved.count("repeated phrase here") == 2
    with pytest.raises(ValueError, match="outside"):
        library.read(MATTER, result["library_source_id"], result["library_source_version"],
                     unit["unit_id"], start=len(saved))


@pytest.mark.asyncio
async def test_cross_page_continuation_hands_back_the_next_unit(app_context):
    data = paged_pdf(6, 3, "CROSSING EXCEPTION: the obligation continues")
    result = await upload(app_context, "crossing.pdf", data)
    library = app_context.source_library
    read = library.read(MATTER, result["library_source_id"], result["library_source_version"], "p000003")
    assert read["page_number"] == 3
    assert read["next_read"]["unit_id"] == "p000004"
    following = library.read(MATTER, result["library_source_id"], result["library_source_version"],
                             **{k: v for k, v in read["next_read"].items() if k in {"unit_id", "start"}})
    assert following["page_number"] == 4
    assert following["unit_id"] == "p000004"


@pytest.mark.asyncio
async def test_a_run_pins_one_source_version_and_rejects_another(app_context):
    first = await upload(app_context, "versioned.txt", b"Version one text about the notice window.\n")
    second = await upload(app_context, "versioned.txt", b"Version two text about the notice window.\n")
    assert first["library_source_version"] != second["library_source_version"]
    access = prepared_collection(app_context)
    hits = access.search_sources({"query": "Version one", "source_id": first["library_source_id"]})
    assert hits["hits"][0]["source_version"] == first["library_source_version"]
    pinned = access.read({"source_id": first["library_source_id"], "unit_id": "s000001"})
    assert pinned["source_version"] == first["library_source_version"]
    assert "Version one" in pinned["text"]
    with pytest.raises(ValueError, match="already pinned"):
        access.read({"source_id": first["library_source_id"], "unit_id": "s000001",
                     "source_version": second["library_source_version"]})


@pytest.mark.asyncio
async def test_identical_replay_is_free_and_the_evidence_budget_is_charged_once(app_context):
    await upload(app_context, "budget.txt", b"Budgeted source paragraph about escrow release conditions.\n")
    access = prepared_collection(app_context)
    before = access.remaining()["evidence_chars"]
    hits = access.search_sources({"query": "escrow release conditions"})
    after_search = access.remaining()["evidence_chars"]
    assert after_search < before
    assert access.search_sources({"query": "escrow release conditions"})["hits"] == hits["hits"]
    assert access.remaining()["evidence_chars"] == after_search
    passage = access.read(hits["hits"][0]["next_read"])
    after_read = access.remaining()["evidence_chars"]
    assert after_read == after_search - len(passage["text"])
    assert access.read(hits["hits"][0]["next_read"])["text"] == passage["text"]
    assert access.remaining()["evidence_chars"] == after_read


@pytest.mark.asyncio
async def test_malformed_arguments_and_cross_matter_requests_are_refused(app_context):
    await upload(app_context, "ours.txt", b"Our own registered source about audit rights.\n")
    theirs = await upload(app_context, "theirs.txt", b"CROSSMATTER audit rights text.\n", matter_id=OTHER)
    access = prepared_collection(app_context)
    for bad in [{"query": ""}, {"query": "x" * 2001}, {"query": "ok", "limit": 99}, {"query": "ok", "path": "../../etc"}]:
        with pytest.raises(ValidationError):
            access.search_sources(bad)
    for bad in [{"source_id": "SRC-A", "start": -1}, {"source_id": "SRC-A", "max_chars": 6001},
                {"source_id": "SRC-A", "unit_id": "x" * 100}, {"source_id": "SRC-A", "cursor": "../x"}]:
        with pytest.raises(ValidationError):
            access.read(bad)
    crossing = access.search_sources({"query": "CROSSMATTER audit"})
    assert all(hit["source_id"] != theirs["library_source_id"] for hit in crossing["hits"])
    assert "CROSSMATTER" not in json.dumps(crossing)
    with pytest.raises(ValueError, match="No published source version|not in this run"):
        access.read({"source_id": theirs["library_source_id"], "unit_id": "s000001",
                     "source_version": theirs["library_source_version"]})


@pytest.mark.asyncio
async def test_tools_require_an_authorized_investigation(app_context):
    await upload(app_context, "guarded.txt", b"Guarded source text about limitation of liability.\n")
    context = ToolExecutionContext(app=app_context, matter_id=MATTER)
    with pytest.raises(ValueError, match="authorized"):
        await search_research_sources(context, {"query": "limitation of liability"})
    with pytest.raises(ValueError, match="authorized"):
        await read_research_source(context, {"source_id": "SRC-ANY", "unit_id": "s000001"})
    access = prepared_collection(app_context)
    allowed = ToolExecutionContext(app=app_context, matter_id=MATTER, investigation=access)
    payload = await search_research_sources(allowed, {"query": "limitation of liability"})
    assert payload["data"]["hits"]


@pytest.mark.asyncio
async def test_no_match_explains_query_semantics_without_claiming_the_rule_is_absent(app_context):
    await upload(app_context, "present.txt", b"An unrelated registered source about data retention.\n")
    access = prepared_collection(app_context)
    result = access.search_sources({"query": "zzzznonexistentterm"})
    assert result["status"] == "not_found" and result["hits"] == []
    assert "ANY term" in result["query_semantics"] or "ANY term can match" in result["query_semantics"]
    assert "does not mean the rule does not exist" in result["suggestion"]


@pytest.mark.asyncio
async def test_initial_context_carries_a_small_pointer_and_no_page_text(app_context):
    marker = "SECRET PAGE BODY TEXT THAT MUST NOT BE INJECTED"
    await upload(app_context, "pointer.pdf", paged_pdf(20, 15, marker))
    agent = app_context.agents.get("counsel-copilot")
    plain = app_context.agent_context.build_run_context(agent, matter_id=MATTER)["context"]
    assert "# Saved source library" in plain
    pointer = plain[plain.index("# Saved source library"):]
    assert len(pointer) <= app_context.agent_context.SOURCE_POINTER_LIMIT + 200
    assert marker not in plain
    assert "search_research_sources" in pointer
    system = app_context.agent_context.build_system(agent)
    assert marker not in system
    from app.services.research_execution import INVESTIGATION_CONTRACT
    assert "search_research_sources" in INVESTIGATION_CONTRACT


@pytest.mark.asyncio
async def test_a_serialized_provider_request_never_carries_whole_pages_or_manifests(app_context):
    marker = "LATE MARKER CLAUSE ABOUT INDEMNITY"
    result = await upload(app_context, "long.pdf", paged_pdf(200, 190, marker))
    access = prepared_collection(app_context)
    hits = access.search_sources({"query": "LATE MARKER indemnity"})
    passage = access.read(hits["hits"][0]["next_read"])
    serialized = json.dumps({"system": app_context.agent_context.build_system(app_context.agents.get("counsel-copilot")),
                             "context": app_context.agent_context.build_run_context(
                                 app_context.agents.get("counsel-copilot"), matter_id=MATTER)["context"],
                             "tool_results": [hits, passage]})
    assert serialized.count(marker) == 2  # one snippet, one deliberate read
    manifest = app_context.source_library.describe(MATTER, result["library_source_id"], result["library_source_version"])
    assert len(manifest["units"]) == 200
    assert manifest["units"][0]["body_sha256"] not in serialized
    assert len(passage["text"]) <= 6000
    assert all(len(hit["snippet"]) <= 400 for hit in hits["hits"])
