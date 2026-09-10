# Focused research after evidence review

The application's existing analysis loop now explicitly tells the model to return to collection when its review finds a missing definition, applicability provision, exception, or contrary authority that could change the advice. This is an instruction change, not a new reviewer service or a mandatory extra model call.

## Application change

`backend/app/services/research_execution.py` extends the investigation instruction. The analysis model must identify the missing proposition and its effect on the recommendation, use a focused public query linked to the prior request, read the resulting passage, and revise or retain the answer based on the evidence. It should not stop at proposing research it can perform within the saved scope and remaining budget.

The existing source choice, selected collector, privacy checks, request journal, and execution limits still control collection. Disabled follow-up, a failed search, or a limit produces useful conditional advice. No model default or real matter was changed. New investigations receive the updated instruction; this does not rewrite prompts already stored in historical checkpoints.

The missing capability in the earlier Sol experiment was deliberate: that reviewer was forbidden from searching. The application already had the tool path, including `followup_of` and saved request keys. This change makes the review-to-research use of that path explicit. It does not guarantee that every model will identify every material gap.

## Verification

- Focused tests: 19 passed, including three new integration cases for a review-directed follow-up that succeeds, fails, or lacks authorization. The real application runner returns the evidence to the same analysis provider and publishes its final answer. Provider reasoning and network results are deterministic fixtures.
- Full backend suite: 1,344 passed, six dependency deprecation warnings, in 520.88 seconds. Log: `output/main-agent-research-dossier/sol-medium-review/backend-tests.txt`.
- Frontend typecheck and production build passed. Typecheck also passed after restoring generated configuration changes from the isolated development server.
- Browser: isolated fixture run `RUN-20260910-67d664` exposed the existing focused-follow-up choice, collected two linked requests, read the returned PDF passage, and saved an answer. The answer remained visible in the dedicated research reader after reload. This is synthetic browser evidence, not a configured-model legal-quality test.
- Browser limits: the work panel's packet link changed the URL without opening the reader; the dedicated reader showed raw table Markdown and existing citation gaps. These remain separate defects. This was the affected research journey, not a repeat of the entire acceptance catalogue.
- All 2,129 files in the protected real-vault/pointer baseline remained unchanged. Test servers and the test tab were closed.

Browser evidence: `output/main-agent-research-dossier/sol-medium-review/browser-check.json`.

## Sol experiment

The same Sol medium reviewer was allowed two batches of up to four focused searches, plus targeted page reads. It first wrote its own missing propositions, without seeing the evaluator's critique. The reviewer independently chose to investigate whether acquiring an account differs from opening one and located the acquired-account exclusion in 31 CFR 1020.100.

This follow-up used the available web tools rather than OpenCode collection. It tests gap selection and revision with research enabled; it does not compare search providers or prove an end-to-end live application run with Sol. It also gives the model another turn and more work budget, so it does not isolate search as the only changed variable.

- Original answer: `output/main-agent-research-dossier/sol-medium-review/sol-answer.md`
- Model's pre-search plan: `output/main-agent-research-dossier/sol-medium-review/followup-plan.md`
- Query/source log: `output/main-agent-research-dossier/sol-medium-review/followup-research.md`
- Revised answer: `output/main-agent-research-dossier/sol-medium-review/sol-answer-with-followup.md`
- Final grade: `output/main-agent-research-dossier/sol-medium-review/grade-with-followup.md`

The revised answer now states the acquired-account exclusion and the privacy-notice timing exception. It received 90/100 under the same judgment rubric as the prior 78/100 answer. The main legal gap was repaired. Remaining weaknesses include overly broad closing carve-outs and phase restrictions, an omitted existing-customer qualification, and some overbroad marketing-data language. These scores are evaluator judgments for one case, not measured accuracy rates.

The reviewer reported two batches, eight queries, and 20 targeted page reads. Application transport behavior and live legal reasoning are separate evidence: the application uses its saved collector and existing 16-fetch total limit, while this reviewer used the available web tools.

## Source-tool instruction follow-up

The related AltBench request is implemented in the actual model-visible declarations for `search_vault`, `read_file`, `run_research`, `collect_research_evidence`, and `read_research_source`, with matching Pydantic field descriptions and main-agent guidance. This carries the useful lesson from the two-unit experiment without copying its different search syntax or 12,000-character read limit.

The instructions explain Counsel OS's ANY-term, case-insensitive local substring search; provider-dependent public queries; exact paths, URLs, request keys and source IDs; character units and limits; page/find overrides; absolute-end continuation; incomplete previews; and recovery from no-match, unread, omitted or truncated results. They direct the model to read material definitions, exceptions and cross-references. Existing bundled-tool precedence supplies the guidance to existing vaults without rewriting their files. No context or memory architecture, provider default, new service, mandatory review call, or paid experiment was added for this follow-up.

Verification after these instruction/schema edits:

- 23 focused tests passed, including four new schema/search/read tests.
- 137 related tests passed in 30.77 seconds, covering agent tool exposure, research scope, document extraction, index behavior, the real research runner, and review-directed follow-up. Six dependency warnings remain. Log: `output/main-agent-research-dossier/sol-medium-review/tool-instruction-regression-tests.txt`.
- Deterministic fixtures verify stale vault declarations cannot hide the shipped guidance; empty searches can recover through simpler queries; source reads continue exactly across a 6,000-character boundary; page and case-sensitive find options override start; and a saved source exposes a middle passage omitted by ordinary file reads.
- The 1,344-test full suite, frontend checks and browser journey above preceded these final instruction-only changes. No new live-model quality claim is made for the revised tool descriptions.
- All 2,129 protected files matched again after the final edits. `git diff --check` passed.

Final `graphify update .` completed successfully: 226,325 nodes, 498,272 edges and 14,064 communities. The graph and report were updated. HTML visualization was skipped because the graph exceeds the tool limit; some non-code files produced no AST nodes. No semantic API call was made. Log: `output/main-agent-research-dossier/sol-medium-review/graph-update-final.txt`.
