"""Main-directed collection using existing transports and exact saved source text."""
import asyncio
import hashlib
import json
import time

from app.models.research_scope import ResearchScope
from app.models.research_investigation import ResearchEvidenceBatch, ResearchSourceRead
from app.services.research_checkpoints import ResearchCheckpoints, LIMITS
from app.services.workspace import digest

INVESTIGATION_TOOLS = frozenset({"collect_research_evidence", "read_research_source", "read_file", "list_files", "search_vault"})


class ResearchCollection:
    def __init__(self, app, matter_id, run_id):
        self.app, self.matter_id, self.run_id = app, matter_id, run_id
        self.checkpoints = ResearchCheckpoints(app.research_runs)
        self.run = app.research_runs.get(matter_id, run_id)
        self.scope = ResearchScope.model_validate(self.run["search_scope"])
        self.scope_hash = digest(json.dumps(self.scope.model_dump(), sort_keys=True))
        self.clock = time.monotonic

    def validate(self, matter_id):
        run = self.app.research_runs.get(self.matter_id, self.run_id)
        if (matter_id != self.matter_id or run.get("execution_version") != 2
                or run.get("state") not in {"queued", "running"}
                or digest(json.dumps(run["search_scope"], sort_keys=True)) != self.scope_hash):
            raise ValueError("Investigation identity or saved scope changed.")
        cp = self.checkpoints.load(self.matter_id, self.run_id)
        if cp["stop_requested"] or cp["phase"] in {"publishing", "complete", "stopped"}:
            raise ValueError("Investigation no longer accepts evidence tools.")
        return cp

    def remaining(self):
        used = self.checkpoints.load(self.matter_id, self.run_id)["budget_used"]
        return {k: max(0, LIMITS[k] - used[k]) for k in LIMITS}

    async def collect(self, arguments):
        batch = ResearchEvidenceBatch.model_validate(arguments)
        cp = self.validate(self.matter_id)
        if self.scope.native and self.run.get("collection_warning"):
            return {"status": "failed", "error": self.run["collection_warning"], "remaining_budget": self.remaining()}
        if not self.scope.external:
            return {"status": "blocked", "error": "External sources were not authorized.", "remaining_budget": self.remaining()}
        key = "batch:" + digest(batch.model_dump_json())
        existing = next((c for c in cp["pending_calls"] if c["key"] == key and c["state"] == "completed"), None)
        if existing:
            return {**existing["result_ref"], "remaining_budget": self.remaining()}
        if self.remaining()["active_seconds"] <= 90:
            raise ValueError("Collection stopped to reserve synthesis time.")
        prior = cp["requests"]
        for request in batch.requests:
            if prior and not self.scope.allow_followup_queries:
                raise ValueError("Focused follow-up searches were not authorized.")
            if prior and (not request.followup_of or request.followup_of not in prior):
                raise ValueError("A follow-up must identify a saved request and what is missing.")
            if not self.scope.allow_followup_queries and request.public_query != self.scope.public_query:
                raise ValueError("Only the confirmed public query was authorized.")
            if any(r.get("public_query") == request.public_query and r.get("source_goal") == request.source_goal for r in prior.values()):
                raise ValueError("Change the query or source goal; do not repeat a broad search.")
        self.checkpoints.reserve_call(self.matter_id, self.run_id, key, key, {"batches": 1})
        results = []
        for request in batch.requests:
            result = await self._request(request)
            results.append(result)
        result = {"status": "retrieved" if any(s.get("support_state") == "retrieved" for r in results for s in r["sources"]) else "partial", "requests": results}
        self.checkpoints.complete_call(self.matter_id, self.run_id, key, result)
        return {**result, "remaining_budget": self.remaining()}

    async def _request(self, request):
        request_key = "request:" + digest(request.model_dump_json())
        cp = self.validate(self.matter_id)
        if request_key in cp["requests"]:
            return cp["requests"][request_key]
        result = {"request_key": request_key, **request.model_dump(), "status": "no_results", "sources": [], "warnings": []}
        search_result = {"external": [], "provider_legs": []}
        # Check all worker-facing public fields, not just the query.
        public_text = " ".join([request.proposition, request.jurisdiction, request.entity_activity, request.public_query, request.public_url or ""])
        if not self.app.research._prepare_public_query(self.matter_id, public_text, search_result):
            return {**result, "status": "blocked", "warnings": [search_result.get("warning")]}
        outbound = self.app.research._prepare_public_query(self.matter_id, request.public_query, search_result)
        reservation = self.checkpoints.reserve_call(self.matter_id, self.run_id, request_key, request_key, {"requests": 1})
        timeout = min(90, max(1, self.remaining()["active_seconds"] - 90))
        self.checkpoints.update(self.matter_id, self.run_id, active_time_reservation=timeout)
        started = self.clock()
        try:
            async with asyncio.timeout(timeout):
                if reservation["state"] == "completed" and "candidates" in reservation["result_ref"]:
                    candidates = reservation["result_ref"]["candidates"]
                    result["generated_worker_notes"] = reservation["result_ref"].get("generated_worker_notes", "")
                elif request.public_url:
                    candidates = [{"url": request.public_url, "title": request.public_url}]
                elif self.scope.native:
                    from app.services.native_research import discover, source_urls, answer_text
                    selection = self.run.get("collector_selection")
                    if not selection:
                        raise ValueError("The saved collection model is unavailable.")
                    raw = await discover(request.public_query, selection, self.app.settings)
                    result["generated_worker_notes"] = answer_text(raw)[:2000]
                    candidates = [{"url": url, "title": url} for url in source_urls(raw)[:4]]
                else:
                    for provider in self.scope.provider_ids:
                        provider_key = request_key + ":provider:" + provider
                        call = self.checkpoints.reserve_call(self.matter_id, self.run_id, provider_key, request_key, {})
                        if call["state"] == "completed":
                            search_result = call["result_ref"]
                        else:
                            import inspect
                            operation = self.app.research._run_external_provider
                            kwargs = {"transport_retry_count": 0} if "transport_retry_count" in inspect.signature(operation).parameters else {}
                            await operation(provider, outbound, search_result, **kwargs)
                            self.checkpoints.complete_call(self.matter_id, self.run_id, provider_key, search_result)
                        if search_result["external"]:
                            break
                    candidates = search_result["external"][:4]
                self.checkpoints.complete_call(self.matter_id, self.run_id, request_key, {"candidates": candidates, "generated_worker_notes": result.get("generated_worker_notes", "")})
                for candidate in candidates:
                    if not isinstance(candidate, dict) or not isinstance(candidate.get("url"), str):
                        result["warnings"].append("Malformed worker location ignored.")
                        continue
                    source = await self._fetch(candidate)
                    if source:
                        result["sources"].append(source)
                result["status"] = "retrieved" if any(s.get("support_state") == "retrieved" for s in result["sources"]) else "partial" if result["sources"] else "no_results"
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            result["status"] = "partial" if result["sources"] else "failed"
            result["warnings"].append(f"Collection failed: {type(exc).__name__}.")
        finally:
            cp = self.checkpoints.load(self.matter_id, self.run_id)
            cp.pop("active_time_reservation", None)
            cp["budget_used"]["active_seconds"] += max(0, self.clock() - started)
            self.checkpoints.save(self.matter_id, self.run_id, cp, expected_sequence=cp["sequence"])
        result["provider_legs"] = search_result.get("provider_legs", [])
        result["polaris_observability"] = search_result.get("polaris_observability")
        if search_result.get("warning"):
            result["warnings"].append(search_result["warning"])
        cp = self.checkpoints.load(self.matter_id, self.run_id)
        cp["requests"][request_key] = result
        self.checkpoints.save(self.matter_id, self.run_id, cp, expected_sequence=cp["sequence"])
        return result

    async def _fetch(self, candidate):
        url = candidate["url"]
        cp = self.validate(self.matter_id)
        saved = next((s for s in cp["sources"] if s.get("url") == url), None)
        if saved:
            return saved
        key = "fetch:" + digest(url)
        cache_path = self.app.matters.matter_path(self.matter_id) + "/research/sources/" + self.run_id + "-" + digest(url)[:20] + "-fetch.md"
        old = next((call for call in cp["pending_calls"] if call["key"] == key), None)
        if old and old["state"] != "completed" and self.app.vault.exists(cache_path):
            cache = self.app.vault.read_markdown(cache_path)["metadata"]
            if cache.get("url") == url and hashlib.sha256(self.app.vault.resolve(cache["binary_path"]).read_bytes()).hexdigest() == cache.get("binary_hash"):
                self.checkpoints.complete_call(self.matter_id, self.run_id, key, {"fetched": True})
        reservation = self.checkpoints.reserve_call(self.matter_id, self.run_id, key, digest(url), {"fetches": 1})
        if reservation["state"] == "completed" and not reservation["result_ref"].get("fetched"):
            return None if reservation["result_ref"].get("error") else reservation["result_ref"]
        from app.services.research_reader import read_source
        async def fallback_call(method, operation):
            fallback_key = key + ":" + method
            call = self.checkpoints.reserve_call(self.matter_id, self.run_id, fallback_key, digest(url + method), {})
            if call["state"] == "completed":
                return call["result_ref"]["text"]
            # Exceptions and process death leave this separate transport receipt
            # unfinished. Recovery requires explicit retry, including paid scrape.
            text = await operation()
            self.checkpoints.complete_call(self.matter_id, self.run_id, fallback_key, {"text": text})
            return text
        try:
            source = await read_source(url, self.app.settings, allow_firecrawl=self.scope.allow_firecrawl, source_directory=self.app.matters.matter_path(self.matter_id) + "/research/sources",
                                       cache_path=cache_path, on_fetched=lambda: self.checkpoints.complete_call(self.matter_id, self.run_id, key, {"fetched": True}), fallback_call=fallback_call)
        except Exception as exc:
            self.checkpoints.complete_call(self.matter_id, self.run_id, key, {"error": type(exc).__name__})
            return None
        source.update(url=url, title=str(candidate.get("title") or url), source_type="unknown")
        search_result = {"external": [source]}
        self.app.research._save_retrieved_sources(self.app.matters.matter_path(self.matter_id), search_result)
        if not source.get("path"):
            if source.get("original_file_path") and self.app.vault.exists(cache_path):
                text = self.app.vault.read_markdown(cache_path)["content"]
                source.update(source_id="SRC-" + digest(url)[:20], path=cache_path, source_hash=digest(text), source_version=digest(text), support_state="unverified_lead")
            else:
                raise ValueError("Retrieved source could not be saved.")
        text = self.app.vault.read_markdown(source["path"])["content"]
        record = {k: source.get(k) for k in ("source_id", "source_version", "source_hash", "path", "url", "title", "retrieved_at", "retrieval_method", "content_truncated", "source_type", "pages", "extraction_warnings", "original_file_path", "final_url", "links")}
        record.update(support_state=source.get("support_state", "retrieved"), available_excerpt=text[:1200] if source.get("support_state", "retrieved") == "retrieved" else None, excerpt_notice="Opening excerpt for relevance only; select a literal passage before citing support.")
        cp = self.checkpoints.load(self.matter_id, self.run_id)
        if record.get("pages"):
            record["pages"] = [{k: v for k, v in page.items() if k != "text"} for page in record["pages"]]
        preview = (record.get("available_excerpt") or "")[:int(self.remaining()["evidence_chars"])]
        record["available_excerpt"] = preview or None
        cp["budget_used"]["evidence_chars"] += len(preview)
        cp["sources"].append(record)
        self.checkpoints.save(self.matter_id, self.run_id, cp, expected_sequence=cp["sequence"])
        self.checkpoints.complete_call(self.matter_id, self.run_id, key, record)
        return record

    def capture_local(self, document):
        """Snapshot the actual local text shown to main, within its evidence budget."""
        cp = self.validate(self.matter_id)
        text = str(document.get("content") or "")
        source_id = "SRC-LOCAL-" + digest(str(document.get("path")) + text)[:20]
        saved_path = self.app.matters.matter_path(self.matter_id) + "/research/sources/" + source_id + ".md"
        if not self.app.vault.exists(saved_path):
            self.app.vault.write_markdown(saved_path, text, {"record_type": "supplied_source_snapshot", "source_id": source_id, "immutable": True, "editable": False, "original_path": document.get("path")})
        saved_text = self.app.vault.read_markdown(saved_path)["content"]
        selected = saved_text[:min(6000, int(self.remaining()["evidence_chars"]))]
        if not selected:
            raise ValueError("Evidence character budget exhausted; use saved passages.")
        record = {"source_id": source_id, "source_hash": digest(saved_text), "source_version": digest(saved_text),
                  "path": saved_path, "original_path": document.get("path"), "title": (document.get("metadata") or {}).get("title") or str(document.get("path", "")).split("/")[-1],
                  "support_state": "supplied", "source_type": "workspace", "available_excerpt": selected,
                  "selected_passages": [{"start": 0, "end": len(selected), "text": selected}], "content_truncated": len(selected) < len(saved_text)}
        cp["local_sources"] = [s for s in cp.get("local_sources", []) if s["source_id"] != source_id] + [record]
        cp["budget_used"]["evidence_chars"] += len(selected)
        self.checkpoints.save(self.matter_id, self.run_id, cp, expected_sequence=cp["sequence"])
        return {**document, "content": selected, "source_id": source_id, "source_snapshot_path": saved_path,
                "tool_view_notice": "Supplied local text. Use read_research_source with this source_id for another literal passage; omitted text is not reviewed."}

    def read(self, arguments):
        request = ResearchSourceRead.model_validate(arguments)
        cp = self.validate(self.matter_id)
        key = digest(request.model_dump_json())
        if key in cp["passages"]:
            return cp["passages"][key]
        source = next((s for s in [*cp["sources"], *cp.get("local_sources", [])] if s["source_id"] == request.source_id), None)
        if not source:
            raise ValueError("Source ID is not in this run's saved evidence.")
        if source.get("support_state") not in {"retrieved", "supplied"}:
            return {"status": "unread", "original_file_path": source.get("original_file_path"), "warnings": source.get("extraction_warnings", []), "remaining_budget": self.remaining()}
        text = self.app.vault.read_markdown(source["path"])["content"]
        start = request.start
        selected_page = None
        if request.page_number:
            selected_page = next((p for p in source.get("pages") or [] if p["page"] == request.page_number), None)
            if not selected_page:
                raise ValueError("Requested page was not extracted; review the saved source limits.")
            start = selected_page["start"]
        if request.find_text:
            found = text.find(request.find_text, selected_page["start"] if selected_page else 0, selected_page["end"] if selected_page else len(text))
            if found < 0:
                return {"status": "not_found", "remaining_budget": self.remaining()}
            start = max(selected_page["start"] if selected_page else 0, found - 500)
        if start >= len(text):
            raise ValueError("Passage start is outside the saved source text.")
        end = min(len(text), start + request.max_chars, selected_page["end"] if selected_page else len(text))
        if end - start > self.remaining()["evidence_chars"]:
            raise ValueError("Selected evidence budget exhausted; use the saved passages.")
        result = {"source_id": source["source_id"], "source_version": source["source_version"],
                  "source_hash": source["source_hash"], "start": start, "end": end,
                  "page": request.page_number, "extraction_method": selected_page["method"] if selected_page else None,
                  "page_image_path": selected_page.get("image_path") if selected_page else None,
                  "text": text[start:end], "has_more": end < len(text), "content_truncated": source.get("content_truncated", False)}
        cp["budget_used"]["evidence_chars"] += max(0, end - start)
        cp["passages"][key] = result
        source["available_excerpt"] = result["text"]
        source["locator"] = f"Page {request.page_number}" if request.page_number else f"Characters {start}-{end}"
        source.setdefault("selected_passages", []).append(result)
        self.checkpoints.save(self.matter_id, self.run_id, cp, expected_sequence=cp["sequence"])
        return {**result, "remaining_budget": self.remaining()}
