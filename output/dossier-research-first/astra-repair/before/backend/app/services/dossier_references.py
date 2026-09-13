"""Scoped, readable reference catalog and binding for dossier/chat output.

Bare record IDs and vault paths in model output would otherwise be humanized to
"the internal record" / "the saved file" by the output cleaner. This module
builds a catalog of the records actually present in one output, within its
authorized matter scope, and binds them to the existing ``[source:ID]`` marker
format (or named Markdown links for saved artifacts) BEFORE cleanup, so the
reference survives and renders through the existing ClaimMarkdown/evidence path.

It never invents a name or location for an unknown ID, never inflates source
counts, and never crosses matter scope.
"""
from __future__ import annotations

import re
from typing import Any

# Reference-bearing ID prefixes (record identities), distinct from purely
# internal ids (RUN/MAT/CONV/ACT...) which stay humanized.
_REFERENCE_ID = re.compile(r"\b(FACT|ASM|Q|ISS|DEC|SRC|RES|EVT|WI|WP)-[A-Za-z0-9][A-Za-z0-9-]*\b")
_ALREADY_MARKED = re.compile(r"\[source:[^\]]+\]|\[[^\]\n]+\]\([^)]+\)")


def _matter_paths(app, matter_id: str) -> tuple[str, set[str]]:
    root = app.matters.matter_path(matter_id)
    return root, {root}


def build_catalog(app, matter_id: str, *, output_text: str) -> dict[str, dict[str, Any]]:
    """Build a catalog of reference records that actually appear in ``output_text``.

    Only IDs present in the text and belonging to this matter are included. Each
    entry carries the fields the evidence reader needs. Records outside this
    matter's scope are never added.
    """
    present = {match.group(0) for match in _REFERENCE_ID.finditer(output_text or "")}
    if not present:
        return {}
    root = app.matters.matter_path(matter_id)
    catalog: dict[str, dict[str, Any]] = {}

    records = app.matter_records.get(matter_id)
    for fact in records.get("facts", []):
        fid = fact.get("fact_id")
        if fid in present:
            catalog[fid] = _record(fid, "Reported fact", "reported_fact", f"{root}/facts.md", fact.get("text"), fact)
    for assumption in records.get("assumptions", []):
        aid = assumption.get("assumption_id")
        if aid in present:
            catalog[aid] = _record(aid, "Assumption", "generated_assumption", f"{root}/facts.md", assumption.get("text"), assumption)

    from app.services.workspace import WorkspaceService
    workspace = WorkspaceService(app.vault, app.matters, app.dossiers)
    for question in workspace.questions(matter_id):
        qid = question.get("question_id")
        if qid in present:
            catalog[qid] = _record(qid, "Open question", "open_question", f"{root}/workspace.md", question.get("text"), question)
    for issue in workspace.issues(matter_id):
        iid = issue.get("issue_id")
        if iid in present:
            catalog[iid] = _record(iid, "Issue", "saved_artifact", f"{root}/issues.md", issue.get("title"), issue)

    for decision in app.index.list_decisions(matter_id=matter_id):
        did = decision.get("decision_id")
        if did in present and str(decision.get("path") or "").startswith(root + "/"):
            catalog[did] = _record(did, "Recorded decision", "recorded_decision", decision["path"], decision.get("title") or decision.get("summary"), decision)

    # Sources / research packets present in the text, only within this matter.
    for path in app.vault.iter_files(f"{root}/research", {".md"}):
        rel = app.vault.relative(path)
        meta = app.vault.read_markdown(rel)["metadata"]
        for key in ("research_id", "source_id"):
            rid = meta.get(key)
            if rid in present:
                cls = "retrieved_source" if meta.get("external_search_enabled") else "supplied_source"
                catalog[rid] = _record(rid, str(meta.get("title") or "Research"), cls, rel, meta.get("question") or meta.get("title"), meta)
    return catalog


def _record(source_id, label_kind, source_class, path, excerpt, raw) -> dict[str, Any]:
    from app.services.workspace import digest

    text = str(excerpt or "").strip()
    short = (text[:80] + "…") if len(text) > 80 else text
    return {
        "source_id": source_id,
        "source_label": f"{label_kind}: {short}" if short else label_kind,
        "source_class": source_class,
        "path": path,
        "available_excerpt": text,
        "record_revision": digest(raw),
        "locator": None,
    }


def bind_references(text: str, catalog: dict[str, dict[str, Any]]) -> str:
    """Bind known bare IDs to [source:ID] markers; flag unknown ones honestly.

    Known artifact/decision paths are left to the existing path handling. A
    reference-shaped ID not in the catalog becomes an explicit
    "Reference unavailable: ID" rather than a generic humanized label. IDs inside
    an existing marker or link are left untouched.
    """
    if not text:
        return text
    # Protect spans already inside a marker or link.
    protected = [(m.start(), m.end()) for m in _ALREADY_MARKED.finditer(text)]

    def in_protected(pos: int) -> bool:
        return any(start <= pos < end for start, end in protected)

    def replace(match: re.Match[str]) -> str:
        if in_protected(match.start()):
            return match.group(0)
        rid = match.group(0)
        if rid in catalog:
            return f"[source:{rid}]"
        return f"Reference unavailable: {rid}"

    bound = _REFERENCE_ID.sub(replace, text)

    # Convert a bare known artifact/decision path to a named Markdown link. Only
    # paths already in the (matter-scoped) catalog qualify, so a traversal or
    # cross-matter path is never turned into a link.
    for entry in catalog.values():
        path = entry.get("path")
        title = entry.get("source_label") or "Saved record"
        if not path or entry.get("source_class") not in {"saved_artifact", "recorded_decision", "retrieved_source", "supplied_source"}:
            continue
        # Skip if already inside a link: replace only bare, unlinked occurrences.
        pattern = re.compile(r"(?<!\]\()" + re.escape(path) + r"(?![\w/])")
        bound = pattern.sub(f"[{title}]({path})", bound)
    return bound


def catalog_source_records(catalog: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    """The persisted source records for the bound IDs (no invented entries)."""
    return list(catalog.values())
