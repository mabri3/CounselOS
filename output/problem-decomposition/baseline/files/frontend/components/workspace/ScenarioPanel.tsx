"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { InteractionReceipt, WorkspaceClaim, Scenario, ScenarioAdoptCommand, ScenarioAnalyzeCommand, ScenarioCreateCommand, ScenarioFactChange, ScenarioInteractionProps, ScenarioPanelProps, WorkspaceActionResult } from "@/lib/workspaceTypes";
import styles from "./MatterScenario.module.css";

const keyFor = (prefix: string) => `${prefix}:${crypto.randomUUID()}`;
type Notice = { tone: "healthy" | "agent" | "attention" | "failure"; word: string; message: string };
const LONG_ANALYSIS_CHARACTER_LIMIT = 1200;

function longAnalysisPreview(analysis: string) {
  if (analysis.length <= LONG_ANALYSIS_CHARACTER_LIMIT) return analysis;
  if (/!?\[[^\]]+\]\[[^\]]*\]|^\s*\[[^\]]+\]:/m.test(analysis)) return analysis;
  let fence: { character: string; length: number } | null = null;
  let position = 0;
  let previewEnd = 0;
  for (const line of analysis.split(/(?<=\n)/)) {
    position += line.length;
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      const nextFence = marker[1];
      if (!fence) fence = { character: nextFence[0], length: nextFence.length };
      else if (fence.character === nextFence[0] && nextFence.length >= fence.length) fence = null;
    }
    if (!fence && /^\s*\n$/.test(line) && position <= LONG_ANALYSIS_CHARACTER_LIMIT) previewEnd = position;
  }
  return previewEnd ? analysis.slice(0, previewEnd).trimEnd() : analysis;
}

const analysisMarkdownComponents = {
  table: ({ children }: { children?: ReactNode }) => <div className="scenario-analysis__table"><table>{children}</table></div>,
  pre: ({ children }: { children?: ReactNode }) => <pre className="scenario-analysis__code">{children}</pre>,
};

function hasScenarioCitations(claimIds: string[], claims: WorkspaceClaim[]) {
  return claimIds.some((id) => {
    const matches = claims.filter((claim) => claim.claim_id === id);
    return matches.length === 1 && matches[0].evidence.some((item) =>
      Boolean(item.available_excerpt && item.source_id && (item.path || item.url)));
  });
}

function staleDetails(scenario: Scenario, current: Record<string, string>) {
  const paths = new Set([...Object.keys(scenario.baseline_revisions), ...Object.keys(current)]);
  return [...paths].filter((path) => scenario.baseline_revisions[path] !== current[path]);
}

function receiptNotice(receipt: InteractionReceipt, saved: string): Notice {
  if (receipt.state === "applied") return { tone: "healthy", word: "Saved", message: saved };
  if (receipt.state === "proposed") return { tone: "attention", word: "Proposed", message: "It is not applied." };
  return { tone: "failure", word: "Not saved", message: receipt.failure_detail || "The change was not saved." };
}

function actionNotice(state: string, saved: string): Notice {
  if (state === "saved") return { tone: "healthy", word: "Saved", message: saved };
  if (state === "proposed") return { tone: "attention", word: "Proposed", message: "It is not applied." };
  if (state === "failed" || state === "not_saved") return { tone: "failure", word: "Not saved", message: `Analysis ${state}.` };
  return { tone: "agent", word: state === "queued" ? "Queued" : "Working", message: `Analysis ${state}.` };
}

function hasCompleteBaseline(scenario: Scenario, current: Record<string, string>) {
  return Object.keys(scenario.baseline_revisions).length > 0 && staleDetails(scenario, current).length === 0;
}

function sourceLabel(path: string) {
  try { const url = new URL(path); return `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`; } catch { return path.split("/").at(-1)?.replaceAll("_", " ") || path; }
}

