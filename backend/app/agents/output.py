from __future__ import annotations

from copy import deepcopy
import re


_INTERNAL_CONTROL_PREFIXES = (
    re.compile(r"^\s*do not mention the tool(?:\s*-?\s*step)?\s+limit\.\s*", re.IGNORECASE),
    re.compile(r"^\s*the tool-step limit has been reached\.\s*", re.IGNORECASE),
    re.compile(r"^\s*the time limit was reached\.\s*", re.IGNORECASE),
    re.compile(r"^\s*do not call (?:more )?tools\.\s*", re.IGNORECASE),
    re.compile(
        r"^\s*(?:deliver|give) the best useful answer(?: or work product)? "
        r"(?:available )?from the (?:conversation and tool observations|information already present)\.\s*",
        re.IGNORECASE,
    ),
    re.compile(r"^\s*state (?:only material )?remaining (?:gaps|work)\.\s*", re.IGNORECASE),
)
_INTERNAL_ONLY_LINE = re.compile(
    r"^\s*(?:system (?:instructions?|prompts?)|developer (?:instructions?|prompts?)|run_id|matter_id|conversation_id|message_id|"
    r"fact_id|event_id|work_item_id|decision_id|research_run_id|action_id|source_id|"
    r"assumption_id|source_action_key|tool_call_id|changed_paths?|active_file|vault_path)\s*[:=]",
    re.IGNORECASE,
)
_TOOL_SYNTAX_LINE = re.compile(
    r"^\s*(?:<tool_call>|</tool_call>|<function(?:=|\s)|tool call\s*:|function call\s*:|"
    r"\{\s*[\"'](?:tool_calls?|arguments|function)[\"']\s*:)",
    re.IGNORECASE,
)
_TOOL_PLUMBING_LINE = re.compile(
    r"\b(?:write_markdown|generic markdown tool|typed matter tools?)\b",
    re.IGNORECASE,
)
_INTERNAL_ID = re.compile(
    r"\b(?:RUN|MAT|CONV|MSG|FACT|ASM|EVT|EVENT|WI|WP|FINAL|DEC|RES|SRC|ACT)-[A-Za-z0-9][A-Za-z0-9-]*\b"
)
_ABSOLUTE_PATH = re.compile(r"(?<!\w)/(?:Users|home|private|tmp|var)/[^\s)`\]}>,;]+")
_VAULT_PATH = re.compile(
    r"\b(?:00_System|01_Playbooks|02_Company_Knowledge|03_Matters)/[^\s)`\]}>,;]+"
)
_REPOSITORY_PATH = re.compile(
    r"\b(?:app|backend|frontend|scripts|docs|graphify-out)/[^\s)`\]}>,;]+"
)
_INLINE_FUNCTION_TAG = re.compile(
    r"<function(?:=|\s)[^>]*>.*?</function>", re.IGNORECASE
)
_SENTENCE_BOUNDARY = re.compile(r"(?<=[.!?])(?=\s|$)")
_SPAN_BOUNDARY = re.compile(r"(?<=[.!?])(?=\s|$)|(?<=\n)")
_NEGATED_OR_HISTORICAL_MUTATION = re.compile(
    r"\b(?:not|no|never|cannot|can't|wasn't|weren't|didn't|hasn't|haven't|"
    r"previously|earlier|before|historically)\b",
    re.IGNORECASE,
)
_LIFECYCLE_PSEUDO_CONTROL_LINE = re.compile(
    r"^\s*(?:[-*]\s*)?(?:\[\s*(?:Approve|Edit|Hold|Finalize|Mark Delivered|Close)\s*\]\s*)+$",
    re.IGNORECASE,
)
_LIFECYCLE_PSEUDO_CONTROL_LABEL = re.compile(
    r"\[\s*(Approve|Edit|Hold|Finalize|Mark Delivered|Close)\s*\]",
    re.IGNORECASE,
)
_LIFECYCLE_CONTROL_OPERATIONS: dict[str, tuple[str, ...]] = {
    "approve": ("approve_response",),
    "finalize": ("finalize_work_product",),
    "mark delivered": ("mark_response_sent", "mark_as_sent"),
    "close": ("close_matter",),
}

