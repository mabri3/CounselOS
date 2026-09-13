from pydantic import BaseModel, ConfigDict, Field, StrictBool, field_validator


class ResearchScope(BaseModel):
    """One request's search choice, never a workspace-wide permission."""

    model_config = ConfigDict(extra="forbid")
    external: StrictBool = False
    other_matters: StrictBool = False
    public_query: str = Field(default="", max_length=2000)
    provider_ids: list[str] = Field(default_factory=list, max_length=4)
    native: StrictBool = False
    collection_enabled: StrictBool = False
    allow_firecrawl: StrictBool = False
    model_selection: dict[str, str] | None = None

    main_model_selection: dict[str, str] | None = None
    collector_model_selection: dict[str, str] | None = None
    allow_followup_queries: StrictBool = False

    @field_validator("model_selection", "main_model_selection", "collector_model_selection")
    @classmethod
    def valid_selection(cls, value):
        if value is None:
            return value
        if set(value) - {"provider", "model", "reasoning_effort"} or not value.get("provider") or not value.get("model"):
            raise ValueError("Choose a research provider and model")
        if any(len(item) > 256 for item in value.values()):
            raise ValueError("Research model selection is too long")
        return value
