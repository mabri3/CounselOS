---
tool_id: run_research
handler: run_research
description: Propose research and ask the user to choose external sources and/or other matters before starting. This tool does not return search hits or fetch URLs. No search starts until the user confirms the source choices. In an already authorized investigation, use collect_research_evidence and read_research_source instead of restarting this choice.
parameters:
  type: object
  properties:
    matter_id:
      type: string
    question:
      type: string
    public_query:
      type: string
      description: A short public legal search query. Use generic legal concepts, jurisdictions and regulators only. Omit company names, private facts, dates, amounts, identifiers and internal paths. The user can edit this before external search.
  required: []
  additionalProperties: false
---
# Tool: run_research

Propose first-pass research. Always call this tool for a research request, including when the user explicitly asks for the web or other matters. The source-choice card records consent for one run after cost and sensitivity notices. Do not say research is running until it has actually started. Do not use another tool to bypass this choice.

This Markdown file is a declarative specification. The runtime maps `handler: run_research` to an allow-listed Python function; it does not execute Markdown code.
