from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


Stage = Literal["intake", "research", "explore", "generate", "respond", "closed"]


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
    schedule_text: str | None = None


class SettingsUpdate(BaseModel):
    values: dict[str, Any] = Field(default_factory=dict)


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant", "tool"]
    content: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    matter_id: str | None = None
    active_file: str | None = None
    agent_id: str = "counsel-copilot"
    history: list[ChatMessage] = Field(default_factory=list)


class ToolTrace(BaseModel):
    tool: str
    status: Literal["success", "error"]
    summary: str


class ChatResponse(BaseModel):
    reply: str
    trace: list[ToolTrace] = Field(default_factory=list)
    changed_paths: list[str] = Field(default_factory=list)
    refresh: list[str] = Field(default_factory=list)
