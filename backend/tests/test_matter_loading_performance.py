from unittest.mock import patch


def test_matter_and_workspace_lists_do_not_decode_execution_records(app_context):
    matter_id = "MAT-DEMO-RELAY"
    vault = app_context.vault
    base = app_context.matters.matter_path(matter_id)
    internal = {
        f"{base}/research/runs/RUN-internal.md",
        f"{base}/research/dossier-requests/DOR-internal.md",
    }
    for path in internal:
        vault.write_markdown(path, "# Saved execution details", {"large_snapshot": "retained"})
    original = vault.read_markdown

    def read(path, **kwargs):
        assert str(path) not in internal or kwargs.get("include_execution") is False, "A navigation list decoded full execution inputs"
        return original(path, **kwargs)

    with patch.object(vault, "read_markdown", side_effect=read):
        matter = app_context.matters.get(matter_id)
        documents = app_context.workspace_review.documents(matter_id)
        from app.routers.workspace import get_workspace
        get_workspace(matter_id, app_context)
    assert matter["matter_id"] == matter_id
    assert documents
    assert not internal.intersection(item["path"] for item in documents)
    assert all(vault.exists(path) for path in internal)
