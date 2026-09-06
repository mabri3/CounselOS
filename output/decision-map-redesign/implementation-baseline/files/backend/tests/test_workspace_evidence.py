import json

import pytest
from app.services.workspace_evidence import WorkspaceEvidenceService
from app.services.workspace_actions import WorkspaceActionsService, extract_claim_support
from app.services.workspace import WorkspaceConflict
from app.services.workspace import digest

MATTER = "MAT-DEMO-BEACON"


def service(app):
    return WorkspaceEvidenceService(app.vault, app.matters, app.workspace)


def test_selection_is_revision_checked_and_manifest_is_immutable(app_context):
    s = service(app_context)
    path = app_context.workspace._path(MATTER)
    app_context.vault.write_markdown(path, "Lawyer prose", {"matter_id": MATTER, "local_seen": {"keep": True}})
    original = s.selection(MATTER)
    next_choice = [{"reference_id": "company", "path": "00_System/company.md", "role": "company", "selected": False}]
    s.save_selection(MATTER, next_choice, expected_revision=original["revision"])
    assert app_context.vault.read_markdown(path)["metadata"]["local_seen"] == {"keep": True}
    with pytest.raises(WorkspaceConflict):
        s.save_selection(MATTER, [], expected_revision=original["revision"])
    manifest = {"run_id": "RUN-one", "matter_id": MATTER, "created_at": "2026-09-04T12:00:00Z", "entries": []}
    frozen = s.save_manifest(manifest)
    s.save_selection(MATTER, [], expected_revision=s.selection(MATTER)["revision"])
    assert s.manifest(MATTER, "RUN-one") == frozen
    with pytest.raises(WorkspaceConflict):
        s.save_manifest({**manifest, "created_at": "2026-09-05T12:00:00Z"})


def test_exact_excerpt_and_missing_reference_never_become_verified():
    source = WorkspaceEvidenceService.source_record({"url": "https://example.test/rule", "title": "Rule", "excerpt": "A **literal**\npassage.", "support_state": "retrieved"})
    evidence = WorkspaceEvidenceService.claim_evidence("CLM-real", source["source_id"], [source], explanation="Generated explanation")
    assert evidence["available_excerpt"] == "A **literal**\npassage."
    assert evidence["explanation"] == "Generated explanation"
    assert evidence["support_state"] == "retrieved" and evidence["retrieved_at"] is None
    missing = WorkspaceEvidenceService.claim_evidence("CLM-real", "SRC-missing", [source])
    assert missing["support_state"] == "unknown" and missing["available_excerpt"] is None


def test_same_source_locators_keep_their_exact_passages_and_revisions():
    sources = [
        WorkspaceEvidenceService.source_record({
            "source_id": "SRC-COPPA", "title": "16 CFR 312.2",
            "url": "https://www.ecfr.gov/current/title-16/section-312.2",
            "locator": "child", "excerpt": "Child means an individual under the age of 13.",
            "support_state": "retrieved",
        }),
        WorkspaceEvidenceService.source_record({
            "source_id": "SRC-COPPA", "title": "16 CFR 312.2",
            "url": "https://www.ecfr.gov/current/title-16/section-312.2",
            "locator": "personal information — persistent identifier",
            "excerpt": "Personal information includes a persistent identifier.",
            "support_state": "retrieved",
        }),
    ]

    child = WorkspaceEvidenceService.claim_evidence(
        "CLM-CHILD", "SRC-COPPA", sources, locator="child",
        claim_revision="claim-r1", output_revision="output-r7",
    )
    identifier = WorkspaceEvidenceService.claim_evidence(
        "CLM-ID", "SRC-COPPA", sources,
        locator="personal information — persistent identifier",
        claim_revision="claim-r2", output_revision="output-r7",
    )
    ambiguous = WorkspaceEvidenceService.claim_evidence(
        "CLM-GENERIC", "SRC-COPPA", sources,
        claim_revision="claim-r3", output_revision="output-r7",
    )
    mismatch = WorkspaceEvidenceService.claim_evidence(
        "CLM-MISMATCH", "SRC-COPPA", sources, locator="operator",
        claim_revision="claim-r4", output_revision="output-r7",
    )

    assert child["available_excerpt"] == "Child means an individual under the age of 13."
    assert identifier["available_excerpt"] == "Personal information includes a persistent identifier."
    assert child["claim_revision"] == "claim-r1" and child["output_revision"] == "output-r7"
    assert ambiguous["support_state"] == "unknown"
    assert ambiguous["available_excerpt"] is None
    assert mismatch["support_state"] == "unknown"
    assert mismatch["available_excerpt"] is None
    assert mismatch["locator"] == "operator"
    assert mismatch["source_label"] == "16 CFR 312.2"
    assert mismatch["url"] == "https://www.ecfr.gov/current/title-16/section-312.2"


