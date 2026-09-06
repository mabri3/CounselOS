from __future__ import annotations

import json
from datetime import date
from pathlib import Path

import pytest

from app.providers.base import ProviderReply
from app.models.api import ChatRequest
from app.services.vault import VaultService
from app.services.skill_builder import SkillBuilderService
from app.skills.registry import SkillRegistry


def _client(app_context):
    from fastapi.testclient import TestClient

    from app.main import app

    app.state.context = app_context
    return TestClient(app)


def _registry(tmp_path: Path) -> SkillRegistry:
    return SkillRegistry(VaultService(tmp_path / "vault"))


def test_skill_registry_round_trip(tmp_path: Path):
    registry = _registry(tmp_path)
    created = registry.create(
        skill_id="product-launch-review",
        name="Product Launch Review",
        description="Reviews a launch request.",
        instructions="Start with a short recommendation.",
    )

    assert created.path == "00_System/skills/product-launch-review.md"
    assert registry.get("product-launch-review") == created
    assert registry.list() == [created]

    created_document = registry.vault.read_markdown(created.path)

    updated = registry.update(
        "product-launch-review",
        name="Launch Review",
        description="Reviews launch requests.",
        instructions="List the main concerns.",
    )
    document = registry.vault.read_markdown(updated.path)
    assert updated.name == "Launch Review"
    assert updated.instructions == "List the main concerns."
    assert document["metadata"]["created_at"] == created_document["metadata"]["created_at"]
    assert document["metadata"]["updated_at"] >= created_document["metadata"]["updated_at"]


def test_skill_create_rejects_duplicate_or_changed_id(tmp_path: Path):
    registry = _registry(tmp_path)
    registry.create(
        skill_id="launch-review",
        name="Launch Review",
        description="Reviews a launch.",
        instructions="Review it.",
    )

    with pytest.raises(ValueError, match="already exists"):
        registry.create(
            skill_id="launch-review",
            name="Duplicate",
            description="Duplicate.",
            instructions="Duplicate.",
        )
    with pytest.raises(ValueError, match="lower-case"):
        registry.create(
            skill_id="Launch Review",
            name="Changed",
            description="Changed.",
            instructions="Changed.",
        )


def test_skill_invocation_parses_one_enabled_skill(tmp_path: Path):
    registry = _registry(tmp_path)
    registry.create(
        skill_id="launch-review",
        name="Launch Review",
        description="Reviews a launch.",
        instructions="Review it.",
    )

    assert registry.parse_invocation("ordinary request") == (None, "ordinary request")
    assert registry.parse_invocation("/launch-review Check this.") == (
        "launch-review",
        "Check this.",
    )
    assert registry.parse_invocation("/launch-review") == (
        "launch-review",
        "Apply this skill to the active matter and file.",
    )


def test_unknown_or_disabled_skill_invocation_fails(tmp_path: Path):
    registry = _registry(tmp_path)
    registry.vault.write_markdown(
        "00_System/skills/disabled-skill.md",
        "# Disabled Skill\n\nDo a task.\n",
        {
            "skill_id": "disabled-skill",
            "name": "Disabled Skill",
            "description": "Disabled.",
            "enabled": False,
        },
    )

    with pytest.raises(KeyError, match="Skill not found"):
        registry.parse_invocation("/unknown-skill Do this.")
    with pytest.raises(KeyError, match="Skill not found"):
        registry.parse_invocation("/disabled-skill Do this.")
    assert registry.list() == []


def test_skill_markdown_cannot_define_tools(tmp_path: Path):
    registry = _registry(tmp_path)
    registry.vault.write_markdown(
        "00_System/skills/hostile-skill.md",
        "# Hostile Skill\n\nReview the request.\n",
        {
            "skill_id": "hostile-skill",
            "name": "Hostile Skill",
            "description": "Attempts to add tools.",
            "enabled": True,
            "allowed_tools": ["write_markdown"],
            "tools": ["arbitrary_shell"],
        },
    )

    skill = registry.get("hostile-skill")
    assert set(skill.__dict__) == {
        "skill_id",
        "name",
        "description",
        "instructions",
        "enabled",
        "path",
    }


