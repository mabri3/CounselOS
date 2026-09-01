from __future__ import annotations

from datetime import timedelta
from pathlib import Path
from typing import Any

from app.services.matter_state import MatterStateService
from app.services.vault import VaultService
from app.utils.time import utc_now


def _service(tmp_path: Path) -> MatterStateService:
    return MatterStateService(VaultService(tmp_path / "vault"))


def _matter(**overrides: Any) -> dict[str, Any]:
    return {
        "matter_id": "MAT-1",
        "path": "03_Matters/example",
        "status": "research",
        "target_date": None,
        "next_action": "Use the saved fallback.",
        "legal_owner": "A legal owner who must not be inferred",
        **overrides,
    }


def _item(item_id: str, **overrides: Any) -> dict[str, Any]:
    return {
        "work_item_id": item_id,
        "title": f"Work {item_id}",
        "status": "open",
        "priority": "normal",
        "owner": "Brian Harris",
        "due_at": None,
        "required": True,
        "created_at": "2026-08-01T10:00:00+00:00",
        **overrides,
    }


def _write_run(
    service: MatterStateService,
    run_id: str,
    *,
    state: str,
    created_at: str = "2026-08-01T10:00:00+00:00",
) -> None:
    service.vault.write_markdown(
        f"03_Matters/example/research/runs/{run_id}.md",
        f"# Research run {run_id}\n",
        {"run_id": run_id, "state": state, "created_at": created_at},
    )


def test_highest_priority_required_open_item_wins_with_stable_tiebreaks(tmp_path: Path) -> None:
    service = _service(tmp_path)
    result = service.resolve(
        _matter(),
        [
            _item("LOW", priority="low"),
            _item("HIGH-LATE", priority="high", due_at="2027-10-02"),
            _item("HIGH-EARLY", priority="high", due_at="2027-10-01"),
            _item("URGENT-DONE", priority="urgent", status="DoNe"),
        ],
    )

    assert result["next_work_item_id"] == "HIGH-EARLY"
    assert result["next_action"] == "Work HIGH-EARLY"
    assert result["due_at"] == "2027-10-01"


def test_non_required_and_closed_items_do_not_replace_fallback_action(tmp_path: Path) -> None:
    service = _service(tmp_path)
    result = service.resolve(
        _matter(next_action="Saved next action"),
        [
            _item("OPTIONAL", required=False, priority="urgent"),
            _item("CLOSED", status="CLOSED", priority="urgent"),
        ],
    )

    assert result["next_work_item_id"] is None
    assert result["next_action"] == "Saved next action"
    assert result["next_actor"] == "none"


def test_completed_intake_ignores_stale_orientation_item(tmp_path: Path) -> None:
    result = _service(tmp_path).resolve(
        _matter(intake_state="complete", next_action="Review the dossier."),
        [_item("ORIENT", title="Orient to the request")],
    )

    assert result["next_work_item_id"] is None
    assert result["next_action"] == "Review the dossier."


def test_stopped_intake_ignores_stale_orientation_item(tmp_path: Path) -> None:
    result = _service(tmp_path).resolve(
        _matter(intake_state="stopped", next_action="Review the dossier."),
        [_item("ORIENT", title="Orient to the request")],
    )

    assert result["next_work_item_id"] is None
    assert result["next_action"] == "Review the dossier."


def test_stage_default_is_used_when_no_item_or_saved_action_exists(tmp_path: Path) -> None:
    service = _service(tmp_path)

    result = service.resolve(_matter(status="generate", next_action="  "), [])

    assert result["next_action"] == "Generate the work product that supports the recommended path."


def test_unknown_priority_behaves_like_normal_and_never_breaks_sorting(tmp_path: Path) -> None:
    service = _service(tmp_path)
    result = service.resolve(
        _matter(),
        [
            _item("UNKNOWN", priority=None, due_at=None, created_at=None, title=None),
            _item("LOW", priority="low"),
        ],
    )

    assert result["next_work_item_id"] == "UNKNOWN"


def test_blank_owner_needs_assignment_without_legal_owner_inference(tmp_path: Path) -> None:
    result = _service(tmp_path).resolve(_matter(), [_item("WI-1", owner="  ")])

    assert result["next_owner"] is None
    assert result["next_actor"] == "unassigned"
    assert result["signal"] == {"kind": "needs_assignment", "label": "Needs assignment"}


def test_named_owner_preserves_spelling(tmp_path: Path) -> None:
    result = _service(tmp_path).resolve(_matter(), [_item("WI-1", owner="  bRiAn Harris  ")])

    assert result["next_owner"] == "bRiAn Harris"
    assert result["next_actor"] == "named_owner"
    assert result["signal"] == {
        "kind": "waiting_on_owner",
        "label": "Waiting on bRiAn Harris",
    }


