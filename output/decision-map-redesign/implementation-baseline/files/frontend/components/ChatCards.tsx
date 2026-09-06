"use client";

import type { InteractionReceipt } from "@/lib/workspaceTypes";
import Link from "next/link";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { getResearchRun } from "@/lib/api";
import { choiceNeedsDetail, effectiveQuestionMode, groupedAnswerText, questionProgressLabel } from "@/lib/chatCardLogic";
import { operationChangeLinks, visibleOperationResults as projectOperationResults } from "@/lib/chatRunLogic";
import type { HistoricalQuestionState } from "@/lib/chatRunLogic";
import type { CardAction, ChatCard, OperationResult, QuestionMode, ResearchRun } from "@/lib/types";

type ChatOperationResult = OperationResult & { proposal?: Record<string, unknown> };

type Props = {
  cards?: ChatCard[];
  matterId?: string;
  disabled?: boolean;
  questionsDisabled?: boolean;
  questionStates?: Record<string, HistoricalQuestionState>;
  questionMode?: QuestionMode;
  showQuestionMode?: boolean;
  onQuestionModeChange?: (mode: QuestionMode) => void;
  onAction: (action: CardAction, answerText?: string) => Promise<void>;
  onOpenDocument?: (path: string) => void;
  onRefresh?: () => void | Promise<void>;
  currentWorkProductDraftPath?: string | null;
  operationResults?: ChatOperationResult[];
};

export default function ChatCards({ cards = [], matterId, disabled, questionsDisabled, questionStates, questionMode = "guided", showQuestionMode = false, onQuestionModeChange, onAction, onOpenDocument, onRefresh, currentWorkProductDraftPath, operationResults = [] }: Props) {
  const questions = cards.filter((card): card is Extract<ChatCard, { type: "question" }> => card.type === "question");
  const activeQuestions = questions.filter((card) => (questionStates?.[card.question_id]?.state ?? "active") === "active");
  const historicalQuestions = questions.filter((card) => (questionStates?.[card.question_id]?.state ?? "active") !== "active");
  const otherCards = cards.filter((card): card is Exclude<ChatCard, { type: "question" }> => card.type !== "question" && !(
    card.type === "matter_update"
    && card.action_id.startsWith("intake-")
    && card.summary === "Matter updated"
  ));
  const visibleOperationResults = projectOperationResults(operationResults);
  return cards.length || visibleOperationResults.length ? (
    <div className="chat-cards">
      {visibleOperationResults.map((result, index) => <OperationResultCard disabled={disabled} key={`${result.action}-${result.operation}-${index}`} onAction={onAction} onOpenDocument={onOpenDocument} result={result} />)}
      {historicalQuestions.length ? <details className="chat-card question-card intake-audit-history"><summary>Intake audit history ({historicalQuestions.length})</summary>{historicalQuestions.map((card) => <QuestionHistoryCard card={card} key={card.question_id} status={questionStates![card.question_id]} />)}</details> : null}
      {activeQuestions.length ? <QuestionSequence cards={activeQuestions} disabled={disabled || questionsDisabled} mode={showQuestionMode ? questionMode : "guided"} onAction={onAction} onModeChange={showQuestionMode ? onQuestionModeChange : undefined} showModeControl={showQuestionMode && !questionsDisabled} /> : null}
      {otherCards.map((card, index) => {
        const key = card.type === "matter_update" ? card.action_id
          : card.type === "research_status" ? card.run_id
          : `${card.vault_path}-${index}`;
        if (card.type === "matter_update") return null;
        if (card.type === "research_status") return <ResearchCard card={card} key={key} matterId={matterId} onRefresh={onRefresh} />;
        if (card.type === "watch_draft") return <WatchCard card={card} disabled={disabled} key={key} onAction={onAction} />;
        if (card.type === "watch_scan") return <WatchCard card={card} disabled={disabled} key={key} onAction={onAction} />;
        return <WorkProductCard card={card} currentWorkProductDraftPath={currentWorkProductDraftPath} key={key} onOpenDocument={onOpenDocument} />;
      })}
    </div>
  ) : null;
}

