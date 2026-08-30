from __future__ import annotations

import re
from difflib import SequenceMatcher
from typing import Any

from app.models.api import DocumentReviewAction
from app.services.vault import VaultService
from app.utils.ids import new_id
from app.utils.time import iso_now

TOKEN_PATTERN = re.compile(r"\s+|[\w]+|[^\w\s]", re.UNICODE)
AUTHOR_PALETTE = ("#2F5597", "#7030A0", "#008272", "#A64B00", "#C0006F", "#5B6573", "#7A3E00", "#006B8F")


def _segment(kind: str, text: str, change_id: str = "", author: dict[str, str] | None = None, created_at: str = "") -> dict[str, str]:
    author = author or {}
    return {"kind": kind, "text": text, "change_id": change_id, "author_id": author.get("author_id", ""),
            "author_name": author.get("name", ""), "author_color": author.get("color", ""), "created_at": created_at}


def review_segments(baseline: str, current: str, author: dict[str, str] | None = None) -> list[dict[str, str]]:
    old, new = TOKEN_PATTERN.findall(baseline), TOKEN_PATTERN.findall(current)
    result: list[dict[str, str]] = []
    for tag, i1, i2, j1, j2 in SequenceMatcher(None, old, new, autojunk=False).get_opcodes():
        before, after = "".join(old[i1:i2]), "".join(new[j1:j2])
        if tag == "equal":
            result.append(_segment("equal", after))
            continue
        change_id, created_at = new_id("CHG"), iso_now()
        if before:
            result.append(_segment("delete", before, change_id, author, created_at))
        if after:
            result.append(_segment("insert", after, change_id, author, created_at))
    return result


def review_changes(segments: list[dict[str, Any]]) -> list[dict[str, str]]:
    grouped: dict[str, dict[str, str]] = {}
    for segment in segments:
        change_id = str(segment.get("change_id") or "")
        if not change_id:
            continue
        change = grouped.setdefault(change_id, {"change_id": change_id, "old_text": "", "new_text": "",
            "author_id": str(segment.get("author_id") or ""), "author_name": str(segment.get("author_name") or ""),
            "author_color": str(segment.get("author_color") or ""), "created_at": str(segment.get("created_at") or "")})
        change["old_text" if segment.get("kind") == "delete" else "new_text"] += str(segment.get("text") or "")
        if segment.get("kind") == "insert":
            change["old_text"] += str(segment.get("replaced_text") or "")
    return list(grouped.values())


def _current(segments: list[dict[str, Any]]) -> str:
    return "".join(str(item.get("text") or "") for item in segments if item.get("kind") != "delete")


