# Fresh independent Matter A review

Repository: /Users/bharris/Programs/counsel-os-mvp. Read-only review. Exact requested runtime: gpt-5.6-sol medium. No nested agents. No application, test, document, or vault edits. Do not run broad checks, start services or change browser state. Root owns browser acceptance and reporting.

The user explicitly requested the complete implementation in docs/matter-a-style-ui.handoff-plan.md (same as attached pasted-text request). Review all requirements, especially frozen behavior sections3–4, full lower-page workflows5, and B01–B26. AGENTS.md and docs/DESIGN_LANGUAGE.md remain binding. No commit/push/deploy.

This is a heavily dirty shared tree. Compare against output/matter-a-style-ui-acceptance/baseline-owned-source.json, not HEAD. The full incremental diff will be saved as implementation.diff. ownership.json lists exact owned paths. baseline-hashes.json captures all pre-existing files, including dirty/untracked ones. Root-added/updated tests are identified separately in test-diff.patch. Do not accuse unrelated prior changes of belonging to this rebuild.

Read docs/matter-a-style-ui.verification.md and docs/matter-a-style-ui.handoff-progress.md first. Inspect checks.json and the cited actual logs; historical/interim failures are not final passes. Inspect browser-ledger.json and the named image/DOM/measurement artifacts. A missing/not-run row is not a pass.

Visual references: output/matter-ui-design-survey/designs/01-understand.png through the twelve numbered designs in that directory. View all12. The survey inventories and47 source screenshots are listed in the blueprint. They are before-state evidence, not current results. Root viewed all47 during C0. At least inspect each cluster inventory and the relevant before-images when a control/design question needs it. View the new upper and lower images, source/editor pair, forms, map/outline, templates and narrow viewport evidence. A corrupt preflight before-desktop.png is explicitly excluded; do not use it as visual proof.

Review four passes:
1. Design fidelity: hierarchy, serif reading/sans controls, compact rows, semantic state words, native controls, width/spacing and lower sections. Check measured realCSS1280×900 and390×844, plus900px editor/source breakpoint. The browser has a1.1 zoom factor; root calibrates override inputs to measuredCSS sizes.200% zoom is waived.
2. Interaction preservation: compare the five inventory lists and baseline/final source. All controls must be retained or mapped to a real destination. Check one persistent ChatPanel and three mounted slots; document/revision/dirty text identity; no source/context/target confusion; explicit dispositions, decisions, save/preview/keep, scenario versus actual facts, complete-work versus resolve/close; retained form input and async guards.
3. Code and checks: inspect changed lines, shared Skills/Research/Decisions callers and every test change. Source regex updates must retain their semantic invariant, not merely find a class. control-audit.json and state-audit.json are useful indexes, not substitutes for review. Check section reveal order, exact frozen hooks, focus and hidden panels.
4. Evidence: confirm checks ran and claimed observations have real artifacts; mock provider output is labelled; protected data hashes match; service cleanup status honest. No browser pass inferred from compilation.

Return concrete material findings with file:line, reproduction/expected behavior, severity and exact recommended ownership scope. Do not fix them. Root routes application fixes to the same Terra owner and will request re-review of material corrections. Report any limits clearly. If no material findings remain, state that result without implying unobserved checks passed.
