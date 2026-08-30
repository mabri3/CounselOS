from __future__ import annotations

import zipfile
from io import BytesIO

from pypdf import PdfReader

from app.models.api import DocumentReviewAction


PATH = "03_Matters/beacon-instant-onboarding/drafts/review-demo.md"


def _write(app_context, content: str, metadata: dict | None = None) -> None:
    app_context.vault.write_markdown(PATH, content, metadata or {"record_type": "draft"})


def test_track_changes_can_accept_and_reject_individual_changes(app_context):
    _write(app_context, "The notice period is 10 days.")
    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="set_tracking", enabled=True))
    document = app_context.vault.read_markdown(PATH)
    app_context.vault.write_markdown(
        PATH,
        "The notice period is 30 days.",
        document["metadata"],
    )

    review = app_context.document_reviews.get(PATH)
    assert review["tracking"] is True
    assert len(review["changes"]) == 1
    assert review["changes"][0]["old_text"] == "10"
    assert review["changes"][0]["new_text"] == "30"

    app_context.document_reviews.apply(
        PATH,
        DocumentReviewAction(action="reject_change", change_id=review["changes"][0]["change_id"]),
    )
    assert app_context.vault.read_markdown(PATH)["content"].strip() == "The notice period is 10 days."
    assert app_context.document_reviews.get(PATH)["changes"] == []

    app_context.vault.write_markdown(PATH, "The notice period is 30 days.", app_context.vault.read_markdown(PATH)["metadata"])
    change_id = app_context.document_reviews.get(PATH)["changes"][0]["change_id"]
    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="accept_change", change_id=change_id))
    assert app_context.vault.read_markdown(PATH)["content"].strip() == "The notice period is 30 days."
    assert app_context.document_reviews.get(PATH)["changes"] == []


def test_tracking_can_turn_off_without_deciding_open_changes(app_context):
    _write(app_context, "Original")
    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="set_tracking", enabled=True))
    document = app_context.vault.read_markdown(PATH)
    app_context.vault.write_markdown(PATH, "Changed", document["metadata"])

    review = app_context.document_reviews.apply(PATH, DocumentReviewAction(action="set_tracking", enabled=False))

    assert review["tracking"] is False
    assert len(review["changes"]) == 1
    rejected = app_context.document_reviews.apply(
        PATH,
        DocumentReviewAction(action="reject_change", change_id=review["changes"][0]["change_id"]),
    )
    assert rejected["tracking"] is False
    assert rejected["changes"] == []
    assert app_context.vault.read_markdown(PATH)["content"].strip() == "Original"


def test_untracked_edge_edits_stay_plain_and_keep_the_existing_change_attached(app_context):
    _write(app_context, "Original")
    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="set_tracking", enabled=True))
    app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="save_revision", content="Original redline", author_id="author-alex", author_name="Alex Chen"))
    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="set_tracking", enabled=False))

    review = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="save_untracked", content="Before Original redline After"))

    assert review["tracking"] is False
    assert [(change["old_text"], change["new_text"]) for change in review["changes"]] == [("", " redline")]
    assert app_context.vault.read_markdown(PATH)["content"].strip() == "Before Original redline After"

    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="set_tracking", enabled=True))
    review = app_context.document_reviews.get(PATH)
    assert [(change["old_text"], change["new_text"]) for change in review["changes"]] == [("", " redline")]
    rejected = app_context.document_reviews.apply(
        PATH, DocumentReviewAction(action="reject_change", change_id=review["changes"][0]["change_id"]))
    assert rejected["changes"] == []
    assert app_context.vault.read_markdown(PATH)["content"].strip() == "Before Original After"


