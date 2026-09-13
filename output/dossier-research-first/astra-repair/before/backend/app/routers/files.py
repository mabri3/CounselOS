from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, Header
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
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        return {"tree": context.vault.list_tree(path)}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/raw")
def raw_file(
    path: str = Query(...),
    context: AppContext = Depends(get_context, scope="function"),
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
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        _reject_generic_recommendation_path(path, context)
        return context.document_reviews.get(path)
    except (ValueError, FileNotFoundError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.put("/review")
def update_review(payload: DocumentReviewAction, path: str = Query(...), context: AppContext = Depends(get_context, scope="function"),
                  person_id: str | None = Header(None, alias="X-Themis-Person-Id")):
    from app.models.continuity import ActionActor
    from app.services.dossier import WORKSPACE_LOCK
    from app.services.workspace import WorkspaceConflict, digest
    from app.routers.workspace import invoke
    with WORKSPACE_LOCK:
        _reject_generic_recommendation_path(path, context)
        doc = context.vault.read_markdown(path)
        command = payload.model_dump(exclude={"author_name", "author_id"})
        key = payload.source_action_key
        # Search this selected vault before roster validation. A key cannot move to another file.
        entries = []
        if key:
            for file in context.vault.iter_files("03_Matters", {".md"}):
                saved = context.vault.read_markdown(context.vault.relative(file))
                entries.extend(saved["metadata"].get("continuity_review_actions", []))
        prior = next((o for o in entries if key and o["source_action_key"] == key), None)
        fingerprint = digest({"command": command, "path": doc["path"]})
        if prior:
            if prior["fingerprint"] != fingerprint:
                raise HTTPException(409, "Review action key was used for different wording.")
            return context.document_reviews.get(path)
        actor = invoke(context.workspace_team.resolve_actor, person_id or None)
        trusted = payload.model_copy(update={"author_id": actor.person_id, "author_name": actor.display_name})
        try:
            result = context.document_reviews.apply(path, trusted, expected_revision=payload.expected_revision,
                expected_review_revision=payload.expected_review_revision,
                action_actor=actor.model_dump(), action_fingerprint=fingerprint)
            context.matter_records.reconcile_edited_document(path, actor=actor.display_name)
            context.index.rebuild()
            return result
        except WorkspaceConflict as exc:
            raise HTTPException(409, detail=exc.detail) from exc
        except (ValueError, FileNotFoundError) as exc:
            raise HTTPException(400, detail=str(exc)) from exc


@router.get("/export")
def export_file(
    path: str = Query(...),
    format: str = Query(..., pattern="^(docx|pdf)$"),
    mode: str = Query("markup", pattern="^(markup|accepted_text)$"),
    expected_revision: str | None = None,
    expected_review_revision: str | None = None,
    revision_path: str | None = None,
    context: AppContext = Depends(get_context, scope="function"),
):
    try:
        output_path, media_type = context.document_exports.export(path, format, mode=mode, expected_revision=expected_revision, expected_review_revision=expected_review_revision, revision_path=revision_path)
        resolved = context.vault.resolve(output_path)
        return FileResponse(resolved, media_type=media_type, filename=resolved.name)
    except (ValueError, FileNotFoundError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("")
def read_file(
    path: str = Query(...),
    context: AppContext = Depends(get_context, scope="function"),
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
    context: AppContext = Depends(get_context, scope="function"),
):
    from app.services.dossier import WORKSPACE_LOCK

    try:
        # Editor saves and dossier commits must not interleave their checks and writes.
        with WORKSPACE_LOCK:
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
