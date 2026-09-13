from __future__ import annotations

import json
import re
from typing import Any

from pydantic import ValidationError

from app.config import Settings
from app.models.api import (
    SkillDraft,
    SkillDraftResponse,
    SkillEvidence,
    SkillQuestion,
    SkillSuggestion,
    SkillSuggestionsResponse,
)
from app.providers.base import LLMProvider
from app.services.chat_history import ChatHistoryService
from app.skills.registry import SkillRegistry
from app.utils.ids import slugify


QUESTIONS = (
    SkillQuestion(
        question_id="job",
        text="What should this skill help you do?",
        choices=[
            "Review or analyze something",
            "Draft something",
            "Compare options or documents",
            "Find or organize information",
            "Create a checklist or plan",
            "Something else",
        ],
    ),
    SkillQuestion(
        question_id="success",
        text="What should a good result help you do next?",
        choices=[
            "Make a decision",
            "Give advice or a recommendation",
            "Send or present a response",
            "Identify questions or missing information",
            "Complete a repeatable process",
            "Something else",
        ],
    ),
    SkillQuestion(
        question_id="inputs",
        text="What will you usually give this skill to work with?",
        choices=[
            "The active matter and its files",
            "A selected document",
            "Text entered in chat",
            "Company context and playbooks",
            "Prior decisions",
            "Something else",
        ],
    ),
    SkillQuestion(
        question_id="output",
        text="What should the result look like?",
        choices=[
            "A short recommendation",
            "An issue list",
            "A draft response or document",
            "A comparison table",
            "A checklist or action plan",
            "Something else",
        ],
    ),
    SkillQuestion(
        question_id="rules",
        text="What should the skill always do or avoid?",
        choices=[
            "Identify the sources it used",
            "State important assumptions",
            "Ask one focused question when needed",
            "Keep the answer short",
            "Do not change records without an explicit instruction",
            "Something else",
        ],
        selection_mode="multiple",
    ),
    SkillQuestion(
        question_id="anything_else",
        text="Is there anything else you want this skill to know or do?",
        selection_mode="free_text",
        allow_skip=False,
        allow_build_now=False,
    ),
)


