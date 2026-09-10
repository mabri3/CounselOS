import fs from 'node:fs/promises';
import {Presentation, PresentationFile} from '@oai/artifact-tool';
import {finalizePresentation} from '/Users/bharris/.codex/plugins/cache/openai-primary-runtime/presentations/26.903.11726/skills/presentations/container_tools/artifact_tool_utils.mjs';

const ROOT='/Users/bharris/Programs/counsel-os-mvp';
const TMP=ROOT+'/.tmp/themis-vc-pitch';
const OUT=ROOT+'/output/deck/vc/Themis-VC-Pitch-September-2026-v7.pptx';
const SKILL='/Users/bharris/.codex/plugins/cache/openai-primary-runtime/presentations/26.903.11726/skills/presentations';
const PY='/Users/bharris/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
const C={paper:'#FAF8F2',ink:'#17243E',muted:'#596273',blue:'#4169A4',gold:'#B18427',white:'#FFFFFF'};
const p=Presentation.create({slideSize:{width:1280,height:720}});
const assets=ROOT+'/output/deck/assets/bright-editorial/';
const noteSource='Source: brand_pitch.md and founder interview in this task. Strategic claims are hypotheses. No customer traction or measured time savings is claimed.';
function text(s,str,x,y,w,h,size=26,color=C.ink,font='Arial',bold=false){
 const sh=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 sh.text=str;sh.text.style={typeface:font,fontSize:size,color,bold,autoFit:'none',wrap:'square',lineSpacing:1.1,insets:{top:0,right:0,bottom:0,left:0}};return sh;
}
function slide(label,title,{dark=false,size=48}={}){
 const s=p.slides.add(); s.background.fill=dark?C.ink:C.paper;
 const fg=dark?C.paper:C.ink;
 text(s,label.toUpperCase(),64,40,1080,24,15,dark?'#D8B66A':C.blue,'Arial',true);
 if(title)text(s,title,64,89,1140,125,size,fg,'Georgia',true);
 text(s,'THEMIS',64,678,150,20,12,dark?'#C6CEDB':C.muted,'Arial',true);
 text(s,String(p.slides.items.length).padStart(2,'0'),1180,678,40,20,12,dark?'#C6CEDB':C.muted);
 s.speakerNotes.textFrame.setText(noteSource);return s;
}
async function img(s,file,x,y,w,h,fit='contain'){
 s.images.add({blob:new Uint8Array(await fs.readFile(file)),contentType:'image/png',alt:file.split('/').at(-1),fit,position:{left:x,top:y,width:w,height:h}});
}
function item(s,n,title,body,x,y,w=500,dark=false){
 text(s,n,x,y,55,35,21,dark?'#D8B66A':C.blue,'Arial',true);
 text(s,title,x+60,y,w-60,44,29,dark?C.paper:C.ink,'Georgia',true);
 text(s,body,x+60,y+53,w-60,105,23,dark?'#DCE1EA':C.muted);
}

