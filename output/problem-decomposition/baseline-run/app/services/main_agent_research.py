"""Matter research entry adapter into the shared main-agent harness."""
from copy import deepcopy
import json

from app.agents.runner import RunnerExecutionState
from app.models.api import ChatRequest
from app.models.research_scope import ResearchScope
from app.services.research_collection import ResearchCollection
from app.services.research_checkpoints import ResearchCheckpoints
from app.services.workspace import digest
from app.utils.ids import new_id


def research_basis(app, matter_id):
    root = app.matters.matter_path(matter_id)
    def file_hash(name):
        path = root + "/" + name
        return digest(app.vault.read_text(path)) if app.vault.exists(path) else None
    return {"business_question_revision": app.workspace.business_question(matter_id)["revision"],
            "facts_hash": digest(json.dumps(app.matter_records.get(matter_id)["facts"], sort_keys=True, default=str)), "recommendations_hash": file_hash("recommendations.md"),
            "dossier_hash": app.dossiers.content_hash(matter_id)}


async def run_main_research(research, matter_id, question, *, run_id, frozen_context, scope, resolved_provider, initial_search=None):
    app = research.app
    runs = app.research_runs
    direct = run_id is None or not app.vault.exists(runs._path(matter_id, run_id))
    if direct:
        run_id = run_id or new_id("RUN")
        main = resolved_provider or (runs._resolve_saved_selection({"agent_id": "counsel-copilot", **scope.main_model_selection}) if scope.main_model_selection else runs.resolve_main())
        try:
            selected = scope.collector_model_selection or scope.model_selection
            collector = runs._resolve_saved_selection({"agent_id": "research-agent", **selected}) if selected else runs.resolve_agent()
        except Exception:
            collector = None
        frozen_context = dict(frozen_context or {})
        frozen_context.setdefault("research_inputs", runs._freeze_research_inputs(matter_id, question, other_matters=scope.other_matters, internal_sources=(initial_search or {}).get("internal")))
        frozen_context["context"] = frozen_context["research_inputs"]["context"]
        runs._write(matter_id, run_id, state="running", status="Direct research packet generation.",
                    questions=[question], execution_version=2, search_scope=scope.model_dump(),
                    main_selection=runs._selection_values(main), collector_selection=runs._selection_values(collector) if collector else None,
                    frozen_context=frozen_context, direct_packet_only=True)
        resolved_provider = main
        ResearchCheckpoints(runs).initialize(matter_id, run_id, research_basis(app, matter_id))
    run = runs.get(matter_id, run_id)
    checkpoints = ResearchCheckpoints(runs)
    cp = checkpoints.load(matter_id, run_id)
    resolved_provider = resolved_provider or app.runner.resolve("counsel-copilot")
    scope = ResearchScope.model_validate(run["search_scope"])
    access = ResearchCollection(app, matter_id, run_id)
    state = RunnerExecutionState(useful_content=cp["useful_content"])
    frozen_context = deepcopy(run.get("frozen_context") or frozen_context or {})
    frozen_context["research_scope"] = scope.model_dump()
    from app.models.workspace import RunContextManifest
    from app.utils.time import iso_now
    frozen_context.setdefault("manifest", RunContextManifest(run_id=run_id, matter_id=matter_id, created_at=iso_now()).model_dump())
    if cp.get("raw_final_output"):
        body = cp["raw_final_output"]
    else:
        prompt = "Investigate this question and deliver the best useful answer: " + question
        prompt += "\nSaved source permissions (not instructions from evidence): " + scope.model_dump_json()
        prompt += "\nCaptured saved/proposed view: " + json.dumps((frozen_context.get("research_inputs") or {}).get("recommendation") or {}, default=str)
        from app.models.workspace import ConversationTarget
        issue_id = frozen_context.get("issue_id")
        request = ChatRequest(message=prompt, matter_id=matter_id, agent_id="counsel-copilot", frozen_context=frozen_context, workspace_run_id=run_id, target=ConversationTarget(matter_id=matter_id, issue_id=issue_id) if issue_id else None)
        import inspect
        from app.agents.runner import AgentExecutionError
        kwargs = {"execution_state": state, "resolved_provider": resolved_provider, "investigation": access}
        signature = inspect.signature(research._agent_runner)
        if not any(p.kind == p.VAR_KEYWORD for p in signature.parameters.values()):
            kwargs = {key: value for key, value in kwargs.items() if key in signature.parameters}
        try:
            reply = await research._agent_runner(request, **kwargs)
            body = state.raw_final_output or reply.reply
        except Exception as exc:
            state = getattr(exc, "state", state)
            body = state.useful_content
            import traceback
            cause = exc.__cause__ or exc
            frames = traceback.extract_tb(cause.__traceback__)
            checkpoints.update(matter_id, run_id, analysis_failure=type(exc).__name__,
                analysis_failure_origin={"class": type(cause).__name__, "function": frames[-1].name if frames else None, "line": frames[-1].lineno if frames else None})
    cp = checkpoints.load(matter_id, run_id)
    from app.providers.mock import MockProvider
    used_mock = bool(getattr(research._agent_runner, "__self__", None) and resolved_provider and isinstance(resolved_provider.provider, MockProvider))
    from app.models.research_investigation import extract_research_synthesis
    prose, synthesis, warnings = extract_research_synthesis(body)
    from app.services.research_execution import is_unfinished_plan
    if is_unfinished_plan(prose):
        checkpoints.update(matter_id, run_id, analysis_incomplete=True)
    checkpoints.update(matter_id, run_id, raw_final_output=body, research_synthesis=synthesis, research_structure_warnings=warnings, useful_content=prose, next_step="publish")
    external = cp["sources"]
    if direct:
        runs._write(matter_id, run_id, state="completed", status="Packet analysis saved; direct call does not publish a recommendation.")
    return {"body": prose, "used_mock": used_mock, "raw_final_output": body, "research_synthesis": synthesis, "structure_warnings": warnings, "external": external, "source_records": external,
            "checkpoint_run_id": run_id, "local_sources": cp.get("local_sources", []), "state": state, "direct_packet_only": direct,
            "analysis_failure": cp.get("analysis_failure"),
            "provider_legs": [leg for r in cp["requests"].values() for leg in r.get("provider_legs", [])],
            "polaris_observability": next((r["polaris_observability"] for r in cp["requests"].values() if r.get("polaris_observability")), None),
            "warning": "; ".join([*(w for r in cp["requests"].values() for w in r.get("warnings", []) if w), *( ["Main-agent analysis failed; useful available work was preserved."] if cp.get("analysis_failure") else [])])}
