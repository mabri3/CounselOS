# Planning and blueprint verification

Date: September 5, 2026. This report covers planning and a local interactive design preview. It does not verify a new application implementation.

## Evidence inspected

- Current `AGENTS.md`, PRD, handoff, full design language and September 5 reference amendment.
- Current map route/component/layout/types, source projection and publication code, research target/run flow, decision creation and modal behavior.
- Required graphify query; its broad result was truncated, so focused source inspection supplied the exact contracts.
- Recent task **Implement Matter A UI rebuild** and its reference image paths.
- Coordinator viewed the final map and issue concepts. Terra also viewed Understand and Scenario concepts and the recorded live map survey.
- Coordinator opened the real current map read-only: 34 records; selecting the owner-information issue showed only the issue and business question. It showed no legal test or options. No analysis, chat, fact correction or decision was submitted.

## Research and review

Luna High returned primary reference findings. The coordinator checked the OMG specification index and GOV.UK form/conditional-reveal guidance, and selected three sources for the blueprint. These guide interaction, not legal conclusions.

Sol High audited normal generation and persistence. Terra High audited visual fidelity. A fresh Sol Medium reviewed the completed blueprint/build plan/prompt. Its six material findings were addressed in the documents: issue-local freshness, pointer precedence, option revisions/fingerprints, queued input capture, mixed condition logic and unambiguous dispatch routing.

The same independent reviewer checked the corrections and reported all six resolved, with no remaining substantive defect. This is review of the plan, not evidence that the future implementation works.

The plan preserves the three-column design after considering a five-column alternative. The latter would consume too much width once real app margins and readable labels are included.

## Preview checks actually performed

The preview uses fictional contract content. All interactions are local simulations.

- Loaded the fragment through the supplied local visualization renderer and inspected it in the in-app browser.
- Selected a different path; observed changed consequence, conditions and remaining work while the issue and sibling paths remained visible.
- Opened and cancelled the example decision form; the form closed without showing a recorded state.
- Reopened and explicitly simulated recording; observed **Recorded in example**.
- Opened All issues, selected another issue, and observed its different rule, condition and paths.
- Opened a hypothetical assumption; observed **Hypothetical preview. The actual fact remains unknown.** Cleared it.
- Selected an unmapped issue; observed its explanation and explicit empty state, with no borrowed graph or outline.
- Inspected the 1024 × 1000 preview: three readable columns, wrapped node text, visible conditional alternatives and curved links.
- Inspected the 360 × 800 fallback: stacked layout; root width 328 pixels and scroll width 326 pixels. No horizontal overflow in that observed root.
- Captured preview console showed no errors. `node --check output/decision-map-redesign/preview-script.js` passed.

An initial native form submission did not trigger inside the preview renderer. The simulation now uses an explicit local button handler; the corrected interaction passed. A generic-role measurement locator timed out; a direct observed element measurement succeeded. Neither was an application defect.

## Preservation and limitations

The planning baseline compared 243 application source files; none changed. No worker was authorized to write application code. No application test suite/build was run for these documentation/preview changes. Existing test results from other tasks are not claimed as this task's evidence.

The preview is not a production implementation. It uses simplified chrome, sample content and local simulations. It does not persist records, call model APIs, implement the full source viewer, provide a complete interactive outline or verify exact real-app font metrics. The build plan requires those features and their real end-to-end checks. The app itself was not redesigned in this task.

The unresolved “Xai” name remains an explicit routing item. No unavailable model was substituted or claimed as used.

Temporary preview server on port 8766 exited 0. Both temporary tabs were closed and the viewport override was reset. The normal app services and active-vault settings remain unchanged. Final status adds only the four plan documents and the planning output folder; both preview copies match. See `planning-final-check.json`.
