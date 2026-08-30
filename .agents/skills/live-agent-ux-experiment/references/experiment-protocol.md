# Experiment protocol and prompts

Replace bracketed values with the user's inputs. Keep all experimental-validity requirements.

## 1. Coordinator setup

State the configuration before creating actors:

```text
Business type: [BUSINESS TYPE]
Fictional company: [COMPANY]
Requester: [REQUESTER ROLE]
Attorney: [ATTORNEY ROLE]
Iterations: [N]
Question themes: [THEMES]
Application: [APP URL]
Requester model: [MODEL AND REASONING]
Attorney model: [MODEL AND REASONING]
Synthesis model: [MODEL AND REASONING; DEFAULT GPT-5.6-SOL HIGH]
Public reference: [NONE OR COMPANY/URL]
Final-action policy: local fictional in-app actions are allowed; real external delivery requires confirmation
```

Confirm that the app is available. This is environment setup, not UX evidence. Use a unique experiment name and record prefix.

## 2. Requester prompt

```text
Act as [REQUESTER ROLE] at [COMPANY], a fictional [BUSINESS TYPE]. Produce exactly [N] realistic legal product requests for [ATTORNEY ROLE]. Cover these themes across the set: [THEMES].

Each request must be independent enough to become one Counsel OS matter. Write at least two substantial paragraphs. Include the business goal, proposed user experience or operational flow, relevant actors, timing, known facts, missing or unsettled facts, and the exact decision or advice needed from legal. Use realistic detail and normal business language. Vary the facts and risk pattern. Do not answer the legal questions.

Return a numbered list. Give each request a short title and its full text. Use only the fictional company. Do not edit the application or repository.
```

Check that the output contains exactly `N` complete requests. Ask the same actor for a narrow correction if needed.

## 3. Company-setup attorney prompt

```text
Act as [ATTORNEY ROLE] for [COMPANY]. Set up the fictional company in the live Counsel OS application at [APP URL].

Load and follow browser:control-in-app-browser. Use only the visible in-app browser for application actions. Select it explicitly and keep it visible. Inspect the screen, click visible controls, type into visible fields, and inspect the visible result after each change.

Do not use Chrome, curl, APIs, source code, repository docs, the database, vault files, network requests, hidden DOM mutation, or direct file writes to learn or operate the workflow.

[If supplied: In a separate in-app browser tab, inspect only public pages of [REFERENCE]. Use its broad public business model. Do not sign in, copy text, claim affiliation, or collect unnecessary data.]

Find the company setup area from the visible Counsel OS UI. Create or update a detailed fictional profile suited to [BUSINESS TYPE]. Include the business model, products, customers, partners, operating footprint, teams, legal topics, risk posture, operating principles, and a fictional legal owner. State that [COMPANY] is fictional and not affiliated with a reference company. Use full paragraphs where the UI permits.

Do not overwrite unrelated company data. If no safe test profile is possible, stop and report the visible conflict.

Report:
- what worked well, with visible evidence and why it helped;
- recoverable product friction;
- broken behavior with no normal visible recovery;
- browser-control errors;
- environment failures;
- exact labels, reproduction steps, expected result, actual result, recovery, delay, and lawyer impact for each problem;
- visible saved result and browser-only compliance.

Do not inspect code, propose implementation changes, or fix issues.
```

## 4. Per-iteration attorney prompt

Create one fresh attorney actor per request. Run actors serially.

```text
Run iteration [NN] of a live Counsel OS usability experiment at [APP URL]. Act as [ATTORNEY ROLE] at fictional [COMPANY]. Handle exactly one new matter.

Load and follow browser:control-in-app-browser. Use only the visible in-app browser and keep it visible. Select it explicitly. Learn the workflow only from the visible UI. Inspect before acting. Click visible controls and type into visible fields. Inspect the visible result after every state-changing action.

Do not use Chrome, curl, APIs, source code, repository docs, the database, vault files, network requests, hidden DOM mutation, or direct file writes to learn or operate the product. Do not change code, fix issues, delete records, or overwrite existing records.

Create one matter titled "[PREFIX][NN] — [SHORT TITLE]". Enter the complete requester text, not a summary.

Discover the current workflow phases and order from the visible UI. Attempt every visible phase in order. Do not rely on earlier phase names. At each phase, do the normal lawyer work that the interface supports and this matter needs. This can include orientation, facts, missing facts, issues, work items, research, options, drafting, recommendations, editing, a response, and a decision.

Create realistic legal work. The main response or memo must contain several developed sections and a useful first-pass answer. State assumptions, missing facts, and unverified leads. Keep the recommendation separate from a recorded decision. If decision recording is relevant and available, review and edit a plausible fictional decision before recording it.

Inspect every save, state change, artifact, decision, send, and closure result on screen. Do not claim success without visible confirmation. Local fictional in-app changes are authorized. If a control could contact a real person or external service, stop before using it.

Return these separate sections:

1. Working well: task, exact visible evidence, frequency within the run, and why it helped the lawyer.
2. Product friction: recoverable confusion, delay, extra work, or weak feedback.
3. Broken behavior: failed, contradictory, incorrect, or unrecoverable behavior.
4. Browser-control errors: locator, stale target, quoting, or automation mistakes.
5. Environment failures: app, provider, or browser-service failures.

For each friction or broken item include phase, exact label, minimal reproduction steps, expected behavior, visible actual result, recovery, extra clicks or delay, lawyer impact, and a screen-state description or screenshot reference when available.

Also report the question, phase labels discovered, phases attempted and reached, artifacts visibly verified, recommendation and decision status, final state, completion status, concise legal-work summary, exact blockers, and browser-only compliance.

Do not inspect source or prescribe implementation changes. State only the user outcome that should improve.

Requester question:

[EXACT REQUEST TEXT]
```

