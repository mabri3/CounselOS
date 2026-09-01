"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AttachmentPicker from "@/components/AttachmentPicker";
import ChatCards from "@/components/ChatCards";
import SkillCommandMenu from "@/components/SkillCommandMenu";
import LinkifiedText from "@/components/LinkifiedText";
import UploadIntentCard from "@/components/UploadIntentCard";
import { getChatRun, getConversation, getConversations, getSkills, recoverIntakeQuestion, retryChatRun, saveWorkProductDraft, startChatRun, uploadDocuments } from "@/lib/api";
import { chatAgentId, chatDraftStorageKey, chatRunStateLabel, chatRunStorageKey, historicalQuestionStates, legacyChatDraftStorageKey, legacyChatRunStorageKey, mergeChatMessages, needsIntakeQuestionRecovery, pendingChatRunId, rememberChatRun, remainingComposerValue, safeChatFailureDetail, shouldShowChatRunStatus } from "@/lib/chatRunLogic";
import { legacyQuestionModeStorageKey, questionModeStorageKey } from "@/lib/chatCardLogic";
import { skillBuilderGoal } from "@/lib/skills";
import { mutationFailureMessages, mutationOutcome } from "@/lib/matterBrief";
import type { AppliedSkillSummary, AttachmentReference, CardAction, ChatCard, ChatRun, QuestionMode, SkillDefinition, ToolTrace } from "@/lib/types";

type Message = { message_id?: string; role: "user" | "assistant"; content: string; trace?: ToolTrace[]; cards?: ChatCard[]; attachments?: AttachmentReference[]; applied_skills?: AppliedSkillSummary[]; card_action?: CardAction | null };

const SUGGESTIONS = [
  "Compare both paths",
  "Which other matters does this touch?",
  "What would change your view?",
];
const SHOW_AGENT_TRACES = process.env.NEXT_PUBLIC_SHOW_AGENT_TRACES === "true";

/**
 * Canvas 2b — the copilot is a thread at the foot of the matter, not a pane of
 * its own. Its last line never moves: it can research, draft and move the
 * matter; it records a decision only on explicit instruction.
 */
