"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AttachmentPicker from "@/components/AttachmentPicker";
import ChatCards from "@/components/ChatCards";
import SkillCommandMenu from "@/components/SkillCommandMenu";
import LinkifiedText from "@/components/LinkifiedText";
import UploadIntentCard from "@/components/UploadIntentCard";
import { getConversation, getConversations, getSkills, sendChat, uploadDocuments } from "@/lib/api";
import { skillBuilderGoal } from "@/lib/skills";
import type { AppliedSkillSummary, AttachmentReference, CardAction, ChatCard, SkillDefinition, ToolTrace } from "@/lib/types";

type Message = { message_id?: string; role: "user" | "assistant"; content: string; trace?: ToolTrace[]; cards?: ChatCard[]; attachments?: AttachmentReference[]; applied_skills?: AppliedSkillSummary[] };

const SUGGESTIONS = [
  "Compare both paths",
  "Which other matters does this touch?",
  "What would change your view?",
];

/**
 * Canvas 2b — the copilot is a thread at the foot of the matter, not a pane of
 * its own. Its last line never moves: it can research, draft and move the
 * matter; it records a decision only on explicit instruction.
 */
export default function ChatPanel({
  matterId,
  matterTitle,
  activeFile,
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

  useEffect(() => { void getSkills().then(({ skills: saved }) => setSkills(saved)).catch(() => setSkills([])); }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingHistory(true);
    setHistoryError("");
    void getConversations(matterId)
      .then(async ({ conversations: saved }) => {
        if (cancelled) return;
        if (!saved.length) {
          setConversationId(null);
          setMessages([]);
          return;
        }
        const conversation = await getConversation(matterId, saved[0].conversation_id);
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
  }, [matterId]);

  useEffect(() => {
    if (seed?.text) setInput(seed.text);
  }, [seed]);

  useEffect(() => {
    if (conversationSeed?.revision) void openConversation(conversationSeed.conversationId);
  }, [conversationSeed]);

  async function submit(text: string, cardAction?: CardAction, actionAttachments: AttachmentReference[] = attachments) {
    const trimmed = text.trim();
    if ((!trimmed && !cardAction && !actionAttachments.length) || busy) return;
    const builderGoal = !cardAction ? skillBuilderGoal(text) : null;
    if (builderGoal) {
      router.push(`/skills?goal=${encodeURIComponent(builderGoal)}`);
      return;
    }
    const visibleText = trimmed || cardActionText(cardAction) || `Attached ${actionAttachments.map((item) => item.name).join(", ")}`;
    setMessages((current) => [...current, { role: "user", content: visibleText, attachments: actionAttachments }]);
    setInput("");
    setAttachments([]);
    setBusy(true);
    try {
      const response = await sendChat({
        message: trimmed,
        matter_id: matterId,
        active_file: activeFile,
        agent_id: "counsel-copilot",
        conversation_id: conversationId,
        history: messages.slice(-8).map(({ role, content }) => ({ role, content })),
        card_action: cardAction,
        attachments: actionAttachments,
        review_author: reviewAuthor,
        lawyer_author: lawyerAuthor,
      });
      if (response.review_author) onReviewAuthorChange(response.review_author);
      setConversationId(response.conversation_id ?? conversationId);
      onConversationChange?.(response.conversation_id ?? conversationId);
      setMessages((current) => [...current, { role: "assistant", content: response.reply, trace: response.trace, cards: response.cards, applied_skills: response.applied_skills }]);
      if (response.refresh.length || response.changed_paths.length) await onRefresh();
    } catch (caught) {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: caught instanceof Error ? caught.message : "The chat request failed." },
      ]);
    } finally {
      setBusy(false);
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

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit(input);
    }
  }

  return (
    <div className="chat-panel">
      {historyError ? <p className="error chat-history-status">{historyError}</p> : null}
      {loadingHistory ? <p className="chat-history-status">Loading saved chat…</p> : null}
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
                <div className="agent-label">Themis · Not reviewed</div>
                <div className="bubble-agent">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  <ChatCards cards={message.cards} disabled={busy} matterId={matterId} onAction={handleCardAction} onOpenDocument={onOpenDocument} onRefresh={onRefresh} />
                  {message.trace?.length ? (
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
            <div className="agent-label">
              <span className="agent-mark" style={{ width: 12, height: 12 }} />
              Themis is working through the available actions…
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
