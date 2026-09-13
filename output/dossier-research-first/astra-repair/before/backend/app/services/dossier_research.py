"""Compose scoped research using saved issue identities, never legal keyword rules."""
from copy import deepcopy
from html import escape
import re


def disclosure(label, body):
    # Headings inside a disclosure must not become dossier section boundaries.
    body = re.sub(r"(?m)^#{1,2}\s+([^\n]+)$", r"**\1**", body.strip())
    return f"<details>\n<summary>{escape(label)}</summary>\n\n{body}\n\n</details>"


def named_section(prose, names):
    for name in names:
        match = re.search(
            rf"(?mi)^(?:#{{1,6}}\s+{re.escape(name)}|\*\*{re.escape(name)}\*\*)\s*\n+",
            prose,
        )
        if match:
            tail = prose[match.end():]
            return re.split(r"(?m)^#{1,6}\s+|^\*\*[^\n]+\*\*\s*$", tail, maxsplit=1)[0].strip()
    return ""


def answer_next_action(synthesis, metadata, prose):
    breakdown = metadata.get("problem_analysis") or metadata.get("problem_analysis_structure") or {}
    return (str((synthesis or {}).get("next_action") or "").strip()
            or str(breakdown.get("next_step") or "").strip()
            or named_section(prose, ("Next counsel action", "Next action", "Next step", "Recommended next action")))


def assumption_view(records, synthesis):
    """An absent reconciliation is not evidence that reported facts are uncertain."""
    actions = {a["action_id"]: a for a in records.get("actions", [])}
    relied = set((synthesis or {}).get("relied_on_assumption_ids", []))
    active = [a for a in records["assumptions"] if a.get("status") == "open" and not a.get("withdrawn_at")]
    used = [a["text"] for a in active if a["assumption_id"] in relied]
    body = ("Relied on by this analysis:\n" + "\n".join("- " + t for t in used) if used else
            "This answer did not identify any assumptions it relies on. Reported facts remain in Material facts.")
    pending = []
    for item in active:
        if item["assumption_id"] in relied:
            continue
        actor = actions.get(item.get("action_id"), {}).get("actor")
        label = "Generated assumption" if actor in {"assistant", "counsel-copilot", "intake-agent", "research-agent", "Themis.ai"} else "Recorded assumption"
        date = str(item.get("created_at") or "date not recorded")[:10]
        pending.append(f"- {label} ({date}): {item['text']}")
    if pending:
        body += "\n\n" + disclosure("Earlier assumptions awaiting reconciliation", "These saved assumptions have not been reconciled with this answer. They do not override later reported facts.\n\n" + "\n".join(pending))
    retired = [a for a in records["assumptions"] if a.get("status") == "retired"]
    if retired:
        body += "\n\n" + disclosure("Retired generated assumptions", "\n".join("- " + a["text"] + ": " + str(a.get("retirement_reason") or a.get("disposition")) for a in retired))
    return body


