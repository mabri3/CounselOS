from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse

from app.models.api import FileUpdate
from app.routers.dependencies import get_context
from app.runtime import AppContext


router = APIRouter(prefix="/files", tags=["files"])


@router.get("/tree")
def tree(
    path: str = Query(default=""),
    context: AppContext = Depends(get_context),
):
    try:
        return {"tree": context.vault.list_tree(path)}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/raw")
def raw_file(
    path: str = Query(...),
    context: AppContext = Depends(get_context),
):
    try:
        resolved = context.vault.resolve(path)
        if not resolved.is_file():
            raise FileNotFoundError(path)
        return FileResponse(resolved)
    except (ValueError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("")
def read_file(
    path: str = Query(...),
    context: AppContext = Depends(get_context),
):
    try:
        return context.vault.read_document(path)
    except (ValueError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("")
def update_file(
    payload: FileUpdate,
    path: str = Query(...),
    context: AppContext = Depends(get_context),
):
    try:
        current = context.vault.read_document(path)
        if current.get("metadata", {}).get("immutable"):
            raise ValueError("This is an immutable original record. Create a new version instead.")
        if not current.get("editable"):
            raise ValueError("This file type is read-only in the MVP.")
        if path.lower().endswith(".md"):
            saved = context.vault.write_markdown(path, payload.content, payload.metadata)
        else:
            saved = context.vault.write_bytes(path, payload.content.encode("utf-8"))
        context.index.rebuild()
        return {"status": "saved", "path": saved}
    except (ValueError, FileNotFoundError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
