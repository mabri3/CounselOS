---
name: live-agent-ux-experiment
description: Run repeatable, role-based Counsel OS usability experiments in the live application, then deliver an evidence-based assessment of what works, what causes friction, what is broken, and how to fix each issue. Use for end-to-end agent UX cycles or a repeat of the Run 10-style experiment. Do not use for ordinary API tests or requests to implement the fixes during the experiment.
---

# Live Agent UX Experiment

Run a controlled usability experiment against the live Counsel OS application. Simulate realistic work. Observe the current product. After the experiment, convert the evidence into a detailed repair backlog. Do not change application code unless the user separately asks for implementation.

Before starting actors, read [references/experiment-protocol.md](references/experiment-protocol.md). It contains the actor prompts, analysis method, and report format.

## Inputs

Collect or infer:

- **Business type:** Company and product context.
- **Requester role:** Business person who sends questions to legal.
- **Attorney role:** Lawyer persona, seniority, and practice focus.
- **Iterations:** Number of separate matters.
- **Question themes:** Legal product topics or question types.

Optional values are the fictional company name, a public company used only as a broad business-model reference, the application URL, and model settings.

Use these defaults:

- Application URL: `http://localhost:3000`
- Requester: `gpt-5.6-luna`, medium reasoning
- Attorney: `gpt-5.6-luna`, high reasoning
- Synthesis and diagnosis: `gpt-5.6-sol`, high reasoning
- Company: clearly fictional and suited to the business type
- Matter prefix: `<Company> UX Test — NN —`
- Final action: allow local fictional in-app state changes; stop before an action that could contact a real person or external service

Ask one question only if a missing value would materially change the experiment. Otherwise, state the inferred setup and continue.

## Browser-only experiment boundary

Every company-setup and attorney action must use the visible in-app browser. Each attorney actor must load and follow `browser:control-in-app-browser` before its first application action.

The attorney must:

- select the in-app browser explicitly and keep it visible;
- inspect the current screen before acting;
- click visible controls and type into visible fields;
- inspect the visible result after every state-changing action;
- learn current phase names and workflow order from the UI;
- use Counsel OS chat and other visible controls when those are the normal product path.

The attorney must not use `curl`, APIs, database access, vault files, source code, repository docs, browser network requests, hidden DOM mutation, Chrome, or a headless browser to learn or operate the product workflow.

Shell commands may start or check the application before the experiment. They are environment setup, not UX evidence.

If an actor breaks this boundary, mark the affected run as contaminated. Repeat it with a fresh attorney when safe. Disclose every exception.

## Experiment structure

Use one coordinator and two actor types:

1. A requester generates exactly the requested number of realistic questions.
2. A setup attorney creates or updates the fictional company profile through the visible UI.
3. A fresh attorney handles one question as one new matter.
4. Repeat step 3 serially until all iterations finish or the application blocks further work.
5. The coordinator normalizes the evidence.
6. Only after the live runs are complete, create a fresh Sol High synthesis agent. It investigates likely causes and drafts the final assessment and repair backlog.
7. The coordinator checks the synthesis against the raw evidence before delivery.

Use subagents for actors when available. Do not create user-owned Codex tasks unless the user asks for separate tasks. Give each attorney clean context containing only the experiment rules, persona, fictional company facts, and its one exact requester question.

Never allow two actors to change the live app at the same time. Parallel request generation or post-run code investigation is acceptable. Live UI writes must be serial.

Do not tell later attorneys what earlier attorneys found. This preserves evidence about whether the interface is independently understandable.

## Realism

- Each requester question must include the business goal, proposed experience or operation, actors, timing, known facts, missing facts, and advice requested.
- Use at least two substantial paragraphs per question. Vary facts and risk patterns.
- Main legal responses must contain several developed sections and useful first-pass analysis.
- State material assumptions, missing facts, and unverified leads.
- Keep recommendations separate from recorded decisions.
- Use clearly marked fictional test records. Do not overwrite unrelated data.
- If a public reference company is requested, inspect only public pages in a separate in-app browser tab. Use the broad business model. Do not copy text or claim affiliation.

