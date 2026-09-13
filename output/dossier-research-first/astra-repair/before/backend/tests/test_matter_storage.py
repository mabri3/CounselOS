import pytest
from app.services.matter_storage import MatterStorageService

ID = "MAT-DEMO-BEACON"


def test_archive_restore_preserves_stage_and_hides_tasks(app_context):
    service = MatterStorageService(app_context)
    before = app_context.index.get_matter(ID)
    service.change(ID, "archive")
    assert ID not in {m["matter_id"] for m in app_context.index.list_matters()}
    assert ID in {m["matter_id"] for m in service.list("archived")}
    assert app_context.index.get_matter(ID)["status"] == before["status"]
    assert not any(w["matter_id"] == ID for w in app_context.index.list_work_items())
    service.change(ID, "restore")
    assert ID in {m["matter_id"] for m in app_context.index.list_matters()}
    assert app_context.index.get_matter(ID)["status"] == before["status"]


def test_trash_restore_preserves_all_child_bytes_and_search(app_context):
    service = MatterStorageService(app_context)
    path = app_context.index.get_matter(ID)["path"]
    root = app_context.vault.resolve(path)
    app_context.vault.write_bytes(f"{path}/unique.txt", b"uniquetrashneedle")
    before = {str(p.relative_to(root)): p.read_bytes() for p in root.rglob("*") if p.is_file() and p.name != "matter.md"}
    service.change(ID, "trash")
    assert not root.exists()
    assert app_context.index.get_matter(ID) is None
    assert service.list("trash")[0]["matter_id"] == ID
    assert not app_context.index.lexical_search("uniquetrashneedle")
    assert not app_context.vault.lexical_search("uniquetrashneedle")
    app_context.index.rebuild()
    service.change(ID, "restore")
    assert before == {str(p.relative_to(root)): p.read_bytes() for p in root.rglob("*") if p.is_file() and p.name != "matter.md"}
    assert app_context.index.lexical_search("uniquetrashneedle")
    assert not service.list("trash")


def test_restore_collision_never_overwrites(app_context):
    service = MatterStorageService(app_context)
    path = app_context.index.get_matter(ID)["path"]
    service.change(ID, "trash")
    app_context.vault.write_bytes(f"{path}/keep.txt", b"keep")
    with pytest.raises(ValueError, match="already exists"):
        service.change(ID, "restore")
    assert app_context.vault.read_text(f"{path}/keep.txt") == "keep"
    assert service.list("trash")


def test_active_run_prevents_storage_change(app_context):
    service = MatterStorageService(app_context)
    path = app_context.index.get_matter(ID)["path"]
    app_context.vault.write_markdown(f"{path}/conversations/runs/RUN-test.md", "Running", {
        "record_type": "chat_run", "matter_id": ID, "run_id": "RUN-test", "state": "running"})
    with pytest.raises(ValueError, match="Work is running"):
        service.change(ID, "trash")
    assert app_context.vault.exists(path)


@pytest.mark.parametrize("matter_id", ["../other", "/tmp", "x/y", ".."])
def test_invalid_ids(app_context, matter_id):
    with pytest.raises(ValueError):
        MatterStorageService(app_context).change(matter_id, "trash")


def test_repeat_and_archive_then_trash(app_context):
    service = MatterStorageService(app_context)
    for action in ("archive", "archive", "trash", "trash", "restore", "restore"):
        service.change(ID, action)
    assert ID in {m["matter_id"] for m in service.list("active")}


def test_bad_restore_location_keeps_trash(app_context):
    service = MatterStorageService(app_context)
    service.change(ID, "trash")
    app_context.vault.update_markdown(f"99_Trash/{ID}/matter.md", metadata_updates={"trashed_from": "../outside"})
    with pytest.raises(ValueError):
        service.change(ID, "restore")
    assert app_context.vault.exists(f"99_Trash/{ID}/matter.md")


def test_failed_rebuild_rolls_back_move(app_context, monkeypatch):
    service = MatterStorageService(app_context)
    path = app_context.index.get_matter(ID)["path"]
    original = app_context.vault.resolve(f"{path}/matter.md").read_bytes()
    rebuild = app_context.index.rebuild
    calls = 0
    def fail_once():
        nonlocal calls
        calls += 1
        if calls == 1:
            raise OSError("index failed")
        return rebuild()
    monkeypatch.setattr(app_context.index, "rebuild", fail_once)
    with pytest.raises(OSError, match="index failed"):
        service.change(ID, "trash")
    assert app_context.vault.resolve(f"{path}/matter.md").read_bytes() == original
    assert app_context.index.get_matter(ID)
    assert not service.list("trash")


def test_symlink_trash_destination_is_rejected(app_context):
    root = app_context.vault.root
    (root / "redirected-trash").mkdir()
    (root / "99_Trash").symlink_to(root / "redirected-trash", target_is_directory=True)
    with pytest.raises(ValueError, match="symbolic links"):
        MatterStorageService(app_context).change(ID, "trash")
    assert app_context.index.get_matter(ID)
    assert not list((root / "redirected-trash").iterdir())


@pytest.mark.asyncio
async def test_archived_and_trashed_schedules_skip(app_context):
    from app.models.api import ScheduleCreate
    schedule = app_context.scheduler.create(ScheduleCreate(title="Matter work", agent_id="counsel-copilot", instructions="Review", matter_id=ID, interval_seconds=600))
    service = MatterStorageService(app_context)
    for action in ("archive", "trash"):
        service.change(ID, action)
        assert (await app_context.scheduler.run(schedule["schedule_id"]))["status"] == "skipped"


def test_http_storage_routes(app_context):
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from app.routers import matters
    app = FastAPI()
    app.state.context = app_context
    app.include_router(matters.router, prefix="/api")
    with TestClient(app) as client:
        assert client.get("/api/matters/storage").status_code == 200
        assert client.post(f"/api/matters/{ID}/storage", json={"action": "trash"}).status_code == 200
        assert client.get("/api/matters/storage?view=trash").json()["matters"][0]["matter_id"] == ID
        assert client.get(f"/api/matters/{ID}").status_code == 404
        assert client.post(f"/api/matters/{ID}/storage", json={"action": "restore"}).status_code == 200
        assert client.get(f"/api/matters/{ID}").status_code == 200
        assert client.post(f"/api/matters/{ID}/storage", json={"action": "delete"}).status_code == 422
