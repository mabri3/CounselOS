from __future__ import annotations

from datetime import date
from copy import deepcopy
import re
import json
import hashlib

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, Header
from pydantic import BaseModel

from app.models.api import ChatMessage, ChatRequest, ChatResponse, ChatRun, DecisionCreate, MatterUpdateCard
from app.routers.dependencies import get_context
from app.runtime import AppContext
from app.agents.runner import RunnerExecutionState
from app.agents.output import clean_conversation_for_display, reconcile_user_facing_reply
from app.services.recommendations import RecommendationService
from app.models.workspace import ConversationTarget, ScenarioOutcome
from app.services.workspace import WorkspaceConflict
from app.utils.ids import new_id
from app.services.dossier import serialized
from app.services.workspace_actions import extract_claim_support


router = APIRouter(tags=["chat"])


def trusted_chat_actor(payload, context, person_id=None):
    from app.models.continuity import ActionActor
    # Public bodies never choose trusted human provenance or comparison context.
    clean = payload.model_copy(update={"action_actor": None, "continuity_context": None, "frozen_context": None, "frozen_template_use": None})
    if clean.matter_id and clean.source_action_key:
        run = context.chat_runs.find_by_action_key(clean.matter_id, clean.source_action_key)
        if run:
            submitted = run.get("request") or {}
            # start() checks exact command identity before returning this run.
            saved = submitted.get("action_actor") or {"person_id": "historical-unknown", "display_name": "Unattributed lawyer", "mode": "single"}
            return clean.model_copy(update={"action_actor": ActionActor.model_validate(saved).model_dump(), "lawyer_author": saved["display_name"]})
    if clean.matter_id and clean.source_action_key:
        for summary in context.chat_history.list(clean.matter_id):
            conversation = context.chat_history.get(clean.matter_id, summary["conversation_id"])
            for message in conversation["messages"]:
                submitted = message.get("workspace_submission") or {}
                if submitted.get("source_action_key") == clean.source_action_key:
                    saved = submitted.get("action_actor") or {"person_id": "historical-unknown", "display_name": "Unattributed lawyer", "mode": "single"}
                    return clean.model_copy(update={"action_actor": saved, "lawyer_author": saved["display_name"]})
    actor = context.workspace_team.resolve_actor(person_id or None)
    return clean.model_copy(update={"action_actor": actor.model_dump(), "lawyer_author": actor.display_name})


class IntakeQuestionRecoveryRequest(BaseModel):
    conversation_id: str


@router.post("/daily-uploads", status_code=201)
async def upload_daily_documents(
    files: list[UploadFile] = File(...),
    context: AppContext = Depends(get_context),
):
    try:
        return await context.ingestion.upload_many_to_workspace(files)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/daily-conversations")
def list_daily_conversations(context: AppContext = Depends(get_context)):
    return {"conversations": context.chat_history.list_daily()}


@router.get("/daily-conversations/{day}")
def get_daily_conversation(
    day: str,
    context: AppContext = Depends(get_context),
):
    try:
        return clean_conversation_for_display(context.chat_history.get_daily(day))
    except (KeyError, FileNotFoundError, ValueError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, context: AppContext = Depends(get_context), person_id: str | None = Header(None, alias="X-Themis-Person-Id")):
    payload = trusted_chat_actor(payload, context, person_id)
    clean = payload.model_copy(update={"frozen_context": None, "frozen_template_use": None, "trusted_user_message": None, "trusted_message_id": None})
    return await execute_chat(clean, context)


@router.post("/matters/{matter_id}/chat-runs", response_model=ChatRun, status_code=202)
async def start_chat_run(matter_id: str, payload: ChatRequest, context: AppContext = Depends(get_context), person_id: str | None = Header(None, alias="X-Themis-Person-Id")):
    try:
        return context.chat_runs.start(matter_id, trusted_chat_actor(payload, context, person_id))
    except WorkspaceConflict as exc:
        raise HTTPException(status_code=409, detail=exc.detail) from exc
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/matters/{matter_id}/intake-question-recovery", response_model=ChatRun, status_code=202)
async def recover_intake_question(
    matter_id: str,
    payload: IntakeQuestionRecoveryRequest,
    context: AppContext = Depends(get_context),
):
    try:
        conversation = context.chat_history.get(matter_id, payload.conversation_id)
        if conversation.get("conversation_kind") != "intake" or conversation.get("intake_state") != "active":
            raise ValueError("Only an active intake conversation can recover a question.")
        latest = conversation["messages"][-1] if conversation["messages"] else None
        if not latest:
            raise ValueError("The active intake is waiting for its current turn to finish.")
        if latest.get("workspace_action"):
            raise ValueError("The latest turn is workspace work, not an intake question to recover.")
        if latest.get("role") == "assistant":
            if any(
                card.get("type") == "question"
                and not context.matter_records.is_answered_question(
                    matter_id,
                    str(card.get("question_id") or ""),
                    str(card.get("text") or ""),
                )
                for card in latest.get("cards") or []
            ):
                raise ValueError("The active intake already has a structured question.")
        elif latest.get("role") == "user":
            answered_ids = _action_question_ids(latest.get("card_action") or {})
            if not answered_ids or not all(
                context.matter_records.is_answered_question(matter_id, question_id, "")
                for question_id in answered_ids
            ):
                raise ValueError("The active intake is waiting for its current turn to finish.")
        else:
            raise ValueError("The active intake is waiting for its current turn to finish.")
        run = context.chat_runs.start(
            matter_id,
            ChatRequest(
                message=(
                    "Continue the active intake from the saved conversation. Reassess the current matter record. "
                    "Use update_matter_intake to return the next material question as a structured question card, "
                    "or mark intake complete if no material question remains. Do not repeat an answered question."
                ),
                matter_id=matter_id,
                conversation_id=payload.conversation_id,
                agent_id="intake-agent",
                intake_recovery=True,
            ),
            persist_user_message=False,
        )
        return ChatRun.model_validate(run)
    except WorkspaceConflict as exc:
        raise HTTPException(status_code=409, detail=exc.detail) from exc
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@router.get("/matters/{matter_id}/chat-runs", response_model=list[ChatRun])
def list_chat_runs(matter_id: str, conversation_id: str | None = None, context: AppContext = Depends(get_context)):
    try:
        return context.chat_runs.list(matter_id, conversation_id)
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/matters/{matter_id}/chat-runs/{run_id}", response_model=ChatRun)
def get_chat_run(matter_id: str, run_id: str, context: AppContext = Depends(get_context)):
    try:
        return context.chat_runs.get(matter_id, run_id)
    except WorkspaceConflict as exc:
        raise HTTPException(status_code=409, detail=exc.detail) from exc
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/matters/{matter_id}/chat-runs/{run_id}/cancel", response_model=ChatRun)
async def cancel_chat_run(matter_id: str, run_id: str, context: AppContext = Depends(get_context)):
    try:
        return await context.chat_runs.cancel(matter_id, run_id)
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/matters/{matter_id}/chat-runs/{run_id}/retry", response_model=ChatRun, status_code=202)
async def retry_chat_run(matter_id: str, run_id: str, context: AppContext = Depends(get_context)):
    try:
        return context.chat_runs.retry(matter_id, run_id)
    except WorkspaceConflict as exc:
        raise HTTPException(status_code=409, detail=exc.detail) from exc
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@serialized
def _remember_submission(context, saved, current_user, payload):
    """Keep the frozen request beside its existing durable user message."""
    if not current_user:
        return
    document = context.vault.read_markdown(saved["path"])
    for message in document["metadata"].get("messages", []):
        if message.get("message_id") == current_user.get("message_id"):
            submission = message.setdefault("workspace_submission", payload.model_dump(exclude={"history"}))
            submission.setdefault("frozen_context", payload.frozen_context)
            submission.setdefault("frozen_template_use", payload.frozen_template_use)
    context.vault.write_markdown(saved["path"], document["content"], document["metadata"])


