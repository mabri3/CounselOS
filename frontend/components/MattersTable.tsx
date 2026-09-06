"use client";

import Link from "next/link";
import styles from "@/components/PortfolioPhase2.module.css";
import { useMemo, useState } from "react";
import LinkifiedText from "@/components/LinkifiedText";
import { consistencyIssueIsSafelyRepairable, consistencyIssueLabel, dueWord, matterNextAction, matterNextOwner, riskLabel, role, signalCellTint, signalFor, stageLabel, STAGES } from "@/lib/design";
import type { Matter } from "@/lib/types";

type SortKey = "stage" | "owner" | "due";
type SortDirection = "asc" | "desc";

export default function MattersTable({
  matters,
  onRepair,
  repairingMatterId,
}: {
  matters: Matter[];
  onRepair?: (matterId: string) => Promise<void>;
  repairingMatterId?: string | null;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("due");
  const [direction, setDirection] = useState<SortDirection>("asc");

  const sorted = useMemo(() => {
    return [...matters].sort((left, right) => {
      const compared = compare(left, right, sortKey);
      return direction === "asc" ? compared : -compared;
    });
  }, [direction, matters, sortKey]);

  const showOwner = true;
  const columns = "minmax(0,2.2fr) minmax(0,1fr) minmax(0,1.6fr) minmax(0,1.2fr) 95px 85px";

  function sortBy(key: SortKey) {
    if (key === sortKey) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setDirection("asc");
  }

  if (!matters.length) {
    return <div className="empty-state">No matters match these filters.</div>;
  }

  const templateVar = (value: string) => ({ "--register-columns": value }) as React.CSSProperties;

  const sortable = (key: SortKey, label: string) => (
    <button
      aria-label={`Sort by ${label}`}
      onClick={() => sortBy(key)}
      style={{ background: "transparent", border: 0, color: "inherit", cursor: "pointer", font: "inherit", padding: 0, textAlign: "left" }}
      type="button"
    >
      {label}{sortKey === key ? (direction === "asc" ? " ↑" : " ↓") : ""}
    </button>
  );

  return (
    <div className={styles.tableScroll} role="region" aria-label="Matters table, scroll horizontally to see all columns" tabIndex={0}><div className="register">
      <div
        className="register-grid register-head record-meta"
        style={{ ...templateVar(columns), textTransform: "none" }}
      >
        <span>Matter</span>
        <span>{sortable("stage", "Stage")}</span>
        <span>Next action</span>
        {showOwner ? <span>{sortable("owner", "Next owner")}</span> : null}
        <span>{sortable("due", "Due")}</span>
        <span>Risk</span>
      </div>
      {sorted.map((matter) => {
        const due = dueWord(matter);
        const signal = signalFor(matter);
        return (
          <div
            className="register-grid register-row"
            key={matter.matter_id}
            style={{
              background: "white",
              borderLeft: "0",
              ...templateVar(columns),
            }}
          >
            <span className="register-matter-cell" style={{ background: signalCellTint(signal.kind) }}>
              <Link className="register-title" href={`/matters/${encodeURIComponent(matter.matter_id)}`} style={{ display: "block" }}>
                {matter.title}
              </Link>
              <span className="register-cell" style={{ display: "block", marginTop: 2 }}>
                {matter.matter_type.replaceAll("_", " ")}
              </span>
              {(matter.consistency_issues ?? []).map((issue) => (
                <span key={issue.code} style={{ display: "block", marginTop: 6, padding: 6, background: role.attentionTint, color: role.attentionDeep }}>
                  <strong>Consistency issue: {consistencyIssueLabel(issue)}</strong>
                  <span style={{ display: "block", marginTop: 3 }}>{issue.summary}</span>
                  <span style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                    <Link href={`/matters/${encodeURIComponent(matter.matter_id)}`}>Review matter</Link>
                    {onRepair && consistencyIssueIsSafelyRepairable(issue) ? (
                      <button className="btn compact" disabled={repairingMatterId === matter.matter_id} onClick={() => void onRepair(matter.matter_id)} type="button">
                        {repairingMatterId === matter.matter_id ? "Repairing…" : "Repair safe stage mismatch"}
                      </button>
                    ) : null}
                  </span>
                </span>
              ))}
            </span>
            <span className="register-cell" title={STAGES.find((stage) => stage.id === matter.status)?.sub}>
              <span style={{ display: "block" }}>{stageLabel(matter.status)}</span>
              {signal.word ? (
                <span className="signal" style={{ color: signal.wordColor, fontSize: 11.5, marginTop: 3 }}>
                  <span className="dot sm" style={{ background: signal.rail }} />
                  {signal.word}
                </span>
              ) : null}
            </span>
            <span className="register-cell">
              {matter.status === "closed"
                ? <span aria-label="No active next action">—</span>
                : <LinkifiedText text={matterNextAction(matter)} />}
            </span>
            {showOwner ? <span className="register-cell">{matterNextOwner(matter)}</span> : null}
            <span className="register-cell" style={{ color: due.color }}>{due.text}</span>
            <span className="register-cell" title="The matter's recorded risk level.">{riskLabel(matter.risk_level)}</span>
          </div>
        );
      })}
    </div></div>
  );
}

function compare(left: Matter, right: Matter, key: SortKey): number {
  if (key === "due") {
    const leftClosed = left.status === "closed";
    const rightClosed = right.status === "closed";
    if (leftClosed !== rightClosed) return leftClosed ? 1 : -1;
    const leftTime = dateTime(left.work_state.due_at);
    const rightTime = dateTime(right.work_state.due_at);
    if (leftTime === null && rightTime === null) return left.title.localeCompare(right.title);
    if (leftTime === null) return 1;
    if (rightTime === null) return -1;
    return leftTime - rightTime || left.title.localeCompare(right.title);
  }
  const leftValue = key === "stage" ? stageLabel(left.status) : matterNextOwner(left);
  const rightValue = key === "stage" ? stageLabel(right.status) : matterNextOwner(right);
  return leftValue.localeCompare(rightValue) || left.title.localeCompare(right.title);
}

function dateTime(value: string | null | undefined): number | null {
  if (!value) return null;
  const time = new Date(`${String(value).slice(0, 10)}T00:00:00`).getTime();
  return Number.isNaN(time) ? null : time;
}
