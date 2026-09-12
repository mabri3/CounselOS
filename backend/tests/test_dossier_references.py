"""Readable, scoped reference binding before output cleanup."""
from __future__ import annotations

from app.agents.output import clean_user_facing_reply
from app.services.dossier_references import bind_references, build_catalog, catalog_source_records

MATTER = "MAT-DEMO-RELAY"


def _two_facts(app):
    result = app.matter_records.apply_update(
        MATTER,
        facts=[
            {"text": "The vendor contract requires 30 days notice.", "status": "active"},
            {"text": "The launch is scheduled for October.", "status": "active"},
        ],
        actor="assistant", summary="facts",
    )
    facts = app.matter_records.get(MATTER)["facts"]
    return facts[0]["fact_id"], facts[1]["fact_id"]


def test_two_facts_in_one_sentence_bind_to_distinct_records(app_context):
    app = app_context
    f1, f2 = _two_facts(app)
    text = f"The plan relies on {f1} and separately on {f2} for timing."
    catalog = build_catalog(app, MATTER, output_text=text)
    assert f1 in catalog and f2 in catalog
    assert catalog[f1]["source_label"] != catalog[f2]["source_label"]
    assert catalog[f1]["source_class"] == "reported_fact"

    bound = bind_references(text, catalog)
    assert f"[source:{f1}]" in bound
    assert f"[source:{f2}]" in bound

    # Through the real cleaner these survive instead of becoming "the internal record".
    cleaned = clean_user_facing_reply(text, references=catalog)
    assert f"[source:{f1}]" in cleaned
    assert f"[source:{f2}]" in cleaned
    assert "the internal record" not in cleaned


def test_unknown_reference_stays_honest(app_context):
    app = app_context
    f1, _ = _two_facts(app)
    text = f"Known {f1}. Unknown FACT-does-not-exist and Q-missing-1234."
    catalog = build_catalog(app, MATTER, output_text=text)
    bound = bind_references(text, catalog)
    assert f"[source:{f1}]" in bound
    assert "Reference unavailable: FACT-does-not-exist" in bound
    assert "Reference unavailable: Q-missing-1234" in bound
    # Two distinct unknown references are not collapsed into one label.
    assert bound.count("Reference unavailable:") == 2


def test_cross_matter_id_is_not_bound(app_context):
    app = app_context
    _two_facts(app)
    # A fact id shaped like another matter's record must not resolve here.
    foreign = "FACT-20260101-abcdef"
    text = f"Cite {foreign}."
    catalog = build_catalog(app, MATTER, output_text=text)
    assert foreign not in catalog
    bound = bind_references(text, catalog)
    assert "Reference unavailable: " + foreign in bound


def test_no_inflated_source_counts(app_context):
    app = app_context
    f1, f2 = _two_facts(app)
    # Only referenced records are catalogued; unreferenced facts are not added.
    text = f"Only {f1} is cited."
    catalog = build_catalog(app, MATTER, output_text=text)
    records = catalog_source_records(catalog)
    assert [r["source_id"] for r in records] == [f1]
    assert f2 not in catalog


def test_malicious_path_is_not_linked(app_context):
    app = app_context
    _two_facts(app)
    text = "See /etc/passwd and ../../secret and 03_Matters/other/dossier.md"
    catalog = build_catalog(app, MATTER, output_text=text)
    bound = bind_references(text, catalog)
    # No catalog path matches these, so none are turned into links.
    assert "](/etc/passwd)" not in bound
    assert "](../../secret)" not in bound
    assert "](03_Matters/other/dossier.md)" not in bound


def test_default_cleaner_behaviour_unchanged_without_catalog(app_context):
    # Without a catalog, the cleaner still humanizes bare internal ids as before.
    text = "Internal RUN-20260101-abc reference."
    cleaned = clean_user_facing_reply(text)
    assert "RUN-20260101-abc" not in cleaned
    assert "the internal record" in cleaned


def test_shared_source_keeps_each_issues_passage_without_merging_versions(app_context):
    from copy import deepcopy

    path = app_context.matters.matter_path(MATTER) + "/documents/agreement.md"
    source = {"source_id": "SRC-terms", "source_version": "v1", "path": path, "support_state": "supplied"}
    snap = {"data": {"issue_analysis": {
        "ISS-notice": {"source_records": [{**source, "selected_passages": [{"text": "Thirty days notice.", "section_label": "8.2"}]}]},
        "ISS-exit": {"source_records": [{**source, "selected_passages": [{"text": "Export for thirty days.", "section_label": "9.4"}]}]},
    }}}
    before = deepcopy(snap)
    catalog = build_catalog(app_context, MATTER, snapshot=snap)
    assert len(catalog["SRC-terms"]["selected_passages"]) == 2
    assert catalog["SRC-terms"]["support_state"] == "supplied"
    assert snap == before
    snap["data"]["issue_analysis"]["ISS-other"] = {"source_records": [{**source, "source_version": "v2", "selected_passages": [{"text": "Revised notice."}]}]}
    catalog = build_catalog(app_context, MATTER, snapshot=snap)
    assert len(catalog) == 2
    assert sorted(len(entry["selected_passages"]) for entry in catalog.values()) == [1, 2]


def test_saved_external_source_identity_controls_model_written_link_caption():
    source = {"source_id": "SRC-one", "source_label": "Actual source title", "url": "https://example.gov/actual",
        "path": "03_Matters/test/research/source-one.md", "support_state": "retrieved"}
    wrong = "[Different source — verified](03_Matters/test/research/source-one.md)"
    text = wrong + "\n\n```md\n" + wrong + "\n```\n\n`" + wrong + "`"
    result = bind_references(text, {"SRC-one": source})
    assert result.startswith("[source:SRC-one]")
    assert result.count(wrong) == 2, "Literal source-code examples must remain intact"
    assert source["support_state"] == "retrieved"
