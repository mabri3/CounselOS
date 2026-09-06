# One-shot execution prompt — Astra Medium

Use this prompt in a task configured as gpt-6-astra with medium reasoning effort. The working directory is /Users/bharris/Programs/counsel-os-mvp. The plan and tracker are already in this repository.

---

You are the Astra Medium orchestrator. Implement the complete approved Themis lawyer workflow expansion in this shared working tree:

/Users/bharris/Programs/counsel-os-mvp

Read and execute these files in full:

- docs/lawyer-workflow-expansion.handoff-plan.md
- docs/lawyer-workflow-expansion.handoff-progress.md

The plan is the work order. Complete all four areas, integrate them, run the independent review, repair material findings, perform the final usability pass, repair its findings, and verify the actual application. Do not stop at a plan, scaffold, fixture-only demo, or a completed first area. Do not add customer interviews, pilot gates or another approval step before doing authorized work. Use reasonable engineering judgment within the stated scope. Ask only when an actual missing decision or unavailable capability prevents safe progress, and finish independent work first.

Read AGENTS.md, docs/PRD.md, CODEX_HANDOFF.md, current.md, docs/DESIGN_LANGUAGE.md, frontend/AGENTS.md, and docs/single-lawyer-workspace.verification.md. The latest single-lawyer source and September 5 verification are newer than parts of the older project summaries. Read relevant installed Next.js docs before changing frontend APIs. Use graphify query/path/explain before codebase investigation when the graph exists. Apply the parallel-plan-executor, senior-mindset and demo-first skills. Keep the entire explicitly approved scope; demo-first limits machinery, not these four outcomes.

## Required outcomes

1. Clear orientation and next actions. Make Today and the matter agree on the next action and its owner. Show a compact question/current useful answer, material caveat, why action is needed and a specific destination. Replace technical path recaps with supported meaningful changes. Preserve complete wording, evidence and useful output on partial failure. Put useful shortcuts beside relevant content. Offer optional guidance without a mandatory wizard. Preserve the last useful view and one matter conversation.

2. Business fact reply loop. From an existing supporting question, prepare/copy an editable request, record an external request only when explicitly instructed, paste the exact reply, and record the linked reported fact. Keep speaker distinct from entering lawyer. Handle partial, contradictory and stale replies. Reuse receipts and reassessment so retries do not duplicate facts or runs. Reassessment can offer draft updates but cannot silently change a draft or decision. Copy and local record actions never claim an external send.

3. Generic lawyer-to-lawyer handoff. Add optional local demo identities and a clearly labelled View as control. Any lawyer can hand work to any other lawyer, including two with the same specialty or no specialty. Do not hardcode product-counsel/privacy-counsel roles, privilege levels or a senior/junior hierarchy. Provide real scoped assignment and a concise handoff packet, incoming/waiting queues, acceptance/return/withdrawal, and per-person seen state. A work-item handoff changes only that work item. Whole-matter acceptance changes the existing legal owner, not every task owner. Preserve attribution and unsent text across person switches. This is a shared local simulation, not authentication, access control or live concurrent editing.

4. Changed-specification impact. Compare two explicitly selected supplied source versions, preserve their actual text/lineage, show exact changed passages and the supported or possible effect on linked assumptions, prior decision basis and draft sections. Keep analysis distinct from actual-fact adoption and recorded decisions. Let the lawyer request a proposed draft revision through the existing conversation/editor. Preserve lawyer edits, source originals, decisions, final artifacts and declined offers. Show honest partial, unchanged, unavailable-baseline and stale-result states. No new broad dependency graph or watch engine.

The payoff is one connected story: return to a matter → understand next action → record a business reply → hand scoped work to another lawyer → continue it as that lawyer → compare a revised spec → review a proposed draft update → return without losing state or reconstructing chat.

## Models, parallel work and review

Use exact supported model names and efforts:

Use the user’s capability order: Sol Medium handles harder stateful work than Terra High; Terra High handles bounded presentation work; Astra handles the most complex shared seams. The latest user direction is Sol Low and Medium only. Do not use Sol High, including for escalation. “Light” means low.

- Orchestrator: gpt-6-astra / medium.
- A/I contracts and shared integration: gpt-6-astra / high.
- B orientation derivation: gpt-5.6-sol / medium.
- C fact requests/replies: gpt-5.6-sol / medium.
- D demo identities/handoffs: gpt-5.6-sol / medium.
- E comparison/impact service: gpt-6-astra / high.
- F orientation UI: gpt-5.6-terra / high.
- G request/team controls: gpt-5.6-sol / low.
- H impact UI: gpt-5.6-sol / medium.
- J final usability repairs: gpt-5.6-terra / high, plus original owners for their fixes.
- Independent reviewer: gpt-6-astra / low. “Light” means low.
- Specific uncertain review findings may escalate to an independent gpt-6-astra / medium, then high if needed. Reviewers stay read-only. Fixes return to implementers. Sol Low implementation can escalate to Sol Medium; complex unresolved work can transfer to Astra Medium/High under a recorded file lease. These models are authorized; do not silently use others.

Maximum active workers is three excluding you, and includes reviewers. Respect any smaller runtime limit. One Astra High implementation child at a time. Pool ceilings do not add slots. Use bounded subagents with task-local context and exact read/write ownership; workers must not spawn subagents. Do not create separate user-owned sidebar tasks.

Use the plan's exact file map and dependency waves. You alone own the tracker and generated evidence. A/I alone owns shared models, router/runtime/agent/tool wiring, core workspace and lifecycle seams, shared API clients, MatterWorkspace, app shell, Today integration, global CSS and package registration. Leaf workers edit only their assigned files. If a worker needs another file, record the lease and stop the prior writer before transfer. Never infer that parallel writes to a shared file will merge safely.

