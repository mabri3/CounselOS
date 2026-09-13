"""Owned-vault browser fixture for research-first dossier acceptance.

Only model, public-search, and fetch boundaries are fake. Dossier requests use
the production routers, saved parent service, managed children, coordinator,
publication path, chat history, and document APIs.
"""
from __future__ import annotations

import argparse
import asyncio
from collections import Counter
import json
from pathlib import Path
import re
import shutil
from threading import RLock
from typing import Any

from fastapi import APIRouter

from app.agents.runner import ResolvedAgentProvider
from app.config import ACTIVE_VAULT_POINTER, PROJECT_ROOT, Settings
from app.providers.base import ProviderReply, ProviderSelection, provider_session_id
from app.services.vault import VaultService
from tests.manual.serve_research_investigation import ScriptedMain, install_boundaries, make_app


MATTER_ID = "MAT-DEMO-BEACON"
MARKER = ".dossier-research-browser-fixture.json"
STATS = "00_System/dossier-research-browser-stats.md"
FIXTURE_KIND = "counsel-os-dossier-research-browser-v1"
ISSUES = [
    ("Employment terms", "Confirm worker terms and launch staffing conditions."),
    ("Customer privacy", "Confirm notice, purpose, and access controls."),
    ("Supplier contract", "Confirm service levels, termination, and transfer terms."),
    ("Intellectual property", "Confirm ownership and trademark permission."),
    ("Marketing claims", "Confirm evidence for public launch claims."),
]


def _active_vaults() -> set[Path]:
    paths = {Settings().resolved_vault_path}
    try:
        payload = json.loads(ACTIVE_VAULT_POINTER.read_text(encoding="utf-8"))
        selected = Path(str(payload.get("vault_path") or ""))
        if selected.is_absolute():
            paths.add(selected.resolve())
    except (OSError, ValueError, TypeError):
        pass
    return paths


def _marker_payload(vault: Path) -> dict[str, str]:
    return {"fixture": FIXTURE_KIND, "vault": str(vault.resolve())}


def _owned(vault: Path) -> bool:
    try:
        saved = json.loads(VaultService(vault).read_text(MARKER))
    except (OSError, ValueError, TypeError):
        return False
    return saved == _marker_payload(vault)


def prepare_vault(vault: Path, *, reset: bool) -> Path:
    vault = vault.expanduser().resolve()
    if vault in _active_vaults():
        raise ValueError("The browser fixture cannot use the active or configured vault.")
    if reset:
        if not vault.is_dir() or not _owned(vault):
            raise ValueError("Reset refused: this directory is not marked as this script's fixture.")
        shutil.rmtree(vault)
    if not vault.exists():
        shutil.copytree(Path(__file__).resolve().parents[1] / "fixtures/vault", vault)
        VaultService(vault).write_bytes(MARKER, (json.dumps(_marker_payload(vault), indent=2) + "\n").encode())
    elif not _owned(vault):
        raise ValueError("The selected directory is not an owned dossier-research fixture.")
    return vault


def seed_matter(context: Any) -> list[str]:
    # A copied fixture vault may not have a disposable SQLite index yet.
    context.index.rebuild()
    root = context.matters.matter_path(MATTER_ID)
    issue_lines = "\n".join(f"{index}. {title}: {detail}" for index, (title, detail) in enumerate(ISSUES, 1))
    context.vault.write_markdown(
        f"{root}/issues.md", "# Issues\n\n" + issue_lines,
        {"matter_id": MATTER_ID, "record_type": "issues"},
    )
    context.vault.write_markdown(
        f"{root}/source-documents/launch-brief.md",
        "# Launch brief\n\nReported by Product: the planned launch date is October 15, 2026. Employment, privacy, supplier, IP, and marketing reviews remain open.\n",
        {"matter_id": MATTER_ID, "record_type": "source", "source_revision": "fixture-launch-brief-v1"},
    )
    reported = ["Product proposed the launch for 2026-10-15.", "All five workstreams remain open before launch."]
    existing = {fact["text"] for fact in context.matter_records.get(MATTER_ID)["facts"]}
    missing = [{"text": text, "status": "active"} for text in reported if text not in existing]
    if missing:
        context.matter_records.apply_update(MATTER_ID, facts=missing, actor="human", summary="Product supplied launch facts.")
    context.index.rebuild()
    return [item["issue_id"] for item in context.workspace.issues(MATTER_ID)]


