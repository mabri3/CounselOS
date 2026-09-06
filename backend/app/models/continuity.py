"""Additive lawyer continuity contracts; no storage or execution side effects.

See docs/lawyer-workflow-expansion.contract.md for authority and retry rules.
Human actors are trusted service arguments, never command payload fields.
"""
from __future__ import annotations

from typing import Annotated, Literal, Protocol

from pydantic import BaseModel, Field

from app.models.workspace import ConversationTarget, InteractionReceipt, SourceActionKey

PersonId = Annotated[str, Field(min_length=1, max_length=80, pattern=r"^[A-Za-z0-9][A-Za-z0-9_-]*$")]
ReferenceKind = Literal["source", "advice", "recommendation", "decision", "draft", "fact", "assumption", "question", "work_item"]


class ContinuityModel(BaseModel):
    model_config = {"extra": "forbid"}


class DemoPerson(ContinuityModel):
    person_id: PersonId
    display_name: str = Field(min_length=1, max_length=160)
    specialty: str | None = None


class ActionActor(ContinuityModel):
    model_config = {"extra": "forbid", "frozen": True}
    person_id: PersonId
    display_name: str = Field(min_length=1, max_length=160)
    mode: Literal["single", "demo"]


class DemoRoster(ContinuityModel):
    enabled: bool = False
    people: list[DemoPerson] = Field(default_factory=list)
    revision: str
    vault_key: str


class DemoRosterCommand(ContinuityModel):
    enabled: bool
    people: list[DemoPerson] = Field(default_factory=list)
    expected_revision: str
    source_action_key: SourceActionKey


class PersonViewState(ContinuityModel):
    person_id: str
    revision: str | None = None
    source_revisions: dict[str, str] = Field(default_factory=dict)
    output_revisions: dict[str, str] = Field(default_factory=dict)
    seen_at: str | None = None


class WorkTarget(ContinuityModel):
    matter_id: str
    kind: Literal["matter", "work_item", "question", "artifact", "handoff", "fact_request", "impact", "run"]
    target_id: str
    path: str | None = None
    revision: str | None = None
    view: Literal["understand", "discuss", "draft"] = "understand"


class NextAction(ContinuityModel):
    action_id: str
    label: str
    reason: str
    state: Literal["ready", "waiting", "running", "failed", "complete", "unavailable"]
    target: WorkTarget
    owner_id: str | None = None
    owner_name: str | None = None
    actor_kind: Literal["lawyer", "agent", "business", "unknown"] = "unknown"
    required: bool = False
    due_at: str | None = None


class MeaningfulChange(ContinuityModel):
    change_id: str
    title: str
    detail: str
    basis: Literal["saved_receipt", "saved_versions", "hash_only", "first_visit"]
    target: WorkTarget | None = None
    before_text: str | None = None
    after_text: str | None = None
    before_revision: str | None = None
    after_revision: str | None = None


class Orientation(ContinuityModel):
    matter_id: str
    basis_revision: str
    question_text: str
    question_preview: str
    question_is_preview: bool = True
    answer: str = ""
    answer_path: str | None = None
    answer_label: str = ""
    caveats: list[str] = Field(default_factory=list)
    answer_state: Literal["current", "stale", "unavailable"] = "unavailable"
    primary_action: NextAction | None = None
    secondary_actions: list[NextAction] = Field(default_factory=list)
    changes: list[MeaningfulChange] = Field(default_factory=list)
    first_visit: bool = True
    seen_revision: str | None = None
    current_revision: str
    warnings: list[str] = Field(default_factory=list)


class FactRequestCommand(ContinuityModel):
    question_id: str
    expected_question_revision: str
    business_question_revision: str
    wording: str = Field(min_length=1, max_length=20000)
    requested_person: str | None = None
    due_at: str | None = None
    issue_id: str | None = None
    work_item_id: str | None = None
    source_action_key: SourceActionKey


