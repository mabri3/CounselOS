import Link from "next/link";
import type { Decision } from "@/lib/types";

export default function DecisionTable({ decisions }: { decisions: Decision[] }) {
  if (!decisions.length) return <div className="empty-state">No decisions match this view.</div>;
  return (
    <div className="table-wrap card">
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Decision</th>
            <th>Chosen path</th>
            <th>Reason to revisit</th>
            <th>Decided</th>
          </tr>
        </thead>
        <tbody>
          {decisions.map((decision) => (
            <tr key={decision.decision_id}>
              <td><span className={`badge ${decision.review_status}`}>{decision.review_status.replaceAll("_", " ")}</span></td>
              <td>
                <div className="table-title"><Link href={`/matters/${decision.matter_id}`}>{decision.title}</Link></div>
                <div className="small faint">{decision.decision_maker || "Decision maker not recorded"} · {decision.risk_level} risk</div>
              </td>
              <td>{decision.chosen_path}</td>
              <td className={decision.review_status === "fresh" ? "faint" : ""}>{decision.staleness_reason || "No current review signal."}</td>
              <td>{decision.decided_at ? String(decision.decided_at).slice(0, 10) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
