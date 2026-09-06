from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query, Response

from app.models.api import ScheduleCreate, ScheduleUpdate, WorkItemCreate
from app.models.awareness import (
    BriefingAskRequest,
    BriefingConnectAction,
    BriefingItem,
    BriefingItemPatch,
    BriefingQuery,
    BriefingResearchRequest,
    DigestSchedulePut,
    DurableResult,
    ListResponse,
    ProviderCapability,
    ReviewAction,
    ReviewPacket,
    SavedView,
    SavedViewCreate,
    SavedViewPatch,
    Scan,
    ScanResult,
    ScheduleRecurrence,
    Watch,
    WatchAnswer,
    WatchDraftCreate,
    WatchPatch,
    WatchScanRequest,
    WatchStateRequest,
    WatchSource,
)
from app.routers.dependencies import get_context
from app.runtime import AppContext
from app.utils.ids import new_id


router = APIRouter(tags=["awareness"])


def _http(exc: Exception) -> HTTPException:
    message = str(exc)
    folded = message.casefold()
    if isinstance(exc, KeyError) or "not found" in folded:
        return HTTPException(status_code=404, detail=message)
    if "revision conflict" in folded or "active scan conflict" in folded:
        return HTTPException(status_code=409, detail=message)
    return HTTPException(status_code=422, detail=message)


@router.get("/intelligence/providers", response_model=ListResponse[ProviderCapability])
def provider_capabilities(context: AppContext = Depends(get_context)):
    items = [ProviderCapability.model_validate(item) for item in context.intelligence.capabilities()]
    return ListResponse(items=items, total=len(items))


@router.get("/intelligence/sources", response_model=ListResponse[WatchSource])
def intelligence_sources(context: AppContext = Depends(get_context)):
    unique: dict[str, WatchSource] = {}
    for watch in context.watches.list(limit=100).items:
        for source in watch.sources:
            unique.setdefault(source.source_id, source)
    items = sorted(unique.values(), key=lambda item: (item.name.casefold(), item.source_id))
    return ListResponse(items=items, total=len(items))


@router.get("/watches", response_model=ListResponse[Watch])
def list_watches(cursor: str | None = None, limit: int = Query(25, ge=1, le=100), context: AppContext = Depends(get_context)):
    return context.watches.list(cursor, limit)


@router.post("/watches/drafts", response_model=Watch, status_code=201)
def create_watch(payload: WatchDraftCreate, context: AppContext = Depends(get_context)):
    watch = context.watches.create_draft(payload)
    context.index.rebuild()
    return watch


