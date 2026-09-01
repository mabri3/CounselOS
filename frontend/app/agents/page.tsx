"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import LinkifiedText from "@/components/LinkifiedText";
import { effortLabel, getAudiences, getAutomations, getSettings, getTools, saveAgentDetail } from "@/lib/api";
import { role } from "@/lib/design";
import { FIXED_AGENT_RULES, agentDetailFrom, agentStateColor } from "@/lib/stubs";
import type { AgentDetail, Audience, ModelCatalog, ModelCatalogProvider, ToolDefinition, WorkspaceSettings } from "@/lib/types";

function providerState(provider: ModelCatalogProvider): { label: string; color: string } {
  if (provider.readiness === "ready") return { label: "Ready", color: role.healthy };
  if (provider.readiness === "development_only") return { label: "Development only", color: role.attentionDeep };
  if (provider.readiness === "missing") return { label: "Missing setup", color: role.attentionDeep };
  return { label: "Unavailable", color: role.failure };
}

function workspaceDefault(settings: WorkspaceSettings | null): string {
  if (!settings) return "Workspace default";
  const rows = settings.sections.flatMap((section) => section.rows);
  const value = (key: string) => rows.find((row) => row.config_key === key)?.value ?? "";
  const provider = settings.model_catalog.providers.find((entry) => entry.id === value("agents.provider"));
  const model = provider?.models.find((entry) => entry.id === value("agents.reasoning_model"));
  const effort = value("agents.reasoning_effort");
  return [provider?.label ?? value("agents.provider"), model?.label ?? value("agents.reasoning_model"), effort ? effortLabel(effort) : ""]
    .filter(Boolean)
    .join(" · ") || "Workspace default";
}

function workspaceProviderId(settings: WorkspaceSettings | null): string {
  if (!settings) return "";
  return settings.sections.flatMap((section) => section.rows)
    .find((row) => row.config_key === "agents.provider")?.value ?? "";
}

/**
 * Canvas 4b — write what the agent is, how it speaks, and what it may touch.
 * Anything unticked is unavailable even if you ask for it in chat, and three
 * rules hold for every agent whatever the ticks say.
 */
