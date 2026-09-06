# Matter screen survey and A-style design set

Status: 47 actual in-app browser screenshots and 12 separate raster design concepts delivered. Main views and lower-page sections were surveyed. This is not complete interaction-state coverage: missing dialogs and populated states are listed below. No application code was changed. No test suites, builds, commits, deployments, or service restarts were performed for this design pass.

## Deliverables

- [All 47 live screenshots](screenshots.md), grouped by surface and scroll position.
- [All 12 A-style design images](designs.md), each a separate readable portrait image.
- [Image manifest](designs/manifest.json), with absolute project paths and original generated-image paths.
- [Generation specifications](prompts.json) and [design brief](design-brief.md).
- Detailed inventories: [Understand](understand/inventory.md), [Discuss](discuss/inventory.md), [Draft](draft/inventory.md), [Map](map/inventory.md).

The selected A reference was inspected before generation. Built-in imagegen produced every concept and correction. Root inspected every result. No HTML mockup or image-editing script was substituted. Images are visual proposals using sample content; they are not screenshots of implemented behavior or legal research.

## Actual routing and ownership

Root used Astra for coordination, direct map survey, image generation, integration and visual review. Three coding subagents used exact `gpt-5.6-luna` with medium reasoning: `survey_understand`, `survey_discuss`, `survey_draft`. All launches succeeded. Maximum three active workers, no worker spawning, no separate user-visible tasks. Workers used separate in-app tabs without viewport changes. Their only assigned outputs were their named subdirectories. Draft initially saved screenshots one directory too high; they were moved into its assigned directory and links corrected. Root owned the map, combined reports, generated images, and incident recovery.

## Coverage and workflow mapping

| Live surface / workflow | What was inspected | Design destination |
| --- | --- | --- |
| Matter shell | State, stage, risk menu, due date, work banner, tabs, tools disclosure | Shared compact header, 01 Understand |
| Understand | Full question/answer, qualification, next action, three review cards, six-issue list, complete page scroll | 01 Understand |
| Issue detail | Explanation, edit disclosure, business effect, source gap, linked-question gap, mitigation, disposition history, map/discuss links | 02 Issue |
| Conversation | Scope and target, long transcript, earlier intake disclosures, recorded action links, recent actions, suggestions, composer | 03 Discuss |
| Draft | Document picker, zero work products, one source, 20 records, editor modes, formatting, author, markup controls, comments empty, save/export controls, draft request | 04 Draft |
| Source reading | Request preview, exact passage unavailable, revision/path, explicit context-use action; one unavailable generated reference | 05 Source |
| Decision map | Local 7 records / whole 34, Fit, visual issue selection, full detail, expanded outline, bottom conversation, return to same issue | 06 Map |
| Hypothetical | Fact selector, changed-value field, analysis question, Cancel, empty saved scenarios; separate real-fact correction disclosure | 07 Scenario |
| Research and work | Research queue including Partial, work roles/priority/owner actions, participants, artifacts, records, materials/activity | 08 Work |
| Other lower sections | Question editing/history, inquiry modes, unsaved business flow, prior-work query, practice notes, assumption watches | 09 Explore |
| File context | Matter files/Inquiry context, library versus inquiry upload, search/folder view, three generated outputs, explicit next-inquiry selection | 10 Tools |
| Business replies | Supporting question, local request text, requested person/date, disabled prepare/copy | 11 Business |
| Handoff | Exact scope, recipient empty, ask/basis/questions/date, included references, disabled creation, brief control | 11 Business |
| Comparison | Earlier/current selectors, saved earlier-work checkboxes after load, source-only state, disabled prepare, empty result | 12 Compare |
| Templates | Eleven template choices, default/version labels, create control, inspect/copy/edit/default/preview guidance | 12 Compare secondary library; access from 04 and 10 |

Primary flow: Understand → selected issue → support / linked questions / mitigation / explicit disposition. Map opens separately and returns to the same issue and conversation. Discuss preserves a visible target. Draft keeps work products, sources, and records distinguishable. Reading a source is separate from adding it to an inquiry. Secondary workflows are reachable through named rows and Tools & history. They are reorganized in the concepts, not removed.

The concepts abbreviate repetitive rows and source text. The detailed live inventories remain the authority for individual controls; these images are not a pixel-perfect implementation specification. The populated two-draft/unsaved example and flow actors are sample content. They were not created in the reference matter. Full comments/redline review, saved scenario comparison/adoption, and durable-decision dialogs are not represented as newly observed populated states.

