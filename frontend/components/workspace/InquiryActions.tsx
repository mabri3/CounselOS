"use client";

import { useId, useRef, useState } from "react";
import type { InquiryActionsProps, WorkspaceAction } from "@/lib/workspaceTypes";
import type { ContinuityInquiryActionsProps } from "@/lib/continuityTypes";
import MatterIcon, { type MatterIconName } from "@/components/workspace/MatterIcon";
import styles from "./MatterExplore.module.css";

const labels: Record<WorkspaceAction, string> = {
  explain: "Explain",
  stress_test: "Stress-test",
  ask_business: "Ask the business",
  explore_question: "Explore question",
};

const descriptions: Record<WorkspaceAction, string> = {
  explain: "Explain the selected issue or source in the current matter.",
  stress_test: "Look for a material objection or condition that could change the view.",
  ask_business: "Draft a focused question for the business. It is not sent.",
  explore_question: "Explore an open question without changing facts or decisions.",
};
const actionIcons: Record<WorkspaceAction, MatterIconName> = {
  explain: "book",
  stress_test: "scale",
  ask_business: "user",
  explore_question: "search",
};
type Notice = { tone: "healthy" | "agent" | "attention" | "failure"; word: string; message: string };

function actionNotice(state: string): Notice {
  if (state === "saved") return { tone: "healthy", word: "Saved", message: "The inquiry was saved in the existing conversation." };
  if (state === "proposed") return { tone: "attention", word: "Proposed", message: "The inquiry is not applied." };
  if (state === "failed" || state === "not_saved") return { tone: "failure", word: "Not saved", message: `Inquiry ${state}.` };
  return { tone: "agent", word: state === "queued" ? "Queued" : "Working", message: `Inquiry ${state}.` };
}

function targetLabel(target: InquiryActionsProps["target"]) {
  if (target.scenario_id) return "Saved scenario";
  if (target.artifact_path) return target.artifact_path.split("/").at(-1) || "Selected document";
  if (target.source_id) return "Selected source";
  if (target.issue_id) return "Selected issue";
  return "This matter";
}

export default function InquiryActions({ target, busy = false, onAction, onFactRequest, onHandoff, onCompareSources }: ContinuityInquiryActionsProps) {
  const inquiryId = useId();
  const [instruction, setInstruction] = useState("");
  const [selectedAction, setSelectedAction] = useState<WorkspaceAction>("explain");
  const [pending, setPending] = useState<WorkspaceAction | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [error, setError] = useState("");
  const actionKey = useRef({ signature: "", key: "" });
  const contextualAction = [
    onFactRequest ? { label: "Request a fact", onClick: onFactRequest } : null,
    onHandoff ? { label: "Hand off work", onClick: onHandoff } : null,
    onCompareSources ? { label: "Compare a source", onClick: onCompareSources } : null,
  ].find(Boolean);

  function stableKey(action: WorkspaceAction, text: string) {
    const signature = JSON.stringify({ action, text, target });
    if (actionKey.current.signature !== signature) actionKey.current = { signature, key: `workspace-action:${crypto.randomUUID()}` };
    return actionKey.current.key;
  }

  async function run(action: WorkspaceAction) {
    setSelectedAction(action); setPending(action); setError(""); setNotice(null);
    try {
      const result = await onAction({ action, instruction: instruction.trim(), target, source_action_key: stableKey(action, instruction.trim()) });
      setNotice(actionNotice(result.state));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The inquiry did not complete. Your question is retained for retry.");
    } finally { setPending(null); }
  }

  async function copyQuestion() {
    if (!instruction.trim()) { setError("Write a question before copying it."); return; }
    try {
      await navigator.clipboard.writeText(instruction.trim());
      setNotice({ tone: "agent", word: "Copied", message: "Question copied." }); setError("");
    } catch {
      setError("The question could not be copied. Select the text and copy it manually.");
    }
  }

  return <section aria-labelledby={`${inquiryId}-title`} className={`${styles.inquiryActions} inquiry-actions`}>
    <div className="inquiry-actions__header"><div><p className="eyebrow">Run an inquiry</p><h2 id={`${inquiryId}-title`}>Ask about {targetLabel(target)}</h2></div><span className="state-agent">Agent work</span></div>
    <p className="inquiry-actions__intro">These shortcuts use the same saved conversation and matter context. They do not start a separate assistant or history.</p>
    {notice ? <p className={`inquiry-actions__state inquiry-actions__state--${notice.tone}`} role="status">{notice.word}: {notice.message}</p> : null}
    {error ? <p className="inquiry-actions__state inquiry-actions__state--failure" role="alert">Failed: {error}</p> : null}
    <fieldset className="inquiry-actions__choices" disabled={busy || pending !== null}>
      <legend className="sr-only">Inquiry type</legend>
      {(Object.keys(labels) as WorkspaceAction[]).map((action) => <label key={action}><input checked={selectedAction === action} name={`${inquiryId}-action`} onChange={() => setSelectedAction(action)} type="radio" value={action} /><MatterIcon name={actionIcons[action]} size={23} /><span>{labels[action]}</span></label>)}
    </fieldset>
    <label className="label" htmlFor={`${inquiryId}-question`}>Question or instruction</label>
    <textarea id={`${inquiryId}-question`} className="text-input prose" value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="What would change if the funds remained in the account for two days?" />
    <div className="inquiry-actions__buttons" aria-label="Inquiry actions"><button className="btn agent" type="button" title={descriptions[selectedAction]} onClick={() => void run(selectedAction)} disabled={busy || pending !== null}>{pending === selectedAction ? `${labels[selectedAction]}…` : "Start inquiry"}</button><button className="btn quiet" type="button" onClick={() => void copyQuestion()} disabled={busy || pending !== null}>Copy question</button></div>
    {contextualAction ? <div className="inquiry-actions__context"><span className="small muted">More matter actions</span><button className="btn quiet tiny" onClick={contextualAction.onClick} type="button">{contextualAction.label}</button></div> : null}
    <p className="small muted">Selected action: {labels[selectedAction]}. {descriptions[selectedAction]}</p>
  </section>;
}
