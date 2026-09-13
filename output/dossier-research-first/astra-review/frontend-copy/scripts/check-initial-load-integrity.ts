import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

const status = read("../components/DataLoadStatus.tsx");
assert.match(status, /role="status"/, "load feedback must use a status live region");
assert.match(status, /aria-live="polite"/, "load feedback must announce without interrupting the lawyer");
assert.match(status, /aria-atomic="true"/, "the complete load message must be announced");
assert.match(status, /aria-busy=\{busy\}/, "the live region must expose its busy state");
assert.match(status, /retryingLabel = "Retrying…"/, "Retry must announce that another read is running");
assert.match(status, />\s*Retry\s*</, "a failed read must offer Retry");
assert.match(status, /await onRetry\(\)/, "Retry must invoke only the supplied read callback");

const surfaces = {
  today: read("../app/page.tsx"),
  workspace: read("../app/workspace/page.tsx"),
  briefing: read("../components/BriefingWorkspace.tsx"),
  matter: read("../app/matters/[matterId]/page.tsx"),
  decisions: read("../app/decisions/page.tsx"),
  skills: read("../components/SkillBuilder.tsx"),
  agents: read("../app/agents/page.tsx"),
  settings: read("../app/settings/page.tsx"),
  watches: read("../app/watches/page.tsx"),
  watchList: read("../components/WatchList.tsx"),
  watchBuilder: read("../components/WatchBuilder.tsx"),
};

for (const [name, source] of Object.entries(surfaces).filter(([name]) => name !== "watches")) {
  assert.match(source, /DataLoadStatus/, `${name} must use the shared load feedback`);
}