## Findings that changed the design

The current header/work banner consumes much of the first viewport. Understand has many useful functions beneath several disclosures. The reference's long legacy issue titles and conversation make repeated cards costly to read. The whole-map Fit result reaches 10%, with labels too small to read; the outline is essential. Several panels have meaningful empty/disabled reasons that must remain visible. Suggested-question controls run an inquiry; they are not read-only previews. The new Discuss concept labels this action explicitly.

Do not equate a completed chat with a permanently disabled composer. The Discuss worker initially inferred that cause from a transient disabled state; root observed enabled controls on a completed conversation. The later change after load demonstrates why the initial inference was unsound. Earlier-work choices also populated after loading; the final comparison concept preserves them.

## Remaining coverage limits

- Opening new in-app tabs failed late in the survey. Root then tried `cua.getState()` to reuse existing tabs. It returned: “The Mac is locked and automatic unlock could not unlock it. Ask the user to unlock the Mac manually before continuing.” No tab inventory was available. No native-browser or OS workaround was used.
- The Record disposition and Record formal decision dialogs were not opened in this survey. Their entry controls were inspected. No submit was tested.
- No individual output-template detail was opened. Library choices and its inspect/copy/edit/default/preview guidance were observed; those operations remain unexercised.
- Some lower research/materials controls were read in the accessibility inventory but have only partial viewport screenshots. The follow-up capture pass was blocked.
- Reference data had no saved work products, comments, redlines, named scenarios, configured handoff recipients, linked issue questions, or recorded dispositions. Populated states were not fabricated in the live reference.
- No scenario analysis, fact correction, decision, work completion, document edit/export, upload, handoff, comparison, watch creation or template mutation was intentionally submitted. One accidental suggested inquiry was submitted and recovered, as documented below.
- Some generated-reference revision could not be read. The useful request source preview did load. No legal conclusion, source applicability, or citation was verified by this design survey.
- These are readable raster concepts, not an interactive prototype. They do not verify keyboard behavior, responsive implementation, or state preservation in future design code. No 200% zoom check was run.

## Accidental inquiry and exact recovery

The Discuss worker clicked “Which other matters does this touch?” despite the explicit no-submit scope. This created `RUN-20260905-462dab` at 20:01:01 UTC and appended a user/assistant pair to `CONV-20260904-469ac8.md`. It was an agent error, not an authorized reference-data test. Root disclosed it to the originating task and stopped browser work.

Root identified only the conversation and three new context/inquiry/run files as authoritative changes. A restoration candidate removed the accidental last two messages and rendered text, removed the newly projected `workspace_action` field from the prior final assistant message, and restored the prior update timestamp. Before writing, the candidate matched the original baseline SHA-256 exactly: `c2bf318f2c129b9f29efabc530f3f62e26fb12f94d681cb0cec5c4ebb8448389`.

Root backed up the incident conversation and all three new files to `incident-backup/`. Root restored the exact baseline conversation and removed only those three known new files from the vault after backup-byte comparisons. No whole-folder revert was used. [Post-recovery verification](protected-after-recovery.json): all 718 repository-vault files unchanged; all 1,026 reference-vault files unchanged except disposable `.counsel_os_cache.db`; no added files; active-vault pointer unchanged. The application cache was not force-rebuilt or services restarted. The accidental provider execution cannot be undone; its record evidence is preserved in the backup.

## Visual review and corrections

Root corrected generated images that introduced a mandatory source requirement for drafting, invented source files, a green unsupported-applicability check, a falsely cleared map issue, missing map-outline identity, unintended issue controls, false request-saved/prepared states, and a mandatory earlier-work comparison step. Root restored visible research/mitigation actions and moved the overview next action above the issue rows. Final images keep useful answers, optional sources/templates, explicit record actions, and the separation of source viewing from draft targeting.

Minor concept-level details still require normal design implementation judgment: exact dropdown contents, all repeated list rows, keyboard focus styles, global navigation compression, author palette, and narrow-screen stacking. They are preserved in the inventory rather than shown in every raster image. No image constitutes a legal conclusion or proof of functional correctness.

Final artifact check: all 12 final PNGs decode successfully using the repository Python environment; sizes and file lengths are recorded in `image-file-check.json`. The first helper attempt used a system Pillow build with the wrong CPU architecture and failed before inspecting files; switching to the existing repository environment passed. No dependency was installed.
