"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import LinkifiedText from "@/components/LinkifiedText";
import { effortLabel, getCompanyProfile, getSettings, saveCompanyProfile, saveSettings } from "@/lib/api";
import type { CompanyProfile, SettingRow, WorkspaceSettings } from "@/lib/types";

const COMPANY_FIELDS: { key: keyof CompanyProfile; label: string; help: string }[] = [
  { key: "summary", label: "Company summary", help: "A short description that gives agents the right company context." },
  { key: "business_model", label: "Business model", help: "How the company makes money and who its customers are." },
  { key: "products_services", label: "Products and services", help: "The products, services, and main product areas." },
  { key: "jurisdictions", label: "Jurisdictions", help: "The countries, states, or regions where the company operates." },
  { key: "regulatory_context", label: "Regulatory context", help: "The main licenses, regulators, and legal frameworks." },
  { key: "data_practices", label: "Data practices", help: "The main types of data and how the company uses them." },
  { key: "risk_posture", label: "Risk posture", help: "The company’s practical approach to legal and business risk." },
];

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
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [section, setSection] = useState("general");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const [nextSettings, nextCompany] = await Promise.all([getSettings(), getCompanyProfile()]);
      setSettings(nextSettings);
      setCompany(nextCompany);
      setDirty(false);
    }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load settings."); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function update(rowId: string, patch: Partial<SettingRow>) {
    setDirty(true);
    setSettings((current) => current && ({
      ...current,
      sections: current.sections.map((entry) => {
        if (entry.id !== section) return entry;
        const rows = entry.rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row));
        return {
          ...entry,
          rows: entry.id === "agents" ? alignModelRows(rows, current) : rows,
        };
      }),
    }));
  }

  if (error && !settings) return <AppShell><main className="page"><p className="error">{error}</p></main></AppShell>;
  if (!settings || !company) return <AppShell><main className="page"><div className="loading">Loading settings…</div></main></AppShell>;

  const current = settings.sections.find((entry) => entry.id === section) ?? settings.sections[0];
  const companySection = section === "company";

  return (
    <AppShell>
      <div className="admin-shell">
        <aside className="admin-rail">
          <div className="admin-rail-title">Settings</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {settings.sections.map((entry) => (
              <button
                className={`admin-rail-link ${entry.id === current.id ? "active" : ""}`}
                key={entry.id}
                onClick={() => setSection(entry.id)}
              >
                {entry.label}
              </button>
            ))}
            <button className={`admin-rail-link ${companySection ? "active" : ""}`} onClick={() => setSection("company")}>Company</button>
          </div>
        </aside>

        <div className="admin-main">
          <div className="admin-scroll">
            <div className="admin-body" style={{ maxWidth: 760 }}>
              <h1 style={{ fontSize: 26 }}>{companySection ? "Company" : current.title}</h1>
              <p style={{ margin: "6px 0 24px", font: "400 15px var(--sans)", color: "var(--ink-3)" }}>
                {companySection ? "Company context used by agents across matters." : current.sub}
              </p>
              <p className="stub-note" style={{ margin: "-12px 0 22px", lineHeight: 1.55 }}>
                {companySection
                  ? `Stored in 00_System/company.md${company.version ? ` · Version ${company.version.slice(0, 10)}` : ""}.`
                  : current.id === "agents"
                  ? "Provider, model, and effort choices apply to new model requests as soon as you save."
                  : "These choices are stored as workspace preferences. Some describe planned behavior. Provider attestation changes are timestamped."}
              </p>
              {!companySection && current.id === "agents" && settings.model_catalog.warning ? (
                <p className="error" style={{ margin: "-12px 0 18px" }}>{settings.model_catalog.warning}</p>
              ) : null}

              {companySection ? COMPANY_FIELDS.map((field) => (
                <div className="setting-row company-setting-row" key={field.key}>
                  <div>
                    <div className="setting-label">{field.label}</div>
                    <div className="setting-help">{field.help}</div>
                  </div>
                  <textarea
                    aria-label={field.label}
                    className="text-input setting-control"
                    onChange={(event) => {
                      setDirty(true);
                      setCompany((currentProfile) => currentProfile && ({ ...currentProfile, [field.key]: event.target.value }));
                    }}
                    rows={3}
                    value={company[field.key]}
                  />
                </div>
              )) : current.rows.map((row) => {
                if (row.kind === "heading") {
                  return <div className="setting-heading" key={row.id}>{row.label}</div>;
                }
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
                        {(row.options ?? [row.value ?? ""]).map((option) => (
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

          <div className="admin-foot">
            <span className={error ? "error" : "stub-note"}>
              {error || (companySection ? "Saved to 00_System/company.md as company context." : "Saved to 00_System/settings.md as workspace preferences.")}
            </span>
            <div className="btn-row">
              <button className="btn" disabled={!dirty || busy} onClick={() => void load()}>Discard</button>
              <button
                className="btn primary"
                disabled={!dirty || busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    if (companySection) setCompany(await saveCompanyProfile(company));
                    else await saveSettings(settings);
                    setDirty(false);
                  }
                  catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save settings."); }
                  finally { setBusy(false); }
                }}
              >
                {busy ? "Saving…" : dirty ? "Save changes" : "Saved"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
