import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import type { VaultDocument } from "../lib/types.ts";

const root = resolve(import.meta.dirname, "..");
const evidence = readFileSync(resolve(root, "components/workspace/EvidenceDrawer.tsx"), "utf8");
const context = readFileSync(resolve(root, "components/workspace/ContextTray.tsx"), "utf8");
const files = readFileSync(resolve(root, "components/workspace/MatterFilesPanel.tsx"), "utf8");
const researchSource = readFileSync(resolve(root, "lib/research.ts"), "utf8")
  .replace(/import type \{[^;]+\} from "\.\/types\.ts";\n/, "")
  .replace(/import \{ formatDateTime \} from "\.\/design\.ts";\n/, "const formatDateTime = (value: string) => value;\n");
const research = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(researchSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText).toString("base64")}`) as typeof import("../lib/research.ts");
const uploadHelpersSource = files.slice(files.indexOf("export function uploadState"), files.indexOf("export default function MatterFilesPanel"));
const uploadHelpers = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(uploadHelpersSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText).toString("base64")}`) as Pick<typeof import("../components/workspace/MatterFilesPanel.tsx"), "normalizeUpload" | "uploadState">;

const memo = research.parseMemo({
  path: "03_Matters/demo/research/RES-1.md", name: "RES-1.md", kind: "markdown", editable: true, metadata: {},
  content: [
    "# Research", "", "A claim [2]. Another [source:SRC-REAL].", "", "## Sources surfaced",
    "- Future label: missing source adapter output", // still owns numeric position 1
    "- Retrieved: [Actual rule](https://example.test/rule) [source:SRC-REAL]",
    "  Available excerpt:", "  > --- matter_id: MAT-DEMO-BEACON", "  > record_type: matter",
    "- Verified: [Unsafe](javascript:alert(1)) [source:SRC-UNSAFE] — literal text",
    "- Unverified: `../../outside.md` [source:SRC-PATH] — literal saved lead",
  ].join("\n"),
} as VaultDocument);

assert.equal(memo.citations[0].n, "2", "an unknown source row must keep its ordinal and must not rebind [2]");
assert.equal(memo.citations[0].id, "SRC-REAL", "structured source IDs must remain stable");
assert.equal(memo.citations[0].quote, "--- matter_id: MAT-DEMO-BEACON\nrecord_type: matter", "available passages must remain exact source text");
assert.doesNotMatch(memo.citations[0].quote, /saved facts and assumptions/i, "the parser must never replace source bytes with a generated description");
assert.equal(memo.citations[1].n, "3");
assert.doesNotMatch(memo.citations[1].kind, /javascript:/i, "unsafe public URLs must not become links");
assert.match(memo.citations[2].note, /unsafe and was blocked/i, "traversal paths must be blocked and explained");
assert.deepEqual(research.splitCitations("A [2] and [source:SRC-REAL]."), [
  { text: "A " }, { citation: "2" }, { text: " and " }, { citation: "SRC-REAL" }, { text: "." },
]);
assert.equal(research.isSafeSourceUrl("https://example.test/a"), true);
assert.equal(research.isSafeSourceUrl("javascript:alert(1)"), false);
assert.equal(research.isSafeVaultPath("03_Matters/demo/source.txt"), true);
assert.equal(research.isSafeVaultPath("03_Matters/demo/../../private.txt"), false);

const malformedFirst = research.parseMemo({
  path: "03_Matters/demo/research/RES-2.md", name: "RES-2.md", kind: "markdown", editable: true, metadata: {},
  content: ["# Research", "", "Claim [1].", "", "## Sources", "- Broken source row without colon", "- Retrieved: [Second](https://example.com) — second passage"].join("\n"),
} as VaultDocument);
assert.equal(malformedFirst.citations.length, 1, "a malformed source row must not create invented evidence");
assert.equal(malformedFirst.citations[0].n, "2", "the valid second source must keep source-list ordinal 2");
assert.equal(malformedFirst.citations[0].id, "s2", "a missing first source must not take or collide with the second source fallback ID");
assert.equal(malformedFirst.citations.some((citation) => citation.n === "1" || citation.id === "s1"), false, "citation [1] must remain unbound when its source row is malformed");

