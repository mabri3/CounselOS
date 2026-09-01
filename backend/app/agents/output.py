from __future__ import annotations

import re


_INTERNAL_CONTROL_PREFIXES = (
    re.compile(r"^\s*do not mention the tool limit\.\s*", re.IGNORECASE),
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


def clean_user_facing_reply(content: str) -> str:
    """Remove internal control material while preserving useful answer text."""
    cleaned = _strip_control_prefixes(content)

    visible_lines = []
    for line in cleaned.splitlines():
        line = _strip_control_prefixes(line)
        if not line:
            continue
        if _INTERNAL_ONLY_LINE.match(line) or _TOOL_SYNTAX_LINE.match(line):
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


def correct_unsupported_workspace_claims(
    content: str, successful_mutation_tools: set[str]
) -> str:
    """Remove workspace-success claims that have no matching successful tool trace."""
    rules = (
        ("record_decision", re.compile(r"(?:\b(?:the\s+)?(?:durable\s+)?decision\s+(?:has been|was|is now)\s+(?:durably\s+)?recorded\b|^\s*\**decision recorded\**\s*:|\bi(?:'ve| have) recorded (?:the\s+)?(?:durable\s+)?decision\b)", re.IGNORECASE), "The durable decision was not recorded in this response."),
        ("save_work_product", re.compile(r"(?:\b(?:the\s+)?(?:work product|draft|response)\s+(?:has been|was|is now)\s+(?:saved|created|written|finalized)\b|^\s*\**draft saved\**\s*:|\bi(?:'ve| have) (?:saved|created|written|finalized) (?:the\s+)?(?:work product|draft)\b)", re.IGNORECASE), "The work product was not saved in this response."),
        ("close_matter", re.compile(r"(?:\b(?:the\s+)?matter\s+(?:has been|was|is now)\s+closed\b|\bi(?:'ve| have) closed (?:the\s+)?matter\b)", re.IGNORECASE), "The matter was not closed in this response."),
        ("approve_response", re.compile(r"(?:\b(?:the\s+)?(?:response|final)\s+(?:has been|was|is now)\s+approved\b|\bi(?:'ve| have) approved (?:the\s+)?(?:response|final)\b)", re.IGNORECASE), "The response was not approved in this response."),
        ("mark_response_sent", re.compile(r"(?:\b(?:the\s+)?delivery\s+(?:has been|was|is now)\s+recorded\b|\b(?:the\s+)?response\s+(?:has been|was|is now)\s+sent\b|\bi(?:'ve| have) (?:recorded delivery|sent the response)\b)", re.IGNORECASE), "Delivery was not recorded in this response."),
    )
    lines = content.splitlines()
    corrections: list[str] = []
    for tool, pattern, correction in rules:
        if tool in successful_mutation_tools or not any(pattern.search(line) for line in lines):
            continue
        lines = [line for line in lines if not pattern.search(line)]
        corrections.append(correction)
    visible = "\n".join(lines).strip()
    return "\n\n".join([*corrections, visible]).strip()


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
