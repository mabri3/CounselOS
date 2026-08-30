"use client";

import Link from "next/link";
import { KeyboardEvent, useEffect, useState } from "react";
import { finalizeWorkProduct, getResearchRun } from "@/lib/api";
import type { CardAction, ChatCard, ResearchRun } from "@/lib/types";

type Props = {
  cards?: ChatCard[];
  matterId?: string;
  disabled?: boolean;
  onAction: (action: CardAction, answerText?: string) => Promise<void>;
  onOpenDocument?: (path: string) => void;
  onRefresh?: () => void | Promise<void>;
};

export default function ChatCards({ cards = [], matterId, disabled, onAction, onOpenDocument, onRefresh }: Props) {
  return cards.length ? (
    <div className="chat-cards">
      {cards.map((card, index) => {
        const key = card.type === "question" ? card.question_id
          : card.type === "matter_update" ? card.action_id
          : card.type === "research_status" ? card.run_id
          : `${card.vault_path}-${index}`;
        if (card.type === "question") return <QuestionCard card={card} disabled={disabled} key={key} onAction={onAction} />;
        if (card.type === "matter_update") {
          return (
            <section className="chat-card matter-update-card" key={key}>
              <div className="chat-card-kicker">Matter updated</div>
              <div className="chat-card-summary">{card.summary}</div>
              {card.changed_sections.length ? <div className="chat-card-detail">{card.changed_sections.join(" · ")}</div> : null}
              {card.can_edit || card.can_undo ? (
                <div className="chat-card-actions">
                  {card.can_edit ? <button className="btn tiny quiet" disabled={disabled} onClick={() => void onAction({ card_id: card.action_id, action: "edit" })}>Edit</button> : null}
                  {card.can_undo ? <button className="btn tiny quiet" disabled={disabled} onClick={() => void onAction({ card_id: card.action_id, action: "undo" })}>Undo</button> : null}
                </div>
              ) : null}
            </section>
          );
        }
        if (card.type === "research_status") return <ResearchCard card={card} key={key} matterId={matterId} />;
        if (card.type === "watch_draft") return <WatchCard card={card} disabled={disabled} key={key} onAction={onAction} />;
        if (card.type === "watch_scan") return <WatchCard card={card} disabled={disabled} key={key} onAction={onAction} />;
        return <WorkProductCard card={card} disabled={disabled} key={key} matterId={matterId} onOpenDocument={onOpenDocument} onRefresh={onRefresh} />;
      })}
    </div>
  ) : null;
}