# This is deliberately a closed list. It prevents a failed typed action from
# turning into a broad ban on ordinary legal analysis that happens to use a
# similar word (for example, "the issue map was created").
_MUTATION_SUCCESS_CLAIMS: dict[str, tuple[re.Pattern[str], ...]] = {
    "record_decision": (
        re.compile(r"\bi(?:'ve| have) recorded\b[^.!?\n]*\bdecision\b", re.IGNORECASE),
        re.compile(r"\b(?:i|we) (?:have )?recorded (?:a |the |this )?decision\b", re.IGNORECASE),
        re.compile(r"\b(?:i|we) (?:have )?saved (?:a |the |this )?decision\b", re.IGNORECASE),
        re.compile(r"\b(?:the |this )?decision (?:has been|was) (?:already )?recorded\b", re.IGNORECASE),
        re.compile(r"\b(?:the |this )?decision (?:has been|was) saved\b", re.IGNORECASE),
        re.compile(r"\b(?:the |this )?decision (?:is now )?already recorded\b", re.IGNORECASE),
        re.compile(r"\b(?:the )?durable matter decision is now recorded\b", re.IGNORECASE),
        re.compile(r"\b(?:the )?durable decision is recorded\b", re.IGNORECASE),
        re.compile(r"^\s{0,3}#{1,6}\s+Recorded decision\s*$", re.IGNORECASE),
    ),
    "run_research": (
        re.compile(r"\b(?:i|we) (?:have )?(?:started|ran|completed) (?:the )?research\b", re.IGNORECASE),
        re.compile(r"\b(?:the )?research (?:has been|was) (?:started|run|completed)\b", re.IGNORECASE),
        re.compile(r"\b(?:the )?research run (?:has been|was) (?:saved|started|created)\b", re.IGNORECASE),
    ),
    "save_work_product": (
        re.compile(r"\b(?:i|we) (?:have )?(?:saved|wrote|created|revised|filed) (?:the )?(?:draft|response|work product)\b", re.IGNORECASE),
        re.compile(r"\b(?:the )?(?:draft|response|work product) (?:has been|was|is now) (?:saved|written|created|revised|filed)\b", re.IGNORECASE),
    ),
    "write_markdown": (
        re.compile(r"\b(?:i|we) (?:have )?(?:saved|wrote|created|revised|filed) (?:the )?(?:note|document)\b", re.IGNORECASE),
        re.compile(r"\b(?:the )?(?:note|document) (?:has been|was|is now) (?:saved|written|created|revised|filed)\b", re.IGNORECASE),
    ),
    "create_work_item": (
        re.compile(r"\b(?:i|we) (?:have )?created (?:the )?(?:work item|task|checklist)\b", re.IGNORECASE),
        re.compile(r"\b(?:the )?(?:work item|task|checklist) (?:has been|was|is now) created\b", re.IGNORECASE),
    ),
    "complete_work_item": (
        re.compile(r"\b(?:i|we) (?:have )?completed (?:the )?(?:work item|task)\b", re.IGNORECASE),
        re.compile(r"\b(?:the )?(?:work item|task) (?:has been|was|is now) completed\b", re.IGNORECASE),
    ),
    "approve_response": (re.compile(r"\b(?:the )?response (?:has been|was) approved\b", re.IGNORECASE),),
    "mark_response_sent": (
        re.compile(r"\b(?:the )?response (?:has been|was) (?:sent|delivered|marked as sent)\b", re.IGNORECASE),
        re.compile(r"\bdelivery (?:is )?complete\b", re.IGNORECASE),
        re.compile(r"\bdelivery (?:has been|was|is now) recorded\b", re.IGNORECASE),
    ),
    "mark_as_sent": (
        re.compile(r"\b(?:the )?response (?:has been|was) (?:sent|delivered|marked as sent)\b", re.IGNORECASE),
        re.compile(r"\bdelivery (?:is )?complete\b", re.IGNORECASE),
        re.compile(r"\bdelivery (?:has been|was|is now) recorded\b", re.IGNORECASE),
    ),
    "finalize_work_product": (
        re.compile(r"\b(?:the )?(?:final response|work product|draft) (?:has been|was|is now) finalized\b", re.IGNORECASE),
    ),
    "close_matter": (re.compile(r"\b(?:the )?matter (?:has been|was) closed\b", re.IGNORECASE),),
    "move_matter_stage": (re.compile(r"\b(?:i|we) (?:have )?moved (?:the )?matter\b", re.IGNORECASE),),
    "update_matter_intake": (
        re.compile(r"\b(?:i|we) (?:have )?updated (?:the )?(?:intake|matter)\b", re.IGNORECASE),
        re.compile(r"\b(?:the )?intake (?:has been|was|is now )?recorded\b", re.IGNORECASE),
        re.compile(r"\brecorded\s*[—:-]", re.IGNORECASE),
        re.compile(r"\bnew fact captured\b", re.IGNORECASE),
    ),
    "create_agent": (re.compile(r"\b(?:i|we) (?:have )?created (?:an? )?agent\b", re.IGNORECASE),),
    "create_schedule": (re.compile(r"\b(?:i|we) (?:have )?created (?:a )?(?:schedule|automation)\b", re.IGNORECASE),),
    "append_memory": (re.compile(r"\b(?:i|we) (?:have )?(?:saved|appended) (?:the )?(?:instruction|memory)\b", re.IGNORECASE),),
}


