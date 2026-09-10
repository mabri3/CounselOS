from __future__ import annotations

import re
from typing import TYPE_CHECKING, Any

from app.utils.time import iso_now

if TYPE_CHECKING:
    from app.services.matters import MatterService


class MatterParticipantService:
    """Owns structured participant records and their legacy Markdown reader."""

    def __init__(self, matters: MatterService):
        self.matters = matters

    def list(self, matter_path: str) -> list[dict[str, str]]:
        path = f"{matter_path}/participants.md"
        if not self.matters.vault.exists(path):
            return []
        document = self.matters.vault.read_markdown(path)
        metadata = document["metadata"]
        structured = metadata.get("participants")
        if isinstance(structured, list):
            return [
                {"name": str(item["name"]), "role": str(item["role"])}
                for item in structured
                if isinstance(item, dict) and item.get("name") and item.get("role")
            ]
        parsed = self.from_content(document["content"])
        return parsed or self.structured(
            requester=metadata.get("requester"), legal_owner=metadata.get("legal_owner"),
            business_owner=metadata.get("business_owner"),
        )

    def add(self, matter_id: str, *, name: str, role: str, actor: str) -> dict[str, Any]:
        matter = self.matters._require_matter(matter_id)
        name, role, actor = name.strip(), role.strip(), actor.strip()
        if not name or not role or not actor:
            raise ValueError("Participant name, role, and actor are required.")
        path = f"{matter['path']}/participants.md"
        current = self.list(matter["path"])
        participant = {"name": name, "role": role}
        already = any(
            item["name"].casefold() == name.casefold() and item["role"].casefold() == role.casefold()
            for item in current
        )
        if not already:
            current.append(participant)
            body = "# Participants\n\n" + "\n".join(
                f"- **{item['name']}** — {item['role'].replace('_', ' ')}" for item in current
            ) + "\n"
            self.matters.vault.update_markdown(path, content=body, metadata_updates={
                "participants": current, "updated_at": iso_now(), "updated_by": actor,
            })
            self.matters.index.rebuild()
        return {"matter_id": matter_id, "participants": current, "changed_paths": [] if already else [path]}

    @staticmethod
    def from_content(content: str) -> list[dict[str, str]]:
        participants: list[dict[str, str]] = []
        role_names = {
            "requester": "requester", "legal owner": "legal_owner",
            "business owner": "business_owner", "product owner": "product_owner",
            "decision maker": "decision_maker",
        }
        for line in content.splitlines():
            stripped = line.strip()
            match = re.match(r"^-\s+\*\*(.+?)\*\*\s+[—-]\s+(.+)$", stripped)
            if match:
                name, role = match.groups()
            else:
                match = re.match(r"^-\s+([^:]+):\s+(.+)$", stripped)
                if not match:
                    continue
                role, name = match.groups()
            normalized_role = role_names.get(
                role.strip().casefold(), re.sub(r"[^a-z0-9]+", "_", role.strip().casefold()).strip("_"),
            )
            if name.strip() and normalized_role:
                participants.append({"name": name.strip(), "role": normalized_role})
        return participants

    @staticmethod
    def structured(*, requester: Any, legal_owner: Any, business_owner: Any) -> list[dict[str, str]]:
        return [
            {"name": name, "role": role}
            for role, raw_name in (
                ("requester", requester), ("legal_owner", legal_owner), ("business_owner", business_owner),
            )
            if (name := str(raw_name or "").strip())
        ]
