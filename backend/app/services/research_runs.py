from __future__ import annotations

import asyncio
from collections.abc import Callable
from typing import Any

from app.agents.runner import ResolvedAgentProvider
from app.providers.base import ProviderSelection
from app.services.research import ResearchService
from app.services.vault import VaultService
from app.utils.ids import new_id
from app.utils.time import iso_now


class ResearchRunService:
    """Runs small research batches in this process and records their status in Markdown."""

    MAX_QUESTIONS = 3

    def __init__(
        self,
        vault: VaultService,
        research: ResearchService,
        *,
        resolve_agent: Callable[[], ResolvedAgentProvider] | None = None,
        resolve_selection: Callable[[ProviderSelection], ResolvedAgentProvider] | None = None,
    ):
        self.vault = vault
        self.research = research
        self.resolve_agent = resolve_agent
        self.resolve_selection = resolve_selection
        self._tasks: dict[str, asyncio.Task[None]] = {}

    @property
    def has_active_work(self) -> bool:
        return any(not task.done() for task in self._tasks.values())

    def start(self, matter_id: str, questions: list[str], *, source_action_key: str | None = None) -> dict[str, Any]:
        clean_questions = [item.strip() for item in questions if item.strip()][: self.MAX_QUESTIONS]
        if not clean_questions:
            raise ValueError("At least one research question is required.")
        if source_action_key:
            existing = next((run for run in self.list(matter_id) if run.get("source_action_key") == source_action_key), None)
            if existing:
                return existing
        run_id = new_id("RUN")
        resolved = self.resolve_agent() if self.resolve_agent is not None else None
        selection = self._selection_values(resolved) if resolved is not None else None
        matter = self.research.index.get_matter(matter_id)
        original_stage = str(matter.get("status") or "") if matter else ""
        record = self._write(
            matter_id,
            run_id,
            state="queued",
            questions=clean_questions,
            completed=0,
            status="Research is queued.",
            source_action_key=source_action_key,
            selection=selection,
            return_stage="explore" if original_stage in {"intake", "research", "explore"} else original_stage,
        )
        if original_stage in {"intake", "explore"}:
            self.research.matters.move_stage(
                matter_id, "research", reason="Research run started", actor="research-agent"
            )
        self._tasks[run_id] = asyncio.create_task(self._execute(matter_id, run_id, clean_questions))
        return record

    def get(self, matter_id: str, run_id: str) -> dict[str, Any]:
        path = self._path(matter_id, run_id)
        if not self.vault.exists(path):
            raise KeyError(f"Research run not found: {run_id}")
        document = self.vault.read_markdown(path)
        return {**document["metadata"], "path": path}

    def record_completed(self, matter_id: str, question: str, result_path: str, *, source_action_key: str) -> dict[str, Any]:
        existing = next((run for run in self.list(matter_id) if run.get("source_action_key") == source_action_key), None)
        if existing:
            return existing
        run_id = new_id("RUN")
        resolved = self.resolve_agent() if self.resolve_agent is not None else None
        return self._write(
            matter_id, run_id, state="completed", questions=[question], completed=1,
            status="Research is complete.", results=[{"path": result_path}],
            source_action_key=source_action_key, finished_at=iso_now(),
            dossier_effect="Research support is ready for the next dossier update.",
            selection=self._selection_values(resolved) if resolved is not None else None,
        )

    def list(self, matter_id: str) -> list[dict[str, Any]]:
        directory = self.vault.resolve(f"{self._matter_path(matter_id)}/research/runs")
        if not directory.exists():
            return []
        return [self.get(matter_id, path.stem) for path in sorted(directory.glob("*.md"), reverse=True)]

    def mark_running_interrupted(self) -> int:
        count = 0
        interrupted: list[tuple[str, str]] = []
        for path in self.vault.iter_files("03_Matters", {".md"}):
            if path.parent.name != "runs":
                continue
            relative = self.vault.relative(path)
            document = self.vault.read_markdown(relative)
            metadata = document["metadata"]
            if (
                metadata.get("record_type") == "research_run"
                and metadata.get("state") in {"queued", "running"}
            ):
                self.vault.update_markdown(
                    relative,
                    metadata_updates={
                        "state": "interrupted",
                        "status": "Research was interrupted when the application stopped.",
                        "finished_at": iso_now(),
                    },
                )
                count += 1
                interrupted.append((str(metadata.get("matter_id") or ""), str(metadata.get("run_id") or path.stem)))
        for matter_id, run_id in interrupted:
            if matter_id:
                self._restore_stage(matter_id, run_id, reason="Research was interrupted; review the matter")
        return count

    async def wait(self, run_id: str) -> None:
        task = self._tasks.get(run_id)
        if task is not None:
            await task

    async def wait_for_active_work(self) -> None:
        tasks = [task for task in self._tasks.values() if not task.done()]
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def _execute(self, matter_id: str, run_id: str, questions: list[str]) -> None:
        results: list[dict[str, Any]] = []
        self._write(matter_id, run_id, state="running", questions=questions, completed=0, status="Research is running.")
        try:
            saved_selection = self.get(matter_id, run_id).get("selection")
            resolved = self._resolve_saved_selection(saved_selection)
            for position, question in enumerate(questions, start=1):
                result = await self.research.run(
                    matter_id,
                    question,
                    change_stage=False,
                    resolved_provider=resolved,
                )
                results.append(result)
                self._write(
                    matter_id, run_id, state="running", questions=questions, completed=position,
                    status=f"Completed {position} of {len(questions)} research items.", results=results,
                )
            public_statuses = {str(item.get("public_research_status") or "unavailable") for item in results}
            has_public = "retrieved" in public_statuses
            provider_observability = [
                dict(observation)
                for item in results
                if isinstance((observation := item.get("polaris_observability")), dict)
                and observation.get("failure_class")
            ]
            self._write(
                matter_id, run_id, state="completed", questions=questions, completed=len(questions),
                status=(
                    "Research is complete."
                    if has_public
                    else "Partial research is saved; no public source was retrieved."
                ),
                results=results, finished_at=iso_now(),
                useful_support=sum(int(item.get("internal_sources", 0)) + int(item.get("external_sources", 0)) for item in results),
                dossier_effect="Research support is ready for the next dossier update.",
                public_research_status=("retrieved" if has_public else "failed" if "failed" in public_statuses else "unavailable"),
                provider_observability=provider_observability,
            )
            self._restore_stage(matter_id, run_id, reason="Research results are ready for counsel exploration")
        except asyncio.CancelledError:
            self._write(
                matter_id, run_id, state="interrupted", questions=questions, completed=len(results),
                status="Research was interrupted.", results=results, finished_at=iso_now(),
            )
            self._restore_stage(matter_id, run_id, reason="Research was interrupted; review the matter")
            raise
        except Exception:
            self._write(
                matter_id, run_id, state="failed", questions=questions, completed=len(results),
                status=f"Research stopped after preserving {len(results)} useful result(s).",
                results=results, finished_at=iso_now(),
            )
            self._restore_stage(matter_id, run_id, reason="Research stopped; review the saved results")
        finally:
            self._tasks.pop(run_id, None)

    def _restore_stage(self, matter_id: str, run_id: str, *, reason: str) -> None:
        current = self.research.index.get_matter(matter_id)
        if not current or current.get("status") != "research":
            return
        active_other = any(
            run.get("run_id") != run_id and run.get("state") in {"queued", "running"}
            for run in self.list(matter_id)
        )
        if active_other:
            return
        run = self.get(matter_id, run_id)
        return_stage = str(run.get("return_stage") or "explore")
        if return_stage == "research":
            return_stage = "explore"
        self.research.matters.move_stage(
            matter_id,
            return_stage,
            reason=reason,
            actor="research-agent",
        )

    def _write(self, matter_id: str, run_id: str, **metadata: Any) -> dict[str, Any]:
        path = self._path(matter_id, run_id)
        current = self.vault.read_markdown(path)["metadata"] if self.vault.exists(path) else {}
        values = {
            **current,
            "record_type": "research_run",
            "run_id": run_id,
            "matter_id": matter_id,
            "total": len(metadata.get("questions", current.get("questions", []))),
            "dossier_effect": current.get("dossier_effect", ""),
            "useful_support": current.get("useful_support", 0),
            "human_questions_left": current.get("human_questions_left", 0),
            "created_at": current.get("created_at", iso_now()),
            **metadata,
        }
        self.vault.write_markdown(path, f"# Research run {run_id}\n\n{values['status']}\n", values)
        return {**values, "path": path}

    def _path(self, matter_id: str, run_id: str) -> str:
        return f"{self._matter_path(matter_id)}/research/runs/{run_id}.md"

    def _matter_path(self, matter_id: str) -> str:
        matter = self.research.index.get_matter(matter_id)
        if not matter:
            raise KeyError(f"Matter not found: {matter_id}")
        return str(matter["path"])

    @staticmethod
    def _selection_values(resolved: ResolvedAgentProvider) -> dict[str, str]:
        selection = resolved.selection
        return {
            "agent_id": selection.agent_id,
            "provider": selection.provider,
            "model": selection.model,
            "reasoning_effort": selection.reasoning_effort,
        }

    def _resolve_saved_selection(
        self, values: dict[str, Any] | None
    ) -> ResolvedAgentProvider | None:
        if not values:
            return None
        selection = ProviderSelection(**values)
        if selection.provider == "workspace_default":
            return self.resolve_agent() if self.resolve_agent is not None else None
        if self.resolve_selection is None:
            return None
        return self.resolve_selection(selection)
