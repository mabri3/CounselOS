// Themis.ai — Companion Thesis investor deck
// Builds one .dc.html artboard per slide (1280x720 = 16:9 at 96px/in),
// plus canvas.json and a local preview harness for measurement.
import { writeFileSync, readFileSync } from 'node:fs';

const SANS = "'IBM Plex Sans','Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'IBM Plex Mono',ui-monospace,Menlo,monospace";
const SERIF = "'Source Serif 4',Charter,'Iowan Old Style',Georgia,serif";

const FONTLINK = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&amp;family=IBM+Plex+Sans:wght@400;500;600&amp;family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&amp;display=swap">';

const CSS = `

  .slide{
    --paper:#FBF6EA; --ink:#15211F; --body:#35423F; --src:#55605D; --src-b:#22302D;
    --muted:#8B948F; --rule:#DFD6C4; --border:#C9C0AD; --shadow-1:#E7DECC; --ridge:#C4BCA9;
    --ground:#06322F; --on-ground:#F9F3E5; --on-ground-1:#FBF6EA; --on-ground-2:#DCE7DF; --on-ground-3:#C2D3CB;
    --ground-rule:#1C4C48; --accent:#DE3D22; --accent-hover:#B22F19; --accent-dk:#F6B650;
    --marker:#D9930C; --fur:#948F84; --fur-dk:#6E9089; --page-bg:#E8E1D2;
    --beam-1:#FFE0A0; --beam-2:#F7C463; --beam-3:#E0A020; --vig:#02201E;
  }
  .slide.pal-cobalt{
    --paper:#F7F4EC; --ink:#101326; --body:#2F3348; --src:#4E5266; --src-b:#1D2135;
    --muted:#8A8D9C; --rule:#DCD8CC; --border:#C6C2B6; --shadow-1:#E4E0D4; --ridge:#C0BCB0;
    --ground:#1A2FA6; --on-ground:#F7F4EC; --on-ground-1:#FFFFFF; --on-ground-2:#D6DCFA; --on-ground-3:#BFC8F2;
    --ground-rule:#3B4DC0; --accent:#FF5A3C; --accent-hover:#D8422A; --accent-dk:#FFC53D;
    --marker:#FF5A3C; --fur:#8D8F9B; --fur-dk:#8894DC; --page-bg:#E6E2D6;
    --beam-1:#FFE49B; --beam-2:#FFC53D; --beam-3:#FF8A3C; --vig:#0B1560;
  }
  .slide.pal-oxblood{
    --paper:#F6F1E8; --ink:#1A1310; --body:#3E332E; --src:#5F5249; --src-b:#2B221D;
    --muted:#8A7B70; --rule:#E2D9C9; --border:#CFC3B0; --shadow-1:#EAE0CE; --ridge:#C9BCA6;
    --ground:#1A1310; --on-ground:#F3EADC; --on-ground-1:#F6EEE0; --on-ground-2:#DFD2BE; --on-ground-3:#CFC0AE;
    --ground-rule:#3A2E27; --accent:#C24A38; --accent-hover:#A33324; --accent-dk:#E2A544;
    --marker:#B0851F; --fur:#9C8E80; --fur-dk:#7A6A56; --page-bg:#ECE5D8;
    --beam-1:#FFD48A; --beam-2:#F0BE63; --beam-3:#D99A3C; --vig:#080604;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;background:#E8E1D2}
  a{color:var(--accent);text-decoration:none}
  a:hover{color:var(--accent-hover)}
  .slide{position:relative;width:1280px;height:720px;overflow:hidden;background:var(--paper);color:var(--ink);
    font-family:${SERIF};font-size:21.33px;line-height:1.44;-webkit-font-smoothing:antialiased;font-kerning:normal}
  .slide.night{background:var(--ground);color:var(--on-ground)}
  .art{position:absolute;top:0;left:0;width:1280px;height:720px;pointer-events:none}
  .pad{position:absolute;top:40px;left:46px;width:1188px;height:638px;display:flex;flex-direction:column}
  .fur{position:absolute;left:46px;right:46px;bottom:8px;display:flex;justify-content:space-between;align-items:baseline;
    font-family:${MONO};font-size:11.5px;font-weight:500;letter-spacing:.17em;text-transform:uppercase;color:var(--fur)}
  .night .fur{color:var(--fur-dk)}
  h1,h2,h3,p{margin:0;font-weight:400}
  .h0{font-size:68px;line-height:1.06;font-weight:600;letter-spacing:-.021em;text-wrap:pretty}
  .h1{font-size:47px;line-height:1.08;font-weight:600;letter-spacing:-.014em;text-wrap:pretty}
  .lede{font-size:28px;line-height:1.32;color:var(--body);text-wrap:pretty}
  .p{font-size:21.33px;line-height:1.37;color:var(--body);text-wrap:pretty}
  .p+.p{margin-top:10px}
  .callout{font-size:32px;line-height:1.19;font-weight:600;letter-spacing:-.022em;color:var(--ink);text-wrap:pretty}
  .big{font-size:44px;line-height:1.08;font-weight:600;letter-spacing:-.018em;text-wrap:pretty}
  .night .lede,.ink .lede{color:var(--on-ground-2)}
  .night .p,.ink .p{color:var(--on-ground-3)}
  .night .callout,.ink .callout,.night .big,.ink .big{color:var(--on-ground-1)}
  .kick{font-family:${SANS};font-size:13.5px;font-weight:600;letter-spacing:.155em;text-transform:uppercase;color:var(--accent);line-height:1.2}
  .night .kick,.ink .kick{color:var(--accent-dk)}
  .src{font-family:${SANS};font-size:21.33px;line-height:1.29;color:var(--src);font-weight:400;text-wrap:pretty}
  .src b{font-weight:600;color:var(--src-b)}
  .lead{font-weight:600;color:var(--ink)}
  .night .lead,.ink .lead{color:var(--on-ground-1)}
  .rule{height:1px;background:var(--rule);flex:none}
  .night .rule,.ink .rule{background:var(--ground-rule)}
  .rule-ink{height:2px;background:var(--ink);flex:none}
  .cols{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 30px}
  .cols2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 40px}
  .vr{border-left:1px solid var(--rule);padding-left:29px}
  .night .vr,.ink .vr{border-left-color:var(--ground-rule)}
  .list{display:flex;flex-direction:column;gap:11px}
  .li{display:grid;grid-template-columns:7px minmax(0,1fr);gap:0 15px;align-items:start}
  .dot{width:7px;height:7px;background:var(--marker);margin-top:13px}
  .nli{display:grid;grid-template-columns:auto minmax(0,1fr);gap:0 14px;align-items:start}
  .num{font-family:${MONO};font-size:12.5px;font-weight:500;letter-spacing:.08em;color:var(--accent);margin-top:9px}
  .ink{background:var(--ink);color:var(--on-ground)}
  .ochre-rule{border-left:3px solid var(--accent);padding-left:26px}
  .stack{display:flex;flex-direction:column}
  .grow{flex:1 1 auto;min-height:0}
  .slide.wide .pad{top:30px;left:34px;width:1212px;height:662px}
  .slide.wide .fur{left:34px;right:34px;bottom:8px}
  .tight .p{line-height:1.31}
  .tight .src{line-height:1.24}
  .tight .p+.p{margin-top:9px}
  .flow{column-gap:40px;column-rule:1px solid var(--rule);column-fill:balance}
  .flow>div{break-inside:avoid}
  .flow>p{orphans:2;widows:2}
  .flow>*+*{margin-top:6px}
  .flow .kick{margin-bottom:5px}
  .xtight .p{line-height:1.26}
  .xtight .src{line-height:1.22}
  .xtight .p+.p{margin-top:8px}
  .slide.xwide .pad{top:22px;left:30px;width:1220px;height:676px}
  .slide.xwide .fur{left:30px;right:30px;bottom:4px}
`;

