import fs from 'node:fs/promises';
import {FileBlob,PresentationFile} from '@oai/artifact-tool';
const T='/Users/bharris/Programs/counsel-os-mvp/.tmp/themis-lean-canvas-v2';
const p=await PresentationFile.importPptx(await FileBlob.load('/Users/bharris/Downloads/BDV - Lean Canvas (template 08142025).pptx'));
const entries=[
['sh/kvqx0vqd','Unseen issues can change the advice.\n\nResearch and preparation absorb time.\n\nDirecting general AI adds work.'],
['sh/lwzy90ry','Explore the matter and surface useful questions.\n\nBring back research and editable drafts.\n\nAdapt to the lawyer’s working style.'],
['sh/yt8fyl87','Themis equips lawyers to advise with confidence—and gives them more time to be present in the room, shaping business decisions.'],
['sh/juhg7q9s','17 years in law, plus AI research experience.\n\nDirect access to counsel feedback.\n\nFirsthand insight into how lawyers work.'],
['sh/wr6xwbq1','Solo general counsel and small in-house legal teams.\n\nStart with product and regulatory work at technology and fintech companies.'],
['sh/xsfy5grm','Readiness to advise, backed by understanding.\n\nUseful issues surfaced.\nNet lawyer time saved.\n\nPilot goals: 60% repeat use; 25% less effort.'],
['sh/dc7md8fe','A capable AI companion built around the lawyer.\n\nIt helps you explore the options so you can give advice you understand and stand behind.'],
['sh/cby5k3yt','Founder’s counsel network.\n\nLive-matter demos and supported pilots.\n\nCounsel communities and peer referrals.'],
['sh/ra54bix8','Product lawyers with live, unfamiliar questions.\n\nAlready using AI and eager for support that fits their work.\n\nReady to try one real matter.'],
['sh/q9wnidgn','Proposed recurring price: $500 per lawyer/month ($6,000/year).\nStart with one seat; grow through repeat use and team expansion.\nOne-time fees: none planned. Gross margin target: 80%.\nIllustrative customer lifetime value: $14,400 per seat over 3 years at 80% margin.\nPricing, retention and margin are planning assumptions to test.'],
['sh/5onm98f2','People: product development, engineering and customer support.\nUsage: AI models, research tools and hosting.\nCustomer acquisition: founder outreach, demos and supported pilots.\nDistribution: digital access, onboarding and payment processing.\nOperations: security, administration and legal costs.'],
['sh/4ne5g3yh','Themis'],['sh/3m547yxw','Brian Harris'],['sh/ilw3etgr','04/09/2026'],
['sh/9kr6lsfm','Claude and ChatGPT.\n\nHarvey, Legora, CoCounsel and GC AI.\n\nManual research and drafting.\n\nColleagues and outside counsel.']
];
for(const [id,copy] of entries){const s=p.resolve(id);s.text=copy.split('\n\n').map(t=>({runs:[t],bulletCharacter:'',marginLeft:0,indent:0,spaceBefore:0,spaceAfter:450}));s.text.style={typeface:'Quattrocento Sans',fontSize:id==='sh/q9wnidgn'?13:13.5,color:'#444444',bold:false,italic:false,autoFit:'none',wrap:'square',lineSpacing:1.04,insets:{top:5,right:7,bottom:4,left:7}};}
const uv=p.resolve('sh/yt8fyl87');uv.position={left:427,top:126,width:184.17,height:146.67};
p.slides.items[0].speakerNotes.textFrame.setText('Themis Lean Canvas, September 4, 2026. Source: founder-approved positioning and Themis VC Pitch September 2026 v10; brand_pitch.md; four exploratory counsel interviews. Companion is the approved product relationship. Product outcomes, channels and early-adopter criteria are business hypotheses, not measured results. Founder experience is founder-reported. Alternatives include Claude, ChatGPT, Harvey, Legora, CoCounsel and GC AI. The founder requested the named legal platforms. Their inclusion makes no claim that they lack research or legal workflows. Proposed subscription is $500/seat/month; no annual discount or setup fee assumed. Proposed gross margin target is 80%, not measured. Illustrative lifetime value uses gross profit: $500 × 12 months × 3 years × 80% = $14,400 per seat, undiscounted and before acquisition costs; 3-year retention is an assumption. Pilot goals: 60% of activated lawyers start a second matter within 30 days of completing the first; median 25% less total lawyer effort versus matched tasks using configured usual tools. Measure setup, prompting, verification, correction and drafting. Pair readiness with the lawyer’s understanding of the recommendation and what could change it. Team expansion requires further product development. Template branding and section structure retained.');
await (await PresentationFile.exportPptx(p)).save(T+'/candidate.pptx');
console.log('Draft exported');
