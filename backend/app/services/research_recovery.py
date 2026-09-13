"""Bounded recovery of unfinished, read-only dossier research in its saved run."""
from copy import deepcopy

from app.services.dossier import serialized
from app.services.research_checkpoints import LIMITS, ResearchCheckpoints
from app.utils.time import iso_now

AUTO_RECOVERY_LIMIT = 2
AUTO_RECOVERY_DELAY_SECONDS = 5
TEMPORARY_ERRORS = frozenset({
    "TimeoutError", "APITimeoutError", "ConnectTimeout", "ReadTimeout",
    "ConnectionError", "APIConnectionError", "ConnectError", "ReadError",
    "RemoteProtocolError", "RateLimitError", "ServiceUnavailableError", "InternalServerError",
})


def temporary_failure(exc):
    """Recognize wrapped transport failures without persisting private messages."""
    seen = set()
    while exc is not None and id(exc) not in seen:
        seen.add(id(exc))
        code = getattr(getattr(exc, "response", None), "status_code", None)
        if code is not None:
            return code in {408, 429, 500, 502, 503, 504}
        if type(exc).__name__ in TEMPORARY_ERRORS:
            return True
        exc = exc.__cause__
    return False


def research_failure(run):
    """Return a safe explanation and whether a fresh allowance can help."""
    cp = run.get("checkpoint") or {}
    if cp.get("source_warnings"):
        return "A saved source is missing or changed. Restore it before resuming research.", False
    unknown = [c for c in cp.get("pending_calls", []) if c.get("state") in {"in_flight", "outcome_unknown"}]
    uncertain = any(not c.get("temporary_failure") and c.get("error_class") not in TEMPORARY_ERRORS for c in unknown)
    errors = {c.get("error_class") for c in unknown}
    errors.update([run.get("failure_class"), (cp.get("analysis_failure_origin") or {}).get("class")])
    used, limits = cp.get("budget_used") or {}, run.get("investigation_limits") or LIMITS
    if used.get("active_seconds", 0) >= limits["active_seconds"] - 1:
        reason = ("After a restart, research reached its time limit before an answer was saved."
                  if run.get("resumed_from_restart") or cp.get("recovered_time_seconds") else
                  "Research reached its time limit before an answer was saved.")
        return reason + " Saved work is kept.", not uncertain
    if used.get("main_calls", 0) >= limits["main_calls"]:
        return "Research reached its step limit before an answer was saved. Saved work is kept.", not uncertain
    if errors & TEMPORARY_ERRORS or any(c.get("temporary_failure") for c in unknown) or run.get("temporary_failure"):
        return "The model or search service timed out or was temporarily unavailable. Saved work is kept.", not uncertain
    if uncertain:
        return "A call stopped before its result was saved. Resume can repeat that call and incur another charge.", False
    if run.get("failure_detail"):
        return str(run["failure_detail"]), False
    return "Research stopped before a finished answer was saved. Saved work is kept.", False


@serialized
def prepare_recovery(runs, matter_id, run_id, *, automatic=False, explicit_retry=False):
    """Keep usage and successful work; grant one recorded, bounded continuation.

    Unknown paid calls still require explicit consent. Automatic recovery only
    repeats calls whose saved error is temporary. Stop and source integrity win.
    """
    run = runs.get(matter_id, run_id)
    if not run.get("managed") or run.get("managed_state") == "ready_for_composition":
        return False
    checks = ResearchCheckpoints(runs)
    cp = checks.load(matter_id, run_id, allow_unavailable_sources=True)
    if cp.get("source_warnings"):
        return False
    reason, transient = research_failure({**run, "checkpoint": cp})
    history = list(cp.get("recovery_attempts") or [])
    auto_count = sum(a.get("mode") == "automatic" for a in history)
    if automatic and (cp["stop_requested"] or not transient or auto_count >= AUTO_RECOVERY_LIMIT):
        return False
    unknown = any(c.get("state") in {"in_flight", "outcome_unknown"} for c in cp["pending_calls"])
    if unknown and not (automatic or explicit_retry):
        return False
    cp = checks.recover(matter_id, run_id, explicit_retry=automatic or explicit_retry)
    history.append({"mode": "automatic" if automatic else "manual", "at": iso_now(),
                    "reason": reason, "budget_used": deepcopy(cp["budget_used"]),
                    "packet_path": cp.get("packet_path"), "previous_output": cp.get("raw_final_output") or ""})
    # Limits increase explicitly. Counters never reset, including restart charges.
    limits = dict(run.get("investigation_limits") or LIMITS)
    for key in LIMITS:
        if key != "evidence_chars":  # Retain the existing context-size ceiling.
            limits[key] = max(limits[key], cp["budget_used"][key] + LIMITS[key])
    # A failed search can retry its same approved query. Successful calls and
    # source snapshots stay immutable; the new attempt has its own journal key.
    latest_requests = {}
    for key, result in cp["requests"].items():
        latest_requests[key.split(":recovery:")[0]] = result
    cp["request_retries"] = {key: f"{key}:recovery:{len(history)}" for key, result in latest_requests.items()
                             if result.get("status") == "failed"}
    for key in ("raw_final_output", "analysis_failure", "analysis_failure_origin", "analysis_incomplete",
                "final_call_key", "research_synthesis", "research_structure_warnings", "packet_path"):
        cp.pop(key, None)
    cp.update(recovery_attempts=history, final_attempt_started=False, provider_recovery_used=False,
              phase="planning", next_step="main", stop_requested=False,
              recovery_note=f"Recovery attempt {len(history)}: the previous attempt did not finish. "
              "Continue from saved evidence with a new bounded allowance. Earlier usage remains recorded. "
              "Reuse completed searches and source reads. You may retry failed searches within the same saved permissions. "
              "Use the available research tools when needed, then deliver a substantive answer, not a plan.")
    # One Markdown write commits the allowance and its receipt together.
    next_sequence = cp.pop("sequence") + 1
    runs.vault.update_markdown(run["path"], metadata_updates={
        "checkpoint": cp, "checkpoint_sequence": next_sequence,
        "checkpoint_at": iso_now(), "investigation_limits": limits,
        "state": "queued", "managed_state": "queued", "failure_detail": None, "failure_class": None, "temporary_failure": False,
    })
    return True