## Current UI, not a memorized script

Run 10 observed phases similar to Intake, Research, Explore, Generate, Respond, and Closed. This is historical context only.

Each attorney must discover the current phase labels and order from the visible UI. It must attempt every visible phase in order. If the UI does not expose an action, record the exact screen evidence and continue as far as possible. Never claim that a save, phase, send, decision, or closure succeeded without visible confirmation.

Use normal product behavior. Do not create artifacts only to fill a checklist. Create facts, issues, work items, research, drafts, recommendations, and decisions when the visible workflow makes them relevant.

## Actor evidence contract

Each attorney must report four distinct evidence groups:

1. **Working well:** Behavior that was clear, efficient, reliable, and useful. Include the task, visible evidence, and why it helped the lawyer.
2. **Product friction:** Recoverable layout, wording, navigation, state, feedback, editing, or workflow problems.
3. **Broken behavior:** A required function that failed, produced contradictory or incorrect state, lost work, or had no visible recovery. Do not use this label for preference or mild confusion.
4. **Non-product errors:** Browser-control mistakes and environment failures. Keep these separate.

For every friction or broken item, capture:

- iteration and phase;
- exact visible label or wording;
- reproduction steps;
- expected behavior;
- visible actual result;
- recovery path, if any;
- extra clicks or approximate delay;
- effect on the lawyer's work;
- supporting screenshot or visible-state description when available.

Actors can state the user outcome that should improve. They must not inspect source code or prescribe implementation changes during the live run.

## Post-experiment diagnosis

After all live runs end, use a fresh `gpt-5.6-sol` agent with high reasoning for synthesis and diagnosis unless the user specifies another model. Give it the normalized actor evidence, experiment configuration, completion data, and access to the repository. Do not give it unsupported conclusions.

The synthesis agent may inspect source code, tests, logs, and product documentation. This investigation is separate from the browser-only experiment and must not alter the recorded UX evidence.

When `graphify-out/graph.json` exists, begin each issue group with a focused `graphify query`. Inspect the relevant implementation before naming a cause or code location.

For each issue, label the cause as:

- **Confirmed:** Direct code or log evidence explains the observed behavior.
- **Likely:** Evidence supports the cause, but it was not fully reproduced or traced.
- **Unknown:** Evidence is not sufficient. State the next diagnostic check.

Do not invent causes, file locations, or fixes. Do not implement fixes during this skill run unless the user explicitly adds that scope.

## Required final classification

The coordinator must deliver these sections:

- **What is working well:** Proven strengths to preserve.
- **What is not working well:** Recoverable friction that adds confusion, delay, or rework.
- **What is broken:** Failed or contradictory behavior that blocks or corrupts normal work.
- **Detailed repair backlog:** One actionable item for every material friction or broken behavior.

Each repair item must include:

- stable ID and short title;
- classification and priority;
- affected users, phases, and frequency;
- exact evidence and reproduction steps;
- current versus expected behavior;
- user and workflow impact;
- recovery or workaround;
- confirmed, likely, or unknown cause with evidence;
- relevant code areas when verified;
- detailed implementation approach;
- risks and dependencies;
- tests to add or update;
- visible acceptance criteria;
- explicit note if more diagnosis is required.

Prioritize completion blockers and record-integrity failures first. Then prioritize repeated high-cost confusion, lost work, misleading state, and common recoverable friction.

## Stop conditions

Continue through all iterations unless:

- the application or in-app browser cannot be recovered;
- continuing could alter non-test data;
- the next action could contact a real person or service;
- the user must make a material choice.

Preserve partial evidence. Do not turn a blocked phase into false completion.

## Short invocation

```text
Use $live-agent-ux-experiment.
Business type: [business]
Requester role: [role]
Attorney role: [role]
Iterations: [number]
Question themes: [themes]
Public company reference: [optional]
```

Infer the rest from the defaults. Restate the setup once before actors begin.
