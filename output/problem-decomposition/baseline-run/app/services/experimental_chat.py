"""Editable guidance isolated to the experimental conversation surface."""
from pathlib import Path
import hashlib

SKILLS = ("dialogue", "intake", "research", "answer", "draft", "audit")
DEFAULTS = Path(__file__).resolve().parents[1] / "experimental_skills"


def read_skill(vault, name):
    if name not in SKILLS:
        raise ValueError("Unknown experimental skill.")
    path = f"00_System/experimental-chat/{name}.md"
    content = vault.read_markdown(path)["content"] if vault.exists(path) else (DEFAULTS / f"{name}.md").read_text()
    return {"name": name, "path": path, "content": content,
            "revision": hashlib.sha256(content.encode()).hexdigest()}


def guidance(vault):
    skills = [read_skill(vault, name) for name in SKILLS]
    return {"skills": skills, "instructions": "\n\n".join(f"# {s['name']}\n{s['content']}" for s in skills)}


def intake_tools(provider_tools):
    """Extend only experimental intake; leave the shared tool contract intact."""
    from copy import deepcopy
    tools = deepcopy(provider_tools)
    for tool in tools:
        function = tool.get("function", {})
        if function.get("name") != "update_matter_intake":
            continue
        questions = function["parameters"]["properties"]["next_questions"]
        questions.pop("maxItems", None)
        properties = questions["items"]["properties"]
        properties["priority"] = {"type": "string", "enum": [
            "could_change_answer", "could_refine_advice", "helpful_detail"]}
        properties["topic"] = {"type": "string"}
        questions["description"] = (
            "Group the useful independent questions in one optional intake surface. "
            "Do not pad to a count or split an independent set into repeated batches. "
            "Order by whether an answer changes applicable law, research direction, "
            "or the main conclusion. Give each question a priority and short reason. "
            "Defer dependent questions until the prerequisite answer is known."
        )
    return tools


def validate_documents(payload, context):
    """A fixed document chip must not silently become a newer version at send."""
    from app.services.workspace import WorkspaceConflict
    documents = {item["path"]: item for item in context.workspace_review.documents(payload.matter_id)}
    for selection in payload.context_selections or []:
        if not selection.get("selected", True) or not selection.get("path"):
            continue
        path = selection["path"]
        document = documents.get(path)
        if not document:
            raise ValueError("A selected experimental document is not in this matter.")
        if selection.get("revision") and document["revision"] != selection["revision"]:
            raise WorkspaceConflict("A selected document changed. Remove it and include its current version before sending.", document["revision"], code="target_conflict")


def freeze_comment(payload, context):
    if not payload.experimental_comment_id:
        return None
    if not payload.target or not payload.target.artifact_path:
        raise ValueError("A comment question needs its original document target.")
    review = context.document_reviews.get(payload.target.artifact_path)
    thread = next((item for item in review["comments"] if item["thread_id"] == payload.experimental_comment_id), None)
    if not thread:
        raise ValueError("The selected comment is unavailable.")
    if payload.target.artifact_review_revision and payload.target.artifact_review_revision != review["revision"]:
        raise ValueError("The comment changed. Select it again before sending.")
    return {"path": payload.target.artifact_path, "thread": thread,
            "artifact_revision": review["artifact_revision"], "review_revision": review["revision"]}


def answer_comment(payload, context, response, run_id):
    from app.models.api import DocumentReviewAction
    from app.services.dossier import serialized
    @serialized
    def save():
        frozen = (payload.frozen_context or {}).get("experimental_comment")
        if not frozen or not response.reply.strip():
            return
        path = frozen["path"]
        document = context.vault.read_markdown(path)
        if run_id in document["metadata"].get("experimental_comment_runs", []):
            return
        body = response.reply
        for card in response.cards:
            if card.type == "work_product":
                body += f"\n\n[{card.title}]({card.vault_path})"
        context.document_reviews.apply(path, DocumentReviewAction(action="reply_comment",
            thread_id=frozen["thread"]["thread_id"], body=body,
            author_id="author-themis", author_name="Themis.ai"),
            expected_revision=frozen["artifact_revision"], expected_review_revision=frozen["review_revision"])
        document = context.vault.read_markdown(path)
        document["metadata"].setdefault("experimental_comment_runs", []).append(run_id)
        context.vault.write_markdown(path, document["content"], document["metadata"])
        response.changed_paths.append(path)
    try:
        save()
    except (ValueError, KeyError, OSError):
        response.reply += "\n\nThe answer is kept here. Its comment thread changed or could not be updated; review the current thread before applying this answer."


def extract_choices(response, run_id):
    """Optional quick replies never replace useful prose or record an answer."""
    import json
    import re
    from app.models.api import QuestionCard, ChatChoice
    match = re.search(r"```chat-choices\s*\n(.*?)\n```\s*$", response.reply, re.S)
    if not match:
        return
    try:
        data = json.loads(match.group(1))
        question, choices = data["question"], data["choices"]
        if not isinstance(question, str) or not question.strip() or len(question) > 1000:
            return
        if not isinstance(choices, list) or not 1 <= len(choices) <= 7:
            return
        if any(not isinstance(choice, str) or not choice.strip() or len(choice) > 200 for choice in choices):
            return
        response.cards.append(QuestionCard(question_id=f"experimental-{run_id}", text=question,
            choices=[ChatChoice(value=choice, label=choice) for choice in choices], allow_skip=False, allow_stop=False))
        response.reply = response.reply[:match.start()].rstrip() or question
    except (ValueError, KeyError, TypeError):
        return


def resolve_chat_provider(payload, context):
    if payload.model_selection is None:
        return context.runner.resolve(payload.agent_id)
    if not payload.experimental_chat:
        raise ValueError("Chat model selection is only available in experimental chat.")
    from app.providers.base import ProviderSelection
    return context.provider_router.resolve_selection(ProviderSelection(
        agent_id=payload.agent_id, **payload.model_selection.model_dump()))
