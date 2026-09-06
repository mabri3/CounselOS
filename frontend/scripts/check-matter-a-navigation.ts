import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

type Node = { type: unknown; props: Record<string, unknown> };
const jsx = (type: unknown, props: Record<string, unknown>) => ({ type, props });
const iconModule = { exports: {} };
runInNewContext(ts.transpileModule(readFileSync(new URL("../components/workspace/MatterIcon.tsx", import.meta.url), "utf8"), {
  fileName: "MatterIcon.tsx", compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText, { exports: iconModule.exports, require: (name: string) => { assert.equal(name, "react/jsx-runtime"); return { jsx, jsxs: jsx }; } });
const source = readFileSync(new URL("../components/workspace/MatterSectionNav.tsx", import.meta.url), "utf8");
const module = { exports: {} as { default: (props: Record<string, unknown>) => Node } };
runInNewContext(ts.transpileModule(source, {
  fileName: "MatterSectionNav.tsx",
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, { module, exports: module.exports, require: (name: string) => {
  if (name === "react/jsx-runtime") return { jsx, jsxs: jsx, Fragment: "Fragment" };
  if (name === "./MatterIcon") return iconModule.exports;
  if (name.endsWith(".module.css")) return {};
  throw new Error(`Unexpected dependency in presentation-only section navigation: ${name}`);
} });
function flatten(value: unknown): Node[] {
  if (Array.isArray(value)) return value.flatMap(flatten);
  if (!value || typeof value !== "object") return [];
  const node = value as Node;
  return [node, ...flatten(node.props?.children)];
}
function text(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(text).join("");
  if (!value || typeof value !== "object") return "";
  return text((value as Node).props?.children);
}
const entries = Object.freeze([
  { id: "matter-A-evidence", label: "Evidence and question history" },
  { id: "matter-A-explore", label: "Explore and business flow" },
  { id: "matter-A-materials", label: "Materials and activity" },
]);
const calls: string[] = [];
const tree = module.exports.default({ entries, onReveal: (id: string) => calls.push(id) });
assert.equal(calls.length, 0, "rendering the section index must not execute an action");
const buttons = flatten(tree).filter(node => node.type === "button");
assert.equal(buttons.length, entries.length, "every supplied destination gets exactly one native button");
for (const [index, button] of buttons.entries()) {
  assert.equal(button.props.type, "button", "section navigation must not submit an enclosing form");
  assert.ok(text(button).includes(entries[index].label), "each destination retains its full supplied label");
  (button.props.onClick as () => void)();
  assert.equal(calls.length, index + 1, "one click must invoke reveal exactly once");
  assert.equal(calls[index], entries[index].id, "reveal receives the exact stable matter destination ID");
}
assert.deepEqual(entries.map(e => e.id), ["matter-A-evidence", "matter-A-explore", "matter-A-materials"], "navigation must not mutate its supplied entries");
console.log("Matter A section navigation behavior checks passed.");

const workspaceSource = readFileSync(new URL("../components/MatterWorkspace.tsx", import.meta.url), "utf8");
const workspaceAst = ts.createSourceFile("MatterWorkspace.tsx", workspaceSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let revealSource = "";
function findReveal(node: import("typescript").Node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(workspaceAst) === "revealMatterSection" && node.initializer && ts.isCallExpression(node.initializer)) revealSource = node.initializer.arguments[0].getText(workspaceAst);
  ts.forEachChild(node, findReveal);
}
findReveal(workspaceAst);
assert.ok(revealSource, "test the actual integration callback");
for (const destination of ["evidence", "explore", "reuse", "work", "materials"]) {
  const events: string[] = [];
  class Details {
    parentElement: any;
    private opened = false;
    set open(value: boolean) { this.opened = value; events.push("open"); }
    get open() { return this.opened; }
  }
  const root = { contains: (value: unknown) => value === target };
  const ancestor = new Details(); ancestor.parentElement = root;
  const children = [new Details(), new Details()];
  const nestedClosed = new Details();
  const nestedOpen = new Details(); nestedOpen.open = true;
  const focusTarget = { tagName: "SUMMARY", hasAttribute: () => false, focus: () => events.push("focus") };
  const target = Object.assign(destination === "explore" ? {} : new Details(), {
    parentElement: ancestor,
    children,
    querySelector: () => focusTarget,
    querySelectorAll: (selector: string) => selector === ":scope > details" ? children : [...children, nestedClosed, nestedOpen],
    scrollIntoView: (options: { behavior: string }) => { assert.equal(options.behavior, "auto", "new section jumps must not force animation for reduced motion"); events.push("scroll"); },
  });
  let frame: (() => void) | null = null;
  let activeSection: string | null = null;
  const sandbox = {
    detail: { matter_id: "A" }, HTMLDetailsElement: Details,
    setActiveSection: (section: string) => { activeSection = section; },
    document: { getElementById: (id: string) => id === "matter-A" ? root : id === `matter-A-${destination}` ? target : null },
    window: { requestAnimationFrame: (fn: () => void) => { frame = fn; }, scrollTo: (options: { top: number; behavior: string }) => { assert.equal(options.top, 0); assert.equal(options.behavior, "auto"); events.push("scroll"); } },
    reveal: null as any,
  };
  runInNewContext(ts.transpileModule(`reveal = ${revealSource};`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText, sandbox);
  sandbox.reveal(`matter-A-${destination}`);
  assert.equal(activeSection, destination, "the selected section becomes the page surface");
  assert.equal(ancestor.open, true, "closed ancestors must open before focus");
  if (destination === "explore") {
    assert.ok(children.every(child => child.open), "both direct exploration disclosures must open");
    assert.equal(nestedClosed.open, false, "section navigation must not expand nested fact correction or scenario details");
    assert.equal(nestedOpen.open, true, "section navigation must preserve already-open nested disclosures");
  }
  else assert.equal((target as Details).open, true);
  assert.ok(!events.includes("focus"), "focus waits until the disclosure layout can update");
  assert.ok(frame); (frame as () => void)();
  assert.deepEqual(events.slice(-2), ["focus", "scroll"]);
  const count = events.length;
  sandbox.reveal("matter-OTHER-materials");
  assert.equal(activeSection, destination, "another matter cannot change the active page");
  assert.equal(events.length, count, "another matter cannot be revealed");
}
console.log("Matter A integration reveals closed ancestors before focus and scroll.");
