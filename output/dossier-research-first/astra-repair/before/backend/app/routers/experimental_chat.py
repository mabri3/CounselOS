from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from app.routers.dependencies import get_context
from app.services.experimental_chat import SKILLS, read_skill
from app.services.dossier import serialized

router = APIRouter(prefix="/experimental-chat", tags=["experimental-chat"])


class SkillUpdate(BaseModel):
    content: str = Field(min_length=1, max_length=24000)
    expected_revision: str


@router.get("/skills")
def skills(context=Depends(get_context)):
    return {"skills": [read_skill(context.vault, name) for name in (*SKILLS, "matter-paths", "dossier-generation")]}


@router.put("/skills/{name}")
@serialized
def save_skill(name: str, payload: SkillUpdate, context=Depends(get_context)):
    try:
        current = read_skill(context.vault, name)
        if current["revision"] != payload.expected_revision:
            raise HTTPException(409, "This skill changed. Reload before replacing it.")
        if name in {"matter-paths", "dossier-generation"}:
            context.skills.update(name, instructions=payload.content)
        else:
            context.vault.write_markdown(current["path"], payload.content, {"kind": "experimental_chat_skill"})
        return read_skill(context.vault, name)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
