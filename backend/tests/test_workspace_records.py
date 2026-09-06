from __future__ import annotations

import pytest
from app.services.workspace import WorkspaceService, WorkspaceConflict

MATTER = "MAT-DEMO-RELAY"


@pytest.fixture
def service(app_context):
    return WorkspaceService(app_context.vault, app_context.matters, app_context.dossiers, app_context.matter_records)


def command(service, text="Which settlement structure should we use?", key="change-1"):
    return {"text": text, "expected_revision": service.business_question(MATTER)["revision"],
            "source_action_key": key, "source_message_id": "message-1"}


def test_legacy_get_is_nonmutating_and_unknown_origin(service):
    before = {p: p.read_bytes() for p in service.vault.iter_files(service.matters.matter_path(MATTER))}
    first = service.get(MATTER)
    assert first["question"]["origin"] == "legacy_unknown"
    assert first["question"]["source_message_id"] is None
    assert service.get(MATTER) == first
    assert {p: p.read_bytes() for p in service.vault.iter_files(service.matters.matter_path(MATTER))} == before


def test_explicit_change_and_retry_are_one_atomic_question_and_receipt(service):
    request_before = service.matters.get(MATTER)["original_request"]
    original = service.business_question(MATTER)
    data = command(service)
    receipt = service.change_business_question(MATTER, data)
    assert receipt["state"] == "applied"
    assert service.change_business_question(MATTER, data) == receipt
    question = service.business_question(MATTER)
    assert question["text"] == data["text"]
    assert question["question_id"] == original["question_id"]
    assert question["origin"] == "explicit_lawyer"
    assert service.dossiers.orientation(MATTER)["decision_question"] == data["text"]
    assert len(service.get(MATTER)["receipts"]) == 1
    assert service.matters.get(MATTER)["original_request"] == request_before
    with pytest.raises(WorkspaceConflict, match="action key"):
        service.change_business_question(MATTER, {**data, "text": "Different"})


def test_direct_markdown_edit_changes_revision_before_reconciliation(service):
    service.change_business_question(MATTER, command(service))
    old = command(service, key="stale")
    doc = service.dossiers.get(MATTER)
    service.vault.update_markdown(doc["path"], content=service.dossiers._set_section(doc["content"], "Decision question", r"How does C:\new\1 affect scope?"))
    current = service.business_question(MATTER)
    assert current["revision"] != old["expected_revision"]
    assert current["origin"] == "explicit_lawyer"
    assert current["source_message_id"] is None
    assert service.dossiers.orientation(MATTER)["decision_question"] == current["text"]
    with pytest.raises(WorkspaceConflict):
        service.change_business_question(MATTER, old)


def test_propose_reject_reload_and_late_orientation_preserve_question(service):
    before = service.business_question(MATTER)
    proposed = service.propose_business_question(MATTER, command(service, key="proposal-1"))
    assert proposed["state"] == "proposed"
    assert service.business_question(MATTER) == before
    reject = {"action": "reject", "expected_revision": before["revision"], "source_action_key": "reject-1"}
    receipt = service.act_on_proposal(MATTER, proposed["proposal_id"], reject)
    assert service.act_on_proposal(MATTER, proposed["proposal_id"], reject) == receipt
    service.dossiers.update_orientation(MATTER, summary="New findings", decision_question="Change scope?", open_questions=[], research_path="review.md")
    assert service.business_question(MATTER)["text"] == before["text"]
    assert service.get(MATTER)["question_changes"][0]["state"] == "rejected"


def test_proposal_apply_changes_only_question_and_retry_is_idempotent(service):
    proposed = service.propose_business_question(MATTER, command(service, key="proposal-apply"))
    doc = service.dossiers.get(MATTER)
    service.vault.update_markdown(doc["path"], content=doc["content"] + "\n\n## Lawyer note\n\nKeep this note.")
    apply = {"action": "apply", "expected_revision": service.business_question(MATTER)["revision"], "source_action_key": "apply-1"}
    receipt = service.act_on_proposal(MATTER, proposed["proposal_id"], apply)
    assert service.act_on_proposal(MATTER, proposed["proposal_id"], apply) == receipt
    assert "Keep this note." in service.dossiers.get(MATTER)["content"]
    assert service.business_question(MATTER)["origin"] == "accepted_proposal"