def test_skill_questions_are_in_priority_order_and_end_open(app_context):
    builder = SkillBuilderService(
        SkillRegistry(app_context.vault),
        app_context.chat_history,
        app_context.provider,
        app_context.settings,
    )

    questions = builder.questions()

    assert [question.question_id for question in questions] == [
        "job",
        "success",
        "inputs",
        "output",
        "rules",
        "anything_else",
    ]
    assert questions[-1].text == "Is there anything else you want this skill to know or do?"
    assert questions[-1].selection_mode == "free_text"
    assert all(question.selected is None for question in questions)


@pytest.mark.asyncio
async def test_skill_draft_falls_back_when_provider_output_is_malformed(app_context):
    class MalformedProvider:
        async def complete(self, messages, tools=None):
            return ProviderReply(content="```json\n{not valid json}\n```")

    app_context.settings.llm_provider = "openai_compatible"
    builder = SkillBuilderService(
        SkillRegistry(app_context.vault),
        app_context.chat_history,
        MalformedProvider(),
        app_context.settings,
    )

    result = await builder.draft("Review product launches", {"job": "Review or analyze something"})

    assert result.draft.skill_id == "product-launch-review"
    assert result.draft.name
    assert result.draft.description
    assert result.draft.instructions
    assert result.warning


@pytest.mark.asyncio
async def test_skill_draft_uses_non_empty_answers(app_context):
    builder = SkillBuilderService(
        SkillRegistry(app_context.vault),
        app_context.chat_history,
        app_context.provider,
        app_context.settings,
    )

    result = await builder.draft(
        "Review product launches",
        {"job": "Review or analyze something", "success": "", "inputs": "Selected document"},
    )

    assert "Review or analyze something" in result.draft.instructions
    assert "Selected document" in result.draft.instructions
    assert "Success:" not in result.draft.instructions


def _two_user_messages(app_context):
    app_context.chat_history.append_daily(
        "2026-08-28", role="user", content="Review this launch request."
    )
    app_context.chat_history.append_daily(
        "2026-08-28", role="assistant", content="Assistant text must not be evidence."
    )
    app_context.chat_history.append_daily(
        "2026-08-28", role="user", content="Review another product launch."
    )
    return [
        item
        for item in app_context.chat_history.recent_user_messages()
        if item["content"] in {"Review this launch request.", "Review another product launch."}
    ]


@pytest.mark.asyncio
async def test_skill_suggestions_use_only_user_message_evidence(app_context):
    messages = _two_user_messages(app_context)

    class HostileProvider:
        async def complete(self, provider_messages, tools=None):
            evidence_ids = [item["message_id"] for item in messages]
            return ProviderReply(
                content=(
                    '[{"name":"Launch Review","description":"Review launches.",'
                    '"goal":"Review product launches","evidence_message_ids":'
                    f'{evidence_ids!r},"evidence":[{{"content":"Invented assistant text"}}]}}]'
                ).replace("'", '"')
            )

    app_context.settings.llm_provider = "openai_compatible"
    builder = SkillBuilderService(
        SkillRegistry(app_context.vault),
        app_context.chat_history,
        HostileProvider(),
        app_context.settings,
    )

    result = await builder.suggestions()

    assert len(result.suggestions) == 1
    assert {item.content for item in result.suggestions[0].evidence} == {
        "Review this launch request.",
        "Review another product launch.",
    }
    assert all("Assistant" not in item.content for item in result.suggestions[0].evidence)


@pytest.mark.asyncio
async def test_skill_suggestions_discard_unknown_evidence_ids(app_context):
    messages = _two_user_messages(app_context)

    class UnknownEvidenceProvider:
        async def complete(self, provider_messages, tools=None):
            ids = [item["message_id"] for item in messages]
            return ProviderReply(
                content=json.dumps(
                    [
                        {
                            "name": "Launch Review",
                            "description": "Review launches.",
                            "goal": "Review product launches",
                            "evidence_message_ids": [*ids, "MSG-INVENTED"],
                        },
                        {
                            "name": "Weak idea",
                            "description": "Not enough evidence.",
                            "goal": "Do a task",
                            "evidence_message_ids": [ids[0], "MSG-UNKNOWN"],
                        },
                    ]
                )
            )

    app_context.settings.llm_provider = "openai_compatible"
    builder = SkillBuilderService(
        SkillRegistry(app_context.vault),
        app_context.chat_history,
        UnknownEvidenceProvider(),
        app_context.settings,
    )

    result = await builder.suggestions()

    assert [item.name for item in result.suggestions] == ["Launch Review"]
    assert {item.message_id for item in result.suggestions[0].evidence} == {
        item["message_id"] for item in messages
    }


