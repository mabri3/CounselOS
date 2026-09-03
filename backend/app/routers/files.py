from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse

from app.models.api import DocumentReviewAction, FileUpdate
from app.routers.dependencies import get_context
from app.runtime import AppContext
from app.services.recommendations import RecommendationService


router = APIRouter(prefix="/files", tags=["files"])


def _reject_generic_recommendation_path(path: str, context: AppContext) -> None:
    normalized = context.vault.relative(context.vault.resolve(path))
    if RecommendationService(context.vault, context.matters).is_configured_path(normalized):
        raise HTTPException(
            status_code=400,
            detail=(
                "recommendations.md is managed by the typed recommendation endpoint. "
                "Use /api/matters/{matter_id}/recommendation."
            ),
        )


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


@router.get("/review")
def get_review(
    path: str = Query(...),
    context: AppContext = Depends(get_context),
):
    try:
        _reject_generic_recommendation_path(path, context)
        return context.document_reviews.get(path)
    except (ValueError, FileNotFoundError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.put("/review")
def update_review(
    payload: DocumentReviewAction,
    path: str = Query(...),
    context: AppContext = Depends(get_context),
):
    try:
        _reject_generic_recommendation_path(path, context)
        result = context.document_reviews.apply(path, payload)
        context.matter_records.reconcile_edited_document(
            path, actor=payload.author_name or "user"
        )
        context.index.rebuild()
        return result
    except (ValueError, FileNotFoundError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/export")
def export_file(
    path: str = Query(...),
    format: str = Query(..., pattern="^(docx|pdf)$"),
    context: AppContext = Depends(get_context),
):
    try:
        output_path, media_type = context.document_exports.export(path, format)
        resolved = context.vault.resolve(output_path)
        return FileResponse(resolved, media_type=media_type, filename=resolved.name)
    except (ValueError, FileNotFoundError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("")
def read_file(
    path: str = Query(...),
    context: AppContext = Depends(get_context),
):
    try:
        _reject_generic_recommendation_path(path, context)
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
        _reject_generic_recommendation_path(path, context)
        current = context.vault.read_document(path)
        if current.get("metadata", {}).get("immutable"):
            raise ValueError("This is an immutable original record. Create a new version instead.")
        if not current.get("editable"):
            raise ValueError("This file type is read-only in the MVP.")
        if path.lower().endswith(".md") and current.get("metadata", {}).get("review", {}).get("tracking"):
            raise ValueError("Use save_revision with an explicit review author while Track Changes is on.")
        if path.lower().endswith(".md"):
            saved = context.vault.write_markdown(path, payload.content, payload.metadata)
            context.matter_records.reconcile_edited_document(path, actor="user")
        else:
            saved = context.vault.write_bytes(path, payload.content.encode("utf-8"))
        context.index.rebuild()
        return {"status": "saved", "path": saved}
    except (ValueError, FileNotFoundError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
