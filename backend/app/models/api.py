from __future__ import annotations

from typing import Annotated, Any, Literal

from pydantic import BaseModel, Field, model_validator

from app.models.awareness import ScheduleRecurrence, WatchDraftCard, WatchScanCard


Stage = Literal["intake", "research", "explore", "generate", "respond", "closed"]
MatterAction = Literal["approve_response", "mark_as_sent", "close_matter"]
SourceActionKey = Annotated[
    str,
    Field(min_length=1, max_length=256, pattern=r"^[A-Za-z0-9][A-Za-z0-9._:/-]*$"),
]


class MatterCreate(BaseModel):
    title: str = Field(min_length=2, max_length=160)
    request_text: str = Field(min_length=2)
    description: str = ""
    matter_type: str = "general_advice"
    product_area: str = ""
    business_team: str = ""
    requester: str = ""
    legal_owner: str = ""
    business_owner: str = ""
    priority: str = "normal"
    risk_level: str = "unknown"
    target_date: str | None = None
    jurisdiction_scope: list[str] = Field(default_factory=list)
    privilege: str = "privileged_and_confidential"


class StageUpdate(BaseModel):
    stage: Stage
    reason: str = ""


class MatterRiskUpdate(BaseModel):
    risk_level: str | None = Field(default=None, max_length=80)
    actor: str = Field(min_length=1)


class MatterActionRequest(BaseModel):
    action: MatterAction
    actor: str = Field(min_length=1)
    artifact_path: str | None = None
    work_item_id: str | None = None
    note: str | None = None


class WorkItemCompleteRequest(BaseModel):
    work_item_id: str = Field(min_length=1)
    actor: str = Field(min_length=1)


class WorkItemAssignRequest(BaseModel):
    work_item_id: str = Field(min_length=1)
    owner: str = Field(min_length=1)
    actor: str = Field(min_length=1)


class MatterActionResult(BaseModel):
    action: MatterAction | Literal["complete_work_item", "assign_work_item"]
    matter: dict[str, Any]
    changed_paths: list[str] = Field(default_factory=list)
    event_path: str | None = None
    work_item_id: str | None = None
    already_recorded: bool = False


class FileUpdate(BaseModel):
    content: str
    metadata: dict[str, Any] = Field(default_factory=dict)


class DocumentReviewAction(BaseModel):
    action: Literal[
        "set_tracking",
        "save_revision",
        "save_untracked",
        "set_author_color",
        "add_comment",
        "reply_comment",
        "edit_comment",
        "delete_comment_entry",
        "resolve_comment",
        "reopen_comment",
        "delete_comment_thread",
        "delete_resolved_comments",
        "accept_change",
        "reject_change",
    ]
    content: str | None = None
    author_id: str | None = None
    author_name: str | None = None
    author_color: str | None = None
    thread_id: str | None = None
    body: str | None = None
    color: str | None = None
    enabled: bool | None = None
    change_id: str | None = None
    comment_id: str | None = None
    quote: str | None = None
    anchor_start: int | None = None
    anchor_end: int | None = None


class WorkItemCreate(BaseModel):
    matter_id: str
    title: str
    description: str = ""
    item_type: str = "question"
    status: str = "open"
    priority: str = "normal"
    owner: str = ""
    due_at: str | None = None
    required: bool = False
    issue_id: str | None = None
    source_action_key: SourceActionKey | None = None


class DecisionCreate(BaseModel):
    matter_id: str
    title: str
    chosen_path: str
    rationale: str = ""
    decision_maker: str = ""
    decision_type: str = "legal_decision"
    conditions: list[str] = Field(default_factory=list)
    not_decided: list[str] = Field(default_factory=list)
    linked_paths: list[str] = Field(default_factory=list)
    next_review_at: str | None = None
    risk_level: str = "unknown"
    privilege: str = "privileged_and_confidential"
    source_action_key: SourceActionKey | None = None


class ScheduleCreate(BaseModel):
    title: str
    agent_id: str
    instructions: str
    kind: Literal["agent_prompt", "inbox_watch", "decision_audit", "watch_scan", "briefing_digest"] = "agent_prompt"
    interval_seconds: int = Field(default=3600, ge=10)
    watch_path: str | None = None
    matter_id: str | None = None
    target_watch_id: str | None = None
    target_view_id: str | None = None
    recurrence: ScheduleRecurrence | None = None
    enabled: bool = True


class ScheduleUpdate(BaseModel):
    enabled: bool | None = None
    target_watch_id: str | None = None
    target_view_id: str | None = None
    recurrence: ScheduleRecurrence | None = None
    expected_revision: int | None = Field(default=None, ge=1)


class AgentCreate(BaseModel):
    agent_id: str
    name: str
    description: str
    instructions: str
    allowed_tools: list[str] = Field(default_factory=list)
    max_steps: int = Field(default=6, ge=1, le=25)
    provider: str | None = None
    model: str | None = None
    reasoning_effort: str | None = None


class AgentUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    instructions: str | None = None
    allowed_tools: list[str] | None = None
    max_steps: int | None = Field(default=None, ge=1, le=25)
    audience_id: str | None = None
    audience_prompt: str | None = None
    provider: str | None = None
    model: str | None = None
    reasoning_effort: str | None = None


class ProviderModelOption(BaseModel):
    id: str
    label: str
    reasoning_efforts: list[str] = Field(default_factory=list)


class ProviderCatalogOption(BaseModel):
    id: str
    label: str
    readiness: Literal["ready", "missing", "unavailable", "development_only"]
    readiness_detail: str
    models: list[ProviderModelOption] = Field(default_factory=list)


class AgentRunSelection(BaseModel):
    agent_id: str
    provider: str
    model: str
    reasoning_effort: str = ""


class SettingsUpdate(BaseModel):
    values: dict[str, Any] = Field(default_factory=dict)


class VaultPathRequest(BaseModel):
    path: str


class VaultInfo(BaseModel):
    name: str
    path: str


class AnnotationCreate(BaseModel):
    source_path: str
    question: str = Field(min_length=1)
    quote: str = ""
    citation: str = ""
    who: str = "Brian Harris"


class SkillCreate(BaseModel):
    skill_id: str = Field(min_length=1, max_length=64)
    name: str = Field(min_length=1, max_length=160)
    description: str = Field(min_length=1)
    instructions: str = Field(min_length=1)


class SkillUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=160)
    description: str | None = Field(default=None, min_length=1)
    instructions: str | None = Field(default=None, min_length=1)


class SkillQuestion(BaseModel):
    question_id: str
    text: str
    choices: list[str] = Field(default_factory=list)
    selection_mode: Literal["single", "multiple", "free_text"] = "single"
    allow_skip: bool = True
    allow_build_now: bool = True
    selected: str | list[str] | None = None