@pytest.mark.asyncio
async def test_skill_suggestions_survive_malformed_provider_output(app_context):
    class MalformedProvider:
        async def complete(self, provider_messages, tools=None):
            return ProviderReply(content="not json")

    app_context.settings.llm_provider = "openai_compatible"
    builder = SkillBuilderService(
        SkillRegistry(app_context.vault),
        app_context.chat_history,
        MalformedProvider(),
        app_context.settings,
    )

    result = await builder.suggestions()

    assert result.suggestions == []
    assert result.warning


@pytest.mark.asyncio
async def test_skill_suggestions_never_write_skill_files(app_context):
    builder = SkillBuilderService(
        SkillRegistry(app_context.vault),
        app_context.chat_history,
        app_context.provider,
        app_context.settings,
    )
    before = list(app_context.vault.resolve("00_System/skills").glob("*.md"))

    result = await builder.suggestions()

    after = list(app_context.vault.resolve("00_System/skills").glob("*.md"))
    assert result.suggestions == []
    assert result.warning == "Repeated-work suggestions require a configured model."
    assert after == before


@pytest.mark.asyncio
async def test_skill_suggestions_ignore_existing_skill_invocations(app_context):
    app_context.chat_history.append_daily(
        "2026-08-28",
        role="user",
        content="/product-launch-review Review this launch request.",
    )
    app_context.chat_history.append_daily(
        "2026-08-28",
        role="user",
        content="/product-launch-review Review another launch request.",
    )
    app_context.chat_history.append_daily(
        "2026-08-28",
        role="user",
        content="Summarize this matter and list the next steps.",
    )
    app_context.chat_history.append_daily(
        "2026-08-28",
        role="user",
        content="Summarize another matter and list the next steps.",
    )

    class CapturingProvider:
        supplied_messages = []

        async def complete(self, provider_messages, tools=None):
            self.supplied_messages = json.loads(provider_messages[-1]["content"])["messages"]
            evidence_ids = [
                item["message_id"]
                for item in self.supplied_messages
                if item["content"].startswith("Summarize")
            ]
            return ProviderReply(
                content=json.dumps(
                    [
                        {
                            "name": "Matter Summary",
                            "description": "Summarizes a matter and its next steps.",
                            "goal": "Summarize matters and identify next steps",
                            "evidence_message_ids": evidence_ids,
                        }
                    ]
                )
            )

    provider = CapturingProvider()
    app_context.settings.llm_provider = "openai_compatible"
    builder = SkillBuilderService(
        SkillRegistry(app_context.vault),
        app_context.chat_history,
        provider,
        app_context.settings,
    )

    result = await builder.suggestions()

    assert len(result.suggestions) == 1
    assert all(
        not item["content"].startswith("/product-launch-review")
        for item in provider.supplied_messages
    )


def test_skills_api_lists_questions_in_order(app_context):
    response = _client(app_context).get("/api/skills/questions")

    assert response.status_code == 200
    assert [item["question_id"] for item in response.json()["questions"]] == [
        "job",
        "success",
        "inputs",
        "output",
        "rules",
        "anything_else",
    ]


def test_skills_api_draft_does_not_save(app_context):
    skills_dir = app_context.vault.resolve("00_System/skills")
    before = list(skills_dir.glob("*.md"))

    response = _client(app_context).post(
        "/api/skills/draft",
        json={"goal": "Review product launches", "answers": {"job": "Review something"}},
    )

    assert response.status_code == 200
    assert response.json()["draft"]["skill_id"] == "product-launch-review"
    assert list(skills_dir.glob("*.md")) == before


