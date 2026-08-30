---
matter_id: MAT-20260830-d76eef
record_type: draft_decision
status: approved_with_conditions_draft
prepared_for: Alex Morgan
privilege: privileged_and_confidential
---
# Decision — Autopay pilot scope and authorization controls

**Status:** Draft decision — Approved with conditions. Not recorded. Awaiting explicit instruction to record.
**Fictional test decision:** This is a fictional test decision for the Northstar Pay simulation. All legal propositions are unverified leads pending jurisdiction, product, and partner confirmation.
**Prepared for:** Alex Morgan, product counsel
**Related work products:** "Autopay Enrollment and Payment Authorization — Launch Advice" (main memo); working recommendation in recommendations.md. This draft decision is separate from the working recommendation.

## Outcome

**Approved with conditions.**

## Proposed decision

1. **Gated ACH-first pilot.** Approve a gated ACH-first autopay pilot using Path B (variable-amount authorization with a precise disclosed method) **only after** all of the following are confirmed:
   - Exact variable-amount formula
   - Authorization copy
   - E-SIGN consent evidence capture
   - Pre-withdrawal reminder timing and delivery records
   - Retry limits
   - Dispute-pause workflow
   - Cancellation cutoff
   - Incentive terms
   - Partner/state map
2. **Path A fallback.** Use Path A (fixed-amount authorization plus advance notice of any change) for any unconfirmed rail, state, product, or servicer — including all debit-card autopay.
3. **Backup methods.** Require separate, specific authorization before any backup payment method is charged; otherwise disable automatic backup-method charges entirely.
4. **Dispute pause.** Pause disputed or unclear withdrawals, and pause all retries while a dispute or amount question is open.
5. **Cancellation.** Require self-service cancellation effective before the next scheduled withdrawal, with confirmation to the customer.
6. **Timing.** The internal six-week target is a planning target, not an approval deadline; launch is governed by the gates above.

## Rationale

- Path B reduces enrollment friction and missed payments, but only where the variable-amount method is precisely disclosed and reminders reliably show the current amount before each withdrawal.
- Path A is the conservative fallback where those controls are not confirmed, preserving a clean authorization-to-amount audit trail.
- Automatic backup-method charges without separate specific authorization create unauthorized-transfer risk on both ACH and debit rails.
- Pausing disputed or unclear withdrawals prevents compounding harm and preserves dispute-handling compliance.
- Self-service cancellation before the next withdrawal is required on either path and reinforces customer control.

## Conditions (launch gates)

Each gate must be confirmed and documented before Path B goes live for the applicable state/product/servicer/rail:

1. Exact variable-amount formula documented and disclosed in the authorization.
2. Final authorization copy approved by Legal.
3. E-SIGN consent capture with retained evidence (copy shown, timestamp, consent record).
4. Reminder timing and delivery records confirmed with the servicer.
5. Retry limits defined (count, intervals, fees) and disclosed.
6. Dispute-pause workflow operational (trigger, owner, customer notice).
7. Cancellation cutoff defined and self-service flow tested.
8. Incentive terms approved (amount, conditions, disclosure, UDAAP review).
9. Partner/state map confirmed (lending partner, servicer, processor per state/product).
10. Evidence retention schedule for authorizations, notices, consents, and cancellations.

## Owners and follow-up

- **Joint owners before the internal six-week target:** Product, Servicing, and Legal.
- **Decision owner:** Alex Morgan (product counsel).
- **Legal owner (matter):** Brian Harris — gate confirmation and legal review.
- **Follow-up items:**
  - Confirm partner/state map (lending partner, servicer, processor by state and product).
  - Confirm servicer reminder-delivery capability and records.
  - Draft and approve final Path B authorization copy, including the variable-amount formula.
  - Define retry limits and backup-method authorization flow.
  - Test self-service cancellation cutoff and confirmation.

## Status labels

- **Fictional test decision** — part of the Northstar Pay fictional simulation.
- **Unverified legal leads** — all legal propositions remain unverified pending jurisdiction, product, and partner confirmation.
- **Not recorded** — this is a draft for review; no durable decision has been recorded. Recording requires an explicit instruction from Alex Morgan.
