@AGENTS.md

## UI design language (imported from Claude Design)

The interface follows the `Themis.ai` design canvas
(`claude.ai/design/p/df618af1-323e-4c96-ab86-0feb13fb166e`). Read
`docs/DESIGN_LANGUAGE.md` before touching anything under `frontend/`.

The short version:

- Warm paper, not a dark IDE. Surfaces are `#f7f5f1` / `#fffefb` / `#efece5`.
- Source Serif 4 for reading (matter titles, drafts, memos), IBM Plex Sans for
  every control and label, IBM Plex Mono for record metadata only.
- Colour carries meaning, never decoration, and always has a word beside it:
  ochre `#E0A008` needs you · evergreen `#146B54` healthy · vermilion `#B33A20`
  failed or overdue · iris `#5F5AC0` agent-generated · ink `#1b1a17` human record.
- Vermilion is reserved for failure and overdue. It is never "high risk".
- Agent output is dashed and iris. Recorded decisions are solid, serif, dated and
  attributed. There is no visual path from one to the other except recording.
- Screens name what needs the lawyer, why, and the one thing to do — a ranked
  list, not a dashboard of tiles.

Design tokens live in `frontend/app/globals.css`; the shared vocabulary
(stage names, signal derivation) lives in `frontend/lib/design.ts`.

## Frontend conventions

- Tokens and reusable classes go in `globals.css`. Avoid inline styles except for
  values genuinely computed at runtime (a signal colour, a drag opacity).
- Screens are thin: fetch in the route, derive with a pure helper in `lib/`,
  render with a component in `components/`.
- Anything the backend cannot yet answer is a marked stub — a `STUB` comment in
  `lib/api.ts` and local state only. Never fake it silently in the UI.
