from __future__ import annotations

from dataclasses import dataclass, field

import pytest

from app.models.continuity import ActionActor, DemoPerson, ScopeSnapshot
from app.services.settings import SettingsService
from app.services.vault import VaultService
from app.services.workspace import WorkspaceConflict, digest
from app.services.workspace_team import WorkspaceTeamService


class MatterPaths:
    def __init__(self, vault: VaultService):
        self.vault = vault

    def matter_path(self, matter_id: str) -> str:
        for path in self.vault.resolve("03_Matters").glob("*/matter.md"):
            doc = self.vault.read_markdown(self.vault.relative(path))
            if doc["metadata"].get("matter_id") == matter_id:
                return self.vault.relative(path.parent)
        raise KeyError(matter_id)


class WorkspaceFixture:
    def __init__(self, vault: VaultService, matters: MatterPaths):
        self.vault, self.matters = vault, matters

    def _document(self, matter_id: str, name: str):
        path = f"{self.matters.matter_path(matter_id)}/{name}"
        if self.vault.exists(path):
            return self.vault.read_markdown(path)
        return {"path": path, "content": "", "metadata": {"matter_id": matter_id}}

    def source_revisions(self, matter_id: str):
        base = self.matters.matter_path(matter_id)
        result = {}
        for name in ("matter.md", "facts.md"):
            path = f"{base}/{name}"
            if self.vault.exists(path):
                doc = self.vault.read_markdown(path)
                metadata = {key: value for key, value in doc["metadata"].items() if key not in {
                    "legal_owner", "legal_owner_id", "ownership_revision", "ownership_action_key",
                    "assigned_at", "assigned_by", "updated_at", "updated_by",
                }}
                result[path] = digest({"content": doc["content"], "metadata": metadata})
        return result

    def _output_revisions(self, matter_id: str, *, failures=None):
        return {}

    def recap(self, matter_id: str):
        sources = self.source_revisions(matter_id)
        return {"current_revision": digest({"sources": sources, "outputs": {}})}


@dataclass
class MarkdownOwnerTransfer:
    vault: VaultService
    team: WorkspaceTeamService | None = None
    fail_after_canonical_once: bool = False
    calls: int = 0
    actors: list[str] = field(default_factory=list)

    def __call__(self, *, expected: ScopeSnapshot, recipient: DemoPerson,
                 actor: ActionActor, source_action_key: str) -> ScopeSnapshot:
        assert self.team is not None
        self.calls += 1
        self.actors.append(actor.person_id)
        current = ScopeSnapshot.model_validate(
            self.team.scope(expected.matter_id, work_item_id=expected.work_item_id)
        )
        doc = self.vault.read_markdown(current.path)
        meta = doc["metadata"]
        if (
            meta.get("ownership_action_key") == source_action_key
            and meta.get("owner_id", meta.get("legal_owner_id")) == recipient.person_id
        ):
            self._repair_participant(expected, recipient, actor)
            return ScopeSnapshot.model_validate(
                self.team.scope(expected.matter_id, work_item_id=expected.work_item_id)
            )
        if current.ownership_revision != expected.ownership_revision:
            raise WorkspaceConflict(
                "A newer assignment owns this scope.", current.ownership_revision,
                code="ownership_conflict",
            )
        ownership_revision = digest([
            expected.matter_id, expected.kind, expected.work_item_id,
            recipient.person_id, source_action_key,
        ])
        if expected.kind == "matter":
            updates = {"legal_owner_id": recipient.person_id, "legal_owner": recipient.display_name}
        else:
            updates = {"owner_id": recipient.person_id, "owner": recipient.display_name}
        meta.update({
            **updates, "ownership_revision": ownership_revision,
            "ownership_action_key": source_action_key, "assigned_by": actor.display_name,
            "assigned_at": "2026-09-05T12:00:00Z",
            "action_actor": actor.model_dump(),
        })
        self.vault.write_markdown(current.path, doc["content"], meta)
        if self.fail_after_canonical_once:
            self.fail_after_canonical_once = False
            raise OSError("participant projection unavailable")
        self._repair_participant(expected, recipient, actor)
        return ScopeSnapshot.model_validate(
            self.team.scope(expected.matter_id, work_item_id=expected.work_item_id)
        )

    def _repair_participant(self, expected, recipient, actor):
        if expected.kind != "matter":
            return
        base = self.team.matters.matter_path(expected.matter_id)
        path = f"{base}/participants.md"
        doc = self.vault.read_markdown(path)
        participants = [
            item for item in doc["metadata"].get("participants", [])
            if item.get("role") != "legal_owner"
        ]
        participants.append({
            "name": recipient.display_name, "role": "legal_owner", "person_id": recipient.person_id,
        })
        meta = {**doc["metadata"], "participants": participants, "updated_by": actor.display_name}
        self.vault.write_markdown(path, doc["content"], meta)


