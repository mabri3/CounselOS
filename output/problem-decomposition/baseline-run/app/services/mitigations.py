from __future__ import annotations

from datetime import UTC, datetime

from pydantic import ValidationError

from app.models.awareness import Mitigation, MitigationCreate, MitigationPatch
from app.services.vault import VaultService
from app.utils.ids import new_id


class MitigationService:
    def __init__(self, vault: VaultService):
        self.vault = vault
        self.warnings: list[str] = []

    def list(self, matter_id: str) -> list[Mitigation]:
        root = self._root(matter_id)
        self.warnings = []
        records: list[Mitigation] = []
        for path in self.vault.iter_files(root, {".md"}):
            relative = self.vault.relative(path)
            try:
                record = Mitigation.model_validate(self.vault.read_markdown(relative)["metadata"])
                if record.matter_id != matter_id:
                    raise ValueError("matter_id does not match containing matter")
                if record.path != relative:
                    raise ValueError(f"record path {record.path!r} does not match {relative!r}")
                records.append(record)
            except (OSError, ValueError, ValidationError) as exc:
                self.warnings.append(f"{relative}: {exc}")
        records.sort(key=lambda item: (item.updated_at, item.mitigation_id), reverse=True)
        return records

    def create(self, matter_id: str, request: MitigationCreate) -> Mitigation:
        mitigation_id = new_id("MIT")
        path = f"{self._root(matter_id)}/{mitigation_id}.md"
        now = datetime.now(UTC)
        record = Mitigation(
            mitigation_id=mitigation_id,
            matter_id=matter_id,
            path=path,
            created_at=now,
            updated_at=now,
            **request.model_dump(),
        )
        self._write(record)
        return record

    def update(
        self, matter_id: str, mitigation_id: str, request: MitigationPatch, expected_revision: int
    ) -> Mitigation:
        record = self._get(matter_id, mitigation_id)
        if request.expected_revision != expected_revision or record.revision != expected_revision:
            raise ValueError(
                f"Mitigation revision conflict: expected {expected_revision}, found {record.revision}"
            )
        changes = request.model_dump(exclude={"expected_revision"}, exclude_none=True)
        if "review_at" in request.model_fields_set:
            changes["review_at"] = request.review_at
        updated = record.model_copy(update={
            **changes, "revision": record.revision + 1, "updated_at": datetime.now(UTC)
        })
        updated = Mitigation.model_validate(updated.model_dump())
        self._write(updated)
        return updated

    def _get(self, matter_id: str, mitigation_id: str) -> Mitigation:
        path = f"{self._root(matter_id)}/{mitigation_id}.md"
        if not self.vault.exists(path):
            raise KeyError(f"Mitigation not found: {mitigation_id}")
        record = Mitigation.model_validate(self.vault.read_markdown(path)["metadata"])
        if record.matter_id != matter_id:
            raise KeyError(f"Mitigation not found: {mitigation_id}")
        if record.path != path:
            raise ValueError(f"record path {record.path!r} does not match {path!r}")
        return record

    def _root(self, matter_id: str) -> str:
        # Resolve first so hostile IDs cannot escape VAULT_PATH.
        root = f"03_Matters/{matter_id}/mitigations"
        self.vault.resolve(root)
        return root

    def _write(self, record: Mitigation) -> None:
        self.vault.write_markdown(
            record.path,
            f"# {record.title}\n\n{record.description}",
            record.model_dump(mode="json"),
        )