@serialized
def _remember_scope(context, path, message_id, state):
    scope = state.scope_state.get("scope")
    if not scope or not message_id:
        return
    document = context.vault.read_markdown(path)
    for message in document["metadata"].get("messages", []):
        if message.get("message_id") == message_id:
            submission = message.setdefault("workspace_submission", {})
            if submission.get("scope") == scope:
                return
            if submission.get("scope") == "scenario":
                state.scope_state["scope"] = "scenario"
                return
            submission["scope"] = scope
            context.vault.write_markdown(path, document["content"], document["metadata"])
            return


def _replayed_submission(context, payload):
    if not payload.matter_id or not payload.source_action_key:
        return payload
    for summary in context.chat_history.list(payload.matter_id):
        conversation = context.chat_history.get(payload.matter_id, summary["conversation_id"])
        for message in conversation["messages"]:
            submission = message.get("workspace_submission") or {}
            if submission.get("source_action_key") != payload.source_action_key:
                continue
            supplied_target = payload.target.model_dump() if payload.target else None
            changed_payload = (
                submission.get("message") != payload.message
                or (supplied_target is not None and supplied_target != submission.get("target"))
                or (payload.expected_question_revision is not None and payload.expected_question_revision != submission.get("expected_question_revision"))
                or submission.get("attachments", []) != [item.model_dump() for item in payload.attachments]
                or submission.get("card_action") != (payload.card_action.model_dump() if payload.card_action else None)
                or submission.get("active_file") != payload.active_file
                or any(submission.get(key, default) != getattr(payload, key) for key, default in [("context_selections", None), ("output_type", "general"), ("template_id", None), ("template_overrides", {}), ("preview", False), ("workspace_action", None), ("update_offer_id", None)])
            )
            if changed_payload:
                raise WorkspaceConflict("This action key was already used for another message.", submission.get("expected_question_revision") or "", code="action_key_conflict")
            return payload.model_copy(update={
                "conversation_id": conversation["conversation_id"],
                "target": ConversationTarget.model_validate(submission["target"]) if submission.get("target") else None,
                "expected_question_revision": submission.get("expected_question_revision"),
                "frozen_context": submission.get("frozen_context"), "frozen_template_use": submission.get("frozen_template_use"),
            })
    return payload


def freeze_workspace_request(payload: ChatRequest, context: AppContext) -> ChatRequest:
    if not payload.matter_id:
        return payload
    question = context.workspace.business_question(payload.matter_id)
    target = payload.target or ConversationTarget(
        matter_id=payload.matter_id, business_question_id=question["question_id"],
        business_question_revision=question["revision"],
    )
    context.workspace.validate_target(payload.matter_id, target)
    if payload.expected_question_revision and target.business_question_revision and payload.expected_question_revision != target.business_question_revision:
        raise WorkspaceConflict("The selected target belongs to another question version. Clear or refresh the target.", question["revision"], code="target_conflict")
    return payload.model_copy(update={
        "expected_question_revision": payload.expected_question_revision or target.business_question_revision or question["revision"],
        "target": target.model_copy(deep=True),
    })


def freeze_run_context(payload: ChatRequest, context: AppContext, run_id: str) -> ChatRequest:
    """Capture reference text and reusable instructions once, before execution."""
    if not payload.matter_id:
        return payload
    if payload.experimental_chat:
        from app.services.experimental_chat import validate_documents
        validate_documents(payload, context)
    selections = payload.context_selections
    if selections is None:
        selections = context.workspace_evidence.selection(payload.matter_id)["selections"]
    selections = [dict(item) for item in selections]
    # Most UI selections already name the file. Do not scan the matter's full
    # document library just to resolve an ID that was not submitted.
    library = context.workspace_evidence.library(payload.matter_id) if any(not item.get("path") for item in selections) else []
    for selection in selections:
        if not selection.get("path"):
            match = next((item for item in library if selection.get("reference_id") in {item.get("reference_id"), item.get("source_id")}), None)
            if match:
                selection["path"] = match["path"]
    frozen = context.agent_context.build_run_context(context.agents.get(payload.agent_id),
        matter_id=payload.matter_id, active_file=payload.active_file, run_id=run_id,
        selections=selections, target=payload.target,
        attachments=[item.model_dump() for item in payload.attachments],
        applied_notes=context.workspace_reuse.applied_practice_notes(payload.matter_id),
        expected_question_revision=payload.expected_question_revision, budget=44000, query=payload.message)
    frozen["conversation_id"] = payload.conversation_id
    if payload.agent_id in {"counsel-copilot", "intake-agent"}:
        baseline = context.solution_paths.ensure_baseline(payload.matter_id)
        state = context.solution_paths.state(payload.matter_id)
        working_id = payload.target.scenario_id if payload.target and payload.target.scenario_id else state["mainline_path_id"]
        conv = context.chat_history.get(payload.matter_id, payload.conversation_id) if payload.conversation_id else None
        if conv and not (payload.target and payload.target.scenario_id):
            working_id = context.vault.read_markdown(conv["path"])["metadata"].get("working_path_id") or working_id
        working = context.workspace_scenarios.get(payload.matter_id, working_id)
        frozen["active_path"] = {"path_id":working_id,"revision":working["revision"]}
        frozen["mainline_state"] = state
        from app.agents.context_selection import pack
        path_packet = {"mainline":state,"working_path":frozen["active_path"],
            "assumptions":working["proposed_fact_changes"],"conditions":working["unresolved_conditions"]}
        if payload.comparison_path_ids:
            if len(payload.comparison_path_ids) < 2 or len(set(payload.comparison_path_ids)) != len(payload.comparison_path_ids):
                raise ValueError("Select at least two distinct approaches to compare.")
            # Resolve in this matter; labels in the visible message are not identities.
            for path_id in payload.comparison_path_ids:
                context.workspace_scenarios.get(payload.matter_id, path_id)
            frozen["requested_comparison_path_ids"] = list(payload.comparison_path_ids)
        if frozen.get("excluded_paths"):
            path_packet = {"mainline":{k:v for k,v in state.items() if k != "conditions"},"working_path":frozen["active_path"],"historical_material_withheld":True}
        if payload.comparison_path_ids:
            path_packet["requested_comparison_path_ids"] = list(payload.comparison_path_ids)
        comparison = next((m for m in reversed(conv['messages']) if m.get('comparison_path_ids')),None) if conv else None
        if comparison:
            path_packet['last_comparison'] = {'message_id':comparison['message_id'],'ordered_path_ids':comparison['comparison_path_ids']}
        path_text, _ = pack(json.dumps(path_packet,ensure_ascii=False),8000,payload.message)
        if not path_text:
            path_text = json.dumps({"mainline":{k:v for k,v in state.items() if k != "conditions"},"working_path":frozen["active_path"],"last_comparison":path_packet.get("last_comparison"),"large_assumptions_omitted":True},ensure_ascii=False)
        note = context.matter_memory.context_view(payload.matter_id,working_id,excluded_paths=frozen.get("excluded_paths",[]))
        frozen["memory_sequence"] = note.get("sequence",0)
        frozen["memory_revision"] = note.get("revision", "")
        frozen["path_context"] = "\nCurrent direction and working path (reference data):\n"+path_text+"\nFallible working memory:\n"+json.dumps(note,ensure_ascii=False)
        frozen["context"] += frozen["path_context"]
        frozen["matter_paths_skill"] = context.skills.matter_paths_snapshot()
    templates = context.skills.list_output_templates()
    if payload.experimental_chat:
        from app.services.experimental_chat import guidance, freeze_comment
        frozen["experimental_guidance"] = guidance(context.vault)
        frozen["experimental_comment"] = freeze_comment(payload, context)
        if payload.conversation_id:
            transcript = context.chat_history.get(payload.matter_id, payload.conversation_id)
            frozen["context"] += "\n\nCurrent experimental conversation transcript path (read for a full audit): " + transcript["path"]
    frozen["templates"] = templates
    frozen["sources"] = [context.workspace_evidence.source_record(item, internal=True) for item in context.matter_records.get(payload.matter_id)["sources"]]
    frozen["template_uses"] = {item["template_id"]: context.skills.resolve_template_use(item["template_id"], output_type=item["output_type"]).model_dump(mode="json") for item in templates if item.get("output_type")}
    if payload.target and payload.target.scenario_id:
        overlay = context.workspace_scenarios.readonly_overlay(payload.matter_id, payload.target.scenario_id)
        # Canonical facts already passed the context builder's source exclusions.
        # Keep private scenario state for version checks, but never re-supply raw facts.
        frozen["scenario"] = overlay
        visible_overlay = {key: value for key, value in overlay.items() if key != "canonical_facts"}
        if frozen.get("withhold_unattributed_history"):
            visible_overlay = {"scenario_id": payload.target.scenario_id, "historical_material_withheld": True,
                               "reason": "Use only the eligible facts and current hypothetical instruction in the submitted context."}
        overlay_text = json.dumps(visible_overlay, ensure_ascii=False)
        remaining = max(0, 60000 - sum(entry.get("supplied_chars", 0) for entry in frozen["manifest"]["entries"]))
        from app.agents.context_selection import pack
        supplied_overlay, _ = pack(overlay_text, min(remaining,8000), payload.message)
        state = "included" if len(supplied_overlay) == len(overlay_text) else "truncated" if supplied_overlay else "omitted"
        overlay_id = "scenario:" + payload.target.scenario_id
        version = hashlib.sha256(supplied_overlay.encode()).hexdigest()
        frozen["manifest"]["entries"].append({"reference_id": overlay_id, "path": overlay["scenario"].get("path"),
            "role": "historical_scenario", "selected": True, "mandatory": False, "revision": version, "state": state,
            "source_version": overlay["scenario"].get("revision"), "supplied_chars": len(supplied_overlay), "available_chars": len(overlay_text),
            "reason": "Historical material withheld by source exclusions; only scope metadata supplied." if frozen.get("withhold_unattributed_history") else "Saved hypothetical overlay supplied as reference data; never current facts."})
        if supplied_overlay:
            frozen["manifest"]["source_revisions"][overlay_id] = version
            frozen["context"] += "\n\nSaved hypothetical overlay (untrusted historical reference, never current facts):\n" + supplied_overlay
        frozen["context"] += (
            "\n\nFor this explicit scenario analysis, keep the useful answer in normal prose. "
            "You may add one final fenced claim-support JSON object with claims and optional "
            "affected_issue_ids, affected_branch_ids, proposed_outcomes, unresolved_conditions, "
            "and source_links. Use only saved record IDs and sources actually supplied above. "
            "The optional object must never replace the prose answer. "
            "For each material legal conclusion, distinguish the rule text from its application to "
            "the regulated actor, jurisdiction, and changed facts. A definition alone does not "
            "establish coverage, a duty, or an exception. Cite the actual supporting passage using "
            "[source:SOURCE_ID|exact locator] when available. If the available sources do not "
            "support that step, identify that specific support gap and give the best conditional "
            "analysis without implying it was verified. Do not treat hypothetical outcomes as "
            "recorded issue dispositions or decisions."
        )
    chosen = next((item for item in templates if item["template_id"] == payload.template_id), None)
    output_type = chosen["output_type"] if chosen and payload.output_type == "general" else payload.output_type
    use = context.skills.resolve_template_use(payload.template_id, output_type=output_type, overrides=payload.template_overrides).model_dump(mode="json")
    if payload.continuity_context:
        frozen["continuity"] = deepcopy(payload.continuity_context)
    if payload.action_actor:
        frozen["action_actor"] = deepcopy(payload.action_actor)
    from app.services.dossier_generation import requested
    frozen["dossier_skill"] = context.skills.dossier_generation_snapshot()
    if requested(payload):
        from app.services.dossier_generation_context import capture
        frozen["dossier_inputs"] = capture(context, payload.matter_id, frozen)
    return payload.model_copy(update={"frozen_context": frozen, "frozen_template_use": use, "workspace_run_id": run_id})