def test_unsafe_source_url_is_not_projected():
    source = WorkspaceEvidenceService.source_record({
        "source_id": "SRC-UNSAFE", "title": "Unsafe",
        "url": "javascript:alert(1)", "excerpt": "Supplied passage.",
        "support_state": "supplied",
    })

    assert source["url"] is None
    assert source["available_excerpt"] == "Supplied passage."


def test_publish_retains_valid_claims_around_malformed_optional_entries(app_context):
    app = app_context
    service = WorkspaceActionsService(app.vault, app.matters, app.workspace)
    text = (
        "The child definition covers an individual under 13.\n\n"
        "A persistent identifier is listed as personal information.\n\n"
        "These definitions alone do not establish that the rule applies to this learning app."
    )
    sources = [
        WorkspaceEvidenceService.source_record({
            "source_id": "SRC-COPPA", "title": "16 CFR 312.2", "locator": "child",
            "excerpt": "Child means an individual under the age of 13.", "support_state": "retrieved",
        }),
        WorkspaceEvidenceService.source_record({
            "source_id": "SRC-COPPA", "title": "16 CFR 312.2",
            "locator": "personal information — persistent identifier",
            "excerpt": "Personal information includes a persistent identifier.", "support_state": "retrieved",
        }),
    ]
    structure = {"claims": [
        {
            "claim_id": "CLM-CHILD", "text": "The child definition covers an individual under 13.",
            "applicability": {"regulated_actor": "unknown operator", "jurisdiction": "United States",
                              "explanation": "The saved definition does not establish operator status."},
            "evidence": [{"source_id": "SRC-COPPA", "locator": "child",
                          "available_excerpt": "Invented model quotation that must be ignored.",
                          "explanation": "This passage supplies only the age definition."}],
        },
        {"claim_id": "CLM-BROKEN",
         "text": "These definitions alone do not establish that the rule applies to this learning app.",
         "applicability": "not an object", "evidence": "not a list"},
        {
            "claim_id": "CLM-ID", "text": "A persistent identifier is listed as personal information.",
            "applicability": {"regulated_actor": "unknown operator", "jurisdiction": "United States"},
            "evidence": [{"source_id": "SRC-COPPA", "locator": "personal information — persistent identifier"}],
            "support_gap": "Whether the learning app is a covered operator remains unresolved.",
        },
    ]}

    result = service.publish_result(
        MATTER, run_id="RUN-COPPA", text=text,
        source_revisions=app.workspace.source_revisions(MATTER),
        expected_question_revision=app.workspace.business_question(MATTER)["revision"],
        sources=sources, structure=structure,
    )

    assert [claim["claim_id"] for claim in result["claims"]] == ["CLM-CHILD", "CLM-BROKEN", "CLM-ID"]
    assert result["claims"][0]["evidence"][0]["available_excerpt"].startswith("Child means")
    assert result["claims"][2]["evidence"][0]["available_excerpt"].startswith("Personal information")
    assert all(claim["output_revision"] == digest(text) for claim in result["claims"])
    assert all(evidence["output_revision"] == digest(text) for claim in result["claims"] for evidence in claim["evidence"])
    assert result["claims"][0]["applicability"]["regulated_actor"] == "unknown operator"
    assert "No claim-specific source support" in result["claims"][1]["support_gap"]
    assert result["claims"][2]["support_gap"].startswith("Whether the learning app")
    assert result["warnings"]
    saved = app.vault.read_markdown(result["path"])
    assert saved["content"].strip() == text
    assert saved["metadata"]["output_revision"] == digest(text)
    assert [claim["claim_id"] for claim in saved["metadata"]["claims"]] == ["CLM-CHILD", "CLM-BROKEN", "CLM-ID"]


