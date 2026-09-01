import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const workspace = readFileSync(new URL("../components/MatterWorkspace.tsx", import.meta.url), "utf8");
const documentPanel = readFileSync(new URL("../components/DocumentPanel.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

assert.match(workspace, /useState<"overview" \| "chat">\(\(\) =>/);
assert.match(workspace, /detail\.intake_conversation_id \|\| detail\.intake_state === "active" \? "chat" : "overview"/);
assert.match(workspace, />\s*Overview\s*</);
assert.match(workspace, />\s*Chat\s*</);
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
assert.match(workspace, /const documentVisible = Boolean\(activePath\)/, "the document pane must depend on an actual selected path");
assert.match(workspace, /\.\.\.\(documentVisible[\s\S]*?paneWeights\.document/, "the grid must not reserve an empty document column");
assert.match(workspace, /\{documentVisible \? \([\s\S]*?document-pane-shell[\s\S]*?DocumentPanel/, "the work surface must render only for a selected document");
assert.match(workspace, /function selectMatterItem\(path: string\)[\s\S]*?openDocument\(path\)/, "a file click in the left pane must open the work surface");
assert.match(workspace, /onOpenDocument=\{openDocument\}/, "agent and user artifact actions must open the work surface through the same path");
assert.doesNotMatch(workspace, /focusResearch && researchPath \? researchPath : canonicalDraftPath/, "an existing draft must not open the work surface without a request");
assert.match(documentPanel, /if \(!activePath\) return null;/, "DocumentPanel must not render an empty placeholder");
assert.match(workspace, /onClose=\{\(\) => \{[\s\S]*?setActivePath\(null\)[\s\S]*?setTreeActivePath\(null\)/, "closing a document must clear the selected work surface");
assert.match(documentPanel, /aria-label="Close document"/, "the document bar must provide a clear close control");
assert.match(documentPanel, /dirty[\s\S]*?setClosePromptOpen\(true\)/, "closing a modified document must ask what to do");
assert.match(documentPanel, /Save and close/, "the close prompt must offer to save changes");
assert.match(documentPanel, />Close without saving</, "the close prompt must offer to discard changes");
assert.match(documentPanel, />Cancel</, "the close prompt must let the user keep editing");
assert.match(styles, /\.middle-section\.active\s*\{[^}]*flex:\s*1 1 0/);
assert.match(styles, /\.middle-section-panel\[hidden\]\s*\{\s*display:\s*none/);
assert.match(styles, /@media \(max-width: 1024px\)[\s\S]*?\.middle-section\.active\s*\{[^}]*min-height:\s*min\(640px, calc\(100vh - 140px\)\)/);
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.matter-panes\s*\{\s*transition:\s*none/);

console.log("Middle-pane accordion checks passed.");