@pytest.fixture()
def team_fixture(tmp_path):
    vault = VaultService(tmp_path / "vault")
    vault.write_markdown(
        "00_System/settings.md", "# Custom settings body\n\nKeep this text.\n",
        {"values": {"unrelated.flag": "keep", "matters.default_owner": "Legacy Lawyer"},
         "custom_metadata": {"keep": True}},
    )
    base = "03_Matters/example-MAT-1"
    vault.write_markdown(f"{base}/matter.md", "# Example matter\n", {
        "matter_id": "MAT-1", "title": "Example matter", "status": "active",
        "legal_owner_id": "alex", "legal_owner": "Alex Kim",
        "ownership_revision": "matter-owner-1", "custom": "keep",
    })
    vault.write_markdown(f"{base}/participants.md", "# Participants\n", {
        "matter_id": "MAT-1", "participants": [
            {"name": "Alex Kim", "role": "legal_owner", "person_id": "alex"},
            {"name": "Pat Client", "role": "requester"},
        ], "custom": "keep",
    })
    vault.write_markdown(f"{base}/workspace.md", "# Workspace\n", {
        "matter_id": "MAT-1", "snapshot": {"short_answer": "Useful answer"}, "custom": "keep",
    })
    vault.write_markdown(f"{base}/facts.md", "# Facts\n\nA saved fact.\n", {
        "matter_id": "MAT-1", "record_type": "facts", "fact_id": "FACT-1",
    })
    vault.write_markdown(f"{base}/work-items/WI-1.md", "# Review launch\n\nReview the launch.\n", {
        "matter_id": "MAT-1", "work_item_id": "WI-1", "title": "Review launch",
        "status": "open", "owner_id": "alex", "owner": "Alex Kim",
        "ownership_revision": "work-owner-1", "priority": "high", "custom": "keep",
    })
    matters = MatterPaths(vault)
    workspace = WorkspaceFixture(vault, matters)
    adapter = MarkdownOwnerTransfer(vault)
    team = WorkspaceTeamService(
        vault, matters, workspace, SettingsService(vault), transfer_owner=adapter,
    )
    adapter.team = team
    initial = team.roster()
    roster = team.configure({
        "enabled": True,
        "people": [
            {"person_id": "alex", "display_name": "Alex Kim", "specialty": "Product"},
            {"person_id": "jordan", "display_name": "Jordan Lee", "specialty": "Product"},
            {"person_id": "casey", "display_name": "Alex Kim", "specialty": "Product"},
            {"person_id": "taylor", "display_name": "Taylor Singh"},
        ],
        "expected_revision": initial["revision"], "source_action_key": "configure-1",
    })
    return team, adapter, vault, roster


def actor(person_id, name):
    return ActionActor(person_id=person_id, display_name=name, mode="demo")


