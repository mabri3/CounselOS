"""Bounded batch execution and group-publication coordination for a parent request.

The coordinator controls order and records progress. It runs batches of up to
three managed research children in this process using direct asyncio tasks — no
new queue. It never supplies a second legal opinion. The Markdown parent record
is the durable truth; this module only advances it through short, locked writes
between awaits.

Group composition/publication (Step 7) is layered on `compose_batch`; this module
owns the ordering, failure isolation, first-pass boundary, and control state.
"""
from __future__ import annotations

import asyncio
from copy import deepcopy

from app.services.dossier import WORKSPACE_LOCK
from typing import Any

from app.utils.time import iso_now

BATCH_SIZE = 3

# Managed child states mapped to parent issue work states.
_CHILD_TO_ISSUE = {
    "ready_for_composition": "saved",
    "partial": "partial",
    "failed": "failed",
    "interrupted": "interrupted",
}


def _batch_order(metadata: dict[str, Any]) -> list[str]:
    first = list(metadata.get("first_issue_ids") or [])
    planned = list(metadata.get("planned_issue_ids") or [])
    order = first + [iid for iid in planned if iid not in first]
    return [iid for iid in order if iid in (metadata.get("issues") or {})]


def _next_batch(metadata: dict[str, Any]) -> list[str]:
    issues = metadata.get("issues") or {}
    queued = [iid for iid in _batch_order(metadata) if (issues.get(iid) or {}).get("state") == "queued"]
    return queued[:BATCH_SIZE]


def _next_unpublished_batch(metadata: dict[str, Any]) -> list[str]:
    """Return a fully collected batch whose publication receipt is missing."""
    published = {
        tuple(str(iid) for iid in (entry.get("issue_ids") or []))
        for entry in (metadata.get("publications") or []) if isinstance(entry, dict) and entry.get("state") in {"applied", "review_required"}
    }
    order = _batch_order(metadata)
    issues = metadata.get("issues") or {}
    for offset in range(0, len(order), BATCH_SIZE):
        batch = order[offset:offset + BATCH_SIZE]
        if tuple(batch) in published:
            continue
        states = [(issues.get(iid) or {}).get("state") for iid in batch]
        if batch and all(state in {"saved", "partial", "failed"} for state in states):
            return batch
    return []


def _combined_source_records(publication: dict, issues: list) -> list[dict]:
    """Unique source records across the combined publication, no invented entries."""
    seen = {}
    from app.services.workspace import digest
    records = [record for entry in (publication.get("issue_positions") or {}).values() for record in entry.get("source_records") or []]
    records.extend(publication.get("source_records") or [])
    for record in records:
        sid = record.get("source_id") or record.get("path") or record.get("url")
        if not sid:
            continue
        key = (sid, record.get("source_version") or record.get("source_hash") or record.get("record_revision"), record.get("path"), record.get("locator"))
        if key not in seen:
            seen[key] = deepcopy(record)
        else:
            passages = {digest(p): p for p in [*seen[key].get("selected_passages", []), *record.get("selected_passages", [])]}
            seen[key]["selected_passages"] = list(passages.values())
            if record.get("reference_key"):
                seen[key]["reference_key"] = record["reference_key"]
    return list(seen.values())


def _record_publication(service, matter_id, request_id, entry, *, first_pass):
    def compose(metadata, content):
        publications = list(metadata.get("publications") or [])
        entry["batch_index"] = len(publications)
        old = [p for p in publications if p.get("key") == entry.get("key")]
        if old:
            metadata.setdefault("publication_attempts", []).extend(old)
            publications = [p for p in publications if p.get("key") != entry.get("key")]
        publications.append(entry)
        metadata["publications"] = publications
        if first_pass and entry.get("revision_path") and entry.get("state") in {"applied", "review_required"} and metadata.get("first_pass_ready_at") is None:
            metadata["first_pass_ready_at"] = iso_now()
            metadata["phase"] = "remaining_batch" if metadata.get("scope") == "all" else "finished"
        elif not first_pass:
            metadata["phase"] = "update_compose"
        # Advance expected hashes only after an uncontested own publication.
        if entry.get("state") == "applied":
            if entry.get("dossier_hash"):
                metadata["expected_dossier_hash"] = entry["dossier_hash"]
            if entry.get("recommendations_hash"):
                metadata["expected_recommendations_hash"] = entry["recommendations_hash"]
            if entry.get("business_question_revision"):
                metadata["expected_business_question_revision"] = entry["business_question_revision"]
        return metadata, content

    return service._mutate(matter_id, request_id, compose, expected_sequence=None)