def test_artifact_target_claims_are_saved_without_replacing_current_answer_or_draft(app_context):
    app = app_context
    actions = WorkspaceActionsService(app.vault, app.matters, app.workspace)
    workspace_document = app.workspace._document(MATTER, "workspace.md")
    snapshot_before = json.loads(json.dumps(workspace_document["metadata"].get("snapshot")))
    created = app.work_products.create_draft(
        MATTER, title="Artifact target", content="# Draft\n\nKeep this text.",
        source_action_key="artifact-target-fixture",
    )
    work_product_path = created["vault_path"]
    draft_before = app.vault.read_markdown(work_product_path)
    facts_before = json.loads(json.dumps(app.matter_records.get(MATTER)["facts"]))
    decisions_before = json.loads(json.dumps(app.index.list_decisions(MATTER)))
    statement = "The file defines Child as an individual under 13."
    source = WorkspaceEvidenceService.source_record({
        "source_id": "SRC-COPPA", "title": "16 CFR 312.2", "locator": "Child",
        "excerpt": "Child means an individual under the age of 13.", "support_state": "retrieved",
    })

    result = actions.publish_result(
        MATTER,
        run_id="RUN-ARTIFACT-CLAIM",
        text=statement + " [source:SRC-COPPA|Child]",
        source_revisions=app.workspace.source_revisions(MATTER),
        expected_question_revision=app.workspace.business_question(MATTER)["revision"],
        structure={"claims": [{
            "claim_id": "CLM-ARTIFACT-CHILD", "text": statement,
            "evidence": [{"source_id": "SRC-COPPA", "locator": "Child"}],
        }]},
        sources=[source],
        target={"matter_id": MATTER, "artifact_path": work_product_path},
        update_current_snapshot=False,
    )

    assert result["current_snapshot_updated"] is False
    assert result["claims"][0]["claim_id"] == "CLM-ARTIFACT-CHILD"
    inquiry = app.vault.read_markdown(result["path"])
    assert inquiry["metadata"]["claims"][0]["output_revision"] == result["output_revision"]
    assert app.workspace._document(MATTER, "workspace.md")["metadata"].get("snapshot") == snapshot_before
    assert app.vault.read_markdown(work_product_path) == draft_before
    assert app.matter_records.get(MATTER)["facts"] == facts_before
    assert app.index.list_decisions(MATTER) == decisions_before


def test_inline_locator_selects_passage_while_generic_mention_creates_no_claim(app_context):
    app = app_context
    service = WorkspaceActionsService(app.vault, app.matters, app.workspace)
    sources = [WorkspaceEvidenceService.source_record({
        "source_id": "SRC-COPPA", "title": "16 CFR 312.2", "locator": "child",
        "excerpt": "Child means an individual under the age of 13.", "support_state": "retrieved",
    })]
    text = "The child definition covers an individual under 13. [source:SRC-COPPA|child]"
    result = service.publish_result(
        MATTER, run_id="RUN-INLINE-LOCATOR", text=text,
        source_revisions=app.workspace.source_revisions(MATTER),
        expected_question_revision=app.workspace.business_question(MATTER)["revision"],
        sources=sources,
    )
    assert result["claims"][0]["evidence"][0]["locator"] == "child"
    assert result["claims"][0]["evidence"][0]["available_excerpt"].startswith("Child means")

    generic = service.publish_result(
        MATTER, run_id="RUN-GENERIC-MENTION",
        text="The COPPA regulation may be relevant to the learning app.",
        source_revisions=app.workspace.source_revisions(MATTER),
        expected_question_revision=app.workspace.business_question(MATTER)["revision"],
        sources=sources,
    )
    assert generic["claims"] == []


