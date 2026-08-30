from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.models.api import MatterCreate
from app.routers import matters


def test_work_item_complete_api_requires_actor_and_returns_frozen_shape(app_context):
    app = FastAPI()
    app.state.context = app_context
    app.include_router(matters.router, prefix="/api")
    client = TestClient(app)
    matter = app_context.matters.create(MatterCreate(title="API lifecycle", request_text="Do work."))
    item = app_context.index.list_work_items(matter["matter_id"])[0]
    response = client.post(f"/api/matters/{matter['matter_id']}/work-items/complete", json={"work_item_id": item["work_item_id"], "actor": "Counsel"})
    assert response.status_code == 200
    assert response.json()["action"] == "complete_work_item"
    assert response.json()["work_item_id"] == item["work_item_id"]
    assert client.post(f"/api/matters/{matter['matter_id']}/work-items/complete", json={"work_item_id": item["work_item_id"]}).status_code == 422