def prepare_publication(current, run, metadata, synthesis, prose, issues, publication):
    """Keep independent issue updates in the existing recommendation's metadata."""
    latest = next((v for v in current["versions"] if v.get("version_id") == current.get("current_version_id")), {})
    prior = (current.get("proposal") or latest).get("research_publication") or {}
    base = prior.get("base_position", current["content"])
    base_date = prior.get("base_position_date", latest.get("created_at") or "date not recorded")
    positions = deepcopy(prior.get("issue_positions") or {})
    known = {i["issue_id"]: i for i in issues}
    frozen_id = (run.get("frozen_context") or {}).get("issue_id") or run.get("issue_id")
    breakdown = metadata.get("problem_analysis") or metadata.get("problem_analysis_structure") or {}
    from app.models.research_investigation import sanitize_gaps, sanitize_proposed_actions
    updates = {}
    for item in (synthesis or {}).get("issue_updates", []):
        if item.get("issue_id") in known and item.get("position") and (not frozen_id or item["issue_id"] == frozen_id):
            updates[item["issue_id"]] = {
                "position": item["position"],
                "next_action": item.get("next_action") or "",
                "analysis_markdown": str(item.get("analysis_markdown") or "").strip(),
                "rule_and_support": str(item.get("rule_and_support") or "").strip() or None,
                "application": str(item.get("application") or "").strip() or None,
                "remaining_gaps": sanitize_gaps(item.get("remaining_gaps")),
                "proposed_actions": sanitize_proposed_actions(item.get("proposed_actions")),
            }
    for question in breakdown.get("questions", []):
        issue_id = question.get("issue_id")
        if issue_id in known and question.get("assessment") and issue_id not in updates and (not frozen_id or issue_id == frozen_id):
            same_issue = [q for q in breakdown["questions"] if q.get("issue_id") == issue_id]
            position = "\n\n".join(dict.fromkeys(q["assessment"] for q in same_issue if q.get("assessment")))
            updates[issue_id] = {"position": position, "next_action": ""}
    summary = ((synthesis or {}).get("summary") or breakdown.get("integrated_answer")
               or (synthesis or {}).get("recommendation") or prose).strip()
    next_action = answer_next_action(synthesis, metadata, prose)
    if not next_action and len(updates) == 1:
        next_action = next(iter(updates.values()))["next_action"]
    if frozen_id in known and frozen_id not in updates:
        updates[frozen_id] = {"position": summary, "next_action": next_action, "analysis_markdown": prose.strip(),
                              "rule_and_support": None, "application": None, "remaining_gaps": [], "proposed_actions": []}
    sources = metadata.get("source_records") or []
    retrieved = sum(s.get("support_state") == "retrieved" for s in sources)
    read = sum(bool(s.get("selected_passages")) for s in sources)
    support = f"{retrieved} sources retrieved; {read} with passages read" if sources else "No external sources retrieved"
    output_revision = metadata.get("output_revision")
    run_ref = metadata.get("run_id") or run.get("run_id")
    for issue_id, item in updates.items():
        prior = positions.get(issue_id) or {}
        new_full = (item.get("analysis_markdown") or "").strip()
        partial = False
        if not new_full:
            new_full = item["position"]
            prior_full = (prior.get("analysis_markdown") or "").strip()
            partial = bool(prior_full and prior_full != item["position"])
        # History references full saved work, deduplicated by run + output revision.
        history = [dict(ref) for ref in (prior.get("research_history") or []) if isinstance(ref, dict)]
        ref = {"run_id": run_ref, "packet_path": publication["packet_path"], "output_revision": output_revision,
               "basis": publication["basis"], "updated_at": metadata.get("created_at")}
        if not any(h.get("run_id") == run_ref and h.get("output_revision") == output_revision for h in history):
            history.append(ref)
        entry = {"position": item["position"],
                 "next_action": item["next_action"] or (next_action if len(updates) == 1 else ""),
                 "analysis_markdown": new_full,
                 "rule_and_support": item.get("rule_and_support"), "application": item.get("application"),
                 "remaining_gaps": item.get("remaining_gaps") or [], "proposed_actions": item.get("proposed_actions") or [],
                 "packet_path": publication["packet_path"], "basis": publication["basis"],
                 "issue_revision": known[issue_id], "support": support,
                 "updated_at": metadata.get("created_at"), "source_records": sources,
                 "research_history": history, "partial_update": partial}
        if partial:
            # A short update never erases the prior detailed answer.
            entry["prior_analysis_markdown"] = prior.get("analysis_markdown")
            entry["prior_updated_at"] = prior.get("updated_at")
        positions[issue_id] = entry
    publication.update(view_version=3, base_position=base, base_position_date=base_date,
                       issue_positions=positions, updated_issue_ids=list(updates), summary=summary,
                       next_action=next_action, research_question=run.get("question") or metadata.get("question") or "Research update",
                       unassigned_answer=(synthesis or {}).get("recommendation") or prose,
                       change_summary=(synthesis or {}).get("change_summary") or "",
                       source_records=sources, support=support)
    return publication


def _cell(value):
    return str(value).replace("|", "\\|").replace("\n", " ").strip()


