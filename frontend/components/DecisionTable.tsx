import Link from "next/link";
import LinkifiedText from "@/components/LinkifiedText";
import { decisionSignal, formatDay, shortName } from "@/lib/design";
import type { Decision } from "@/lib/types";

/**
 * Canvas 1f. Recorded decisions are ink on paper: solid border, serif, a real
 * date, a named human. Recommendations never appear in this table.
 */
export default function DecisionTable({ decisions, selectedDecision }: { decisions: Decision[]; selectedDecision?: string | null }) {
  if (!decisions.length) return <div className="empty-state">No decisions match this view.</div>;

  return (
    <div className="register">
      <div className="register-grid register-head">
        <div className="record-meta">Recorded</div>
        <div className="record-meta">Decision</div>
        <div className="record-meta">Matter</div>
        <div className="record-meta">Decider</div>
        <div className="record-meta" title="The recorded reason for the decision.">Basis</div>
        <div className="record-meta" style={{ textAlign: "right" }} title="Shows when or why this decision must be checked again.">Review</div>
      </div>

      {decisions.map((decision) => {
        const review = decisionSignal(decision);
        return (
          <div
            className="register-grid register-row"
            id={`decision-${decision.decision_id}`}
            key={decision.decision_id}
            style={{
              background: selectedDecision === decision.decision_id ? "var(--agent-tint)" : review.stale ? "#FFFBF0" : "var(--raised)",
              boxShadow: selectedDecision === decision.decision_id ? "inset 3px 0 var(--agent)" : "none",
            }}
          >
            <div className="register-date">{formatDay(decision.decided_at)}</div>
            <div style={{ paddingRight: 18 }}>
              <Link className="register-title" href={`/matters/${encodeURIComponent(decision.matter_id)}`}>
                {decision.chosen_path || decision.title}
              </Link>
            </div>
            <div className="register-cell"><LinkifiedText text={decision.title} /></div>
            <div className="register-cell" style={{ paddingRight: 0 }}>
              {shortName(decision.decision_maker) || "Not recorded"}
            </div>
            <div className="register-basis"><LinkifiedText text={decision.rationale || "No basis recorded"} /></div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {review.stale ? (
                <Link
                  className="btn review tiny"
                  href={`/matters/${encodeURIComponent(decision.matter_id)}`}
                  style={{ maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis" }}
                  title={review.detail}
                >
                  {review.label}
                </Link>
              ) : (
                <span style={{ font: "400 11px var(--sans)", color: "var(--ink-6)" }} title={review.detail}>{review.label}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
