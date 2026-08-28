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
    return { id: "review_and_decide", category: "Counsel judgment", label: "Review and decide", detail: "Test the options and choose the path forward." };
  }
  if (detail.status === "generate") {
    return hasDraft
      ? { id: "review_draft", category: "Work action", label: "Review draft", detail: "Check the work product before it is approved or sent." }
      : { id: "draft_work_product", category: "Work action", label: "Draft work product", detail: "Create the output for the chosen path." };
  }
  if (detail.status === "respond") {
    if (!detail.response_approved_at) {
      return { id: "approve_response", category: "Approval", label: "Approve response", detail: "Give permission to use or send this work product." };
    }
    if (!detail.response_sent_at) {
      return { id: "mark_as_sent", category: "Delivery", label: "Mark as sent", detail: "Record that the approved response was delivered." };
    }
    const requiredOpen = detail.work_items.some(
      (item) => Boolean(item.required) && !["done", "closed"].includes(item.status),
    );
    return requiredOpen
      ? { id: "review_remaining_work", category: "Work action", label: "Review remaining work", detail: "Complete required work before closing the matter." }
      : { id: "close_matter", category: "Matter closure", label: "Close matter", detail: "Delivery is complete and no required work remains." };
  }
  return { id: "none", category: "Matter closure", label: "Matter closed", detail: "The work was delivered or otherwise resolved." };
}
