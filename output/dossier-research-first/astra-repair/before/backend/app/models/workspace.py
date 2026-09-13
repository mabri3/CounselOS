"""Shared projections. Existing Markdown records remain authoritative."""
from __future__ import annotations

from typing import Annotated, Any, Literal
from pydantic import BaseModel, Field
SourceActionKey = Annotated[str, Field(min_length=1, max_length=256, pattern=r"^[A-Za-z0-9][A-Za-z0-9._:/-]*$")]


class WorkspaceModel(BaseModel):
    model_config = {"extra": "allow"}


class BusinessQuestion(WorkspaceModel):
    question_id: str
    text: str
    revision: str
    dossier_revision: str | None = None
    origin: Literal["provisional_agent", "explicit_lawyer", "accepted_proposal", "legacy_unknown"] = "legacy_unknown"
    source_message_id: str | None = None
    source_action_key: str | None = None
    updated_at: str | None = None


class QuestionCommand(WorkspaceModel):
    text: str = Field(min_length=1, max_length=10000)
    expected_revision: str
    source_action_key: SourceActionKey
    expected_dossier_revision: str | None = None
    source_message_id: str | None = None
    run_id: str | None = None
    reason: str = ""


class QuestionChange(WorkspaceModel):
    proposal_id: str
    question_id: str
    expected_revision: str
    expected_dossier_revision: str | None = None
    text: str
    reason: str = ""
    source_message_id: str | None = None
    source_action_key: str
    state: Literal["proposed", "applied", "rejected", "superseded", "failed"] = "proposed"
    revision_path: str | None = None
    created_at: str | None = None


class ProposalAction(WorkspaceModel):
    action: Literal["apply", "reject"]
    expected_revision: str
    source_action_key: SourceActionKey
    text: str | None = None
    source_message_id: str | None = None


class QuestionRestore(WorkspaceModel):
    revision: str
    expected_revision: str
    source_action_key: SourceActionKey
    source_message_id: str | None = None


class SelectedRange(WorkspaceModel):
    start: int = Field(ge=0)
    end: int = Field(ge=0)
    text: str
    prefix: str = ""
    suffix: str = ""


class ConversationTarget(WorkspaceModel):
    condition_id: str | None = None
    analysis_id: str | None = None
    analysis_revision: str | None = None
    option_id: str | None = None
    option_revision: str | None = None
    matter_id: str
    business_question_id: str | None = None
    business_question_revision: str | None = None
    issue_id: str | None = None
    source_id: str | None = None
    scenario_id: str | None = None
    artifact_path: str | None = None
    artifact_revision: str | None = None
    artifact_review_revision: str | None = None
    selected_range: SelectedRange | None = None
    local_draft_snapshot: str | None = None


class InteractionReceipt(WorkspaceModel):
    receipt_id: str
    source_action_key: str
    operation: str
    target: ConversationTarget
    state: Literal["applied", "proposed", "not_saved"]
    before_revision: str | None = None
    after_revision: str | None = None
    source_message_id: str | None = None
    run_id: str | None = None
    changed_links: list[str] = Field(default_factory=list)
    completed_parts: list[str] = Field(default_factory=list)
    failure_detail: str | None = None
    created_at: str | None = None


class IssueDispositionRecord(WorkspaceModel):
    disposition_id: str
    disposition: Literal["unresolved", "mitigation_in_progress", "resolved", "risk_accepted", "not_applicable"]
    reason: str
    actor_id: str
    actor_name: str
    recorded_at: str
    source_action_key: str
    issue_revision: str
    action: Literal["recorded", "reopened"] = "recorded"
    linked_work_item_ids: list[str] = Field(default_factory=list)
    linked_decision_ids: list[str] = Field(default_factory=list)
    supersedes_disposition_id: str | None = None


