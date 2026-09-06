from pathlib import Path
import json,html
p=Path(__file__).resolve().parents[1]
rows=[
('01-today','Today: attention queue','/','Live route and controls; illustrative queue content.'),
('02-today-practice','Today: practice and conversation','/','Live lower sections; illustrative conversation.'),
('03-workspace-board','Workspace: stage board','/workspace','Live stage board; sample matter cards.'),
('04-workspace-quarter','Workspace: quarter and activity','/workspace','Live lower sections; populated activity sample.'),
('05-matters-table','Matters: table','/matters','Live table and filters; sample rows.'),
('06-matters-stages','Matters: stages','/matters','Live Stages view and controls; sample rows.'),
('07-new-matter','New matter','/workspace','Live blank form; illustrative filled request. No submission.'),
('08-decisions','Recorded decisions','/decisions','Live register, recommendations, empty packets; sample decision wording.'),
('09-decision-review','Decision review packet','ReviewPacket component','Source-derived populated state. No live packet available in selected vault.'),
('10-briefing','Briefing: overview','/briefing','Live empty route and expanded filters. Populated rows, saved views and digests are illustrative.'),
('11-briefing-reader','Briefing: reader','/briefing/[itemId]','Source-derived populated reader. No live item opened.'),
('12-briefing-digest','Briefing: digest','/briefing/digests/[digestId]','Source-derived digest and unavailable-item state. No live digest opened.'),
('13-watches','Watches: empty and populated states','/watches','Live empty state. Populated watch rows are illustrative.'),
('14-watch-assignment','Watch: assignment and sources','/watches/new','Live empty builder and source controls; sample named-source row.'),
('15-watch-schedule','Watch: scope, schedule and output','/watches/new','Live lower form and cadence options; alternate cadence fields shown together for coverage.'),
('16-watch-detail','Watch: partial run and retained results','/watches/[watchId]','Source-derived active watch and partial provider failure. No scan or live detail opened.'),
('17-templates','Output templates: library','/skills','Live 11-template library and selected detail; sample preview form.'),
('18-template-editor','Output template: full editor','/skills','Live upper and lower editor controls; sample content and selected preview matter.'),
('19-skills','Reusable skill: editor','/skills','Live saved-skill editor and blank guided start; sample skill content.'),
('20-agents','Agents: overview','/agents','Live four built-in agents and advanced details; summarized sample instructions.'),
('21-agent-advanced','Agent: advanced settings','/agents','Live built-in controls; sample audience text and illustrative file path. No custom-agent fixture.'),
('22-automations','Automations: composer and run states','/automations','Live empty route and weekly composer. Failed/running/paused examples source-derived.'),
('23-settings-models','Settings: model and providers','/settings','Live model controls and model/watch provider status; composite of separate settings sections.'),
('24-settings-research','Settings: research, files and review','/settings','Live research advanced fields, file paths and review identity; composite.'),
('25-settings-content','Settings: company and answer contract','/settings','Live saved company and contract editor; illustrative profile content; composite.'),
('26-settings-vaults','Settings: vaults and local team','/settings','Live vault controls and local-team form; sample path and names.'),
('27-research-reader','Research: saved packet and source','/matters/[matterId]/research','Live saved-packet route and source rail; nonlegal illustrative source passage.'),
('28-research-notes','Research: queue, notes and questions','/matters/[matterId]/research','Live queue and empty notes. Answered/unanswered notes are illustrative.'),
('29-skill-guided','Reusable skill: guided creation','/skills','Live initial goal form. Question and generated-guidance previews source-derived.')]
(p/'coverage.json').write_text(json.dumps([dict(id=i,title=t,route=r,evidence=e) for i,t,r,e in rows],indent=2)+'\n')
md=['# Phase 2 A-style screen gallery','','29 raster design concepts. These are proposed layouts, not screenshots of implemented UI. All names, dates, status counts, source passages, and decisions in the designs are sample content unless the coverage report states otherwise.','','The original browser evidence is in screenshots.md. Read reports/verification.md before using these images as an implementation guide.','']
for i,t,r,e in rows:
 md += [f'## {i[:2]}. {t}','',f'Route: `{r}`. {e}','',f'![{t}]({p}/designs/{i}.png)','']
(p/'designs.md').write_text('\n'.join(md))
shots=sorted((p/'screenshots').rglob('*.png'))
s=['# Live browser evidence','','45 actual screenshots from read-only surveys. These show the current application, not the generated design. Admin captures are full-page; root captures are focused viewport positions.','']
for f in shots:s += [f'- [{f.relative_to(p)}]({f})']
(p/'screenshots.md').write_text('\n'.join(s)+'\n')
nav=''.join(f'<a href="#{i}">{i[:2]} {html.escape(t)}</a>' for i,t,r,e in rows)
cards=''.join(f'<section id="{i}"><h2>{i[:2]}. {html.escape(t)}</h2><p>{html.escape(e)}</p><a href="designs/{i}.png" target="_blank"><img loading="lazy" src="designs/{i}.png" alt="{html.escape(t)}"></a><p><a href="#top">Back to index</a> · <a href="designs/{i}.png" download>Save full image</a></p></section>' for i,t,r,e in rows)
(p/'index.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Counsel OS — Phase 2 A-style</title><style>body{margin:0;background:#fafbfc;color:#091829;font:16px/1.55 system-ui,sans-serif}main{max-width:1080px;margin:auto;padding:24px}h1,h2{font-family:Georgia,serif;font-weight:500}h1{font-size:36px}h2{font-size:27px}a{color:#242774}nav{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:8px;margin:24px 0}nav a{padding:10px;border:1px solid #dce0e6;border-radius:6px;text-decoration:none;background:white}section{margin:48px 0;scroll-margin-top:20px}img{display:block;width:100%;height:auto;border:1px solid #dce0e6;background:white}a:focus-visible{outline:3px solid #4922ff;outline-offset:3px}.note{padding:16px;border:1px solid #dce0e6;background:white}</style><main id="top"><h1>Phase 2 A-style screen gallery</h1><p>29 concepts for the rest of Counsel OS.</p><p class="note">These are raster design concepts, not implemented screens. Sample content is illustrative. Click an image to open its full resolution. Read <a href="reports/verification.md">the coverage and review report</a> before implementation.</p><nav>'+nav+'</nav>'+cards+'</main></html>')
print('Wrote gallery, coverage, and screenshot index.')
