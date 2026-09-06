import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '/Users/bharris/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const dir=new URL('.',import.meta.url).pathname,E=JSON.parse(fs.readFileSync(dir+'environment.json','utf8'));
const api=`http://localhost:${E.backend_port}`,url=`http://localhost:${E.frontend_port}`,mid=E.matter_id;
async function get(path){const r=await fetch(api+'/api'+path);assert.ok(r.ok,await r.text?.bind(null)&&`${path} ${r.status}`);return r.json();}
const log={checks:[],errors:[]};
const form=new FormData();form.append('file',new Blob(['# Fictional supplier contract\n\n## Section 4\n\nScreening must finish before release. A manual pilot can include ten test accounts.\n']),'pilot-contract.txt');
const uploaded=await (await fetch(api+`/api/matters/${mid}/upload`,{method:'POST',body:form})).json();fs.writeFileSync(dir+'ui-upload.json',JSON.stringify(uploaded,null,2));
const initial=await get(`/matters/${mid}/workspace/decision-map`);const source=uploaded.source_id;
const a=structuredClone(initial.issue_analyses['ISS-TIMING'].analysis);a.issue_id='ISS-PILOT';a.display_title='A limited screening pilot';a.explanation='The pilot keeps screening before release and limits the first launch to ten test accounts.';a.business_effect='The team can learn from a small pilot while it checks the wider release process.';
a.tests[0].claim_ids=['CLM-PILOT'];a.options.forEach(o=>o.claim_ids=['CLM-PILOT']);
const reply='The pilot keeps screening before release. [claim:CLM-PILOT]\n\n```claim-support\n'+JSON.stringify({claims:[{claim_id:'CLM-PILOT',text:'The pilot keeps screening before release.',source_ids:[source]}]})+'\n```\n\n```decision-paths\n'+JSON.stringify({issue_analysis:a})+'\n```';
const pr=await fetch(api+'/__test/provider',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({reply})});assert.equal(pr.status,200,await pr.text());
const b=await chromium.launch({headless:true});const p=await b.newPage({viewport:{width:1280,height:900}});p.on('pageerror',e=>log.errors.push(e.message));const writes=[];p.on('request',r=>{if(r.method()==='POST')writes.push(r.url())});
try{
 await p.goto(`${url}/matters/${mid}/decision-map?issue=ISS-PILOT`,{waitUntil:'domcontentloaded'});await p.getByRole('region',{name:'Decision map',exact:true}).waitFor();assert.equal(writes.filter(x=>/actions|chat\/runs/.test(x)).length,0);log.checks.push('No model on page load');
 const before=await get('/decisions');if(await p.getByRole('button',{name:'Analyze paths',exact:true}).count()){await p.getByRole('button',{name:'Analyze paths',exact:true}).click();await p.getByText('Analysis finished.',{exact:false}).waitFor({timeout:60000});}
 const map=await get(`/matters/${mid}/workspace/decision-map`);const saved=map.issue_analyses['ISS-PILOT'];assert.equal(saved.state,'saved',JSON.stringify(saved));assert.equal(saved.analysis.options.length,3);log.checks.push('UI inquiry publishes real analysis, three options and Unknown');fs.writeFileSync(dir+'ui-published-map.json',JSON.stringify(map,null,2));
 const option=map.nodes.find(n=>n.record_type==='option'&&n.analysis_id===saved.analysis.analysis_id);
 const beforeIds=await p.locator('[data-map-node-id]').evaluateAll(nodes=>nodes.map(n=>n.dataset.mapNodeId).sort());await p.locator(`[data-map-node-id="${option.node_id}"]`).click();assert.deepEqual(await p.locator('[data-map-node-id]').evaluateAll(nodes=>nodes.map(n=>n.dataset.mapNodeId).sort()),beforeIds);assert.equal((await get('/decisions')).decisions.length,before.decisions.length);log.checks.push('Preview retains issue and siblings; no decision write');
 await p.getByRole('button',{name:'Record this path',exact:true}).click();await p.getByRole('button',{name:'Cancel',exact:true}).click();assert.equal((await get('/decisions')).decisions.length,before.decisions.length);log.checks.push('Cancel has no decision write');
 await p.getByRole('button',{name:'Record this path',exact:true}).click();await p.getByLabel('Decision', {exact:true}).fill('Run a ten-account pilot after manual screening.');await p.getByLabel('Rationale',{exact:true}).fill('Keep screening first while the team checks release timing.');
 fs.writeFileSync(dir+'ui-form-text.txt',await p.locator('.modal').innerText());
 await p.getByRole('button',{name:'Record durable decision',exact:true}).click();await p.getByText('Decision recorded.',{exact:false}).waitFor();
 const decisions=(await get('/decisions')).decisions;const d=decisions.find(x=>x.map_basis?.analysis_id===saved.analysis.analysis_id);assert.ok(d);assert.equal(d.map_basis.selected_option_revision,option.data.option_revision);assert.equal(d.chosen_path,'Run a ten-account pilot after manual screening.');log.checks.push('Explicit save records edited wording and exact canonical basis');fs.writeFileSync(dir+'ui-recorded-decision.json',JSON.stringify(d,null,2));await p.getByRole('button',{name:'Close',exact:true}).click();
 await p.screenshot({path:dir+'ui-path-preview-1280.png'});
}catch(e){log.failure=String(e);await p.screenshot({path:dir+'ui-path-failure.png'});throw e;}finally{fs.writeFileSync(dir+'ui-paths.json',JSON.stringify(log,null,2));await b.close();}
console.log(JSON.stringify(log));
