from __future__ import annotations

from datetime import UTC, datetime

from pydantic import ValidationError

from app.models.awareness import (
    ListResponse, ProviderCheckpoint, ProviderId, Scan, Watch, WatchDraftCreate, WatchPatch,
)
from app.services.vault import VaultService
from app.services.dossier import serialized
from app.utils.ids import new_id


WATCH_ROOT = "00_System/legal-awareness/watches"


class WatchStore:
    """Markdown-backed Watch drafts with optimistic revision checks."""

    def __init__(self, vault: VaultService):
        self.vault = vault
        self.warnings: list[str] = []

    def create_draft(self, request: WatchDraftCreate) -> Watch:
        watch_id = new_id("WATCH")
        path = f"{WATCH_ROOT}/{watch_id}.md"
        now = datetime.now(UTC)
        watch = Watch(
            watch_id=watch_id,
            path=path,
            title=request.title,
            standing_question=request.standing_question,
            public_query=request.public_query,
            purposes=request.purposes,
            provider=request.provider,
            enabled=False,
            schedule_id=None,
            status="draft",
            created_at=now,
            updated_at=now,
        )
        self._write(watch)
        return watch

    def get(self, watch_id: str) -> Watch:
        path = f"{WATCH_ROOT}/{watch_id}.md"
        if not self.vault.exists(path):
            raise KeyError(f"Watch not found: {watch_id}")
        return self._read(path)

    def list(self, cursor: str | None = None, limit: int = 25) -> ListResponse[Watch]:
        self.warnings = []
        records: list[Watch] = []
        for path in self.vault.iter_files(WATCH_ROOT, {".md"}):
            relative = self.vault.relative(path)
            try:
                records.append(self._read(relative))
            except (OSError, ValueError, ValidationError) as exc:
                self.warnings.append(f"{relative}: {exc}")
        records.sort(key=lambda item: (item.updated_at, item.watch_id), reverse=True)
        start = _cursor_start(records, cursor, lambda item: item.watch_id)
        page = records[start : start + limit]
        next_cursor = page[-1].watch_id if start + limit < len(records) and page else None
        return ListResponse(items=page, next_cursor=next_cursor, total=len(records))

    def update(self, watch_id: str, request: WatchPatch, expected_revision: int) -> Watch:
        watch = self.get(watch_id)
        if request.expected_revision != expected_revision or watch.revision != expected_revision:
            raise ValueError(f"Watch revision conflict: expected {expected_revision}, found {watch.revision}")
        changes = request.model_dump(exclude={"expected_revision"}, exclude_none=True)
        data = watch.model_dump()
        data.update(changes)
        data.update({"revision": watch.revision + 1, "updated_at": datetime.now(UTC)})
        updated = Watch.model_validate(data)
        self._write(updated)
        return updated

    def apply_scan_result(
        self,
        scan: Scan,
        checkpoints: dict[ProviderId, ProviderCheckpoint],
    ) -> Watch:
        current = self.get(scan.watch_id)
        merged_checkpoints = dict(current.checkpoints)
        merged_checkpoints.update(checkpoints)
        status = current.status
        if status not in {"draft", "paused"}:
            status = "healthy" if scan.status in {"success", "partial"} else "failed"
        data = current.model_dump()
        data.update({
            "checkpoints": merged_checkpoints,
            "last_successful_scan_at": (
                scan.completed_at
                if scan.status == "success"
                else current.last_successful_scan_at
            ),
            "status": status,
            "updated_at": datetime.now(UTC),
            "revision": current.revision + 1,
        })
        updated = Watch.model_validate(data)
        self._write(updated)
        return updated

    def _read(self, path: str) -> Watch:
        metadata = self.vault.read_markdown(path)["metadata"]
        # Workspace links are additive metadata. Keep strict watch validation for
        # the published watch record while retaining those local references.
        record = Watch.model_validate({key: value for key, value in metadata.items() if key in Watch.model_fields})
        if record.path != path:
            raise ValueError(f"record path {record.path!r} does not match {path!r}")
        return record

    def _write(self, watch: Watch) -> None:
        unknown: dict[str, object] = {}
        if self.vault.exists(watch.path):
            unknown = {
                key: value for key, value in self.vault.read_markdown(watch.path)["metadata"].items()
                if key not in Watch.model_fields
            }
        self.vault.write_markdown(
            watch.path,
            f"# {watch.title}\n\n{watch.standing_question}",
            {**unknown, **watch.model_dump(mode="json")},
        )

    @serialized
    def link_workspace_assumptions(
        self, watch_id: str, *, matter_id: str, assumption_ids: list[str], decision_ids: list[str] | None = None,
    ) -> dict[str, object]:
        """Attach explicit matter-local watch context without changing the Watch model."""
        watch = self.get(watch_id)
        document = self.vault.read_markdown(watch.path)
        metadata = dict(document["metadata"])
        links = [item for item in metadata.get("workspace_assumption_links", []) if isinstance(item, dict)]
        link = {"watch_id": watch_id, "matter_id": matter_id, "assumption_ids": sorted(set(assumption_ids)),
                "decision_ids": sorted(set(decision_ids or []))}
        links = [item for item in links if not (item.get("matter_id") == matter_id and item.get("watch_id") == watch_id)]
        metadata["workspace_assumption_links"] = [*links, link]
        self.vault.write_markdown(watch.path, document["content"], metadata)
        return link

    def workspace_assumption_links(self, watch_id: str) -> list[dict[str, object]]:
        watch = self.get(watch_id)
        metadata = self.vault.read_markdown(watch.path)["metadata"]
        return [dict(item) for item in metadata.get("workspace_assumption_links", []) if isinstance(item, dict)]


def _cursor_start(items: list[object], cursor: str | None, get_id: object) -> int:
    if not cursor:
        return 0
    for index, item in enumerate(items):
        if get_id(item) == cursor:  # type: ignore[operator]
            return index + 1
    return 0