class SkillDraft(BaseModel):
    skill_id: str = Field(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    name: str = Field(min_length=1, max_length=160)
    description: str = Field(min_length=1)
    instructions: str = Field(min_length=1)


class SkillDraftRequest(BaseModel):
    goal: str = Field(min_length=1)
    answers: dict[str, str | list[str]] = Field(default_factory=dict)


class SkillDraftResponse(BaseModel):
    draft: SkillDraft
    warning: str | None = None


class SkillEvidence(BaseModel):
    message_id: str
    content: str
    created_at: str
    scope: str


class SkillSuggestion(BaseModel):
    name: str
    description: str
    goal: str
    evidence: list[SkillEvidence]


class SkillSuggestionsResponse(BaseModel):
    suggestions: list[SkillSuggestion] = Field(default_factory=list, max_length=3)
    warning: str | None = None


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant", "tool"]
    content: str


class ChatChoice(BaseModel):
    value: str
    label: str
    suggested: bool = False


class QuestionCard(BaseModel):
    type: Literal["question"] = "question"
    question_id: str
    text: str
    reason: str | None = None
    selection_mode: Literal["single", "multiple", "free_text"] = "single"
    choices: list[ChatChoice] = Field(default_factory=list, max_length=7)
    progress_current: int | None = Field(default=None, ge=1)
    progress_total: int | None = Field(default=None, ge=1)
    allow_skip: bool = True
    allow_stop: bool = True
    conflict: bool = False

    @model_validator(mode="after")
    def make_empty_choice_question_write_in(self) -> "QuestionCard":
        if self.selection_mode != "free_text" and not self.choices:
            self.selection_mode = "free_text"
        return self


class MatterUpdateCard(BaseModel):
    type: Literal["matter_update"] = "matter_update"
    action_id: str
    summary: str
    changed_sections: list[str] = Field(default_factory=list)
    can_edit: bool = True
    can_undo: bool = True


class ResearchStatusCard(BaseModel):
    type: Literal["research_status"] = "research_status"
    run_id: str
    state: Literal["queued", "running", "completed", "failed", "interrupted"]
    total: int = Field(ge=0)
    completed: int = Field(ge=0)
    status: str
    dossier_effect: str = ""


class WorkProductCard(BaseModel):
    type: Literal["work_product"] = "work_product"
    title: str
    vault_path: str
    state: Literal["draft", "final"]
    summary: str = ""


ChatCard = Annotated[
    QuestionCard | MatterUpdateCard | ResearchStatusCard | WorkProductCard | WatchDraftCard | WatchScanCard,
    Field(discriminator="type"),
]


class AttachmentReference(BaseModel):
    source_id: str
    path: str
    name: str
    version: str = ""


class CardAnswer(BaseModel):
    card_id: str = Field(min_length=1)
    action: Literal["answer", "skip"]
    values: list[str] = Field(default_factory=list)


class CardAction(BaseModel):
    card_id: str
    action: Literal[
        "answer", "answer_set", "skip", "stop", "edit", "undo", "apply", "preview",
        "save_draft", "scan_now", "change_something", "start_watch",
        "open_watch", "open_scan", "scan_again",
    ]
    values: list[str] = Field(default_factory=list)
    answers: list[CardAnswer] = Field(default_factory=list, max_length=5)


class ChatRequest(BaseModel):
    message: str = ""
    matter_id: str | None = None
    active_file: str | None = None
    agent_id: str = "counsel-copilot"
    conversation_id: str | None = None
    workspace_day: str | None = Field(default=None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    history: list[ChatMessage] = Field(default_factory=list)
    card_action: CardAction | None = None
    attachments: list[AttachmentReference] = Field(default_factory=list)
    skill_id: str | None = Field(default=None, exclude=True)
    review_author: str | None = None
    lawyer_author: str | None = None
    source_action_key: SourceActionKey | None = None
    trusted_source_id: str | None = Field(default=None, exclude=True)
    expected_dossier_hash: str | None = Field(default=None, exclude=True)


class ToolTrace(BaseModel):
    tool: str
    status: Literal["success", "error"]
    summary: str
    mutation_status: Literal["changed", "no_change", "failed"] | None = None


class AppliedSkillSummary(BaseModel):
    skill_id: str
    name: str


class ChatResponse(BaseModel):
    reply: str
    conversation_id: str | None = None
    trace: list[ToolTrace] = Field(default_factory=list)
    changed_paths: list[str] = Field(default_factory=list)
    refresh: list[str] = Field(default_factory=list)
    cards: list[ChatCard] = Field(default_factory=list)
    applied_skills: list[AppliedSkillSummary] = Field(default_factory=list)
    review_author: str | None = None


ChatRunState = Literal["queued", "running", "completed", "failed", "interrupted"]


class ChatRun(BaseModel):
    run_id: str
    matter_id: str
    conversation_id: str | None = None
    state: ChatRunState
    status: str
    created_at: str
    started_at: str | None = None
    finished_at: str | None = None
    failure_detail: str | None = None
    response: ChatResponse | None = None
    path: str
    selection: AgentRunSelection | None = None


class IntakeReportedFact(BaseModel):
    statement: str = Field(min_length=1)
    status: Literal["reported", "assumption", "missing", "conflict"] = "reported"
    materiality: str = "material"


class IntakeTurn(BaseModel):
    working_ask: str = Field(min_length=1)
    reported_facts: list[IntakeReportedFact] = Field(default_factory=list)
    issues: list[str] = Field(default_factory=list)
    assumptions: list[str] = Field(default_factory=list)
    material_missing_facts: list[str] = Field(default_factory=list)
    human_questions: list[str] = Field(default_factory=list)
    public_research_questions: list[str] = Field(default_factory=list, max_length=3)
    next_questions: list[QuestionCard] = Field(default_factory=list, max_length=5)
    next_question: QuestionCard | None = None
    intake_state: Literal["active", "complete"] = "active"
    dossier_orientation: str | None = None
    source_action_key: SourceActionKey | None = None

    @model_validator(mode="after")
    def preserve_legacy_single_question(self) -> "IntakeTurn":
        if not self.next_questions and self.next_question is not None:
            self.next_questions = [self.next_question]
        return self


class IntakeTurnResult(BaseModel):
    changed_paths: list[str] = Field(default_factory=list)
    record_ids: list[str] = Field(default_factory=list)
    questions: list[QuestionCard] = Field(default_factory=list)
    question: QuestionCard | None = None
    matter_update: MatterUpdateCard | None = None
    intake_state: Literal["active", "complete"] = "active"


class BatchActionRequest(BaseModel):
    batch_id: str
    action: Literal["preview", "apply", "undo"]


class WorkProductFinalizeRequest(BaseModel):
    draft_path: str


class ResearchRunStart(BaseModel):
    questions: list[str] = Field(default_factory=list)
    question: str = ""
    source_action_key: SourceActionKey | None = None


class CompanyProfile(BaseModel):
    source_id: str = "SRC-COMPANY"
    version: str = ""
    company_name: str = ""
    website_url: str = ""
    summary: str = ""
    business_model: str = ""
    products_services: str = ""
    jurisdictions: str = ""
    regulatory_context: str = ""
    data_practices: str = ""
    risk_posture: str = ""


CompanyProfileInputField = Literal[
    "company_name",
    "website_url",
    "summary",
    "business_model",
    "products_services",
    "jurisdictions",
    "regulatory_context",
    "data_practices",
    "risk_posture",
]


class CompanyInterviewQuestion(BaseModel):
    question_id: str
    text: str
    reason: str


class CompanyInterviewTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class CompanyInterviewDraftRequest(BaseModel):
    message: str = ""
    website_url: str | None = None
    history: list[CompanyInterviewTurn] = Field(default_factory=list)
    current_profile: CompanyProfile
    question_id: str = "overview"
    finish: bool = False


class CompanyInterviewGuide(BaseModel):
    opening: str
    question: CompanyInterviewQuestion


class CompanyInterviewDraftResponse(BaseModel):
    draft: CompanyProfile
    reply: str
    question: CompanyInterviewQuestion | None = None
    complete: bool = False
    website_used: bool = False
    warning: str | None = None
