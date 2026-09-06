# Phase 2 visual evidence matrix

Inventory refreshed: 2026-09-06T02:05:25-07:00. Fresh independent Sol medium review accepted all 29 counterparts. References 09 and 29 have the nonblocking variances described in final-review.md. This does not turn the baseline focused-test failure into a passed check.

Reference landmarks are manual estimates from opened native PNGs (about ±8 px). Actual rectangles come from current linked geometry JSON. Coordinates are viewport CSS pixels; add scrollY to y for document position. Off-screen and negative coordinates are preserved. All included geometry currently records scale 1.100000023841858; this is not silently treated as scale 1.0.

This refresh includes the new 10 overview geometry and refreshed 17–29 states, including editor preview success and loaded originating-matter draft. Excluded: invalid full-page Today capture, foundation capture, stale `18-template-editor-preview`, and the superseded generic `29-skill-guided` capture. The current `18-template-editor-lower` replaces its earlier scale-2.2 capture; only its latest scale-1.1 geometry is used. Settings composites are separate destination captures.

| Reference | Exact SHA-256 and native dimensions | Route and state | Captures and actual viewport / scale / scroll | Reference landmark estimates | Disposition |
|---|---|---|---|---|---|
| [01-today](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/01-today.png) | `4195325ab3cd10d8947749d09353b62e3bc2c059582b85d82235a4c58b4cc715`<br>1024×1536 | `/`<br>Attention queue, first card open | [01-today-top](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/01-today-top.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/01-today-top-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0 | Header bottom y84; title x24 y210; status row y283; first attention card x22 y371; agent answer x42 y565 | Accepted — fresh Sol medium review. |
| [02-today-practice](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/02-today-practice.png) | `aa1d4ed16236ecce449e54e0a33ceb6ecb96a2ff819667c5956c5b0988d89c07`<br>864×1821 | `/`<br>Practice and chat lower sections | [02-today-chat](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/02-today-chat.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/02-today-chat-geometry.json) · 864×1091; scale 1.100000023841858; scrollY 2995.908935546875<br>[02-today-practice](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/02-today-practice.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/02-today-practice-geometry.json) · 864×1091; scale 1.100000023841858; scrollY 2418.63623046875 | Header bottom y80; back link x25 y109; orientation table x25 y212; practice panel x25 y715; chat panel x25 y1212 | Accepted — fresh Sol medium review. |
| [03-workspace-board](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/03-workspace-board.png) | `1b65f6316753d800eec1bedc25820980f2e4c25c3312d664fdfe0966ad3805e1`<br>1024×1536 | `/workspace`<br>Portfolio board | [03-workspace-board](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/03-workspace-board.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/03-workspace-board-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0 | Header bottom y86; title x32 y155; board x32 y306; first column width228; quarter disclosure y1323 | Accepted — fresh Sol medium review. |
| [04-workspace-quarter](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/04-workspace-quarter.png) | `2af6f2f8e877be38b2b9659505ec60c05deabf83ee5b996e328158dcd7211577`<br>1024×1536 | `/workspace`<br>Quarter and agent activity | [04-workspace-quarter](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/04-workspace-quarter.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/04-workspace-quarter-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 1578.6363525390625 | Header bottom y92; summary x22 y114; metrics x22 y238; agent panel x22 y413; intake x22 y692 | Accepted — fresh Sol medium review. |
| [05-matters-table](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/05-matters-table.png) | `787198f3de797ae375c6fbc3fa6ccc2ad76d9c7b0080154ec295b0e9ce5b8f2a`<br>1024×1536 | `/matters`<br>Table and filters | [05-matters-table](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/05-matters-table.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/05-matters-table-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0 | Header bottom y86; title x38 y119; tabs x38 y223; status row y301; table header y529 | Accepted — fresh Sol medium review. |
| [06-matters-stages](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/06-matters-stages.png) | `fb79831cc4f74aff61e377204429202bb8d23983fb64047a4c7c145ab0315384`<br>1024×1536 | `/matters`<br>Stage groups | [06-matters-stages-filtered](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/06-matters-stages-filtered.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/06-matters-stages-filtered-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0<br>[06-matters-stages](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/06-matters-stages.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/06-matters-stages-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0 | Header bottom y84; tabs x42 y112; title x42 y231; filters y338; first stage x42 y443 | Accepted — fresh Sol medium review. |
| [07-new-matter](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/07-new-matter.png) | `14e7f43f0c38e74825fdf5f25920f93d60c11ddff708d1083e0f79b125e65509`<br>1024×1536 | `/workspace`<br>New matter intake open | [07-new-matter](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/07-new-matter.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/07-new-matter-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 2297.727294921875 | Header bottom y77; title x53 y166; request x53 y295; title input y490; submit x535 y790 | Accepted — fresh Sol medium review. |
| [08-decisions](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/08-decisions.png) | `3392e26517cd7897cb171edac7bc4cc420f2d00eb5dd101c5cc4e87a362aafe3`<br>1024×1536 | `/decisions`<br>Recorded decisions and recommendations | [08-decisions](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/08-decisions.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/08-decisions-geometry.json) · 1024×1536; scale 1.100000023841858; scrollY 0 | Header bottom y116; title x38 y154; tabs x38 y270; recommendation panel y356; decision table y644 | Accepted — fresh Sol medium review. |
| [09-decision-review](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/09-decision-review.png) | `9f3231d99248fcc937cd9ed6e7ba65d5ff3124c674ab5e3debaaa0bdd0ac260b`<br>864×1821 | `/decisions?packet=PKT-PHASE2-5`<br>Review packet and five outcome forms | [09-decision-review](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/09-decision-review.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/09-decision-review-geometry.json) · 864×1091; scale 1.100000023841858; scrollY 2291.818115234375<br>[09-follow-up](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/09-follow-up.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/09-follow-up-geometry.json) · 864×1636; scale 1.100000023841858; scrollY 2559.0908203125<br>[09-keep-current](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/09-keep-current.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/09-keep-current-geometry.json) · 864×1636; scale 1.100000023841858; scrollY 2854.54541015625<br>[09-monitor](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/09-monitor.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/09-monitor-geometry.json) · 864×1636; scale 1.100000023841858; scrollY 5348.63623046875<br>[09-not-relevant](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/09-not-relevant.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/09-not-relevant-geometry.json) · 864×1636; scale 1.100000023841858; scrollY 2567.272705078125<br>[09-revise](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/09-revise.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/09-revise-geometry.json) · 864×1636; scale 1.100000023841858; scrollY 2484.54541015625 | Header bottom y77; title x40 y130; summary cards x39 y223; sources y802; disposition choices y1113 | Accepted with nonblocking variance — see final-review.md. |
| [10-briefing](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/10-briefing.png) | `b5887794fa431d347262afb167b9dc86b22abb0a9a0f4253afb7176947481bf0`<br>1024×1536 | `/briefing`<br>Overview filters and saved views | [10-briefing-filtered](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/10-briefing-filtered.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/10-briefing-filtered-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0<br>[10-briefing](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/10-briefing.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/10-briefing-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0 | Header bottom y84; title x28 y159; filters x29 y322; saved views x670 y112 width331; first update y686 | Accepted — fresh Sol medium review. |
| [11-briefing-reader](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/11-briefing-reader.png) | `9118d178a7cfbae861d334f69ae7eb57fd87d55aec3764edfb289bc84a370e1c`<br>864×1821 | `/briefing/ITEM-DEMO-ALTERNATIVE-DATA-BRIEFING`<br>Development reader and actions | [11-briefing-reader-actions](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/11-briefing-reader-actions.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/11-briefing-reader-actions-geometry.json) · 864×1091; scale 1.100000023841858; scrollY 1470<br>[11-briefing-reader](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/11-briefing-reader.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/11-briefing-reader-geometry.json) · 864×1091; scale 1.100000023841858; scrollY 0 | Header bottom y94; back x32 y140; title x32 y250; facts x497 y399; body heading x32 y710 | Accepted — fresh Sol medium review. |
| [12-briefing-digest](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/12-briefing-digest.png) | `ada417d0ca8cd50d061267df774552f898dddd7e7e3862580e7a7d87a960a024`<br>1024×1536 | `/briefing/digests/DIG-PHASE2`<br>Frozen digest | [12-briefing-digest](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/12-briefing-digest.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/12-briefing-digest-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0 | Header bottom y90; title x42 y214; frozen notice x42 y431; agent summary y535; first digest row y732 | Accepted — fresh Sol medium review. |
| [13-watches](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/13-watches.png) | `1be82a0b0771c58b55649f285e279eb1085c2424a1c449e3e8d08cec871ae190`<br>1024×1536 | `/watches`<br>Empty and populated watch list | [13-watches-empty](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/13-watches-empty.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/13-watches-empty-geometry.json) · 1024×1536; scale 1.100000023841858; scrollY 0<br>[13-watches](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/13-watches.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/13-watches-geometry.json) · 1024×1536; scale 1.100000023841858; scrollY 0 | Header bottom y118; title x67 y178; new action x790 y174; empty panel x66 y329; populated table y797 | Accepted — fresh Sol medium review. |
| [14-watch-assignment](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/14-watch-assignment.png) | `e3cbd2331cd1fc08600e9d3b5bb8380fa2c021dc8298e1f073ed1be8671d3131`<br>887×1774 | `/watches/new`<br>Watch assignment | [14-watch-assignment](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/14-watch-assignment.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/14-watch-assignment-geometry.json) · 887×1636; scale 1.100000023841858; scrollY 0 | Header bottom y88; builder bar x10 y88; steps y164; title field x41 y257; named sources y1176 | Accepted — fresh Sol medium review. |
| [15-watch-schedule](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/15-watch-schedule.png) | `0a079eaab121cb92e308c841ea2dbb02b084b1d321c9b3891863670f2dcdfa31`<br>1024×1536 | `/watches/WATCH-20260906-05727c`<br>Watch schedule lower form | [15-watch-schedule](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/15-watch-schedule.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/15-watch-schedule-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 2862.272705078125 | Header bottom y107; title x44 y186; internal scope panel x34 y295; cadence y550; actions y1174 | Accepted — fresh Sol medium review. |
| [16-watch-detail](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/16-watch-detail.png) | `a5482d85a2ef7fad7025f23bb62b694d25e02f873fb568955b920b062b96d7d2`<br>1024×1536 | `/watches/WATCH-20260906-05727c`<br>Active watch with history | [16-watch-detail](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/16-watch-detail.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/16-watch-detail-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0 | Header bottom y77; title x35 y160; actions x555 y160; run history y396; preview panel y649 | Accepted — fresh Sol medium review. |
| [17-templates](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/17-templates.png) | `84562a03f801a989a20aa6609031f0694e9fdf58d92761fa351184a647b0a334`<br>1024×1536 | `/skills`<br>Template library | [17-templates](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/17-templates.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/17-templates-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0 | Header bottom y82; title x46 y111; tabs y196; full-width table x46 y230 width931; selected detail x46 y833 | Accepted — fresh Sol medium review. |
| [18-template-editor](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/18-template-editor.png) | `bf86929add1bf7c16f793058ccc62b16c6e05428ffe4a4efeba196896ddc4113`<br>948×1660 | `/skills`<br>Template editor and preview | [18-preview-success](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/18-preview-success.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/18-preview-success-geometry.json) · 948×1091; scale 1.100000023841858; scrollY 1082.727294921875<br>[18-template-editor](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/18-template-editor.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/18-template-editor-geometry.json) · 948×1091; scale 1.100000023841858; scrollY 159.09091186523438<br>[18-template-editor-lower](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/18-template-editor-lower.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/18-template-editor-lower-geometry.json) · 948×1091; scale 1.100000023841858; scrollY 954.0908813476562<br>[preview-origin-draft](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/preview-origin-draft-final.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/preview-origin-draft-geometry.json) · 948×1091; scale 1.100000023841858; scrollY 0 | Header bottom y88; title x40 y232; metadata x40 y312 width386; instructions x457 y340 width444; outline x457 y646 | Accepted — fresh Sol medium review. |
| [19-skills](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/19-skills.png) | `f61ef2339a45c68fb8d4e4261869533b9e29a63efd1f7c328164c874315ae930`<br>1024×1536 | `/skills`<br>Skills overview and saved editor | [19-skills-editor](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/19-skills-editor.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/19-skills-editor-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 97.7272720336914<br>[19-skills](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/19-skills.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/19-skills-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0 | Header bottom y100; rail x36 y192 width322; detail title x411 y143; name input x411 y273; guidance x411 y624 | Accepted — fresh Sol medium review. |
| [20-agents](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/20-agents.png) | `37ef3f6ab5ef30a6839c05bf12e815c551793fb65e9d32130f83820c0bec393a`<br>1024×1536 | `/agents`<br>Built-in agent | [20-agents](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/20-agents.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/20-agents-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0 | Header bottom y93; rail width251; title x281 y162; fixed rules x281 y310; instructions x281 y895 | Accepted — fresh Sol medium review. |
| [21-agent-advanced](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/21-agent-advanced.png) | `6bfdf071ecce94d104df6866b53d14de836f8a3ad17dc8d9c9bf8b9b2c8c9ea2`<br>1024×1536 | `/agents`<br>Advanced/custom agent | [21-agent-advanced](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/21-agent-advanced.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/21-agent-advanced-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 995.4545288085938<br>[21-agent-custom-dirty](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/21-agent-custom-dirty.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/21-agent-custom-dirty-geometry.json) · 1024×1536; scale 1.100000023841858; scrollY 55.909088134765625<br>[21-agent-lower](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/21-agent-lower.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/21-agent-lower-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 2494.0908203125 | Header bottom y66; rail width237; title x268 y132; instructions x268 y328; advanced models x268 y798 | Accepted — fresh Sol medium review. |
| [22-automations](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/22-automations.png) | `34036c8c3b65cfd59311978f573ee60cc95f718b3a20b927131e514e16f3c02a`<br>1024×1536 | `/automations`<br>Saved schedules and composer | [22-automations-composer](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/22-automations-composer.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/22-automations-composer-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 1087.272705078125<br>[22-automations](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/22-automations.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/22-automations-geometry.json) · 1024×1536; scale 1.100000023841858; scrollY 0 | Header bottom y86; title x40 y134; empty panels y288; composer x39 y525; schedule rows x39 y1157 | Accepted — fresh Sol medium review. |
| [23-settings-models](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/23-settings-models.png) | `35ea130a2c4724958e5eece78b3de1600b1b766ecd7f33a4512e353f2b3da5e8`<br>1024×1536 | `/settings`<br>Model, model providers, Watch providers | [23-settings-model-providers](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/23-settings-model-providers.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/23-settings-model-providers-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0<br>[23-settings-models](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/23-settings-models.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/23-settings-models-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0<br>[23-settings-watch-providers](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/23-settings-watch-providers.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/23-settings-watch-providers-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0 | Header bottom y106; rail x18 width238; title x296 y156; model card x297 y345; options x297 y517 | Accepted — fresh Sol medium review. |
| [24-settings-research](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/24-settings-research.png) | `a16b9ca87ace7c8a195523baa28d71438ac3b2b85dce1b7bd913b00be9761b97`<br>902×1744 | `/settings`<br>Research, files, document review | [24-settings-document-review](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/24-settings-document-review.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/24-settings-document-review-geometry.json) · 902×1091; scale 1.100000023841858; scrollY 0<br>[24-settings-files](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/24-settings-files.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/24-settings-files-geometry.json) · 902×1091; scale 1.100000023841858; scrollY 0<br>[24-settings-research](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/24-settings-research.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/24-settings-research-geometry.json) · 902×1091; scale 1.100000023841858; scrollY 0 | Header bottom y92; rail width217; title x264 y140; research heading y294; primary selector x264 y369 | Accepted — fresh Sol medium review. |
| [25-settings-content](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/25-settings-content.png) | `47fb2a5015d5575fad9c7af4744b361fd036f752d81148fd4775e3177f47184c`<br>1024×1536 | `/settings`<br>Company and answer contract | [25-settings-answer-contract](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/25-settings-answer-contract.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/25-settings-answer-contract-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0<br>[25-settings-company](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/25-settings-company.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/25-settings-company-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0<br>[25-settings-company-lower](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/25-settings-company-lower.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/25-settings-company-lower-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 606.8181762695312 | Header bottom y87; rail width215; title x249 y130; company name x249 y256; answer contract x233 y1194 | Accepted — fresh Sol medium review. |
| [26-settings-vaults](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/26-settings-vaults.png) | `23fe80078b525bcaeb795ac2bb2ff26ca387eb65b8844941dd9403ecaa7a4967`<br>1024×1536 | `/settings`<br>Vault and local roster | [26-settings-vaults](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/26-settings-vaults.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/26-settings-vaults-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 10.454545021057127 | Header bottom y74; rail width294; title x331 y112; current vault x331 y299; load path x331 y557 | Accepted — fresh Sol medium review. |
| [27-research-reader](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/27-research-reader.png) | `826d345f2a391edce07bbd43557968851df3f49c80b638dbfb4aea27c35125fa`<br>1024×1536 | `/matters/MAT-DEMO-APEX/research?file=03_Matters%2Fproject-apex-ai%2Fresearch%2Fphase2-process.md`<br>Research reader and source | [27-research-reader](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/27-research-reader.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/27-research-reader-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0<br>[27-research-unverified-source](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/27-research-unverified-source.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/27-research-unverified-source-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 736.8181762695312 | Header bottom y86; title x39 y194; generated summary x39 y297; reading x35 y507 width669; source rail x719 y507 width261 | Accepted — fresh Sol medium review. |
| [28-research-notes](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/28-research-notes.png) | `e0d3352a9b120123cff269bff7064abf39dea7850febd4e418c19b003b6c9c13`<br>1024×1536 | `/matters/MAT-DEMO-APEX/research?file=03_Matters%2Fproject-apex-ai%2Fresearch%2Fphase2-process.md`<br>Notes and questions | [28-research-notes](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/28-research-notes.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/28-research-notes-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 408.6363525390625<br>[28-research-notes-lower](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/28-research-notes-lower.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/28-research-notes-lower-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 492.7272644042969 | Header bottom y82; title x28 y195; queue x26 y293; notes panel x26 y630; first note x42 y689 | Accepted — fresh Sol medium review. |
| [29-skill-guided](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/29-skill-guided.png) | `1bad28f53bc97cb81b2e4e12a0295184dfe18c34ac1edb8cbcf8797c10ef5a9e`<br>1024×1536 | `/skills`<br>Guided goal, question, result | [29-skill-guided-goal](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/29-skill-guided-goal.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/29-skill-guided-goal-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0<br>[29-skill-guided-question](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/29-skill-guided-question.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/29-skill-guided-question-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0<br>[29-skill-guided-result](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/29-skill-guided-result.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/29-skill-guided-result-geometry.json) · 1024×1091; scale 1.100000023841858; scrollY 0 | Header bottom y83; title x35 y186; steps y251; active goal card x35 y301; Continue x123 y594 | Accepted with nonblocking variance — see final-review.md. |

## Actual measured landmarks

Each reference lists eight distinct measured elements where available. Measurements prefer its primary capture and then associated states. Hidden style/switcher nodes are omitted. Linked JSON retains the full measured set.

### 01-today

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 01-today-top | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1014.55 | 84.00 | 15px |
| 01-today-top | MAIN Daily attention queueSeptember 6, 2026Nine things need your | 0.00 | 84.00 | 1014.55 | 3496.39 | 15px |
| 01-today-top | H1 Nine things need your attention | 24.00 | 203.37 | 966.55 | 58.00 | 50px |
| 01-today-top | H2 Team work | 24.00 | 386.26 | 105.43 | 27.73 | 20px |
| 01-today-top | H2 Harbor: Account Hold Support Response | 108.90 | 490.43 | 472.76 | 59.99 | 24px |
| 01-today-top | BUTTON ⌄ | 949.64 | 486.43 | 20.00 | 165.38 | 30px |
| 01-today-top | H2 Pulse: Earned Wage Access Expansion | 108.90 | 1074.14 | 472.76 | 29.99 | 24px |
| 01-today-top | BUTTON › | 949.64 | 1070.14 | 20.00 | 166.92 | 30px |

### 02-today-practice

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 02-today-practice | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | -2418.64 | 854.55 | 174.33 | 15px |
| 02-today-practice | MAIN Daily attention queueSeptember 6, 2026Nine things need your | 0.00 | -2244.30 | 854.55 | 3912.71 | 15px |
| 02-today-practice | H1 Nine things need your attention | 24.00 | -2124.93 | 806.55 | 58.00 | 50px |
| 02-today-practice | H2 Team work | 24.00 | -1942.05 | 105.43 | 27.73 | 20px |
| 02-today-practice | H2 Harbor: Account Hold Support Response | 108.90 | -1837.88 | 312.76 | 59.99 | 24px |
| 02-today-practice | BUTTON ⌄ | 789.64 | -1841.87 | 20.00 | 196.92 | 30px |
| 02-today-practice | H2 Pulse: Earned Wage Access Expansion | 108.90 | -1192.62 | 312.76 | 59.99 | 24px |
| 02-today-practice | BUTTON › | 789.64 | -1196.62 | 20.00 | 219.32 | 30px |

### 03-workspace-board

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 03-workspace-board | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1014.55 | 84.00 | 15px |
| 03-workspace-board | MAIN Portfolio boardSee where the work stands10 matters in flight | 0.00 | 84.00 | 1014.55 | 2203.37 | 15px |
| 03-workspace-board | H1 See where the work stands | 32.00 | 143.49 | 568.84 | 54.72 | 48px |
| 03-workspace-board | SECTION Drag to move active work. Close a matter from its page after | 32.00 | 266.20 | 950.55 | 1653.67 | 15px |
| 03-workspace-board | SECTION Just came in41 overdue · 3 waitingWaiting on LawyerPhase 2 c | 32.00 | 309.74 | 227.14 | 921.26 | 15px |
| 03-workspace-board | HEADER Just came in4 | 44.90 | 322.65 | 201.33 | 36.80 | 14px |
| 03-workspace-board | SECTION Being researched21 overdue · 1 waitingOverdueNorthstar: AI C | 273.13 | 309.74 | 227.14 | 921.26 | 15px |
| 03-workspace-board | HEADER Being researched2 | 286.04 | 322.65 | 201.33 | 36.80 | 14px |

### 04-workspace-quarter

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 04-workspace-quarter | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | -1578.64 | 1014.55 | 84.00 | 15px |
| 04-workspace-quarter | MAIN Portfolio boardSee where the work stands10 matters in flight | 0.00 | -1494.64 | 1014.55 | 2585.73 | 15px |
| 04-workspace-quarter | H1 See where the work stands | 32.00 | -1435.14 | 568.84 | 54.72 | 48px |
| 04-workspace-quarter | SECTION Drag to move active work. Close a matter from its page after | 32.00 | -1312.44 | 950.55 | 1692.75 | 15px |
| 04-workspace-quarter | SECTION Just came in41 overdue · 3 waitingWaiting on LawyerPhase 2 c | 32.00 | -1268.89 | 227.14 | 960.34 | 15px |
| 04-workspace-quarter | HEADER Just came in4 | 44.90 | -1255.99 | 201.33 | 36.80 | 14px |
| 04-workspace-quarter | SECTION Being researched21 overdue · 1 waitingOverdueNorthstar: AI C | 273.13 | -1268.89 | 227.14 | 960.34 | 15px |
| 04-workspace-quarter | HEADER Being researched2 | 286.04 | -1255.99 | 201.33 | 36.80 | 14px |

### 05-matters-table

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 05-matters-table | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1014.55 | 84.00 | 15px |
| 05-matters-table | MAIN Your matters10 in flight / 2 closedMatter viewTableStagesNew | 0.00 | 84.00 | 1014.55 | 2365.43 | 15px |
| 05-matters-table | H1 Your matters | 32.00 | 124.00 | 278.64 | 54.72 | 48px |
| 05-matters-table | BUTTON 6overdue | 32.00 | 324.15 | 177.32 | 89.01 | 15px |
| 05-matters-table | BUTTON 4waiting | 225.31 | 324.15 | 177.32 | 89.01 | 15px |
| 05-matters-table | BUTTON 0with Themis.ai | 418.62 | 324.15 | 177.32 | 89.01 | 15px |
| 05-matters-table | BUTTON 0needs assignment | 611.92 | 324.15 | 177.32 | 89.01 | 15px |
| 05-matters-table | BUTTON 0no action needed | 805.23 | 324.15 | 177.32 | 89.01 | 15px |

### 06-matters-stages

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 06-matters-stages | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1014.55 | 84.00 | 15px |
| 06-matters-stages | MAIN All matters by stage10 in flight / 2 closedMatter viewTableS | 0.00 | 84.00 | 1014.55 | 1996.69 | 15px |
| 06-matters-stages | H1 All matters by stage | 32.00 | 124.00 | 422.44 | 54.72 | 48px |
| 06-matters-stages | BUTTON 6overdue | 32.00 | 324.15 | 177.32 | 89.01 | 15px |
| 06-matters-stages | BUTTON 4waiting | 225.31 | 324.15 | 177.32 | 89.01 | 15px |
| 06-matters-stages | BUTTON 0with Themis.ai | 418.62 | 324.15 | 177.32 | 89.01 | 15px |
| 06-matters-stages | BUTTON 0needs assignment | 611.92 | 324.15 | 177.32 | 89.01 | 15px |
| 06-matters-stages | BUTTON 0no action needed | 805.23 | 324.15 | 177.32 | 89.01 | 15px |

### 07-new-matter

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 07-new-matter | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | -2297.73 | 1014.55 | 84.00 | 15px |
| 07-new-matter | MAIN Portfolio boardSee where the work stands10 matters in flight | 0.00 | -2213.73 | 1014.55 | 3304.55 | 15px |
| 07-new-matter | H1 See where the work stands | 32.00 | -2154.23 | 568.84 | 54.72 | 48px |
| 07-new-matter | SECTION Drag to move active work. Close a matter from its page after | 32.00 | -2031.53 | 950.55 | 1692.75 | 15px |
| 07-new-matter | SECTION Just came in41 overdue · 3 waitingWaiting on LawyerPhase 2 c | 32.00 | -1987.98 | 227.14 | 960.34 | 15px |
| 07-new-matter | HEADER Just came in4 | 44.90 | -1975.08 | 201.33 | 36.80 | 14px |
| 07-new-matter | SECTION Being researched21 overdue · 1 waitingOverdueNorthstar: AI C | 273.13 | -1987.98 | 227.14 | 960.34 | 15px |
| 07-new-matter | HEADER Being researched2 | 286.04 | -1975.08 | 201.33 | 36.80 | 14px |

### 08-decisions

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 08-decisions | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1014.55 | 84.00 | 15px |
| 08-decisions | MAIN Recorded decisions3 recorded · 2 need reviewDecision filterA | 0.00 | 84.00 | 1014.55 | 2423.47 | 15px |
| 08-decisions | H1 Recorded decisions | 38.00 | 115.99 | 749.95 | 52.79 | 48px |
| 08-decisions | BUTTON Check sources again | 811.95 | 123.99 | 164.60 | 48.00 | 14px |
| 08-decisions | SECTION Decision review packetsNeeds review · Synthetic process revi | 38.00 | 1888.94 | 938.55 | 490.79 | 15px |
| 08-decisions | H2 Decision review packets | 38.91 | 1889.85 | 936.73 | 64.99 | 15px |
| 08-decisions | SECTION Themis.ai · Not yet reviewed by an attorneyReview a change t | 38.91 | 2021.25 | 936.73 | 1384.06 | 15px |
| 08-decisions | HEADER Themis.ai · Not yet reviewed by an attorneyReview a change t | 62.90 | 2048.15 | 888.74 | 74.78 | 15px |

### 09-decision-review

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 09-decision-review | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | -2291.82 | 854.55 | 174.33 | 15px |
| 09-decision-review | MAIN Recorded decisions3 recorded · 1 need reviewDecision filterA | 0.00 | -2117.49 | 854.55 | 3957.03 | 15px |
| 09-decision-review | H1 Recorded decisions | 38.00 | -2085.49 | 589.95 | 52.79 | 48px |
| 09-decision-review | BUTTON Check sources again | 651.95 | -2077.49 | 164.60 | 48.00 | 14px |
| 09-decision-review | SECTION Decision review packetsResolved · Synthetic process review 3 | 38.00 | -163.05 | 778.55 | 1874.85 | 15px |
| 09-decision-review | H2 Decision review packets | 38.91 | -162.14 | 776.73 | 64.99 | 15px |
| 09-decision-review | SECTION Themis.aiReview a change to the recorded basisResolved · tod | 38.91 | -30.74 | 776.73 | 819.34 | 15px |
| 09-decision-review | HEADER Themis.aiReview a change to the recorded basis | 62.90 | -3.84 | 728.74 | 74.78 | 15px |

### 10-briefing

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 10-briefing | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1014.55 | 84.00 | 15px |
| 10-briefing | MAIN Briefing overviewStay current without losing your placeTrack | 0.00 | 84.00 | 1014.55 | 1337.93 | 15px |
| 10-briefing | HEADER Briefing overviewStay current without losing your placeTrack | 28.00 | 125.99 | 576.81 | 200.43 | 15px |
| 10-briefing | H1 Stay current without losing your place | 28.00 | 155.45 | 576.81 | 111.99 | 50px |
| 10-briefing | BUTTON Save this view | 861.74 | 1361.94 | 124.81 | 38.00 | 14px |
| 10-briefing | BUTTON 2Everything | 28.91 | 327.34 | 143.97 | 51.08 | 14px |
| 10-briefing | BUTTON 1Needs your review | 172.88 | 327.34 | 194.07 | 51.08 | 14px |
| 10-briefing | BUTTON 2Unread | 366.95 | 327.34 | 122.32 | 51.08 | 14px |

### 11-briefing-reader

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 11-briefing-reader | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 854.55 | 174.33 | 15px |
| 11-briefing-reader | MAIN ← Back to BriefingBriefing · Alternative data and automated | 0.00 | 174.33 | 854.55 | 2386.48 | 15px |
| 11-briefing-reader | HEADER Briefing · Alternative data and automated credit decisionsRe | 32.00 | 277.87 | 790.55 | 588.20 | 15px |
| 11-briefing-reader | H1 Reading only — alternative-data explanation practices | 32.00 | 316.41 | 790.55 | 110.38 | 48px |
| 11-briefing-reader | SECTION What changedReview the public guidance and industry discussi | 32.00 | 894.07 | 790.55 | 171.49 | 15px |
| 11-briefing-reader | H2 What changed | 32.00 | 924.07 | 790.55 | 37.50 | 30px |
| 11-briefing-reader | SECTION Why this was shownThe Alternative data Watch matched its pub | 32.00 | 1065.56 | 790.55 | 171.49 | 15px |
| 11-briefing-reader | H2 Why this was shown | 32.00 | 1095.56 | 790.55 | 37.50 | 30px |

### 12-briefing-digest

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 12-briefing-digest | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1014.55 | 84.00 | 15px |
| 12-briefing-digest | MAIN ← Back to BriefingDigest · frozen Sep 6, 2026, 12:53 AMSynth | 0.00 | 84.00 | 1014.55 | 1224.17 | 15px |
| 12-briefing-digest | HEADER Digest · frozen Sep 6, 2026, 12:53 AMSynthetic saved briefin | 42.00 | 183.54 | 930.55 | 145.26 | 15px |
| 12-briefing-digest | H1 Synthetic saved briefing | 42.00 | 222.08 | 513.84 | 55.19 | 48px |
| 12-briefing-digest | SECTION Agent work · Digest summaryA saved test view includes one av | 42.00 | 460.25 | 930.55 | 179.53 | 15px |
| 12-briefing-digest | H2 Reading only — alternative-data explanation practices | 306.90 | 706.68 | 646.75 | 67.60 | 26px |
| 12-briefing-digest | H2 Current item unavailable | 306.90 | 960.90 | 646.75 | 33.80 | 26px |

### 13-watches

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 13-watches | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1024.55 | 84.00 | 15px |
| 13-watches | MAIN Standing questions, kept in viewWatches keep the questions t | 0.00 | 84.00 | 1024.55 | 775.07 | 16px |
| 13-watches | H1 Standing questions, kept in view | 64.00 | 131.99 | 688.90 | 53.75 | 48px |
| 13-watches | SECTION Save draft, Scan now, or Start WatchSave draftSave your ques | 64.00 | 577.93 | 896.55 | 205.14 | 16px |
| 13-watches | H2 Save draft, Scan now, or Start Watch | 86.90 | 600.84 | 850.74 | 24.55 | 18px |
| 13-watches-empty | H2 No Watches yet | 384.62 | 467.70 | 255.31 | 43.20 | 36px |

### 14-watch-assignment

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 14-watch-assignment | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 877.27 | 174.33 | 15px |
| 14-watch-assignment | MAIN ‹ All WatchesWatch BuilderDefine the question to monitor, th | 0.00 | 174.33 | 877.27 | 3099.33 | 16px |
| 14-watch-assignment | H1 Watch Builder | 34.00 | 255.23 | 560.40 | 53.75 | 48px |
| 14-watch-assignment | SECTION AssignmentState what to watch and why it matters.Watch title | 34.91 | 465.38 | 807.46 | 712.88 | 16px |
| 14-watch-assignment | H2 Assignment | 52.90 | 489.38 | 771.46 | 24.55 | 18px |
| 14-watch-assignment | SECTION Public topics and scopeUse commas to separate values.Keyword | 34.91 | 1178.26 | 807.46 | 537.82 | 16px |
| 14-watch-assignment | H2 Public topics and scope | 52.90 | 1202.26 | 771.46 | 24.55 | 18px |
| 14-watch-assignment | SECTION Named sources and rolesSource type states what a source is. | 34.91 | 1716.08 | 807.46 | 171.04 | 16px |

### 15-watch-schedule

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 15-watch-schedule | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | -2862.27 | 1014.55 | 84.00 | 15px |
| 15-watch-schedule | MAIN ‹ All WatchesSynthetic process WatchSave draftScan nowStart | 0.00 | -2778.27 | 1014.55 | 3869.18 | 16px |
| 15-watch-schedule | H1 Synthetic process Watch | 34.00 | -2697.37 | 496.99 | 51.52 | 46px |
| 15-watch-schedule | BUTTON Save draft | 668.17 | -2697.37 | 95.62 | 44.00 | 15px |
| 15-watch-schedule | BUTTON Scan now | 772.79 | -2697.37 | 91.92 | 44.00 | 15px |
| 15-watch-schedule | BUTTON Start Watch | 873.71 | -2697.37 | 106.84 | 44.00 | 15px |
| 15-watch-schedule | BUTTON Hide settings | 34.00 | -2545.87 | 94.15 | 32.90 | 16px |
| 15-watch-schedule | SECTION AssignmentState what to watch and why it matters.Watch title | 34.91 | -1381.99 | 944.73 | 712.88 | 16px |

### 16-watch-detail

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 16-watch-detail | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1014.55 | 84.00 | 15px |
| 16-watch-detail | MAIN ‹ All WatchesSynthetic process WatchSave draftScan nowStart | 59.60 | 84.00 | 895.36 | 1441.38 | 16px |
| 16-watch-detail | H1 Synthetic process Watch | 93.59 | 164.90 | 496.99 | 51.52 | 46px |
| 16-watch-detail | BUTTON Save draft | 608.58 | 164.90 | 95.62 | 44.00 | 15px |
| 16-watch-detail | BUTTON Scan now | 713.20 | 164.90 | 91.92 | 44.00 | 15px |
| 16-watch-detail | BUTTON Start Watch | 814.11 | 164.90 | 106.84 | 44.00 | 15px |
| 16-watch-detail | BUTTON Change something | 93.59 | 316.41 | 133.32 | 32.90 | 16px |
| 16-watch-detail | SECTION Durable scan previewScan resultsPartial0 developments · 0 Br | 93.59 | 554.65 | 827.36 | 906.73 | 16px |

### 17-templates

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 17-templates | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1014.55 | 84.00 | 15px |
| 17-templates | MAIN Output templatesChoose how the business receives legal work. | 0.00 | 84.00 | 1014.55 | 1929.64 | 15px |
| 17-templates | H1 Output templates | 40.00 | 112.00 | 934.55 | 53.75 | 48px |
| 17-templates | BUTTON Output templates | 40.00 | 215.29 | 118.50 | 46.26 | 15px |
| 17-templates | BUTTON Reusable skills | 186.50 | 215.29 | 100.36 | 46.26 | 15px |
| 17-templates | SECTION Output templatesTemplates set reusable structure and guidanc | 40.00 | 284.46 | 934.55 | 1689.18 | 15px |
| 17-templates | HEADER Output templatesTemplates set reusable structure and guidanc | 798.08 | 132.00 | 176.47 | 38.00 | 15px |
| 17-templates | BUTTON Create blank template | 798.08 | 132.00 | 176.47 | 38.00 | 14px |

### 18-template-editor

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 18-template-editor | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | -159.09 | 938.18 | 126.61 | 15px |
| 18-template-editor | MAIN Output templatesReusable skills‹ Back to templatesOutput tem | 0.00 | -32.48 | 938.18 | 1918.57 | 15px |
| 18-template-editor | BUTTON Output templates | 40.00 | -4.48 | 118.50 | 46.26 | 15px |
| 18-template-editor | BUTTON Reusable skills | 186.50 | -4.48 | 100.36 | 46.26 | 15px |
| 18-template-editor | BUTTON ‹ Back to templates | 40.00 | 64.69 | 157.51 | 38.00 | 14px |
| 18-template-editor | SECTION Output template · output-business-decision-brief-copy-143145 | 40.00 | 126.68 | 858.18 | 1719.40 | 15px |
| 18-template-editor | HEADER Output template · output-business-decision-brief-copy-143145 | 40.00 | 126.68 | 858.18 | 112.14 | 15px |
| 18-template-editor | H2 Synthetic process brief | 40.00 | 154.13 | 513.37 | 55.19 | 48px |

### 19-skills

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 19-skills | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1014.55 | 84.00 | 15px |
| 19-skills | MAIN Output templatesReusable skills‹ Back to templatesOutput tem | 0.00 | 84.00 | 1014.55 | 2320.06 | 15px |
| 19-skills | BUTTON Output templates | 40.00 | 112.00 | 118.50 | 46.26 | 15px |
| 19-skills | BUTTON Reusable skills | 186.50 | 112.00 | 100.36 | 46.26 | 15px |
| 19-skills | ASIDE Your skills14OverviewSynthetic process briefBusiness Decisio | 40.00 | 181.16 | 299.05 | 2182.90 | 15px |
| 19-skills | BUTTON Overview | 40.00 | 229.52 | 276.14 | 37.09 | 14.5px |
| 19-skills | BUTTON Synthetic process briefBusiness Decision Brief/output-busine | 40.00 | 311.52 | 276.14 | 130.22 | 15px |
| 19-skills | BUTTON Business Decision BriefA short brief to help a business owne | 40.00 | 443.74 | 276.14 | 133.69 | 15px |

### 20-agents

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 20-agents | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1014.55 | 84.00 | 15px |
| 20-agents | ASIDE Agents5Themis.aiBuilt-inOn requestDecision MonitorBuilt-inOn | 0.00 | 84.00 | 250.00 | 2922.29 | 16px |
| 20-agents | BUTTON Themis.aiBuilt-inOn request | 14.00 | 149.27 | 221.09 | 107.53 | 16px |
| 20-agents | BUTTON Decision MonitorBuilt-inOn request | 14.00 | 256.80 | 221.09 | 107.53 | 16px |
| 20-agents | BUTTON Intake AgentBuilt-inOn request | 14.00 | 364.33 | 221.09 | 107.53 | 16px |
| 20-agents | BUTTON Process helper (test)Custom agentOn request | 14.00 | 471.85 | 221.09 | 128.44 | 16px |
| 20-agents | BUTTON Research AgentBuilt-inOn request | 14.00 | 600.29 | 221.09 | 107.53 | 16px |
| 20-agents | H1 Themis.ai | 278.00 | 144.18 | 213.28 | 53.75 | 48px |

### 21-agent-advanced

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 21-agent-advanced | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | -995.45 | 1014.55 | 84.00 | 15px |
| 21-agent-advanced | ASIDE Agents5Themis.aiBuilt-inOn requestDecision MonitorBuilt-inOn | 0.00 | -911.46 | 250.00 | 3501.06 | 16px |
| 21-agent-advanced | BUTTON Themis.aiBuilt-inOn request | 14.00 | -846.19 | 221.09 | 107.53 | 16px |
| 21-agent-advanced | BUTTON Decision MonitorBuilt-inOn request | 14.00 | -738.66 | 221.09 | 107.53 | 16px |
| 21-agent-advanced | BUTTON Intake AgentBuilt-inOn request | 14.00 | -631.13 | 221.09 | 107.53 | 16px |
| 21-agent-advanced | BUTTON Process helper (test)Custom agentOn request | 14.00 | -523.60 | 221.09 | 128.44 | 16px |
| 21-agent-advanced | BUTTON Research AgentBuilt-inOn request | 14.00 | -395.16 | 221.09 | 107.53 | 16px |
| 21-agent-advanced | H1 Process helper (test) | 278.00 | -851.28 | 434.32 | 53.75 | 48px |

### 22-automations

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 22-automations | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1014.55 | 84.00 | 15px |
| 22-automations | MAIN Work on a scheduleSet automations to run on a cadence so you | 0.00 | 84.00 | 1014.55 | 1690.65 | 16px |
| 22-automations | HEADER Work on a scheduleSet automations to run on a cadence so you | 40.00 | 122.00 | 934.55 | 89.29 | 16px |
| 22-automations | H1 Work on a schedule | 40.00 | 122.00 | 934.55 | 53.75 | 48px |
| 22-automations | SECTION Failed on its last runThese stopped doing their job. Read th | 40.00 | 307.73 | 934.55 | 231.62 | 16px |
| 22-automations | H2 Failed on its last run | 42.00 | 307.73 | 930.55 | 23.64 | 18px |
| 22-automations | BUTTON Pause schedule | 800.97 | 391.26 | 152.67 | 43.00 | 16px |
| 22-automations | BUTTON Retry now | 800.97 | 442.26 | 152.67 | 43.00 | 16px |

### 23-settings-models

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 23-settings-models | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1024.55 | 84.00 | 15px |
| 23-settings-models | ASIDE SettingsModelAnswer contractDocument reviewResearchFiles and | 18.91 | 104.91 | 238.00 | 944.09 | 15px |
| 23-settings-models | BUTTON Model | 28.91 | 180.89 | 217.09 | 52.00 | 16px |
| 23-settings-models | BUTTON Answer contract | 28.91 | 239.89 | 217.09 | 52.00 | 16px |
| 23-settings-models | BUTTON Document review | 28.91 | 298.88 | 217.09 | 52.00 | 16px |
| 23-settings-models | BUTTON Research | 28.91 | 357.87 | 217.09 | 52.00 | 16px |
| 23-settings-models | BUTTON Files and outputs | 28.91 | 416.86 | 217.09 | 52.00 | 16px |
| 23-settings-models | BUTTON Model providers | 28.91 | 475.85 | 217.09 | 52.00 | 16px |

### 24-settings-research

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 24-settings-research | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 892.73 | 174.33 | 15px |
| 24-settings-research | ASIDE SettingsModelAnswer contractDocument reviewResearchFiles and | 18.91 | 195.24 | 238.00 | 1285.55 | 15px |
| 24-settings-research | BUTTON Model | 28.91 | 271.23 | 217.09 | 52.00 | 16px |
| 24-settings-research | BUTTON Answer contract | 28.91 | 330.22 | 217.09 | 52.00 | 16px |
| 24-settings-research | BUTTON Document review | 28.91 | 389.21 | 217.09 | 52.00 | 16px |
| 24-settings-research | BUTTON Research | 28.91 | 448.20 | 217.09 | 52.00 | 16px |
| 24-settings-research | BUTTON Files and outputs | 28.91 | 507.19 | 217.09 | 52.00 | 16px |
| 24-settings-research | BUTTON Model providers | 28.91 | 566.19 | 217.09 | 52.00 | 16px |

### 25-settings-content

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 25-settings-answer-contract | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1014.55 | 84.00 | 15px |
| 25-settings-answer-contract | ASIDE SettingsModelAnswer contractDocument reviewResearchFiles and | 18.91 | 104.91 | 238.00 | 955.60 | 15px |
| 25-settings-answer-contract | BUTTON Model | 28.91 | 180.89 | 217.09 | 52.00 | 16px |
| 25-settings-answer-contract | BUTTON Answer contract | 28.91 | 239.89 | 217.09 | 52.00 | 16px |
| 25-settings-answer-contract | BUTTON Document review | 28.91 | 298.88 | 217.09 | 52.00 | 16px |
| 25-settings-answer-contract | BUTTON Research | 28.91 | 357.87 | 217.09 | 52.00 | 16px |
| 25-settings-answer-contract | BUTTON Files and outputs | 28.91 | 416.86 | 217.09 | 52.00 | 16px |
| 25-settings-answer-contract | BUTTON Model providers | 28.91 | 475.85 | 217.09 | 52.00 | 16px |

### 26-settings-vaults

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 26-settings-vaults | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | -10.45 | 1014.55 | 84.00 | 15px |
| 26-settings-vaults | ASIDE SettingsModelAnswer contractDocument reviewResearchFiles and | 18.91 | 94.45 | 238.00 | 978.55 | 15px |
| 26-settings-vaults | BUTTON Model | 28.91 | 170.44 | 217.09 | 52.00 | 16px |
| 26-settings-vaults | BUTTON Answer contract | 28.91 | 229.43 | 217.09 | 52.00 | 16px |
| 26-settings-vaults | BUTTON Document review | 28.91 | 288.42 | 217.09 | 52.00 | 16px |
| 26-settings-vaults | BUTTON Research | 28.91 | 347.41 | 217.09 | 52.00 | 16px |
| 26-settings-vaults | BUTTON Files and outputs | 28.91 | 406.41 | 217.09 | 52.00 | 16px |
| 26-settings-vaults | BUTTON Model providers | 28.91 | 465.40 | 217.09 | 52.00 | 16px |

### 27-research-reader

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 27-research-reader | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1014.55 | 84.00 | 15px |
| 27-research-reader | MAIN ‹ Back to matterBusiness question · Project Apex: AI Voice T | 0.00 | 84.00 | 1014.55 | 1743.66 | 15px |
| 27-research-reader | HEADER Business question · Project Apex: AI Voice TelemetryReview t | 40.00 | 155.54 | 934.55 | 119.72 | 15px |
| 27-research-reader | H1 Review the proposed process | 40.00 | 186.99 | 565.36 | 49.28 | 44px |
| 27-research-reader | SECTION Agent work · 3 cited sourcesThemis.ai prepared this working | 40.00 | 301.25 | 934.55 | 140.65 | 15px |
| 27-research-reader | SECTION Research queue3 runs · 0 active · 3 saved packets6 saved sou | 40.00 | 469.90 | 934.55 | 425.52 | 15px |
| 27-research-reader | HEADER Research queue3 runs · 0 active · 3 saved packets6 saved sou | 60.91 | 490.81 | 892.73 | 41.95 | 15px |
| 27-research-reader | BUTTON Run research | 834.18 | 602.39 | 109.45 | 33.08 | 13.5px |

### 28-research-notes

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 28-research-notes | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | -408.64 | 1014.55 | 84.00 | 15px |
| 28-research-notes | MAIN ‹ Back to matterBusiness question · Project Apex: AI Voice T | 0.00 | -324.64 | 1014.55 | 2179.05 | 15px |
| 28-research-notes | HEADER Business question · Project Apex: AI Voice TelemetryReview t | 40.00 | -253.10 | 934.55 | 119.72 | 15px |
| 28-research-notes | H1 Review the proposed process | 40.00 | -221.65 | 565.36 | 49.28 | 44px |
| 28-research-notes | SECTION Agent work · 3 cited sourcesThemis.ai prepared this working | 40.00 | -107.39 | 934.55 | 140.65 | 15px |
| 28-research-notes | SECTION Research queue3 runs · 0 active · 3 saved packets6 saved sou | 40.00 | 61.26 | 934.55 | 425.52 | 15px |
| 28-research-notes | HEADER Research queue3 runs · 0 active · 3 saved packets6 saved sou | 60.91 | 82.17 | 892.73 | 41.95 | 15px |
| 28-research-notes | BUTTON Run research | 834.18 | 193.75 | 109.45 | 33.08 | 13.5px |

### 29-skill-guided

| Capture | Element / text | x | y | width | height | font |
|---|---|---:|---:|---:|---:|---|
| 29-skill-guided-goal | HEADER themis.aiTodayBriefingWorkspaceMattersDecisionsSkillsAutomat | 0.00 | 0.00 | 1024.55 | 84.00 | 15px |
| 29-skill-guided-goal | MAIN Output templatesReusable skills‹ Back to templatesOutput tem | 0.00 | 84.00 | 1024.55 | 840.46 | 15px |
| 29-skill-guided-goal | BUTTON Output templates | 40.00 | 112.00 | 118.50 | 46.26 | 15px |
| 29-skill-guided-goal | BUTTON Reusable skills | 186.50 | 112.00 | 100.36 | 46.26 | 15px |
| 29-skill-guided-goal | HEADER ‹ All skillsReusable skill builderLet’s build your skill1The | 40.00 | 181.16 | 944.55 | 202.19 | 15px |
| 29-skill-guided-goal | BUTTON ‹ All skills | 40.00 | 181.16 | 95.02 | 42.00 | 14px |
| 29-skill-guided-goal | H1 Let’s build your skill | 40.00 | 274.61 | 944.55 | 53.75 | 48px |
| 29-skill-guided-goal | H1 What do you want to make easier? | 108.91 | 482.80 | 806.73 | 32.50 | 26px |

## Responsive evidence

These are separate viewport probes. They are not native-reference matches. Overflow values are from the recorded collector; they do not prove every element is usable.

| Capture / geometry | Route | Viewport | Scale | ScrollY | Recorded horizontal overflow |
|---|---|---|---|---|---|
| [responsive-briefing-reader-390](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/responsive-briefing-reader-390.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/responsive-briefing-reader-390-geometry.json) | `/briefing/ITEM-DEMO-ALTERNATIVE-DATA-BRIEFING?q=Reading+only&read=any&saved=any&company_connection=any&packet=any&sort=newest&group=none&limit=25` | 390×1091 | 1.100000023841858 | 1303.6363525390625 | False |
| [responsive-matters-390](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/responsive-matters-390.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/responsive-matters-390-geometry.json) | `/matters` | 390×1091 | 1.100000023841858 | 0 | False |
| [responsive-research-390](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/responsive-research-390.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/responsive-research-390-geometry.json) | `/matters/MAT-DEMO-APEX/research?file=03_Matters%2Fproject-apex-ai%2Fresearch%2Fphase2-process.md` | 390×1091 | 1.100000023841858 | 408.6363525390625 | False |
| [responsive-research-768](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/responsive-research-768.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/responsive-research-768-geometry.json) | `/matters/MAT-DEMO-APEX/research?file=03_Matters%2Fproject-apex-ai%2Fresearch%2Fphase2-process.md` | 768×1091 | 1.100000023841858 | 408.6363525390625 | False |
| [responsive-settings-390](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/responsive-settings-390.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/responsive-settings-390-geometry.json) | `/settings` | 390×1091 | 1.100000023841858 | 0 | False |
| [responsive-template-editor-390](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/responsive-template-editor-390.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/responsive-template-editor-390-geometry.json) | `/skills` | 390×1091 | 1.100000023841858 | 954.0908813476562 | False |
| [responsive-today-1440](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/responsive-today-1440.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/responsive-today-1440-geometry.json) | `/` | 1440×1091 | 1.100000023841858 | 0 | False |
| [responsive-today-390](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/responsive-today-390.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/responsive-today-390-geometry.json) | `/` | 390×1091 | 1.100000023841858 | 0 | False |
| [responsive-today-768](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/responsive-today-768.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/responsive-today-768-geometry.json) | `/` | 768×1091 | 1.100000023841858 | 0 | False |
| [responsive-workspace-390](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/responsive-workspace-390.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/responsive-workspace-390-geometry.json) | `/workspace` | 390×1091 | 1.100000023841858 | 0 | False |

## Keyboard evidence

| Capture | Viewport / scale / scroll | Evidence limit |
|---|---|---|
| [keyboard-nav-390](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/screenshots/keyboard-nav-390.png) · [geometry](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2-implementation/keyboard-nav-390-geometry.json) | 390×1091; 1.100000023841858; scrollY 0 | Static capture and geometry. The JSON does not record focused element or key sequence; defer behavior conclusions to coordinator browser notes. |

## Review constraints

Accepted — fresh Sol medium review. Dynamic content and expanded forms differ from the sample composites. No data or reviewer verdict was invented. Native-width comparison still requires accounting for the recorded scale. The coordinator owns final visual and keyboard acceptance.


Final supplemental evidence: `screenshots/preview-origin-draft-body-final.png` shows the loaded Markdown content. `keyboard-table-390.png` records a focused labelled local table scroller after ArrowRight; the browser reported a visible 1.818 px outline and nonzero scrollLeft. `today-discuss-target.png` and `today-draft-target.png` record the selected Harbor views after actual Today clicks. `intake-created-conversation.png` shows the saved retry request and answer.
