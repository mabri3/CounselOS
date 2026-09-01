import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  BOLD_ITALIC_STAR,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  HEADING,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
  ORDERED_LIST,
  QUOTE,
  UNORDERED_LIST,
} from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { createEditor } from "lexical";
import { remainingComposerValue } from "../lib/chatRunLogic.ts";

const form = readFileSync(new URL("../components/NewMatterForm.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/api.ts", import.meta.url), "utf8");
const panel = readFileSync(new URL("../components/DocumentPanel.tsx", import.meta.url), "utf8");
const editor = readFileSync(new URL("../components/MarkdownRichEditor.tsx", import.meta.url), "utf8");
const apiModel = readFileSync(new URL("../../backend/app/models/api.py", import.meta.url), "utf8");
const matterService = readFileSync(new URL("../../backend/app/services/matters.py", import.meta.url), "utf8");
const chatPanel = readFileSync(new URL("../components/ChatPanel.tsx", import.meta.url), "utf8");
const chatCards = readFileSync(new URL("../components/ChatCards.tsx", import.meta.url), "utf8");

assert.match(form, /target_date:\s*targetDate\s*\|\|\s*null/, "the matter payload must carry the selected target date");
assert.match(form, /type="date"[\s\S]*value=\{targetDate\}/, "the target-date input must remain controlled");
assert.match(api, /createMatter[\s\S]+JSON\.stringify\(payload\)/, "the matters API must transport the full form payload");
assert.match(apiModel, /class MatterCreate[\s\S]+target_date:\s*str\s*\|\s*None\s*=\s*None/, "the API model must accept a target date");
assert.match(matterService, /"target_date":\s*request\.target_date/, "the matter record must store the target date");
assert.match(matterService, /"requested_launch_date":\s*request\.target_date/, "the immutable request must store the target date");
assert.match(chatPanel, /setMessages\(\(current\) => \[\.\.\.current, \{ role: "user"/, "chat must echo a submitted user turn before transport completes");
assert.match(chatPanel, /setInput\(\(current\) => remainingComposerValue/, "accepted submissions must clear only the composer text they sent");
assert.equal(
  remainingComposerValue("Unsent question", "Unsent question", false, ""),
  "Unsent question",
  "a failed or unrelated submission must preserve composer text",
);
assert.equal(
  remainingComposerValue("Newer unsent question", "Submitted question", true, ""),
  "Newer unsent question",
  "an accepted submission must preserve composer text entered after it started",
);
assert.match(chatCards, /type=\{mode === "single" \? "radio" : "checkbox"\}/, "question choices must use native radio and checkbox inputs");

assert.match(panel, /value=\{document\.content\}/, "raw Markdown must use the same document content as the rich editor");
assert.match(panel, /markdown=\{document\.content\}/, "the rich editor must use the same document content as raw Markdown");
assert.match(panel, /onClick=\{\(\) => setMode\("editing"\)\}/, "switching to rich editing must only change the display mode");
assert.match(panel, /onClick=\{\(\) => setMode\("markdown"\)\}/, "switching to raw Markdown must only change the display mode");
assert.match(editor, /\bHEADING\b/, "the Markdown conversion must support headings, including H1");
assert.match(editor, /h1:\s*"rich-heading rich-heading-h1"/, "the rich editor must register an H1 presentation");

const preserved = "# Review heading\n\n| Item | Result |\n| --- | --- |\n| Date | 2026-09-15 |\n";
const transformers = [
  HEADING, QUOTE, UNORDERED_LIST, ORDERED_LIST, BOLD_ITALIC_STAR, BOLD_STAR,
  BOLD_UNDERSCORE, ITALIC_STAR, ITALIC_UNDERSCORE, LINK,
];
const lexical = createEditor({
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode],
  onError(error) { throw error; },
});
lexical.update(() => { $convertFromMarkdownString(preserved, transformers); }, { discrete: true });
let converted = "";
lexical.getEditorState().read(() => { converted = $convertToMarkdownString(transformers); });
assert.equal(converted, preserved.trimEnd(), "Lexical conversion must preserve an H1 and pipe table");

console.log("Target-date and Markdown preservation checks passed.");
