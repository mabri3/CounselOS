"""Chat presentation for the shared dossier generation action."""
from app.models.api import AppliedSkillSummary, ChatResponse, DossierResearchCard, ToolTrace
from app.services.dossier_generation import generate_dossier, preview_only, saved_material_only


async def respond(app, payload, state, *, resolved_provider=None, checkpoint=None, run_id=None, message_id=None):
    if not payload.matter_id:
        return ChatResponse(reply="Open a matter, then ask me to generate its dossier.")
    if not preview_only(payload) and not saved_material_only(payload):
        prepared = await app.dossier_requests.prepare(
            payload,
            resolved_provider=resolved_provider,
            run_id=run_id,
            message_id=message_id,
        )
        path = app.dossier_requests._path(payload.matter_id, prepared["request_id"])
        summary = "Dossier research is ready for your choices. No research has started."
        operation = {
            "action": "prepare_dossier_research",
            "operation": "prepare_dossier_research",
            "source_action_key": payload.source_action_key,
            "matter_id": payload.matter_id,
            "status": "changed",
            "summary": summary,
            "changed_paths": [path],
            "entity_refs": [{"type": "dossier_request", "id": prepared["request_id"]}],
            "resulting_matter_state": {},
            "available_next_actions": ["start_dossier_research", "use_saved_material"],
            "required_user_action": "Review the priorities and source choices.",
            "error": None,
            "recovery": None,
        }
        state.operation_results.append(operation)
        state.changed_paths.append(path)
        state.useful_content = prepared["preparation"]
        if checkpoint:
            checkpoint(state)
        card = DossierResearchCard(
            request_id=prepared["request_id"],
            matter_id=payload.matter_id,
            state=prepared["state"],
            phase=prepared["phase"],
            presentation="setup",
            status=prepared,
        )
        return ChatResponse(
            reply=prepared["preparation"] + "\n\n" + summary,
            changed_paths=[path],
            refresh=[],
            cards=[card],
            applied_skills=[AppliedSkillSummary(skill_id="dossier-generation", name="Dossier generation")],
            trace=[ToolTrace(tool="prepare_dossier_research", status="success", summary=summary)],
            operation_results=[operation],
        )

    from app.services.experimental_chat import resolve_chat_provider
    resolved_provider = resolved_provider or resolve_chat_provider(payload, app)
    result = await generate_dossier(app, payload.matter_id, request=payload.message,
        resolved_provider=resolved_provider, snapshot=(payload.frozen_context or {}).get("dossier_skill"),
        frozen_context=payload.frozen_context, expected_hash=payload.expected_dossier_hash,
        save=not preview_only(payload), run_id=run_id, execution_state=state, checkpoint=checkpoint)
    status = result["state"]
    path = result.get("revision_path")
    summary = {"applied": "Dossier generated and saved.", "review_required": "Dossier generated as a revision for review; the current dossier was not replaced.",
               "preview": "Dossier preview generated; no matter records changed.",
               "failed": "Dossier generation needs retry. Available text is retained."}.get(status, "Dossier text is available.")
    content = result["content"]
    if path:
        content += "\n\n[Open saved dossier revision](" + path + ")"
    content += "\n\n" + summary
    if result["warnings"]:
        content += "\n\n" + " ".join(result["warnings"])
    operation = {"action": "generate_dossier", "operation": "generate_dossier",
        "source_action_key": payload.source_action_key, "matter_id": payload.matter_id,
        "status": "changed" if status == "applied" else "proposed" if status == "review_required" else "no_change" if status == "preview" else "failed",
        "summary": summary, "changed_paths": [path] if path else [], "entity_refs": [],
        "resulting_matter_state": {}, "available_next_actions": [], "required_user_action": None,
        "error": None, "recovery": None}
    state.operation_results.append(operation)
    state.changed_paths.extend(operation["changed_paths"])
    state.useful_content = content
    if checkpoint:
        checkpoint(state)
    return ChatResponse(reply=content, changed_paths=operation["changed_paths"], refresh=["matter", "tree"],
        applied_skills=[AppliedSkillSummary(skill_id="dossier-generation", name="Dossier generation")],
        trace=[ToolTrace(tool="generate_dossier", status="error" if status == "failed" else "success", summary=summary)],
        operation_results=[operation])
