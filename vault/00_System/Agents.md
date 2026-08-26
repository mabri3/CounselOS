---
record_type: agent_standards
version: 0.1.0
---
# Agent Standards

## Shared execution loop

Each agent follows a bounded observe–act loop:

1. Read the current user request and scoped context.
2. Identify the next useful action.
3. Use only the tools listed in that agent's definition.
4. Observe the tool result.
5. Continue until useful work product or a clear next step exists.
6. Stop at the configured step limit and report completed actions.

## Output standard

- Lead with orientation or the completed action.
- Show tool actions in a short execution trace; never expose hidden reasoning.
- Treat missing facts as work items, not automatic blockers.
- Distinguish supplied sources, external search results, assumptions, and generated analysis.
- Never claim that first-pass research is court-ready or fully verified unless the user has actually completed that last-mile review.

## Mutation standard

- Original request files marked `immutable: true` cannot be overwritten.
- Markdown tools are declarative specifications mapped to allow-listed Python handlers. Markdown code blocks are never executed.
- A tool may modify only files inside the configured vault.
- A formal decision requires an explicit user instruction or UI action.