for (const name of ["today", "workspace", "briefing", "matter", "decisions", "skills", "agents", "settings", "watches", "watchBuilder"] as const) {
  const source = surfaces[name];
  assert.match(source, /const \[loading, setLoading\] = useState\(true\)/, `${name} must identify the initial read as loading`);
  assert.match(source, /const \[loadError, setLoadError\] = useState\(""\)/, `${name} must keep read failures separate from action failures`);
  assert.match(source, /onRetry=\{load\}/, `${name} Retry must call its read-only loader`);
  assert.doesNotMatch(source, /finally\s*\{\s*setLoaded\(true\)/, `${name} must not call a failed initial read loaded`);
}

assert.match(surfaces.today, /\{loaded \? \(\s*<div className=\{styles.flow\}>/, "Today must gate briefing claims on a successful read");
assert.match(surfaces.today, /\{loaded \? <div className=\{styles.flow\}/, "Today must not mount creation or chat before its first successful read");
assert.match(surfaces.workspace, /\{loaded \? <>[\s\S]*<StageBoard/, "Workspace must gate its board and counts on a successful read");
assert.doesNotMatch(surfaces.briefing, /setItems\(null\)/, "Briefing must retain its last useful list during refresh and retry");
assert.match(surfaces.briefing, /\{items \? <>[\s\S]*<BriefingItemList/, "Briefing must not show empty rails before its first successful read");
assert.match(surfaces.matter, /if \(!detail\)[\s\S]*<DataLoadStatus/, "Matter detail must show load feedback before orientation data exists");
assert.match(surfaces.decisions, /\{loaded \? \(\s*<div[^>]*><DecisionTable/, "Decisions must not render an empty register before a successful read");
assert.match(surfaces.skills, /if \(!loaded\)[\s\S]*<DataLoadStatus/, "Skills must not render its empty state before a successful read");
assert.match(surfaces.agents, /<DataLoadStatus[\s\S]*\{loaded \? \([\s\S]*No agents are defined/, "Agents must not render its empty state before a successful read");
assert.match(surfaces.settings, /if \(!settings \|\| !company \|\| !vault \|\| !answerContract\)[\s\S]*<DataLoadStatus/, "Settings must not render partial settings as ready");
assert.match(surfaces.watchList, /watches\?\.length === 0/, "Watches must claim emptiness only after an empty result exists");
assert.match(surfaces.watchBuilder, /if \(!loaded\)[\s\S]*<DataLoadStatus/, "Watch Builder must wait for provider and Watch reads before showing the form");

console.log("Initial-load integrity source checks passed.");

// Render the actual page on either side of midnight. Static HTML and the first
// browser render must agree even when they use different clocks.
const React = await import("react");
const { renderToString } = await import("react-dom/server");
const { createRequire } = await import("node:module");
const { runInNewContext } = await import("node:vm");
const ts = await import("typescript");
const { formatLongDate } = await import("../lib/design.ts");
const localRequire = createRequire(import.meta.url);
const compiledToday = ts.transpileModule(surfaces.today, { fileName: "page.tsx", compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
function renderTodayAt(stamp: number) {
  class PageDate extends Date { constructor(value?: string | number) { super(value ?? stamp); } static now() { return stamp; } }
  const pageModule = { exports: {} as { default: React.ComponentType } };
  runInNewContext(compiledToday, { exports: pageModule.exports, Date: PageDate, require: (id: string) => {
    if (id === "react" || id === "react/jsx-runtime") return localRequire(id);
    if (id === "next/navigation") return { useRouter: () => ({}) };
    if (id === "@/lib/continuityApi") return { useContinuityIdentity: () => ({ identity: null, error: "" }) };
    if (id === "@/lib/design") return { formatLongDate };
    if (id === "@/lib/briefing") return { buildBriefing: () => ({ items: [], comingUp: [] }) };
    if (id === "@/components/AppShell") return ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children);
    if (id.startsWith("@/components/") || id === "next/link") return () => null;
    return {};
  } });
  return renderToString(React.createElement(pageModule.exports.default));
}
const beforeMidnight = new Date(2026, 8, 4, 23, 59).getTime();
const afterMidnight = new Date(2026, 8, 5, 0, 1).getTime();
assert.equal(renderTodayAt(beforeMidnight), renderTodayAt(afterMidnight), "Today static HTML and first browser render must not disagree across midnight");
assert.doesNotMatch(surfaces.today, /suppressHydrationWarning/, "the date source must be fixed rather than hiding the mismatch");
const todayAst = ts.createSourceFile("page.tsx", surfaces.today, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let dateEffect = "";
function findDateEffect(node: import("typescript").Node) {
  if (ts.isCallExpression(node) && node.expression.getText(todayAst) === "useEffect" && node.arguments[0]?.getText(todayAst).includes("setToday")) dateEffect = node.arguments[0].getText(todayAst);
  ts.forEachChild(node, findDateEffect);
}
findDateEffect(todayAst); assert.ok(dateEffect, "the browser date must be set after the initial render");
let shownDate = "";
class BrowserDate extends Date { constructor() { super(afterMidnight); } }
const effectModule = { exports: {} as { updateDate: () => void } };
runInNewContext(ts.transpileModule(`export const updateDate = ${dateEffect}`, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: effectModule.exports, Date: BrowserDate, formatLongDate, setToday: (value: string) => { shownDate = value; } });
effectModule.exports.updateDate();
assert.equal(shownDate, formatLongDate(new Date(afterMidnight)), "the mounted page must show the current browser date");
console.log("Today initial render remains stable across midnight; its effect shows the browser date.");

const workspaceSource = read("../components/MatterWorkspace.tsx");
const workspaceAst = ts.createSourceFile("MatterWorkspace.tsx", workspaceSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let settingsEffect = "";
function findSettingsEffect(node: import("typescript").Node) {
  if (ts.isCallExpression(node) && node.expression.getText(workspaceAst) === "useEffect" && node.arguments[0]?.getText(workspaceAst).includes("getSettings(")) settingsEffect = node.arguments[0].getText(workspaceAst);
  ts.forEachChild(node, findSettingsEffect);
}
findSettingsEffect(workspaceAst);
assert.ok(settingsEffect, "the matter must load document review settings");
for (const unmount of [false, true]) {
  const errors: string[] = [];
  const effectModule = { exports: {} as { load: () => () => void } };
  runInNewContext(ts.transpileModule(`export const load = ${settingsEffect}`, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
    exports: effectModule.exports,
    getSettings: (options: { includeModelCatalog: boolean }) => {
      assert.equal(options.includeModelCatalog, false, "document review settings must not probe model providers");
      return Promise.reject(new Error("The request timed out."));
    },
    setReviewSettings: () => assert.fail("failed settings must not overwrite review settings"),
    setError: (message: string) => errors.push(message),
  });
  const cleanup = effectModule.exports.load();
  if (unmount) cleanup();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(errors.length, unmount ? 0 : 1, "settings failures must be handled in the mounted page only");
}
console.log("Matter settings failures remain handled, including after unmount.");

assert.match(workspaceSource, /loading=\{workspaceLoading\}/, "Understand must receive its actual read state");
assert.match(workspaceSource, /error=\{workspaceLoadError\}/, "Understand must show failed reads instead of an empty state");
const featuresMatch = workspaceSource.match(/const loadWorkspaceFeatures = useCallback\((async \(\) => \{[\s\S]*?)\}, \[detail\.matter_id\]\);/);
assert.ok(featuresMatch);
const failures: string[] = [];
const loadStates: boolean[] = [];
const featureModule = { exports: {} as { load: () => Promise<void> } };
runInNewContext(ts.transpileModule(`export const load = ${featuresMatch[1]}}`, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
  exports: featureModule.exports,
  featureRead: { current: 0 }, workspaceRead: { current: 0 },
  detail: { matter_id: "MAT-1" }, currentMatterRef: { current: "MAT-1" },
  workspaceCommand: () => Promise.resolve([]), setFiles: () => {},
  getWorkspace: () => Promise.reject(new Error("timeout")),
  setWorkspaceLoading: (value: boolean) => loadStates.push(value),
  setWorkspaceLoadError: (value: string) => failures.push(value),
  setWorkspace: () => assert.fail("a failed read must not erase the saved snapshot"),
});
await assert.rejects(featureModule.exports.load(), /timeout/);
assert.deepEqual(loadStates, [true, false]);
assert.match(failures.at(-1) ?? "", /Saved matter work could not load/);
console.log("Failed matter reads expose loading and retry state without erasing saved work.");