def test_untracked_edge_edits_do_not_move_a_tracked_deletion(app_context):
    _write(app_context, "Alpha old Omega")
    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="set_tracking", enabled=True))
    saved = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="save_revision", content="Alpha Omega", author_id="author-alex", author_name="Alex Chen"))
    change_id = saved["changes"][0]["change_id"]
    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="set_tracking", enabled=False))

    review = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="save_untracked", content="Before Alpha Omega After"))

    assert [(change["old_text"], change["new_text"]) for change in review["changes"]] == [(" old", "")]
    deleted_at = next(index for index, item in enumerate(review["segments"]) if item.get("change_id") == change_id)
    assert "".join(item["text"] for item in review["segments"][:deleted_at] if item["kind"] != "delete").endswith("Alpha")
    assert "".join(item["text"] for item in review["segments"][deleted_at + 1:] if item["kind"] != "delete").startswith(" Omega")
    rejected = app_context.document_reviews.apply(
        PATH, DocumentReviewAction(action="reject_change", change_id=change_id))
    assert app_context.vault.read_markdown(PATH)["content"].strip() == "Before Alpha old Omega After"
    assert rejected["changes"] == []


def test_exports_use_native_word_and_pdf_review_annotations(app_context):
    _write(app_context, "Payment is due in 30 days.", {
        "record_type": "draft",
        "review": {
            "tracking": True,
            "baseline": "Payment is due in 10 days.",
            "comments": [{
                "comment_id": "COM-1",
                "quote": "30 days",
                "comment": "Confirm this period.",
                "author": "Reviewer",
                "resolved": False,
            }],
        },
    })

    docx_path, _ = app_context.document_exports.export(PATH, "docx")
    with zipfile.ZipFile(app_context.vault.resolve(docx_path)) as archive:
        document_xml = archive.read("word/document.xml")
        assert b"<w:ins" in document_xml
        assert b"<w:del" in document_xml
        assert "word/comments.xml" in archive.namelist()
        assert b"Confirm this period" in archive.read("word/comments.xml")

    pdf_path, _ = app_context.document_exports.export(PATH, "pdf")
    reader = PdfReader(app_context.vault.resolve(pdf_path))
    subtypes = {
        str(annotation.get_object()["/Subtype"])
        for page in reader.pages
        for annotation in page.get("/Annots", [])
    }
    assert "/Underline" in subtypes
    assert "/StrikeOut" in subtypes
    assert "/Highlight" in subtypes


def test_agent_revision_preserves_metadata_and_becomes_a_redline(app_context):
    _write(app_context, "Use the old clause.", {"record_type": "draft", "matter_id": "MAT-DEMO-BEACON"})

    app_context.document_reviews.propose_agent_revision(PATH, "Use the new clause.", {"purpose": "response"})

    document = app_context.vault.read_markdown(PATH)
    assert document["metadata"]["matter_id"] == "MAT-DEMO-BEACON"
    assert document["metadata"]["purpose"] == "response"
    assert document["metadata"]["review"]["last_proposed_by"] == "Themis"
    change = app_context.document_reviews.get(PATH)["changes"][0]
    assert change["old_text"] == "old"
    assert change["new_text"] == "new"


def test_v2_migration_and_revision_ids_are_stable(app_context):
    _write(app_context, "Pay in 30 days.", {"record_type": "draft", "review": {"tracking": True, "baseline": "Pay in 10 days."}})
    first = app_context.document_reviews.get(PATH)
    change_id = first["changes"][0]["change_id"]
    stored = app_context.vault.read_markdown(PATH)["metadata"]["review"]
    assert stored["version"] == 2
    assert "baseline" not in stored
    assert app_context.document_reviews.get(PATH)["changes"][0]["change_id"] == change_id


