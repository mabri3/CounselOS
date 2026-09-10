"""Public-query-only native search. Private matter analysis stays in the normal runner."""
from __future__ import annotations

import asyncio
import json
import os
import re
import shutil
import tempfile
from pathlib import Path
from urllib.parse import urlsplit

import httpx



def native_options(selection, settings):
    selection = {key: value for key, value in (selection or {}).items() if key in {"provider", "model", "reasoning_effort"}}
    provider = selection.get("provider", "")
    supported = provider in {"codex", "antigravity_cli", "opencode_go"}
    if provider in {"openai", "openai_compatible"}:
        supported = urlsplit(settings.llm_base_url).hostname == "api.openai.com"
    return {"native_available": supported, "native": supported,
            "model_selection": selection or None,
            "firecrawl_available": bool(settings.firecrawl_api_key)}


async def run_cli(command, *, cwd, env, timeout):
    process = await asyncio.create_subprocess_exec(*command, cwd=cwd, env=env,
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
    try:
        stdout, _ = await asyncio.wait_for(process.communicate(), timeout)
        if process.returncode:
            if b"RegionError" in stdout:
                raise RuntimeError("The selected OpenCode model requires a regional hosting opt-in. Choose another model or update the provider account.")
            raise RuntimeError("Native search command failed")
        if len(stdout) > 4_000_000:
            raise ValueError("Native search response exceeds limit")
        return stdout.decode("utf-8", errors="replace")
    finally:
        if process.returncode is None:
            process.kill()
            await process.wait()


async def discover(query, selection, settings, *, timeout=90):
    provider, model = selection["provider"], selection["model"]
    effort = selection.get("reasoning_effort", "default")
    prompt = ("Search the live web for this public question. Use only web search and page reading. "
              "Do not use files, shell, other apps, or plugins. Only collect requested evidence locations and excerpts with source URLs. Do not give transaction advice, decide the legal conclusion, or direct follow-up. "
              "Distinguish search snippets from pages you read. Public question: " + query)
    if provider in {"openai", "openai_compatible"}:
        if urlsplit(settings.llm_base_url).hostname != "api.openai.com":
            raise ValueError("This compatible endpoint has no verified native search contract")
        payload = {"model": model, "input": prompt, "tools": [{"type": "web_search"}],
                   "tool_choice": "required", "include": ["web_search_call.action.sources"]}
        if effort not in {"", "default"}:
            payload["reasoning"] = {"effort": effort}
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(settings.llm_base_url.rstrip("/") + "/responses",
                headers={"Authorization": f"Bearer {settings.llm_api_key}"}, json=payload)
            response.raise_for_status()
            return json.dumps(response.json())
    env = dict(os.environ)
    if provider == "codex":
        command = ["codex", "exec", "--ephemeral", "--ignore-user-config", "--ignore-rules",
                   "--skip-git-repo-check", "--sandbox", "read-only", "--json", "-m", model,
                   "-c", 'web_search="live"', "-c", "features.shell_tool=false",
                   "-c", "features.unified_exec=false", "-c", "features.plugins=false",
                   "-c", "features.apps=false", "-c", "features.hooks=false",
                   "-c", "project_doc_max_bytes=0"]
        if effort not in {"", "default"}:
            command += ["-c", f'model_reasoning_effort="{effort}"']
        command += [prompt]
    elif provider == "antigravity_cli":
        command = ["agy", "-p", prompt, "--output-format", "stream-json", "--model", model,
                   "--sandbox", "--disable-slash-commands", "--print-timeout", f"{timeout}s"]
        if effort not in {"", "default"}:
            command += ["--effort", effort]
    elif provider == "opencode_go":
        env["OPENCODE_CONFIG_CONTENT"] = json.dumps({"permission": {
            "*": "deny", "websearch": "allow", "webfetch": "allow"}, "share": "disabled"})
        command = ["opencode", "run", "--pure", "--format", "json", "-m",
                   "opencode-go/" + model.removeprefix("opencode-go/"), prompt]
        if effort not in {"", "default"}:
            command += ["--variant", effort]
    else:
        raise ValueError("Selected provider does not support native search")
    executable = shutil.which(command[0])
    if not executable:
        candidate = Path.home() / (".opencode/bin/opencode" if command[0] == "opencode" else f".local/bin/{command[0]}")
        if candidate.is_file() and os.access(candidate, os.X_OK):
            executable = str(candidate)
    if not executable:
        raise ValueError("Native search CLI is not installed")
    command[0] = executable
    # Isolate research from both the repository and the user's matter files.
    with tempfile.TemporaryDirectory(prefix="native-search-", dir=settings.vault_path) as directory:
        return await run_cli(command, cwd=directory, env=env, timeout=timeout)


def source_urls(raw):
    # CLI events and response annotations retain links even if the final answer is partial.
    urls = re.findall(r'https://[^\s<>"\\]+', raw)
    return list(dict.fromkeys(url.rstrip(").,];") for url in urls))[:8]


def answer_text(raw):
    parts = []
    for line in raw.splitlines():
        try:
            event = json.loads(line)
        except ValueError:
            continue
        item = event.get("item", {})
        if item.get("type") == "agent_message":
            parts.append(str(item.get("text", "")))
        if event.get("type") == "text":
            parts.append(str(event.get("part", {}).get("text", "")))
        if isinstance(event.get("response"), str):
            parts.append(event["response"])
        if isinstance(event.get("result"), dict) and isinstance(event["result"].get("response"), str):
            parts.append(event["result"]["response"])
        for output in event.get("output", []):
            for content in output.get("content", []):
                if content.get("type") == "output_text":
                    parts.append(content.get("text", ""))
    return "\n".join(parts)[-16000:]


async def search_native(query, scope, settings, search, result=None):
    result = result if result is not None else {"external": [], "provider_legs": []}
    selection = scope.model_selection or {}
    try:
        raw = await discover(query, selection, settings)
        result["native_analysis"] = answer_text(raw)
        urls = source_urls(raw)
        result["provider_legs"].append({"provider": selection.get("provider"), "status": "discovered" if urls else "no_sources"})
    except Exception as exc:
        urls = []
        result["provider_legs"].append({"provider": selection.get("provider"), "status": "failed", "failure_class": type(exc).__name__})
        result["native_warning"] = ("The selected OpenCode model requires a regional hosting opt-in. Choose another model or update the provider account."
            if "regional hosting opt-in" in str(exc) else "Native search failed or is unavailable for the selected model.")
    from app.services.research_reader import read_source
    for url in urls[:5]:
        source = {"url": url, "title": urlsplit(url).hostname or url,
                  "support_state": "unverified_lead", "provider": selection.get("provider")}
        try:
            source.update(await read_source(url, settings, allow_firecrawl=scope.allow_firecrawl))
        except Exception as exc:
            source["retrieval_failure"] = type(exc).__name__
        result["external"].append(source)
        result["provider_legs"].append({"provider": source.get("retrieval_method", "page_read"),
            "url": url, "status": source["support_state"], "failure_class": source.get("retrieval_failure")})
    if not any(s.get("support_state") == "retrieved" for s in result["external"]) and scope.allow_firecrawl:
        fallback = await search.search_external(query, provider="firecrawl", timeout_seconds=30)
        result["external"][:0] = fallback.get("external", [])
        result["provider_legs"].append({"provider": "firecrawl", "status": "retrieved" if fallback.get("external") else "failed"})
    return result