def test_stale_proposal_cannot_apply_even_with_fresh_command_revision(service):
    proposal = service.propose_business_question(MATTER, command(service, key="stale-proposal"))
    service.change_business_question(MATTER, command(service, "Newer lawyer question", "newer"))
    with pytest.raises(WorkspaceConflict):
        service.act_on_proposal(MATTER, proposal["proposal_id"], {"action": "apply", "expected_revision": service.business_question(MATTER)["revision"], "source_action_key": "apply-stale"})
    assert service.business_question(MATTER)["text"] == "Newer lawyer question"


def test_restore_creates_new_revision_preserves_history_and_other_records(service):
    old = service.business_question(MATTER)
    service.change_business_question(MATTER, command(service))
    before = service.business_question(MATTER)
    data = {"revision": old["revision"], "expected_revision": before["revision"], "source_action_key": "restore-1"}
    receipt = service.restore_business_question(MATTER, data)
    assert service.restore_business_question(MATTER, data) == receipt
    current = service.business_question(MATTER)
    assert current["text"] == old["text"]
    assert current["revision"] not in {old["revision"], before["revision"]}
    assert len(service.question_history(MATTER)) == 3


def test_late_intake_research_and_whole_dossier_apply_preserve_lawyer_scope(service):
    old_hash = service.dossiers.content_hash(MATTER)
    old_revision = service.business_question(MATTER)["revision"]
    service.change_business_question(MATTER, command(service))
    current = service.dossiers.get(MATTER)
    service.vault.update_markdown(current["path"], metadata_updates={"custom_lawyer_field": {"x": 1}})
    result = service.dossiers.update_orientation(MATTER, summary="Old-scope summary", decision_question="Old scope", open_questions=[], research_path="old-result.md", expected_question_revision=old_revision)
    assert result["state"] == "historical"
    assert "Old-scope summary" in service.vault.read_markdown(result["revision_path"])["content"]
    assert "Old-scope summary" not in service.dossiers.get(MATTER)["content"]
    intake = service.dossiers.update_from_intake(MATTER, working_ask="Original intake question", facts=[], assumptions=[], issues=[], open_questions=[], orientation="Late intake", expected_hash=old_hash)
    service.dossiers.apply_revision(MATTER, intake["revision_path"], expected_hash=service.dossiers.content_hash(MATTER))
    assert service.business_question(MATTER)["text"] == "Which settlement structure should we use?"
    assert service.dossiers.get(MATTER)["metadata"]["custom_lawyer_field"] == {"x": 1}


def test_atomic_question_failure_retry_keeps_original_and_one_history(service, monkeypatch):
    data = command(service)
    old = service.business_question(MATTER)
    write = service.vault.write_markdown
    def fail(path, content, metadata=None):
        if path.endswith("/dossier.md"):
            raise OSError("Disk full")
        return write(path, content, metadata)
    monkeypatch.setattr(service.vault, "write_markdown", fail)
    with pytest.raises(OSError):
        service.change_business_question(MATTER, data)
    assert service.business_question(MATTER) == old
    monkeypatch.setattr(service.vault, "write_markdown", write)
    service.change_business_question(MATTER, data)
    assert len(service.question_history(MATTER)) == 2
    assert len(service.get(MATTER)["receipts"]) == 1


def setup_question(service):
    question = service.business_question(MATTER)
    return service.save_question(MATTER, {"question_id": "WQ-account-control", "business_question_id": question["question_id"], "business_question_revision": question["revision"], "text": "Who controls the account?"})


