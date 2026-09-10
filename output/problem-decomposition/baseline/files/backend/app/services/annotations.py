from __future__ import annotations

from typing import Any

from app.models.api import ChatRequest
from app.services.matters import MatterService
from app.services.vault import VaultService
from app.utils.ids import new_id
from app.utils.time import iso_now


class AnnotationService:
    BODY = "# Annotations\n\nQuestions the lawyer raised against research in this matter.\n"

    def __init__(
        self,
        vault: VaultService,
        matters: MatterService,
        runner: Any | None = None,
    ):
        self.vault = vault
        self.matters = matters
        self.runner = runner

    def bind(self, runner: Any) -> None:
        self.runner = runner

    def _path(self, matter_id: str) -> str:
        return f"{self.matters.matter_path(matter_id)}/research/annotations.md"

    def list(self, matter_id: str) -> list[dict[str, Any]]:
        path = self._path(matter_id)
        if not self.vault.exists(path):
            return []
        annotations = self.vault.read_markdown(path)["metadata"].get(
            "annotations", []
        )
        return [dict(entry) for entry in annotations if isinstance(entry, dict)]

    def create(
        self,
        matter_id: str,
        *,
        source_path: str,
        citation: str,
        quote: str,
        question: str,
        who: str,
    ) -> dict[str, Any]:
        annotations = self.list(matter_id)
        annotation = {
            "annotation_id": new_id("ANN"),
            "source_path": source_path,
            "citation": citation,
            "quote": quote,
            "question": question,
            "answer": "",
            "answered": False,
            "who": who,
            "created_at": iso_now(),
            "answered_at": None,
        }
        annotations.append(annotation)
        self._write(matter_id, annotations)
        return annotation

    async def answer(self, matter_id: str, annotation_id: str) -> dict[str, Any]:
        annotations = self.list(matter_id)
        annotation = next(
            (
                entry
                for entry in annotations
                if entry.get("annotation_id") == annotation_id
            ),
            None,
        )
        if annotation is None:
            raise KeyError(f"Annotation not found: {annotation_id}")
        if self.runner is None:
            raise RuntimeError("Annotation service is not bound to an agent runner.")

        response = await self.runner.run(
            ChatRequest(
                message=(
                    f"A passage from {annotation['source_path']} reads: "
                    f'"{annotation["quote"]}"\n\n{annotation["question"]}'
                ),
                matter_id=matter_id,
                active_file=annotation["source_path"],
                agent_id="research-agent",
            )
        )
        answer = response.reply.strip()
        if not answer:
            raise RuntimeError("Provider returned an empty answer.")

        annotation["answer"] = answer
        annotation["answered"] = True
        annotation["answered_at"] = iso_now()
        self._write(matter_id, annotations)
        return annotation

    def _write(self, matter_id: str, annotations: list[dict[str, Any]]) -> None:
        self.vault.write_markdown(
            self._path(matter_id),
            self.BODY,
            {
                "matter_id": matter_id,
                "record_type": "annotations",
                "annotations": annotations,
            },
        )