def handoff_command(team, *, key="handoff-1", work_item_id="WI-1", recipient="jordan"):
    reference_path = team.matters.matter_path("MAT-1") + "/facts.md"
    reference = team.vault.read_markdown(reference_path)
    reference_revision = digest({"content": reference["content"], "metadata": reference["metadata"]})
    return {
        "scope": team.scope("MAT-1", work_item_id=work_item_id),
        "recipient_id": recipient, "ask": "Please own the launch review.",
        "current_basis": "The launch date is fixed.", "open_questions": ["Is consent needed?"],
        "references": [{"reference_id": "FACT-1", "kind": "fact", "path": reference_path,
                        "expected_revision": reference_revision, "title": "Launch facts"}],
        "source_action_key": key,
    }


def action(handoff, name, *, key, reason=""):
    return {
        "action": name, "expected_revision": handoff["revision"],
        "expected_ownership_revision": handoff["scope"]["ownership_revision"],
        "expected_content_revision": handoff["scope"]["content_revision"],
        "reason": reason, "source_action_key": key,
    }


def test_roster_is_explicit_read_only_and_vault_specific(team_fixture, tmp_path):
    team, _, vault, roster = team_fixture
    settings_path = vault.resolve("00_System/settings.md")
    before = settings_path.read_bytes()
    assert team.roster() == roster
    assert settings_path.read_bytes() == before
    assert team.resolve_actor().person_id == "alex"
    assert team.resolve_actor("casey").display_name == "Alex Kim"
    assert team.resolve_actor("taylor").display_name == "Taylor Singh"
    with pytest.raises(ValueError, match="Unknown"):
        team.resolve_actor("missing")
    saved = vault.read_markdown("00_System/settings.md")
    assert saved["content"].startswith("# Custom settings body")
    assert saved["metadata"]["custom_metadata"] == {"keep": True}
    assert saved["metadata"]["values"]["unrelated.flag"] == "keep"

    other_vault = VaultService(tmp_path / "other")
    other = WorkspaceTeamService(
        other_vault, MatterPaths(other_vault), WorkspaceFixture(other_vault, MatterPaths(other_vault)),
        SettingsService(other_vault), transfer_owner=lambda **_: None,
    )
    assert other.roster()["people"] == []
    assert other.roster()["vault_key"] != roster["vault_key"]
    assert not other_vault.exists("00_System/settings.md")


def test_single_lawyer_fallback_and_duplicate_ids_rejected(tmp_path):
    vault = VaultService(tmp_path / "vault")
    settings = SettingsService(vault)
    settings.write({"matters.default_owner": "Solo Lawyer"})
    team = WorkspaceTeamService(vault, MatterPaths(vault), WorkspaceFixture(vault, MatterPaths(vault)), settings, transfer_owner=lambda **_: None)
    assert team.resolve_actor().model_dump() == {
        "person_id": "local-lawyer", "display_name": "Solo Lawyer", "mode": "single",
    }
    with pytest.raises(ValueError, match="disabled"):
        team.resolve_actor("alex")
    current = team.roster()
    with pytest.raises(ValueError, match="unique"):
        team.configure({
            "enabled": True, "people": [
                {"person_id": "alex", "display_name": "One"},
                {"person_id": "alex", "display_name": "Two"},
            ], "expected_revision": current["revision"], "source_action_key": "duplicate",
        })


def test_scope_never_infers_id_from_a_matching_name(team_fixture):
    team, _, vault, _ = team_fixture
    path = team.matters.matter_path("MAT-1") + "/work-items/WI-1.md"
    doc = vault.read_markdown(path)
    doc["metadata"].pop("owner_id")
    doc["metadata"].pop("ownership_revision")
    vault.write_markdown(path, doc["content"], doc["metadata"])
    scope = team.scope("MAT-1", work_item_id="WI-1")
    assert scope["owner_name"] == "Alex Kim"
    assert scope["owner_id"] is None
    assert scope["ownership_revision"] == digest({
        "owner_id": None, "owner_name": "Alex Kim", "assigned_at": None,
        "ownership_action_key": None,
    })


