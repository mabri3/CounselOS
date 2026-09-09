from __future__ import annotations

from typing import Any

import frontmatter

from app.services.vault import VaultService
from app.services.dossier import serialized


LEGACY_ANSWER_CONTRACT = """---
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

DEFAULT_ANSWER_CONTRACT = """---
record_type: answer_contract
version: 0.3.0
---
# Answer contract

Give the strongest useful answer first. Match the requested work: discussion,
explanation, drafting, and research need different forms. No mandatory headings
or minimum number of caveats apply.

## Support and claim strength

- Never invent or guess a source, quotation, citation, holding, statute,
  regulation, date, jurisdiction, or fact.
- Distinguish reported facts, verified facts, supplied sources, retrieved
  authority, unverified leads, and generated analysis. Retrieval alone is not
  verification. Cite material claims using the actual available sources.
- If external authority was needed but none was retrieved, say briefly:
  **No external authority retrieved**. Continue with useful conditional analysis.
- Take a supported position. Explain a material competing reading when evidence
  supports it. Do not invent an objection or automatically agree with the user.
- For a material missing fact, state the likely answer and the short alternative
  if the fact changes. Ask at most one optional question when its answer could
  materially change the analysis. State its consequence. An unanswered question
  does not block useful work. Do not repeat answered questions without a change.
- Name specific limits only when they matter. There is no required caveat count.
  Never add generic disclaimers or force a research template on a draft.
- Preserve useful output if research, tools, citation formatting, or optional
  structure parsing fails. Clearly name any resulting material support gap.
- Keep recommendations separate from recorded decisions. Explain the effect of
  changed facts and offer a draft update; revise only on the lawyer's request.
"""

_LEGACY_DOCUMENT = frontmatter.loads(LEGACY_ANSWER_CONTRACT)
LEGACY_ANSWER_CONTRACT_CONTENT = _LEGACY_DOCUMENT.content.strip()

_DEFAULT_DOCUMENT = frontmatter.loads(DEFAULT_ANSWER_CONTRACT)
DEFAULT_ANSWER_CONTRACT_CONTENT = _DEFAULT_DOCUMENT.content.strip()
DEFAULT_ANSWER_CONTRACT_METADATA = dict(_DEFAULT_DOCUMENT.metadata)
MAX_ANSWER_CONTRACT_CHARS = 12_000


# This runtime-owned supplement applies even when a lawyer has edited Answer.md.
# It defines the machine-readable citation shape without replacing that custom
# presentation contract.
CLAIM_SUPPORT_EXECUTION_CONTRACT = """# Claim support output contract

Keep the useful prose as the answer. When the response makes material legal
claims, also preserve claim-level support in optional structured output when the
provider supports it. Each saved claim contains:

`claim_id`, `text`, `claim_revision`, `output_revision`, `applicability`,
`evidence`, and `support_gap`.

Applicability names the regulated actor and jurisdiction, the saved fact and
assumption IDs used, and a short application explanation. If any of these are
material and unknown, state that gap. Do not infer that a definition or generic
mention of an authority proves that the law applies to this actor or matter.

Each evidence entry names `source_id`, the exact saved `locator`, and a short
claim-specific explanation. Use only an exact available excerpt supplied by the
source record. Do not invent or reconstruct an excerpt, locator, source status,
verification event, claim revision, or output revision. Retrieved is not Verified.
If the provider cannot return separate structured output, put
`[source:SOURCE_ID|exact locator]` directly after the supported claim. Several
claims can cite different exact passages from the same source.

The ordinary chat transport is also available. Write the useful prose first,
then optionally append exactly one fenced JSON object in this form:

```claim-support
{"claims":[{"claim_id":"CLM-ID","text":"Exact text copied from the prose","applicability":{"regulated_actor":"","jurisdiction":"","fact_ids":[],"assumption_ids":[],"explanation":""},"evidence":[{"source_id":"SRC-ID","locator":"exact saved locator","explanation":""}],"support_gap":""}]}
```

Do not put generated excerpts, source status, claim revisions, or output
revisions in this block. The application derives those values from saved source
records and the saved answer. The block is optional; do not force an ordinary
answer through JSON.
Missing support or malformed optional structure must not remove useful prose or
other valid claims and evidence entries.
"""

DECISION_PATHS_EXECUTION_CONTRACT = """# Optional decision paths output
For each condition, optionally include answer_choices: up to six objects with
label and answer. These are editable draft answers, not facts. Give useful
matter-specific alternatives, including uncertainty when material. Do not
invent confirmed facts. The same saved choices appear in chat and the map.


Keep the useful answer in normal prose. For a focused issue analysis, you may
append one independent fenced JSON object after the prose:

```decision-paths
{"issue_analysis":{"issue_id":"ISS-real","display_title":"Short issue title","explanation":"Why this issue matters","business_effect":"What changes for the business","tests":[{"test_id":"test-1","title":"The legal test","summary":"How the test applies","kind":"legal_test","actor":"Regulated actor","jurisdiction":"Applicable jurisdiction","effective_at":"Relevant date or period","exceptions":"Material exceptions","applicability":"Why this test applies","claim_ids":[],"condition_ids":["condition-1"]}],"conditions":[{"condition_id":"condition-1","question":"Is the required fact true?","assessment":"unknown","assessment_basis":"Why the current record does or does not answer it","fact_ids":[],"question_ids":[],"claim_ids":[]}],"options":[{"option_id":"option-met","title":"Path if the condition is met","kind":"conditional_path","condition_summary":"The required fact is true","requirements":[{"condition_id":"condition-1","state":"met"}],"combination":"all","consequence":"Result on this path","trade_off":"Material cost or risk","remaining_work":[],"recommendation":"candidate","recommendation_reason":"Why this path remains available","claim_ids":[],"work_item_ids":[]},{"option_id":"option-not-met","title":"Path if the condition is not met","kind":"conditional_path","condition_summary":"The required fact is false","requirements":[{"condition_id":"condition-1","state":"not_met"}],"combination":"all","consequence":"Different result on this path","trade_off":"Material cost or risk","remaining_work":[],"recommendation":"candidate","recommendation_reason":"Why this path remains available","claim_ids":[],"work_item_ids":[]}]}}
```

Use only real issue, fact, question, work-item, and claim IDs supplied in this
run. Use the exact field names shown above. Do not shorten `test_id`,
`condition_id`, or `option_id` to `id`, and do not replace titles or questions
with a generic `text` field. Give each new test, condition, and option a unique
local ID.

Allowed `kind` values for a test are `law`, `regulation`, `contract`, `policy`,
and `legal_test`. Allowed condition assessments are `met`, `not_met`, `unknown`,
and `conflicting`. Unknown never chooses a path. Allowed option kinds are
`conditional_path`, `business_alternative`, and `clarify`. Each requirement is
an object with `condition_id` and `state`; its state is `met` or `not_met`.
`requirements` is always an array, not an object such as `{\"all\": [...]}`. An
option with requirements must set `combination` to `all` or `any`. Allowed
recommendation values are `candidate` and `recommended`.
Each option also has `risk_assessment`: `not_assessed`, `risk_to_review`, or
`not_recommended`. Use `risk_to_review` for a material risk or unresolved
condition needing review. Use `not_recommended` only when the analysis identifies
a reason to avoid the path, and explain that reason in `trade_off`. Do not mark
a path recommended when you assess it as not recommended. Keep risk separate
from the lawyer recording a decision.

Issue analyses may include `connections`: an array of {target_issue_id, relationship, reason}. Use exact saved issue IDs; relationship is depends_on, compounds, may_resolve, or shared_condition. Explain conditional effects in reason. An empty array means connections were assessed and none found; omit when not assessed.

Options may include `effects`, an array of explicit effects on other options in
this same analysis. Each effect has `target_option_id`, `trigger` (agreement,
implementation_complete, or condition), and a concrete `reason`. For condition
triggers also provide `condition_id` and `condition_state` (met or not_met).
An agreement trigger means choosing this option excludes the target as a choice.
An implementation_complete trigger means the target is replaced only after this
option's listed implementation work is complete; it remains possible before then.
A condition trigger means that confirmed condition state rules out the target.
Never infer exclusion merely from graph adjacency or from a recommendation.
Omit effects when there is no supported causal link. Do not claim a current
operating state unless the supplied facts establish it.

Express mixed nested logic as separate options. Do not supply analysis or option
revisions; the application creates them. Whole-matter analysis may use
`issue_analyses` instead. This block is optional. Malformed optional structure
must never replace or remove useful prose.
"""


class AnswerContractService:
    PATH = "00_System/Answer.md"

    def __init__(self, vault: VaultService):
        self.vault = vault

    @serialized
    def read(self) -> dict[str, Any]:
        if not self.vault.exists(self.PATH):
            self._write_default()
        document = self.vault.read_markdown(self.PATH)
        content = str(document["content"]).strip()
        if (content == LEGACY_ANSWER_CONTRACT_CONTENT
                and document["metadata"] == dict(_LEGACY_DOCUMENT.metadata)):
            self._write_default()
            document = self.vault.read_markdown(self.PATH)
            content = str(document["content"]).strip()
        result = {
            "path": document["path"],
            "content": content,
            "metadata": document["metadata"],
            "updated_at": document["updated_at"],
            "is_default": content.strip() == DEFAULT_ANSWER_CONTRACT_CONTENT,
            "max_content_chars": MAX_ANSWER_CONTRACT_CHARS,
        }

        if content and content != DEFAULT_ANSWER_CONTRACT_CONTENT:
            result["update_proposal"] = {
                "state": "proposed", "content": DEFAULT_ANSWER_CONTRACT_CONTENT,
                "reason": "Optional update: useful answer first, with only material uncertainty and no fixed caveat count.",
            }
        return result

    @serialized
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

    @serialized
    def reset(self) -> dict[str, Any]:
        self._write_default()
        return self.read()

    def _write_default(self) -> None:
        self.vault.write_markdown(
            self.PATH,
            DEFAULT_ANSWER_CONTRACT_CONTENT,
            dict(DEFAULT_ANSWER_CONTRACT_METADATA),
        )