class IssueNode(WorkspaceModel):
    claim_output_revisions: dict[str, str] = Field(default_factory=dict)
    issue_id: str
    parent_issue_id: str | None = None
    title: str
    why_it_matters: str = ""
    fact_ids: list[str] = Field(default_factory=list)
    assumption_ids: list[str] = Field(default_factory=list)
    claim_ids: list[str] = Field(default_factory=list)
    lawyer_state: Literal["open", "explored", "set_aside"] = "open"
    disposition: Literal["unresolved", "mitigation_in_progress", "resolved", "risk_accepted", "not_applicable"] | None = None
    disposition_reason: str = ""
    disposition_history: list[IssueDispositionRecord] = Field(default_factory=list)
    linked_work_item_ids: list[str] = Field(default_factory=list)
    linked_decision_ids: list[str] = Field(default_factory=list)
    priority_reason: str = ""
    next_action: str = ""
    action_owner: str = ""
    updated_at: str | None = None


class IssueUpdate(WorkspaceModel):
    expected_revision: str
    title: str | None = None
    parent_issue_id: str | None = None
    lawyer_state: Literal["open", "explored", "set_aside"] | None = None
    why_it_matters: str | None = None


class IssueFollowUp(WorkspaceModel):
    title: str = Field(min_length=1, max_length=500)
    owner: str = Field(default="", max_length=200)
    due_at: str | None = None
    required: bool = True


class IssueDispositionCommand(WorkspaceModel):
    workflow: bool = False
    chosen_path: str = Field(default="", max_length=2000)
    conditions: list[str] = Field(default_factory=list)
    map_basis: DecisionMapBasis | None = None
    follow_up: list[IssueFollowUp] = Field(default_factory=list, max_length=30)
    revises_decision_id: str | None = None
    disposition: Literal["unresolved", "mitigation_in_progress", "resolved", "risk_accepted", "not_applicable"]
    reason: str = Field(min_length=1, max_length=10000)
    expected_revision: str
    source_action_key: SourceActionKey
    linked_work_item_ids: list[str] = Field(default_factory=list)
    linked_decision_ids: list[str] = Field(default_factory=list)


class IssueDispositionResult(WorkspaceModel):
    issue: IssueNode
    receipt: InteractionReceipt


class WorkspaceQuestion(WorkspaceModel):
    question_id: str
    business_question_id: str
    business_question_revision: str
    issue_id: str | None = None
    issue_ids: list[str] = Field(default_factory=list)
    question_kind: Literal["factual", "legal"] = "factual"
    linked_fact_ids: list[str] = Field(default_factory=list)
    answer_origin: str | None = None
    source_message_id: str | None = None
    source_action_key: str | None = None
    source_revision: str = ""
    text: str
    consequence: str = ""
    state: Literal["open", "answered", "left_open"] = "open"
    answer: str | None = None
    answer_kind: Literal["reported_fact", "legal_analysis"] | None = None
    answer_source_ids: list[str] = Field(default_factory=list)
    answer_claim_ids: list[str] = Field(default_factory=list)
    updated_at: str | None = None


class SupportingQuestionCommand(WorkspaceModel):
    expected_revision: str
    source_action_key: SourceActionKey
    state: Literal["answered", "left_open"]
    answer: str | None = None
    answer_kind: Literal["reported_fact", "legal_analysis"] | None = None
    answer_source_ids: list[str] = Field(default_factory=list)
    answer_claim_ids: list[str] = Field(default_factory=list)
    source_message_id: str | None = None
    run_id: str | None = None


class ClaimEvidence(WorkspaceModel):
    claim_id: str
    source_id: str
    available_excerpt: str | None = None
    locator: str = ""
    support_state: Literal["supplied", "retrieved", "verified", "unverified_lead", "unknown"] = "unknown"
    explanation: str = ""
    retrieved_at: str | None = None
    source_version: str | None = None
    source_hash: str | None = None
    source_label: str = ""
    url: str | None = None
    path: str | None = None
    claim_revision: str | None = None
    output_revision: str | None = None


class ClaimApplicability(WorkspaceModel):
    regulated_actor: str = ""
    jurisdiction: str = ""
    fact_ids: list[str] = Field(default_factory=list)
    assumption_ids: list[str] = Field(default_factory=list)
    explanation: str = ""


class WorkspaceClaim(WorkspaceModel):
    claim_id: str
    text: str
    claim_revision: str = ""
    output_revision: str = ""
    applicability: ClaimApplicability = Field(default_factory=ClaimApplicability)
    evidence: list[ClaimEvidence] = Field(default_factory=list)
    support_gap: str = ""