def test_handoff_is_generic_but_only_current_owner_can_send(team_fixture):
    team, _, _, _ = team_fixture
    with pytest.raises(ValueError, match="current owner"):
        team.create_handoff(
            "MAT-1", handoff_command(team, key="wrong-sender"),
            actor=actor("casey", "Alex Kim"),
        )
    no_specialty = team.create_handoff(
        "MAT-1", handoff_command(team, key="no-specialty", recipient="taylor"),
        actor=actor("alex", "Alex Kim"),
    )["handoff"]
    assert no_specialty["state"] == "pending"
    assert no_specialty["recipient"]["specialty"] is None


def test_scoped_accept_freezes_packet_and_only_changes_work_item(team_fixture):
    team, adapter, vault, _ = team_fixture
    created = team.create_handoff("MAT-1", handoff_command(team), actor=actor("alex", "Alex Kim"))
    handoff = created["handoff"]
    assert handoff["state"] == "pending"
    assert handoff["references"][0]["text"] == "# Facts\n\nA saved fact.\n"
    snapshot = vault.read_markdown(handoff["references"][0]["snapshot_path"])
    assert snapshot["metadata"]["immutable"] is True
    assert team.scope("MAT-1", work_item_id="WI-1")["owner_id"] == "alex"

    accepted = team.act_on_handoff(
        "MAT-1", handoff["handoff_id"], action(handoff, "accept", key="accept-1"),
        actor=actor("jordan", "Jordan Lee"),
    )
    assert accepted["handoff"]["state"] == "accepted"
    assert team.scope("MAT-1", work_item_id="WI-1")["owner_id"] == "jordan"
    assert team.scope("MAT-1")["owner_id"] == "alex"
    assert adapter.calls == 1
    assert vault.read_markdown(team.scope("MAT-1", work_item_id="WI-1")["path"])["metadata"]["custom"] == "keep"


def test_handoff_rejects_cross_matter_reference(team_fixture):
    team, _, vault, _ = team_fixture
    other = "03_Matters/other-MAT-2"
    vault.write_markdown(f"{other}/matter.md", "# Other matter\n", {
        "matter_id": "MAT-2", "title": "Other", "status": "active",
    })
    vault.write_markdown(f"{other}/facts.md", "# Other facts\n", {
        "matter_id": "MAT-2", "fact_id": "FACT-OTHER",
    })
    command = handoff_command(team)
    doc = vault.read_markdown(f"{other}/facts.md")
    command["references"] = [{
        "reference_id": "FACT-OTHER", "kind": "fact", "path": f"{other}/facts.md",
        "expected_revision": digest({"content": doc["content"], "metadata": doc["metadata"]}),
    }]
    with pytest.raises(ValueError):
        team.create_handoff("MAT-1", command, actor=actor("alex", "Alex Kim"))


def test_handoff_freezes_plain_text_source_selected_by_path(team_fixture):
    team, _, vault, _ = team_fixture
    path = team.matters.matter_path("MAT-1") + "/documents/launch.txt"
    vault.write_bytes(path, b"Exact supplied source text.\n")
    command = handoff_command(team, key="text-reference")
    command["references"] = [{
        "reference_id": path, "kind": "source", "path": path,
        "expected_revision": digest({"content": "Exact supplied source text.\n", "metadata": {}}),
        "title": "Launch source",
    }]
    handoff = team.create_handoff(
        "MAT-1", command, actor=actor("alex", "Alex Kim"),
    )["handoff"]
    assert handoff["references"][0]["text"] == "Exact supplied source text.\n"
    assert vault.read_markdown(handoff["references"][0]["snapshot_path"])["content"] == "Exact supplied source text.\n"


