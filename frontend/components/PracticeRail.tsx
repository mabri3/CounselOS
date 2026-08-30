import Link from "next/link";
import { STAGES, matterIsAgentWorking, role } from "@/lib/design";
import type { Decision, Matter } from "@/lib/types";

/**
 * Canvas 3a. The practice, beside the ranked list rather than in a footer band
 * nobody scrolls to. Deliberately a quiet list and not a row of tiles: the
 * ranking is the product, and this is the reference beside it.
 */
export default function PracticeRail({ matters, decisions }: { matters: Matter[]; decisions: Decision[] }) {
  const open = matters.filter((matter) => matter.status !== "closed");
  const withThemis = open.filter(
    (matter) => matterIsAgentWorking(matter) || matter.work_state.next_actor === "themis",
  ).length;

  return (
    <aside className="card today-rail">
      <div className="rail-head">
        <span className="rail-head-title">The practice</span>
        <span className="rail-head-count">{open.length} in flight</span>
      </div>

      {STAGES.filter((stage) => stage.id !== "closed").map((stage) => {
        const count = open.filter((matter) => matter.status === stage.id).length;
        return (
          <div className={`rail-stage${count === 0 ? " is-empty" : ""}`} key={stage.id}>
            <span className="rail-stage-label">{stage.label}</span>
            <span className="rail-stage-count">{count}</span>
          </div>
        );
      })}

      <div className="rail-note">
        <span className="dot" style={{ background: withThemis ? role.agent : role.quiet }} />
        <span>
          {withThemis === 0
            ? "Nothing is with Themis right now."
            : `${withThemis} ${withThemis === 1 ? "matter is" : "matters are"} with Themis.`}
        </span>
      </div>

      <div className="rail-note">
        <span className="dot" style={{ background: role.ink }} />
        <span>
          {decisions.length} {decisions.length === 1 ? "decision" : "decisions"} recorded.
        </span>
      </div>

      <div className="rail-foot">
        <Link className="btn compact quiet" href="/workspace">Open the workspace</Link>
      </div>
    </aside>
  );
}