class DocumentIdentity(WorkspaceModel):
    document_id: str
    path: str
    title: str
    kind: Literal["work_product", "source", "matter_record"]
    revision: str
    version_id: str | None = None
    work_product_id: str | None = None
    lifecycle_state: Literal["editing_draft", "reading_source", "final", "approved", "matter_record"]
    editable: bool
    immutable: bool
    source_url: str | None = None
    original_path: str | None = None
    extracted_path: str | None = None


class ReferenceOrigin(WorkspaceModel):
    workspace_view: Literal["understand", "discuss", "draft"] | None = None
    surface: Literal["issue", "conversation", "decision_map", "draft", "evidence", "document"]
    record_id: str | None = None
    document_id: str | None = None
    focus_id: str | None = None
    scroll_offset: int | None = Field(default=None, ge=0)


class DocumentReferenceTarget(WorkspaceModel):
    document_id: str
    path: str
    revision: str | None = None
    locator: str = ""
    available_excerpt: str | None = None
    exact_passage_available: bool = False
    origin: ReferenceOrigin | None = None


class ResolvedDocumentReference(WorkspaceModel):
    target: DocumentReferenceTarget
    document: DocumentIdentity | None = None
    passage_state: Literal["exact", "document_only", "missing"]
    message: str = ""


class DocumentLocalEdit(WorkspaceModel):
    document_id: str
    path: str
    content: str
    base_revision: str
    review_revision: str | None = None
    dirty: bool = False
    selected_range: SelectedRange | None = None
    recoverable: bool = False
    updated_at: str | None = None


class ContextSelection(WorkspaceModel):
    reference_id: str
    path: str | None = None
    role: str
    selected: bool = True
    mandatory: bool = False
    revision: str | None = None


class ContextManifestEntry(ContextSelection):
    state: Literal["included", "truncated", "omitted", "unavailable"]
    reason: str = ""
    tool_read_evidence: list[str] = Field(default_factory=list)


class RunContextManifest(WorkspaceModel):
    run_id: str
    matter_id: str
    entries: list[ContextManifestEntry] = Field(default_factory=list)
    source_revisions: dict[str, str] = Field(default_factory=dict)
    created_at: str


class OutputTemplate(WorkspaceModel):
    template_id: str
    skill_id: str
    kind: Literal["output_template"] = "output_template"
    name: str
    output_type: str
    instructions: str = ""
    section_outline: str = ""
    audience: str = ""
    purpose: str = ""
    tone: str = ""
    length: str = ""
    exclusions: str = ""
    source_presentation: str = ""
    sample_wording: str = ""
    revision: str
    content_hash: str
    path: str
    revision_path: str | None = None
    is_default: bool = False
    enabled: bool = True


class TemplateUse(WorkspaceModel):
    template_id: str
    output_type: str
    revision: str
    content_hash: str
    revision_path: str | None = None
    instructions_snapshot: str
    section_outline_snapshot: str = ""
    defaults_snapshot: dict[str, str] = Field(default_factory=dict)
    overrides: dict[str, str] = Field(default_factory=dict)
    state: Literal["applied", "unavailable", "failed"] = "applied"
    failure_detail: str | None = None


class VersionChange(WorkspaceModel):
    reason: str
    before_revision: str | None = None
    after_revision: str | None = None
    trigger_fact_ids: list[str] = Field(default_factory=list)
    trigger_source_ids: list[str] = Field(default_factory=list)
    instruction: str = ""
    affected_analysis: list[str] = Field(default_factory=list)


class UpdateOffer(WorkspaceModel):
    offer_id: str
    artifact_path: str
    base_revision: str
    reason: str
    state: Literal["offered", "accepted", "declined", "stale"] = "offered"
    change: VersionChange | None = None


class WorkProductReference(WorkspaceModel):
    work_product_id: str
    path: str
    title: str
    output_type: str = "general"
    revision: str
    pending_review: bool = False
    review_id: str | None = None
    review_revision: str | None = None
    source_run_id: str | None = None
    claim_ids: list[str] = Field(default_factory=list)
    export_state: str = "not_exported"
    update_offer: UpdateOffer | None = None
    version_changes: list[VersionChange] = Field(default_factory=list)
    template_use: TemplateUse | None = None


