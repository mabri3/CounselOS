from datetime import datetime, timezone

import pytest
from pydantic import TypeAdapter, ValidationError

from app.models.awareness import (
    BriefingConnectAction,
    BriefingQuery,
    ForbiddenCorpus,
    ListResponse,
    MitigationPatch,
    OutboundWatchQuery,
    ProviderScanResult,
    ReviewAction,
    ScheduleContract,
    ScheduleRecurrence,
    SourceRoleEdit,
    WatchPatch,
    WatchDraftCard,
)


def test_outbound_query_is_immutable_and_has_no_internal_scope() -> None:
    query = OutboundWatchQuery(
        standing_question="What changed in public privacy law?",
        topics=("privacy",),
        public_source_urls=("https://example.gov/feed",),
    )

    with pytest.raises(ValidationError):
        query.standing_question = "changed"  # type: ignore[misc]
    nested = OutboundWatchQuery(
        standing_question="Question",
        date_window={"start": "2026-01-01"},
        public_entities=({"name": "Public Co", "explicitly_public": True},),
    )
    with pytest.raises(ValidationError):
        nested.date_window.start = None  # type: ignore[union-attr,misc]
    with pytest.raises(ValidationError):
        nested.public_entities[0].name = "Changed"  # type: ignore[misc]
    with pytest.raises(ValidationError):
        OutboundWatchQuery(
            standing_question="Question",
            internal_scope={"matter_ids": ["MAT-1"]},
        )

    payload = query.model_dump(mode="json")
    assert "internal_scope" not in payload
    assert "matter_ids" not in str(payload)


def test_briefing_query_defaults_and_fixed_values() -> None:
    query = BriefingQuery()
    assert query.model_dump() == {
        "q": "", "watch": [], "source": [], "topic": [], "jurisdiction": [],
        "source_type": [], "source_role": [], "status": [], "read": "any",
        "saved": "any", "company_connection": "any", "packet": "any",
        "impact": None, "legal_status": None, "sort": "newest", "group": "none",
        "view": None, "cursor": None, "limit": 25,
    }
    with pytest.raises(ValidationError):
        BriefingQuery(sort="popular")
    with pytest.raises(ValidationError):
        BriefingQuery(source_role=["important"])


@pytest.mark.parametrize("provider", ["native", "polaris"])
def test_provider_result_accepts_canonical_provider(provider: str) -> None:
    result = ProviderScanResult(provider_id=provider, status="success")
    assert result.provider_id == provider


def test_partial_provider_result_requires_useful_material() -> None:
    with pytest.raises(ValidationError):
        ProviderScanResult(provider_id="native", status="partial", warnings=["timeout"])
    result = ProviderScanResult(
        provider_id="native", status="partial", bounded_excerpt="Useful partial answer",
    )
    assert result.status == "partial"


def test_recurrence_defaults_and_cross_field_validation() -> None:
    recurrence = ScheduleRecurrence()
    assert recurrence.kind == "daily"
    assert recurrence.local_time == "08:00"
    assert recurrence.time_zone == "UTC"
    with pytest.raises(ValidationError):
        ScheduleRecurrence(kind="interval")
    with pytest.raises(ValidationError):
        ScheduleRecurrence(kind="daily", time_zone="Mars/Olympus_Mons")
    with pytest.raises(ValidationError):
        ScheduleRecurrence(kind="weekday", weekdays=[])
    valid = ScheduleRecurrence(
        kind="weekday", time_zone="America/Los_Angeles", local_time="07:30",
        weekdays=["monday", "friday"],
    )
    assert valid.weekdays == ["monday", "friday"]


def test_schedule_requires_target_and_manual_has_no_next_run() -> None:
    now = datetime.now(timezone.utc)
    with pytest.raises(ValidationError):
        ScheduleContract(
            schedule_id="SCH-1", path="schedule.md", title="Scan", kind="watch_scan",
            recurrence=ScheduleRecurrence(kind="manual", local_time=None, time_zone=None),
            enabled=True,
        )
    schedule = ScheduleContract(
        schedule_id="SCH-1", path="schedule.md", title="Scan", kind="watch_scan",
        target_watch_id="WATCH-1",
        recurrence=ScheduleRecurrence(kind="manual", local_time=None, time_zone=None),
        enabled=True,
    )
    assert schedule.next_run_at is None
    with pytest.raises(ValidationError):
        schedule.model_copy(update={"next_run_at": now}, deep=True).__class__(
            **{**schedule.model_dump(), "next_run_at": now}
        )


@pytest.mark.parametrize(
    ("payload", "action"),
    [
        ({"action": "save_to_matter", "matter_id": "MAT-1", "expected_revision": 2}, "save_to_matter"),
        ({"action": "connect_to_decision", "decision_id": "DEC-1", "expected_revision": 2}, "connect_to_decision"),
        ({"action": "create_follow_up", "matter_id": "MAT-1", "title": "Review", "expected_revision": 2}, "create_follow_up"),
    ],
)
def test_connect_actions_are_discriminated(payload: dict[str, object], action: str) -> None:
    parsed = TypeAdapter(BriefingConnectAction).validate_python(payload)
    assert parsed.action == action


@pytest.mark.parametrize(
    "payload",
    [
        {"action": "keep_current", "expected_revision": 1, "payload": {}},
        {"action": "revise_decision", "expected_revision": 1, "payload": {"decision_id": "DEC-1", "work_item_title": "Revise"}},
        {"action": "create_follow_up", "expected_revision": 1, "payload": {"matter_id": "MAT-1", "title": "Follow up"}},
        {"action": "not_relevant", "expected_revision": 1, "payload": {}},
        {"action": "keep_monitoring", "expected_revision": 1, "payload": {}},
    ],
)
def test_review_actions_are_exact_and_require_revision(payload: dict[str, object]) -> None:
    assert TypeAdapter(ReviewAction).validate_python(payload).action == payload["action"]
    without_revision = dict(payload)
    without_revision.pop("expected_revision")
    with pytest.raises(ValidationError):
        TypeAdapter(ReviewAction).validate_python(without_revision)


def test_watch_card_and_list_response_shapes() -> None:
    card = WatchDraftCard(
        card_id="CARD-1", watch_id="WATCH-1", status="pending", title="Privacy",
        watch_url="/watches/WATCH-1",
        allowed_actions=["save_draft", "scan_now", "change_something", "start_watch"],
    )
    assert card.type == "watch_draft"
    page = ListResponse[WatchDraftCard](items=[card], next_cursor=None, total=1)
    assert set(page.model_dump()) == {"items", "next_cursor", "total", "resolved_query"}
    assert page.total == 1


def test_mutation_requests_require_revision_and_validate_roles() -> None:
    with pytest.raises(ValidationError):
        WatchPatch(title="Changed")
    with pytest.raises(ValidationError):
        MitigationPatch(status="complete")
    with pytest.raises(ValidationError):
        SourceRoleEdit(source_id="SRC-1", role="important", expected_revision=1)
    edit = SourceRoleEdit(source_id="SRC-1", role="primary", expected_revision=2)
    assert edit.expected_revision == 2


def test_forbidden_corpus_cannot_silently_be_empty() -> None:
    with pytest.raises(ValidationError):
        ForbiddenCorpus()
    corpus = ForbiddenCorpus(proved_no_private_identifiers=True)
    assert corpus.terms == ()
    assert corpus.fragments == ()