class FactRequestEdit(ContinuityModel):
    expected_revision: str
    wording: str = Field(min_length=1, max_length=20000)
    requested_person: str | None = None
    due_at: str | None = None
    source_action_key: SourceActionKey


class FactRequestAction(ContinuityModel):
    action: Literal["requested_externally", "leave_open"]
    expected_revision: str
    source_action_key: SourceActionKey


class FactReplyCommand(ContinuityModel):
    expected_revision: str
    text: str = Field(min_length=1, max_length=100000)
    reported_speaker: str | None = None
    reported_at: str | None = None
    source_action_key: SourceActionKey


class RecordReplyCommand(ContinuityModel):
    expected_revision: str
    expected_question_revision: str
    business_question_revision: str
    answer_text: str = Field(min_length=1, max_length=20000)
    coverage: Literal["full", "partial"]
    remaining_question: str | None = None
    supersedes_fact_id: str | None = None
    source_action_key: SourceActionKey


class FactReply(ContinuityModel):
    reply_id: str
    source_id: str
    path: str
    text: str
    content_hash: str
    entered_by: ActionActor
    reported_speaker: str | None = None
    reported_at: str | None = None
    created_at: str
    linked_fact_ids: list[str] = Field(default_factory=list)


class FactRequest(ContinuityModel):
    request_id: str
    matter_id: str
    question_id: str
    question_text: str
    question_revision: str
    business_question_revision: str
    wording: str
    requested_person: str | None = None
    due_at: str | None = None
    issue_id: str | None = None
    work_item_id: str | None = None
    created_by: ActionActor
    created_at: str
    revision: str
    state: Literal["prepared", "requested_externally", "reply_saved", "answer_recorded", "partly_answered", "left_open"] = "prepared"
    requested_at: str | None = None
    replies: list[FactReply] = Field(default_factory=list)
    linked_fact_ids: list[str] = Field(default_factory=list)
    remaining_question: str | None = None
    stale: bool = False


class ReassessmentIntent(ContinuityModel):
    source_action_key: str
    fact_ids: list[str]
    target: ConversationTarget


class FactRequestResult(ContinuityModel):
    request: FactRequest
    receipt: InteractionReceipt
    reassessment: ReassessmentIntent | None = None


class ScopeSnapshot(ContinuityModel):
    matter_id: str
    kind: Literal["matter", "work_item"]
    work_item_id: str | None = None
    title: str
    path: str
    owner_id: str | None = None
    owner_name: str | None = None
    ownership_revision: str
    content_revision: str
    status: str


class FrozenReference(ContinuityModel):
    reference_id: str
    kind: ReferenceKind
    title: str
    path: str
    revision: str
    content_hash: str
    text: str
    snapshot_path: str | None = None
    source_id: str | None = None
    original_path: str | None = None
    original_hash: str | None = None
    extraction_state: Literal["complete", "partial", "failed", "unavailable", "not_applicable"] = "not_applicable"


class ReferenceSelection(ContinuityModel):
    reference_id: str
    kind: ReferenceKind
    path: str
    expected_revision: str
    title: str | None = None


class HandoffCommand(ContinuityModel):
    scope: ScopeSnapshot
    recipient_id: PersonId
    ask: str = Field(min_length=1, max_length=20000)
    current_basis: str = ""
    open_questions: list[str] = Field(default_factory=list)
    references: list[ReferenceSelection] = Field(default_factory=list)
    requested_date: str | None = None
    source_action_key: SourceActionKey


class HandoffAction(ContinuityModel):
    action: Literal["accept", "decline", "withdraw", "return"]
    expected_revision: str
    expected_ownership_revision: str
    expected_content_revision: str
    reason: str = ""
    source_action_key: SourceActionKey