def test_later_overlap_preserves_existing_revision_and_exact_authors(app_context):
    _write(app_context, "Pay in 10 days.")
    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="set_tracking", enabled=True))
    first = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="save_revision", content="Pay in 30 days.", author_id="author-alex",
        author_name="Alex Chen", author_color="#7030A0"))
    first_id = first["changes"][0]["change_id"]
    second = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="save_revision", content="Pay in 45 days.", author_id="author-brian",
        author_name="Brian Harris", author_color="#008272"))
    assert first_id in {change["change_id"] for change in second["changes"]}
    assert {change["author_name"] for change in second["changes"]} == {"Alex Chen", "Brian Harris"}
    assert "".join(item["text"] for item in second["segments"] if item["kind"] != "delete").strip() == "Pay in 45 days."
    assert "".join(item["text"] for item in second["segments"] if item["kind"] != "insert").strip() == "Pay in 10 days."
    later_id = next(change["change_id"] for change in second["changes"] if change["author_name"] == "Brian Harris")
    restored = app_context.document_reviews.apply(PATH, DocumentReviewAction(action="reject_change", change_id=later_id))
    assert app_context.vault.read_markdown(PATH)["content"].strip() == "Pay in 30 days."
    assert restored["changes"] == [next(change for change in first["changes"] if change["change_id"] == first_id)]
    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="reject_change", change_id=first_id))
    assert app_context.vault.read_markdown(PATH)["content"].strip() == "Pay in 10 days."


def test_accepting_later_overlap_preserves_prior_change_causation(app_context):
    _write(app_context, "Pay in 10 days.")
    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="set_tracking", enabled=True))
    first = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="save_revision", content="Pay in 30 days.", author_id="author-alex", author_name="Alex Chen"))
    first_id = first["changes"][0]["change_id"]
    second = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="save_revision", content="Pay in 45 days.", author_id="author-brian", author_name="Brian Harris"))
    later_id = next(change["change_id"] for change in second["changes"] if change["author_name"] == "Brian Harris")
    accepted = app_context.document_reviews.apply(PATH, DocumentReviewAction(action="accept_change", change_id=later_id))
    assert accepted["changes"][0]["change_id"] == first_id
    assert accepted["changes"][0]["author_name"] == "Alex Chen"
    assert accepted["changes"][0]["new_text"] == "45"
    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="reject_change", change_id=first_id))
    assert app_context.vault.read_markdown(PATH)["content"].strip() == "Pay in 10 days."


def _assert_review_views(app_context, review, *, current: str, original: str) -> None:
    assert "".join(item["text"] for item in review["segments"] if item["kind"] != "delete").strip() == current
    assert "".join(item["text"] for item in review["segments"] if item["kind"] != "insert").strip() == original
    assert app_context.vault.read_markdown(PATH)["content"].strip() == current
    required = {"kind", "text", "change_id", "author_id", "author_name", "author_color", "created_at"}
    assert all(required <= set(item) for item in review["segments"])


def _overlapping_review(app_context):
    _write(app_context, "Pay in 10 days.")
    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="set_tracking", enabled=True))
    first = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="save_revision", content="Pay in 30 days.", author_id="author-alex", author_name="Alex Chen"))
    second = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="save_revision", content="Pay in 45 days.", author_id="author-brian", author_name="Brian Harris"))
    return first["changes"][0]["change_id"], next(
        change["change_id"] for change in second["changes"] if change["author_name"] == "Brian Harris")


def test_accepting_earlier_overlap_rebases_later_change(app_context):
    first_id, later_id = _overlapping_review(app_context)
    rebased = app_context.document_reviews.apply(PATH, DocumentReviewAction(action="accept_change", change_id=first_id))
    _assert_review_views(app_context, rebased, current="Pay in 45 days.", original="Pay in 30 days.")
    assert [(change["old_text"], change["new_text"], change["author_name"]) for change in rebased["changes"]] == [
        ("30", "45", "Brian Harris")]
    restored = app_context.document_reviews.apply(PATH, DocumentReviewAction(action="reject_change", change_id=later_id))
    _assert_review_views(app_context, restored, current="Pay in 30 days.", original="Pay in 30 days.")


