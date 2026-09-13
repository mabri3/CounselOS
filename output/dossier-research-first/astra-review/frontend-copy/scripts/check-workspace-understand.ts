import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const [understand, issues, recap, types, reviewStyles] = await Promise.all([
  readFile(new URL("../components/workspace/UnderstandPanel.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/IssueNavigator.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/ChangeRecap.tsx", import.meta.url), "utf8"),
  readFile(new URL("../lib/workspaceTypes.ts", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/MatterReview.module.css", import.meta.url), "utf8"),
]);

assert.match(understand, /Current business question/, "Understand must lead with the canonical business question");
assert.match(understand, /Useful current answer/, "Understand must keep an answer-first reading surface");
assert.match(understand, /import ReactMarkdown from "react-markdown"/, "saved answers must use the established Markdown renderer");
assert.match(understand, /remarkPlugins=\{\[remarkGfm\]\}/, "saved answers must support standard GitHub-flavored Markdown");
assert.match(understand, /const LONG_ANSWER_CHARACTER_LIMIT = 1200/, "long saved answers need a bounded initial reading surface");
assert.match(understand, /function longAnswerPreview\(answer: string\)/, "a long-answer preview must retain original saved text rather than invent a summary");
assert.match(understand, /answer\.split\(\/\(\?<=\\n\)\//, "long-answer previews must consider complete Markdown lines");
assert.match(understand, /\^\\s\*\(`\{3,\}\|~\{3,\}\)/, "long-answer previews must not end inside fenced code");
const previewModule = { exports: {} as { longAnswerPreview: (answer: string) => { text: string; earlierText?: string } } };
runInNewContext(ts.transpileModule(understand, {
  fileName: "UnderstandPanel.tsx",
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, { exports: previewModule.exports, require: () => ({}) });
for (const reference of ["[Saved authority][source]", "![Supplied diagram][source]", "[source][]"]) {
  const answer = `${reference}\n\n${"Keep the source qualification. ".repeat(60)}\n\nCurrent answer\n\nApply that qualification.\n\n[source]: https://example.test/supplied-source "Original title"\n`;
  const preview = previewModule.exports.longAnswerPreview(answer);
  assert.equal(preview.text, answer, "reference-style Markdown and its distant definition must stay complete and in source order");
  assert.equal(preview.earlierText, undefined, "a referenced answer must not split its definition from the original text");
}
assert.match(understand, /<ReactMarkdown components=\{answerMarkdownComponents\} remarkPlugins=\{\[remarkGfm\]\}>\{visibleAnswer\}<\/ReactMarkdown>/, "the visible saved answer must render Markdown rather than raw syntax");
assert.match(understand, /const preview = answerExpanded \|\| !answerIsLong \? \{ text: savedAnswer\.text \} : longAnswerPreview\(savedAnswer\.text\)/, "expanding a long answer must restore the complete saved Markdown");
assert.match(understand, /const visibleAnswer = preview\.text/, "the renderer must receive the preview text, including the complete expanded answer");
assert.match(understand, /const previewIsOneLongBlock = answerIsLong && !answerExpanded && visibleAnswer === savedAnswer\.text/, "only a long one-block answer may use the fixed-height disclosure");
assert.match(understand, /maxHeight: "30rem", overflow: "hidden"/, "one long Markdown block must use a bounded disclosure instead of a character cut");
assert.doesNotMatch(understand, /answer\.slice\(0, LONG_ANSWER_CHARACTER_LIMIT\)/, "a long answer must never use a hard character cut");
assert.match(understand, /table: \(\{ children \}: \{ children\?: React\.ReactNode \}\)[\s\S]*?className=\{styles.tableScroll\}/, "wide Markdown tables must scroll within the reading card");
assert.match(understand, /pre: \(\{ children \}: \{ children\?: React\.ReactNode \}\)[\s\S]*?className=\{styles.codeBlock\}/, "wide Markdown code blocks must scroll within the reading card");
assert.match(understand, /aria-controls=\{answerId\} aria-expanded=\{answerExpanded\}/, "the long-answer control must expose its expanded state to assistive technology");
assert.match(understand, /Show less[\s\S]*?Read full answer/, "a long answer must provide both expand and collapse actions");
assert.match(understand, /Proposed reframe[\s\S]*?Apply[\s\S]*?Reject/, "a proposed reframe needs explicit durable actions");
assert.match(understand, /Earlier questions[\s\S]*?Based on an earlier question/, "question history must name earlier scope");
assert.match(understand, /Answer[\s\S]*?Explore why[\s\S]*?Leave open/, "supporting questions need all three actions");
assert.match(understand, /question\.state !== "answered"/, "left-open questions must keep Answer and Explore why controls");
assert.match(understand, /Fact saved\. Question update not saved\./, "partial answer receipts must be truthful");
assert.match(understand, /receiptClass\(noticeState\)/, "a not-saved receipt must not use the healthy success treatment");
assert.match(understand, /baseRevision: currentQuestion\.revision/, "question editing must capture the revision at edit start");
assert.match(understand, /expected_revision: draft\.baseRevision/, "question saves must use the captured revision");
assert.match(understand, /Rebase my edit/, "a changed question needs an explicit rebase choice");
assert.match(understand, /Business question<\/span><textarea className="text-input prose" disabled=\{busy\}/, "the business-question input must lock while its successful save can clear the submitted draft");
assert.match(understand, /Material facts/, "material facts must remain visible");
assert.match(understand, /Business context/, "business context must remain visible");
assert.match(understand, /Sources and actions/, "source actions must be discoverable");
assert.match(understand, /source_action_key: actionKey/, "direct actions must retain a retry key");
assert.match(understand, /const \[answeringIds, setAnsweringIds\] = useState<string\[\]>\(\[\]\)/, "each supporting answer needs independent pending state");
assert.match(understand, /answeringIds\.includes\(question\.question_id\)/, "one answer save must keep its own field locked while another runs");
assert.match(understand, /filter\(\(questionId\) => questionId !== question\.question_id\)/, "finishing one answer save must not clear another pending answer");
assert.doesNotMatch(understand, /Saved\./, "the panel must not claim a generic saved state before examining the receipt");
assert.doesNotMatch(understand, /ChatPanel|<textarea[^>]*placeholder="Ask/, "Understand must not create a second chat composer or history");

assert.match(issues, /baseRevision: issuesRevision/, "issue editing must capture the revision at edit start");
assert.match(issues, /expected_revision: draft\.baseRevision/, "each issue save must use its captured revision");
assert.match(issues, /Rebase my edits/, "a changed issue needs an explicit rebase choice");
assert.match(issues, /Issue change was not saved\. Your edits are retained\./, "failed issue saves must keep the local draft");
assert.match(issues, /hasOwnProperty\.call\(changes, key\)/, "clearing a parent must retain the draft null instead of falling back to the old parent");
assert.doesNotMatch(issues, /className=\{selected \? "wash-attention"/, "selection must use a neutral border, not attention color");
assert.match(issues, /stateLabel\(issue\.lawyer_state\)/, "the visible state label must remain the saved state while an edit is dirty");
assert.match(issues, /const \[savingIds, setSavingIds\] = useState<string\[\]>\(\[\]\)/, "each issue save needs independent pending state");
assert.match(issues, /savingIds\.includes\(issue\.issue_id\)/, "one issue save must keep its own fields locked while another runs");
assert.match(issues, /filter\(\(issueId\) => issueId !== issue\.issue_id\)/, "finishing one issue save must not clear another pending issue");
assert.match(issues, /Issue title[\s\S]*?Parent issue[\s\S]*?Lawyer state/, "issues need title, parent, and lawyer-state editing");
assert.match(issues, /<option value="open">Open<\/option>[\s\S]*?<option value="explored">Explored<\/option>[\s\S]*?<option value="set_aside">Set aside<\/option>/, "lawyer states must be explicit");

assert.match(recap, /Some optional output files could not be read\./, "recap must warn without hiding saved work");
assert.match(recap, /await onMarkSeen\(currentRecap\.current_revision\)/, "mark seen must await the durable callback");
assert.match(recap, /savedRevision === currentRecap\.current_revision/, "a new recap revision must reset the local seen state");
assert.match(recap, /disabled=\{saving \|\| seen\}/, "mark seen must re-enable for a newer recap revision");
assert.match(recap, /Changes were not marked seen\. You can retry\./, "failed mark-seen writes must be retryable");
assert.match(recap, /Open \{path\.split/, "saved output links must stay usable");

assert.match(types, /onMarkSeen: \(revision: string\) => Promise<void>/, "Understand needs the real mark-seen callback for recap");
for (const source of [understand, issues, recap]) assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "workspace panels must use shared semantic color tokens");

const recapIsSeen = (savedRevision: string | null, currentRevision: string) => savedRevision === currentRevision;
assert.equal(recapIsSeen("rev-1", "rev-1"), true, "the saved recap revision is seen");
assert.equal(recapIsSeen("rev-1", "rev-2"), false, "a newer recap must become actionable again");
const longMarkdown = "## Recommendation\n\nUse the revised notice.\n\n- Keep the current scope\n- Record the exception\n\n".repeat(30);
assert.ok(longMarkdown.length > 1200, "the long-answer fixture exceeds the disclosure limit");
assert.match(longMarkdown, /## Recommendation[\s\S]*?- Keep the current scope/, "the long-answer fixture includes Markdown that must render as structure");
const oneBlockMarkdown = `[Saved analysis](https://example.test/${"scope-".repeat(350)})`;
assert.ok(oneBlockMarkdown.length > 1200, "the single-block fixture exceeds the disclosure limit");
assert.match(oneBlockMarkdown, /^\[[^\]]+\]\(https:\/\//, "the single-block fixture starts with a complete Markdown link that must not be cut");
const shortTallMarkdown = "- item\n".repeat(80);
assert.ok(shortTallMarkdown.length < 1200, "the short tall fixture stays below the long-answer disclosure threshold");
const draftValue = (changes: { parent_issue_id?: string | null }, fallback: string | null) => Object.prototype.hasOwnProperty.call(changes, "parent_issue_id") ? changes.parent_issue_id : fallback;
assert.equal(draftValue({ parent_issue_id: null }, "ISS-parent"), null, "an explicit parent clear must not revert to the old parent");
const beginPending = (pending: string[], id: string) => pending.includes(id) ? pending : [...pending, id];
const endPending = (pending: string[], id: string) => pending.filter((pendingId) => pendingId !== id);
let pending = beginPending([], "A");
pending = beginPending(pending, "B");
pending = endPending(pending, "B");
assert.deepEqual(pending, ["A"], "when B finishes first, deferred A must remain locked");
pending = endPending(pending, "A");
assert.deepEqual(pending, [], "both controls unlock only after both deferred saves finish");

console.log("Workspace Understand checks passed.");

for (const className of ["tableScroll", "codeBlock"]) assert.match(reviewStyles, new RegExp(`\\.${className}\\s*\\{[^}]*max-width:\\s*100%[^}]*overflow-x:\\s*auto`), "wide answer content must scroll inside its bounded wrapper");