async def publish_batch(service: Any, matter_id: str, request_id: str, issue_ids: list[str]) -> dict[str, Any]:
    """Compose and publish one batch as a single group publication.

    Folds all valid child results into one candidate map, checks the frozen basis
    and independent lawyer edits, writes at most one proposed recommendation and
    one dossier revision, and records receipts. Reuses prepare_publication,
    render_publication, RecommendationService and generate_dossier. Idempotent on
    the batch key (request id + ordered child output revisions).
    """
    from app.services.dossier_generation import generate_dossier
    from app.services.dossier_research import (
        assumption_view,
        prepare_publication,
        publication_sources,
        render_publication,
    )
    from app.services.main_agent_research import research_basis
    from app.services.recommendations import RecommendationService
    from app.services.workspace import digest

    app = service.app
    with WORKSPACE_LOCK:
        record = service.get_record(matter_id, request_id)
        metadata = record["metadata"]
        first_pass = metadata.get("first_pass_ready_at") is None
        issues = deepcopy((((metadata.get("frozen_context") or {}).get("dossier_inputs") or {}).get("data") or {}).get("issues"))
        if issues is None:
            issues = app.workspace.issues(matter_id)

        # Gather this batch's child packets from the durable child records.
        child_refs = []
        for iid in issue_ids:
            entry = (metadata.get("issues") or {}).get(iid) or {}
            packet_path = entry.get("packet_path")
            run_id = entry.get("child_run_id")
            if not packet_path or not app.vault.exists(packet_path):
                continue
            packet = app.vault.read_markdown(packet_path)["metadata"]
            child_refs.append((iid, run_id, packet_path, packet))

        output_revisions = sorted(str(p.get("output_revision")) for *_, p in child_refs)
        batch_key = "dossier-batch:" + digest(request_id + ":" + ":".join(issue_ids) + ":" + ":".join(output_revisions))

        # Replay: this exact batch was already published; do not duplicate anything.
        for pub in metadata.get("publications") or []:
            if pub.get("key") == batch_key and pub.get("state") in {"applied", "review_required"}:
                return service.get(matter_id, request_id)

        rec = RecommendationService(app.vault, app.matters)
        current = rec.get(matter_id)
        now = research_basis(app, matter_id)
        parent_basis = metadata.get("input_basis") or {}
        stale = (now.get("facts_hash") != parent_basis.get("facts_hash") or now.get("business_question_revision") !=
                 metadata.get("expected_business_question_revision", parent_basis.get("business_question_revision")))
        prior_pub = (current.get("proposal") or {}).get("research_publication") or {}
        own = prior_pub.get("key") == batch_key
        changed_advice = now.get("recommendations_hash") != metadata.get("expected_recommendations_hash", parent_basis.get("recommendations_hash"))
        saved_candidate = (metadata.get("batch_candidates") or {}).get(batch_key)
        if own and saved_candidate:
            # A receipt may be missing after the saved proposal effect. Check the
            # actual proposal and the unchanged working record, not just its owner.
            old_record = saved_candidate["recommendation_before"]
            proposal = current.get("proposal") or {}
            if (proposal.get("content") == saved_candidate["recommendation_content"]
                    and current["content"] == old_record["content"]
                    and current["versions"] == old_record["versions"]
                    and current["current_version_id"] == old_record["current_version_id"]):
                changed_advice = False
        stale = stale or (parent_basis.get("issues_revision") is not None and parent_basis["issues_revision"] != app.workspace.issues_revision(matter_id))

        # Fold each child result into one combined publication (chained prior view).
        combined = deepcopy(prior_pub) or {"issue_positions": {}, "source_records": []}
        chain_current = current
        for iid, run_id, packet_path, packet in child_refs:
            run = app.research_runs.get(matter_id, run_id) if run_id else {}
            seed = {"key": batch_key, "basis": parent_basis, "packet_path": packet_path,
                    "dossier_request_id": request_id}
            combined = prepare_publication(
                chain_current, run, packet, packet.get("research_synthesis"),
                packet.get("research_prose") or "", issues, seed,
            )
            chain_current = {"versions": [], "current_version_id": None,
                             "content": current["content"], "proposal": {"research_publication": combined}}

        records = app.matter_records.get(matter_id)
        combined["dossier_request_id"] = request_id
        combined["assumption_summary"] = assumption_view(records, None)
        combined["source_support"] = publication_sources(combined, issues) if child_refs else ""
        content = render_publication(combined, issues, current_basis=now) if child_refs else current["content"]
        if saved_candidate:
            combined = saved_candidate["publication"]
            content = saved_candidate["recommendation_content"]
        else:
            def save_candidate(md, body):
                md.setdefault("batch_candidates", {})[batch_key] = {"publication": combined,
                    "recommendation_content": content, "recommendation_before": current}
                return md, body
            service._mutate(matter_id, request_id, save_candidate, expected_sequence=None)

        receipts: dict[str, Any] = {}
        warning = ""
        if not stale and not changed_advice:
            # One combined proposed recommendation (or the initial working view).
            try:
                kwargs = {"actor": "counsel-copilot", "rebuild": False, "project_dossier": False,
                          "next_action": combined.get("next_action") or "", "publication": combined}
                if not child_refs:
                    receipts["recommendation"] = {"state": "not_required"}
                elif current["current_version_id"] or current["content"].strip():
                    result = rec.propose(matter_id, content, **kwargs)
                    own_version = result.get("proposal")
                    receipts["recommendation"] = {"state": "proposed", "version_id": (own_version or {}).get("version_id")}
                else:
                    result = rec.set_working(matter_id, content, origin="initial_agent", **kwargs)
                    latest = next((v for v in result["versions"] if v["version_id"] == result["current_version_id"]), {})
                    receipts["recommendation"] = {"state": "initial", "version_id": latest.get("version_id")}
            except Exception as exc:
                receipts["recommendation"] = {"state": "failed", "error": type(exc).__name__}
            expected_hash = metadata.get("expected_dossier_hash") or parent_basis.get("dossier_hash")
            if receipts.get("recommendation", {}).get("state") != "failed":
                own_hash = research_basis(app, matter_id).get("recommendations_hash")
                def save_recommendation_receipt(md, body):
                    md["expected_recommendations_hash"] = own_hash
                    return md, body
                service._mutate(matter_id, request_id, save_recommendation_receipt, expected_sequence=None)
        else:
            warning = ("This dossier uses earlier facts or an earlier question; current advice was not replaced."
                       if stale else
                       "The saved advice changed during research; this is a review-only update.")
            expected_hash = "review-only"

        # Whole-dossier composition through the existing no-tools writer. A stable run
        # id makes a re-run replay the saved revision without another model call.
        writer_run_id = "DOSGEN-" + digest(batch_key)[:16]
        source_records = _combined_source_records(combined, issues)
        saved_writer = (metadata.get("writer_responses") or {}).get(batch_key)
        from app.services.dossier_generation_context import capture, resolve_issue_analysis, basis
        frozen = deepcopy(metadata.get("frozen_context") or {})
        captured = deepcopy(frozen.get("dossier_inputs")) or capture(app, matter_id, frozen)
        captured["data"]["issue_analysis"] = resolve_issue_analysis(app, matter_id, captured["data"]["issues"], combined)
        for iid, item in captured["data"]["issue_analysis"].items():
            if not item.get("researched"):
                prepared = (metadata.get("issues") or {}).get(iid, {})
                item.update(position=prepared.get("initial_answer") or item.get("position", ""), next_action=prepared.get("next_action", ""))
        captured["data"]["proposed_working_view"] = {"research_publication": combined}
        from app.services.dossier_references import build_catalog
        captured["references"] = build_catalog(app, matter_id, snapshot={"data": captured["data"]})
        # Only our known recommendation write advances this input's revision.
        rec_path = app.matters.matter_path(matter_id) + "/recommendations.md"
        if not stale and not changed_advice:
            current_basis = basis(app, matter_id)
            if rec_path in current_basis:
                captured["basis"][rec_path] = current_basis[rec_path]
            if metadata.get("expected_business_question_revision"):
                captured["basis"]["business_question"] = metadata["expected_business_question_revision"]
        calls = metadata.get("writer_calls") or {}
        saved_call = calls.get(batch_key)
        if saved_call:
            captured = saved_call["snapshot"]
            expected_hash = saved_call["expected_hash"]
            if saved_call["state"] in {"in_flight", "outcome_unknown"} and not saved_writer:
                raise ValueError("Dossier writer outcome is unknown. Choose Retry unknown call to try again; it may be charged again.")
        if not saved_writer:
            def reserve_writer(md, body):
                md.setdefault("writer_calls", {})[batch_key] = {"state": "in_flight", "snapshot": captured,
                    "expected_hash": expected_hash, "run_id": writer_run_id, "started_at": iso_now()}
                return md, body
            service._mutate(matter_id, request_id, reserve_writer, expected_sequence=None)

        def save_writer_response(execution_state) -> None:
            text = str(getattr(execution_state, "useful_content", "") or "").strip()
            if not text:
                return

            def retain(md, body):
                responses = dict(md.get("writer_responses") or {})
                responses.setdefault(batch_key, {
                    "content": text,
                    "selection": dict((getattr(execution_state, "frozen_context", {}) or {}).get("dossier_writer_selection") or {}),
                    "saved_at": iso_now(),
                })
                md["writer_responses"] = responses
                if batch_key in (md.get("writer_calls") or {}):
                    md["writer_calls"][batch_key]["state"] = "completed"
                return md, body

            service._mutate(matter_id, request_id, retain, expected_sequence=None)

    try:
        writer = await generate_dossier(
            app, matter_id,
            request="Compose the whole dossier: an overview, initial answers for unresearched issues, and the full researched analysis for each researched issue. Preserve all workstreams and material conditions.",
            save=True, expected_hash=expected_hash, run_id=writer_run_id,
            prepared_content=(saved_writer or {}).get("content"),
            prepared_selection=(saved_writer or {}).get("selection"),
            checkpoint=save_writer_response,
            frozen_context={**frozen, "dossier_inputs": captured},
        )
        source_records = _combined_source_records({"source_records": [*source_records, *writer.get("source_records", [])]}, [])
        state = {"applied": "applied", "review_required": "review_required"}.get(writer.get("state"), "failed")
        if state == "applied" and not stale and not changed_advice:
            warning = ""
        revision_path = writer.get("revision_path")
        receipts["dossier"] = {"state": state, "revision_path": revision_path}
        dossier_hash = app.dossiers.content_hash(matter_id) if state == "applied" else None
        # Persist the readable source records with the saved dossier output so the
        # document reader (ClaimMarkdown) can show each reference's exact record.
        if source_records:
            for target in (revision_path, app.dossiers._path(matter_id) if state == "applied" else None):
                if target and app.vault.exists(target):
                    try:
                        app.vault.update_markdown(target, metadata_updates={"source_records": source_records})
                    except Exception:
                        pass
    except Exception as exc:
        state = "failed"
        revision_path = None
        dossier_hash = None
        receipts["dossier"] = {"state": "failed", "error": type(exc).__name__}

    # Idempotent conversation update in the originating conversation.
    conversation_id = (metadata.get("origin") or {}).get("conversation_id")
    if conversation_id:
        try:
            from app.models.api import DossierResearchCard

            titles = [i["title"] for i in issues if i["issue_id"] in issue_ids]
            summary = (("First dossier ready. " if first_pass else "Dossier updated. ") if revision_path else "Dossier saving failed. The saved research remains available. ")
            summary += "Researched: " + "; ".join(t[:60] for t in titles) + "."
            if warning:
                summary += " " + warning
            if revision_path:
                summary += f"\n\n[Open dossier revision]({revision_path})"
            next_status = service.get(matter_id, request_id)
            card = DossierResearchCard(
                request_id=request_id,
                matter_id=matter_id,
                state=next_status["state"],
                phase=next_status["phase"],
                presentation="progress",
                status=next_status,
            )
            message_key = f"{request_id}:batch:{len(metadata.get('publications') or [])}"
            saved = app.chat_history.upsert_run_assistant(
                matter_id, conversation_id, message_key,
                content=summary,
                cards=[card.model_dump(mode="json")],
                source_records=source_records,
            )
            message = app.chat_history.find_run_message(
                matter_id, conversation_id, message_key, "assistant"
            )
            receipts["conversation"] = {"state": "saved", "message_id": (message or {}).get("message_id")}
        except Exception as exc:
            receipts["conversation"] = {"state": "failed", "error": type(exc).__name__}

    recommendations_hash = research_basis(app, matter_id).get("recommendations_hash")
    entry = {
        "key": batch_key, "issue_ids": list(issue_ids),
        "state": "review_required" if state in {"applied", "review_required"} and (stale or changed_advice) else state,
        "revision_path": revision_path, "receipts": receipts, "composed_at": iso_now(),
        "warning": warning, "dossier_hash": dossier_hash, "recommendations_hash": recommendations_hash,
        "business_question_revision": writer.get("business_question_revision") if "writer" in locals() and state == "applied" else None,
        "writer_warnings": writer.get("warnings", []) if "writer" in locals() else [],
    }
    return _record_publication(service, matter_id, request_id, entry, first_pass=first_pass)


