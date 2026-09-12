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

from copy import deepcopy
import re
from typing import Any

# Reference-bearing ID prefixes (record identities), distinct from purely
# internal ids (RUN/MAT/CONV/ACT...) which stay humanized.
_REFERENCE_ID = re.compile(r"\b(FACT|ASM|Q|ISS|DEC|SRC|RES|EVT|WI|WP|MSG|FILE)-[A-Za-z0-9][A-Za-z0-9-]*\b")
_ALREADY_MARKED = re.compile(r"<!--.*?-->|\[source:[^\]]+\]|\[[^\]\n]+\]\([^)]+\)")


def _matter_paths(app, matter_id: str) -> tuple[str, set[str]]:
    root = app.matters.matter_path(matter_id)
    return root, {root}


def build_catalog(app, matter_id: str, *, output_text: str | None = None, snapshot=None) -> dict[str, dict[str, Any]]:
    """Bind only captured records. Never recapture a changed fact or guess a version."""
    present = {m.group(0) for m in _REFERENCE_ID.finditer(output_text or "")} if output_text is not None else None
    root = app.matters.matter_path(matter_id)
    data = (snapshot or {}).get("data", {})
    if snapshot is not None and "references" in snapshot:
        return {key: item for key, item in snapshot["references"].items()
                if present is None or item.get("source_id") in present or item.get("path") and item["path"] in (output_text or "")}
    records = data.get("reported_records", {}) if snapshot is not None else app.matter_records.get(matter_id)
    entries = []
    groups = [
        (records.get("facts", []), "fact_id", "Reported fact", "reported_fact", root + "/facts.md"),
        (records.get("assumptions", []), "assumption_id", "Assumption", "generated_assumption", root + "/facts.md"),
        (data.get("questions", []) if snapshot is not None else app.workspace.questions(matter_id), "question_id", "Open question", "open_question", root + "/workspace.md"),
        (data.get("issues", []) if snapshot is not None else app.workspace.issues(matter_id), "issue_id", "Issue", "saved_artifact", root + "/issues.md"),
        (data.get("recorded_decisions", []) if snapshot is not None else app.index.list_decisions(matter_id=matter_id), "decision_id", "Recorded decision", "recorded_decision", None),
        (data.get("work_items", []), "work_item_id", "Work item", "saved_artifact", None),
        (data.get("conversation_messages", []), "message_id", "Saved message", "saved_artifact", None),
    ]
    for values, key, label, kind, default_path in groups:
        for raw in values:
            rid = raw.get(key)
            path = raw.get("path") or default_path
            if rid and path and (present is None or rid in present):
                entries.append(_record(rid, label, kind, path, raw.get("text") or raw.get("content") or raw.get("title") or raw.get("summary"), raw))
    for document in data.get("reference_documents", []):
        raw, path = document["metadata"], document["path"]
        rid = next((raw[k] for k in ("work_product_id", "research_id", "source_id", "decision_id", "work_item_id", "event_id") if raw.get(k)), None)
        if not rid:
            from app.services.workspace import digest
            rid = "FILE-" + digest(path)[:20]
        entries = [entry for entry in entries if (entry.get("source_id"), entry.get("path")) != (rid, path)]
        entries.append(_record(rid, raw.get("title") or path.rsplit("/", 1)[-1], "saved_artifact", path, document["content"], document))
    sources = list((data.get("latest_research") or {}).get("source_records") or [])
    publication = (data.get("proposed_working_view") or {}).get("research_publication") or {}
    for position in (publication.get("issue_positions") or {}).values():
        sources.extend(position.get("source_records") or [])
    for position in (data.get("issue_analysis") or {}).values():
        sources.extend(position.get("source_records") or [])
    if snapshot is None:
        # Legacy helper: ambiguous source versions stay unresolved.
        for path in app.vault.iter_files(root + "/research", {".md"}):
            doc = app.vault.read_markdown(app.vault.relative(path)); raw = doc["metadata"]
            rid = raw.get("research_id") or raw.get("source_id")
            if rid and (present is None or rid in present):
                sources.append({**raw, "source_id": rid, "path": doc["path"], "available_excerpt": doc["content"]})
    entries.extend(sources)
    candidates = {}
    for entry in entries:
        rid, path = entry.get("source_id"), entry.get("path")
        if not rid or (present is not None and rid not in present and not (path and path in (output_text or ""))):
            continue
        if path:
            try:
                resolved = app.vault.relative(app.vault.resolve(path))
            except ValueError:
                continue
            from app.services.dossier_records import WORKSPACE_RECORDS
            if not resolved.startswith(root + "/") and not (snapshot is not None and resolved in WORKSPACE_RECORDS):
                continue
        versions = candidates.setdefault(rid, {})
        identity = (entry.get("source_version") or entry.get("source_hash") or entry.get("record_revision"), path)
        previous = versions.get(identity, {})
        merged = deepcopy(entry)
        if previous.get("selected_passages"):
            from app.services.workspace import digest
            passages = [*previous["selected_passages"], *(entry.get("selected_passages") or [])]
            merged["selected_passages"] = list({digest(p): deepcopy(p) for p in passages}.values())
        versions[identity] = merged
    catalog = {}
    for rid, versions in candidates.items():
        if len(versions) == 1:
            catalog[rid] = next(iter(versions.values()))
        else:
            for entry in versions.values():
                key = captured_reference_key(entry)
                catalog[key] = {**entry, "reference_key": key}
    return catalog


