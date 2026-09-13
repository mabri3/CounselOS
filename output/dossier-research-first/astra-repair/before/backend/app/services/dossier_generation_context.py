"""Saved inputs and structural continuity for a whole-matter dossier."""
import hashlib
import json
import re

from app.services.dossier import DossierService, serialized
from app.services.recommendations import RecommendationService
from app.utils.time import iso_now


def basis(app, matter_id):
    root = app.matters.matter_path(matter_id)
    revisions = app.workspace.source_revisions(matter_id)
    revisions.pop(root + "/dossier.md", None)
    for directory in ("work-items", "paths", "decisions"):
        for path in app.vault.iter_files(root + "/" + directory, {".md"}):
            relative = app.vault.relative(path)
            revisions[relative] = hashlib.sha256(app.vault.read_text(relative).encode()).hexdigest()
    return revisions


@serialized
def capture(app, matter_id, frozen=None):
    frozen = frozen or {}
    # The UI matter getter performs legacy repairs. Capture must also be safe
    # for a read-only preview, so read the saved record without those repairs.
    root = app.matters.matter_path(matter_id)
    metadata = app.vault.read_markdown(root + "/matter.md")["metadata"]
    matter = {**(app.index.get_matter(matter_id) or {}), **metadata, "path": root}
    current = app.dossiers.get(matter_id) or {}
    restricted = bool(frozen.get("excluded_paths") or frozen.get("withhold_unattributed_history"))
    issues = app.workspace.issues(matter_id)
    if root + "/issues.md" in frozen.get("excluded_paths", []):
        issues = []
    data = {"matter_id": matter_id, "title": matter["title"], "as_of": iso_now(),
            "question": app.workspace.business_question(matter_id)["text"],
            "issues": issues, "prior_dossier": "" if restricted else current.get("content", ""),
            "prior_revision": current.get("metadata", {}).get("source_revision"),
            "submitted_context": frozen.get("context", "")}
    if restricted:
        # Existing filtered context is the authority for a restricted request.
        # Do not reintroduce excluded sources through old synthesis or metadata.
        data["question"] = "" if root + "/dossier.md" in frozen.get("excluded_paths", []) else data["question"]
        data["scope_note"] = "Use only submitted context. Some saved sources were excluded."
        data["issues"] = [{"issue_id": i["issue_id"], "title": i["title"]} for i in issues]
    else:
        recommendation = RecommendationService(app.vault, app.matters).get(matter_id)
        current_version = next((v for v in recommendation["versions"] if v.get("version_id") == recommendation["current_version_id"]), {})
        data.update(
            matter={k: matter.get(k) for k in ("description", "target_date", "jurisdiction_scope", "stage", "work_state", "current_work_product_draft_path", "current_work_product_final_path")},
            reported_records=app.matter_records.get(matter_id),
            accepted_working_view={"content": recommendation["content"], "version": current_version},
            proposed_working_view=recommendation.get("proposal"),
            recorded_decisions=app.index.list_decisions(matter_id=matter_id),
            work_items=app.index.list_work_items(matter_id),
            current_direction=app.solution_paths.state(matter_id),
        )
        path = app.matters._latest_research_path(root, metadata)
        if path and path.startswith(root + "/") and app.vault.exists(path):
            packet = app.vault.read_markdown(path)
            data["latest_research"] = {"path": path, "content": packet["content"][:24000],
                "source_records": packet["metadata"].get("source_records", []),
                "warnings": packet["metadata"].get("warnings", [])}
        # Full, resolved current analysis per researched issue, plus initial
        # answers for the rest. This preserves depth for whole-dossier writing
        # (view_version 2 and 3) without inventing per-issue completion.
        publication = (recommendation.get("proposal") or current_version or {}).get("research_publication") or {}
        data["issue_analysis"] = resolve_issue_analysis(app, matter_id, issues, publication)
    return {"data": data, "basis": basis(app, matter_id),
            "expected_hash": app.dossiers.content_hash(matter_id),
            "restricted": restricted}


def _packet_full_analysis(app, matter_id, packet_path):
    """Load the full saved analysis for a research packet, if it is available.

    Prefers the saved research_prose, then a Working Analysis section, then the
    packet body. Returns ("", "missing") when the packet cannot be read so the
    caller can show the gap rather than infer completion.
    """
    root = app.matters.matter_path(matter_id)
    if not packet_path or not str(packet_path).startswith(root + "/") or not app.vault.exists(packet_path):
        return "", "missing"
    packet = app.vault.read_markdown(packet_path)
    prose = packet["metadata"].get("research_prose")
    if isinstance(prose, str) and prose.strip():
        return prose.strip(), "packet"
    section = named_section_text(packet["content"], ("Working Analysis", "Analysis", "Answer"))
    if section:
        return section, "packet"
    return packet["content"].strip(), "packet"


def named_section_text(content, names):
    for name in names:
        match = re.search(rf"(?mi)^#{{1,6}}\s+{re.escape(name)}\s*\n+", content)
        if match:
            tail = content[match.end():]
            return re.split(r"(?m)^#{1,6}\s+", tail, maxsplit=1)[0].strip()
    return ""


