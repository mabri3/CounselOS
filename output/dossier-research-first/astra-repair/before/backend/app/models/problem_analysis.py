"""Optional generated analysis. These records never establish facts or decisions."""
from typing import Annotated, Any, Literal
from pydantic import BaseModel, ConfigDict, Field, StringConstraints

Text = Annotated[str, StringConstraints(strict=True, max_length=4000)]
RequiredText = Annotated[str, StringConstraints(strict=True, strip_whitespace=True, min_length=1, max_length=4000)]


class ProblemModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ProblemReference(ProblemModel):
    kind: Literal["fact", "source", "question", "issue", "decision"]
    record_id: RequiredText


References = Annotated[list[ProblemReference], Field(max_length=20)]


class ProblemPart(ProblemModel):
    key: RequiredText
    label: RequiredText
    description: RequiredText
    category: Literal["activity", "actor", "relationship", "flow", "timing", "constraint"]
    status: Literal["reported", "assumed", "disputed", "unknown"]
    references: References = Field(default_factory=list)


class ProblemQuestion(ProblemModel):
    key: RequiredText
    question: RequiredText
    why_it_matters: RequiredText
    kind: Literal["business", "fact", "applicability", "characterization", "requirement", "exception", "consequence"]
    part_keys: list[RequiredText] = Field(default_factory=list)
    issue_id: RequiredText | None = None
    parent_key: RequiredText | None = None
    depends_on: list[RequiredText] = Field(default_factory=list)
    characterizations: list[RequiredText] = Field(default_factory=list)
    assessment: Text = ""
    counterpoint: Text = ""
    answer_changing_fact: Text = ""
    state: Literal["open", "conditional", "answered", "not_relevant"]
    priority: Literal["decision_changing", "supporting", "deferred"]
    references: References = Field(default_factory=list)
    next_action: Literal["ask_business", "research", "inspect_source", "none"]
    next_action_reason: RequiredText


class CoverageNote(ProblemModel):
    topic: RequiredText
    reason: RequiredText
    state: Literal["included", "not_relevant", "unresolved"]
    part_keys: list[RequiredText] = Field(default_factory=list)
    question_keys: list[RequiredText] = Field(default_factory=list)


class ProblemChange(ProblemModel):
    kind: Literal["added", "reframed", "split", "merged", "retired", "assessment_changed", "no_material_change"]
    prior_question_keys: list[RequiredText] = Field(default_factory=list)
    current_question_keys: list[RequiredText] = Field(default_factory=list)
    reason: RequiredText
    answer_effect: RequiredText
    references: References = Field(default_factory=list)


class ProblemAlternative(ProblemModel):
    title: RequiredText
    proposed_change: RequiredText
    benefit: RequiredText
    tradeoff: RequiredText
    remaining_condition: RequiredText
    question_keys: list[RequiredText] = Field(default_factory=list)


class ProblemAnalysisPayload(ProblemModel):
    schema_version: Literal[1]
    objective: RequiredText
    proposed_method: Text = ""
    framing_note: Text = ""
    parts: list[ProblemPart] = Field(default_factory=list, max_length=40)
    questions: list[ProblemQuestion] = Field(default_factory=list, max_length=40)
    coverage: list[CoverageNote] = Field(default_factory=list, max_length=20)
    changes: list[ProblemChange] = Field(default_factory=list, max_length=20)
    alternative_paths: list[ProblemAlternative] = Field(default_factory=list, max_length=10)
    integrated_answer: RequiredText
    next_step: Text = ""


class SavedProblemAnalysis(ProblemAnalysisPayload):
    analysis_id: str
    analysis_revision: str
    matter_id: str
    run_id: str
    source_path: str
    output_revision: str
    captured_at: str
    input_basis: dict[str, Any]
    prior_reference: dict[str, Any] | None = None
    resolved_references: list[dict[str, Any]] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


class ProblemAnalysisStatus(ProblemModel):
    state: Literal["not_analyzed", "saved", "partial", "needs_review", "missing", "historical"]
    analysis: SavedProblemAnalysis | None = None
    reference: dict[str, Any] | None = None
    warnings: list[str] = Field(default_factory=list)