def test_rejecting_earlier_overlap_rebases_later_change(app_context):
    first_id, later_id = _overlapping_review(app_context)
    rebased = app_context.document_reviews.apply(PATH, DocumentReviewAction(action="reject_change", change_id=first_id))
    _assert_review_views(app_context, rebased, current="Pay in 45 days.", original="Pay in 10 days.")
    assert [(change["old_text"], change["new_text"], change["author_name"]) for change in rebased["changes"]] == [
        ("10", "45", "Brian Harris")]
    accepted = app_context.document_reviews.apply(PATH, DocumentReviewAction(action="accept_change", change_id=later_id))
    _assert_review_views(app_context, accepted, current="Pay in 45 days.", original="Pay in 45 days.")


def test_accepting_both_overlapping_changes_keeps_later_text(app_context):
    first_id, later_id = _overlapping_review(app_context)
    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="accept_change", change_id=first_id))
    accepted = app_context.document_reviews.apply(PATH, DocumentReviewAction(action="accept_change", change_id=later_id))
    _assert_review_views(app_context, accepted, current="Pay in 45 days.", original="Pay in 45 days.")


def test_rejecting_both_overlapping_changes_restores_original_text(app_context):
    first_id, later_id = _overlapping_review(app_context)
    app_context.document_reviews.apply(PATH, DocumentReviewAction(action="reject_change", change_id=first_id))
    rejected = app_context.document_reviews.apply(PATH, DocumentReviewAction(action="reject_change", change_id=later_id))
    _assert_review_views(app_context, rejected, current="Pay in 10 days.", original="Pay in 10 days.")


def test_author_color_update_reaches_overlap_lineage(app_context):
    _, later_id = _overlapping_review(app_context)
    app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="set_author_color", author_id="author-alex", color="#C0006F"))
    persisted = app_context.vault.read_markdown(PATH)["metadata"]["review"]

    def alex_colors(segments):
        colors = []
        for segment in segments:
            if segment.get("author_id") == "author-alex":
                colors.append(segment.get("author_color"))
            colors.extend(alex_colors(segment.get("replaced_segments", [])))
        return colors

    assert alex_colors(persisted["segments"])
    assert set(alex_colors(persisted["segments"])) == {"#C0006F"}
    restored = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="reject_change", change_id=later_id))
    alex_change = next(change for change in restored["changes"] if change["author_id"] == "author-alex")
    assert alex_change["author_color"] == "#C0006F"
    assert all(segment["author_color"] == "#C0006F" for segment in restored["segments"] if segment.get("author_id") == "author-alex")


def test_legacy_migration_uses_last_proposed_author(app_context):
    _write(app_context, "Use the new clause.", {"record_type": "draft", "review": {
        "tracking": True, "baseline": "Use the old clause.", "last_proposed_by": "Alex Chen"}})
    review = app_context.document_reviews.get(PATH)
    assert {change["author_name"] for change in review["changes"]} == {"Alex Chen"}


def test_comment_deletion_keeps_only_content_free_event(app_context):
    _write(app_context, "Payment is due in 30 days.")
    added = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="add_comment", quote="30 days", body="Secret comment text",
        author_id="author-brian", author_name="Brian Harris"))
    thread_id = added["comments"][0]["thread_id"]
    deleted = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="delete_comment_thread", thread_id=thread_id, author_name="Brian Harris"))
    assert deleted["comments"] == []
    assert deleted["comment_events"][0]["thread_id"] == thread_id
    assert "Secret comment text" not in str(app_context.vault.read_markdown(PATH)["metadata"])


def test_comment_offsets_anchor_the_second_identical_quote(app_context):
    content = "Thirty days applies first. Thirty days applies second."
    _write(app_context, content)
    quote = "Thirty days"
    second_start = content.rindex(quote)
    review = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="add_comment", quote=quote, body="This is the second occurrence.",
        anchor_start=second_start, anchor_end=second_start + len(quote),
        author_id="author-brian", author_name="Brian Harris"))
    thread = review["comments"][0]
    assert thread["anchor_start"] == second_start
    assert thread["anchor_end"] == second_start + len(quote)


