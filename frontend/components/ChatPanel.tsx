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
import { getChatRun, getConversation, getConversations, getSkills, retryChatRun, startChatRun, uploadDocuments } from "@/lib/api";
import { chatAgentId, chatRunStateLabel, chatRunStorageKey, pendingChatRunId, rememberChatRun, safeChatFailureDetail, shouldShowChatRunStatus } from "@/lib/chatRunLogic";
import { questionModeStorageKey } from "@/lib/chatCardLogic";
import { skillBuilderGoal } from "@/lib/skills";
import { mutationOutcome } from "@/lib/matterBrief";
import type { AppliedSkillSummary, AttachmentReference, CardAction, ChatCard, ChatRun, QuestionMode, SkillDefinition, ToolTrace } from "@/lib/types";

type Message = { message_id?: string; role: "user" | "assistant"; content: string; trace?: ToolTrace[]; cards?: ChatCard[]; attachments?: AttachmentReference[]; applied_skills?: AppliedSkillSummary[] };

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
  const [questionMode, setQuestionMode] = useState<QuestionMode>("guided");
  const completedRuns = useRef(new Set<string>());
  const refreshedRuns = useRef(new Set<string>());

  useEffect(() => {
    if (!busy) { setElapsedSeconds(0); return; }
    const started = Date.now();
    const timer = window.setInterval(() => setElapsedSeconds(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [busy]);

  useEffect(() => { void getSkills().then(({ skills: saved }) => setSkills(saved)).catch(() => setSkills([])); }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(questionModeStorageKey(matterId));
    setQuestionMode(saved === "set" ? "set" : "guided");
  }, [matterId]);

  function changeQuestionMode(mode: QuestionMode) {
    setQuestionMode(mode);
    window.localStorage.setItem(questionModeStorageKey(matterId), mode);
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
    completedRuns.current.add(run.run_id);
    if (run.response?.review_author) onReviewAuthorChange(run.response.review_author);
    const nextConversationId = run.response?.conversation_id ?? run.conversation_id;
    if (nextConversationId) {
      try {
        const saved = await getConversation(matterId, nextConversationId);
        setConversationId(saved.conversation_id);
        setMessages(saved.messages);
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
    if (!refreshedRuns.current.has(run.run_id)) {
      refreshedRuns.current.add(run.run_id);
      try {
        await onRefresh();
      } finally {
        setBusy(false);
      }
      return;
    }
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
        if (!cancelled) setHistoryError("Themis could not finish this request.");
        setWaiting(false);
        setBusy(false);
      }
    };
    void check();
    const timer = window.setInterval(() => void check(), 2000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [activeRun?.run_id, activeRun?.state, finishRun, matterId, waiting]);

  useEffect(() => {
    if (seed?.text) setInput(seed.text);
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
      setHistoryError("Themis could not finish this request.");
      setBusy(false);
      setWaiting(false);
    });
  }, [activeRun?.run_id, conversationId, finishRun, initialRunId, loadingHistory, matterId]);

  async function submit(text: string, cardAction?: CardAction, actionAttachments: AttachmentReference[] = attachments) {
    const trimmed = text.trim();
    if ((!trimmed && !cardAction && !actionAttachments.length) || busy) return;
    const builderGoal = !cardAction ? skillBuilderGoal(text) : null;
    if (builderGoal) {
      router.push(`/skills?goal=${encodeURIComponent(builderGoal)}`);
      return;
    }
    const visibleText = trimmed || cardActionText(cardAction) || `Attached ${actionAttachments.map((item) => item.name).join(", ")}`;
    setInput("");
    setAttachments([]);
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
      setWaiting(["queued", "running"].includes(run.state));
      rememberChatRun(window.localStorage, matterId, run);
      if (run.conversation_id) {
        const saved = await getConversation(matterId, run.conversation_id);
        setConversationId(saved.conversation_id);
        setMessages(saved.messages);
        onConversationChange?.(saved.conversation_id);
      } else {
        setMessages((current) => [...current, { role: "user", content: visibleText, attachments: actionAttachments }]);
      }
      if (!["queued", "running"].includes(run.state)) await finishRun(run);
    } catch (caught) {
      setBusy(false);
      setWaiting(false);
      setHistoryError("Themis could not finish this request.");
    }
  }

  async function handleCardAction(action: CardAction, answerText?: string) {
    await submit(answerText ?? "", action, []);
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
      rememberChatRun(window.localStorage, matterId, next);
    } catch {
      setBusy(false); setWaiting(false); setHistoryError("Themis could not finish this request.");
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit(input);
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
          <div className="chat-card-kicker">Themis · {chatRunStateLabel(activeRun.state)}</div>
          {activeRun.state === "failed" || activeRun.state === "interrupted" ? (
            <>
              <div className="chat-card-summary">Themis could not finish this request.</div>
              {safeChatFailureDetail(activeRun.failure_detail) ? <div className="chat-card-detail">{safeChatFailureDetail(activeRun.failure_detail)}</div> : null}
              {activeRun.response?.reply ? <div className="chat-card-detail"><strong>Saved response</strong><ReactMarkdown remarkPlugins={[remarkGfm]}>{activeRun.response.reply}</ReactMarkdown></div> : null}
            </>
          ) : <div className="chat-card-summary">{readingInitialRequest ? "Themis is reading your request…" : activeRun.status}</div>}
          <div className="chat-card-actions">
            {["failed", "interrupted"].includes(activeRun.state) ? <button className="btn tiny quiet" disabled={busy} onClick={() => void retryRun()}>Retry</button> : null}
            {waiting && ["queued", "running"].includes(activeRun.state) ? <button className="btn tiny quiet" onClick={() => { setWaiting(false); setBusy(false); }}>Stop waiting</button> : null}
          </div>
          {waiting && ["queued", "running"].includes(activeRun.state) ? <div className="chat-card-detail">Server work continues if you stop waiting.</div> : null}
        </section>
      ) : null}
      {messages.length ? (
        <div className="thread">
          {messages.map((message, index) =>
            message.role === "user" ? (
              <UserMessage
                appliedSkill={messages[index + 1]?.role === "assistant" ? messages[index + 1].applied_skills?.[0] : undefined}
                content={message.content}
                key={message.message_id ?? index}
              />
            ) : (
              <div className="assistant-message" key={message.message_id ?? index}>
                {message.applied_skills?.map((skill) => <div className="applied-skill-label" key={skill.skill_id}>Applied skill: {skill.name}</div>)}
                <div className="agent-label">Themis</div>
                <div className="bubble-agent">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  <ChatCards cards={message.cards} disabled={busy} matterId={matterId} onAction={handleCardAction} onOpenDocument={onOpenDocument} onQuestionModeChange={changeQuestionMode} onRefresh={onRefresh} questionMode={questionMode} questionsDisabled={index !== messages.length - 1} showQuestionMode={intakeActive} />
                  {mutationOutcome(messages[index - 1]?.role === "user" ? messages[index - 1].content : "", message.trace, message.cards) === "recorded" ? (
                    <div className="mutation-status recorded">Workspace state change recorded</div>
                  ) : mutationOutcome(messages[index - 1]?.role === "user" ? messages[index - 1].content : "", message.trace, message.cards) === "no_change" ? (
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
                </div>
              </div>
            ),
          )}
          {busy ? (
            <div className="agent-label" role="status">
              <span className="agent-mark" style={{ width: 12, height: 12 }} />
              {readingInitialRequest ? "Themis is reading your request…" : elapsedSeconds < 10 ? "Working…" : "Still working…"} {elapsedSeconds}s
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="composer">
        <UploadIntentCard attachments={attachments} busy={busy} onClear={() => setAttachments([])} onSend={(intent) => submit(intent, undefined, attachments)} />
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
            placeholder={`Ask Themis about ${matterTitle}…`}
            rows={1}
            value={input}
          />
          <button className="btn primary compact" disabled={busy || !input.trim()} onClick={() => void submit(input)}>
            {uploading ? "Uploading…" : "Send"}
          </button>
        </div>
        <div className="composer-note">
          Themis can research, draft and move this matter. It records a decision only when you explicitly ask it to. <Link className="build-skill-link" href="/skills">Build a skill</Link>
        </div>
      </div>
    </div>
  );
}

function UserMessage({ content, appliedSkill }: { content: string; appliedSkill?: AppliedSkillSummary }) {
  if (!appliedSkill || !content.trimStart().startsWith(`/${appliedSkill.skill_id}`)) {
    return <div className="bubble-you"><LinkifiedText text={content} /></div>;
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
