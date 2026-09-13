"""Disposable grouped-intake browser fixture; no user vault changes."""
from serve_experimental_chat_demo import app, context
from app.providers.base import ProviderReply
MATTER = "MAT-DEMO-BEACON"
questions = [
    ("jurisdiction", "Where will the pilot operate?", "Location changes which laws to research.", "could_change_answer", ["United States", "European Union"]),
    ("audience", "Who will take part?", "Employees and customers may raise different duties.", "could_change_answer", ["Employees", "Existing customers"]),
    ("data", "What information will the pilot use?", "Data categories can change the applicable rules.", "could_change_answer", ["Contact details", "Payment details"]),
    ("commitments", "Are there existing promises about this use?", "Existing commitments may limit the proposed use.", "could_change_answer", ["Yes", "No"]),
    ("timing", "When is the pilot expected to start?", "Timing helps order the review work.", "could_refine_advice", []),
    ("rollout", "Is a broader rollout planned?", "A broader rollout may need a separate analysis.", "could_refine_advice", ["Yes", "No"]),
    ("owner", "Who owns the pilot?", "An owner can help with later questions.", "helpful_detail", []),
    ("reference", "Is there a project reference?", "This helps locate supporting material.", "helpful_detail", []),
]
cards = [{"type": "question", "question_id": qid, "text": text, "reason": reason, "priority": priority, "selection_mode": "single" if choices else "free_text", "choices": [{"value": c, "label": c} for c in choices], "allow_skip": True, "allow_stop": True, "conflict": False} for qid, text, reason, priority, choices in questions]
saved = context.chat_history.append(MATTER, None, role="user", content="Explore the legal issues for this pilot.", conversation_kind="experimental")
context.chat_history.append(MATTER, saved["conversation_id"], role="assistant", content="The audience, location, and proposed use will guide the research. You can leave gaps open.", cards=cards)
context.chat_history.update_state(MATTER, saved["conversation_id"], intake_state="active", active_agent_id="intake-agent")
context.matter_records.set_intake_state(MATTER, "active")
class GroupedProvider:
    calls = 0
    async def complete(self, messages, tools=None):
        self.calls += 1
        self.messages = messages
        return ProviderReply(content="## Initial issue map\n\n- **Privacy and data use.** Location and data categories guide the applicable-law research.\n- **Customer commitments.** Check whether existing terms limit the proposed use.\n\nThe data categories and existing promises remain unknown. This fixture has not retrieved legal authority.\n\n## Assumptions used\n\n- **A limited pilot.** The scope analysis assumes a limited launch. A wider rollout would need review. This is an assumption, not a supplied fact.\n\nWhich issue would you like to explore first?")
provider = GroupedProvider()
context.runner.provider = provider
@app.get("/fixture-result")
def fixture_result():
    record = context.matter_records.get(MATTER)
    return {"calls": provider.calls, "answers": record["intake_answers"], "facts": record["facts"]}
