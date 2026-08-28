from __future__ import annotations

from pathlib import PurePosixPath
from typing import Any

from app.services.matters import MatterService
from app.services.vault import VaultService
from app.utils.ids import new_id, slugify
from app.utils.time import iso_now


class WorkProductService:
    def __init__(self, vault: VaultService, matters: MatterService):
        self.vault = vault
        self.matters = matters

    def create_draft(self, matter_id: str, *, title: str, content: str, summary: str = "") -> dict[str, Any]:
        work_product_id = new_id("WP")
        filename = f"{slugify(title)}-{work_product_id[-6:]}.md"
        path = f"{self.matters.matter_path(matter_id)}/work-product/draft/{filename}"
        self.vault.write_markdown(path, content, {
            "work_product_id": work_product_id, "matter_id": matter_id, "title": title,
            "state": "draft", "summary": summary, "created_at": iso_now(), "immutable": False,
        })
        self.matters.append_event(matter_id, "work_product_drafted", {"path": path, "title": title})
        return {"title": title, "vault_path": path, "state": "draft", "summary": summary}

    def finalize(self, matter_id: str, draft_path: str) -> dict[str, Any]:
        base = PurePosixPath(self.matters.matter_path(matter_id))
        supplied = PurePosixPath(draft_path)
        expected_parent = base / "work-product" / "draft"
        if supplied.parent != expected_parent or supplied.suffix != ".md":
            raise ValueError("Only a draft from this matter can be finalized.")
        draft = self.vault.read_markdown(draft_path)
        if draft["metadata"].get("matter_id") != matter_id or draft["metadata"].get("state") != "draft":
            raise ValueError("The selected file is not a draft for this matter.")
        final_id = new_id("FINAL")
        final_path = str(base / "work-product" / "final" / f"{supplied.stem}-{final_id[-6:]}.md")
        now = iso_now()
        metadata = {**draft["metadata"], "state": "final", "immutable": True,
                    "final_id": final_id, "finalized_at": now, "source_draft": draft_path}
        self.vault.write_markdown(final_path, draft["content"], metadata)
        self.matters.append_event(matter_id, "work_product_finalized", {
            "draft_path": draft_path, "final_path": final_path, "title": draft["metadata"].get("title", supplied.stem),
        })
        return {"title": draft["metadata"].get("title", supplied.stem), "vault_path": final_path,
                "state": "final", "summary": draft["metadata"].get("summary", "")}
