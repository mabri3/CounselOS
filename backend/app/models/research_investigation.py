"""Bounded model payloads for main-agent research, not authorization records."""
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ResearchEvidenceRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    proposition_id: str = Field(min_length=1, max_length=80, description="Your stable label for the proposition being researched; not a source ID.")
    proposition: str = Field(min_length=1, max_length=1500, description="Public proposition to resolve. For follow-up, name the missing material and how it could change the advice; omit private facts.")
    jurisdiction: str = Field(default="unknown", max_length=200)
    entity_activity: str = Field(default="", max_length=500)
    public_query: str = Field(min_length=1, max_length=2000, description="Focused natural-language public search query for the saved collector/services, not vault-search syntax. Provider matching varies. Without follow-up permission, use exactly the confirmed query, including for a direct URL request.")
    source_goal: Literal["operative_rule", "exception", "contrary_material", "guidance", "background"] = Field(description="Type of evidence sought; not a claim that a returned page establishes the proposition.")
    public_url: str | None = Field(default=None, max_length=2000, description="Exact public HTTPS URL, including a relevant linked page or PDF, to fetch instead of searching. Still subject to saved scope and network checks. Use the returned source_id for later passage reads.")
    followup_of: str | None = Field(default=None, max_length=160, description="For every request after the first batch, copy an exact earlier request_key from this run. Do not use a source_id, proposition_id, or URL. Requires saved follow-up permission.")


class ResearchEvidenceBatch(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    requests: list[ResearchEvidenceRequest] = Field(min_length=1, max_length=4, description="One to four focused requests in this batch, within the saved run's remaining budget.")


class ResearchSourceRead(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    source_id: str = Field(min_length=1, max_length=160, description="Exact source_id returned by this run's collection, source search, or investigation read_file. No URL, file path, or request_key.")
    source_version: str | None = Field(default=None, max_length=64, description="Exact source_version from a search hit or earlier read. Omit to use the version this run already pinned for that source_id; the newest published version is never substituted silently.")
    unit_id: str | None = Field(default=None, max_length=64, description="Exact unit_id (a page like p000900 or a section like s000012) from a search hit or a returned next_read. Reads one library unit. Omit for a legacy run source that has no units.")
    page_number: int | None = Field(default=None, ge=1, le=1000, description="One-based page from the source's extracted pages. Overrides start and bounds the read to that page. To continue past a short page slice, omit page_number and find_text and set start to the returned absolute end.")
    start: int = Field(default=0, ge=0, le=20000000, description="Zero-based character offset. With unit_id it is an offset in that unit's saved body; otherwise an absolute offset in the saved source text, not bytes or words, and used only without page_number/find_text. Continue at the returned end; use a slightly earlier start for overlap. At or past the saved text end is an error.")
    max_chars: int = Field(default=6000, ge=1, le=6000, description="Character count, not an end offset or word count. Default and maximum 6000; omit for a normal passage. Avoid tiny prefix reads when the operative section is longer. The remaining evidence budget can reject a read.")
    continue_extraction: bool = Field(default=False, description="Explicitly continue local extraction for a source already pinned by this run. Optionally set page_number to extract that page. One bounded invocation only; returns a newly pinned version and next_read. Old versions remain readable. Does not fetch or spend model evidence budget.")
    find_text: str = Field(default="", max_length=2000, description="Case-sensitive literal substring, no regex or keyword syntax. Finds the first occurrence in the whole source (or selected page), ignoring start; returns up to 500 characters before it. On not_found, try exact source wording or offset reads. Omit this field when continuing at returned end.")


class AssumptionUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    assumption_id: str = Field(min_length=1, max_length=160)
    disposition: Literal["not_relied_on", "superseded_by_reported_fact"]
    reason: str = Field(min_length=1, max_length=2000)
    basis_fact_ids: list[str] = Field(default_factory=list, max_length=30)
    basis_source_ids: list[str] = Field(default_factory=list, max_length=30)


class PropositionAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    proposition_id: str = Field(min_length=1, max_length=80)
    status: Literal["supported", "qualified", "contradicted", "unresolved"]
    assessment: str = Field(min_length=1, max_length=4000)
    source_ids: list[str] = Field(default_factory=list, max_length=30)
    remaining_gap: str = Field(default="", max_length=2000)


class ResearchSynthesis(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    summary: str = Field(min_length=1, max_length=12000)
    recommendation: str = Field(min_length=1, max_length=60000)
    next_action: str = Field(min_length=1, max_length=2000)
    change_summary: str = Field(min_length=1, max_length=6000)
    relied_on_assumption_ids: list[str] = Field(default_factory=list, max_length=50)
    assumption_updates: list[dict] = Field(default_factory=list, max_length=50)
    proposition_assessments: list[dict] = Field(default_factory=list, max_length=50)


def extract_research_synthesis(raw):
    import json
    import re
    from pydantic import ValidationError
    pattern = re.compile(r"(?ms)^```research-synthesis[^\n]*\n(.*?)(?:\n```\s*(?=\n|$)|\Z)")
    matches = list(pattern.finditer(raw))
    if not matches:
        return raw, None, []
    prose = pattern.sub("", raw).strip()
    warnings = []
    try:
        data = json.loads(matches[0].group(1))
        # Validate list entries independently. Invalid entries cannot erase prose.
        updates, assessments = data.pop("assumption_updates", []), data.pop("proposition_assessments", [])
        synthesis = ResearchSynthesis.model_validate(data).model_dump()
        for name, entries, model in [("assumption_updates", updates, AssumptionUpdate), ("proposition_assessments", assessments, PropositionAssessment)]:
            if not isinstance(entries, list):
                warnings.append(f"Invalid {name}; reconciliation remains partial.")
                continue
            for entry in entries[:50]:
                try:
                    synthesis[name].append(model.model_validate(entry).model_dump())
                except (ValidationError, TypeError):
                    warnings.append(f"Invalid {name} entry ignored; useful prose retained.")
        return prose or synthesis["recommendation"], synthesis, warnings
    except (ValueError, TypeError, AttributeError):
        return prose, None, ["Optional research synthesis is malformed; useful prose retained and assumptions unreconciled."]
