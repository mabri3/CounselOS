# Live visual comparison — 2026-09-05

Verdict: the user is correct. The delivered UI does not closely match the ten supplied concept images. The current port 3000 server is serving the new implementation; this is primarily an implementation/design-fidelity gap, not the wrong URL or a stale server.

My earlier statement that the blueprint was finished overstated visual completion. Functional checks and the previous review did not establish faithful visual delivery.

## Server and style evidence

- Inspected live `http://localhost:3000/matters/MAT-20260904-abf788`, the same Instant payouts Q1 matter referenced in the samples.
- Node PID 41458 runs from this repository's frontend. It and backend 8000 started at 16:04:40, after the implementation work.
- Live DOM has the new MatterReview CSS module classes, three workspace views, the new section index, and Jump to latest answer.
- Both global and workspace stylesheets are loaded from port 3000.
- Computed answer background is `rgb(253,253,255)` (`#fdfdff`), with pale purple border `rgb(207,203,238)`. The agent token is muted `#5f5ac0`.
- The live next-action button background is `rgb(255,254,251)` with gray/brown text. Its implementation uses `btn tiny`, not the available dark `primary` style (`OrientationSummary.tsx:136`).
- Thus color is not wholly absent: amber badges, green status text and some purple outlines are present. They are far less prominent than the sample accents. Many icon accents and strong action treatments are absent.

## Ten spot checks

These are visual comparisons, not pixel-equality tests. Concept images use short sample content and tall portrait canvases. Live captures use the existing desktop viewport (1163×654) and the actual matter records. Those differences explain some height and text density. They do not explain the missing icons, different colors, button hierarchy, or replacement page layouts.

| View | Sample | Live | Observed difference |
|---|---|---|---|
| Understand | [Sample](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/01-understand.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-live-comparison/01-understand.png) | Sample: white canvas, purple answer label/link/icon, dark Review issue action, underlined navigation. Live: beige stacked frame, tiny segmented tabs, nearly white answer wash, neutral outlined action, added work banner. |
| Issue review | [Sample](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/02-issue.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-live-comparison/02-issue.png) | Sample: vertical icon-led sections and strong disposition block. Live: dense two-column section grid, text-heavy title, muted badges and no matching purple section icons. |
| Discuss | [Sample](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/03-discuss.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-live-comparison/03-discuss.png) | Sample: prominent latest answer and a visible right inquiry rail. Live: scope/status strips over a long chronological conversation, unused space on the right, no equivalent visible inquiry rail. |
| Draft | [Sample](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/04-draft.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-live-comparison/04-draft-editor.png) | Sample: clearly separated work-product rows, white document sheet, strong Save action. Live: retained editor with gray/beige toolbar bands and compact controls. A legacy orientation and work banner also sit above Draft. This matter currently has zero saved work products, so that content cannot match the sample populated list. |
| Source | [Sample](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/05-source.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-live-comparison/05-source.png) | Sample: large Source reading heading, purple document/quote accents, distinct support grid. Live: narrow gray source panel beside the editor, long raw revision identifiers, plain excerpt. Side-by-side preservation works, but visual treatment differs substantially. |
| Decision map | [Sample](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/06-map.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-live-comparison/06-map.png) | Sample: purple question node, orange issue nodes, clear branches and dark action. Live: mostly gray node surfaces, a large neutral visual canvas, plain controls, long record labels. Actual selected neighborhood contains two records rather than the sample four. |
| Scenario | [Sample](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/07-scenario.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-live-comparison/07-scenario-form.png) | Sample: large title, tidy label/value rows, dark Analyze scenario button. Live: embedded stacked form with a faint dashed border and a purple outlined Analyze button. |
| Research and work | [Sample](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/08-work.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-live-comparison/08-work-queue.png) | Sample: icon-led rows, short titles, colored status badges, dark resume action. Live: dense inline run IDs and questions, small colored status text, neutral resume button. Research is also below substantial earlier matter content. |
| Explore and reuse | [Sample](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/09-explore.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-live-comparison/09-explore.png) | Sample: spacious coordinated page with business-flow sketch, concise prior-work/practice-note forms and icon-led links. Live reuse destination: plain stacked boxes with larger textareas and no corresponding page-level arrangement. Business flow is in a separate lower disclosure. |
| Tools and history | [Sample](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/10-tools.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-live-comparison/10-tools.png) | Sample: dedicated tools surface with left navigation rail and main content. Live: expanding header button cluster and a right-side Files & context drawer. This is a different layout, not a missing stylesheet. |

## Conclusion

This is not solved by choosing a different URL or restarting localhost. The closest correct entry is the matter URL above; Understand, Discuss and Draft are in-page views. The map is the matter's decision-map route. Most other sample “pages” were delivered as sections, menus or drawers.

A corrective visual pass is needed to match the approved references: apply the intended accent and primary-action roles, restore icon treatment and navigation hierarchy, reduce legacy framing, and reproduce the intended arrangements while keeping existing behavior. No code or matter records were changed for this investigation. No inquiry, analysis, save, upload, work completion or lifecycle action was submitted. Only navigation, disclosures, source reading and an unsubmitted scenario form were inspected.