def test_actual_read_file_sections_feed_two_claim_passages(app_context):
    app = app_context
    source_path = app.workspace._path(MATTER, "source-documents/learning-app-definitions.md")
    # Fictitious source text proves heading transport. It is not legal authority.
    source_text = (
        "# Learning app definitions\n\n"
        "## Child learner\nA child learner is a user under the stated program age.\n\n"
        "## Device identifier\nA device identifier is a stable installation token.\n"
    )
    app.vault.write_markdown(source_path, source_text, {"source_id": "SRC-LEARNING-DEFINITIONS"})
    read = app.vault.read_document(source_path)
    frozen = {
        "manifest": {"run_id": "RUN-ACTUAL-READ", "matter_id": MATTER,
                     "created_at": "2026-09-05T12:00:00Z", "entries": []},
        "sources": [], "excluded_paths": [], "excluded_reference_ids": [],
    }
    captured = WorkspaceEvidenceService.record_tool_read(
        frozen, reference_id=read["metadata"]["source_id"], path=read["path"],
        tool_call_id="CALL-READ", supplied_text=read["content"],
    )
    answer = (
        "The source defines a child learner by program age.\n\n"
        "The source defines a device identifier as an installation token."
    )
    structure = {"claims": [
        {"claim_id": "CLM-CHILD-LEARNER", "text": answer.split("\n\n")[0],
         "applicability": {"regulated_actor": "learning app", "jurisdiction": "fictitious program"},
         "evidence": [{"source_id": "SRC-LEARNING-DEFINITIONS", "locator": "Child learner"}]},
        {"claim_id": "CLM-DEVICE-ID", "text": answer.split("\n\n")[1],
         "applicability": {"regulated_actor": "learning app", "jurisdiction": "fictitious program"},
         "evidence": [{"source_id": "SRC-LEARNING-DEFINITIONS", "locator": "Device identifier"}]},
    ]}
    result = WorkspaceActionsService(app.vault, app.matters, app.workspace).publish_result(
        MATTER, run_id="RUN-ACTUAL-READ", text=answer,
        source_revisions=app.workspace.source_revisions(MATTER),
        expected_question_revision=app.workspace.business_question(MATTER)["revision"],
        sources=captured["sources"], structure=structure,
    )

    child, identifier = [claim["evidence"][0] for claim in result["claims"]]
    assert child["locator"] == "Child learner" and "program age" in child["available_excerpt"]
    assert "installation token" not in child["available_excerpt"]
    assert identifier["locator"] == "Device identifier" and "installation token" in identifier["available_excerpt"]
    assert "program age" not in identifier["available_excerpt"]
    assert child["path"] == identifier["path"] == source_path


def test_valid_claim_support_transport_keeps_prose_and_applicability(app_context):
    app = app_context
    source = WorkspaceEvidenceService.source_record({
        "source_id": "SRC-POLICY", "title": "Saved policy", "locator": "Eligibility",
        "excerpt": "Eligible services must use the stated review process.", "support_state": "supplied",
    })
    prose = "The saved policy requires the stated review process for eligible services."
    payload = {"claims": [{
        "text": prose,
        "applicability": {
            "regulated_actor": "eligible service", "jurisdiction": "company policy",
            "fact_ids": ["FACT-SERVICE"], "assumption_ids": [],
            "explanation": "The current service is assumed to be eligible.",
        },
        "evidence": [{"source_id": "SRC-POLICY", "locator": "Eligibility"}],
        "support_gap": "Eligibility remains an assumption.",
    }]}
    raw = prose + "\n\n```claim-support\n" + json.dumps(payload) + "\n```"

    display_text, structure, warnings = extract_claim_support(raw)
    result = WorkspaceActionsService(app.vault, app.matters, app.workspace).publish_result(
        MATTER, run_id="RUN-TRANSPORT", text=raw,
        source_revisions=app.workspace.source_revisions(MATTER),
        expected_question_revision=app.workspace.business_question(MATTER)["revision"],
        sources=[source],
    )

    assert display_text == prose and structure == payload and warnings == []
    assert app.vault.read_markdown(result["path"])["content"].strip() == prose
    assert result["claims"][0]["applicability"]["regulated_actor"] == "eligible service"
    assert result["claims"][0]["evidence"][0]["available_excerpt"].startswith("Eligible services")


def test_claim_support_transport_falls_back_per_item_and_keeps_malformed_block(app_context):
    app = app_context
    source = WorkspaceEvidenceService.source_record({
        "source_id": "SRC-POLICY", "title": "Saved policy", "locator": "Eligibility",
        "excerpt": "Eligible services must use the stated review process.", "support_state": "supplied",
    })
    supported = "The policy applies to eligible services."
    inline = "A separate review step is stated. [source:SRC-POLICY|Eligibility]"
    payload = {"claims": [
        {"text": supported, "applicability": {"regulated_actor": "eligible service", "jurisdiction": "company policy"},
         "evidence": [{"source_id": "SRC-POLICY", "locator": "Eligibility"}]},
        {"text": "Text absent from the answer", "evidence": []},
    ]}
    raw = supported + "\n\n" + inline + "\n\n```claim-support\n" + json.dumps(payload) + "\n```"
    result = WorkspaceActionsService(app.vault, app.matters, app.workspace).publish_result(
        MATTER, run_id="RUN-PER-ITEM", text=raw,
        source_revisions=app.workspace.source_revisions(MATTER),
        expected_question_revision=app.workspace.business_question(MATTER)["revision"],
        sources=[source],
    )
    assert [claim["text"] for claim in result["claims"]] == [supported, inline]
    assert any("Optional claim 2 unavailable" in warning for warning in result["warnings"])

    malformed = inline + "\n\n```claim-support\n{not json}\n```"
    display_text, structure, warnings = extract_claim_support(malformed)
    malformed_result = WorkspaceActionsService(app.vault, app.matters, app.workspace).publish_result(
        MATTER, run_id="RUN-MALFORMED-TRANSPORT", text=malformed,
        source_revisions=app.workspace.source_revisions(MATTER),
        expected_question_revision=app.workspace.business_question(MATTER)["revision"],
        sources=[source],
    )
    assert display_text == malformed and structure is None and warnings
    assert app.vault.read_markdown(malformed_result["path"])["content"].strip() == malformed
    assert malformed_result["claims"][0]["evidence"][0]["source_id"] == "SRC-POLICY"


