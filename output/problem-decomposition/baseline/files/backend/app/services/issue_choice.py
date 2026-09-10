"""One explicit lawyer action composes existing decision, work and issue records.

The event holds the frozen request so interrupted saves can resume without
duplicating work or replacing a later lawyer action.
"""
from app.models.api import DecisionCreate, WorkItemCreate
from app.models.workspace import IssueDispositionCommand
from app.services.decisions import DecisionService
from app.services.dossier import serialized
from app.services.workspace import WorkspaceConflict, digest
from app.utils.time import iso_now


class IssueChoiceService:
    def __init__(self, review):
        self.review = review
        self.vault, self.matters, self.workspace = review.vault, review.matters, review.workspace
        self.decisions = DecisionService(self.vault, self.matters.index, self.matters)

    @serialized
    def record(self, matter_id, issue_id, command, *, actor):
        data = IssueDispositionCommand.model_validate(command).model_dump(mode="json")
        actor_id, actor_name = self.review._actor(actor)
        if not actor_id or not actor_name:
            raise ValueError("A trusted local lawyer identity is required.")
        key = "choice:" + digest([matter_id, issue_id, data["source_action_key"]])[:32]
        path = f"{self.matters.matter_path(matter_id)}/events/{key.replace(':', '-')}.md"
        fingerprint = digest([issue_id, data, actor_id])
        prior = self.vault.read_markdown(path)["metadata"] if self.vault.exists(path) else None
        if prior and prior["fingerprint"] != fingerprint:
            raise WorkspaceConflict("This retry belongs to a different choice or lawyer.", "", code="action_key_conflict")
        if prior and prior.get("result"):
            return prior["result"]
        issue = next((item for item in self.workspace.issues(matter_id) if item["issue_id"] == issue_id), None)
        if not issue:
            raise KeyError("Issue not found in this matter.")
        applied = any(item.get("source_action_key") == key + ":position" for item in issue.get("disposition_history", []))
        if not applied and self.workspace.issues_revision(matter_id) != data["expected_revision"]:
            raise WorkspaceConflict("The issue changed. Reload before recording this choice.", self.workspace.issues_revision(matter_id))
        work = self.review.work_items(matter_id)
        decisions = self.review.decisions(matter_id)
        if set(data["linked_work_item_ids"]) - {item["work_item_id"] for item in work}:
            raise ValueError("Follow-up work must belong to this matter.")
        if set(data["linked_decision_ids"]) - {item["decision_id"] for item in decisions}:
            raise ValueError("Decisions must belong to this matter.")
        if data["revises_decision_id"] and data["revises_decision_id"] not in issue.get("linked_decision_ids", []):
            raise ValueError("The earlier decision must be linked to this issue.")
        if not data["reason"].strip() or any(not item["title"].strip() for item in data["follow_up"]):
            raise ValueError("A reason and non-empty follow-up titles are required.")
        leaving_open = data["disposition"] == "unresolved"
        if not leaving_open and not data["chosen_path"].strip():
            raise ValueError("State the path you are recording.")
        if data["map_basis"] and data["map_basis"]["issue_id"] != issue_id:
            raise ValueError("The selected path belongs to a different issue.")
        request = DecisionCreate(
            matter_id=matter_id, title=data["chosen_path"] or issue["title"],
            chosen_path=data["chosen_path"], rationale=data["reason"], decision_maker=actor_name,
            conditions=data["conditions"], map_basis=data["map_basis"],
            linked_paths=[self.workspace._path(matter_id, "issues.md")], source_action_key=key + ":decision",
        )
        if not prior and not leaving_open:
            basis = self.decisions._canonical_map_basis(request)
            self.decisions._validate_current_map_basis(request, basis)
        journal = prior or {"matter_id": matter_id, "event_type": "issue_choice", "issue_id": issue_id,
                            "fingerprint": fingerprint, "request": data, "actor_id": actor_id,
                            "actor_name": actor_name, "created_at": iso_now(), "state": "recording"}
        if not prior:
            self.vault.write_markdown(path, "# Record choice and follow-up\n", journal)
        decision_ids = list(data["linked_decision_ids"])
        if not leaving_open:
            decision = self.decisions.record(request, revises_decision_id=data["revises_decision_id"])
            # Persist issue ownership even for a custom path with no analysis basis.
            self.vault.update_markdown(decision["path"], metadata_updates={"issue_id": issue_id})
            decision_ids = list(dict.fromkeys([*decision_ids, decision["decision_id"]]))
        work_ids = list(data["linked_work_item_ids"])
        if not leaving_open and data["map_basis"]:
            canonical = self.vault.read_markdown(decision["path"])["metadata"].get("map_basis") or {}
            work_ids.extend((canonical.get("canonical_option") or {}).get("work_item_ids", []))
        for index, item in enumerate(data["follow_up"]):
            saved = self.matters.create_work_item(WorkItemCreate(
                matter_id=matter_id, issue_id=issue_id, title=item["title"].strip(),
                owner=item["owner"].strip(), due_at=item["due_at"], required=item["required"],
                item_type="business_follow_up", description=f"Follow-up for recorded choice: {data['chosen_path']}",
                source_action_key=f"{key}:work:{index}",
            ))
            work_ids.append(saved["work_item_id"])
            if not leaving_open:
                self.vault.update_markdown(saved["path"], metadata_updates={
                    "decision_id": decision["decision_id"],
                    "choice_option_revision": (data["map_basis"] or {}).get("selected_option_revision"),
                })
        if data["disposition"] == "mitigation_in_progress":
            existing_review = next((item for item in work if item.get("choice_review_for") == issue_id
                                    and item.get("status") not in {"done", "closed"}), None)
            if not existing_review:
                existing_review = self.matters.create_work_item(WorkItemCreate(
                    matter_id=matter_id, issue_id=issue_id, title=f"Review follow-up and conclude: {issue['title']}",
                    description="Review the completed work and record the issue conclusion.",
                    owner=actor_name, required=True, item_type="counsel_review", priority="low",
                    source_action_key=key + ":review",
                ))
                self.vault.update_markdown(existing_review["path"], metadata_updates={"choice_review_for": issue_id})
            work_ids.append(existing_review["work_item_id"])
        # Retain existing work. A changed choice never silently cancels it.
        work_ids = list(dict.fromkeys([*issue.get("linked_work_item_ids", []), *work_ids]))
        position = IssueDispositionCommand(
            disposition=data["disposition"], reason=data["reason"],
            expected_revision=data["expected_revision"], source_action_key=key + ":position",
            linked_work_item_ids=work_ids, linked_decision_ids=decision_ids,
        )
        result = self.review.record_disposition(matter_id, issue_id, position, actor=actor)
        if data["disposition"] in {"resolved", "risk_accepted", "not_applicable"}:
            for item in self.review.work_items(matter_id):
                if item.get("choice_review_for") == issue_id and item.get("status") not in {"done", "closed"}:
                    self.matters.complete_work_item(matter_id, item["work_item_id"], actor=actor_name)
        journal.update(state="applied", result=result)
        self.vault.write_markdown(path, "# Choice and follow-up recorded\n", journal)
        self.matters.index.rebuild()
        return result
