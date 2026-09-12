# Astra review prompt: research-first dossier build

You are the independent reviewer of the research-first dossier implementation in Counsel OS / Themis.ai. Work in `/Users/bharris/Programs/counsel-os-mvp` using this existing checkout, including its modified and untracked files. Keep this task's selected Astra model and effort. Opus or Sol may have implemented the work. Judge the result from evidence, regardless of who wrote it.

Review the implementation, reproduce material failures, and report the smallest required repairs. This is a review and report task. Do not implement repairs or finish pending build steps. You may run checks, use an isolated test vault, and write review evidence or temporary diagnostic tests. Do not change application source, existing tests, provider settings, live matter records, or the original build tracker. This task does not authorize commits, pushes, deployment, messages to others, additional paid evaluations, or coding subagents.

## Start and resume

1. Confirm that the implementation agent has stopped editing this checkout. If it is still active, report that a stable checkpoint is needed before a reliable review. Do not interrupt another task or review moving files as if they were stable.
2. Read `AGENTS.md`, applicable nested instructions, `docs/PRD.md`, `CODEX_HANDOFF.md`, `docs/DESIGN_LANGUAGE.md`, and `current.md` if present. Use the handoff-review skill if available. The findings-only scope in this prompt overrides that skill's default repair phase.
3. Read these build artifacts:
   - `handoffs/dossier-research-first.handoff-plan.md` — the complete feature specification and acceptance checks.
   - `handoffs/dossier-research-first.handoff-progress.md` — the implementer's latest claims and next action.
   - `output/dossier-research-first/step-*.md` — the evidence for each build step.
   - `output/dossier-research-first/verification.md`, if present — the final implementation report.
   Read the original handoff prompt only if needed to resolve an execution constraint. Do not execute its implementation work order.
4. Keep your review state separate, under `output/dossier-research-first/astra-review/`. Create `progress.md` if absent. If it exists, resume from it after checking whether the relevant source files changed. Do not erase previous findings or evidence.
5. Record the current HEAD, branch, tracked and untracked file inventory, and hashes of reviewed feature files. The checkout was already heavily modified before this build. Use the build evidence and file contents to identify this feature's changes. Do not attribute every change since HEAD to Opus or Sol. Record uncertain attribution explicitly.
6. For code navigation, first use `graphify query` when `graphify-out/graph.json` exists, as instructed by AGENTS.md. Use the wiki index when available. Confirm graph results in current source. If the tool is unavailable, record that limit and use scoped `rg` searches. A dirty graph is not a reason to skip it.

The build may still be partial when this review starts. Review the available implementation and identify the missing work. Distinguish an unfinished step from a defect in a step marked complete. A partial build cannot receive a verdict that the complete feature is ready. Do not hardcode a step number from an earlier conversation.

## What the feature must deliver

When a lawyer asks to generate a dossier, the application proposes three priorities, maps them to distinct legal issues, and lets the lawyer accept, change, or skip them. The same setup card offers the top three issues or all N identified material issues, plus source choices.

The first pass gives deep research on the selected first three issues and an initial answer on every other material issue. If all issues were selected, the first dossier is available while the remaining issues continue in batches of up to three. All N means the set shown at Start. Later discoveries remain visible as new research gaps.

Every issue retains its current answer, rule and support, application, next action, detailed analysis, research history, and honest coverage. The dossier must preserve meaningful conditions and checklists across runs. It must distinguish supplied facts from inferred assumptions. References must identify the actual record or source. Dates must use a supported event or rule and distinguish proposed dates from recorded commitments.

Work and progress survive leaving the page and restarting the backend. Completed calls are reused. Concurrent workers must preserve each other's findings and the lawyer's edits. Source failures and malformed optional model output must still leave useful answers available.

These are general product requirements. Harbor is evidence of earlier failures. Its names, law, counts, market states, and conclusions must not become production rules.

## Review passes

### A. Check the full plan against the implementation

Make a matrix for all 13 build steps and the acceptance check. For each row record:

