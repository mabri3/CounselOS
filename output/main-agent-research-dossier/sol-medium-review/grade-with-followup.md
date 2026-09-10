# Sol medium with follow-up research: assessment

**Grade: 90/100, compared with 78/100 for its fixed-evidence answer.** These are my judgments under the same rubric, not measured accuracy percentages or a model benchmark.

The important result is observable: without seeing the earlier critique, Sol selected the acquired-account issue in its pre-search plan, found the missing definition, and changed its answer to distinguish an acquired account from a newly opened account. This repairs the main omission identified in the first review.

## Same rubric

| Dimension | Fixed evidence | With follow-up | Assessment |
|---|---:|---:|---|
| Which rules apply | 23/25 | 24/25 | Distinguishes bank CIP, nonbank MSB duties, and the legal account event. |
| Exceptions that change the outcome | 12/25 | 23/25 | Adds the acquired-account exclusion and delayed privacy-notice delivery. |
| Transaction and phase distinctions | 17/20 | 17/20 | Correct conditional structure, but still overstates mandatory carve-outs in the final working position. |
| Fidelity to evidence | 14/15 | 14/15 | Uses primary rules and identifies Texas as an illustration. Some application language is more categorical than the cited text. |
| Useful conditional advice | 12/15 | 12/15 | Gives usable targeted refreshes and owners, but remains long and repeats phase restrictions. |
| **Total** | **78/100** | **90/100** | **The main substantive gap is repaired.** |

## Verified improvements

1. **Acquired accounts:** The revised answer correctly identifies 31 CFR 1020.100(a)(2)(ii). This exclusion concerns bank CIP, not blanket relief from every AML or customer-check duty. It correctly distinguishes this from formal reliance on another institution. [Current federal definition](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1020/subpart-A/section-1020.100)
2. **Nonbank scope:** It finds the separate MSB AML-program rule rather than applying the bank reliance provision to every payments business. [Section 1022.210](https://www.federalreserve.gov/frrs/regulations/section-1022210-anti-money-laundering-programs-for-money-services-businesses.htm)
3. **Privacy timing:** It now explains that initial notice can follow establishment of a qualifying customer relationship without customer choice. [CFPB section 1016.4](https://www.consumerfinance.gov/rules-policy/regulations/1016/4/)
4. **Promotion:** It adds a concrete state example covering advertising and solicitation, and separates permission to disclose data for a sale from later use. Texas section 152.101 supports the licensing example. Regulation P section 1016.11 limits exception-based reuse. [Texas Chapter 152](https://tcss.legis.texas.gov/resources/fi/htm/fi.152.htm), [CFPB section 1016.11](https://www.consumerfinance.gov/rules-policy/regulations/1016/11/)

## Remaining corrections

- The conclusion again says to close “only with enforceable carve-outs.” Carve-outs are one option, not established as universally necessary by these facts. A properly authorized buyer may need none. The answer's earlier body is more qualified than its conclusion.
- Its statement that bank CIP applies if a customer opens a new account needs the existing-customer qualification. Section 1020.100(b)(2)(iii) excludes an existing customer when the bank reasonably believes it knows that person's identity. The new answer repairs the principal acquisition issue without covering every relevant branch. [Current federal definition](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1020/subpart-A/section-1020.100)
- The privacy marketing example concerns account processing. Sol correctly identifies that setting in the revised answer, but its operational instruction not to give marketing teams account-level data is broader than the specific rule established. The task, purpose, and legal basis of the team's use matter. A fresh notice alone is not proof that all reuse restrictions are resolved. [CFPB section 1016.11](https://www.consumerfinance.gov/rules-policy/regulations/1016/11/)
- The opening “blocked” phase labels are proposed operating positions under unknown facts. They should be clearly distinguished from legal prohibitions that have actually been established.

These are focused revisions to a useful answer. They do not justify withholding it.

## What changed in the experiment

Sol retained its previous answer and research context. It was then allowed focused research. It wrote its own plan before searching and used two batches, eight queries, and 20 targeted page reads, as reported in its completion and research log. The evaluator did not name the missing rule or provide the critique to this agent.

This adds both evidence and a further reasoning turn. It uses the available web tools, not the application's OpenCode collector. The experiment's 20 targeted reads are not the same as the application's 16-fetch total budget. Therefore the result demonstrates successful gap selection and answer revision, not an exact live replay of the application or a provider comparison.

The application change is a generic review-to-research instruction. It contains no bank rule, acquired-account exception, or answer to this test. Its deterministic integration tests establish the tool path, authorization behavior, and useful publication after failure; they do not establish legal reasoning quality for every configured model.

## Artifacts

- `followup-plan.md`: the model's own questions, written before research.
- `followup-research.md`: query and source log, including failures.
- `sol-answer-with-followup.md`: unedited model answer.
- `sol-answer.md`: preserved fixed-evidence answer.
- `protocol.md`: original fixed-evidence conditions and rubric.
