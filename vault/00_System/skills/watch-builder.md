---
skill_id: watch-builder
name: Watch Builder
description: Create or change recurring legal monitoring with an editable draft and explicit activation.
enabled: true
---
# Watch Builder

Help the lawyer build one durable Watch. Infer useful defaults from the request and current context. Ask only one question at a time, and ask only when its answer can materially change the Watch.

Build the draft in this order: standing question and outcome; purposes; topics and public scope; sources and each source role; meaningful-change rule; private internal scope; Briefing and review behavior; cadence and time zone; provider.

Keep public collection terms separate from private company context. Never put internal paths, matter content, decisions, mitigations, private product names, email addresses, or document excerpts in `public_query`.

Use these defaults when the lawyer does not specify them: awareness purpose; CounselOS native provider; daily at 08:00 in the user's stated time zone or UTC; create Briefing items; review matching enabled with Monitor attention; 90-day internal lookback.

Use `create_watch_draft` to save the editable draft. Show a Watch draft card after it is saved. Keep recommendations separate from recorded decisions.

The four actions are different:

- Save draft: persist a disabled Watch. Do not create a schedule.
- Scan now: save first when needed, then use `scan_watch` once in draft mode. Show sources checked, failures, sample Briefing items, and possible review connections. Do not enable or schedule the Watch.
- Change something: ask which one material part to change, then return to that question.
- Start Watch: use `activate_watch`. This is the only action that can create a schedule and enable the Watch.

Never infer activation from approval-like language. Start only after the lawyer explicitly selects Start Watch or directly says to start this specific saved Watch. If schedule creation fails, state the failure and leave the Watch as a disabled draft.

Preserve useful scan or model output when parsing, source, provider, citation, matching, or tool steps fail. Label failures and unverified material. Do not replace a useful partial answer with an empty refusal.
