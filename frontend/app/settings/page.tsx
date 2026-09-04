"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import CompanyInterview from "@/components/CompanyInterview";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import DataLoadStatus from "@/components/DataLoadStatus";
import LinkifiedText from "@/components/LinkifiedText";
import { createVault, effortLabel, getActiveVault, getAnswerContract, getCompanyProfile, getSettings, loadVault, resetAnswerContract, saveAnswerContract, saveSettings } from "@/lib/api";
import { role } from "@/lib/design";
import { getProviderCapabilities } from "@/lib/watchApi";
import type { AnswerContract, CompanyProfile, ModelCatalogProvider, SettingRow, VaultInfo, WorkspaceSettings } from "@/lib/types";
import type { ProviderCapability } from "@/lib/watchTypes";

function alignModelRows(rows: SettingRow[], settings: WorkspaceSettings): SettingRow[] {
  const providerRow = rows.find((row) => row.config_key === "agents.provider");
  const provider = settings.model_catalog.providers.find((entry) => entry.id === providerRow?.value)
    ?? settings.model_catalog.providers[0];
  const currentModel = rows.find((row) => row.config_key === "agents.reasoning_model")?.value;
  const model = provider?.models.find((entry) => entry.id === currentModel) ?? provider?.models[0];
  const currentEffort = rows.find((row) => row.config_key === "agents.reasoning_effort")?.value;
  const effort: string = model?.reasoning_efforts.includes(currentEffort ?? "")
    ? currentEffort ?? "default"
    : model?.reasoning_efforts[0] ?? currentEffort ?? "default";
  const modelOptions = provider?.models.length
    ? provider.models
    : currentModel
      ? [{ id: currentModel, label: `${currentModel} (unavailable)`, reasoning_efforts: [] }]
      : [];

  return rows.map((row) => {
    if (row.config_key === "agents.reasoning_model") {
      return {
        ...row,
        value: model?.id ?? currentModel ?? "",
        options: modelOptions.map((entry) => entry.id),
        option_labels: Object.fromEntries(modelOptions.map((entry) => [entry.id, entry.label])),
      };
    }
    if (row.config_key === "agents.reasoning_effort") {
      const efforts = model?.reasoning_efforts.length ? model.reasoning_efforts : [effort];
      return {
        ...row,
        value: effort,
        options: efforts,
        option_labels: Object.fromEntries(
          efforts.map((entry) => [entry, effortLabel(entry)]),
        ),
      };
    }
    return row;
  });
}

function providerState(provider: ModelCatalogProvider): { label: string; color: string } {
  if (provider.readiness === "ready") return { label: "Ready", color: role.healthy };
  if (provider.readiness === "development_only") return { label: "Development only", color: role.attentionDeep };
  if (provider.readiness === "missing") return { label: "Missing setup", color: role.attentionDeep };
  return { label: "Unavailable", color: role.failure };
}