class DraftRequest(WorkspaceModel):
    instruction: str = Field(min_length=1)
    target: ConversationTarget
    source_action_key: SourceActionKey
    business_question_revision: str
    output_type: str = "general"
    template_use: TemplateUse | None = None
    audience: str = ""
    purpose: str = ""
    output_preferences: dict[str, str] = Field(default_factory=dict)
    base_revision: str | None = None
    preview: bool = False


class DraftResult(WorkspaceModel):
    run_id: str
    state: str
    artifact: WorkProductReference | None = None
    proposal_path: str | None = None
    receipt: InteractionReceipt | None = None


class OutgoingAttachment(WorkspaceModel):
    path: str
    title: str
    revision: str
    relevance: str
    selected: bool = False
    reviewed_revision: str | None = None
    export_state: Literal["not_exported", "exported", "failed"] = "not_exported"
    failure_detail: str | None = None


class OutsideCounselPacket(WorkspaceModel):
    cover_email: WorkProductReference | None = None
    brief: WorkProductReference
    attachments: list[OutgoingAttachment] = Field(default_factory=list)


class ScenarioFactChange(WorkspaceModel):
    change_id: str
    fact_id: str | None = None
    text: str


class ScenarioOutcome(WorkspaceModel):
    outcome_id: str
    label: str
    condition: str = ""
    issue_ids: list[str] = Field(default_factory=list)
    claim_ids: list[str] = Field(default_factory=list)
    work_item_ids: list[str] = Field(default_factory=list)


class ScenarioStaleness(WorkspaceModel):
    is_stale: bool = False
    changed_revisions: dict[str, dict[str, str | None]] = Field(default_factory=dict)


class Scenario(WorkspaceModel):
    parent_path_id: str | None = None
    parent_revision: str | None = None
    path_kind: Literal["baseline", "alternative"] = "alternative"
    archived_at: str | None = None
    hypothesis_summary: str = ""
    actual_basis_refs: list[str] = Field(default_factory=list)
    current_analysis_ref: str | None = None
    recommendation_refs: list[str] = Field(default_factory=list)
    work_item_refs: list[str] = Field(default_factory=list)
    memory_ref: str | None = None
    scenario_id: str
    matter_id: str
    title: str
    baseline_revisions: dict[str, str]
    issue_ids: list[str] = Field(default_factory=list)
    proposed_fact_changes: list[ScenarioFactChange] = Field(default_factory=list)
    unresolved_conditions: list[str] = Field(default_factory=list)
    analysis: str = ""
    source_links: list[str] = Field(default_factory=list)
    created_at: str
    adopted_fact_ids: list[str] = Field(default_factory=list)
    related_analysis: list[str] = Field(default_factory=list)
    analysis_state: Literal["not_started", "queued", "running", "completed", "failed"] = "not_started"
    analysis_run_id: str | None = None
    analysis_source_action_key: str | None = None
    analysis_baseline_revisions: dict[str, str] = Field(default_factory=dict)
    affected_issue_ids: list[str] = Field(default_factory=list)
    affected_branch_ids: list[str] = Field(default_factory=list)
    claim_ids: list[str] = Field(default_factory=list)
    proposed_outcomes: list[ScenarioOutcome] = Field(default_factory=list)
    failure_detail: str | None = None
    stale: ScenarioStaleness = Field(default_factory=ScenarioStaleness)
    updated_at: str | None = None
    revision: str = ""


class ScenarioCreateCommand(WorkspaceModel):
    title: str = Field(min_length=1, max_length=200)
    baseline_revisions: dict[str, str]
    issue_ids: list[str] = Field(default_factory=list)
    proposed_fact_changes: list[ScenarioFactChange] = Field(default_factory=list)
    source_action_key: SourceActionKey


class ScenarioAnalyzeCommand(WorkspaceModel):
    instruction: str = Field(min_length=1, max_length=10000)
    expected_scenario_revision: str
    baseline_revisions: dict[str, str]
    source_action_key: SourceActionKey


class ScenarioAdoptCommand(WorkspaceModel):
    change_ids: list[str] = Field(min_length=1)
    expected_revisions: dict[str, str]
    source_action_key: SourceActionKey
    source_message_id: str | None = None