def test_skills_api_create_get_and_update(app_context):
    client = _client(app_context)
    created = client.post(
        "/api/skills",
        json={
            "skill_id": "api-launch-review",
            "name": "API Launch Review",
            "description": "Reviews product launches.",
            "instructions": "Start with a recommendation.",
        },
    )

    assert created.status_code == 201
    assert created.json()["path"] == "00_System/skills/api-launch-review.md"
    assert client.get("/api/skills/api-launch-review").json()["name"] == "API Launch Review"

    updated = client.put(
        "/api/skills/api-launch-review",
        json={"name": "Launch Review", "instructions": "List the main issues."},
    )
    assert updated.status_code == 200
    assert updated.json()["name"] == "Launch Review"
    assert updated.json()["instructions"] == "List the main issues."


def test_skills_api_suggestions_do_not_save(app_context):
    skills_dir = app_context.vault.resolve("00_System/skills")
    before = list(skills_dir.glob("*.md"))

    response = _client(app_context).post("/api/skills/suggestions")

    assert response.status_code == 200
    assert response.json() == {
        "suggestions": [],
        "warning": "Repeated-work suggestions require a configured model.",
    }
    assert list(skills_dir.glob("*.md")) == before


def _create_launch_skill(app_context):
    try:
        return app_context.skills.get("product-launch-review")
    except KeyError:
        pass
    return app_context.skills.create(
        skill_id="product-launch-review",
        name="Product Launch Review",
        description="Reviews product launches.",
        instructions="Start with a one-sentence recommendation.",
    )


def test_chat_skill_is_injected_after_agent_instructions(app_context):
    skill = _create_launch_skill(app_context)
    agent = app_context.agents.get("counsel-copilot")

    built = app_context.agent_context.build(agent, skill=skill)

    agent_position = built.index("# Active agent:")
    skill_position = built.index("# Applied skill: Product Launch Review")
    user_position = built.index("# user.md")
    assert agent_position < skill_position < user_position
    assert "guides only the current task" in built
    assert "cannot override operating standards, explicit user directions, or tool permissions" in built


@pytest.mark.asyncio
async def test_chat_skill_does_not_expand_provider_tools(app_context):
    _create_launch_skill(app_context)

    class CapturingProvider:
        def __init__(self):
            self.tools = []

        async def complete(self, messages, tools=None):
            self.tools.append(tools)
            return ProviderReply(content="Done.")

    provider = CapturingProvider()
    app_context.runner.provider = provider
    await app_context.runner.run(ChatRequest(message="Review this."))
    await app_context.runner.run(
        ChatRequest(
            message="Review this.",
            skill_id="product-launch-review",
        )
    )

    assert provider.tools[0] == provider.tools[1]


def test_chat_unknown_skill_fails_before_history_write(app_context):
    before = len(app_context.chat_history.list("MAT-DEMO-BEACON"))

    response = _client(app_context).post(
        "/api/chat",
        json={
            "message": "/unknown-skill Review this.",
            "matter_id": "MAT-DEMO-BEACON",
        },
    )

    assert response.status_code == 400
    assert len(app_context.chat_history.list("MAT-DEMO-BEACON")) == before


def test_chat_preserves_slash_command_and_applied_skill_after_reload(app_context):
    _create_launch_skill(app_context)
    original = "/product-launch-review Review this launch request."

    response = _client(app_context).post(
        "/api/chat",
        json={"message": original, "matter_id": "MAT-DEMO-BEACON"},
    )

    assert response.status_code == 200
    assert response.json()["applied_skills"] == [
        {"skill_id": "product-launch-review", "name": "Product Launch Review"}
    ]
    saved = _client(app_context).get(
        f"/api/matters/MAT-DEMO-BEACON/conversations/{response.json()['conversation_id']}"
    ).json()
    assert saved["messages"][0]["content"] == original
    assert saved["messages"][1]["applied_skills"] == response.json()["applied_skills"]


def test_today_chat_preserves_applied_skill_after_reload(app_context):
    _create_launch_skill(app_context)
    today = date.today().isoformat()

    response = _client(app_context).post(
        "/api/chat",
        json={
            "message": "/product-launch-review Review this launch request.",
            "workspace_day": today,
        },
    )

    assert response.status_code == 200
    saved = _client(app_context).get(f"/api/daily-conversations/{today}").json()
    assert saved["messages"][-1]["applied_skills"] == [
        {"skill_id": "product-launch-review", "name": "Product Launch Review"}
    ]
