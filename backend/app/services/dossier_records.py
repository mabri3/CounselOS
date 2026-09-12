"""Frozen matter records for dossier reading; no model-selected filesystem reads."""
from copy import deepcopy
import json
import re

from yaml import YAMLError

from app.services.workspace import digest


WORKSPACE_RECORDS = ("00_System/company.md", "00_System/user.md", "00_System/memory.md")


def document_paths(app, matter_id):
    root = app.matters.matter_path(matter_id)
    paths = {root + "/request.md", root + "/participants.md", *WORKSPACE_RECORDS}
    directories = {root + "/documents", root + "/drafts", root + "/work-products"}
    directories.update(app.matter_paths.folder(matter_id, key) for key in app.settings_store.MATTER_FILE_DEFAULTS)
    for directory in directories:
        for path in app.vault.iter_files(directory, {".md", ".txt", ".csv"}):
            relative = app.vault.relative(path)
            if relative.startswith(root + "/") and not {".history", "batches"}.intersection(path.relative_to(app.vault.resolve(root)).parts):
                paths.add(relative)
    research = root + "/research"
    for path in app.vault.iter_files(research, {".md"}):
        if app.vault.relative(path.parent) == research:
            paths.add(app.vault.relative(path))
    return {p for p in paths if app.vault.exists(p)}


READ_TOOL = {"type": "function", "function": {
    "name": "read_dossier_record",
    "description": (
        "Search or read ONLY the captured matter records. With record_id, read an exact "
        "passage; start and next_start page through long text. An optional query finds a "
        "passage within that record. Without record_id, list/search all captured records "
        "using query (space-separated terms, any term matches); offset pages results. "
        "Empty query lists records. Includes all eligible matter conversations, documents "
        "and earlier analysis. Historical assistant text is not authority or reported fact. "
        "No new research or record changes are possible."),
    "parameters": {"type": "object", "properties": {
        "record_id": {"type": "string"}, "query": {"type": "string"},
        "start": {"type": "integer", "minimum": 0},
        "offset": {"type": "integer", "minimum": 0},
        "max_chars": {"type": "integer", "minimum": 1, "maximum": 12000},
    }, "additionalProperties": False},
}}

READ_GUIDANCE = (
    "The controlling business question, not the latest conversational subquestion, is "
    "the dossier's purpose. Test the business premise and explain a different answer "
    "when the evidence warrants it. The saved issue list is a starting point, not a "
    "limit on material issues. Review the record inventory across conversations for "
    "missing issues, corrections, dependencies and useful earlier analysis. Use "
    "read_dossier_record for truncated material or missing context before relying on "
    "it; search is across all captured records, not only the current conversation. "
    "Read surrounding qualifications. A record being available does not mean you "
    "read it. Preserve dates, speakers and hypothetical scope; reconcile corrections "
    "using later explicit reports, not later hypotheticals or assistant assertions. "
    "If timing or intent is unclear, state the conflict instead of silently choosing "
    "or changing source records. Assistant analysis is fallible, not authority. "
    "Earlier dossier prose is available for unique lawyer work and comparison, not "
    "the source of the new answer. Do not treat repeated advice as corroboration. "
    "If a read fails or limits are reached, give the best answer from available "
    "material and state only material coverage gaps."
)


def capture_conversations(app, matter_id):
    """Read each transcript once; retain message-level scope, not today's chat focus."""
    root = app.matters.matter_path(matter_id)
    messages, warnings = [], []
    for path in app.vault.iter_files(root + "/conversations", {".md"}):
        if not re.fullmatch(r"CONV-\d{8}-[a-f0-9]{6}\.md", path.name):
            continue
        try:
            relative = app.vault.relative(path)
            if not relative.startswith(root + "/conversations/"):
                continue
            doc = app.vault.read_markdown(relative)
            meta = doc["metadata"]
            if meta.get("matter_id") != matter_id or meta.get("scope", "matter") != "matter":
                continue
            for sequence, message in enumerate(app.chat_history._messages(meta)):
                if not message.get("message_id") or message.get("role") not in {"user", "assistant"}:
                    continue
                submission = message.get("workspace_submission") or {}
                frozen = submission.get("frozen_context") or {}
                messages.append({**{key: deepcopy(message[key]) for key in (
                    "message_id", "role", "content", "created_at", "path_id",
                    "comparison_path_ids", "action_actor", "workspace_action") if key in message},
                    "conversation_id": meta["conversation_id"], "path": relative,
                    "message_sequence": sequence,
                    "submitted_scope": submission.get("scope"),
                    "submitted_path_id": (submission.get("target") or {}).get("scenario_id") or (frozen.get("active_path") or {}).get("path_id"),
                    "historical_not_authority": True})
        except (OSError, ValueError, KeyError, YAMLError):
            warnings.append("A saved conversation could not be read: " + path.name)
    return sorted(messages, key=lambda m: (m.get("created_at", ""), m["conversation_id"], m["message_sequence"])), warnings