- What the plan requires.
- What the tracker claims.
- The actual code entry point and relevant tests.
- Your evidence.
- Result: verified, defect, incomplete, or unverified.

Read the relevant changed code and its callers. Follow changed shared interfaces through all affected callers. Inspect relevant untracked modules directly. A new file, imported symbol, mocked result, passing helper test, or checked tracker box does not prove that the application uses the feature.

Check for stubs, dead paths, suppressed exceptions, fabricated API references, hardcoded fixture behavior, skipped checks, weak assertions, and tests that replace the behavior they claim to verify. Treat harmless differences in file layout as differences, not defects. Report a plan error when the specification itself is contradictory or would cause wrong behavior.

### B. Trace the actual user flow

Follow Generate from the real chat route through preparation, saved choices, Start, worker execution, batch composition, publication, saved conversation output, and document rendering. Verify normal chat still works.

Check all of the following:

1. The setup turn finishes. Start returns promptly, and research outlives the short chat turn. GET and polling do not start work or spend model calls.
2. Three selected issues produce three distinct child runs, briefs, IDs, and checkpoints. Three questions assigned to one issue are insufficient. The matter does not get an unintended fourth worker from the normal research path.
3. Zero, one, two, three, and more than three identified issues behave sensibly. Duplicate or invalid selections are handled. Accept, edit, and skip preserve the scope and source choices actually made.
4. Each issue keeps its research budget. Consumed allowances do not reset on resume. Remaining allowances are not replenished. The final answer call and time reserve remain available. A shared short chat timeout does not consume the entire multi-issue allowance.
5. The first dossier becomes available before the remaining batch finishes. Failed or limited workers contribute useful saved content and visible gaps. Research status does not imply a legal decision or approval.
6. Explicit saved-only generation, automatic refresh, hypothetical previews, and excluded sources retain the plan's scope limits. Repeated Generate or Start does not create duplicate work.
7. Both standard and experimental chat show saved setup and progress. Reload and navigation restore it. An unsent draft, open document, and relevant context survive background updates.

### C. Check substance, traceability, and record integrity

1. Inspect the full path from worker output to saved issue state to composed dossier. A shorter later overview must not erase useful conditions, exceptions, matrices, interrogatories, or prior findings. Use meaningful content assertions, not only headings or length checks. Superseded analysis remains identifiable in history.
2. Inspect malformed and partial model output, missing optional fields, tool failures, and limit exhaustion. Useful prose survives. Do not require a new verifier, confidence gate, or refusal stage.
3. Source counts come from saved evidence. Distinguish discovered, retrieved, and passage-read sources. Internal fact excerpts do not count as legal source reads. Repeated sources and versions are counted consistently. Inapplicable sources and unresolved subquestions remain visible.
4. Follow distinct internal references, artifact links, and external passages through cleanup, persistence, reload, both chat surfaces, and dossier/revision readers. Each reference resolves to its own captured record and version. Unknown IDs stay distinguishable. Generic labels must not hide distinct references. No guessed passage highlights or invented citations.
5. Legacy display repair uses available raw saved output without rewriting history or guessing references that were already lost. Shared cleanup still works without a catalog. Reference resolution respects matter and source scope, including path validation.
6. Supplied facts remain reported facts unless a real conflict needs resolution. Inferred assumptions stay separate. Recommendations do not become recorded decisions. A conditional business structure must not become a supplied fact.
7. Proposed work dates use a supported anchor and state the calculation basis. Administrative dates do not silently replace transaction or access-loss dates. Missing anchors remain explicit. Owner suggestions do not become assigned people. Do not import Harbor-specific legal timelines to make this test pass.

### D. Test concurrent publication and recovery

Use the actual application context, routes, coordinator, and child harness. Control model and network boundaries. A mocked coordinator that always succeeds is not recovery evidence.

