from __future__ import annotations

import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.services.answer_contract import (
    DEFAULT_ANSWER_CONTRACT,
    DEFAULT_ANSWER_CONTRACT_CONTENT,
    DEFAULT_ANSWER_CONTRACT_METADATA,
    MAX_ANSWER_CONTRACT_CHARS,
    AnswerContractService,
)
from app.services.vault import VaultService
from app.vault_manager import VaultManager
from conftest import copy_test_vault


def _service(tmp_path: Path) -> AnswerContractService:
    return AnswerContractService(VaultService(tmp_path / "vault"))


def _build_system(app_context) -> str:
    return app_context.agent_context.build_system(
        app_context.agents.get("counsel-copilot")
    )


def test_read_creates_missing_default(tmp_path):
    service = _service(tmp_path)

    result = service.read()

    assert service.vault.exists(service.PATH)
    assert result["content"] == DEFAULT_ANSWER_CONTRACT_CONTENT
    assert result["is_default"] is True
    normalized = " ".join(result["content"].split())
    assert "## Support and claim strength" in result["content"]
    assert "Never invent or guess a source" in result["content"]
    assert "Do not invent an objection" in normalized
    assert "No mandatory headings" in normalized
    assert "Three to six items" not in normalized
    assert "No external authority retrieved" in normalized


def test_write_persists_custom_body(tmp_path):
    service = _service(tmp_path)

    written = service.write("# Custom contract\n\nUse short answers.")

    assert written["is_default"] is False
    assert service.read()["content"] == "# Custom contract\n\nUse short answers."


def test_reset_restores_default(tmp_path):
    service = _service(tmp_path)
    service.write("Changed")

    result = service.reset()

    assert result["content"] == DEFAULT_ANSWER_CONTRACT_CONTENT
    assert result["metadata"] == DEFAULT_ANSWER_CONTRACT_METADATA
    assert result["is_default"] is True


def test_write_missing_file_uses_default_metadata(tmp_path):
    service = _service(tmp_path)

    result = service.write("Custom from a missing file")

    assert result["metadata"] == DEFAULT_ANSWER_CONTRACT_METADATA


def test_over_limit_write_does_not_change_stored_file(tmp_path):
    service = _service(tmp_path)
    before = service.write("Keep this body")

    with pytest.raises(ValueError, match="12000 characters or fewer"):
        service.write("x" * (MAX_ANSWER_CONTRACT_CHARS + 1))

    after = service.read()
    assert after["content"] == before["content"]
    assert after["metadata"] == before["metadata"]


def test_build_system_creates_and_includes_missing_contract(app_context):
    app_context.vault.resolve(AnswerContractService.PATH).unlink(missing_ok=True)

    prompt = _build_system(app_context)

    assert app_context.vault.exists(AnswerContractService.PATH)
    assert "# Answer contract" in prompt


def test_build_system_omits_blank_contract(app_context):
    app_context.answer_contract.write("")

    prompt = _build_system(app_context)
    assert "# Answer contract" not in prompt
    assert "# Claim support output contract" in prompt


def test_answer_contract_precedes_execution_rule(app_context):
    prompt = _build_system(app_context)

    assert prompt.index("# Answer contract") < prompt.index("# Execution rule")


def test_build_system_hot_reloads_contract(app_context):
    distinctive_rule = "DISTINCTIVE-RULE-ANSWER-CONTRACT"
    first = _build_system(app_context)

    app_context.answer_contract.write(f"# Custom contract\n\n{distinctive_rule}")
    second = _build_system(app_context)

    assert distinctive_rule not in first
    assert distinctive_rule in second


def test_effective_claim_contract_applies_without_overwriting_custom_contract(app_context):
    custom = "# Custom contract\n\nKeep the answer in one short paragraph."
    app_context.answer_contract.write(custom)

    prompt = _build_system(app_context)

    assert app_context.answer_contract.read()["content"] == custom
    assert "claim_id" in prompt
    assert "claim_revision" in prompt
    assert "output_revision" in prompt
    assert "regulated actor" in prompt
    assert "jurisdiction" in prompt
    assert "exact available excerpt" in prompt
    assert "Retrieved is not Verified" in prompt
    assert "Do not invent" in prompt
    assert "```claim-support" in prompt
    assert "Do not put generated excerpts" in prompt
    assert "do not force an ordinary answer through JSON" in " ".join(prompt.split())


def test_blank_vault_manifest_contract_matches_default():
    manifest_path = (
        Path(__file__).resolve().parents[1]
        / "app"
        / "blank_vault_template"
        / "manifest.json"
    )
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    assert manifest["files"][AnswerContractService.PATH] == DEFAULT_ANSWER_CONTRACT


def test_existing_vault_without_contract_still_validates(tmp_path):
    vault_path = tmp_path / "existing-vault"
    copy_test_vault(vault_path)
    (vault_path / AnswerContractService.PATH).unlink(missing_ok=True)

    VaultManager(vault_path).validate(vault_path)


def test_answer_contract_api_round_trip(app_context):
    from app.main import app

    app_context.vault.resolve(AnswerContractService.PATH).unlink(missing_ok=True)
    app.state.context = app_context
    client = TestClient(app)
    expected_keys = {
        "path",
        "content",
        "metadata",
        "updated_at",
        "is_default",
        "max_content_chars",
    }

    initial = client.get("/api/settings/answer-contract")
    assert initial.status_code == 200
    assert set(initial.json()) == expected_keys

    custom = "# API contract\n\nAppend a concise boundary map."
    saved = client.put(
        "/api/settings/answer-contract", json={"content": custom}
    )
    assert saved.status_code == 200
    assert saved.json()["content"] == custom
    assert app_context.answer_contract.read()["content"] == custom

    rejected = client.put(
        "/api/settings/answer-contract",
        json={"content": "x" * (MAX_ANSWER_CONTRACT_CHARS + 1)},
    )
    assert rejected.status_code == 422
    assert app_context.answer_contract.read()["content"] == custom

    reset = client.post("/api/settings/answer-contract/reset")
    assert reset.status_code == 200
    assert set(reset.json()) == expected_keys
    assert reset.json()["content"] == DEFAULT_ANSWER_CONTRACT_CONTENT
    assert reset.json()["is_default"] is True


def test_exact_legacy_default_migrates_but_custom_text_and_metadata_survive(tmp_path):
    import frontmatter
    from app.services.answer_contract import LEGACY_ANSWER_CONTRACT
    service = _service(tmp_path)
    legacy = frontmatter.loads(LEGACY_ANSWER_CONTRACT)
    service.vault.write_markdown(service.PATH, legacy.content, dict(legacy.metadata))
    assert service.read()["content"] == DEFAULT_ANSWER_CONTRACT_CONTENT
    customized = legacy.content + "\n\nMy custom instruction."
    service.vault.write_markdown(service.PATH, customized, {**legacy.metadata, "owner_note": "Keep"})
    before = service.vault.resolve(service.PATH).read_bytes()
    result = service.read()
    assert result["update_proposal"]["state"] == "proposed"
    assert service.vault.resolve(service.PATH).read_bytes() == before
    assert result["metadata"]["owner_note"] == "Keep"
