"""Full per-issue analysis, history retention, and depth-preserving loading."""
from __future__ import annotations

from app.services.dossier_generation_context import resolve_issue_analysis
from app.services.dossier_research import prepare_publication, render_publication

MATTER = "MAT-DEMO-RELAY"

CHECKLIST = (
    "## Notice analysis\n\n"
    "The supplier notice clause applies when ALL of these conditions hold:\n"
    "- (1) the change is material to data use;\n"
    "- (2) written notice is delivered at least 30 days before the change;\n"
    "- (3) the customer has not exercised an opt-out; and\n"
    "- (4) the aggregator contract permits the downstream purpose.\n\n"
    "Exception: emergency security changes may proceed with contemporaneous notice."
)


def _issues(app):
    return app.workspace.issues(MATTER)


def _basis(app):
    from app.services.workspace import digest

    return {
        "business_question_revision": app.workspace.business_question(MATTER)["revision"],
        "facts_hash": digest(app.matter_records.get(MATTER)["facts"]),
    }


def _current(prev_publication=None):
    return {"versions": [], "current_version_id": None, "content": "",
            "proposal": {"research_publication": prev_publication} if prev_publication else None}


def _metadata(app, *, output_revision, sources=None, run_id="RUN-A"):
    return {
        "source_records": sources if sources is not None else [
            {"source_id": "S1", "url": "https://example.gov/rule", "support_state": "retrieved",
             "selected_passages": [{"text": "operative rule"}], "source_label": "Rule"},
            {"source_id": "S2", "url": "https://example.gov/bg", "support_state": "retrieved",
             "selected_passages": [], "source_label": "Background"},
        ],
        "created_at": "2026-09-11T00:00:00+00:00",
        "output_revision": output_revision,
        "run_id": run_id,
    }


def _publish(app, *, issue_id, position, analysis, prev=None, output_revision, run_id="RUN-A",
            gaps=None, actions=None, sources=None):
    issues = _issues(app)
    publication = {"key": f"research:{run_id}:{output_revision}", "basis": _basis(app),
                   "packet_path": app.matters.matter_path(MATTER) + f"/research/{run_id}.md"}
    synthesis = {
        "summary": "Overall summary.",
        "issue_updates": [{"issue_id": issue_id, "position": position, "next_action": "Confirm the clause.",
                           "analysis_markdown": analysis, "remaining_gaps": gaps or [],
                           "proposed_actions": actions or []}],
    }
    return prepare_publication(_current(prev), {}, _metadata(app, output_revision=output_revision, sources=sources, run_id=run_id),
                              synthesis, position, issues, publication)


def test_full_analysis_survives_second_issue_research_and_render(app_context):
    app = app_context
    issues = _issues(app)
    a, b = issues[0]["issue_id"], issues[1]["issue_id"]
    pub_a = _publish(app, issue_id=a, position="Notice may be required.", analysis=CHECKLIST, output_revision="r1")
    # Research issue B next, chaining from A's publication.
    pub_b = _publish(app, issue_id=b, position="Migration needs a fresh choice.",
                     analysis="## Migration\n\nA new affirmative choice is required before data flows.",
                     prev=pub_a, output_revision="r2", run_id="RUN-B")
    # A's detailed conditions survive B's research.
    assert pub_b["issue_positions"][a]["analysis_markdown"] == CHECKLIST
    rendered = render_publication(pub_b, issues, current_basis=_basis(app))
    assert "at least 30 days before the change" in rendered
    assert "A new affirmative choice is required" in rendered