class DocumentReviewService:
    def __init__(self, vault: VaultService):
        self.vault = vault

    def get(self, path: str) -> dict[str, Any]:
        document = self._document(path)
        review = self._review(document)
        if document.get("metadata", {}).get("review") != review:
            metadata = dict(document["metadata"])
            metadata["review"] = review
            self.vault.write_markdown(path, document["content"], metadata)
        return {"path": path, "tracking": review["tracking"], "authors": review["authors"],
                "segments": review["segments"], "changes": review_changes(review["segments"]),
                "comments": review["comments"], "comment_events": review["comment_events"]}

    def apply(self, path: str, request: DocumentReviewAction) -> dict[str, Any]:
        document = self._document(path)
        metadata, review = dict(document["metadata"]), self._review(document)
        current, action = _current(review["segments"]), request.action
        if action == "set_tracking":
            if request.enabled is None:
                raise ValueError("The tracking state is required.")
            review["tracking"] = request.enabled
        elif action == "save_revision":
            author = self._require_author(review, request)
            if request.content is None:
                raise ValueError("Revision content is required.")
            if not review["tracking"]:
                raise ValueError("Turn on Track Changes before saving a revision.")
            current = self._normalize_content(request.content, current)
            review["segments"] = self._compose_revision(review["segments"], current, author)
        elif action == "save_untracked":
            if request.content is None:
                raise ValueError("Document content is required.")
            if review["tracking"]:
                raise ValueError("Turn off Track Changes before saving untracked edits.")
            current = self._normalize_content(request.content, current)
            review["segments"] = self._compose_untracked(review["segments"], current)
        elif action == "set_author_color":
            color = request.color or request.author_color
            if color not in AUTHOR_PALETTE:
                raise ValueError("Choose a color from the approved author palette.")
            author = next((a for a in review["authors"] if a.get("author_id") == request.author_id), None)
            if not author:
                raise ValueError("Review author not found.")
            author["color"] = color
            self._update_segment_author_color(review["segments"], str(request.author_id), color)
        elif action in {"add_comment", "reply_comment"}:
            author, body = self._require_author(review, request), self._required(request.body, "Comment text is required.")
            if action == "add_comment":
                quote = self._required(request.quote, "Selected text is required.")
                if (request.anchor_start is None) != (request.anchor_end is None):
                    raise ValueError("Both comment anchor offsets are required together.")
                if request.anchor_start is not None and request.anchor_end is not None:
                    start, end = request.anchor_start, request.anchor_end
                    if start < 0 or end <= start or end > len(current):
                        raise ValueError("Comment anchor offsets are outside the document text.")
                    if current[start:end] != quote:
                        raise ValueError("Comment anchor offsets do not match the selected text.")
                else:
                    start = current.find(quote)
                    if start < 0:
                        raise ValueError("Selected text was not found in the document.")
                    end = start + len(quote)
                review["comments"].append({"thread_id": new_id("COM"), "quote": quote, "anchor_start": start,
                    "anchor_end": end, "resolved": False, "resolved_at": "", "resolved_by": "",
                    "entries": [self._entry(author, body)]})
            else:
                self._thread(review, request.thread_id)["entries"].append(self._entry(author, body))
        elif action in {"edit_comment", "delete_comment_entry"}:
            actor = self._required(request.author_id, "The active lawyer identity is required.")
            thread = self._thread(review, request.thread_id)
            entry = next((e for e in thread["entries"] if e.get("comment_id") == request.comment_id), None)
            if not entry:
                raise ValueError("Comment entry not found.")
            if entry.get("author_id") == "author-themis" or str(entry.get("author_id") or "").startswith("author-imported"):
                raise ValueError("Themis and imported comment entries are immutable.")
            if entry.get("author_id") != actor:
                raise ValueError("You can change only your own comment entries.")
            if action == "edit_comment":
                entry["body"], entry["edited_at"] = self._required(request.body, "Comment text is required."), iso_now()
            else:
                thread["entries"].remove(entry)
        elif action in {"resolve_comment", "reopen_comment"}:
            thread, resolved = self._thread(review, request.thread_id), action == "resolve_comment"
            actor = self._required(request.author_name, "An author name is required.")
            thread.update({"resolved": resolved, "resolved_at": iso_now() if resolved else "",
                           "resolved_by": actor if resolved else ""})
        elif action == "delete_comment_thread":
            actor = self._required(request.author_name, "An author name is required.")
            thread = self._thread(review, request.thread_id)
            review["comments"].remove(thread)
            self._deletion_event(review, thread["thread_id"], actor)
        elif action == "delete_resolved_comments":
            actor = self._required(request.author_name, "An author name is required.")
            deleted = [thread for thread in review["comments"] if thread.get("resolved")]
            review["comments"] = [thread for thread in review["comments"] if not thread.get("resolved")]
            for thread in deleted:
                self._deletion_event(review, thread["thread_id"], actor)
        elif action in {"accept_change", "reject_change"}:
            change_id = self._required(request.change_id, "A change ID is required.")
            if change_id not in {change["change_id"] for change in review_changes(review["segments"])}:
                raise ValueError("Tracked change not found. Refresh the document and try again.")
            review["segments"] = self._decide(review["segments"], change_id, action == "accept_change")
            current = _current(review["segments"])
        metadata["review"] = review
        self.vault.write_markdown(path, current, metadata)
        return self.get(path)

    def propose_agent_revision(self, path: str, content: str, metadata_updates: dict[str, Any] | None = None, *,
                               author_name: str = "Themis", lawyer_author: str | None = None) -> str:
        document = self._document(path)
        metadata, review = dict(document["metadata"]), self._review(document)
        metadata.update(metadata_updates or {})
        author = self._ensure_author(review, author_name)
        content = self._normalize_content(content, document["content"])
        review["tracking"] = True
        review["segments"] = self._compose_revision(review["segments"], content, author)
        review["last_proposed_by"], review["last_proposed_at"] = author_name, iso_now()
        metadata["review"] = review
        return self.vault.write_markdown(path, content, metadata)

    def _document(self, path: str) -> dict[str, Any]:
        document = self.vault.read_document(path)
        if document.get("kind") != "markdown" or not document.get("editable"):
            raise ValueError("Review is available only for editable Markdown documents.")
        return document

    def _review(self, document: dict[str, Any]) -> dict[str, Any]:
        raw = document.get("metadata", {}).get("review", {})
        review = dict(raw) if isinstance(raw, dict) else {}
        if review.get("version") != 2 or not isinstance(review.get("segments"), list):
            baseline = str(review.get("baseline") or document["content"])
            prior_author = str(review.get("last_proposed_by") or "Themis").strip() or "Themis"
            author_id = "author-themis" if prior_author == "Themis" else "author-" + re.sub(r"[^a-z0-9]+", "-", prior_author.lower()).strip("-")
            review["segments"] = review_segments(baseline, document["content"], self._author(prior_author, 0, author_id))
            review["comments"] = [self._legacy_comment(item) for item in review.get("comments", []) if isinstance(item, dict)]
        review.update({"version": 2, "tracking": bool(review.get("tracking"))})
        review["authors"] = [dict(item) for item in review.get("authors", []) if isinstance(item, dict)]
        for segment in review["segments"]:
            if segment.get("author_id") and not any(a.get("author_id") == segment.get("author_id") for a in review["authors"]):
                review["authors"].append({"author_id": segment["author_id"], "name": segment.get("author_name", ""), "color": segment.get("author_color", AUTHOR_PALETTE[0])})
        review["comments"] = [dict(item) for item in review.get("comments", []) if isinstance(item, dict)]
        review["comment_events"] = [dict(item) for item in review.get("comment_events", []) if isinstance(item, dict)]
        review.pop("baseline", None)
        if review["tracking"] and _current(review["segments"]) != document["content"]:
            author = self._ensure_author(review, "Themis")
            review["segments"] = self._compose_revision(review["segments"], document["content"], author)
        return review

    @staticmethod
    def _legacy_comment(item: dict[str, Any]) -> dict[str, Any]:
        thread_id, body = str(item.get("thread_id") or item.get("comment_id") or new_id("COM")), str(item.get("body") or item.get("comment") or "")
        name = str(item.get("author_name") or item.get("author") or "Imported reviewer")
        return {"thread_id": thread_id, "quote": str(item.get("quote") or ""), "anchor_start": int(item.get("anchor_start") or 0),
                "anchor_end": int(item.get("anchor_end") or 0), "resolved": bool(item.get("resolved")),
                "resolved_at": str(item.get("resolved_at") or ""), "resolved_by": str(item.get("resolved_by") or ""),
                "entries": [{"comment_id": new_id("MSG"), "author_id": "author-imported", "author_name": name, "body": body,
                             "created_at": str(item.get("created_at") or "")} ]}

    def _require_author(self, review: dict[str, Any], request: DocumentReviewAction) -> dict[str, str]:
        name, author_id = self._required(request.author_name, "An author name is required."), self._required(request.author_id, "An author ID is required.")
        if request.author_color is not None and request.author_color not in AUTHOR_PALETTE:
            raise ValueError("Choose a color from the approved author palette.")
        found = next((a for a in review["authors"] if a.get("author_id") == author_id), None)
        if found:
            found["name"] = name
            return found
        author = {"author_id": author_id, "name": name, "color": request.author_color or AUTHOR_PALETTE[len(review["authors"]) % len(AUTHOR_PALETTE)]}
        review["authors"].append(author)
        return author

    def _ensure_author(self, review: dict[str, Any], name: str) -> dict[str, str]:
        name = self._required(name, "An author name is required.")
        author_id = "author-themis" if name == "Themis" else "author-" + re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
        found = next((a for a in review["authors"] if a.get("author_id") == author_id), None)
        if found:
            return found
        author = self._author(name, len(review["authors"]), author_id)
        review["authors"].append(author)
        return author

    @staticmethod
    def _author(name: str, index: int, author_id: str = "author-themis") -> dict[str, str]:
        return {"author_id": author_id, "name": name, "color": AUTHOR_PALETTE[index % len(AUTHOR_PALETTE)]}

    @staticmethod
    def _required(value: str | None, message: str) -> str:
        result = (value or "").strip()
        if not result:
            raise ValueError(message)
        return result

    @staticmethod
    def _normalize_content(content: str, existing: str) -> str:
        return content + "\n" if existing.endswith("\n") and not content.endswith("\n") else content

    @staticmethod
    def _entry(author: dict[str, str], body: str) -> dict[str, str]:
        return {"comment_id": new_id("MSG"), "author_id": author["author_id"], "author_name": author["name"], "body": body, "created_at": iso_now()}

    @staticmethod
    def _thread(review: dict[str, Any], thread_id: str | None) -> dict[str, Any]:
        found = next((thread for thread in review["comments"] if thread.get("thread_id") == thread_id), None)
        if not found:
            raise ValueError("Comment thread not found.")
        return found

    @staticmethod
    def _deletion_event(review: dict[str, Any], thread_id: str, actor: str | None) -> None:
        review["comment_events"].append({"event_id": new_id("EVT"), "thread_id": thread_id, "action": "deleted",
                                         "actor": (actor or "").strip(), "created_at": iso_now()})

    @staticmethod
    def _update_segment_author_color(segments: list[dict[str, Any]], author_id: str, color: str) -> None:
        for segment in segments:
            if segment.get("author_id") == author_id:
                segment["author_color"] = color
            nested = segment.get("replaced_segments")
            if isinstance(nested, list):
                DocumentReviewService._update_segment_author_color(nested, author_id, color)

    @staticmethod
    def _decide(segments: list[dict[str, Any]], change_id: str, accept: bool) -> list[dict[str, Any]]:
        container = next((item for item in segments if item.get("kind") == "insert" and any(
            nested.get("change_id") == change_id for nested in item.get("replaced_segments", []))), None)
        if container:
            later_author = {"author_id": str(container.get("author_id") or ""),
                            "name": str(container.get("author_name") or ""),
                            "color": str(container.get("author_color") or "")}
            later_id, later_at = str(container.get("change_id") or ""), str(container.get("created_at") or "")
            nested_text = "".join(str(item.get("text") or "") for item in container.get("replaced_segments", [])
                                  if item.get("change_id") == change_id)
            rebased: list[dict[str, Any]] = []
            for item in segments:
                if item.get("change_id") == change_id:
                    if not accept and item.get("kind") == "delete":
                        rebased.append(_segment("delete", str(item.get("text") or ""), later_id, later_author, later_at))
                    continue
                if item is container:
                    if accept and nested_text:
                        rebased.append(_segment("delete", nested_text, later_id, later_author, later_at))
                    updated = dict(item)
                    remaining = [dict(nested) for nested in item.get("replaced_segments", [])
                                 if nested.get("change_id") != change_id]
                    updated.pop("replaced_text", None)
                    if remaining:
                        updated["replaced_segments"] = remaining
                        updated["replaced_text"] = "".join(str(nested.get("text") or "") for nested in remaining)
                    else:
                        updated.pop("replaced_segments", None)
                    rebased.append(updated)
                else:
                    rebased.append(item)
            return rebased
        result = []
        for item in segments:
            if item.get("change_id") != change_id:
                result.append(item)
            elif item.get("kind") == "delete" and not accept:
                result.append(_segment("equal", str(item.get("text") or "")))
            elif item.get("kind") == "insert" and not accept:
                result.extend(dict(segment) for segment in item.get("replaced_segments", []))
            elif item.get("kind") == "insert" and accept:
                replaced = [segment for segment in item.get("replaced_segments", []) if segment.get("kind") == "insert"]
                if replaced:
                    inherited = dict(replaced[0])
                    inherited["text"] = str(item.get("text") or "")
                    result.append(inherited)
                else:
                    result.append(_segment("equal", str(item.get("text") or "")))
        return result

    @staticmethod
    def _compose_revision(segments: list[dict[str, Any]], content: str, author: dict[str, str]) -> list[dict[str, Any]]:
        old = _current(segments)
        old_tokens, new_tokens = TOKEN_PATTERN.findall(old), TOKEN_PATTERN.findall(content)
        offsets: list[tuple[int, int, dict[str, Any]]] = []
        cursor = 0
        for item in segments:
            if item.get("kind") == "delete":
                continue
            end = cursor + len(str(item.get("text") or ""))
            offsets.append((cursor, end, item))
            cursor = end

        def pieces(start: int, end: int) -> list[dict[str, Any]]:
            result: list[dict[str, Any]] = []
            for left, right, item in offsets:
                if right <= start or left >= end:
                    continue
                piece = dict(item)
                piece["text"] = str(item.get("text") or "")[max(start, left) - left:min(end, right) - left]
                if piece["text"]:
                    result.append(piece)
            return result

        token_offsets = [0]
        for token in old_tokens:
            token_offsets.append(token_offsets[-1] + len(token))
        output: list[dict[str, Any]] = []
        hidden_by_position: dict[int, list[dict[str, Any]]] = {}
        visible_cursor = 0
        for item in segments:
            if item.get("kind") == "delete":
                hidden_by_position.setdefault(visible_cursor, []).append(dict(item))
            else:
                visible_cursor += len(str(item.get("text") or ""))

        for tag, i1, i2, j1, j2 in SequenceMatcher(None, old_tokens, new_tokens, autojunk=False).get_opcodes():
            start, end = token_offsets[i1], token_offsets[i2]
            output.extend(hidden_by_position.pop(start, []))
            if tag == "equal":
                piece_start = start
                for position in sorted(value for value in hidden_by_position if start < value < end):
                    output.extend(pieces(piece_start, position))
                    output.extend(hidden_by_position.pop(position))
                    piece_start = position
                output.extend(pieces(piece_start, end))
                continue
            prior = pieces(start, end)
            for position in sorted(value for value in hidden_by_position if start < value <= end):
                output.extend(hidden_by_position.pop(position))
            change_id, created_at = new_id("CHG"), iso_now()
            replaced = [item for item in prior if item.get("kind") == "insert"]
            for item in prior:
                if item.get("kind") == "equal":
                    output.append(_segment("delete", str(item.get("text") or ""), change_id, author, created_at))
            new_text = "".join(new_tokens[j1:j2])
            if new_text:
                inserted = _segment("insert", new_text, change_id, author, created_at)
                if replaced:
                    inserted["replaced_segments"] = replaced
                    inserted["replaced_text"] = "".join(str(item.get("text") or "") for item in replaced)
                output.append(inserted)
        for position in sorted(hidden_by_position):
            output.extend(hidden_by_position[position])
        return output

    @staticmethod
    def _compose_untracked(segments: list[dict[str, Any]], content: str) -> list[dict[str, Any]]:
        old = _current(segments)
        old_tokens, new_tokens = TOKEN_PATTERN.findall(old), TOKEN_PATTERN.findall(content)
        offsets: list[tuple[int, int, dict[str, Any]]] = []
        cursor = 0
        for item in segments:
            if item.get("kind") == "delete":
                continue
            end = cursor + len(str(item.get("text") or ""))
            offsets.append((cursor, end, item))
            cursor = end

        def pieces(start: int, end: int) -> list[dict[str, Any]]:
            result: list[dict[str, Any]] = []
            for left, right, item in offsets:
                if right <= start or left >= end:
                    continue
                piece = dict(item)
                piece["text"] = str(item.get("text") or "")[max(start, left) - left:min(end, right) - left]
                if piece["text"]:
                    result.append(piece)
            return result

        token_offsets = [0]
        for token in old_tokens:
            token_offsets.append(token_offsets[-1] + len(token))
        hidden_by_position: dict[int, list[dict[str, Any]]] = {}
        visible_cursor = 0
        for item in segments:
            if item.get("kind") == "delete":
                hidden_by_position.setdefault(visible_cursor, []).append(dict(item))
            else:
                visible_cursor += len(str(item.get("text") or ""))

        output: list[dict[str, Any]] = []
        for tag, i1, i2, j1, j2 in SequenceMatcher(None, old_tokens, new_tokens, autojunk=False).get_opcodes():
            start, end = token_offsets[i1], token_offsets[i2]
            output.extend(hidden_by_position.pop(start, []))
            if tag == "equal":
                piece_start = start
                for position in sorted(value for value in hidden_by_position if start < value < end):
                    output.extend(pieces(piece_start, position))
                    output.extend(hidden_by_position.pop(position))
                    piece_start = position
                output.extend(pieces(piece_start, end))
                continue
            for position in sorted(value for value in hidden_by_position if start < value <= end):
                output.extend(hidden_by_position.pop(position))
            new_text = "".join(new_tokens[j1:j2])
            if new_text:
                output.append(_segment("equal", new_text))
        for position in sorted(hidden_by_position):
            output.extend(hidden_by_position[position])
        return output
