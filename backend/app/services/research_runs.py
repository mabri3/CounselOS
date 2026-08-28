from __future__ import annotations

import asyncio
from typing import Any

from app.services.research import ResearchService
from app.services.vault import VaultService
from app.utils.ids import new_id
from app.utils.time import iso_now


class ResearchRunService:
    """Runs small research batches in this process and records their status in Markdown."""

    MAX_QUESTIONS = 5

    def __init__(self, vault: VaultService, research: ResearchService):
        self.vault = vault
        self.research = research
        self._tasks: dict[str, asyncio.Task[None]] = {}

    def start(self, matter_id: str, questions: list[str]) -> dict[str, Any]:
        clean_questions = [item.strip() for item in questions if item.strip()][: self.MAX_QUESTIONS]
        if not clean_questions:
            raise ValueError("At least one research question is required.")
        run_id = new_id("RUN")
        record = self._write(
            matter_id,
            run_id,
            state="queued",
            questions=clean_questions,
            completed=0,
            status="Research is queued.",
        )
        self._tasks[run_id] = asyncio.create_task(self._execute(matter_id, run_id, clean_questions))
        return record

    def get(self, matter_id: str, run_id: str) -> dict[str, Any]:
        path = self._path(matter_id, run_id)
        if not self.vault.exists(path):
            raise KeyError(f"Research run not found: {run_id}")
        document = self.vault.read_markdown(path)
        return {**document["metadata"], "path": path}

    def list(self, matter_id: str) -> list[dict[str, Any]]:
        directory = self.vault.resolve(f"{self._matter_path(matter_id)}/research/runs")
        if not directory.exists():
            return []
        return [self.get(matter_id, path.stem) for path in sorted(directory.glob("*.md"), reverse=True)]

    def mark_running_interrupted(self) -> int:
        count = 0
        for path in self.vault.iter_files("03_Matters", {".md"}):
            if path.parent.name != "runs":
                continue
            relative = self.vault.relative(path)
            document = self.vault.read_markdown(relative)
            if document["metadata"].get("state") in {"queued", "running"}:
                self.vault.update_markdown(
                    relative,
                    metadata_updates={
                        "state": "interrupted",
                        "status": "Research was interrupted when the application stopped.",
                        "finished_at": iso_now(),
                    },
                )
                count += 1
        return count

    async def wait(self, run_id: str) -> None:
        task = self._tasks.get(run_id)
        if task is not None:
            await task

    async def _execute(self, matter_id: str, run_id: str, questions: list[str]) -> None:
        results: list[dict[str, Any]] = []
        self._write(matter_id, run_id, state="running", questions=questions, completed=0, status="Research is running.")
        try:
            for position, question in enumerate(questions, start=1):
                result = await self.research.run(matter_id, question, change_stage=False)
                results.append(result)
                self._write(
                    matter_id, run_id, state="running", questions=questions, completed=position,
                    status=f"Completed {position} of {len(questions)} research items.", results=results,
                )
            self._write(
                matter_id, run_id, state="completed", questions=questions, completed=len(questions),
                status="Research is complete.", results=results, finished_at=iso_now(),
                useful_support=sum(int(item.get("internal_sources", 0)) + int(item.get("external_sources", 0)) for item in results),
                dossier_effect="Research support is ready for the next dossier update.",
            )
        except asyncio.CancelledError:
            self._write(
                matter_id, run_id, state="interrupted", questions=questions, completed=len(results),
                status="Research was interrupted.", results=results, finished_at=iso_now(),
            )
            raise
        except Exception as exc:
            self._write(
                matter_id, run_id, state="failed", questions=questions, completed=len(results),
                status=f"Research stopped after preserving {len(results)} useful result(s): {exc}",
                results=results, finished_at=iso_now(),
            )
        finally:
            self._tasks.pop(run_id, None)

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