class LegalTest(WorkspaceModel):
    test_id: str
    title: str
    summary: str = ""
    kind: Literal["law", "regulation", "contract", "policy", "legal_test"] = "legal_test"
    actor: str = ""
    jurisdiction: str = ""
    effective_at: str = ""
    exceptions: str = ""
    applicability: str = ""
    claim_ids: list[str] = Field(default_factory=list)
    condition_ids: list[str] = Field(default_factory=list)


class AnswerChoice(WorkspaceModel):
    label: str = Field(min_length=1, max_length=200)
    answer: str = Field(min_length=1, max_length=4000)


class PathCondition(WorkspaceModel):
    condition_id: str
    question: str
    assessment: Literal["met", "not_met", "unknown", "conflicting"] = "unknown"
    assessment_basis: str = ""
    answer_choices: list[AnswerChoice] = Field(default_factory=list, max_length=6)
    fact_ids: list[str] = Field(default_factory=list)
    question_ids: list[str] = Field(default_factory=list)
    claim_ids: list[str] = Field(default_factory=list)


class PathRequirement(WorkspaceModel):
    condition_id: str
    state: Literal["met", "not_met"]


class PathEffect(WorkspaceModel):
    target_option_id: str
    trigger: Literal["agreement", "implementation_complete", "condition"]
    condition_id: str | None = None
    condition_state: Literal["met", "not_met"] = "met"
    reason: str


class IssueOption(WorkspaceModel):
    option_id: str
    option_revision: str = ""
    title: str
    kind: Literal["conditional_path", "business_alternative", "clarify"] = "conditional_path"
    condition_summary: str = ""
    requirements: list[PathRequirement] = Field(default_factory=list)
    combination: Literal["all", "any"] | None = None
    consequence: str = ""
    trade_off: str = ""
    remaining_work: list[str] = Field(default_factory=list)
    recommendation: Literal["candidate", "recommended"] = "candidate"
    recommendation_reason: str = ""
    effects: list[PathEffect] = Field(default_factory=list)
    risk_assessment: Literal["not_assessed", "risk_to_review", "not_recommended"] = "not_assessed"
    claim_ids: list[str] = Field(default_factory=list)
    work_item_ids: list[str] = Field(default_factory=list)


class IssueConnection(WorkspaceModel):
    target_issue_id: str
    relationship: Literal["depends_on", "compounds", "may_resolve", "shared_condition"]
    reason: str


class IssueAnalysis(WorkspaceModel):
    connections: list[IssueConnection] | None = None
    schema_version: Literal[1] = 1
    issue_id: str
    analysis_id: str
    analysis_revision: str
    source_path: str
    output_revision: str
    source_revisions: dict[str, str] = Field(default_factory=dict)
    input_basis: dict[str, str] = Field(default_factory=dict)
    run_id: str
    display_title: str = ""
    explanation: str = ""
    business_effect: str = ""
    tests: list[LegalTest] = Field(default_factory=list)
    conditions: list[PathCondition] = Field(default_factory=list)
    options: list[IssueOption] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


class IssueAnalysisStatus(WorkspaceModel):
    issue_id: str
    state: Literal["not_mapped", "partial", "saved", "needs_review", "missing", "historical"] = "not_mapped"
    analysis: IssueAnalysis | None = None
    claims: list[WorkspaceClaim] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    reference: dict[str, Any] | None = None


class DecisionMapBasis(WorkspaceModel):
    issue_id: str
    analysis_id: str
    analysis_revision: str
    analysis_path: str
    output_revision: str
    selected_option_id: str
    selected_option_revision: str
    use_historical_basis: bool = False
    canonical_option: IssueOption | None = None
    input_basis: dict[str, str] = Field(default_factory=dict)


class DecisionMapNode(WorkspaceModel):
    analysis_id: str | None = None
    analysis_revision: str | None = None
    output_revision: str | None = None
    analysis_path: str | None = None
    group: str = "current"
    data: dict[str, Any] = Field(default_factory=dict)
    node_id: str
    record_type: Literal["business_question", "issue", "fact", "question", "option", "scenario", "work", "decision", "legal_test", "condition"]
    record_id: str
    label: str
    state: str
    detail: str = ""
    source_revision: str | None = None
    issue_ids: list[str] = Field(default_factory=list)
    claim_ids: list[str] = Field(default_factory=list)
    hypothetical: bool = False
    missing_reference: bool = False


