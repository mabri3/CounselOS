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
import { $getSelection, $isRangeSelection, createEditor } from "lexical";
import { remainingComposerValue } from "../lib/chatRunLogic.ts";
import { isModifiedDocumentEnd, moveSelectionToDocumentEnd } from "../lib/editorSelection.ts";
import { savedMarkdownMatches } from "../lib/documentSave.ts";

const form = readFileSync(new URL("../components/NewMatterForm.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/api.ts", import.meta.url), "utf8");
const panel = readFileSync(new URL("../components/DocumentPanel.tsx", import.meta.url), "utf8");
const editor = readFileSync(new URL("../components/MarkdownRichEditor.tsx", import.meta.url), "utf8");
const apiModel = readFileSync(new URL("../../backend/app/models/api.py", import.meta.url), "utf8");
const matterService = readFileSync(new URL("../../backend/app/services/matters.py", import.meta.url), "utf8");
const chatPanel = readFileSync(new URL("../components/ChatPanel.tsx", import.meta.url), "utf8");
const chatCards = readFileSync(new URL("../components/ChatCards.tsx", import.meta.url), "utf8");

assert.match(form, /const submittedTargetDate = matterTargetDateFromForm\(new FormData\(event\.currentTarget\)\);[\s\S]*await getSettings\(\)[\s\S]*target_date:\s*submittedTargetDate/, "the matter payload must use the submitted target date captured from FormData before any await");
assert.doesNotMatch(form, /target_date:\s*targetDate(?:\s*\|\|\s*null)?/, "matter creation must not fall back to stale target-date React state");
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
assert.match(chatPanel, /operation_results\?: ChatOperationResult\[\]/, "chat history must preserve typed operation results");
assert.doesNotMatch(chatCards, /createDecision|performMatterAction/, "confirmation cards must use the durable chat action path");
assert.match(chatCards, /card_id: `operation-result:\$\{result\.action\}`[\s\S]*action: "apply"/, "confirmation cards must send a normal chat card action");
assert.match(chatCards, /value="followed">Followed<[\s\S]*value="modified">Modified<[\s\S]*value="not_followed">Not followed<[\s\S]*value="not_applicable">Not applicable</, "decision confirmation must require an explicit recommendation disposition");
assert.match(chatCards, /reasonRequired = disposition === "modified" \|\| disposition === "not_followed"/, "departures from a recommendation must require a reason");
assert.match(chatCards, /mark_as_sent: "Record manual delivery"/, "a persisted delivery operation must keep its specific action label");
assert.match(chatPanel, /latestOperationResults\.set\(result\.source_action_key \?\? result\.action, result\)[\s\S]*latestOperationResults\.get\(result\.source_action_key \?\? result\.action\) === result/, "reload must render only the latest durable result for a source action");
assert.match(chatCards, /No workspace change recorded/, "failed typed mutation results must render a structured no-change state");

assert.match(panel, /value=\{document\.content\}/, "raw Markdown must use the same document content as the rich editor");
assert.match(panel, /markdown=\{document\.content\}/, "the rich editor must use the same document content as raw Markdown");
assert.match(panel, /canonical = await getFile\(submitted\.path\)/, "save must read the canonical document back");
assert.match(panel, /savedMarkdownMatches\(submitted\.content, canonical\.content\)/, "Saved must require canonical content equality");
assert.match(panel, /Save conflict — review/, "a read-back mismatch must remain visible");
assert.match(panel, /Retry save[\s\S]*Reload canonical/, "a conflict must keep retry and reload recovery controls");
assert.equal(savedMarkdownMatches("Saved text", "Saved text\n"), true, "one trailing newline is a storage normalization");
assert.equal(savedMarkdownMatches("Saved text\n", "Saved text"), true, "one trailing newline is symmetric");
assert.equal(savedMarkdownMatches("Saved text\n\n", "Saved text\n"), false, "more than one trailing newline is a real mismatch");
assert.equal(savedMarkdownMatches("Local text", "Canonical text"), false, "different content must conflict");
assert.match(panel, /onClick=\{\(\) => setMode\("editing"\)\}/, "switching to rich editing must only change the display mode");
assert.match(panel, /onClick=\{\(\) => setMode\("markdown"\)\}/, "switching to raw Markdown must only change the display mode");
assert.match(editor, /\bHEADING\b/, "the Markdown conversion must support headings, including H1");
assert.match(editor, /h1:\s*"rich-heading rich-heading-h1"/, "the rich editor must register an H1 presentation");
assert.match(editor, /registerCommand\(KEY_DOWN_COMMAND[\s\S]*isModifiedDocumentEnd[\s\S]*moveSelectionToDocumentEnd/, "the rich editor must own modified-End keyboard behavior");

assert.equal(isModifiedDocumentEnd({ key: "End", altKey: false, ctrlKey: true, metaKey: false }), true);
assert.equal(isModifiedDocumentEnd({ key: "End", altKey: false, ctrlKey: false, metaKey: true }), true);
assert.equal(isModifiedDocumentEnd({ key: "End", altKey: false, ctrlKey: false, metaKey: false }), false);
assert.equal(isModifiedDocumentEnd({ key: "Home", altKey: false, ctrlKey: true, metaKey: false }), false);

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

for (const source of [
  "# Review heading\n\nFirst paragraph.\n\nLast paragraph.",
  "# Review heading\n\n- First item\n- Last item",
  "# Review heading\n\n| Item | Result |\n| --- | --- |\n| Date | 2026-09-15 |",
]) {
  const interactionEditor = createEditor({
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode],
    onError(error) { throw error; },
  });
  interactionEditor.update(() => {
    $convertFromMarkdownString(source, transformers);
    moveSelectionToDocumentEnd();
    const selection = $getSelection();
    assert.equal($isRangeSelection(selection), true);
    if ($isRangeSelection(selection)) selection.insertText(" ATTORNEY NOTE");
  }, { discrete: true });
  let result = "";
  interactionEditor.getEditorState().read(() => { result = $convertToMarkdownString(transformers); });
  assert.equal(result.startsWith("# Review heading"), true, "modified End must never change the H1");
  assert.equal(result.endsWith(" ATTORNEY NOTE"), true, "typing after modified End must append at the final editable position");
}

console.log("Target-date, modified-End, and Markdown preservation checks passed.");
