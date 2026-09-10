"""Shared reasoning and optional transport for the existing main agent."""
import json
from app.models.problem_analysis import ProblemAnalysisPayload

PROBLEM_ANALYSIS_CONTRACT = """Construct and reassess the problem as part of this same answer:
1. Separate the desired business outcome from the proposed method and stated legal question. The objective is what the business wants to achieve, not the assignment to analyze it.
2. Test unsupported premises. Suggest a reframe when useful; never change the controlling question silently.
3. Describe actors, activities, relationships, geography, timing and relevant data, money, goods or obligation flows.
4. Separate compound factual propositions where useful, preserving sources, qualifications and relationships.
5. Identify plausible tentative legal characterizations from activities, not merely business labels.
6. Form specific applicability, definition, requirement, exception and consequence questions. Include relevant contracts and company policies.
7. Connect each retained issue to facts or an explained material unknown. Check omissions and interactions.
8. Test material conclusions against adverse facts, credible competing interpretations and answer-changing facts. Do not manufacture opposition.
9. Prioritize research and business questions by their effect on the decision.
10. Recombine the parts into practical advice and feasible alternatives, including changes to the proposed design.
11. Reassess when facts, law, sources or the business question change. Add, split, merge, retire or reframe subquestions when warranted. Explain changed and unchanged conclusions. Do not close canonical issues or alter recorded decisions.
Scale to the matter: a simple question can have one subquestion; wording edits or unrelated chat need no map.
Before substantive external collection, form a provisional breakdown and use it to select actual requested propositions.
A concise planning summary may appear in the existing tool-loop journal. Do not expose private deliberation.
Establish activities before applying rules. Research can change the facts-to-questions mapping. Preserve relationships.
Unknowns must explain what could change. Use existing question cards: at most one in step-by-step mode; retain grouped intake's short sets and skip/stop controls.
Record only material inclusions, exclusions and unresolved coverage with reasons. Never claim exhaustive coverage.
Distinguish supplied statements, assumptions, generated analysis and verified sources. Never invent law, sources, dates, owners, jurisdiction or factual certainty. A legal proposition is not a business fact.
New law requires source status, scope, jurisdiction, effective timing, definitions and exceptions where available. Proposed rules do not create present obligations.
Keep each rule version and amendment tied to its own supplied effective date. Do not infer retroactivity or replace an amendment date with the original rule's date.
When jurisdiction or governing definitions are missing, explain plausible classifications and their differentiating facts conditionally. A fee or personal recourse can support a credit characterization; it does not establish a legal category by itself. Do not add unstated operational facts to complete the story.
Keep source permissions, citation honesty, scoped tools, execution limits and useful-answer fallback. Finish with the integrated answer, not only a plan.
For a substantive answer that creates or reassesses a material breakdown, append one fenced JSON block labelled problem-analysis after the useful prose. Omit it for wording edits or unrelated chat. The transport is optional to the application: if it fails, still deliver the answer; never ask the lawyer to repair JSON.
Use only supplied canonical IDs; sources have IDs, never invented paths. New subquestions may have no issue_id. Use local keys for explanation links, never as recorded facts or decisions. Prior keys refer to the supplied exact prior map only.
Transport limits: 40 parts, 40 questions, 20 coverage notes, 20 changes, 10 alternatives, 20 references per item, 4000 characters per narrative field, 200000 characters total. These are maximums, not target counts.
The optional fence uses this schema (server envelope fields are forbidden):
""" + json.dumps(ProblemAnalysisPayload.model_json_schema(), separators=(",", ":"))
