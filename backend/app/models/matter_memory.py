"""Strict path commands and bounded, fallible continuation notes."""
from __future__ import annotations
import json
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, model_validator


class StrictModel(BaseModel):
    model_config = ConfigDict(extra='forbid')


class PathTransition(StrictModel):
    path_id: str = Field(pattern=r'^[A-Za-z0-9_-]+$')
    expected_mainline_revision: str
    expected_path_revision: str
    conditions: list[str] = Field(default_factory=list, max_length=30)
    reason: str = Field(default='', max_length=2000)
    select_for_this_conversation: bool = True


class MemoryReference(StrictModel):
    kind: Literal['fact','question','source','output','scenario','message','objective','recommendation','work_item','decision']
    record_id: str = Field(min_length=1, max_length=256, pattern=r'^[^/\\\x00]+$')
    revision: str = Field(default='', max_length=128)
    source_version: str | None = Field(default=None, max_length=128)
    unit_id: str | None = Field(default=None, pattern=r'^[ps][0-9]{6}$')
    conversation_id: str | None = None


class Finding(StrictModel):
    text: str = Field(min_length=1)
    status: Literal['supported','qualified','contradicted','unresolved']
    references: list[MemoryReference] = Field(default_factory=list)
    depends_on: list[MemoryReference] = Field(default_factory=list)


class OpenItem(StrictModel):
    text: str = Field(min_length=1)
    references: list[MemoryReference] = Field(default_factory=list)


class WorkingPayload(StrictModel):
    current_task: str = Field(min_length=1)
    objective_ref: MemoryReference | None = None
    findings: list[Finding] = Field(default_factory=list)
    open_items: list[OpenItem] = Field(default_factory=list)
    next_action: str = Field(min_length=1)
    pending_effects: list[OpenItem] = Field(default_factory=list)

    @model_validator(mode='after')
    def aggregate_limit(self):
        if not self.current_task.strip() or not self.next_action.strip():
            raise ValueError('A non-empty task and next action are required.')
        if len(json.dumps(self.model_dump(mode='json'), ensure_ascii=False, separators=(',',':'))) > 4000:
            raise ValueError('Working memory exceeds 4000 characters; submit a shorter complete note.')
        return self


class PathRead(StrictModel):
    path_id: str | None = Field(default=None,pattern=r'^[A-Za-z0-9_-]+$')
    offset: int = Field(default=0,ge=0)
    limit: int = Field(default=20,ge=1,le=50)


class PathExplore(StrictModel):
    parent_path_id: str = Field(pattern=r'^[A-Za-z0-9_-]+$')
    parent_revision: str
    title: str = Field(default='Alternative approach',max_length=200)
    proposed_fact_changes: list[dict[str,str]] = Field(default_factory=list)
    unresolved_conditions: list[str] = Field(default_factory=list)
    hypothesis_summary: str = Field(default='',max_length=2000)


class PathUpdate(StrictModel):
    path_id: str = Field(pattern=r'^[A-Za-z0-9_-]+$')
    expected_path_revision: str
    title: str | None = Field(default=None,max_length=200)
    unresolved_conditions: list[str] | None = None
    hypothesis_summary: str | None = Field(default=None,max_length=2000)
    proposed_fact_changes: list[dict[str,str]] | None = None


class PathCompare(StrictModel):
    path_ids: list[str] = Field(min_length=2,max_length=5)


class MemorySave(StrictModel):
    expected_sequence: int = Field(ge=0)
    expected_revision: str | None = None
    payload: WorkingPayload


class ArchiveRead(StrictModel):
    conversation_id: str
    query: str = Field(default='',max_length=2000)
    message_id: str | None = None
    start: int = Field(default=0,ge=0)
    max_chars: int = Field(default=6000,ge=1,le=6000)
