# Counsel OS coding-agent instructions

Read `docs/PRD.md` and `CODEX_HANDOFF.md` before changing the application.

## Product north star

Reduce the product lawyer's cognitive load. Every screen and agent action should help the lawyer understand the matter, see what work remains, and reach the decision they are uniquely positioned to make.

The system is the subway, not the last mile. It must reliably carry the lawyer from raw request to an organized, researched, editable foothold. It is not required to produce legally perfect answers.

## Do not add legal-answer theater

Do not add mandatory verifier agents, legal perfection gates, generic disclaimers, confidence thresholds, multi-agent votes, or refusal behavior just because the work is legal. Produce the strongest useful first pass, state material assumptions briefly, and continue toward work product.

Keep recommendations separate from explicitly recorded decisions. That is record integrity, not a legal-answer guardrail.

## Engineering rules

- Keep the MVP runnable at the end of every change.
- Preserve Markdown as the source of truth and SQLite as a disposable index.
- Keep providers, agents, tools, workflows, and schedules modular.
- Markdown tool files are declarative; never execute embedded Markdown code.
- Keep all file operations inside `VAULT_PATH`.
- Prefer focused files and boring, testable code.
- Do not introduce auth, cloud tenancy, a queue, embeddings, Tauri, native Word redlining, or a plugin marketplace before the core acceptance tests pass.

## Verification

```bash
cd backend && pytest
cd frontend && npm run typecheck && npm run build
```

Then walk `docs/ACCEPTANCE_TESTS.md` in the browser.
