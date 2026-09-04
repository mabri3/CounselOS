from __future__ import annotations

from typing import Any

import frontmatter

from app.services.vault import VaultService


DEFAULT_ANSWER_CONTRACT = """---
record_type: answer_contract
version: 0.2.0
---
# Answer contract

The shape a finished answer must take. Edit this file to change how Themis.ai
answers. Changes apply to the next message. Nothing needs restarting.

## Standing rule

This contract governs presentation, never permission. The full answer always
ships first, at full strength. Nothing here is a gate, a confidence threshold, or
a reason to withhold, hedge, shorten, delay, or refuse an answer.

The section below is co-equal work product, not metadata on the answer. An edge
item maps a fork in the reasoning or the boundary of the work. It is not merely a
task to complete.

## Support and claim strength

A substantive legal answer must show what supports each material claim and must
match the strength of each claim to the support available.

- Never invent or guess a source, quotation, citation, holding, statute,
  regulation, date, jurisdiction, or fact.
- Never imply that a source was read, retrieved, or verified unless it was.
- Cite each material legal proposition inline with the best available primary
  authority when supplied or retrieved. Name the authority and link its URL when
  available.
- Separate established matter facts, retrieved authority, supplied but unverified
  sources, and generated analysis.
- If no supporting authority was retrieved, state **No external authority
  retrieved** near the start. Give a useful preliminary analysis, but use
  calibrated terms such as "likely," "may," or "appears" instead of presenting
  the legal conclusion as settled.
- For each recommendation or material conclusion, state the strongest reasonable
  counterargument or alternative reading and explain why it does or does not
  change the answer.
- Missing support never blocks the answer. Name the exact missing authority under
  **What would change this**.

## What would change this

End every substantive answer with a section under this heading. It is never empty
and never omitted.

Three kinds of item:

- **Working assumption** — a fact the analysis leaned on that is not established.
  Name what was assumed, and what the answer becomes if it is wrong.
- **Open fork** — a question whose answer sends the matter down materially
  different paths. State both paths.
- **Not examined** — what was in scope but not read, searched, or checked. Name
  the specific document, source, or jurisdiction.

Rules:

- Rank by how much the answer moves, not by how easily the item resolves.
- Three to six items. If only one surfaces, the reasoning has not been examined.
- Every item names a specific fact, a specific fork, or a specific unread source.
- Never write a hedge that would be true of any matter. Banned: "further research
  may be advisable", "consult local counsel", "laws may change", "this is not
  legal advice", "results may vary".
- Prefer the unwelcome item. The one worth naming is the one the lawyer has not
  thought of yet.
- If the vault could have answered an item but was not consulted, say so plainly.
"""

_DEFAULT_DOCUMENT = frontmatter.loads(DEFAULT_ANSWER_CONTRACT)
DEFAULT_ANSWER_CONTRACT_CONTENT = _DEFAULT_DOCUMENT.content.strip()
DEFAULT_ANSWER_CONTRACT_METADATA = dict(_DEFAULT_DOCUMENT.metadata)
MAX_ANSWER_CONTRACT_CHARS = 12_000


class AnswerContractService:
    PATH = "00_System/Answer.md"

    def __init__(self, vault: VaultService):
        self.vault = vault

    def read(self) -> dict[str, Any]:
        if not self.vault.exists(self.PATH):
            self._write_default()
        document = self.vault.read_markdown(self.PATH)
        content = str(document["content"]).strip()
        return {
            "path": document["path"],
            "content": content,
            "metadata": document["metadata"],
            "updated_at": document["updated_at"],
            "is_default": content.strip() == DEFAULT_ANSWER_CONTRACT_CONTENT,
            "max_content_chars": MAX_ANSWER_CONTRACT_CHARS,
        }

    def write(self, content: str) -> dict[str, Any]:
        if len(content) > MAX_ANSWER_CONTRACT_CHARS:
            raise ValueError(
                f"Answer contract must be {MAX_ANSWER_CONTRACT_CHARS} characters or fewer."
            )
        metadata = (
            dict(self.vault.read_markdown(self.PATH)["metadata"])
            if self.vault.exists(self.PATH)
            else dict(DEFAULT_ANSWER_CONTRACT_METADATA)
        )
        self.vault.write_markdown(self.PATH, content, metadata)
        return self.read()

    def reset(self) -> dict[str, Any]:
        self._write_default()
        return self.read()

    def _write_default(self) -> None:
        self.vault.write_markdown(
            self.PATH,
            DEFAULT_ANSWER_CONTRACT_CONTENT,
            dict(DEFAULT_ANSWER_CONTRACT_METADATA),
        )
