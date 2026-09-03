---
work_product_id: WP-bd6fc6628fa5
matter_id: MAT-20260902-475535
title: Mosaic Relay UX Test — 03 — ACH Payment Holds for Suspicious Merchant Activity
  response
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-02T14:52:25+00:00'
updated_at: '2026-09-02T14:52:25+00:00'
immutable: false
source_action_key: chat-save:MAT-20260902-475535:MSG-20260902-9ed388
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: 'The short answer: **the three open facts — custody, consumer scope, and
      jurisdiction — are the only things that would change my recommendation.** Here''s
      how each one would flip the analysis:

      ## 1. Funds custody (the biggest lever)

      - **If funds stay with the acquiring/ACH partner** (current assumption) → Path
      1 is clean, low money-transmission risk. My recommendation holds.

      - **If Mosaic Relay takes custody** → this is the single fact that most changes
      my view. It pushes you toward **Path 2**, which requires a full state-by-state
      money-transmission licensing analysis before launch. That''s a materially different,
      much heavier path — and it would change the recommendation from "low-risk default"
      to "high-burden, needs licensing workstream first."

      ## 2. Consumer vs. B2B scope

      - **If B2B-only** (current open question) → Reg E / unauthorized-debit exposure
      drops away, and Path 3 simplifies the design. My recommendation holds and gets
      cleaner.

      - **If consumer-originated payments are in scope** → Reg E applies. That adds
      required safeguards (notice, error-resolution, timely credit for unauthorized
      debits) and would make me add a consumer-protection workstream and likely tighten
      the hold mechanics. It wouldn''t necessarily change the overall path, but it
      would change the design requirements.

      ## 3. Jurisdiction

      - **If US/NACHA** (current assumption) → current analysis holds.

      - **If any non-US jurisdiction** → the ACH rules, money-transmission laws, and
      notice requirements all change. That would require re-scoping the research and
      could change which path is viable.

      ## What would *not* change my view

      - **Hold duration** (24h + risk-manager extensions) — already factored in; it''s
      within a reasonable range and doesn''t flip the path.

      - **Launch timing** — affects urgency, not direction.

      - **The generic merchant explanation** — a design detail to refine, not a path-changer
      (though it does feed the UDAAP workstream).

      ## Bottom line

      The recommendation is currently built on three assumptions. **Custody is the
      one that matters most** — if Mosaic Relay takes custody of held funds, my recommendation
      flips from "low-risk default" to "licensing-heavy path first." The other two
      (consumer scope, jurisdiction) would refine or re-scope the work rather than
      reverse it.

      Want me to draft the recommendation memo now under the current assumptions,
      or hold until custody is confirmed?

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  comments: []
  version: 2
  tracking: false
  authors: []
  comment_events: []
---
The short answer: **the three open facts — custody, consumer scope, and jurisdiction — are the only things that would change my recommendation.** Here's how each one would flip the analysis:
## 1. Funds custody (the biggest lever)
- **If funds stay with the acquiring/ACH partner** (current assumption) → Path 1 is clean, low money-transmission risk. My recommendation holds.
- **If Mosaic Relay takes custody** → this is the single fact that most changes my view. It pushes you toward **Path 2**, which requires a full state-by-state money-transmission licensing analysis before launch. That's a materially different, much heavier path — and it would change the recommendation from "low-risk default" to "high-burden, needs licensing workstream first."
## 2. Consumer vs. B2B scope
- **If B2B-only** (current open question) → Reg E / unauthorized-debit exposure drops away, and Path 3 simplifies the design. My recommendation holds and gets cleaner.
- **If consumer-originated payments are in scope** → Reg E applies. That adds required safeguards (notice, error-resolution, timely credit for unauthorized debits) and would make me add a consumer-protection workstream and likely tighten the hold mechanics. It wouldn't necessarily change the overall path, but it would change the design requirements.
## 3. Jurisdiction
- **If US/NACHA** (current assumption) → current analysis holds.
- **If any non-US jurisdiction** → the ACH rules, money-transmission laws, and notice requirements all change. That would require re-scoping the research and could change which path is viable.
## What would *not* change my view
- **Hold duration** (24h + risk-manager extensions) — already factored in; it's within a reasonable range and doesn't flip the path.
- **Launch timing** — affects urgency, not direction.
- **The generic merchant explanation** — a design detail to refine, not a path-changer (though it does feed the UDAAP workstream).
## Bottom line
The recommendation is currently built on three assumptions. **Custody is the one that matters most** — if Mosaic Relay takes custody of held funds, my recommendation flips from "low-risk default" to "licensing-heavy path first." The other two (consumer scope, jurisdiction) would refine or re-scope the work rather than reverse it.
Want me to draft the recommendation memo now under the current assumptions, or hold until custody is confirmed?
