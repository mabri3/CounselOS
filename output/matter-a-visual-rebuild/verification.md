# Matter A visual correction — verification

The corrective rebuild is implemented. All twelve supplied reference images were inspected, and each corresponding live surface was reviewed in the browser. This record replaces the earlier claim that functional checks alone established visual completion.

## Live application

[Open Understand](http://localhost:3000/matters/MAT-20260904-abf788?view=understand&conversation=CONV-20260904-469ac8). The normal localhost:3000 frontend and localhost:8000 backend were used. No alternate demo server or vault was substituted. The selected matter is Instant payouts Q1.

The review used real saved records. Titles, counts, empty states, and current status therefore differ from the sample copy. The matter became overdue during the review and now uses its actual overdue state. No fake issues, sources, flow actors, or legal text were inserted to imitate the images. This is a visual design review, not a claim of identical pixels across different content and viewport sizes.

## Visual evidence

| Surface | Supplied image | Live capture | Applied treatment |
|---|---|---|---|
| Understand | [Reference](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/01-understand.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-visual-rebuild/01-understand.png) | White canvas, serif question, lavender answer, navy action, numbered issues and section links. |
| Issue review | [Reference](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/02-issue.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-visual-rebuild/02-issue.png) | Large serif issue title, orange Open state, stacked sections and right-side actions. |
| Discuss | [Reference](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/03-discuss.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-visual-rebuild/03-discuss.png) | Latest answer and user question, collapsed earlier messages, inquiry tiles at right and one composer. |
| Draft | [Reference](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/04-draft.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-visual-rebuild/04-draft.png) | Stacked document groups, editing identity, review toolbar, white editor paper and save/export footer. |
| Source reading | [Reference](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/05-source.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-visual-rebuild/05-source.png) | Full-width source reading with retained editing identity and separate support cards. |
| Decision map | [Reference](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/06-map.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-visual-rebuild/06-map.png) | Purple question, orange issue nodes, map toolbar, compact selected record and outline. |
| Scenario | [Reference](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/07-scenario.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-visual-rebuild/07-scenario.png) | Standalone form, hypothetical state, saved scenarios and separate actual fact correction. |
| Research and work | [Reference](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/08-work.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-visual-rebuild/08-work.png) | Compact research rows with state and aligned actions; work and participant controls below. |
| Explore and reuse | [Reference](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/09-explore.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-visual-rebuild/09-explore.png) | Business question, compact flow, prior work, practice notes, watches and scenario access. |
| Tools and history | [Reference](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/10-tools.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-visual-rebuild/10-tools.png) | Full-page left navigation and inline files/context panel. |
| Business replies | [Reference](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/11-business.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-visual-rebuild/11-business.png) | Full-width request form, local/recorded state cards and handoff form below. |
| Compare versions | [Reference](/Users/bharris/Programs/counsel-os-mvp/output/matter-ui-design-survey/designs/12-compare.png) | [Live](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-visual-rebuild/12-compare.png) | Two-column version/work selection, comparison action and support panels. |

Additional viewport captures show the editor paper, source/map detail, composer, scenario lower form, reuse controls, and business state cards. Full-page capture stitching was unreliable, so the defective stitched scenario image was removed. Live captures use normal viewport screenshots and may show different scroll positions.

## Checks

- Frontend typecheck: passed after final code changes.
- Understand, Draft, document reference/recovery, and Matter A navigation checks: passed.
- Workspace reuse checks: passed after the compact flow/reuse changes.
- Production build: passed using an isolated output directory. The existing development server was kept running. Next-generated configuration was restored to its exact pre-build content.
- Live browser: one matter composer; unsent text survived view changes; temporary test text was removed with keyboard input. Source reading retained the editor target. Scenario Cancel returned to the map. Map Discuss link opened Discuss. Section and tool navigation were exercised.
- One temporary narrow viewport check: all three tabs fit; document width did not exceed viewport width. The desktop viewport was restored.
- graphify update .: passed. The graph tool skipped HTML visualization because this repository exceeds its visualization size limit.
- git diff --check: passed.

Testing stayed focused. No broad backend suite or durable legal/workflow action was run for this visual correction. No send, save, upload, completion, scenario analysis, request-recording, or handoff submission was performed during the browser review.

## Implementation and limits

Shared CSS and semantic color tokens now supply the white/navy/purple/orange language. Three Terra workers handled bounded page groups; the root agent owned shared structure and direct browser integration. CSS-hidden views stay mounted where needed to retain local editor and conversation state. Real record distinctions and existing action handlers remain.

The drafting and section-navigation test loaders were updated to load the real new icon component and account for the section state/scroll callback. Their behavioral assertions were retained.

The original tree was already dirty. baseline-source.json and changed-from-baseline.json record the corrective component/style scope. Changes to shared tokens, the matter route, new style/icon files, test loaders, and this documentation are also part of this correction. No commit or push was made.

Build log: [build.log](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-visual-rebuild/build.log). Graph update: [graphify.log](/Users/bharris/Programs/counsel-os-mvp/output/matter-a-visual-rebuild/graphify.log).
