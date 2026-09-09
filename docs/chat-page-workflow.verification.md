# Shared chat and page workflow

## Contract

The matter's Markdown records remain authoritative. Chat and the map render the
same question projection and use the same answer component and save endpoint.
Questions have numbers within their issue's saved analysis. No text matching or
model inference is used to merge questions across different analyses.

Both surfaces offer saved draft answers, an uncertainty answer, and a write-in.
For older analyses without structured answer choices, the saved assessment basis
is offered as an editable starting draft. New analysis can provide specific
alternatives. Suggestions are not recorded facts. A selected question follows
the inquiry into chat, whose next run receives current questions and answers.

Save answer records a reported fact. It does not confirm a legal condition or
record a decision. It makes existing analysis need review. The update-analysis
action is explicit; in chat it prepares a request for Send. Edited answers
supersede the earlier reported fact while keeping answer history. Draft documents
and old chat messages are not rewritten.

Successful UI mutations and completed chat runs notify the other views in the
same vault. Cross-tab refresh uses browser notifications; focus refresh remains
available if those notifications are unavailable. This is not a server push or
multi-user collaboration system. Unsaved question drafts stay scoped to the
vault, lawyer, matter, issue, and question in the browser session.

## Paired workflow checks

| Start | Continue | Verification |
| --- | --- | --- |
| Map: save answer | Chat: inspect current answer and suggestions | Backend context test and two-tab browser check |
| Chat: save revised answer | Map: inspect latest saved answer | Two-tab browser check and backend projection test |
| Chat: edit unsaved answer | Map: save another answer | Browser checks retained draft and disabled save until review |
| Chat: unsent composer text | Map: save answer | Browser checks text remains unchanged |
| Chat: draft answer | Navigate to map | Browser checks the same draft remains available |
| Map: selected question | Chat inquiry | Shared condition target, validated against the matter's current issue |
| Chat: request decision or follow-up | Existing issue/work controls | Direct links preserve issue and conversation; existing confirmation controls remain authoritative |

## Evidence and limits

2026-09-07: full backend suite passed 1,239 tests. Frontend typecheck, production
build, issue review, decision-path layout, chat recovery, and matter integration
checks passed. The browser test is `frontend/scripts/check-shared-questions.mjs`.
It runs only with explicit isolated-test settings against
`backend/tests/serve_issue_choice_demo.py`. Captures are under
`output/shared-questions/`.

The browser used headless Chrome because the Mac was locked. It used a temporary
test vault, not the user's active matter. No live model quality assessment was
performed. This verifies shared state and context, not equivalence of every
possible natural-language wording. No new chat-only decision or lifecycle store
was introduced.