function isExternalSource(path: string) { return /^https?:\/\//i.test(path); }
function isInternalSource(path: string) {
  return Boolean(path.trim()) && !/^[a-z][a-z0-9+.-]*:/i.test(path) && !path.includes("\\") && !path.split("/").includes("..");
}

type ScenarioPanelInteractionProps = Omit<ScenarioPanelProps, "onCreate" | "onAnalyze" | "onAdopt"> & {
  initialIssueId?: ScenarioInteractionProps["initialIssueId"];
  initialFactId?: ScenarioInteractionProps["initialFactId"];
  onCreate: (command: ScenarioCreateCommand) => Promise<Scenario>;
  onAnalyze: ((scenarioId: string, command: ScenarioAnalyzeCommand) => Promise<WorkspaceActionResult>)
    | ScenarioPanelProps["onAnalyze"];
  onAdopt: ((scenarioId: string, command: ScenarioAdoptCommand) => Promise<InteractionReceipt>)
    | ScenarioPanelProps["onAdopt"];
  onOpenClaim?: ScenarioInteractionProps["onOpenClaim"];
  onOpenDocument?: ScenarioInteractionProps["onOpenDocument"];
  /** Optional presentation return control for the decision-map scenario surface. */
  onClose?: () => void;
  /** C6 supplies the existing POST /scenarios update wrapper for naming an analyzed baseline. */
  onSaveScenario?: (scenario: Scenario, title: string, expectedRevision: string, sourceActionKey: string) => Promise<Scenario>;
};

function scenarioFactChanges(changesText: string, hypotheticalFactId: string, sourceKey: string): ScenarioFactChange[] {
  return changesText.split("\n").map((text) => text.trim()).filter(Boolean)
    .map((text, index) => ({ change_id: `change-${index + 1}-${sourceKey}`, fact_id: hypotheticalFactId || null, text }));
}

async function runScenarioAnalysis(input: {
  selected: Scenario | null;
  createNew: boolean;
  changesText: string;
  hypotheticalFactId: string;
  currentRevisions: Record<string, string>;
  facts: Array<{ fact_id: string; text: string }>;
  initialIssueId?: string | null;
  instruction: string;
  getCreateSourceKey: () => string;
  getAnalysisSourceKey: (target: Scenario) => string;
  onCreate: ScenarioPanelInteractionProps["onCreate"];
  onAnalyze: ScenarioPanelInteractionProps["onAnalyze"];
  onSelect: ScenarioPanelInteractionProps["onSelect"];
}): Promise<{ target: Scenario; result: WorkspaceActionResult }> {
  let target = input.createNew ? null : input.selected;
  if (!target) {
    const createSourceKey = input.getCreateSourceKey();
    const factLabel = input.facts.find((fact) => fact.fact_id === input.hypotheticalFactId)?.text;
    target = await input.onCreate({
      title: `Working scenario — ${(factLabel || input.changesText.trim().split("\n")[0]).slice(0, 80)}`,
      baseline_revisions: input.currentRevisions,
      issue_ids: input.initialIssueId ? [input.initialIssueId] : [],
      proposed_fact_changes: scenarioFactChanges(input.changesText, input.hypotheticalFactId, createSourceKey),
      source_action_key: createSourceKey,
    });
    input.onSelect(target.scenario_id);
  }
  const sourceActionKey = input.getAnalysisSourceKey(target);
  const command: ScenarioAnalyzeCommand = { instruction: input.instruction, expected_scenario_revision: target.revision ?? "", baseline_revisions: { ...target.baseline_revisions }, source_action_key: sourceActionKey };
  // Legacy seam: onAnalyze(selected.scenario_id, analysisInstruction.trim(), sourceActionKey).
  const result = input.onAnalyze.length >= 3
    ? await (input.onAnalyze as ScenarioPanelProps["onAnalyze"])(target.scenario_id, command.instruction, command.source_action_key)
    : await (input.onAnalyze as ScenarioInteractionProps["onAnalyze"])(target.scenario_id, command);
  return { target, result };
}

export default function ScenarioPanel({
  scenarios,
  selectedScenarioId,
  currentRevisions,
  busy = false,
  error,
  onSelect,
  onCreate,
  onAnalyze,
  onAdopt,
  onCorrectFact,
  onOpenArtifact,
  onClose,
  onOpenClaim,
  facts = [],
  claims = [],
  initialIssueId,
  initialFactId,
  onSaveScenario,
}: ScenarioPanelInteractionProps) {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [changesText, setChangesText] = useState("");
  const [hypotheticalFactId, setHypotheticalFactId] = useState(initialFactId ?? "");
  const [analysisInstruction, setAnalysisInstruction] = useState("");
  const [expandedAnalysisId, setExpandedAnalysisId] = useState<string | null>(null);
  const [selectedChanges, setSelectedChanges] = useState<string[]>([]);
  const [correctionFactId, setCorrectionFactId] = useState("");
  const [correctionText, setCorrectionText] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [localError, setLocalError] = useState("");
  const [pending, setPending] = useState<"create" | "analyze" | "adopt" | "correct" | null>(null);
  const createKey = useRef({ signature: "", key: "" });
  const analysisKey = useRef({ signature: "", key: "" });
  const adoptionKey = useRef({ signature: "", key: "" });
  const correctionKey = useRef({ signature: "", key: "" });
  const saveNameKey = useRef({ signature: "", key: "" });
  const analysisGeneration = useRef(0);
  const [correctionRevisions, setCorrectionRevisions] = useState<Record<string, string> | null>(null);

  const selected = useMemo(
    () => scenarios.find((scenario) => scenario.scenario_id === selectedScenarioId) ?? null,
    [scenarios, selectedScenarioId],
  );
  const selectedStale = selected ? staleDetails(selected, currentRevisions) : [];
  const savedAnalysis = selected?.analysis ?? "";
  const analysisExpanded = selected?.scenario_id === expandedAnalysisId;
  const analysisIsLong = savedAnalysis.length > LONG_ANALYSIS_CHARACTER_LIMIT;
  const visibleAnalysis = analysisExpanded || !analysisIsLong ? savedAnalysis : longAnalysisPreview(savedAnalysis);
  const previewIsOneLongBlock = analysisIsLong && !analysisExpanded && visibleAnalysis === savedAnalysis;
  const savedAnalysisId = useId();
  const correctionStale = correctionRevisions && JSON.stringify(correctionRevisions) !== JSON.stringify(currentRevisions);
  const locked = busy || pending !== null;

  useEffect(() => {
    if (initialFactId === undefined) return;
    analysisGeneration.current += 1;
    setCreating(true);
    setHypotheticalFactId(initialFactId ?? "");
    setSelectedChanges([]);
    setExpandedAnalysisId(null);
    onSelect(null);
  }, [initialFactId, initialIssueId, onSelect]);

  const makeStableKey = (ref: { current: { signature: string; key: string } }, prefix: string, signature: string) => {
    if (ref.current.signature !== signature) ref.current = { signature, key: keyFor(prefix) };
    return ref.current.key;
  };

  function toggleNewScenario() {
    if (creating) {
      setCreating(false);
      return;
    }
    analysisGeneration.current += 1;
    setSelectedChanges([]);
    setExpandedAnalysisId(null);
    setLocalError("");
    onSelect(null);
    setCreating(true);
  }

  async function analyzeScenario() {
    if (!analysisInstruction.trim()) {
      setLocalError("Describe the question to explore before analysis starts.");
      return;
    }
    const selectedForAnalysis = creating ? null : selected;
    if (!selectedForAnalysis && !changesText.trim()) {
      setLocalError("Enter at least one hypothetical fact before analysis starts.");
      return;
    }
    setPending("analyze"); setLocalError(""); setNotice(null);
    const generation = ++analysisGeneration.current;
    try {
      const { result } = await runScenarioAnalysis({
        selected: selectedForAnalysis,
        createNew: creating,
        changesText,
        hypotheticalFactId,
        currentRevisions,
        facts,
        initialIssueId,
        instruction: analysisInstruction.trim(),
        getCreateSourceKey: () => {
          const signature = `baseline:${hypotheticalFactId}:${changesText.trim()}:${JSON.stringify(currentRevisions)}`;
          return makeStableKey(createKey, "scenario-baseline", signature);
        },
        getAnalysisSourceKey: (target) => {
          const signature = `${target.scenario_id}:${target.revision ?? ""}:${analysisInstruction.trim()}:${JSON.stringify(target.baseline_revisions)}`;
          return makeStableKey(analysisKey, "scenario-analysis", signature);
        },
        onCreate,
        onAnalyze,
        onSelect,
      });
      if (generation === analysisGeneration.current) setNotice(actionNotice(result.state, "Scenario analysis saved against its original baseline."));
    } catch (cause) {
      if (generation === analysisGeneration.current) setLocalError(cause instanceof Error ? cause.message : "Analysis did not complete. Your question is retained for retry.");
    } finally { if (generation === analysisGeneration.current) setPending(null); }
  }

  async function adoptSelected() {
    if (!selected || !selectedChanges.length) {
      setLocalError("Choose the specific scenario facts to adopt.");
      return;
    }
    setPending("adopt"); setLocalError(""); setNotice(null);
    const signature = `${selected.scenario_id}:${selectedChanges.slice().sort().join(",")}:${JSON.stringify(currentRevisions)}`;
    try {
      const command: ScenarioAdoptCommand = { change_ids: selectedChanges, expected_revisions: { ...currentRevisions }, source_action_key: makeStableKey(adoptionKey, "scenario-adopt", signature) };
      // Legacy seam: onAdopt(selected.scenario_id, selectedChanges, currentRevisions, sourceActionKey).
      const receipt = onAdopt.length >= 4
        ? await (onAdopt as ScenarioPanelProps["onAdopt"])(selected.scenario_id, command.change_ids, command.expected_revisions, command.source_action_key)
        : await (onAdopt as ScenarioInteractionProps["onAdopt"])(selected.scenario_id, command);
      const nextNotice = receiptNotice(receipt, "Selected facts were applied. The saved scenario remains historical.");
      setNotice(nextNotice);
      if (receipt.state === "applied") setSelectedChanges([]);
    } catch (cause) {
      setLocalError(cause instanceof Error ? cause.message : "The selected facts were not adopted. Your selection is retained.");
    } finally { setPending(null); }
  }

  async function saveScenarioName() {
    if (!selected || !title.trim()) {
      setLocalError("Add a name for this scenario.");
      return;
    }
    if (!onSaveScenario) {
      setLocalError("Saving a name is not connected yet. The analyzed baseline is still available.");
      return;
    }
    setPending("create"); setLocalError(""); setNotice(null);
    const signature = `${selected.scenario_id}:${selected.revision ?? ""}:${title.trim()}`;
    try {
      const saved = await onSaveScenario(selected, title.trim(), selected.revision ?? "", makeStableKey(saveNameKey, "scenario-name", signature));
      onSelect(saved.scenario_id);
      setTitle("");
      setNotice({ tone: "healthy", word: "Saved", message: "Named scenario saved. Actual matter facts and decisions are unchanged." });
    } catch (cause) {
      setLocalError(cause instanceof Error ? cause.message : "The scenario name was not saved. Your name is retained.");
    } finally { setPending(null); }
  }

  async function correctFact() {
    if (!onCorrectFact) {
      setLocalError("Fact correction is not connected yet.");
      return;
    }
    if (!correctionText.trim()) {
      setLocalError("Enter the corrected fact.");
      return;
    }
    setPending("correct"); setLocalError(""); setNotice(null);
    const expectedRevisions = correctionRevisions ?? currentRevisions;
    const signature = `${correctionFactId}:${correctionText.trim()}:${JSON.stringify(expectedRevisions)}`;
    try {
      const receipt = await onCorrectFact({
        factId: correctionFactId.trim() || null,
        replacement: correctionText.trim(),
        expectedRevisions,
        sourceActionKey: makeStableKey(correctionKey, "fact-correction", signature),
      });
      setNotice(receiptNotice(receipt, "Fact corrected. This did not change a saved scenario or draft."));
      if (receipt.state === "applied") { setCorrectionFactId(""); setCorrectionText(""); setCorrectionRevisions(null); }
    } catch (cause) {
      setLocalError(cause instanceof Error ? cause.message : "The fact was not corrected. Your text is retained.");
    } finally { setPending(null); }
  }

  return (
    <section aria-labelledby="scenario-title" className={styles.scenarioPanel}>
      <div className={styles.header}>
        <div><p className="eyebrow">Hypothetical analysis</p><h2 className={styles.title} id="scenario-title">Try a different assumption</h2></div>
        <div className={styles.headerActions}><span className={styles.tag}>Hypothetical · Agent work</span>{onClose ? <button className="btn quiet" onClick={onClose} type="button">← Back to map</button> : null}</div>
      </div>
      <p className={styles.intro}>Explore how a changed assumption affects the analysis. Actual facts, decisions, and drafts stay unchanged.</p>
      {!creating ? <button className={`btn agent ${styles.launch}`} type="button" onClick={toggleNewScenario} aria-expanded={creating} disabled={locked}>Try a different assumption</button> : null}
      {error ? <p className={styles.state} role="status">Failed: {error}</p> : null}
      {notice ? <p className={styles.state} role="status">{notice.word}: {notice.message}</p> : null}
      {localError ? <p className={styles.state} role="alert">Failed: {localError}</p> : null}

      {creating ? <div className={styles.form}>
        <div className={styles.formRow}><label className={styles.label} htmlFor="scenario-fact">Current reported fact</label><div><select className="select-input" id="scenario-fact" value={hypotheticalFactId} onChange={(event) => setHypotheticalFactId(event.target.value)} disabled={locked}><option value="">No linked fact</option>{facts.map((fact) => <option key={fact.fact_id} value={fact.fact_id}>{fact.text}</option>)}</select>{hypotheticalFactId ? <p className="small muted">Current: {facts.find((fact) => fact.fact_id === hypotheticalFactId)?.text}</p> : null}</div></div>
        <div className={styles.formRow}><label className={styles.label} htmlFor="scenario-changes">Hypothetical value</label><textarea className="text-input prose" id="scenario-changes" value={changesText} onChange={(event) => setChangesText(event.target.value)} placeholder="Enter one changed fact per line" disabled={locked} /></div>
        <div className={styles.formRow}><label className={styles.label} htmlFor="new-scenario-analysis">Question for analysis</label><textarea className="text-input" id="new-scenario-analysis" value={analysisInstruction} onChange={(event) => setAnalysisInstruction(event.target.value)} placeholder="How would this change the current analysis?" disabled={locked} /></div>
        <div className={styles.formActions}><button className={`btn ${styles.primary}`} type="button" onClick={() => void analyzeScenario()} disabled={locked}>{pending === "analyze" ? "Analyzing…" : "Analyze scenario"}</button><button className="btn quiet" type="button" onClick={() => { if (onClose) onClose(); else setCreating(false); }} disabled={locked}>Cancel</button></div>
      </div> : null}

      <div className={styles.scenarioList} aria-label="Saved scenarios">
        <h3 className={styles.savedTitle}>Saved scenarios</h3>
          {scenarios.length ? scenarios.map((scenario) => {
            const stale = staleDetails(scenario, currentRevisions);
            const active = scenario.scenario_id === selectedScenarioId;
            const complete = hasCompleteBaseline(scenario, currentRevisions);
            return <button key={scenario.scenario_id} className={styles.scenarioItem} type="button" aria-pressed={active} disabled={locked} onClick={() => { analysisGeneration.current += 1; setSelectedChanges([]); setExpandedAnalysisId(null); onSelect(active ? null : scenario.scenario_id); }}>
              <span>{scenario.title}</span><small className={scenario.analysis_state === "failed" ? "state-failure" : complete && !scenario.stale?.is_stale ? "state-healthy" : "state-attention"}>{scenario.analysis_state === "failed" ? "Analysis failed" : scenario.stale?.is_stale || stale.length ? "Earlier baseline" : complete ? "Baseline complete" : "Baseline unavailable"}</small>
            </button>;
          }) : <div className={styles.savedEmpty}><div><strong>No saved scenarios</strong>Select a saved scenario to compare it with the current matter.</div></div>}
        </div>
        {selected ? <article className={styles.detail}>
          <div className={styles.header}><h3>{selected.title}</h3><span className={hasCompleteBaseline(selected, currentRevisions) ? "state-healthy" : "state-attention"}>{hasCompleteBaseline(selected, currentRevisions) ? "Baseline complete" : selectedStale.length ? "Baseline needs review" : "Baseline unavailable"}</span></div>
          <p className="small muted">Saved {selected.created_at}. {selectedStale.length ? `${selectedStale.length} source or fact revision${selectedStale.length === 1 ? " has" : "s have"} changed.` : hasCompleteBaseline(selected, currentRevisions) ? "The saved baseline matches the current matter." : "This scenario has no complete saved baseline."}</p>
          {selected.analysis_run_id ? <p className="record-meta">Run {selected.analysis_run_id}</p> : null}
          {selected.analysis_state ? <p className={`exploration-state exploration-state--${selected.analysis_state === "failed" ? "failure" : selected.analysis_state === "completed" ? "healthy" : "agent"}`}>{selected.analysis_state === "failed" ? "Failed" : selected.analysis_state === "completed" ? "Completed" : selected.analysis_state === "not_started" ? "Not analyzed" : selected.analysis_state === "queued" ? "Queued" : "Running"}: Hypothetical analysis{selected.failure_detail ? ` · ${selected.failure_detail}` : ""}</p> : null}
          <details><summary>Baseline revisions</summary><ul className="exploration-list">{Object.entries(selected.baseline_revisions).map(([path, revision]) => <li key={path}><code>{path}</code><span>{revision === currentRevisions[path] ? "Current" : "Changed"}</span></li>)}</ul></details>
          {selected.analysis_baseline_revisions && Object.keys(selected.analysis_baseline_revisions).length ? <details><summary>Analysis baseline</summary><ul className="exploration-list">{Object.entries(selected.analysis_baseline_revisions).map(([path, revision]) => <li key={path}><code>{path}</code><span>{revision === currentRevisions[path] ? "Current" : "Earlier version"}</span></li>)}</ul></details> : null}
          <h4>Current baseline facts</h4>
          {facts.length ? <ul className="exploration-list">{facts.map((fact) => <li key={fact.fact_id}><span>{fact.text}</span><code>{fact.fact_id}</code></li>)}</ul> : <p className="muted small">No current facts are available in this view.</p>}
          <h4>Changed assumptions</h4>
          {selected.proposed_fact_changes?.length ? <div className="scenario-facts">{selected.proposed_fact_changes.map((change) => <label className="checkbox-row" key={change.change_id}><input type="checkbox" checked={selectedChanges.includes(change.change_id)} disabled={locked} onChange={() => setSelectedChanges((current) => current.includes(change.change_id) ? current.filter((id) => id !== change.change_id) : [...current, change.change_id])} /><span>{change.text}</span></label>)}</div> : <p className="muted small">No changed assumptions were saved.</p>}
          <div className={styles.form}><div className={styles.formRow}><label className={styles.label} htmlFor="scenario-analysis">Explore this scenario</label><textarea className="text-input" id="scenario-analysis" value={analysisInstruction} onChange={(event) => setAnalysisInstruction(event.target.value)} placeholder="How would this affect the current answer?" disabled={locked} /></div><div className={styles.formActions}><button className={`btn ${styles.primary}`} type="button" onClick={() => void analyzeScenario()} disabled={locked}>{pending === "analyze" ? "Analyzing…" : "Analyze scenario"}</button><button className="btn review" type="button" onClick={() => void adoptSelected()} disabled={locked || !selectedChanges.length}>{pending === "adopt" ? "Adopting…" : "Adopt selected facts"}</button></div></div>
          <div className={styles.form}><div className={styles.formRow}><label className={styles.label} htmlFor="scenario-name">Scenario name</label><input className="text-input" id="scenario-name" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Two-day funds hold" disabled={locked} /></div><div className={styles.formActions}><button className={`btn ${styles.primary}`} type="button" onClick={() => void saveScenarioName()} disabled={locked || !title.trim()}>{pending === "create" ? "Saving scenario…" : "Save scenario"}</button></div></div>
          {selected.analysis ? <div className="scenario-analysis"><h4>Hypothetical · Agent analysis</h4>{selected.stale?.is_stale ? <p className="exploration-state exploration-state--attention">Earlier facts: This result stays attached to its original baseline.</p> : null}<div className="reading scenario-analysis__content" id={savedAnalysisId} style={previewIsOneLongBlock ? { maxHeight: "30rem", overflow: "hidden" } : undefined}><ReactMarkdown components={analysisMarkdownComponents} remarkPlugins={[remarkGfm]}>{visibleAnalysis}</ReactMarkdown></div>{analysisIsLong ? <><p className="muted small">{analysisExpanded ? "The full saved analysis is shown." : previewIsOneLongBlock ? "This saved analysis starts with one long Markdown block." : "Showing complete opening blocks from this saved analysis."}</p><button aria-controls={savedAnalysisId} aria-expanded={analysisExpanded} className="btn quiet tiny" onClick={() => setExpandedAnalysisId(analysisExpanded ? null : selected.scenario_id)} type="button">{analysisExpanded ? "Show less" : "Read full analysis"}</button></> : null}</div> : <p className="muted small">No saved analysis yet. A failed attempt does not remove an earlier result.</p>}
          {selected.affected_issue_ids?.length ? <><h4>Affected issues</h4><ul className="exploration-list">{selected.affected_issue_ids.map((id) => <li key={id}><span>{id}</span></li>)}</ul></> : null}
          {selected.affected_branch_ids?.length ? <><h4>Affected branches</h4><ul className="exploration-list">{selected.affected_branch_ids.map((id) => <li key={id}><span>{id}</span></li>)}</ul></> : null}
          {selected.analysis && !hasScenarioCitations(selected.claim_ids ?? [], claims) ? <p className="exploration-state exploration-state--attention" role="status">No claim-level citations saved. The analysis remains available; source links alone do not establish that its conclusions apply.</p> : null}
          {selected.claim_ids?.length ? <><h4>Supporting claims</h4><ul className="exploration-list">{selected.claim_ids.map((id) => <li key={id}>{onOpenClaim ? <button className="quiet-link" type="button" onClick={() => onOpenClaim(id)}>{id}</button> : <span>{id}</span>}</li>)}</ul></> : null}
          {selected.proposed_outcomes?.length ? <><h4>Proposed outcomes</h4><ul className="exploration-list">{selected.proposed_outcomes.map((outcome) => <li key={outcome.outcome_id}><span>{outcome.label}{outcome.condition ? ` · ${outcome.condition}` : ""}</span></li>)}</ul></> : null}
          {selected.unresolved_conditions?.length ? <><h4>Still uncertain</h4><ul className="exploration-list">{selected.unresolved_conditions.map((condition) => <li key={condition}>{condition}</li>)}</ul></> : null}
          {selected.source_links?.length ? <><h4>Source links</h4><ul className="exploration-list">{selected.source_links.map((path) => <li key={path}>{isExternalSource(path) ? <a className="quiet-link" href={path} target="_blank" rel="noreferrer">{sourceLabel(path)}</a> : isInternalSource(path) && onOpenArtifact ? <button className="quiet-link" type="button" onClick={() => onOpenArtifact(path)}>{sourceLabel(path)}</button> : <code>{sourceLabel(path)}</code>}</li>)}</ul></> : null}
          {selected.adopted_fact_ids?.length ? <p className="exploration-state exploration-state--healthy">Saved: {selected.adopted_fact_ids.length} selected fact{selected.adopted_fact_ids.length === 1 ? "" : "s"} adopted. This scenario remains historical.</p> : null}
        </article> : null}

      <details className={styles.correction} open><summary>Correct a fact</summary><p className="small muted">Real-record editing. Use this to correct what is actually in the matter.</p><label className="label" htmlFor="correct-fact-id">Fact to replace</label><select className="select-input" id="correct-fact-id" value={correctionFactId} disabled={locked} onChange={(event) => { if (!correctionRevisions) setCorrectionRevisions({ ...currentRevisions }); setCorrectionFactId(event.target.value); }}><option value="">Add a new reported fact</option>{facts.map((fact) => <option key={fact.fact_id} value={fact.fact_id}>{fact.text}</option>)}</select><label className="label" htmlFor="correct-fact-text">Corrected fact</label><textarea className="text-input prose" id="correct-fact-text" value={correctionText} disabled={locked} onChange={(event) => { if (!correctionRevisions) setCorrectionRevisions({ ...currentRevisions }); setCorrectionText(event.target.value); }} placeholder="Enter the corrected fact" />{correctionStale ? <div className={styles.state}>Needs attention: Matter facts changed. Your correction text is retained. <button className="quiet-link" type="button" onClick={() => setCorrectionRevisions({ ...currentRevisions })} disabled={locked}>Use latest matter facts</button></div> : null}<button className="btn review" type="button" onClick={() => void correctFact()} disabled={locked}>{pending === "correct" ? "Correcting fact…" : "Correct a fact"}</button></details>
    </section>
  );
}
