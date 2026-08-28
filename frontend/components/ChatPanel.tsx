"use client";

import { KeyboardEvent, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AttachmentPicker from "@/components/AttachmentPicker";
import ChatCards from "@/components/ChatCards";
import LinkifiedText from "@/components/LinkifiedText";
import UploadIntentCard from "@/components/UploadIntentCard";
import { getConversation, getConversations, sendChat, uploadDocuments } from "@/lib/api";
import type { AttachmentReference, CardAction, ChatCard, ToolTrace } from "@/lib/types";

type Message = { message_id?: string; role: "user" | "assistant"; content: string; trace?: ToolTrace[]; cards?: ChatCard[]; attachments?: AttachmentReference[] };

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
}: {
  matterId: string;
  matterTitle: string;
  activeFile: string | null;
  onRefresh: () => Promise<void>;
  conversationSeed?: { conversationId: string; revision: number };
  onConversationChange?: (conversationId: string | null) => void;
  onOpenDocument?: (path: string) => void;
  seed?: { text: string; revision: number };
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState(seed?.text ?? "");
  const [busy, setBusy] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [attachments, setAttachments] = useState<AttachmentReference[]>([]);
  const [uploading, setUploading] = useState(false);

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
      });
      setConversationId(response.conversation_id ?? conversationId);
      onConversationChange?.(response.conversation_id ?? conversationId);
      setMessages((current) => [...current, { role: "assistant", content: response.reply, trace: response.trace, cards: response.cards }]);
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
    <>
      {historyError ? <p className="error chat-history-status">{historyError}</p> : null}
      {loadingHistory ? <p className="chat-history-status">Loading saved chat…</p> : null}
      {messages.length ? (
        <div className="thread">
          {messages.map((message, index) =>
            message.role === "user" ? (
              <div className="bubble-you" key={message.message_id ?? index}><LinkifiedText text={message.content} /></div>
            ) : (
              <div key={message.message_id ?? index}>
                <div className="agent-label" style={{ marginBottom: 7 }}>
                  <span className="agent-mark" style={{ width: 12, height: 12 }} />
                  Themis
                </div>
                <div className="bubble-agent">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  {message.trace?.length ? (
                    <div className="trace-list" style={{ marginTop: 12 }}>
                      {message.trace.map((item, traceIndex) => (
                        <div className="trace-item" key={traceIndex}>
                          <span style={{ flex: "none", color: item.status === "success" ? "var(--healthy)" : "var(--failure)" }}>
                            {item.status === "success" ? "✓" : "!"}
                          </span>
                          <span style={{ flex: 1 }}><LinkifiedText text={item.summary} /></span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <ChatCards cards={message.cards} disabled={busy} matterId={matterId} onAction={handleCardAction} onOpenDocument={onOpenDocument} onRefresh={onRefresh} />
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
        <div className="composer-field">
          <AttachmentPicker disabled={busy || uploading} onSelect={addFiles} />
          <textarea
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
          Themis can research, draft and move this matter. It records a decision only when you explicitly ask it to.
        </div>
      </div>
    </>
  );
}

function cardActionText(action?: CardAction): string {
  if (!action) return "";
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
