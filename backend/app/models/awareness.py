from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, Generic, Literal, TypeVar
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, model_validator


ProviderSelection = Literal["native", "polaris", "both"]
ProviderId = Literal["native", "polaris"]
WatchPurpose = Literal["awareness", "company_impact", "decision_maintenance"]
SourceType = Literal[
    "case", "statute", "regulation", "regulator_material", "government_publication",
    "secondary_legal_analysis", "periodical", "industry_reporting", "company_statement",
    "market_signal", "other",
]
SourceRole = Literal["primary", "secondary", "discovery_only", "excluded"]
AuthorityStatus = Literal["binding", "persuasive", "proposed", "official_nonbinding", "none", "unknown"]
CoverageStatus = Literal["configured", "checked", "changed", "unchanged", "unavailable", "failed"]
ScanStatus = Literal["running", "success", "partial", "failed", "interrupted"]
ScheduleStatus = Literal["never_run", "running", "success", "partial", "failed", "interrupted", "skipped"]
ScanMode = Literal["draft", "manual", "scheduled"]
AttentionState = Literal["briefing_only", "monitor", "this_week", "required"]
SourceSupportState = Literal["supplied", "retrieved", "verified", "unverified_lead"]
PotentialImpact = Literal["low", "medium", "high"]
ReviewPriority = Literal["today", "this_week", "monitor"]
ReviewOutcomeAction = Literal["keep_current", "revise_decision", "create_follow_up", "not_relevant", "keep_monitoring"]
Usefulness = Literal["useful", "not_useful"]


class AwarenessModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class DateWindow(AwarenessModel):
    start: date | None = None
    end: date | None = None

    @model_validator(mode="after")
    def ordered(self) -> DateWindow:
        if self.start and self.end and self.start > self.end:
            raise ValueError("date window start must not be after end")
        return self


class PublicEntity(AwarenessModel):
    name: str = Field(min_length=1, max_length=160)
    entity_type: Literal["company", "organization", "person", "product", "other"] = "other"
    explicitly_public: Literal[True] = True


class OutboundDateWindow(DateWindow):
    model_config = ConfigDict(extra="forbid", frozen=True)


class OutboundPublicEntity(PublicEntity):
    model_config = ConfigDict(extra="forbid", frozen=True)


class WatchSource(AwarenessModel):
    source_id: str
    name: str
    canonical_url: HttpUrl
    publisher: str = ""
    jurisdiction: str = ""
    source_type: SourceType
    role: SourceRole
    authority_status: AuthorityStatus = "unknown"
    coverage_status: CoverageStatus = "configured"


class PublicWatchQuery(AwarenessModel):
    standing_question: str = Field(min_length=1)
    keywords: list[str] = Field(default_factory=list)
    topics: list[str] = Field(default_factory=list)
    jurisdictions: list[str] = Field(default_factory=list)
    regulators: list[str] = Field(default_factory=list)
    courts: list[str] = Field(default_factory=list)
    industries: list[str] = Field(default_factory=list)
    date_window: DateWindow | None = None
    public_source_urls: list[HttpUrl] = Field(default_factory=list)
    public_entities: list[PublicEntity] = Field(default_factory=list)


class OutboundWatchQuery(AwarenessModel):
    """Allow-listed provider input. Free text still requires OutboundQueryPolicy validation."""

    model_config = ConfigDict(extra="forbid", frozen=True)
    standing_question: str = Field(min_length=1, max_length=2000)
    keywords: tuple[str, ...] = Field(default_factory=tuple, max_length=100)
    topics: tuple[str, ...] = Field(default_factory=tuple, max_length=100)
    jurisdictions: tuple[str, ...] = Field(default_factory=tuple, max_length=50)
    regulators: tuple[str, ...] = Field(default_factory=tuple, max_length=50)
    courts: tuple[str, ...] = Field(default_factory=tuple, max_length=50)
    industries: tuple[str, ...] = Field(default_factory=tuple, max_length=50)
    date_window: OutboundDateWindow | None = None
    public_source_urls: tuple[HttpUrl, ...] = Field(default_factory=tuple, max_length=50)
    public_entities: tuple[OutboundPublicEntity, ...] = Field(default_factory=tuple, max_length=50)


class InternalScope(AwarenessModel):
    product_ids: list[str] = Field(default_factory=list)
    company_paths: list[str] = Field(default_factory=list)
    matter_ids: list[str] = Field(default_factory=list)
    decision_ids: list[str] = Field(default_factory=list)
    mitigation_ids: list[str] = Field(default_factory=list)
    lookback_days: int = Field(default=90, ge=1, le=3650)