/* ---------- terrain / beam artwork ---------- */
function rng(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
function ridge(seed,y,amp,x0,x1,step){
  const r=rng(seed),pts=[];
  for(let x=x0;x<=x1+step;x+=step) pts.push([x,y+(r()-0.5)*2*amp]);
  const f=n=>n.toFixed(1);
  let d=`M ${f(pts[0][0])} ${f(pts[0][1])}`;
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||pts[i+1];
    const c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6];
    const c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6];
    d+=` C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}
function terrainLines(){
  const out=[];let y=436,gap=19,amp=7;
  for(let i=0;i<20;i++){
    out.push(ridge(9001+i*13,y,amp,-80,1400,86+i*8));
    y+=gap;gap*=1.085;amp*=1.10;
    if(y>790)break;
  }
  return out;
}
function coverArt(){
  const paths=terrainLines();
  const set=(o,w)=>paths.map(d=>`<path d="${d}" fill="none" stroke="var(--on-ground)" stroke-opacity="${o}" stroke-width="${w}"/>`).join('');
  const cone='150,806 1340,268 1340,690 150,830';
  return `<svg class="art" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="coneg" x1=".06" y1="1" x2="1" y2=".2">
      <stop offset="0" stop-color="#fff" stop-opacity=".98"/>
      <stop offset=".30" stop-color="#fff" stop-opacity=".72"/>
      <stop offset=".62" stop-color="#fff" stop-opacity=".30"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="conec" x1=".06" y1="1" x2="1" y2=".2">
      <stop offset="0" stop-color="var(--beam-1,#FFD48A)" stop-opacity=".40"/>
      <stop offset=".34" stop-color="var(--beam-2,#F0BE63)" stop-opacity=".21"/>
      <stop offset=".78" stop-color="var(--beam-3,#D99A3C)" stop-opacity=".02"/>
      <stop offset="1" stop-color="var(--beam-3,#D99A3C)" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spill" cx=".13" cy="1" r=".52">
      <stop offset="0" stop-color="var(--beam-1,#FFD48A)" stop-opacity=".30"/>
      <stop offset="1" stop-color="var(--beam-1,#FFD48A)" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="scrimL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="var(--ground)" stop-opacity=".92"/><stop offset=".26" stop-color="var(--ground)" stop-opacity=".64"/><stop offset=".58" stop-color="var(--ground)" stop-opacity="0"/></linearGradient>
    <linearGradient id="scrimB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--ground)" stop-opacity="0"/><stop offset="1" stop-color="var(--ground)" stop-opacity=".62"/></linearGradient>
    <radialGradient id="vig" cx=".34" cy=".92" r=".98"><stop offset=".44" stop-color="var(--ground)" stop-opacity="0"/><stop offset="1" stop-color="var(--vig,#080604)" stop-opacity=".8"/></radialGradient>
    <mask id="beam" maskUnits="userSpaceOnUse" x="0" y="0" width="1280" height="720">
      <rect width="1280" height="720" fill="#000"/>
      <polygon points="${cone}" fill="url(#coneg)"/>
    </mask>
  </defs>
  <rect width="1280" height="720" fill="url(#spill)"/>
  <polygon points="${cone}" fill="url(#conec)"/>
  <g>${set('.07','1')}</g>
  <g mask="url(#beam)">${set('.8','1')}</g>
  <rect width="1280" height="720" fill="url(#scrimL)"/>
  <rect x="0" y="430" width="1280" height="290" fill="url(#scrimB)"/>
  <rect width="1280" height="720" fill="url(#vig)"/>
