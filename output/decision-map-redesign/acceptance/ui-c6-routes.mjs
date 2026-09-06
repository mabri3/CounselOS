import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '/Users/bharris/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const dir=new URL('.',import.meta.url).pathname;
const e=JSON.parse(fs.readFileSync(dir+'environment.json','utf8'));
const map=await (await fetch(`http://localhost:${e.backend_port}/api/matters/${e.matter_id}/workspace/decision-map`)).json();
const a=map.issue_analyses['ISS-PILOT'].analysis;
const optionIDs=new Set(a.options.map(o=>'option:'+o.option_id));
const edges=map.edges.filter(x=>x.relationship==='if'&&optionIDs.has(x.to_node_id)&&x.from_node_id.startsWith('condition:'));
assert.ok(edges.some(x=>x.state==='active'));
assert.ok(edges.some(x=>x.state==='inactive'));
for(const edge of edges){
 const option=a.options.find(o=>'option:'+o.option_id===edge.to_node_id);
 const requirements=option.requirements.map(r=>({required:r.state,actual:a.conditions.find(c=>c.condition_id===r.condition_id)?.assessment}));
 if(edge.state==='active')assert.ok(option.combination==='any'?requirements.some(r=>r.required===r.actual):requirements.every(r=>r.required===r.actual));
}
const b=await chromium.launch({headless:true});const p=await b.newPage({viewport:{width:1280,height:900}});const errors=[];p.on('pageerror',x=>errors.push(x.message));
try{
 await p.goto(`http://localhost:${e.frontend_port}/matters/${e.matter_id}/decision-map?issue=ISS-PILOT`,{waitUntil:'networkidle'});
 await p.locator(`[data-map-node-id="${edges.find(x=>x.state==='inactive').to_node_id}"]`).click();
 assert.ok(await p.locator('svg path[marker-end="url(#decision-path-inactive-arrow)"]').count());
 assert.ok((await p.locator('main').innerText()).includes('Inactive'));
 const boxes=await p.locator('section[aria-label="Focused decision paths"] svg rect').evaluateAll(nodes=>nodes.map(n=>({x:Number(n.getAttribute('x')),y:Number(n.getAttribute('y')),w:Number(n.getAttribute('width')),h:Number(n.getAttribute('height'))})));
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];assert.ok(!(a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h),'Connector labels overlap');}
 await p.screenshot({path:dir+'map-c6-routes-1280.png'});
 assert.deepEqual(errors,[]);
 fs.writeFileSync(dir+'ui-c6-routes.json',JSON.stringify({checks:['Determinate conditions activate only satisfied option requirements','Inactive connector remains visible with plain state text','Inactive option remains previewable','All visible connector label boxes are disjoint'],edges,errors},null,2));
}finally{await b.close();}
