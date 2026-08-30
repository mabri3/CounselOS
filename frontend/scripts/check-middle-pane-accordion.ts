import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const workspace = readFileSync(new URL("../components/MatterWorkspace.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

assert.match(workspace, /useState<"overview" \| "chat">\("overview"\)/);
assert.match(workspace, />\s*Overview\s*</);
assert.match(workspace, />\s*Chat with Themis\s*</);
assert.match(workspace, /aria-controls="matter-overview-panel"/);
assert.match(workspace, /aria-controls="matter-chat-panel"/);
assert.match(workspace, /id="matter-overview-panel"[\s\S]*?role="region"/);
assert.match(workspace, /id="matter-chat-panel"[\s\S]*?role="region"/);
assert.match(workspace, /aria-labelledby="matter-overview-toggle"/);
assert.match(workspace, /aria-labelledby="matter-chat-toggle"/);
assert.equal((workspace.match(/<ChatPanel/g) ?? []).length, 1, "ChatPanel must have one persistent instance");
assert.doesNotMatch(workspace, /Focus conversation/);

const savedConversation = workspace.indexOf("const conversationId = conversationIdFromPath(path)");
const savedConversationOpensChat = workspace.indexOf('setMiddleSection("chat")', savedConversation);
const savedConversationSeed = workspace.indexOf("setConversationSeed", savedConversation);
assert.ok(savedConversationOpensChat > savedConversation && savedConversationOpensChat < savedConversationSeed);

const newChat = workspace.indexOf("onNewChat={() =>");
assert.ok(workspace.indexOf('setMiddleSection("chat")', newChat) > newChat);
assert.match(workspace, /function openChatWithSeed\(text: string\)[\s\S]*?setMiddleSection\("chat"\)[\s\S]*?setChatSeed/);
assert.match(styles, /\.middle-section\.active\s*\{[^}]*flex:\s*1 1 0/);
assert.match(styles, /\.middle-section-panel\[hidden\]\s*\{\s*display:\s*none/);
assert.match(styles, /@media \(max-width: 1024px\)[\s\S]*?\.middle-section\.active\s*\{[^}]*min-height:\s*min\(640px, calc\(100vh - 140px\)\)/);
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.matter-panes\s*\{\s*transition:\s*none/);

console.log("Middle-pane accordion checks passed.");