## 5. Coordinator evidence check

After each iteration:

1. Require visible evidence for “saved,” “sent,” “recorded,” “closed,” and other success claims.
2. Require at least one working-well observation when the actor completed any phase successfully.
3. Keep friction, broken behavior, browser-control errors, and environment failures separate.
4. Downgrade “broken” to friction when a clear normal recovery exists.
5. Mark browser-boundary violations or wrong-matter work as contaminated. Repeat with a fresh actor when safe.
6. Do not give earlier findings to later attorneys.

For a browser or app failure, make one recovery attempt with changed conditions. Do not repeat the same action without new information.

## 6. Post-experiment synthesis and diagnosis

Start only after the last live run. Create a fresh `gpt-5.6-sol` agent with high reasoning unless the user selected another synthesis model. Pass it the normalized evidence from every run, including positive findings, friction, broken behavior, browser-control errors, environment failures, completion state, and method exceptions. Do not pass conclusions that are not supported by the actor reports.

The synthesis agent can now inspect the repository. This must not revise or erase the observations. The coordinator must check the draft synthesis against the raw evidence before delivering it.

For each related issue group:

1. Reproduce or confirm the visible behavior when safe.
2. Run `graphify query "<focused issue question>"` when `graphify-out/graph.json` exists.
3. Inspect the relevant components, actions, services, state transitions, and tests.
4. Check console or server logs when they can distinguish product failure from environment failure.
5. Assign cause confidence: Confirmed, Likely, or Unknown.
6. Create a repair item. Do not edit code.

Do not turn a design preference into a bug. Use these classifications:

- **Working well:** Clear, efficient, reliable behavior that supported task completion.
- **Not working well:** Recoverable friction that caused confusion, delay, repeated checking, or avoidable work.
- **Broken:** Required behavior failed, produced incorrect or contradictory state, lost work, or had no normal visible recovery.

Use priorities:

- **P0:** Data loss, unsafe external action, or broad inability to use the product.
- **P1:** Blocks a core workflow or breaks record integrity.
- **P2:** Repeated material confusion, rework, or misleading state with a recovery.
- **P3:** Localized inconvenience or polish issue with limited effect.

Each repair item must contain:

```text
ID and title:
Classification and priority:
Affected runs, roles, and phases:
Frequency:
Evidence:
Minimal reproduction:
Current behavior:
Expected behavior:
Lawyer and workflow impact:
Recovery or workaround:
Cause confidence:
Cause evidence:
Relevant code areas:
Detailed implementation approach:
Risks and dependencies:
Tests to add or update:
Visible acceptance criteria:
Further diagnosis needed:
```

“Detailed implementation approach” must identify the state, wording, control, data contract, or workflow behavior that should change. It must give enough detail for a coding agent to implement the repair without repeating the UX investigation. It must not claim unverified code facts.

## 7. Final report

Lead with the overall result. Use this structure:

```markdown
# [EXPERIMENT NAME]

## Executive result

[Completion rate, most important strength, most important broken behavior, and first repair priority]

## Setup and method

[Roles, business, company, iterations, themes, requester, attorney, and synthesis models, browser-only rule, and exceptions]

## Company setup result

[Visible result]

## Iteration results

| Run | Question | Phases reached | Main artifacts | Decision | Final state | Status |
|---|---|---|---|---|---|---|

## What is working well

| ID | Capability | Evidence | Frequency | Why it helps | Preserve during fixes |
|---|---|---|---|---|---|

## What is not working well

| ID | Priority | Issue | Frequency | Evidence | Impact | Recovery |
|---|---|---|---|---|---|---|

## What is broken

| ID | Priority | Failure | Frequency | Evidence | Impact | Workaround |
|---|---|---|---|---|---|---|

## Detailed repair backlog

[One complete repair item per material friction or broken behavior]

## Cross-run patterns

[Repeated issues, one-off issues, and learning effects]

## Browser-control errors

[Separate list or None]

## Environment failures

[Separate list or None]

## Incomplete or contaminated runs

[Exact blockers and affected evidence]

## Method compliance

[Browser-only statement for live actors, post-run code-inspection statement, and exceptions]
```

Do not omit positive findings. Do not hide failed runs. Do not combine product defects with agent automation mistakes. Do not implement the backlog in the same experiment task unless the user explicitly requests that extra work.