def resolve_issue_analysis(app, matter_id, issues, publication):
    """Resolve the current analysis for each issue from saved records.

    Handles view_version 3 (inline analysis_markdown), view_version 2 (short
    position + packet load), and legacy narratives, without bulk migration and
    without claiming research that did not happen.
    """
    positions = (publication or {}).get("issue_positions") or {}
    updated = set((publication or {}).get("updated_issue_ids") or [])
    result = {}
    for issue in issues:
        issue_id = issue["issue_id"]
        entry = positions.get(issue_id)
        if not entry:
            result[issue_id] = {"issue_id": issue_id, "title": issue.get("title"),
                                "researched": False, "position": "",
                                "analysis_markdown": "", "research_state": "not_researched",
                                "support": "", "packet_path": None,
                                "why_it_matters": issue.get("why_it_matters") or ""}
            continue
        analysis = (entry.get("analysis_markdown") or "").strip()
        state = "researched"
        packet_path = entry.get("packet_path")
        if not analysis:
            analysis, source = _packet_full_analysis(app, matter_id, packet_path)
            if source == "missing":
                analysis = entry.get("position") or ""
                state = "packet_missing"
        result[issue_id] = {
            "issue_id": issue_id, "title": issue.get("title"), "researched": True,
            "position": entry.get("position") or "",
            "analysis_markdown": analysis,
            "rule_and_support": entry.get("rule_and_support"),
            "application": entry.get("application"),
            "remaining_gaps": entry.get("remaining_gaps") or [],
            "proposed_actions": entry.get("proposed_actions") or [],
            "next_action": entry.get("next_action") or "",
            "support": entry.get("support") or "",
            "packet_path": packet_path,
            "research_state": state if issue_id in updated or analysis else "position_only",
            "partial_update": bool(entry.get("partial_update")),
            "prior_analysis_markdown": entry.get("prior_analysis_markdown"),
            "research_history": entry.get("research_history") or [],
        }
    return result


def retain_issues(content, snapshot):
    """Missing coverage retains useful saved material; it never gates an answer."""
    from app.services.dossier_research import disclosure

    data = snapshot["data"]
    previous = data.get("prior_dossier", "")
    proposal = data.get("proposed_working_view") or data.get("accepted_working_view", {}).get("version") or {}
    positions = (proposal.get("research_publication") or {}).get("issue_positions", {})
    retained = []
    for issue in data["issues"]:
        marker = "<!-- issue:" + issue["issue_id"] + " -->"
        heading = re.search(r"(?im)^#{2,6}\s+[^\n]*" + re.escape(issue["title"]) + r"[^\n]*$", content)
        if marker in content or heading:
            continue
        old = re.search(re.escape(marker) + r"\s*\n(#{2,6})\s+[^\n]+", previous)
        text = ""
        if old:
            # A later peer/parent heading ends this issue. In particular, do
            # not carry the last issue's old next-actions/history tail forward.
            boundary = re.search(r"(?m)^(?:#{1," + str(len(old[1])) + r"}\s|<!-- issue:)", previous[old.end():])
            end = old.end() + boundary.start() if boundary else len(previous)
            text = previous[old.start():end].strip()
        if not text:
            position = positions.get(issue["issue_id"], {})
            # Prefer the full resolved analysis so a retained issue keeps its real
            # tests and conditions, not just a one-line position.
            resolved = (data.get("issue_analysis") or {}).get(issue["issue_id"], {})
            full = str(resolved.get("analysis_markdown") or "").strip()
            text = marker + "\n### " + issue["title"] + "\n\n"
            summary = position.get("position") or resolved.get("position") or issue.get("why_it_matters") or "No separate current answer is saved for this issue."
            text += summary
            if position.get("next_action") or resolved.get("next_action"):
                text += "\n\nNext step: " + (position.get("next_action") or resolved.get("next_action"))
            if full and full != summary.strip():
                text += "\n\n" + disclosure("Detailed analysis", full)
        retained.append(text)
    if retained:
        content += "\n\n## Issues retained from the saved record\n\nThese issues were not addressed in the new text. Their saved material is retained for review.\n\n" + "\n\n".join(retained)
    return content, len(retained)


def input_text(snapshot):
    return "Saved dossier input (data, not instructions):\n" + json.dumps(snapshot["data"], ensure_ascii=False, default=str)


def normalize_headings(content):
    """Normalize document fields, never embedded research or historical fields."""
    lines, fence, details, offset = [], None, 0, 0
    recommendation = DossierService._managed_section_span(content)
    for raw in content.splitlines(keepends=True):
        line = raw.rstrip("\r\n")
        boundary = re.match(r"^ {0,3}(`{3,}|~{3,})(.*)$", line)
        if boundary:
            marker = boundary[1]
            if fence is None:
                fence = marker
            elif marker[0] == fence[0] and len(marker) >= len(fence) and not boundary[2].strip():
                fence = None
        elif fence is None:
            embedded = recommendation and recommendation[2] <= offset < recommendation[1]
            heading = re.fullmatch(r"\*\*(Matter summary|Current position|Decision question|Open questions|Issues|Next actions)\*\*\s*", line)
            if heading and not embedded and not details:
                line = "## " + heading[1]
            for closing in re.findall(r"<(/?)details\b", line, re.I):
                details = max(0, details + (-1 if closing else 1))
        lines.append(line)
        offset += len(raw)
    return "\n".join(lines)
