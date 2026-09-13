"use client";

import type { ConversationDockProps, ConversationTarget, InteractionReceipt } from "@/lib/workspaceTypes";
import MatterIcon from "@/components/workspace/MatterIcon";
import styles from "./MatterConversation.module.css";

function fileName(path: string): string {
  return path.split("/").filter(Boolean).at(-1) || "saved file";
}

function targetParts(target: ConversationTarget | null): Array<{ label: string; value?: string }> {
  if (!target) return [{ label: "Matter context" }];
  const parts: Array<{ label: string; value?: string }> = [{ label: "Matter context" }];
  if (target.business_question_id) parts.push({ label: "Business question" });
  if (target.issue_id) parts.push({ label: "Selected issue" });
  if (target.source_id) parts.push({ label: "Selected source" });
  if (target.scenario_id) parts.push({ label: "Saved scenario" });
  if (target.artifact_path) parts.push({ label: "Document", value: fileName(target.artifact_path) });
  if (target.selected_range?.text) parts.push({ label: "Selected passage", value: target.selected_range.text });
  if (target.local_draft_snapshot) parts.push({ label: "Local draft snapshot", value: "Not saved" });
  return parts;
}

function receiptLabel(receipt: InteractionReceipt): string {
  return receipt.operation.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function receiptState(receipt: InteractionReceipt): { label: string; className: string } {
  if (receipt.state === "applied") return { label: "Applied", className: "state-healthy" };
  if (receipt.state === "proposed") return { label: "Proposed", className: "state-agent" };
  return { label: "Not saved", className: "state-failure" };
}

function ReceiptRow({ receipt, onOpenArtifact }: { receipt: InteractionReceipt; onOpenArtifact: (path: string) => void }) {
  const state = receiptState(receipt);
  return <li className="conversation-receipt">
    <span className={`state-label ${state.className}`}>{state.label}</span>
    <span>{receiptLabel(receipt)}</span>
    {receipt.failure_detail ? <span className="conversation-receipt__detail">{receipt.failure_detail}</span> : null}
    {receipt.changed_links?.map((path) => <button className="btn tiny quiet" key={path} onClick={() => onOpenArtifact(path)} type="button">Open {fileName(path)}</button>)}
  </li>;
}

export default function ConversationDock({ matterId, target, onTargetChange, receipts, children, busy = false, onOpenArtifact }: ConversationDockProps) {
  const visibleReceipts = receipts.slice(-3).reverse();
  const parts = targetParts(target);
  return <section aria-label="Matter conversation" className={`${styles.dock} conversation-dock`} data-matter-context={matterId}>
    <div className="conversation-dock__target" role="status">
      <span className="conversation-dock__label"><MatterIcon name="chat" size={18} />Inquiry scope</span>
      <div className="conversation-dock__target-parts">
        {parts.map((part) => <span className="conversation-target" key={`${part.label}:${part.value ?? ""}`}><strong>{part.label}</strong>{part.value ? <span title={part.value}>{part.value}</span> : null}</span>)}
      </div>
      {target ? <button className="btn tiny quiet" disabled={busy} onClick={() => onTargetChange(null)} type="button">Clear scope</button> : null}
    </div>
    {visibleReceipts.length ? <details className="conversation-dock__receipts"><summary><MatterIcon name="history" size={17} />Recent saved actions</summary><ul>{visibleReceipts.map((receipt) => <ReceiptRow key={receipt.receipt_id} onOpenArtifact={onOpenArtifact} receipt={receipt} />)}</ul></details> : null}
    <div className="conversation-dock__panel">{children}</div>
  </section>;
}