def test_update_keeps_prior_full_analysis_and_history(app_context):
    app = app_context
    issues = _issues(app)
    a = issues[0]["issue_id"]
    pub1 = _publish(app, issue_id=a, position="v1", analysis=CHECKLIST, output_revision="r1", run_id="RUN-1")
    pub2 = _publish(app, issue_id=a, position="v2",
                    analysis="## Updated\n\nThe 30-day window now also covers purpose changes.",
                    prev=pub1, output_revision="r2", run_id="RUN-2")
    history = pub2["issue_positions"][a]["research_history"]
    assert len(history) == 2, "history references both runs"
    assert {h["output_revision"] for h in history} == {"r1", "r2"}
    rendered = render_publication(pub2, issues, current_basis=_basis(app))
    assert "Earlier research" in rendered


def test_short_partial_update_does_not_erase_prior_detailed_answer(app_context):
    app = app_context
    issues = _issues(app)
    a = issues[0]["issue_id"]
    pub1 = _publish(app, issue_id=a, position="v1", analysis=CHECKLIST, output_revision="r1", run_id="RUN-1")
    # A later short update carries no analysis_markdown.
    pub2 = _publish(app, issue_id=a, position="Shorter refreshed note.", analysis="",
                    prev=pub1, output_revision="r2", run_id="RUN-2")
    entry = pub2["issue_positions"][a]
    assert entry["partial_update"] is True
    assert entry["prior_analysis_markdown"] == CHECKLIST
    rendered = render_publication(pub2, issues, current_basis=_basis(app))
    assert "Earlier detailed analysis" in rendered
    assert "at least 30 days before the change" in rendered


def test_source_counts_come_from_records(app_context):
    app = app_context
    issues = _issues(app)
    a = issues[0]["issue_id"]
    pub = _publish(app, issue_id=a, position="p", analysis=CHECKLIST, output_revision="r1")
    # Two retrieved, one with a passage read.
    assert pub["issue_positions"][a]["support"] == "2 sources retrieved; 1 with passages read"


def test_malformed_optional_fields_preserve_position(app_context):
    app = app_context
    issues = _issues(app)
    a = issues[0]["issue_id"]
    pub = _publish(app, issue_id=a, position="Useful position.", analysis=CHECKLIST, output_revision="r1",
                   gaps=["real gap", 12345, {"gap": "structured gap"}],
                   actions=[{"action": "Serve notice", "due_date": "not-a-date", "offset_calendar_days": "x"},
                            {"not": "an action"}, "bogus"])
    entry = pub["issue_positions"][a]
    assert entry["position"] == "Useful position."
    assert entry["remaining_gaps"] == ["real gap", "structured gap"]
    assert len(entry["proposed_actions"]) == 1
    action = entry["proposed_actions"][0]
    assert action["action"] == "Serve notice"
    assert action["due_date"] is None  # malformed date dropped, action still useful


def test_resolve_issue_analysis_handles_missing_packet(app_context):
    app = app_context
    issues = _issues(app)
    a = issues[0]["issue_id"]
    publication = {
        "updated_issue_ids": [a],
        "issue_positions": {
            a: {"position": "Retained position for review.", "packet_path": "03_Matters/does/not/exist.md",
                "support": "1 sources retrieved; 0 with passages read"},
        },
    }
    resolved = resolve_issue_analysis(app, MATTER, issues, publication)
    assert resolved[a]["research_state"] == "packet_missing"
    assert resolved[a]["analysis_markdown"] == "Retained position for review."
    # Unresearched issues are honestly marked, not inferred complete.
    other = issues[1]["issue_id"]
    assert resolved[other]["researched"] is False
    assert resolved[other]["research_state"] == "not_researched"


def test_updating_one_issue_does_not_touch_another(app_context):
    app = app_context
    issues = _issues(app)
    a, b = issues[0]["issue_id"], issues[1]["issue_id"]
    pub_a = _publish(app, issue_id=a, position="A position", analysis=CHECKLIST, output_revision="r1", run_id="RUN-1")
    pub_b = _publish(app, issue_id=b, position="B position", analysis="B analysis", prev=pub_a,
                     output_revision="r2", run_id="RUN-2")
    # A's entry is untouched by B's update.
    assert pub_b["issue_positions"][a] == pub_a["issue_positions"][a]