class BoundaryState:
    def __init__(self, context: Any):
        self.context = context
        self.first_release = asyncio.Event()
        self.remaining_release = asyncio.Event()
        self.active: set[str] = set()
        self.started: dict[str, int] = {}
        self.discoveries: list[dict[str, Any]] = []
        self.fetches: list[str] = []
        self.failures_remaining = 0
        self.failure_session: str | None = None
        self._lock = RLock()
        saved: dict[str, Any] = {}
        if context.vault.exists(STATS):
            saved = context.vault.read_markdown(STATS)["metadata"]
        self.counts = Counter({str(key): int(value) for key, value in (saved.get("counts") or {}).items()})

    def record(self, kind: str) -> None:
        with self._lock:
            self.counts[kind] += 1
            self.context.vault.write_markdown(
                STATS,
                "# Dossier research browser boundary counts\n\nSynthetic fixture data only.",
                {"fixture": FIXTURE_KIND, "counts": dict(self.counts)},
            )

    def view(self) -> dict[str, Any]:
        return {
            "fixture": FIXTURE_KIND,
            "matter_id": MATTER_ID,
            "active_workers": len(self.active),
            "active_worker_ids": sorted(self.active),
            "research_workers_started": len(self.started),
            "counts": dict(self.counts),
            "search_calls_this_process": len(self.discoveries),
            "fetch_calls_this_process": len(self.fetches),
            "first_released": self.first_release.is_set(),
            "remaining_released": self.remaining_release.is_set(),
            "scripted_failures_left": self.failures_remaining,
        }


class DossierBrowserProvider:
    def __init__(self, base: ScriptedMain, boundary: BoundaryState, issue_ids: list[str]):
        self.base = base
        self.boundary = boundary
        self.issue_ids = issue_ids

    async def complete(self, messages, tools=None):
        self.boundary.record("model_calls")
        raw = "\n".join(str(message.get("content") or "") for message in messages)
        if "Prepare the dossier plan for this matter" in raw:
            self.boundary.record("planning_calls")
            issue_map = []
            for index, (issue_id, (title, detail)) in enumerate(zip(self.issue_ids, ISSUES), 1):
                issue_map.append({
                    "issue_id": issue_id, "title": title, "why_it_matters": detail,
                    "initial_answer": f"The saved facts show that {title.lower()} remains open; the controlling conditions require research.",
                    "next_action": f"Confirm the operative {title.lower()} conditions before launch.",
                    "focused_topic": f"United States {title.lower()} launch requirements", "fact_ids": [],
                    "parent_issue_id": None, "urgent": index <= 3,
                })
            plan = {
                "issue_map": issue_map,
                "priorities": [
                    {"key": "launch", "text": "Confirm launch blockers", "why": "These terms can stop the launch.", "issue_ids": self.issue_ids[:2]},
                    {"key": "dependencies", "text": "Resolve vendor dependencies", "why": "Supplier and IP terms control access and ownership.", "issue_ids": self.issue_ids[2:4]},
                    {"key": "claims", "text": "Support customer claims", "why": "Marketing statements need saved evidence.", "issue_ids": [self.issue_ids[4]]},
                ],
                "first_issue_ids": self.issue_ids[:3], "overall_topic": "United States product launch legal conditions",
                "date_candidates": [{"role": "proposed_launch", "value": "2026-10-15", "source_reference_id": "fixture-launch-brief-v1", "note": "Product-reported target, not a confirmed legal deadline."}],
                "conflicts": [],
            }
            prose = "## Suggested priorities\n\nReview the five saved issues across employment, privacy, supplier, intellectual-property, and marketing workstreams. The first three suggested priorities focus on launch blockers, vendor dependencies, and supported claims."
            return ProviderReply(content=prose + "\n\n```dossier-plan\n" + json.dumps(plan) + "\n```")
        if "Dossier-generation action" in raw:
            self.boundary.record("writer_calls")
            supplied = next((str(message.get("content") or "") for message in messages if str(message.get("content") or "").startswith("Saved dossier input")), "")
            data = json.loads(supplied.split("\n", 1)[1])
            root = self.context_root(data)
            content = [
                "# Beacon launch dossier",
                "## Current position",
                "Proceed only after the saved employment, privacy, supplier, IP, and marketing conditions are reviewed. This is deterministic fixture analysis.",
                "## Decision question", str(data.get("question") or "Can the launch proceed with conditions?"),
                "## Material facts",
                f"- Reported fact: Product proposed October 15, 2026 as the launch date. [Read the saved launch brief]({root}/source-documents/launch-brief.md)",
                f"- Reported fact: all five workstreams remain open. [Read the saved issue list]({root}/issues.md)",
                "## Proposed date",
                "- October 15, 2026 — basis: Product's saved launch brief. This is a proposed operating date, not a verified legal deadline.",
                "## Launch conditions checklist",
                "- [ ] Confirm employment terms and staffing controls.", "- [ ] Confirm privacy notice, purpose, and access limits.",
                "- [ ] Confirm supplier transfer, exit, and service terms.", "- [ ] Confirm ownership and trademark permission.",
                "- [ ] Confirm evidence for public marketing claims.", "## Issues",
            ]
            for fact in (data.get("reported_records") or {}).get("facts", []):
                content.append("Captured reported fact: " + fact["fact_id"])
            analyses = data.get("issue_analysis") or {}
            for issue in data.get("issues") or []:
                issue_id, title = issue["issue_id"], issue["title"]
                analysis = analyses.get(issue_id) or {}
                # Deliberately short: the application must retain full worker
                # detail independently of the writer's overview.
                detail = "Review the saved analysis and its conditions."
                content.extend([
                    f"<!-- issue:{issue_id} -->", f"### {title}",
                    "**Current answer:** Conditional. Do not treat the issue as closed.",
                    "**Rule and support:** " + detail,
                    "**Application:** Apply the saved conditions to the planned launch; do not infer missing facts.",
                    "**Next step:** Complete the checklist item and record the controlling source version.",
                ])
            content.extend(["## Next actions", "1. Legal reviews the three initial launch blockers.", "2. Product keeps the proposed date conditional.", "3. Procurement and Marketing complete the remaining two workstreams."])
            return ProviderReply(content="\n\n".join(content))

        names = {tool.get("function", {}).get("name") for tool in tools or []}
        if "Research this issue for the dossier" in raw:
            session = provider_session_id.get() or re.search(r"Research this issue for the dossier: ([^.]+)", raw).group(1)
            if session not in self.boundary.started:
                position = len(self.boundary.started)
                self.boundary.started[session] = position
                self.boundary.active.add(session)
                self.boundary.record("research_workers_started")
                try:
                    await (self.boundary.first_release if position < 3 else self.boundary.remaining_release).wait()
                finally:
                    self.boundary.active.discard(session)
            self.boundary.record("research_model_calls")
            if self.boundary.failures_remaining and self.boundary.failure_session in {None, session}:
                self.boundary.failure_session = session
                self.boundary.failures_remaining -= 1
                raise TimeoutError("Synthetic research timeout for recovery acceptance.")
        return await self.base.complete(messages, tools)

    @staticmethod
    def context_root(data: dict[str, Any]) -> str:
        return f"03_Matters/beacon-instant-onboarding"


