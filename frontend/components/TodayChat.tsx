"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AttachmentPicker from "@/components/AttachmentPicker";
import ChatCards from "@/components/ChatCards";
import SkillCommandMenu from "@/components/SkillCommandMenu";
import LinkifiedText from "@/components/LinkifiedText";
import UploadIntentCard from "@/components/UploadIntentCard";
import { getDailyConversation, getDailyConversations, getSkills, sendChat, uploadWorkspaceDocuments } from "@/lib/api";
import { formatLongDate } from "@/lib/design";
import { skillBuilderGoal } from "@/lib/skills";
import type { AttachmentReference, CardAction, ChatHistoryMessage, DailyConversationSummary, SkillDefinition } from "@/lib/types";

const SUGGESTIONS = [
  "What needs my attention today?",
  "Summarize my active matters.",
  "Which decisions need review?",
];

function localDay(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayLabel(day: string, today: string): string {
  if (day === today) return `Today — ${formatLongDate(day)}`;
  return formatLongDate(day);
}

function savedReplyLabel(createdAt: string): string {
  if (!createdAt) return "Saved reply";
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return "Saved reply";
  return `Saved reply · ${parsed.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}

type Props = {
  onRefresh?: () => void | Promise<void>;
};

export default function TodayChat({ onRefresh }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const today = useMemo(localDay, []);
  const [days, setDays] = useState<DailyConversationSummary[]>([]);
  const [selectedDay, setSelectedDay] = useState(today);
  const [messages, setMessages] = useState<ChatHistoryMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [error, setError] = useState("");
  const [attachments, setAttachments] = useState<AttachmentReference[]>([]);
  const [uploading, setUploading] = useState(false);
  const [skills, setSkills] = useState<SkillDefinition[]>([]);
  const isToday = selectedDay === today;

  useEffect(() => { void getSkills().then(({ skills: saved }) => setSkills(saved)).catch(() => setSkills([])); }, []);

  const loadDays = useCallback(async () => {
    const result = await getDailyConversations();
    setDays(result.conversations);
    return result.conversations;
  }, []);

  const loadConversation = useCallback(async (day: string, knownDays: DailyConversationSummary[]) => {
    setSelectedDay(day);
    setHistoryOpen(day !== today);
    setInput("");
    setError("");
    if (!knownDays.some((item) => item.day === day)) {
      setMessages([]);
      return;
    }
    const conversation = await getDailyConversation(day);
    setMessages(conversation.messages);
  }, [today]);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const availableDays = await loadDays();
        if (active) await loadConversation(today, availableDays);
      } catch (caught) {
        if (active) setError(caught instanceof Error ? caught.message : "Could not load saved daily chats.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [loadConversation, loadDays, today]);

  async function submit(text: string, cardAction?: CardAction, actionAttachments: AttachmentReference[] = attachments) {
    const message = text.trim();
    if ((!message && !cardAction && !actionAttachments.length) || busy || !isToday) return;
    const builderGoal = !cardAction ? skillBuilderGoal(text) : null;
    if (builderGoal) {
      router.push(`/skills?goal=${encodeURIComponent(builderGoal)}`);
      return;
    }
    const visibleText = message || cardActionText(cardAction) || `Attached ${actionAttachments.map((item) => item.name).join(", ")}`;
    const previousMessages = messages;
    setHistoryOpen(true);
    setMessages((current) => [
      ...current,
      { message_id: `pending-${Date.now()}`, role: "user", content: visibleText, created_at: "", trace: [], attachments: actionAttachments },
    ]);
    setInput("");
    setAttachments([]);
    setError("");
    setBusy(true);
    try {
      await sendChat({ message, agent_id: "counsel-copilot", workspace_day: today, card_action: cardAction, attachments: actionAttachments });
      const [conversation] = await Promise.all([
        getDailyConversation(today),
        loadDays(),
        onRefresh?.(),
      ]);
      setMessages(conversation.messages);
    } catch (caught) {
      setMessages(previousMessages);
      if (message) setInput(message);
      if (actionAttachments.length) setAttachments(actionAttachments);
      setError(caught instanceof Error ? caught.message : "The workspace chat failed.");
    } finally {
      setBusy(false);
    }
  }

  async function addFiles(files: File[]) {
    setUploading(true);
    setError("");
    try {
      const result = await uploadWorkspaceDocuments(files);
      setAttachments(result.attachments);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not upload the selected files.");
    } finally { setUploading(false); }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit(input);
    }
  }

  return (
    <section className="card today-chat" aria-labelledby="today-chat-title">
      <div className="today-chat-head">
        <div>
          <div className="section-heading" id="today-chat-title">Ask about your work</div>
          <p>Themis.ai can search the workspace, compare matters, and take actions that you request.</p>
        </div>
        <span className="agent-label"><span className="agent-mark" />Themis.ai</span>
      </div>

      <div className="today-chat-day-row">
        <label htmlFor="today-chat-day">Conversation</label>
        <select
          id="today-chat-day"
          value={selectedDay}
          disabled={busy || loading}
          onChange={(event) => void loadConversation(event.target.value, days)}
        >
          <option value={today}>{dayLabel(today, today)}</option>
          {days.filter((item) => item.day !== today).map((item) => (
            <option key={item.day} value={item.day}>{dayLabel(item.day, today)}</option>
          ))}
        </select>
        {!isToday ? <span>Previous days are read-only.</span> : <span>Saved to today&apos;s Markdown file.</span>}
      </div>

      {error ? <p className="error today-chat-status">{error}</p> : null}
      {loading ? <p className="today-chat-status">Loading today&apos;s conversation…</p> : null}
      {messages.length ? (
        <details className="today-chat-history" open={historyOpen} onToggle={(event) => setHistoryOpen(event.currentTarget.open)}>
          <summary>Saved conversation · {messages.length} messages</summary>
          <p className="today-chat-history-note">Saved replies reflect the workspace when written. The attention list above is current.</p>
          <div className="today-chat-thread" aria-live="polite">
            {messages.map((message, index) => message.role === "user" ? (
              <div className="bubble-you" key={message.message_id ?? index}><LinkifiedText text={message.content} /></div>
            ) : (
              <div className="bubble-agent" key={message.message_id ?? index}>
                <div className="today-chat-saved-label">{savedReplyLabel(message.created_at)}</div>
                {message.applied_skills?.map((skill) => <div className="applied-skill-label" key={skill.skill_id}>Applied skill: {skill.name}</div>)}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                {message.trace?.length ? (
                  <div className="trace-list" style={{ marginTop: 10 }}>
                    {message.trace.map((item, traceIndex) => (
                      <div className="trace-item" key={traceIndex}>
                        <span>{item.status === "success" ? "✓" : "!"}</span>
                        <span><LinkifiedText text={item.summary} /></span>
                      </div>
                    ))}
                  </div>
                ) : null}
                <ChatCards cards={message.cards} disabled={busy} onAction={(action, answerText) => submit(answerText ?? "", action, [])} />
              </div>
            ))}
            {busy ? <div className="agent-label"><span className="agent-mark" />Working…</div> : null}
          </div>
        </details>
      ) : null}

      {isToday ? (
        <>
          <UploadIntentCard attachments={attachments} busy={busy} onClear={() => setAttachments([])} onSend={(intent) => submit(intent, undefined, attachments)} />
          <div className="today-chat-suggestions">
            {SUGGESTIONS.map((suggestion) => (
              <button className="suggestion" disabled={busy || loading} key={suggestion} onClick={() => void submit(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
          <div className="composer-field">
            <AttachmentPicker disabled={busy || loading || uploading} onSelect={addFiles} />
            <textarea
              ref={inputRef}
              aria-label="Ask Themis.ai about your work"
              disabled={busy || loading}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your matters, decisions, deadlines, or what to work on next…"
              rows={1}
              value={input}
            />
            <button className="btn primary compact" disabled={busy || loading || !input.trim()} onClick={() => void submit(input)}>
              {uploading ? "Uploading…" : "Send"}
            </button>
          </div>
          <SkillCommandMenu input={input} skills={skills} onSelect={(skill) => { setInput(`/${skill.skill_id} `); requestAnimationFrame(() => inputRef.current?.focus()); }} />
          <div className="composer-note"><Link className="build-skill-link" href="/skills">Build a skill</Link></div>
        </>
      ) : null}
    </section>
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
  return action.values?.join(", ") ?? action.action;
}
