---
{
  "tool_id": "workspace_action",
  "handler": "workspace_action",
  "description": "Use the named typed action for the current matter. Select actual scope for canonical changes; scenario scope permits ONLY save_scenario. Do not re-answer previously answered questions. Use inspect when identities/revisions are needed.",
  "parameters": {
    "type": "object",
    "properties": {
      "action": {
        "type": "string",
        "enum": [
          "inspect",
          "correct_fact",
          "save_scenario",
          "save_flow",
          "adopt_scenario",
          "accept_flow_facts",
          "save_preferences",
          "save_contribution",
          "set_context",
          "prior_work",
          "draft_practice_note",
          "save_practice_note",
          "apply_practice_note",
          "create_assumption_watch",
          "offer_update",
          "save_question"
        ]
      },
      "values": {
        "type": "object",
        "description": "Action-specific fields: correct_fact: {fact_id: existing ID or null, replacement: exact new factual text}. save_preferences: {preferences:{audience,purpose,tone,length,exclusions,source_presentation,business_constraint},expected_revision: inspect.preferences_revision}. save_contribution: {text,kind: audience|business_constraint|accepted_analysis|instruction,expected_revision: inspect.contributions_revision,source_ids?:[],supersedes?:ID}. set_context: {selections:[{reference_id,role,path,selected}],expected_revision: inspect.context.revision}. save_scenario: {title,analysis,proposed_fact_changes:[{change_id,text,supersedes_fact_id?}],issue_ids:[],unresolved_conditions:[]}; for existing scenario include scenario_id and expected_revision. save_flow: {flow:{matter_id,actors:[{actor_id,label}],edges:[{edge_id,from_actor_id,to_actor_id,label,order,timing,custody,ownership,fact_ids,uncertainty}]},expected_revision}. adopt_scenario: {scenario_id,change_ids:[]}. accept_flow_facts: {change_ids:[]}. prior_work: {query}. draft_practice_note: {goal,correction,name?}. save_practice_note: {skill_id,name,description,instructions,example?}. apply_practice_note: {skill_id}. create_assumption_watch: {assumption_ids:[],request:{title,standing_question,public_query:{text},purposes:[...]}} (inspect existing watch tool schema for purpose/public fields). offer_update: {offer_id,artifact_path,base_revision,reason,state:offered}. save_question: {text,consequence,issue_id?}. inspect: {}."
      }
    },
    "required": [
      "action",
      "values"
    ],
    "additionalProperties": false
  }
}
---
# Workspace action

Use the named typed action for the current matter. Select actual scope for canonical changes; scenario scope permits ONLY save_scenario. Do not re-answer previously answered questions. Use inspect when identities/revisions are needed.
