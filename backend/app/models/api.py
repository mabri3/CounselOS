from __future__ import annotations

from typing import Annotated, Any, Literal

from pydantic import BaseModel, Field


Stage = Literal["intake", "research", "explore", "generate", "respond", "closed"]
MatterAction = Literal["approve_response", "mark_as_sent", "close_matter"]


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


class MatterActionRequest(BaseModel):
    action: MatterAction


class FileUpdate(BaseModel):
    content: str
    metadata: dict[str, Any] = Field(default_factory=dict)


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


class DecisionCreate(BaseModel):
    matter_id: str
    title: str
    chosen_path: str
    rationale: str = ""
    decision_maker: str = ""
    decision_type: str = "legal_decision"
    conditions: list[str] = Field(default_factory=list)
    linked_paths: list[str] = Field(default_factory=list)
    next_review_at: str | None = None
    risk_level: str = "unknown"
    privilege: str = "privileged_and_confidential"


class ScheduleCreate(BaseModel):
    title: str
    agent_id: str
    instructions: str
    kind: Literal["agent_prompt", "inbox_watch", "decision_audit"] = "agent_prompt"
    interval_seconds: int = Field(default=3600, ge=10)
    watch_path: str | None = None
    matter_id: str | None = None
    enabled: bool = True


class AgentCreate(BaseModel):
    agent_id: str
    name: str
    description: str
    instructions: str
    allowed_tools: list[str] = Field(default_factory=list)
    max_steps: int = Field(default=6, ge=1, le=20)


class AgentUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    instructions: str | None = None
    allowed_tools: list[str] | None = None
    max_steps: int | None = Field(default=None, ge=1, le=20)
    audience_id: str | None = None
    audience_prompt: str | None = None


class SettingsUpdate(BaseModel):
    values: dict[str, Any] = Field(default_factory=dict)


class AnnotationCreate(BaseModel):
    source_path: str
    question: str = Field(min_length=1)
    quote: str = ""
    citation: str = ""
    who: str = "Brian Harris"


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
    QuestionCard | MatterUpdateCard | ResearchStatusCard | WorkProductCard,
    Field(discriminator="type"),
]


class AttachmentReference(BaseModel):
    source_id: str
    path: str
    name: str
    version: str = ""


class CardAction(BaseModel):
    card_id: str
    action: Literal["answer", "skip", "stop", "edit", "undo", "apply", "preview"]
    values: list[str] = Field(default_factory=list)


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


class ToolTrace(BaseModel):
    tool: str
    status: Literal["success", "error"]
    summary: str


class ChatResponse(BaseModel):
    reply: str
    conversation_id: str | None = None
    trace: list[ToolTrace] = Field(default_factory=list)
    changed_paths: list[str] = Field(default_factory=list)
    refresh: list[str] = Field(default_factory=list)
    cards: list[ChatCard] = Field(default_factory=list)


class BatchActionRequest(BaseModel):
    batch_id: str
    action: Literal["preview", "apply", "undo"]


class WorkProductFinalizeRequest(BaseModel):
    draft_path: str


class ResearchRunStart(BaseModel):
    questions: list[str] = Field(default_factory=list)
    question: str = ""


class CompanyProfile(BaseModel):
    source_id: str = "SRC-COMPANY"
    version: str = ""
    summary: str = ""
    business_model: str = ""
    products_services: str = ""
    jurisdictions: str = ""
    regulatory_context: str = ""
    data_practices: str = ""
    risk_posture: str = ""
