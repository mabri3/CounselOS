---
{
  "tool_id": "manage_output_template",
  "handler": "manage_output_template",
  "description": "List, create, duplicate, update or select a default reusable output template only as explicitly requested. Values use the existing template fields. Updates require expected_revision. Run-only instructions never update a reusable template.",
  "parameters": {
    "type": "object",
    "properties": {
      "operation": {
        "type": "string",
        "enum": [
          "list",
          "create",
          "duplicate",
          "update",
          "set_default"
        ]
      },
      "template_id": {
        "type": "string"
      },
      "values": {
        "type": "object"
      }
    },
    "required": [
      "operation"
    ],
    "additionalProperties": false
  }
}
---
# manage_output_template

List, create, duplicate, update or select a default reusable output template only as explicitly requested. Values use the existing template fields. Updates require expected_revision. Run-only instructions never update a reusable template.
