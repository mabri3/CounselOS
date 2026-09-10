from __future__ import annotations

import re
from pathlib import PurePosixPath

from app.services.dossier import serialized
from app.utils.time import iso_now


class MatterStorageService:
    """Reversible storage changes. Markdown, not the index, owns this state."""

    def __init__(self, context):
        self.context = context
        self.vault = context.vault
        self.index = context.index

    def list(self, view: str):
        root = "99_Trash" if view == "trash" else "03_Matters"
        rows = []
        for path in self.vault.resolve(root).glob("*/matter.md"):
            record = self.vault.read_markdown(self.vault.relative(path))
            data = record["metadata"]
            state = "trash" if root == "99_Trash" else "archived" if data.get("archived_at") else "active"
            if state == view:
                rows.append({"matter_id": data.get("matter_id", path.parent.name),
                             "title": data.get("title", path.parent.name), "state": state,
                             "path": self.vault.relative(path.parent),
                             "stored_at": data.get("trashed_at") if state == "trash" else data.get("archived_at")})
        return sorted(rows, key=lambda row: row["title"].lower())

    @serialized
    def change(self, matter_id: str, action: str):
        if not re.fullmatch(r"[A-Za-z0-9_-]+", matter_id):
            raise ValueError("Invalid matter ID.")
        indexed = self.index.get_matter(matter_id)
        trash_path = f"99_Trash/{matter_id}"
        if indexed:
            source = indexed["path"]
        elif self.vault.exists(f"{trash_path}/matter.md"):
            source = trash_path
        else:
            raise KeyError("Matter not found.")
        record = self.vault.read_markdown(f"{source}/matter.md")
        data = record["metadata"]
        if data.get("matter_id") != matter_id:
            raise ValueError("Matter ID does not match its folder record.")
        in_trash = source == trash_path
        if indexed and action != "restore":
            runs = self.context.chat_runs.list(matter_id) + self.context.research_runs.list(matter_id)
            if any(run.get("state") in {"queued", "running"} for run in runs) or self.context.has_active_work():
                raise ValueError("Work is running in this vault. Stop it or wait for it to finish, then try again.")
        destination = source
        updates = {}
        if action == "archive":
            if in_trash:
                raise ValueError("Restore this matter before archiving it.")
            updates = {"archived_at": data.get("archived_at") or iso_now()}
        elif action == "trash":
            if not in_trash:
                destination = trash_path
                updates = {"trashed_at": iso_now(), "trashed_from": source}
        elif action == "restore":
            if in_trash:
                destination = str(data.get("trashed_from") or "")
                parts = PurePosixPath(destination).parts
                if len(parts) != 2 or parts[0] != "03_Matters" or parts[1] in {".", ".."}:
                    raise ValueError("The original matter location is invalid. The folder was not moved.")
            updates = {"archived_at": None, "trashed_at": None, "trashed_from": None}
        else:
            raise ValueError("Unknown storage action.")
        source_dir = self.vault.resolve(source)
        target_dir = self.vault.resolve(destination)
        # Reject redirects even when a symlink points elsewhere inside the vault.
        if source_dir != self.vault.root / source or target_dir != self.vault.root / destination:
            raise ValueError("Matter storage paths must not use symbolic links.")
        if destination != source and target_dir.exists():
            raise ValueError("The destination folder already exists. Nothing was overwritten.")
        original = (source_dir / "matter.md").read_bytes()
        moved = False
        try:
            # Save the return address before moving; interrupted moves remain recoverable.
            if action != "restore":
                self.vault.update_markdown(f"{source}/matter.md", metadata_updates=updates)
            if destination != source:
                target_dir.parent.mkdir(parents=True, exist_ok=True)
                source_dir.rename(target_dir)
                moved = True
            if action == "restore":
                self.vault.update_markdown(f"{destination}/matter.md", metadata_updates=updates)
            self.index.rebuild()
        except Exception:
            if moved:
                target_dir.rename(source_dir)
            self.vault.write_bytes(f"{source}/matter.md", original)
            self.index.rebuild()
            raise
        return {"matter_id": matter_id, "path": destination,
                "state": "active" if action == "restore" else "archived" if action == "archive" else "trash"}
