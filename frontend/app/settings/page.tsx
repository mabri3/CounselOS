"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import CompanyInterview, { COMPANY_PROFILE_FIELDS, companyReplacementMessage } from "@/components/CompanyInterview";
import LinkifiedText from "@/components/LinkifiedText";
import { createVault, effortLabel, getActiveVault, getCompanyProfile, getSettings, loadVault, saveCompanyProfile, saveSettings } from "@/lib/api";
import { role } from "@/lib/design";
import { getProviderCapabilities } from "@/lib/watchApi";
import type { CompanyProfile, SettingRow, VaultInfo, WorkspaceSettings } from "@/lib/types";
import type { ProviderCapability } from "@/lib/watchTypes";

function alignModelRows(rows: SettingRow[], settings: WorkspaceSettings): SettingRow[] {
  const providerRow = rows.find((row) => row.config_key === "agents.provider");
  const provider = settings.model_catalog.providers.find((entry) => entry.id === providerRow?.value)
    ?? settings.model_catalog.providers[0];
  const currentModel = rows.find((row) => row.config_key === "agents.reasoning_model")?.value;
  const model = provider?.models.find((entry) => entry.id === currentModel) ?? provider?.models[0];
  const currentEffort = rows.find((row) => row.config_key === "agents.reasoning_effort")?.value;
  const effort = model?.efforts.includes(currentEffort ?? "") ? currentEffort : model?.efforts[0] ?? "default";

  return rows.map((row) => {
    if (row.config_key === "agents.reasoning_model") {
      return {
        ...row,
        value: model?.id ?? "mock",
        options: provider?.models.map((entry) => entry.id) ?? ["mock"],
        option_labels: Object.fromEntries(provider?.models.map((entry) => [entry.id, entry.label]) ?? []),
      };
    }
    if (row.config_key === "agents.reasoning_effort") {
      const efforts = model?.efforts ?? ["default"];
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

export default function SettingsPage() {
  const [settings, setSettings] = useState<WorkspaceSettings | null>(null);
  const [savedSettings, setSavedSettings] = useState<WorkspaceSettings | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [savedCompany, setSavedCompany] = useState<CompanyProfile | null>(null);
  const [providers, setProviders] = useState<ProviderCapability[]>([]);
  const [vault, setVault] = useState<VaultInfo | null>(null);
  const [vaultPath, setVaultPath] = useState("");
  const [section, setSection] = useState("agents");
  const [settingsDirty, setSettingsDirty] = useState(false);
  const [companyDirty, setCompanyDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const [nextSettings, nextCompany, providerResult, nextVault] = await Promise.all([
        getSettings(),
        getCompanyProfile(),
        getProviderCapabilities(),
        getActiveVault(),
      ]);
      setSettings(nextSettings);
      setSavedSettings(nextSettings);
      setCompany(nextCompany);
      setSavedCompany(nextCompany);
      setProviders(providerResult.items);
      setVault(nextVault);
      setSettingsDirty(false);
      setCompanyDirty(false);
    }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load settings."); }
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
            ? { ...row, options: ["Themis", lawyer], value: ["Themis", lawyer].includes(row.value ?? "") ? row.value : "Themis" }
            : row);
        }
        return {
          ...entry,
          rows: entry.id === "agents" ? alignModelRows(rows, current) : rows,
        };
      }),
    }));
  }

  if (error && !settings) return <AppShell><main className="page"><p className="error">{error}</p></main></AppShell>;
  if (!settings || !company || !vault) return <AppShell><main className="page"><div className="loading">Loading settings…</div></main></AppShell>;

  const current = settings.sections.find((entry) => entry.id === section) ?? settings.sections[0];
  const companySection = section === "company";
  const providerSection = section === "intelligence-providers";
  const vaultSection = section === "vaults";
  const activeDirty = companySection ? companyDirty : providerSection || vaultSection ? false : settingsDirty;
  const selectedModelRow = current.rows.find((row) => row.config_key === "agents.reasoning_model");
  const selectedModel = selectedModelRow?.option_labels?.[selectedModelRow.value ?? ""]
    ?? selectedModelRow?.value
    ?? "Not configured";

  return (
    <AppShell>
      <div className="admin-shell">
        <aside className="admin-rail">
          <div className="admin-rail-title">Settings</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {settings.sections.map((entry) => (
              <button
                className={`admin-rail-link ${!companySection && !providerSection && entry.id === current.id ? "active" : ""}`}
                key={entry.id}
                onClick={() => setSection(entry.id)}
              >
                {entry.label}
              </button>
            ))}
            <button className={`admin-rail-link ${providerSection ? "active" : ""}`} onClick={() => setSection("intelligence-providers")}>Watch providers</button>
            <button className={`admin-rail-link ${companySection ? "active" : ""}`} onClick={() => setSection("company")}>Company</button>
            <button className={`admin-rail-link ${vaultSection ? "active" : ""}`} onClick={() => setSection("vaults")}>Vaults</button>
          </div>
        </aside>

        <div className="admin-main">
          <div className="admin-scroll">
            <div className="admin-body" style={{ maxWidth: 760 }}>
              <h1 style={{ fontSize: 26 }}>{vaultSection ? "Vaults" : companySection ? "Company" : providerSection ? "Watch providers" : current.title}</h1>
              <p style={{ margin: "6px 0 24px", font: "400 15px var(--sans)", color: "var(--ink-3)" }}>
                {vaultSection
                  ? "Create a blank workspace or load an existing Counsel OS vault."
                  : companySection
                  ? "Company context used by agents across matters."
                  : providerSection
                    ? "Public intelligence services that a Watch can use. Provider keys stay outside Counsel OS screens."
                    : current.sub}
              </p>
              {!companySection && !providerSection && current.id === "agents" ? (
                <div className="agent-note" style={{ margin: "-12px 0 22px" }}>
                  <div className="field-label">Current model</div>
                  <div style={{ marginTop: 5, font: "500 16px var(--sans)", color: "var(--ink-2)" }}>{selectedModel}</div>
                  <p style={{ margin: "5px 0 0" }}>This model is used for new requests. Changes apply after you save.</p>
                </div>
              ) : null}
              {!companySection && !providerSection && current.id === "agents" && settings.model_catalog.warning ? (
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
                      placeholder="/Users/name/Counsel OS Vault"
                      style={{ marginTop: 7, width: "100%" }}
                      value={vaultPath}
                    />
                    <p className="setting-help" style={{ marginTop: 7 }}>
                      Your current vault is preserved. Counsel OS will not move or delete its files.
                    </p>
                  </div>
                  <div className="btn-row">
                    {(["create", "load"] as const).map((action) => (
                      <button
                        className={`btn ${action === "create" ? "primary" : ""}`}
                        disabled={busy || !vaultPath.trim()}
                        key={action}
                        onClick={async () => {
                          const verb = action === "create" ? "create a new vault" : "load this vault";
                          if (!window.confirm(`Confirm that you want to ${verb}. Your current vault is preserved. No files will be moved or deleted.`)) return;
                          setBusy(true);
                          setError("");
                          try {
                            if (action === "create") await createVault(vaultPath.trim());
                            else await loadVault(vaultPath.trim());
                            window.location.assign("/");
                          } catch (caught) {
                            setError(caught instanceof Error ? caught.message : "Could not change the active vault.");
                            setBusy(false);
                          }
                        }}
                      >
                        {busy ? "Working…" : action === "create" ? "Create new vault" : "Load existing vault"}
                      </button>
                    ))}
                  </div>
                  {error ? <p className="error">{error}</p> : null}
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
                              ? "Optional public intelligence for Watches. It is not the main Counsel OS model."
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
              ) : companySection ? (
                <>
                  <CompanyInterview
                    onSaved={(savedProfile) => {
                      setCompany(savedProfile);
                      setSavedCompany(savedProfile);
                      setCompanyDirty(false);
                    }}
                    profile={company}
                  />
                  <details className="company-manual-editor">
                    <summary>Edit company file manually</summary>
                    <div className="company-manual-fields">
                      {COMPANY_PROFILE_FIELDS.map((field) => (
                        <div className="setting-row company-setting-row" key={field.key}>
                          <div>
                            <div className="setting-label">{field.label}</div>
                            <div className="setting-help">{field.help}</div>
                          </div>
                          <textarea
                            aria-label={field.label}
                            className="text-input setting-control"
                            onChange={(event) => {
                              setCompanyDirty(true);
                              setCompany((currentProfile) => currentProfile && ({ ...currentProfile, [field.key]: event.target.value }));
                            }}
                            rows={field.key === "company_name" || field.key === "website_url" ? 1 : 3}
                            value={company[field.key]}
                          />
                        </div>
                      ))}
                    </div>
                  </details>
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
                        {(row.config_key === "document_review.default_author" ? ["Themis", current.rows.find((item) => item.config_key === "document_review.lawyer_name")?.value?.trim() || "Lawyer"] : row.options ?? [row.value ?? ""]).map((option) => (
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

          {!vaultSection ? <div className="admin-foot">
            <span className={error ? "error" : "stub-note"}>
              {error || (providerSection ? "Provider status is read-only." : !activeDirty ? "Saved" : companySection ? "Company context has unsaved changes." : current.id === "agents" ? "Model settings have unsaved changes." : "Document review settings have unsaved changes.")}
            </span>
            <div className="btn-row">
              <button
                className="btn"
                disabled={providerSection || !activeDirty || busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    if (companySection) {
                      const nextCompany = await getCompanyProfile();
                      setCompany(nextCompany);
                      setSavedCompany(nextCompany);
                      setCompanyDirty(false);
                    } else {
                      const nextSettings = await getSettings();
                      setSettings(nextSettings);
                      setSavedSettings(nextSettings);
                      setSettingsDirty(false);
                    }
                  }
                  catch (caught) { setError(caught instanceof Error ? caught.message : "Could not discard settings changes."); }
                  finally { setBusy(false); }
                }}
              >Discard</button>
              <button
                className="btn primary"
                disabled={providerSection || !activeDirty || busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    if (companySection) {
                      const replacementMessage = companyReplacementMessage(
                        savedCompany?.company_name ?? "",
                        company.company_name,
                      );
                      if (replacementMessage && !window.confirm(replacementMessage)) return;
                      const savedProfile = await saveCompanyProfile(company);
                      setCompany(savedProfile);
                      setSavedCompany(savedProfile);
                      setCompanyDirty(false);
                    } else {
                      await saveSettings(settings);
                      const nextSettings = await getSettings();
                      setSettings(nextSettings);
                      setSavedSettings(nextSettings);
                      setSettingsDirty(false);
                    }
                  }
                  catch (caught) {
                    const message = caught instanceof Error ? caught.message : "Could not save settings.";
                    if (!companySection) {
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
    </AppShell>
  );
}
