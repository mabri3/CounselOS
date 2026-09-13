import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";

type ElementNode = { type: unknown; props: Record<string, unknown> };
type Component = (props: Record<string, unknown>) => ElementNode | null;

function jsx(type: unknown, props: Record<string, unknown> | null): ElementNode { return { type, props: props ?? {} }; }

function hookRuntime() {
  const values: unknown[] = [];
  let cursor = 0;
  return {
    reset: () => { cursor = 0; },
    module: {
      useState: (initial: unknown) => {
        const index = cursor++;
        if (!(index in values)) values[index] = typeof initial === "function" ? (initial as () => unknown)() : initial;
        return [values[index], (next: unknown) => { values[index] = typeof next === "function" ? (next as (value: unknown) => unknown)(values[index]) : next; }];
      },
      useRef: (initial: unknown) => {
        const index = cursor++;
        if (!(index in values)) values[index] = { current: initial };
        return values[index];
      },
      useEffect: () => undefined,
    },
  };
}

function load(source: string, reactModule: Record<string, unknown>, api: Record<string, unknown>) {
  const module = { exports: {} as Record<string, unknown> & { default?: Component } };
  const output = ts.transpileModule(source, { fileName: "RecordDecisionModal.tsx", compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  runInNewContext(output, {
    exports: module.exports,
    module,
    crypto: { randomUUID: () => "stable-action-key" },
    require: (name: string) => name === "react/jsx-runtime"
      ? { Fragment: "Fragment", jsx, jsxs: jsx }
      : name === "react"
        ? reactModule
        : name === "@/lib/api"
          ? api
          : name === "@/lib/design"
            ? { formatLongDay: (value: string) => value }
            : name === "@/lib/recommendations"
              ? { recommendationNeedsReason: (value: string) => value === "modified" || value === "not_followed" }
              : {},
  });
  return module.exports;
}

function nodes(node: unknown): ElementNode[] {
  if (node === null || node === undefined || typeof node === "boolean") return [];
  if (Array.isArray(node)) return node.flatMap(nodes);
  if (typeof node !== "object") return [];
  const element = node as ElementNode;
  if (typeof element.type === "function") return nodes((element.type as Component)(element.props));
  return [element, ...nodes(element.props.children)];
}

function text(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(text).join("");
  const element = node as ElementNode;
  if (typeof element.type === "function") return text((element.type as Component)(element.props));
  return text(element.props.children);
}

function field(tree: ElementNode, label: string) {
  return nodes(tree).find((node) => (node.type === "input" || node.type === "textarea" || node.type === "select") && node.props["aria-label"] === label)!;
}

function button(tree: ElementNode, label: string) {
  return nodes(tree).find((node) => node.type === "button" && text(node) === label)!;
}

async function click(action: ElementNode) {
  (action.props.onClick as () => void)();
  await new Promise<void>((resolve) => setImmediate(resolve));
}

const source = await readFile(new URL("../components/RecordDecisionModal.tsx", import.meta.url), "utf8");
const detail = { matter_id: "MAT-DEMO", title: "Demo matter", legal_owner: "Alex Morgan", risk_level: "medium" };
const option = { option_id: "OPT-1", option_revision: "option-r1", title: "Launch after the age gate", kind: "conditional_path", condition_summary: "Age must be known before collection.", requirements: [{ condition_id: "COND-1", state: "met" }], combination: "all", consequence: "Collection starts after age routing.", remaining_work: ["Build the gate"], recommendation: "recommended", claim_ids: [], work_item_ids: [] };
const analysis = { schema_version: 1, issue_id: "ISS-1", analysis_id: "AN-1", analysis_revision: "analysis-r1", source_path: "03_Matters/demo/research/paths.md", output_revision: "output-r1", source_revisions: {}, input_basis: { issue: "issue-r1" }, run_id: "RUN-1", display_title: "Age route", explanation: "Age changes the route.", tests: [], conditions: [{ condition_id: "COND-1", question: "Is age known?", assessment: "unknown", assessment_basis: "Not supplied.", fact_ids: [], question_ids: [], claim_ids: [] }], options: [option], warnings: [] };
const mapBasis = { issue_id: "ISS-1", analysis_id: "AN-1", analysis_revision: "analysis-r1", analysis_path: "03_Matters/demo/research/paths.md", output_revision: "output-r1", selected_option_id: "OPT-1", selected_option_revision: "option-r1", canonical_option: option, input_basis: { issue: "issue-r1" } };
const pathPrefill = { map_basis: mapBasis, option, analysis, state: "saved" };

function setup(api: Record<string, unknown>, extra: Record<string, unknown> = {}) {
  const hooks = hookRuntime();
  const Modal = load(source, hooks.module, api).default!;
  let closed = 0;
  let refreshed = 0;
  const props = { detail, suggestion: "Legacy suggestion", basis: ["03_Matters/demo/request.md"], lawyerAuthor: "Alex Morgan", pathPrefill, onClose: () => { closed += 1; }, onRecorded: async () => { refreshed += 1; }, ...extra };
  return { render: () => { hooks.reset(); return Modal(props); }, closed: () => closed, refreshed: () => refreshed };
}

let previewWrites = 0;
const previewSetup = setup({ createDecision: async () => { previewWrites += 1; return { decision_id: "DEC-P" }; }, getDecisions: async () => ({ decisions: [] }), getFile: async () => ({ metadata: {} }) });
let previewTree = previewSetup.render();
(button(previewTree, "Cancel").props.onClick as () => void)();
assert.equal(previewSetup.closed(), 1);
assert.equal(previewWrites, 0, "opening and cancelling a path prefill does not write");

const savedPayloads: Array<Record<string, unknown>> = [];
const savedSetup = setup({
  createDecision: async (payload: Record<string, unknown>) => { savedPayloads.push(payload); return { decision_id: "DEC-1" }; },
  getDecisions: async () => ({ decisions: [{ decision_id: "DEC-1" }] }),
  getFile: async () => ({ metadata: {} }),
});
let tree = savedSetup.render();
assert.equal(field(tree, "Decision").props.value, "Launch after the age gate", "the exact option title prefills the editable decision wording");
assert.match(String(field(tree, "Conditions").props.value), /Age must be known before collection\.[\s\S]*Is age known\? — must be met/, "the option summary and exact requirement prefill conditions");
assert.equal(savedPayloads.length, 0, "opening a path preview does not write");
(field(tree, "Decision").props.onChange as (event: { target: { value: string } }) => void)({ target: { value: "Launch after a verified age gate" } });
tree = savedSetup.render();
assert.match(text(tree), /Your wording differs from the saved path/, "lawyer wording stays separate from the canonical path");
await click(button(tree, "Record durable decision"));
assert.equal(savedPayloads.length, 1, "the final record action performs one write");
assert.equal(savedPayloads[0].chosen_path, "Launch after a verified age gate");
assert.deepEqual(structuredClone(savedPayloads[0].map_basis), { issue_id: "ISS-1", analysis_id: "AN-1", analysis_revision: "analysis-r1", analysis_path: "03_Matters/demo/research/paths.md", output_revision: "output-r1", selected_option_id: "OPT-1", selected_option_revision: "option-r1" }, "the client submits exact identifiers without client-supplied canonical content");
assert.equal(savedSetup.refreshed(), 1);

let cancelledWrites = 0;
const legacySetup = setup({ createDecision: async () => { cancelledWrites += 1; return { decision_id: "DEC-L" }; }, getDecisions: async () => ({ decisions: [] }), getFile: async () => ({ metadata: {} }) }, { pathPrefill: undefined });
tree = legacySetup.render();
assert.equal(field(tree, "Decision").props.value, "Legacy suggestion", "existing callers retain suggestion-based prefill");
(button(tree, "Cancel").props.onClick as () => void)();
assert.equal(legacySetup.closed(), 1);
assert.equal(cancelledWrites, 0, "cancel does not write for existing callers");

const stalePayloads: Array<Record<string, unknown>> = [];
const staleSetup = setup({ createDecision: async (payload: Record<string, unknown>) => { stalePayloads.push(payload); return { decision_id: "DEC-H" }; }, getDecisions: async () => ({ decisions: [{ decision_id: "DEC-H" }] }), getFile: async () => ({ metadata: {} }) }, { pathPrefill: { ...pathPrefill, state: "needs_review" } });
tree = staleSetup.render();
assert.equal(button(tree, "Record durable decision").props.disabled, true, "a stale path requires an explicit historical-basis choice");
const historyChoice = nodes(tree).find((node) => node.type === "input" && node.props.type === "checkbox")!;
(historyChoice.props.onChange as (event: { target: { checked: boolean } }) => void)({ target: { checked: true } });
tree = staleSetup.render();
await click(button(tree, "Record durable decision"));
assert.equal((stalePayloads[0].map_basis as Record<string, unknown>).use_historical_basis, true, "the historical override is sent only after the explicit choice");

const uncertainPayloads: Array<Record<string, unknown>> = [];
let uncertainAttempt = 0;
const uncertainSetup = setup({
  createDecision: async (payload: Record<string, unknown>) => { uncertainPayloads.push(structuredClone(payload)); uncertainAttempt += 1; if (uncertainAttempt === 1) throw new Error("Counsel OS cannot reach the local service. Retry."); return { decision_id: "DEC-U" }; },
  getDecisions: async () => ({ decisions: [{ decision_id: "DEC-U" }] }),
  getFile: async () => ({ metadata: {} }),
});
tree = uncertainSetup.render();
await click(button(tree, "Record durable decision"));
tree = uncertainSetup.render();
assert.equal(field(tree, "Decision").props.disabled, true, "lawyer fields stay frozen while the save result is uncertain");
assert.equal(button(tree, "Cancel").props.disabled, true, "closing cannot discard the only safe retry key while the save result is uncertain");
await click(button(tree, "Retry recording"));
assert.equal(uncertainPayloads.length, 2);
assert.deepEqual(uncertainPayloads[1], uncertainPayloads[0], "an uncertain retry reuses the complete frozen payload and source action key");

let refreshCreateCount = 0;
let registerAttempt = 0;
const refreshSetup = setup({
  createDecision: async () => { refreshCreateCount += 1; return { decision_id: "DEC-R" }; },
  getDecisions: async () => { registerAttempt += 1; if (registerAttempt === 1) throw new Error("Refresh failed"); return { decisions: [{ decision_id: "DEC-R" }] }; },
  getFile: async () => ({ metadata: {} }),
});
tree = refreshSetup.render();
await click(button(tree, "Record durable decision"));
tree = refreshSetup.render();
assert.match(text(tree), /Decision saved\. Refresh confirmation is still needed\./);
await click(button(tree, "Retry refresh"));
assert.equal(refreshCreateCount, 1, "a saved decision retries confirmation without a second write");

let conflictPayload: Record<string, unknown> | null = null;
const conflictSetup = setup({ createDecision: async (payload: Record<string, unknown>) => { conflictPayload = payload; throw Object.assign(new Error("Decision map basis conflict: analysis changed"), { status: 409, detail: { code: "stale_basis" } }); }, getDecisions: async () => ({ decisions: [] }), getFile: async () => ({ metadata: {} }) });
tree = conflictSetup.render();
(field(tree, "Rationale").props.onChange as (event: { target: { value: string } }) => void)({ target: { value: "The launch team can support this route." } });
tree = conflictSetup.render();
await click(button(tree, "Record durable decision"));
tree = conflictSetup.render();
assert.equal(field(tree, "Rationale").props.value, "The launch team can support this route.", "a conflict preserves unsaved lawyer text");
assert.match(text(tree), /Decision map basis conflict/);
assert.equal(button(tree, "Record durable decision").props.disabled, true, "a submit-time basis conflict requires an explicit historical-basis choice");
assert.ok(nodes(tree).some((node) => node.type === "input" && node.props.type === "checkbox"), "the conflict exposes the historical-basis choice even when the path opened as saved");
assert.ok(conflictPayload);

const validationSetup = setup({ createDecision: async () => { throw Object.assign(new Error("Decision maker is invalid"), { status: 422, detail: [{ msg: "Decision maker is invalid" }] }); }, getDecisions: async () => ({ decisions: [] }), getFile: async () => ({ metadata: {} }) });
tree = validationSetup.render();
(field(tree, "Rationale").props.onChange as (event: { target: { value: string } }) => void)({ target: { value: "Retain this draft" } });
tree = validationSetup.render();
await click(button(tree, "Record durable decision"));
tree = validationSetup.render();
assert.equal(field(tree, "Rationale").props.disabled, false, "a definite validation rejection unlocks the retained form for correction");
assert.equal(field(tree, "Rationale").props.value, "Retain this draft");

const keyConflictSetup = setup({ createDecision: async () => { throw Object.assign(new Error("This action key was already used for a different request."), { status: 409, detail: { code: "action_key_conflict" } }); }, getDecisions: async () => ({ decisions: [] }), getFile: async () => ({ metadata: {} }) });
tree = keyConflictSetup.render();
await click(button(tree, "Record durable decision"));
tree = keyConflictSetup.render();
assert.equal(field(tree, "Decision").props.disabled, true, "an action-key conflict keeps the original request frozen");
assert.equal(nodes(tree).filter((node) => node.type === "input" && node.props.type === "checkbox").length, 0, "an action-key conflict does not offer a different historical-basis write");

console.log("Decision path recording checks passed.");
