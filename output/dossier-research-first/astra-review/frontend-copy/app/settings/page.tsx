"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "@/components/SettingsPhase2.module.css";
import Phase2Icon from "@/components/Phase2Icon";
import AppShell from "@/components/AppShell";
import CompanyInterview from "@/components/CompanyInterview";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import DataLoadStatus from "@/components/DataLoadStatus";
import LinkifiedText from "@/components/LinkifiedText";
import { createVault, effortLabel, getActiveVault, getAnswerContract, getCompanyProfile, getSettings, loadVault, resetAnswerContract, saveAnswerContract, saveSettings, request } from "@/lib/api";
import { role } from "@/lib/design";
import { getProviderCapabilities } from "@/lib/watchApi";
import type { AnswerContract, CompanyProfile, ModelCatalogProvider, SettingRow, VaultInfo, WorkspaceSettings } from "@/lib/types";
import type { ProviderCapability } from "@/lib/watchTypes";

import { loadContinuityIdentity, useContinuityIdentity } from "@/lib/continuityApi";

import { alignModelRows } from "@/lib/modelSettingsRows";

function providerState(provider: ModelCatalogProvider): { label: string; color: string } {
  if (provider.readiness === "ready") return { label: "Ready", color: role.healthy };
  if (provider.readiness === "development_only") return { label: "Development only", color: role.attentionDeep };
  if (provider.readiness === "missing") return { label: "Missing setup", color: role.attentionDeep };
  return { label: "Unavailable", color: role.failure };
}

const RESEARCH_PROVIDER_LABELS: Record<string, string> = {
  polaris: "Polaris legal research",
  tavily: "Tavily web research",
  firecrawl: "Firecrawl web research",
  none: "no external research service",
};