export default function ChatPanel({
  matterId,
  matterTitle,
  activeFile,
  activeAgentId,
  initialConversationId,
  initialRunId,
  intakeActive = false,
  onRefresh,
  conversationSeed,
  onConversationChange,
  onOpenDocument,
  seed,
  reviewAuthor,
  lawyerAuthor,
  onReviewAuthorChange,
  currentWorkProductDraftPath,
}: {
  matterId: string;
  matterTitle: string;
  activeFile: string | null;
  activeAgentId?: string | null;
  initialConversationId?: string | null;
  initialRunId?: string | null;
  intakeActive?: boolean;
  onRefresh: () => Promise<void>;
  conversationSeed?: { conversationId: string; revision: number };
  onConversationChange?: (conversationId: string | null) => void;
  onOpenDocument?: (path: string) => void;
  seed?: { text: string; revision: number };
  reviewAuthor: string;
  lawyerAuthor: string;
  onReviewAuthorChange: (name: string) => void;
  currentWorkProductDraftPath?: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState(seed?.text ?? "");
  const [busy, setBusy] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [attachments, setAttachments] = useState<AttachmentReference[]>([]);
  const [uploading, setUploading] = useState(false);
  const [skills, setSkills] = useState<SkillDefinition[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeRun, setActiveRun] = useState<ChatRun | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [refreshingRun, setRefreshingRun] = useState(false);
  const [questionMode, setQuestionMode] = useState<QuestionMode>("guided");
  const [savingAnswerKey, setSavingAnswerKey] = useState<string | null>(null);
  const [savedAnswerPaths, setSavedAnswerPaths] = useState<Record<string, string>>({});
  const [savedAnswerNotices, setSavedAnswerNotices] = useState<Record<string, string>>({});
  const [saveAnswerErrors, setSaveAnswerErrors] = useState<Record<string, string>>({});
  const completedRuns = useRef(new Set<string>());
  const refreshedRuns = useRef(new Set<string>());
  const intakeRecoveryAttempts = useRef(new Set<string>());

  useEffect(() => {
    if (!busy) { setElapsedSeconds(0); return; }
    const parsed = Date.parse(activeRun?.started_at || activeRun?.created_at || "");
    const started = Number.isFinite(parsed) ? parsed : Date.now();
    const update = () => setElapsedSeconds(Math.max(0, Math.floor((Date.now() - started) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [activeRun?.created_at, activeRun?.started_at, busy]);

  useEffect(() => { void getSkills().then(({ skills: saved }) => setSkills(saved)).catch(() => setSkills([])); }, []);

  useEffect(() => {
    if (seed?.text) return;
    const saved = window.localStorage.getItem(chatDraftStorageKey(matterId))
      ?? window.localStorage.getItem(legacyChatDraftStorageKey(matterId));
    if (saved) window.localStorage.setItem(chatDraftStorageKey(matterId), saved);
    setInput(saved ?? "");
  }, [matterId, seed?.text]);

  useEffect(() => {
    if (input) window.localStorage.setItem(chatDraftStorageKey(matterId), input);
    else window.localStorage.removeItem(chatDraftStorageKey(matterId));
    window.localStorage.removeItem(legacyChatDraftStorageKey(matterId));
  }, [input, matterId]);

  useEffect(() => {
    const saved = window.localStorage.getItem(questionModeStorageKey(matterId))
      ?? window.localStorage.getItem(legacyQuestionModeStorageKey(matterId));
    if (saved) window.localStorage.setItem(questionModeStorageKey(matterId), saved);
    setQuestionMode(saved === "set" ? "set" : "guided");
  }, [matterId]);

  function changeQuestionMode(mode: QuestionMode) {
    setQuestionMode(mode);
    window.localStorage.setItem(questionModeStorageKey(matterId), mode);
    window.localStorage.removeItem(legacyQuestionModeStorageKey(matterId));
  }

  useEffect(() => {
    let cancelled = false;
    setLoadingHistory(true);
    setHistoryError("");
    void getConversations(matterId)
      .then(async ({ conversations: saved }) => {
        if (cancelled) return;
        const targetConversationId = initialConversationId || saved[0]?.conversation_id;
        if (!targetConversationId) {
          setConversationId(null);
          setMessages([]);
          return;
        }
        const conversation = await getConversation(matterId, targetConversationId);
        if (!cancelled) {
          setConversationId(conversation.conversation_id);
          setMessages(conversation.messages);
          onConversationChange?.(conversation.conversation_id);
        }
      })
      .catch((caught) => {
        if (!cancelled) setHistoryError(caught instanceof Error ? caught.message : "Could not load saved chat.");
      })
      .finally(() => { if (!cancelled) setLoadingHistory(false); });
    return () => { cancelled = true; };
  }, [initialConversationId, matterId]);

  const finishRun = useCallback(async (run: ChatRun) => {
    setActiveRun(run);
    setWaiting(false);
    if (run.state !== "completed" || completedRuns.current.has(run.run_id)) {
      setBusy(false);
      return;
    }
    setBusy(false);
    completedRuns.current.add(run.run_id);
    setRefreshingRun(true);
    if (run.response?.review_author) onReviewAuthorChange(run.response.review_author);
    const nextConversationId = run.response?.conversation_id ?? run.conversation_id;
    if (nextConversationId) {
      try {
        const saved = await getConversation(matterId, nextConversationId);
        setConversationId(saved.conversation_id);
        setMessages((current) => mergeChatMessages(current, saved.messages));
        onConversationChange?.(saved.conversation_id);
      } catch {
        if (run.response) setMessages((current) => current.some((item) => item.role === "assistant" && item.content === run.response?.reply)
          ? current
          : [...current, { role: "assistant", content: run.response!.reply, trace: run.response!.trace, cards: run.response!.cards, applied_skills: run.response!.applied_skills }]);
      }
    } else if (run.response && !messages.some((item) => item.role === "assistant" && item.content === run.response?.reply)) {
      setMessages((current) => [...current, { role: "assistant", content: run.response!.reply, trace: run.response!.trace, cards: run.response!.cards, applied_skills: run.response!.applied_skills }]);
    }
    window.localStorage.removeItem(chatRunStorageKey(matterId, run.conversation_id));
    window.localStorage.removeItem(chatRunStorageKey(matterId));
    window.localStorage.removeItem(legacyChatRunStorageKey(matterId, run.conversation_id));
    window.localStorage.removeItem(legacyChatRunStorageKey(matterId));
    if (!refreshedRuns.current.has(run.run_id)) {
      refreshedRuns.current.add(run.run_id);
      try {
        await onRefresh();
      } finally {
        setRefreshingRun(false);
        setBusy(false);
      }
      return;
    }
    setRefreshingRun(false);
    setBusy(false);
  }, [matterId, messages, onConversationChange, onRefresh, onReviewAuthorChange]);

  useEffect(() => {
    if (!activeRun || !waiting || !["queued", "running"].includes(activeRun.state)) return;
    let cancelled = false;
    const check = async () => {
      try {
        const next = await getChatRun(matterId, activeRun.run_id);
        if (cancelled) return;
        setActiveRun(next);
        if (!["queued", "running"].includes(next.state)) await finishRun(next);
      } catch {
        if (!cancelled) setHistoryError("Themis.ai could not finish this request.");
        setWaiting(false);
        setBusy(false);
      }
    };
    void check();
    const timer = window.setInterval(() => void check(), 2000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [activeRun?.run_id, activeRun?.state, finishRun, matterId, waiting]);

  useEffect(() => {
    if (!seed?.text) return;
    setInput(seed.text);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [seed]);

  useEffect(() => {
    if (conversationSeed?.revision) void openConversation(conversationSeed.conversationId);
  }, [conversationSeed]);

  useEffect(() => {
    if (loadingHistory) return;
    const runId = pendingChatRunId(window.localStorage, matterId, conversationId) ?? initialRunId;
    if (!runId || activeRun?.run_id === runId || completedRuns.current.has(runId)) return;
    setBusy(true);
    setWaiting(true);
    void getChatRun(matterId, runId).then(async (run) => {
      rememberChatRun(window.localStorage, matterId, run);
      setActiveRun(run);
      if (!["queued", "running"].includes(run.state)) await finishRun(run);
    }).catch(() => {
      setHistoryError("Themis.ai could not finish this request.");
      setBusy(false);
      setWaiting(false);
    });
  }, [activeRun?.run_id, conversationId, finishRun, initialRunId, loadingHistory, matterId]);

  useEffect(() => {
    if (
      loadingHistory || busy || refreshingRun || !conversationId
      || (initialConversationId && conversationId !== initialConversationId)
      || !needsIntakeQuestionRecovery(intakeActive, messages)
    ) return;
    const latest = messages.at(-1);
    const recoveryKey = `${conversationId}:${latest?.message_id ?? messages.length}`;
    if (intakeRecoveryAttempts.current.has(recoveryKey)) return;
    intakeRecoveryAttempts.current.add(recoveryKey);
    setBusy(true);
    setWaiting(true);
    setHistoryError("");
    void recoverIntakeQuestion(matterId, conversationId).then(async (run) => {
      setActiveRun(run);
      setWaiting(["queued", "running"].includes(run.state));
      rememberChatRun(window.localStorage, matterId, run);
      if (!["queued", "running"].includes(run.state)) await finishRun(run);
    }).catch(() => {
      setHistoryError("Themis.ai could not restore the next intake question.");
      setBusy(false);
      setWaiting(false);
    });
  }, [busy, conversationId, finishRun, initialConversationId, intakeActive, loadingHistory, matterId, messages, refreshingRun]);

  async function submit(
    text: string,
    cardAction?: CardAction,
    actionAttachments: AttachmentReference[] = attachments,
    consumeInput = false,
    consumeAttachments = actionAttachments === attachments,
  ) {
    const trimmed = text.trim();
    if ((!trimmed && !cardAction && !actionAttachments.length) || busy) return;
    const builderGoal = !cardAction ? skillBuilderGoal(text) : null;
    if (builderGoal) {
      router.push(`/skills?goal=${encodeURIComponent(builderGoal)}`);
      return;
    }
    const visibleText = trimmed || cardActionText(cardAction) || `Attached ${actionAttachments.map((item) => item.name).join(", ")}`;
    const previousInput = input;
    const previousAttachments = attachments;
    setMessages((current) => [...current, { role: "user", content: visibleText, attachments: actionAttachments, card_action: cardAction }]);
    setBusy(true);
    try {
      const run = await startChatRun(matterId, {
        message: trimmed,
        matter_id: matterId,
        active_file: activeFile,
        agent_id: chatAgentId(intakeActive, activeAgentId),
        conversation_id: conversationId,
        history: messages.slice(-8).map(({ role, content }) => ({ role, content })),
        card_action: cardAction,
        attachments: actionAttachments,
        review_author: reviewAuthor,
        lawyer_author: lawyerAuthor,
      });
      setActiveRun(run);
      setInput((current) => remainingComposerValue(current, previousInput, consumeInput, ""));
      setAttachments((current) => remainingComposerValue(current, previousAttachments, consumeAttachments, []));
      setWaiting(["queued", "running"].includes(run.state));
      rememberChatRun(window.localStorage, matterId, run);
      if (run.conversation_id) {
        const saved = await getConversation(matterId, run.conversation_id);
        setConversationId(saved.conversation_id);
        setMessages((current) => mergeChatMessages(current, saved.messages));
        onConversationChange?.(saved.conversation_id);
      }
      if (!["queued", "running"].includes(run.state)) await finishRun(run);
    } catch (caught) {
      setBusy(false);
      setWaiting(false);
      setHistoryError("Themis.ai could not finish this request.");
    }
  }

  async function handleCardAction(action: CardAction, answerText?: string) {
    await submit(answerText ?? "", action, [], false, false);
  }

  async function addFiles(files: File[]) {
    setUploading(true);
    setHistoryError("");
    try {
      const result = await uploadDocuments(matterId, files);
      const refs = attachmentsFromUploadResult(result);
      setAttachments(refs);
      await onRefresh();
    } catch (caught) {
      setHistoryError(caught instanceof Error ? caught.message : "Could not upload the selected files.");
    } finally { setUploading(false); }
  }

  async function openConversation(nextId: string) {
    setActiveRun(null);
    setWaiting(false);
    setBusy(false);
    if (!nextId) {
      setConversationId(null);
      setMessages([]);
      setInput("");
      setAttachments([]);
      setHistoryError("");
      onConversationChange?.(null);
      return;
    }
    setLoadingHistory(true);
    setHistoryError("");
    try {
      const conversation = await getConversation(matterId, nextId);
      setConversationId(conversation.conversation_id);
      setMessages(conversation.messages);
      onConversationChange?.(conversation.conversation_id);
    } catch (caught) {
      setHistoryError(caught instanceof Error ? caught.message : "Could not load saved chat.");
    } finally {
      setLoadingHistory(false);
    }
  }

  async function retryRun() {
    if (!activeRun || !["failed", "interrupted"].includes(activeRun.state)) return;
    setBusy(true); setWaiting(true); setHistoryError("");
    try {
      const next = await retryChatRun(matterId, activeRun.run_id);
      setActiveRun(next);
      setWaiting(["queued", "running"].includes(next.state));
      rememberChatRun(window.localStorage, matterId, next);
      if (!["queued", "running"].includes(next.state)) await finishRun(next);
    } catch {
      setBusy(false); setWaiting(false); setHistoryError("Themis.ai could not finish this request.");
    }
  }

  async function saveAssistantAnswer(content: string, key: string) {
    setSavingAnswerKey(key);
    setSaveAnswerErrors((current) => ({ ...current, [key]: "" }));
    try {
      const saved = await saveWorkProductDraft(matterId, `${matterTitle} response`, content, `chat-save:${matterId}:${key}`);
      setSavedAnswerPaths((current) => ({ ...current, [key]: saved.vault_path }));
      setSavedAnswerNotices((current) => ({
        ...current,
        [key]: saved.changed_paths.length
          ? "Current draft saved."
          : "This current draft already exists. No new save was made.",
      }));
      try {
        await onRefresh();
      } catch {
        setSaveAnswerErrors((current) => ({
          ...current,
          [key]: "Draft saved, but the matter did not refresh. Open the saved draft or reload the page.",
        }));
      }
      onOpenDocument?.(saved.vault_path);
    } catch (caught) {
      setSaveAnswerErrors((current) => ({
        ...current,
        [key]: caught instanceof Error ? caught.message : "Could not save this answer as work product.",
      }));
    } finally {
      setSavingAnswerKey(null);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit(input, undefined, attachments, true, true);
    }
  }

  const readingInitialRequest = Boolean(
    initialRunId
      && activeRun?.run_id === initialRunId
      && ["queued", "running"].includes(activeRun.state),
  );

  return (
    <div className="chat-panel">
      {historyError ? <p className="error chat-history-status">{historyError}</p> : null}
      {loadingHistory ? <p className="chat-history-status">Loading saved chat…</p> : null}
      {activeRun && shouldShowChatRunStatus(activeRun.state) ? (
        <section className={`chat-card ${activeRun.state === "failed" || activeRun.state === "interrupted" ? "wash-failure" : "wash-agent"}`} role="status">
          <div className="chat-card-kicker">Themis.ai · {chatRunStateLabel(activeRun.state)}</div>
          {activeRun.state === "failed" || activeRun.state === "interrupted" ? (
            <>
              <div className="chat-card-summary">Themis.ai could not finish this request.</div>
              {safeChatFailureDetail(activeRun.failure_detail) ? <div className="chat-card-detail">{safeChatFailureDetail(activeRun.failure_detail)}</div> : null}
              {activeRun.response?.reply ? <div className="chat-card-detail">{mutationFailureMessages(activeRun.response.trace).map((summary) => <div className="error" role="alert" key={summary}><strong>Workspace change failed</strong> — {summary}</div>)}<strong>Saved response</strong><ReactMarkdown remarkPlugins={[remarkGfm]}>{activeRun.response.reply}</ReactMarkdown></div> : null}
            </>
          ) : <div className="chat-card-summary">{readingInitialRequest ? "Themis.ai is reading your request…" : activeRun.status}</div>}
          <div className="chat-card-actions">
            {["failed", "interrupted"].includes(activeRun.state) ? <button className="btn tiny quiet" disabled={busy} onClick={() => void retryRun()}>Retry</button> : null}
            {waiting && ["queued", "running"].includes(activeRun.state) ? <button className="btn tiny quiet" onClick={() => { setWaiting(false); setBusy(false); }}>Stop showing progress</button> : null}
          </div>
          {waiting && ["queued", "running"].includes(activeRun.state) ? <div className="chat-card-detail">Server work continues if you stop waiting.</div> : null}
        </section>
      ) : null}
      {messages.length ? (
        <div className="thread">
          {messages.map((message, index) => {
            const messageKey = message.message_id ?? String(index);
            const questionIds = message.cards?.flatMap((card) => card.type === "question" ? [card.question_id] : []) ?? [];
            const questionStates = historicalQuestionStates(messages, index, questionIds, intakeActive);
            const mutationFailures = mutationFailureMessages(message.trace);
            const mutationResult = mutationOutcome(message.trace, message.cards);
            return message.role === "user" ? (
              <UserMessage
                appliedSkill={messages[index + 1]?.role === "assistant" ? messages[index + 1].applied_skills?.[0] : undefined}
                content={message.content}
                cardAction={message.card_action}
                key={messageKey}
              />
            ) : (
              <div className="assistant-message" key={messageKey}>
                {message.applied_skills?.map((skill) => <div className="applied-skill-label" key={skill.skill_id}>Applied skill: {skill.name}</div>)}
                <div className="agent-label">Themis.ai</div>
                <div className="bubble-agent">
                  {mutationFailures.map((summary) => <div className="error" role="alert" key={summary}><strong>Workspace change failed</strong> — {summary}</div>)}
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  <ChatCards cards={message.cards} currentWorkProductDraftPath={currentWorkProductDraftPath} disabled={busy} matterId={matterId} onAction={handleCardAction} onOpenDocument={onOpenDocument} onQuestionModeChange={changeQuestionMode} onRefresh={onRefresh} questionMode={questionMode} questionStates={questionStates} showQuestionMode={intakeActive} />
                  {mutationResult === "recorded" ? (
                    <div className="mutation-status recorded">Workspace state change recorded</div>
                  ) : mutationResult === "no_change" && mutationFailures.length === 0 ? (
                    <div className="mutation-status no-change">No workspace state change recorded</div>
                  ) : null}
                  {SHOW_AGENT_TRACES && message.trace?.length ? (
                    <details className="chat-actions">
                      <summary>Actions taken ({message.trace.length})</summary>
                      <div className="trace-list">
                        {message.trace.map((item, traceIndex) => (
                          <div className="trace-item" key={traceIndex}>
                            <span style={{ flex: "none", color: item.status === "success" ? "var(--healthy)" : "var(--failure)" }}>
                              {item.status === "success" ? "✓" : "!"}
                            </span>
                            <span style={{ flex: 1 }}><LinkifiedText text={item.summary} /></span>
                          </div>
                        ))}
                      </div>
                    </details>
                  ) : null}
                  {saveAnswerErrors[messageKey] ? <div className="error chat-card-detail" role="alert">{saveAnswerErrors[messageKey]}</div> : null}
                  {savedAnswerPaths[messageKey] ? (
                    <div className="mutation-status recorded">
                      {savedAnswerNotices[messageKey]} <button className="text-button" onClick={() => onOpenDocument?.(savedAnswerPaths[messageKey])} type="button">Open draft</button>
                    </div>
                  ) : message.content.trim().length > 80 ? (
                    <button
                      className="btn tiny quiet"
                      disabled={busy || savingAnswerKey !== null}
                      onClick={() => void saveAssistantAnswer(message.content, messageKey)}
                      type="button"
                    >
                      {savingAnswerKey === messageKey ? "Saving…" : "Save as work product"}
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
          {busy ? (
            <div className="agent-label" role="status">
              <span className="agent-mark" style={{ width: 12, height: 12 }} />
              {readingInitialRequest ? "Themis.ai is reading your request…" : elapsedSeconds < 10 ? "Working…" : "Still working…"} {elapsedSeconds}s
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="composer">
        {seed?.text && input === seed.text ? (
          <div className="composer-note" role="status"><strong>Prepared request · Not sent.</strong> Review it, then select Send.</div>
        ) : null}
        <UploadIntentCard attachments={attachments} busy={busy} onClear={() => setAttachments([])} onSend={(intent) => submit(intent, undefined, attachments, false, true)} />
        <div className="composer-suggestions">
          {SUGGESTIONS.map((suggestion) => (
            <button className="suggestion" disabled={busy} key={suggestion} onClick={() => void submit(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
        <SkillCommandMenu input={input} skills={skills} onSelect={(skill) => { setInput(`/${skill.skill_id} `); requestAnimationFrame(() => inputRef.current?.focus()); }} />
        <div className="composer-field">
          <AttachmentPicker disabled={busy || uploading} onSelect={addFiles} />
          <textarea
            ref={inputRef}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask Themis.ai about ${matterTitle}…`}
            rows={1}
            value={input}
          />
          <button className="btn primary compact" disabled={busy || !input.trim()} onClick={() => void submit(input, undefined, attachments, true, true)}>
            {uploading ? "Uploading…" : "Send"}
          </button>
        </div>
        <div className="composer-note">
          Themis.ai can research, draft and move this matter. It records a decision only when you explicitly ask it to. <Link className="build-skill-link" href="/skills">Build a skill</Link>
        </div>
      </div>
    </div>
  );
}

function UserMessage({ content, appliedSkill, cardAction }: { content: string; appliedSkill?: AppliedSkillSummary; cardAction?: CardAction | null }) {
  const answer = cardAction?.action === "answer" || cardAction?.action === "answer_set" ? (
    <div className="mutation-status recorded"><strong>Answered</strong> · {(cardAction.values ?? cardAction.answers?.flatMap((item) => item.values) ?? []).join(" · ")}</div>
  ) : null;
  if (!appliedSkill || !content.trimStart().startsWith(`/${appliedSkill.skill_id}`)) {
    return <div className="bubble-you"><LinkifiedText text={content} />{answer}</div>;
  }
  const request = content.trimStart().slice(appliedSkill.skill_id.length + 1).trim();
  return (
    <div className="bubble-you skill-invocation" data-skill-id={appliedSkill.skill_id} title={`Stored command: ${content}`}>
      <span className="human-skill-label">Used {appliedSkill.name} skill</span>
      {request ? <LinkifiedText text={request} /> : null}
    </div>
  );
}

function cardActionText(action?: CardAction): string {
  if (!action) return "";
  if (action.action === "save_draft") return "Save this Watch as a draft";
  if (action.action === "scan_now") return "Scan this Watch now without starting its schedule";
  if (action.action === "scan_again") return "Scan this Watch again";
  if (action.action === "change_something") return "Change something in this Watch";
  if (action.action === "start_watch") return "Start this Watch and activate its schedule";
  if (action.action === "skip") return "Skip";
  if (action.action === "stop") return "No more questions";
  if (action.action === "undo") return "Undo that matter update";
  if (action.action === "edit") return "Edit that matter update";
  return action.values?.join(", ") ?? action.action;
}

function attachmentsFromUploadResult(result: Record<string, unknown>): AttachmentReference[] {
  if (Array.isArray(result.attachments)) return result.attachments as AttachmentReference[];
  if (Array.isArray(result.files)) {
    return result.files.filter((item): item is AttachmentReference => Boolean(item && typeof item === "object" && "path" in item && "name" in item));
  }
  throw new Error("The upload completed without attachment references.");
}
