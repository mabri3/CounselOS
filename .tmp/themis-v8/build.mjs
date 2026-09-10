import fs from 'node:fs/promises';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {finalizePresentation} from '/Users/bharris/.codex/plugins/cache/openai-primary-runtime/presentations/26.903.11726/skills/presentations/container_tools/artifact_tool_utils.mjs';
const ROOT='/Users/bharris/Programs/counsel-os-mvp', TMP=ROOT+'/.tmp/themis-v8';
const SKILL='/Users/bharris/.codex/plugins/cache/openai-primary-runtime/presentations/26.903.11726/skills/presentations';
const PY='/Users/bharris/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
const C={paper:'#FAF8F2',ink:'#17243E',muted:'#596273',blue:'#4169A4',gold:'#D8B66A',light:'#DCE1EA'};
const p=Presentation.create({slideSize:{width:1280,height:720}});
const S={acc:'https://www.acc.com/sites/default/files/2026-01/2026-ACC-Chief-Legal-Officers-Survey-Key-Findings.pdf',pop:'https://www.acc.com/sites/default/files/resources/upload/US-In-house-Counsel-Population-Statistics.pdf',gc:'https://gc.ai/pricing',harvey:'https://www.harvey.ai/platform/agents',legora:'https://legora.com/',tr:'https://www.acc.com/sites/default/files/2025-06/2025-State-of-the-Corporate-Law-Department-Report.pdf'};
const base='Themis VC pitch, September 2026, version 8. Product ambition and business proposals are distinguished from prototype evidence. No customer traction or measured savings is claimed. '; 
function tx(s,str,x,y,w,h,size=26,color=C.ink,font='Arial',bold=false){const z=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});z.text=str;z.text.style={typeface:font,fontSize:size,color,bold,autoFit:'none',wrap:'square',lineSpacing:1.08,insets:{top:0,right:0,bottom:0,left:0}};return z;}
function sl(label,title,dark=false,size=48){const s=p.slides.add();s.background.fill=dark?C.ink:C.paper;s.dark=dark;tx(s,label.toUpperCase(),64,39,1100,25,15,dark?C.gold:C.blue,'Arial',true);tx(s,title.replace(/\.$/,''),64,91,1145,132,size,dark?C.paper:C.ink,'Georgia',true);tx(s,'THEMIS',64,681,150,20,12,dark?C.light:C.muted,'Arial',true);tx(s,String(p.slides.items.length).padStart(2,'0'),1180,681,40,20,12,dark?C.light:C.muted);return s;}
function notes(s,t){s.speakerNotes.textFrame.setText(base+t);}
function foot(s,t,dark=false){tx(s,t,64,643,1140,30,15,dark?C.light:C.muted);}
async function im(s,file,x,y,w,h,crop){s.images.add({blob:new Uint8Array(await fs.readFile(file)),contentType:'image/png',alt:file.split('/').at(-1),fit:'contain',position:{left:x,top:y,width:w,height:h},...(crop?{crop}:{})});}
function label(s,t,x,y,w=500,dark=false){tx(s,t.toUpperCase(),x,y,w,30,17,dark?C.gold:C.blue,'Arial',true);}
function pair(s,title,body,x,y,w=510,dark=false){tx(s,title,x,y,w,52,30,dark?C.paper:C.ink,'Georgia',true);tx(s,body,x,y+63,w,110,24,dark?C.light:C.muted);}
// 1. Preserve the visual identity, sharpen the promise.
{
const s=p.slides.add();s.background.fill=C.ink;
await im(s,ROOT+'/output/deck/assets/bright-editorial/cover-flashlight-bw.png',0,0,1280,720);
const field=tx(s,'',0,0,725,720);field.fill=C.ink;
tx(s,'THEMIS',64,52,570,50,32,C.paper,'Arial',true);
tx(s,'Your judgment.\nWith more time\nto use it.',64,183,695,265,64,C.paper,'Georgia',true);
tx(s,'AI that takes on the slow work\nbehind legal advice.',67,490,630,90,31,C.paper);
tx(s,'Built around the lawyer.',67,594,630,38,25,C.gold);
tx(s,'Brian Harris, Founder   /   September 2026',67,658,650,25,17,C.light);
notes(s,'Proposed positioning reflects the founder’s latest direction: remove slow preparation work and adapt to the lawyer’s working style. This is an intended benefit, not a measured performance claim. Existing conceptual flashlight artwork retained from v7.');
}
// 2. One specific request makes the cost visible.
{
const s=sl('The problem','The company needs a decision.\nPreparation consumes the lawyer’s day.');
label(s,'The request',64,259);tx(s,'“Can we ship Friday?”',64,302,550,110,45,C.ink,'Georgia',true);
tx(s,'A new product. An unclear data use.\nA deadline that will not move.',64,431,530,95,28,C.muted);
label(s,'Work before the advice',694,259);
tx(s,'Search for the relevant rules.\nRead and compare the sources.\nPull facts from the documents.\nPrepare a usable first draft.',694,310,514,200,29);
tx(s,'That work is necessary. The business value comes from what the lawyer does with it.',64,567,1140,67,30,C.blue,'Georgia');
notes(s,'Founder observation, supported directionally by four exploratory in-house counsel interviews in output/research/raw/interviews/in-house-counsel/. The launch request is illustrative. The argument concerns lawyer time spent on preparation; it does not claim research is inherently valueless. See also Thomson Reuters 2025 State of the Corporate Law Department Report, pp. 4–10: '+S.tr);
}
// 3. An actual product view, early and readable.
{
const s=sl('Working prototype','A business question becomes\na concrete decision');
await im(s,ROOT+'/output/deck/screenshots/matter-relay.png',64,255,862,357,{left:.19,top:.166,right:.16,bottom:.57});
label(s,'Relay demo matter',964,258,245);
tx(s,'A bank-data migration.\nAn unclear consent.\n\nWhen should customers\ngive permission again?',964,307,248,188,23);
tx(s,'Themis puts the\nquestion in front\nof the lawyer.',964,532,248,95,25,C.blue,'Georgia',true);
foot(s,'Actual prototype capture, September 2026. Fictional demo data.');
notes(s,'Source: output/deck/screenshots/matter-relay.png, also used in the project’s prior deck assets. Cropped to the required-work and matter-summary area for readability. This is a historical prototype screenshot containing seeded fictional demo data, not an external customer or a fresh product execution. The screenshot supports the existence of the workspace and decision orientation, not autonomous production of the displayed content.');
}
// 4. Same matter, concrete work product.
{
const s=sl('The useful handoff','A draft the lawyer can judge and use.');
label(s,'Relay / draft decision note',64,246,730);
tx(s,'Proposed path',64,291,690,47,33,C.ink,'Georgia',true);
tx(s,'Continue existing disclosed uses during the migration.\nSeek permission for new marketing or lending uses separately.',64,348,690,113,28);
tx(s,'Conditions to resolve',64,487,690,43,30,C.ink,'Georgia',true);
tx(s,'Set the migration period. Approve the consent copy.\nConfirm deletion and contract terms.',64,542,690,89,26,C.muted);
label(s,'The lawyer’s call',846,246,366);
tx(s,'Require everyone\nto reauthorize\nwithin 90 days?',846,299,366,147,38,C.blue,'Georgia',true);
tx(s,'Or wait until each bank\nrequires it? Weigh the\nbusiness cost and risk.',846,492,366,113,27);
foot(s,'Abridged seeded demo content. Proposed advice remains separate from a recorded decision.');
notes(s,'Source: vault/03_Matters/relay-open-banking/drafts/decision-note.md and recommendations.md, read for this revision. Text is an abridgment of fictional seeded demo content, not a new legal conclusion, verified authority or output produced during this session. The 90-day choice is a scenario parameter, not a claim about a legal deadline. Demonstrates the intended editable handoff and the distinction between a proposal and the lawyer’s decision.');
}
// 5. The central product thesis, grounded in the founder’s analogy.
{
const s=sl('The product thesis','Themis works the way you work.',true,55);
tx(s,'A strong junior associate learns\nhow the partner wants the work done.',64,253,1100,125,42,C.paper,'Georgia');
label(s,'Your instructions',64,434,470,true);
tx(s,'“Start with the answer. Show the sources.\nGive me a short note for the product team.”',64,481,550,113,27,C.light);
label(s,'Themis adapts',727,434,480,true);
tx(s,'Your preferred depth and format.\nYour working methods.\nYour business priorities.',727,481,475,126,27,C.paper);
foot(s,'Design thesis. Editable preferences and agent instructions exist in the prototype; effortless adaptation is the pilot goal.',true);
notes(s,'Source: founder’s current instructions, brand_pitch.md, docs/PRD.md §3.5 and vault/00_System/user.md. Existing prototype supports editable user preferences, agent instructions and workflows. Do not imply automatic learning of individual style has been validated or fully shipped. The example instruction is illustrative. This positioning replaces repeated context reconstruction as the primary value proposition.');
}
// 6. Time-sensitive evidence and grounded inference.
{
const s=sl('Why now','Legal teams are deciding how AI will work.');
tx(s,'36%',64,253,520,125,99,C.blue,'Georgia',true);
tx(s,'of surveyed legal departments\nare actively deploying generative AI.',64,390,510,106,28);
tx(s,'63%',713,253,500,125,99,C.blue,'Georgia',true);
tx(s,'of surveyed chief legal officers\nexpect headcount to stay stable.',713,390,495,106,28);
tx(s,'Our opening: help a small legal team do more useful work with the people it already has.',64,551,1130,82,34,C.ink,'Georgia',true);
foot(s,'ACC 2026 Chief Legal Officers Survey. 1,049 participants across 43 countries.');
notes(s,'Verified source, accessed September 4–5, 2026: '+S.acc+' Key findings p. 2, section 05. Survey scope: 1,049 participants, 20 industries, 43 countries. These statistics are not small-team-only estimates and do not establish Themis demand. The commercial opening is our strategic inference: legal departments are actively choosing how to deploy AI while focusing on the work of existing lawyers.');
}
// 7. Define the first buyer and buying moment.
{
const s=sl('First customer','One lawyer. A company’s worth of questions.');
label(s,'Initial buyer',64,259);tx(s,'Solo general counsel\nor a 1–5 lawyer team',64,306,580,107,40,C.ink,'Georgia',true);
tx(s,'Start with product and regulatory questions\nat technology and fintech companies.',64,449,580,96,27,C.muted);
label(s,'The buying moment',759,259,450);
tx(s,'A launch adds unfamiliar legal work.\nThe team has no junior support.\nThe backlog grows before headcount does.',759,308,450,166,28);
tx(s,'One lawyer can test Themis\non one live matter.',759,525,450,84,31,C.blue,'Georgia',true);
foot(s,'Proposed initial segment. Interview signals support the need; paid demand remains to be tested.');
notes(s,'Sources: four exploratory in-house counsel interviews, brand_pitch.md, and output/research/themis-counselos-legal-ai-competitive-strategy.docx. Segment and triggers are proposed commercial choices. Interviews include different views and successful existing-tool use; they are not four customers or four pilot commitments. First access must fit the participant’s data requirements. Team sharing is a future product expansion.');
}
// 8. Direct competition, no false empty-market claim.
{
const s=sl('Where we compete','The opening is the whole job, done your way.');
label(s,'Themis’s intended advantage',656,222,553);
const rows=[['General AI','Flexible thinking and drafting','Delegate a product question through research and a usable draft, with fewer instructions.'],['Legal platforms','Harvey, Legora, GC AI','Start with one product lawyer. Fit the investigation and work product to that lawyer’s methods.']];
rows.forEach((r,i)=>{const y=247+i*168;label(s,r[0],64,y,430);tx(s,r[1],64,y+44,460,86,30,C.ink,'Georgia',true);tx(s,r[2],656,y+23,553,107,28);});
tx(s,'Win on total lawyer effort, including instructions, source checks, corrections, and the final draft.',64,587,1140,61,30,C.blue,'Georgia',true);
notes(s,'Verified competitor sources accessed September 4–5, 2026: '+S.harvey+' ; '+S.legora+' ; '+S.gc+'. Harvey markets agents, customization and legal workflows; Legora serves in-house teams and supports research/drafting; GC AI directly targets in-house teams with skills, Word, connectors and individual access. The slide asserts a Themis focus, not exclusive capabilities or proven superiority. Local corpus: output/research/themis-counselos-legal-ai-competitive-strategy.docx, 203 reported de-duplicated Reddit threads, qualitative and not representative. Broad competitor claims in that older report were not adopted without current support.');
}
// 9. Commercial value and price hypothesis.
{
const s=sl('Business model','Sell capacity back to the legal team.');
tx(s,'$500',64,260,540,123,96,C.blue,'Georgia',true);
tx(s,'per lawyer, per month',64,397,560,45,31);
tx(s,'Proposed starting price\nOne seat to start. Expand with use.',64,466,560,101,26,C.muted);
label(s,'Value test',716,259,490);
tx(s,'One hour a week',716,305,489,62,40,C.ink,'Georgia',true);
tx(s,'At an assumed $250 per lawyer hour,\nthat is about $1,000 of monthly\ncapacity for a $500 subscription.',716,393,490,129,27);
tx(s,'Measure time saved after checking\nand correcting the work.',716,555,490,74,27,C.blue,'Georgia',true);
foot(s,'Illustrative economics: 4 weeks/month. Capacity value is not cash savings. Price and benefit are unvalidated.');
notes(s,'Proposed Themis price: $500/seat/month, $6,000/seat/year at 12 months; no annual discount assumed. Current public reference: '+S.gc+' lists an individual plan at $500/month; this is a competitor offer, not proof of willingness to pay Themis. Value illustration: 1 net hour/week × 4 weeks/month × $250/hour = $1,000/month of capacity. The $250/hour is a modeling assumption, not a measured salary or billable rate. Recovery of time does not automatically reduce payroll or outside-counsel spend. Initial offer should set clear included usage once observed delivery cost is known.');
}
// 10. Sourced denominator with an explicit serviceable-market assumption.
{
const s=sl('Market potential','A focused entry into a $870M annual opportunity.');
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
const a=[['01','Recruit through Brian’s network','Target solo general counsel and product lawyers. Ask for one active matter.'],['02','Run a short, supported pilot','Use the lawyer’s preferred format. Compare total effort with their usual tools.'],['03','Convert, then expand','Charge for continued use. Seek referrals and a second paid seat after repeat value.']];
a.forEach((r,i)=>{let y=245+i*125;tx(s,r[0],64,y,78,60,39,C.blue,'Georgia',true);tx(s,r[1],168,y,1025,43,31,C.ink,'Georgia',true);tx(s,r[2],168,y+52,1025,63,25,C.muted);});
foot(s,'First 90-day targets: 20 qualified conversations, 10 pilot lawyers, 5 paying lawyers. Proposed targets, not pipeline.');
notes(s,'Proposed founder-led acquisition plan, grounded in the four existing exploratory interview files and Brian’s reported general-counsel/product-counsel experience. No referrals, partnerships, pipeline, sales commitments or conversion rates are claimed. Target 20 qualified buyer conversations, 10 pilot users, 5 paying users in first 90 days after pilot access is ready. Later channels to test: counsel communities and referrals from fractional general counsel, with no implied association endorsement. Expansion through another lawyer depends on shared-work capability, which is not currently shipped.');
}
// 12. Founder energy with specific credibility.
{
const s=sl('Founder','I wanted to multiply what one lawyer can do.',true,49);
tx(s,'Brian Harris',64,253,850,70,49,C.paper,'Georgia',true);
tx(s,'Sole founder',64,331,700,37,24,C.gold);
label(s,'Lived the work',64,429,520,true);
tx(s,'17 years as a lawyer\nGeneral counsel and product counsel\nBuilt legal functions and led teams',64,478,555,126,27,C.paper);
label(s,'Built the prototype',728,429,480,true);
tx(s,'Earlier AI research at Georgia Tech\nM.S. in Computer Science, Georgia Tech\nJ.D., Northwestern',728,478,484,126,26,C.light);
notes(s,'Founder facts carried from source deck v7 and brand_pitch.md; v7 notes cite Brian’s supplied January 2026 resume. Seventeen years is founder-reported (the older resume says 15+). First-person headline is proposed founder copy based on brand_pitch.md’s interview-derived motivation and the founder’s current request for more passion, not a verbatim quotation. AI/natural-language research is historical. No current employer or employer endorsement is implied.');
}
// 13. Evidence, milestones, and advantage built through use.
{
const s=sl('The next proof','Useful work earns the next matter.');
label(s,'Foundation today',64,253,520);
tx(s,'Working local prototype\nFour exploratory counsel interviews\nEditable research and draft workflows',64,301,550,151,29);
label(s,'18-month targets',724,253,484);
tx(s,'25 paying teams\n50 paying lawyers\n$300,000 annual recurring revenue',724,301,484,151,29,C.blue,'Georgia',true);
tx(s,'Each completed matter should make Themis more useful.\nApply the lawyer’s corrections to how the next job gets done.',64,501,1140,118,31,C.ink,'Georgia',true);
foot(s,'Targets: 60% start a second matter within 30 days; 25% less total lawyer effort on matched tasks. Not measured results.');
notes(s,'Foundation: current repository and v7, four interview files, existing prototype captures. No paying users or live customer retention demonstrated in reviewed sources. Proposed 18-month targets: 25 paying organizations, average 2 paid seats = 50 seats, each $500/month × 12 = $300,000 annual recurring revenue run rate, not recognized cumulative revenue. Repeat-use target: 60% of activated pilot lawyers start a second distinct matter within 30 days of completing their first. Effort target: median 25% reduction against matched usual-tool tasks, including prompting, verification, correction and final assembly. Sustained personalization and workflow fit are proposed retention mechanisms; automated learning is not claimed as existing.');
}
// 14. A concrete proposed ask, with a budget behind it.
{
const s=sl('Investment proposal','More capacity for the lawyers\nbuilding the business',true,49);
tx(s,'$1.5M',64,268,590,125,101,C.gold,'Georgia',true);
tx(s,'Proposed pre-seed raise\n18 months of focused execution',64,416,590,99,31,C.paper);
label(s,'Capital turns the prototype into',755,273,460,true);
tx(s,'A dependable product for real work\nA founding technical team\nA path to paying customers',755,327,453,168,28,C.paper);
tx(s,'Themis takes on the preparation.\nThe lawyer has more room to lead.',64,562,1140,85,37,C.paper,'Georgia',true);
notes(s,'Proposed fundraising plan created for this revision at the user’s request. Not a committed round, approved budget, appointed team or fixed financing term. 18-month illustrative allocation: $900k founder and technical delivery; $180k customer development; $150k models/research/infrastructure; $120k secure pilot delivery and operations; $150k contingency. Sum $1.5m; average including reserve about $83.3k/month. Founding technical leader is open. Customer development can begin with the founder and fractional support. Financing instrument and final budget remain to be set. Milestones on slide 13 are proposed, not promised.');
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
tx(s,'Lawyers return.\nThey pay for continued use.\nTotal effort falls.\nDelivery costs support the price.',850,299,356,198,27);
tx(s,'Shared work and automatic\nadaptation require further\nproduct development.',850,519,356,99,23,C.muted);
foot(s,'Proposed budget and milestones for investor discussion. Final staffing and financing terms remain open.');
notes(s,'Budget arithmetic: 900,000+180,000+150,000+120,000+150,000=1,500,000. 18-month average including contingency = 83,333.33/month. Founder and technical delivery includes compensation, taxes/benefits and contractor capacity; final staffing/location assumptions remain open. Price economics should be tested on observed model, research, infrastructure and support costs before offering unrestricted usage. All commercial numbers in this deck are proposed unless expressly sourced. Sources are in relevant slide notes.');
}
await fs.mkdir(TMP+'/renders',{recursive:true});
await (await PresentationFile.exportPptx(p)).save(TMP+'/candidate.pptx');
console.log('Exported '+p.slides.items.length+' slides');
for(let i=0;i<p.slides.items.length;i++){const b=await p.export({slide:p.slides.items[i],format:'png',scale:1});await fs.writeFile(TMP+'/renders/slide-'+String(i+1).padStart(2,'0')+'.png',new Uint8Array(await b.arrayBuffer()));console.log('Rendered '+(i+1));}
await fs.writeFile(TMP+'/source-manifest.json',JSON.stringify(S,null,2));
console.log('DRAFT_READY');