@router.get("/watches/{watch_id}", response_model=Watch)
def get_watch(watch_id: str, context: AppContext = Depends(get_context)):
    try:
        return context.watches.get(watch_id)
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.patch("/watches/{watch_id}", response_model=Watch)
def update_watch(watch_id: str, payload: WatchPatch, context: AppContext = Depends(get_context)):
    try:
        watch = context.watches.update(watch_id, payload, payload.expected_revision)
        context.index.rebuild()
        return watch
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.post("/watches/{watch_id}/answers")
def answer_watch(watch_id: str, payload: WatchAnswer, context: AppContext = Depends(get_context)):
    try:
        watch = context.watches.get(watch_id)
        if watch.revision != payload.expected_revision:
            raise ValueError(
                f"Watch revision conflict: expected {payload.expected_revision}, found {watch.revision}"
            )
        scalar_fields = {"title", "provider", "purposes"}
        query_list_fields = {
            "keywords", "topics", "jurisdictions", "regulators", "courts", "industries"
        }
        if payload.question_id not in scalar_fields | query_list_fields | {"standing_question"}:
            raise ValueError(f"Unknown Watch question: {payload.question_id}")
        value = payload.answer
        changes: dict[str, object]
        if payload.question_id == "standing_question":
            if not isinstance(value, str):
                raise ValueError("standing_question requires a text answer")
            query = watch.public_query.model_copy(update={"standing_question": value})
            changes = {"standing_question": value, "public_query": query}
        elif payload.question_id in query_list_fields:
            values = value if isinstance(value, list) else [value]
            query = watch.public_query.model_copy(update={
                payload.question_id: [str(item) for item in values]
            })
            changes = {"public_query": query}
        else:
            changes = {payload.question_id: value}
        patch = WatchPatch(expected_revision=watch.revision, **changes)
        updated = context.watches.update(watch_id, patch, watch.revision)
        context.index.rebuild()
        return {"watch": updated, "next_question": None}
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.post("/watches/{watch_id}/scan", response_model=ScanResult)
async def scan_watch(watch_id: str, payload: WatchScanRequest, context: AppContext = Depends(get_context)):
    try:
        watch = context.watches.get(watch_id)
        # Run now never changes cadence. Drafts use draft mode; active Watches
        # use manual mode regardless of a stale client default.
        mode = "draft" if not watch.enabled else "manual"
        return await context.watch_scans.run_watch(watch_id, mode)
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.post("/watches/{watch_id}/activate")
def activate_watch(watch_id: str, payload: WatchStateRequest, context: AppContext = Depends(get_context)):
    try:
        watch = context.watches.get(watch_id)
        if watch.revision != payload.expected_revision:
            raise ValueError(
                f"Watch revision conflict: expected {payload.expected_revision}, found {watch.revision}"
            )
        if watch.schedule_id:
            schedule = next(
                (item for item in context.scheduler.list() if item["schedule_id"] == watch.schedule_id),
                None,
            )
            if schedule is None:
                raise KeyError(
                    f"Watch schedule not found: {watch.schedule_id}. Repair or remove the stored schedule link."
                )
            if watch.enabled:
                return {"watch": watch, "schedule": schedule}
            schedule = context.scheduler.update(
                watch.schedule_id,
                ScheduleUpdate(
                    enabled=True,
                    expected_revision=int(schedule.get("revision") or 1),
                ),
            )
            resumed = Watch.model_validate(watch.model_copy(update={
                "enabled": True,
                "status": "healthy",
                "revision": watch.revision + 1,
                "updated_at": datetime.now(UTC),
            }))
            context.watches._write(resumed)
            context.index.rebuild()
            return {"watch": resumed, "schedule": schedule}
        # The schedule is created first. A failure cannot change the draft.
        schedule = context.scheduler.create(ScheduleCreate(
            title=f"{watch.title} scan",
            agent_id="research-agent",
            instructions=f"Run the scheduled scan for Watch {watch.watch_id}.",
            kind="watch_scan",
            target_watch_id=watch.watch_id,
            recurrence=watch.recurrence,
            interval_seconds=watch.recurrence.interval_seconds or 3600,
            enabled=True,
        ))
        activated = Watch.model_validate(watch.model_copy(update={
            "enabled": True,
            "schedule_id": schedule["schedule_id"],
            "status": "healthy",
            "revision": watch.revision + 1,
            "updated_at": datetime.now(UTC),
        }))
        context.watches._write(activated)
        context.index.rebuild()
        return {"watch": activated, "schedule": schedule}
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.post("/watches/{watch_id}/pause", response_model=Watch)
def pause_watch(watch_id: str, payload: WatchStateRequest, context: AppContext = Depends(get_context)):
    try:
        watch = context.watches.get(watch_id)
        if watch.revision != payload.expected_revision:
            raise ValueError(
                f"Watch revision conflict: expected {payload.expected_revision}, found {watch.revision}"
            )
        if watch.schedule_id:
            schedule = next((item for item in context.scheduler.list() if item["schedule_id"] == watch.schedule_id), None)
            if schedule:
                context.scheduler.update(
                    watch.schedule_id,
                    ScheduleUpdate(enabled=False, expected_revision=int(schedule.get("revision") or 1)),
                )
        paused = Watch.model_validate(watch.model_copy(update={
            "enabled": False, "status": "paused", "revision": watch.revision + 1,
            "updated_at": datetime.now(UTC),
        }))
        context.watches._write(paused)
        context.index.rebuild()
        return paused
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.get("/watches/{watch_id}/runs", response_model=ListResponse[Scan])
def watch_runs(watch_id: str, cursor: str | None = None, limit: int = Query(25, ge=1, le=100), context: AppContext = Depends(get_context)):
    try:
        context.watches.get(watch_id)
        scans = [item for item in context.briefing.list_scans(limit=100).items if item.watch_id == watch_id]
        start = next((i + 1 for i, item in enumerate(scans) if item.scan_id == cursor), 0) if cursor else 0
        page = scans[start:start + limit]
        next_cursor = page[-1].scan_id if page and start + limit < len(scans) else None
        return ListResponse(items=page, next_cursor=next_cursor, total=len(scans))
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.get("/briefing/items")
def list_briefing_items(
    q: str = "", watch: list[str] = Query(default=[]), source: list[str] = Query(default=[]),
    topic: list[str] = Query(default=[]), jurisdiction: list[str] = Query(default=[]),
    source_type: list[str] = Query(default=[]), source_role: list[str] = Query(default=[]),
    status: list[str] = Query(default=[]), read: str = "any", saved: str = "any",
    company_connection: str = "any", packet: str = "any", impact: str | None = None,
    legal_status: str | None = None, sort: str = "newest", group: str = "none",
    view: str | None = None, cursor: str | None = None, limit: int = Query(25, ge=1, le=100),
    context: AppContext = Depends(get_context),
):
    try:
        query = BriefingQuery(
            q=q, watch=watch, source=source, topic=topic, jurisdiction=jurisdiction,
            source_type=source_type, source_role=source_role, status=status,
            read=read, saved=saved, company_connection=company_connection,
            packet=packet, impact=impact, legal_status=legal_status, sort=sort,
            group=group, view=view, cursor=cursor, limit=limit,
        )
        return context.briefing_query.query(query)
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.get("/briefing/items/{item_id}", response_model=BriefingItem)
def get_briefing_item(item_id: str, context: AppContext = Depends(get_context)):
    try:
        return context.briefing.get_item(item_id)
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.patch("/briefing/items/{item_id}", response_model=BriefingItem)
def patch_briefing_item(item_id: str, payload: BriefingItemPatch, context: AppContext = Depends(get_context)):
    try:
        item = context.briefing.get_item(item_id)
        if item.revision != payload.expected_revision:
            raise ValueError(f"Briefing item revision conflict: expected {payload.expected_revision}, found {item.revision}")
        changes = payload.model_dump(exclude={"expected_revision"}, exclude_none=True)
        updated = BriefingItem.model_validate(item.model_copy(update={
            **changes, "revision": item.revision + 1, "updated_at": datetime.now(UTC),
        }))
        context.briefing.vault.write_markdown(updated.path, f"# {updated.title}\n\n{updated.summary}", updated.model_dump(mode="json"))
        context.index.rebuild()
        return updated
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.post("/briefing/items/{item_id}/ask")
async def ask_briefing_item(item_id: str, payload: BriefingAskRequest, context: AppContext = Depends(get_context)):
    try:
        history = context.briefing.list_research(item_id)
        return await context.briefing_research.run(item_id, payload.question, history)
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.get(
    "/briefing/items/{item_id}/conversation",
    response_model=ListResponse[DurableResult],
)
def get_briefing_conversation(item_id: str, context: AppContext = Depends(get_context)):
    try:
        context.briefing.get_item(item_id)
        records = context.briefing.list_research(item_id)
        return ListResponse(items=records, total=len(records))
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.post("/briefing/items/{item_id}/research")
async def research_briefing_item(item_id: str, payload: BriefingResearchRequest, context: AppContext = Depends(get_context)):
    try:
        return await context.briefing_research.run(item_id, payload.question)
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.post("/briefing/items/{item_id}/connect", response_model=BriefingItem)
def connect_briefing_item(item_id: str, payload: BriefingConnectAction, context: AppContext = Depends(get_context)):
    try:
        item = context.briefing.get_item(item_id)
        if item.revision != payload.expected_revision:
            raise ValueError(f"Briefing item revision conflict: expected {payload.expected_revision}, found {item.revision}")
        connection = item.company_connection.model_copy(deep=True) if item.company_connection else None
        from app.models.awareness import CompanyConnection
        connection = connection or CompanyConnection()
        exchange: tuple[str, str] | None = None
        if payload.action == "save_to_matter":
            matter = context.matters.get(payload.matter_id)
            connection.matters = list(dict.fromkeys([*connection.matters, payload.matter_id]))
            exchange = (
                f"Connect this to a matter: {matter['title']}",
                f"Connected this Briefing item to the matter “{matter['title']}”.",
            )
        elif payload.action == "connect_to_decision":
            decision = context.decisions.get(payload.decision_id)
            connection.decisions = list(dict.fromkeys([*connection.decisions, payload.decision_id]))
            exchange = (
                f"Connect this to a decision: {decision['title']}",
                f"Connected this Briefing item to the decision “{decision['title']}”.",
            )
        else:
            context.matters.get(payload.matter_id)
            work = context.matters.create_work_item(
                WorkItemCreate(
                    matter_id=payload.matter_id, title=payload.title,
                    due_at=payload.due_at.isoformat() if payload.due_at else None,
                    required=True,
                ),
                rebuild=False,
            )
            links = {"briefing_item_id": item.item_id}
            if item.review_packet_id:
                links["review_packet_id"] = item.review_packet_id
            context.vault.update_markdown(work["path"], metadata_updates=links)
            context.matters.append_event(
                payload.matter_id,
                "work_item_created",
                {
                    "work_item_id": work["work_item_id"], "title": payload.title,
                    **links,
                },
                rebuild=False,
            )
            connection.matters = list(dict.fromkeys([*connection.matters, payload.matter_id]))
        updated = BriefingItem.model_validate(item.model_copy(update={
            "company_connection": connection, "revision": item.revision + 1,
            "updated_at": datetime.now(UTC),
        }))
        context.briefing.vault.write_markdown(updated.path, f"# {updated.title}\n\n{updated.summary}", updated.model_dump(mode="json"))
        if exchange:
            context.briefing.append_research(DurableResult(
                result_id=new_id("BRIEF-RES"), path="pending", status="success",
                text=exchange[1], briefing_item_id=item.item_id,
                question=exchange[0], kind="connection", created_at=datetime.now(UTC),
            ))
        context.index.rebuild()
        return updated
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.get("/briefing/views")
def list_views(cursor: str | None = None, limit: int = Query(25, ge=1, le=100), context: AppContext = Depends(get_context)):
    return context.briefing.list_views(cursor, limit)


