"use client";
import { useEffect, useRef, useState } from "react";
import { getSettings } from "@/lib/api";
import type { ModelCatalog } from "@/lib/types";
import styles from "./ExperimentalChat.module.css";
export type ChatModelSelection = { provider: string; model: string; reasoning_effort: string };
export default function ExperimentalModelPicker({ value, onChange, disabled }: { value: ChatModelSelection | null; onChange: (value: ChatModelSelection | null) => void; disabled: boolean }) {
    const [catalog, setCatalog] = useState<ModelCatalog | null>(null);
    const [error, setError] = useState("");
    const menu = useRef<HTMLDetailsElement>(null);
    useEffect(() => { let cancelled = false; getSettings().then(settings => { if (!cancelled) setCatalog(settings.model_catalog); }).catch(() => { if (!cancelled) setError("Models could not load. Workspace default is still available."); }); return () => { cancelled = true; }; }, []);
    const provider = catalog?.providers.find(item => item.id === value?.provider);
    const model = provider?.models.find(item => item.id === value?.model);
    const efforts = model?.reasoning_efforts ?? [];
    function selectModel(providerId: string, modelId: string) {
        const next = catalog?.providers.find(item => item.id === providerId)?.models.find(item => item.id === modelId);
        if (next) onChange({ provider: providerId, model: modelId, reasoning_effort: next.reasoning_efforts.includes(value?.reasoning_effort ?? "") ? value!.reasoning_effort : next.reasoning_efforts.includes("medium") ? "medium" : next.reasoning_efforts[0] ?? "default" });
    }
    return <details ref={menu} name="experimental-tools" className={styles.modelPicker} onKeyDown={event => { if (event.key === "Escape") { menu.current?.removeAttribute("open"); menu.current?.querySelector("summary")?.focus(); } }}>
        <summary aria-label="Choose chat model">{value ? model?.label ?? value.model : "Workspace default"}{value && <span> · {value.reasoning_effort}</span>} <span aria-hidden="true">⌄</span></summary>
        <div className={styles.modelPopover}>
            <strong>Model for this chat</strong><p>Applies to the next message.</p>
            {error && <p role="status">{error}</p>}
            {!catalog && !error && <p role="status">Loading models…</p>}
            <label>Provider<select aria-label="Chat provider" disabled={disabled || !catalog} value={value?.provider ?? ""} onChange={event => { const selected = catalog?.providers.find(item => item.id === event.target.value); if (!selected) onChange(null); else if (selected.models[0]) selectModel(selected.id, selected.models[0].id); }}><option value="">Workspace default</option>{!catalog && value && <option value={value.provider}>Loading provider…</option>}{catalog?.providers.map(item => <option key={item.id} value={item.id} disabled={!["ready", "development_only"].includes(item.readiness) || !item.models.length}>{item.label}{item.readiness === "development_only" ? " · Development only" : item.readiness !== "ready" ? " · unavailable" : ""}</option>)}</select></label>
            {provider?.readiness === "development_only" && <p>{provider.readiness_detail}</p>}
            {value && catalog && <><label>Model<select aria-label="Chat model" disabled={disabled || !provider} value={value.model} onChange={event => selectModel(value.provider, event.target.value)}>{!model && <option value={value.model}>{value.model} · unavailable</option>}{provider?.models.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
            <label>Effort<select aria-label="Chat effort" disabled={disabled || !efforts.length} value={value.reasoning_effort} onChange={event => onChange({ ...value, reasoning_effort: event.target.value })}>{!efforts.length ? <option value={value.reasoning_effort}>Provider default</option> : efforts.map(effort => <option key={effort} value={effort}>{effort.charAt(0).toUpperCase() + effort.slice(1)}</option>)}</select></label></>}
            <button type="button" onClick={() => menu.current?.removeAttribute("open")}>Done</button>
        </div>
    </details>;
}
