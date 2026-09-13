import pytest

from app.agents.output import clean_user_facing_reply
from app.services.workspace_actions import WorkspaceActionsService
from app.services.workspace_evidence import WorkspaceEvidenceService


MATTER = "MAT-DEMO-BEACON"


def test_output_cleanup_preserves_citation_identity_for_claim_persistence(app_context):
    # This is the exact Child definition retrieved from 16 CFR 312.2. The
    # conclusion stays narrow because a definition does not establish coverage.
    child_definition = "Child means an individual under the age of 13."
    raw = (
        "16 CFR 312.2 defines a child as an individual under 13 "
        "[source:SRC-COPPA|Child]. This definition alone does not establish "
        "that the rule applies to the learning app.\n\n"
        "Another possible source is not available [source:SRC-UNKNOWN|Operator].\n"
        "Debug record SRC-PRIVATE-123 must stay hidden."
    )

    cleaned = clean_user_facing_reply(raw)

    assert "[source:SRC-COPPA|Child]" in cleaned
    assert "[source:SRC-UNKNOWN|Operator]" in cleaned
    assert "SRC-PRIVATE-123" not in cleaned
    result = WorkspaceActionsService(
        app_context.vault, app_context.matters, app_context.workspace
    ).publish_result(
        MATTER,
        run_id="RUN-CITATION-SANITIZER",
        text=cleaned,
        source_revisions=app_context.workspace.source_revisions(MATTER),
        expected_question_revision=app_context.workspace.business_question(MATTER)["revision"],
        sources=[WorkspaceEvidenceService.source_record({
            "source_id": "SRC-COPPA",
            "title": "16 CFR 312.2",
            "url": "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-312/section-312.2",
            "locator": "Child",
            "available_excerpt": child_definition,
            "support_state": "retrieved",
        })],
    )

    assert len(result["claims"]) == 1
    known, unknown = result["claims"][0]["evidence"]
    assert known["source_id"] == "SRC-COPPA"
    assert known["locator"] == "Child"
    assert known["available_excerpt"] == child_definition
    assert known["support_state"] == "retrieved"
    assert unknown["source_id"] == "SRC-UNKNOWN"
    assert unknown["support_state"] == "unknown"
    assert unknown["available_excerpt"] is None


def test_output_cleanup_preserves_closed_claim_marker_but_humanizes_other_ids():
    cleaned = clean_user_facing_reply(
        "See [claim:CLM-CHILD] and [source:SRC-COPPA|Child]. "
        "Internal CLM-PRIVATE and SRC-PRIVATE are implementation details."
    )

    assert "[claim:CLM-CHILD]" in cleaned
    assert "[source:SRC-COPPA|Child]" in cleaned
    assert "CLM-PRIVATE" not in cleaned
    assert "SRC-PRIVATE" not in cleaned


@pytest.mark.parametrize(
    ("source_id", "locator"),
    [
        ("MSG-JURISDICTION", "Answer"),
        ("FACT-1", "Fact"),
        ("ASM-1", "Assumption"),
        ("DEC-1", "Decision"),
        ("RES-1", "Research"),
    ],
)
def test_output_cleanup_preserves_non_src_source_markers_only_inside_marker(source_id, locator):
    cleaned = clean_user_facing_reply(
        f"Supported statement [source:{source_id}|{locator}]. "
        f"Debug record {source_id} must stay hidden."
    )

    assert f"[source:{source_id}|{locator}]" in cleaned
    assert f"Debug record {source_id}" not in cleaned
    parsed = WorkspaceActionsService._inline_claims(cleaned)
    assert parsed[0]["evidence"] == [{"source_id": source_id, "locator": locator}]


def test_unknown_message_source_marker_reaches_unknown_evidence(app_context):
    cleaned = clean_user_facing_reply(
        "The reported answer states the launch jurisdiction "
        "[source:MSG-JURISDICTION|Answer]."
    )
    result = WorkspaceActionsService(
        app_context.vault, app_context.matters, app_context.workspace
    ).publish_result(
        MATTER,
        run_id="RUN-MESSAGE-SOURCE-SANITIZER",
        text=cleaned,
        source_revisions=app_context.workspace.source_revisions(MATTER),
        expected_question_revision=app_context.workspace.business_question(MATTER)["revision"],
        sources=[],
    )

    evidence = result["claims"][0]["evidence"][0]
    assert evidence["source_id"] == "MSG-JURISDICTION"
    assert evidence["locator"] == "Answer"
    assert evidence["support_state"] == "unknown"
    assert evidence["available_excerpt"] is None


def test_output_cleanup_preserves_path_source_and_path_locator_inside_marker():
    marker = (
        "[source:03_Matters/MAT-DEMO/source-documents/coppa.md|"
        "03_Matters/MAT-DEMO/source-documents/coppa.md — Child]"
    )

    cleaned = clean_user_facing_reply(
        f"The definition is narrow {marker}. Outside path: "
        "03_Matters/MAT-DEMO/source-documents/coppa.md."
    )

    assert marker in cleaned
    assert cleaned.endswith("Outside path: the saved file")
    assert WorkspaceActionsService._inline_claims(cleaned)[0]["evidence"] == [{
        "source_id": "03_Matters/MAT-DEMO/source-documents/coppa.md",
        "locator": "03_Matters/MAT-DEMO/source-documents/coppa.md — Child",
    }]


def test_named_saved_document_links_survive_cleanup():
    link = "[Open full research](03_Matters/synthetic/research/packet.md)"
    assert link in clean_user_facing_reply("Saved result: " + link)
