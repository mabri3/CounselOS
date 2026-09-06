import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LinkNode } from "@lexical/link";
import { $convertFromMarkdownString, $convertToMarkdownString, LINK } from "@lexical/markdown";
import { createEditor } from "lexical";

type ElementNode = { type: unknown; props: Record<string, unknown> };
const jsx = (type: unknown, props: Record<string, unknown> | null): ElementNode => ({ type, props: props ?? {} });

function loadClaimMarkdown(source: string) {
  const module = { exports: {} as Record<string, unknown> };
  const output = ts.transpileModule(source, {
    fileName: "ClaimMarkdown.tsx",
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  runInNewContext(output, {
    exports: module.exports,
    module,
    URL,
    HTMLElement: class {},
    require: (name: string) => {
      if (name === "react/jsx-runtime") return { Fragment: "Fragment", jsx, jsxs: jsx };
      if (name === "react-markdown") return function Markdown() { return null; };
      if (name === "remark-gfm") return () => undefined;
      if (name === "@/lib/documentNavigation") return { isSafeDocumentPath: (path: string) => !path.startsWith("/") && !path.includes("..") };
      return {};
    },
  });
  return module.exports;
}

function loadWorkspaceApi(source: string) {
  const module = { exports: {} as Record<string, unknown> };
  const output = ts.transpileModule(source, {
    fileName: "workspaceApi.ts",
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  runInNewContext(output, {
    exports: module.exports,
    module,
    URL,
    require: (name: string) =>
      name === "./api.ts" ? { request: () => Promise.resolve({}) } : {},
  });
  return module.exports;
}

const [claimSource, workspaceSource, mapPageSource, panelSource, apiSource, matterPageSource, understandSource, draftWorkspaceSource, richEditorSource] = await Promise.all([
  readFile(new URL("../components/workspace/ClaimMarkdown.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/MatterWorkspace.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/matters/[matterId]/decision-map/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/DocumentPanel.tsx", import.meta.url), "utf8"),
  readFile(new URL("../lib/workspaceApi.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/matters/[matterId]/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/UnderstandPanel.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/DraftWorkspace.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/MarkdownRichEditor.tsx", import.meta.url), "utf8"),
]);

const claimModule = loadClaimMarkdown(claimSource);
const workspaceApiModule = loadWorkspaceApi(apiSource);
const visibleClaimProse = claimModule.visibleClaimProse as (text: string) => string;
const evidenceForSourceMarker = claimModule.evidenceForSourceMarker as (claims: unknown[], sourceId: string, locator?: string) => Record<string, unknown> | null;
const sourceForMarker = claimModule.sourceForMarker as (claims: unknown[], sourceId: string) => Record<string, unknown> | null;
const claimsForRenderedText = claimModule.claimsForRenderedText as (claims: unknown[], text: string) => Array<Record<string, unknown>>;
const ClaimMarkdown = claimModule.default as (props: Record<string, unknown>) => ElementNode;

const transport = '```claim-support\n{"claims":[{"claim_id":"CLM-1"}]}\n```';
assert.equal(visibleClaimProse(`Visible answer.\n\n${transport}`), "Visible answer.", "valid machine metadata is hidden after useful prose");
assert.equal(visibleClaimProse(transport), transport, "machine-only output is not replaced by an empty answer");
assert.match(visibleClaimProse("Answer.\n```claim-support\n{bad}\n```"), /\{bad\}/, "malformed metadata remains useful and visible");

const claims = [
  {
    claim_id: "CLM-CURRENT",
    text: "The current answer discusses the second passage.",
    claim_revision: "claim-r2",
    output_revision: "output-r2",
    evidence: [
      { claim_id: "CLM-CURRENT", claim_revision: "claim-r2", output_revision: "output-r2", source_id: "SRC-1", path: "sources/rule.md", locator: "section 1", available_excerpt: "First passage" },
      { claim_id: "CLM-CURRENT", claim_revision: "claim-r2", output_revision: "output-r2", source_id: "SRC-1", path: "sources/rule.md", locator: "section 2", available_excerpt: "Second passage" },
    ],
  },
  {
    claim_id: "CLM-HISTORICAL",
    text: "The rule defines a child as an individual under 13.",
    claim_revision: "claim-r1",
    output_revision: "output-r1",
    evidence: [
      { claim_id: "CLM-HISTORICAL", claim_revision: "claim-r1", output_revision: "output-r1", source_id: "SRC-1", path: "sources/rule-old.md", locator: "section 1" },
    ],
  },
];
assert.equal(evidenceForSourceMarker([claims[0]], "SRC-1", "section 2")?.available_excerpt, "Second passage", "the same source keeps two exact locator targets distinct");
assert.equal(evidenceForSourceMarker([claims[0]], "SRC-1"), null, "a marker without a locator does not invent one passage");
const sourceOnly = sourceForMarker([claims[0]], "SRC-1");
assert.equal(sourceOnly?.path, "sources/rule.md", "an ambiguous passage retains its unique saved source");
assert.equal(sourceOnly?.locator, undefined, "a source fallback carries no invented applicability or passage");
assert.equal(sourceForMarker(claims, "SRC-1"), null, "current and historical source revisions are not merged");
const versionNeutralSource = sourceForMarker([
  claims[0],
  {
    ...claims[1],
    evidence: [{ ...claims[1].evidence[0], path: "sources/rule.md" }],
  },
], "SRC-1");
assert.equal(versionNeutralSource?.path, "sources/rule.md", "one saved source remains open across passage history");
assert.equal(versionNeutralSource?.source_version, null, "a source-only fallback does not choose one historical version");
const newAnswer = "The file defines Child as an individual under 13. [source:SRC-1|section 1]";
assert.deepEqual(claimsForRenderedText(claims, newAnswer), [], "a new answer cannot inherit an old claim only because source and locator match");
assert.equal(evidenceForSourceMarker(claimsForRenderedText(claims, newAnswer) as never[], "SRC-1", "section 1"), null, "unmatched answer text has no claim-level applicability");
const oldSourceOnly = sourceForMarker([claims[0]], "SRC-1");
assert.equal(oldSourceOnly?.path, "sources/rule.md", "an unmatched claim still permits a source-only saved-document fallback");
assert.equal(oldSourceOnly?.available_excerpt, undefined, "the source-only fallback cannot inherit the old claim excerpt");
const matchingNewClaim = {
  ...claims[0],
  claim_id: "CLM-NEW",
  text: "The file defines Child as an individual under 13.",
  evidence: [{ ...claims[0].evidence[0], claim_id: "CLM-NEW" }],
};
assert.equal(claimsForRenderedText([claims[0], matchingNewClaim], newAnswer)[0]?.claim_id, "CLM-NEW", "the newly published claim binds to its own rendered answer text");

const tree = ClaimMarkdown({ text: "[bad](%E0%A4%A)", documents: [] });
const markdownNode = tree.props.children as ElementNode;
const anchor = (markdownNode.props.components as { a: (props: Record<string, unknown>) => ElementNode }).a;
assert.doesNotThrow(() => anchor({ href: "%E0%A4%A", children: "bad" }), "a malformed encoded link cannot break rendering");
const normalizedReference = (
  workspaceApiModule.normalizeDocumentReferenceTarget as (
    target: Record<string, unknown>,
  ) => { origin: { scroll_offset: number } }
)({
  document_id: "DOC-1",
  path: "sources/rule.md",
  origin: { surface: "evidence", scroll_offset: 219.78125 },
});
assert.equal(normalizedReference.origin.scroll_offset, 220, "fractional browser scroll offsets become valid API integers");
assert.equal(
  (workspaceApiModule.referenceDestination as (document: { kind: string }) => string)({ kind: "work_product" }),
  "editor",
  "a work product reference opens in the editor",
);
assert.equal(
  (workspaceApiModule.referenceDestination as (document: { kind: string }) => string)({ kind: "source" }),
  "preview",
  "a source reference opens in the reading preview",
);
const documentForReferenceTarget = workspaceApiModule.documentForReferenceTarget as (
  documents: Array<Record<string, unknown>>,
  target: Record<string, unknown>,
) => Record<string, unknown> | null;
const sameIdentityDocuments = [
  { document_id: "DOC-SHARED", path: "drafts/answer.md", revision: "draft-r2", kind: "work_product" },
  { document_id: "DOC-SHARED", path: "final/answer.md", revision: "final-r1", kind: "work_product" },
];
assert.equal(
  documentForReferenceTarget(sameIdentityDocuments, {
    document_id: "DOC-SHARED",
    path: "final/answer.md",
    revision: "final-r1",
  })?.path,
  "final/answer.md",
  "an exact final path and revision wins when a draft has the same document ID",
);
assert.equal(documentForReferenceTarget(sameIdentityDocuments, {
  document_id: "WRONG-ID", path: "final/answer.md", revision: "final-r1",
}), null, "a mismatched ID cannot bypass server reference validation");
assert.equal(
  (workspaceApiModule.preferredConversationId as (
    ids: string[],
    requested: string | null,
    intake: string | null,
  ) => string | null)(
    ["CONV-NEWEST-HISTORICAL", "CONV-ACTIVE", "CONV-INTAKE"],
    "CONV-ACTIVE",
    "CONV-INTAKE",
  ),
  "CONV-ACTIVE",
  "a carried non-intake conversation remains active despite newer history",
);
const editorSourcePath = "03_Matters/MAT-1/documents/product-spec.md";
const editorDocuments = [{
  document_id: "DOC-PRODUCT-SPEC",
  path: editorSourcePath,
  revision: "source-r1",
  kind: "source",
}];
const documentForEditorHref = workspaceApiModule.documentForEditorHref as (
  documents: Array<Record<string, unknown>>,
  href: string,
  origin: string,
) => Record<string, unknown> | null;
assert.equal(
  documentForEditorHref(editorDocuments, editorSourcePath, "http://localhost:3123")?.document_id,
  "DOC-PRODUCT-SPEC",
  "an unmodified vault-relative editor link resolves to its saved source identity",
);
assert.equal(
  documentForEditorHref(editorDocuments, `https://${editorSourcePath}`, "http://localhost:3123")?.document_id,
  "DOC-PRODUCT-SPEC",
  "a Lexical browser-normalized vault link still resolves to its saved source identity",
);
assert.equal(
  documentForEditorHref(editorDocuments, "https://example.com/source.md", "http://localhost:3123"),
  null,
  "an actual public URL is not treated as a vault source",
);
const editor = createEditor({ namespace: "matter-review-markdown-link", nodes: [LinkNode], onError: (cause) => { throw cause; } });
const linkedMarkdown = `[Product spec](${editorSourcePath})`;
editor.update(() => { $convertFromMarkdownString(linkedMarkdown, [LINK]); }, { discrete: true });
editor.getEditorState().read(() => {
  assert.equal($convertToMarkdownString([LINK]), linkedMarkdown, "the editor Markdown round trip retains the vault-relative path");
});
const latestReferenceResult = workspaceApiModule.latestReferenceResult as <T>(generation: { current: number }, load: () => Promise<T>) => Promise<T | null>;
let resolveFirst!: (value: string) => void;
let resolveSecond!: (value: string) => void;
const generation = { current: 0 };
const first = latestReferenceResult(generation, () => new Promise<string>((resolve) => { resolveFirst = resolve; }));
const second = latestReferenceResult(generation, () => new Promise<string>((resolve) => { resolveSecond = resolve; }));
resolveSecond("document-b");
assert.equal(await second, "document-b", "the newest reference result is accepted");
resolveFirst("document-a");
assert.equal(await first, null, "a late older reference result cannot replace the newest target");

assert.match(workspaceSource, /onDisposition=\{async \(issueId, command\)[\s\S]*recordIssueDisposition\([\s\S]*command/, "issue dispositions pass the detail form's explicit revision and action key command");
assert.match(workspaceSource, /createMatterWorkItem\(detail\.matter_id, \{[\s\S]*item_type: "mitigation"[\s\S]*status: "open"[\s\S]*required: true[\s\S]*issue_id: mitigationIssueId[\s\S]*Mitigation work saved\. The issue disposition did not change/, "mitigation creates required open work with an explicit issue link and does not resolve the issue");
assert.match(workspaceSource, /const handleEditorSnapshot = useCallback\([\s\S]*\[detail\.matter_id\][\s\S]*onSnapshot=\{handleEditorSnapshot\}/, "the editor snapshot callback remains stable when snapshot state causes a parent render");
assert.match(workspaceSource, /!mitigationDraft\.description\.trim\(\) \|\|[\s\S]*!mitigationDraft\.owner\.trim\(\)/, "required mitigation work cannot be submitted without an owner");
assert.match(workspaceSource, /DocumentNavigator[\s\S]*DocumentTabs[\s\S]*localEdits/, "draft navigation exposes files, tabs, and recoverable local edits");
assert.match(workspaceSource, /latestReferenceResult\([\s\S]*referenceDestination\(resolved\.document\) === "editor"[\s\S]*setReferenceTarget\(null\)/, "the matter opener guards async results and clears preview before showing a work product");
assert.match(workspaceSource, /const returnView = target\.origin\?\.workspace_view \?\? workspaceView[\s\S]*referenceReturnView\.current = returnView[\s\S]*const returnView = origin\.workspace_view \?\? referenceReturnView\.current[\s\S]*setWorkspaceView\(returnView\)/, "source return restores the matter mode captured before preview even if the returned origin loses the extension");
assert.match(workspaceSource, /edge\.relationship === "if"[\s\S]*\)\?\.label/, "issue response options retain the saved condition edge text");
assert.match(panelSource, /actionTargetDocumentId \?\? activeIdentity\?\.document_id/, "agent actions stay frozen to the editable document target");
assert.match(mapPageSource, /getDecisionMap\(matterId\)/, "whole-matter scope starts from the complete saved map");
assert.match(mapPageSource, /claim_output_revisions/, "map claims use the selected issue output revision");
assert.match(mapPageSource, /while \(\["queued", "running"\]\.includes\(run\.state\)\)/, "scenario analysis waits for its durable run result");
assert.match(mapPageSource, /current\.selections\.filter[\s\S]*expected_revision: current\.revision/, "map source context preserves existing selections with the real revision");
assert.match(mapPageSource, /saveWorkProductDraft[\s\S]*working copy/, "map sources can create a real editable working copy");
assert.match(mapPageSource, /id="decision-map-discussion"/, "map discussion has a stable reachable focus target");
assert.match(mapPageSource, /latestReferenceResult\([\s\S]*referenceDestination\(result\.document\) === "editor"/, "the map opener uses the same latest-reference and work-product routing rules");
assert.match(mapPageSource, /key=\{scenarioLaunchKey\}/, "repeating the same assumption remounts a fresh scenario entry form");
assert.match(mapPageSource, /initialConversationId=\{initialConversationId\}/, "map chat uses its validated carried conversation");
assert.match(mapPageSource, /\["conversation", initialConversationId\][\s\S]*const issueBackHref = matterReturnHref\(requestedIssue\)[\s\S]*onBackToIssue[\s\S]*matterReturnHref\(issueId\)/, "both map return controls carry the active validated conversation with the issue");
assert.match(mapPageSource, /onConversationChange=\{\(conversationId\) => \{[\s\S]*setInitialConversationId\(conversationId\)/, "map return links follow a conversation changed while the map stays open");
assert.match(mapPageSource, /preferredConversationId\([\s\S]*requestedConversation,[\s\S]*matter\.intake_conversation_id/, "a valid carried conversation wins and intake is only the fallback");
assert.match(workspaceSource, /conversation=\$\{encodeURIComponent\(currentConversationId\)\}/, "the matter map link carries the active saved conversation");
assert.match(matterPageSource, /searchParams\.get\("issue"\)[\s\S]*initialIssueId=\{initialIssueId\}/, "map return carries the issue ID into the matter workspace");
assert.match(matterPageSource, /getConversations\(matterId\)[\s\S]*preferredConversationId\([\s\S]*requestedConversationId[\s\S]*initialConversationId=\{initialConversationId\}/, "the matter route validates and consumes the returned conversation before mounting chat");
assert.match(workspaceSource, /initialConversationId \?\? detail\.intake_conversation_id/, "matter chat uses the validated returned conversation before intake fallback");
assert.match(workspaceSource, /initialIssueId[\s\S]*setSelectedIssueId\(initialIssueId\)[\s\S]*scrollIntoView[\s\S]*focus\(\)/, "returned issues are selected, scrolled into view, and focused");
assert.match(understandSource, /answerClaims = snapshot\?\.answer_claims \?\? \[\][\s\S]*surface: "current_answer", claims: answerClaims/, "current answers use only claims frozen to that answer revision");
assert.match(workspaceSource, /Research for \{researchIssueTitle\} is[\s\S]*ResearchQueuePanel items=\{researchQueue\} mode="summary"/, "issue research shows its durable queue beside the conversation");
assert.match(draftWorkspaceSource, /hidden=\{!conversationVisible\}/, "the discussion rail hides without unmounting its conversation state");
assert.match(draftWorkspaceSource, /setConversationExpanded\(\(current\) => !current\)[\s\S]*Show discussion/, "the discussion control toggles the retained conversation regardless of its visual position");
assert.match(draftWorkspaceSource, /setConversationExpanded\(props\.view === "discuss"\)/, "Understand defaults to a collapsed discussion and Discuss always exposes it");
assert.match(apiSource, /Math\.round\(offset\)[\s\S]*normalizeDocumentReferenceTarget\(target\)/, "all reference resolution rounds fractional browser scroll offsets at the API boundary");
assert.match(workspaceSource, /referenceDestination\(identity\) === "preview"[\s\S]*openReference/, "selecting a saved source routes through the source preview without changing the draft target");
assert.match(workspaceSource, /function openDocumentIdentity[\s\S]*referenceDestination\(document\) === "preview"[\s\S]*openDocument\(document\.path, reveal\);[\s\S]*return;/, "source navigation does not add the source to editable document tabs before opening its preview");
assert.match(workspaceSource, /function openDocument\([\s\S]*referenceDestination\(identity\) === "preview"[\s\S]*return;[\s\S]*invalidateReferenceResult\(referenceGeneration\);[\s\S]*setReferenceTarget\(null\);[\s\S]*setReferenceDocument\(null\)/, "opening a work product closes any source preview and invalidates its pending request");
assert.match(richEditorSource, /SavedDocumentLinkKeyboardAccess[\s\S]*anchor\.tabIndex = 0[\s\S]*anchor\.dataset\.savedDocumentLink = "true"/, "known saved-document links are focusable inside the editable Lexical surface");
assert.match(richEditorSource, /const focused = document\.activeElement[\s\S]*const anchor = direct \?\? focused[\s\S]*onClickCapture=\{openSavedDocumentLink\}[\s\S]*event\.key === "Enter"\) openSavedDocumentLink\(event\)/, "pointer clicks and Enter use the same source action even when Lexical reports the editor as the key target");
assert.match(workspaceSource, /document-editor-reference__draft[\s\S]*<DocumentPanel[\s\S]*\{referenceTarget \? \([\s\S]*<ReferencePreview/, "source preview is rendered beside the still-mounted editable document");
assert.match(
  workspaceSource,
  /const commitResponse = <T,>[\s\S]*workspaceCommand<MatterFileEntry\[]>\(matterId, "\/files"\)[\s\S]*baseline = await getWorkspace\(matterId\)[\s\S]*setWorkspace\(baseline\)[\s\S]*commitResponse\(templateCommand/,
  "workspace and file requests start first and each successful response commits before optional history",
);
assert.match(
  workspaceSource,
  /const isCurrentRead = \(\) =>[\s\S]*featureRead\.current === readId[\s\S]*const commitResponse = <T,>[\s\S]*\.then\(\(value\) => \{[\s\S]*if \(isCurrentRead\(\)\) commit\(value\)[\s\S]*\.catch\(\(\) => \{[\s\S]*if \(isCurrentRead\(\)\)/,
  "each successful optional response commits independently and stale failures are ignored",
);
assert.doesNotMatch(
  workspaceSource,
  /void getWorkspace\(detail\.matter_id\)/,
  "the matter mount does not start a second unsequenced workspace request",
);
assert.doesNotMatch(
  workspaceSource,
  /loadResearchQueue\(\),\s*refreshWorkspace\(\),\s*loadWorkspaceFeatures\(\)/,
  "chat completion does not request the same workspace twice",
);
assert.match(
  workspaceSource,
  /loadWorkspaceFeatures = useCallback[\s\S]*workspaceReadId = \+\+workspaceRead\.current[\s\S]*isCurrentWorkspaceRead[\s\S]*workspaceRead\.current === workspaceReadId[\s\S]*baseline = await getWorkspace\(matterId\)[\s\S]*if \(!isCurrentWorkspaceRead\(\)\) return[\s\S]*const refreshWorkspace = useCallback[\s\S]*readId = \+\+workspaceRead\.current[\s\S]*workspaceRead\.current === readId[\s\S]*setWorkspace\(saved\)/,
  "initial and post-mutation workspace snapshots share one monotonic response order",
);

// Exercise the staged callback behavior encoded above: one optional failure must
// not block a later document success, and a stale failure must remain silent.
let activeRead = 1;
const optionalCommits: string[] = [];
let optionalFailures = 0;
function commitOptionalLikeWorkspace(
  readId: number,
  request: Promise<string>,
) {
  void request
    .then((value) => {
      if (activeRead === readId) optionalCommits.push(value);
    })
    .catch(() => {
      if (activeRead === readId) optionalFailures += 1;
    });
}
let resolveDocuments!: (value: string) => void;
const documentsResponse = new Promise<string>((resolve) => {
  resolveDocuments = resolve;
});
commitOptionalLikeWorkspace(1, Promise.reject(new Error("history unavailable")));
commitOptionalLikeWorkspace(1, documentsResponse);
await Promise.resolve();
await Promise.resolve();
assert.equal(optionalFailures, 1, "a current optional failure is reported without clearing required data");
assert.deepEqual(optionalCommits, [], "a pending document response is not replaced by the failed optional response");
resolveDocuments("documents loaded");
await documentsResponse;
await Promise.resolve();
assert.deepEqual(optionalCommits, ["documents loaded"], "a successful document response commits after another optional request fails");
commitOptionalLikeWorkspace(1, Promise.reject(new Error("stale history failure")));
activeRead = 2;
await Promise.resolve();
await Promise.resolve();
assert.equal(optionalFailures, 1, "a stale optional rejection cannot add an error to the current matter");

let workspaceRead = 0;
let savedWorkspace = "";
async function commitWorkspaceLikeMatterView(request: Promise<string>) {
  const readId = ++workspaceRead;
  const value = await request;
  if (workspaceRead === readId) savedWorkspace = value;
}
let resolveOldWorkspace!: (value: string) => void;
const oldWorkspace = new Promise<string>((resolve) => {
  resolveOldWorkspace = resolve;
});
const oldLoad = commitWorkspaceLikeMatterView(oldWorkspace);
await commitWorkspaceLikeMatterView(Promise.resolve("new post-save snapshot"));
resolveOldWorkspace("old initial snapshot");
await oldLoad;
assert.equal(
  savedWorkspace,
  "new post-save snapshot",
  "an older initial response cannot replace a newer post-save workspace refresh",
);

console.log("matter review integration checks passed");
