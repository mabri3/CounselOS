from __future__ import annotations

import re
import unicodedata
from pydantic import BaseModel, ConfigDict, Field, HttpUrl
from app.models.awareness import (
    ForbiddenCorpus, OutboundDateWindow, OutboundPublicEntity, OutboundWatchQuery, PublicWatchQuery, Watch,
)


_EMAIL = re.compile(r"(?i)\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b")
_MATTER_ID = re.compile(r"(?i)\b(?:matter|mat)[-_ ]?[a-z0-9]{3,}\b")
_INTERNAL_PATH = re.compile(r"(?i)(?:^|[\s'\"])(?:/|~\/|\\\\|(?:0[0-9]|vault|internal)[/\\])")


def _normal(value: str) -> str:
    value = unicodedata.normalize("NFKC", value).casefold()
    return " ".join(value.split())


class PublicResearchQuery(BaseModel):
    """Allow-listed public data proposed for one matter-research request."""

    model_config = ConfigDict(extra="forbid", frozen=True)
    question: str = Field(min_length=1, max_length=2000)
    jurisdictions: tuple[str, ...] = Field(default_factory=tuple, max_length=20)
    regulators: tuple[str, ...] = Field(default_factory=tuple, max_length=20)
    courts: tuple[str, ...] = Field(default_factory=tuple, max_length=20)
    public_entities: tuple[OutboundPublicEntity, ...] = Field(default_factory=tuple, max_length=20)
    public_source_urls: tuple[HttpUrl, ...] = Field(default_factory=tuple, max_length=20)


class OutboundQueryPolicy:
    """The final local authority for data sent to an intelligence provider."""

    FIELD_LIMIT = 500
    QUESTION_LIMIT = 2000
    TOTAL_LIMIT = 12000

    def prepare(self, watch: Watch, forbidden_corpus: ForbiddenCorpus) -> OutboundWatchQuery:
        query = watch.public_query
        return self._prepare(query, forbidden_corpus)

    def prepare_public(
        self,
        query: PublicResearchQuery,
        forbidden_corpus: ForbiddenCorpus,
    ) -> OutboundWatchQuery:
        return self._prepare(
            OutboundWatchQuery(
                standing_question=query.question,
                jurisdictions=query.jurisdictions,
                regulators=query.regulators,
                courts=query.courts,
                public_entities=query.public_entities,
                public_source_urls=query.public_source_urls,
            ),
            forbidden_corpus,
        )

    def _prepare(
        self,
        query: PublicWatchQuery | OutboundWatchQuery,
        forbidden_corpus: ForbiddenCorpus,
    ) -> OutboundWatchQuery:
        public_names = {_normal(entity.name) for entity in query.public_entities if entity.explicitly_public}
        forbidden_terms = tuple(
            term for term in (_normal(term) for term in forbidden_corpus.terms)
            if term and term not in public_names
        )
        forbidden_fragments = tuple(
            fragment for fragment in (_normal(fragment) for fragment in forbidden_corpus.fragments)
            if fragment and fragment not in public_names
        )
        term_patterns = tuple(
            re.compile(rf"(?<!\w){re.escape(term)}(?!\w)") for term in forbidden_terms
        )

        values: list[tuple[str, str]] = [("standing_question", query.standing_question)]
        for field in ("keywords", "topics", "jurisdictions", "regulators", "courts", "industries"):
            values.extend((field, value) for value in getattr(query, field))
        values.extend(("public_source_urls", str(value)) for value in query.public_source_urls)
        values.extend(("public_entities", entity.name) for entity in query.public_entities)

        total = 0
        for field, raw in values:
            normalized = _normal(raw)
            limit = self.QUESTION_LIMIT if field == "standing_question" else self.FIELD_LIMIT
            if not normalized or len(raw) > limit:
                raise ValueError(f"outbound field {field} is empty or exceeds its limit")
            total += len(raw)
            if _EMAIL.search(normalized) or _MATTER_ID.search(normalized) or _INTERNAL_PATH.search(normalized):
                raise ValueError(f"outbound field {field} contains a private identifier")
            if any(pattern.search(normalized) for pattern in term_patterns) or any(
                fragment in normalized for fragment in forbidden_fragments
            ):
                raise ValueError(f"outbound field {field} matches private company context")
        if total > self.TOTAL_LIMIT:
            raise ValueError("outbound query exceeds its total length limit")

        return OutboundWatchQuery(
            standing_question=query.standing_question,
            keywords=tuple(query.keywords), topics=tuple(query.topics),
            jurisdictions=tuple(query.jurisdictions), regulators=tuple(query.regulators),
            courts=tuple(query.courts), industries=tuple(query.industries),
            date_window=OutboundDateWindow(**query.date_window.model_dump()) if query.date_window else None,
            public_source_urls=tuple(query.public_source_urls),
            public_entities=tuple(OutboundPublicEntity(**item.model_dump()) for item in query.public_entities),
        )