export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentDetail[]>([]);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [tools, setTools] = useState<ToolDefinition[]>([]);
  const [settings, setSettings] = useState<WorkspaceSettings | null>(null);
  const [draft, setDraft] = useState<AgentDetail | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const [{ agents: definitions, schedules }, { audiences: audienceOptions }, { tools: toolOptions }, workspaceSettings] = await Promise.all([
        getAutomations(),
        getAudiences(),
        getTools(),
        getSettings(),
      ]);
      const details = definitions.map((definition) => agentDetailFrom(definition, schedules));
      setAgents(details);
      setAudiences(audienceOptions);
      setTools(toolOptions);
      setSettings(workspaceSettings);
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

  function discardChanges() {
    if (!draft) return;
    const saved = agents.find((agent) => agent.agent_id === draft.agent_id);
    if (!saved) return;
    setDraft(saved);
    setDirty(false);
    setError("");
  }

  function selectAgent(agent: AgentDetail) {
    if (agent.agent_id === draft?.agent_id) return;
    if (dirty && !window.confirm("Discard unsaved changes and switch agents?")) return;
    setDraft(agent);
    setDirty(false);
    setError("");
  }

  function displayName(agent: AgentDetail) {
    return agent.agent_id === "counsel-copilot" ? "Themis.ai" : agent.name;
  }

  function displayRole(agent: AgentDetail) {
    return agent.agent_id === "counsel-copilot" ? "Workspace assistant" : agent.name;
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

  const catalog: ModelCatalog = settings?.model_catalog ?? { providers: [] };
  const selectedProvider = draft.provider
    ? catalog.providers.find((provider) => provider.id === draft.provider)
    : undefined;
  const selectedProviderState = selectedProvider ? providerState(selectedProvider) : null;
  const providerOptions = selectedProvider || !draft.provider
    ? catalog.providers
    : [...catalog.providers, {
      id: draft.provider,
      label: `${draft.provider} (unavailable)`,
      readiness: "unavailable" as const,
      readiness_detail: "The saved provider is not in the current catalog.",
      models: [],
    }];
  const modelOptions = selectedProvider?.models.some((model) => model.id === draft.model) || !draft.model
    ? selectedProvider?.models ?? []
    : [...(selectedProvider?.models ?? []), { id: draft.model, label: `${draft.model} (unavailable)`, reasoning_efforts: [] }];
  const selectedModel = modelOptions.find((model) => model.id === draft.model);
  const effortOptions = selectedModel?.reasoning_efforts.includes(draft.reasoning_effort ?? "") || !draft.reasoning_effort
    ? selectedModel?.reasoning_efforts ?? []
    : [...(selectedModel?.reasoning_efforts ?? []), draft.reasoning_effort];

  return (
    <AppShell>
      <div className="admin-shell">
        <aside className="admin-rail admin-rail-wide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 8px 14px" }}>
            <span style={{ font: "600 15px var(--serif)", color: "var(--ink)" }}>Agents</span>
            <span style={{ font: "400 13.5px var(--sans)", color: "var(--ink-5)" }}>{agents.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {agents.map((agent) => (
              <button
                className={`agent-rail-item ${agent.agent_id === draft.agent_id ? "active" : ""}`}
                key={agent.agent_id}
                onClick={() => selectAgent(agent)}
              >
                <span className="agent-rail-name">{displayName(agent)}</span>
                <span className="agent-rail-role"><LinkifiedText text={displayRole(agent)} /></span>
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
              <h1 style={{ margin: "5px 0 0" }}>{displayName(draft)}</h1>
              <p style={{ margin: "5px 0 0", color: "var(--ink-3)" }}><strong>Role:</strong> {displayRole(draft)}</p>
              <p style={{ margin: "9px 0 0", color: "var(--ink-2)", maxWidth: "68ch" }}><strong>Purpose:</strong> {draft.description}</p>

              {draft.agent_id !== "counsel-copilot" ? <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div className="field-label">Name</div>
                  <input aria-label="Agent name" className="text-input" onChange={(event) => patch({ name: event.target.value })} value={draft.name} />
                </div>
                <div>
                  <div className="field-label">Purpose</div>
                  <input
                    aria-label="Agent description"
                    className="text-input"
                    onChange={(event) => patch({ description: event.target.value })}
                    value={draft.description}
                  />
                </div>
              </div> : null}

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
                <div className="section-heading">Model</div>
                <p>Choose this agent&apos;s provider, model, and reasoning effort. Empty fields use the workspace default.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginTop: 12 }}>
                  <label>
                    <span className="field-label">Provider</span>
                    <select
                      aria-label="Provider"
                      className="select-input"
                      onChange={(event) => {
                        const providerId = event.target.value;
                        if (!providerId) {
                          patch({ provider: "", model: "", reasoning_effort: "" });
                          return;
                        }
                        const provider = catalog.providers.find((entry) => entry.id === providerId);
                        const model = provider?.models[0];
                        patch({
                          provider: providerId,
                          model: model?.id ?? "",
                          reasoning_effort: model?.reasoning_efforts[0] ?? "",
                        });
                      }}
                      style={{ marginTop: 7, width: "100%" }}
                      value={draft.provider ?? ""}
                    >
                      <option value="">Use workspace default</option>
                      {providerOptions.map((provider) => (
                        <option key={provider.id} value={provider.id}>{provider.label}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="field-label">Model</span>
                    <select
                      aria-label="Model"
                      className="select-input"
                      disabled={!draft.provider || modelOptions.length === 0}
                      onChange={(event) => {
                        const model = modelOptions.find((entry) => entry.id === event.target.value);
                        patch({ model: event.target.value, reasoning_effort: model?.reasoning_efforts[0] ?? "" });
                      }}
                      style={{ marginTop: 7, width: "100%" }}
                      value={draft.model ?? ""}
                    >
                      {!draft.provider ? <option value="">Workspace default</option> : null}
                      {draft.provider && modelOptions.length === 0 ? <option value="">No models available</option> : null}
                      {modelOptions.map((model) => <option key={model.id} value={model.id}>{model.label}</option>)}
                    </select>
                  </label>
                  <label>
                    <span className="field-label">Reasoning effort</span>
                    <select
                      aria-label="Reasoning effort"
                      className="select-input"
                      disabled={!draft.provider || !draft.model || effortOptions.length === 0}
                      onChange={(event) => patch({ reasoning_effort: event.target.value })}
                      style={{ marginTop: 7, width: "100%" }}
                      value={draft.reasoning_effort ?? ""}
                    >
                      {!draft.provider ? <option value="">Workspace default</option> : null}
                      {draft.provider && effortOptions.length === 0 ? <option value="">Not available</option> : null}
                      {effortOptions.map((effort) => <option key={effort} value={effort}>{effortLabel(effort)}</option>)}
                    </select>
                  </label>
                </div>
                {!draft.provider ? (
                  <div className="setting-help" style={{ marginTop: 10 }}>Uses workspace default: {workspaceDefault(settings)}</div>
                ) : selectedProviderState ? (
                  <div className="setting-help" style={{ color: selectedProviderState.color, marginTop: 10 }}>
                    <span className="signal" style={{ color: selectedProviderState.color }}>
                      <span className="dot sm" style={{ background: selectedProviderState.color }} />
                      {selectedProviderState.label}
                    </span>
                    <span style={{ marginLeft: 8 }}>{selectedProvider?.readiness_detail}</span>
                  </div>
                ) : (
                  <div className="setting-help" style={{ color: role.failure, marginTop: 10 }}>Unavailable · The saved provider is not in the current catalog.</div>
                )}
                {draft.provider === "antigravity_cli" ? (
                  <div className="setting-help" style={{ color: role.attentionDeep, fontWeight: 500, marginTop: 7 }}>
                    Development only — do not use confidential matter data.
                  </div>
                ) : null}
                {draft.provider === "mock" && workspaceProviderId(settings) !== "mock" ? (
                  <div className="setting-help" role="status" style={{ color: role.attentionDeep, fontWeight: 500, marginTop: 7 }}>
                    Attention — this agent explicitly uses Mock. The workspace uses a live provider. Research runs will keep Mock until you change this selection.
                  </div>
                ) : null}
              </div>

              <details className="field-block">
                <summary className="section-heading" style={{ cursor: "pointer" }}>Advanced controls</summary>
                <div className="field-block">
                  <div className="section-heading">Standing instructions</div>
                  <p>Markdown guidance used whenever this agent runs.</p>
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
                <div className="section-heading">Tool permissions</div>
                <p>Anything not selected is unavailable to this agent.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
                  {tools.map((tool) => {
                    const checked = draft.allowed_tools.includes(tool.tool_id);
                    const label = tool.description.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || tool.description || tool.tool_id;
                    return (
                      <label className="checkbox-row" key={tool.tool_id}>
                        <input checked={checked} onChange={() => toggleTool(tool.tool_id)} type="checkbox" />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="section-heading" style={{ marginTop: 20 }}>File path</div>
                <p className="mono" style={{ marginTop: 8, fontSize: 13 }}>{draft.path}</p>
              </details>

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
              {error || (!dirty ? "Saved" : "Agent settings have unsaved changes.")}
            </span>
            <div className="btn-row">
              <button className="btn" disabled={!dirty || busy} onClick={discardChanges}>Discard changes</button>
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
                {busy ? "Saving…" : "Save agent"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