</svg>`;
}
function washArt(cx,cy,rx,ry,op){
  return `<svg class="art" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="w${cx}"><stop offset="0" stop-color="var(--marker)" stop-opacity="${op}"/><stop offset=".55" stop-color="var(--marker)" stop-opacity="${(op*0.32).toFixed(3)}"/><stop offset="1" stop-color="var(--beam-2,#F0BE63)" stop-opacity="0"/></radialGradient></defs>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#w${cx})"/></svg>`;
}
function marginTerrain(){
  const out=[];let y=470,gap=13,amp=8;
  for(let i=0;i<14;i++){out.push(ridge(4400+i*17,y,amp,760,1360,86+i*5));y+=gap;gap*=1.07;amp*=1.08;if(y>740)break;}
  return `<svg class="art" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>
  <mask id="fm"><rect x="700" y="380" width="580" height="340" fill="url(#fade)"/></mask></defs>
  <g mask="url(#fm)">${out.map(d=>`<path d="${d}" fill="none" stroke="var(--ink)" stroke-opacity=".13" stroke-width="1"/>`).join('')}</g></svg>`;
}

/* ---------- page shell ---------- */
const page = ({night=false,art='',inner,num='',fur=true,wide=false,tight=false,xwide=false,xtight=false,cover=false}) => `<div class="slide${night?' night':''}${cover?' cover':''}${wide?' wide':''}${xwide?' xwide':''}${tight?' tight':''}${xtight?' xtight':''}">
${art}
<div class="pad">
${inner}
</div>${fur?`
<div class="fur"><span>Themis.ai</span><span>${num}</span></div>`:''}
</div>`;

const SP = h => `<div style="height:${h}px;flex:none"></div>`;
const RULE = '<div class="rule"></div>';

/* ============================ SLIDE 1 ============================ */
const s1 = page({night:true,cover:true,art:coverArt(),fur:false,inner:`
<div style="background:var(--paper);padding:16px 22px;display:inline-block;align-self:flex-start;flex:none"><img src="logo.png" alt="Themis.ai" style="width:214px;height:auto;display:block"></div>
${SP(54)}
<h1 class="h0" style="max-width:880px;flex:none">The lawyer makes the call.<br>Themis makes sure they do not face it alone.</h1>
${SP(24)}
<div class="lede" style="max-width:1000px;flex:none;color:#EADEC4">Themis is a companion to legal judgment&#8212;a flashlight in the dark.</div>
<div class="grow"></div>
<div style="display:grid;grid-template-columns:620px minmax(0,1fr);gap:0 72px;align-items:start;flex:none">
  <p class="p">Legal judgment is rarely a search for one obvious answer. The lawyer must understand an uncertain legal space, see what could change the analysis, and make a decision the business can act on. Themis helps illuminate that space while leaving the judgment with the lawyer.</p>
  <div class="ochre-rule"><div class="callout">Themis supports the person responsible for the answer. It does not replace their judgment.</div></div>
</div>`});

