"""One-level composition of the dossier's editable writing instructions."""
import hashlib
import json
import re


def snapshot(registry):
    try:
        skill = registry.get("dossier-generation")
    except (KeyError, OSError, ValueError, TypeError):
        return {"skill_id": "dossier-generation", "name": "Dossier generation",
                "path": "00_System/skills/dossier-generation.md", "instructions": "",
                "enabled": False, "revision": "unavailable", "composition_revision": "unavailable",
                "supporting_skills": [], "warnings": ["The dossier generation skill is unavailable."]}
    supporting, warnings = [], []
    # A small declarative list, not executable Markdown or recursive skill calls.
    match = re.search(r"(?im)^Uses:\s*([^\n]*)$", skill.instructions)
    names = list(dict.fromkeys(n.strip() for n in match[1].split(",") if n.strip())) if match else []
    from app.services.experimental_chat import SKILLS, read_skill
    for name in names[:4]:
        if name == "dossier-generation" or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name):
            warnings.append(f"Supporting skill {name!r} was not loaded.")
            continue
        try:
            if name in SKILLS:
                source = read_skill(registry.vault, name)
                content, path = source["content"], source["path"]
            else:
                source = registry.get(name)
                if not source.enabled:
                    raise ValueError("Supporting skill is disabled")
                content, path = source.instructions, source.path
            supporting.append({"skill_id": name, "path": path, "instructions": content,
                               "revision": hashlib.sha256(content.encode()).hexdigest()})
        except (KeyError, OSError, ValueError):
            warnings.append(f"Supporting skill {name!r} is unavailable. Dossier instructions still apply.")
    if len(names) > 4:
        warnings.append("Only the first four supporting skills were loaded.")
    return {"skill_id": skill.skill_id, "name": skill.name, "path": skill.path,
            "instructions": skill.instructions, "enabled": skill.enabled,
            "revision": hashlib.sha256(skill.instructions.encode()).hexdigest(),
            "supporting_skills": supporting, "warnings": warnings,
            "composition_revision": hashlib.sha256(json.dumps([skill.instructions, supporting], sort_keys=True).encode()).hexdigest()}