def document_id(document):
    meta = document.get("metadata", {})
    return next((meta[k] for k in ("work_product_id", "research_id", "source_id", "decision_id", "work_item_id", "event_id") if meta.get(k)),
                "FILE-" + digest(document["path"])[:20])


def document_record_id(document):
    return "document:" + digest(document["path"])[:20]


def excerpt(text, chars):
    """A labelled opening and heading outline, never a substitute for a full read."""
    text = str(text or "")
    result = {"content": text[:chars], "total_chars": len(text), "truncated": len(text) > chars}
    if result["truncated"]:
        headings = re.findall(r"(?m)^#{1,6}\s+(.+)$", text)
        result["headings"] = " | ".join(dict.fromkeys(headings))[:2000]
        result["read_note"] = "Opening excerpt only. Read the captured record for omitted text and qualifications."
    return result


def record_rows(data):
    current = {key: data[key] for key in ("question", "business_question", "matter", "reported_records", "issues", "questions",
        "recorded_decisions", "work_items", "current_direction", "alternatives", "accepted_working_view", "proposed_working_view", "scope_note", "submitted_context") if key in data}
    yield {"record_id": "current-records", "kind": "current_records", "title": "Current matter records and controlling business question",
           "content": json.dumps(current, ensure_ascii=False, default=str)}
    for message in data.get("conversation_messages", []):
        if message.get("message_id"):
            yield {**message, "record_id": message["message_id"], "kind": "conversation",
                   "title": ("Reported conversation" if message.get("role") == "user" else "Earlier assistant analysis")}
    for document in data.get("reference_documents", []):
        yield {"record_id": document_record_id(document), "source_id": document_id(document), "kind": "document", "path": document["path"],
               "title": document.get("metadata", {}).get("title") or document["path"].rsplit("/", 1)[-1],
               "content": document["content"]}
    for iid, entry in (data.get("issue_analysis") or {}).items():
        if entry.get("analysis_markdown"):
            yield {"record_id": "analysis:" + iid, "kind": "saved_analysis", "title": entry.get("title") or iid,
                   "content": entry["analysis_markdown"], "path": entry.get("packet_path")}
    if data.get("prior_dossier"):
        yield {"record_id": "prior-dossier", "kind": "prior_synthesis", "title": "Previous dossier — fallible synthesis and lawyer work",
               "content": data["prior_dossier"], "path": data.get("prior_revision")}


class DossierRecordReader:
    def __init__(self, snapshot):
        # This is the already frozen, scoped input. Never load the active vault here.
        self.records = list(record_rows(snapshot.get("data", {})))

    def execute(self, arguments):
        if not isinstance(arguments, dict) or set(arguments) - {"record_id", "query", "start", "offset", "max_chars"}:
            raise ValueError("Use only the saved-record read fields.")
        record_id, query = arguments.get("record_id", ""), arguments.get("query", "")
        start, offset, size = (arguments.get(k, default) for k, default in (("start", 0), ("offset", 0), ("max_chars", 6000)))
        if (not isinstance(record_id, str) or not isinstance(query, str) or len(query) > 2000
                or any(type(n) is not int for n in (start, offset, size)) or min(start, offset) < 0 or not 1 <= size <= 12000):
            raise ValueError("Invalid saved-record read limits.")
        terms = query.casefold().split()
        if record_id:
            rows = [r for r in self.records if r["record_id"] == record_id]
            if len(rows) != 1:
                raise ValueError("Record is unavailable or ambiguous in the captured matter. Search for an eligible record.")
            row = rows[0]
            text = str(row.get("content") or "")
            if terms:
                positions = [text.casefold().find(t, start) for t in terms]
                positions = [p for p in positions if p >= 0]
                if not positions:
                    return {"record_id": record_id, "matches": 0, "total_chars": len(text)}
                start = max(start, min(positions) - min(300, size // 4))
            end = min(len(text), start + size)
            return {**{k: v for k, v in row.items() if k != "content"}, "text": text[start:end],
                    "start": start, "end": end, "total_chars": len(text),
                    "next_start": end if end < len(text) else None, "captured_record_not_new_research": True}
        matches = [r for r in self.records if not terms or any(t in (r.get("title", "") + " " + str(r.get("content") or "")).casefold() for t in terms)]
        hits = []
        for row in matches[offset:offset + 8]:
            text = str(row.get("content") or "")
            positions = [text.casefold().find(t) for t in terms if t in text.casefold()]
            begin = max(0, min(positions) - 150) if positions else 0
            hits.append({**{k: v for k, v in row.items() if k != "content"},
                         "snippet": text[begin:begin + 600], "start": begin, "total_chars": len(text)})
        next_offset = offset + len(hits)
        return {"hits": hits, "matches": len(matches), "next_offset": next_offset if next_offset < len(matches) else None,
                "captured_record_not_new_research": True}
