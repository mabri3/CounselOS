---
matter_id: MAT-20260830-43cada
type: disclosure_checklist
status: draft
review:
  segments:
  - kind: equal
    text: '# Pay-in-4 Checkout Redesign — Disclosure Checklist


      **Status:** First-pass draft for counsel review. Not court-ready; CFPB rule
      status and state-specific details are unverified leads requiring confirmation
      before launch.


      ## Assumptions and missing facts


      **Assumptions (stated, not confirmed):**

      - Pay-in-4 is consumer-purpose credit; late fees are finance charges, making
      the product "credit" under TILA/Reg Z even with no interest.

      - The bank-partner model may or may not make Northstar Pay the creditor for
      disclosure purposes depending on state configuration.

      - Checkout runs on merchant web, mobile web, and the Northstar Pay app; substantive
      disclosure content must be equivalent across channels.


      **Missing facts that could change the advice:**

      1. Creditor identity by state and product configuration (partner matrix not
      finalized).

      2. Fee schedule and state fee caps for late fees and other charges.

      3. Whether the app channel already has E-SIGN consent on file from account creation
      (merchant web customers may be new).

      4. Current status of the CFPB BNPL interpretive rule (litigation, amendment,
      rescission).

      5. Whether any live state imposes BNPL-specific disclosure timing/format beyond
      Reg Z (California SB 975 is the likely strictest overlay).


      ---


      ## 1. Regulation Z applicability


      - [ ] Confirm whether pay-in-4 is structured as closed-end credit or falls under
      the CFPB interpretive rule treating BNPL providers as credit card providers
      (periodic statements, dispute rights, ability-to-repay considerations).

      - [ ] Identify the creditor entity for disclosure purposes in each live state
      (Northstar Pay vs. bank partner).

      - [ ] Confirm whether late fees count as finance charges in each configuration
      (they generally do unless properly structured).


      ## 2. Federal disclosure timing and content


      **Before approval (eligibility/identity checks):**

      - [ ] No affirmative pre-approval disclosure federally required, but confirm
      state rules.

      - [ ] Reg B adverse action notice process if eligibility check declines the
      customer (within 30 days).


      **Before acceptance/obligation (the critical gate):**

      - [ ] Full payment schedule: four payment amounts and dates.

      - [ ] Amount due today.

      - [ ] All fees: late fee amount, trigger conditions, any rescheduling fees.

      - [ ] Total of payments / total cost of the purchase.

      - [ ] Identity of the creditor.

      - [ ] Disclosures must be clear and conspicuous, provided before the consumer
      becomes obligated.


      ## 3. Agreement delivery and E-SIGN consent


      - [ ] Add an explicit E-SIGN consent step before electronic delivery of the
      loan agreement — a bare link is not consent.

      - [ ] Consent language must include: what is delivered electronically, how to
      withdraw consent, hardware/software requirements, and right to a paper copy.

      - [ ] Reasonable notice of rights and confirmation of ability to access the
      electronic record.

      - [ ] Retain consent records and delivered agreements.

      - [ ] Confirm whether app-channel customers already have E-SIGN consent on file;
      merchant web/mobile web flows likely need a new consent step.


      ## 4. Payment timing and fee presentation


      - [ ] Show the four scheduled payments with specific dates (not "every two weeks"
      alone).

      - [ ] Show amount due today distinctly from the remaining three payments.

      - [ ] Late fee disclosure must state the amount and the trigger conditions,
      prominently — not just "any applicable fees."

      - [ ] Total of payments displayed alongside the purchase amount.


      ## 5. State-law variation (CA, CO, GA, IL, NY, TX, WA)


      - [ ] California SB 975: BNPL-specific disclosures including late fee terms,
      reinstatement rights, and prohibited practices; format may exceed Reg Z.

      - [ ] New York: general consumer protection and licensing-driven requirements;
      no BNPL-specific statute confirmed in this pass.

      - [ ] IL, CO, GA, TX, WA: general consumer credit/UDAP rules; fee caps and licensing
      vary.

      - [ ] Confirm state-by-state partner matrix (creditor identity, servicing vendor,
      contract terms) before finalizing disclosure ownership.

      - [ ] Verify late fee amounts against state fee caps; presentation must vary
      if any state caps fees below the product default.


      ---


      ## 6. Concrete UX changes by channel


      **Merchant website:**

      - Add explicit E-SIGN consent step before the loan agreement link becomes active.

      - Display total of payments and late fee trigger conditions on the main checkout
      screen, not behind a tooltip.

      - Ensure disclosures appear before the "accept" button, not after.


      **Mobile web:**

      - Same substantive content as desktop; verify disclosure prominence on small
      screens (no collapsed/hidden fee terms).

      - Confirm the payment schedule is visible without scrolling past the accept
      action.


      **Northstar Pay app:**

      - Check whether existing E-SIGN consent from account creation covers loan agreement
      delivery; if not, add the consent step.

      - Ensure in-app disclosures match the web flow in content, even if presentation
      adapts.


      **All channels:**

      - Build one core disclosure set to the strictest common denominator (likely
      California), with state-specific overlays for fee and partner differences —
      recommended path for the next-quarter timeline.


      ---


      ## Recommended next work items


      1. Confirm the CFPB BNPL interpretive rule''s current status and required disclosure
      set.

      2. Obtain the state-by-state partner matrix (creditor identity per state) from
      the lending partner team.

      3. Obtain the fee schedule by state and confirm against state fee caps.

      4. Review E-SIGN consent language against 15 U.S.C. § 7001(c) and UETA state
      variations.

      5. Verify California SB 975 disclosure text and timing against the proposed
      UX.

      6. Draft the state-overlay disclosure matrix for Product to implement.

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
# Pay-in-4 Checkout Redesign — Disclosure Checklist

