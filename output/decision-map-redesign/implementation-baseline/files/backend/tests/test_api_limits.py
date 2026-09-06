from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.models.api import (
    MAX_CHAT_HISTORY_MESSAGES,
    MAX_CHAT_MESSAGE_CHARS,
    MAX_DOCUMENT_REVIEW_AUTHOR_CHARS,
    MAX_DOCUMENT_REVIEW_BODY_CHARS,
    MAX_DOCUMENT_REVIEW_CONTENT_CHARS,
    MAX_DOCUMENT_REVIEW_ID_CHARS,
    MAX_DOCUMENT_REVIEW_QUOTE_CHARS,
    MAX_FILE_CONTENT_CHARS,
    MAX_MATTER_DESCRIPTION_CHARS,
    MAX_MATTER_REQUEST_CHARS,
    MAX_RECOMMENDATION_CONTENT_CHARS,
    ChatMessage,
    ChatRequest,
    DocumentReviewAction,
    FileUpdate,
    MatterCreate,
    RecommendationUpdateRequest,
)


def test_chat_request_accepts_exact_text_and_history_limits() -> None:
    request = ChatRequest(
        message="m" * MAX_CHAT_MESSAGE_CHARS,
        history=[ChatMessage(role="user", content="h" * MAX_CHAT_MESSAGE_CHARS)]
        + [ChatMessage(role="user", content="h") for _ in range(MAX_CHAT_HISTORY_MESSAGES - 1)],
    )

    assert len(request.message) == MAX_CHAT_MESSAGE_CHARS
    assert len(request.history) == MAX_CHAT_HISTORY_MESSAGES


@pytest.mark.parametrize(
    ("payload", "field"),
    [
        ({"message": "m" * (MAX_CHAT_MESSAGE_CHARS + 1)}, "message"),
        ({"history": [ChatMessage(role="user", content="h")] * (MAX_CHAT_HISTORY_MESSAGES + 1)}, "history"),
        ({"history": [{"role": "user", "content": "h" * (MAX_CHAT_MESSAGE_CHARS + 1)}]}, "history.0.content"),
    ],
)
def test_chat_request_rejects_over_limit_values(payload, field: str) -> None:
    with pytest.raises(ValidationError, match=field):
        ChatRequest(**payload)


@pytest.mark.parametrize(
    ("model", "exact", "over_limit"),
    [
        (FileUpdate, {"content": "f" * MAX_FILE_CONTENT_CHARS}, {"content": "f" * (MAX_FILE_CONTENT_CHARS + 1)}),
        (MatterCreate, {"title": "Matter", "request_text": "r" * MAX_MATTER_REQUEST_CHARS, "description": "d" * MAX_MATTER_DESCRIPTION_CHARS}, {"title": "Matter", "request_text": "r" * (MAX_MATTER_REQUEST_CHARS + 1)}),
        (MatterCreate, {"title": "Matter", "request_text": "request", "description": "d" * MAX_MATTER_DESCRIPTION_CHARS}, {"title": "Matter", "request_text": "request", "description": "d" * (MAX_MATTER_DESCRIPTION_CHARS + 1)}),
        (RecommendationUpdateRequest, {"content": "r" * MAX_RECOMMENDATION_CONTENT_CHARS, "actor": "Counsel"}, {"content": "r" * (MAX_RECOMMENDATION_CONTENT_CHARS + 1), "actor": "Counsel"}),
    ],
)
def test_content_models_accept_exact_limits_and_reject_one_character_more(model, exact, over_limit) -> None:
    assert model(**exact)

    with pytest.raises(ValidationError):
        model(**over_limit)


@pytest.mark.parametrize(
    ("field", "limit"),
    [
        ("content", MAX_DOCUMENT_REVIEW_CONTENT_CHARS),
        ("body", MAX_DOCUMENT_REVIEW_BODY_CHARS),
        ("quote", MAX_DOCUMENT_REVIEW_QUOTE_CHARS),
        ("author_id", MAX_DOCUMENT_REVIEW_AUTHOR_CHARS),
        ("author_name", MAX_DOCUMENT_REVIEW_AUTHOR_CHARS),
        ("author_color", MAX_DOCUMENT_REVIEW_AUTHOR_CHARS),
        ("thread_id", MAX_DOCUMENT_REVIEW_ID_CHARS),
        ("change_id", MAX_DOCUMENT_REVIEW_ID_CHARS),
        ("comment_id", MAX_DOCUMENT_REVIEW_ID_CHARS),
    ],
)
def test_document_review_fields_accept_exact_limits_and_reject_one_character_more(field: str, limit: int) -> None:
    exact = DocumentReviewAction(action="add_comment", **{field: "x" * limit})
    assert getattr(exact, field) == "x" * limit

    with pytest.raises(ValidationError, match=field):
        DocumentReviewAction(action="add_comment", **{field: "x" * (limit + 1)})
