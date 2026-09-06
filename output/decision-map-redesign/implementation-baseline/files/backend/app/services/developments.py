from __future__ import annotations

from datetime import UTC, datetime
from typing import Iterable

from pydantic import ValidationError

from app.models.awareness import (
    Development, DevelopmentBatch, DevelopmentCandidate, ProviderObservation,
)
from app.services.vault import VaultService
from app.utils.ids import new_id


DEVELOPMENT_ROOT = "05_Briefing/developments"


class DevelopmentService:
    """The sole owner of exact external-development identity and provenance."""

    def __init__(self, vault: VaultService):
        self.vault = vault

    def record_candidates(
        self,
        watch_id: str,
        provider_id: str,
        candidates: Iterable[DevelopmentCandidate],
    ) -> DevelopmentBatch:
        if not watch_id.strip():
            raise ValueError("watch_id is required")
        if provider_id not in {"native", "polaris"}:
            raise ValueError(f"Unknown provider: {provider_id}")
        developments, warnings = self._load_all()
        by_url = {str(item.canonical_url): item for item in developments if item.canonical_url}
        by_official = {
            item.official_identifier: item for item in developments if item.official_identifier
        }
        returned: list[Development] = []
        created_count = 0
        observation_count = 0
        for candidate in candidates:
            url_match = None
            official_match = None
            if candidate.canonical_url:
                url_match = by_url.get(str(candidate.canonical_url))
            if candidate.official_identifier:
                official_match = by_official.get(candidate.official_identifier)
            if (
                url_match is not None
                and official_match is not None
                and url_match.development_id != official_match.development_id
            ):
                warnings.append(
                    f"Candidate {candidate.title!r}: canonical URL and official identifier "
                    "refer to different developments; candidate was not merged"
                )
                continue
            match = url_match or official_match
            now = datetime.now(UTC)
            observation = ProviderObservation(
                provider_id=provider_id,
                observed_at=now,
                content_hash=candidate.content_hash,
                text=candidate.provider_observation,
                sources=candidate.sources,
            )
            if match is None:
                development_id = new_id("DEV")
                path = f"{DEVELOPMENT_ROOT}/{development_id}.md"
                match = Development(
                    development_id=development_id,
                    path=path,
                    title=candidate.title,
                    canonical_url=candidate.canonical_url,
                    official_identifier=candidate.official_identifier,
                    current_content_hash=candidate.content_hash,
                    summary=candidate.summary,
                    occurred_at=candidate.occurred_at,
                    watch_ids=[watch_id],
                    observations=[observation],
                    created_at=now,
                    updated_at=now,
                )
                self._write(match)
                developments.append(match)
                if match.canonical_url:
                    by_url[str(match.canonical_url)] = match
                if match.official_identifier:
                    by_official[match.official_identifier] = match
                created_count += 1
                observation_count += 1
            else:
                has_observation = self._has_observation(match, observation)
                watch_ids = sorted({*match.watch_ids, watch_id})
                updates = {}
                if not has_observation:
                    updates.update({
                        "title": candidate.title or match.title,
                        "canonical_url": candidate.canonical_url or match.canonical_url,
                        "official_identifier": candidate.official_identifier or match.official_identifier,
                        "current_content_hash": candidate.content_hash or match.current_content_hash,
                        "summary": candidate.summary or match.summary,
                        "occurred_at": candidate.occurred_at or match.occurred_at,
                        "observations": [*match.observations, observation],
                    })
                    observation_count += 1
                if watch_ids != match.watch_ids:
                    updates["watch_ids"] = watch_ids
                if updates:
                    updates["updated_at"] = now
                    match = match.model_copy(update=updates)
                    match = Development.model_validate(match.model_dump())
                    self._write(match)
                    for index, item in enumerate(developments):
                        if item.development_id == match.development_id:
                            developments[index] = match
                            break
            if match.canonical_url:
                by_url[str(match.canonical_url)] = match
            if match.official_identifier:
                by_official[match.official_identifier] = match
            returned.append(match)
        return DevelopmentBatch(
            developments=returned,
            created_count=created_count,
            observation_count=observation_count,
            warnings=warnings,
        )

    def get(self, development_id: str) -> Development:
        path = f"{DEVELOPMENT_ROOT}/{development_id}.md"
        if not self.vault.exists(path):
            raise KeyError(f"Development not found: {development_id}")
        record = Development.model_validate(self.vault.read_markdown(path)["metadata"])
        if record.path != path:
            raise ValueError(f"record path {record.path!r} does not match {path!r}")
        return record

    def append_observation(self, development_id: str, observation: ProviderObservation) -> Development:
        development = self.get(development_id)
        if self._has_observation(development, observation):
            return development
        updated = development.model_copy(update={
            "observations": [*development.observations, observation],
            "current_content_hash": observation.content_hash or development.current_content_hash,
            "updated_at": datetime.now(UTC),
        })
        updated = Development.model_validate(updated.model_dump())
        self._write(updated)
        return updated

    def _load_all(self) -> tuple[list[Development], list[str]]:
        records: list[Development] = []
        warnings: list[str] = []
        for path in self.vault.iter_files(DEVELOPMENT_ROOT, {".md"}):
            relative = self.vault.relative(path)
            try:
                record = Development.model_validate(self.vault.read_markdown(relative)["metadata"])
                if record.path != relative:
                    raise ValueError(f"record path {record.path!r} does not match {relative!r}")
                records.append(record)
            except (OSError, ValueError, ValidationError) as exc:
                warnings.append(f"{relative}: {exc}")
        return records, warnings

    @staticmethod
    def _has_observation(development: Development, candidate: ProviderObservation) -> bool:
        if candidate.content_hash:
            return any(
                existing.provider_id == candidate.provider_id
                and existing.content_hash == candidate.content_hash
                for existing in development.observations
            )
        candidate_data = candidate.model_dump(mode="json", exclude={"observed_at"})
        return any(
            existing.model_dump(mode="json", exclude={"observed_at"}) == candidate_data
            for existing in development.observations
        )

    def _write(self, development: Development) -> None:
        self.vault.write_markdown(
            development.path,
            f"# {development.title}\n\n{development.summary}",
            development.model_dump(mode="json"),
        )