def test_accept_partial_canonical_commit_retries_without_second_transfer(team_fixture):
    team, adapter, _, _ = team_fixture
    handoff = team.create_handoff("MAT-1", handoff_command(team), actor=actor("alex", "Alex Kim"))["handoff"]
    command = action(handoff, "accept", key="accept-partial")
    adapter.fail_after_canonical_once = True
    partial = team.act_on_handoff("MAT-1", handoff["handoff_id"], command, actor=actor("jordan", "Jordan Lee"))
    assert partial["receipt"]["state"] == "not_saved"
    assert partial["receipt"]["completed_parts"] == ["canonical_owner"]
    assert partial["receipt"]["changed_links"] == [handoff["scope"]["path"]]
    assert partial["handoff"]["state"] == "pending"
    assert team.scope("MAT-1", work_item_id="WI-1")["owner_id"] == "jordan"

    recovered = team.act_on_handoff(
        "MAT-1", handoff["handoff_id"], command,
        actor=actor("unknown-current-viewer", "Removed viewer"),
    )
    assert recovered["receipt"]["state"] == "applied"
    assert recovered["handoff"]["state"] == "accepted"
    assert adapter.calls == 2
    assert adapter.actors == ["jordan", "jordan"]


def test_accept_can_acknowledge_new_content_but_keeps_original_packet(team_fixture):
    team, _, vault, _ = team_fixture
    handoff = team.create_handoff("MAT-1", handoff_command(team), actor=actor("alex", "Alex Kim"))["handoff"]
    path = handoff["scope"]["path"]
    doc = vault.read_markdown(path)
    vault.write_markdown(path, doc["content"] + "\nNew review note.\n", doc["metadata"])
    changed = team.scope("MAT-1", work_item_id="WI-1")
    command = action(handoff, "accept", key="accept-new-content")
    command["expected_content_revision"] = changed["content_revision"]
    accepted = team.act_on_handoff(
        "MAT-1", handoff["handoff_id"], command, actor=actor("jordan", "Jordan Lee"),
    )
    assert accepted["handoff"]["state"] == "accepted"
    assert accepted["handoff"]["scope"]["content_revision"] == handoff["scope"]["content_revision"]
    assert team.scope("MAT-1", work_item_id="WI-1")["content_revision"] == changed["content_revision"]


def test_action_actor_does_not_change_content_revision_but_real_edit_does(team_fixture):
    team, _, vault, _ = team_fixture
    before = team.scope("MAT-1", work_item_id="WI-1")
    path = before["path"]
    document = vault.read_markdown(path)
    document["metadata"]["action_actor"] = actor("jordan", "Jordan Lee").model_dump()
    vault.write_markdown(path, document["content"], document["metadata"])
    attribution_only = team.scope("MAT-1", work_item_id="WI-1")
    assert attribution_only["content_revision"] == before["content_revision"]

    vault.write_markdown(
        path, document["content"] + "\nA substantive review note.\n", document["metadata"],
    )
    edited = team.scope("MAT-1", work_item_id="WI-1")
    assert edited["content_revision"] != before["content_revision"]


def test_newer_same_owner_aba_assignment_conflicts(team_fixture):
    team, _, vault, _ = team_fixture
    handoff = team.create_handoff("MAT-1", handoff_command(team), actor=actor("alex", "Alex Kim"))["handoff"]
    path = team.scope("MAT-1", work_item_id="WI-1")["path"]
    doc = vault.read_markdown(path)
    doc["metadata"].update({
        "owner_id": "alex", "owner": "Alex Kim", "ownership_revision": "newer-aba",
        "ownership_action_key": "direct-newer-assignment",
    })
    vault.write_markdown(path, doc["content"], doc["metadata"])
    with pytest.raises(WorkspaceConflict) as error:
        team.act_on_handoff(
            "MAT-1", handoff["handoff_id"], action(handoff, "accept", key="accept-aba"),
            actor=actor("jordan", "Jordan Lee"),
        )
    assert error.value.detail["code"] == "ownership_conflict"


