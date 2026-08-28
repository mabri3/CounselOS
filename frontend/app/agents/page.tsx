"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import LinkifiedText from "@/components/LinkifiedText";
import { getAgentDetail, getAudiences, getAutomations, getTools, saveAgentDetail } from "@/lib/api";
import { FIXED_AGENT_RULES, agentDetailFrom, agentStateColor } from "@/lib/stubs";
import type { AgentDetail, Audience, ToolDefinition } from "@/lib/types";

/**
 * Canvas 4b — write what the agent is, how it speaks, and what it may touch.
 * Anything unticked is unavailable even if you ask for it in chat, and three
 * rules hold for every agent whatever the ticks say.
 */
export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentDetail[]>([]);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [tools, setTools] = useState<ToolDefinition[]>([]);
  const [draft, setDraft] = useState<AgentDetail | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const [{ agents: definitions, schedules }, { audiences: audienceOptions }, { tools: toolOptions }] = await Promise.all([
        getAutomations(),
        getAudiences(),
        getTools(),
      ]);
      const details = definitions.map((definition) => agentDetailFrom(definition, schedules));
      setAgents(details);
      setAudiences(audienceOptions);
      setTools(toolOptions);
      setDraft((current) => details.find((agent) => agent.agent_id === (current?.agent_id ?? details[0]?.agent_id)) ?? null);
      setDirty(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load agents.");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function patch(update: Partial<AgentDetail>) {
    setDirty(true);
    setDraft((current) => (current ? { ...current, ...update } : current));
  }

  function toggleTool(toolId: string) {
    if (!draft) return;
    const has = draft.allowed_tools.includes(toolId);
    patch({
      allowed_tools: has
        ? draft.allowed_tools.filter((entry) => entry !== toolId)
        : [...draft.allowed_tools, toolId],
    });
  }

  async function loadAgentFromFile() {
    if (!draft) return;
    setBusy(true);
    setError("");
    try {
      const loaded = await getAgentDetail(draft.agent_id);
      setAgents((current) => current.map((agent) => agent.agent_id === loaded.agent_id ? loaded : agent));
      setDraft(loaded);
      setDirty(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load the agent file.");
    } finally {
      setBusy(false);
    }
  }

  function resetToDefault() {
    if (!draft) return;
    const saved = agents.find((agent) => agent.agent_id === draft.agent_id);
    if (!saved) return;
    setDraft(saved);
    setDirty(false);
    setError("");
  }

  if (error && !draft) return <AppShell><main className="page"><p className="error">{error}</p></main></AppShell>;
  if (!draft) {
    return (
      <AppShell>
        <main className="page">
          {agents.length === 0 ? (
            <div className="empty-state">No agents are defined in the vault yet.</div>
          ) : (
            <div className="loading">Loading agents…</div>
          )}
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="admin-shell">
        <aside className="admin-rail" style={{ width: 280 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 8px 14px" }}>
            <span style={{ font: "600 15px var(--serif)", color: "var(--ink)" }}>Agents</span>
            <span style={{ font: "400 13.5px var(--sans)", color: "var(--ink-5)" }}>{agents.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {agents.map((agent) => (
              <button
                className={`agent-rail-item ${agent.agent_id === draft.agent_id ? "active" : ""}`}
                key={agent.agent_id}
                onClick={() => { setDraft(agent); setDirty(false); }}
              >
                <span className="agent-rail-name">{agent.name}</span>
                <span className="agent-rail-role"><LinkifiedText text={agent.description} /></span>
                <span className="signal" style={{ marginTop: 6, fontSize: 13, fontWeight: 400, color: agentStateColor(agent.state) }}>
                  <span className="dot sm" style={{ background: agentStateColor(agent.state) }} />
                  {agent.state}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="admin-main">
          <div className="admin-scroll">
            <div className="admin-body">
              <div style={{ font: "400 14px var(--sans)", color: "var(--ink-4)" }}>Editing an agent</div>
              <h1 style={{ margin: "5px 0 0" }}>{draft.name}</h1>

              <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div className="field-label">Name</div>
                  <input aria-label="Agent name" className="text-input" onChange={(event) => patch({ name: event.target.value })} value={draft.name} />
                </div>
                <div>
                  <div className="field-label">One line about what it is for</div>
                  <input
                    aria-label="Agent description"
                    className="text-input"
                    onChange={(event) => patch({ description: event.target.value })}
                    value={draft.description}
                  />
                </div>
              </div>

              <div className="field-block">
                <div className="section-heading">How it should behave</div>
                <p>Written in plain language. This is the agent&apos;s standing instruction, not a prompt template.</p>
                <textarea
                  aria-label="Agent instructions"
                  className="text-input prose"
                  onChange={(event) => patch({ instructions: event.target.value })}
                  style={{ minHeight: 150 }}
                  value={draft.instructions}
                />
              </div>

              <div className="field-block">
                <div className="section-heading">
                  Written for{draft.audience_prompt && !draft.audience_id ? " · edited" : ""}
                </div>
                <p>Who reads this. Choose a starting point, then say it in your own words.</p>
                <div className="btn-row" style={{ marginTop: 10, flexWrap: "wrap" }}>
                  {audiences.map((audience) => (
                    <button
                      className={`btn compact ${draft.audience_id === audience.audience_id ? "primary" : ""}`}
                      key={audience.audience_id}
                      onClick={() => patch({ audience_id: audience.audience_id, audience_prompt: audience.prompt })}
                    >
                      {audience.label}
                    </button>
                  ))}
                </div>
                <textarea
                  aria-label="Written for"
                  className="text-input prose"
                  onChange={(event) => {
                    const audiencePrompt = event.target.value;
                    const match = audiences.find((audience) => audience.prompt === audiencePrompt);
                    patch({ audience_prompt: audiencePrompt, audience_id: match?.audience_id ?? "" });
                  }}
                  placeholder="No audience set — the agent writes for the record by default."
                  style={{ minHeight: 120, marginTop: 10 }}
                  value={draft.audience_prompt}
                />
              </div>

              <div className="field-block">
                <div className="section-heading">What it may do</div>
                <p>Anything unticked is not available to this agent, even if you ask for it in chat.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
                  {tools.map((tool) => {
                    const checked = draft.allowed_tools.includes(tool.tool_id);
                    const label = tool.description.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || tool.description || tool.tool_id;
                    return (
                      <button className="checkbox-row" key={tool.tool_id} onClick={() => toggleTool(tool.tool_id)}>
                        <span className={`checkbox-box ${checked ? "on" : ""}`}>{checked ? "✓" : ""}</span>
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="agent-note" style={{ marginTop: 26 }}>
                <div className="agent-label">
                  <span className="agent-mark" />
                  Fixed for every agent
                </div>
                <div style={{ marginTop: 9, display: "flex", flexDirection: "column", gap: 5, font: "400 15px/1.6 var(--sans)", color: "var(--ink-2)" }}>
                  {FIXED_AGENT_RULES.map((rule) => <span key={rule}>{rule}</span>)}
                </div>
              </div>

              <div className="field-block">
                <div className="section-heading">How it starts</div>
                <p>The agent does not control its timing. Recurring work is configured as an automation.</p>
                <div className="agent-note" style={{ marginTop: 10 }}>
                  <div style={{ font: "400 15px/1.6 var(--sans)", color: "var(--ink-2)" }}>
                    {draft.start_description}
                  </div>
                  <Link
                    href="/automations"
                    style={{ display: "inline-block", marginTop: 8, font: "500 14px var(--sans)", textDecoration: "underline", textUnderlineOffset: 3 }}
                  >
                    Manage automations
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-foot">
            <span className={error ? "error" : "stub-note"} style={{ display: "block", maxWidth: "70ch", lineHeight: 1.5 }}>
              {error ? error : <>Defined in <span className="mono" style={{ fontSize: 13, whiteSpace: "nowrap" }}>{draft.path}</span>. Saved changes rewrite that file.{" "}
              <Link href="/automations" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>See what it did</Link>.
              </>}
            </span>
            <div className="btn-row">
              <button className="btn" disabled={busy} onClick={() => void loadAgentFromFile()}>Load from file</button>
              <button className="btn" disabled={!dirty || busy} onClick={resetToDefault}>Reset to default</button>
              <button className="btn" disabled={!dirty || busy} onClick={() => void load()}>Discard</button>
              <button
                className="btn primary"
                disabled={!dirty || busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try { await saveAgentDetail(draft); await load(); }
                  catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save agent."); }
                  finally { setBusy(false); }
                }}
              >
                {busy ? "Saving…" : dirty ? "Save agent" : "Saved"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
