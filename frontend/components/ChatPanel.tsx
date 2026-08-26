"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import { sendChat } from "@/lib/api";
import type { ToolTrace } from "@/lib/types";

type Message = { role: "user" | "assistant"; content: string; trace?: ToolTrace[] };

export default function ChatPanel({
  matterId,
  matterTitle,
  activeFile,
  onRefresh,
}: {
  matterId: string;
  matterTitle: string;
  activeFile: string | null;
  onRefresh: () => Promise<void>;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "I’m oriented to this matter. Ask for the forest-level answer, run research, create work, move the matter, or generate a draft.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event?: FormEvent, directMessage?: string) {
    event?.preventDefault();
    const text = (directMessage ?? input).trim();
    if (!text || busy) return;
    const userMessage: Message = { role: "user", content: text };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setBusy(true);
    try {
      const response = await sendChat({
        message: text,
        matter_id: matterId,
        active_file: activeFile,
        agent_id: "counsel-copilot",
        history: messages.slice(-8).map(({ role, content }) => ({ role, content })),
      });
      setMessages((current) => [...current, { role: "assistant", content: response.reply, trace: response.trace }]);
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

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit(undefined, input);
    }
  }

  const actions = [
    "Give me the forest-level orientation and next decision.",
    "Run research on the core issue and move this forward.",
    "Create the missing work items that matter most.",
    "Move this to Generate.",
  ];

  return (
    <div className="chat">
      <div className="context-bar">Context: {matterTitle} · {activeFile ?? "matter scope"}</div>
      <div className="quick-actions">
        {actions.map((action) => (
          <button className="button compact" disabled={busy} key={action} onClick={() => void submit(undefined, action)}>
            {action.split(" ").slice(0, 3).join(" ")}…
          </button>
        ))}
      </div>
      <div className="message-list">
        {messages.map((message, index) => (
          <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
            {message.content}
            {message.trace?.length ? (
              <div className="trace">
                {message.trace.map((item, traceIndex) => (
                  <div className={`trace-item ${item.status}`} key={`${item.tool}-${traceIndex}`}>
                    {item.status === "success" ? "✓" : "!"} {item.summary}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        {busy ? <div className="message assistant muted">Working through the available actions…</div> : null}
      </div>
      <form className="chat-form" onSubmit={(event) => void submit(event)}>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask, move, research, draft, schedule, or record…"
        />
        <div className="chat-form-footer">
          <span className="small faint">Enter to send · Shift+Enter for a new line</span>
          <button className="button primary compact" disabled={busy || !input.trim()} type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}