def test_whole_matter_accept_updates_owner_and_matching_participant(team_fixture):
    team, _, vault, _ = team_fixture
    handoff = team.create_handoff(
        "MAT-1", handoff_command(team, key="matter-handoff", work_item_id=None),
        actor=actor("alex", "Alex Kim"),
    )["handoff"]
    accepted = team.act_on_handoff(
        "MAT-1", handoff["handoff_id"], action(handoff, "accept", key="matter-accept"),
        actor=actor("jordan", "Jordan Lee"),
    )
    assert accepted["handoff"]["state"] == "accepted"
    assert team.scope("MAT-1")["owner_id"] == "jordan"
    assert team.scope("MAT-1", work_item_id="WI-1")["owner_id"] == "alex"
    participants = vault.read_markdown(team.matters.matter_path("MAT-1") + "/participants.md")["metadata"]["participants"]
    assert {"name": "Jordan Lee", "role": "legal_owner", "person_id": "jordan"} in participants
    assert {"name": "Pat Client", "role": "requester"} in participants


def test_decline_withdraw_and_changed_retry_are_actor_safe(team_fixture):
    team, _, _, _ = team_fixture
    first = team.create_handoff("MAT-1", handoff_command(team, key="decline-create"), actor=actor("alex", "Alex Kim"))["handoff"]
    declined = team.act_on_handoff(
        "MAT-1", first["handoff_id"], action(first, "decline", key="decline-1", reason="I am unavailable."),
        actor=actor("jordan", "Jordan Lee"),
    )["handoff"]
    assert declined["state"] == "declined"

    second = team.create_handoff("MAT-1", handoff_command(team, key="withdraw-create"), actor=actor("alex", "Alex Kim"))["handoff"]
    withdrawn = team.act_on_handoff(
        "MAT-1", second["handoff_id"], action(second, "withdraw", key="withdraw-1"),
        actor=actor("alex", "Alex Kim"),
    )["handoff"]
    assert withdrawn["state"] == "withdrawn"
    changed = action(second, "withdraw", key="withdraw-1", reason="changed")
    with pytest.raises(WorkspaceConflict) as error:
        team.act_on_handoff("MAT-1", second["handoff_id"], changed, actor=actor("alex", "Alex Kim"))
    assert error.value.detail["code"] == "action_key_conflict"


def test_return_creates_one_reciprocal_pending_and_original_stays_accepted(team_fixture):
    team, _, _, _ = team_fixture
    original = team.create_handoff("MAT-1", handoff_command(team), actor=actor("alex", "Alex Kim"))["handoff"]
    accepted = team.act_on_handoff(
        "MAT-1", original["handoff_id"], action(original, "accept", key="accept-return"),
        actor=actor("jordan", "Jordan Lee"),
    )["handoff"]
    current = team.scope("MAT-1", work_item_id="WI-1")
    return_command = {
        "action": "return", "expected_revision": accepted["revision"],
        "expected_ownership_revision": current["ownership_revision"],
        "expected_content_revision": current["content_revision"],
        "reason": "Please take this back with my notes.", "source_action_key": "return-1",
    }
    returned = team.act_on_handoff(
        "MAT-1", original["handoff_id"], return_command, actor=actor("jordan", "Jordan Lee"),
    )
    reciprocal = returned["reciprocal_handoff"]
    assert returned["handoff"]["state"] == "accepted"
    assert reciprocal["state"] == "pending"
    assert reciprocal["recipient"]["person_id"] == "alex"
    assert team.scope("MAT-1", work_item_id="WI-1")["owner_id"] == "jordan"
    replay = team.act_on_handoff(
        "MAT-1", original["handoff_id"], return_command, actor=actor("casey", "Alex Kim"),
    )
    assert replay["reciprocal_handoff"]["handoff_id"] == reciprocal["handoff_id"]
    assert len([item for item in team.list_handoffs("MAT-1") if item.get("prior_handoff_id") == original["handoff_id"]]) == 1

    fresh_parent = team._get_handoff("MAT-1", original["handoff_id"])
    second = {
        **return_command, "expected_revision": fresh_parent["revision"],
        "source_action_key": "return-2", "reason": "A second return",
    }
    with pytest.raises(WorkspaceConflict) as error:
        team.act_on_handoff(
            "MAT-1", original["handoff_id"], second,
            actor=actor("jordan", "Jordan Lee"),
        )
    assert error.value.detail["code"] == "action_key_conflict"
    with pytest.raises(WorkspaceConflict):
        team.act_on_handoff(
            "MAT-1", original["handoff_id"], second,
            actor=actor("casey", "Alex Kim"),
        )


