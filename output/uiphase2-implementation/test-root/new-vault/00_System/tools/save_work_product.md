---
tool_id: save_work_product
handler: save_work_product
description: Save a recommendation, a new editable draft, or a pending tracked revision to the selected draft. A request to propose changes authorizes this save; it does not accept the redlines.
parameters:
  type: object
  properties:
    matter_id: {type: string}
    title: {type: string}
    content: {type: string}
    kind: {type: string, enum: [recommendation, draft, response]}
    existing_draft_path: {type: string}
    operation: {type: string, enum: [create, revise], description: Create a distinct document or revise only the visible selected draft.}
    output_type: {type: string}
    template_id: {type: string}
    overrides: {type: object, additionalProperties: {type: string}}
    source_document_path: {type: string, description: Copy the selected supplied clause or document into an editable draft while preserving the original.}
    cover_email_content: {type: string, description: For outside_counsel_brief supply the short cover email separately from the brief content. Both become editable drafts. Outgoing attachments are selected separately in the workspace.}
    reason: {type: string}
    recommendation: {type: string, description: Optional separate working recommendation to save with the draft. Draft prose is never inferred as a recommendation.}
  required: [title, content, kind]
  additionalProperties: false
---
# Tool: save_work_product

Create a distinct editable document with operation=create, including additional memos, clauses and checklists. For a requested change to the visible selected draft use operation=revise and its exact existing_draft_path. Never infer a target from the current draft pointer. Revisions need the frozen content and review revisions supplied by the application. For a selected range, content is ONLY the replacement range. Supply the full deliverable body for a new draft. Match output_type and template_id to the submitted template library. For a supplied clause use source_document_path to preserve the exact original and its review history. No draft or preview records a decision or sends anything.

A current request such as "Update the selected memo. Propose the smallest change and keep prior text for review" requires operation=revise now. The result is a saved pending redline, not an accepted change. Do not ask again whether to save that requested proposal.
