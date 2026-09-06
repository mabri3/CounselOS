import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const workspace = readFileSync(new URL("../components/MatterWorkspace.tsx", import.meta.url), "utf8");
const layout = readFileSync(new URL("../components/workspace/DraftWorkspace.tsx", import.meta.url), "utf8");
const documentPanel = readFileSync(new URL("../components/DocumentPanel.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../components/workspace/MatterA.module.css", import.meta.url), "utf8");

// The old Overview/Chat accordion has become three persistent view slots.
assert.equal((workspace.match(/<ChatPanel\b/g) ?? []).length, 1, "one persistent conversation");
assert.equal((workspace.match(/<DraftWorkspace\b/g) ?? []).length, 1, "one workspace frame");
assert.match(workspace, /detail\.intake_state === "active" \? "chat" : "overview"/);
assert.doesNotMatch(workspace, /detail\.intake_conversation_id \|\| detail\.intake_state === "active"/);
assert.match(workspace, /onNewChat=\{\(\) => \{[\s\S]*?setWorkspaceView\("discuss"\)[\s\S]*?setConversationSeed/);
assert.match(workspace, /function openChatWithSeed\(text: string\)[\s\S]*?setMiddleSection\("chat"\)[\s\S]*?setChatSeed/);
assert.match(workspace, /function selectMatterItem\(path: string\)[\s\S]*?openDocument\(path\)/);
assert.match(workspace, /onOpenDocument=\{openDocument\}/);
assert.doesNotMatch(workspace, /focusResearch && researchPath \? researchPath : canonicalDraftPath/);
assert.match(documentPanel, /if \(!activePath\) return null;/, "no blank document pane");
assert.match(workspace, /onClose=\{\(\) => \{[\s\S]*?setActivePath\(null\)/);
assert.match(documentPanel, /aria-label="Close document"/);
assert.match(documentPanel, /function requestClose\(\)[\s\S]*?if \(dirty\)[\s\S]*?onSnapshot\?\.\(recoverableLocalEditorSnapshot\([\s\S]*?dirty: true[\s\S]*?onClose\(\)/, "closing dirty text preserves a recoverable snapshot before closing");
assert.match(layout, /type="radio" value=\{item.id\}/);
assert.match(layout, /onChange=\{\(\) => props.onViewChange\(item.id\)\}/);

const ast = ts.createSourceFile("DraftWorkspace.tsx", layout, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const wrappers: Record<string, string> = {};
function visit(node: import("typescript").Node) {
  if (ts.isJsxElement(node)) for (const attr of node.openingElement.attributes.properties) {
    if (ts.isJsxAttribute(attr) && attr.name.getText(ast) === "className" && attr.initializer && ts.isStringLiteral(attr.initializer)) {
      const slot = attr.initializer.text.replace("draft-workspace__", "");
      if (["understand", "editor", "conversation"].includes(slot)) wrappers[slot] = node.getText(ast);
    }
  }
  ts.forEachChild(node, visit);
}
visit(ast);
assert.deepEqual(Object.keys(wrappers).sort(), ["conversation", "editor", "understand"]);
for (const view of ["understand", "draft", "discuss"]) for (const expanded of [false, true]) {
  const conversationVisible = view === "discuss" || expanded;
  for (const [slot, jsx] of Object.entries(wrappers)) {
    const props = { view, understand: "READING RETAINED", editor: "EDIT RETAINED", conversation: "CHAT RETAINED" };
    const code = ts.transpileModule(`result = (${jsx});`, { compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022 } }).outputText;
    const sandbox = { React, props, conversationVisible, result: null as any };
    runInNewContext(code, sandbox);
    const html = renderToStaticMarkup(sandbox.result);
    const hidden = slot === "understand" ? view !== "understand" : slot === "editor" ? view !== "draft" : !conversationVisible;
    assert.equal(html.includes('hidden=""'), hidden, `${view}/${slot} visibility`);
    assert.equal(sandbox.result.props["aria-hidden"], hidden);
    assert.ok(html.includes(slot === "understand" ? props.understand : slot === "editor" ? props.editor : props.conversation), "hidden slots must retain their child");
  }
}
assert.match(styles, /@media \(max-width: 900px\)[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/, "narrow editor and reference stack");
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?transition:\s*none/);
console.log("Persistent workspace view, document close, and responsive checks passed.");