def test_return_rejects_reassignment_aba_even_with_refreshed_current_token(team_fixture):
    team, _, vault, _ = team_fixture
    original = team.create_handoff(
        "MAT-1", handoff_command(team, key="return-aba-create"),
        actor=actor("alex", "Alex Kim"),
    )["handoff"]
    accepted = team.act_on_handoff(
        "MAT-1", original["handoff_id"],
        action(original, "accept", key="return-aba-accept"),
        actor=actor("jordan", "Jordan Lee"),
    )["handoff"]
    path = team.scope("MAT-1", work_item_id="WI-1")["path"]
    document = vault.read_markdown(path)
    document["metadata"].update({
        "owner_id": "casey", "owner": "Alex Kim",
        "ownership_revision": "direct-casey-token",
        "ownership_action_key": "direct-casey",
    })
    vault.write_markdown(path, document["content"], document["metadata"])
    document = vault.read_markdown(path)
    document["metadata"].update({
        "owner_id": "jordan", "owner": "Jordan Lee",
        "ownership_revision": "direct-back-to-jordan-token",
        "ownership_action_key": "direct-back-to-jordan",
    })
    vault.write_markdown(path, document["content"], document["metadata"])
    refreshed = team.scope("MAT-1", work_item_id="WI-1")
    assert refreshed["owner_id"] == "jordan"
    assert refreshed["ownership_revision"] != accepted["accepted_ownership_revision"]
    command = {
        "action": "return", "expected_revision": accepted["revision"],
        "expected_ownership_revision": refreshed["ownership_revision"],
        "expected_content_revision": refreshed["content_revision"],
        "reason": "Try to return the obsolete handoff.",
        "source_action_key": "return-after-aba",
    }
    with pytest.raises(WorkspaceConflict) as error:
        team.act_on_handoff(
            "MAT-1", original["handoff_id"], command,
            actor=actor("jordan", "Jordan Lee"),
        )
    assert error.value.detail == {
        "code": "ownership_conflict",
        "message": "The scope was assigned again after this handoff was accepted.",
        "current_revision": "direct-back-to-jordan-token",
        "recoverable": True,
    }
    assert len(team.list_handoffs("MAT-1")) == 1


def test_return_repairs_parent_link_without_duplicate_reciprocal(team_fixture, monkeypatch):
    team, _, vault, _ = team_fixture
    original = team.create_handoff("MAT-1", handoff_command(team), actor=actor("alex", "Alex Kim"))["handoff"]
    accepted = team.act_on_handoff(
        "MAT-1", original["handoff_id"], action(original, "accept", key="accept-parent-failure"),
        actor=actor("jordan", "Jordan Lee"),
    )["handoff"]
    current = team.scope("MAT-1", work_item_id="WI-1")
    command = {
        "action": "return", "expected_revision": accepted["revision"],
        "expected_ownership_revision": current["ownership_revision"],
        "expected_content_revision": current["content_revision"],
        "reason": "Return after review.", "source_action_key": "return-parent-failure",
    }
    original_write = vault.write_markdown
    failed = False

    def fail_parent_link_once(path, content, metadata=None):
        nonlocal failed
        handoff = (metadata or {}).get("handoff", {})
        if (
            not failed and str(path).endswith(f"{original['handoff_id']}.md")
            and handoff.get("return_handoff_id")
        ):
            failed = True
            raise OSError("parent link unavailable")
        return original_write(path, content, metadata)

    monkeypatch.setattr(vault, "write_markdown", fail_parent_link_once)
    partial = team.act_on_handoff(
        "MAT-1", original["handoff_id"], command, actor=actor("jordan", "Jordan Lee"),
    )
    assert partial["receipt"]["state"] == "not_saved"
    assert partial["receipt"]["completed_parts"] == ["reciprocal_handoff"]
    reciprocal_id = partial["reciprocal_handoff"]["handoff_id"]
    recovered = team.act_on_handoff(
        "MAT-1", original["handoff_id"], command, actor=actor("casey", "Alex Kim"),
    )
    assert recovered["receipt"]["state"] == "applied"
    assert recovered["handoff"]["return_handoff_id"] == reciprocal_id
    assert len([item for item in team.list_handoffs("MAT-1") if item.get("prior_handoff_id") == original["handoff_id"]]) == 1