def test_current_target_claims_replace_prior_target_claims_but_stale_result_does_not(app_context):
    app = app_context
    actions = WorkspaceActionsService(app.vault, app.matters, app.workspace)
    issue = app.workspace.issues(MATTER)[0]
    nodes = app.workspace.issues(MATTER)
    nodes[0]["claim_ids"] = ["CLM-EXPLICIT"]
    nodes[0]["claim_output_revisions"] = {"CLM-EXPLICIT": "output-explicit"}
    app.workspace.save_issues(MATTER, nodes, expected_revision=app.workspace.issues_revision(MATTER))
    original_state = {
        "lawyer_state": app.workspace.issues(MATTER)[0]["lawyer_state"],
        "disposition": app.workspace.issues(MATTER)[0]["disposition"],
        "disposition_history": app.workspace.issues(MATTER)[0]["disposition_history"],
    }
    source = WorkspaceEvidenceService.source_record({
        "source_id": "SRC-POLICY", "title": "Saved policy", "locator": "Eligibility",
        "excerpt": "Eligible services must use the stated review process.", "support_state": "supplied",
    })

    def publish(run_id, claim_id, statement, baseline, *, actor="eligible service"):
        payload = {"claims": [{
            "claim_id": claim_id, "text": statement,
            "applicability": {"regulated_actor": actor, "jurisdiction": "company policy"},
            "evidence": [{"source_id": "SRC-POLICY", "locator": "Eligibility"}],
        }]}
        return actions.publish_result(
            MATTER, run_id=run_id,
            text=statement + "\n\n```claim-support\n" + json.dumps(payload) + "\n```",
            source_revisions=baseline,
            expected_question_revision=app.workspace.business_question(MATTER)["revision"],
            sources=[source], target={"matter_id": MATTER, "issue_id": issue["issue_id"]},
        )

    first = publish("RUN-ISSUE-OLD", "CLM-OLD", "The first targeted analysis applies.", app.workspace.source_revisions(MATTER))
    assert first.get("historical") is not True
    assert app.workspace.issues(MATTER)[0]["claim_ids"] == ["CLM-EXPLICIT", "CLM-OLD"]
    assert app.workspace.issues(MATTER)[0]["claim_output_revisions"] == {
        "CLM-EXPLICIT": "output-explicit", "CLM-OLD": first["output_revision"]
    }
    assert app.workspace.get(MATTER)["stale"] is False

    second = publish("RUN-ISSUE-CURRENT", "CLM-CURRENT", "The reassessed targeted analysis applies.", app.workspace.source_revisions(MATTER))
    current_issue = app.workspace.issues(MATTER)[0]
    assert current_issue["claim_ids"] == ["CLM-EXPLICIT", "CLM-CURRENT"]
    assert current_issue["claim_output_revisions"] == {
        "CLM-EXPLICIT": "output-explicit", "CLM-CURRENT": second["output_revision"]
    }
    assert {key: current_issue[key] for key in original_state} == original_state
    assert app.workspace.get(MATTER)["stale"] is False

    revised = publish(
        "RUN-ISSUE-REVISED", "CLM-CURRENT",
        "The revised targeted analysis applies to the platform operator.",
        app.workspace.source_revisions(MATTER), actor="platform operator",
    )
    revised_issue = app.workspace.issues(MATTER)[0]
    assert revised_issue["claim_ids"] == ["CLM-EXPLICIT", "CLM-CURRENT"]
    assert revised_issue["claim_output_revisions"] == {
        "CLM-EXPLICIT": "output-explicit", "CLM-CURRENT": revised["output_revision"]
    }
    assert revised["output_revision"] != second["output_revision"]
    assert app.vault.read_markdown(second["path"])["metadata"]["claims"][0]["applicability"]["regulated_actor"] == "eligible service"
    assert app.vault.read_markdown(revised["path"])["metadata"]["claims"][0]["applicability"]["regulated_actor"] == "platform operator"
    assert app.workspace.get(MATTER)["stale"] is False

    stale_baseline = app.workspace.source_revisions(MATTER)
    edited_nodes = app.workspace.issues(MATTER)
    edited_nodes[0]["why_it_matters"] = "A newer lawyer edit changes the baseline."
    app.workspace.save_issues(MATTER, edited_nodes, expected_revision=app.workspace.issues_revision(MATTER))
    before_stale = app.workspace.issues(MATTER)[0]
    stale = publish("RUN-ISSUE-STALE", "CLM-STALE", "A late targeted analysis applies.", stale_baseline)
    assert stale["historical"] is True
    assert app.workspace.issues(MATTER)[0]["claim_ids"] == before_stale["claim_ids"]
    assert app.workspace.issues(MATTER)[0]["claim_output_revisions"] == before_stale["claim_output_revisions"]
    assert app.vault.exists(stale["path"])


