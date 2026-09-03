---
work_product_id: WP-7ce507f594ed
matter_id: MAT-20260902-475535
title: Mosaic Relay UX Test — 03 — ACH Payment Holds for Suspicious Merchant Activity
  response
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-02T14:50:52+00:00'
updated_at: '2026-09-02T14:50:52+00:00'
immutable: false
source_action_key: chat-save:MAT-20260902-475535:MSG-20260902-45adc5
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: 'The research memo lays out four viable paths. Here''s the comparison:

      ## The four paths at a glance

      | | **Path 1 — Partner-mediated holds** | **Path 2 — Mosaic Relay custody**
      | **Path 3 — B2B-only scope** | **Path 4 — Pilot + monitoring** |

      |---|---|---|---|---|

      | **Core idea** | Funds stay with the acquiring/ACH partner; Mosaic Relay only
      instructs the partner to delay release | Mosaic Relay takes custody of held
      funds | Limit the control to B2B transactions (no consumer-originated payments)
      | Launch on a small merchant subset with enhanced monitoring |

      | **Money-transmission risk** | **Low** — no custody, stays out of the flow
      of funds | **High** — likely triggers state licensing in most states | Unchanged
      (orthogonal to custody) | Low (inherits Path 1 structure) |

      | **Reg E / unauthorized-debit risk** | Moderate (depends on consumer scope)
      | Moderate | **Low** — Reg E doesn''t apply to B2B | Moderate (depends on scope)
      |

      | **Effort / cost** | Low–moderate | **High** — state-by-state licensing analysis
      | Low | Moderate (ops staffing, monitoring) |

      | **Best when** | You want the lowest-risk default | The business model *requires*
      custody | Consumer payments are out of scope | You want to validate before full
      rollout |

      ## How they combine

      These aren''t mutually exclusive — the memo''s actual recommendation is **Path
      1 + Path 4** as the lowest-risk combination:

      - **Path 1** is the structural choice (partner-mediated holds) that keeps Mosaic
      Relay out of the money-transmission perimeter.

      - **Path 4** is the rollout choice (pilot with daily monitoring of hold durations,
      release times, and complaints) that de-risks the launch.

      - **Path 3** is a scope lever you can pull *on top of* either — if consumer
      payments are out of scope, Reg E drops away entirely.

      - **Path 2** is the one to avoid unless custody is unavoidable; it''s the only
      path that demands a full state-by-state licensing analysis before launch.

      ## The decision hinges on three open facts

      The memo flags these as the facts that would change the answer:

      1. **Funds custody** — if Mosaic Relay takes custody, you''re pushed toward
      Path 2 (high licensing burden). If funds stay with the partner, Path 1 is clean.

      2. **Consumer vs. B2B scope** — if consumer-originated, Reg E applies and you
      need safeguards; if B2B-only, Path 3 simplifies everything.

      3. **Jurisdiction** — determines which state money-transmission laws and ACH
      rules apply.

      **Bottom line:** The lowest-risk path is **partner-mediated holds (Path 1) rolled
      out as a pilot (Path 4)**, with a B2B-only scope (Path 3) if consumer payments
      aren''t in scope. Path 2 should be avoided unless custody is a hard business
      requirement.

      Want me to draft the recommendation memo around the Path 1 + Path 4 combination,
      or hold until the custody and consumer-scope questions are answered?

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
The research memo lays out four viable paths. Here's the comparison:
## The four paths at a glance
| | **Path 1 — Partner-mediated holds** | **Path 2 — Mosaic Relay custody** | **Path 3 — B2B-only scope** | **Path 4 — Pilot + monitoring** |
|---|---|---|---|---|
| **Core idea** | Funds stay with the acquiring/ACH partner; Mosaic Relay only instructs the partner to delay release | Mosaic Relay takes custody of held funds | Limit the control to B2B transactions (no consumer-originated payments) | Launch on a small merchant subset with enhanced monitoring |
| **Money-transmission risk** | **Low** — no custody, stays out of the flow of funds | **High** — likely triggers state licensing in most states | Unchanged (orthogonal to custody) | Low (inherits Path 1 structure) |
| **Reg E / unauthorized-debit risk** | Moderate (depends on consumer scope) | Moderate | **Low** — Reg E doesn't apply to B2B | Moderate (depends on scope) |
| **Effort / cost** | Low–moderate | **High** — state-by-state licensing analysis | Low | Moderate (ops staffing, monitoring) |
| **Best when** | You want the lowest-risk default | The business model *requires* custody | Consumer payments are out of scope | You want to validate before full rollout |
## How they combine
These aren't mutually exclusive — the memo's actual recommendation is **Path 1 + Path 4** as the lowest-risk combination:
- **Path 1** is the structural choice (partner-mediated holds) that keeps Mosaic Relay out of the money-transmission perimeter.
- **Path 4** is the rollout choice (pilot with daily monitoring of hold durations, release times, and complaints) that de-risks the launch.
- **Path 3** is a scope lever you can pull *on top of* either — if consumer payments are out of scope, Reg E drops away entirely.
- **Path 2** is the one to avoid unless custody is unavoidable; it's the only path that demands a full state-by-state licensing analysis before launch.
## The decision hinges on three open facts
The memo flags these as the facts that would change the answer:
1. **Funds custody** — if Mosaic Relay takes custody, you're pushed toward Path 2 (high licensing burden). If funds stay with the partner, Path 1 is clean.
2. **Consumer vs. B2B scope** — if consumer-originated, Reg E applies and you need safeguards; if B2B-only, Path 3 simplifies everything.
3. **Jurisdiction** — determines which state money-transmission laws and ACH rules apply.
**Bottom line:** The lowest-risk path is **partner-mediated holds (Path 1) rolled out as a pilot (Path 4)**, with a B2B-only scope (Path 3) if consumer payments aren't in scope. Path 2 should be avoided unless custody is a hard business requirement.
Want me to draft the recommendation memo around the Path 1 + Path 4 combination, or hold until the custody and consumer-scope questions are answered?
