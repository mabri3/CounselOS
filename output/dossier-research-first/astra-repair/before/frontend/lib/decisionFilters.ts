import type { WorkspaceSettings } from "./types";

export function configuredLawyerName(settings: WorkspaceSettings | null): string {
  return settings?.sections
    .flatMap((section) => section.rows)
    .find((row) => row.config_key === "document_review.lawyer_name")
    ?.value?.trim() ?? "";
}

export function isDecisionByConfiguredLawyer(decisionMaker: string, lawyerName: string): boolean {
  const normalizedLawyer = lawyerName.trim().toLowerCase();
  return Boolean(normalizedLawyer)
    && decisionMaker.trim().toLowerCase() === normalizedLawyer;
}
