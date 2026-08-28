import Link from "next/link";
import LinkifiedText from "@/components/LinkifiedText";
import type { BriefingItem } from "@/lib/briefing";

/**
 * Canvas 3a. A ranked list of five, not a board. Every item says what needs
 * you, why, and the one thing to do.
 */
export default function BriefingList({ items }: { items: BriefingItem[] }) {
  if (!items.length) {
    return (
      <div className="card" style={{ marginTop: 26 }}>
        <div className="row" style={{ display: "block", padding: "26px 24px" }}>
          <div className="brief-title" style={{ marginTop: 0 }}>Nothing is waiting on your judgment.</div>
          <div className="brief-why">
            Matters are either running, drafted and out, or waiting on someone who isn&apos;t you.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: 26 }}>
      <div className="row-list">
        {items.map((item, index) => (
          <div
            className="row brief-row"
            key={item.id}
            style={{ borderLeftColor: item.color, background: item.rowBg }}
          >
            <div className="brief-index">{index + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="brief-meta">
                <span className="dot" style={{ background: item.color }} />
                <span style={{ font: "600 13.5px var(--sans)", color: item.color }}>{item.status}</span>
                <span className="faint">·</span>
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
    </div>
  );
}
