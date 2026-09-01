from __future__ import annotations

from pathlib import Path

from app.agents.registry import AgentRegistry
from app.config import PROJECT_ROOT
from app.services.vault import VaultService
from app.tools.handlers import build_handlers
from app.tools.registry import ToolRegistry
from app.vault_manager import VaultManager
from conftest import copy_test_vault


def _agent_contract(agent) -> dict:
    return {
        "name": agent.name,
        "description": agent.description,
        "instructions": agent.instructions,
        "allowed_tools": agent.allowed_tools,
        "max_steps": agent.max_steps,
        "provider": agent.provider,
        "model": agent.model,
        "reasoning_effort": agent.reasoning_effort,
    }


def _tool_contract(registry: ToolRegistry) -> dict[str, dict]:
    return {
        item["tool_id"]: {
            "handler": item["handler"],
            "description": item["description"],
            "parameters": item["parameters"],
        }
        for item in registry.list()
    }


def test_new_vault_matches_shipped_agent_and_typed_tool_contracts(tmp_path: Path) -> None:
    current = tmp_path / "current"
    copy_test_vault(current)
    created = VaultManager(current).create(str(tmp_path / "created"))

    shipped_vault = VaultService(PROJECT_ROOT / "vault")
    created_vault = VaultService(created)
    shipped_agents = AgentRegistry(shipped_vault)
    created_agents = AgentRegistry(created_vault)
    shipped_tools = ToolRegistry(shipped_vault, build_handlers())
    created_tools = ToolRegistry(created_vault, build_handlers())

    assert _tool_contract(created_tools) == _tool_contract(shipped_tools)
    shipped_agent_ids = {item["agent_id"] for item in shipped_agents.list()}
    created_agent_ids = {item["agent_id"] for item in created_agents.list()}
    assert created_agent_ids == shipped_agent_ids
    for agent_id in sorted(shipped_agent_ids):
        assert _agent_contract(created_agents.get(agent_id)) == _agent_contract(
            shipped_agents.get(agent_id)
        )


def test_every_allowed_new_vault_tool_has_a_declaration_and_runtime_handler(tmp_path: Path) -> None:
    current = tmp_path / "current"
    copy_test_vault(current)
    created = VaultManager(current).create(str(tmp_path / "created"))

    vault = VaultService(created)
    agents = AgentRegistry(vault)
    tools = ToolRegistry(vault, build_handlers())
    declarations = {item["tool_id"]: item for item in tools.list()}

    for agent in agents.list():
        for tool_id in agent["allowed_tools"]:
            assert tool_id in declarations, f"{agent['agent_id']} lacks declaration for {tool_id}"
            handler = declarations[tool_id]["handler"]
            assert handler in tools.handlers, f"{tool_id} lacks runtime handler {handler}"


def test_blank_vault_template_rejects_paths_outside_staging(tmp_path: Path) -> None:
    staging = tmp_path / "staging"
    staging.mkdir()

    for relative in ("../outside.md", "/outside.md", "."):
        try:
            VaultManager._template_destination(staging, relative)
        except ValueError:
            pass
        else:
            raise AssertionError(f"unsafe template path was accepted: {relative}")
