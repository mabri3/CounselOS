---
{}
---
# Research Memo — "Bank-Level Security" and "Institution-Grade Protection" Marketing Claims

Matter: Mosaic Relay UX Test — 07 — Bank-Level Security Marketing Claim
Date: 2026-09-03
Status: First-pass substantive assessment (model-based; external authority pending the queued research run)

## Question

Should legal approve the phrases "bank-level security" and "institution-grade protection" for a non-bank payments-infrastructure provider across the website, sales materials, partner presentations, and paid search ads launching 2026-10-03, and if so, what exact qualifiers, substantiation evidence, review controls, and prohibited language must accompany them?

## Bottom line

The phrases are **potentially supportable but not currently approved as-is**. They can be approved only if (a) each element is substantiated by competent and reliable evidence, (b) the wording carries an explicit qualifier that Mosaic Relay is not a bank and does not hold deposits, and (c) the claim is framed as a security-strength comparison, not a fund-protection or bank-status claim. The safer alternative is to replace the phrases with specific, verifiable descriptive claims. The decision between "approve with qualifiers" and "replace with descriptive claims" is the lawyer's to make.

## Legal framework

### 1. FTC Act § 5 and state UDAP — substantiation of objective claims
- "Bank-level security" and "institution-grade protection" are **objective, measurable claims** that imply a specific standard comparable to what regulated banks maintain. Under FTC Act § 5 and state UDAP statutes (e.g., Cal. Bus. & Prof. Code § 17200, N.Y. Gen. Bus. Law § 349), such claims must be truthful, non-misleading, and **substantiated by competent and reliable evidence before dissemination**.
- The FTC's substantiation doctrine requires evidence that reasonably supports the claim's level of specificity. A claim that "bank-level" security is provided requires evidence that Mosaic Relay's controls meet or exceed the security baseline of actual banks — not merely that it has "good" security.
- State UDAP statutes mirror FTC standards but may have lower harm thresholds and allow private rights of action, so the claim must be defensible in the strictest applicable forum.

### 2. Implication / net-impression risk
- Even if the intent is a pure security-strength comparison, the phrase "bank-level" can **imply to a reasonable audience** that Mosaic Relay is a bank, is regulated like a bank, or protects customer funds in deposit accounts. The FTC evaluates the **net impression** on the audience, not the advertiser's intent.
- Because Mosaic Relay is a payments-infrastructure provider that does not hold deposits, any implication of bank status or fund custody would be affirmatively misleading and could also implicate money-transmission characterization concerns.
- The audience (online businesses, marketplaces, platforms that handle funds) may read the claim as a promise about fund safety, not just data security. This perception risk must be tested, not assumed away.

### 3. Geographic variation
- **US:** FTC Act § 5 and state UDAP apply; substantiation and net-impression standards govern.
- **EU/UK:** The Unfair Commercial Practices Directive (and UK equivalent) and financial-promotion rules may treat "bank" / "institution" language more strictly, and comparative-advertising rules apply. If the campaign reaches these markets, market-specific qualifiers or local counsel review are required.
- Geographic scope is currently an open assumption (US-primary). This must be confirmed before final approval.

### 4. Endorsements and comparative advertising
- Use of **customer logos or testimonials** triggers FTC endorsement-guide requirements: consent, accurate representation, and substantiation of the underlying claim.
- **Comparisons to named competitors** require comparative-advertising substantiation and accuracy. Neither is currently confirmed.

### 5. Limitations-of-coverage disclosure
- What "bank-level" does and does not cover (e.g., data security vs. fund protection) must be disclosed to avoid misleading the audience. The claim must not overstate coverage.

## Assessment of the two phrases

| Phrase | Supportability | Primary risk |
|--------|----------------|--------------|
| "Bank-level security" | Supportable **only with** substantiation + explicit non-bank qualifier + limitations disclosure | Implication of bank status or fund custody; substantiation gap |
| "Institution-grade protection" | Higher risk — "institution" and "protection" together read closer to fund custody than data security | Stronger implication of bank/institution status and fund protection; harder to qualify away |

"Institution-grade protection" is the riskier of the two phrases because "protection" in a payments context reads as protection of funds, and "institution" implies a regulated financial institution. It is harder to qualify into a safe security-only claim.

## Viable paths

**Path A — Approve with heavy qualification and substantiation**
- Permit the phrases only with an immediate, explicit qualifier (e.g., "Mosaic Relay is not a bank and does not hold deposits") and a specific description of what the claim covers (e.g., "AES-256 encryption, 24/7 monitoring, [certification]").
- Require documented evidence for each element.
- Prohibit standalone use of "bank-level" or "institution-grade" without the qualifier.
- Risk: Medium. Qualifier reduces but does not eliminate implication risk.

**Path B — Replace with descriptive, substantiated claims (recommended default)**
- Drop "bank-level" and "institution-grade."
- Use specific, verifiable statements: "AES-256 encryption at rest and in transit," "24/7 security monitoring with [SLA]," "[SOC 2 Type II / ISO 27001 / PCI DSS] certified."
- Risk: Low. Eliminates implication and substantiation gaps.

**Path C — Delay launch pending substantiation audit**
- Postpone the 2026-10-03 launch until Security and Compliance produce a complete evidence file.
- Risk: Low legal risk, high business cost (missed launch window).

## Facts that would change the answer

- If Mosaic Relay holds a current SOC 2 Type II report, PCI DSS certification, or equivalent third-party audit that benchmarks against banking-industry security standards, Path A becomes more viable.
- If the campaign runs in EU/UK markets, Path B becomes strongly preferable.
- If customer logos or competitor comparisons are planned, additional consent and substantiation requirements could make Path A impractical within the timeline.
- If "bank-level" has already been used in customer-facing materials or contracts, the matter expands from prospective approval to retrospective exposure assessment.

## Recommended last-mile verification

1. **Evidence file** — Security/Compliance produce a one-page substantiation memo (see the Substantiation Evidence File in this workspace).
2. **Audience-perception check** — Test the wording with 3–5 non-legal employees; if any read it as "Mosaic Relay is a bank" or "funds are protected like a bank deposit," the implication risk is confirmed.
3. **Geographic scope** — Confirm US-only vs. LatAm/Europe; if global, flag for local counsel review.
4. **Logos and comparisons** — Obtain written confirmation of whether customer logos or competitor names will be used.
5. **Record approved wording** — Save exact approved phrases, qualifiers, and prohibited language in the workspace before launch.

## What would change this

- **Working assumption:** Mosaic Relay's current encryption, monitoring, incident-response, and certification claims are accurate and current. If any is outdated or unsupported, Path A collapses and Path B or C becomes mandatory.
- **Working assumption:** The campaign is primarily US-targeted. If it reaches EU/UK markets, the answer shifts toward Path B and local review.
- **Open fork:** Whether the business accepts the qualifier-and-substantiation burden of Path A or prefers the lower-risk descriptive claims of Path B. This is the lawyer's decision point.
- **Not examined:** Mosaic Relay's actual security documentation, SOC 2 reports, penetration-test results, and incident-response logs — none are in the vault.
- **Not examined:** Whether acquiring-bank or processor contracts restrict use of "bank" / "bank-level" language in marketing. Such restrictions are common and could independently block the campaign.
- **Not examined:** Whether "bank-level" has already been used in customer-facing materials or contracts (retrospective exposure).
