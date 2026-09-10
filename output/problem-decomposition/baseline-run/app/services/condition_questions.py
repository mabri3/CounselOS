"""Shared, read-only question view for page controls and inquiry context."""

def question_view(condition, number, answers):
    saved = next((a for a in reversed(answers) if a.get("condition_id") == condition["condition_id"]), None)
    choices = list(condition.get("answer_choices") or [])
    if not choices and condition.get("assessment_basis"):
        choices.append({"label": "Draft from saved analysis", "answer": condition["assessment_basis"]})
    if not any(c["answer"] == "This has not yet been confirmed." for c in choices):
        choices.append({"label": "Not yet confirmed", "answer": "This has not yet been confirmed."})
    return {"question_number": number, "question": condition["question"],
            "condition_id": condition["condition_id"], "answer_choices": choices,
            "reported_answer": saved, "answer_history": [a for a in answers if a.get("condition_id") == condition["condition_id"]]}