class ProviderCheckpoint(AwarenessModel):
    provider_id: ProviderId
    cursor: str | None = None
    last_observed_at: datetime | None = None
    state: dict[str, str | int | float | bool | None] = Field(default_factory=dict)


class BriefingBehavior(AwarenessModel):
    create_items: bool = True
    create_digest: bool = False
    saved_view_id: str | None = None


class ReviewBehavior(AwarenessModel):
    enabled: bool = True
    default_attention: AttentionState = "monitor"


class ScheduleRecurrence(AwarenessModel):
    kind: Literal["manual", "interval", "daily", "weekday"] = "daily"
    interval_seconds: int | None = Field(default=None, ge=10)
    local_time: str | None = Field(default="08:00", pattern=r"^(?:[01]\d|2[0-3]):[0-5]\d$")
    time_zone: str | None = "UTC"
    weekdays: list[Literal["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_kind_fields(self) -> ScheduleRecurrence:
        if self.kind == "manual":
            if self.interval_seconds is not None or self.weekdays:
                raise ValueError("manual recurrence cannot have an interval or weekdays")
            return self
        if self.kind == "interval":
            if self.interval_seconds is None:
                raise ValueError("interval recurrence requires interval_seconds")
            return self
        if not self.local_time or not self.time_zone:
            raise ValueError("daily and weekday recurrence require local_time and time_zone")
        try:
            ZoneInfo(self.time_zone)
        except ZoneInfoNotFoundError as exc:
            raise ValueError("time_zone must be a valid IANA time zone") from exc
        if self.kind == "weekday" and not self.weekdays:
            raise ValueError("weekday recurrence requires at least one weekday")
        if self.kind == "daily" and self.weekdays:
            raise ValueError("daily recurrence cannot specify weekdays")
        return self


class Watch(AwarenessModel):
    watch_id: str
    path: str
    title: str
    standing_question: str
    public_query: PublicWatchQuery
    purposes: list[WatchPurpose] = Field(min_length=1)
    sources: list[WatchSource] = Field(default_factory=list)
    internal_scope: InternalScope = Field(default_factory=InternalScope)
    provider: ProviderSelection = "native"
    recurrence: ScheduleRecurrence = Field(default_factory=ScheduleRecurrence)
    enabled: bool = False
    schedule_id: str | None = None
    briefing: BriefingBehavior = Field(default_factory=BriefingBehavior)
    review: ReviewBehavior = Field(default_factory=ReviewBehavior)
    checkpoints: dict[ProviderId, ProviderCheckpoint] = Field(default_factory=dict)
    last_successful_scan_at: datetime | None = None
    status: Literal["draft", "scanning", "healthy", "paused", "failed", "needs_review"] = "draft"
    revision: int = Field(default=1, ge=1)
    created_at: datetime
    updated_at: datetime


class SourceReference(AwarenessModel):
    title: str
    canonical_url: HttpUrl
    publisher: str = ""
    published_at: datetime | None = None
    effective_at: datetime | None = None
    locator: str = ""
    excerpt: str = Field(default="", max_length=12000)
    support_state: SourceSupportState = "supplied"
    warning: str | None = None


class DevelopmentCandidate(AwarenessModel):
    title: str
    canonical_url: HttpUrl | None = None
    official_identifier: str | None = None
    content_hash: str | None = None
    summary: str = ""
    occurred_at: datetime | None = None
    sources: list[SourceReference] = Field(default_factory=list)
    provider_observation: str = Field(default="", max_length=12000)


class SourceCoverage(AwarenessModel):
    source_id: str | None = None
    url: HttpUrl | None = None
    status: CoverageStatus
    message: str = ""


class ProviderScanResult(AwarenessModel):
    provider_id: ProviderId
    status: ScanStatus
    next_checkpoint: ProviderCheckpoint | None = None
    source_coverage: list[SourceCoverage] = Field(default_factory=list)
    candidates: list[DevelopmentCandidate] = Field(default_factory=list)
    raw_answer_reference: str | None = None
    bounded_excerpt: str = Field(default="", max_length=12000)
    warnings: list[str] = Field(default_factory=list)

    @model_validator(mode="after")
    def partial_has_material(self) -> ProviderScanResult:
        if self.status == "partial" and not (self.candidates or self.bounded_excerpt.strip()):
            raise ValueError("partial provider result requires useful candidates or text")
        return self


class Scan(AwarenessModel):
    scan_id: str
    path: str
    watch_id: str
    mode: ScanMode
    status: ScanStatus
    watch_revision: int = Field(ge=1)
    outbound_query: OutboundWatchQuery | None = None
    input_checkpoints: dict[ProviderId, ProviderCheckpoint] = Field(default_factory=dict)
    output_checkpoints: dict[ProviderId, ProviderCheckpoint] = Field(default_factory=dict)
    provider_results: list[ProviderScanResult] = Field(default_factory=list)
    source_coverage: list[SourceCoverage] = Field(default_factory=list)
    development_count: int = Field(default=0, ge=0)
    briefing_item_count: int = Field(default=0, ge=0)
    review_packet_count: int = Field(default=0, ge=0)
    warnings: list[str] = Field(default_factory=list)
    created_paths: list[str] = Field(default_factory=list)
    started_at: datetime
    completed_at: datetime | None = None


class ProviderObservation(AwarenessModel):
    provider_id: ProviderId
    observed_at: datetime
    content_hash: str | None = None
    text: str = Field(default="", max_length=12000)
    sources: list[SourceReference] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


class Development(AwarenessModel):
    development_id: str
    path: str
    title: str
    canonical_url: HttpUrl | None = None
    official_identifier: str | None = None
    current_content_hash: str | None = None
    summary: str = ""
    legal_status: str = "unknown"
    occurred_at: datetime | None = None
    supersedes_development_id: str | None = None
    watch_ids: list[str] = Field(default_factory=list)
    observations: list[ProviderObservation] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class CompanyConnection(AwarenessModel):
    products: list[str] = Field(default_factory=list)
    policies: list[str] = Field(default_factory=list)
    matters: list[str] = Field(default_factory=list)
    decisions: list[str] = Field(default_factory=list)
    mitigations: list[str] = Field(default_factory=list)
    reason: str = ""


class BriefingItem(AwarenessModel):
    item_id: str
    path: str
    development_id: str
    watch_id: str
    title: str
    summary: str
    why_shown: str
    topics: list[str] = Field(default_factory=list)
    jurisdictions: list[str] = Field(default_factory=list)
    sources: list[SourceReference] = Field(default_factory=list)
    published_at: datetime | None = None
    effective_at: datetime | None = None
    read: bool = False
    saved: bool = False
    usefulness: Usefulness | None = None
    company_connection: CompanyConnection | None = None
    review_packet_id: str | None = None
    attention_state: AttentionState = "briefing_only"
    potential_impact: PotentialImpact | None = None
    legal_status: str = "unknown"
    revision: int = Field(default=1, ge=1)
    created_at: datetime
    updated_at: datetime


BriefingSort = Literal["newest", "relevance", "potential_impact", "primary_sources", "effective_date", "unread", "connected_decisions"]
BriefingGroup = Literal["none", "watch", "topic", "source", "jurisdiction", "date", "product", "affected_decision"]
TriStateFilter = Literal["any", "yes", "no"]
PacketFilter = Literal["any", "none", "connected", "required"]


class BriefingQuery(AwarenessModel):
    q: str = ""
    watch: list[str] = Field(default_factory=list)
    source: list[str] = Field(default_factory=list)
    topic: list[str] = Field(default_factory=list)
    jurisdiction: list[str] = Field(default_factory=list)
    source_type: list[SourceType] = Field(default_factory=list)
    source_role: list[SourceRole] = Field(default_factory=list)
    status: list[AttentionState] = Field(default_factory=list)
    read: TriStateFilter = "any"
    saved: TriStateFilter = "any"
    company_connection: TriStateFilter = "any"
    packet: PacketFilter = "any"
    impact: PotentialImpact | None = None
    legal_status: str | None = None
    sort: BriefingSort = "newest"
    group: BriefingGroup = "none"
    view: str | None = None
    cursor: str | None = None
    limit: int = Field(default=25, ge=1, le=100)


class SavedView(AwarenessModel):
    view_id: str
    path: str
    name: str
    query: BriefingQuery
    display: dict[str, str | bool | int] = Field(default_factory=dict)
    revision: int = Field(default=1, ge=1)
    created_at: datetime
    updated_at: datetime


class Digest(AwarenessModel):
    digest_id: str
    path: str
    view_id: str
    view_name: str
    resolved_query: BriefingQuery
    item_ids: list[str] = Field(default_factory=list)
    title: str
    summary: str = ""
    warnings: list[str] = Field(default_factory=list)
    created_at: datetime


class ReviewPacket(AwarenessModel):
    packet_id: str
    path: str
    development_ids: list[str] = Field(min_length=1)
    briefing_item_ids: list[str] = Field(default_factory=list)
    potential_impact: PotentialImpact
    review_priority: ReviewPriority
    attention_state: AttentionState
    what_happened: str
    legal_status: str
    why_surfaced: str
    affected_products: list[str] = Field(default_factory=list)
    affected_policies: list[str] = Field(default_factory=list)
    affected_matters: list[str] = Field(default_factory=list)
    affected_decisions: list[str] = Field(default_factory=list)
    affected_mitigations: list[str] = Field(default_factory=list)
    prior_decision_basis: str = ""
    existing_mitigations: list[str] = Field(default_factory=list)
    possible_tension: str
    timing: str = ""
    effective_dates: list[date] = Field(default_factory=list)
    sources: list[SourceReference] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    status: Literal["open", "resolved", "monitoring"] = "open"
    revision: int = Field(default=1, ge=1)
    created_at: datetime
    updated_at: datetime


class Mitigation(AwarenessModel):
    mitigation_id: str
    matter_id: str
    path: str
    title: str
    description: str = ""
    status: Literal["proposed", "active", "complete", "retired"] = "active"
    decision_ids: list[str] = Field(default_factory=list)
    owner: str = ""
    review_at: date | None = None
    revision: int = Field(default=1, ge=1)
    created_at: datetime
    updated_at: datetime


class ExpectedRevision(AwarenessModel):
    expected_revision: int = Field(ge=1)


class WatchDraftCreate(AwarenessModel):
    title: str = Field(min_length=1, max_length=160)
    standing_question: str = Field(min_length=1)
    public_query: PublicWatchQuery
    purposes: list[WatchPurpose] = Field(min_length=1)
    provider: ProviderSelection = "native"


class WatchPatch(ExpectedRevision):
    title: str | None = Field(default=None, min_length=1, max_length=160)
    standing_question: str | None = Field(default=None, min_length=1)
    public_query: PublicWatchQuery | None = None
    purposes: list[WatchPurpose] | None = None
    sources: list[WatchSource] | None = None
    internal_scope: InternalScope | None = None
    provider: ProviderSelection | None = None
    recurrence: ScheduleRecurrence | None = None
    briefing: BriefingBehavior | None = None
    review: ReviewBehavior | None = None


class WatchAnswer(ExpectedRevision):
    question_id: str = Field(min_length=1)
    answer: str | list[str]


class WatchScanRequest(AwarenessModel):
    mode: Literal["draft", "manual"] = "manual"


class WatchStateRequest(ExpectedRevision):
    pass


class SourceRoleEdit(ExpectedRevision):
    source_id: str
    role: SourceRole


class SavedViewCreate(AwarenessModel):
    name: str = Field(min_length=1, max_length=160)
    query: BriefingQuery
    display: dict[str, str | bool | int] = Field(default_factory=dict)


class SavedViewPatch(ExpectedRevision):
    name: str | None = Field(default=None, min_length=1, max_length=160)
    query: BriefingQuery | None = None
    display: dict[str, str | bool | int] | None = None


class DigestSchedulePut(ExpectedRevision):
    recurrence: ScheduleRecurrence
    enabled: bool = True


class BriefingChatMessage(AwarenessModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=12000)


class BriefingAskRequest(AwarenessModel):
    question: str = Field(min_length=1)
    history: list[BriefingChatMessage] = Field(default_factory=list, max_length=12)


class BriefingResearchRequest(AwarenessModel):
    question: str = Field(default="", max_length=4000)


class MitigationCreate(AwarenessModel):
    title: str = Field(min_length=1, max_length=160)
    description: str = ""
    status: Literal["proposed", "active", "complete", "retired"] = "active"
    decision_ids: list[str] = Field(default_factory=list)
    owner: str = ""
    review_at: date | None = None


class MitigationPatch(ExpectedRevision):
    title: str | None = Field(default=None, min_length=1, max_length=160)
    description: str | None = None
    status: Literal["proposed", "active", "complete", "retired"] | None = None
    decision_ids: list[str] | None = None
    owner: str | None = None
    review_at: date | None = None


class BriefingItemPatch(ExpectedRevision):
    read: bool | None = None
    saved: bool | None = None
    usefulness: Usefulness | None = None

    @model_validator(mode="after")
    def has_change(self) -> BriefingItemPatch:
        if self.read is None and self.saved is None and self.usefulness is None:
            raise ValueError("at least one editable field is required")
        return self


class SaveToMatterAction(AwarenessModel):
    action: Literal["save_to_matter"]
    matter_id: str
    expected_revision: int = Field(ge=1)


class ConnectToDecisionAction(AwarenessModel):
    action: Literal["connect_to_decision"]
    decision_id: str
    expected_revision: int = Field(ge=1)


class CreateFollowUpConnectAction(AwarenessModel):
    action: Literal["create_follow_up"]
    matter_id: str
    title: str
    due_at: datetime | None = None
    expected_revision: int = Field(ge=1)


BriefingConnectAction = Annotated[SaveToMatterAction | ConnectToDecisionAction | CreateFollowUpConnectAction, Field(discriminator="action")]


class KeepCurrentPayload(AwarenessModel):
    next_review_at: date | None = None
    note: str = ""


class ReviseDecisionPayload(AwarenessModel):
    decision_id: str
    matter_id: str | None = None
    work_item_title: str


class FollowUpPayload(AwarenessModel):
    matter_id: str
    title: str
    due_at: datetime | None = None


class FeedbackPayload(AwarenessModel):
    reason: str = ""


class KeepCurrentAction(ExpectedRevision):
    action: Literal["keep_current"]
    payload: KeepCurrentPayload = Field(default_factory=KeepCurrentPayload)


class ReviseDecisionAction(ExpectedRevision):
    action: Literal["revise_decision"]
    payload: ReviseDecisionPayload


class CreateFollowUpReviewAction(ExpectedRevision):
    action: Literal["create_follow_up"]
    payload: FollowUpPayload


class NotRelevantAction(ExpectedRevision):
    action: Literal["not_relevant"]
    payload: FeedbackPayload = Field(default_factory=FeedbackPayload)


class KeepMonitoringAction(ExpectedRevision):
    action: Literal["keep_monitoring"]
    payload: FeedbackPayload = Field(default_factory=FeedbackPayload)


ReviewAction = Annotated[KeepCurrentAction | ReviseDecisionAction | CreateFollowUpReviewAction | NotRelevantAction | KeepMonitoringAction, Field(discriminator="action")]


class ReviewOutcome(AwarenessModel):
    outcome_id: str
    packet_id: str
    action: ReviewOutcomeAction
    payload: dict[str, object] = Field(default_factory=dict)
    recorded_at: datetime


class DurableResult(AwarenessModel):
    result_id: str
    path: str
    status: Literal["pending", "partial", "success", "failed"]
    text: str = ""
    warnings: list[str] = Field(default_factory=list)
    sources: list[SourceReference] = Field(default_factory=list)
    briefing_item_id: str | None = None
    question: str = ""
    kind: Literal["research", "connection"] = "research"
    created_at: datetime | None = None


class ProviderCapability(AwarenessModel):
    provider_id: ProviderId
    label: str
    configured: bool
    available: bool
    warning: str | None = None
    supported_modes: list[Literal["watch_scan"]] = Field(default_factory=lambda: ["watch_scan"])


class WatchDraftCard(AwarenessModel):
    type: Literal["watch_draft"] = "watch_draft"
    card_id: str
    watch_id: str
    status: Literal["pending", "partial", "success", "failed"]
    title: str
    summary: str = ""
    warnings: list[str] = Field(default_factory=list)
    watch_path: str | None = None
    vault_path: str = ""
    state: Literal["draft"] = "draft"
    watch_url: str
    allowed_actions: list[Literal["save_draft", "scan_now", "change_something", "start_watch"]]


class WatchScanCard(AwarenessModel):
    type: Literal["watch_scan"] = "watch_scan"
    card_id: str
    watch_id: str
    scan_id: str
    status: Literal["pending", "partial", "success", "failed"]
    summary: str = ""
    warnings: list[str] = Field(default_factory=list)
    title: str = "Watch scan"
    vault_path: str = ""
    state: Literal["final"] = "final"
    watch_url: str
    scan_url: str
    allowed_actions: list[Literal["open_watch", "open_scan", "scan_again"]]


class ScheduleContract(AwarenessModel):
    schedule_id: str
    path: str
    title: str
    agent_id: str = "counsel-copilot"
    instructions: str = ""
    interval_seconds: int = Field(default=3600, ge=10)
    watch_path: str | None = None
    kind: Literal["agent_prompt", "inbox_watch", "decision_audit", "watch_scan", "briefing_digest"]
    target_watch_id: str | None = None
    target_view_id: str | None = None
    recurrence: ScheduleRecurrence
    enabled: bool
    revision: int = Field(default=1, ge=1)
    last_run_at: datetime | None = None
    next_run_at: datetime | None = None
    last_status: ScheduleStatus = "never_run"
    last_message: str = ""

    @model_validator(mode="after")
    def target_matches_kind(self) -> ScheduleContract:
        if self.kind == "watch_scan" and not self.target_watch_id:
            raise ValueError("watch_scan schedule requires target_watch_id")
        if self.kind == "briefing_digest" and not self.target_view_id:
            raise ValueError("briefing_digest schedule requires target_view_id")
        if self.recurrence.kind == "manual" and self.next_run_at is not None:
            raise ValueError("manual recurrence cannot have next_run_at")
        return self


class SchedulePatch(ExpectedRevision):
    enabled: bool | None = None
    target_watch_id: str | None = None
    target_view_id: str | None = None
    recurrence: ScheduleRecurrence | None = None


T = TypeVar("T")


class ListResponse(AwarenessModel, Generic[T]):
    items: list[T]
    next_cursor: str | None = None
    total: int = Field(ge=0)
    resolved_query: BriefingQuery | None = None


class ForbiddenCorpus(AwarenessModel):
    terms: tuple[str, ...] = Field(default_factory=tuple)
    fragments: tuple[str, ...] = Field(default_factory=tuple)
    proved_no_private_identifiers: bool = False

    @model_validator(mode="after")
    def empty_requires_proof(self) -> ForbiddenCorpus:
        if not self.terms and not self.fragments and not self.proved_no_private_identifiers:
            raise ValueError("an empty forbidden corpus requires explicit proof")
        return self


class SafeFetchLimits(AwarenessModel):
    request_timeout_seconds: int = 15
    run_timeout_seconds: int = 60
    max_redirects: int = 3
    max_compressed_bytes: int = 2 * 1024 * 1024
    max_decompressed_bytes: int = 5 * 1024 * 1024
    max_excerpt_characters: int = 12000


class SafeFetchResult(AwarenessModel):
    requested_url: HttpUrl
    final_url: HttpUrl
    status_code: int = Field(ge=100, le=599)
    content_type: str
    content_hash: str
    excerpt: str = Field(max_length=12000)
    warnings: list[str] = Field(default_factory=list)


class DevelopmentBatch(AwarenessModel):
    developments: list[Development] = Field(default_factory=list)
    created_count: int = Field(default=0, ge=0)
    observation_count: int = Field(default=0, ge=0)
    warnings: list[str] = Field(default_factory=list)


class SourceSupport(AwarenessModel):
    source: SourceReference
    state: SourceSupportState
    checked_at: datetime | None = None
    warning: str | None = None


class InternalRecord(AwarenessModel):
    record_id: str
    record_type: Literal["product", "policy", "matter", "decision", "mitigation", "document"]
    path: str
    title: str
    text: str = ""


class InternalSnapshot(AwarenessModel):
    records: list[InternalRecord] = Field(default_factory=list)
    created_at: datetime
    warnings: list[str] = Field(default_factory=list)


class MatchConnection(AwarenessModel):
    development_id: str
    internal_record_ids: list[str] = Field(default_factory=list)
    attention_state: AttentionState
    reason: str
    evidence: list[str] = Field(default_factory=list)


class MatchResult(AwarenessModel):
    connections: list[MatchConnection] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


class IndexReport(AwarenessModel):
    indexed_count: int = Field(default=0, ge=0)
    error_count: int = Field(default=0, ge=0)
    errors: list[str] = Field(default_factory=list)


class BriefingPage(ListResponse[BriefingItem]):
    resolved_query: BriefingQuery


class ScanResult(AwarenessModel):
    scan: Scan
    preview_items: list[BriefingItem] = Field(default_factory=list)
    preview_packets: list[ReviewPacket] = Field(default_factory=list)


ERROR_STATUS_BY_KIND: dict[str, int] = {
    "not_found": 404,
    "revision_conflict": 409,
    "active_scan_conflict": 409,
    "invalid_provider": 422,
    "invalid_query": 422,
    "invalid_source_role": 422,
    "invalid_url": 422,
    "invalid_recurrence": 422,
    "invalid_time_zone": 422,
}