class DecisionMapEdge(WorkspaceModel):
    edge_id: str
    from_node_id: str
    to_node_id: str
    relationship: Literal["depends_on", "if", "supports", "mitigated_by", "decided_by", "assessed_under", "requires"]
    label: str
    state: Literal["active", "inactive", "unknown", "hypothetical", "historical", "missing"] = "active"


class DecisionMapSnapshot(WorkspaceModel):
    issue_analyses: dict[str, IssueAnalysisStatus] = Field(default_factory=dict)
    matter_id: str
    revision: str
    source_revisions: dict[str, str] = Field(default_factory=dict)
    nodes: list[DecisionMapNode] = Field(default_factory=list)
    edges: list[DecisionMapEdge] = Field(default_factory=list)
    selected_issue_id: str | None = None
    missing_references: list[str] = Field(default_factory=list)


class FlowActor(WorkspaceModel):
    actor_id: str
    label: str


class FlowEdge(WorkspaceModel):
    edge_id: str
    from_actor_id: str
    to_actor_id: str
    label: str
    order: int
    timing: str = ""
    custody: str = ""
    ownership: str = ""
    fact_ids: list[str] = Field(default_factory=list)
    uncertainty: str = ""


class Flow(WorkspaceModel):
    matter_id: str
    revision: str
    actors: list[FlowActor] = Field(default_factory=list)
    edges: list[FlowEdge] = Field(default_factory=list)


class OutputReadFailure(WorkspaceModel):
    path: str
    state: Literal["unavailable"] = "unavailable"
    message: str


class ChangeRecap(WorkspaceModel):
    previous_seen_revision: str | None = None
    current_revision: str
    changes: list[dict[str, Any]] = Field(default_factory=list)
    new_outputs: list[str] = Field(default_factory=list)
    output_read_failures: list[OutputReadFailure] = Field(default_factory=list)


class PracticeNoteLink(WorkspaceModel):
    skill_id: str
    matter_id: str
    applied_revision: str | None = None


class AssumptionWatchLink(WorkspaceModel):
    watch_id: str
    matter_id: str
    assumption_ids: list[str] = Field(default_factory=list)
    decision_ids: list[str] = Field(default_factory=list)


class IssueReviewItem(WorkspaceModel):
    issue_id: str
    reason: str
    actor: str
    action_label: str
    state: Literal["needs_attention", "agent_work", "complete", "failed", "overdue"]
    saved_order: int = Field(ge=0)
    due_at: str | None = None


from app.models.problem_analysis import ProblemAnalysisStatus


class WorkspaceSnapshot(WorkspaceModel):
    problem_analysis: ProblemAnalysisStatus | None = None
    issue_analyses: dict[str, IssueAnalysisStatus] = Field(default_factory=dict)
    matter_id: str
    revision: str
    source_revisions: dict[str, str] = Field(default_factory=dict)
    question: BusinessQuestion
    short_answer: str = ""
    qualification: str = ""
    issues: list[IssueNode] = Field(default_factory=list)
    review_items: list[IssueReviewItem] = Field(default_factory=list)
    claims: list[WorkspaceClaim] = Field(default_factory=list)
    answer_claims: list[WorkspaceClaim] = Field(default_factory=list)
    documents: list[DocumentIdentity] = Field(default_factory=list)
    supporting_question: WorkspaceQuestion | None = None
    questions: list[WorkspaceQuestion] = Field(default_factory=list)
    pending_reframes: list[QuestionChange] = Field(default_factory=list)
    question_changes: list[QuestionChange] = Field(default_factory=list)
    issues_revision: str = ""
    receipts: list[InteractionReceipt] = Field(default_factory=list)
    answer_links: list[str] = Field(default_factory=list)
    work_products: list[WorkProductReference] = Field(default_factory=list)
    context_selection: list[ContextSelection] = Field(default_factory=list)
    run_id: str | None = None
    generated_at: str | None = None
    recap: ChangeRecap | None = None
    stale: bool = False
