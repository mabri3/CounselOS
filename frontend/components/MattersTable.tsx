"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import LinkifiedText from "@/components/LinkifiedText";
import { dueWord, stageLabel, STAGES } from "@/lib/design";
import type { Matter } from "@/lib/types";

type SortKey = "stage" | "owner" | "due";
type SortDirection = "asc" | "desc";

const columns = "minmax(0,2fr) 150px minmax(0,2fr) 120px 110px 90px";

export default function MattersTable({ matters }: { matters: Matter[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("due");
  const [direction, setDirection] = useState<SortDirection>("asc");

  const sorted = useMemo(() => {
    return [...matters].sort((left, right) => {
      const compared = compare(left, right, sortKey);
      return direction === "asc" ? compared : -compared;
    });
  }, [direction, matters, sortKey]);

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
    <div className="register">
      <div className="register-grid register-head record-meta" style={{ gridTemplateColumns: columns }}>
        <span>Matter</span>
        <span>{sortable("stage", "Stage")}</span>
        <span>Next action</span>
        <span>{sortable("owner", "Owner")}</span>
        <span>{sortable("due", "Due")}</span>
        <span>Risk</span>
      </div>
      {sorted.map((matter) => {
        const due = dueWord(matter);
        return (
          <div
            className="register-grid register-row"
            key={matter.matter_id}
            style={{ gridTemplateColumns: columns }}
          >
            <span>
              <Link className="register-title" href={`/matters/${encodeURIComponent(matter.matter_id)}`} style={{ display: "block" }}>
                {matter.title}
              </Link>
              <span className="register-cell" style={{ display: "block", marginTop: 2 }}>
                {matter.matter_type.replaceAll("_", " ")}
              </span>
            </span>
            <span className="register-cell" title={STAGES.find((stage) => stage.id === matter.status)?.sub}>{stageLabel(matter.status)}</span>
            <span className="register-cell"><LinkifiedText text={matter.next_action || "No next action recorded."} /></span>
            <span className="register-cell">{matter.legal_owner || "Unassigned"}</span>
            <span className="register-cell" style={{ color: due.color }}>{due.text}</span>
            <span className="register-cell" title="The matter's recorded risk level.">{matter.risk_level}</span>
          </div>
        );
      })}
    </div>
  );
}

function compare(left: Matter, right: Matter, key: SortKey): number {
  if (key === "due") {
    const leftTime = dateTime(left.target_date);
    const rightTime = dateTime(right.target_date);
    if (leftTime === null && rightTime === null) return left.title.localeCompare(right.title);
    if (leftTime === null) return 1;
    if (rightTime === null) return -1;
    return leftTime - rightTime || left.title.localeCompare(right.title);
  }
  const leftValue = key === "stage" ? stageLabel(left.status) : left.legal_owner || "Unassigned";
  const rightValue = key === "stage" ? stageLabel(right.status) : right.legal_owner || "Unassigned";
  return leftValue.localeCompare(rightValue) || left.title.localeCompare(right.title);
}

function dateTime(value: string | null | undefined): number | null {
  if (!value) return null;
  const time = new Date(`${String(value).slice(0, 10)}T00:00:00`).getTime();
  return Number.isNaN(time) ? null : time;
}
