# Objective-based comparisons and section formatting

Implemented a general comparison contract in the editable answer and dialogue skills. It connects each option to the company's activity, objective, milestones and remaining issues. The shared matter-path skill uses the same objective-based approach. No Harbor-specific business rule or issue matcher was added. The Compare button now asks how the selected approaches help or hinder the objective and why.

The final reading guide is approximately two minutes per alternative, with no hard cutoff, forced minimum or automatic move to a document. Earlier strict whole-answer wording was removed following the user's clarification.

The saved Harbor response omitted blank lines before standalone bold section labels. CommonMark absorbed them into the previous list item. The conversation renderer separates those labels for display without editing the stored text. Code fences, indented code, quoted headings and ordinary list continuation are preserved. The prompt also requests proper section separation for future answers.

## Verification

- Markdown AST regression reproduced one unintended list and verified separate lists/paragraphs after normalization; code preservation cases passed.
- A read-only browser check loaded the actual Harbor conversation and verified Bank-held funds structure, Working view and Next step were outside list items. Screenshot: fixed-live-sections.png.
- 16 relevant backend tests passed. Frontend typecheck and production build passed. The prior full 1,492-test backend run remains the broad baseline; no backend executable code changed in this follow-up.
- The live skill endpoint shows the flexible per-alternative guide and general business-objective instructions.
- Five Sol Medium diagnostic calls were made: three early Harbor replays, a separate fictional support-vendor comparison, and a final Harbor replay with the improved Compare request. Earlier Harbor replays retained vague shorthand and were not accepted as quality passes.
- The support-vendor case explained review bottlenecks, the effect of direct responses on refund errors, vendor terms and deadline dependencies, and the unresolved contradictory refund policy under both alternatives. See general-comparison.md.
- The final Harbor replay tied the monitoring contract ending at close to migration readiness, explained how bank control might affect the comparison, and included the existing KYC, alerts and SAR issues under both options. See objective-replay-final.md. It still offers preliminary, unverified legal conclusions; this is not a legal-accuracy benchmark or proof that all future outputs will satisfy the contract.

Model replays were read-only. Historical answers and actual matter facts were not replaced. Refresh the page and submit a new comparison to obtain a new answer; the display formatting repair applies to saved answers as well.