/* ============================ SLIDE 2 ============================ */
const s2 = page({num:'02',art:washArt(140,700,620,380,0.10),inner:`
<h1 class="h1" style="max-width:1080px;flex:none">The lawyer must make the call before the whole terrain is visible.</h1>
${SP(18)}${RULE}${SP(20)}
<div style="display:grid;grid-template-columns:600px minmax(0,1fr);gap:0 56px;align-items:start;flex:none">
  <div>
    <p class="p">For the lawyer, the question is not simply:</p>
    ${SP(10)}
    <div class="lede" style="color:var(--muted)">What is the answer?</div>
    ${SP(12)}
    <p class="p">It is:</p>
    ${SP(14)}
    <div class="big ochre-rule">What am I missing that could change my answer?</div>
  </div>
  <div class="vr">
    <p class="p">The business wants an answer. The facts are incomplete. The law leaves room for judgment. The lawyer must choose a path without knowing whether an unseen fact, issue, or consequence could change it.</p>
    ${SP(16)}
    <p class="p">The emotional burden is not simple darkness or a lack of information. It is the responsibility of making a consequential decision while knowing that something important may remain outside the beam.</p>
  </div>
</div>
<div class="grow"></div>
<div style="display:grid;grid-template-columns:600px minmax(0,1fr);gap:0 56px;align-items:start;flex:none">
  <p class="p">Faster research and drafting can reduce effort. They do not remove the lawyer's responsibility for deciding whether the analysis is complete enough to act. That is the burden Themis is designed to support.</p>
  <div class="vr"><p class="src"><b>Research signal:</b> In four discovery interviews, in-house lawyers described feeling &#8220;on an island,&#8221; wanting another lawyer nearby, seeking a gut check, and wanting help finding blind spots. These are themes from auto-generated interview notes, not verified quotations.</p></div>
</div>`});

/* ============================ SLIDE 3 ============================ */
const s3 = page({num:'03',art:marginTerrain(),inner:`
<h1 class="h1" style="max-width:1100px;flex:none">Themis makes uncertainty visible enough for the lawyer to exercise judgment.</h1>
${SP(10)}${RULE}${SP(14)}
<div class="cols" style="flex:none">
  <div>
    <p class="p">Themis is the flashlight in the darkness of uncertainty. It illuminates the legal terrain&#8212;the law, facts, assumptions, and unknowns&#8212;so the lawyer can chart their own path forward.</p>
    <p class="p">Themis helps lawyers see the question clearly, test their thinking, and move forward with confidence.</p>
  </div>
  <div class="vr">
    <p class="p" style="margin-bottom:14px">It helps the lawyer:</p>
    <div class="list">
      <div class="li"><div class="dot"></div><p class="p">dissect the question to reveal what is known, assumed, and still unknown;</p></div>
      <div class="li"><div class="dot"></div><p class="p">illuminate the issues, facts, laws, assumptions, and unknowns that shape the decision;</p></div>
      <div class="li"><div class="dot"></div><p class="p">test the path they are taking;</p></div>
      <div class="li"><div class="dot"></div><p class="p">uncover blind spots that could change the answer; and</p></div>
      <div class="li"><div class="dot"></div><p class="p">preserve the context and reasoning that support the final call.</p></div>
    </div>
  </div>
  <div class="vr">
    <div class="kick" style="margin-bottom:10px">What &#8220;confidence&#8221; means</div>
    <p class="p">Confidence is not certainty. It comes from seeing the terrain more clearly: the questions, risks, assumptions, sources, alternatives, and remaining unknowns. The lawyer can then explain why they chose the path they did.</p>
    ${SP(16)}
    <p class="p">The product's job is not to perform legal authority. It is to improve the conditions under which the lawyer exercises it.</p>
  </div>
</div>
<div class="grow"></div>
<div class="ochre-rule" style="flex:none"><div class="callout">The answer remains the lawyer's. Themis strengthens the path to it.</div></div>`});

/* ============================ SLIDE 4 ============================ */
const voice = (q,a)=>`<p class="p"><span class="lead">${q}</span> ${a}</p>`;
const VOICES=[
 ['&#8220;I need someone to think with.&#8221;','A second legal perspective helps the lawyer work through ambiguity instead of facing a blank page or a finished answer.'],
 ['&#8220;I need to know what I may have missed.&#8221;','The lawyer wants thoughtful challenge: another issue, another fact, another interpretation, or another consequence that could change the path.'],
 ['&#8220;I need support that respects my judgment.&#8221;','The system can inform, question, and test. The lawyer must remain the author of the decision.'],
 ['&#8220;I need my reasoning tested before I rely on it.&#8221;',"Confidence becomes fragile when material counterexamples, conflicting facts, or overlooked problems remain outside the lawyer's view. Themis should surface them before the decision is made."]
];
const s4 = page({num:'04',wide:true,tight:true,inner:`
<h1 class="h1" style="max-width:1150px;flex:none">Lawyers are not only asking for faster work. They want a second perspective as they work through the decision.</h1>
${SP(12)}${RULE}${SP(14)}
<p class="p" style="flex:none;max-width:1170px">Across four interviews with in-house lawyers and 203 de-duplicated Reddit discussions about legal AI, the requested tasks and features varied. The recurring need was more consistent: a capable second perspective that helps the lawyer examine the question, test their reasoning, and decide with confidence.</p>
${SP(20)}
<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 46px;flex:none">
  ${VOICES.map((v,i)=>`<div${i%2?' class="vr"':''}>${voice(v[0],v[1])}</div>`).join('')}
</div>
<div class="grow"></div>
${RULE}${SP(12)}
<div style="display:grid;grid-template-columns:400px minmax(0,1fr);gap:0 44px;align-items:start;flex:none">
  <p class="p">The adoption opportunity may not be another feature bundle. It may be a product relationship in which the lawyer receives useful challenge without giving up control.</p>
  <p class="src"><b>Source:</b> Themis analysis of 203 de-duplicated Reddit discussions about legal AI and four discovery interviews with in-house lawyers, August 2026. The statements above synthesize recurring themes; they are not direct quotations. Interview quotations should not appear externally without approval and verification against the recordings.</p>
</div>`});

