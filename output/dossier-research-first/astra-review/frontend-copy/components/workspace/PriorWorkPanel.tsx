"use client";

import { FormEvent, useState } from "react";
import type { PriorWorkPanelProps } from "@/lib/workspaceTypes";
import MatterIcon from "@/components/workspace/MatterIcon";
import styles from "./MatterExplore.module.css";

const titleCase = (value: string) =>
  value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function PriorWorkPanel({
  candidates,
  busy = false,
  onSearch,
  onInclude,
  onOpenArtifact,
}: PriorWorkPanelProps) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [includedPaths, setIncludedPaths] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function search(event: FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    setNotice("");
    try {
      await onSearch(query.trim());
      setSearched(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Prior work could not be searched. Your query is retained.",
      );
    } finally {
      setSearching(false);
    }
  }

  async function include(path: string) {
    const candidate = candidates.find((item) => item.path === path);
    if (!candidate) return;
    setPendingPath(path);
    setError("");
    setNotice("");
    try {
      await onInclude(candidate);
      setIncludedPaths((current) =>
        new Set(current).add(`${path}:${candidate.revision}`),
      );
      setNotice(`Included ${candidate.title} in the next inquiry context.`);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Prior work was not included. You can retry.",
      );
    } finally {
      setPendingPath(null);
    }
  }

  return (
    <section
      aria-labelledby="prior-work-title"
      className={`${styles.priorWorkPanel} reuse-panel`}
    >
      <div className="reuse-panel__head">
        <p className="eyebrow" id="prior-work-title">
          Prior work
        </p>
        <span className="reuse-panel__hint">
          Search past answers, drafts, and notes.
        </span>
        <span className="sr-only">
          A result affects the next inquiry only after you include it.
        </span>
      </div>
      <form className="reuse-search" onSubmit={(event) => void search(event)}>
        <div className="reuse-search__row">
          <div className="reuse-search__input">
            <MatterIcon name="search" size={19} />
            <input
              aria-label="Search prior work"
              className="text-input"
              id="prior-work-query"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by keyword or topic"
              value={query}
            />
          </div>
          <button
            className="btn tiny"
            disabled={busy || searching || !query.trim()}
            type="submit"
          >
            {searching ? "Searching…" : "Search prior work"}
          </button>
        </div>
      </form>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="reuse-notice" role="status">
          <span className="state-label state-healthy">Included</span>
          {notice}
        </p>
      ) : null}
      {!candidates.length && !error ? (
        <p className="reuse-empty" role="status">
          {searched ? "No matching prior work was found." : "No results yet."}
        </p>
      ) : null}
      {candidates.length ? (
        <div className="reuse-list" aria-live="polite">
          {candidates.map((candidate) => {
            const included = includedPaths.has(
              `${candidate.path}:${candidate.revision}`,
            );
            return (
              <article
                className="reuse-item"
                key={`${candidate.path}:${candidate.revision}`}
              >
                <div className="reuse-item__head">
                  <div>
                    <h3>{candidate.title}</h3>
                    <p className="reuse-source">
                      {titleCase(candidate.kind || "prior matter")} ·{" "}
                      {candidate.date || "Date not recorded"} ·{" "}
                      {candidate.status || "Status not recorded"}
                    </p>
                  </div>
                  <span
                    className={`state-label ${included ? "state-healthy" : "state-attention"}`}
                  >
                    {included ? "Included" : "Review first"}
                  </span>
                </div>
                <p className="reading reuse-reading">{candidate.relevance}</p>
                {candidate.snippet ? (
                  <blockquote className="reuse-snippet">
                    {candidate.snippet}
                  </blockquote>
                ) : null}
                <div className="reuse-differences">
                  <strong>Important differences</strong>
                  <ul>
                    {candidate.differences.length ? (
                      candidate.differences.map((difference) => (
                        <li key={difference}>{difference}</li>
                      ))
                    ) : (
                      <li>
                        No difference was supplied. Inspect the source before
                        use.
                      </li>
                    )}
                  </ul>
                </div>
                <details className="reuse-source-detail">
                  <summary>Source details</summary>
                  <p>Matter: {candidate.matter_id || "Not recorded"}</p>
                  <p>
                    File: <span className="mono">{candidate.path}</span>
                  </p>
                  <p>
                    Version:{" "}
                    <span className="mono">
                      {candidate.revision || "Not recorded"}
                    </span>
                  </p>
                </details>
                <div className="btn-row">
                  <button
                    className="btn quiet"
                    onClick={() => onOpenArtifact(candidate.path)}
                    type="button"
                  >
                    Open source
                  </button>
                  <button
                    className="btn primary"
                    disabled={
                      busy || pendingPath === candidate.path || included
                    }
                    onClick={() => void include(candidate.path)}
                    type="button"
                  >
                    {pendingPath === candidate.path
                      ? "Including…"
                      : included
                        ? "Included"
                        : "Include in next inquiry"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