Check one combined publication per batch. Workers may save packets but must not independently overwrite shared recommendations or the dossier. Preserve existing safeguards for normal research. Advance expected hashes only after the parent's own known publication. Independent edits or changed facts produce a labeled review result and preserve the current record.

Exercise the interruption points in Step 11 of the blueprint. These include parent-save/child-create boundaries, partial child completion, unknown external outcomes, saved writer content before publication, each saved effect before its receipt, Stop racing with completion, and a missing or corrupt source snapshot.

Recreate the real application context against the same isolated vault and resume through the API. Check that completed calls are reused; child IDs, revisions, recommendations, and messages are not duplicated; unknown calls do not retry without the explicit action; budgets are preserved; Stop remains durable; and fresh work can use the matter afterward. Recovery must not let normal startup publish a parent-managed child independently before ownership is established.

Inspect stale sequence values, repeated action keys with matching and conflicting payloads, malformed saved state, duplicate Start/Resume, reload during work, and a completed parent after restart. Do not claim exactly-once external billing when an outcome is unknown.

## Verification and limits

Run the focused checks from the blueprint for the areas under review. Inspect test bodies as well as results. Reproduce material findings where feasible. Temporary diagnostic tests and logs belong in the review directory; do not weaken existing tests or modify application code to obtain green results.

When the build is complete enough, independently run the repository's required backend tests, frontend checks, and build. Use the exact commands in Steps 11–12 as the starting point. Write new XML/log output in the review directory so the author's evidence remains intact. Record command, working directory, exit code, test counts, duration, and source version. If a required test or script is absent, report the missing implementation; do not silently replace it with a weaker check.

Use a separate owned fixture vault and free ports for the browser checks in Step 12. Confirm the ownership marker before reset. Do not reuse or reset live matters or another task's fixture. Do not stop processes you did not start. Keep the real application routes and orchestration; fake only the declared model/search/fetch boundaries. Walk the feature in both chat surfaces and exercise the relevant existing acceptance scenarios. Save screenshots and observed results. A source-string check is not evidence that a button works.

Inspect the existing Step 13 live-model evidence: request and run IDs, selected scope, actual search and passage-read traces, output, timing, and retained detail. Do not run another paid evaluation. If the check has not run, lacks access, or lacks evidence, mark live quality unverified and state the exact gap. Keep deterministic application proof separate from live model quality and legal correctness.

Run long checks without blocking progress updates. Inspect in-flight processes and existing output before restarting a long check after interruption. Once a check passes, repeat it only if changed source, a new failure, or an unresolved concern justifies it. Record environment or baseline failures separately from feature defects. Continue independent review work when one check is blocked.

## Saved progress and deliverables

Use these review artifacts:

- `output/dossier-research-first/astra-review/progress.md`
- `output/dossier-research-first/astra-review/coverage.md`
- `output/dossier-research-first/astra-review/findings.md`
- `output/dossier-research-first/astra-review/verification.md`
- Supporting logs, diagnostic tests, and screenshots in the same directory.

The progress file must track: baseline and scope, plan coverage, user flow, substance and references, publication and recovery, verification, and final report. After each area, save what you inspected and checked, findings IDs, unreviewed files, and the exact next action. Before any pause, record running processes, log paths, fixture identifiers, and the next command. Reuse completed review evidence only when it still applies to the current source.

For every material finding, give a stable ID, severity, exact file and line, affected requirement, trigger, expected and actual behavior, impact, evidence or reproduction, smallest proposed fix, and the regression check that would prove the repair. Clearly separate reproduced defects, code-supported findings, untested concerns, missing implementation, and uncertain attribution. Do not pad the report with speculative risks or style preferences.

Lead the final response with whether the complete feature is ready for a controlled user trial. Use one of: ready based on the stated evidence; defects prevent readiness; build incomplete; or evidence insufficient. Give the most important findings first. Link to the saved reports. State what passed, what failed, what was not checked, and the next action. If you found no defects, say that without implying that untested behavior passed.

Perform the review now. Preserve the build and its tracker. Save a review checkpoint after each area and before any interruption.