class Handoff(ContinuityModel):
    handoff_id: str
    matter_id: str
    path: str
    sender: ActionActor
    recipient: DemoPerson
    scope: ScopeSnapshot
    ask: str
    current_basis: str = ""
    open_questions: list[str] = Field(default_factory=list)
    references: list[FrozenReference] = Field(default_factory=list)
    requested_date: str | None = None
    state: Literal["pending", "accepted", "declined", "withdrawn"] = "pending"
    prior_handoff_id: str | None = None
    return_handoff_id: str | None = None
    accepted_ownership_revision: str | None = None
    revision: str
    created_at: str
    reason: str = ""
    stale: bool = False
    result_paths: list[str] = Field(default_factory=list)


class HandoffResult(ContinuityModel):
    handoff: Handoff
    reciprocal_handoff: Handoff | None = None
    receipt: InteractionReceipt


class OwnerTransfer(Protocol):
    """Canonical CAS adapter. Replay repairs projections; a later owner conflicts.

    Implementations run inside the existing WORKSPACE_LOCK. Their canonical
    write stores source_action_key as ownership_action_key and the stable new
    ownership_revision before updating participants/index. They return the
    actual committed scope, or raise WorkspaceConflict / OSError.
    """

    def __call__(self, *, expected: ScopeSnapshot, recipient: DemoPerson,
                 actor: ActionActor, source_action_key: str) -> ScopeSnapshot: ...


class TeamWorkItem(ContinuityModel):
    item_id: str
    matter_id: str
    matter_title: str
    title: str
    state: str
    queue: Literal["my_work", "waiting", "team"]
    action: NextAction
    handoff_id: str | None = None


class ComparisonCommand(ContinuityModel):
    before: ReferenceSelection | None = None
    after: ReferenceSelection
    targets: list[ReferenceSelection] = Field(default_factory=list)
    business_question_revision: str
    source_action_key: SourceActionKey


class ChangedPassage(ContinuityModel):
    passage_id: str
    kind: Literal["added", "deleted", "changed", "formatting"]
    before_text: str
    after_text: str
    before_locator: str = ""
    after_locator: str = ""


class ImpactFinding(ContinuityModel):
    finding_id: str
    target_id: str
    effect: Literal["remains_supported", "changes", "may_need_review", "unknown"]
    explanation: str
    support: Literal["linked", "inferred", "unavailable"]
    passage_ids: list[str] = Field(default_factory=list)
    affected_section: str | None = None


class SpecComparison(ContinuityModel):
    comparison_id: str
    matter_id: str
    path: str
    revision: str
    actor: ActionActor
    source_action_key: str
    before: FrozenReference | None = None
    after: FrozenReference
    targets: list[FrozenReference] = Field(default_factory=list)
    question: FrozenReference
    basis: list[FrozenReference] = Field(default_factory=list)
    baseline_revisions: dict[str, str]
    state: Literal["prepared", "complete", "partial", "unavailable", "stale"] = "prepared"
    difference: Literal["unchanged", "formatting_only", "text_changed", "unavailable"]
    passages: list[ChangedPassage] = Field(default_factory=list)
    analysis: str = ""
    findings: list[ImpactFinding] = Field(default_factory=list)
    coverage_limits: list[str] = Field(default_factory=list)
    run_id: str | None = None
    created_at: str
    offer_ids: list[str] = Field(default_factory=list)


class ImpactPublication(ContinuityModel):
    run_id: str
    text: str
    findings: list[ImpactFinding] = Field(default_factory=list)
    coverage_limits: list[str] = Field(default_factory=list)


class ImpactUpdateCommand(ContinuityModel):
    target_id: str
    expected_comparison_revision: str
    expected_artifact_revision: str
    source_action_key: SourceActionKey


class ImpactUpdateIntent(ContinuityModel):
    comparison_id: str
    target: ConversationTarget
    instruction: str
    source_action_key: str
    offer_id: str | None = None
    requires_working_copy: bool = False


class ContinuityRunCommand(ContinuityModel):
    source_action_key: SourceActionKey
    conversation_id: str | None = None
    instruction: str = ""


class ContinuityRunResult(ContinuityModel):
    run_id: str
    state: str
    receipt: InteractionReceipt | None = None