function OperationResultCard({ disabled, onAction, onOpenDocument, result }: {
  disabled?: boolean;
  onAction: Props["onAction"];
  onOpenDocument?: Props["onOpenDocument"];
  result: ChatOperationResult;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [disposition, setDisposition] = useState("");
  const [reason, setReason] = useState("");
  const recorded = result.status === "changed";
  const needsConfirmation = result.status === "confirmation_required" || result.status === "proposed";
  const failed = result.status === "failed";
  const protectedWriteFailure = failed && result.operation === "write_markdown" && /protected|typed tool/i.test(result.error ?? "");
  const decisionConfirmation = needsConfirmation && result.operation === "record_decision";
  const reasonRequired = disposition === "modified" || disposition === "not_followed";
  const changedRecords = recorded ? operationChangeLinks(result.changed_paths) : [];

  async function confirm() {
    if (!needsConfirmation || (decisionConfirmation && (!disposition || (reasonRequired && !reason.trim())))) return;
    setBusy(true); setError("");
    try {
      await onAction(
        {
          card_id: `operation-result:${result.action}`,
          action: "apply",
          values: decisionConfirmation ? [disposition, reason.trim()] : [],
        },
        decisionConfirmation
          ? "Record this decision with the selected recommendation disposition."
          : operationActionLabel(result.operation),
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The workspace action did not complete.");
    } finally { setBusy(false); }
  }

  const label = recorded ? "Recorded"
    : needsConfirmation ? "Confirmation required"
      : failed ? "Failed"
        : "No change";
  return (
    <section className={`chat-card ${failed ? "wash-failure" : needsConfirmation ? "wash-attention" : recorded ? "wash-healthy" : ""}`}>
      <div className="chat-card-kicker">Workspace action · {label}</div>
      <div className="chat-card-summary">{protectedWriteFailure ? "Use the matching workspace action for this record." : result.status === "no_change" ? "No workspace change recorded" : result.summary}</div>
      {changedRecords.length ? <div className="chat-card-detail">Updated records: {changedRecords.map((record) => record.label).join(" · ")}</div> : null}
      {result.required_user_action ? <div className="chat-card-detail">{result.required_user_action}</div> : null}
      {protectedWriteFailure ? <div className="chat-card-detail">Use Save work product, Run research, Stop research, or the matching direct control.</div> : result.recovery && (failed || result.status === "no_change") ? <div className="chat-card-detail">{result.recovery}</div> : null}
      {failed && result.error && !protectedWriteFailure ? <div className="chat-card-detail">{result.error}</div> : null}
      {error ? <div className="error chat-card-detail" role="alert">{error}</div> : null}
      {decisionConfirmation ? <div className="chat-card-detail">
        <label>Recommendation disposition
          <select disabled={disabled || busy} onChange={(event) => setDisposition(event.target.value)} value={disposition}>
            <option value="">Select one</option>
            <option value="followed">Followed</option>
            <option value="modified">Modified</option>
            <option value="not_followed">Not followed</option>
            <option value="not_applicable">Not applicable</option>
          </select>
        </label>
        {reasonRequired ? <label>Short reason
          <input disabled={disabled || busy} onChange={(event) => setReason(event.target.value)} value={reason} />
        </label> : null}
      </div> : null}
      {needsConfirmation ? <div className="chat-card-actions"><button className="btn primary compact" disabled={disabled || busy || (decisionConfirmation && (!disposition || (reasonRequired && !reason.trim())))} onClick={() => void confirm()} type="button">{busy ? "Recording…" : operationActionLabel(result.operation)}</button></div> : null}
      {recorded && onOpenDocument && changedRecords.length ? <div className="chat-card-actions">
        {changedRecords.map((record) => <button className="btn tiny quiet" key={record.path} onClick={() => onOpenDocument(record.path)} type="button">Open {record.label}</button>)}
      </div> : null}
    </section>
  );
}

function operationActionLabel(operation: string): string {
  const labels: Record<string, string> = {
    approve_response: "Approve response",
    mark_response_sent: "Record manual delivery",
    mark_as_sent: "Record manual delivery",
    close_matter: "Close matter",
    record_decision: "Record decision",
  };
  return labels[operation] ?? "Confirm action";
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

function WorkProductCard({ card, onOpenDocument, currentWorkProductDraftPath }: {
  card: Extract<ChatCard, { type: "work_product" }>;
  onOpenDocument?: (path: string) => void;
  currentWorkProductDraftPath?: string | null;
}) {
  const targetPath = card.vault_path;
  return (
    <section className="chat-card work-product-card">
      <div className="chat-card-kicker">Work Product · {card.preview ? "Preview · Not kept" : card.state === "final" ? "Final" : "Draft"}</div>
      <div className="chat-card-summary">{card.title}</div>
      {card.summary ? <div className="chat-card-detail">{card.summary}</div> : null}
      <div className="chat-card-actions">
        {onOpenDocument ? <button className="btn tiny quiet" onClick={() => onOpenDocument(targetPath)} type="button">Open artifact</button> : null}
      </div>
    </section>
  );
}

type Question = Extract<ChatCard, { type: "question" }>;
type QuestionDraft = { selected: string[]; freeText: string; selectedDetail: string };
type SavedAnswer = { action: "answer" | "skip"; values: string[]; text: string };

const EMPTY_DRAFT: QuestionDraft = { selected: [], freeText: "", selectedDetail: "" };

function QuestionHistoryCard({ card, status }: { card: Question; status: HistoricalQuestionState }) {
  const labels = status.values.map((value) => (
    card.choices.find((choice) => choice.value === value)?.label ?? value
  )).filter((value, index, values) => value && values.indexOf(value) === index);
  const stateLabel = status.state === "answered" ? "Answered"
    : status.state === "stopped" ? "Stopped"
    : status.state === "superseded" ? "Superseded" : "Earlier question";
  const detail = status.state === "answered"
    ? labels.join(" · ") || "Answer saved"
    : status.state === "stopped"
      ? "Intake stopped before this question was answered."
      : status.state === "superseded" ? "This question was skipped or replaced by later intake work."
      : "This question is part of the earlier intake history.";
  return (
    <section className="chat-card question-card" aria-label={`${stateLabel}: ${card.text}`}>
      <div className="question-meta"><span>{stateLabel}</span></div>
      <div className="chat-card-summary">{card.text}</div>
      <div className="chat-card-detail">{detail}</div>
    </section>
  );
}

function QuestionSequence({ cards, disabled, mode, onModeChange, onAction, showModeControl }: {
  cards: Question[];
  disabled?: boolean;
  mode: QuestionMode;
  onModeChange?: (mode: QuestionMode) => void;
  onAction: Props["onAction"];
  showModeControl?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, QuestionDraft>>({});
  const [answers, setAnswers] = useState<Record<string, SavedAnswer>>({});
  const current = cards[Math.min(currentIndex, cards.length - 1)];
  const draft = drafts[current.question_id] ?? EMPTY_DRAFT;

  function updateDraft(next: QuestionDraft) {
    setDrafts((saved) => ({ ...saved, [current.question_id]: next }));
  }

  async function submitSet(nextAnswers: Record<string, SavedAnswer>, stopAfterAnswers = false) {
    const answeredQuestions = cards.filter((question) => nextAnswers[question.question_id]);
    if (!answeredQuestions.length) {
      await onAction({ card_id: current.question_id, action: stopAfterAnswers ? "stop" : "skip" });
      return;
    }
    await onAction({
      card_id: `intake-set:${answeredQuestions.map((question) => question.question_id).join(":")}`,
      action: "answer_set",
      answers: answeredQuestions.map((question) => ({
        card_id: question.question_id,
        action: nextAnswers[question.question_id].action,
        values: nextAnswers[question.question_id].values,
      })),
    }, groupedAnswerText(answeredQuestions, nextAnswers, stopAfterAnswers));
  }

  async function handleQuestionAction(action: CardAction, answerText?: string) {
    if (action.action === "stop") {
      if (mode === "set" && Object.keys(answers).length) await submitSet(answers, true);
      else await onAction(action, answerText);
      return;
    }
    if (action.action !== "answer" && action.action !== "skip") return;
    const savedAnswer: SavedAnswer = {
      action: action.action,
      values: action.values ?? [],
      text: answerText ?? "",
    };
    const nextAnswers = { ...answers, [current.question_id]: savedAnswer };

    if (mode === "guided") {
      if (Object.keys(answers).length) await submitSet(nextAnswers);
      else await onAction(action, answerText);
      return;
    }

    setAnswers(nextAnswers);
    if (currentIndex < cards.length - 1) setCurrentIndex((index) => index + 1);
    else await submitSet(nextAnswers);
  }

  return (
    <div className="question-sequence">
      {showModeControl ? <div className="question-mode-control">
        {cards.length > 1 ? <p>Answer one question at a time, or choose Answer a set to send this prioritized group together.</p> : null}
        <div>
          <strong>Question style</strong>
          <span>{mode === "guided" ? "Discuss each answer before the next question." : `Answer this prioritized set of ${cards.length}, then send it together.`}</span>
        </div>
        <div className="question-mode-options" role="group" aria-label="Question style">
          <button aria-pressed={mode === "guided"} className={mode === "guided" ? "active" : ""} disabled={disabled} onClick={() => onModeChange?.("guided")} type="button">Guided</button>
          <button aria-pressed={mode === "set"} className={mode === "set" ? "active" : ""} disabled={disabled} onClick={() => onModeChange?.("set")} type="button">Answer a set</button>
        </div>
      </div> : null}
      <QuestionCard
        card={current}
        current={mode === "set" ? currentIndex + 1 : undefined}
        disabled={disabled}
        draft={draft}
        key={current.question_id}
        onAction={handleQuestionAction}
        onBack={mode === "set" && currentIndex > 0 ? () => setCurrentIndex((index) => index - 1) : undefined}
        onDraftChange={updateDraft}
        primaryLabel={mode === "set" ? (currentIndex === cards.length - 1 ? "Send answers" : "Next") : "Send answer"}
        total={mode === "set" ? cards.length : undefined}
      />
    </div>
  );
}

function QuestionCard({ card, current, disabled, draft, onAction, onBack, onDraftChange, primaryLabel, total }: {
  card: Question;
  current?: number;
  disabled?: boolean;
  draft: QuestionDraft;
  onAction: Props["onAction"];
  onBack?: () => void;
  onDraftChange: (draft: QuestionDraft) => void;
  primaryLabel: string;
  total?: number;
}) {
  const { selected, freeText, selectedDetail } = draft;
  const progress = questionProgressLabel(card.progress_current, card.progress_total);
  const mode = effectiveQuestionMode(card.selection_mode, card.choices.length);

  function answer(values: string[], text?: string) {
    const cleanValues = values.map((value) => value.trim()).filter(Boolean);
    if (!cleanValues.length || disabled) return;
    void onAction({ card_id: card.question_id, action: "answer", values: cleanValues }, text);
  }

  function freeTextKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      answer([freeText.trim()], freeText.trim());
    }
  }

  const selectedChoices = card.choices.filter((choice) => selected.includes(choice.value));
  const selectedChoice = selectedChoices[0];
  const detailRequired = selectedChoices.some((choice) => choiceNeedsDetail(choice.value, choice.label));

  function submitSelection() {
    if (!selectedChoice || (detailRequired && !selectedDetail.trim())) return;
    const detail = selectedDetail.trim();
    answer(
      detail ? [selectedChoice.value, detail] : [selectedChoice.value],
      detail ? `${selectedChoice.label}: ${detail}` : selectedChoice.label,
    );
  }

  function submitMultiple() {
    if (!selected.length || (detailRequired && !selectedDetail.trim())) return;
    const detail = selectedDetail.trim();
    const labels = selectedChoices.map((choice) => choice.label);
    answer(
      detail ? [...selected, detail] : selected,
      detail ? `${labels.join(", ")}: ${detail}` : labels.join(", "),
    );
  }

  return (
    <section className={`chat-card question-card ${card.conflict ? "conflict" : ""}`} aria-labelledby={`question-${card.question_id}`}>
      <div className="question-meta"><span>{current && total ? `${current} of ${total} · Priority order` : progress === "Follow-up" ? "Follow-up question" : progress}</span>{card.conflict ? <span>Factual conflict</span> : null}</div>
      <div className="question-title-row">
        <div className="chat-card-summary" id={`question-${card.question_id}`}>{card.text}</div>
        {card.reason ? (
          <details className="reason-control">
            <summary aria-label="Why this question is useful">i</summary>
            <div role="note">{card.reason}</div>
          </details>
        ) : null}
      </div>

      {mode === "free_text" ? (
        <div className="question-free-text">
          <input aria-label="Answer" className="text-input" disabled={disabled} onChange={(event) => onDraftChange({ ...draft, freeText: event.target.value })} onKeyDown={freeTextKeyDown} value={freeText} />
          <button className="btn primary compact" disabled={disabled || !freeText.trim()} onClick={() => answer([freeText.trim()], freeText.trim())}>{primaryLabel}</button>
        </div>
      ) : (
        <fieldset className="question-choices">
          <legend className="sr-only">{card.text}</legend>
          {card.choices.map((choice) => {
            const active = selected.includes(choice.value);
            return (
              <label className={`question-choice ${active ? "active" : ""}`} key={choice.value}>
                <input
                  checked={active}
                  disabled={disabled}
                  name={`question-${card.question_id}`}
                  onChange={() => {
                    if (mode === "single") onDraftChange({ ...draft, selected: [choice.value], selectedDetail: "" });
                    else onDraftChange({ ...draft, selected: active ? selected.filter((value) => value !== choice.value) : [...selected, choice.value] });
                  }}
                  type={mode === "single" ? "radio" : "checkbox"}
                  value={choice.value}
                />
                <span>{choice.label}</span>{choice.suggested ? <span className="suggested-label">Suggested</span> : null}
              </label>
            );
          })}
        </fieldset>
      )}

      {mode !== "free_text" && detailRequired ? (
        <div className="question-free-text">
          <input
            aria-label={`Add detail for ${selectedChoice?.label ?? "this choice"}`}
            autoFocus
            className="text-input"
            disabled={disabled}
            onChange={(event) => onDraftChange({ ...draft, selectedDetail: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && selectedDetail.trim()) {
                event.preventDefault();
                if (mode === "multiple") submitMultiple();
                else submitSelection();
              }
            }}
            placeholder="Add a short clarification"
            value={selectedDetail}
          />
        </div>
      ) : null}

      <div className="chat-card-actions">
        {onBack ? <button className="btn tiny quiet" disabled={disabled} onClick={onBack}>Back</button> : null}
        {mode === "single" ? <button className="btn primary compact" disabled={disabled || !selected.length || (detailRequired && !selectedDetail.trim())} onClick={submitSelection}>{primaryLabel}</button> : null}
        {mode === "multiple" ? <button className="btn primary compact" disabled={disabled || !selected.length || (detailRequired && !selectedDetail.trim())} onClick={submitMultiple}>{primaryLabel}</button> : null}
        {card.allow_skip ? <button className="btn tiny quiet" disabled={disabled} onClick={() => void onAction({ card_id: card.question_id, action: "skip" })}>Skip</button> : null}
        {card.allow_stop ? <button className="btn tiny quiet" disabled={disabled} onClick={() => void onAction({ card_id: card.question_id, action: "stop" })}>Finish intake</button> : null}
      </div>
    </section>
  );
}

function ResearchCard({ card, matterId, onRefresh }: { card: Extract<ChatCard, { type: "research_status" }>; matterId?: string; onRefresh?: Props["onRefresh"] }) {
  const [run, setRun] = useState<ResearchRun | Extract<ChatCard, { type: "research_status" }>>(card);
  const refreshedRunId = useRef<string | null>(null);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;
  useEffect(() => {
    if (!matterId) return;
    let cancelled = false;
    let timer: number | undefined;
    const check = () => void getResearchRun(matterId, card.run_id).then(async (next) => {
      if (cancelled) return;
      setRun(next);
      if (["queued", "running"].includes(next.state)) {
        timer = window.setTimeout(check, 2000);
      } else if (refreshedRunId.current !== next.run_id) {
        refreshedRunId.current = next.run_id;
        await onRefreshRef.current?.();
      }
    }).catch(() => undefined);
    check();
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [card.run_id, matterId]);
  const active = run.state === "queued" || run.state === "running";
  return (
    <details className="chat-card research-card">
      <summary>
        <span className={`research-indicator ${active ? "active" : ""}`} aria-hidden="true" />
        <span><span className="chat-card-kicker">First-pass research · {{ queued: "Queued", running: "Working", completed: "Completed", failed: "Failed", interrupted: "Interrupted" }[run.state]}</span><span className="chat-card-summary">{run.status}</span></span>
        <span className="research-progress">{run.completed}/{run.total}</span>
      </summary>
      <div className="chat-card-detail">{run.dossier_effect || "No dossier change is recorded yet."}</div>
    </details>
  );
}


/** Direct controls share durable activity with the existing conversation. */
export function WorkspaceReceiptCards({ receipts = [], onOpenDocument }: { receipts?: InteractionReceipt[]; onOpenDocument?: (path: string) => void }) {
  const direct = receipts.filter(receipt => !receipt.source_message_id);
  if (!direct.length) return null;
  const labels: Record<string, string> = {
    change_business_question: "Business question saved",
    propose_business_question: "Question reframe proposed",
    apply_question_proposal: "Question proposal applied",
    reject_question_proposal: "Question proposal rejected",
    restore_business_question: "Previous question restored as a new version",
    answer_question: "Supporting question updated",
  };
  return <section aria-label="Saved workspace activity">
    {direct.map(receipt => <div className={`chat-card ${receipt.state === "not_saved" ? "wash-failure" : receipt.state === "proposed" ? "wash-agent" : "wash-healthy"}`} key={receipt.receipt_id}>
      <strong>{receipt.state === "not_saved" ? ((receipt.completed_parts ?? []).includes("reported_fact") ? "Fact saved. Question update not saved." : "Change not saved") : labels[receipt.operation] ?? "Workspace change saved"}</strong>
      {receipt.created_at ? <p>{new Date(receipt.created_at).toLocaleString()}</p> : null}
      {(receipt.changed_links ?? []).slice(0, 1).map(path => <button className="btn tiny quiet" key={path} type="button" onClick={() => onOpenDocument?.(path)}>Open saved record</button>)}
    </div>)}
  </section>;
}
