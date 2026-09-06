import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [library, editor, types, toolStyles] = await Promise.all([
  readFile(new URL("../components/workspace/OutputTemplateLibrary.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/OutputTemplateEditor.tsx", import.meta.url), "utf8"),
  readFile(new URL("../lib/workspaceTypes.ts", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/MatterTools.module.css", import.meta.url), "utf8"),
]);

assert.match(library, /new Set\(templates\.map/, "the library must show output types from actual template records");
assert.match(library, /Create blank template[\s\S]*Make a copy[\s\S]*Set as default/, "create, duplicate, and default controls must be reachable");
assert.match(library, /Edit or rename/, "template names must be editable through the real editor flow");
assert.match(library, /selectedTemplateId && !selected[\s\S]*Unavailable/, "a missing selected template must remain visible");
assert.match(library, /isUnavailable\(selected\)/, "disabled and malformed templates must remain visible and unusable");
assert.match(library, /selected\.failure_detail/, "an unavailable template must show its supplied failure reason");
assert.match(library, /await onPreview\(selected, overrides\)/, "preview must use the supplied real generation callback");
assert.match(library, /if \(result\.artifact\) return \{ label: "Editable preview"[\s\S]*runningPreviewStates\.has\(state\)[\s\S]*label: "Preparing"/, "only queued preview work may use Preparing while artifacts are labeled editable");
assert.match(library, /runningPreviewStates\.has\(state\)/, "only an active preview state may be labeled Preparing");
assert.match(library, /state === "not_saved" \? "Not saved"[\s\S]*state === "failed" \? "Failed"/, "failed and not-saved previews need final state labels");
assert.match(library, /result\.receipt\?\.failure_detail/, "preview failure detail must remain visible when supplied");
assert.match(library, /noticeFailed \? "template-action-failure" : "template-notice"/, "failed preview feedback must use the failure role");
assert.doesNotMatch(library, /editable draft will appear when generation finishes/i, "a failed preview must not promise that an artifact will appear");
assert.match(library, /Open editable preview/, "a saved preview artifact must open in the real editor");
assert.match(library, /not approval/, "a finished preview must be labeled as unapproved");
assert.match(library, /These values do not change the reusable template/, "run overrides must remain separate from saved defaults");
assert.match(library, /const actionIdentity = `\$\{selected\.template_id\}:\$\{selected\.revision\}`[\s\S]*const actionGeneration = selectionGeneration\.current[\s\S]*if \(!stillSelected\(\)\) return; setPreview/, "a late preview result must not attach to another selected template");
assert.match(library, /finally \{ if \(stillSelected\(\)\) setPending/, "a late library action must not clear another template's pending state");

assert.match(editor, /MarkdownRichEditor[\s\S]*MarkdownRichEditor/, "instructions and the Markdown outline must reuse the existing editor");
for (const field of ["audience", "purpose", "tone", "length", "exclusions", "source_presentation", "sample_wording"]) {
  assert.match(editor, new RegExp(field), `the editor must expose ${field}`);
}
assert.match(editor, /heading order/, "the Markdown outline must explain heading order");
assert.match(editor, /Save reusable template/, "saving reusable instructions must be explicit");
assert.match(editor, /onSave\(submitted, baseRevision\)/, "template edits must carry the editor's expected revision");
assert.match(editor, /if \(dirty\) setStaleRevision/, "an incoming version must not replace local edits");
assert.match(editor, /Your edits are retained|Your template edits/, "failed work must retain edited values");
assert.match(editor, /onPreview\(savedTemplate, overrides\)/, "preview must use a saved immutable template identity and separate overrides");
assert.match(editor, /disabled=\{busy \|\| !!pending \|\| dirty/, "unsaved template guidance must be saved before preview");
assert.match(editor, /draftRef\.current === submitted/, "edits made while a save is pending must not be replaced by the save response");
assert.match(editor, /saved\.enabled === false \? `Reusable template saved as version \$\{saved\.revision\}\. It is disabled and is not available for future draft requests\.` : `Reusable template saved as version \$\{saved\.revision\}\. Future requests can use it\.`/, "a disabled saved template must not claim that future draft requests can use it");
assert.match(editor, /const actionTemplateId = template\.template_id[\s\S]*const actionGeneration = editorGeneration\.current[\s\S]*await onSave\(submitted, baseRevision\); if \(!stillEditingSubmittedTemplate\(\)\) return; setSavedTemplate/, "an A save that finishes after selecting B must not change B's saved identity");
assert.match(editor, /await onPreview\(savedTemplate, overrides\); if \(!stillEditingSubmittedTemplate\(\)\) return; setPreview/, "an A preview that finishes after selecting B must not appear on B");
assert.match(editor, /finally \{ if \(stillEditingSubmittedTemplate\(\)\) setPending/, "a stale editor continuation must not clear the new template's pending state");
assert.match(editor, /noticeFailed \? "editor-action-failure" : "editor-notice"/, "failed editor previews must use the failure role");
assert.match(editor, /revision_path/, "the current immutable revision record must be inspectable");
assert.match(types, /TemplatePreviewCallback[\s\S]*Promise<DraftResult>/, "preview must return a real run or artifact result");
assert.match(types, /status\?: string;[\s\S]*failure_detail\?: string \| null;[\s\S]*template_id/, "malformed template state must be part of the shared contract");

for (const source of [library, editor]) {
  assert.match(source, /import styles from "\.\/MatterTools\.module\.css"/);
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "template UI must use shared semantic color tokens");
  assert.match(toolStyles, /@media \(max-width:/, "template UI must adapt to a small screen");
  assert.match(toolStyles, /prefers-reduced-motion/, "template UI must respect reduced motion");
}

console.log("Output template checks passed.");