async def execute_chat(
    payload: ChatRequest,
    context: AppContext,
    *,
    run_id: str | None = None,
    execution_state: RunnerExecutionState | None = None,
    checkpoint=None,
    resolved_provider=None,
    persist_user_message: bool = True,
) -> ChatResponse:
    from app.services.dossier_generation import requested, generate_pending, generation_owner, preview_only
    dossier_request = requested(payload)
    dossier_since = context.dossiers.generation_sequence
    dossier_owner = generation_owner.get() or new_id("DOSOP")
    dossier_token = generation_owner.set(dossier_owner)
    try:
        if not payload.message.strip() and not payload.card_action and not payload.attachments:
            raise ValueError("Send a message, card action, or attachment.")
        if not run_id and payload.matter_id and payload.source_action_key:
            payload = _replayed_submission(context, payload)
            run_id = "HTTP-" + hashlib.sha256((payload.matter_id + payload.source_action_key).encode()).hexdigest()[:24]
        payload = freeze_workspace_request(payload, context)
        run_id = run_id or new_id("RUN")
        if not payload.frozen_context:
            payload = freeze_run_context(payload, context, run_id)
        user_content = payload.message.strip() or _action_text(payload)
        try:
            skill_id, model_content = (None, user_content) if dossier_request or payload.experimental_chat and user_content.startswith("/audit") else context.skills.parse_invocation(user_content)
        except KeyError as exc:
            raise ValueError(str(exc)) from exc
        if skill_id is None and _watch_builder_requested(user_content, payload):
            # Watch Builder is a first-party skill. Keep card turns on the same
            # deterministic tool-capable agent even when the slash command is absent.
            context.skills.get("watch-builder")
            skill_id = "watch-builder"
        expected_dossier_hash = (
            payload.expected_dossier_hash
            if payload.expected_dossier_hash is not None
            else context.dossiers.content_hash(payload.matter_id)
            if payload.matter_id
            else None
        )
        run_state = execution_state or RunnerExecutionState()
        run_state.frozen_context = run_state.frozen_context or deepcopy(payload.frozen_context or {})
        if payload.matter_id:
            if payload.workspace_day:
                raise ValueError("A chat cannot be both matter-scoped and day-scoped.")
            conversation_id = payload.conversation_id
            history = []
            if conversation_id:
                saved = context.chat_history.get(payload.matter_id, conversation_id)
                same_run_user = bool(
                    run_id and context.chat_history.find_run_message(
                        payload.matter_id, conversation_id, run_id, "user"
                    )
                )
                if not same_run_user:
                    _reject_duplicate_question_action(saved, payload)
                _validate_question_action(saved, payload)
                history = _history(saved, exclude_run_id=run_id)
            existing_user = (
                context.chat_history.find_run_message(payload.matter_id, conversation_id, run_id, "user")
                if run_id and conversation_id else None
            )
            if existing_user:
                saved = context.chat_history.get(payload.matter_id, conversation_id)
            elif persist_user_message:
                saved = context.chat_history.append(
                    payload.matter_id, conversation_id, role="user", content=user_content,
                    attachments=[item.model_dump() for item in payload.attachments],
                    card_action=payload.card_action.model_dump() if payload.card_action else None,
                    run_id=run_id,
                )
            elif not conversation_id:
                raise ValueError("An internal recovery needs an existing conversation.")
            conversation_id = saved["conversation_id"]
            run_state.frozen_context["conversation_id"] = conversation_id
            conversation = context.chat_history.get(payload.matter_id, conversation_id)
            current_user = existing_user or (conversation["messages"][-1] if persist_user_message else None)
            _remember_submission(context, saved, current_user, payload)
            saved_scope = (current_user or {}).get("workspace_submission", {}).get("scope")
            if saved_scope in {"actual", "scenario"}:
                run_state.scope_state["scope"] = saved_scope
            previous_checkpoint = checkpoint
            submission_path = saved["path"]
            submission_message_id = (current_user or {}).get("message_id")
            def persist_scope(state):
                _remember_scope(context, submission_path, submission_message_id, state)
                if previous_checkpoint:
                    previous_checkpoint(state)
            checkpoint = persist_scope
            trusted_source_id = (
                next(iter(current_user.get("source_ids") or []), current_user.get("message_id"))
                if current_user else None
            )
            intake_active = (
                (conversation.get("conversation_kind") == "intake" or conversation.get("conversation_kind") == "experimental" and conversation.get("intake_state") is not None)
                and conversation.get("intake_state") == "active"
                and not (payload.target and payload.target.scenario_id)
            )
            resolved_answers = (
                _resolved_question_answers(conversation, payload)
                if intake_active
                else []
            )
            if resolved_answers:
                answer_action_key = str(
                    payload.source_action_key
                    or (current_user or {}).get("message_id")
                    or "intake-answer"
                )
                before_answer_revisions = context.workspace.source_revisions(payload.matter_id)
                answer_result = context.matter_records.record_intake_answers(
                    payload.matter_id,
                    resolved_answers,
                    source_id=str(trusted_source_id or (current_user or {}).get("message_id") or ""),
                    source_action_key=answer_action_key,
                )
                if answer_result["changed"]:
                    if run_state.frozen_context.get("publication_baseline") == before_answer_revisions:
                        run_state.frozen_context["intake_publication_baseline"] = context.workspace.source_revisions(payload.matter_id)
                    run_state.changed_paths.extend(answer_result["changed_paths"])
                    run_state.refresh.extend(["matter", "tree"])
                    run_state.operation_results.append({
                        "action": answer_action_key,
                        "source_action_key": answer_action_key,
                        "operation": "record_intake_answer",
                        "status": "changed",
                        "summary": "Intake answer recorded.",
                        "matter_id": payload.matter_id,
                        "entity_refs": [
                            {"type": "intake_answer", "id": record_id}
                            for record_id in answer_result["record_ids"]
                        ],
                        "changed_paths": answer_result["changed_paths"],
                        "resulting_matter_state": {},
                        "available_next_actions": [],
                        "required_user_action": None,
                        "error": None,
                        "recovery": None,
                    })
                    if checkpoint:
                        checkpoint(run_state)
                model_content = _resolved_answer_text(resolved_answers)
                if payload.experimental_chat and payload.experimental_explore:
                    model_content += "\n\n" + payload.message
                expected_dossier_hash = context.dossiers.content_hash(payload.matter_id)
        else:
            if payload.conversation_id:
                raise ValueError("Today chat continues by date, not by conversation ID.")
            workspace_day = payload.workspace_day or date.today().isoformat()
            if workspace_day != date.today().isoformat():
                raise ValueError("Only today's workspace conversation can be changed.")
            try:
                daily_saved = context.chat_history.get_daily(workspace_day)
                _reject_duplicate_question_action(daily_saved, payload)
                history = _history(daily_saved)
            except FileNotFoundError:
                history = []
            saved = context.chat_history.append_daily(
                workspace_day,
                role="user",
                content=user_content,
                attachments=[item.model_dump() for item in payload.attachments],
                card_action=payload.card_action.model_dump() if payload.card_action else None,
            )
            conversation_id = None
        if payload.experimental_chat and payload.experimental_explore and payload.matter_id and intake_active:
            context.matter_records.set_intake_state(payload.matter_id, "complete")
            context.chat_history.update_state(payload.matter_id, conversation_id,
                intake_state="complete", active_agent_id="counsel-copilot")
            intake_active = False
        response = (
            _confirm_saved_operation(
                context, payload, saved, execution_state=run_state,
            )
            if payload.matter_id else None
        )
        if response is None:
            response = (
                _stop_intake(
                    context, payload, saved, expected_dossier_hash,
                    intake_active=intake_active,
                    execution_state=run_state,
                )
                if payload.matter_id and not (payload.target and payload.target.scenario_id) else None
            )
        if response is None and dossier_request:
            from app.services.dossier_generation_chat import respond
            response = await respond(context, payload.model_copy(update={
                "expected_dossier_hash": expected_dossier_hash,
                "conversation_id": conversation_id,
            }), run_state, resolved_provider=resolved_provider, checkpoint=checkpoint,
                run_id=run_id, message_id=(current_user or {}).get("message_id"))
        if response is None:
            routed_agent_id = resolved_provider.selection.agent_id if resolved_provider else _route_matter_agent(
                payload,
                intake_active=bool(payload.matter_id and intake_active),
                recovery=not persist_user_message,
            )
            if payload.model_selection is not None and resolved_provider is None:
                from app.services.experimental_chat import resolve_chat_provider
                resolved_provider = resolve_chat_provider(payload.model_copy(update={"agent_id": routed_agent_id}), context)
            if execution_state is None and payload.matter_id and routed_agent_id == "counsel-copilot" and skill_id != "watch-builder":
                from dataclasses import asdict
                from app.services.research_execution import MainChatCheckpointAccess
                resolved_provider = resolved_provider or context.runner.resolve(routed_agent_id)
                journal_id = new_id("RUN")
                context.chat_runs._write(payload.matter_id, journal_id, state="running", status="Main analysis running.",
                    conversation_id=conversation_id, synchronous=True, selection=asdict(resolved_provider.selection),
                    request=payload.model_copy(update={"conversation_id": conversation_id, "agent_id": routed_agent_id}).model_dump(mode="json"))
                run_state.call_journal = MainChatCheckpointAccess(context, payload.matter_id, journal_id)
            response = await context.runner.run(
                payload.model_copy(
                    update={
                        "message": model_content,
                        "history": history,
                        "skill_id": skill_id,
                        "agent_id": (
                            "research-agent" if skill_id == "watch-builder"
                            else routed_agent_id
                        ),
                        "trusted_source_id": trusted_source_id if payload.matter_id else None,
                        "expected_dossier_hash": expected_dossier_hash,
                        "trusted_user_message": user_content if persist_user_message else None,
                        "trusted_message_id": (current_user or {}).get("message_id") if payload.matter_id else None,
                        "workspace_run_id": run_id,
                        "source_action_key": payload.source_action_key or ((current_user or {}).get("message_id") if payload.matter_id else None),
                    }
                ),
                execution_state=run_state,
                checkpoint=checkpoint,
                resolved_provider=resolved_provider,
            )
        active_path = (run_state.frozen_context.get("active_path") or {}).get("path_id")
        current_direction = context.solution_paths.state(payload.matter_id) if payload.matter_id else {}
        captured_direction = run_state.frozen_context.get("mainline_state") or {}
        path_historical = bool(payload.matter_id and active_path and (active_path != current_direction["mainline_path_id"] or (captured_direction.get("revision") and captured_direction["revision"] != current_direction["revision"])))
        if path_historical:
            run_state.scope_state["scope"] = "scenario"
        if payload.matter_id and run_state.scope_state.get("scope") == "scenario":
            # An explicit dossier request still needs its setup/progress card
            # when this conversation previously explored another approach.
            response.cards = [card for card in response.cards if card.type in {"research_status", "dossier_research"}]
        if payload.matter_id:
            if not dossier_request and run_state.scope_state.get("scope") != "scenario":
                _apply_matter_actions(
                    context, payload, saved, response,
                    execution_state=run_state, run_id=run_id,
                )
            intake_record = context.matter_records.get(payload.matter_id)
            if not dossier_request and (conversation.get("conversation_kind") == "intake" or conversation.get("conversation_kind") == "experimental" and conversation.get("intake_state") is not None) and run_state.scope_state.get("scope") != "scenario":
                intake_state = intake_record.get("intake_state", "active")
                context.chat_history.update_state(
                    payload.matter_id,
                    conversation_id,
                    intake_state=intake_state,
                    active_agent_id=(
                        "intake-agent" if intake_state == "active" else "counsel-copilot"
                    ),
                )
                if intake_state == "complete" and not payload.experimental_chat:
                    _queue_intake_research(
                        context, payload.matter_id, intake_record,
                        cycle_id=conversation_id,
                )
            response.operation_results = list(run_state.operation_results)
            response.reply = reconcile_user_facing_reply(
                response.reply, response.operation_results
            )
        from app.services.problem_analysis import extract_problem_analysis
        _, problem_structure, problem_warnings = extract_problem_analysis(run_state.raw_final_output or response.reply) if not dossier_request else (response.reply, None, [])
        if not dossier_request:
            response.reply, _, _ = extract_problem_analysis(response.reply)
        if problem_warnings:
            response.reply += "\n\n" + " ".join(problem_warnings)
        read_only_reply = bool(payload.preview or re.search(r"\b(?:do not|don't|don’t|never)\s+(?:save\b|(?:update|change)\s+(?:any\s+)?(?:records\b|the\s+(?:matter|facts|breakdown|map)\b))|\b(?:no[- ]save|read[- ]only)\b|\bwithout\s+saving\b", payload.message, re.I))
        problem_eligible = (run_state.scope_state.get("scope") != "scenario" and not read_only_reply
            and not (payload.target and (payload.target.artifact_path or payload.target.scenario_id or payload.target.issue_id))
            and payload.workspace_action not in {"draft", "prepare_handoff"})
        claim_structure = None
        if response.reply.strip() and not dossier_request:
            visible_reply, claim_structure, _claim_warnings = extract_claim_support(response.reply)
            # A malformed block stays visible. A valid metadata block is hidden
            # only when useful prose remains for the lawyer.
            if visible_reply.strip():
                response.reply = visible_reply
        if payload.experimental_chat and not dossier_request:
            from app.services.experimental_chat import extract_choices
            extract_choices(response, run_id)
        if payload.experimental_chat and payload.experimental_comment_id:
            from app.services.experimental_chat import answer_comment
            answer_comment(payload, context, response, run_id)
        if payload.matter_id:
            if response.reply.strip():
                if run_id:
                    saved = context.chat_history.upsert_run_assistant(
                        payload.matter_id, conversation_id, run_id, content=response.reply,
                        trace=[item.model_dump() for item in response.trace], cards=[item.model_dump() for item in response.cards],
                        applied_skills=[item.model_dump() for item in response.applied_skills],
                        operation_results=response.operation_results,
                        source_records=response.source_records,
                    )
                else:
                    saved = context.chat_history.append(
                        payload.matter_id, conversation_id, role="assistant", content=response.reply,
                        trace=[item.model_dump() for item in response.trace], cards=[item.model_dump() for item in response.cards],
                        applied_skills=[item.model_dump() for item in response.applied_skills],
                        operation_results=response.operation_results,
                        source_records=response.source_records,
                    )
            if response.reply.strip() and saved.get("path"):
                doc = context.vault.read_markdown(saved["path"])
                messages = doc["metadata"].get("messages", [])
                last_assistant = next((m for m in reversed(messages) if m.get("role") == "assistant"), None)
                if last_assistant is not None:
                    last_assistant["path_id"] = active_path
                    last_assistant["comparison_path_ids"] = run_state.frozen_context.get("comparison_path_ids", [])
                    context.vault.write_markdown(doc["path"],doc["content"],doc["metadata"])
        else:
            saved = context.chat_history.append_daily(
                workspace_day,
                role="assistant",
                content=response.reply,
                trace=[item.model_dump() for item in response.trace],
                cards=[item.model_dump() for item in response.cards],
                applied_skills=[item.model_dump() for item in response.applied_skills],
                operation_results=response.operation_results,
            )
        if payload.matter_id and run_state.frozen_context:
            frozen = run_state.frozen_context
            if execution_state is None:
                try:
                    context.workspace_evidence.save_manifest(frozen["manifest"])
                except (OSError, ValueError):
                    response.reply += "\n\nThe answer is saved. Its context record could not be saved."

            if dossier_request or read_only_reply or payload.workspace_action in {"prepare_handoff", "draft"}:
                # Communication and draft output stay in their conversation and
                # editable work. Explicit read-only replies must not replace a
                # path's analysis and invalidate a concurrent dossier's inputs.
                pass
            elif response.reply.strip() and payload.workspace_action == "analyze_change_impact" and frozen.get("continuity"):
                try:
                    impact = context.change_impact.publish(payload.matter_id, frozen["continuity"]["comparison_id"], {"run_id": run_id, "text": response.reply})
                    response.changed_paths.append(impact["path"])
                except (OSError, ValueError, KeyError):
                    response.reply += "\n\nThe useful comparison remains in this conversation. Its comparison record could not be updated."
            elif response.reply.strip() and path_historical and not (payload.target and payload.target.scenario_id):
                try:
                    path_capture = run_state.frozen_context["active_path"]
                    context.workspace_scenarios.persist_analysis(payload.matter_id,active_path,response.reply,
                        expected_revision=path_capture["revision"],source_action_key=payload.source_action_key or run_id)
                except (OSError,ValueError,KeyError):
                    response.reply += "\n\nThe answer is saved in this conversation; path analysis remains pending."
            elif response.reply.strip() and payload.target and payload.target.scenario_id:
                scenario = frozen.get("scenario", {})
                try:
                    result = claim_structure if isinstance(claim_structure, dict) else {}
                    structured_claims = result.get("claims") if isinstance(result.get("claims"), list) else []
                    known_claim_ids = {item["claim_id"] for item in context.workspace_review.claims(payload.matter_id)}
                    claim_ids = [str(item.get("claim_id")) for item in structured_claims if isinstance(item, dict) and item.get("claim_id") in known_claim_ids]
                    frozen_source_links = [
                        str(item.get("url") or item.get("path")) for item in frozen.get("sources", [])
                        if isinstance(item, dict) and (item.get("url") or item.get("path"))
                    ]
                    proposed_source_links = result.get("source_links") if isinstance(result.get("source_links"), list) else []
                    source_links = [str(item) for item in proposed_source_links if str(item) in frozen_source_links]
                    known_issue_ids = {item["issue_id"] for item in context.workspace.issues(payload.matter_id)}
                    known_work_ids = {item["work_item_id"] for item in context.workspace_review.work_items(payload.matter_id)}
                    affected_issue_ids = [str(item) for item in result.get("affected_issue_ids", []) if str(item) in known_issue_ids] if isinstance(result.get("affected_issue_ids"), list) else []
                    proposed_outcomes = []
                    for raw_outcome in result.get("proposed_outcomes", []) if isinstance(result.get("proposed_outcomes"), list) else []:
                        try:
                            outcome = ScenarioOutcome.model_validate(raw_outcome).model_dump()
                        except (TypeError, ValueError):
                            continue
                        if (set(outcome["issue_ids"]) <= known_issue_ids
                                and set(outcome["work_item_ids"]) <= known_work_ids
                                and set(outcome["claim_ids"]) <= known_claim_ids):
                            proposed_outcomes.append(outcome)
                    analysis = context.workspace_scenarios.persist_analysis(payload.matter_id, payload.target.scenario_id, response.reply,
                        expected_revision=scenario.get("scenario", {}).get("revision", ""), source_action_key=payload.source_action_key,
                        run_id=run_id,
                        analysis_baseline_revisions=scenario.get("scenario", {}).get("analysis_baseline_revisions") or scenario.get("scenario", {}).get("baseline_revisions") or {},
                        affected_issue_ids=affected_issue_ids or scenario.get("scenario", {}).get("issue_ids", []),
                        affected_branch_ids=result.get("affected_branch_ids") if isinstance(result.get("affected_branch_ids"), list) else [],
                        claim_ids=claim_ids,
                        proposed_outcomes=proposed_outcomes,
                        unresolved_conditions=result.get("unresolved_conditions") if isinstance(result.get("unresolved_conditions"), list) else scenario.get("scenario", {}).get("unresolved_conditions", []),
                        source_links=source_links)
                    response.operation_results.append({"action": "save_scenario_analysis", "operation": "save_scenario_analysis", "status": "changed", "summary": "Saved historical scenario analysis.", "changed_paths": [analysis.get("historical_analysis_path") or analysis.get("path")] if analysis.get("historical_analysis_path") or analysis.get("path") else []})
                except (OSError, ValueError, WorkspaceConflict):
                    response.reply += "\n\nThe useful analysis is retained in this conversation. The saved scenario analysis could not be updated."
                    try:
                        context.workspace_scenarios.fail_analysis(
                            payload.matter_id, payload.target.scenario_id,
                            source_action_key=payload.source_action_key,
                            failure_detail="The useful analysis was retained, but its scenario record could not be updated.",
                            run_id=run_id,
                        )
                    except (OSError, ValueError, WorkspaceConflict, KeyError):
                        pass
                    response.operation_results.append({
                        "action": "save_scenario_analysis",
                        "operation": "save_scenario_analysis",
                        "status": "failed",
                        "summary": "Useful analysis was retained, but the scenario record was not updated.",
                        "changed_paths": [],
                    })

            elif response.reply.strip() and frozen.get("intake_publication_baseline") and not payload.preview and not (payload.target and payload.target.artifact_path) and run_state.scope_state.get("scope") != "scenario" and all(item.tool in {"select_conversation_scope", "read_file", "search_vault", "list_files", "update_matter_intake"} for item in response.trace):
                context.workspace_actions.publish_result(payload.matter_id, run_id=run_id, text=response.reply, frozen_context=frozen,
                    source_revisions=frozen["intake_publication_baseline"], expected_question_revision=payload.expected_question_revision or "",
                    structure=claim_structure, source_action_key=payload.source_action_key, target=payload.target, sources=frozen.get("sources", []),
                    problem_structure=problem_structure if problem_eligible else None, problem_current_eligible=problem_eligible)
            elif response.reply.strip() and run_state.scope_state.get("scope") != "scenario" and not payload.preview and all(item.tool in {"select_conversation_scope", "read_file", "search_vault", "list_files"} or (item.tool == "workspace_action" and frozen.get("workspace_tool_actions") and all(action in {"inspect", "prior_work", "draft_practice_note"} for action in frozen["workspace_tool_actions"])) for item in response.trace) and not any(item.get("status") == "changed" for item in response.operation_results):
                context.workspace_actions.publish_result(payload.matter_id, run_id=run_id, text=response.reply, frozen_context=frozen,
                    source_revisions=frozen["publication_baseline"], expected_question_revision=payload.expected_question_revision or "",
                    structure=claim_structure, source_action_key=payload.source_action_key, target=payload.target, sources=frozen.get("sources", []),
                    update_current_snapshot=not bool(payload.target and payload.target.artifact_path),
                    problem_structure=problem_structure if problem_eligible else None, problem_current_eligible=problem_eligible)
            elif response.reply.strip() and problem_structure is not None and problem_eligible:
                context.workspace_actions.publish_result(payload.matter_id, run_id=run_id, text=response.reply, frozen_context=frozen,
                    source_revisions=frozen["publication_baseline"], expected_question_revision=payload.expected_question_revision or "",
                    structure=claim_structure, source_action_key=payload.source_action_key, target=payload.target, sources=frozen.get("sources", []),
                    update_current_snapshot=False, problem_structure=problem_structure)
        if run_state.call_journal is not None:
            access = run_state.call_journal
            context.chat_runs._write(payload.matter_id, access.run_id, state="completed", status="Main answer saved.",
                response=response.model_dump(mode="json"), conversation_id=conversation_id)
        response.conversation_id = conversation_id
        if execution_state is None and payload.matter_id and not dossier_request:
            await generate_pending(context, since=dossier_since, matter_id=payload.matter_id,
                owner=dossier_owner, resolved_provider=resolved_provider,
                snapshot=(payload.frozen_context or {}).get("dossier_skill"),
                allowed=not preview_only(payload) and run_state.scope_state.get("scope") != "scenario")
        response.changed_paths = list(dict.fromkeys([*response.changed_paths, saved["path"]]))
        return response
    except WorkspaceConflict as exc:
        raise HTTPException(status_code=409, detail=exc.detail) from exc
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    finally:
        generation_owner.reset(dossier_token)


