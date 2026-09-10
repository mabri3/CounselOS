---
tool_id: update_matter_intake
handler: update_matter_intake
description: Save one structured Intake Agent turn and a model-prioritized set of next questions to the active matter. Source IDs are supplied by Themis.ai, never by the model.
parameters:
  type: object
  additionalProperties: false
  required: [working_ask, intake_state]
  properties:
    working_ask: {type: string, minLength: 1}
    reported_facts:
      type: array
      items:
        type: object
        additionalProperties: false
        required: [statement]
        properties:
          statement: {type: string, minLength: 1}
          status: {type: string, enum: [reported, assumption, missing, conflict]}
          materiality: {type: string}
    issues: {type: array, items: {type: string}}
    assumptions: {type: array, items: {type: string}}
    material_missing_facts: {type: array, items: {type: string}}
    human_questions: {type: array, items: {type: string}}
    public_research_questions: {type: array, maxItems: 3, items: {type: string}}
    next_questions:
      type: array
      maxItems: 5
      description: Questions ordered by model-assessed priority, with the most decision-changing question first. Required to contain at least one item when intake_state is active; ask no intake questions only in prose. Each single-choice question must resolve one independently answerable fact. Split independent dimensions into separate questions.
      items:
        type: object
        additionalProperties: false
        required: [question_id, text, selection_mode, choices]
        properties:
          question_id: {type: string, minLength: 1}
          text: {type: string, minLength: 1}
          reason: {type: [string, "null"]}
          selection_mode: {type: string, enum: [single, multiple, free_text]}
          choices:
            type: array
            maxItems: 7
            items:
              type: object
              additionalProperties: false
              required: [value, label]
              properties:
                value: {type: string, minLength: 1}
                label: {type: string, minLength: 1}
                suggested: {type: boolean}
          allow_skip: {type: boolean}
          allow_stop: {type: boolean}
          conflict: {type: boolean}
          record_target:
            type: string
            enum: [fact, jurisdiction_scope, product_area, business_team, matter_type, target_date, requester, business_owner, risk_level]
            default: fact
    next_question:
      description: Legacy single-question shape. A single-choice question must resolve one independently answerable fact; split independent dimensions into separate questions.
      anyOf:
        - type: "null"
        - type: object
          additionalProperties: false
          required: [question_id, text, selection_mode, choices]
          properties:
            question_id: {type: string, minLength: 1}
            text: {type: string, minLength: 1}
            reason: {type: [string, "null"]}
            selection_mode: {type: string, enum: [single, multiple, free_text]}
            choices:
              type: array
              maxItems: 7
              items:
                type: object
                additionalProperties: false
                required: [value, label]
                properties:
                  value: {type: string, minLength: 1}
                  label: {type: string, minLength: 1}
                  suggested: {type: boolean}
            allow_skip: {type: boolean}
            allow_stop: {type: boolean}
            conflict: {type: boolean}
            record_target:
              type: string
              enum: [fact, jurisdiction_scope, product_area, business_team, matter_type, target_date, requester, business_owner, risk_level]
              default: fact
    intake_state: {type: string, enum: [active, complete]}
    dossier_orientation: {type: [string, "null"]}
---

# Update matter intake

Use this once per Intake Agent turn. Give a factual working summary and an ordered set of the most useful next questions. When intake remains active, next_questions must contain at least one structured question. If no material question remains, mark intake complete. The first question must have the highest expected effect on the analysis or recommendation. Do not ask intake questions only in prose. Do not invent source IDs.