const RESEARCH_PROVIDER_LABELS: Record<string, string> = {
  polaris: "Polaris legal research",
  tavily: "Tavily web research",
  none: "no external research service",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<WorkspaceSettings | null>(null);
  const [savedSettings, setSavedSettings] = useState<WorkspaceSettings | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [answerContract, setAnswerContract] = useState<AnswerContract | null>(null);
  const [answerDraft, setAnswerDraft] = useState("");
  const [providers, setProviders] = useState<ProviderCapability[]>([]);
  const [vault, setVault] = useState<VaultInfo | null>(null);
  const [vaultPath, setVaultPath] = useState("");
  const [section, setSection] = useState("agents");
  const [settingsDirty, setSettingsDirty] = useState(false);
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
      setSettingsDirty(false);
    }
    catch { setLoadError("Settings are unavailable because their current data could not be loaded."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function update(rowId: string, patch: Partial<SettingRow>) {
    setSettingsDirty(true);
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
          rows: entry.id === "agents" ? alignModelRows(rows, current) : rows,
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
  const activeDirty = modelProviderSection || providerSection || vaultSection || companySection || answerSection ? false : settingsDirty;
  const answerDirty = answerDraft !== answerContract.content;
  const selectedModelRow = current.rows.find((row) => row.config_key === "agents.reasoning_model");
  const selectedModel = selectedModelRow?.option_labels?.[selectedModelRow.value ?? ""]
    ?? selectedModelRow?.value
    ?? "Not configured";
  const primaryResearch = current.rows.find((row) => row.config_key === "research.primary_external_provider")?.value ?? "none";
  const backupResearch = current.rows.find((row) => row.config_key === "research.fallback_external_provider")?.value ?? "none";

  return (
    <AppShell>
      <div className="admin-shell">
        <aside className="admin-rail">
          <div className="admin-rail-title">Settings</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {settings.sections.map((entry) => (
              <button
                className={`admin-rail-link ${!companySection && !modelProviderSection && !providerSection && entry.id === current.id ? "active" : ""}`}
                key={entry.id}
                onClick={() => setSection(entry.id)}
              >
                {entry.label}
              </button>
            ))}
            <button className={`admin-rail-link ${modelProviderSection ? "active" : ""}`} onClick={() => setSection("model-providers")}>Model providers</button>
            <button className={`admin-rail-link ${providerSection ? "active" : ""}`} onClick={() => setSection("intelligence-providers")}>Watch providers</button>
            <button className={`admin-rail-link ${companySection ? "active" : ""}`} onClick={() => setSection("company")}>Company</button>
            <button className={`admin-rail-link ${vaultSection ? "active" : ""}`} onClick={() => setSection("vaults")}>Vaults</button>
          </div>
        </aside>

        <div className="admin-main">
          <div className="admin-scroll">
            <div className="admin-body" style={{ maxWidth: 760 }}>
              <DataLoadStatus error={loadError} loading={loading} loadingLabel="Refreshing settings…" onRetry={load} />
              <h1 style={{ fontSize: 26 }}>{vaultSection ? "Vaults" : companySection ? "Company" : modelProviderSection ? "Model providers" : providerSection ? "Watch providers" : current.title}</h1>
              <p style={{ margin: "6px 0 24px", font: "400 15px var(--sans)", color: "var(--ink-3)" }}>
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
              {!companySection && !modelProviderSection && !providerSection && current.id === "agents" ? (
                <div className="agent-note" style={{ margin: "-12px 0 22px" }}>
                  <div className="field-label">Current model</div>
                  <div style={{ marginTop: 5, font: "500 16px var(--sans)", color: "var(--ink-2)" }}>{selectedModel}</div>
                  <p style={{ margin: "5px 0 0" }}>This model is used for new requests. Changes apply after you save.</p>
                </div>
              ) : null}
              {!companySection && !modelProviderSection && !providerSection && current.id === "agents" && settings.model_catalog.warning ? (
                <p className="error" style={{ margin: "-12px 0 18px" }}>{settings.model_catalog.warning}</p>
              ) : null}

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
              ) : companySection ? (
                <>
                  <CompanyInterview
                    onSaved={(savedProfile) => {
                      setCompany(savedProfile);
                    }}
                    profile={company}
                  />
                </>
              ) : current.id === "research" ? (
                <>
                  <div className="agent-note" style={{ margin: "-12px 0 2px" }}>
                    <div className="field-label">Active research route</div>
                    <p style={{ margin: "5px 0 0" }}>
                      Start with {RESEARCH_PROVIDER_LABELS[primaryResearch] ?? primaryResearch}. If it cannot return useful sources, try {RESEARCH_PROVIDER_LABELS[backupResearch] ?? backupResearch}.
                    </p>
                  </div>
                  {current.rows.map((row, index) => {
                    if (row.kind !== "heading") return null;
                    const advancedRows = current.rows.slice(index + 1);
                    return (
                      <details key={row.id} style={{ marginTop: 20 }}>
                        <summary className="setting-heading" style={{ cursor: "pointer" }}>{row.label}</summary>
                        {advancedRows.map((advancedRow) => (
                          <div className="setting-row" key={advancedRow.id}>
                            <div><div className="setting-label">{advancedRow.label}</div>{advancedRow.help ? <div className="setting-help"><LinkifiedText text={advancedRow.help} /></div> : null}</div>
                            {advancedRow.kind === "toggle" ? <button aria-checked={!!advancedRow.on} aria-label={advancedRow.label} className="switch" onClick={() => update(advancedRow.id, { on: !advancedRow.on })} role="switch" style={{ background: advancedRow.on ? "var(--ink)" : "var(--control)" }}><span style={{ left: advancedRow.on ? 18 : 2 }} /></button> : advancedRow.kind === "text" ? <input aria-label={advancedRow.label} className="text-input setting-control" onChange={(event) => update(advancedRow.id, { value: event.target.value })} value={advancedRow.value ?? ""} /> : <select aria-label={advancedRow.label} className="select-input setting-control" onChange={(event) => update(advancedRow.id, { value: event.target.value })} value={advancedRow.value}>{(advancedRow.options ?? [advancedRow.value ?? ""]).map((option) => <option key={option} value={option}>{advancedRow.option_labels?.[option] ?? option}</option>)}</select>}
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
                    <details key={row.id} style={{ marginTop: 20 }}>
                      <summary className="setting-heading" style={{ cursor: "pointer" }}>{row.label}</summary>
                      {advancedRows.map((advancedRow) => (
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

          {!vaultSection && !companySection && !answerSection ? <div className="admin-foot">
            <span className={error ? "error" : "stub-note"}>
              {error || (modelProviderSection || providerSection ? "Provider status is read-only." : !activeDirty ? "Saved" : current.id === "agents" ? "Model settings have unsaved changes." : "Document review settings have unsaved changes.")}
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
                    setSettings(nextSettings);
                    setSavedSettings(nextSettings);
                    setSettingsDirty(false);
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
                    await saveSettings(settings);
                    const nextSettings = await getSettings();
                    setSettings(nextSettings);
                    setSavedSettings(nextSettings);
                    setSettingsDirty(false);
                  }
                  catch (caught) {
                    const message = caught instanceof Error ? caught.message : "Could not save settings.";
                    try {
                      const nextSettings = await getSettings();
                      setSettings(nextSettings);
                      setSavedSettings(nextSettings);
                      setSettingsDirty(false);
                    } catch {
                      if (savedSettings) {
                        setSettings(savedSettings);
                        setSettingsDirty(false);
                      }
                    }
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
