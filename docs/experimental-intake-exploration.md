# Experimental intake and exploration

The experimental chat collects useful independent questions in one optional form. Choices are local selections. One submission sends the answered questions as an `answer_set`; blank questions are explicit skips. The backend records each answer against its original question. Typed alternatives remain attributed to their question. Skips create no fact and imply no opposite answer.

Priority groups describe whether an answer could change the law, research direction, or main conclusion; refine advice; or add helpful detail. There is no target question count or numeric scoring. The experimental tool schema removes the previous five-question ceiling. The shared tool schema and existing pages retain their current behavior.

“Explore with these answers” ends optional intake and routes the same run to counsel-copilot for an initial issue map. It does not start another automatic research run. Research may still be used within the requested analysis. The map names likely relevant laws and issues, identifies unknowns that could change them, and uses available authority without inventing support. A separate “Assumptions used” section lists material assumptions and what depends on them. These are editable skill instructions, not a mandatory answer-validation gate. Model quality and authority retrieval still depend on the selected provider.

The normal chat composer stays accessible during the form and analysis. Questions do not gate free-text conversation. Existing disabled-send behavior during a run remains; this adds no concurrent-run support. Local form answers are stored per user, vault, matter, conversation, and assistant message for reload recovery.

## Deferred design decisions

The user explicitly deferred assumption controls pending a visual design discussion. Later controls may allow confirm, edit, remove, and add. Acceptance for exploration must remain distinct from confirmation as a fact. Removal means unknown, not the opposite. Changes should identify affected research, issues, and conclusions. Do not implement these controls without the requested design review.

The initial issue map is visible prose. Clickable map items also await a design discussion. The lawyer can choose an issue or challenge an answer through the existing chat.

## Verification

A deterministic provider and disposable test vault verify the workflow without modifying real matters or calling an external model. Tests cover a set larger than five, grouped submission, question attribution, typed alternatives, skipped answers, separate assumptions, and continuation into analysis. Browser evidence lives under `output/experimental-chat/`.

Verified: 147 focused backend tests passed; the final routing adjustment was rechecked with 67 passing experimental/chat-run tests. The frontend production build passed. The browser fixture verified eight questions, zero requests on selection, restored local answers after reload, a free chat submission without completing intake, one grouped run, per-question attribution, six skips without facts, visible map/assumptions, and composer access with no horizontal overflow at desktop and mobile widths. External provider answer quality was not evaluated by this deterministic test.

The experimental page uses the current conversation's intake state, not the original workspace intake state. A browser assertion checks that Continue intake disappears after the grouped exploration submission completes.