def test_comment_offsets_reject_partial_or_mismatched_ranges(app_context):
    import pytest
    _write(app_context, "Thirty days applies.")
    with pytest.raises(ValueError, match="required together"):
        app_context.document_reviews.apply(PATH, DocumentReviewAction(
            action="add_comment", quote="Thirty days", body="Partial", anchor_start=0,
            author_id="author-brian", author_name="Brian Harris"))
    with pytest.raises(ValueError, match="do not match"):
        app_context.document_reviews.apply(PATH, DocumentReviewAction(
            action="add_comment", quote="Thirty days", body="Mismatch", anchor_start=1, anchor_end=12,
            author_id="author-brian", author_name="Brian Harris"))


def test_only_entry_author_can_edit_or_delete_comment(app_context):
    _write(app_context, "Payment is due in 30 days.")
    added = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="add_comment", quote="30 days", body="Keep this",
        author_id="author-themis", author_name="Themis"))
    thread, entry = added["comments"][0], added["comments"][0]["entries"][0]
    import pytest
    with pytest.raises(ValueError, match="immutable"):
        app_context.document_reviews.apply(PATH, DocumentReviewAction(
            action="edit_comment", thread_id=thread["thread_id"], comment_id=entry["comment_id"],
            body="Changed", author_id="author-brian", author_name="Brian Harris"))


def test_system_and_imported_comment_entries_are_immutable(app_context):
    import pytest
    _write(app_context, "Payment is due in 30 days.", {"record_type": "draft", "review": {
        "version": 2, "tracking": False, "authors": [], "segments": [{"kind": "equal", "text": "Payment is due in 30 days.\n", "change_id": ""}],
        "comments": [{"thread_id": "COM-X", "quote": "30 days", "anchor_start": 18, "anchor_end": 25,
            "resolved": False, "resolved_at": "", "resolved_by": "", "entries": [
                {"comment_id": "MSG-T", "author_id": "author-themis", "author_name": "Themis", "body": "Agent", "created_at": "now"},
                {"comment_id": "MSG-I", "author_id": "author-imported-word", "author_name": "Word User", "body": "Imported", "created_at": "now"}]}],
        "comment_events": []}})
    for comment_id, author_id in (("MSG-T", "author-themis"), ("MSG-I", "author-imported-word")):
        for action in ("edit_comment", "delete_comment_entry"):
            with pytest.raises(ValueError, match="immutable"):
                app_context.document_reviews.apply(PATH, DocumentReviewAction(
                    action=action, thread_id="COM-X", comment_id=comment_id, body="Changed",
                    author_id=author_id, author_name="Claimed identity"))
    resolved = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="resolve_comment", thread_id="COM-X", author_name="Brian Harris"))
    assert resolved["comments"][0]["resolved"] is True


def test_delete_all_resolved_removes_quotes_bodies_and_replies(app_context):
    _write(app_context, "Payment is due in 30 days.")
    added = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="add_comment", quote="30 days", body="First private body", author_id="author-brian", author_name="Brian Harris"))
    thread_id = added["comments"][0]["thread_id"]
    app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="reply_comment", thread_id=thread_id, body="Second private body", author_id="author-brian", author_name="Brian Harris"))
    app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="resolve_comment", thread_id=thread_id, author_name="Brian Harris"))
    deleted = app_context.document_reviews.apply(PATH, DocumentReviewAction(
        action="delete_resolved_comments", author_name="Brian Harris"))
    persisted = app_context.vault.read_markdown(PATH)["metadata"]["review"]
    assert deleted["comments"] == []
    assert persisted["comments"] == []
    for value in ("30 days", "First private body", "Second private body"):
        assert value not in str(deleted["comment_events"])
        assert value not in str(persisted["comment_events"])
    assert set(deleted["comment_events"][0]) == {"event_id", "thread_id", "action", "actor", "created_at"}