def render_publication(publication, issues, *, current_basis=None):
    """The same composed content is saved as a proposal and shown in the dossier."""
    base = publication.get("base_position") or ""
    overview = named_section(base, ("Working position", "Working theory", "Leading theory", "Current position"))
    sections = []
    if overview:
        sections.append("### Saved overall view\n\n" + overview)
    positions = publication.get("issue_positions") or {}
    updated = set(publication.get("updated_issue_ids") or [])
    rows = ["| Workstream | Current analysis | Research state |", "|---|---|---|"]
    for issue in issues:
        item = positions.get(issue["issue_id"])
        if item:
            changed = current_basis and any(item.get("basis", {}).get(k) != current_basis.get(k) for k in ("business_question_revision", "facts_hash"))
            changed = changed or item.get("issue_revision") != issue
            state = "Needs review — inputs changed" if changed else "Research added" if issue["issue_id"] in updated else "Prior research retained"
            analysis = item["position"]
            if item.get("next_action"):
                analysis += " Next: " + item["next_action"]
            link = f"[Full research]({item['packet_path']})"
            rows.append(f"| {_cell(issue['title'])} | {_cell(analysis)} {link} | {state}. {_cell(item['support'])}. |")
        else:
            position = issue.get("why_it_matters") or "No separate issue position saved. The saved overall view remains available."
            rows.append(f"| {_cell(issue['title'])} | {_cell(position)} | No research update saved. |")
    if issues:
        sections.append("### Workstream positions\n\nResearch progress is separate from the lawyer's conclusion.\n\n" + "\n".join(rows))
    # Detailed per-issue analysis (view_version 3): the full researcher answer,
    # its application, gaps and proposed work, plus any earlier analysis retained.
    for issue in issues:
        item = positions.get(issue["issue_id"])
        if not item:
            continue
        detail = (item.get("analysis_markdown") or "").strip()
        blocks = []
        if detail and detail != (item.get("position") or "").strip():
            blocks.append(detail)
        if item.get("rule_and_support"):
            blocks.append("**Rule and support**\n\n" + str(item["rule_and_support"]))
        if item.get("application"):
            blocks.append("**Application to the facts**\n\n" + str(item["application"]))
        gaps = [g for g in (item.get("remaining_gaps") or []) if isinstance(g, str) and g.strip()]
        if gaps:
            blocks.append("**Remaining gaps**\n\n" + "\n".join("- " + g for g in gaps))
        actions = item.get("proposed_actions") or []
        if actions:
            table = ["| Work | Why | Proposed owner | Needed by | Basis | Evidence to proceed | Fallback |",
                     "|---|---|---|---|---|---|---|"]
            for a in actions:
                if not isinstance(a, dict):
                    continue
                table.append("| " + " | ".join(_cell(a.get(k) or "") for k in (
                    "action", "timing_basis", "proposed_owner_role", "due_date", "anchor_reference_id",
                    "evidence_to_proceed", "fallback")) + " |")
            blocks.append("**Proposed work** (not tasks or decisions)\n\n" + "\n".join(table))
        if item.get("partial_update") and item.get("prior_analysis_markdown"):
            blocks.append(disclosure(
                "Earlier detailed analysis — " + str(item.get("prior_updated_at") or "date not recorded"),
                str(item["prior_analysis_markdown"]),
            ))
        history = [h for h in (item.get("research_history") or []) if isinstance(h, dict)]
        if len(history) > 1:
            links = "\n".join(
                f"- [{h.get('updated_at') or 'earlier research'}]({h.get('packet_path')})"
                for h in history if h.get("packet_path")
            )
            if links:
                blocks.append(disclosure("Earlier research", links))
        if blocks:
            sections.append("### " + issue["title"] + " — detailed analysis\n\n" + disclosure(
                "Detailed analysis", "\n\n".join(blocks)))
    titles = [i["title"] for i in issues if i["issue_id"] in updated]
    change = publication.get("change_summary") or ("Research updated: " + "; ".join(titles) + ". Other workstreams retain their prior position." if titles else
             "This research has not been linked to a specific workstream. Existing issue positions are retained.")
    sections.append("### Latest research update\n\n" + change)
    if not titles:
        sections.append(publication.get("unassigned_answer") or publication.get("summary") or "")
    sections.append(f"[Read the full research answer]({publication['packet_path']}) — {publication['support']}.")
    if base:
        sections.append(disclosure("Earlier saved position — " + str(publication.get("base_position_date") or "date not recorded"), base))
    return "\n\n".join(sections)


def publication_sources(publication, issues):
    sections = ["Retrieval alone does not establish claim support."]
    groups = []
    for issue in issues:
        item = publication.get("issue_positions", {}).get(issue["issue_id"])
        if item:
            groups.append((issue["title"], item.get("source_records") or [], item["packet_path"]))
    if not publication.get("updated_issue_ids"):
        groups.append((publication.get("research_question") or "Latest research", publication.get("source_records") or [], publication["packet_path"]))
    for title, sources, packet in groups:
        lines = []
        for source in sources:
            path = source.get("path") or source.get("url")
            if not path:
                continue
            label = source.get("source_label") or source.get("title") or "Source"
            state = "Passage read" if source.get("selected_passages") else "Retrieved; passage not reviewed" if source.get("support_state") == "retrieved" else "Supplied source" if not source.get("url") else "Unverified lead"
            lines.append(f"- {state}: [{label}]({path})")
        sections.append(disclosure(title + " — sources", f"[Research answer]({packet})\n\n" + ("\n".join(lines) or "No external sources retrieved.")))
    return "\n\n".join(sections)
