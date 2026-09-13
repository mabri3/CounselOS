"""Atomic research-run checkpoints and conservative external-call reservations."""
from copy import deepcopy
import json
import math

from app.services.dossier import serialized
from app.services.workspace import digest
from app.utils.time import iso_now

LIMITS = {"main_calls": 13, "batches": 3, "requests": 12, "fetches": 16,
          "active_seconds": 600, "evidence_chars": 48000}


class ResearchCheckpoints:
    def __init__(self, runs):
        self.runs = runs
        self.vault = runs.vault

    @serialized
    def initialize(self, matter_id, run_id, basis):
        run = self.runs.get(matter_id, run_id)
        if run.get("checkpoint_version"):
            return self.load(matter_id, run_id)
        checkpoint = {"phase": "planning", "basis": basis, "next_step": "main",
                      "last_completed_step": "queued", "main_turn_index": 0,
                      "main_messages": [], "useful_content": "", "pending_calls": [],
                      "completed_call_keys": [], "budget_used": {k: 0 for k in LIMITS},
                      "stop_requested": False, "publication_receipts": {}, "sources": [],
                      "requests": {}, "passages": {}, "final_attempt_started": False}
        self.vault.update_markdown(run["path"], metadata_updates={
            "checkpoint_version": 1, "checkpoint_sequence": 0, "checkpoint_at": iso_now(),
            "checkpoint": checkpoint, "investigation_limits": LIMITS,
            "instruction_version": "main-investigation-v1"})
        return self.load(matter_id, run_id)

    def load(self, matter_id, run_id, *, allow_unavailable_sources=False):
        run = self.runs.get(matter_id, run_id)
        if run.get("execution_version") != 2 or run.get("checkpoint_version") != 1:
            raise ValueError("Unsupported investigation checkpoint version.")
        cp = deepcopy(run.get("checkpoint"))
        if not isinstance(cp, dict) or not isinstance(cp.get("budget_used"), dict):
            raise ValueError("Invalid investigation checkpoint; saved work remains available.")
        for key in LIMITS:
            value = cp["budget_used"].get(key)
            if not isinstance(value, (int, float)) or isinstance(value, bool) or not math.isfinite(value) or value < 0:
                raise ValueError("Invalid saved budget; do not reset this run.")
        for key, expected in (("main_messages", list), ("pending_calls", list), ("sources", list), ("requests", dict), ("passages", dict), ("publication_receipts", dict)):
            if not isinstance(cp.get(key), expected):
                raise ValueError("Invalid saved checkpoint structure; preserve this run for review.")
        if not isinstance(cp.get("stop_requested"), bool) or cp.get("phase") not in {"planning", "collecting", "synthesizing", "publishing", "partial", "complete", "stopped"}:
            raise ValueError("Invalid saved checkpoint state.")
        for source in [*cp.get("sources", []), *cp.get("local_sources", [])]:
            path = source.get("path")
            try:
                if not path or not self.vault.exists(path):
                    raise ValueError("Saved source snapshot is missing.")
                text = self.vault.read_markdown(path)["content"]
                if digest(text) != source.get("source_hash"):
                    # Older snapshots hashed CRLF bytes before the Markdown
                    # reader normalized newlines. Accept only an exact saved
                    # body hash, never a changed source or a guessed version.
                    import frontmatter
                    raw = frontmatter.loads(self.vault.resolve(path).read_bytes().decode("utf-8")).content
                    if digest(raw) != source.get("source_hash"):
                        raise ValueError("Saved source snapshot hash changed.")
            except (OSError, ValueError) as exc:
                if not allow_unavailable_sources:
                    raise
                source.update(snapshot_error=str(exc), support_state="unverified")
                cp["source_warnings"] = list(dict.fromkeys([*cp.get("source_warnings", []), str(exc)]))
        cp["sequence"] = run["checkpoint_sequence"]
        return cp

    @serialized
    def save(self, matter_id, run_id, checkpoint, *, expected_sequence):
        run = self.runs.get(matter_id, run_id)
        if run.get("checkpoint_version") != 1 or run.get("checkpoint_sequence") != expected_sequence:
            raise ValueError("Stale checkpoint write.")
        if (run.get("checkpoint") or {}).get("stop_requested") and not checkpoint.get("stop_requested"):
            raise ValueError("A stopped checkpoint cannot be overwritten.")
        previous = run.get("checkpoint") or {}
        for key in LIMITS:
            value = checkpoint.get("budget_used", {}).get(key)
            if not isinstance(value, (int, float)) or isinstance(value, bool) or value < previous.get("budget_used", {}).get(key, 0):
                raise ValueError("Saved budget cannot decrease or become invalid.")
        cp = deepcopy(checkpoint)
        cp.pop("sequence", None)
        json.dumps(cp, allow_nan=False)  # Reject live provider objects and non-finite budgets.
        self.vault.update_markdown(run["path"], metadata_updates={
            "checkpoint": cp, "checkpoint_sequence": expected_sequence + 1,
            "checkpoint_at": iso_now()})
        return {**cp, "sequence": expected_sequence + 1}

    @serialized
    def update(self, matter_id, run_id, *, allow_unavailable_sources=False, **values):
        cp = self.load(matter_id, run_id, allow_unavailable_sources=allow_unavailable_sources)
        return self.save(matter_id, run_id, {**cp, **values}, expected_sequence=cp["sequence"])

    @serialized
    def reserve_call(self, matter_id, run_id, call_key, request_digest, budget_delta):
        cp = self.load(matter_id, run_id)
        if cp["stop_requested"]:
            raise ValueError("Investigation stopped.")
        old = next((c for c in cp["pending_calls"] if c["key"] == call_key), None)
        if old:
            if old["request_digest"] != request_digest:
                raise ValueError("Saved call parameters changed.")
            if old["state"] == "completed":
                return old
            if old["state"] != "retry_ready":
                raise ValueError("Call outcome is unknown or in flight; explicit retry is required and may be charged again.")
        limits = self.runs.get(matter_id, run_id)["investigation_limits"]
        for key, delta in budget_delta.items():
            if key not in limits or delta < 0 or cp["budget_used"][key] + delta > limits[key]:
                raise ValueError("Investigation execution budget exhausted.")
        for key, delta in budget_delta.items():
            cp["budget_used"][key] += delta
        call = {"key": call_key, "request_digest": request_digest, "state": "in_flight",
                "attempts": int(old.get("attempts", 0)) + 1 if old else 1,
                "started_at": iso_now()}
        cp["pending_calls"] = [c for c in cp["pending_calls"] if c["key"] != call_key] + [call]
        self.save(matter_id, run_id, cp, expected_sequence=cp["sequence"])
        return call

    @serialized
    def complete_call(self, matter_id, run_id, call_key, result_ref):
        cp = self.load(matter_id, run_id)
        call = next(c for c in cp["pending_calls"] if c["key"] == call_key)
        if call["state"] == "completed":
            return call
        call.update(state="completed", result_ref=deepcopy(result_ref))
        cp["completed_call_keys"] = list(dict.fromkeys([*cp["completed_call_keys"], call_key]))
        self.save(matter_id, run_id, cp, expected_sequence=cp["sequence"])
        return call

    @serialized
    def recover(self, matter_id, run_id, *, explicit_retry=False, allow_unavailable_sources=False):
        cp = self.load(matter_id, run_id, allow_unavailable_sources=allow_unavailable_sources)
        # A process death loses the monotonic clock. Charge the saved maximum
        # duration of the unfinished operation instead of resetting its time.
        reservation = cp.pop("active_time_reservation", 0)
        cp["budget_used"]["active_seconds"] += reservation
        if reservation:
            cp["recovered_time_seconds"] = cp.get("recovered_time_seconds", 0) + reservation
        for call in cp["pending_calls"]:
            if call["state"] == "in_flight":
                call["state"] = "outcome_unknown"
            if explicit_retry and call["state"] == "outcome_unknown":
                call["state"] = "retry_ready"
        if explicit_retry:
            cp["stop_requested"] = False
            # Only explicit user resume can clear stop; preserve every budget counter.
            run = self.runs.get(matter_id, run_id)
            self.vault.update_markdown(run["path"], metadata_updates={"checkpoint": cp})
        return self.save(matter_id, run_id, cp, expected_sequence=cp["sequence"])