export default function SettingsPage() {
  const { identity } = useContinuityIdentity();
  const [teamNames, setTeamNames] = useState("Alex Morgan\nJordan Lee\nCasey Chen");
  useEffect(() => { if (identity?.roster.people?.length) setTeamNames(identity.roster.people.map(person => person.display_name).join("\n")); }, [identity]);
  async function configureTeam(enabled: boolean) {
    if (!identity) return;
    setBusy(true); setError("");
    try {
      const names = teamNames.split("\n").map(name => name.trim()).filter(Boolean);
      const people = names.map(name => identity.roster.people?.find(person => person.display_name === name) || { person_id: crypto.randomUUID(), display_name: name });
      await request("/team", { method: "PUT", body: JSON.stringify({ enabled, people, expected_revision: identity.roster.revision, source_action_key: crypto.randomUUID() }) });
      await loadContinuityIdentity(true);
    } catch (error) { setError(error instanceof Error ? error.message : "Local people were not saved."); }
    finally { setBusy(false); }
  }
  const [settings, setSettings] = useState<WorkspaceSettings | null>(null);
  const [savedSettings, setSavedSettings] = useState<WorkspaceSettings | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [answerContract, setAnswerContract] = useState<AnswerContract | null>(null);
  const [answerDraft, setAnswerDraft] = useState("");
  const [providers, setProviders] = useState<ProviderCapability[]>([]);
  const [vault, setVault] = useState<VaultInfo | null>(null);
  const [vaultPath, setVaultPath] = useState("");
  const [section, setSection] = useState("agents");

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [vaultConfirmation, setVaultConfirmation] = useState<"create" | "load" | null>(null);
  const [answerResetConfirmation, setAnswerResetConfirmation] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setLoadError("");
    try {
      const [nextSettings, nextCompany, providerResult, nextVault, nextAnswerContract] = await Promise.all([
        getSettings(),
        getCompanyProfile(),
        getProviderCapabilities(),
        getActiveVault(),
        getAnswerContract(),
      ]);
      setSettings(nextSettings);
      setSavedSettings(nextSettings);
      setCompany(nextCompany);
      setProviders(providerResult.items);
      setVault(nextVault);
      setAnswerContract(nextAnswerContract);
      setAnswerDraft(nextAnswerContract.content);
    }
    catch { setLoadError("Settings are unavailable because their current data could not be loaded."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function navigateSection(next: string) {
    setSection(next);
    setError("");
  }

  function update(rowId: string, patch: Partial<SettingRow>) {
    setSettings((current) => current && ({
      ...current,
      sections: current.sections.map((entry) => {
        const selected = current.sections.find((candidate) => candidate.id === section) ?? current.sections[0];
        if (entry.id !== selected.id) return entry;
        let rows = entry.rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row));
        if (entry.id === "document-review") {
          const lawyer = rows.find((row) => row.config_key === "document_review.lawyer_name")?.value?.trim() || "Lawyer";
          rows = rows.map((row) => row.config_key === "document_review.default_author"
            ? { ...row, options: ["Themis.ai", lawyer], value: ["Themis.ai", lawyer].includes(row.value ?? "") ? row.value : "Themis.ai" }
            : row);
        }
        return {
          ...entry,
          rows: ["agents", "research"].includes(entry.id) ? alignModelRows(rows, current, entry.id === "research") : rows,
        };
      }),
    }));
  }

  async function changeVault(action: "create" | "load") {
    setBusy(true);
    setError("");
    try {
      if (action === "create") await createVault(vaultPath.trim());
      else await loadVault(vaultPath.trim());
      await loadContinuityIdentity(true);
      window.location.assign("/");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not change the active vault.";
      setError(message);
      throw new Error(message);
    } finally {
      setBusy(false);
    }
  }

  function requestVaultChange(action: "create" | "load") {
    setVaultConfirmation(action);
  }

  async function persistAnswerContract() {
    setBusy(true);
    setError("");
    try {
      const saved = await saveAnswerContract(answerDraft);
      setAnswerContract(saved);
      setAnswerDraft(saved.content);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the answer contract.");
    } finally {
      setBusy(false);
    }
  }

  async function restoreAnswerContract() {
    setBusy(true);
    setError("");
    try {
      const saved = await resetAnswerContract();
      setAnswerContract(saved);
      setAnswerDraft(saved.content);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not reset the answer contract.";
      setError(message);
      throw new Error(message);
    } finally {
      setBusy(false);
    }
  }

  if (!settings || !company || !vault || !answerContract) return <AppShell><main className="page"><DataLoadStatus error={loadError} loading={loading} loadingLabel="Loading settings…" onRetry={load} /></main></AppShell>;

  const current = settings.sections.find((entry) => entry.id === section) ?? settings.sections[0];
  const companySection = section === "company";
  const answerSection = section === "answer-contract";
  const modelProviderSection = section === "model-providers";
  const providerSection = section === "intelligence-providers";
  const vaultSection = section === "vaults";
  const activeDirty = modelProviderSection || providerSection || vaultSection || companySection || answerSection ? false : JSON.stringify(current) !== JSON.stringify(savedSettings?.sections.find((entry) => entry.id === current.id));
  const answerDirty = answerDraft !== answerContract.content;
  const selectedModelRow = current.rows.find((row) => row.config_key === "agents.reasoning_model");
  const selectedModel = selectedModelRow?.option_labels?.[selectedModelRow.value ?? ""]
    ?? selectedModelRow?.value
    ?? "Not configured";
  const primaryResearch = current.rows.find((row) => row.config_key === "research.primary_external_provider")?.value ?? "none";
  const backupResearch = current.rows.find((row) => row.config_key === "research.fallback_external_provider")?.value ?? "none";

  return (
    <AppShell>
      <div className={styles.shell}>
        <aside className={styles.rail}>
          <div className={styles.railTitle}>Settings</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {settings.sections.map((entry) => (
              <button
                className={`admin-rail-link ${entry.id === section ? "active" : ""}`}
                key={entry.id}
                onClick={() => navigateSection(entry.id)}
              >
                <Phase2Icon name={entry.id === "agents" ? "Skills" : entry.id === "files" ? "Matters" : "Briefing"} />{entry.label}
              </button>
            ))}
            <button className={`admin-rail-link ${modelProviderSection ? "active" : ""}`} onClick={() => navigateSection("model-providers")}><Phase2Icon name="Skills" />Model providers</button>
            <button className={`admin-rail-link ${providerSection ? "active" : ""}`} onClick={() => navigateSection("intelligence-providers")}><Phase2Icon name="Automations" />Watch providers</button>
            <button className={`admin-rail-link ${companySection ? "active" : ""}`} onClick={() => navigateSection("company")}><Phase2Icon name="Agents" />Company</button>
            <button className={`admin-rail-link ${vaultSection ? "active" : ""}`} onClick={() => navigateSection("vaults")}><Phase2Icon name="Workspace" />Vaults</button>
          </div>
        </aside>

        <div className={styles.main}>
          <div>
            <div className={`${styles.body} ${section === "research" ? styles.research : ""}`}>
              <DataLoadStatus error={loadError} loading={loading} loadingLabel="Refreshing settings…" onRetry={load} />
              <h1 className={styles.heading}>{vaultSection ? "Vaults" : companySection ? "Company profile" : modelProviderSection ? "Model providers" : providerSection ? "Watch providers" : section === "agents" ? "Choose how Themis.ai works" : current.title}</h1>
              <p className={styles.lede}>
                {vaultSection
                  ? "Create a blank workspace or load an existing Themis.ai vault."
                  : companySection
                  ? "Company context used by agents across matters."
                  : modelProviderSection
                    ? "See which model providers and models are available. Credentials and sign-in sessions stay outside Themis.ai."
                  : providerSection
                    ? "Public intelligence services that a Watch can use. Provider keys stay outside Themis.ai screens."
                    : current.sub}
              </p>
              {section === "agents" ? (
                <div className={styles.summary}>
                  <div className="field-label">Current model</div>
                  <div style={{ marginTop: 5, font: "500 16px var(--sans)", color: "var(--ink-2)" }}>{selectedModel}</div>
                  <p style={{ margin: "5px 0 0" }}>This model is used for new requests. Changes apply after you save.</p>
                </div>
              ) : null}
              {section === "agents" && settings.model_catalog.warning ? (
                <p className="error" style={{ margin: "-12px 0 18px" }}>{settings.model_catalog.warning}</p>
              ) : null}

              <div hidden={!companySection}>
                  <CompanyInterview
                    onSaved={(savedProfile) => {
                      setCompany(savedProfile);
                    }}
                    profile={company}
                  />
              </div>
              {vaultSection ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div className="setting-row" style={{ alignItems: "flex-start" }}>
                    <div>
                      <div className="setting-label">Current vault</div>
                      <div className="setting-help">{vault.name}</div>
                    </div>
                    <code style={{ maxWidth: 470, overflowWrap: "anywhere", textAlign: "right" }}>{vault.path}</code>
                  </div>
                  <div>
                    <label className="field-label" htmlFor="vault-path">Absolute path</label>
                    <input
                      className="text-input"
                      id="vault-path"
                      onChange={(event) => setVaultPath(event.target.value)}
                      placeholder="/Users/name/Themis.ai Vault"
                      style={{ marginTop: 7, width: "100%" }}
                      value={vaultPath}
                    />
                    <p className="setting-help" style={{ marginTop: 7 }}>
                      Your current vault is preserved. Themis.ai will not move or delete its files.
                    </p>
                  </div>
                  <div className="btn-row">
                    {(["create", "load"] as const).map((action) => (
                      <button
                        className={`btn ${action === "create" ? "primary" : ""}`}
                        disabled={busy || !vaultPath.trim()}
                        key={action}
                        onClick={() => requestVaultChange(action)}
                      >
                        {busy ? "Working…" : action === "create" ? "Create new vault" : "Load existing vault"}
                      </button>
                    ))}
                  </div>
      <section className={styles.team}><h2 className="section-heading">Local team demonstration</h2><p>Optional people share this vault. Switch the current person to show their work and preserve who made each change.</p><p className="small muted">This is a local simulation. It does not add accounts or access controls.</p><label className="field-block">People, one name per line<textarea className="text-input" value={teamNames} onChange={event => setTeamNames(event.target.value)} rows={3} /></label><div className="btn-row"><button className="btn compact" disabled={busy || !identity} onClick={() => void configureTeam(true)}>Save and enable people</button>{identity?.roster.enabled ? <button className="btn quiet compact" disabled={busy} onClick={() => void configureTeam(false)}>Use one lawyer</button> : <span className="small muted">Single lawyer mode</span>}</div></section>
                  {error ? <p className="error">{error}</p> : null}
                </div>
              ) : modelProviderSection ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {settings.model_catalog.warning ? <p className="error" style={{ margin: "0 0 6px" }}>{settings.model_catalog.warning}</p> : null}
                  {settings.model_catalog.providers.map((provider) => {
                    const state = providerState(provider);
                    return (
                      <div className="setting-row" key={provider.id} style={{ alignItems: "flex-start" }}>
                        <div>
                          <div className="setting-label">{provider.label}</div>
                          <div className="setting-help">{provider.readiness_detail}</div>
                          {provider.id === "antigravity_cli" ? (
                            <div className="setting-help" style={{ color: role.attentionDeep, fontWeight: 500, marginTop: 5 }}>
                              Development only — do not use confidential matter data.
                            </div>
                          ) : null}
                          <details style={{ marginTop: 7 }}>
                            <summary className="setting-help" style={{ cursor: "pointer" }}>Technical details</summary>
                            <div className="setting-help" style={{ marginTop: 7 }}>
                              Provider ID: <code>{provider.id}</code><br />
                              {provider.models.length
                                ? provider.models.map((model) => `${model.label} [${model.id}] — ${model.reasoning_efforts.length ? model.reasoning_efforts.map(effortLabel).join(", ") : "reasoning modes unavailable"}`).join(" · ")
                                : "No models available."}
                            </div>
                          </details>
                        </div>
                        <span className="signal" style={{ color: state.color, flex: "none", fontWeight: 500 }}>
                          <span className="dot" style={{ background: state.color }} />
                          {state.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : providerSection ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {providers.length ? providers.map((provider) => {
                    const ready = provider.configured && provider.available;
                    const state = ready ? "Configured · Ready" : provider.configured ? "Configured · Unavailable" : "Not configured";
                    const stateColor = ready ? role.healthy : provider.configured ? role.failure : role.attentionDeep;
                    return (
                      <div className="setting-row" key={provider.provider_id}>
                        <div>
                          <div className="setting-label">{provider.label}</div>
                          <div className="setting-help">
                            {provider.provider_id === "polaris"
                              ? "Optional public intelligence for Watches. It is not the main Themis.ai model."
                              : "Public intelligence for Watch scans."}
                          </div>
                          {provider.warning ? <div className="setting-help" style={{ marginTop: 4 }}>{provider.warning}</div> : null}
                        </div>
                        <span className="signal" style={{ color: stateColor, flex: "none", fontWeight: 500 }}>
                          <span className="dot" style={{ background: stateColor }} />
                          {state}
                        </span>
                      </div>
                    );
                  }) : <div className="empty-state">No Watch providers are available.</div>}
                </div>
              ) : answerSection ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {answerContract.update_proposal ? <details><summary>Optional answer style update</summary><p>{answerContract.update_proposal.reason}</p><pre className="prose">{answerContract.update_proposal.content}</pre><button className="btn" type="button" onClick={() => setAnswerDraft(answerContract.update_proposal!.content)}>Use this text in the editor</button><p>Review the text, then select Save to apply it.</p></details> : null}
                  <div>
                    <label className="field-label" htmlFor="answer-contract-body">Contract body</label>
                    <textarea
                      aria-label="Answer contract"
                      className="text-input"
                      id="answer-contract-body"
                      maxLength={answerContract.max_content_chars}
                      onChange={(event) => setAnswerDraft(
                        event.target.value.slice(0, answerContract.max_content_chars),
                      )}
                      rows={24}
                      spellCheck={false}
                      style={{ fontFamily: "var(--mono)", marginTop: 7, width: "100%" }}
                      value={answerDraft}
                    />
                    <div className="setting-help" style={{ display: "flex", justifyContent: "space-between", marginTop: 7 }}>
                      <span>{answerDraft.length.toLocaleString()} / {answerContract.max_content_chars.toLocaleString()} characters</span>
                      <span>Last saved {new Date(answerContract.updated_at * 1000).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="setting-help" style={{ margin: 0 }}>
                    Save an empty contract to disable the editable Answer Contract block.
                  </p>
                  {error ? <p className="error" style={{ margin: 0 }}>{error}</p> : null}
                  <div className="btn-row">
                    {(!answerContract.is_default || answerDirty) ? (
                      <button
                        className="btn"
                        disabled={busy}
                        onClick={() => setAnswerResetConfirmation(true)}
                      >Reset to default</button>
                    ) : null}
                    <button
                      className="btn primary"
                      disabled={!answerDirty || busy}
                      onClick={() => void persistAnswerContract()}
                    >{busy ? "Saving…" : "Save"}</button>
                  </div>
                </div>
              ) : companySection ? null : current.id === "research" ? (
                <>
                  <div className={styles.summary}>
                    <div className="field-label">Active research route</div>
                    <p style={{ margin: "5px 0 0" }}>
                      {current.rows.some(row => row.config_key === "research.collection_enabled" && row.on) ? "The collection agent searches with " : "Search directly with "}{RESEARCH_PROVIDER_LABELS[primaryResearch] ?? primaryResearch}, then {RESEARCH_PROVIDER_LABELS[backupResearch] ?? backupResearch}. If neither returns useful sources, the main model type searches the web in a separate session.
                    </p>
                  </div>
                  {current.rows.map((row, index) => {
                    if (row.kind !== "heading") return null;
                    const advancedRows = current.rows.slice(index + 1);
                    return (
                      <details key={row.id} open style={{ marginTop: 20 }}>
                        <summary className="setting-heading" style={{ cursor: "pointer" }}>{row.label}</summary>
                        {advancedRows.filter(row => !["research.model_fallback_provider", "research.model_fallback_model", "research.collection_reasoning_effort"].includes(row.config_key ?? "") || current.rows.some(r => r.config_key === "research.collection_enabled" && r.on)).map((advancedRow) => (
                          <div className="setting-row" key={advancedRow.id}>
                            <div><div className="setting-label">{advancedRow.label}</div>{advancedRow.help ? <div className="setting-help"><LinkifiedText text={advancedRow.help} /></div> : null}</div>
                            {advancedRow.kind === "toggle" ? <input type="checkbox" aria-label={advancedRow.label} checked={!!advancedRow.on} onChange={(event) => update(advancedRow.id, { on: event.target.checked })} /> : advancedRow.kind === "text" ? <input aria-label={advancedRow.label} className="text-input setting-control" onChange={(event) => update(advancedRow.id, { value: event.target.value })} value={advancedRow.value ?? ""} /> : <select aria-label={advancedRow.label} className="select-input setting-control" onChange={(event) => update(advancedRow.id, { value: event.target.value })} value={advancedRow.value}>{(advancedRow.options ?? [advancedRow.value ?? ""]).map((option) => <option key={option} value={option}>{advancedRow.option_labels?.[option] ?? option}</option>)}</select>}
                          </div>
                        ))}
                      </details>
                    );
                  })}
                </>
              ) : current.rows.map((row, index) => {
                if (row.kind === "heading") {
                  const advancedRows = current.rows.slice(index + 1);
                  return (
                    <details key={row.id} open style={{ marginTop: 20 }}>
                      <summary className="setting-heading" style={{ cursor: "pointer" }}>{row.label}</summary>
                      {advancedRows.filter(row => !["research.model_fallback_provider", "research.model_fallback_model", "research.collection_reasoning_effort"].includes(row.config_key ?? "") || current.rows.some(r => r.config_key === "research.collection_enabled" && r.on)).map((advancedRow) => (
                        <div className="setting-row" key={advancedRow.id}>
                          <div>
                            <div className="setting-label">{advancedRow.label}</div>
                            {advancedRow.help ? <div className="setting-help"><LinkifiedText text={advancedRow.help} /></div> : null}
                          </div>
                          <select
                            aria-label={advancedRow.label}
                            className="select-input setting-control"
                            onChange={(event) => update(advancedRow.id, { value: event.target.value })}
                            value={advancedRow.value}
                          >
                            {(advancedRow.options ?? [advancedRow.value ?? ""]).map((option) => (
                              <option key={option} value={option}>{advancedRow.option_labels?.[option] ?? option}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </details>
                  );
                }
                if (current.rows.slice(0, index).some((candidate) => candidate.kind === "heading")) return null;
                return (
                  <div className="setting-row" key={row.id}>
                    <div>
                      <div className="setting-label">{row.label}</div>
                      {row.help ? <div className="setting-help"><LinkifiedText text={row.help} /></div> : null}
                    </div>

                    {row.kind === "toggle" ? (
                      <button
                        aria-checked={!!row.on}
                        aria-label={row.label}
                        className="switch"
                        onClick={() => update(row.id, { on: !row.on })}
                        role="switch"
                        style={{ background: row.on ? "var(--ink)" : "var(--control)" }}
                      >
                        <span style={{ left: row.on ? 18 : 2 }} />
                      </button>
                    ) : row.kind === "select" ? (
                      <select
                        aria-label={row.label}
                        className="select-input setting-control"
                        onChange={(event) => update(row.id, { value: event.target.value })}
                        value={row.value}
                      >
                        {(row.config_key === "document_review.default_author" ? ["Themis.ai", current.rows.find((item) => item.config_key === "document_review.lawyer_name")?.value?.trim() || "Lawyer"] : row.options ?? [row.value ?? ""]).map((option) => (
                          <option key={option} value={option}>{row.option_labels?.[option] ?? option}</option>
                        ))}
                      </select>
                    ) : row.kind === "text" ? (
                      <input
                        aria-label={row.label}
                        className="text-input setting-control"
                        onChange={(event) => update(row.id, { value: event.target.value })}
                        value={row.value ?? ""}
                      />
                    ) : (
                      <div style={{ flex: "none", display: "flex", gap: 6 }}>
                        {(row.options ?? []).map((option) => (
                          <button
                            className={`btn compact ${row.value === option ? "primary" : ""}`}
                            key={option}
                            onClick={() => update(row.id, { value: option })}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
                })}
            </div>
          </div>

          {!vaultSection && !companySection && !answerSection ? <div className={styles.footer}>
            <span className={error ? "error" : "stub-note"}>
              {error || (modelProviderSection || providerSection ? "Provider status is read-only." : !activeDirty ? "Saved" : current.id === "agents" ? "Model settings have unsaved changes." : `${current.label} settings have unsaved changes.`)}
            </span>
            <div className="btn-row">
              <button
                className="btn"
                disabled={modelProviderSection || providerSection || !activeDirty || busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    const nextSettings = await getSettings();
                    setSettings((draft) => draft && ({ ...draft, sections: draft.sections.map((entry) => entry.id === current.id ? nextSettings.sections.find((saved) => saved.id === current.id) ?? entry : entry) }));
                    setSavedSettings(nextSettings);
                  }
                  catch (caught) { setError(caught instanceof Error ? caught.message : "Could not discard settings changes."); }
                  finally { setBusy(false); }
                }}
              >Discard</button>
              <button
                className="btn primary"
                disabled={modelProviderSection || providerSection || !activeDirty || busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    await saveSettings({ ...settings, sections: [current] });
                    const nextSettings = await getSettings();
                    setSettings((draft) => draft && ({ ...draft, sections: draft.sections.map((entry) => entry.id === current.id ? nextSettings.sections.find((saved) => saved.id === current.id) ?? entry : entry) }));
                    setSavedSettings(nextSettings);
                  }
                  catch (caught) {
                    const message = caught instanceof Error ? caught.message : "Could not save settings.";
                    setError(message);
                  }
                  finally { setBusy(false); }
                }}
              >
                {busy ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div> : null}
        </div>
      </div>

      {vaultConfirmation ? <ConfirmationDialog
        confirmLabel={vaultConfirmation === "create" ? "Create new vault" : "Load existing vault"}
        description={`Confirm that you want to ${vaultConfirmation === "create" ? "create a new vault" : "load this vault"}. Your current vault is preserved. No files will be moved or deleted.`}
        onCancel={() => setVaultConfirmation(null)}
        onConfirm={() => changeVault(vaultConfirmation)}
        title={vaultConfirmation === "create" ? "Create new vault?" : "Load existing vault?"}
      /> : null}
      {answerResetConfirmation ? <ConfirmationDialog
        confirmLabel="Reset to default"
        description="Replace the current draft and saved Answer Contract with the built-in default."
        onCancel={() => setAnswerResetConfirmation(false)}
        onConfirm={restoreAnswerContract}
        title="Reset the Answer Contract?"
      /> : null}
    </AppShell>
  );
}