def test_supporting_answer_links_reported_fact_same_question_and_retry(service):
    question = setup_question(service)
    data = {"expected_revision": question["source_revision"], "source_action_key": "answer-1", "source_message_id": "message-answer", "state": "answered", "answer": "The partner bank controls it."}
    receipt = service.answer_question(MATTER, question["question_id"], data)
    assert service.answer_question(MATTER, question["question_id"], data) == receipt
    saved = service.questions(MATTER)[0]
    assert saved["question_id"] == question["question_id"]
    assert saved["answer_origin"] == "reported"
    assert saved["source_message_id"] == "message-answer"
    assert len(saved["linked_fact_ids"]) == 1
    record = service.records.get(MATTER)
    assert any(f["fact_id"] == saved["linked_fact_ids"][0] and f["source_ids"] == ["message-answer"] for f in record["facts"])
    assert all(n["lawyer_state"] == "open" for n in service.issues(MATTER))


def test_supporting_partial_write_retry_does_not_duplicate_fact(service, monkeypatch):
    question = setup_question(service)
    data = {"expected_revision": question["source_revision"], "source_action_key": "partial-answer", "state": "answered", "answer": "The partner bank."}
    write = service.vault.write_markdown
    def fail(path, content, metadata=None):
        if path.endswith("/workspace.md"):
            raise OSError("Question write failed")
        return write(path, content, metadata)
    monkeypatch.setattr(service.vault, "write_markdown", fail)
    receipt = service.answer_question(MATTER, question["question_id"], data)
    assert receipt["state"] == "not_saved"
    assert receipt["completed_parts"] == ["reported_fact"]
    assert service.questions(MATTER)[0]["state"] == "open"
    count = len(service.records.get(MATTER)["facts"])
    monkeypatch.setattr(service.vault, "write_markdown", write)
    assert service.answer_question(MATTER, question["question_id"], data)["state"] == "applied"
    assert len(service.records.get(MATTER)["facts"]) == count


def test_leave_open_is_durable_without_facts(service):
    question = setup_question(service)
    before = service.vault.read_text(service.records._path(MATTER))
    service.answer_question(MATTER, question["question_id"], {"expected_revision": question["source_revision"], "source_action_key": "unknown-1", "state": "left_open"})
    assert service.questions(MATTER)[0]["state"] == "left_open"
    assert service.vault.read_text(service.records._path(MATTER)) == before


def test_issue_duplicates_rename_reorder_and_partial_metadata(service):
    path = service._path(MATTER, "issues.md")
    service.vault.write_markdown(path, "# Issues\n\nLawyer prose.\n\n- Same label\n- Same label\n\n## Notes\n\nKeep me.", {"matter_id": MATTER, "custom": "retain"})
    before = service.vault.read_text(path)
    nodes = service.issues(MATTER)
    assert len(nodes) == 2 and nodes[0]["issue_id"] != nodes[1]["issue_id"]
    assert service.vault.read_text(path) == before
    nodes[1]["title"] = "Renamed issue"
    service.save_issues(MATTER, list(reversed(nodes)), expected_revision=service.issues_revision(MATTER))
    saved = service.issues(MATTER)
    assert [n["issue_id"] for n in saved] == [nodes[1]["issue_id"], nodes[0]["issue_id"]]
    doc = service.vault.read_markdown(path)
    assert "Lawyer prose." in doc["content"] and "Keep me." in doc["content"]
    assert doc["metadata"]["custom"] == "retain"
    service.vault.update_markdown(path, metadata_updates={"issue_nodes": {}})
    assert [n["issue_id"] for n in service.issues(MATTER)] == [n["issue_id"] for n in saved]


def test_issue_cycles_cross_matter_ids_and_stale_revision_rejected(service):
    nodes = service.issues(MATTER)
    assert len(nodes) >= 2
    revision = service.issues_revision(MATTER)
    nodes[0]["parent_issue_id"] = nodes[1]["issue_id"]
    nodes[1]["parent_issue_id"] = nodes[0]["issue_id"]
    with pytest.raises(ValueError, match="cycle"):
        service.save_issues(MATTER, nodes, expected_revision=revision)
    nodes = service.issues(MATTER)
    nodes[0]["issue_id"] = service.issues("MAT-DEMO-APEX")[0]["issue_id"]
    with pytest.raises(ValueError, match="existing issue IDs"):
        service.save_issues(MATTER, nodes, expected_revision=revision)
    with pytest.raises(WorkspaceConflict):
        service.save_issues(MATTER, service.issues(MATTER), expected_revision="stale")


