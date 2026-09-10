"""Model-visible contracts match real local search and saved-passage behavior."""
from copy import deepcopy

import pytest
from pydantic import ValidationError

from app.models.research_investigation import ResearchEvidenceBatch, ResearchSourceRead
from app.tools.handlers import read_file, search_vault
from app.tools.registry import ToolExecutionContext
from test_main_agent_research import prepared_collection


def test_shipped_schemas_and_guidance_override_stale_vault_tools_without_writes(app_context):
    agent = app_context.agents.get("counsel-copilot")
    names = {"search_vault", "read_file", "run_research", "collect_research_evidence", "read_research_source"}
    expected = {t["function"]["name"]: deepcopy(t["function"]) for t in app_context.tools.provider_tools(agent) if t["function"]["name"] in names}
    assert expected.keys() == names
    for name in names:
        app_context.vault.write_markdown(f"00_System/tools/{name}.md", "Stale fixture",
            {"tool_id": name, "handler": name, "description": "Old ambiguous description",
             "parameters": {"type": "object", "properties": {"length": {"type": "integer"}}}})
    before = {name: app_context.vault.read_text(f"00_System/tools/{name}.md") for name in names}
    actual = {t["function"]["name"]: t["function"] for t in app_context.tools.provider_tools(agent) if t["function"]["name"] in names}
    assert actual == expected
    assert {name: app_context.vault.read_text(f"00_System/tools/{name}.md") for name in names} == before
    for name, model in [("collect_research_evidence", ResearchEvidenceBatch), ("read_research_source", ResearchSourceRead)]:
        assert actual[name]["parameters"] == model.model_json_schema()
        assert all(field.get("description") for field in actual[name]["parameters"]["properties"].values())
    assert "ANY term" in actual["search_vault"]["description"]
    assert "6000 characters" in actual["read_research_source"]["description"]
    assert "omit page_number and find_text" in actual["read_research_source"]["description"]
    assert "No search starts" in actual["run_research"]["description"]


@pytest.mark.asyncio
async def test_vault_query_is_any_term_substrings_not_literal_phrase_or_boolean(app_context):
    root = app_context.matters.matter_path("MAT-DEMO-BEACON") + "/documents/tool-query-fixture"
    app_context.vault.write_markdown(root + "/a.md", "Blue gate opens at noon. Blue gate closes at dusk.")
    app_context.vault.write_markdown(root + "/b.md", "A blueprint is on the shelf.")
    app_context.index.rebuild()
    context = ToolExecutionContext(app=app_context, matter_id="MAT-DEMO-BEACON")
    async def search(query):
        return (await search_vault(context, {"query": query, "path": root}))["data"]["results"]
    hits = await search("BLUE missingword")
    assert [h["path"] for h in hits] == [root + "/a.md", root + "/b.md"]
    assert [h["score"] for h in hits] == [2, 1]
    assert len(await search("blue AND absent")) == 2
    assert await search('"blue gate"') == []
    assert await search("x y") == []
    assert await search("absent") == []
    assert len(await search("gate")) == 1  # Simpler query recovers actual evidence.
    for query in ["BLUE missingword", "gate", '"blue gate"', "x y"]:
        assert await search(query) == app_context.vault.lexical_search(query, relative_path=root)


def test_read_continuation_uses_absolute_character_end_and_page_find_override_start(app_context):
    access = prepared_collection(app_context)
    path = app_context.matters.matter_path(access.matter_id) + "/documents/long-sensor-note.md"
    text = "α" * 5995 + "SENSOR CALIBRATION: " + "x" * 500 + "Blue gate. " + "y" * 600 + "Blue gate. End."
    app_context.vault.write_markdown(path, text)
    snapshot = access.capture_local(app_context.vault.read_document(path))
    source_id = snapshot["source_id"]
    saved = app_context.vault.read_markdown(snapshot["source_snapshot_path"])["content"]
    cp = access.checkpoints.load(access.matter_id, access.run_id)
    cp["local_sources"][0]["pages"] = [
        {"page": 1, "start": 0, "end": 6600, "method": "text"},
        {"page": 2, "start": 6600, "end": len(saved), "method": "text"}]
    access.checkpoints.save(access.matter_id, access.run_id, cp, expected_sequence=cp["sequence"])
    first = access.read({"source_id": source_id, "page_number": 1, "start": 6500})
    assert (first["start"], first["end"]) == (0, 6000)
    assert first["has_more"]
    second = access.read({"source_id": source_id, "start": first["end"]})
    assert first["text"] + second["text"] == saved
    assert "SENSOR CALIBRATION" in first["text"] + second["text"]
    assert not second["has_more"]
    found = access.read({"source_id": source_id, "find_text": "Blue gate", "start": 6800})
    assert found["start"] == saved.find("Blue gate") - 500
    page_found = access.read({"source_id": source_id, "page_number": 2, "find_text": "Blue gate"})
    assert page_found["start"] >= 6600
    assert access.read({"source_id": source_id, "find_text": "blue gate"})["status"] == "not_found"
    remaining = access.remaining()
    assert access.read({"source_id": source_id, "start": first["end"]})["text"] == second["text"]
    assert access.remaining() == remaining
    with pytest.raises(ValueError, match="outside"):
        access.read({"source_id": source_id, "start": len(saved)})
    with pytest.raises(ValueError, match="not extracted"):
        access.read({"source_id": source_id, "page_number": 3})
    with pytest.raises(ValidationError):
        access.read({"source_id": source_id, "max_chars": 6001})


@pytest.mark.asyncio
async def test_read_file_reports_omission_and_investigation_can_read_the_missing_middle(app_context):
    access = prepared_collection(app_context)
    path = app_context.matters.matter_path(access.matter_id) + "/documents/long-hardware-note.md"
    text = "A" * 35000 + "MIDDLE SENSOR SETTING" + "Z" * 35000
    app_context.vault.write_markdown(path, text)
    ordinary = (await read_file(ToolExecutionContext(app=app_context, matter_id=access.matter_id), {"path": path}))["data"]
    assert "MIDDLE SENSOR SETTING" not in ordinary["content"]
    assert "Middle omitted" in ordinary["content"]
    raw = (await read_file(ToolExecutionContext(app=app_context, matter_id=access.matter_id, investigation=access), {"path": path}))["data"]
    view = access.capture_local(raw)
    assert len(view["content"]) == 6000
    passage = access.read({"source_id": view["source_id"], "find_text": "MIDDLE SENSOR SETTING"})
    assert "MIDDLE SENSOR SETTING" in passage["text"]
    assert text[passage["start"]:passage["end"]] == passage["text"]