def install_fixture_boundaries(context: Any, issue_ids: list[str], monkeypatch=None) -> BoundaryState:
    base, discoveries, fetches = install_boundaries(context, monkeypatch)
    boundary = BoundaryState(context)
    boundary.discoveries = discoveries
    boundary.fetches = fetches
    provider = DossierBrowserProvider(base, boundary, issue_ids)

    def resolve(agent):
        selection = ProviderSelection(agent.agent_id, "codex", "fixture-dossier", "medium")
        return ResolvedAgentProvider(provider, selection)

    context.runner.provider_resolver = resolve
    context.provider_router.resolve_selection = lambda selection: ResolvedAgentProvider(provider, selection)
    context.research_runs.resolve_selection = lambda selection: ResolvedAgentProvider(provider, selection)
    context.research_runs.resolve_main = lambda: resolve(context.agents.get("counsel-copilot"))
    context.research_runs.resolve_agent = lambda: resolve(context.agents.get("research-agent"))
    return boundary


def control_router(boundary: BoundaryState) -> APIRouter:
    router = APIRouter(prefix="/fixture/dossier-research", tags=["fixture-control"])

    @router.get("/state")
    def state():
        return boundary.view()

    @router.post("/release-first")
    def release_first():
        boundary.first_release.set()
        return boundary.view()

    @router.post("/release-remaining")
    def release_remaining():
        boundary.remaining_release.set()
        return boundary.view()

    @router.post("/release-all")
    def release_all():
        boundary.first_release.set()
        boundary.remaining_release.set()
        return boundary.view()

    @router.post("/reset-gates")
    def reset_gates():
        if boundary.active:
            raise RuntimeError("Cannot reset fixture gates while research workers are active.")
        boundary.first_release.clear()
        boundary.remaining_release.clear()
        boundary.started.clear()
        boundary.discoveries.clear()
        boundary.fetches.clear()
        return boundary.view()

    @router.post("/fail-research")
    def fail_research(calls: int = 9):
        boundary.failures_remaining = max(0, min(calls, 100))
        boundary.failure_session = None
        return boundary.view()

    return router


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8199)
    parser.add_argument("--frontend-origin", default="http://localhost:3199")
    parser.add_argument("--vault", type=Path, default=PROJECT_ROOT / "output/dossier-research-first/browser-vault")
    parser.add_argument("--reset", action="store_true")
    return parser.parse_args()


def main() -> None:
    import uvicorn

    args = parse_args()
    try:
        vault = prepare_vault(args.vault, reset=args.reset)
    except ValueError as exc:
        raise SystemExit(str(exc)) from exc
    from app.runtime import AppContext

    context = AppContext(
        Settings(_env_file=None, vault_path=str(vault), scheduler_enabled=False, llm_provider="mock", llm_api_key=None,
                 tavily_api_key=None, firecrawl_api_key=None, polaris_api_key=None)
    )
    issue_ids = seed_matter(context)
    boundary = install_fixture_boundaries(context, issue_ids)
    app = make_app(context, args.frontend_origin)
    app.include_router(control_router(boundary), prefix="/api")
    print(json.dumps({"fixture_vault": str(vault), "owned": _owned(vault), "matter_id": MATTER_ID, "issue_ids": issue_ids}), flush=True)
    uvicorn.run(app, host="127.0.0.1", port=args.port)


if __name__ == "__main__":
    main()
