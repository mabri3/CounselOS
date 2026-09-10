from __future__ import annotations

import hashlib
import json
import re
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any

from app.models.workspace import OutputTemplate, TemplateUse
from app.services.vault import VaultService
from app.utils.ids import slugify
from app.utils.time import iso_now


SKILL_ID_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
DEFAULT_SKILL_REQUEST = "Apply this skill to the active matter and file."
TEMPLATE_DEFAULTS_PATH = "00_System/skills/output_templates/defaults.md"
TEMPLATE_HISTORY_ROOT = "00_System/skills/output_templates/history"
TEMPLATE_FIELDS = ("audience", "purpose", "tone", "length", "exclusions", "source_presentation", "sample_wording")
STARTER_ROOT = Path(__file__).resolve().parents[1] / "blank_vault_template" / "00_System" / "skills"


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


@dataclass(frozen=True)
class ExtendedSkillDefinition(SkillDefinition):
    kind: str = "skill"
    output_type: str = ""
    section_outline: str = ""
    defaults: dict[str, str] = field(default_factory=dict)
    revision: str = ""
    content_hash: str = ""
    revision_path: str | None = None
    example: str = ""

class SkillRegistry:
    """Markdown-backed reusable skills and output templates.

    Output templates stay as flat skills. Their immutable revisions live in a
    subfolder which the ordinary skill loader intentionally ignores.
    """

    def __init__(self, vault: VaultService):
        self.vault = vault

    def matter_paths_snapshot(self) -> dict[str, Any]:
        """One automatic first-party skill, resolved anew only at submission."""
        path = self._path("matter-paths")
        status = "saved"
        try:
            document = self.vault.read_markdown(path)
            if document["metadata"].get("enabled") is False:
                return {"skill_id":"matter-paths", "name":"Matter paths", "enabled":False,
                        "instructions":"", "revision":hashlib.sha256(self.vault.read_text(path).encode()).hexdigest(), "status":"disabled", "path":path}
            instructions = self._instructions(document["content"])
            if not instructions.strip() or len(instructions)>8000:
                raise ValueError("Invalid shared path guidance.")
        except (OSError, ValueError, TypeError):
            import frontmatter
            document = frontmatter.loads((STARTER_ROOT / "matter-paths.md").read_text())
            instructions = self._instructions(document.content)
            status = "bundled_fallback"
        return {"skill_id":"matter-paths", "name":"Matter paths", "enabled":True, "instructions":instructions,
                "revision":hashlib.sha256(instructions.encode()).hexdigest(), "status":status, "path":path}

    def list(self) -> list[SkillDefinition]:
        return list(self._load_all().values())

    def get(self, skill_id: str) -> SkillDefinition:
        skill = self._load_all().get(skill_id)
        if skill is None:
            raise KeyError(f"Skill not found: {skill_id}")
        return skill

    def create(self, *, skill_id: str, name: str, description: str, instructions: str) -> SkillDefinition:
        clean_id = self._validated_id(skill_id)
        if clean_id == "matter-paths" and (not instructions.strip() or len(instructions)>8000):
            raise ValueError("Shared path guidance must contain 1 to 8000 characters.")
        path = self._path(clean_id)
        if self.vault.exists(path):
            raise ValueError(f"Skill already exists: {clean_id}")
        now = iso_now()
        self.vault.write_markdown(path, self._content(name, instructions), {
            "skill_id": clean_id, "name": name.strip(), "description": description.strip(),
            "enabled": True, "created_at": now, "updated_at": now,
        })
        return self.get(clean_id)

    def create_practice_note(self, *, skill_id: str, name: str, description: str, instructions: str, example: str = "") -> SkillDefinition:
        definition = self.create(skill_id=skill_id, name=name, description=description, instructions=instructions)
        document = self.vault.read_markdown(definition.path)
        self.vault.write_markdown(definition.path, document["content"], {
            **document["metadata"], "kind": "practice_note", "example": example.strip(),
        })
        return self.get(definition.skill_id)

    def update(self, skill_id: str, *, name: str | None = None, description: str | None = None,
               instructions: str | None = None, example: str | None = None) -> SkillDefinition:
        if skill_id == "matter-paths" and instructions is not None and (not instructions.strip() or len(instructions)>8000):
            raise ValueError("Shared path guidance must contain 1 to 8000 characters.")
        if skill_id == "matter-paths" and not self.vault.exists(self._path(skill_id)):
            snapshot = self.matter_paths_snapshot()
            self.create(skill_id=skill_id, name=snapshot["name"], description="Shared across matter conversations", instructions=snapshot["instructions"])
        definition = self.get(skill_id)
        document = self.vault.read_markdown(definition.path)
        metadata = dict(document["metadata"])
        next_name = (name if name is not None else definition.name).strip()
        next_description = (description if description is not None else definition.description).strip()
        next_instructions = (instructions if instructions is not None else definition.instructions).strip()
        metadata.update({"skill_id": definition.skill_id, "name": next_name, "description": next_description,
                         "enabled": bool(metadata.get("enabled", True)),
                         "created_at": metadata.get("created_at") or iso_now(), "updated_at": iso_now()})
        if example is not None:
            metadata["example"] = example.strip()
        self.vault.write_markdown(definition.path, self._content(next_name, next_instructions), metadata)
        return self.get(skill_id)

    def parse_invocation(self, message: str) -> tuple[str | None, str]:
        first, separator, remainder = message.partition(" ")
        if not first.startswith("/"):
            return None, message
        skill = self.get(first[1:])
        if getattr(skill, "kind", "skill") == "output_template":
            raise KeyError("Output templates must be selected for a draft, not invoked as a skill.")
        cleaned = remainder.lstrip() if separator else ""
        return skill.skill_id, cleaned or DEFAULT_SKILL_REQUEST

    # Output templates ----------------------------------------------------

    def install_missing_output_template_starters(self) -> list[str]:
        """Copy bundled starters only when their active vault path is absent.

        Startup/upgrade ownership remains with the caller. This method has no
        side effects on a lawyer-created or customized file at the same path.
        """
        installed: list[str] = []
        for source in sorted(STARTER_ROOT.glob("output-*.md")):
            destination = self._path(source.stem)
            if self.vault.exists(destination):
                continue
            self.vault.write_bytes(destination, source.read_bytes())
            installed.append(destination)
        return installed

    def list_output_templates(self) -> list[dict[str, Any]]:
        root = self.vault.resolve("00_System/skills")
        if not root.exists():
            return []
        entries: list[dict[str, Any]] = []
        for path in sorted(root.glob("*.md")):
            relative = self.vault.relative(path)
            try:
                document = self.vault.read_markdown(relative)
                if str(document["metadata"].get("kind") or "") != "output_template":
                    continue
                entries.append(self._template_from_document(relative, document).model_dump())
            except Exception as exc:
                try:
                    is_template = "kind: output_template" in self.vault.read_text(relative)
                except OSError:
                    is_template = False
                if not is_template:
                    continue
                entries.append({"template_id": path.stem, "skill_id": path.stem, "kind": "output_template",
                                "name": path.stem.replace("-", " ").title(), "output_type": "", "instructions": "",
                                "section_outline": "", "revision": "", "content_hash": "", "path": relative,
                                "enabled": False, "status": "malformed", "failure_detail": str(exc)})
        chosen = self._chosen_default_ids(entries)
        for entry in entries:
            entry["is_default"] = chosen.get(str(entry.get("output_type") or "")) == entry.get("template_id")
        return entries

    def get_output_template(self, template_id: str) -> OutputTemplate:
        result = self._template_definition(template_id)
        if result is None:
            raise KeyError(f"Output template not found: {template_id}")
        return result.model_copy(update={"is_default": self._is_chosen_default(result)})

    def create_output_template(self, *, template_id: str, name: str, output_type: str, instructions: str,
                               description: str = "", section_outline: str = "", defaults: dict[str, str] | None = None) -> OutputTemplate:
        clean_id = self._validated_id(template_id)
        path = self._path(clean_id)
        if self.vault.exists(path):
            raise ValueError(f"Skill already exists: {clean_id}")
        if not output_type.strip():
            raise ValueError("Output type is required.")
        now = iso_now()
        self.vault.write_markdown(path, self._content(name, instructions), {
            "skill_id": clean_id, "template_id": clean_id, "kind": "output_template", "name": name.strip(),
            "description": description.strip(), "output_type": output_type.strip(), "section_outline": section_outline.strip(),
            "defaults": self._clean_defaults(defaults), "enabled": True, "revision": 1,
            "created_at": now, "updated_at": now,
        })
        template = self.get_output_template(clean_id)
        self._write_template_snapshot(template)
        return template

    def duplicate_output_template(self, template_id: str, *, new_template_id: str, name: str | None = None) -> OutputTemplate:
        source = self.get_output_template(template_id)
        return self.create_output_template(template_id=new_template_id, name=name or f"Copy of {source.name}",
                                           output_type=source.output_type, instructions=source.instructions,
                                           description=source.name, section_outline=source.section_outline,
                                           defaults=self._template_defaults(source))

    def update_output_template(self, template_id: str, *, expected_revision: str, name: str | None = None,
                               description: str | None = None, output_type: str | None = None,
                               instructions: str | None = None, section_outline: str | None = None,
                               defaults: dict[str, str] | None = None, enabled: bool | None = None) -> OutputTemplate:
        current = self.get_output_template(template_id)
        if current.revision != expected_revision:
            raise ValueError(f"Output template revision conflict: expected {expected_revision}, found {current.revision}")
        document = self.vault.read_markdown(current.path)
        metadata = dict(document["metadata"])
        next_name = (name if name is not None else current.name).strip()
        next_instructions = (instructions if instructions is not None else current.instructions).strip()
        next_type = (output_type if output_type is not None else current.output_type).strip()
        if not next_type:
            raise ValueError("Output type is required.")
        metadata.update({
            "skill_id": current.skill_id, "template_id": current.template_id, "kind": "output_template", "name": next_name,
            "description": (description if description is not None else str(metadata.get("description") or "")).strip(),
            "output_type": next_type, "section_outline": (section_outline if section_outline is not None else current.section_outline).strip(),
            "defaults": self._clean_defaults(defaults if defaults is not None else self._template_defaults(current)),
            "enabled": bool(metadata.get("enabled", True) if enabled is None else enabled),
            "revision": self._next_revision(metadata.get("revision")), "updated_at": iso_now(),
            "created_at": metadata.get("created_at") or iso_now(),
        })
        prospective = self._template_from_values(current.path, metadata, next_instructions)
        self._write_template_snapshot(prospective)
        self.vault.write_markdown(current.path, self._content(next_name, next_instructions), metadata)
        return self.get_output_template(template_id)

    def set_default_output_template(self, output_type: str, template_id: str | None) -> dict[str, str]:
        clean_type = output_type.strip()
        if not clean_type:
            raise ValueError("Output type is required.")
        defaults = self._default_map()
        if template_id is None:
            defaults.pop(clean_type, None)
        else:
            template = self.get_output_template(template_id)
            if template.output_type != clean_type:
                raise ValueError("A default must have the same output type.")
            defaults[clean_type] = template.template_id
        self.vault.write_markdown(TEMPLATE_DEFAULTS_PATH, "# Output template defaults", {
            "record_type": "output_template_defaults", "defaults": defaults, "updated_at": iso_now(),
        })
        return defaults

    def resolve_template_use(self, template_id: str | None, *, output_type: str,
                             overrides: dict[str, str] | None = None) -> TemplateUse:
        defaults = self._default_map()
        clean_type = output_type.strip()
        requested = (template_id or defaults.get(clean_type) or "").strip()
        if template_id is None and clean_type not in defaults:
            requested = self._shipped_default_id(clean_type) or ""
        clean_overrides = self._clean_defaults(overrides)
        if not requested:
            return self._unavailable_template_use("", output_type, clean_overrides,
                                                  "No template was selected and this output type has no default.")
        matches = self._template_matches(requested)
        if len(matches) != 1:
            if len(matches) > 1:
                choices = ", ".join(f"{item.template_id} ({item.name})" for item in matches)
                result = self._unavailable_template_use(requested, output_type, clean_overrides,
                                                        f"More than one template matches {requested!r}. Choose one ID: {choices}.")
                return result.model_copy(update={"choices": [item.template_id for item in matches]})
            return self._unavailable_template_use(requested, output_type, clean_overrides,
                                                  "The selected template is missing or malformed.")
        template = matches[0]
        if not template.enabled:
            return self._unavailable_template_use(template.template_id, output_type, clean_overrides, "The selected template is disabled.")
        if template.output_type != output_type.strip():
            return self._unavailable_template_use(template.template_id, output_type, clean_overrides,
                                                  f"Template output type is {template.output_type!r}, not {output_type!r}.")
        revision_path = self._write_template_snapshot(template)
        return TemplateUse(template_id=template.template_id, output_type=template.output_type, revision=template.revision,
                           content_hash=template.content_hash, revision_path=revision_path, instructions_snapshot=template.instructions,
                           section_outline_snapshot=template.section_outline, defaults_snapshot=self._template_defaults(template),
                           overrides=clean_overrides, state="applied", path=template.path, status="applied")

    def _template_matches(self, reference: str) -> list[OutputTemplate]:
        matches: list[OutputTemplate] = []
        for entry in self.list_output_templates():
            if entry.get("status") == "malformed":
                continue
            try:
                template = OutputTemplate.model_validate(entry)
            except Exception:
                continue
            if template.template_id == reference or template.name.casefold() == reference.casefold():
                matches.append(template)
        return matches

    def _shipped_default_id(self, output_type: str) -> str | None:
        """Return the bundled starter for a type, if that source defines one."""
        for source in sorted(STARTER_ROOT.glob("output-*.md")):
            try:
                document = VaultService(STARTER_ROOT.parents[1]).read_markdown(source.relative_to(STARTER_ROOT.parents[1]))
            except (OSError, ValueError):
                continue
            metadata = document["metadata"]
            if str(metadata.get("kind") or "") == "output_template" and str(metadata.get("output_type") or "").strip() == output_type:
                return str(metadata.get("template_id") or metadata.get("skill_id") or source.stem)
        return None

    def _chosen_default_ids(self, entries: list[dict[str, Any]]) -> dict[str, str]:
        """Choose explicit local defaults first, then installed shipped defaults."""
        defaults = self._default_map()
        chosen = dict(defaults)
        known_types = {str(item.get("output_type") or "") for item in entries if item.get("output_type")}
        for output_type in known_types:
            if output_type in chosen:
                continue
            starter_id = self._shipped_default_id(output_type)
            if starter_id and any(item.get("template_id") == starter_id for item in entries):
                chosen[output_type] = starter_id
        return chosen

    def _is_chosen_default(self, template: OutputTemplate) -> bool:
        defaults = self._default_map()
        chosen = defaults.get(template.output_type)
        if chosen is None:
            chosen = self._shipped_default_id(template.output_type)
        return chosen == template.template_id

    def _template_definition(self, template_id: str) -> OutputTemplate | None:
        path = self._path(template_id)
        if not self.vault.exists(path):
            return None
        document = self.vault.read_markdown(path)
        if str(document["metadata"].get("kind") or "") != "output_template":
            return None
        return self._template_from_document(path, document)

    def _template_from_document(self, path: str, document: dict[str, Any]) -> OutputTemplate:
        metadata = document["metadata"]
        skill_id = str(metadata.get("skill_id") or path.rsplit("/", 1)[-1].removesuffix(".md"))
        template_id = str(metadata.get("template_id") or skill_id)
        if not SKILL_ID_PATTERN.fullmatch(skill_id) or not SKILL_ID_PATTERN.fullmatch(template_id):
            raise ValueError("Template ID is invalid.")
        output_type = str(metadata.get("output_type") or "").strip()
        if not output_type:
            raise ValueError("Template output type is missing.")
        defaults = self._clean_defaults(metadata.get("defaults"))
        for key in TEMPLATE_FIELDS:
            value = metadata.get(key)
            if isinstance(value, str) and value.strip():
                defaults.setdefault(key, value.strip())
        return self._template_from_values(path, metadata, self._instructions(document["content"]), skill_id=skill_id,
                                          template_id=template_id, output_type=output_type, defaults=defaults)

    def _template_from_values(self, path: str, metadata: dict[str, Any], instructions: str, *, skill_id: str | None = None,
                              template_id: str | None = None, output_type: str | None = None,
                              defaults: dict[str, str] | None = None) -> OutputTemplate:
        actual_defaults = defaults if defaults is not None else self._clean_defaults(metadata.get("defaults"))
        actual = {"name": str(metadata.get("name") or "").strip(), "description": str(metadata.get("description") or "").strip(),
                  "output_type": output_type if output_type is not None else str(metadata.get("output_type") or "").strip(),
                  "instructions": instructions, "section_outline": str(metadata.get("section_outline") or "").strip(), "defaults": actual_defaults}
        content_hash = self._digest(actual)
        base_revision = str(metadata.get("revision") or "1").strip()
        return OutputTemplate(template_id=template_id or str(metadata.get("template_id") or skill_id or ""),
                              skill_id=skill_id or str(metadata.get("skill_id") or ""),
                              name=actual["name"] or str(metadata.get("template_id") or "Template"), output_type=actual["output_type"],
                              instructions=instructions, section_outline=actual["section_outline"],
                              audience=actual_defaults.get("audience", ""), purpose=actual_defaults.get("purpose", ""),
                              tone=actual_defaults.get("tone", ""), length=actual_defaults.get("length", ""),
                              exclusions=actual_defaults.get("exclusions", ""), source_presentation=actual_defaults.get("source_presentation", ""),
                              sample_wording=actual_defaults.get("sample_wording", ""), revision=f"{base_revision}:{content_hash[:16]}",
                              content_hash=content_hash, path=path, enabled=bool(metadata.get("enabled", True)))

    def _write_template_snapshot(self, template: OutputTemplate) -> str:
        safe_revision = re.sub(r"[^a-zA-Z0-9._-]+", "-", template.revision)
        path = f"{TEMPLATE_HISTORY_ROOT}/{template.template_id}/{safe_revision}.md"
        if not self.vault.exists(path):
            self.vault.write_markdown(path, self._content(template.name, template.instructions), {
                "record_type": "output_template_revision", "immutable": True, **template.model_dump(mode="json"),
                "defaults": self._template_defaults(template),
            })
        return path

    @staticmethod
    def _template_defaults(template: OutputTemplate) -> dict[str, str]:
        return {key: str(getattr(template, key) or "") for key in TEMPLATE_FIELDS if str(getattr(template, key) or "")}

    def _default_map(self) -> dict[str, str]:
        if not self.vault.exists(TEMPLATE_DEFAULTS_PATH):
            return {}
        try:
            raw = self.vault.read_markdown(TEMPLATE_DEFAULTS_PATH)["metadata"].get("defaults")
            return {str(key): str(value) for key, value in raw.items()} if isinstance(raw, dict) else {}
        except (OSError, ValueError, TypeError):
            return {}

    @staticmethod
    def _clean_defaults(values: Any) -> dict[str, str]:
        if not isinstance(values, dict):
            return {}
        return {str(key): str(value).strip() for key, value in values.items() if isinstance(value, str) and value.strip()}

    @staticmethod
    def _next_revision(value: Any) -> int:
        try:
            return int(value) + 1
        except (TypeError, ValueError):
            return 1

    @staticmethod
    def _digest(value: Any) -> str:
        return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False).encode("utf-8")).hexdigest()

    @staticmethod
    def _unavailable_template_use(template_id: str, output_type: str, overrides: dict[str, str], detail: str) -> TemplateUse:
        return TemplateUse(template_id=template_id, output_type=output_type.strip(), revision="", content_hash="", instructions_snapshot="",
                           defaults_snapshot={}, overrides=overrides, state="unavailable", failure_detail=detail,
                           path="", status="unavailable")

    # Ordinary flat skills -------------------------------------------------

    def _load_all(self) -> dict[str, SkillDefinition]:
        root = self.vault.resolve("00_System/skills")
        skills: dict[str, SkillDefinition] = {}
        if not root.exists():
            return skills
        for path in sorted(root.glob("*.md")):
            relative_path = self.vault.relative(path)
            try:
                document = self.vault.read_markdown(relative_path)
                metadata = document["metadata"]
                if not bool(metadata.get("enabled", True)):
                    continue
                skill_id = str(metadata.get("skill_id") or path.stem)
                if not SKILL_ID_PATTERN.fullmatch(skill_id):
                    continue
                kind = str(metadata.get("kind") or "skill")
                if kind == "output_template":
                    template = self._template_from_document(relative_path, document)
                    skills[skill_id] = ExtendedSkillDefinition(skill_id=skill_id, name=template.name,
                        description=str(metadata.get("description") or ""), instructions=template.instructions, enabled=template.enabled,
                        path=relative_path, kind=kind, output_type=template.output_type, section_outline=template.section_outline,
                        defaults=self._template_defaults(template), revision=template.revision, content_hash=template.content_hash,
                        example=str(metadata.get("example") or ""))
                else:
                    if kind == "skill":
                        skills[skill_id] = SkillDefinition(skill_id=skill_id, name=str(metadata.get("name") or path.stem.replace("-", " ").title()),
                            description=str(metadata.get("description") or ""), instructions=self._instructions(document["content"]),
                            enabled=True, path=relative_path)
                    else:
                        skills[skill_id] = ExtendedSkillDefinition(skill_id=skill_id, name=str(metadata.get("name") or path.stem.replace("-", " ").title()),
                            description=str(metadata.get("description") or ""), instructions=self._instructions(document["content"]),
                            enabled=True, path=relative_path, kind=kind, example=str(metadata.get("example") or ""))
            except (OSError, ValueError, TypeError):
                continue
        return skills

    @staticmethod
    def _validated_id(skill_id: str) -> str:
        normalized = slugify(skill_id, fallback="skill")
        if normalized != skill_id or not SKILL_ID_PATTERN.fullmatch(skill_id):
            raise ValueError("Skill ID must use lower-case letters, digits, and single hyphens.")
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