def test_target_cross_matter_vault_escape_and_stale_range(service):
    for path in ("../outside.md", "03_Matters/project-apex-ai/matter.md"):
        with pytest.raises(ValueError):
            service.validate_target(MATTER, {"matter_id": MATTER, "artifact_path": path})
    doc = service.dossiers.get(MATTER)
    target = {"matter_id": MATTER, "artifact_path": doc["path"], "artifact_revision": service.dossiers._hash(doc["content"]), "selected_range": {"start": 0, "end": 8, "text": "mismatch"}}
    with pytest.raises(WorkspaceConflict, match="passage"):
        service.validate_target(MATTER, target, mutation=True)
    target["selected_range"] = {"start": 0, "end": 8, "text": doc["content"][:8]}
    assert service.validate_target(MATTER, target, mutation=True)["artifact_path"] == doc["path"]
    target["artifact_revision"] = "stale"
    with pytest.raises(WorkspaceConflict):
        service.validate_target(MATTER, target, mutation=True)


def test_recap_is_deterministic_reload_safe_and_seen_does_not_change_sources(service):
    before = service.source_revisions(MATTER)
    recap = service.recap(MATTER)
    assert recap == service.recap(MATTER)
    seen = service.mark_seen(MATTER, expected_revision=recap["current_revision"])
    assert seen["changes"] == []
    assert service.source_revisions(MATTER) == before
    service.change_business_question(MATTER, command(service))
    changed = service.recap(MATTER)
    assert changed["previous_seen_revision"] == recap["current_revision"]
    assert any(c["path"] == "business_question" for c in changed["changes"])
    with pytest.raises(WorkspaceConflict):
        service.mark_seen(MATTER, expected_revision=recap["current_revision"])


def test_recap_detects_custom_folder_work_product_and_edited_version(service):
    path = service._path(MATTER, "custom-output/legal/memo.md")
    service.vault.write_markdown(path, "First memo", {"matter_id": MATTER, "record_type": "work_product", "work_product_id": "WP-test"})
    first = service.recap(MATTER)
    assert path in first["new_outputs"]
    service.mark_seen(MATTER, expected_revision=first["current_revision"])
    assert path not in service.recap(MATTER)["new_outputs"]
    service.vault.update_markdown(path, content="Edited memo")
    assert path in service.recap(MATTER)["new_outputs"]


def test_partial_retry_rejects_changed_answer_under_same_action_key(service, monkeypatch):
    question = setup_question(service)
    data = {"expected_revision": question["source_revision"], "source_action_key": "partial-conflict", "state": "answered", "answer": "The bank."}
    write = service.vault.write_markdown
    def fail(path, content, metadata=None):
        if path.endswith("/workspace.md"):
            raise OSError("Question write failed")
        return write(path, content, metadata)
    monkeypatch.setattr(service.vault, "write_markdown", fail)
    assert service.answer_question(MATTER, question["question_id"], data)["state"] == "not_saved"
    monkeypatch.setattr(service.vault, "write_markdown", write)
    with pytest.raises(WorkspaceConflict, match="different answer"):
        service.answer_question(MATTER, question["question_id"], {**data, "answer": "The customer."})


def test_direct_issue_reorder_retains_ids_without_metadata(service):
    nodes = service.issues(MATTER)
    service.save_issues(MATTER, nodes, expected_revision=service.issues_revision(MATTER))
    doc = service._document(MATTER, "issues.md")
    lines = doc["content"].splitlines()
    indexed = [(i, line) for i, line in enumerate(lines) if "<!-- issue:" in line]
    lines[indexed[0][0]], lines[indexed[1][0]] = indexed[1][1], indexed[0][1]
    service.vault.update_markdown(doc["path"], content="\n".join(lines), metadata_updates={"issue_nodes": {nodes[0]["issue_id"]: {"lawyer_state": "invalid", "parent_issue_id": 7}}})
    current = service.issues(MATTER)
    assert current[0]["issue_id"] == nodes[1]["issue_id"]
    assert current[1]["issue_id"] == nodes[0]["issue_id"]
    assert current[1]["lawyer_state"] == "open"


