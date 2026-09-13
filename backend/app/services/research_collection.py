"""Main-directed collection using existing transports and exact saved source text."""
import asyncio
import hashlib
import json
import time

from app.models.research_scope import ResearchScope
from app.models.research_investigation import ResearchEvidenceBatch, ResearchSourceRead
from app.models.source_library import SourceSearchRequest
from app.services.research_checkpoints import ResearchCheckpoints, LIMITS
from app.services.workspace import digest

INVESTIGATION_TOOLS = frozenset({"collect_research_evidence", "read_research_source", "search_research_sources", "read_file", "list_files", "search_vault"})


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
                or digest(json.dumps(ResearchScope.model_validate(run["search_scope"]).model_dump(), sort_keys=True)) != self.scope_hash):
            raise ValueError("Investigation identity or saved scope changed.")
        cp = self.checkpoints.load(self.matter_id, self.run_id)
        if cp["stop_requested"] or cp["phase"] in {"publishing", "complete", "stopped"}:
            raise ValueError("Investigation no longer accepts evidence tools.")
        return cp

    def remaining(self):
        used = self.checkpoints.load(self.matter_id, self.run_id)["budget_used"]
        limits = self.app.research_runs.get(self.matter_id, self.run_id)["investigation_limits"]
        return {k: max(0, limits[k] - used[k]) for k in LIMITS}

    async def collect(self, arguments):
        batch = ResearchEvidenceBatch.model_validate(arguments)
        cp = self.validate(self.matter_id)
        if self.scope.native and self.run.get("collection_warning"):
            return {"status": "failed", "error": self.run["collection_warning"], "remaining_budget": self.remaining()}
        if not self.scope.external:
            return {"status": "blocked", "error": "External sources were not authorized.", "remaining_budget": self.remaining()}
        key = "batch:" + digest(batch.model_dump_json())
        retries = cp.get("request_retries") or {}
        if any("request:" + digest(r.model_dump_json()) in retries for r in batch.requests):
            key += f":recovery:{len(cp.get('recovery_attempts') or [])}"
        existing = next((c for c in cp["pending_calls"] if c["key"] == key and c["state"] == "completed"), None)
        if existing:
            return {**existing["result_ref"], "remaining_budget": self.remaining()}
        if self.remaining()["active_seconds"] <= 90:
            raise ValueError("Collection stopped to reserve synthesis time.")
        prior = cp["requests"]
        for request in batch.requests:
            if "request:" + digest(request.model_dump_json()) in retries:
                continue  # Retry the exact previously approved request, not a new query.
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

    async def native_fallback(self, query, request_key):
        """Use the saved main model type in a fresh, public-query-only session."""
        from app.services.native_research import discover, source_urls, answer_text, native_options
        selection = self.run.get("main_selection") or self.scope.main_model_selection
        if not self.scope.external or not native_options(selection, self.app.settings)["native_available"]:
            return {"candidates": [], "warning": "Main model web search is unavailable."}
        key = request_key + ":native-fallback"
        call = self.checkpoints.reserve_call(self.matter_id, self.run_id, key, key, {})
        if call["state"] == "completed":
            return call["result_ref"]
        try:
            raw = await discover(query, selection, self.app.settings,
                                 timeout=min(60, max(1, self.remaining()["active_seconds"] - 90)))
            result = {"candidates": [{"url": url, "title": url} for url in source_urls(raw)[:4]],
                      "generated_worker_notes": answer_text(raw)[:2000]}
        except Exception as exc:
            result = {"candidates": [], "warning": f"Main model web search failed: {type(exc).__name__}."}
        self.checkpoints.complete_call(self.matter_id, self.run_id, key, result)
        return result

    async def recover_before_synthesis(self):
        """If planning failed before retrieval, search the already approved topic."""
        cp = self.validate(self.matter_id)
        if not self.scope.external or self.remaining()["active_seconds"] <= 90 or not self.scope.public_query:
            return None
        from app.models.research_investigation import ResearchEvidenceRequest
        if cp["requests"]:
            retries = cp.get("request_retries") or {}
            for key, result in cp["requests"].items():
                if key in retries and retries[key] not in cp["requests"]:
                    fields = {k: v for k, v in result.items() if k in ResearchEvidenceRequest.model_fields}
                    return await self._request(ResearchEvidenceRequest.model_validate(fields))
            return None
        return await self._request(ResearchEvidenceRequest(
            proposition_id="planning-recovery", proposition=self.scope.public_query,
            public_query=self.scope.public_query, source_goal="operative_rule"))

    async def service_search(self, outbound, search_result, request_key):
        for provider in self.scope.provider_ids:
            provider_key = request_key + ":provider:" + provider
            call = self.checkpoints.reserve_call(self.matter_id, self.run_id, provider_key, request_key, {})
            if call["state"] == "completed":
                search_result = call["result_ref"]
            else:
                import inspect
                operation = self.app.research._run_external_provider
                kwargs = {"transport_retry_count": 0} if "transport_retry_count" in inspect.signature(operation).parameters else {}
                try:
                    await asyncio.wait_for(operation(provider, outbound, search_result, **kwargs), timeout=min(30, float(self.app.research._settings.get("external_timeout_seconds", 90))))
                except Exception as exc:
                    search_result.setdefault("provider_legs", []).append({"provider": provider, "status": "failed", "error_class": type(exc).__name__})
                self.checkpoints.complete_call(self.matter_id, self.run_id, provider_key, search_result)
            if search_result["external"]:
                break
        return search_result

    async def collector_search(self, query, outbound, search_result, request_key):
        """The optional worker gets a public query and a search tool, never the matter."""
        selected = self.app.research_runs._resolve_saved_selection(self.run.get("collector_selection"))
        if selected is None:
            raise ValueError("Collection model is unavailable.")
        key = request_key + ":collector"
        call = self.checkpoints.reserve_call(self.matter_id, self.run_id, key, key, {})
        if call["state"] == "completed":
            return call["result_ref"]
        messages = [{"role": "system", "content": "You collect public evidence for another agent. Call search_public_sources for the supplied query. Do not decide the legal answer. Do not invent sources."},
                    {"role": "user", "content": query}]
        tools = [{"type": "function", "function": {"name": "search_public_sources", "description": "Search the configured public research services for the assigned query.", "parameters": {"type": "object", "properties": {}, "additionalProperties": False}}}]
        from app.providers.base import provider_session_id
        token = provider_session_id.set(self.run_id + ":collector")
        try:
            reply = await asyncio.wait_for(selected.provider.complete(messages, tools), timeout=45)
        finally:
            provider_session_id.reset(token)
        if not any(c.name == "search_public_sources" for c in reply.tool_calls):
            raise ValueError("Collection model did not request the search tool.")
        # The worker cannot change the approved query or choose unrelated tools.
        search_result.update(await self.service_search(outbound, search_result, request_key))
        result = {"candidates": search_result["external"][:4], "generated_worker_notes": reply.content[:2000]}
        self.checkpoints.complete_call(self.matter_id, self.run_id, key, result)
        return result

    async def _request(self, request):
        request_key = "request:" + digest(request.model_dump_json())
        cp = self.validate(self.matter_id)
        request_key = (cp.get("request_retries") or {}).get(request_key, request_key)
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
        timeout = min(180, max(1, self.remaining()["active_seconds"] - 90))
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
                    if self.scope.collection_enabled:
                        try:
                            collected = await self.collector_search(request.public_query, outbound, search_result, request_key)
                            search_result["external"] = collected["candidates"]
                            result["generated_worker_notes"] = collected.get("generated_worker_notes", "")
                        except Exception as exc:
                            result["warnings"].append(f"Collection agent failed: {type(exc).__name__}.")
                            search_result.update(await self.service_search(outbound, search_result, request_key))
                    else:
                        search_result.update(await self.service_search(outbound, search_result, request_key))
                    candidates = search_result["external"][:4]
                    if not candidates:
                        fallback = await self.native_fallback(request.public_query, request_key)
                        candidates = fallback["candidates"]
                        result["generated_worker_notes"] = fallback.get("generated_worker_notes", "")
                        if fallback.get("warning"):
                            result["warnings"].append(fallback["warning"])
                self.checkpoints.complete_call(self.matter_id, self.run_id, request_key, {"candidates": candidates, "generated_worker_notes": result.get("generated_worker_notes", "")})
                for candidate in candidates:
                    if not isinstance(candidate, dict) or not isinstance(candidate.get("url"), str):
                        result["warnings"].append("Malformed worker location ignored.")
                        continue
                    source = await self._fetch(candidate)
                    if source:
                        result["sources"].append(source)
                if candidates and not self.scope.native and not request.public_url and not any(s.get("support_state") == "retrieved" for s in result["sources"]):
                    fallback = await self.native_fallback(request.public_query, request_key)
                    if fallback.get("warning"):
                        result["warnings"].append(fallback["warning"])
                    result["generated_worker_notes"] = fallback.get("generated_worker_notes", "")
                    for candidate in fallback["candidates"]:
                        if any(s.get("url") == candidate["url"] for s in result["sources"]):
                            continue
                        source = await self._fetch(candidate)
                        if source:
                            result["sources"].append(source)
                result["status"] = "retrieved" if any(s.get("support_state") == "retrieved" for s in result["sources"]) else "partial" if result["sources"] else "no_results"
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            from app.services.research_recovery import temporary_failure
            result["status"] = "partial" if result["sources"] else "failed"
            result["warnings"].append(f"Collection failed: {type(exc).__name__}.")
            cp = self.checkpoints.load(self.matter_id, self.run_id)
            call = next(c for c in cp["pending_calls"] if c["key"] == request_key)
            if call["state"] != "completed":
                call.update(state="outcome_unknown", error_class=type(exc).__name__, temporary_failure=temporary_failure(exc))
                self.checkpoints.save(self.matter_id, self.run_id, cp, expected_sequence=cp["sequence"])
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
        library = await self._register_library_version(source, cache_path)
        if library:
            record.update(library_source_id=library["source_id"], library_source_version=library["source_version"],
                          library_extraction_state=library["extraction_state"])
        cp = self.checkpoints.load(self.matter_id, self.run_id)
        if record.get("pages"):
            record["pages"] = [{k: v for k, v in page.items() if k != "text"} for page in record["pages"]]
        preview = (record.get("available_excerpt") or "")[:int(self.remaining()["evidence_chars"])]
        record["available_excerpt"] = preview or None
        cp["budget_used"]["evidence_chars"] += len(preview)
        if library and library.get("source_version"):
            self._pin(cp, library["source_id"], library["source_version"], library["title"], library["extraction_state"])
        cp["sources"].append(record)
        self.checkpoints.save(self.matter_id, self.run_id, cp, expected_sequence=cp["sequence"])
        self.checkpoints.complete_call(self.matter_id, self.run_id, key, record)
        return record

    async def _register_library_version(self, source, cache_path):
        """Register the retrieved original in the matter source library, best effort.

        A registration failure reduces navigation, never the retrieved answer.
        """
        library = getattr(self.app, "source_library", None)
        if library is None:
            return None
        try:
            binary_path = cache_path + ".bin"
            has_binary = self.app.vault.exists(binary_path)
            original = binary_path if has_binary else source["path"]
            text = None
            cache = self.app.vault.read_markdown(cache_path)["metadata"] if self.app.vault.exists(cache_path) else {}
            content_type = str(cache.get("content_type") or "")
            if has_binary:
                data = self.app.vault.resolve(binary_path).read_bytes()
                if not (data.startswith(b"%PDF-") or content_type.startswith("image/") or source.get("pages") or source.get("original_file_path")):
                    decoded = data.decode(cache.get("charset") or "utf-8", errors="replace")
                    from app.services.source_extraction import html_storage_text
                    text = html_storage_text(decoded) if content_type == "text/html" else decoded
            else:
                text = self.app.vault.read_markdown(source["path"])["content"]
            descriptor = library.register_saved_source(
                self.matter_id, original, source_id=source["source_id"],
                title=str(source.get("title") or source.get("url") or source["source_id"]),
                source_kind="retrieved", text=text,
                provenance={"content_type": content_type, "requested_url": source.get("url"), "final_url": source.get("final_url"),
                            "retrieved_at": source.get("retrieved_at")})
            return await library.extract_or_resume(self.matter_id, descriptor["job_id"])
        except Exception:
            return None

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
        record["source_label"] = record["title"]
        cp["local_sources"] = [s for s in cp.get("local_sources", []) if s["source_id"] != source_id] + [record]
        cp["budget_used"]["evidence_chars"] += len(selected)
        self.checkpoints.save(self.matter_id, self.run_id, cp, expected_sequence=cp["sequence"])
        return {**document, "content": selected, "source_id": source_id, "source_snapshot_path": saved_path,
                "tool_view_notice": "Supplied local text. Use read_research_source with this source_id for another literal passage; omitted text is not reviewed."}

    def _library(self):
        return getattr(self.app, "source_library", None)

    def pinned_version(self, cp, source_id):
        """Resolve a source_id to the version this run pinned, never to whatever is newest."""
        record = next((s for s in reversed(cp.get("library_sources", [])) if s["source_id"] == source_id), None)
        return record["source_version"] if record else None

    def _pin(self, cp, source_id, source_version, title, extraction_state, *, continuation=False):
        existing = self.pinned_version(cp, source_id)
        if any(s["source_id"] == source_id and s["source_version"] == source_version for s in cp.get("library_sources", [])):
            return cp
        if existing and not continuation:
            raise ValueError("This run already pinned a different version of that source; cite the pinned version.")
        cp["library_sources"] = [*cp.get("library_sources", []),
                                 {"source_id": source_id, "source_version": source_version,
                                  "title": title, "extraction_state": extraction_state,
                                  "selected_passages": []}]
        return cp

    def _source_allowed(self, manifest):
        frozen = self.run.get("frozen_context") or {}
        excluded_ids = set(frozen.get("excluded_reference_ids", []))
        if manifest["source_id"] in excluded_ids:
            return False
        original = self.app.vault.resolve(manifest["original_path"])
        related = {original, self.app.vault.resolve(manifest["original_path"] + ".extracted.md")}
        for path in frozen.get("excluded_paths", []):
            excluded = self.app.vault.resolve(path)
            if any(p == excluded or excluded in p.parents for p in related):
                return False
        return True

    def _authorized_version(self, cp, source_id, version):
        if not any(s["source_id"] == source_id and s["source_version"] == version for s in cp.get("library_sources", [])):
            if self.pinned_version(cp, source_id):
                raise ValueError("This run already pinned a different version of that source.")
            raise ValueError("Source version is not in this run; use source search first.")
        manifest = self._library().describe(self.matter_id, source_id, version)
        if not self._source_allowed(manifest):
            raise ValueError("Source is excluded from this inquiry.")
        return manifest

    def search_sources(self, arguments):
        """Bounded search over this matter's registered library units; pins the versions it returns."""
        request = SourceSearchRequest.model_validate(arguments)
        cp = self.validate(self.matter_id)
        library = self._library()
        if library is None:
            return {"status": "not_found", "hits": [], "results_omitted": False,
                    "warnings": ["The source library is unavailable in this deployment."],
                    "remaining_budget": self.remaining()}
        key = "source_search:" + digest(request.model_dump_json())
        if key in cp["passages"]:
            return {**cp["passages"][key], "remaining_budget": self.remaining()}
        allowed = set()
        manifests = library.versions(self.matter_id)
        latest = {}
        for manifest in sorted(manifests, key=lambda m: (m.get("created_at") or "", m["extraction_state"] == "complete", m["extracted_unit_count"], m["source_version"])):
            latest[manifest["source_id"]] = manifest["source_version"]
        for manifest in manifests:
            sid, version = manifest["source_id"], manifest["source_version"]
            pinned = self.pinned_version(cp, sid)
            wanted = pinned or request.source_version or latest[sid]
            if version == wanted and self._source_allowed(manifest):
                allowed.add((sid, version))
        result = library.search(self.matter_id, request.query, source_id=request.source_id,
                                source_version=request.source_version, limit=request.limit, allowed_versions=allowed)
        charged = 0
        kept = []
        for hit in result["hits"]:
            if charged + len(hit["snippet"]) > self.remaining()["evidence_chars"]:
                result["results_omitted"] = True
                break
            cp = self._pin(cp, hit["source_id"], hit["source_version"], hit["title"], hit["extraction_state"])
            charged += len(hit["snippet"])
            kept.append(hit)
        result["hits"] = kept
        result.setdefault("status", "hits" if kept else "not_found")
        if not kept:
            result["status"] = "not_found"
        if request.source_id and not kept:
            selected = next((m for m in manifests if m["source_id"] == request.source_id and (m["source_id"], m["source_version"]) in allowed), None)
            if selected:
                self._pin(cp, selected["source_id"], selected["source_version"], selected["title"], selected["extraction_state"])
                result["source"] = {k: selected[k] for k in ("source_id", "source_version", "extraction_state", "unread_page_count")}
                result["source"]["next_read"] = {"source_id": selected["source_id"], "source_version": selected["source_version"], "continue_extraction": selected["extraction_state"] != "complete"}
        cp["budget_used"]["evidence_chars"] += charged
        cp["passages"][key] = result
        self.checkpoints.save(self.matter_id, self.run_id, cp, expected_sequence=cp["sequence"])
        return {**result, "remaining_budget": self.remaining()}

    def _read_library(self, request, cp):
        library = self._library()
        version = request.source_version or self.pinned_version(cp, request.source_id)
        if library is None or not version:
            raise ValueError("Source ID is not in this run's saved evidence.")
        self._authorized_version(cp, request.source_id, version)
        unit_id = request.unit_id
        if not unit_id:
            described = library.describe(self.matter_id, request.source_id, version)
            match = next((u for u in described["units"] if u["page_number"] == request.page_number), None) \
                if request.page_number else (described["units"][0] if described["units"] else None)
            if match is None:
                return {"status": "not_found", "source_id": request.source_id, "source_version": version,
                        "warnings": ["Requested page was not extracted; review the saved source limits."],
                        "extraction_complete": described["extraction_state"] == "complete",
                        "remaining_budget": self.remaining()}
            unit_id = match["unit_id"]
        start = 0 if request.page_number else request.start
        if request.find_text:
            described = library.describe(self.matter_id, request.source_id, version)
            unit = next((u for u in described["units"] if u["unit_id"] == unit_id), None)
            if unit:
                body = self.app.vault.read_markdown(unit["path"])["content"]
                if digest(body) != unit["body_sha256"]:
                    return library.read(self.matter_id, request.source_id, version, unit_id)
                found = body.find(request.find_text)
                if found < 0:
                    return {"status": "not_found", "source_id": request.source_id, "source_version": version, "unit_id": unit_id}
                start = max(0, found - 500)
        result = library.read(self.matter_id, request.source_id, version, unit_id,
                              start=start, max_chars=request.max_chars)
        text = result.get("text", "")
        if len(text) > self.remaining()["evidence_chars"]:
            raise ValueError("Selected evidence budget exhausted; use the saved passages.")
        cp = self._pin(cp, request.source_id, version, result.get("title") or request.source_id,
                       "complete" if result.get("extraction_complete") else "partial")
        cp["budget_used"]["evidence_chars"] += len(text)
        record = next(s for s in cp["library_sources"] if s["source_id"] == request.source_id and s["source_version"] == version)
        unit_path = next((u["path"] for u in library.describe(self.matter_id, request.source_id, version)["units"]
                          if u["unit_id"] == unit_id), None)
        provenance = library.describe(self.matter_id, request.source_id, version)
        record["support_state"] = "retrieved" if provenance["source_kind"] == "retrieved" else "supplied"
        record["url"] = provenance.get("requested_url")
        record["original_path"] = provenance["original_path"]
        record["path"] = unit_path or record.get("path")
        record["source_hash"] = result.get("body_hash")
        record["selected_passages"] = [*record["selected_passages"][:29],
                                       {**{k: result.get(k) for k in ("unit_id", "start", "end", "page_number",
                                                                      "section_label", "body_hash")},
                                        "path": unit_path,
                                        "text": text}]
        cp["passages"][digest(request.model_dump_json())] = result
        self.checkpoints.save(self.matter_id, self.run_id, cp, expected_sequence=cp["sequence"])
        return {**result, "remaining_budget": self.remaining()}

    async def read_with_continuation(self, arguments):
        request = ResearchSourceRead.model_validate(arguments)
        if not request.continue_extraction:
            return self.read(arguments)
        cp = self.validate(self.matter_id)
        version = request.source_version or self.pinned_version(cp, request.source_id)
        manifest = self._authorized_version(cp, request.source_id, version)
        key = "extract:" + digest(request.model_dump_json())
        if key in cp["passages"]:
            return {**cp["passages"][key], "remaining_budget": self.remaining()}
        if self.remaining()["active_seconds"] < 135:
            raise ValueError("Extraction stopped to reserve time for the answer. Use available passages.")
        # Reserve the full local allowance durably. A crash never resets this charge.
        cp["budget_used"]["active_seconds"] += 45
        self.checkpoints.save(self.matter_id, self.run_id, cp, expected_sequence=cp["sequence"])
        descriptor = await self._library().resume_version(self.matter_id, request.source_id, version, page_number=request.page_number)
        cp = self.validate(self.matter_id)
        new_version = descriptor.get("source_version")
        if new_version:
            self._pin(cp, request.source_id, new_version, descriptor["title"], descriptor["extraction_state"], continuation=True)
        page = request.page_number or manifest.get("next_page") or 1
        result = {"status": descriptor["extraction_state"], "source_id": request.source_id,
                  "source_version": new_version, "previous_version": version,
                  "extraction_complete": descriptor["extraction_state"] == "complete",
                  "unread_page_count": descriptor["unread_page_count"], "warnings": descriptor["warnings"],
                  "next_read": {"source_id": request.source_id, "source_version": new_version, "page_number": page} if new_version else None}
        cp["passages"][key] = result
        self.checkpoints.save(self.matter_id, self.run_id, cp, expected_sequence=cp["sequence"])
        return {**result, "remaining_budget": self.remaining()}

    def read(self, arguments):
        request = ResearchSourceRead.model_validate(arguments)
        cp = self.validate(self.matter_id)
        key = digest(request.model_dump_json())
        if key in cp["passages"]:
            return {**cp["passages"][key], "remaining_budget": self.remaining()} if request.unit_id or request.source_version else cp["passages"][key]
        legacy = next((s for s in [*cp["sources"], *cp.get("local_sources", [])] if s["source_id"] == request.source_id), None)
        if request.unit_id or request.source_version or (legacy is None and self.pinned_version(cp, request.source_id)):
            return self._read_library(request, cp)
        source = legacy
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
