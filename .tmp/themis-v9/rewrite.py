from pathlib import Path
import re
old=Path('.tmp/themis-v8/build.mjs').read_text()
head=old[:old.index('// 1.')].replace('themis-v8','themis-v9').replace('version 8','version 9')
parts={int(m.group(1)):m.group(0) for m in re.finditer(r'// (\d+)\.[\s\S]*?(?=// \d+\.|await fs.mkdir\(TMP|\Z)',old)}
new={}
new[1]=r'''// 1. Confidence is the lead promise.
{
const s=p.slides.add();s.background.fill=C.ink;
await im(s,ROOT+'/output/deck/assets/bright-editorial/cover-flashlight-bw.png',0,0,1280,720);
const field=tx(s,'',0,0,725,720);field.fill=C.ink;
tx(s,'THEMIS',64,52,570,50,32,C.paper,'Arial',true);
tx(s,'Equipped to advise\nwith confidence',64,203,650,180,57,C.paper,'Georgia',true);
tx(s,'A capable AI associate\nbuilt around the lawyer.',67,440,625,110,33,C.paper);
tx(s,'More time in the room,\nshaping business decisions.',67,575,630,69,27,C.gold);
tx(s,'Brian Harris, Founder   /   September 2026',67,673,650,25,17,C.light);
notes(s,'Themis’s intended customer outcome, not a measured performance claim. Positioning follows the founder-approved promise: Themis equips lawyers to advise with confidence—and gives them more time to be present in the room, shaping business decisions. Associate describes the intended working relationship, not a human employee. Artwork retained from v7.');
}
'''
new[2]=r'''// 2. The unanswered question behind the business request.
{
const s=sl('The lawyer’s problem','The business asks, “Can we ship Friday?”');
tx(s,'The lawyer needs to know\nwhat could change the answer.',64,239,1095,116,43,C.ink,'Georgia',true);
label(s,'Before giving the advice',64,399,580);
tx(s,'Which facts matter? What have we missed?\nWhat are the options and their tradeoffs?',64,444,637,113,29);
label(s,'Often without an associate',780,399,430);
tx(s,'The same lawyer must investigate\nthe issue and help the business\ndecide what to do.',780,444,432,132,28,C.muted);
tx(s,'The business needs their judgment while the decision is still taking shape.',64,587,1140,54,29,C.blue,'Georgia',true);
notes(s,'Illustrative launch request, not a customer quotation. Founder thesis supported directionally by brand_pitch.md and four exploratory counsel interviews in output/research/raw/interviews/in-house-counsel/. Interviews describe unfamiliar legal questions, incomplete intake, verification effort and the importance of business context. They do not establish prevalence or customer traction. The pain is reaching grounded readiness to advise under time pressure, not research being inherently valueless.');
}
'''
new[3]=r'''// 3. Themis builds the working relationship.
{
const s=sl('Themis','A capable associate, built around the lawyer',true,48);
tx(s,'Lawyers should not need to build an AI system\nto get a capable working partner.',64,234,1130,108,35,C.paper,'Georgia');
label(s,'Themis carries the preparation',64,390,560,true);
tx(s,'Investigates the matter and brings back\nuseful analysis in the lawyer’s working style.\nSurfaces questions worth exploring next.',64,438,576,145,28,C.paper);
label(s,'The lawyer works through the choice',730,390,485,true);
tx(s,'Examines the options with Themis.\nSees what could change the advice.\nDecides what to recommend and why.',730,438,484,145,28,C.paper);
foot(s,'Product thesis. The prototype supports matters, editable instructions and work product. Pilot outcomes remain to be proved.',true);
notes(s,'Sources: brand_pitch.md, docs/PRD.md, vault/00_System/user.md and the founder’s current direction. A strong associate adapts to the partner’s style, rather than requiring the partner to learn a new method. Themis aims to provide that system and useful investigative initiative. Existing preferences and workflows do not prove effortless adaptation or autonomous issue discovery. Confidence should follow understanding and useful materials, not reassurance or apparent model certainty.');
}
'''
new[4]=r'''// 4. Show the exploration that earns confidence.
{
const s=sl('An example matter','A migration question reveals a data-use choice');
label(s,'The business request',64,238,1080);
tx(s,'“Can customers keep their bank connections during the migration?”',64,282,1140,78,33,C.ink,'Georgia',true);
label(s,'What the investigation surfaces',64,393,620);
tx(s,'Growth also wants transaction data for new offers.\nThe existing consent does not clearly cover that use.',64,435,640,108,28);
label(s,'What the lawyer can now weigh',778,393,434);
tx(s,'Separate the new uses from the migration.\nThen weigh a fixed reauthorization deadline\nagainst waiting for each bank’s next event.',778,435,430,145,27);
tx(s,'The lawyer sees a choice the original question did not expose.',64,594,1138,47,30,C.blue,'Georgia',true);
foot(s,'Illustrative walkthrough based on fictional Relay demo data. Not a recorded AI exchange or verified legal advice.');
notes(s,'Sources: vault/03_Matters/relay-open-banking/recommendations.md and drafts/decision-note.md. The opening request is invented explanatory copy. Seeded demo facts separate existing account services from proposed marketing/lending uses, and identify a choice between all-user reauthorization within 90 days and the next bank-required event. Neither path is a verified legal conclusion here. This demonstrates the intended experience of exposing a material adjacent issue and supporting the lawyer’s decision. It does not demonstrate that the running product discovered it autonomously.');
}
'''
new[5]=r'''// 5. Actual prototype, clearly bounded evidence.
{
const s=sl('Working prototype','The materials and the open choice, together');
await im(s,ROOT+'/output/deck/screenshots/matter-relay.png',64,255,862,357,{left:.19,top:.166,right:.16,bottom:.57});
label(s,'Ready to advise',964,258,245);
tx(s,'The matter brings\nthe business facts\nand open choice\ninto view.',964,307,248,146,25);
tx(s,'An editable decision\nnote sets out a\nproposed path and\nits conditions.',964,493,248,130,25,C.blue,'Georgia',true);
foot(s,'Actual prototype capture. Fictional seeded demo content, including the separate draft decision note.');
notes(s,'Actual source screenshot: output/deck/screenshots/matter-relay.png, used in v7/v8. Draft decision note: vault/03_Matters/relay-open-banking/drafts/decision-note.md, separate from the screenshot. The screenshot shows matter organization and the open decision question. Seeded content and the draft support the intended work-product structure, not measured autonomous research performance. Product aims to give the lawyer inspectable materials and understanding to stand behind the advice. Useful recommendations remain distinct from explicitly recorded lawyer decisions.');
}
'''
new[6]=r'''// 6. Compete with strong versions of the real alternatives.
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
'''
new[7]=parts[6].replace('// 6.','// 7.').replace('Legal teams are deciding how AI will work.','The working habits of legal AI are forming now').replace('Our opening: help a small legal team do more useful work with the people it already has.','Our opening: become the associate small legal teams turn to as they work through decisions.').replace('1130,82,34','1130,82,32')
new[8]=parts[7].replace('// 7.','// 8.').replace('A launch adds unfamiliar legal work.\\nThe team has no junior support.\\nThe backlog grows before headcount does.','An unfamiliar issue lands before a launch.\\nThe lawyer has AI tools but little support.\\nThey need to understand enough to advise.').replace('Solo general counsel\\nor a 1–5 lawyer team','Solo general counsel\\nor a small legal team').replace('Proposed initial segment. Interview signals support the need; paid demand remains to be tested.','Four exploratory counsel interviews inform this focus. They are research, not customers or pilot commitments.')
new[9]=parts[9].replace('Sell capacity back to the legal team.','A subscription for associate support').replace('Proposed starting price\\nOne seat to start. Expand with use.','Proposed starting price\\nOne lawyer. One real matter to start.').replace('Measure time saved after checking\\nand correcting the work.','Track readiness to advise alongside\\nnet time saved.').replace('Effort','Effort')
new[10]=parts[10].replace('A focused entry into a $870M annual opportunity.','U.S. in-house counsel offers room to grow')
new[11]=parts[11].replace('Use the lawyer’s preferred format. Compare total effort with their usual tools.','Compare readiness to advise and total effort with configured Claude or ChatGPT.')
new[12]=parts[12].replace('I wanted to multiply what one lawyer can do.','I know what it takes to be ready to advise.').replace("true,49);","true,48);")
new[13]=r'''// 13. Make the product thesis falsifiable.
{
const s=sl('What the next 18 months must prove','Confidence grounded in better understanding');
label(s,'Product evidence',64,251,565);
tx(s,'Does Themis surface material issues\nwith less lawyer steering?',64,297,568,96,33,C.ink,'Georgia',true);
tx(s,'Can the lawyer explain the recommendation\nand what could change it?\n\nDoes total preparation effort fall?',64,420,570,154,27,C.muted);
label(s,'Commercial targets',755,251,450);
tx(s,'25 paying teams\n50 paying lawyers\n$300,000 annual recurring revenue',755,301,450,148,29,C.blue,'Georgia',true);
tx(s,'60% start a second matter\nwithin 30 days.',755,487,450,92,28);
foot(s,'Proposed targets, not results. Today: local prototype and four exploratory interviews. No paid traction demonstrated.');
notes(s,'Pilot plan: compare matched tasks with configured Claude (including legal tools) and ChatGPT. Capture total lawyer time including setup, prompting, checking, corrections and drafting. Record relevant issues surfaced without lawyer prompting. Pair self-reported readiness to advise with the lawyer’s explanation of the recommendation, support and material alternatives; confidence alone is insufficient. Proposed effort target: median 25% reduction. Repeat-use denominator: activated pilot lawyers completing their first matter; 60% start a second distinct matter within 30 days. Commercial model: 25 teams × 2 seats × $500/month × 12 = $300,000 annual recurring revenue run rate. Not recognized cumulative revenue. Shared work needs development. Retention thesis: repeated useful support earns a habitual role in the lawyer’s work. It is not yet a proven moat.');
}
'''
new[14]=r'''// 14. The ask pays off the opening promise.
{
const s=sl('Investment proposal','Associate support for the small legal team',true,49);
tx(s,'$1.5M',64,251,590,125,98,C.gold,'Georgia',true);
tx(s,'Proposed pre-seed raise\n18 months of focused execution',64,397,590,99,31,C.paper);
label(s,'The next stage',760,251,450,true);
tx(s,'Build the founding technical team.\nPut Themis into live legal matters.\nProve lawyers return and pay.',760,304,450,148,28,C.paper);
tx(s,'Themis equips lawyers to advise with confidence—and gives\nthem more time to be present in the room,\nshaping business decisions.',64,541,1150,115,32,C.paper,'Georgia',true);
notes(s,'Founder-approved closing line retained exactly. Product outcomes are the intended promise, not proven results. Proposed raise and 18-month plan, carried from v8 at the founder’s request for commercial proposals. Budget: $900k founder and technical delivery; $180k customer development; $150k models/research/infrastructure; $120k secure pilot delivery and operations; $150k contingency. Total $1.5m. Founding technical leader remains open. Financing instrument and final staffing remain open. Commercial milestones are targets.');
}
'''
for i in [15,16,17]:new[i]=parts[i]
new[17]=new[17].replace('Lawyers return.\\nThey pay for continued use.\\nTotal effort falls.\\nDelivery costs support the price.','Advice has a clear basis.\\nLawyers return and pay.\\nTotal effort falls.\\nDelivery costs support the price.')
tail="await fs.mkdir(TMP+'/renders',{recursive:true});\nawait (await PresentationFile.exportPptx(p)).save(TMP+'/candidate.pptx');\nconsole.log('Exported '+p.slides.items.length+' slides');\nawait fs.writeFile(TMP+'/source-manifest.json',JSON.stringify(S,null,2));\n"
Path('.tmp/themis-v9/build.mjs').write_text(head+''.join(new[i] for i in range(1,18))+tail)
Path('.tmp/themis-v9/crop-package.py').write_text(Path('.tmp/themis-v8/crop-package.py').read_text().replace('themis-v8','themis-v9').replace('slide3.xml','slide5.xml'))
Path('.tmp/themis-v9/finalize.mjs').write_text(Path('.tmp/themis-v8/finalize.mjs').read_text().replace('themis-v8','themis-v9').replace('2026-v8','2026-v9').replace('validation-v8','validation-v9'))