_SUBSTANTIVE_INTAKE_REQUEST = re.compile(
    r"^\s*(?:please\s+)?(?:"
    r"(?:start|run|begin|conduct)\b.{0,48}\bresearch\b|"
    r"research\b(?!\s+(?:is|isn't|isnt|was|wasn't|wasnt|seems|may|might|could|should\s+not)\b)|"
    r"(?:analyze|analyse|draft|prepare)\b|"
    r"create\s+(?:a|an|the)\s+(?:response|draft|memo|analysis|research\s+packet)\b|"
    r"(?:proceed|continue)\s+with\s+(?:the\s+)?assumptions?\b"
    r")",
    re.IGNORECASE,
)


def _route_matter_agent(
    payload: ChatRequest,
    *,
    intake_active: bool,
    recovery: bool,
) -> str:
    """Choose the active matter agent without letting intake block direct work."""
    if payload.experimental_chat and payload.experimental_explore:
        return "counsel-copilot"
    if not intake_active:
        return payload.agent_id
    if recovery or payload.card_action is not None:
        return "intake-agent"
    if payload.workspace_action == "draft":
        return "counsel-copilot"
    if _SUBSTANTIVE_INTAKE_REQUEST.search(payload.message):
        return "counsel-copilot"
    return "intake-agent"


