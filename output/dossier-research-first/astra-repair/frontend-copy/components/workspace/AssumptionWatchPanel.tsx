"use client";

import { useState } from "react";
import type { AssumptionWatchPanelProps } from "@/lib/workspaceTypes";
import styles from "./MatterExplore.module.css";

export default function AssumptionWatchPanel({
  assumptions = [],
  links,
  busy = false,
  builder,
  onDraft,
  onOpen,
}: AssumptionWatchPanelProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showBuilder, setShowBuilder] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const allSelected = assumptions
    .filter((assumption) => selected.has(assumption.assumption_id))
    .map((assumption) => assumption.assumption_id);

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setNotice("");
  }
  async function draft() {
    if (!allSelected.length) return;
    setDrafting(true);
    setError("");
    setNotice("");
    try {
      await onDraft(allSelected);
      setShowBuilder(true);
      setNotice(
        "Watch draft created. Review its scope. Saving or scanning it does not start a schedule.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The Watch draft could not be created. Your selection is retained.",
      );
    } finally {
      setDrafting(false);
    }
  }

  return (
    <section
      aria-labelledby="assumption-watch-title"
      className={`${styles.assumptionWatchPanel} watch-panel`}
    >
      <div className="panel-heading">
        <p className="eyebrow" id="assumption-watch-title">
          Watch an assumption
        </p>
        <span className="watch-help">
          Track assumptions that could change the answer.
        </span>
      </div>
      <div className="watch-compose">
        <fieldset className="watch-options">
          <legend className="sr-only">Assumptions to watch</legend>
          {assumptions.length ? (
            assumptions.map((assumption) => (
              <label className="checkbox-row" key={assumption.assumption_id}>
                <input
                  checked={selected.has(assumption.assumption_id)}
                  onChange={() => toggle(assumption.assumption_id)}
                  type="checkbox"
                />
                <span>{assumption.text}</span>
              </label>
            ))
          ) : (
            <p className="reuse-empty">
              No named assumption is available to watch.
            </p>
          )}
        </fieldset>
        <div>
          <button
            className="btn tiny"
            disabled={busy || drafting || !allSelected.length}
            onClick={() => void draft()}
            type="button"
          >
            {drafting ? "Creating draft…" : "Create linked Watch draft"}
          </button>
          <p className="watch-count">
            Linked Watches: {links.length || "None"}
          </p>
        </div>
      </div>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="watch-status" role="status">
          {notice}
        </p>
      ) : null}
      {showBuilder && builder ? (
        <div className="watch-builder">
          <div className="watch-builder__label">
            <span className="state-label state-agent">Draft only</span>
            <span>Start Watch is a separate action inside the builder.</span>
          </div>
          {builder}
        </div>
      ) : null}
      {links.length ? (
        <div className="watch-links">
          {links.map((link) => (
            <article className="watch-link" key={link.watch_id}>
              <div>
                <strong>{link.title || "Unnamed Watch"}</strong>
                <p>
                  <span>Status: {link.state || "Inspect the Watch"}</span>
                  <span>
                    Assumptions:{" "}
                    {link.assumption_labels?.join(", ") || "No labels supplied"}
                  </span>
                  <span>
                    Linked decisions:{" "}
                    {link.decision_titles?.join(", ") || "None"}
                  </span>
                </p>
              </div>
              <button
                className="btn quiet"
                onClick={() => onOpen(link.watch_id)}
                type="button"
              >
                Inspect status and impact
              </button>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