/* ============================ SLIDE 5 ============================ */
const s5 = page({num:'05',wide:true,inner:`
<h1 class="h1" style="max-width:1150px;flex:none">Most legal AI competes to produce the work. The harder problem is helping the lawyer own the judgment.</h1>
${SP(14)}${RULE}${SP(18)}
<div style="display:grid;grid-template-columns:390px minmax(0,1fr) 330px;gap:0 34px;flex:none">
  <div>
    <p class="p">The market is improving quickly at search, summarization, drafting, and task automation. Those capabilities are useful, but they do not resolve the lawyer's deeper burden.</p>
    ${SP(16)}
    <p class="p" style="margin-bottom:12px">A generated answer can still leave the lawyer asking:</p>
    <div class="list">
      <div class="li"><div class="dot"></div><p class="p">What assumptions did it make?</p></div>
      <div class="li"><div class="dot"></div><p class="p">What did it fail to consider?</p></div>
      <div class="li"><div class="dot"></div><p class="p">How does this fit the facts and history of this matter?</p></div>
      <div class="li"><div class="dot"></div><p class="p">Can I explain and defend this decision later?</p></div>
    </div>
  </div>
  <div class="vr">
    <p class="p">Many products ask the lawyer to evaluate and trust an output. Themis is designed to drive the process that helps the lawyer examine the question, test their reasoning, and gain confidence in their decision.</p>
    ${SP(20)}
    <div class="kick" style="margin-bottom:10px">Investor implication</div>
    <p class="p">The distinction is not &#8220;better intelligence.&#8221; It is a different role in the lawyer's work. A product that only produces an output competes on capability. A product that helps the lawyer reach and preserve a defensible judgment can compete on trust, context, and repeated use.</p>
  </div>
  <div class="ink" style="padding:26px 26px 28px">
    <p class="p"><span class="lead">Themis thesis:</span> This market gap is our interpretation of the interview and research corpus. It is not yet proof that buyers will select or retain Themis for this reason.</p>
  </div>
</div>
<div class="grow"></div>
${RULE}${SP(16)}
<p class="src" style="flex:none;max-width:1130px"><b>Source:</b> Themis analysis of 203 de-duplicated Reddit discussions about legal AI, combined with four in-house counsel discovery interviews. See appendix for source files and limits.</p>`});