def _history(saved: dict, *, exclude_run_id: str | None = None) -> list[ChatMessage]:
    cards = _question_cards(saved)
    return [
        ChatMessage(
            role=message["role"],
            content=_message_content_with_question_context(message, cards),
        )
        for message in saved["messages"]
        if not exclude_run_id
        or message.get("run_id") != exclude_run_id
        or message.get("role") != "user"
    ]


def _action_text(payload: ChatRequest) -> str:
    if payload.card_action:
        if payload.card_action.action == "answer_set":
            lines = []
            for answer in payload.card_action.answers:
                detail = ", ".join(answer.values) if answer.values else "Skipped"
                lines.append(f"- {answer.card_id}: {detail}")
            return "Answers to the prioritized intake questions:\n" + "\n".join(lines)
        values = ", ".join(payload.card_action.values)
        return f"Card action: {payload.card_action.action}{f' — {values}' if values else ''}"
    names = ", ".join(item.name for item in payload.attachments)
    return f"Attached: {names}"


def _reject_duplicate_question_action(saved: dict, payload: ChatRequest) -> None:
    action = payload.card_action
    if not action or action.action not in {"answer", "answer_set", "skip", "stop"}:
        return
    submitted_ids = _action_question_ids(action.model_dump())
    answered_ids = {
        question_id
        for message in saved["messages"]
        for question_id in _action_question_ids(message.get("card_action") or {})
    }
    if submitted_ids & answered_ids:
        raise ValueError("This question was already answered.")


