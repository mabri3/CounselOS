import fs from 'node:fs/promises';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
const ROOT='/Users/bharris/Programs/counsel-os-mvp',T=ROOT+'/.tmp/themis-v12';
const C={paper:'#F7F5F0',ink:'#101B30',muted:'#596173',accent:'#535CB4',bright:'#ADA9FF',gold:'#DFC383',light:'#D6DAE5'};
const p=Presentation.create({slideSize:{width:1280,height:720}});
const S={acc:'https://www.acc.com/sites/default/files/2026-01/2026-ACC-Chief-Legal-Officers-Survey-Key-Findings.pdf',pop:'https://www.acc.com/sites/default/files/resources/upload/US-In-house-Counsel-Population-Statistics.pdf',gc:'https://gc.ai/pricing',harvey:'https://www.harvey.ai/platform/agents',legora:'https://legora.com/',claude:'https://claude.com/plugins/legal',gpt:'https://help.openai.com/en/articles/10169521-projects-in-chatgpt',tr:'https://legal.thomsonreuters.com/en/products/cocounsel-legal',reddit:'https://www.reddit.com/r/legaltech/comments/1v1q70k/help_me_understand_what_harvey_has_that_claude/'};
function tx(s,str,x,y,w,h,size=28,color=C.ink,bold=false,font='Arial') {const z=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});z.text=str;z.text.style={typeface:font,fontSize:size,color,bold,autoFit:'none',wrap:'square',lineSpacing:1.06,insets:{top:0,right:0,bottom:0,left:0}};return z;}
function slide(topic,title,dark=false,size=51){const s=p.slides.add();s.background.fill=dark?C.ink:C.paper;s.dark=dark;tx(s,topic.toUpperCase(),64,37,1110,24,15,dark?C.bright:C.accent,true);tx(s,title,64,93,1150,132,size,dark?C.paper:C.ink,true);tx(s,'THEMIS',64,682,200,18,12,dark?C.light:C.muted,true);tx(s,String(p.slides.items.length).padStart(2,'0'),1170,682,48,18,12,dark?C.light:C.muted);return s;}
function label(s,t,x,y,w=500){tx(s,t.toUpperCase(),x,y,w,30,17,s.dark?C.bright:C.accent,true);}
function foot(s,t){tx(s,t,64,643,1150,31,15,s.dark?C.light:C.muted);}
function note(s,t){s.speakerNotes.textFrame.setText(t);}
async function img(s,file,x,y,w,h){s.images.add({blob:new Uint8Array(await fs.readFile(file)),contentType:'image/png',alt:file.split('/').at(-1),fit:'contain',position:{left:x,top:y,width:w,height:h}});}
function table(s,values,x,y,width,heights,colWidths,size=24){const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width,height:heights.reduce((a,b)=>a+b,0),columnWidths:colWidths,values});t.borders.assign({fill:'#D1D5DE',width:.5,style:'solid'});for(let r=0;r<values.length;r++){t.rows[r].height=heights[r];for(let c=0;c<values[0].length;c++){let a=t.getCell(r,c);a.fill=r===0?C.ink:C.paper;a.text.style={typeface:'Arial',fontSize:size,bold:r===0,color:r===0?C.paper:C.ink};}}return t;}
// 01: State the category immediately. One outcome, one buyer.
{
const s=p.slides.add();s.background.fill=C.ink;
await img(s,ROOT+'/output/deck/assets/bright-editorial/cover-flashlight-bw.png',0,0,1280,720);
const field=tx(s,'',0,0,735,720);field.fill=C.ink;
tx(s,'THEMIS',64,55,600,58,38,C.paper,true);
tx(s,'The AI companion\nfor in-house counsel',64,233,657,161,56,C.paper,true);
tx(s,'Equipped to advise with confidence.',64,439,640,82,32,C.bright,true);
tx(s,'More time to be present in the room,\nshaping business decisions.',64,546,640,85,28,C.paper);
tx(s,'Brian Harris, Founder   /   September 2026',64,676,655,22,16,C.light);
note(s,'Themis is a capable AI companion and a system already adapted to lawyers. The intended outcome is confidence earned through understanding the issue and choices, with more time for business judgment. These are intended benefits, not measured outcomes. Founder-approved statement: Themis equips lawyers to advise with confidence—and gives them more time to be present in the room, shaping business decisions. Existing Themis cover artwork: output/deck/assets/bright-editorial/cover-flashlight-bw.png.');
}
// 02: The preparation burden is specific to advice under incomplete facts.
{
const s=slide('Problem','The business needs advice.\nThe lawyer has to investigate first');
label(s,'The request',64,282);
tx(s,'A product team wants to\nreuse customer data.',64,328,500,104,36,C.ink,true);
tx(s,'The question leaves out the purpose,\npermissions and timing.',64,458,500,106,28,C.muted);
label(s,'The work behind the advice',697,282,515);
tx(s,'Find the facts that change the analysis.\nResearch unfamiliar issues.\nWork through the available choices.\nPrepare advice the business can use.',697,328,515,214,29);
tx(s,'While the lawyer prepares, business decisions keep moving.',64,573,1150,58,32,C.accent,true);
note(s,'Illustrative business request, not a customer quote or legal conclusion. Founder experience and four exploratory interviews in output/research/raw/interviews/in-house-counsel/ inform the problem: incomplete intake, research and verification effort, unfamiliar questions and the need to understand the surrounding answer space. The product north star in AGENTS.md and brand_pitch.md is to reduce cognitive load and equip the lawyer for the decision. Context storage is a supporting capability, not the problem statement.');
}
// 03: Explain why the companion creates confidence, not mere reassurance.
{
const s=slide('Solution','Confidence comes from\nunderstanding the choices',true);
tx(s,'Themis prepares the matter.\nThe lawyer explores the answer space.',64,263,1138,108,39,C.paper,true);
label(s,'A system already adapted to lawyers',64,413,594);
tx(s,'Research and editable drafts.\nMaterial assumptions made visible.\nUseful questions to explore next.',64,457,568,135,29,C.paper);
label(s,'A basis for the lawyer’s judgment',723,413,491);
tx(s,'Work through the options together.\nSee what could change the advice.\nDecide what to recommend and why.',723,457,491,135,28,C.paper);
foot(s,'Product thesis. The lawyer directs the inquiry and owns the decision.');
note(s,'Source: brand_pitch.md and founder-approved positioning in this conversation. Answer space means the plausible options, supporting evidence, assumptions and facts that can change the recommendation. Themis should conduct useful preparation and expose issues without requiring the lawyer to design an AI system. The proposed distinction is the default experience and effort required, not an exclusive ability to reason or ask questions. Prototype supports matters, instructions and editable work product; reliable unprompted discovery and automatic adaptation remain outcomes to validate. Confidence follows a basis for advice, not model certainty.');
}
// 04: One matter makes the product promise concrete.
{
const s=slide('Product in practice','A migration request hides\na separate data-use decision');
label(s,'Illustrative matter',64,265,450);
tx(s,'Keep bank connections live\nduring a migration.',64,308,431,92,31,C.ink,true);
tx(s,'The investigation also surfaces\na plan to use transaction data\nfor new offers.',64,425,431,120,28);
tx(s,'The lawyer can now weigh\nthe permissions for each use.',64,568,431,68,27,C.accent,true);
await img(s,ROOT+'/output/deck/screenshots/matter-relay.png',550,286,665,280);
tx(s,'The matter brings the open choices into view.',550,591,665,43,25,C.muted);
foot(s,'Actual prototype capture with fictional seeded content. Illustrates the intended experience, not proven AI discovery.');
note(s,'Screenshot: output/deck/screenshots/matter-relay.png. Fictional Relay data: vault/03_Matters/relay-open-banking/recommendations.md and drafts/decision-note.md. The seed differentiates continued account connectivity from proposed use for card/lending offers, and sets up alternative customer reauthorization timing. This is an illustration of a useful issue map and decision preparation, not a recorded AI exchange or validated legal advice. Screenshot crop preserves the matter summary and question to resolve. It does not establish that Themis discovered the issues autonomously.');
}
// 05: Put operator credibility early, with actual career evidence.
{
const s=slide('Founder','Built by a GC who has\nbuilt legal teams',true);
tx(s,'Brian Harris',64,266,580,69,47,C.paper,true);
tx(s,'Sole founder',64,342,570,34,25,C.bright);
tx(s,'17 years',64,427,585,106,80,C.gold,true);
tx(s,'practicing law, including general\ncounsel and product counsel roles',64,546,577,84,27,C.paper);
label(s,'Settle and Manifest',720,262,496);
tx(s,'Built legal and compliance functions\nfrom inception.',720,305,496,76,27,C.paper);
label(s,'Affirm and Facebook Portal',720,411,496);
tx(s,'Advised product teams through\nlaunches and regulatory questions.',720,454,496,75,27,C.paper);
tx(s,'AI research at Georgia Tech.\nM.S. Computer Science. J.D. Northwestern.',720,563,496,72,24,C.light);
note(s,'Sources: founder-supplied Brian Resume 01_21_26.docx (1).pdf and brand_pitch.md. Settle: Founding General Counsel, Chief Compliance Officer and Secretary (2021–2024). Manifest: Founding Chief Legal Officer and Chief Compliance Officer (resume dated January 2026). Affirm: product/regulatory counsel leadership (2016–2020), grew that team from three to eight attorneys. Facebook: Associate General Counsel, Portal (2020–2021). Georgia Tech Research Scientist I (2004–2006), AI/NLP document classification and automated redaction research. M.S. CS Georgia Tech, J.D. Northwestern. Seventeen years is current founder-reported experience; resume says 15+. Employer names describe experience, not customer relationships or endorsement. Do not infer current employment from an older Present entry. Brian is the sole founder. A founding technical leader is a planned hire, not an existing team member.');
}
// 06: Compete against credible alternatives and state a measurable wedge.
{
const s=slide('Differentiation','Built around how a small-team\nlawyer reaches a decision');
label(s,'The tools already available',64,263,537);
tx(s,'Claude and ChatGPT',64,307,562,45,32,C.ink,true);
tx(s,'Flexible research, drafting and custom workflows.',64,364,540,77,26,C.muted);
tx(s,'Harvey, Legora, CoCounsel, GC AI',64,470,560,86,30,C.ink,true);
tx(s,'Legal research, work product and workflow tools.',64,569,548,69,26,C.muted);
label(s,'Themis’s proposed advantage',707,263,508);
tx(s,'A prepared matter.\nVisible choices.\nLess work directing AI.',707,307,508,166,39,C.accent,true);
tx(s,'Optimize for the lawyer’s readiness\nto advise, measured against the\ntools they already use.',707,516,508,118,28);
note(s,'Sources checked September 2026: '+S.claude+' ; '+S.gpt+' ; '+S.harvey+' ; '+S.legora+' ; '+S.tr+' ; '+S.gc+'. These platforms overlap materially with the Themis thesis. Claude has a legal plugin configured to organizational playbooks. Harvey markets judgment, legal agents, preferences and review-ready work. GC AI directly serves in-house lawyers and sells individual seats. Do not claim competitors only produce answers, cannot explore, lack lawyer workflows, or cannot adapt. Themis’s proposed advantage combines a narrow buyer, matter preparation, visible decision alternatives and lower steering effort. It is a product/market thesis, not demonstrated superiority or an established moat. Earn repeat use through useful work; reusable practice-specific instructions and evaluation cases could improve that experience over time. No cross-customer data network effect is assumed. Pilot comparison should use reasonably configured Claude/ChatGPT and the specialist tool the lawyer currently uses.');
}
// 07: A time-sensitive buying shift, grounded in a survey rather than hype.
{
const s=slide('Why now','Legal teams are choosing\nhow AI will fit their work');
tx(s,'36%',64,265,535,123,101,C.accent,true);
tx(s,'of surveyed legal departments\nare actively deploying generative AI.',64,410,545,103,29);
tx(s,'63%',715,265,500,123,101,C.accent,true);
tx(s,'of surveyed chief legal officers\nexpect headcount to stay stable.',715,410,500,103,29);
tx(s,'The opportunity is more capacity from the lawyers already in the room.',64,566,1143,69,33,C.ink,true);
foot(s,'ACC 2026 Chief Legal Officers Survey. 1,049 participants across 43 countries.');
note(s,'Source: '+S.acc+' , page 2, finding 05. Survey covers 1,049 participants, 20 industries and 43 countries. The estimates are not restricted to small teams or the United States. Commercial interpretation: departments are adopting AI while expecting stable legal headcount, making the way AI supports existing lawyers a timely buying choice. This does not establish that the market is unserved, that competitors have not solved parts of the problem, or that Themis has proven demand.');
}
// 08: The first buyer and the route to that buyer share a single slide.
{
const s=slide('Initial customer and distribution','The first legal hire\nis our first buyer');
tx(s,'Solo GCs and small product legal teams\nat technology and fintech companies.',64,257,1150,101,37,C.ink,true);
label(s,'A clear reason to try',64,419,567);
tx(s,'Frequent launches. Limited research support.\nAlready using Claude or ChatGPT.\nA live matter that needs deeper exploration.',64,465,575,144,28);
label(s,'A direct route to adoption',735,419,480);
tx(s,'Brian’s counsel network brings the first pilot.\nUseful work earns the next matter.\nPaid use earns a referral or another seat.',735,465,480,144,28);
foot(s,'First 90-day targets after pilot access: 20 qualified conversations, 10 pilot lawyers, 5 paying lawyers.');
note(s,'Sources: founder experience and four exploratory counsel interviews in output/research/raw/interviews/in-house-counsel/. Initial segment, buying trigger and channel are business choices, not measured market shares. First legal hires and product counsel on lean technology/fintech teams have broad questions, limited specialist support and a founder-reachable professional network. No channel partnership, referral, signed pilot or pipeline count is claimed. Proposed 90-day targets: 20 qualified conversations, 10 pilot lawyers and five paying lawyers, beginning when pilot access is ready. Later expansion into other industries and shared team matters depends on observed value and further product development.');
}
// 09: User-approved a la carte offer. The capacity test is explicit.
{
const s=slide('Business model','A legal companion\none lawyer can buy');
tx(s,'$400',64,260,571,130,102,C.accent,true);
tx(s,'per lawyer, per month',64,405,555,48,33,C.ink,true);
tx(s,'Proposed price. Start with one seat.\nMonthly billing. No annual commitment.\nNo setup fee.',64,480,569,145,28,C.muted);
label(s,'A small threshold for useful capacity',722,263,490);
tx(s,'24 minutes\na week',722,308,490,150,55,C.ink,true);
tx(s,'At an assumed $250 per lawyer hour,\nthat time equals the monthly price.',722,496,490,99,28);
foot(s,'Illustration uses four weeks/month. Capacity is not cash savings. Pricing and an 80% gross margin target need validation.');
note(s,'Approved Lean Canvas v4 pricing: $400/seat/month, billed monthly, one seat or more, no required annual commitment or setup fee. At 12 months of continued use, revenue per seat is $4,800. Capacity illustration: $400 ÷ $250/hour = 1.6 hours/month = 96 minutes/month ÷ four weeks = 24 minutes/week. The $250/hour is a modeling assumption, not a measured cost rate. Time recovery is not cash savings or proven ROI. Gross margin target 80% requires direct delivery costs at or below $80/paid seat/month, including applicable model, research, hosting and support costs. Usage allowance must be tested; unlimited usage is not promised. Public comparison: GC AI Individual $500/month ('+S.gc+'). Repository reddit-163 reports Harvey $425/seat/month with five seats and a 12-month term ('+S.reddit+'), implying $25,500/year for that quote. This is a single anonymous reported quote, not a payment or universal price. Themis must win on useful work as well as initial commitment.');
}
// 10: Size the seat revenue pool without disguising a planning guess as SAM.
{
const s=slide('Size of the prize','A $696M annual U.S.\nin-house subscription opportunity',true,49);
tx(s,'145,000',64,275,565,122,87,C.paper,true);
tx(s,'estimated U.S. in-house lawyers',64,424,566,78,29,C.light);
tx(s,'$4,800',737,275,477,122,87,C.gold,true);
tx(s,'annual revenue per lawyer\nat the proposed monthly price',737,424,477,93,28,C.light);
tx(s,'21,000 paying lawyers would generate about $100M a year.',64,562,1147,64,33,C.paper,true);
foot(s,'Full-market model, not a forecast. 21,000 seats is about 14.5% of the U.S. estimate. The starting segment is smaller.');
note(s,'Population source: ACC 2025 analysis of 2024 BLS employment data, '+S.pop+' , pp. 1–2. ACC estimates about 145,000 U.S. in-house lawyers by subtracting law firm and government lawyers from total employed lawyers. Revenue model: 145,000 × $400/month × 12 = $696,000,000/year at full adoption with constant pricing. 21,000 × $4,800 = $100,800,000/year, approximately $100m; 21,000/145,000 = 14.48%. This is a scale illustration, not a forecast, goal with a defined deadline, established serviceable obtainable market, or assertion that acquiring 14.5% is easy. The initially reachable subset of solo/small technology and fintech legal teams is not independently sized, so no arbitrary percentage is presented as measured demand. Expansion from the initial segment to broader in-house counsel requires product and distribution work. No international, law-firm, outside-counsel spend or labor savings is added to subscription market size.');
}
// 11: Show the actual stage, then what turns it into an investable next stage.
{
const s=slide('Evidence and next milestone','The prototype is built.\nRepeat paid use is the next proof');
label(s,'Today',64,270,572);
tx(s,'Working local prototype',64,316,570,49,33,C.ink,true);
tx(s,'Matters, research and editable work product.\nFour exploratory counsel interviews.',64,390,571,106,28,C.muted);
tx(s,'No paid traction demonstrated.',64,556,566,49,25,C.muted);
label(s,'Proposed 18-month targets',719,270,495);
tx(s,'50 paying lawyers\n$240,000 annual recurring revenue',719,316,495,116,32,C.accent,true);
tx(s,'60% return with a second matter.\n25% less total preparation effort.\nA clear basis for the lawyer’s advice.',719,463,495,146,28);
foot(s,'Targets, not results. Compare total effort and useful issues surfaced against the lawyer’s configured usual tools.');
note(s,'Current stage carried from v11 and brand_pitch.md: working local prototype and four exploratory interviews. No actual paying customer or verified paid traction evidence was supplied. Prototype screenshot is seeded fiction, not live customer usage. Targets carried from prior deck, recalculated at approved $400 pricing: 50 × $400 × 12 = $240,000 recurring annual run rate. This is not cumulative recognized revenue. Repeat-use target: 60% of activated pilot lawyers who complete a first matter start a second distinct matter within 30 days. Effort target: median 25% reduction on matched tasks versus configured usual tools, including setup, prompting, source checking, corrections and drafting. Pair readiness with an explanation of the recommendation, material alternatives and what would change it. Targets prove initial paid usefulness, not Series A readiness or repeatable venture-scale distribution. Unit-cost target and customer acquisition evidence remain necessary.');
}
// 12: An ask tied to a specific learning and commercial milestone.
{
const s=slide('Investment proposal','Put a capable companion\nbeside the in-house lawyer',true);
tx(s,'$1.5M',64,262,554,127,100,C.gold,true);
tx(s,'Proposed pre-seed raise\n18 months of focused execution',64,411,559,93,31,C.paper);
label(s,'What the capital enables',738,265,475);
tx(s,'A founding technical team.\nLive use with working lawyers.\nEvidence that lawyers return and pay.',738,310,475,172,29,C.paper);
tx(s,'Themis equips lawyers to advise with confidence—and gives them more time to be present in the room, shaping business decisions.',64,552,1150,108,34,C.paper,true);
note(s,'Proposed $1.5m pre-seed raise and 18-month period carried from prior deck, not a committed round or finalized term sheet. Capital supports founder focus, founding technical delivery, customer development and pilot delivery. Technical leadership remains an open role. Financing instrument, final compensation and hiring sequence remain open. Appendix budget totals $1.5m, including contingency. Closing line is the exact founder-approved positioning and an intended product outcome. No proven time saving or investment return is implied.');
}
// 13: Keep the serious competitive diligence available without slowing the pitch.
{
const s=slide('Appendix / competitive detail','The alternatives already do useful legal work',false,45);
table(s,[['Alternative','Current strengths','Themis must earn the switch'],['Claude / ChatGPT','Research, drafting, custom instructions\nand workflows. Claude has a legal plugin.','Less effort directing the matter\nwith useful questions surfaced.'],['Harvey / Legora','Legal agents, research, document review\nand work adapted to customer methods.','A compelling daily experience\nfor small in-house teams.'],['CoCounsel / GC AI','Legal work product and research.\nGC AI directly serves in-house counsel.','Better preparation for advice\non the buyer’s actual matters.']],64,253,1152,[46,103,103,103],[251,451,450],23);
foot(s,'Positioning comparison, not a controlled benchmark. Feature overlap is substantial.');
note(s,'Official sources: '+Object.entries(S).filter(([k])=>['claude','gpt','harvey','legora','tr','gc'].includes(k)).map(([k,v])=>k+': '+v).join(' ; ')+'. Checked September 2026. Harvey already emphasizes judgment and adaptation to customer playbooks/preferences. Legora markets legal research, agents and in-house use. CoCounsel combines legal work assistance with research offerings; access varies by plan. GC AI provides in-house skills, Word editing, connectors and individual seats. Claude’s legal plugin is designed for in-house workflows and requires playbook configuration. ChatGPT supports continuing project context and custom instructions. This slide intentionally avoids unsupported feature exclusivity or claims that other models refuse exploration. Themis must show value against the actual alternative each pilot lawyer uses.');
}
// 14: Transparent market and price arithmetic.
{
const s=slide('Appendix / market and pricing','A seat model with a low entry commitment',false,47);
table(s,[['Scope or benchmark','Basis','Annual amount'],['Full U.S. in-house model','145,000 seats × $4,800','$696M'],['Scale illustration','21,000 seats × $4,800','$100.8M'],['One Themis seat, proposed','12 monthly payments of $400','$4,800'],['Harvey buyer-reported quote','5 seats × $425 × 12-month term','$25,500']],64,245,1152,[46,63,63,63,79],[410,482,260],23);
tx(s,'Small tech and fintech teams first. Broader in-house use follows demonstrated value.',64,586,1150,48,25,C.accent,true);
foot(s,'ACC population estimate. Themis pricing is proposed. Harvey is one anonymous quote, not a standard rate or verified payment.');
note(s,'ACC population source '+S.pop+'. Themis proposal: $400 monthly, no annual term. The $4,800 row annualizes continued use rather than imposing an annual purchase. Reported Harvey terms: '+S.reddit+' ; source reddit-163 in output/research/raw/legal-ai-reddit-source-corpus.jsonl, live quote verified. Single quote cannot establish universal contract minimums. GC AI public Individual price is $500/month, '+S.gc+'. Other repository report reddit-117 contains a lower Harvey tier near $399, as well as $1,200 and $2,400 scopes, and secondhand Legora pricing around $400/month: https://www.reddit.com/r/legaltech/comments/1qvwswa/pricing_harvey_v_claude_v_legora_v_cocounsel_from/ . These are inconsistent scopes and anonymous reports, not comparable vendor rate cards. Legora does not publish a standard seat rate on its homepage and has announced usage-based Agent Pro pricing; no verified all-in rate assumed. Initial segment size is still to be established. Market counts and annualized prices are a scenario, not revenue forecasts or demand estimates.');
}
// 15: Carry the reviewable financing proposal without inventing committed hires.
{
const s=slide('Appendix / use of funds','An 18-month plan to establish paid use');
table(s,[['Use of funds','Proposed budget'],['Founder and technical delivery','$900,000'],['Customer development','$180,000'],['Models, research and infrastructure','$150,000'],['Secure pilot delivery and operations','$120,000'],['Contingency','$150,000'],['Total','$1,500,000']],64,250,749,[46,48,48,48,48,48,48],[532,217],22);
label(s,'The funding test',873,255,340);
tx(s,'Lawyers use it on live matters.\nThey return and pay.\nPreparation effort falls.\nDelivery costs support the price.',873,302,340,246,28);
tx(s,'Hiring sequence and\nfinancing terms remain open.',873,579,340,63,23,C.muted);
note(s,'Proposed budget carried from v11: $900,000 + $180,000 + $150,000 + $120,000 + $150,000 = $1,500,000. Average 18-month envelope including contingency is $83,333/month. Founder and technical delivery includes compensation, taxes/benefits and contractor capacity, with exact staffing assumptions still open. It is a proposed financing and learning plan, not approved spend or a committed raise. At $400/month, 50 paid seats yield $20,000 monthly recurring revenue ($240,000 annualized), materially below this average spending envelope. The round funds validation and further company development, not a modeled break-even point. Team sharing and automatic adaptation need further work.');
}
// 16: Keep the previously supplied brand principles intact as reference material.
{
const s=p.slides.add();s.background.fill=C.paper;await img(s,ROOT+'/.tmp/themis-v11/trust-source.png',0,0,1280,720);
note(s,'Supplied Themis brand-principles source retained unchanged from the earlier deck. Text is part of the original raster artwork. Humble, curious, present, persistent, supportive and faithful describe intended product behavior, not outcome guarantees. Persistent context supports the product but is not the lead commercial thesis.');
}
await (await PresentationFile.exportPptx(p)).save(T+'/candidate.pptx');
await fs.writeFile(T+'/sources.json',JSON.stringify(S,null,2));
console.log('Exported '+p.slides.items.length+' slides');
