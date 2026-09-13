import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const explorationStyles = readFileSync(resolve(root, "components/workspace/MatterExplore.module.css"), "utf8");
const scenario = readFileSync(resolve(root, "components/workspace/ScenarioPanel.tsx"), "utf8");
const flow = readFileSync(resolve(root, "components/workspace/BusinessFlow.tsx"), "utf8");
const inquiry = readFileSync(resolve(root, "components/workspace/InquiryActions.tsx"), "utf8");

assert.match(scenario, /onCreate\(\{[\s\S]*baseline_revisions: input.currentRevisions/, "scenario creation must freeze the current baseline");
assert.match(scenario, /Actual matter facts and decisions are unchanged/, "scenario creation must state its historical boundary");
assert.match(scenario, /new Set\(\[\.\.\.Object\.keys\(scenario\.baseline_revisions\), \.\.\.Object\.keys\(current\)\]\)/, "stale comparison must include sources added after a scenario baseline");
assert.match(scenario, /hasCompleteBaseline[\s\S]*Baseline unavailable/, "a missing baseline must not be labelled complete");
assert.match(scenario, /onAnalyze\(selected\.scenario_id, analysisInstruction\.trim\(\), sourceActionKey\)/, "analysis must use the durable action path with a stable retry key");
assert.match(scenario, /state === "saved"[\s\S]{0,120}word: "Saved"/, "scenario analysis may say saved only after its durable save state");
assert.match(scenario, /import ReactMarkdown from "react-markdown"/, "saved scenario analysis must use the established Markdown renderer");
assert.match(scenario, /remarkPlugins=\{\[remarkGfm\]\}/, "saved scenario analysis must support standard GitHub-flavored Markdown");
assert.match(scenario, /<ReactMarkdown components=\{analysisMarkdownComponents\} remarkPlugins=\{\[remarkGfm\]\}>\{visibleAnalysis\}<\/ReactMarkdown>/, "saved scenario analysis must render Markdown rather than raw syntax");
assert.match(scenario, /LONG_ANALYSIS_CHARACTER_LIMIT[\s\S]*Read full analysis/, "long saved analysis must have a reversible reading control");
assert.match(scenario, /const previewIsOneLongBlock = analysisIsLong && !analysisExpanded && visibleAnalysis === savedAnalysis/, "only long one-block analysis may use the height clamp, so short tall Markdown remains fully visible");
assert.match(scenario, /style=\{previewIsOneLongBlock \? \{ maxHeight: "30rem", overflow: "hidden" \} : undefined\}[\s\S]*analysisIsLong \?/, "a long single-block preview must clamp and keep its expansion control");
assert.match(explorationStyles, /scenario-analysis__table[\s\S]*scenario-analysis__code[^}]*overflow-x: auto/, "wide analysis tables and code must scroll inside the analysis card");
assert.match(explorationStyles, /scenario-analysis \.reading[\s\S]*overflow-wrap: anywhere/, "long analysis words must wrap within the reading width");
assert.match(scenario, /onAdopt\(selected\.scenario_id, selectedChanges, currentRevisions/, "adoption must send only selected changes with revision checks");
assert.match(scenario, /Correct a fact[\s\S]*Real-record editing/, "actual fact correction must remain separate from scenarios");
assert.match(scenario, /const expectedRevisions = correctionRevisions \?\? currentRevisions/, "a correction must keep its original revision baseline");
assert.match(scenario, /Use latest matter facts/, "a stale correction must offer an explicit rebase while retaining text");
assert.match(scenario, /onOpenArtifact\(path\)/, "internal scenario sources must open through the workspace artifact seam");
assert.match(scenario, /target="_blank" rel="noreferrer"/, "external scenario sources must be safe links");
assert.match(scenario, /disabled=\{locked\}/, "scenario inputs must lock while a conflicting save is pending");
assert.match(scenario, /Your (changes|question|selection|text) (are|is) retained/, "scenario failures must retain lawyer input");

assert.match(flow, /ordered relationships/i, "flow must be a readable list editor");
assert.match(flow, /Business flow sketch[\s\S]*aria-label="Business flow diagram"/, "flow must pair its editable list with an equivalent diagram");
assert.match(flow, /business-flow__sketch-route[\s\S]*From[\s\S]*Relationship[\s\S]*To/, "each diagram step must show the named from, relationship, and to route");
assert.match(flow, /edgeDetails[\s\S]*Timing[\s\S]*Custody[\s\S]*Ownership[\s\S]*Uncertainty/, "the diagram must surface recorded operational details without inventing them");
assert.match(explorationStyles, /@media \(max-width: 760px\)[\s\S]*business-flow__sketch-route[\s\S]*grid-template-columns: 1fr;/, "the diagram must stack safely on a narrow screen");
assert.doesNotMatch(flow, /dangerouslySetInnerHTML/, "flow labels must remain React text, not injected HTML");
assert.match(flow, /Timing[\s\S]*Custody[\s\S]*Ownership[\s\S]*Uncertainty/, "each flow relationship needs material operational fields");
assert.match(flow, /onSave\([\s\S]*baseRevision/, "flow save must carry its expected revision");
assert.match(flow, /if \(dirty \|\| flow\.revision === baseRevision\) return/, "incoming flow refreshes must not reset unsaved edits");
assert.match(flow, /onAcceptFactChanges\(\s*selectedChanges,\s*currentRevisions/, "acceptance must be an explicit action with revision checks");
assert.match(flow, /Your edits are retained/, "flow conflicts must preserve local edits");
assert.match(flow, /Refresh current flow[\s\S]*Copy local edits[\s\S]*Rebase my edits/, "a flow conflict must offer refresh, copy, and explicit rebase paths");
assert.match(flow, /disabled=\{locked\}/, "flow inputs must lock while a conflicting save is pending");
assert.match(flow, /initialUnsaved[\s\S]*Not saved/, "an empty flow must not claim to be saved");

assert.match(inquiry, /onAction\(\{ action, instruction: instruction\.trim\(\), target, source_action_key:/, "inquiry shortcuts must use the shared durable action callback");
assert.match(inquiry, /state === "saved"[\s\S]{0,120}word: "Saved"/, "inquiry actions may say saved only after their durable save state");
assert.match(inquiry, /explain[\s\S]*stress_test[\s\S]*ask_business[\s\S]*explore_question/, "all exploration actions must be available");
assert.match(inquiry, /navigator\.clipboard\.writeText/, "questions must support copy");
assert.match(inquiry, /could not be copied/, "copy failures must be visible");
assert.match(inquiry, /word: "Copied"/, "copy success must not be presented as a durable save");
assert.match(inquiry, /same saved conversation and matter context/, "inquiry actions must not imply a separate assistant");

console.log("Workspace exploration checks passed.");
