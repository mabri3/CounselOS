"""Contracts for the research-first dossier parent request.

One saved Markdown record per request holds the frozen choices, child research
identities, per-issue state, progress, and publication receipts. SQLite may index
it later; correctness never depends on a new index schema. This module owns the
record shape, the enumerations, validation of untrusted saved metadata, and the
compact status projection the UI polls. It performs no I/O.
"""
from __future__ import annotations

from typing import Any

# --- Enumerations ---------------------------------------------------------

# Parent request lifecycle.
REQUEST_STATES = frozenset(
    {
        "planning",
        "awaiting_choices",
        "running",
        "completed",
        "partial",
        "stopped",
        "interrupted",
        "failed",
    }
)

# Which stage of the flow the parent is in.
REQUEST_PHASES = frozenset(
    {
        "setup",
        "first_batch",
        "first_compose",
        "remaining_batch",
        "update_compose",
        "finished",
    }
)

# What the lawyer chose to run.
EXECUTION_MODES = frozenset({"research", "saved_only"})

# Coverage of the research mode.
SCOPES = frozenset({"top_three", "all"})

# Per-issue work state. This is NOT legal status.
ISSUE_STATES = frozenset(
    {
        "not_selected",
        "queued",
        "running",
        "saved",
        "partial",
        "failed",
        "interrupted",
        "newly_identified",
    }
)

# Publication state of a batch. Separate from issue work state.
PUBLICATION_STATES = frozenset({"not_written", "applied", "review_required", "failed"})

SCHEMA_VERSION = 1
RECORD_TYPE = "dossier_research_request"


class DossierRequestError(ValueError):
    """Base error carrying an HTTP-style code and a recoverable detail payload."""

    status_code = 400
    code = "dossier_request_error"

    def __init__(self, message: str, *, code: str | None = None, **extra: Any):
        super().__init__(message)
        self.detail = {"code": code or self.code, "message": message, **extra}


class DossierRequestNotFound(DossierRequestError):
    status_code = 404
    code = "dossier_request_not_found"


class DossierRequestConflict(DossierRequestError):
    status_code = 409
    code = "dossier_request_conflict"


class DossierRequestValidation(DossierRequestError):
    status_code = 400
    code = "dossier_request_invalid"


def new_request_metadata(
    *,
    request_id: str,
    matter_id: str,
    source_action_key: str | None,
    conversation_id: str | None,
    message_id: str | None,
    created_at: str,
    plan_revision: str,
) -> dict[str, Any]:
    """Build the frontmatter for a freshly prepared parent request.

    The human preparation prose is stored as the Markdown body, not here.
    """
    return {
        "schema_version": SCHEMA_VERSION,
        "record_type": RECORD_TYPE,
        "request_id": request_id,
        "matter_id": matter_id,
        "source_action_key": source_action_key,
        "start_action_key": None,
        "submission_digest": None,
        "sequence": 0,
        "state": "awaiting_choices",
        "phase": "setup",
        "origin": {"conversation_id": conversation_id, "message_id": message_id},
        "created_at": created_at,
        "updated_at": created_at,
        "plan_revision": plan_revision,
        "execution_mode": None,
        "scope": None,
        "priorities": [],
        "first_issue_ids": [],
        "planned_issue_ids": [],
        "new_issue_candidates": [],
        "frozen_context": {},
        "skill_snapshot": {},
        "model_selections": {},
        "source_scope": None,
        "input_basis": {},
        "expected_dossier_hash": None,
        "expected_recommendations_hash": None,
        "issues": {},
        "publications": [],
        "stop_requested": False,
        "first_pass_ready_at": None,
        "finished_at": None,
        "last_error": None,
    }


def validate_saved_metadata(metadata: dict[str, Any]) -> dict[str, Any]:
    """Reject malformed saved metadata without erasing the record.

    Returns the metadata unchanged when valid. Raises DossierRequestValidation
    otherwise. Unknown extra fields are preserved by callers; forward-compatible
    fields are tolerated here.
    """
    if not isinstance(metadata, dict):
        raise DossierRequestValidation("Saved dossier request metadata is not a mapping.")
    if metadata.get("record_type") != RECORD_TYPE:
        raise DossierRequestValidation("Record is not a dossier research request.")
    request_id = metadata.get("request_id")
    if not isinstance(request_id, str) or not request_id.startswith("DOR-"):
        raise DossierRequestValidation("Saved request_id is missing or malformed.")
    if not isinstance(metadata.get("matter_id"), str) or not metadata["matter_id"]:
        raise DossierRequestValidation("Saved matter_id is missing.")

    state = metadata.get("state")
    if state not in REQUEST_STATES:
        raise DossierRequestValidation(f"Saved state {state!r} is not recognized.")
    phase = metadata.get("phase")
    if phase not in REQUEST_PHASES:
        raise DossierRequestValidation(f"Saved phase {phase!r} is not recognized.")

    sequence = metadata.get("sequence")
    if not isinstance(sequence, int) or isinstance(sequence, bool) or sequence < 0:
        raise DossierRequestValidation("Saved sequence must be a non-negative integer.")

    mode = metadata.get("execution_mode")
    if mode is not None and mode not in EXECUTION_MODES:
        raise DossierRequestValidation(f"Saved execution_mode {mode!r} is not recognized.")
    scope = metadata.get("scope")
    if scope is not None and scope not in SCOPES:
        raise DossierRequestValidation(f"Saved scope {scope!r} is not recognized.")

    issues = metadata.get("issues")
    if not isinstance(issues, dict):
        raise DossierRequestValidation("Saved issues map is malformed.")
    for issue_id, entry in issues.items():
        if not isinstance(entry, dict):
            raise DossierRequestValidation(f"Saved issue {issue_id} entry is malformed.")
        issue_state = entry.get("state")
        if issue_state is not None and issue_state not in ISSUE_STATES:
            raise DossierRequestValidation(
                f"Saved issue {issue_id} state {issue_state!r} is not recognized."
            )
        budget = entry.get("budget_snapshot")
        if budget is not None and not isinstance(budget, dict):
            raise DossierRequestValidation(f"Saved issue {issue_id} budget is malformed.")

    for list_field in ("priorities", "first_issue_ids", "planned_issue_ids", "publications"):
        value = metadata.get(list_field)
        if value is not None and not isinstance(value, list):
            raise DossierRequestValidation(f"Saved {list_field} is malformed.")

    if metadata.get("stop_requested") not in (None, True, False):
        raise DossierRequestValidation("Saved stop_requested is malformed.")
    return metadata