First freeze the additive contracts in docs/lawyer-workflow-expansion.contract.md. Have Astra Low review the high-risk actor, storage, ownership, source-baseline and recovery boundaries before dependent workers start. Then run B/C/D and E/F/G in dependency-safe waves; finish H and shared integration. The coordinator checks package evidence along the way. Run independent combined review after integration, not a separate full reviewer gate for every minor component.

For a reviewer escalation, send the exact finding, expected behavior, source references, observed failure, attempted interpretation and unresolved question. Record the result. Never treat uncertainty as an invented defect, or a failed launch as a completed package. Preserve role/scope when escalating and do not let an implementer review its own work.

## Critical implementation boundaries

- Markdown remains authoritative. SQLite is disposable. Application file operations remain inside the selected VAULT_PATH. Preserve the existing frontmatter shim.
- Reuse existing question/fact/owner/work-item records, source extraction/manifests, chat runs, receipts, scenario adoption, update offers and document review/export. Do not add a second conversation, current fact store, current owner store or general workflow engine.
- Reuse the existing settings file for the optional demo roster. Do not change the workspace-default lawyer globally when View as changes. Validate stable person IDs against that roster. Legacy names and unknown historical actors are not silently reassigned.
- Freeze human actor, target and source/artifact revisions when an action/run starts. A person switch cannot change an in-flight author or where a result is written. User text or model output cannot substitute a different actor.
- Scope seen state and local input by vault/person/matter. Read-only GETs do not mark seen, migrate data or write. View state must not make legal analysis stale by entering its content freshness hash.
- Under the existing serialization lock, read current workspace metadata, check revision, merge only the intended fields and write. Do not hold a lock over a model call. Design an idempotent recovery order for multi-record mutations. Report partial success honestly and retain useful work.
- Keep source text separate from generated interpretation. Hashes alone cannot reconstruct past text. Label potential impact as a suggestion when exact links are missing. A missing source or failed research step reduces support, not access to a useful answer.
- Freeze earlier saved advice/recommendation text and versions as comparison targets, not only decisions/drafts. Test a matter with useful earlier advice but no recorded decision or draft.
- Pending handoffs can be declined without changing ownership. Returning already accepted work creates a reciprocal pending handoff; ownership changes only on that return's acceptance and never overwrites a newer assignment. Completing a task exposes its result without requiring an ownership return. Keep these actions distinct and repeat-safe.
- No implicit decision, approval, sending, delivery or closure. Use existing explicit controls. A handoff acceptance is local ownership, not legal approval. A document revision is proposed work, not a revised legal decision.

## Final usability pass is required

After the first combined engineering review and repairs, perform the plan's full integrated usability pass. Evaluate user experience and information load as well as UI appearance. Do not merely run a visual lint or inspect isolated screenshots.

Check the first screen, next-action clarity, how tools are discovered, repeated information, waiting states, source access, transitions, errors, empty states and return visits. A short answer must keep its decision-changing qualification. Default to one primary action and few secondary shortcuts in the active region. Show at most three recap items before Show all. Do not add four permanently expanded panels or a second chat.

Run the actual connected journeys at 1440, 1024, 768 and 390 pixels, keyboard-only, 200% zoom and reduced motion. Give an independent reviewer task goals without click-by-click directions. Record confusion, wrong paths, hidden actions and missed caveats. Repair material findings, then recheck. Keep the report honest: this is agent-led usability inspection, not measured human productivity.

Write findings, before/after evidence and repairs to docs/lawyer-workflow-expansion.usability.md. Use exact temporary file leases for final UI repairs; do not let the usability implementer collide with original owners.

## Baseline, tests and completion

Record starting tracked/untracked changes. Preserve them; many belong to the latest single-lawyer build and other user work. Do not reset, clean, stash away, overwrite, commit, push, deploy or create worktrees. Test in copied temporary vaults with explicit unused ports. Protect the repository vault, selected user vault, saved selection pointer and existing servers. Stop only servers you start and restore the normal frontend build after a temporary API override.

Run the plan's focused tests and LC-01 through LC-14, plus:

    cd backend && .venv/bin/pytest
    cd frontend && npm run typecheck
    cd frontend && npm run check:workspace-ux
    cd frontend && npm run check:single-lawyer-workspace
    cd frontend && npm run check:lawyer-continuity
    cd frontend && npm run build
    graphify update .
    git diff --check

A/I must register the new check group. Use meaningful runtime/helper/component checks and real HTTP/race tests, not source-string matching as the main proof. Walk docs/ACCEPTANCE_TESTS.md for affected paths. Run actual browser and configured-model evidence for the connected fact-reply, handoff and spec-impact-to-draft story. Keep deterministic fixtures distinct from configured-model runs. Preserve failed attempts. If an optional provider is unavailable, complete independent work and state exactly what remains unverified; do not claim fixtures prove a live result.

Update the progress tracker after every package/wave. At the end, write docs/lawyer-workflow-expansion.verification.md and update current.md, contextmap.md, CODEX_HANDOFF.md and relevant acceptance/design instructions to match what actually passed. Keep a clear boundary between historical test results and new evidence.

Finish only when all four areas, integration, independent review, final usability repairs and required available checks are done, or a concrete external blocker remains after all independent work is complete. Report the actual result, evidence links, model routing/escalations, tests, browser observations, protected-data results and limits. Leave the app runnable. Do not end with an offer to perform work already authorized by this prompt.
