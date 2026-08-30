"use client";

import Link from "next/link";
import { useState } from "react";
import LinkifiedText from "@/components/LinkifiedText";
import { VISIBLE_LIMIT, type BriefingItem } from "@/lib/briefing";

/**
 * Canvas 3a. A ranked list of five, not a board. Every item says what needs
 * you, why, and the one thing to do.
 */
export default function BriefingList({ items, limit = VISIBLE_LIMIT }: { items: BriefingItem[]; limit?: number }) {
  const [expanded, setExpanded] = useState(false);
  if (!items.length) {
    return (
      <div className="card">
        <div className="row" style={{ display: "block", padding: "26px 24px" }}>
          <div className="brief-title" style={{ marginTop: 0 }}>Nothing is waiting on your judgment.</div>
          <div className="brief-why">
            Matters are either running, drafted and out, or waiting on someone who isn&apos;t you.
          </div>
        </div>
      </div>
    );
  }

  const visible = expanded ? items : items.slice(0, limit);
  const hidden = items.length - visible.length;

  return (
    <div className="card">
      <div className="row-list">
        {visible.map((item, index) => (
          <div
            className={`row brief-row${item.late ? " is-late" : ""}`}
            key={item.id}
            style={{ borderLeftColor: item.color, background: item.rowBg }}
          >
            <div className="brief-index">{index + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="brief-meta">
                <span className="brief-status" style={{ background: item.pillBg, color: item.pillInk }}>
                  {item.status}
                </span>
                <span>{item.when}</span>
              </div>
              <div className="brief-title"><LinkifiedText text={item.title} /></div>
              <div className="brief-why"><LinkifiedText text={item.why} /></div>
            </div>
            <div style={{ flex: "none", paddingTop: 24 }}>
              <Link className={`btn brief-action ${item.primary ? "primary" : ""}`} href={item.href}>
                {item.action}
              </Link>
            </div>
          </div>
        ))}
      </div>
      {hidden > 0 || expanded ? (
        <button className="brief-more" onClick={() => setExpanded(!expanded)} type="button">
          {expanded
            ? "Show fewer"
            : `Show ${hidden} more ${hidden === 1 ? "item" : "items"} that need you`}
        </button>
      ) : null}
    </div>
  );
}