def test_source_revision_uses_actual_source_file_content(service):
    path = service._path(MATTER, "sources/letter.txt")
    service.vault.write_bytes(path, b"Original")
    service.records.apply_update(MATTER, sources=[{"source_id": "SRC-letter", "kind": "file", "path": path, "version": "supplied-v1"}])
    original = service.source_revisions(MATTER)[path]
    service.vault.write_bytes(path, b"Direct edit")
    assert service.source_revisions(MATTER)[path] != original


@pytest.mark.parametrize("metadata", [
    ["bad"], "bad", 7, None,
    {"origin": "unknown"}, {"origin": None}, {"origin": ["bad"]},
    {"question_id": ["bad"], "revision_id": {"bad": True}, "text_hash": ["bad"],
     "origin": {"bad": True}, "source_message_id": {"bad": True},
     "source_action_key": ["bad"], "updated_at": 7},
    {"question_id": None, "revision_id": None, "text_hash": None,
     "origin": None, "source_message_id": None, "source_action_key": None, "updated_at": None},
])
def test_malformed_business_question_metadata_is_readable_without_rewrite(service, metadata):
    doc = service.dossiers.get(MATTER)
    expected_text = service.dossiers.section(doc["content"], "Decision question")
    service.vault.update_markdown(doc["path"], metadata_updates={"business_question": metadata})
    before = service.vault.read_text(doc["path"])
    question = service.business_question(MATTER)
    assert question["text"] == expected_text
    assert question["question_id"].startswith("BQ-")
    assert question["revision"].startswith("legacy:")
    assert question["origin"] == "legacy_unknown"
    assert question["source_message_id"] is None
    assert question["source_action_key"] is None
    assert question["updated_at"] is None
    assert service.get(MATTER)["question"] == question
    assert service.vault.read_text(doc["path"]) == before
    # The dossier publication path delegates its question revision read to this
    # projection; a valid explicit command can replace malformed ownership data.
    result = service.dossiers.update_orientation(
        MATTER, summary="Useful historical answer", decision_question="Another scope",
        open_questions=[], research_path="review.md", expected_question_revision="earlier-scope",
    )
    assert result["state"] == "historical"
    assert service.vault.read_text(doc["path"]) == before
    receipt = service.change_business_question(MATTER, command(service, key="repair-explicit"))
    assert receipt["state"] == "applied"
    assert service.business_question(MATTER)["origin"] == "explicit_lawyer"


@pytest.mark.parametrize("local_snapshot", [None, "Short local draft"])
@pytest.mark.parametrize("case", ["both_beyond_end", "oversized_end"])
def test_target_rejects_range_outside_saved_or_local_document(service, local_snapshot, case):
    doc = service.dossiers.get(MATTER)
    text = local_snapshot if local_snapshot is not None else doc["content"]
    selected = ({"start": len(text) + 20, "end": len(text) + 30, "text": ""}
                if case == "both_beyond_end" else {"start": 0, "end": len(text) + 30, "text": text})
    target = {"matter_id": MATTER, "artifact_path": doc["path"],
              "artifact_revision": service.dossiers._hash(doc["content"]),
              "selected_range": selected, "local_draft_snapshot": local_snapshot}
    with pytest.raises(WorkspaceConflict, match="passage"):
        service.validate_target(MATTER, target, mutation=True)


