# Sol medium legal review: assessment

Date: September 10, 2026.

**Grade: 78/100. Useful first pass, with a material legal gap.** This is my judgment under the rubric below. It is not a measured percentage of legal accuracy.

Sol used the supplied research more carefully than the prior DeepSeek/OpenCode answer. It distinguished bank rules from nonbank rules, separated asset purchases from acquisitions of control, qualified the bank-partner fallback, and preserved the value of inherited customer records. It still failed to identify the acquired-account exclusion that can change the central answer.

## Test conditions

- Requested model: `gpt-5.6-sol`, medium reasoning, invoked through a fresh subagent with no conversation history.
- Input: the original synthetic acquisition question, all 13 saved public source bodies from `RUN-20260910-58c98e`, and its five selected passages.
- No prior final answer, evaluator critique, or additional search was supplied. Sol was instructed not to browse. Its answer reports only the supplied sources and identified general legal knowledge.
- The public source text was preserved, including failed retrievals. The packet had no substantive text of 31 CFR 1020.100 or 1022.210. Thus the acquired-account exclusion was absent from the research.
- This was a fresh answer from collected research, not an edit of DeepSeek's answer. The original application's system prompt, tool sequence, and unrelated local Beacon records were not replayed. Sol could inspect full saved bodies rather than only the earlier selected passages. These differences limit causal attribution to the model alone.
- The evaluator checked primary legal sources independently. Those checks were not passed to Sol.

## Rubric and result

The dimensions and weights were recorded before Sol returned its answer.

| Dimension | Score | Reason |
|---|---:|---|
| Which rules apply | 23/25 | Explicitly limits bank CIP and separates nonbank requirements. The opening still treats taking on an account too broadly. |
| Exceptions that change the outcome | 12/25 | Gets formal reliance and the privacy sale exception. Misses the acquired-account exclusion and does not resolve privacy-notice timing. |
| Transaction and phase distinctions | 17/20 | Separates equity/control review from asset transfers and closing from operations. Final blanket restrictions are broader than its own conditional analysis. |
| Fidelity to evidence | 14/15 | Identifies secondary authority, failed pages, and unsupported areas. Does not present a bank/FBO arrangement as an established exemption. |
| Useful conditional advice | 12/15 | Provides owners, evidence, phased migration, and targeted refreshes. Too long; some restrictions are stated more categorically than the unknown facts justify. |
| **Total** | **78/100** | **Materially better use of evidence, incomplete central legal analysis.** |

## Main findings

### 1. Material omission: acquired accounts

Sol's opening says: “If a bank is opening or taking on an account,” its CIP must establish the customer's identity. It later identifies continuation versus new account opening as a missing fact, but never explains the legal consequence.

Bank CIP excludes an account acquired through an acquisition, merger, asset purchase, or assumption of liabilities under 31 CFR 1020.100(a)(2)(ii). Formal reliance under section 1020.220(a)(6) is a different route. A receiving bank therefore does not necessarily need fresh CIP merely because ownership changes. Other Bank Secrecy Act duties remain. Sol should have identified this branch or expressly left the inherited-account treatment unresolved. [Federal banking agencies' CIP manual](https://bsaaml.ffiec.gov/manual/AssessingComplianceWithBSARegulatoryRequirements/01)

This omission matters because it can change the migration work required. It is less harmful here than in the earlier answer: Sol recommends accepting or supplementing usable records and repeating only deficient or higher-risk elements, rather than a blanket repeat.

### 2. Clear improvement: bank versus nonbank

Sol explicitly states that the supplied CIP provision applies to banks and that a nonbank transmitter cannot treat it as a direct safe harbor. That distinction is correct. Money-services businesses have separate AML program requirements under 31 CFR 1022.210, including risk-sensitive procedures and applicable identification duties. [Federal Reserve reproduction of section 1022.210](https://www.federalreserve.gov/frrs/regulations/section-1022210-anti-money-laundering-programs-for-money-services-businesses.htm)

Sol also gives the full formal-reliance conditions, including the annual certification covering specified CIP performance. This is more precise than treating access to seller records as sufficient formal reliance. [Federal banking agencies' CIP manual](https://bsaaml.ffiec.gov/manual/AssessingComplianceWithBSARegulatoryRequirements/01)

### 3. Clear improvement, with a remaining overstatement: closing

Sol correctly identifies the supplied article as secondary commentary and limits its discussion of change-of-control approvals to transactions that actually change control. It does not simply import an equity-deal closing condition into every asset purchase.

However, its final statement that closing may proceed “only with enforceable state and cohort carve-outs” is too categorical. Its own earlier analysis allows other lawful arrangements. Given the unknown states and deal perimeter, this should be a conditional recommendation, not the exclusive route. This is a defect in applying the scenario, not a conclusion that any particular state permits this deal to close.

The focus on actual activity and exemptions is sound. For example, Texas describes licensing through the business activity and recognizes authorized-delegate and exemption routes. That is an illustration, not a nationwide conclusion. [Texas Department of Banking FAQ](https://www.dob.texas.gov/money-services-businesses/faqs)

### 4. Privacy: accurate boundary, incomplete timing

Sol correctly treats section 1016.15(a)(6) as a business-sale disclosure exception, not a general marketing permission. [CFPB section 1016.15](https://www.consumerfinance.gov/rules-policy/regulations/1016/15/)

It candidly says the packet does not supply the other operative notice rules. It does not explain that section 1016.4(e) permits initial notice within a reasonable time after certain customer relationships are established without customer choice. This is an unresolved exception, rather than a fabricated deadline in Sol's answer. [CFPB section 1016.4](https://www.consumerfinance.gov/rules-policy/regulations/1016/4/)

## What this test supports

For this one case, Sol produced a more careful and useful legal first pass from the existing public research. It reduced several overstatements in the prior answer without seeing the critique. It did not repair a key missing piece of research.

The result supports further testing of a separate reasoning step. It does not establish that Sol is generally more legally accurate, or isolate model choice from the simpler prompt and cleaner context. No application code, default model, or real matter record was changed for this test.