def test_person_seen_state_is_isolated_and_get_does_not_write(team_fixture):
    team, _, vault, _ = team_fixture
    path = vault.resolve(team.matters.matter_path("MAT-1") + "/workspace.md")
    before = path.read_bytes()
    alex = actor("alex", "Alex Kim")
    jordan = actor("jordan", "Jordan Lee")
    assert team.seen("MAT-1", actor=alex)["revision"] is None
    assert path.read_bytes() == before
    revision = team.workspace.recap("MAT-1")["current_revision"]
    source_revisions = team.workspace.source_revisions("MAT-1")
    marked = team.mark_seen("MAT-1", actor=alex, expected_revision=revision)
    assert marked["revision"] == revision
    assert team.seen("MAT-1", actor=jordan)["revision"] is None
    assert team.workspace.recap("MAT-1")["current_revision"] == revision
    assert team.workspace.source_revisions("MAT-1") == source_revisions
    assert vault.read_markdown(team.matters.matter_path("MAT-1") + "/workspace.md")["metadata"]["custom"] == "keep"


def test_queue_transitions_use_ids_and_keep_work_incomplete(team_fixture):
    team, _, _, _ = team_fixture
    alex = actor("alex", "Alex Kim")
    jordan = actor("jordan", "Jordan Lee")
    handoff = team.create_handoff("MAT-1", handoff_command(team), actor=alex)["handoff"]
    assert any(item["handoff_id"] == handoff["handoff_id"] for item in team.queue(actor=jordan, view="my_work"))
    waiting = team.queue(actor=alex, view="waiting")
    assert any(item["state"] == "waiting" and item["handoff_id"] == handoff["handoff_id"] for item in waiting)
    assert team.scope("MAT-1", work_item_id="WI-1")["status"] == "open"
    assert team.queue(actor=alex, view="team")


def test_handoff_reference_route_skips_internal_review_history(app_context, monkeypatch):
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from app.routers import workspace, files
    ctx = app_context
    matter_id = "MAT-DEMO-RELAY"
    base = ctx.matters.matter_path(matter_id)
    current = f"{base}/drafts/current.md"
    archive = f"{base}/drafts/.history/current/{'a' * 64}.md"
    hidden = f"{base}/sources/.private/supplied.md"
    for path in [current, archive, hidden]:
        ctx.vault.write_markdown(path, "Complete saved text.", {"matter_id": matter_id, "record_type": "work_product_revision" if path == archive else "work_product"})
    before = {path: ctx.vault.resolve(path).read_bytes() for path in [current, archive, hidden]}
    read = ctx.vault.read_document
    parsed = []
    def counted(path):
        parsed.append(path)
        assert path != archive, "the default handoff picker must skip archive bytes before parsing"
        return read(path)
    monkeypatch.setattr(ctx.vault, "read_document", counted)
    app = FastAPI()
    app.state.context = ctx
    app.include_router(workspace.router, prefix="/api")
    app.include_router(files.router, prefix="/api")
    with TestClient(app) as client:
        result = client.get(f"/api/matters/{matter_id}/workspace/handoff-references")
        assert result.status_code == 200, result.text
        paths = {item["path"] for item in result.json()}
        assert current in paths and hidden in paths and archive not in paths
        assert archive not in parsed
        monkeypatch.setattr(ctx.vault, "read_document", read)
        direct = client.get("/api/files", params={"path": archive})
        assert direct.status_code == 200 and "Complete saved text." in direct.json()["content"]
    assert {path: ctx.vault.resolve(path).read_bytes() for path in before} == before