class SkillBuilderService:
    def __init__(
        self,
        skills: SkillRegistry,
        chat_history: ChatHistoryService,
        provider: LLMProvider,
        settings: Settings,
    ):
        self.skills = skills
        self.chat_history = chat_history
        self.provider = provider
        self.settings = settings

    def questions(self) -> list[SkillQuestion]:
        return [question.model_copy(deep=True) for question in QUESTIONS]

    async def draft(
        self, goal: str, answers: dict[str, str | list[str]]
    ) -> SkillDraftResponse:
        clean_answers = self._non_empty_answers(answers)
        if self.settings.llm_provider.strip().lower() == "mock":
            return SkillDraftResponse(draft=self._fallback_draft(goal, clean_answers))
        try:
            reply = await self.provider.complete(
                [
                    {
                        "role": "system",
                        "content": (
                            "Create one reusable plain-language skill. Return only one JSON object "
                            "with skill_id, name, description, and instructions. The skill_id must use "
                            "lower-case letters, digits, and single hyphens. Do not define tools."
                        ),
                    },
                    {
                        "role": "user",
                        "content": json.dumps({"goal": goal, "answers": clean_answers}),
                    },
                ]
            )
            return SkillDraftResponse(draft=self._parse_draft(reply.content))
        except (Exception,):
            return SkillDraftResponse(
                draft=self._fallback_draft(goal, clean_answers),
                warning="The model draft was unavailable. A useful local draft was created instead.",
            )

    async def suggestions(self) -> SkillSuggestionsResponse:
        if self.settings.llm_provider.strip().lower() == "mock":
            return SkillSuggestionsResponse(
                warning="Repeated-work suggestions require a configured model."
            )
        existing_skills = self.skills.list()
        existing_ids = {skill.skill_id for skill in existing_skills}
        stored_messages = [
            item
            for item in self.chat_history.recent_user_messages(limit=100)
            if not self._invokes_existing_skill(item["content"], existing_ids)
        ]
        supplied = [
            {
                "message_id": item["message_id"],
                "content": item["content"][:500],
                "created_at": item["created_at"],
                "scope": item["scope"],
            }
            for item in stored_messages
        ]
        try:
            reply = await self.provider.complete(
                [
                    {
                        "role": "system",
                        "content": (
                            "Find repeated work that could become a new skill for one chat request. "
                            "Use short, plain language that a busy lawyer would use. Describe the legal "
                            "work, not the software. Never call a skill an automation, workflow, or command. "
                            "Do not suggest work already covered by an existing skill. Return only a JSON "
                            "array of at most three objects. Each object must contain name, description, "
                            "goal, and evidence_message_ids with at least two supplied message IDs."
                        ),
                    },
                    {
                        "role": "user",
                        "content": json.dumps(
                            {
                                "existing_skills": [
                                    {
                                        "name": skill.name,
                                        "description": skill.description,
                                    }
                                    for skill in existing_skills
                                ],
                                "messages": supplied,
                            }
                        ),
                    },
                ]
            )
            candidates = self._parse_candidates(reply.content)
        except Exception:
            return SkillSuggestionsResponse(
                warning="Repeated-work suggestions could not be generated."
            )

        by_id = {item["message_id"]: item for item in stored_messages}
        suggestions: list[SkillSuggestion] = []
        for candidate in candidates[:3]:
            if not isinstance(candidate, dict):
                continue
            name = str(candidate.get("name") or "").strip()
            description = str(candidate.get("description") or "").strip()
            goal = str(candidate.get("goal") or "").strip()
            raw_ids = candidate.get("evidence_message_ids")
            if not name or not description or not goal or not isinstance(raw_ids, list):
                continue
            valid_ids: list[str] = []
            for raw_id in raw_ids:
                message_id = str(raw_id)
                if message_id in by_id and message_id not in valid_ids:
                    valid_ids.append(message_id)
            if len(valid_ids) < 2:
                continue
            suggestions.append(
                SkillSuggestion(
                    name=name,
                    description=description,
                    goal=goal,
                    evidence=[SkillEvidence.model_validate(by_id[item_id]) for item_id in valid_ids],
                )
            )
        return SkillSuggestionsResponse(suggestions=suggestions)

    @staticmethod
    def _invokes_existing_skill(content: str, existing_ids: set[str]) -> bool:
        first_token = content.lstrip().split(maxsplit=1)[0]
        return first_token.startswith("/") and first_token[1:] in existing_ids

    @staticmethod
    def _parse_candidates(content: str) -> list[Any]:
        text = content.strip()
        fenced = re.fullmatch(r"```json\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
        if fenced:
            text = fenced.group(1)
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            parsed = parsed.get("suggestions")
        if not isinstance(parsed, list):
            raise ValueError("Suggestions must be a JSON array.")
        return parsed

    @staticmethod
    def _parse_draft(content: str) -> SkillDraft:
        text = content.strip()
        fenced = re.fullmatch(r"```json\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
        if fenced:
            text = fenced.group(1)
        parsed = json.loads(text)
        if not isinstance(parsed, dict):
            raise ValueError("Skill draft must be one JSON object.")
        try:
            draft = SkillDraft.model_validate(parsed)
        except ValidationError as exc:
            raise ValueError("Skill draft fields are invalid.") from exc
        if slugify(draft.skill_id, fallback="skill") != draft.skill_id:
            raise ValueError("Skill draft ID is invalid.")
        return draft

    @classmethod
    def _fallback_draft(
        cls, goal: str, answers: dict[str, str | list[str]]
    ) -> SkillDraft:
        clean_goal = " ".join(goal.strip().split()) or "Complete this repeatable legal task"
        skill_id = cls._fallback_id(clean_goal)
        name = skill_id.replace("-", " ").title()
        lines = [
            f"Help the user with this task: {clean_goal.rstrip('.')}.",
            "",
            "Use the active matter, selected file, and current request when they are relevant.",
        ]
        labels = {question.question_id: question.text for question in QUESTIONS}
        for key, value in answers.items():
            values = value if isinstance(value, list) else [value]
            joined = "; ".join(str(item).strip() for item in values if str(item).strip())
            if joined:
                label = labels.get(key, key.replace("_", " ").title()).rstrip("?")
                lines.append(f"{label}: {joined}.")
        lines.extend(
            [
                "",
                "Give a clear, useful result. State material assumptions and the next step when useful.",
            ]
        )
        return SkillDraft(
            skill_id=skill_id,
            name=name,
            description=f"Helps counsel {clean_goal.rstrip('.').lower()}.",
            instructions="\n".join(lines),
        )

    @staticmethod
    def _fallback_id(goal: str) -> str:
        lowered = goal.lower()
        if "product launch" in lowered and "review" in lowered:
            return "product-launch-review"
        for prefix in ("i often ", "help me ", "i want to ", "i need to "):
            if lowered.startswith(prefix):
                lowered = lowered[len(prefix) :]
                break
        return slugify(lowered, fallback="custom-skill")

    @staticmethod
    def _non_empty_answers(
        answers: dict[str, str | list[str]],
    ) -> dict[str, str | list[str]]:
        result: dict[str, str | list[str]] = {}
        for key, value in answers.items():
            if isinstance(value, list):
                clean = [str(item).strip() for item in value if str(item).strip()]
                if clean:
                    result[key] = clean
            elif str(value).strip():
                result[key] = str(value).strip()
        return result
