# Phase 2 frozen contract — 2026-09-06

Status: foundation accepted by independent Sol medium review. Reference hashes and native dimensions: reference-contract.json, copied from the selected manifest. Comparisons use measured native effective CSS width. Browser reports device scale1.1; viewport captures only because fullPage stitching is faulty. No CSS screenshot scaling is used.

## Measured foundation
Opened actual 01, 03, 17, 23, 27 PNGs. Shared header baseline approximately y=84 at 1024 width. Wordmark x=24–32, size 34–38. Navigation horizontal, icons 20–24, 13–15 labels, ink underline. Main x=24 in Today, 32 board, 40 research; section gap 24–32. Board native 1024 has four first-row columns (~230 wide), two second-row cells. Heading 48 desktop (Today can be 50). Research reading/source split ~70/30, source width 260. Settings native 1024 rail x=18 to256 (~238), detail x=296 (~680). Template reference 17 uses a full-width library table ABOVE selected detail at native 1024, not a forced side-by-side rail; preserve its stable index and selected detail hierarchy. This image-based clarification overrides the suggested narrow library rail where incompatible.

## Shared rules
Use existing Source Serif 4 / IBM Plex Sans / IBM Plex Mono variables, current semantic CSS variables. Ink #071421, agent #4922ff / wash #faf8ff / edge #b4a3ff; attention/healthy/failure existing roles. No new page-local attention values. Neutral human/selection surfaces; purple dashed only generated work. Dynamic records, no reference facts seeded in production.

Coordinator owns AppShell, Phase2Shell.module.css, Phase2Icon.tsx, Phase2.module.css, conditional next.config.ts. No globals changes needed. Route rule: exact /matters/:id/research gets full header; other matter descendants retain existing compact chrome. Canonical nav Today, Briefing, Workspace, Matters, Decisions, Skills, Automations, Agents, Settings. Watches selects Briefing. Narrow navigation wraps visibly. Existing identity remains.

Phase2.module.css exports page, heading, lede, panel, stack, railLayout, agent. Workers may import these or own local modules; never change shared module. Scoped local CSS only. Preserve default Matter visuals. Optional local intersection presentation?: "matter" | "phase2", default "matter", on ReviewPacketPanel, ResearchQueuePanel, OutputTemplateLibrary, OutputTemplateEditor, SkillBuilder, WatchBuilder; pass to SourceRoleEditor/WatchScanPreview if altered. Do not edit workspaceTypes.ts. Preserve hooks and state owners; only opt-in routes change visual rendering.

## Current API anchors
NewMatterForm onCreate(payload: MatterCreatePayload): Promise<void>, busy:boolean. Retain sourceActionKey, submitLocked, matterTargetDateFromForm, getSettings lawyer lookup, failed data and retry key.
ReviewPacketPanel packet:ReviewPacket; matterId?:string|null; mitigations?:Mitigation[]; onChanged?:()=>void|Promise<void>. actOnReviewPacket(packet.packet_id,payload) keeps expected_revision and all five conditional payloads. Mitigation separate.
ResearchQueuePanel items:ResearchRun[], mode?:controls|summary default controls, all existing callbacks and question inputs. Presentation is independent of mode; keep default summary caller semantics.
Template public prop types remain intact with local intersection. Save changes and expected_revision; preview template+overrides; open artifact path. Capture originating matter with returned preview.
SkillBuilder preserves initialGoal, initialDraft, onSaveDraft and home/goal/question/draft/edit/saved states. WatchBuilder preserves optional watchId and lifecycle. Workers must read exact owned callers/signatures before using them.
Frozen: MarkdownRichEditor, DocumentPanel, MatterTools.module.css, MatterWork.module.css, MatterWorkspace, Matter routes except research, map code, backend, API/type files. Propose any needed outside fix to coordinator.

## Approved raster corrections
Canonical nav/order/icons; canonical intake/research/explore/generate/respond/closed order; semantic neutral selection; actual validation/defaults; empty/populated and cadence/guided states separate; settings composites separate destinations/saves; restore Audience and full tools/conditional forms; true records and honest support; content page height; responsive/focus reflow. No other taste-based deviation.

## Ownership and checks
Exact ownership and waves from section 8 of docs/uiphase2-a-style-ui.handoff-prompt.md unchanged. Workers cannot spawn, run full builds/suites, restart services, mutate real vault, commit/push/deploy, alter lockfiles or other owners. Coordinator owns browser until assigned. Shared worktree baseline in baseline.diff and baseline-hashes.json. Existing map tasks idle. Workers inspect current diff before edits and report unexpected writes.
Runtime verified current turn_context gpt-6-astra low; tools advertise requested Astra low/Sol medium, three worker slots. All tests mutate only output/uiphase2-implementation/test-root. Isolated ActiveContextManager pointer supplied by harness, not merely VAULT_PATH. Frontend dev/build PHASE2_DIST_DIR explicit; default .next preserved. No unrelated service stops. 200% zoom waived by user; 1440/native/768/390 and keyboard remain required. Only required suite and affected focused checks once, repeat only for changed coverage.

Contract correction: 960–1200 compact single-row header, <=959 wrapped navigation below brand/identity. Phase2 roster uses a View as disclosure containing the unchanged local switcher; Matter remains unchanged. This small accessibility/functional exception preserves navigation proportions when roster is enabled. Header measured84 CSS px at effective1023 with roster disabled; enabled proof pending.
