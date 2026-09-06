# Phase 2 A-style screen gallery

29 raster design concepts. These are proposed layouts, not screenshots of implemented UI. All names, dates, status counts, source passages, and decisions in the designs are sample content unless the coverage report states otherwise.

The original browser evidence is in screenshots.md. Read reports/verification.md before using these images as an implementation guide.

## 01. Today: attention queue

Route: `/`. Live route and controls; illustrative queue content.

![Today: attention queue](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/01-today.png)

## 02. Today: practice and conversation

Route: `/`. Live lower sections; illustrative conversation.

![Today: practice and conversation](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/02-today-practice.png)

## 03. Workspace: stage board

Route: `/workspace`. Live stage board; sample matter cards.

![Workspace: stage board](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/03-workspace-board.png)

## 04. Workspace: quarter and activity

Route: `/workspace`. Live lower sections; populated activity sample.

![Workspace: quarter and activity](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/04-workspace-quarter.png)

## 05. Matters: table

Route: `/matters`. Live table and filters; sample rows.

![Matters: table](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/05-matters-table.png)

## 06. Matters: stages

Route: `/matters`. Live Stages view and controls; sample rows.

![Matters: stages](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/06-matters-stages.png)

## 07. New matter

Route: `/workspace`. Live blank form; illustrative filled request. No submission.

![New matter](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/07-new-matter.png)

## 08. Recorded decisions

Route: `/decisions`. Live register, recommendations, empty packets; sample decision wording.

![Recorded decisions](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/08-decisions.png)

## 09. Decision review packet

Route: `ReviewPacket component`. Source-derived populated state. No live packet available in selected vault.

![Decision review packet](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/09-decision-review.png)

## 10. Briefing: overview

Route: `/briefing`. Live empty route and expanded filters. Populated rows, saved views and digests are illustrative.

![Briefing: overview](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/10-briefing.png)

## 11. Briefing: reader

Route: `/briefing/[itemId]`. Source-derived populated reader. No live item opened.

![Briefing: reader](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/11-briefing-reader.png)

## 12. Briefing: digest

Route: `/briefing/digests/[digestId]`. Source-derived digest and unavailable-item state. No live digest opened.

![Briefing: digest](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/12-briefing-digest.png)

## 13. Watches: empty and populated states

Route: `/watches`. Live empty state. Populated watch rows are illustrative.

![Watches: empty and populated states](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/13-watches.png)

## 14. Watch: assignment and sources

Route: `/watches/new`. Live empty builder and source controls; sample named-source row.

![Watch: assignment and sources](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/14-watch-assignment.png)

## 15. Watch: scope, schedule and output

Route: `/watches/new`. Live lower form and cadence options; alternate cadence fields shown together for coverage.

![Watch: scope, schedule and output](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/15-watch-schedule.png)

## 16. Watch: partial run and retained results

Route: `/watches/[watchId]`. Source-derived active watch and partial provider failure. No scan or live detail opened.

![Watch: partial run and retained results](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/16-watch-detail.png)

## 17. Output templates: library

Route: `/skills`. Live 11-template library and selected detail; sample preview form.

![Output templates: library](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/17-templates.png)

## 18. Output template: full editor

Route: `/skills`. Live upper and lower editor controls; sample content and selected preview matter.

![Output template: full editor](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/18-template-editor.png)

## 19. Reusable skill: editor

Route: `/skills`. Live saved-skill editor and blank guided start; sample skill content.

![Reusable skill: editor](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/19-skills.png)

## 20. Agents: overview

Route: `/agents`. Live four built-in agents and advanced details; summarized sample instructions.

![Agents: overview](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/20-agents.png)

## 21. Agent: advanced settings

Route: `/agents`. Live built-in controls; sample audience text and illustrative file path. No custom-agent fixture.

![Agent: advanced settings](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/21-agent-advanced.png)

## 22. Automations: composer and run states

Route: `/automations`. Live empty route and weekly composer. Failed/running/paused examples source-derived.

![Automations: composer and run states](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/22-automations.png)

## 23. Settings: model and providers

Route: `/settings`. Live model controls and model/watch provider status; composite of separate settings sections.

![Settings: model and providers](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/23-settings-models.png)

## 24. Settings: research, files and review

Route: `/settings`. Live research advanced fields, file paths and review identity; composite.

![Settings: research, files and review](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/24-settings-research.png)

## 25. Settings: company and answer contract

Route: `/settings`. Live saved company and contract editor; illustrative profile content; composite.

![Settings: company and answer contract](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/25-settings-content.png)

## 26. Settings: vaults and local team

Route: `/settings`. Live vault controls and local-team form; sample path and names.

![Settings: vaults and local team](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/26-settings-vaults.png)

## 27. Research: saved packet and source

Route: `/matters/[matterId]/research`. Live saved-packet route and source rail; nonlegal illustrative source passage.

![Research: saved packet and source](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/27-research-reader.png)

## 28. Research: queue, notes and questions

Route: `/matters/[matterId]/research`. Live queue and empty notes. Answered/unanswered notes are illustrative.

![Research: queue, notes and questions](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/28-research-notes.png)

## 29. Reusable skill: guided creation

Route: `/skills`. Live initial goal form. Question and generated-guidance previews source-derived.

![Reusable skill: guided creation](/Users/bharris/Programs/counsel-os-mvp/output/uiphase2/designs/29-skill-guided.png)
