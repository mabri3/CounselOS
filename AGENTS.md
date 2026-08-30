# Counsel OS coding-agent instructions

Read `docs/PRD.md` and `CODEX_HANDOFF.md` before changing the application.

## Product north star

Reduce the product lawyer's cognitive load. Every screen and agent action should help the lawyer understand the matter, see what work remains, and reach the decision they are uniquely positioned to make.

The system is the subway, not the last mile. It must reliably carry the lawyer from raw request to an organized, researched, editable foothold. It is not required to produce legally perfect answers.

## Do not add legal-answer theater

Do not add mandatory verifier agents, legal perfection gates, generic disclaimers, confidence thresholds, multi-agent votes, or refusal behavior just because the work is legal. Produce the strongest useful first pass, state material assumptions briefly, and continue toward work product.

Keep recommendations separate from explicitly recorded decisions. That is record integrity, not a legal-answer guardrail.

## Deliver the best available answer

- A missing or unconfirmed citation may reduce support for an answer. It must not prevent the answer from being delivered.
- Never invent a source or imply that an unverified source was verified. Label supplied sources, verified sources, unverified leads, assumptions, and generated analysis clearly.
- Preserve and show useful model output when citation formatting, schema parsing, tool-call decoding, search, fetch, memory, or trace handling fails. Record the failure and continue to a best-effort answer when non-empty output is available.
- Degrade gracefully toward an answer. A failed research or tool step may reduce context, but it must not turn into a refusal or an empty result when a useful answer can still be produced.
- Step, cost, and timeout limits are execution controls. When a limit is reached, make a final answer-only attempt using the information already collected.
- Clarification is optional assistance, not a completeness gate. Ask one question only when its answer could materially change the issue map, analysis, or recommendation. Otherwise state the assumption and continue.
- Prefer a prompt, focused context change, or direct tool improvement before adding a service, pipeline stage, verifier, or new agent. New machinery must earn its place through observable lawyer usefulness.

## Engineering rules

- Keep the MVP runnable at the end of every change.
- Preserve Markdown as the source of truth and SQLite as a disposable index.
- Keep providers, agents, tools, workflows, and schedules modular.
- Markdown tool files are declarative; never execute embedded Markdown code.
- Keep all file operations inside `VAULT_PATH`.
- Prefer focused files and boring, testable code.
- Do not introduce auth, cloud tenancy, a queue, embeddings, Tauri, native Word redlining, or a plugin marketplace before the core acceptance tests pass.

## Design language

- Treat `docs/DESIGN_LANGUAGE.md` as the source of truth for visual and interaction rules.
- Reuse semantic roles from `frontend/lib/design.ts` and matching variables in `frontend/app/globals.css`. Do not add page-local attention colors.
- Color must show meaning: rose is overdue or failed, amber needs the lawyer's attention, purple is agent work, and green is healthy or complete.
- Put a clear state word beside each color. Never make color the only signal.
- Use light washes on rows and title cells to guide attention. Reserve stronger tints for small controls, badges, and selected states.

## Verification

```bash
cd backend && pytest
cd frontend && npm run typecheck && npm run build
```

Then walk `docs/ACCEPTANCE_TESTS.md` in the browser.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After building or modifying application code, run `graphify update .` to keep the graph current (AST-only, no API cost).