def clean_user_facing_reply(content: str) -> str:
    """Remove internal control material while preserving useful answer text."""
    cleaned = _strip_control_prefixes(content)

    visible_lines = []
    for line in cleaned.splitlines():
        line = _strip_control_prefixes(line)
        if not line:
            continue
        if (
            _INTERNAL_ONLY_LINE.match(line)
            or _TOOL_SYNTAX_LINE.match(line)
            or _TOOL_PLUMBING_LINE.search(line)
        ):
            continue
        line = _INLINE_FUNCTION_TAG.sub("", line).strip()
        if not line:
            continue
        line = _ABSOLUTE_PATH.sub("the saved file", line)
        line = _VAULT_PATH.sub("the saved file", line)
        line = _REPOSITORY_PATH.sub("the application", line)
        line = _INTERNAL_ID.sub("the internal record", line)
        visible_lines.append(line.rstrip())
    return "\n".join(visible_lines).strip()


def clean_conversation_for_display(conversation: dict[str, object]) -> dict[str, object]:
    """Hide old internal tool plumbing without rewriting the saved transcript."""
    visible = deepcopy(conversation)
    messages = visible.get("messages")
    if not isinstance(messages, list):
        return visible
    for message in messages:
        if not isinstance(message, dict) or message.get("role") != "assistant":
            continue
        message["content"] = reconcile_user_facing_reply(
            clean_user_facing_reply(str(message.get("content") or "")),
            list(message.get("operation_results") or []),
        )
    return visible


def reconcile_user_facing_reply(content: str, operation_results: list[dict[str, object]]) -> str:
    """Make a completed reply agree with its finalized typed mutation results."""
    body, removed_control_labels = _remove_lifecycle_pseudo_controls(content.strip())
    result_operations = {
        str(result.get("operation") or "") for result in operation_results
    }
    pseudo_control_has_typed_result = any(
        operation in result_operations
        for label in removed_control_labels
        for operation in _LIFECYCLE_CONTROL_OPERATIONS.get(label, ())
    )
    unsupported_operations = {
        str(result.get("operation") or "")
        for result in operation_results
        if str(result.get("status") or "") in {
            "no_change", "failed", "proposed", "confirmation_required"
        }
    }
    if not unsupported_operations:
        if removed_control_labels and not pseudo_control_has_typed_result:
            return _append_status(body, "No lifecycle action was prepared.")
        return body

    def has_idempotent_entity_ref(operation: str) -> bool:
        return any(
            str(result.get("operation") or "") == operation
            and str(result.get("status") or "") == "no_change"
            and bool(result.get("entity_refs"))
            for result in operation_results
        )

    removed_research_claim = False
    removed_decision_claim = False
    removed_mutation_claim = False
    # Sentences are removed in place so that headings, lists, tables, and
    # paragraph breaks in the surrounding analysis survive byte-for-byte.
    spans = [body[start:end] for start, end in _sentence_spans(body)]
    dropped = [False] * len(spans)
    for index, span in enumerate(spans):
        candidate = span.strip()
        if not candidate:
            continue
        protected = (
            _NEGATED_OR_HISTORICAL_MUTATION.search(candidate)
            or "\"" in candidate
            or "“" in candidate
            or "”" in candidate
            or re.search(r"\b(?:recommend|recommendation|should)\b", candidate, re.IGNORECASE)
        )
        matching_pairs = [
            (operation, pattern)
            for operation in unsupported_operations
            for pattern in _MUTATION_SUCCESS_CLAIMS.get(operation, ())
            if pattern.search(candidate)
        ]
        if "chat_turn" in unsupported_operations:
            matching_pairs = [
                (operation, pattern)
                for operation, operation_patterns in _MUTATION_SUCCESS_CLAIMS.items()
                for pattern in operation_patterns
                if pattern.search(candidate)
            ]
        matching_patterns = [pattern for _, pattern in matching_pairs]
        protected = protected or (
            "already" in candidate.lower()
            and any(has_idempotent_entity_ref(operation) for operation, _ in matching_pairs)
        )
        if matching_patterns and not protected:
            dropped[index] = True
            removed_mutation_claim = True
            removed_research_claim = removed_research_claim or any(
                pattern in _MUTATION_SUCCESS_CLAIMS["run_research"]
                for pattern in matching_patterns
            )
            removed_decision_claim = removed_decision_claim or any(
                pattern in _MUTATION_SUCCESS_CLAIMS["record_decision"]
                for pattern in matching_patterns
            )

    reconciled = re.sub(r"\n{3,}", "\n\n", "".join(_join_kept(spans, dropped))).strip()
    if removed_research_claim or "run_research" in unsupported_operations:
        status = "No durable research run was started."
    elif removed_decision_claim and unsupported_operations == {"chat_turn"}:
        status = "No durable decision was recorded."
    elif removed_mutation_claim:
        if unsupported_operations == {"chat_turn"}:
            return reconciled
        status = "No workspace change recorded."
    else:
        if removed_control_labels and not pseudo_control_has_typed_result:
            return _append_status(reconciled, "No lifecycle action was prepared.")
        return reconciled
    return _append_status(reconciled, status)