def captured_reference_key(record):
    """Use the existing marker locator slot to name a captured source version.

    This is a record identity, not a claim to an exact page or passage location.
    The source's original ID and literal locator remain unchanged in its record.
    """
    from app.services.workspace import digest
    version = record.get("source_version") or record.get("source_hash") or record.get("record_revision")
    return str(record["source_id"]) + "|saved-version-" + digest([version, record.get("path")])[:20]


def bind_issue_references(text, sources, catalog):
    local = {}
    bindings = dict(catalog)
    for source in sources:
        if not isinstance(source, dict) or not source.get("source_id"):
            continue
        key = captured_reference_key(source)
        if key in catalog:
            local.setdefault(source["source_id"], []).append(key)
    # Only a uniquely captured version in this answer can disambiguate an ID.
    for sid, keys in local.items():
        keys = list(dict.fromkeys(keys))
        if len(keys) != 1:
            continue
        text = re.sub(r"\[source:" + re.escape(sid) + r"(?:\|[^\]]+)?\]", "[source:" + keys[0] + "]", text)
        bindings[sid] = catalog[keys[0]]
    return bind_references(text, bindings)


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
        "record_revision": digest(raw), "source_version": digest(raw),
        "support_state": "supplied", "captured_record": raw,
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
            return "[source:" + str(catalog[rid].get("reference_key") or rid) + "]"
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
        # Models often wrap a cited path in inline code. Turn that complete
        # reference into a readable link, without leaving link syntax in code.
        bound = bound.replace("`" + path + "`", "[" + title + "](" + path + ")")
        # Skip if already inside a link: replace only bare, unlinked occurrences.
        pattern = re.compile(r"(?<!\]\()" + re.escape(path) + r"(?![\w/])")
        bound = pattern.sub(f"[{title}]({path})", bound)
    return _bind_saved_source_links(bound, catalog)


def _bind_saved_source_links(text, catalog):
    """A captured source identity controls its label, not a model-written caption."""
    targets = {}
    for key, record in catalog.items():
        # Local record links can have meaningful section captions. This handles
        # saved external research sources whose identity and support are known.
        if record.get("path") and record.get("url"):
            targets.setdefault(record["path"], set()).add(record.get("reference_key") or key)
    inline = re.compile(r"`+[^`\n]*`+|!?\[[^\]\n]*\]\(([^()\n]*)\)")
    def replace(match):
        keys = targets.get((match[1] or "").strip("<>"), set())
        return "[source:" + next(iter(keys)) + "]" if len(keys) == 1 and not match[0].startswith("!") else match[0]
    lines, fence = [], None
    for line in text.splitlines(keepends=True):
        boundary = re.match(r"^ {0,3}(`{3,}|~{3,})(.*)$", line.rstrip("\r\n"))
        if boundary:
            marker = boundary[1]
            if fence is None:
                fence = marker
            elif marker[0] == fence[0] and len(marker) >= len(fence) and not boundary[2].strip():
                fence = None
        elif fence is None and not line.startswith(("    ", "\t")):
            line = inline.sub(replace, line)
        lines.append(line)
    return "".join(lines)


def catalog_source_records(catalog: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    """The persisted source records for the bound IDs (no invented entries)."""
    return list(catalog.values())