def _issue_counts(issues: dict[str, Any]) -> dict[str, int]:
    counts = {
        "total": len(issues),
        "queued": 0,
        "running": 0,
        "saved": 0,
        "partial": 0,
        "failed": 0,
        "interrupted": 0,
        "newly_identified": 0,
        "not_selected": 0,
    }
    for entry in issues.values():
        state = str((entry or {}).get("state") or "not_selected")
        if state in counts:
            counts[state] += 1
    counts["researched"] = counts["saved"] + counts["partial"]
    return counts


def compact_status(metadata: dict[str, Any], body: str = "") -> dict[str, Any]:
    """Project the compact, read-only status the card and list endpoints return.

    Contains only what the UI needs: never raw query internals as primary text.
    """
    issues = metadata.get("issues") or {}
    counts = _issue_counts(issues)
    publications = metadata.get("publications") or []
    latest_publication = publications[-1] if publications else None
    first_issue_ids = list(metadata.get("first_issue_ids") or [])

    issue_rows: list[dict[str, Any]] = []
    for issue_id, entry in issues.items():
        entry = entry or {}
        issue_rows.append(
            {
                "issue_id": issue_id,
                "title": entry.get("title") or issue_id,
                "state": entry.get("state") or "not_selected",
                "planned_order": entry.get("planned_order"),
                "selected_first": issue_id in first_issue_ids,
                "initial_answer": entry.get("initial_answer") or "", "next_action": entry.get("next_action") or "",
                "sources_discovered": int(entry.get("sources_discovered") or 0),
                "sources_read": int(entry.get("sources_read") or 0),
                "sources_retrieved": int(entry.get("sources_retrieved") or 0),
                "support": entry.get("support"),
                "packet_path": entry.get("packet_path"),
                "answer_path": entry.get("packet_path"),
                "last_error": entry.get("last_error"),
                "run_id": entry.get("child_run_id"),
            }
        )
    issue_rows.sort(
        key=lambda row: (
            row["planned_order"] if isinstance(row["planned_order"], int) else 1_000,
            row["issue_id"],
        )
    )

    return {
        "request_id": metadata.get("request_id"),
        "matter_id": metadata.get("matter_id"),
        "state": metadata.get("state"),
        "phase": metadata.get("phase"),
        "sequence": metadata.get("sequence"),
        "plan_revision": metadata.get("plan_revision"),
        "execution_mode": metadata.get("execution_mode"),
        "scope": metadata.get("scope"),
        "stop_requested": bool(metadata.get("stop_requested")),
        "origin": metadata.get("origin") or {},
        "priorities": metadata.get("priorities") or [],
        "first_issue_ids": first_issue_ids,
        "planned_issue_ids": list(metadata.get("planned_issue_ids") or []),
        "new_issue_candidates": metadata.get("new_issue_candidates") or [],
        "counts": counts,
        "issues": issue_rows,
        "publications": publications,
        "latest_publication": latest_publication,
        "first_pass_ready_at": metadata.get("first_pass_ready_at"),
        "finished_at": metadata.get("finished_at"),
        "waiting_for_existing_research": bool(metadata.get("waiting_for_existing_research")) and metadata.get("state") == "running",
        "unknown_writer_outcome": any(c.get("state") in {"in_flight", "outcome_unknown"} for c in (metadata.get("writer_calls") or {}).values()) and metadata.get("state") != "running",
        "last_error": metadata.get("last_error"),
        "created_at": metadata.get("created_at"),
        "updated_at": metadata.get("updated_at"),
        "source_scope": metadata.get("source_scope"),
        "model_selections": metadata.get("model_selections") or {},
        "preparation": body,
    }


# States from which each explicit action may run. Guards live in the service; these
# sets document intent and keep the router thin.
ACTIVE_STATES = frozenset({"running"})
RESUMABLE_STATES = frozenset({"interrupted", "stopped", "failed", "partial"})
TERMINAL_STATES = frozenset({"completed", "failed"})
