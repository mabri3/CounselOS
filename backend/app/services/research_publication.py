"""Retry-safe composition of a saved main-agent answer into existing records."""
from app.services.dossier import serialized
from app.services.main_agent_research import research_basis
from app.services.recommendations import RecommendationService
from app.services.research_checkpoints import ResearchCheckpoints
from app.services.dossier_research import assumption_view, prepare_publication, publication_sources, render_publication


@serialized
def publish_research_result(app, *, matter_id, run_id, packet_path, prose, synthesis):
    checkpoints = ResearchCheckpoints(app.research_runs)
    cp = checkpoints.load(matter_id, run_id)
    run = app.research_runs.get(matter_id, run_id)
    if cp["stop_requested"]:
        return {"state": "stopped", "packet_path": packet_path}
    packet = app.vault.read_markdown(packet_path)
    metadata = packet["metadata"]
    if metadata.get("matter_id") != matter_id or metadata.get("run_id") != run_id:
        raise ValueError("Research packet does not belong to this run.")
    key = f"research:{run_id}:{metadata['output_revision']}"
    receipts = cp["publication_receipts"]
    receipts["packet"] = {"state": "saved", "path": packet_path}
    checkpoints.update(matter_id, run_id, publication_receipts=receipts, phase="publishing", next_step="publish")
    recommendation = RecommendationService(app.vault, app.matters)
    current = recommendation.get(matter_id)
    own = next((v for v in [current.get("proposal"), *(v for v in current["versions"] if v["version_id"] == current.get("current_version_id"))] if v and (v.get("research_publication") or {}).get("key") == key), None)
    now = research_basis(app, matter_id)
    stale = any(now[k] != cp["basis"].get(k) for k in ("business_question_revision", "facts_hash"))
    frozen = run.get("frozen_context") or {}
    path_capture = frozen.get("active_path") or {}
    current_direction = app.solution_paths.state(matter_id)
    captured_direction = frozen.get("mainline_state") or {}
    path_historical = bool(path_capture.get("path_id") and (path_capture["path_id"] != current_direction["mainline_path_id"] or (captured_direction.get("revision") and captured_direction["revision"] != current_direction["revision"])))
    stale = stale or path_historical
    if path_capture.get("path_id") and "path_analysis" not in receipts:
        try:
            receipts["path_analysis"] = app.workspace_scenarios.persist_analysis(matter_id,path_capture["path_id"],prose,expected_revision=path_capture["revision"],source_action_key=key+":path")
            checkpoints.update(matter_id,run_id,publication_receipts=receipts)
        except (OSError,ValueError,KeyError):
            pass
    changed_advice = now["recommendations_hash"] != cp["basis"].get("recommendations_hash") and own is None
    warning = ("This answer uses earlier facts or an earlier question. Current advice was not replaced. Rerun on the current facts." if stale else
               "The saved advice changed during research. This answer is a review-only research result. Review or rerun before adoption." if changed_advice else "")
    issues = app.workspace.issues(matter_id)
    issue_ids = {issue["issue_id"] for issue in issues}
    structure = metadata.get("problem_analysis_structure") or {}
    addressed_ids = {item.get("issue_id") for item in [*(synthesis or {}).get("issue_updates", []), *structure.get("questions", [])]} & issue_ids
    focused = bool(frozen.get("issue_id") or addressed_ids and addressed_ids != issue_ids)
    if metadata.get("problem_analysis_structure") is not None and (not receipts.get("problem_analysis", {}).get("saved") or receipts.get("problem_analysis", {}).get("retry_projection")):
        try:
            receipts["problem_analysis"] = app.problem_analysis.publish(matter_id, path=packet_path, run_id=run_id,
                output_revision=metadata["output_revision"], structure=metadata["problem_analysis_structure"],
                capture=metadata.get("problem_analysis_capture"),
                current_eligible=not stale and not changed_advice and not focused)
            # A failed pointer write remains retryable without another model call.
            if not receipts["problem_analysis"].get("projection_saved") and receipts["problem_analysis"].get("saved"):
                receipts["problem_analysis"]["retry_projection"] = True
            checkpoints.update(matter_id, run_id, publication_receipts=receipts)
        except (OSError, ValueError, KeyError, TypeError):
            receipts["problem_analysis"] = {"state": "failed", "warnings": ["Breakdown publication failed; useful research retained."]}
    errors = []
    advisory = []
    source_ids = {s["source_id"] for s in metadata.get("source_records", [])}
    publication = {"key": key, "basis": cp["basis"], "packet_path": packet_path,
                   "reconciliation_pending": synthesis is None or bool(metadata.get("research_structure_warnings"))}
    has_analysis = bool(((synthesis or {}).get("recommendation") or prose).strip()) and not cp.get("analysis_incomplete")
    if not has_analysis:
        receipts["recommendation"] = {"state": "analysis_unavailable"}
        receipts["dossier"] = {"state": "not_applied"}
    elif not stale and not changed_advice:
        if "recommendation" not in receipts:
            try:
                if not own:
                    for update in (synthesis or {}).get("assumption_updates", []):
                        try:
                            app.matter_records.retire_generated_assumption(matter_id, **update, allowed_source_ids=source_ids, run_id=run_id)
                        except (KeyError, ValueError) as exc:
                            advisory.append(str(exc))
                            publication["reconciliation_pending"] = True
                    records = app.matter_records.get(matter_id)
                    relied = set((synthesis or {}).get("relied_on_assumption_ids", []))
                    known = {a["assumption_id"] for a in records["assumptions"]}
                    if relied - known:
                        advisory.append("Unknown relied-on assumption IDs ignored.")
                    if not ((synthesis or {}).get("recommendation") or prose).strip():
                        raise ValueError("No useful main-agent analysis is available for a recommendation.")
                    publication = prepare_publication(current, run, metadata, synthesis, prose, issues, publication)
                    publication["assumption_summary"] = assumption_view(records, synthesis)
                    # A focused answer cannot replace the whole matter's summary
                    # or questions. A broad answer can fill an empty orientation;
                    # replacing existing content requires coverage of every issue.
                    if not focused:
                        orientation = app.dossiers.orientation(matter_id)
                        all_issues = bool(issue_ids and addressed_ids == issue_ids)
                        publication["orientation"] = {
                            "summary": app.dossiers.section(prose, "Matter summary") if all_issues or not orientation["summary"] else "",
                            "open_questions": app.dossiers.list_section(prose, "Open questions") if all_issues or not orientation["open_questions"] else [],
                        }
                    publication["source_support"] = publication_sources(publication, issues)
                    content = render_publication(publication, issues, current_basis=now)
                    kwargs = {"actor": "counsel-copilot", "rebuild": False, "project_dossier": False,
                              "next_action": publication["next_action"], "publication": publication}
                    result = recommendation.propose(matter_id, content, **kwargs) if current["current_version_id"] or current["content"].strip() else recommendation.set_working(matter_id, content, origin="initial_agent", **kwargs)
                    own = result.get("proposal") or next((v for v in result["versions"] if v["version_id"] == result["current_version_id"]), None)
                receipts["recommendation"] = {"state": "proposed" if current.get("current_version_id") or current["content"].strip() else "initial", "version_id": own["version_id"]}
                checkpoints.update(matter_id, run_id, publication_receipts=receipts)
            except Exception as exc:
                errors.append(f"Recommendation publication failed: {type(exc).__name__}.")
        if "dossier" not in receipts and "recommendation" in receipts:
            try:
                result = app.dossiers.project_current_work_state(matter_id, expected_hash=cp["basis"].get("dossier_hash"))
                if result.get("state") == "failed":
                    raise ValueError("Dossier projection failed")
                receipts["dossier"] = result
                checkpoints.update(matter_id, run_id, publication_receipts=receipts)
            except Exception as exc:
                errors.append(f"Dossier publication failed: {type(exc).__name__}.")
    else:
        receipts["recommendation"] = {"state": "historical" if stale else "review_only"}
        if "dossier" not in receipts:
            try:
                current_dossier = app.dossiers.get(matter_id)
                content = (current_dossier or {}).get("content", "# Matter dossier\n")
                content += "\n\n## Research result for review\n\n" + warning + "\n\n" + prose
                receipts["dossier"] = app.dossiers.propose_update(matter_id, content, expected_hash="review-only", publication_key=key)
            except Exception as exc:
                errors.append(f"Dossier review revision failed: {type(exc).__name__}.")
    if run.get("origin_conversation_id"):
        try:
            content = (synthesis or {}).get("summary") or prose or "No model analysis is available. Saved evidence remains in the research packet."
            if not has_analysis:
                content = "Research is incomplete. The model did not deliver an answer. The saved partial output follows; it was not adopted as advice.\n\n" + content
            content += "\n\n" + warning if warning else ""
            content += f"\n\n[Open full research]({packet_path})"
            if receipts.get("recommendation", {}).get("version_id"):
                content += f"\n\n[Review the research-based recommendation proposal]({current['path']}) — not a recorded decision."
            revision = receipts.get("dossier", {}).get("revision_path")
            if revision:
                content += f"\n\n[Open dossier revision]({revision})"
            if errors:
                content += "\n\nPublication is partial: " + " ".join(errors)
            saved = app.chat_history.upsert_run_assistant(matter_id, run["origin_conversation_id"], run_id, content=content)
            message = next(m for m in saved["messages"] if m.get("run_id") == run_id and m["role"] == "assistant")
            receipts["conversation"] = {"state": "saved", "message_id": message["message_id"]}
        except Exception as exc:
            errors.append(f"Conversation delivery failed: {type(exc).__name__}.")
    else:
        receipts["conversation"] = {"state": "no_origin"}
    result = {"state": "partial" if errors else "historical" if stale or changed_advice else "analysis_incomplete" if cp.get("analysis_incomplete") or cp.get("analysis_failure") and not has_analysis else "published", "receipts": receipts, "warnings": errors + advisory, "basis_warning": warning}
    checkpoints.update(matter_id, run_id, publication_receipts=receipts, phase="partial" if errors else "complete", next_step="publish" if errors else "complete")
    app.research_runs._write(matter_id, run_id, publication=result, status="Research result published." if not errors else "Research saved; publication needs retry.")
    return result