def _remove_lifecycle_pseudo_controls(content: str) -> tuple[str, set[str]]:
    """Remove only closed-list bracket lines that imitate lifecycle buttons."""
    kept: list[str] = []
    labels: set[str] = set()
    for line in content.splitlines():
        if _LIFECYCLE_PSEUDO_CONTROL_LINE.fullmatch(line):
            labels.update(
                match.group(1).strip().casefold()
                for match in _LIFECYCLE_PSEUDO_CONTROL_LABEL.finditer(line)
            )
            continue
        kept.append(line)
    return re.sub(r"\n{3,}", "\n\n", "\n".join(kept)).strip(), labels


def _append_status(content: str, status: str) -> str:
    if status in content:
        return content
    return f"{content}\n\n{status}".strip()


def _join_kept(spans: list[str], dropped: list[bool]) -> list[str]:
    """Keep the surviving spans and the layout, without the removed span's seam."""
    kept: list[str] = []
    for index, span in enumerate(spans):
        if dropped[index]:
            continue
        starts_line = index == 0 or spans[index - 1].endswith("\n")
        previous_dropped = index > 0 and dropped[index - 1]
        if previous_dropped and not starts_line:
            # The removed claim shared this line, so drop the space it left.
            span = span.lstrip(" \t")
        if previous_dropped and not span.strip() and _dropped_whole_line(spans, dropped, index - 1):
            # The removed claim was the whole line, so drop its line break too.
            continue
        kept.append(span)
    return kept


def _dropped_whole_line(spans: list[str], dropped: list[bool], index: int) -> bool:
    while index >= 0 and dropped[index]:
        if index == 0 or spans[index - 1].endswith("\n"):
            return True
        if spans[index - 1].strip():
            return False
        index -= 1
    return False


def _sentence_spans(text: str) -> list[tuple[int, int]]:
    """Split into sentence spans that together reproduce the original text.

    A line break also ends a span so that a heading, list marker, or table row
    that carries no terminal punctuation is never removed together with an
    unsupported claim that happens to follow it.
    """
    boundaries = [0, *(match.start() for match in _SPAN_BOUNDARY.finditer(text)), len(text)]
    return [(start, end) for start, end in zip(boundaries, boundaries[1:]) if end > start]


def _strip_control_prefixes(content: str) -> str:
    cleaned = content.strip()
    while cleaned:
        updated = cleaned
        for pattern in _INTERNAL_CONTROL_PREFIXES:
            updated = pattern.sub("", updated, count=1).strip()
        if updated == cleaned:
            return cleaned
        cleaned = updated
    return cleaned