function WatchCard({ card, disabled, onAction }: {
  card: Extract<ChatCard, { type: "watch_draft" | "watch_scan" }>;
  disabled?: boolean;
  onAction: Props["onAction"];
}) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const pending = card.status === "pending" || activeAction !== null;
  const status = activeAction ? watchActionPendingLabel(activeAction) : watchStatusLabel(card.status);

  async function runAction(action: (typeof card.allowed_actions)[number]) {
    setActiveAction(action);
    try {
      await onAction({ card_id: card.card_id, action, values: [card.watch_id] });
    } finally {
      setActiveAction(null);
    }
  }

  return (
    <section className={`chat-card ${card.status === "partial" ? "wash-attention" : pending ? "wash-agent" : card.status === "failed" ? "wash-failure" : ""}`} aria-busy={pending}>
      <div className="chat-card-kicker">{card.type === "watch_draft" ? "Watch draft" : "Scan now"} · {status}</div>
      <div className="chat-card-summary">{card.title}</div>
      {card.summary ? <div className="chat-card-detail">{card.summary}</div> : null}
      {card.status === "partial" ? <div className="chat-card-detail"><strong>Partial result.</strong> Useful results are available, but part of the scan did not complete.</div> : null}
      {card.warnings.length ? (
        <div className="chat-card-detail" role="status">
          <strong>{card.warnings.length === 1 ? "Warning" : "Warnings"}</strong>
          <ul>
            {card.warnings.map((warning, index) => <li key={`${card.card_id}-warning-${index}`}>{warning}</li>)}
          </ul>
        </div>
      ) : null}
      {card.type === "watch_draft" ? (
        <div className="chat-card-detail">
          This Watch is a draft. Scan now runs it once. Only Start Watch activates its schedule.
        </div>
      ) : null}
      {card.allowed_actions.length ? (
        <div className="chat-card-actions">
          {card.allowed_actions.map((action) => {
            if (action === "open_watch" || action === "open_scan") {
              const href = action === "open_scan" && card.type === "watch_scan" ? card.scan_url : card.watch_url;
              return <Link className="btn tiny quiet" href={href} key={action}>{watchActionLabel(action)}</Link>;
            }
            return (
              <button
                className={`btn ${action === "start_watch" ? "primary compact" : "tiny quiet"}`}
                disabled={disabled || pending}
                key={action}
                onClick={() => void runAction(action)}
              >
                {activeAction === action ? watchActionPendingLabel(action) : watchActionLabel(action)}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

function watchActionLabel(action: Extract<ChatCard, { type: "watch_draft" | "watch_scan" }>["allowed_actions"][number]): string {
  const labels: Record<string, string> = {
    save_draft: "Save draft",
    scan_now: "Scan now",
    change_something: "Change something",
    start_watch: "Start Watch",
    open_watch: "Open Watch",
    open_scan: "Open scan",
    scan_again: "Scan again",
  };
  return labels[action] ?? action;
}

function watchStatusLabel(status: Extract<ChatCard, { type: "watch_draft" | "watch_scan" }>["status"]): string {
  return { pending: "Pending", partial: "Partial", success: "Ready", failed: "Failed" }[status];
}

function watchActionPendingLabel(action: string): string {
  if (action === "scan_now" || action === "scan_again") return "Scanning…";
  if (action === "start_watch") return "Starting…";
  if (action === "save_draft") return "Saving…";
  return "Updating…";
}

function WorkProductCard({ card, disabled, matterId, onOpenDocument, onRefresh }: {
  card: Extract<ChatCard, { type: "work_product" }>;
  disabled?: boolean;
  matterId?: string;
  onOpenDocument?: (path: string) => void;
  onRefresh?: () => void | Promise<void>;
}) {
  const [current, setCurrent] = useState(card);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <section className="chat-card work-product-card">
      <div className="chat-card-kicker">Work Product · {current.state === "final" ? "Final" : "Draft"}</div>
      <button className="work-product-link" onClick={() => onOpenDocument?.(current.vault_path)} type="button">{current.title}</button>
      {current.summary ? <div className="chat-card-detail">{current.summary}</div> : null}
      {error ? <div className="error chat-card-detail">{error}</div> : null}
      {current.state === "draft" && matterId ? (
        <div className="chat-card-actions">
          <button className="btn primary compact" disabled={disabled || busy} onClick={async () => {
            setBusy(true); setError("");
            try {
              const result = await finalizeWorkProduct(matterId, current.vault_path) as typeof current;
              setCurrent(result);
              await onRefresh?.();
            } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not finalize the work product."); }
            finally { setBusy(false); }
          }}>{busy ? "Finalizing…" : "Finalize"}</button>
        </div>
      ) : null}
    </section>
  );
}

function QuestionCard({ card, disabled, onAction }: { card: Extract<ChatCard, { type: "question" }>; disabled?: boolean; onAction: Props["onAction"] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const progress = card.progress_current && card.progress_total
    ? `${card.progress_current} of ${card.progress_total}`
    : "Follow-up";

  function answer(values: string[], text?: string) {
    if (!values.length || disabled) return;
    void onAction({ card_id: card.question_id, action: "answer", values }, text);
  }

  function freeTextKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      answer([freeText.trim()], freeText.trim());
    }
  }

  return (
    <section className={`chat-card question-card ${card.conflict ? "conflict" : ""}`} aria-labelledby={`question-${card.question_id}`}>
      <div className="question-meta"><span>{progress}</span>{card.conflict ? <span>Factual conflict</span> : null}</div>
      <div className="question-title-row">
        <div className="chat-card-summary" id={`question-${card.question_id}`}>{card.text}</div>
        {card.reason ? (
          <details className="reason-control">
            <summary aria-label="Why this question is useful">i</summary>
            <div role="note">{card.reason}</div>
          </details>
        ) : null}
      </div>

      {card.selection_mode === "free_text" ? (
        <div className="question-free-text">
          <input aria-label="Answer" className="text-input" disabled={disabled} onChange={(event) => setFreeText(event.target.value)} onKeyDown={freeTextKeyDown} value={freeText} />
          <button className="btn primary compact" disabled={disabled || !freeText.trim()} onClick={() => answer([freeText.trim()], freeText.trim())}>Send</button>
        </div>
      ) : (
        <div className="question-choices" role={card.selection_mode === "single" ? "radiogroup" : "group"}>
          {card.choices.map((choice) => {
            const active = selected.includes(choice.value);
            return (
              <button
                aria-checked={active}
                className={`question-choice ${active ? "active" : ""}`}
                disabled={disabled}
                key={choice.value}
                onClick={() => {
                  if (card.selection_mode === "single") answer([choice.value], choice.label);
                  else setSelected((current) => current.includes(choice.value) ? current.filter((value) => value !== choice.value) : [...current, choice.value]);
                }}
                role={card.selection_mode === "single" ? "radio" : "checkbox"}
                type="button"
              >
                <span>{choice.label}</span>{choice.suggested ? <span className="suggested-label">Suggested</span> : null}
              </button>
            );
          })}
        </div>
      )}

      <div className="chat-card-actions">
        {card.selection_mode === "multiple" ? <button className="btn primary compact" disabled={disabled || !selected.length} onClick={() => answer(selected)}>Continue</button> : null}
        {card.allow_skip ? <button className="btn tiny quiet" disabled={disabled} onClick={() => void onAction({ card_id: card.question_id, action: "skip" })}>Skip</button> : null}
        {card.allow_stop ? <button className="btn tiny quiet" disabled={disabled} onClick={() => void onAction({ card_id: card.question_id, action: "stop" })}>No more questions</button> : null}
      </div>
    </section>
  );
}

function ResearchCard({ card, matterId }: { card: Extract<ChatCard, { type: "research_status" }>; matterId?: string }) {
  const [run, setRun] = useState<ResearchRun | Extract<ChatCard, { type: "research_status" }>>(card);
  useEffect(() => {
    if (!matterId || !["queued", "running"].includes(card.state)) return;
    let cancelled = false;
    const timer = window.setInterval(() => {
      void getResearchRun(matterId, card.run_id).then((next) => {
        if (!cancelled) setRun(next);
        if (!["queued", "running"].includes(next.state)) window.clearInterval(timer);
      }).catch(() => window.clearInterval(timer));
    }, 2000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [card.run_id, card.state, matterId]);
  const active = run.state === "queued" || run.state === "running";
  return (
    <details className="chat-card research-card">
      <summary>
        <span className={`research-indicator ${active ? "active" : ""}`} aria-hidden="true" />
        <span><span className="chat-card-kicker">Research · {run.state}</span><span className="chat-card-summary">{run.status}</span></span>
        <span className="research-progress">{run.completed}/{run.total}</span>
      </summary>
      <div className="chat-card-detail">{run.dossier_effect || "No dossier change is recorded yet."}</div>
    </details>
  );
}