@pytest.mark.parametrize("failure", ["disappeared", "unreadable", "invalid_yaml", "invalid_mapping", "invalid_utf8"])
def test_optional_output_read_failure_keeps_saved_workspace_answer(service, monkeypatch, failure):
    good_path = service._path(MATTER, "custom-output/good-memo.md")
    bad_path = service._path(MATTER, "decisions/DEC-optional.md")
    service.vault.write_markdown(good_path, "Useful memo", {"matter_id": MATTER, "record_type": "work_product", "work_product_id": "WP-good"})
    service.vault.write_markdown(bad_path, "Optional details", {"matter_id": MATTER, "record_type": "decision"})
    workspace_path = service._path(MATTER)
    service.vault.write_markdown(workspace_path, "# Workspace", {"matter_id": MATTER, "snapshot": {"short_answer": "The conditional answer remains useful.", "answer_links": [good_path]}})
    if failure in {"invalid_yaml", "invalid_mapping", "invalid_utf8"}:
        malformed = {"invalid_yaml": b"---\nkey: [broken\n---\nOptional details", "invalid_mapping": b"---\n- bad\n---\nOptional details", "invalid_utf8": b"\xff\xfe"}[failure]
        service.vault.write_bytes(bad_path, malformed)
    else:
        read = service.vault.read_markdown
        def fail_optional(path):
            if str(path) == bad_path:
                raise (FileNotFoundError("disappeared") if failure == "disappeared" else PermissionError("unreadable"))
            return read(path)
        monkeypatch.setattr(service.vault, "read_markdown", fail_optional)
    before = {p: p.read_bytes() for p in service.vault.iter_files(service.matters.matter_path(MATTER))}
    snapshot = service.get(MATTER)
    assert snapshot["question"]["text"]
    assert snapshot["short_answer"] == "The conditional answer remains useful."
    assert good_path in snapshot["answer_links"]
    assert good_path in snapshot["recap"]["new_outputs"]
    assert bad_path not in snapshot["recap"]["new_outputs"]
    assert snapshot["recap"]["output_read_failures"] == [{"path": bad_path, "state": "unavailable", "message": "Could not read this optional file."}]
    assert {p: p.read_bytes() for p in service.vault.iter_files(service.matters.matter_path(MATTER))} == before


def test_seen_cursor_keeps_unreadable_output_history_until_retry(service, monkeypatch):
    path = service._path(MATTER, "custom-output/saved-memo.md")
    service.vault.write_markdown(path, "Saved memo", {"matter_id": MATTER, "record_type": "work_product", "work_product_id": "WP-seen"})
    service.mark_seen(MATTER, expected_revision=service.recap(MATTER)["current_revision"])
    read = service.vault.read_markdown
    def temporarily_unreadable(candidate):
        if str(candidate) == path:
            raise PermissionError("temporarily unreadable")
        return read(candidate)
    monkeypatch.setattr(service.vault, "read_markdown", temporarily_unreadable)
    incomplete = service.recap(MATTER)
    assert path not in incomplete["new_outputs"]
    service.mark_seen(MATTER, expected_revision=incomplete["current_revision"])
    monkeypatch.setattr(service.vault, "read_markdown", read)
    assert path not in service.recap(MATTER)["new_outputs"]


def test_output_discovery_skips_review_archives_before_parsing(service, monkeypatch):
    current = service._path(MATTER, "drafts/current.md")
    hidden = service._path(MATTER, "drafts/.private/supplied.md")
    archives = [service._path(MATTER, f"drafts/.history/current/{index:064x}.md") for index in range(12)]
    metadata = {"matter_id": MATTER, "record_type": "work_product", "work_product_id": "WP-current"}
    for path in [current, hidden, *archives]:
        service.vault.write_markdown(path, "Useful complete text.", metadata)
    before = {path: service.vault.resolve(path).read_bytes() for path in [current, hidden, *archives]}
    read = service.vault.read_markdown
    parsed = []
    def counted(path):
        parsed.append(str(path))
        assert str(path) not in archives, "default output discovery must skip archive bytes before parsing"
        return read(path)
    monkeypatch.setattr(service.vault, "read_markdown", counted)
    failures = []
    outputs = service._output_revisions(MATTER, failures=failures)
    assert current in outputs and hidden in outputs
    assert not set(archives) & set(outputs)
    assert not set(archives) & set(parsed)
    assert not failures
    monkeypatch.setattr(service.vault, "read_markdown", read)
    assert read(archives[0])["content"].strip() == "Useful complete text."
    assert {path: service.vault.resolve(path).read_bytes() for path in before} == before
