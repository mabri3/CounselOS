import type { MatterDetail } from "./types";

export type MatterActionId =
  | "review_intake"
  | "run_research"
  | "review_and_decide"
  | "start_work_product"
  | "review_draft"
  | "draft_work_product"
  | "approve_response"
  | "mark_as_sent"
  | "review_remaining_work"
  | "close_matter"
  | "none";

export type MatterActionView = {
  id: MatterActionId;
  category: "Work action" | "Counsel judgment" | "Approval" | "Delivery" | "Matter closure";
  label: string;
  detail: string;
};

export function matterAction(detail: MatterDetail, hasDraft: boolean): MatterActionView {
  if (detail.status === "intake") {
    return { id: "review_intake", category: "Work action", label: "Review intake", detail: "Confirm the request and missing facts." };
  }
  if (detail.status === "research") {
    return { id: "run_research", category: "Work action", label: "Run research", detail: "Gather the inputs needed to assess the matter." };
  }
  if (detail.status === "explore") {
    if (!detail.durable_decision_needed && detail.decisions.length > 0) {
      return { id: "start_work_product", category: "Work action", label: "Start work product", detail: "Use the chosen path to prepare the output." };
    }
    return { id: "review_and_decide", category: "Counsel judgment", label: "Record decision", detail: "Review the proposed path and record the decision." };
  }
  if (detail.status === "generate") {
    return hasDraft
      ? { id: "review_draft", category: "Work action", label: "Review draft", detail: "Check the work product before it is approved or sent." }
      : { id: "draft_work_product", category: "Work action", label: "Draft work product", detail: "Create the output for the chosen path." };
  }
  if (detail.status === "respond") {
    if (!detail.current_work_product_final_path) {
      return { id: "review_draft", category: "Work action", label: "Review draft", detail: "Finalize the current draft before approval is available." };
    }
    if (!detail.response_approved_at) {
      return { id: "approve_response", category: "Approval", label: "Approve response", detail: "Give permission to use or send this work product." };
    }
    if (!detail.response_sent_at) {
      return { id: "mark_as_sent", category: "Delivery", label: "Record manual delivery", detail: "Record delivery outside Themis.ai. This does not send or contact anyone." };
    }
    const requiredOpen = detail.work_items.some(
      (item) => Boolean(item.required) && !["done", "closed"].includes(item.status),
    );
    return {
      id: "close_matter",
      category: "Matter closure",
      label: "Close matter",
      detail: requiredOpen
        ? "Required work remains and will block closure until it is complete."
        : "Delivery is complete and no required work remains.",
    };
  }
  return { id: "none", category: "Matter closure", label: "Matter closed", detail: "The work was delivered or otherwise resolved." };
}

export function lifecycleActionNeedsDirectMutation(action: MatterActionId): action is "approve_response" | "mark_as_sent" | "close_matter" {
  return action === "approve_response" || action === "mark_as_sent" || action === "close_matter";
}

/** Present the backend-derived stage and actor without repeating the current task. */
export function workflowStateExplanation(detail: MatterDetail): string {
  const stage = {
    intake: "Just came in",
    research: "Being researched",
    explore: "Waiting on your judgment",
    generate: "Being drafted",
    respond: "Respond",
    closed: "Closed",
  }[detail.status];
  const workItem = detail.work_items.find((item) => item.work_item_id === detail.work_state.next_work_item_id);

  if (detail.status === "closed") {
    return "Stage: Closed. No action required.";
  }
  const requiredWorkRemains = detail.work_items.some(
    (item) => Boolean(item.required) && !["done", "closed"].includes(item.status),
  );
  if (detail.status === "respond" && detail.response_sent_at && requiredWorkRemains) {
    return "Stage: Respond. Manual delivery recorded. Required work remains before closure.";
  }
  if (["queued", "running"].includes(detail.work_state.execution_state)) {
    return `${stage} · Research still running in the background.`;
  }
  if (detail.work_state.next_actor === "unassigned") {
    const subject = workItem?.title ? ` for “${workItem.title}”` : "";
    return `Stage: ${stage}. Assign an owner${subject}.`;
  }
  if (detail.work_state.next_actor === "named_owner") {
    return `Stage: ${stage}. Waiting on ${detail.work_state.next_owner || "the assigned owner"}.`;
  }
  if (detail.work_state.next_actor === "themis") {
    return `Stage: ${stage}. Ready for Themis.ai.`;
  }
  if (detail.work_state.next_actor === "you") {
    return `Stage: ${stage}. Waiting on you.`;
  }
  return `Stage: ${stage}.`;
}
