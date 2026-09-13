"use client";
import { useEffect, useId, useState } from "react";
import { workspaceCommand } from "@/lib/workspaceApi";
import { createMatterWorkItem } from "@/lib/api";
import { continuityKey, useContinuityIdentity } from "@/lib/continuityApi";
import styles from "./MatterMap.module.css";

type Draft = { text: string; base: string; revision: string; key: string; dirty: boolean };
export type ReportedAnswer = { answer: string; recorded_at?: string; surface?: string; actor?: {display_name?: string} };
const draftEvent = "themis-question-draft";
export default function ConditionAnswer({matterId, issueId, conditionId, revision, question, savedAnswer, savedKey = "", choices = [], history = [], onRefresh, onAnalyze, surface = "map", chatText}: {
  matterId: string; issueId: string; conditionId: string; revision: string; question: string; savedAnswer: string;
  savedKey?: string; choices?: Array<{label: string; answer: string}>; surface?: "map" | "chat"; chatText?: string;
  history?: ReportedAnswer[];
  onRefresh?: () => Promise<void>; onAnalyze?: () => void;
}) {
  const { identity } = useContinuityIdentity();
  const answerId = useId();
  const storageKey = identity ? continuityKey(identity.roster.vault_key, identity.actor.person_id, matterId, `question:${issueId}:${conditionId}`) : "";
  const fresh = (): Draft => ({text:savedAnswer, base:savedKey, revision, key:crypto.randomUUID(), dirty:false});
  const [draft, setDraft] = useState<Draft>(fresh);
  const [loadedKey, setLoadedKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!storageKey) return;
    const read = () => {
      let stored: Draft | null = null;
      try { stored = JSON.parse(sessionStorage.getItem(storageKey) || "null"); } catch { /* Optional local draft. */ }
      const matchesSaved = stored?.base === savedKey && stored?.text === savedAnswer;
      setDraft(stored?.dirty && !matchesSaved ? stored : fresh()); setLoadedKey(storageKey);
      if (matchesSaved) { try { sessionStorage.removeItem(storageKey); } catch { /* Optional storage. */ } }
    };
    const changed = (event: Event) => { if ((event as CustomEvent).detail === storageKey) read(); };
    read(); window.addEventListener(draftEvent, changed);
    return () => window.removeEventListener(draftEvent, changed);
  }, [storageKey, savedKey, savedAnswer, revision]);
  const store = (next: Draft) => {
    setDraft(next);
    try { sessionStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Keep the in-memory draft. */ }
    window.dispatchEvent(new CustomEvent(draftEvent, {detail:storageKey}));
  };
  const edit = (text: string) => store({...draft, text, dirty:true, key:crypto.randomUUID()});
  const stale = draft.base !== savedKey || draft.revision !== revision;
  const ready = Boolean(storageKey && loadedKey === storageKey);
  const save = async () => {
    if (!ready || busy || stale || !draft.text.trim()) return;
    setBusy(true); setNotice("");
    try {
      await workspaceCommand(matterId, `/issues/${issueId}/conditions/${conditionId}/answer`, "POST", {
        analysis_revision:revision, answer:draft.text, source_action_key:draft.key, expected_answer_key:draft.base, surface,
      });
      store({...draft, base:draft.key, dirty:true});
      setNotice("Answer saved. Chat and the map use this reported fact. Related analysis needs review; no condition or decision was automatically confirmed.");
      try { await onRefresh?.(); } catch { setNotice("Answer saved. The page could not refresh. Reload to see it; do not submit a new answer."); }
    } catch(e) {setNotice(e instanceof Error ? e.message : "Could not confirm the save. Your draft is retained for retry.");}
    finally {setBusy(false);}
  };
  const track = async () => {
    setBusy(true);
    try {
      await createMatterWorkItem(matterId, {title:question, description:"Obtain the facts needed for this decision path.", item_type:"mitigation", status:"open", priority:"normal", owner:identity?.actor.display_name || "Lawyer", required:true, issue_id:issueId, source_action_key:`condition-question:${issueId}:${conditionId}`});
      setNotice("Work item saved to obtain this answer.");
      try { await onRefresh?.(); } catch { setNotice("Work item saved. Reload to see the current record."); }
    } catch(e) {setNotice(e instanceof Error ? e.message : "Could not create work item.");}
    finally {setBusy(false);}
  };
  return <div className={styles.conditionAnswer}>
    {savedAnswer ? <p><strong>Saved answer:</strong> {savedAnswer}</p> : null}
    <label>Starting answer<select className="select-input" disabled={!ready || busy} value="" onChange={e => {
      if (e.target.value === "custom") edit(""); else { const choice = choices[Number(e.target.value)]; if (choice) edit(choice.answer); }
    }}><option value="" disabled>Choose a draft or write your own</option>{choices.map((choice, index) => <option key={index} value={index}>{choice.label}</option>)}<option value="custom">Other / write my own answer</option></select></label>
    <p className="field-help">Suggested answers are starting drafts, not confirmed facts. Edit the answer before saving.</p>
    <label htmlFor={answerId}>Your answer</label><textarea id={answerId} className="text-input" rows={3} value={draft.text} disabled={!ready || busy} placeholder="Choose a starting answer, or explain what you know." onChange={e => edit(e.target.value)} />
    {chatText?.trim() ? <button className="btn quiet" disabled={!ready || busy} onClick={() => edit(chatText)}>Use chat text as draft answer</button> : null}
    {stale ? <div role="status"><p>A newer answer or analysis is available. Your draft is retained. Review the saved answer above.</p><button className="btn quiet" onClick={() => store({...draft, base:savedKey, revision, key:crypto.randomUUID(), dirty:true})}>Keep my draft after review</button><button className="btn quiet" onClick={() => store(fresh())}>Use saved answer</button></div> : null}
    <div><button className="btn primary" disabled={!ready || busy || stale || !draft.text.trim()} onClick={() => void save()}>{busy ? "Saving…" : "Save answer"}</button><button className="btn quiet" disabled={!ready || busy} onClick={() => void track()}>I need to find out</button></div>
    {notice ? <p role="status">{notice}</p> : null}
    {history.length ? <details><summary>Answer history ({history.length})</summary>{history.map((entry, index) => <article key={index}><p>{entry.answer}</p><small>{entry.actor?.display_name || "Lawyer"} · {entry.surface || "map"} · {entry.recorded_at}</small></article>)}</details> : null}
    {savedAnswer && onAnalyze ? <button className="btn quiet" disabled={busy} onClick={onAnalyze}>Update analysis with saved facts</button> : null}
  </div>;
}