@router.post("/briefing/views", response_model=SavedView, status_code=201)
def create_view(payload: SavedViewCreate, context: AppContext = Depends(get_context)):
    now = datetime.now(UTC)
    view = SavedView(view_id=new_id("VIEW"), path="pending", revision=1, created_at=now, updated_at=now, **payload.model_dump())
    saved = context.briefing.put_view(view)
    context.index.rebuild()
    return saved


@router.patch("/briefing/views/{view_id}", response_model=SavedView)
def update_view(view_id: str, payload: SavedViewPatch, context: AppContext = Depends(get_context)):
    try:
        view = context.briefing.get_view(view_id)
        if view.revision != payload.expected_revision:
            raise ValueError(f"Saved view revision conflict: expected {payload.expected_revision}, found {view.revision}")
        changes = payload.model_dump(exclude={"expected_revision"}, exclude_none=True)
        updated = SavedView.model_validate(view.model_copy(update={**changes, "revision": view.revision + 1, "updated_at": datetime.now(UTC)}))
        saved = context.briefing.put_view(updated)
        context.index.rebuild()
        return saved
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.delete("/briefing/views/{view_id}", status_code=204)
def delete_view(view_id: str, expected_revision: int = Query(ge=1), context: AppContext = Depends(get_context)):
    try:
        view = context.briefing.get_view(view_id)
        if view.revision != expected_revision:
            raise ValueError(f"Saved view revision conflict: expected {expected_revision}, found {view.revision}")
        context.briefing.vault.resolve(view.path).unlink()
        context.index.rebuild()
        return Response(status_code=204)
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.post("/briefing/views/{view_id}/digest")
def create_digest(view_id: str, context: AppContext = Depends(get_context)):
    try:
        digest = context.briefing_query.create_digest(view_id)
        context.index.rebuild()
        return digest
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.put("/briefing/views/{view_id}/schedule")
def schedule_digest(view_id: str, payload: DigestSchedulePut, context: AppContext = Depends(get_context)):
    try:
        view = context.briefing.get_view(view_id)
        if view.revision != payload.expected_revision:
            raise ValueError(f"Saved view revision conflict: expected {payload.expected_revision}, found {view.revision}")
        existing = next((item for item in context.scheduler.list() if item.get("kind") == "briefing_digest" and item.get("target_view_id") == view_id), None)
        if existing:
            return context.scheduler.update(existing["schedule_id"], ScheduleUpdate(
                enabled=payload.enabled, recurrence=payload.recurrence,
                expected_revision=int(existing.get("revision") or 1),
            ))
        return context.scheduler.create(ScheduleCreate(
            title=f"{view.name} digest", agent_id="research-agent",
            instructions=f"Generate the digest for saved view {view.view_id}.",
            kind="briefing_digest", target_view_id=view.view_id,
            recurrence=payload.recurrence,
            interval_seconds=payload.recurrence.interval_seconds or 3600,
            enabled=payload.enabled,
        ))
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.get("/briefing/digests")
def list_digests(cursor: str | None = None, limit: int = Query(25, ge=1, le=100), context: AppContext = Depends(get_context)):
    return context.briefing.list_digests(cursor, limit)


@router.get("/briefing/digests/{digest_id}")
def get_digest(digest_id: str, context: AppContext = Depends(get_context)):
    try:
        return context.briefing.get_digest(digest_id)
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.get("/review-packets", response_model=ListResponse[ReviewPacket])
def list_review_packets(cursor: str | None = None, limit: int = Query(25, ge=1, le=100), context: AppContext = Depends(get_context)):
    return context.briefing.list_review_packets(cursor, limit)


@router.get("/review-packets/{packet_id}", response_model=ReviewPacket)
def get_review_packet(packet_id: str, context: AppContext = Depends(get_context)):
    try:
        return context.briefing.get_review_packet(packet_id)
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc


@router.post("/review-packets/{packet_id}/actions")
def act_on_review_packet(packet_id: str, payload: ReviewAction, context: AppContext = Depends(get_context)):
    try:
        return context.review_outcomes.record_action(
            packet_id, payload.action, payload.payload.model_dump(), payload.expected_revision
        )
    except (KeyError, ValueError) as exc:
        raise _http(exc) from exc