// 1. Minimal cover with the existing flashlight illustration.
{
 const s=p.slides.add();s.background.fill=C.ink;
 await img(s,assets+'cover-flashlight-bw.png',0,0,1280,720,'contain');
 const coverField=text(s,'',0,0,690,720);coverField.fill=C.ink;
 text(s,'THEMIS',64,55,550,50,31,C.paper,'Arial',true);
 text(s,'More capacity for\nthe work only the\nlawyer can do.',64,190,670,270,61,C.paper,'Georgia',true);
 text(s,'An AI workspace that helps small legal teams turn incomplete business requests into organized analysis, usable work, and lawyer-owned decisions.',68,500,610,112,25,'#DBE1EB');
 text(s,'Brian Harris, Founder',68,646,550,25,18,'#DBE1EB');
 s.speakerNotes.textFrame.setText(noteSource+'\nArtwork: existing project asset cover-flashlight-bw.png. Conceptual illustration.');
}
// 2. Founder-observed pain, not invented statistics.
{
 const s=slide('The capacity problem','Judgment is scarce. Preparation consumes it.');
 text(s,'THE REQUEST · 4:12 P.M.',64,237,430,28,16,C.blue,'Arial',true);
 text(s,'“Can we ship Friday?”',64,283,500,72,43,C.ink,'Georgia',true);
 text(s,'That short message leaves out facts the legal answer may depend on: how the product works, which company does what, when each step happens, and what the company decided before.',64,379,500,190,23,C.muted);

 text(s,'THE LAWYER’S WORK BEFORE ANSWERING',650,237,555,28,16,C.blue,'Arial',true);
 text(s,'Gather the product documents and history.\nVerify what the business is actually doing.\nFind the governing law and recent developments.\nExplain the options and what could change the answer.',650,282,565,186,23,C.ink);
 text(s,'GENERIC AI DOES NOT REMOVE THIS PREPARATION',650,484,555,36,15,C.blue,'Arial',true);
 text(s,'The lawyer must still load the context, point the model toward the right issues, challenge confident assumptions, and check the sources.',650,527,565,86,22,C.muted);

 text(s,'The business asked for an answer. The lawyer first has to build the question.',64,615,1140,44,28,C.ink,'Georgia',true);
 s.speakerNotes.textFrame.setText(noteSource+'\nFounder observation from 17 years of legal work and direct use of AI tools. The time, question, and product request are illustrative. They are not a measured customer incident or time study. The slide makes the actor explicit: the in-house lawyer reconstructs the business and legal context and reviews the generic AI answer.');
}
// 3. Founder insight.
{
 const s=slide('The insight','The business asks for a yes or no.\nThe lawyer needs the conditions behind it.',{dark:true,size:45});
 text(s,'BUSINESS QUESTION',64,259,420,40,18,'#D8B66A','Arial',true);
 text(s,'“Can we launch Friday?”',64,313,460,155,43,C.paper,'Georgia');
 text(s,'THE ANSWER MAY CHANGE BASED ON',610,259,590,40,18,'#D8B66A','Arial',true);
 text(s,'What the product actually does\nWhich company handles the money or data\nWhen each step happens\nWhere the product and users are located\nWhich laws and earlier company decisions apply',610,312,600,260,26,C.paper);
 text(s,'Generic AI often answers from the facts it receives. A lawyer must prepare for facts that are missing, disputed, or wrong.',64,601,1135,57,23,'#DCE1EA');
}
// 4. Why now, carefully bounded.
{
 const s=slide('Why now','AI can now do useful legal work.\nIt still needs a lawyer to make it useful.',{size:45});
 text(s,'Brian began building Themis after using newer AI models for legal research, synthesis, and drafting in his own work.',64,258,520,190,29,C.ink,'Georgia');
 text(s,'WITHOUT A LEGAL WORKSPACE, THE LAWYER MUST REPEAT',700,258,500,45,17,C.blue,'Arial',true);
 text(s,'Explain the company and product\nUpload the matter documents\nGuide the model toward the relevant law\nChallenge its assumptions\nTurn the result into usable legal work',700,323,500,245,26,C.muted);
 text(s,'The opportunity is to design the product around how lawyers examine questions and reach decisions.',64,601,1135,48,24,C.ink);
}
// 5. Product experience and essence.
{
 const s=slide('Themis','Themis turns an incomplete request into\na legal matter the lawyer can work from.',{size:43});
 text(s,'Themis is a matter-centered AI workspace for in-house lawyers. It keeps the work around a business question together as the facts and law change.',64,251,530,150,28,C.ink,'Georgia');
 text(s,'THE EFFICIENCY GAIN',64,420,530,28,18,C.blue,'Arial',true);
 text(s,'The lawyer stops rebuilding the matter before every prompt and reaches a usable legal picture faster.',64,461,530,78,24,C.ink,'Georgia',true);
 text(s,'EACH MATTER CONNECTS',700,251,500,35,18,C.blue,'Arial',true);
 text(s,'Original business request\nCompany context and source documents\nFacts, assumptions, and open questions\nResearch and supported analysis\nDraft work and lawyer-recorded decisions',700,309,500,240,25,C.muted);
 text(s,'Themis helps lawyers feel clear, capable, and supported when the judgment matters most.',64,578,1140,72,31,C.blue,'Georgia');
 s.speakerNotes.textFrame.setText(noteSource+'\nIntended complete experience. The local prototype already supports matter records, research, drafting, and decisions. The efficiency statement is a product promise, not a measured time-savings claim. Brand Essence follows the user’s exact supplied wording.');
}
// 6. Required editable division-of-labor table.
{
 const s=slide('The division of labor','Themis brings intelligence at scale.\nThe lawyer brings judgment.',{size:46});
 text(s,'Themis prepares and preserves the work around the decision. The lawyer applies context, risk tolerance, and authority.',64,213,1150,35,20,C.muted);
 const values=[['Themis brings','The lawyer brings'],['Speed and capacity','Business and human context'],['Research and analysis','Experience and wisdom'],['Persistent memory','Values and risk tolerance'],['Questions and alternatives','The choice of path'],['Accurate, well-supported work','Ownership of the decision']];
 const t=s.tables.add({rows:6,columns:2,left:64,top:263,width:1152,height:299,columnWidths:[576,576],values});
 t.borders.assign({fill:'#D8DCE1',width:0.5,style:'solid'});
 for(let r=0;r<6;r++){t.rows[r].height=r===0?55:50;for(let c=0;c<2;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:C.paper;
  cell.text.style={typeface:'Arial',fontSize:25,bold:r===0,color:r===0?C.paper:C.ink};
 }}
 text(s,'More capacity for the work only the lawyer can do.',64,603,1150,50,33,C.blue,'Georgia',true);
 s.speakerNotes.textFrame.setText(noteSource+'\nUser-approved headline and all five comparison rows preserved. Scale is a capacity thesis, not measured throughput. The lawyer also brings intelligence. Themis uses the context the lawyer supplies.');
}
// 7. Simple conceptual sequence, not a fabricated screenshot.
{
 const s=slide('Proposed product interaction','One missing fact can change the legal analysis.');
 text(s,'BUSINESS REQUEST',64,216,1115,28,17,C.blue,'Arial',true);
 text(s,'“Our marketplace will move money from a customer to a seller. Do we need to change the launch plan?”',64,252,1115,70,25,C.muted);
 item(s,'01','Map transaction','Organize each party, account, transfer, and point in time.',64,352,345);
 item(s,'02','Find key fact','Does the company ever receive or control the funds, even briefly?',456,352,345);
 item(s,'03','Compare paths','Explain why the fact matters and research each relevant legal path.',848,352,350);
 text(s,'Themis shows where the analysis can change. The lawyer determines which facts and path apply.',64,565,1120,70,27,C.blue,'Georgia');
 text(s,'Concept illustration. This is not a licensing conclusion or a shipped interactive feature.',64,642,1120,25,16,C.muted);
}
// 8. Customer and expansion without fabricated market sizing.
{
 const s=slide('Initial customer','The first buyer is the lawyer carrying\nan entire legal function.',{size:45});
 text(s,'INITIAL USER',64,250,485,30,17,C.blue,'Arial',true);
 text(s,'Solo general counsel\nor product lawyer',64,302,500,105,38,C.ink,'Georgia',true);
 text(s,'Often works without junior support and must answer product and business questions across the company.',64,442,500,115,25,C.muted);
 text(s,'TEAM EXPANSION',704,250,485,30,17,C.blue,'Arial',true);
 text(s,'In-house legal team\nwith fewer than ten lawyers',704,302,500,105,38,C.ink,'Georgia',true);
 text(s,'Shared matters can let a second lawyer see the request, facts, research, decisions, and next open question without a long handoff.',704,442,500,130,25,C.muted);
 text(s,'Business hypothesis: earn repeat use from one lawyer, then prove that shared context supports team adoption.',64,620,1120,42,21,C.muted);
}
// 9. Exact six principle headings, fuller supplied slide in appendix.
{
 const s=slide('Trust through behavior','Legal AI earns trust through observable behavior.',{dark:true,size:43});
 text(s,'The product must show what it knows, what it does not know, and who owns the decision.',64,205,1130,35,21,'#DCE1EA');
 const a=[['Humble','Marks uncertainty instead of pretending ambiguity disappeared.'],['Curious','Asks the factual question that could change the analysis.'],['Present','Remains available without taking control of the decision.'],['Persistent','Carries the matter context forward.'],['Supportive','Strengthens judgment instead of claiming legal authority.'],['Faithful','Records the lawyer’s decision without rewriting it.']];
 for(let i=0;i<6;i++){const x=i%2?688:64,y=263+Math.floor(i/2)*116;text(s,a[i][0],x,y,530,38,28,C.paper,'Georgia',true);text(s,a[i][1],x,y+42,530,54,20,'#DCE1EA');}
 s.speakerNotes.textFrame.setText('Source: user-supplied THEMIS THESIS / 08 slide. All six principle headings are verbatim. Descriptions on this slide are short summaries. The complete original slide appears in the appendix. These are behavioral requirements, not a guarantee of legal accuracy.');
}
// 10. Business case framed as the repeat-use thesis.
{
 const s=slide('The adoption thesis','Themis must beat the lawyer’s current tool stack.');
 text(s,'CURRENT WORKFLOW',64,240,500,30,18,C.blue,'Arial',true);
 text(s,'General AI such as ChatGPT or Claude\nLegal and web research sources\nDocuments, email, and Slack\nManual notes and personal memory',64,296,510,220,27,C.ink,'Georgia');
 text(s,'THE TEST FOR THEMIS',704,240,500,30,18,C.blue,'Arial',true);
 text(s,'Does the lawyer spend less total effort?\nCan the lawyer inspect the sources quickly?\nDoes Themis remember relevant company context?\nDoes the lawyer return with the next matter?',704,296,510,220,26,C.ink,'Georgia');
 text(s,'Repeat use and willingness to pay remain to be proven.',64,603,1120,42,27,C.muted);
 s.speakerNotes.textFrame.setText(noteSource+'\nBusiness hypothesis. Stored files alone are not a moat. Pricing, willingness to pay, market size, and acquisition economics remain unvalidated. No claim that alternatives lack these features.');
}
// 11. Sole founder, resume-backed selected facts.
{
 const s=slide('Founder','Founder experience spans the user problem\nand the technology.',{size:45});
 text(s,'LEGAL EXPERIENCE',64,243,500,30,18,C.blue,'Arial',true);
 text(s,'17 years as a lawyer\nGeneral counsel and product counsel\nBuilt legal functions and led teams',64,304,520,180,30,C.ink,'Georgia');
 text(s,'TECHNICAL EXPERIENCE',704,243,500,30,18,C.blue,'Arial',true);
 text(s,'Earlier AI and natural-language research at Georgia Tech\nM.S. in Computer Science, Georgia Tech\nJ.D., Northwestern',704,304,510,200,28,C.ink,'Georgia');
 text(s,'Brian Harris is the sole founder. He built Themis to give small legal teams the capacity he wanted as a lawyer and legal leader.',64,565,1135,76,27,C.blue,'Georgia');
 s.speakerNotes.textFrame.setText('Sources: founder interview in this task and Brian Resume 01_21_26.docx (1).pdf, supplied January 2026 résumé. Seventeen years is founder-reported; résumé states 15+. Roles describe experience, not employer endorsement. Current employment is not inferred from the résumé. The capacity statement summarizes the founder’s motivation.');
}
// 12. Actual prior prototype image and honest next milestone.
{
 const s=slide('Prototype and next milestone','A working prototype exists.\nThe next proof is attorney return use.',{size:45});
 await img(s,ROOT+'/output/deck/screenshots/matter.png',64,237,650,395,'contain');
 text(s,'BUILT TODAY',808,237,405,25,16,C.blue,'Arial',true);
 text(s,'Local prototype with matter context, research, editable drafts, and explicit lawyer-recorded decisions.',808,276,405,118,23,C.muted);
 text(s,'NEXT PROOF',808,412,405,25,16,C.blue,'Arial',true);
 text(s,'Attorneys use Themis on real questions and return with another matter.',808,451,405,82,23,C.muted);
 text(s,'WHAT TO MEASURE',808,553,405,25,16,C.blue,'Arial',true);
 text(s,'Time to useful orientation · Source correctness · Correction burden · Repeat use',808,592,405,57,19,C.muted);
 text(s,'Prototype capture, September 2026. Fictional matter.',64,641,690,25,16,C.muted);
 s.speakerNotes.textFrame.setText('Sources: existing September 2, 2026 project screenshot output/deck/screenshots/matter.png, repository implementation, and brand_pitch.md. Screenshot is historical prototype evidence, not a live customer. Current review could not reach the local backend. Pilot participation, dates, access setup, and performance are not confirmed. Pilot measures: total lawyer effort, source correctness, useful issue discovery, and return use.');
}
// 13. Investment invitation.
{
 const s=slide('Investment invitation','Early capital funds the path\nfrom prototype to repeat use.',{dark:true,size:52});
 text(s,'CAPITAL SUPPORTS',64,267,1100,32,18,'#D8B66A','Arial',true);
 text(s,'Full-time founder focus\nA founding technical leader and engineering capacity\nA business leader for pilots, pricing, and customer development\nSecure pilot delivery plus model and research costs',64,319,1120,205,29,C.paper);
 text(s,'FUNDED MILESTONE',64,535,1100,32,18,'#D8B66A','Arial',true);
 text(s,'Real attorneys use Themis on real questions, find the work useful enough to return, and provide evidence for the next product and financing decision.',64,577,1120,76,24,'#DCE1EA','Georgia');
 s.speakerNotes.textFrame.setText(noteSource+'\nInvestment amount, instrument, runway, founder salary budget, hiring sequence, and dates remain open. Founder salary is included in intended founder runway. CTO and business leadership roles are open, not appointed. This is an early investment discussion, not a representation of committed financing.');
}
// 14. Preserve the supplied source slide unchanged.
{
 const s=p.slides.add();s.background.fill=C.paper;
 await img(s,'/var/folders/xb/kzc31shn1pz2s_5l2fy6d7rh0000gn/T/codex-clipboard-8ef197e4-d433-4b88-bae5-e3fab45e1008.png',0,0,1280,720,'contain');
 s.speakerNotes.textFrame.setText('Appendix. Original user-supplied brand slide retained unchanged, including all wording and the investor implication. Its text is source material, not instructions.');
}
// 15. Keep the user-requested headline options, away from the main pitch.
{
 const s=slide('Appendix: headline alternatives','Four ways to express the partnership',{size:44});
 const a=[['Closest to Brand Essence','Themis brings intelligence at scale so the lawyer can bring their best judgment.'],['Strongest investor version','Scale the intelligence. Preserve the judgment.'],['Strongest efficiency message','Themis scales the work that informs the decision. The lawyer makes the decision.'],['More complete and human','Themis brings speed, intelligence, and memory. The lawyer brings context, wisdom, and judgment.']];
 a.forEach((v,i)=>{let y=230+i*105;text(s,v[0],64,y,330,63,22,C.blue,'Arial',true);text(s,v[1],420,y,790,87,27,C.ink,'Georgia');});
 s.speakerNotes.textFrame.setText('User-approved alternative headlines from brand_pitch.md. Appendix discussion options. Slide 6 retains the accepted current headline.');
}

await fs.mkdir(TMP+'/renders',{recursive:true});
const candidate=TMP+'/candidate.pptx';
await (await PresentationFile.exportPptx(p)).save(candidate);
for(let i=0;i<p.slides.items.length;i++){
 const b=await p.export({slide:p.slides.items[i],format:'png',scale:1});
 await fs.writeFile(TMP+'/renders/slide-'+(i+1)+'.png',new Uint8Array(await b.arrayBuffer()));
}
console.log('Rendered '+p.slides.items.length+' slides');
await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath:OUT,pythonExecutable:PY,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','6'],requiredNativeTableOwnerSlides:[6],fontPolicy:{basis:'design',families:['Georgia','Arial']},verifyArtifactToolImport:true,receiptPath:TMP+'/validation-v7.json'});
console.log(OUT);
