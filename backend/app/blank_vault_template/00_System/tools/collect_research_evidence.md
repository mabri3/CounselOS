---
tool_id: collect_research_evidence
handler: collect_research_evidence
description: Collect public evidence using this run's saved model/services and permissions.
  public_query is a focused natural-language question; external matching depends on
  the provider, not vault-search syntax. public_url fetches one exact public HTTPS
  page or linked PDF instead of search. Follow-up requests require the returned prior
  request_key and a changed query or source_goal; do not repeat a broad search. Returned
  source_id identifies saved text for read_research_source. Source previews (up to
  1200 characters, subject to remaining budget) and generated worker notes are for
  relevance, not citation support. Read needed literal passages, including applicable
  definitions, exceptions and cross-references. A returned status is a transport result,
  not legal verification. Empty/partial results, warnings, unread sources, or truncation
  are gaps, not proof that no authority exists. If permitted, simplify/rephrase or
  read a relevant exact URL; preserve useful conditional advice if retrieval fails.
  Public text is capped at 100000 characters; document extraction is bounded to 30
  pages and 6 OCR pages. Unextracted or upstream-truncated text is not available through
  passage continuation. Stay within the saved scope and remaining run budget; never
  send private matter details.
parameters:
  $defs:
    ResearchEvidenceRequest:
      additionalProperties: false
      properties:
        proposition_id:
          description: Your stable label for the proposition being researched; not
            a source ID.
          maxLength: 80
          minLength: 1
          title: Proposition Id
          type: string
        proposition:
          description: Public proposition to resolve. For follow-up, name the missing
            material and how it could change the advice; omit private facts.
          maxLength: 1500
          minLength: 1
          title: Proposition
          type: string
        jurisdiction:
          default: unknown
          maxLength: 200
          title: Jurisdiction
          type: string
        entity_activity:
          default: ''
          maxLength: 500
          title: Entity Activity
          type: string
        public_query:
          description: Focused natural-language public search query for the saved
            collector/services, not vault-search syntax. Provider matching varies.
            Without follow-up permission, use exactly the confirmed query, including
            for a direct URL request.
          maxLength: 2000
          minLength: 1
          title: Public Query
          type: string
        source_goal:
          description: Type of evidence sought; not a claim that a returned page establishes
            the proposition.
          enum:
          - operative_rule
          - exception
          - contrary_material
          - guidance
          - background
          title: Source Goal
          type: string
        public_url:
          anyOf:
          - maxLength: 2000
            type: string
          - type: 'null'
          default: null
          description: Exact public HTTPS URL, including a relevant linked page or
            PDF, to fetch instead of searching. Still subject to saved scope and network
            checks. Use the returned source_id for later passage reads.
          title: Public Url
        followup_of:
          anyOf:
          - maxLength: 160
            type: string
          - type: 'null'
          default: null
          description: For every request after the first batch, copy an exact earlier
            request_key from this run. Do not use a source_id, proposition_id, or
            URL. Requires saved follow-up permission.
          title: Followup Of
      required:
      - proposition_id
      - proposition
      - public_query
      - source_goal
      title: ResearchEvidenceRequest
      type: object
  additionalProperties: false
  properties:
    requests:
      description: One to four focused requests in this batch, within the saved run's
        remaining budget.
      items:
        $ref: '#/$defs/ResearchEvidenceRequest'
      maxItems: 4
      minItems: 1
      title: Requests
      type: array
  required:
  - requests
  title: ResearchEvidenceBatch
  type: object
---
Declarative investigation tool; requires server authorization.