const uploadInputs = [{ name: "good.txt" }, { name: "partial.pdf" }, { name: "bad.exe" }] as File[];
const mixedUpload = uploadHelpers.normalizeUpload({ destination: "inquiry", outcomes: [
  { name: "good.txt", state: "saved", retry_key: "good", file: null },
  { name: "partial.pdf", state: "partial", retry_key: "partial", failure_detail: "Page 2 could not be read.", file: null },
  { name: "bad.exe", state: "failed", retry_key: "bad", failure_detail: "Unsupported file type.", file: null },
] }, uploadInputs);
assert.deepEqual(mixedUpload.map((outcome) => outcome.state), ["saved", "partial", "failed"], "mixed upload outcomes must stay distinct per file");
assert.equal(uploadHelpers.uploadState(mixedUpload).word, "Partial", "mixed success, partial extraction, and failure must not claim the whole batch was saved or failed");
assert.equal(mixedUpload[2].input, uploadInputs[2], "the failed outcome must retain its exact File object for retry");
assert.equal(uploadHelpers.uploadState(uploadHelpers.normalizeUpload(undefined, uploadInputs)).word, "Completed", "a legacy void callback may report completion without inventing per-file saved states");

assert.match(evidence, /Exact available passage[\s\S]*Generated explanation/, "exact passages and generated explanations must use separate labelled regions");
assert.match(evidence, /Retrieved[\s\S]*Unknown/, "source status and unknown retrieval dates must be explicit");
assert.match(evidence, /Opening a link does not verify the source/, "opening a source must not imply verification");
assert.match(evidence, /event\.key === "Escape"[\s\S]*event\.key !== "Tab"/, "the evidence drawer must close with Escape and trap keyboard focus");
assert.match(evidence, /isSafeSourceUrl[\s\S]*isSafeVaultPath/, "evidence actions must block unsafe URLs and paths");

assert.match(context, /Next inquiry[\s\S]*Submitted context/, "next selection and an immutable submitted manifest must be distinct");
assert.match(context, /Included in this run[\s\S]*Included in part[\s\S]*Omitted from this run[\s\S]*Unavailable for this run/, "manifest states must be honest");
assert.match(context, /Business question[\s\S]*Current facts[\s\S]*Company context[\s\S]*Selected passage[\s\S]*Applied note[\s\S]*Relevant conversation history[\s\S]*Lawyer contribution/, "non-file context roles must be visible");
assert.match(context, /setDirty\(true\)[\s\S]*onChange\(draft\)/, "a failed context change must retain and retry the same pending selection");
assert.match(context, /does not delete the saved file/, "context removal must explain that it does not delete the file");
assert.doesNotMatch(context, /onDelete|deleteFile|removeFile/, "context selection must not expose a deletion action");

assert.match(files, /multiple[\s\S]*Add files to library[\s\S]*Add files to inquiry/, "F1: picker uploads must accept multiple files with explicit destinations");
assert.match(files, /setBatches\(\(current\) => \[\.\.\.current, \{ id, destination, outcomes:/, "F1: a second batch must add to pending batches");
assert.match(files, /Find by name or folder[\s\S]*Folder view[\s\S]*Open original[\s\S]*Open extracted text[\s\S]*Open generated output/, "F2: the library must support search, folder view, and both preview forms");
assert.match(files, /existing[\s\S]*selected: !selected[\s\S]*<ContextTray[\s\S]*manifest=\{manifest\}/, "F3: selection must be separate from stored files and run manifests");
assert.match(files, /result\.outcomes\[index\][\s\S]*No result was returned for this file/, "F4: each uploaded file must use its actual returned outcome");
assert.match(files, /failed \|\| partial[\s\S]*word: "Partial"/, "F4: a mixed or partially extracted batch must have a Partial summary");
assert.match(files, /outcome\.state === "saved"[\s\S]*Saved · Partial text[\s\S]*Not saved/, "F4: each file must distinguish saved, partial, and not-saved outcomes");
assert.match(files, /outcome\.failure_detail/, "F4: extraction and upload failure reasons must remain visible per file");
assert.match(files, /onUpload\(\[outcome\.input\], batch\.destination\)/, "F4: retry must resend the retained failed File object to the same destination");
assert.match(files, /Retry \{outcome\.name\}[\s\S]*Retry preview/, "F4: upload and extraction failures must remain retryable");
assert.doesNotMatch(files, /await onUpload\([^;]+;\s*setBatches\([^\n]+state: "saved"/, "a resolved upload callback must not mark a mixed batch saved without reading its outcomes");
assert.match(files, /same pending selection|choice is retained|local selection is intentionally retained/, "F4: failed selection updates must retain local state");
assert.match(files, /event\.key === "Escape"[\s\S]*event\.key !== "Tab"/, "the combined panel must close with Escape and trap focus");

for (const source of [evidence, context, files]) assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "workspace evidence UI must use shared semantic color tokens");
console.log("Workspace evidence and context checks passed.");
