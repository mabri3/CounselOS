import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../components/experimental/ExperimentalChat.tsx", import.meta.url), "utf8");
const ast = ts.createSourceFile("ExperimentalChat.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let initialLoad = "";
function find(node: ts.Node) {
  if (ts.isCallExpression(node) && node.expression.getText(ast) === "useEffect"
      && node.arguments[1]?.getText(ast).includes("loadAttempt")) initialLoad = node.arguments[0].getText(ast);
  ts.forEachChild(node, find);
}
find(ast);
assert.ok(initialLoad, "the saved conversation has an initial loader");
function deferred() {
  let resolve!: (value: any) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<any>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const flush = () => new Promise<void>(resolve => setImmediate(resolve));
function harness() {
  const history = deferred(), runs = deferred();
  const states: Record<string, any> = {};
  const setters = Object.fromEntries(["Loading", "ConversationError", "RunLoadError", "RunCheckPending", "ConversationId", "Run"]
    .map(name => [`set${name}`, (value: any) => { states[name] = value; }]));
  const module = { exports: {} as { run: () => () => void } };
  runInNewContext(ts.transpileModule(`export const run = ${initialLoad}`, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports: module.exports, ...setters, Error,
    mounted: { current: true }, operation: { current: 0 }, pendingOrigin: { current: null },
    matterId: "MAT-saved", storageKey: "saved",
    localStorage: { getItem: (key: string) => key.endsWith(":conversation") ? "CONV-saved" : null },
    // A workspace read that never finishes must not hold the history behind it.
    loadWorkspace: () => new Promise(() => {}),
    getConversation: () => { states.historyRequested = true; return history.promise; },
    getChatRuns: () => runs.promise,
    running: () => false,
    showConversation: (value: any) => { states.conversation = value; },
  });
  const cleanup = module.exports.run();
  return { history, runs, states, cleanup };
}

const loaded = harness();
assert.equal(loaded.states.historyRequested, true, "history starts while the workspace is pending");
loaded.history.resolve({ messages: [{ content: "Saved answer" }] });
await flush();
assert.equal(loaded.states.Loading, false, "saved messages appear before work status finishes");
assert.equal(loaded.states.conversation.messages[0].content, "Saved answer");
assert.equal(loaded.states.RunCheckPending, true);
loaded.runs.reject(new Error("Status timeout"));
await flush();
assert.equal(loaded.states.ConversationError, "", "a status failure must not hide saved messages");
assert.ok(loaded.states.RunLoadError);
assert.equal(loaded.states.RunCheckPending, false);
loaded.cleanup();

const failed = harness();
failed.history.reject(new Error("History timeout"));
await flush();
assert.equal(failed.states.ConversationError, "History timeout");
assert.equal(failed.states.conversation, undefined, "a failed read cannot claim an empty saved conversation");
assert.equal(failed.states.Loading, false);
failed.cleanup();

const abandoned = harness();
abandoned.cleanup();
abandoned.history.resolve({ messages: [{ content: "Old matter" }] });
await flush();
assert.equal(abandoned.states.conversation, undefined, "a late read cannot replace another matter");
console.log("Saved chat loads independently; history and status failures remain distinct; late reads are ignored.");
