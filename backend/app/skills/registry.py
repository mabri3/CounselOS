from __future__ import annotations

import re
from dataclasses import asdict, dataclass
from typing import Any

from app.services.vault import VaultService
from app.utils.ids import slugify
from app.utils.time import iso_now


SKILL_ID_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
DEFAULT_SKILL_REQUEST = "Apply this skill to the active matter and file."


@dataclass(frozen=True)
class SkillDefinition:
    skill_id: str
    name: str
    description: str
    instructions: str
    enabled: bool
    path: str

    def summary(self) -> dict[str, str]:
        return {"skill_id": self.skill_id, "name": self.name}

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)


class SkillRegistry:
    def __init__(self, vault: VaultService):
        self.vault = vault

    def list(self) -> list[SkillDefinition]:
        return list(self._load_all().values())

    def get(self, skill_id: str) -> SkillDefinition:
        skill = self._load_all().get(skill_id)
        if skill is None:
            raise KeyError(f"Skill not found: {skill_id}")
        return skill

    def create(
        self,
        *,
        skill_id: str,
        name: str,
        description: str,
        instructions: str,
    ) -> SkillDefinition:
        clean_id = self._validated_id(skill_id)
        path = self._path(clean_id)
        if self.vault.exists(path):
            raise ValueError(f"Skill already exists: {clean_id}")
        now = iso_now()
        self.vault.write_markdown(
            path,
            self._content(name, instructions),
            {
                "skill_id": clean_id,
                "name": name.strip(),
                "description": description.strip(),
                "enabled": True,
                "created_at": now,
                "updated_at": now,
            },
        )
        return self.get(clean_id)

    def update(
        self,
        skill_id: str,
        *,
        name: str | None = None,
        description: str | None = None,
        instructions: str | None = None,
    ) -> SkillDefinition:
        definition = self.get(skill_id)
        document = self.vault.read_markdown(definition.path)
        metadata = document["metadata"]
        next_name = (name if name is not None else definition.name).strip()
        next_description = (
            description if description is not None else definition.description
        ).strip()
        next_instructions = (
            instructions if instructions is not None else definition.instructions
        ).strip()
        self.vault.write_markdown(
            definition.path,
            self._content(next_name, next_instructions),
            {
                "skill_id": definition.skill_id,
                "name": next_name,
                "description": next_description,
                "enabled": bool(metadata.get("enabled", True)),
                "created_at": metadata.get("created_at") or iso_now(),
                "updated_at": iso_now(),
            },
        )
        return self.get(skill_id)

    def parse_invocation(self, message: str) -> tuple[str | None, str]:
        first, separator, remainder = message.partition(" ")
        if not first.startswith("/"):
            return None, message
        skill_id = first[1:]
        self.get(skill_id)
        cleaned = remainder.lstrip() if separator else ""
        return skill_id, cleaned or DEFAULT_SKILL_REQUEST

    def _load_all(self) -> dict[str, SkillDefinition]:
        root = self.vault.resolve("00_System/skills")
        skills: dict[str, SkillDefinition] = {}
        if not root.exists():
            return skills
        for path in sorted(root.glob("*.md")):
            relative_path = self.vault.relative(path)
            document = self.vault.read_markdown(relative_path)
            metadata = document["metadata"]
            if not bool(metadata.get("enabled", True)):
                continue
            skill_id = str(metadata.get("skill_id") or path.stem)
            if not SKILL_ID_PATTERN.fullmatch(skill_id):
                continue
            skills[skill_id] = SkillDefinition(
                skill_id=skill_id,
                name=str(metadata.get("name") or path.stem.replace("-", " ").title()),
                description=str(metadata.get("description") or ""),
                instructions=self._instructions(document["content"]),
                enabled=True,
                path=relative_path,
            )
        return skills

    @staticmethod
    def _validated_id(skill_id: str) -> str:
        normalized = slugify(skill_id, fallback="skill")
        if normalized != skill_id or not SKILL_ID_PATTERN.fullmatch(skill_id):
            raise ValueError(
                "Skill ID must use lower-case letters, digits, and single hyphens."
            )
        return normalized

    @staticmethod
    def _path(skill_id: str) -> str:
        return f"00_System/skills/{skill_id}.md"

    @staticmethod
    def _content(name: str, instructions: str) -> str:
        return f"# {name.strip()}\n\n{instructions.strip()}\n"

    @staticmethod
    def _instructions(content: str) -> str:
        lines = content.strip().splitlines()
        if lines and lines[0].startswith("# "):
            lines = lines[1:]
        return "\n".join(lines).strip()