/* ============================ SLIDE 6 ============================ */
const STEPS=[
 ['Enter uncertain terrain','A request comes in with incomplete facts, hidden assumptions, and pressure to respond.'],
 ['Illuminate what is known','Themis organizes the matter so the lawyer can see the legal space, the business context, and what is at stake.'],
 ['Reveal forks and hazards','It surfaces questions, competing interpretations, missing facts, and consequences that could change the path.'],
 ['Show the edge of the beam','It distinguishes what is known, assumed, supported, unresolved, or uncertain. It does not pretend that the entire terrain is visible.'],
 ['Leave the route to the lawyer','It helps the lawyer test and form a recommendation while keeping the final judgment with the lawyer.'],
 ['Remember the route taken','It preserves the context, reasoning, sources, and recorded decision when the matter returns.']
];
function stepRidge(){
  const w=1212,h=32;
  const d=ridge(5150,h*0.62,6,0,w,173);
  const nodes=[];
  for(let i=0;i<6;i++){
    const x=(w/6)*i+(w/12);
    const y=h*0.62-i*5.2;
    nodes.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="var(--marker)"/>`);
  }
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:block;flex:none" xmlns="http://www.w3.org/2000/svg">
  <path d="${d}" fill="none" stroke="var(--ridge)" stroke-width="1" transform="translate(0,-14) rotate(-2.4 606 28)"/>
  ${nodes.join('')}</svg>`;
}
const s6 = page({num:'06',wide:true,tight:true,art:washArt(1160,120,560,340,0.09),inner:`
<h1 class="h1" style="max-width:1120px;flex:none">Themis illuminates the terrain and stays beside the lawyer through the climb.</h1>
${SP(8)}
<p class="p" style="flex:none;max-width:1170px">Themis treats legal work as a continuing matter, not a series of isolated prompts. It helps the lawyer move from an incomplete request to an organized view of the decision, while keeping uncertainty and ownership visible.</p>
${SP(10)}
${stepRidge()}
${SP(10)}
<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 34px;flex:none">
  ${STEPS.map((s,i)=>`<div class="nli"><div class="num">${String(i+1).padStart(2,'0')}</div><p class="p"><span class="lead">${s[0]}</span><br>${s[1]}</p></div>`).join('')}
</div>
<div class="grow"></div>
${RULE}${SP(10)}
<div class="callout" style="flex:none">Themis helps the lawyer see the climb. The lawyer still chooses the path and takes the final step.</div>
${SP(8)}
<p class="p" style="flex:none;max-width:1170px">The workflow matters because it gives the companion role a durable form. Themis does not disappear after producing an answer; it stays with the matter through questions, research, recommendations, decisions, and later review.</p>`});

/* ============================ SLIDE 7 ============================ */
const NOTES=[
 ['It listened.','The request, facts, and business context remain visible.'],
 ['It understood what is at stake.','The issues and implications are organized around the matter.'],
 ['It illuminates.','Questions, gaps, assumptions, and uncertainty stay in view.'],
 ['It supports the judgment.','Recommendations can develop without becoming recorded decisions.'],
 ['It remembers the path.','The sources, reasoning, open work, and decision persist over time.']
];
const IMGW=1220, IMGH=76;
const s7 = page({num:'07',xwide:true,xtight:true,inner:`
<h1 class="h1" style="max-width:1160px;flex:none">A matter is not a chat. It is a durable record of how the lawyer reached the call.</h1>
${SP(14)}
<div style="width:${IMGW}px;height:${IMGH}px;overflow:hidden;border:1px solid var(--border);background:#fffefb;box-shadow:0 1px 0 var(--shadow-1),0 18px 32px -26px rgba(20,16,13,.45);flex:none">
  <img src="matter.png" alt="The Themis.ai matter page" style="display:block;width:${IMGW}px;height:auto">
</div>
${SP(12)}${RULE}${SP(10)}
<div class="flow" style="column-count:3;flex:none;line-height:1.21">
  ${NOTES.map(n=>`<div class="li"><div class="dot"></div><p class="p"><span class="lead">${n[0]}</span> ${n[1]}</p></div>`).join('')}
  <p class="p">Legal work is not a sequence of isolated answers. It is a matter moving toward a legal and business objective.</p>
  <p class="p">Themis organizes the work around that objective. It synthesizes the request, facts, issues, sources, open questions, recommendations, and recorded decisions so the lawyer can understand the whole matter and move it toward a sound decision.</p>
  <p class="p">Persistent context lets Themis become more useful each time the matter returns. It also lets the lawyer see the basis for prior work instead of reconstructing the reasoning from chat history.</p>
  <p class="p">The current system uses Markdown as the durable source of truth and SQLite as a replaceable index. It keeps recommendations separate from explicitly recorded decisions and can work across multiple model providers.</p>
  <p class="src"><b>Source:</b> Current Themis product build and repository documentation, September 2026.</p>
</div>
<div class="grow"></div>
${SP(8)}
<div class="ochre-rule" style="flex:none"><div class="callout">The model can change. The matter remembers.</div></div>`});



/* ============================ SLIDE 8 ============================ */
const PAIRS=[
 ['Humble, not performative.','It shows uncertainty and does not pretend that ambiguity has disappeared.'],
 ['Curious, not merely declarative.','It asks the question that exposes the missing fact or untested assumption.'],
 ['Present, not intrusive.','It is available throughout the matter without taking control of the decision.'],
 ['Persistent, not forgetful.','It carries context forward so the lawyer does not have to reconstruct the matter each time.'],
 ["Supportive, not substitutive.","It strengthens the lawyer's judgment instead of presenting itself as the legal authority."],
 ["Faithful, not revisionist.","It records the lawyer's decision without silently turning a model recommendation into that decision."]
];
const s8 = page({num:'08',art:washArt(120,80,520,320,0.09),inner:`
<h1 class="h1" style="flex:none">Trust is earned by how the product behaves.</h1>
${SP(14)}${RULE}${SP(18)}
<p class="p" style="flex:none;max-width:900px">Themis should feel like a capable colleague whose conduct makes the lawyer stronger.</p>
${SP(26)}
<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px 34px;flex:none">
  ${PAIRS.map((p,i)=>`<div${i%3?' class="vr"':''}>
    <div style="font-size:23px;line-height:1.18;font-weight:600;color:#1A1310;margin-bottom:7px">${p[0]}</div>
    <p class="p">${p[1]}</p>
  </div>`).join('')}
</div>
<div class="grow"></div>
${RULE}${SP(18)}
<div style="display:grid;grid-template-columns:620px minmax(0,1fr);gap:0 50px;align-items:start;flex:none">
  <div class="callout">This is what it means for Themis not to be a soulless product: its values appear in repeated, observable behavior.</div>
  <div>
    <div class="kick" style="margin-bottom:9px">Investor implication</div>
    <p class="p">These behaviors turn the emotional promise into product requirements. If they remain consistent across models and matters, the ethos can become part of the user experience rather than branding placed on top of it.</p>
  </div>
</div>`});

/* ============================ SLIDE 9 ============================ */
const s9 = page({num:'09',xwide:true,xtight:true,inner:`
<h1 class="h1" style="max-width:1160px;flex:none">The durable position is inside the lawyer's process of reaching confidence.</h1>
${SP(8)}
<div class="ink" style="padding:12px 20px 14px;flex:none">
  <div class="callout">But this is the more important and defensible leap. Intelligence will become common. Workflows can be copied. A product that earns a place inside the lawyer&#8217;s process of reaching confidence in their decision can become much harder to replace.</div>
</div>
${SP(12)}
<div class="flow" style="column-count:4;column-gap:30px;flex:none">
  <p class="p">The market will make strong AI capabilities more available. The investor question is not only which product can generate the best answer today. It is which product can earn a lasting role in the professional process around that answer.</p>
  <div class="li"><div class="dot"></div><p class="p">Model quality will improve and useful workflow patterns will spread across products.</p></div>
  <div class="li"><div class="dot"></div><p class="p">Matter history can deepen Themis's role because the system retains how the lawyer and organization reached prior decisions.</p></div>
  <div class="li"><div class="dot"></div><p class="p">Repeated moments of useful challenge, honest uncertainty, and faithful memory can build trust that a feature checklist does not capture.</p></div>
  <div>
    <div class="kick">What the moat is not</div>
    <p class="p">It is not exclusive intelligence, a fixed workflow, or a claim that lawyers will hand judgment to software.</p>
  </div>
  <div>
    <div class="kick">What the moat could become</div>
    <p class="p">A trusted place beside the lawyer, reinforced by accumulated context, product behavior, and repeated proof that Themis illuminates what matters without taking the decision away.</p>
  </div>
  <div>
    <div class="kick">Investor implication</div>
    <p class="p">The emotional thesis is the proposed source of defensibility: a trusted role strengthened by matter history, repeated use, and behavior that respects the lawyer's responsibility.</p>
  </div>
  <p class="src"><b>Themis thesis:</b> This is the central strategic leap. It is plausible and supported by interview signals, but it is not yet proven by adoption or retention data.</p>
</div>`});

/* ============================ SLIDE 10 ============================ */
const SUPP=[
 'The burden of legal judgment often feels lonely, even for experienced lawyers.',
 'Lawyers value help finding blind spots more than another system that simply states an answer.',
 'Confidence grows when the lawyer can see the reasoning, assumptions, sources, and remaining uncertainty.',
 'Persistent matter context and reflective dialogue can turn usefulness into repeat use and trust.'
];
const WRONG=[
 'Users value output speed but do not value the process that supports judgment.',
 'Lawyers routinely skip the issue map, questions, uncertainty, and decision history.',
 'Users do not return to existing matters or value preserved context.',
 'Lawyers feel no more prepared to make or defend the call after using Themis&#8212;or find general-purpose AI &#8220;good enough.&#8221;'
];
const s10 = page({num:'10',xwide:true,tight:true,art:washArt(1180,660,600,360,0.10),inner:`
<h1 class="h1" style="max-width:1120px;flex:none">We are building on a human thesis, and we should test it directly.</h1>
${SP(10)}${RULE}${SP(10)}
<div class="ochre-rule" style="flex:none"><div class="big">Lawyers will form trust with software that helps them trust their own judgment.</div></div>
${SP(14)}
<div style="display:grid;grid-template-columns:minmax(0,1fr) 452px;gap:0 40px;align-items:start;flex:none">
  <div>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 30px">
      ${SUPP.map((s,i)=>`<div class="nli"><div class="num">${String(i+1).padStart(2,'0')}</div><p class="p">${s}</p></div>`).join('')}
    </div>
    ${SP(12)}${RULE}${SP(10)}
    <p class="p">The next stage is not to prove that Themis can generate legal work. It is to measure whether lawyers return to it for consequential matters, discover issues they would otherwise have missed, and feel more ready to make and defend the call.</p>
  </div>
  <div class="ink" style="padding:12px 16px 14px">
    <div class="kick" style="margin-bottom:10px">What would prove the thesis wrong</div>
    <div class="list" style="gap:7px">
      ${WRONG.map(s=>`<div class="li"><div class="dot"></div><p class="p">${s}</p></div>`).join('')}
    </div>
  </div>
</div>
<div class="grow"></div>
${RULE}${SP(6)}
<div class="callout" style="flex:none">Themis wins only if lawyers choose to keep it beside them when the judgment matters.</div>`});

/* ============================ APPENDIX ============================ */
const EV=[
 ['Product and architecture',['docs/PRD.md','docs/ARCHITECTURE.md','docs/IMPLEMENTATION_STATUS.md','current.md','Live application screenshots']],
 ['Market research',['output/research/raw/legal-ai-reddit-source-corpus.jsonl','Individual research files in output/research/raw/','output/research/themis-counselos-legal-ai-competitive-strategy.docx']],
 ['In-house counsel interviews',['output/research/raw/interviews/in-house-counsel/brian-jean-2026-08-17-notes-by-gemini.docx','output/research/raw/interviews/in-house-counsel/brian-ricky-2026-08-22-notes-by-gemini.docx','output/research/raw/interviews/in-house-counsel/chris-brian-2026-08-24-notes-by-gemini.docx','output/research/raw/interviews/in-house-counsel/vanessa-petty.docx']]
];
const sA = page({num:'Appendix',inner:`
<h1 class="h1" style="flex:none">Evidence map</h1>
${SP(16)}${RULE}${SP(28)}
<div class="cols" style="flex:none;gap:0 44px">
  ${EV.map((g,i)=>`<div${i?' class="vr"':''}>
    <div class="kick" style="margin-bottom:16px">${g[0]}</div>
    <div style="display:flex;flex-direction:column;gap:13px">
      ${g[1].map(f=>`<div style="font-family:${MONO};font-size:16.5px;line-height:1.45;color:#3E332E;word-break:break-word">${f}</div>`).join('')}
    </div>
  </div>`).join('')}
</div>
<div class="grow"></div>
<img src="logo.png" alt="Themis.ai" style="width:150px;height:auto;display:block;flex:none;opacity:.9">`});

/* ---------- write artboards ---------- */
const pal=(html,name)=>html.replace('class="slide','class="slide pal-'+name);
const DECK=[
 ['Main',s1],['Burden',s2],['Thesis',s3],['Voices',s4],['Incomplete',s5],
 ['Journey',s6],['Matter',s7],['Behaviors',s8],['Leap',s9],['Assumptions',s10],['Evidence',sA]
];
const ALTS=[
 ['CoverCobalt',pal(s1,'cobalt')],['PageCobalt',pal(s10,'cobalt')],
 ['CoverOxblood',pal(s1,'oxblood')],['PageOxblood',pal(s10,'oxblood')]
];
const SLIDES=[...DECK,...ALTS];
const dc = (body) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  ${FONTLINK}
  <style>${CSS}</style>
</helmet>
${body}
</x-dc>
</body>
</html>
`;
for(const [name,body] of SLIDES) writeFileSync(`${name}.dc.html`,dc(body));

/* ---------- canvas.json ---------- */
const COLS=3, W=1280, H=720, GX=120, GY=190;
const boards=[
 ...DECK.map(([name],i)=>({file:`${name}.dc.html`,x:(i%COLS)*(W+GX),y:Math.floor(i/COLS)*(H+GY),w:W,h:H,page:'page-1'})),
 ...ALTS.map(([name],i)=>({file:`${name}.dc.html`,x:(i%2)*(W+GX),y:Math.floor(i/2)*(H+GY),w:W,h:H,page:'page-2'}))
];
writeFileSync('canvas.json',JSON.stringify({
  artboards:boards,
  pages:[{id:'page-1',name:'Deck'},{id:'page-2',name:'Palette options'}],
  annotations:[
    {id:'palette-note',x:0,y:-96,w:1280,page:'page-2',text:'Two alternate colourways of the cover and slide 10. Page 1 (Deck) is currently set in Ember: petrol ground, vermilion accent, amber light. Say which you want and it swaps across all eleven slides.'}
  ],
  launch:{view:'canvas',page:'page-1'}
},null,2));

/* ---------- local preview harness (measurement only) ---------- */
const b64=(f,t)=>`data:image/${t};base64,`+readFileSync(f).toString('base64');
const inlineImgs=h=>h.replace(/src="logo\.png"/g,`src="${b64('/tmp/l.png','png')}"`).replace(/src="matter\.png"/g,`src="${b64('matter.png','png')}"`);
const preview=`<!doctype html><meta charset="utf-8"><title>preview</title>
${FONTLINK}
<style>${CSS} body{background:#ECE5D8;padding:30px;display:flex;flex-direction:column;gap:30px;align-items:flex-start}
.wrap{position:relative}.tag{position:absolute;left:-26px;top:0;font:600 13px/1 sans-serif;color:#888}</style>
${SLIDES.map(([name,body])=>`<div class="wrap" data-name="${name}"><div class="tag">${name}</div>${inlineImgs(body)}</div>`).join('\n')}
<script>
window.measure=function(){
  const out=[];
  document.querySelectorAll('.wrap').forEach(w=>{
    const s=w.querySelector('.slide'), pad=w.querySelector('.pad');
    const sb=s.getBoundingClientRect(); let worst=0, who='';
    pad.querySelectorAll('*').forEach(el=>{
      const r=el.getBoundingClientRect();
      const over=Math.round(r.bottom-(sb.bottom-30));
      if(over>worst){worst=over;who=(el.className||el.tagName)+'';}
      if(r.right-sb.right>2){worst=Math.max(worst,0);}
    });
    out.push({slide:w.dataset.name, padScroll:pad.scrollHeight-pad.clientHeight, overflowPx:worst, culprit:who.slice(0,40)});
  });
  return out;
};
</script>`;
writeFileSync('preview.html',preview);
console.log('wrote',SLIDES.length,'artboards + canvas.json + preview.html');
