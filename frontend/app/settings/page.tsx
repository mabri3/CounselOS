"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { getSettings, saveSettings } from "@/lib/api";
import type { SettingRow, WorkspaceSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<WorkspaceSettings | null>(null);
  const [section, setSection] = useState("general");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try { setError(""); setSettings(await getSettings()); setDirty(false); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load settings."); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function update(rowId: string, patch: Partial<SettingRow>) {
    setDirty(true);
    setSettings((current) => current && ({
      sections: current.sections.map((entry) =>
        entry.id !== section
          ? entry
          : { ...entry, rows: entry.rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)) },
      ),
    }));
  }

  if (error && !settings) return <AppShell><main className="page"><p className="error">{error}</p></main></AppShell>;
  if (!settings) return <AppShell><main className="page"><div className="loading">Loading settings…</div></main></AppShell>;

  const current = settings.sections.find((entry) => entry.id === section) ?? settings.sections[0];

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
          </div>
        </aside>

        <div className="admin-main">
          <div className="admin-scroll">
            <div className="admin-body" style={{ maxWidth: 760 }}>
              <h1 style={{ fontSize: 26 }}>{current.title}</h1>
              <p style={{ margin: "6px 0 24px", font: "400 15px var(--sans)", color: "var(--ink-3)" }}>{current.sub}</p>

              {current.rows.map((row) => {
                if (row.kind === "heading") {
                  return <div className="setting-heading" key={row.id}>{row.label}</div>;
                }
                return (
                  <div className="setting-row" key={row.id}>
                    <div>
                      <div className="setting-label">{row.label}</div>
                      {row.help ? <div className="setting-help">{row.help}</div> : null}
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
                          <option key={option} value={option}>{option}</option>
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
              {error || "Changes apply to everyone in the workspace."}
            </span>
            <div className="btn-row">
              <button className="btn" disabled={!dirty || busy} onClick={() => void load()}>Discard</button>
              <button
                className="btn primary"
                disabled={!dirty || busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try { await saveSettings(settings); setDirty(false); }
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
