import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { request, setContinuityTransport, currentContinuityStorageKey, continuityPersonHeaders, updateDocumentReview } from "../lib/api.ts";
import { readWorkspaceDraftingPreferences, writeWorkspaceDraftingPreferences, defaultWorkspaceDraftingPreferences } from "../lib/workspaceDrafting.ts";
import { recoverRetryCommand, retryDraftKey } from "../lib/teamPresentation.ts";

class Storage {
  values = new Map<string,string>();
  getItem(key:string) { return this.values.get(key) ?? null; }
  setItem(key:string,value:string) { this.values.set(key,value); }
  removeItem(key:string) { this.values.delete(key); }
}
const storage=new Storage();
Object.defineProperty(globalThis,"window",{value:{},configurable:true});
Object.defineProperty(globalThis,"localStorage",{value:storage,configurable:true});
setContinuityTransport("vault:A","alex",true);
const alexKey=currentContinuityStorageKey("MAT-1","panels")!;
const intent={request_id:"FRQ-1",text:"Exact reply\r\n  with spaces  "};
const first=recoverRetryCommand(undefined,intent,{expected_revision:"r1",text:intent.text},()=>"reply:1");
storage.setItem(alexKey,JSON.stringify({__request:"FRQ-1",__question:"Q-1",__scope:"WI-1",__panel:"facts",[retryDraftKey("fact-request","reply")]:first.serialized}));
writeWorkspaceDraftingPreferences(storage,"MAT-1",{...defaultWorkspaceDraftingPreferences(),view:"draft",instruction:"Alex's unsent instruction",activeArtifactPath:"draft/A.md"});
setContinuityTransport("vault:A","jordan",true);
assert.equal(storage.getItem(currentContinuityStorageKey("MAT-1","panels")!),null);
assert.equal(readWorkspaceDraftingPreferences(storage,"MAT-1").instruction,"");
assert.deepEqual(continuityPersonHeaders(),{"X-Themis-Person-Id":"jordan"});
setContinuityTransport("vault:B","alex",true);
assert.equal(storage.getItem(currentContinuityStorageKey("MAT-1","panels")!),null);
setContinuityTransport("vault:A","alex",true);
const recovered=JSON.parse(storage.getItem(alexKey)!);
const retried=recoverRetryCommand(recovered[retryDraftKey("fact-request","reply")],intent,{expected_revision:"r2",text:intent.text},()=>{throw new Error("Retry created a new key");});
assert.equal(retried.command.expected_revision,"r1");
assert.equal(recovered.__request,"FRQ-1");assert.equal(recovered.__scope,"WI-1");
assert.equal(readWorkspaceDraftingPreferences(storage,"MAT-1").instruction,"Alex's unsent instruction");
const calls:Array<{body:string;headers:Record<string,string>}>=[];
let fail=true;
globalThis.fetch=async (_input,init)=>{ calls.push({body:String(init?.body),headers:init?.headers as Record<string,string>}); if(fail){fail=false;throw new Error("Response lost");} return new Response(JSON.stringify({comments:[]}),{status:200,headers:{"Content-Type":"application/json"}}); };
await assert.rejects(()=>updateDocumentReview("draft/A.md",{action:"add_comment",body:"Alex's note"}));
setContinuityTransport("vault:A","jordan",true);
await updateDocumentReview("draft/A.md",{action:"add_comment",body:"Jordan's note"});
setContinuityTransport("vault:A","alex",true);
await updateDocumentReview("draft/A.md",{action:"add_comment",body:"Alex's note"});
assert.equal(calls[0].body,calls[2].body,"Lost response retry must retain its full command and key");
assert.equal(calls[0].headers["X-Themis-Person-Id"],"alex");
assert.equal(calls[1].headers["X-Themis-Person-Id"],"jordan");
assert.notEqual(JSON.parse(calls[0].body).source_action_key,JSON.parse(calls[1].body).source_action_key);
const workspace=readFileSync(new URL("../components/MatterWorkspace.tsx",import.meta.url),"utf8");
assert.match(workspace,/key=\{contextKey\}/,"Person changes must remount only the scoped view");
assert.match(workspace,/target.kind === "work_item"[\s\S]*?openDocument\(item.path\)/,"Required work opens its exact saved item");
assert.match(workspace,/selectedScopeId[\s\S]*?work_item_id=/,"Scope refresh must retain selected work item");
assert.match(workspace,/__continuity.retry.v1:run:/,"Augmented run commands retain exact conversation and target on remount");
assert.match(workspace,/onPrepareWording=/);assert.match(workspace,/onPrepareBrief=/);
const today=readFileSync(new URL("../app/page.tsx",import.meta.url),"utf8");
assert.match(today,/\/team\/orientations/);assert.match(today,/targetUrl\(target\)/);
console.log("Continuity integration checks passed: scoped views, exact retry commands, trusted transport, and concrete targets.");