def _validate_question_action(saved: dict, payload: ChatRequest) -> None:
    action = payload.card_action
    if (
        saved.get("conversation_kind") not in {"intake", "experimental"}
        or not action
        or action.action not in {"answer", "answer_set", "skip"}
    ):
        return
    cards = _question_cards(saved)
    active_ids: set[str] = set()
    for message in reversed(saved.get("messages", [])):
        if message.get("role") != "assistant":
            continue
        active_ids = {
            str(card.get("question_id") or "")
            for card in message.get("cards", [])
            if card.get("type") == "question" and card.get("question_id")
        }
        break
    question_ids = _action_question_ids(action.model_dump())
    if not question_ids or not question_ids <= active_ids:
        raise ValueError("This intake question is no longer active.")
    for answer in _action_answers(action.model_dump()):
        card = cards.get(str(answer.get("card_id") or ""))
        if card is None:
            raise ValueError("The saved intake question is not available.")
        values = [str(value).strip() for value in answer.get("values", []) if str(value).strip()]
        free_text = str(answer.get("free_text") or "").strip()
        if answer.get("action") == "skip":
            if values or free_text:
                raise ValueError("A skipped question cannot include an answer.")
            continue
        if payload.experimental_chat and free_text:
            if values:
                raise ValueError("Enter an answer or select choices, not both.")
            continue
        if not values:
            raise ValueError("Select or enter an answer.")
        choices = {
            str(choice.get("value") or "")
            for choice in card.get("choices", [])
            if choice.get("value")
        }
        if choices and (any(value not in choices for value in values) if payload.experimental_chat else values[0] not in choices):
            raise ValueError("The selected answer is not available for this question.")