def test_configured_lawyer_is_mapped_to_you(tmp_path: Path) -> None:
    service = _service(tmp_path)
    service.vault.write_markdown(
        "00_System/settings.md",
        "# Settings\n",
        {"values": {"document_review.lawyer_name": "Brian Harris"}},
    )

    result = service.resolve(_matter(), [_item("WI-1", owner="brian harris")])

    assert result["next_owner"] == "brian harris"
    assert result["next_actor"] == "you"
    assert result["signal"] == {"kind": "waiting_on_you", "label": "Waiting on you"}


def test_themis_without_active_run_is_ready(tmp_path: Path) -> None:
    result = _service(tmp_path).resolve(_matter(), [_item("WI-1", owner="theMIS")])

    assert result["next_owner"] == "theMIS"
    assert result["next_actor"] == "themis"
    assert result["execution_state"] == "not_running"
    assert result["signal"] == {"kind": "ready_for_themis", "label": "Ready for Themis.ai"}


def test_newest_active_queued_or_running_run_reports_agent_working(tmp_path: Path) -> None:
    service = _service(tmp_path)
    _write_run(service, "RUN-OLD", state="QUEUED", created_at="2026-08-01T10:00:00+00:00")
    _write_run(service, "RUN-NEW", state="running", created_at="2026-08-02T10:00:00+00:00")

    result = service.resolve(_matter(), [_item("WI-1")])

    assert result["execution_state"] == "running"
    assert result["active_run_id"] == "RUN-NEW"
    assert result["signal"] == {"kind": "agent_working", "label": "Themis.ai is working"}


def test_queued_run_reports_agent_working(tmp_path: Path) -> None:
    service = _service(tmp_path)
    _write_run(service, "RUN-QUEUED", state="QUEUED")

    result = service.resolve(_matter(), [_item("WI-1")])

    assert result["execution_state"] == "queued"
    assert result["active_run_id"] == "RUN-QUEUED"
    assert result["signal"]["kind"] == "agent_working"


def test_completed_run_is_not_active(tmp_path: Path) -> None:
    service = _service(tmp_path)
    _write_run(service, "RUN-DONE", state="completed")

    result = service.resolve(_matter(), [_item("WI-1")])

    assert result["execution_state"] == "not_running"
    assert result["active_run_id"] is None
    assert result["signal"]["kind"] == "waiting_on_owner"


def test_malformed_run_reports_unknown_without_raising(tmp_path: Path) -> None:
    service = _service(tmp_path)
    path = service.vault.resolve("03_Matters/example/research/runs/bad.md")
    path.parent.mkdir(parents=True)
    path.write_text("---\ninvalid: [\n---\n", encoding="utf-8")

    result = service.resolve(_matter(), [_item("WI-1")])

    assert result["execution_state"] == "unknown"
    assert result["active_run_id"] is None
    assert result["execution_note"] == "One or more research-run records could not be read."
    assert result["signal"] == {
        "kind": "execution_unknown",
        "label": "Agent status unavailable",
    }


def test_blocked_required_item_reports_blocked(tmp_path: Path) -> None:
    result = _service(tmp_path).resolve(_matter(), [_item("WI-1", status="BLOCKED")])

    assert result["signal"] == {"kind": "blocked", "label": "Blocked"}


def test_past_work_item_due_date_is_overdue_before_agent_signal(tmp_path: Path) -> None:
    service = _service(tmp_path)
    _write_run(service, "RUN-1", state="running")
    yesterday = (utc_now().date() - timedelta(days=1)).isoformat()

    result = service.resolve(_matter(), [_item("WI-1", due_at=yesterday)])

    assert result["signal"] == {"kind": "overdue", "label": "Overdue"}


def test_past_matter_target_is_overdue_but_invalid_date_is_only_displayed(tmp_path: Path) -> None:
    service = _service(tmp_path)
    yesterday = (utc_now().date() - timedelta(days=1)).isoformat()

    overdue = service.resolve(_matter(target_date=yesterday), [])
    invalid = service.resolve(_matter(target_date="not-a-date"), [])

    assert overdue["due_at"] == yesterday
    assert overdue["signal"]["kind"] == "overdue"
    assert invalid["due_at"] == "not-a-date"
    assert invalid["signal"]["kind"] == "none"


def test_closed_matter_has_no_signal_even_when_overdue(tmp_path: Path) -> None:
    yesterday = (utc_now().date() - timedelta(days=1)).isoformat()
    result = _service(tmp_path).resolve(
        _matter(status="CLOSED"),
        [_item("WI-1", due_at=yesterday, status="blocked")],
    )

    assert result["signal"] == {"kind": "none", "label": ""}


def test_explore_without_required_open_item_waits_on_you(tmp_path: Path) -> None:
    result = _service(tmp_path).resolve(_matter(status="EXPLORE", next_action=""), [])

    assert result["next_actor"] == "you"
    assert result["signal"] == {"kind": "waiting_on_you", "label": "Waiting on you"}