def test_tool_read_is_observed_append_before_final_freeze(app_context):
    s = service(app_context)
    frozen = {"manifest": {"run_id": "RUN-tools", "matter_id": MATTER, "created_at": "2026-09-04T12:00:00Z", "entries": []}, "excluded_paths": ["excluded.txt"]}
    updated = s.record_tool_read(frozen, reference_id="SRC-read", path="read.txt", tool_call_id="CALL-one", supplied_text="Actual supplied output", available_chars=100)
    assert frozen["manifest"]["entries"] == []
    assert updated["manifest"]["entries"][0]["state"] == "truncated"
    assert updated["manifest"]["entries"][0]["tool_read_evidence"]
    assert updated["sources"][0]["available_excerpt"] == "Actual supplied output"
    assert updated["sources"][0]["support_state"] == "supplied"
    external = s.record_tool_read(
        updated, reference_id="SRC-public", path=None, tool_call_id="CALL-public",
        supplied_text="Exact retrieved passage", url="https://example.test/rule",
        locator="section 2",
    )
    assert external["sources"][-1]["support_state"] == "retrieved"
    assert external["sources"][-1]["support_state"] != "verified"
    assert external["sources"][-1]["locator"] == "section 2"
    s.save_manifest(updated["manifest"])
    with pytest.raises(ValueError, match="Excluded"):
        s.record_tool_read(frozen, reference_id="SRC-excluded", path="excluded.txt", tool_call_id="CALL-two", supplied_text="Excluded")


@pytest.mark.asyncio
async def test_library_links_preserved_source_and_custom_output_without_selecting(app_context):
    import io
    from fastapi import UploadFile
    app = app_context
    s = service(app)
    before = s.selection(MATTER)
    upload = await app.ingestion.upload_to_matter(MATTER, UploadFile(filename="policy.txt", file=io.BytesIO(b"Literal policy passage.")))
    output_path = app.workspace._path(MATTER, "custom-drafts/memo.md")
    app.vault.write_markdown(output_path, "Generated draft", {"record_type": "work_product", "work_product_id": "WP-custom"})
    source = next(item for item in s.library(MATTER, query="policy") if item["path"] == upload["path"])
    assert source["extracted_path"] == upload["extracted_path"]
    assert source["source_id"] == upload["source_id"] and source["support_state"] == "supplied"
    research_source = app.research._source_records({"internal": [{"path": upload["path"], "title": "Renamed display label"}]})[0]
    assert research_source["source_id"] == upload["source_id"]
    assert research_source["available_excerpt"] == "Literal policy passage."
    assert next(item for item in s.library(MATTER, query="memo") if item["path"] == output_path)["kind"] == "work_product"
    assert s.selection(MATTER) == before


def test_library_failed_preview_retains_complete_file_projection(app_context):
    app = app_context
    path = app.workspace._path(MATTER, "documents/broken.md")
    app.vault.write_bytes(path, b"---\nbroken: [\n---\nSaved file body")
    item = next(f for f in service(app).library(MATTER, query="broken") if f["path"] == path)
    assert item["reference_id"] and item["kind"] == "file" and item["selected"] is False
    assert item["extraction_state"] == "failed" and item["failure_detail"]
    assert app.vault.resolve(path).read_bytes().endswith(b"Saved file body")
