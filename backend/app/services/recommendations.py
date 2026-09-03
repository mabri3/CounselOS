from __future__ import annotations

from pathlib import PurePosixPath
from typing import Any, Literal

from app.services.matters import MatterService
from app.services.vault import VaultService
from app.utils.ids import new_id
from app.utils.time import iso_now


RecommendationOrigin = Literal["initial_agent", "lawyer_edit", "agent_proposal"]


class RecommendationService:
    """Maintain the one working recommendation and its narrow version history."""

    def __init__(self, vault: VaultService, matters: MatterService):
        self.vault = vault
        self.matters = matters

    def get(self, matter_id: str) -> dict[str, Any]:
        path = self._path(matter_id)
        document = self.vault.read_markdown(path)
        metadata = document["metadata"]
        versions = [dict(item) for item in metadata.get("recommendation_versions", []) if isinstance(item, dict)]
        current_id = str(metadata.get("current_recommendation_version_id") or "") or None
        proposal = metadata.get("proposed_recommendation")
        return {
            "matter_id": matter_id,
            "path": path,
            "content": document["content"].strip(),
            "current_version_id": current_id,
            "current_version_number": self._number_for(versions, current_id),
            "versions": versions,
            "proposal": dict(proposal) if isinstance(proposal, dict) else None,
        }

    def is_configured_path(self, path: str) -> bool:
        """Return whether a path is a configured matter's recommendation record.

        This is deliberately path-based. Older recommendation files may have no
        recommendation metadata, but they still need the typed mutation path.
        """
        normalized = PurePosixPath(path).as_posix().lstrip("./")
        return any(
            normalized == f"{str(matter['path']).rstrip('/')}/recommendations.md"
            for matter in self.matters.index.list_matters()
        )

    def set_working(
        self,
        matter_id: str,
        content: str,
        *,
        actor: str,
        origin: Literal["initial_agent", "lawyer_edit"],
        project_dossier: bool = True,
        rebuild: bool = True,
    ) -> dict[str, Any]:
        content = content.strip()
        actor = actor.strip()
        if not content or not actor:
            raise ValueError("Recommendation content and actor are required.")
        current = self.get(matter_id)
        if current["content"] == content and current["current_version_id"]:
            return {**current, "changed_paths": [], "dossier_projection": {"state": "not_required"}}
        expected_dossier_hash = (
            self.matters._dossiers.content_hash(matter_id)
            if self.matters._dossiers and project_dossier else None
        )
        version = self._version(current["versions"], content, actor, origin)
        versions = [*current["versions"], version]
        self.vault.update_markdown(
            current["path"],
            content=content + "\n",
            metadata_updates={
                "record_type": "recommendations",
                "matter_id": matter_id,
                "current_recommendation_version_id": version["version_id"],
                "recommendation_versions": versions,
                "recommendation_updated_at": version["created_at"],
                "recommendation_updated_by": actor,
                "proposed_recommendation": None,
            },
        )
        result = {**self.get(matter_id), "changed_paths": [current["path"]]}
        return self._finish_current_mutation(
            matter_id, result, expected_dossier_hash=expected_dossier_hash,
            project_dossier=project_dossier, rebuild=rebuild,
        )

    def propose(
        self, matter_id: str, content: str, *, actor: str, rebuild: bool = True
    ) -> dict[str, Any]:
        content, actor = content.strip(), actor.strip()
        if not content or not actor:
            raise ValueError("Recommendation content and actor are required.")
        current = self.get(matter_id)
        current_proposal = current["proposal"]
        if (
            current_proposal
            and str(current_proposal.get("content") or "").strip() == content
            and str(current_proposal.get("actor") or "").strip() == actor
        ):
            return {**current, "changed_paths": []}
        proposal = self._version(current["versions"], content, actor, "agent_proposal")
        proposal["based_on_version_id"] = current["current_version_id"]
        self.vault.update_markdown(
            current["path"],
            metadata_updates={"proposed_recommendation": proposal},
        )
        if rebuild:
            self.matters.index.rebuild()
        return {
            **self.get(matter_id),
            "changed_paths": [current["path"]],
            "dossier_projection": {"state": "not_required"},
        }

    def accept(
        self, matter_id: str, *, actor: str,
        project_dossier: bool = True, rebuild: bool = True,
    ) -> dict[str, Any]:
        current = self.get(matter_id)
        proposal = current["proposal"]
        if not proposal:
            raise ValueError("There is no proposed recommendation update to accept.")
        expected_dossier_hash = (
            self.matters._dossiers.content_hash(matter_id)
            if self.matters._dossiers and project_dossier else None
        )
        accepted = {
            **proposal,
            "origin": "agent_proposal",
            "accepted_at": iso_now(),
            "accepted_by": actor.strip() or "Lawyer",
        }
        versions = [*current["versions"], accepted]
        self.vault.update_markdown(
            current["path"],
            content=str(accepted["content"]).strip() + "\n",
            metadata_updates={
                "current_recommendation_version_id": accepted["version_id"],
                "recommendation_versions": versions,
                "proposed_recommendation": None,
                "recommendation_updated_at": accepted["accepted_at"],
                "recommendation_updated_by": accepted["accepted_by"],
            },
        )
        result = {**self.get(matter_id), "changed_paths": [current["path"]]}
        return self._finish_current_mutation(
            matter_id, result, expected_dossier_hash=expected_dossier_hash,
            project_dossier=project_dossier, rebuild=rebuild,
        )

    def _finish_current_mutation(
        self, matter_id: str, result: dict[str, Any], *,
        expected_dossier_hash: str | None, project_dossier: bool, rebuild: bool,
    ) -> dict[str, Any]:
        projection: dict[str, Any] = {"state": "not_required"}
        if project_dossier and self.matters._dossiers:
            try:
                projection = self.matters._dossiers.project_current_work_state(
                    matter_id, expected_hash=expected_dossier_hash,
                )
            except Exception as exc:
                projection = {
                    "state": "failed",
                    "error": f"Dossier projection failed: {type(exc).__name__}",
                }
            projection_path = projection.get("path") or projection.get("revision_path")
            if projection_path and not projection.get("error"):
                result["changed_paths"] = list(dict.fromkeys([
                    *result["changed_paths"], str(projection_path),
                ]))
        if rebuild:
            self.matters.index.rebuild()
        return {**result, "dossier_projection": projection}

    def _path(self, matter_id: str) -> str:
        return f"{self.matters.matter_path(matter_id)}/recommendations.md"

    @staticmethod
    def _number_for(versions: list[dict[str, Any]], version_id: str | None) -> int | None:
        found = next((item for item in versions if item.get("version_id") == version_id), None)
        return int(found["number"]) if found and found.get("number") is not None else None

    @staticmethod
    def _version(
        versions: list[dict[str, Any]], content: str, actor: str, origin: RecommendationOrigin
    ) -> dict[str, Any]:
        return {
            "version_id": new_id("REC"),
            "number": max((int(item.get("number") or 0) for item in versions), default=0) + 1,
            "content": content,
            "actor": actor,
            "origin": origin,
            "created_at": iso_now(),
        }
