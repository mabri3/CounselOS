import fs from 'node:fs/promises';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {finalizePresentation} from '/Users/bharris/.codex/plugins/cache/openai-primary-runtime/presentations/26.903.11726/skills/presentations/container_tools/artifact_tool_utils.mjs';
const ROOT='/Users/bharris/Programs/counsel-os-mvp', TMP=ROOT+'/.tmp/themis-v10';
const SKILL='/Users/bharris/.codex/plugins/cache/openai-primary-runtime/presentations/26.903.11726/skills/presentations';
const PY='/Users/bharris/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
const C={paper:'#FAF8F2',ink:'#17243E',muted:'#596273',blue:'#4169A4',gold:'#D8B66A',light:'#DCE1EA'};
const p=Presentation.create({slideSize:{width:1280,height:720}});
const S={acc:'https://www.acc.com/sites/default/files/2026-01/2026-ACC-Chief-Legal-Officers-Survey-Key-Findings.pdf',pop:'https://www.acc.com/sites/default/files/resources/upload/US-In-house-Counsel-Population-Statistics.pdf',gc:'https://gc.ai/pricing',harvey:'https://www.harvey.ai/platform/agents',legora:'https://legora.com/',tr:'https://www.acc.com/sites/default/files/2025-06/2025-State-of-the-Corporate-Law-Department-Report.pdf'};
const base='Themis VC pitch, September 2026, version 10. Product ambition and business proposals are distinguished from prototype evidence. No customer traction or measured savings is claimed. '; 
function tx(s,str,x,y,w,h,size=26,color=C.ink,font='Arial',bold=false){const z=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});z.text=str;z.text.style={typeface:font,fontSize:size,color,bold,autoFit:'none',wrap:'square',lineSpacing:1.08,insets:{top:0,right:0,bottom:0,left:0}};return z;}
function sl(label,title,dark=false,size=48){const s=p.slides.add();s.background.fill=dark?C.ink:C.paper;s.dark=dark;tx(s,label.toUpperCase(),64,39,1100,25,15,dark?C.gold:C.blue,'Arial',true);tx(s,title.replace(/\.$/,''),64,91,1145,132,size,dark?C.paper:C.ink,'Georgia',true);tx(s,'THEMIS',64,681,150,20,12,dark?C.light:C.muted,'Arial',true);tx(s,String(p.slides.items.length).padStart(2,'0'),1180,681,40,20,12,dark?C.light:C.muted);return s;}
function notes(s,t){s.speakerNotes.textFrame.setText(base+t);}
function foot(s,t,dark=false){tx(s,t,64,643,1140,30,15,dark?C.light:C.muted);}
async function im(s,file,x,y,w,h,crop){s.images.add({blob:new Uint8Array(await fs.readFile(file)),contentType:'image/png',alt:file.split('/').at(-1),fit:'contain',position:{left:x,top:y,width:w,height:h},...(crop?{crop}:{})});}
function label(s,t,x,y,w=500,dark=false){tx(s,t.toUpperCase(),x,y,w,30,17,dark?C.gold:C.blue,'Arial',true);}
function pair(s,title,body,x,y,w=510,dark=false){tx(s,title,x,y,w,52,30,dark?C.paper:C.ink,'Georgia',true);tx(s,body,x,y+63,w,110,24,dark?C.light:C.muted);}
// 1. Confidence is the lead promise.
{
const s=p.slides.add();s.background.fill=C.ink;
await im(s,ROOT+'/output/deck/assets/bright-editorial/cover-flashlight-bw.png',0,0,1280,720);
const field=tx(s,'',0,0,725,720);field.fill=C.ink;
tx(s,'THEMIS',64,52,570,50,32,C.paper,'Arial',true);
tx(s,'Equipped to advise\nwith confidence',64,203,650,180,57,C.paper,'Georgia',true);
tx(s,'A capable AI companion\nbuilt around the lawyer.',67,440,625,110,33,C.paper);
tx(s,'More time in the room,\nshaping business decisions.',67,575,630,69,27,C.gold);
tx(s,'Brian Harris, Founder   /   September 2026',67,673,650,25,17,C.light);
notes(s,'Themis’s intended customer outcome, not a measured performance claim. Positioning follows the founder-approved promise: Themis equips lawyers to advise with confidence—and gives them more time to be present in the room, shaping business decisions. Companion describes capable support that stays with the lawyer through the matter. The lawyer directs the work and owns the decision. Artwork retained from v7.');
}
// 2. The unanswered question behind the business request.
{
const s=sl('The lawyer’s problem','The business asks, “Can we ship Friday?”');
tx(s,'The lawyer needs to know\nwhat could change the answer.',64,239,1095,116,43,C.ink,'Georgia',true);
label(s,'Before giving the advice',64,399,580);
tx(s,'Which facts matter? What have we missed?\nWhat are the options and their tradeoffs?',64,444,637,113,29);
label(s,'Often working through it alone',780,399,430);
tx(s,'The same lawyer must investigate\nthe issue and help the business\ndecide what to do.',780,444,432,132,28,C.muted);
tx(s,'The business needs their judgment while the decision is still taking shape.',64,587,1140,54,29,C.blue,'Georgia',true);
notes(s,'Illustrative launch request, not a customer quotation. Founder thesis supported directionally by brand_pitch.md and four exploratory counsel interviews in output/research/raw/interviews/in-house-counsel/. Interviews describe unfamiliar legal questions, incomplete intake, verification effort and the importance of business context. They do not establish prevalence or customer traction. The pain is reaching grounded readiness to advise under time pressure, not research being inherently valueless.');
}
// 3. Themis builds the working relationship.
{
const s=sl('Themis','A capable companion,\nbuilt around the lawyer',true,48);
tx(s,'Lawyers should not need to build an AI system\nto get a capable legal companion.',64,234,1130,108,35,C.paper,'Georgia');
label(s,'Themis carries the preparation',64,390,560,true);
tx(s,'Investigates the matter and brings back\nuseful analysis in the lawyer’s working style.\nSurfaces questions worth exploring next.',64,438,576,145,28,C.paper);
label(s,'The lawyer works through the choice',730,390,485,true);
tx(s,'Examines the options with Themis.\nSees what could change the advice.\nDecides what to recommend and why.',730,438,484,145,28,C.paper);
foot(s,'Product thesis. The prototype supports matters, editable instructions and work product. Pilot outcomes remain to be proved.',true);
notes(s,'Sources: brand_pitch.md, docs/PRD.md, vault/00_System/user.md and the founder’s current direction. The companion works alongside the lawyer and adapts to the lawyer’s style. It helps the lawyer explore the issue while the lawyer keeps control. Themis aims to provide that system and useful investigative initiative. Existing preferences and workflows do not prove effortless adaptation or autonomous issue discovery. Confidence should follow understanding and useful materials, not reassurance or apparent model certainty.');
}
// 4. Show the exploration that earns confidence.
{
const s=sl('An example matter','A migration question hides a second decision');
label(s,'The business request',64,238,1080);
tx(s,'“Can we keep bank connections live during the migration?”',64,282,1140,78,33,C.ink,'Georgia',true);
label(s,'What the investigation surfaces',64,393,620);
tx(s,'Growth also wants transaction data for new offers.\nThe existing consent does not clearly cover that use.',64,435,640,108,28);
label(s,'What the lawyer can now weigh',778,393,434);
tx(s,'Separate consent for new uses.\nThen choose when customers\nmust authorize the migration.',778,435,430,145,27);
tx(s,'The lawyer sees a choice the original question did not expose.',64,594,1138,47,30,C.blue,'Georgia',true);
foot(s,'Illustrative walkthrough based on fictional Relay demo data. Not a recorded AI exchange or verified legal advice.');
notes(s,'Sources: vault/03_Matters/relay-open-banking/recommendations.md and drafts/decision-note.md. The opening request is invented explanatory copy. Seeded demo facts separate existing account services from proposed marketing/lending uses, and identify a choice between all-user reauthorization within 90 days and the next bank-required event. Neither path is a verified legal conclusion here. This demonstrates the intended experience of exposing a material adjacent issue and supporting the lawyer’s decision. It does not demonstrate that the running product discovered it autonomously.');
}
// 5. Actual prototype, clearly bounded evidence.
{
const s=sl('Working prototype','The lawyer has a basis for the advice');
await im(s,ROOT+'/output/deck/screenshots/matter-relay.png',64,255,862,357,{left:.19,top:.166,right:.16,bottom:.57});
label(s,'Relay demo',964,258,245);
tx(s,'A draft note sets out\na proposed path\nand its conditions.',964,307,248,118,25);
tx(s,'The lawyer can\nweigh the path\nbefore advising.',964,482,248,129,25,C.blue,'Georgia',true);
foot(s,'Actual prototype capture. Fictional seeded demo content, including the separate draft decision note.');
notes(s,'Actual source screenshot: output/deck/screenshots/matter-relay.png, used in v7/v8. Draft decision note: vault/03_Matters/relay-open-banking/drafts/decision-note.md, separate from the screenshot. The screenshot shows matter organization and the open decision question. Seeded content and the draft support the intended work-product structure, not measured autonomous research performance. Product aims to give the lawyer inspectable materials and understanding to stand behind the advice. Useful recommendations remain distinct from explicitly recorded lawyer decisions.');
}
// 6. Compete with strong versions of the real alternatives.
{
const s=sl('Claude and ChatGPT','The next advantage is who does the directing');
label(s,'Powerful tools already exist',64,254,520);
tx(s,'Claude',64,298,520,50,36,C.ink,'Georgia',true);
tx(s,'Research, legal plugins and work across files.\nSettings adapt it to a team’s methods.',64,357,529,87,26,C.muted);
tx(s,'ChatGPT',64,477,520,50,36,C.ink,'Georgia',true);
tx(s,'Projects, custom instructions and research\nsupport ongoing work.',64,536,529,83,26,C.muted);
label(s,'Themis’s proposed advantage',708,254,504);
tx(s,'Less work directing the investigation',708,301,504,111,35,C.blue,'Georgia',true);
tx(s,'A system that starts with the matter,\nsurfaces what could change the advice,\nand prepares work in the lawyer’s style.\n\nThe lawyer can spend more attention\non the choice itself.',708,431,505,184,27);
foot(s,'Pilot test: useful issues discovered and advice prepared with less lawyer steering than configured Claude or ChatGPT.');
notes(s,'Current official sources checked September 4–5, 2026: https://claude.com/blog/deploying-claude-across-the-legal-industry ; https://claude.com/plugins/legal ; https://claude.com/blog/research ; https://help.openai.com/en/articles/10169521-projects-in-chatgpt ; https://help.openai.com/en/articles/10500283-deep-research . Claude already supports legal customization, research and matter-level work. Both can explore alternatives and ask questions. Themis’s claim is a proposed advantage in default workflow and total directing effort, not exclusive capabilities, proven superiority, or freedom from model errors. Competitor usage in interviews/corpus is qualitative evidence, not market share. Compare against reasonably configured tools including Claude legal plugins.');
}
// 7. Time-sensitive evidence and grounded inference.
{
const s=sl('Why now','Legal teams are forming their AI habits');
tx(s,'36%',64,253,520,125,99,C.blue,'Georgia',true);
tx(s,'of surveyed legal departments\nare actively deploying generative AI.',64,390,510,106,28);
tx(s,'63%',713,253,500,125,99,C.blue,'Georgia',true);
tx(s,'of surveyed chief legal officers\nexpect headcount to stay stable.',713,390,495,106,28);
tx(s,'Our opening: become the companion small legal teams turn to as they work through decisions.',64,551,1130,82,32,C.ink,'Georgia',true);
foot(s,'ACC 2026 Chief Legal Officers Survey. 1,049 participants across 43 countries.');
notes(s,'Verified source, accessed September 4–5, 2026: '+S.acc+' Key findings p. 2, section 05. Survey scope: 1,049 participants, 20 industries, 43 countries. These statistics are not small-team-only estimates and do not establish Themis demand. The commercial opening is our strategic inference: legal departments are actively choosing how to deploy AI while focusing on the work of existing lawyers.');
}
// 8. Define the first buyer and buying moment.
{
const s=sl('First customer','One lawyer. A company’s worth of questions.');
label(s,'Initial buyer',64,259);tx(s,'Solo general counsel\nor a small legal team',64,306,580,107,40,C.ink,'Georgia',true);
tx(s,'Start with product and regulatory questions\nat technology and fintech companies.',64,449,580,96,27,C.muted);
label(s,'The buying moment',759,259,450);
tx(s,'An unfamiliar issue before a launch.\nPowerful AI, but more work to direct it.\nA decision that cannot wait.',759,308,450,166,28);
tx(s,'One lawyer can test Themis\non one live matter.',759,525,450,84,31,C.blue,'Georgia',true);
foot(s,'Four exploratory counsel interviews inform this focus. They are research, not customers or pilot commitments.');
notes(s,'Sources: four exploratory in-house counsel interviews, brand_pitch.md, and output/research/themis-counselos-legal-ai-competitive-strategy.docx. Segment and triggers are proposed commercial choices. Interviews include different views and successful existing-tool use; they are not four customers or four pilot commitments. First access must fit the participant’s data requirements. Team sharing is a future product expansion.');
}
// 9. Commercial value and price hypothesis.
{
const s=sl('Business model','A legal companion, by subscription');
tx(s,'$500',64,260,540,123,96,C.blue,'Georgia',true);
tx(s,'per lawyer, per month',64,397,560,45,31);
tx(s,'Proposed starting price\nOne lawyer. One real matter to start.',64,466,560,101,26,C.muted);
label(s,'Value test',716,259,490);
tx(s,'One hour a week',716,305,489,62,40,C.ink,'Georgia',true);
tx(s,'At an assumed $250 per lawyer hour,\nthat is about $1,000 of monthly\ncapacity for a $500 subscription.',716,393,490,129,27);
tx(s,'Test readiness to advise\nand net time saved.',716,555,490,74,27,C.blue,'Georgia',true);
foot(s,'Illustrative economics: 4 weeks/month. Capacity value is not cash savings. Price and benefit are unvalidated.');
notes(s,'Proposed Themis price: $500/seat/month, $6,000/seat/year at 12 months; no annual discount assumed. Current public reference: '+S.gc+' lists an individual plan at $500/month; this is a competitor offer, not proof of willingness to pay Themis. Value illustration: 1 net hour/week × 4 weeks/month × $250/hour = $1,000/month of capacity. The $250/hour is a modeling assumption, not a measured salary or billable rate. Recovery of time does not automatically reduce payroll or outside-counsel spend. Initial offer should set clear included usage once observed delivery cost is known.');
}
// 10. Sourced denominator with an explicit serviceable-market assumption.
{
const s=sl('Market potential','U.S. in-house counsel offers room to grow');
tx(s,'145,000',64,255,520,116,88,C.ink,'Georgia',true);
tx(s,'estimated U.S. in-house lawyers\nACC analysis of 2024 employment data',64,386,530,95,26,C.muted);
label(s,'Modeled U.S. potential',710,251,500);tx(s,'$870M',710,302,500,109,85,C.blue,'Georgia',true);
tx(s,'145,000 lawyers × $6,000 per year',710,427,500,45,25);
tx(s,'Initial segment scenario: 10–20% of those lawyers\n14,500–29,000 seats, or $87M–$174M annually',64,533,1150,93,32,C.ink,'Georgia',true);
foot(s,'Scenario, not a market forecast. Assumes full adoption at proposed pricing; initial-segment share is unverified.');
notes(s,'Verified population source: '+S.pop+' (ACC, 2025), pp. 1–2: roughly 145,000 U.S. in-house counsel in 2024, estimated from BLS employment data by subtracting law-firm and government lawyers. This includes more than Themis’s initial segment. Model: 145,000 × $6,000 = $870,000,000 annual revenue potential at full penetration and unchanged per-seat pricing. Proposed serviceable segment sensitivity: 10–20% × 145,000 = 14,500–29,000 seats; × $6,000 = $87–174 million. The 10–20% is an explicit unverified planning assumption, not ACC data. These values are neither bookings nor revenue forecasts. No law-firm or international market is added.');
}
// 11. Acquisition path, followed by durable customer value.
{
const s=sl('Go to market','The first sale starts with a real matter');
const a=[['01','Recruit through Brian’s network','Target solo general counsel and product lawyers. Ask for one active matter.'],['02','Run a short, supported pilot','Compare readiness to advise and total effort with configured Claude or ChatGPT.'],['03','Convert, then expand','Charge for continued use. Seek referrals and a second paid seat after repeat value.']];
a.forEach((r,i)=>{let y=245+i*125;tx(s,r[0],64,y,78,60,39,C.blue,'Georgia',true);tx(s,r[1],168,y,1025,43,31,C.ink,'Georgia',true);tx(s,r[2],168,y+52,1025,63,25,C.muted);});
foot(s,'First 90-day targets: 20 qualified conversations, 10 pilot lawyers, 5 paying lawyers. Proposed targets, not pipeline.');
notes(s,'Proposed founder-led acquisition plan, grounded in the four existing exploratory interview files and Brian’s reported general-counsel/product-counsel experience. No referrals, partnerships, pipeline, sales commitments or conversion rates are claimed. Target 20 qualified buyer conversations, 10 pilot users, 5 paying users in first 90 days after pilot access is ready. Later channels to test: counsel communities and referrals from fractional general counsel, with no implied association endorsement. Expansion through another lawyer depends on shared-work capability, which is not currently shipped.');
}
// 12. Founder energy with specific credibility.
{
const s=sl('Founder','I know what it takes to be ready to advise.',true,48);
tx(s,'Brian Harris',64,253,850,70,49,C.paper,'Georgia',true);
tx(s,'Sole founder',64,331,700,37,24,C.gold);
label(s,'Lived the work',64,429,520,true);
tx(s,'17 years as a lawyer\nGeneral counsel and product counsel\nBuilt legal functions and led teams',64,478,555,126,27,C.paper);
label(s,'Built the prototype',728,429,480,true);
tx(s,'Earlier AI research at Georgia Tech\nM.S. in Computer Science, Georgia Tech\nJ.D., Northwestern',728,478,484,126,26,C.light);
notes(s,'Founder facts carried from source deck v7 and brand_pitch.md; v7 notes cite Brian’s supplied January 2026 resume. Seventeen years is founder-reported (the older resume says 15+). First-person headline is proposed founder copy based on brand_pitch.md’s interview-derived motivation and the founder’s current request for more passion, not a verbatim quotation. AI/natural-language research is historical. No current employer or employer endorsement is implied.');
}
// 13. Make the product thesis falsifiable.
{
const s=sl('What the next 18 months must prove','Confidence grounded in better understanding');
label(s,'Product evidence',64,251,565);
tx(s,'Useful issues surfaced\nwith less lawyer steering',64,297,568,96,33,C.ink,'Georgia',true);
tx(s,'Can the lawyer explain the recommendation\nand what could change it?\n\nDoes total preparation effort fall?',64,420,570,154,27,C.muted);
label(s,'Commercial targets',755,251,450);
tx(s,'25 paying teams\n50 paying lawyers\n$300,000 annual recurring revenue',755,301,450,148,29,C.blue,'Georgia',true);
tx(s,'60% start a second matter\nwithin 30 days.',755,487,450,92,28);
foot(s,'Proposed targets, not results. Today: local prototype and four exploratory interviews. No paid traction demonstrated.');
notes(s,'Pilot plan: compare matched tasks with configured Claude (including legal tools) and ChatGPT. Capture total lawyer time including setup, prompting, checking, corrections and drafting. Record relevant issues surfaced without lawyer prompting. Pair self-reported readiness to advise with the lawyer’s explanation of the recommendation, support and material alternatives; confidence alone is insufficient. Proposed effort target: median 25% reduction. Repeat-use denominator: activated pilot lawyers completing their first matter; 60% start a second distinct matter within 30 days. Commercial model: 25 teams × 2 seats × $500/month × 12 = $300,000 annual recurring revenue run rate. Not recognized cumulative revenue. Shared work needs development. Retention thesis: repeated useful support earns a habitual role in the lawyer’s work. It is not yet a proven moat.');
}
// 14. The ask pays off the opening promise.
{
const s=sl('Investment proposal','A capable companion for small legal teams',true,49);
tx(s,'$1.5M',64,251,590,125,98,C.gold,'Georgia',true);
tx(s,'Proposed pre-seed raise\n18 months of focused execution',64,397,590,99,31,C.paper);
label(s,'The next stage',760,251,450,true);
tx(s,'Build the founding technical team.\nPut Themis into live legal matters.\nProve lawyers return and pay.',760,304,450,148,28,C.paper);
tx(s,'Themis equips lawyers to advise with confidence—and gives\nthem more time to be present in the room,\nshaping business decisions.',64,541,1150,115,32,C.paper,'Georgia',true);
notes(s,'Founder-approved closing line retained exactly. Product outcomes are the intended promise, not proven results. Proposed raise and 18-month plan, carried from v8 at the founder’s request for commercial proposals. Budget: $900k founder and technical delivery; $180k customer development; $150k models/research/infrastructure; $120k secure pilot delivery and operations; $150k contingency. Total $1.5m. Founding technical leader remains open. Financing instrument and final staffing remain open. Commercial milestones are targets.');
}
// 15. Preserve the partnership table in the appendix.
{
const s=sl('Appendix / partnership','Themis brings intelligence at scale.\nThe lawyer brings judgment.',false,46);
const values=[['Themis brings','The lawyer brings'],['Speed and capacity','Business and human context'],['Research and analysis','Experience and wisdom'],['Persistent memory','Values and risk tolerance'],['Questions and alternatives','The choice of path'],['Accurate, well-supported work','Ownership of the decision']];
const t=s.tables.add({rows:6,columns:2,left:64,top:261,width:1152,height:310,columnWidths:[576,576],values});t.borders.assign({fill:'#D8DCE1',width:.5,style:'solid'});
for(let r=0;r<6;r++){t.rows[r].height=52;for(let c=0;c<2;c++){const a=t.getCell(r,c);a.fill=r===0?C.ink:C.paper;a.text.style={typeface:'Arial',fontSize:25,bold:r===0,color:r===0?C.paper:C.ink};}}
tx(s,'More capacity for the work only the lawyer can do.',64,606,1140,46,31,C.blue,'Georgia',true);
notes(s,'Partnership table retained from v7 with the accepted headline and all five rows. Capacity and quality are product requirements, not measured guarantees. Memory is supporting capability, not the lead commercial thesis.');
}
// 16. Preserve the supplied brand source in the appendix.
{
const s=p.slides.add();s.background.fill=C.paper;await im(s,TMP+'/trust-source.png',0,0,1280,720);notes(s,'Original supplied brand-principles slide retained unchanged from v7 slide 14. Source artwork is raster; its text is intentionally retained as supplied. Principles are product requirements rather than guarantees.');
}
// 17. Reviewable budget and assumptions without cluttering the main pitch.
{
const s=sl('Appendix / operating assumptions','A focused 18-month plan');
const vals=[['Use of funds','Budget'],['Founder and technical delivery','$900,000'],['Customer development','$180,000'],['Models, research and infrastructure','$150,000'],['Secure pilot delivery and operations','$120,000'],['Contingency','$150,000'],['Total','$1,500,000']];
const t=s.tables.add({rows:7,columns:2,left:64,top:243,width:718,height:336,columnWidths:[520,198],values:vals});t.borders.assign({fill:'#D8DCE1',width:.5,style:'solid'});
for(let r=0;r<7;r++){t.rows[r].height=48;for(let c=0;c<2;c++){const a=t.getCell(r,c);a.fill=r===0?C.ink:C.paper;a.text.style={typeface:'Arial',fontSize:22,bold:r===0||r===6,color:r===0?C.paper:C.ink};}}
label(s,'What the plan must prove',850,246,356);
tx(s,'Advice has a clear basis.\nLawyers return and pay.\nTotal effort falls.\nDelivery costs support the price.',850,299,356,198,27);
tx(s,'Shared work and automatic\nadaptation require further\nproduct development.',850,519,356,99,23,C.muted);
foot(s,'Proposed budget and milestones for investor discussion. Final staffing and financing terms remain open.');
notes(s,'Budget arithmetic: 900,000+180,000+150,000+120,000+150,000=1,500,000. 18-month average including contingency = 83,333.33/month. Founder and technical delivery includes compensation, taxes/benefits and contractor capacity; final staffing/location assumptions remain open. Price economics should be tested on observed model, research, infrastructure and support costs before offering unrestricted usage. All commercial numbers in this deck are proposed unless expressly sourced. Sources are in relevant slide notes.');
}
await fs.mkdir(TMP+'/renders',{recursive:true});
await (await PresentationFile.exportPptx(p)).save(TMP+'/candidate.pptx');
console.log('Exported '+p.slides.items.length+' slides');
await fs.writeFile(TMP+'/source-manifest.json',JSON.stringify(S,null,2));