// Execute the production parent retry callback with a failed saved run.
const ts=await import("typescript");
const { runInNewContext }=await import("node:vm");
const ast=ts.createSourceFile("MatterWorkspace.tsx",workspace,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let continuityRunSource="";
function findRun(node: import("typescript").Node) { if(ts.isFunctionDeclaration(node)&&node.name?.text==="continuityRun") continuityRunSource=node.getText(ast); ts.forEachChild(node,findRun); }
findRun(ast);assert.ok(continuityRunSource);
const callbackModule={exports:{} as {continuityRun:(path:string,command:unknown)=>Promise<unknown>}};
let retriedRun="";let dispatchedBody:any;
const callbackContext="vault-a:alex:MAT-1";
const frozenCommand={source_action_key:"failed:1",conversation_id:"CONV-original",scope:{work_item_id:"WI-original"}};
storage.setItem(callbackContext,JSON.stringify({"__continuity.retry.v1:run:failed:1":JSON.stringify({version:1,intent_signature:"/prepare-communication",command:frozenCommand})}));
runInNewContext(ts.transpileModule(`export ${continuityRunSource}`,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{
  exports:callbackModule.exports,localStorage:storage,contextKey:callbackContext,currentConversationId:"CONV-new",detail:{matter_id:"MAT-1"},actor:{person_id:"alex"},
  continuityCommand:async (_matter:string,_path:string,_method:string,body:any,actor:any)=>{dispatchedBody=body;assert.equal(actor.person_id,"alex");return {run_id:"RUN-original",state:"failed"};},
  retryChatRun:async (matter:string,run:string)=>{assert.equal(matter,"MAT-1");retriedRun=run;return {run_id:run,state:"completed"};},
  panelActive:{current:true},setExternalRun:()=>{},currentContinuityLoader:{current:async()=>{}},refreshWorkspace:async()=>{},setEditorRefresh:()=>{},
  persistPanelDrafts:(update:(current:Record<string,string>)=>Record<string,string>)=>storage.setItem(callbackContext,JSON.stringify(update(JSON.parse(storage.getItem(callbackContext)!)))),
  changePanelDraft:(key:string,value:string)=>{const values=JSON.parse(storage.getItem(callbackContext)!);values[key]=value;storage.setItem(callbackContext,JSON.stringify(values));},
});
await callbackModule.exports.continuityRun("/prepare-communication",{source_action_key:"failed:1",scope:{work_item_id:"WI-current"}});
assert.equal(retriedRun,"RUN-original");assert.deepEqual(JSON.parse(JSON.stringify(dispatchedBody)),frozenCommand);
assert.equal(JSON.parse(storage.getItem(callbackContext)!) ["__continuity.retry.v1:run:failed:1"],"");
console.log("The production continuity callback retries the existing failed run and retains its frozen target and conversation.");

// Inspect actual DocumentPanel -> DocumentReview props after loading comments.
const React=await import("react");
const documentSource=readFileSync(new URL("../components/DocumentPanel.tsx",import.meta.url),"utf8");
const documentAst=ts.createSourceFile("DocumentPanel.tsx",documentSource,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let reviewElement="";const actorDeclarations:string[]=[];
function findReview(node:import("typescript").Node) {
  if(ts.isJsxElement(node)&&node.openingElement.tagName.getText(documentAst)==="DocumentReview")reviewElement=node.getText(documentAst);
  if(ts.isVariableDeclaration(node)&&["editingAuthorId","editingAuthorName","lawyerAuthorId"].includes(node.name.getText(documentAst)))actorDeclarations.push(`const ${node.getText(documentAst)};`);
  ts.forEachChild(node,findReview);
}
findReview(documentAst);assert.ok(reviewElement);assert.equal(actorDeclarations.length,3);
const reviewModule={exports:{} as {render:()=>any}};
const loadedAuthors=[{author_id:"alex",name:"Alex Morgan",color:"purple"},{author_id:"author-themis",name:"Themis.ai",color:"purple"},{author_id:"author-imported-1",name:"Imported reviewer",color:"gray"}];
runInNewContext(ts.transpileModule(`${actorDeclarations.join("\n")} export const render = () => (${reviewElement});`,{fileName:"review.tsx",compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText,{
  exports:reviewModule.exports,React,DocumentReview:()=>null,humanActor:{person_id:"alex",display_name:"Alex Morgan"},activeReviewAuthor:"Alex Morgan",lawyerAuthor:"Alex Morgan",authorId:()=>"wrong-derived-id",
  review:{authors:loadedAuthors},document:{path:"draft/A.md",editable:true},canEdit:true,busy:false,reviewAction:()=>{},onReviewAuthorChange:()=>{},REVIEW_AUTHOR_PALETTE:["purple"],
});
const reviewProps=reviewModule.exports.render().props;
assert.equal(reviewProps.author.author_id,"alex");assert.equal(reviewProps.lawyerAuthorId,"alex");
assert.deepEqual(reviewProps.review.authors,loadedAuthors,"Generated and imported authors remain unchanged");
console.log("Loaded document review receives the stable human ID and preserves other saved authors.");

// Run the production completion callback while its original view is unmounted.
let prepareSource="";let persistSource="";
function findPreparation(node: import("typescript").Node) {
  if(ts.isFunctionDeclaration(node)&&node.name?.text==="prepareCommunication")prepareSource=node.getText(ast);
  if(ts.isFunctionDeclaration(node)&&node.name?.text==="persistPanelDrafts")persistSource=node.getText(ast);
  ts.forEachChild(node,findPreparation);
}
findPreparation(ast);assert.ok(prepareSource);assert.ok(persistSource);
for (const changed of [false,true]) {
  const originalKey="vault-a:alex:MAT-wording"; const otherKey="vault-a:jordan:MAT-wording";
  const envelopeKey="__continuity.retry.v1:fact-request:prepare-wording:Q-original";
  const originalDraft={__question:"Q-original",__request:"",[envelopeKey]:JSON.stringify({command:{source_action_key:"wording:1"}})};
  storage.setItem(originalKey,JSON.stringify(originalDraft));storage.setItem(otherKey,JSON.stringify({"request.wording":"Jordan's unsent wording"}));
  const otherBefore=storage.getItem(otherKey);
  let finish!: (result:unknown)=>void;let modelCalls=0;const events:string[]=[];
  const preparationModule={exports:{} as {prepareCommunication:(kind:string,command:unknown,id:string)=>Promise<unknown>}};
  runInNewContext(ts.transpileModule(`${persistSource}\nexport ${prepareSource}`,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{
    exports:preparationModule.exports,localStorage:storage,contextKey:originalKey,panelDrafts:originalDraft,panelActive:{current:false},
    detail:{matter_id:"MAT-wording"},workspace:{questions:[{question_id:"Q-original"}]},handoffScope:null,
    continuityRun:()=>{modelCalls++;return new Promise(resolve=>{finish=resolve;});},getChatRun:async()=>({response:{reply:"Please confirm the access restriction."}}),
    window:{dispatchEvent:(event:{detail:{contextKey:string}})=>events.push(event.detail.contextKey)},CustomEvent:class { detail:unknown;constructor(_type:string,options:{detail:unknown}){this.detail=options.detail;} },
  });
  const pending=preparationModule.exports.prepareCommunication("request",{source_action_key:"wording:1"},"Q-original");
  if(changed)storage.setItem(originalKey,JSON.stringify({...originalDraft,__question:"Q-new","request.wording":"Alex's later edit",[envelopeKey]:JSON.stringify({command:{source_action_key:"wording:2"}})}));
  finish({run_id:"RUN-wording",state:"completed"});await pending;
  const restored=JSON.parse(storage.getItem(originalKey)!);
  assert.equal(restored["request.wording"],changed ? "Alex's later edit" : "Please confirm the access restriction.");
  assert.match(restored["__communication.notice"],/ready/);
  assert.equal(JSON.parse(restored["__communication.result:wording:1"]).run_id,"RUN-wording");
  assert.equal(changed ? JSON.parse(restored[envelopeKey]).command.source_action_key : restored[envelopeKey],changed ? "wording:2" : "");
  assert.equal(storage.getItem(otherKey),otherBefore,"Completion must not touch another person's draft");
  assert.equal(modelCalls,1);assert.ok(events.every(key=>key===originalKey));
}
console.log("Completed wording survives person switches, signals the original view, and preserves newer drafts and commands.");

// A handoff deep link arrives before its packet list. Resolve its saved scope
// once, and keep a person's later choice through refresh and remount.
const handoffFunctions: string[] = [];
function findHandoffNavigation(node: import("typescript").Node) {
  if (ts.isFunctionDeclaration(node) && ["openContinuityTarget", "resolveHandoffTarget"].includes(node.name?.text || "")) handoffFunctions.push(node.getText(ast));
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "selectHandoffScope") handoffFunctions.push(`const ${node.getText(ast)};`);
  ts.forEachChild(node, findHandoffNavigation);
}
findHandoffNavigation(ast); assert.equal(handoffFunctions.length, 3);
function handoffNavigation(drafts: Record<string, string>) {
  const module = { exports: {} as { openContinuityTarget: (target: unknown, deepLink?: boolean) => void; resolveHandoffTarget: () => void; selectHandoffScope: (id: string) => void } };
  const scope = { exports: module.exports, panelDrafts: drafts, handoffs: [] as Array<{ handoff_id: string; scope: { work_item_id: string } }>, pendingHandoffTarget: { current: null as string | null },
    setHandoffScope: () => {}, changePanelDraft: (key: string, value: string) => { drafts[key] = value; }, setContinuityPanel: () => {}, setWorkspaceView: () => {},
  };
  runInNewContext(ts.transpileModule(`${handoffFunctions.join("\n")}\nexport {openContinuityTarget, resolveHandoffTarget, selectHandoffScope};`, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText, scope);
  return { callbacks: module.exports, scope };
}
const handoffTarget = { kind: "handoff", target_id: "HOF-selected" };
const jordanDraft: Record<string, string> = {};
const jordanNavigation = handoffNavigation(jordanDraft);
jordanNavigation.callbacks.openContinuityTarget(handoffTarget, true);
assert.equal(jordanDraft.__scope, undefined);
jordanNavigation.scope.handoffs.push({ handoff_id: "HOF-selected", scope: { work_item_id: "WI-exact" } });
jordanNavigation.callbacks.resolveHandoffTarget();
assert.equal(jordanDraft.__scope, "WI-exact");
jordanNavigation.callbacks.selectHandoffScope("WI-later");
jordanNavigation.callbacks.resolveHandoffTarget();
assert.equal(jordanDraft.__scope, "WI-later", "A data refresh must not restore the old target");
const remounted = handoffNavigation(jordanDraft);
remounted.scope.handoffs.push(...jordanNavigation.scope.handoffs);
remounted.callbacks.openContinuityTarget(handoffTarget, true);
assert.equal(jordanDraft.__scope, "WI-later", "The same URL must not override a later saved choice after remount");
remounted.callbacks.openContinuityTarget(handoffTarget);
assert.equal(jordanDraft.__scope, "WI-exact", "An explicit in-page target action still opens its exact scope");
const alexDraft: Record<string, string> = { __scope: "WI-alex" };
const alexNavigation = handoffNavigation(alexDraft);
alexNavigation.callbacks.openContinuityTarget(handoffTarget, true);
alexNavigation.callbacks.selectHandoffScope("WI-alex-new");
alexNavigation.scope.handoffs.push(...jordanNavigation.scope.handoffs);
alexNavigation.callbacks.resolveHandoffTarget();
assert.equal(alexDraft.__scope, "WI-alex-new", "A choice made while the packet loads must win");
assert.equal(jordanDraft.__scope, "WI-exact", "Another person's scope must stay unchanged");
console.log("Handoff deep links resolve the exact saved scope once and retain later person-scoped choices.");

// Ownership actions must refresh the canonical props used by the header and
// selected scope. Refresh failure must not erase the durable save receipt.
let saveSource = "";
function findSave(node: import("typescript").Node) {
  if (ts.isFunctionDeclaration(node) && node.name?.text === "continuitySave") saveSource = node.getText(ast);
  ts.forEachChild(node, findSave);
}
findSave(ast); assert.ok(saveSource);
for (const active of [true, false]) {
  const result = { receipt: { state: "applied" }, handoff: { handoff_id: "HOF-owner" } };
  const retainedDraft = { __scope: "WI-selected", "handoff.ask": "Keep this unsent ask" };
  const before = JSON.stringify(retainedDraft);
  let owner = "Alex"; let reloads = 0; let clearedScope = false; let notice = "";
  const pendingScopeRead = { current: 4 };
  const module = { exports: {} as { continuitySave: (path: string, command: unknown) => Promise<unknown> } };
  runInNewContext(ts.transpileModule(`export ${saveSource}`, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    exports: module.exports, detail: { matter_id: "MAT-owner" }, actor: { person_id: "casey" }, panelActive: { current: active }, scopeRead: pendingScopeRead,
    continuityCommand: async () => result,
    currentContinuityLoader: {current: async () => { throw new Error("Optional packet refresh unavailable"); }},
    refreshWorkspace: async () => ({}),
    onReload: async () => { reloads++; owner = "Casey"; },
    setHandoffScope: (value: unknown) => { assert.equal(value, null); clearedScope = true; },
    setWorkspaceNotice: (value: string) => { notice = value; },
  });
  assert.equal(await module.exports.continuitySave("/handoffs/HOF-owner/actions", { action: "accept" }), result);
  assert.equal(reloads, active ? 1 : 0);
  assert.equal(owner, active ? "Casey" : "Alex");
  assert.equal(clearedScope, active, "The old owner must not remain presented as the current scope owner");
  assert.equal(pendingScopeRead.current, active ? 5 : 4, "An older scope GET cannot publish the prior owner after the save");
  assert.equal(Boolean(notice), active);
  assert.equal(JSON.stringify(retainedDraft), before);
}
console.log("Handoff saves refresh canonical owner props and invalidate old scope without losing drafts or durable receipts.");

// A durable save can outlive its HTTP response. Timeout wording must not claim
// that the server is unreachable or that nothing was saved.
const previousTimer = globalThis.setTimeout;
const previousClearTimer = globalThis.clearTimeout;
const previousFetch = globalThis.fetch;
let expireRequest: (() => void) | undefined;
const timeoutBodies: string[] = [];
let timeoutSaved = false;
const timeoutCommand = JSON.stringify({ action: "return", source_action_key: "return:exact-frozen-key", expected_revision: "handoff-original" });
const timeoutDraftBefore = storage.getItem(alexKey);
try {
  globalThis.setTimeout = ((callback: () => void, delay: number) => { assert.equal(delay, 15_000); expireRequest = callback; return 1; }) as unknown as typeof globalThis.setTimeout;
  globalThis.clearTimeout = (() => {}) as typeof globalThis.clearTimeout;
  globalThis.fetch = async (_input, init) => {
    timeoutBodies.push(String(init?.body));
    if (!timeoutSaved) {
      timeoutSaved = true;
      expireRequest!();
      assert.equal(init?.signal?.aborted, true);
      throw new DOMException("Response wait aborted", "AbortError");
    }
    return new Response(JSON.stringify({ receipt: { state: "applied" } }), { status: 200 });
  };
  await assert.rejects(request("/matters/MAT-timeout/workspace/handoffs/HOF-original/actions", { method: "POST", body: timeoutCommand }), error => {
    assert.match(String(error), /request timed out.*save may have completed.*retry the same action/);
    assert.doesNotMatch(String(error), /cannot reach/);
    return true;
  });
  assert.equal(timeoutSaved, true);
  assert.equal(storage.getItem(alexKey), timeoutDraftBefore, "A lost response must retain the scoped draft and retry envelope");
  assert.deepEqual(await request("/matters/MAT-timeout/workspace/handoffs/HOF-original/actions", { method: "POST", body: timeoutCommand }), { receipt: { state: "applied" } });
  assert.equal(timeoutBodies[0], timeoutBodies[1], "The explicit retry retains the exact command and action key");
} finally {
  globalThis.setTimeout = previousTimer;
  globalThis.clearTimeout = previousClearTimer;
  globalThis.fetch = previousFetch;
}
console.log("A response timeout reports the uncertain save accurately and retains the exact retry command.");

// Real lifecycle callbacks must use the selected identity even when the old
// global review name is blank. Freeze both body and header before a switch.
const lifecycleFunctions: string[] = [];
function findLifecycleCallbacks(node: import("typescript").Node) {
  if (ts.isFunctionDeclaration(node) && ["lifecycleCommand", "runControl", "completeSavedWorkItem", "assignSavedWorkItem", "assignWorkItemTo", "changeWorkItemPriority", "finalizeCurrentDraft"].includes(node.name?.text || "")) lifecycleFunctions.push(node.getText(ast));
  ts.forEachChild(node, findLifecycleCallbacks);
}
findLifecycleCallbacks(ast); assert.equal(lifecycleFunctions.length, 7);
for (const operation of ["approve_response", "mark_as_sent", "close_matter", "complete", "assign", "assign_to", "priority", "finalize"]) {
  let finish!: () => void;
  const dispatched: Array<{path: string; body: any; headers: any}> = [];
  const lifecycleModule = { exports: {} as Record<string, (...args: any[]) => Promise<any>> };
  const scope: Record<string, any> = {
    exports: lifecycleModule.exports, actor: { person_id: "alex", display_name: "Alex Morgan", mode: "demo" }, reviewSettings: {lawyer: ""},
    detail: { matter_id: "MAT-lifecycle" }, finalPath: "final/response.md", draftPath: "draft/response.md", currentWorkItem: {item_type: "approval", work_item_id: "WI-approve"}, workItemOwnerInput: "Jordan Lee", pendingActions: [],
    lifecycleActionNeedsDirectMutation: (id: string) => ["approve_response", "mark_as_sent", "close_matter"].includes(id),
    request: async (path: string, init: any) => { dispatched.push({path, body: JSON.parse(init.body), headers: init.headers}); await new Promise<void>(resolve => {finish = resolve;}); return {changed_paths: ["saved.md"], matter: {work_items: []}, vault_path: "final/response.md"}; },
    setBusy: () => {}, setError: (message: string) => {if(message) throw new Error(message);}, setActionNotice: () => {}, setPendingActions: () => {}, setOwnerOverrides: () => {},
    reloadPersisted: async () => {}, reconcileDossierProjection: () => {}, openDocument: () => {},
  };
  runInNewContext(ts.transpileModule(`${lifecycleFunctions.join("\n")}\nexport {lifecycleCommand,runControl,completeSavedWorkItem,assignSavedWorkItem,assignWorkItemTo,changeWorkItemPriority,finalizeCurrentDraft};`, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText, scope);
  const callback = lifecycleModule.exports;
  const pending = operation === "complete" ? callback.completeSavedWorkItem("WI-complete")
    : operation === "assign" ? callback.assignSavedWorkItem("WI-assign")
    : operation === "assign_to" ? callback.assignWorkItemTo("WI-assign", "Jordan Lee")
    : operation === "priority" ? callback.changeWorkItemPriority("WI-priority", "urgent")
    : operation === "finalize" ? callback.finalizeCurrentDraft()
    : callback.runControl({id: operation}, true, true);
  assert.equal(dispatched.length, 1, `${operation} sends one command without global review settings`);
  scope.actor = { person_id: "jordan", display_name: "Jordan Lee", mode: "demo" };
  finish(); await pending;
  assert.equal(dispatched[0].body.actor, "Alex Morgan");
  assert.equal(dispatched[0].headers["X-Themis-Person-Id"], "alex");
  if(operation === "approve_response") assert.equal(dispatched[0].body.artifact_path, "final/response.md");
  scope.actor = {person_id: "", display_name: "", mode: "demo"};
  assert.throws(() => callback.lifecycleCommand("/actions", {action:"close_matter"}), /Select an available person/);
  assert.equal(dispatched.length, 1, "missing identity cannot fall back to a fabricated actor");
}
console.log("Approve, deliver, close, complete, assign, prioritize and finalize freeze the selected person with blank legacy review settings.");

// Run the real loader with delayed responses. Optional catalogs have no caller
// on Understand; opening/restoring a contextual panel requests fresh data.
let continuityLoader = "";
function findContinuityLoader(node: import("typescript").Node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "loadContinuity" && node.initializer && ts.isCallExpression(node.initializer)) continuityLoader = node.initializer.arguments[0].getText(ast);
  ts.forEachChild(node, findContinuityLoader);
}
findContinuityLoader(ast); assert.ok(continuityLoader);
function loaderFixture(panel: string | null) {
  const calls: Array<{path: string; actor: any; matter: string; resolve: (value: any) => void; reject: (error: Error) => void}> = [];
  const values: Record<string, any> = {};
  const module = {exports: {} as {load: () => Promise<void>}};
  const scope: Record<string, any> = {exports: module.exports, detail: {matter_id: "MAT-load"}, actor: {person_id: "alex", display_name: "Alex Morgan", mode: "demo"}, continuityPanel: panel, panelActive: {current: true}, continuityRead: {current: 0},
    continuityCommand: (matter: string, path: string, _method: string, _body: unknown, actor: any) => new Promise((resolve, reject) => {calls.push({path, matter, actor, resolve, reject});}),
  };
  for (const name of ["Orientation", "FactRequests", "Handoffs", "HandoffReferences", "ImpactCandidates", "Comparisons", "CatalogLoading", "WorkspaceNotice"]) scope[`set${name}`] = (value: any) => {values[name] = value;};
  runInNewContext(ts.transpileModule(`export const load = ${continuityLoader};`, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText, scope);
  return {calls, values, scope, load: module.exports.load};
}
for (const panel of [null, "facts", "handoff", "impact"]) {
  const fixture = loaderFixture(panel);
  const pending = fixture.load();
  const expected = ["/orientation", "/fact-requests", "/handoffs", ...(panel === "handoff" ? ["/handoff-references"] : panel === "impact" ? ["/impact-candidates", "/impacts"] : [])];
  assert.deepEqual(fixture.calls.map(call => call.path), expected);
  fixture.calls[0].resolve({answer: "Useful saved answer"}); for (let tick = 0; tick < 8; tick++) await Promise.resolve();
  assert.equal(fixture.values.Orientation.answer, "Useful saved answer", "orientation must appear before a slow optional catalog settles");
  assert.equal(fixture.values.CatalogLoading, panel === "handoff" || panel === "impact");
  fixture.calls.slice(1).forEach(call => call.resolve([])); await pending;
  assert.equal(fixture.values.CatalogLoading, false);
  assert.ok(fixture.calls.every(call => call.actor.person_id === "alex" && call.matter === "MAT-load"));
  const firstCount = fixture.calls.length;
  const reopened = fixture.load();
  assert.equal(fixture.calls.length, firstCount * 2, "panel refresh/reopen cannot reuse an old catalog");
  fixture.calls.slice(firstCount).forEach(call => call.resolve([])); await reopened;
}
{
  const fixture = loaderFixture("impact");
  const old = fixture.load();
  const oldCalls = [...fixture.calls];
  fixture.scope.actor = {person_id: "jordan", display_name: "Jordan Lee", mode: "demo"};
  fixture.scope.detail = {matter_id: "MAT-new"};
  fixture.scope.continuityPanel = "handoff";
  const current = fixture.load();
  const newCalls = fixture.calls.slice(oldCalls.length);
  oldCalls.forEach(call => call.resolve({old: true})); await old;
  assert.equal(fixture.values.Orientation, undefined);
  assert.equal(fixture.values.ImpactCandidates, undefined);
  assert.equal(fixture.values.CatalogLoading, true, "old completion cannot clear the current panel's loading state");
  assert.ok(newCalls.every(call => call.actor.person_id === "jordan" && call.matter === "MAT-new"));
  newCalls[0].resolve({answer: "New person's saved view"});
  newCalls.slice(1).forEach(call => call.resolve([])); await current;
  assert.equal(fixture.values.Orientation.answer, "New person's saved view");
  const beforeUnmount = {...fixture.values};
  const unmounted = fixture.load();
  fixture.scope.panelActive.current = false;
  fixture.calls.slice(oldCalls.length + newCalls.length).forEach(call => call.reject(new Error("Old context failure"))); await unmounted;
  assert.equal(fixture.values.WorkspaceNotice, beforeUnmount.WorkspaceNotice, "an unmounted context cannot publish late failure notices");
  assert.equal(fixture.values.Orientation, beforeUnmount.Orientation);
}
console.log("Continuity reads publish immediately, defer unused catalogs, reload on panel open, and discard late context results.");


// A saved mutation/run still has its original closure after the user switches
// panels. Its completion must call the current loader, not the old panel's.
for (const kind of ["save", "run"]) {
  const handoff = loaderFixture("handoff");
  const impact = loaderFixture("impact");
  impact.scope.continuityRead = handoff.scope.continuityRead;
  impact.scope.panelActive = handoff.scope.panelActive;
  const currentLoader = {current: handoff.load};
  let finishMutation!: (value: any) => void;
  const module = {exports: {} as Record<string, (...args: any[]) => Promise<any>>};
  const command = {source_action_key: "handoff-before-panel-switch", action: "accept"};
  const receipt = {receipt: {state: "applied"}, run_id: "RUN-saved", state: "completed"};
  const scope = {
    exports: module.exports, detail: {matter_id: "MAT-load"}, actor: {person_id: "alex", display_name: "Alex Morgan", mode: "demo"},
    panelActive: impact.scope.panelActive, scopeRead: {current: 0}, currentContinuityLoader: currentLoader,
    loadContinuity: handoff.load, // Regression trap for the stale callback.
    continuityCommand: async (_matter: string, _path: string, _method: string, sent: any, actor: any) => {
      assert.equal(sent.source_action_key, command.source_action_key); assert.equal(actor.person_id, "alex");
      return new Promise(resolve => {finishMutation = resolve;});
    },
    refreshWorkspace: async () => {}, onReload: async () => {}, setHandoffScope: () => {}, setWorkspaceNotice: () => {},
    contextKey: "panel-switch-context", currentConversationId: "CONV-original", localStorage: {getItem: () => null}, changePanelDraft: () => {}, persistPanelDrafts: () => {}, setExternalRun: () => {}, setEditorRefresh: () => {},
  };
  runInNewContext(ts.transpileModule(`export ${saveSource}\nexport ${continuityRunSource}`, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText, scope);
  const mutation = kind === "save" ? module.exports.continuitySave("/handoffs/HOF-saved/actions", command) : module.exports.continuityRun("/prepare-communication", command);
  currentLoader.current = impact.load;
  const openedImpact = impact.load();
  finishMutation(receipt);
  for (let tick = 0; tick < 10; tick++) await Promise.resolve();
  assert.equal(handoff.calls.length, 0, "late completion must not start the closed handoff panel's loader");
  assert.equal(impact.calls.length, 10, "the active Compare panel gets a fresh completion read");
  impact.calls.forEach(call => call.resolve(call.path === "/impact-candidates" ? {sources: ["current source"], targets: []} : call.path === "/impacts" ? ["current comparison"] : []));
  await openedImpact; await mutation;
  assert.deepEqual(impact.values.ImpactCandidates.sources, ["current source"]);
  assert.deepEqual(impact.values.Comparisons, ["current comparison"]);
  assert.equal(impact.values.CatalogLoading, false);
}
console.log("Delayed save/run completion refreshes the active Compare panel and keeps its catalog results after a panel switch.");
