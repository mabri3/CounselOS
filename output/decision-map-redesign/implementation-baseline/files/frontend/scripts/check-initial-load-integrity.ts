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

assert.match(surfaces.today, /\{loaded \? \(\s*<div className="today-grid">/, "Today must gate briefing claims on a successful read");
assert.match(surfaces.today, /\{loaded \? <div className="today-start"/, "Today must not mount creation or chat before its first successful read");
assert.match(surfaces.workspace, /\{loaded \? <>[\s\S]*<StageBoard/, "Workspace must gate its board and counts on a successful read");
assert.doesNotMatch(surfaces.briefing, /setItems\(null\)/, "Briefing must retain its last useful list during refresh and retry");
assert.match(surfaces.briefing, /\{items \? <>[\s\S]*<BriefingItemList/, "Briefing must not show empty rails before its first successful read");
assert.match(surfaces.matter, /if \(!detail\)[\s\S]*<DataLoadStatus/, "Matter detail must show load feedback before orientation data exists");
assert.match(surfaces.decisions, /\{loaded \? \(\s*<DecisionTable/, "Decisions must not render an empty register before a successful read");
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