class DossierRequestExecutor:
    """Runs a parent request's batches and records progress. One per request."""

    def __init__(self, service: Any, matter_id: str, request_id: str):
        self.service = service
        self.app = service.app
        self.matter_id = matter_id
        self.request_id = request_id

    async def run(self) -> None:
        """Execute batches until the plan is done, stopped, or the scope is met."""
        try:
            # Ordinary research already running may finish first; wait for it so a
            # managed child never becomes a fourth concurrent worker.
            await self._await_existing_standalone()
            initial = self.service.get_record(self.matter_id, self.request_id)["metadata"]
            if initial.get("stop_requested"):
                self._finalize()
                return
            if initial.get("execution_mode") == "saved_only" or not initial.get("planned_issue_ids"):
                if not initial.get("stop_requested"):
                    await self._compose_batch([])
                self._finalize()
                return
            while True:
                record = self.service.get_record(self.matter_id, self.request_id)
                metadata = record["metadata"]
                if metadata.get("stop_requested"):
                    break
                unpublished = _next_unpublished_batch(metadata)
                if unpublished:
                    await self._compose_batch(unpublished)
                    if (self.service.get(self.matter_id, self.request_id).get("latest_publication") or {}).get("state") == "failed":
                        break
                    continue
                batch = _next_batch(metadata)
                if not batch:
                    break
                await self._run_batch(batch)
                await self._compose_batch(batch)
                if (self.service.get(self.matter_id, self.request_id).get("latest_publication") or {}).get("state") == "failed":
                    break
                # After the first batch we deliver; the remainder continues only
                # when the lawyer chose all identified issues.
                if metadata.get("scope") != "all":
                    break
            self._finalize()
        except asyncio.CancelledError:
            self._mark_interrupted()
            raise
        except Exception as exc:  # keep useful partial state; never crash the app
            self._record_error(f"{type(exc).__name__}: {exc}")
        finally:
            self.app.research_runs.release_matter_ownership(self.matter_id, self.request_id)
            self.app.research_runs.schedule_next_pending(self.matter_id)

    async def _await_existing_standalone(self) -> None:
        if not self.app.research_runs._has_active_standalone(self.matter_id):
            return
        def waiting(value):
            def update(md, body):
                md["waiting_for_existing_research"] = value
                return md, body
            self.service._mutate(self.matter_id, self.request_id, update, expected_sequence=None)
        waiting(True)
        try:
            while self.app.research_runs._has_active_standalone(self.matter_id):
                if self.service.get(self.matter_id, self.request_id).get("stop_requested"):
                    return
                await asyncio.sleep(0.05)
        finally:
            waiting(False)

    async def _run_batch(self, issue_ids: list[str]) -> None:
        # Create/refresh children and mark them running (short locked write).
        def mark_running(metadata, content):
            issues = metadata.get("issues") or {}
            for iid in issue_ids:
                child = self._ensure_child(metadata, iid)
                entry = dict(issues.get(iid) or {})
                entry["state"] = "running"
                entry["child_run_id"] = child["run_id"]
                issues[iid] = entry
            metadata["issues"] = issues
            metadata["state"] = "running"
            return metadata, content

        self.service._mutate(self.matter_id, self.request_id, mark_running, expected_sequence=None)

        record = self.service.get_record(self.matter_id, self.request_id)
        issues = record["metadata"].get("issues") or {}
        run_ids = [issues[iid]["child_run_id"] for iid in issue_ids]
        tasks = []
        for run_id in run_ids:
            child = self.app.research_runs.get(self.matter_id, run_id)
            if child.get("managed_state") in {"ready_for_composition", "partial", "failed"}:
                continue
            tasks.append(self.app.research_runs.launch_managed_child(self.matter_id, run_id))
        # Failure isolation: one child failing must not cancel its siblings.
        await asyncio.gather(*tasks, return_exceptions=True)

        # Record each child's outcome from its durable run record.
        def record_outcomes(metadata, content):
            issues = metadata.get("issues") or {}
            for iid in issue_ids:
                run_id = (issues.get(iid) or {}).get("child_run_id")
                entry = dict(issues.get(iid) or {})
                try:
                    child = self.app.research_runs.get(self.matter_id, run_id)
                except KeyError:
                    entry["state"] = "failed"
                    entry["last_error"] = "Child run record missing."
                    issues[iid] = entry
                    continue
                managed_state = str(child.get("managed_state") or "")
                entry["state"] = _CHILD_TO_ISSUE.get(managed_state, "failed")
                entry["last_error"] = child.get("failure_detail")
                results = child.get("results") or []
                packet_path = results[0]["path"] if results and isinstance(results[0], dict) and results[0].get("path") else None
                entry["packet_path"] = packet_path
                entry.update(self._packet_counts(packet_path, run_id))
                issues[iid] = entry
            metadata["issues"] = issues
            return metadata, content

        self.service._mutate(self.matter_id, self.request_id, record_outcomes, expected_sequence=None)

    def _packet_counts(self, packet_path: str | None, run_id=None) -> dict[str, Any]:
        from app.services.dossier_research import source_coverage
        sources = []
        if packet_path and self.app.vault.exists(packet_path):
            sources = self.app.vault.read_markdown(packet_path)["metadata"].get("source_records") or []
        elif run_id:
            cp = self.app.research_runs.get(self.matter_id, run_id).get("checkpoint") or {}
            sources = cp.get("sources") or []
            for request in (cp.get("requests") or {}).values():
                sources = [*sources, *request.get("sources", [])]
        return source_coverage(sources)

    def _ensure_child(self, metadata: dict[str, Any], issue_id: str) -> dict[str, Any]:
        existing = (metadata.get("issues") or {}).get(issue_id) or {}
        run_id = existing.get("child_run_id")
        if run_id and self.app.vault.exists(self.app.research_runs._path(self.matter_id, run_id)):
            return self.app.research_runs.get(self.matter_id, run_id)
        source_scope = metadata.get("source_scope") or {}
        focused = (source_scope.get("focused_topics") or {}).get(issue_id, "")
        selections = metadata.get("model_selections") or {}
        question = self._issue_question(metadata, issue_id)
        return self.app.research_runs.create_managed_child(
            self.matter_id,
            parent_request_id=self.request_id,
            issue_id=issue_id,
            question=question,
            focused_topic=focused,
            source_scope=source_scope,
            main_selection=selections.get("main"),
            collector_selection=selections.get("collector"),
        )

    @staticmethod
    def _issue_question(metadata: dict[str, Any], issue_id: str) -> str:
        entry = (metadata.get("issues") or {}).get(issue_id) or {}
        title = entry.get("title") or issue_id
        brief = entry.get("brief") or ""
        from app.services.dossier_requests import DossierRequestService
        return DossierRequestService._issue_question(entry, issue_id, metadata.get("priorities"), metadata.get("date_candidates"))

    async def _compose_batch(self, issue_ids: list[str]) -> None:
        """Compose and publish one batch, then record the boundary and readiness."""
        await publish_batch(self.service, self.matter_id, self.request_id, issue_ids)

    def _finalize(self) -> None:
        def finalize(metadata, content):
            issues = metadata.get("issues") or {}
            selected = [iid for iid in _batch_order(metadata)]
            states = [(issues.get(iid) or {}).get("state") for iid in selected]
            if metadata.get("stop_requested"):
                metadata["state"] = "stopped"
            elif not metadata.get("first_pass_ready_at") or any(p.get("state") in {"failed", "not_written"} for p in metadata.get("publications", [])) or any(s in {"failed", "interrupted"} for s in states):
                metadata["state"] = "partial"
            else:
                metadata["state"] = "completed"
            metadata["phase"] = "finished"
            metadata["finished_at"] = iso_now()
            return metadata, content

        self.service._mutate(self.matter_id, self.request_id, finalize, expected_sequence=None)

    def _mark_interrupted(self) -> None:
        def interrupt(metadata, content):
            metadata["state"] = "interrupted"
            issues = metadata.get("issues") or {}
            for iid, entry in issues.items():
                if (entry or {}).get("state") == "running":
                    entry["state"] = "interrupted"
            metadata["issues"] = issues
            return metadata, content

        try:
            self.service._mutate(self.matter_id, self.request_id, interrupt, expected_sequence=None)
        except Exception:
            pass

    def _record_error(self, message: str) -> None:
        def record(metadata, content):
            metadata["state"] = "failed"
            metadata["last_error"] = message
            return metadata, content

        try:
            self.service._mutate(self.matter_id, self.request_id, record, expected_sequence=None)
        except Exception:
            pass