**Status:** First-pass draft for counsel review. Not court-ready; CFPB rule status and state-specific details are unverified leads requiring confirmation before launch.

## Assumptions and missing facts

**Assumptions (stated, not confirmed):**
- Pay-in-4 is consumer-purpose credit; late fees are finance charges, making the product "credit" under TILA/Reg Z even with no interest.
- The bank-partner model may or may not make Northstar Pay the creditor for disclosure purposes depending on state configuration.
- Checkout runs on merchant web, mobile web, and the Northstar Pay app; substantive disclosure content must be equivalent across channels.

**Missing facts that could change the advice:**
1. Creditor identity by state and product configuration (partner matrix not finalized).
2. Fee schedule and state fee caps for late fees and other charges.
3. Whether the app channel already has E-SIGN consent on file from account creation (merchant web customers may be new).
4. Current status of the CFPB BNPL interpretive rule (litigation, amendment, rescission).
5. Whether any live state imposes BNPL-specific disclosure timing/format beyond Reg Z (California SB 975 is the likely strictest overlay).

---

## 1. Regulation Z applicability

- [ ] Confirm whether pay-in-4 is structured as closed-end credit or falls under the CFPB interpretive rule treating BNPL providers as credit card providers (periodic statements, dispute rights, ability-to-repay considerations).
- [ ] Identify the creditor entity for disclosure purposes in each live state (Northstar Pay vs. bank partner).
- [ ] Confirm whether late fees count as finance charges in each configuration (they generally do unless properly structured).

## 2. Federal disclosure timing and content

**Before approval (eligibility/identity checks):**
- [ ] No affirmative pre-approval disclosure federally required, but confirm state rules.
- [ ] Reg B adverse action notice process if eligibility check declines the customer (within 30 days).

**Before acceptance/obligation (the critical gate):**
- [ ] Full payment schedule: four payment amounts and dates.
- [ ] Amount due today.
- [ ] All fees: late fee amount, trigger conditions, any rescheduling fees.
- [ ] Total of payments / total cost of the purchase.
- [ ] Identity of the creditor.
- [ ] Disclosures must be clear and conspicuous, provided before the consumer becomes obligated.

## 3. Agreement delivery and E-SIGN consent

- [ ] Add an explicit E-SIGN consent step before electronic delivery of the loan agreement — a bare link is not consent.
- [ ] Consent language must include: what is delivered electronically, how to withdraw consent, hardware/software requirements, and right to a paper copy.
- [ ] Reasonable notice of rights and confirmation of ability to access the electronic record.
- [ ] Retain consent records and delivered agreements.
- [ ] Confirm whether app-channel customers already have E-SIGN consent on file; merchant web/mobile web flows likely need a new consent step.

## 4. Payment timing and fee presentation

- [ ] Show the four scheduled payments with specific dates (not "every two weeks" alone).
- [ ] Show amount due today distinctly from the remaining three payments.
- [ ] Late fee disclosure must state the amount and the trigger conditions, prominently — not just "any applicable fees."
- [ ] Total of payments displayed alongside the purchase amount.

## 5. State-law variation (CA, CO, GA, IL, NY, TX, WA)

- [ ] California SB 975: BNPL-specific disclosures including late fee terms, reinstatement rights, and prohibited practices; format may exceed Reg Z.
- [ ] New York: general consumer protection and licensing-driven requirements; no BNPL-specific statute confirmed in this pass.
- [ ] IL, CO, GA, TX, WA: general consumer credit/UDAP rules; fee caps and licensing vary.
- [ ] Confirm state-by-state partner matrix (creditor identity, servicing vendor, contract terms) before finalizing disclosure ownership.
- [ ] Verify late fee amounts against state fee caps; presentation must vary if any state caps fees below the product default.

---

## 6. Concrete UX changes by channel

**Merchant website:**
- Add explicit E-SIGN consent step before the loan agreement link becomes active.
- Display total of payments and late fee trigger conditions on the main checkout screen, not behind a tooltip.
- Ensure disclosures appear before the "accept" button, not after.

**Mobile web:**
- Same substantive content as desktop; verify disclosure prominence on small screens (no collapsed/hidden fee terms).
- Confirm the payment schedule is visible without scrolling past the accept action.

**Northstar Pay app:**
- Check whether existing E-SIGN consent from account creation covers loan agreement delivery; if not, add the consent step.
- Ensure in-app disclosures match the web flow in content, even if presentation adapts.

**All channels:**
- Build one core disclosure set to the strictest common denominator (likely California), with state-specific overlays for fee and partner differences — recommended path for the next-quarter timeline.

---

## Recommended next work items

1. Confirm the CFPB BNPL interpretive rule's current status and required disclosure set.
2. Obtain the state-by-state partner matrix (creditor identity per state) from the lending partner team.
3. Obtain the fee schedule by state and confirm against state fee caps.
4. Review E-SIGN consent language against 15 U.S.C. § 7001(c) and UETA state variations.
5. Verify California SB 975 disclosure text and timing against the proposed UX.
6. Draft the state-overlay disclosure matrix for Product to implement.