def _resolved_question_answers(saved: dict, payload: ChatRequest) -> list[dict[str, object]]:
    action = payload.card_action
    if not action or action.action not in {"answer", "answer_set", "skip"}:
        return []
    cards = _question_cards(saved)
    resolved: list[dict[str, object]] = []
    for answer in _action_answers(action.model_dump()):
        card = cards.get(str(answer.get("card_id") or ""))
        if card is None:
            continue
        values = [str(value).strip() for value in answer.get("values", []) if str(value).strip()]
        labels = {
            str(choice.get("value") or ""): str(choice.get("label") or choice.get("value") or "")
            for choice in card.get("choices", [])
        }
        answer_parts = [labels.get(value, value) for value in values]
        answer_text = (str(answer.get("free_text") or "").strip() if payload.experimental_chat else "") or (": ".join(answer_parts) if len(answer_parts) > 1 else "".join(answer_parts))
        status = "skipped" if answer.get("action") == "skip" else "answered"
        resolved.append({
            "question_id": str(answer.get("card_id") or ""),
            "question": str(card.get("text") or "").strip(),
            "answer": answer_text,
            "values": values,
            "status": status,
            "record_target": _question_record_target(card),
        })
    return resolved


def _resolved_answer_text(answers: list[dict[str, object]]) -> str:
    lines = ["Answers to the saved intake questions:"]
    for answer in answers:
        detail = str(answer.get("answer") or "Skipped")
        lines.append(f"- Question: {answer.get('question')}\n  Answer: {detail}")
    return "\n".join(lines)


def _question_cards(saved: dict) -> dict[str, dict]:
    return {
        str(card.get("question_id")): card
        for message in saved.get("messages", [])
        if message.get("role") == "assistant"
        for card in message.get("cards", [])
        if card.get("type") == "question" and card.get("question_id")
    }


def _question_record_target(card: dict) -> str:
    target = str(card.get("record_target") or "fact")
    if target != "fact":
        return target
    card_text = f"{card.get('question_id') or ''} {card.get('text') or ''}".casefold()
    if re.search(r"\b(jurisdiction|countries|country|regions?)\b", card_text):
        return "jurisdiction_scope"
    return "fact"


def _action_answers(action: dict) -> list[dict]:
    if action.get("action") == "answer_set":
        return [dict(item) for item in action.get("answers", []) if isinstance(item, dict)]
    if action.get("action") in {"answer", "skip"}:
        return [{
            "card_id": action.get("card_id"),
            "action": action.get("action"),
            "values": list(action.get("values") or []),
        }]
    return []


def _action_question_ids(action: dict) -> set[str]:
    return {
        str(answer.get("card_id"))
        for answer in _action_answers(action)
        if answer.get("card_id")
    }


def _message_content_with_question_context(message: dict, cards: dict[str, dict]) -> str:
    action = message.get("card_action") or {}
    answers = []
    for answer in _action_answers(action):
        card = cards.get(str(answer.get("card_id") or ""))
        if not card:
            continue
        values = [str(value) for value in answer.get("values", [])]
        labels = {
            str(choice.get("value") or ""): str(choice.get("label") or choice.get("value") or "")
            for choice in card.get("choices", [])
        }
        detail = ": ".join(labels.get(value, value) for value in values) or "Skipped"
        answers.append(f"Question: {card.get('text')}\nAnswer: {detail}")
    return "\n\n".join(answers) if answers else str(message.get("content") or "")


def _watch_builder_requested(content: str, payload: ChatRequest) -> bool:
    if payload.agent_id == "intake-agent":
        return False
    if payload.card_action and payload.card_action.action in {
        "save_draft", "scan_now", "change_something", "start_watch", "scan_again",
    }:
        return True
    lowered = " ".join(content.lower().split())
    command_prefix = (
        r"^(?:(?:please|kindly),?\s+|(?:can|could|would|will)\s+you\s+|"
        r"i(?:'d|\s+would)\s+like\s+(?:you\s+)?to\s+|"
        r"i\s+(?:want|need)\s+(?:you\s+)?to\s+)?"
    )
    watch_object = r"(?:watch|recurring\s+scan)"
    determiner = r"(?:(?:a|an|the|this|that|my|our)\s+)?"
    explicit_watch_action = rf"(?:create|start|change|edit)\s+{determiner}{watch_object}\b"
    explicit_monitoring_setup = rf"set\s+up\s+{determiner}(?:watch|monitoring|recurring\s+scan)\b"
    return bool(re.match(
        rf"{command_prefix}(?:{explicit_watch_action}|{explicit_monitoring_setup})",
        lowered,
    ))


def _stop_intake(
    context: AppContext,
    payload: ChatRequest,
    saved: dict,
    expected_dossier_hash: str | None,
    *,
    intake_active: bool,
    execution_state: RunnerExecutionState,
) -> ChatResponse | None:
    action = payload.card_action
    continue_with_assumptions = bool(
        action
        and action.action == "answer"
        and action.card_id.startswith("intake-recovery-")
        and "continue_with_assumptions" in action.values
    )
    if not intake_active or not action or (
        action.action != "stop" and not continue_with_assumptions
    ):
        return None
    matter_id = str(payload.matter_id)
    record = context.matter_records.set_intake_state(matter_id, "complete")
    matter = context.matters.get(matter_id)
    dossier = context.dossiers.update_from_intake(
        matter_id,
        working_ask=(record.get("working_ask") or matter.get("description") or matter["title"]),
        facts=record["facts"],
        assumptions=record["assumptions"],
        issues=record.get("issues", []),
        open_questions=record.get("open_questions", []),
        orientation="",
        expected_hash=expected_dossier_hash,
    )
    context.chat_history.update_state(
        matter_id,
        saved["conversation_id"],
        intake_state="complete",
        active_agent_id="counsel-copilot",
    )
    _queue_intake_research(
        context, matter_id, record, cycle_id=saved["conversation_id"]
    )
    changed_paths = [
        record["path"],
        str(dossier.get("path") or dossier.get("revision_path")),
    ]
    execution_state.operation_results.append({
        "action": action.card_id,
        "source_action_key": payload.source_action_key,
        "operation": "finish_intake",
        "status": "changed",
        "summary": "Intake complete.",
        "matter_id": matter_id,
        "entity_refs": [],
        "changed_paths": changed_paths,
        "resulting_matter_state": {"intake_state": "complete"},
        "available_next_actions": ["review_dossier"],
        "required_user_action": None,
        "error": None,
        "recovery": None,
    })
    return ChatResponse(
        reply=(
            "Intake is complete with the current assumptions. The saved facts and open questions remain available for the dossier and research."
            if continue_with_assumptions
            else "Intake is complete. The saved facts and open questions remain available for the dossier and research."
        ),
        cards=[MatterUpdateCard(
            action_id=action.card_id,
            summary="Intake complete",
            changed_sections=["Working ask", "Open questions"],
            can_edit=False,
            can_undo=False,
        )],
        changed_paths=changed_paths,
        refresh=["matter"],
    )


def _confirm_saved_operation(
    context: AppContext,
    payload: ChatRequest,
    saved: dict,
    *,
    execution_state: RunnerExecutionState,
) -> ChatResponse | None:
    action = payload.card_action
    if not action or action.action != "apply" or not action.card_id.startswith("operation-result:"):
        return None
    action_id = action.card_id.removeprefix("operation-result:")
    proposal_result = next(
        (
            result
            for message in reversed(saved.get("messages", []))
            for result in reversed(message.get("operation_results") or [])
            if str(result.get("action") or "") == action_id
            and result.get("status") in {"confirmation_required", "proposed"}
        ),
        None,
    )
    if proposal_result is None:
        raise ValueError("The saved confirmation proposal is no longer available.")
    matter_id = str(payload.matter_id)
    operation = str(proposal_result.get("operation") or "")
    if payload.target and payload.target.scenario_id and operation != "run_research":
        return None
    proposal = proposal_result.get("proposal")
    proposal = dict(proposal) if isinstance(proposal, dict) else {}
    source_action_key = str(
        proposal.get("source_action_key")
        or proposal_result.get("source_action_key")
        or action_id
    )

    if operation == "run_research":
        from app.models.research_scope import ResearchScope
        from app.models.api import ResearchStatusCard
        if proposal.get("matter_id") != matter_id:
            raise ValueError("The research choice belongs to another matter.")
        if len(action.values) not in {3, 5, 6} or any(value not in {"yes", "no"} for value in action.values[:2] + action.values[3:]):
            raise ValueError("Choose external sources and other matters separately.")
        scope = ResearchScope(
            external=action.values[0] == "yes",
            other_matters=action.values[1] == "yes",
            public_query=action.values[2],
            provider_ids=proposal.get("provider_ids") or [],
            native=len(action.values) >= 5 and action.values[3] == "yes",
            allow_firecrawl=len(action.values) >= 5 and action.values[4] == "yes",
            model_selection=proposal.get("model_selection"),
            main_model_selection=proposal.get("main_model_selection"),
            collector_model_selection=proposal.get("collector_model_selection"),
            allow_followup_queries=len(action.values) == 6 and action.values[5] == "yes",
        )
        origin_message_id = None
        for message in saved.get("messages", []):
            if proposal_result in (message.get("operation_results") or []):
                break
            if message.get("role") == "user":
                origin_message_id = message.get("message_id")
        started = context.research_runs.start(
            matter_id, [str(proposal["question"])],
            source_action_key=source_action_key,
            expected_question_revision=proposal.get("expected_question_revision"),
            search_scope=scope,
            origin_conversation_id=saved.get("conversation_id"),
            origin_message_id=origin_message_id,
        )
        execution_state.operation_results.append({
            "action": action_id, "source_action_key": source_action_key,
            "operation": operation, "status": "changed", "matter_id": matter_id,
            "summary": "Research started with your source choices.",
            "changed_paths": [started["path"]],
        })
        return ChatResponse(
            reply="Research is queued or running with its saved source choices. The run will show which sources were retrieved. Repeating this confirmation does not start another run.",
            changed_paths=[started["path"]], refresh=["matter", "kanban", "tree"],
            cards=[ResearchStatusCard.model_validate(started)],
        )

    if operation == "record_decision":
        disposition = action.values[0] if action.values else ""
        reason = action.values[1].strip() if len(action.values) > 1 else ""
        if disposition not in {"followed", "modified", "not_followed", "not_applicable"}:
            raise ValueError("Select how the recorded decision relates to the recommendation.")
        recommendation_version_id = proposal.get("recommendation_version_id")
        if not recommendation_version_id:
            recommendation_version_id = RecommendationService(
                context.vault, context.matters
            ).get(matter_id).get("current_version_id")
        request = DecisionCreate.model_validate({
            **proposal,
            "matter_id": matter_id,
            "decision_maker": str(payload.lawyer_author or payload.review_author or "Lawyer"),
            "source_action_key": source_action_key,
            "recommendation_disposition": disposition,
            "recommendation_disposition_reason": reason,
            "recommendation_version_id": recommendation_version_id,
        })
        existing_decision_ids = {
            str(item["decision_id"]) for item in context.decisions.list()
        }
        decision = context.decisions.record(request)
        already_recorded = str(decision["decision_id"]) in existing_decision_ids
        changed_paths = [] if already_recorded else [str(decision["path"])]
        operation_result = {
            "action": action_id,
            "source_action_key": source_action_key,
            "operation": operation,
            "status": "no_change" if already_recorded else "changed",
            "summary": "Decision already recorded." if already_recorded else "Decision recorded.",
            "matter_id": matter_id,
            "entity_refs": [{"type": "decision", "id": str(decision["decision_id"]), "path": str(decision["path"])}],
            "changed_paths": changed_paths,
            "resulting_matter_state": {},
            "available_next_actions": context.matters.available_next_actions(context.matters.get(matter_id)),
            "required_user_action": None,
            "error": None,
            "recovery": None,
        }
    else:
        matter_action = "mark_as_sent" if operation == "mark_response_sent" else operation
        if matter_action not in {"approve_response", "mark_as_sent", "close_matter"}:
            raise ValueError("This confirmation does not map to a supported matter action.")
        saved_result = context.matters.perform_action(
            matter_id,
            matter_action,
            actor=str(payload.lawyer_author or payload.review_author or "Lawyer"),
            artifact_path=proposal.get("artifact_path"),
            work_item_id=proposal.get("work_item_id"),
            note=proposal.get("note"),
        )
        operation_result = {
            key: saved_result.get(key)
            for key in (
                "action", "source_action_key", "operation", "status", "summary",
                "matter_id", "entity_refs", "changed_paths", "resulting_matter_state",
                "available_next_actions", "required_user_action", "error", "recovery",
            )
        }
        operation_result["action"] = action_id
        operation_result["source_action_key"] = source_action_key
        changed_paths = [str(path) for path in operation_result.get("changed_paths") or []]

    execution_state.operation_results.append(operation_result)
    return ChatResponse(
        reply=str(operation_result["summary"]),
        changed_paths=changed_paths,
        refresh=["matter", "kanban", "tree"],
    )
def _queue_intake_research(
    context: AppContext,
    matter_id: str,
    record: dict,
    *,
    cycle_id: str,
) -> None:
    questions = [
        str(question).strip()
        for question in record.get("public_research_questions", [])[:3]
        if str(question).strip()
    ]
    if not questions:
        return
    context.research_runs.start(
        matter_id, questions, source_action_key=f"intake:{cycle_id}"
    )


def _apply_matter_actions(
    context: AppContext, payload: ChatRequest, saved: dict, response: ChatResponse,
    *, execution_state: RunnerExecutionState | None = None, run_id: str | None = None,
) -> None:
    matter_id = payload.matter_id
    if not matter_id:
        return
    execution_state = execution_state or RunnerExecutionState()
    if payload.card_action and payload.card_action.action == "undo":
        action = context.matter_records.withdraw_action(matter_id, payload.card_action.card_id)
        response.cards = [MatterUpdateCard(action_id=action["action_id"], summary="Matter update withdrawn", changed_sections=["Facts"], can_undo=False)]
        response.refresh.append("matter")
        record_path = context.matter_records.get(matter_id)["path"]
        response.changed_paths.append(record_path)
        execution_state.operation_results.append({
            "action": action["action_id"],
            "source_action_key": payload.source_action_key,
            "operation": "withdraw_matter_update",
            "status": "changed",
            "summary": "Matter update withdrawn.",
            "matter_id": matter_id,
            "entity_refs": [],
            "changed_paths": [record_path],
            "resulting_matter_state": {},
            "available_next_actions": [],
            "required_user_action": None,
            "error": None,
            "recovery": None,
        })
        return
