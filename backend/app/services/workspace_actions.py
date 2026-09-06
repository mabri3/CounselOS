"""Focused inquiry commands composed with the existing durable chat runner."""
from __future__ import annotations

import json
import re
from typing import Any, Callable

from app.models.api import ChatRequest
from app.models.workspace import (
    ConversationTarget,
    WorkspaceClaim,
    WorkspaceQuestion,
    TemplateUse,
    UpdateOffer,
    InteractionReceipt,
)
from app.services.dossier import serialized
from app.services.workspace import WorkspaceService, digest
from app.services.workspace_evidence import WorkspaceEvidenceService
from app.services.issue_analysis import IssueAnalysisService, extract_decision_paths
from app.utils.time import iso_now


INQUIRY_INSTRUCTIONS = {
    "explain": "Explain the selected issue or passage. State why the fact matters and give one short example or contrast. Answer directly; no quiz or mandatory research format.",
    "stress_test": "Stress-test the selected view against the available evidence. Name a material objection or assumption and what would change the view. You may find no material objection. Do not invent a counterargument or change a recorded decision.",
    "ask_business": "Draft one editable question for the business about the selected uncertainty. Include a short reason showing how the answer affects this matter. Do not send any message.",
    "explore_question": "Explain why the selected open question matters. Give the likely conditional answer and the short alternative. The question is optional and must not block useful work. Reuse answered questions.",
}


CLAIM_SUPPORT_FENCE = re.compile(
    r"(?ms)^```claim-support[ \t]*\n(?P<payload>.*?)\n```[ \t]*(?:\n|$)"
)


def extract_claim_support(text: str) -> tuple[str, dict[str, Any] | None, list[str]]:
    """Remove one valid optional claim-support block and return its structure.

    A malformed or differently shaped fence stays in the prose. This lets a
    renderer hide only machine metadata that the publisher can safely consume.
    """
    warnings: list[str] = []
    for match in CLAIM_SUPPORT_FENCE.finditer(text):
        try:
            parsed = json.loads(match.group("payload"))
        except (TypeError, ValueError):
            warnings.append("Optional claim-support block is malformed. Useful prose was retained.")
            continue
        if not isinstance(parsed, dict) or not isinstance(parsed.get("claims"), list):
            warnings.append("Optional claim-support block has an invalid shape. Useful prose was retained.")
            continue
        prose = (text[:match.start()] + text[match.end():]).rstrip()
        return prose, parsed, warnings
    return text, None, warnings


class WorkspaceActionsService:
    def __init__(self, vault, matters, workspace=None, *, run_starter: Callable[..., dict[str, Any]] | None = None):
        self.vault, self.matters = vault, matters
        self.workspace = workspace or WorkspaceService(vault, matters)
        self.evidence = WorkspaceEvidenceService(vault, matters, self.workspace)
        self.issue_analysis = IssueAnalysisService(vault, matters, self.workspace)
        self.run_starter = run_starter

    def start(self, matter_id: str, action: str, *, target: ConversationTarget | dict[str, Any],
              source_action_key: str, instruction: str = "", conversation_id: str | None = None) -> dict[str, Any]:
        if action not in INQUIRY_INSTRUCTIONS:
            raise ValueError("Unknown inquiry action.")
        target = ConversationTarget.model_validate(target)
        self.workspace.validate_target(matter_id, target)
        if self.run_starter is None:
            raise RuntimeError("The existing chat run starter is not connected.")
        question = self.workspace.business_question(matter_id)
        target = target.model_copy(update={"business_question_id": target.business_question_id or question["question_id"],
                                           "business_question_revision": target.business_question_revision or question["revision"]})
        request = ChatRequest(message=INQUIRY_INSTRUCTIONS[action] + ("\n\nLawyer's instruction: " + instruction if instruction else ""),
                              matter_id=matter_id, conversation_id=conversation_id, target=target,
                              expected_question_revision=target.business_question_revision, source_action_key=source_action_key)
        # ChatRunService owns IDs, replay keys, provider selection, history, retries,
        # and final output. This service creates no parallel execution pipeline.
        return self.run_starter(matter_id, request)

    @staticmethod
    def freeze_template(registry, template_id: str | None, *, output_type: str,
                        overrides: dict[str, str] | None = None) -> dict[str, Any]:
        use = registry.resolve_template_use(template_id, output_type=output_type, overrides=overrides)
        return TemplateUse.model_validate(use).model_dump(mode="json")

    @serialized
    def save_preferences(self, matter_id: str, values: dict[str, str], *, expected_revision: str) -> dict[str, Any]:
        allowed = {"audience", "purpose", "tone", "length", "exclusions", "source_presentation", "business_constraint"}
        if set(values) - allowed:
            raise ValueError("Unknown matter output preference.")
        doc = self.workspace._document(matter_id, "workspace.md")
        current = doc["metadata"].get("output_preferences", {})
        self.workspace._check(expected_revision, digest(current))
        saved = {**current, **values}
        doc["metadata"]["output_preferences"] = saved
        self.vault.write_markdown(doc["path"], doc["content"], doc["metadata"])
        return {"preferences": saved, "revision": digest(saved)}

    @serialized
    def save_contribution(self, matter_id: str, *, text: str, source_message_id: str, source_action_key: str,
                          kind: str, expected_revision: str, source_ids: list[str] | None = None,
                          supersedes: str | None = None) -> dict[str, Any]:
        """Save only explicit lawyer context. Facts use MatterRecordService instead."""
        if kind not in {"audience", "business_constraint", "accepted_analysis", "instruction"}:
            raise ValueError("Facts, proposals, and scenarios use their own record commands.")
        doc = self.workspace._document(matter_id, "workspace.md")
        contributions = list(doc["metadata"].get("lawyer_contributions", []))
        payload = {"text": text, "source_message_id": source_message_id, "kind": kind,
                   "source_ids": source_ids or [], "supersedes": supersedes}
        prior = next((c for c in contributions if c["source_action_key"] == source_action_key), None)
        if prior:
            if prior["payload_hash"] != digest(payload):
                from app.services.workspace import WorkspaceConflict
                raise WorkspaceConflict("Action key already used for another contribution.", digest(contributions), code="action_key_conflict")
            return prior
        self.workspace._check(expected_revision, digest(contributions))
        if supersedes and not any(c["contribution_id"] == supersedes for c in contributions):
            raise KeyError("Prior contribution not found.")
        for item in contributions:
            if item["contribution_id"] == supersedes or (kind in {"audience", "business_constraint"} and item["kind"] == kind):
                item["state"] = "superseded"
        record = {**payload, "contribution_id": "LC-" + digest(source_action_key)[:20],
                  "source_action_key": source_action_key, "payload_hash": digest(payload), "state": "accepted", "created_at": iso_now()}
        contributions.append(record)
        doc["metadata"]["lawyer_contributions"] = contributions
        self.vault.write_markdown(doc["path"], doc["content"], doc["metadata"])
        return record

    @serialized
    def publish_result(self, matter_id: str, *, run_id: str, text: str, source_revisions: dict[str, str],
                       expected_question_revision: str, structure: Any = None,
                       sources: list[dict[str, Any]] | None = None, source_action_key: str | None = None,
                       target: ConversationTarget | dict[str, Any] | None = None,
                       frozen_context: dict[str, Any] | None = None,
                       update_current_snapshot: bool = True) -> dict[str, Any]:
        """Persist useful prose before touching optional model structure.

        Call after existing chat has its final prose. A stale result remains a
        historical inquiry and never replaces the current snapshot.
        """
        prose, transported_paths, path_warnings = extract_decision_paths(text)
        prose, transported_claims, transport_warnings = extract_claim_support(prose)
        transport_warnings = [*path_warnings, *transport_warnings]
        if prose.strip() in {
            "",
            "The available actions are complete; use the trace and updated matter state as the working result.",
        }:
            return {"state": "not_saved", "failure_detail": "No useful inquiry output was supplied."}
        path = self.evidence._manifest_path(matter_id, run_id).replace("/context/", "/inquiries/")
        existing_output: dict[str, Any] | None = None
        if self.vault.exists(path):
            existing_output = self.vault.read_markdown(path)
            if existing_output["content"].strip() != prose.strip():
                from app.services.workspace import WorkspaceConflict
                raise WorkspaceConflict("This run already has different saved output.", digest(existing_output["content"]))
        receipt = InteractionReceipt(receipt_id="RCP-" + digest(run_id)[:20], source_action_key=source_action_key or f"inquiry:{run_id}",
            operation="save_inquiry_result", target=ConversationTarget.model_validate(target or {"matter_id": matter_id,
                "business_question_revision": expected_question_revision}), state="applied", run_id=run_id,
            before_revision=expected_question_revision, after_revision=digest(prose), changed_links=[path],
            completed_parts=["inquiry_output"], created_at=iso_now()).model_dump(mode="json")
        warnings: list[str] = list(transport_warnings)
        normalized_sources: list[dict[str, Any]] = []
        for index, raw_source in enumerate(sources or []):
            try:
                if not isinstance(raw_source, dict):
                    raise TypeError("source is not an object")
                normalized_sources.append(self.evidence.source_record(raw_source))
            except (TypeError, ValueError, KeyError):
                warnings.append(f"Optional source {index + 1} unavailable. Useful prose saved.")
        if sources is None and existing_output is not None:
            prior_sources = existing_output["metadata"].get("sources", [])
            if isinstance(prior_sources, list):
                normalized_sources = [
                    item for item in prior_sources if isinstance(item, dict)
                ]
        output_revision = digest(prose)
        meta = {"record_type": "workspace_inquiry", "matter_id": matter_id, "run_id": run_id,
                "question_revision": expected_question_revision, "source_revisions": source_revisions,
                "output_revision": output_revision, "created_at": iso_now(),
                "sources": normalized_sources, "receipt": receipt}
        if self.vault.exists(path):
            prior_meta = self.vault.read_markdown(path)["metadata"]
            if prior_meta.get("run_id") not in {None, run_id}:
                from app.services.workspace import WorkspaceConflict
                raise WorkspaceConflict("This output path belongs to another run.", str(prior_meta.get("output_revision") or ""))
            meta = {**prior_meta, **meta}
        try:
            self.vault.write_markdown(path, prose, meta)
        except OSError:
            receipt.update(state="not_saved", changed_links=[], completed_parts=[], failure_detail="Inquiry output could not be saved.")
            return {"state": "not_saved", "text": prose, "run_id": run_id, "receipt": receipt,
                    "failure_detail": "Useful answer retained in the response; inquiry output could not be saved."}
        result = {"state": "saved", "path": path, "run_id": run_id,
                  "output_revision": output_revision, "warnings": warnings,
                  "claims": [], "receipt": receipt}
        try:
            inline_claims = self._inline_claims(prose)
            claim_structure = (
                structure if isinstance(structure, dict) and "claims" in structure
                else structure if structure is not None and not isinstance(structure, dict)
                else transported_claims
            )
            if claim_structure is None and existing_output is not None:
                prior_claims = existing_output["metadata"].get("claims", [])
                if isinstance(prior_claims, list):
                    result["claims"] = prior_claims
                    claim_structure = {"claims": []}
            if claim_structure is None:
                claim_structure = {"claims": inline_claims}
            if not isinstance(claim_structure, dict):
                raise ValueError("Optional inquiry structure is not an object.")
            raw_claims = claim_structure.get("claims", [])
            if not isinstance(raw_claims, list):
                raise ValueError("Optional claims are not a list.")
            for index, raw in enumerate(raw_claims):
                try:
                    claim, claim_warnings = self._parse_claim(
                        raw,
                        text=prose,
                        sources=normalized_sources,
                        output_revision=output_revision,
                    )
                except (ValueError, TypeError, KeyError) as exc:
                    result["warnings"].append(
                        f"Optional claim {index + 1} unavailable: {type(exc).__name__}. Other claims and useful prose were retained."
                    )
                    continue
                result["warnings"].extend(
                    f"Optional claim {index + 1}: {warning}" for warning in claim_warnings
                )
                result["claims"].append(claim)
            for raw in inline_claims:
                paragraph = raw["text"]
                if any(claim["text"] in paragraph for claim in result["claims"]):
                    continue
                try:
                    claim, claim_warnings = self._parse_claim(
                        raw, text=prose, sources=normalized_sources,
                        output_revision=output_revision,
                    )
                except (ValueError, TypeError, KeyError):
                    continue
                result["warnings"].extend(
                    f"Inline claim fallback: {warning}" for warning in claim_warnings
                )
                result["claims"].append(claim)
            meta["claims"] = result["claims"]
            self.vault.update_markdown(path, metadata_updates=meta)
        except (ValueError, TypeError, KeyError, OSError) as exc:
            result["warnings"].append(f"Optional structure unavailable: {type(exc).__name__}. Useful prose saved.")
        analysis_structure = (
            structure if isinstance(structure, dict) and (
                isinstance(structure.get("issue_analysis"), dict)
                or isinstance(structure.get("issue_analyses"), list)
            ) else transported_paths
        )
        if analysis_structure is not None:
            captured = (frozen_context or {}).get("issue_analysis_capture")
            try:
                published = self.issue_analysis.publish(
                    matter_id, path=path, run_id=run_id,
                    output_revision=output_revision, structure=analysis_structure,
                    capture=captured, claims=result["claims"],
                )
                result["warnings"].extend(published["warnings"])
                result["issue_analyses"] = published["issue_analyses"]
                if published.get("historical"):
                    result["historical_analysis"] = True
            except (OSError, ValueError, KeyError, TypeError) as exc:
                result["warnings"].append(
                    f"Optional decision paths unavailable: {type(exc).__name__}. Useful prose and prior analysis were retained."
                )
        if not update_current_snapshot:
            result["current_snapshot_updated"] = False
            return result
        try:
            doc = self.workspace._document(matter_id, "workspace.md")
            current_question = self.workspace.business_question(matter_id)
            current_sources = self.workspace.source_revisions(matter_id)
        except (OSError, ValueError, KeyError, TypeError):
            result.update(state="partial", historical=True, failure_detail="Answer saved; current workspace context could not be read.")
            return result
        stale = not source_revisions or current_question["revision"] != expected_question_revision or current_sources != source_revisions
        if stale:
            result["historical"] = True
            return result
        target_data = receipt.get("target") or {}
        issue_id = target_data.get("issue_id")
        if issue_id:
            try:
                self._replace_target_issue_claims(
                    matter_id,
                    issue_id=issue_id,
                    claims=result["claims"],
                    prior_inquiry_paths=(doc["metadata"].get("snapshot") or {}).get("answer_links", []),
                )
                current_sources = self.workspace.source_revisions(matter_id)
            except (OSError, ValueError, KeyError, TypeError) as exc:
                result["warnings"].append(
                    f"Issue claim links unavailable: {type(exc).__name__}. The answer and claim evidence were retained."
                )
        saved = dict(doc["metadata"].get("snapshot") or {})
        saved.update(short_answer=prose, answer_links=list(dict.fromkeys([*saved.get("answer_links", []), path])),
                     run_id=run_id, generated_at=meta["created_at"], source_revisions=dict(current_sources), claims=result["claims"])
        doc["metadata"]["snapshot"] = saved
        receipts = list(doc["metadata"].get("interaction_receipts", []))
        if not any(r.get("receipt_id") == receipt["receipt_id"] for r in receipts):
            receipts.append(receipt)
        doc["metadata"]["interaction_receipts"] = receipts
        try:
            self.vault.write_markdown(doc["path"], doc["content"], doc["metadata"])
        except OSError:
            result.update(state="partial", failure_detail="Answer saved; current workspace snapshot could not be saved.")
        return result

    def _replace_target_issue_claims(
        self,
        matter_id: str,
        *,
        issue_id: str,
        claims: list[dict[str, Any]],
        prior_inquiry_paths: Any,
    ) -> None:
        """Project the current targeted output without rewriting inquiry history."""
        nodes = self.workspace.issues(matter_id)
        target_issue = next((node for node in nodes if node["issue_id"] == issue_id), None)
        if target_issue is None:
            raise ValueError("Target issue not found in this matter.")
        superseded: set[str] = set()
        for inquiry_path in prior_inquiry_paths if isinstance(prior_inquiry_paths, list) else []:
            try:
                inquiry = self.vault.read_markdown(str(inquiry_path))
                metadata = inquiry["metadata"]
                prior_target = (metadata.get("receipt") or {}).get("target") or {}
                if prior_target.get("issue_id") != issue_id:
                    continue
                superseded.update(
                    str(claim.get("claim_id"))
                    for claim in metadata.get("claims", [])
                    if isinstance(claim, dict) and claim.get("claim_id")
                )
            except (OSError, ValueError, KeyError, TypeError):
                continue
        current_ids = [claim["claim_id"] for claim in claims]
        next_ids = list(dict.fromkeys([
            *(claim_id for claim_id in target_issue.get("claim_ids", []) if claim_id not in superseded),
            *current_ids,
        ]))
        current_revisions = target_issue.get("claim_output_revisions", {})
        if not isinstance(current_revisions, dict):
            current_revisions = {}
        next_revisions = {
            str(claim_id): str(revision)
            for claim_id, revision in current_revisions.items()
            if str(claim_id) not in superseded
        }
        next_revisions.update({
            claim["claim_id"]: claim["output_revision"] for claim in claims
        })
        if (
            next_ids == target_issue.get("claim_ids", [])
            and next_revisions == current_revisions
        ):
            return
        target_issue["claim_ids"] = next_ids
        target_issue["claim_output_revisions"] = next_revisions
        self.workspace.save_issues(
            matter_id, nodes, expected_revision=self.workspace.issues_revision(matter_id)
        )

    def _parse_claim(
        self,
        raw: Any,
        *,
        text: str,
        sources: list[dict[str, Any]],
        output_revision: str,
    ) -> tuple[dict[str, Any], list[str]]:
        if not isinstance(raw, dict):
            raise TypeError("claim is not an object")
        claim_warnings: list[str] = []
        statement = raw.get("text")
        if not isinstance(statement, str) or not statement.strip() or statement not in text:
            raise ValueError("claim text is absent from the saved answer")
        statement = statement.strip()
        claim_id = str(raw.get("claim_id") or "CLM-" + digest(" ".join(statement.casefold().split()))[:20])

        raw_applicability = raw.get("applicability") or {}
        if not isinstance(raw_applicability, dict):
            claim_warnings.append("malformed applicability was omitted; the claim was retained.")
            raw_applicability = {}
        applicability = {
            "regulated_actor": str(raw_applicability.get("regulated_actor") or ""),
            "jurisdiction": str(raw_applicability.get("jurisdiction") or ""),
            "fact_ids": self._string_list(raw_applicability.get("fact_ids", [])),
            "assumption_ids": self._string_list(raw_applicability.get("assumption_ids", [])),
            "explanation": str(raw_applicability.get("explanation") or ""),
        }

        raw_evidence = raw.get("evidence")
        if raw_evidence is None:
            source_ids = self._string_list(raw.get("source_ids", []))
            evidence_specs: list[Any] = [{"source_id": source_id} for source_id in source_ids]
        elif isinstance(raw_evidence, list):
            evidence_specs = raw_evidence
        else:
            claim_warnings.append("malformed evidence was omitted; the claim was retained.")
            evidence_specs = []

        selectors: list[dict[str, str]] = []
        for evidence_index, item in enumerate(evidence_specs):
            if isinstance(item, str):
                item = {"source_id": item}
            if not isinstance(item, dict) or not str(item.get("source_id") or "").strip():
                continue
            selectors.append({
                "source_id": str(item["source_id"]).strip(),
                "locator": str(item.get("locator") or "").strip(),
                "explanation": str(item.get("explanation") or raw.get("explanation") or ""),
            })

        support_gap_parts = [str(raw.get("support_gap") or "").strip()]
        missing_applicability = [
            label
            for label, value in (
                ("regulated actor", applicability["regulated_actor"]),
                ("jurisdiction", applicability["jurisdiction"]),
            )
            if not value
        ]
        if missing_applicability:
            support_gap_parts.append("Applicability is incomplete: missing " + " and ".join(missing_applicability) + ".")
        if not selectors:
            support_gap_parts.append("No claim-specific source support was saved.")

        claim_revision = digest({
            "claim_id": claim_id,
            "text": statement,
            "applicability": applicability,
            "evidence": [{"source_id": item["source_id"], "locator": item["locator"]} for item in selectors],
            "support_gap": [part for part in support_gap_parts if part],
        })
        evidence = [
            self.evidence.claim_evidence(
                claim_id,
                item["source_id"],
                sources,
                locator=item["locator"],
                explanation=item["explanation"],
                claim_revision=claim_revision,
                output_revision=output_revision,
            )
            for item in selectors
        ]
        if any(item["support_state"] == "unknown" for item in evidence):
            support_gap_parts.append("One or more claim-specific source passages are unavailable.")
        support_gap = " ".join(dict.fromkeys(part for part in support_gap_parts if part))
        claim = WorkspaceClaim(
            claim_id=claim_id,
            text=statement,
            claim_revision=claim_revision,
            output_revision=output_revision,
            applicability=applicability,
            evidence=evidence,
            support_gap=support_gap,
        ).model_dump(mode="json")
        return claim, claim_warnings

    @staticmethod
    def _inline_claims(text: str) -> list[dict[str, Any]]:
        pattern = re.compile(r"\[source:([^\]|;\s]+)(?:\|([^\]]+))?\]")
        claims: list[dict[str, Any]] = []
        for paragraph in text.split("\n\n"):
            evidence = [
                {"source_id": match.group(1), "locator": (match.group(2) or "").strip()}
                for match in pattern.finditer(paragraph)
            ]
            if evidence:
                claims.append({"text": paragraph, "evidence": evidence})
        return claims

    @staticmethod
    def _string_list(value: Any) -> list[str]:
        if not isinstance(value, list):
            return []
        return list(dict.fromkeys(str(item).strip() for item in value if str(item).strip()))

    @serialized
    def save_useful_question(self, matter_id: str, *, text: str, consequence: str,
                             expected_question_revision: str, issue_id: str | None = None) -> dict[str, Any] | None:
        question = self.workspace.business_question(matter_id)
        if question["revision"] != expected_question_revision:
            return None
        # Stable scope + issue + normalized question gives repeat-safe identity.
        identity = "WQ-" + digest([matter_id, expected_question_revision, issue_id, " ".join(text.casefold().split())])[:20]
        prior = next((q for q in self.workspace.questions(matter_id) if q["question_id"] == identity), None)
        if prior:
            return prior
        if not text.strip() or not consequence.strip():
            return None
        return self.workspace.save_question(matter_id, WorkspaceQuestion(question_id=identity,
            business_question_id=question["question_id"], business_question_revision=question["revision"],
            text=text, consequence=consequence, issue_id=issue_id))

    @serialized
    def offer_update(self, matter_id: str, offer: dict[str, Any]) -> dict[str, Any]:
        parsed = UpdateOffer.model_validate(offer).model_dump(mode="json")
        if parsed["state"] != "offered":
            raise ValueError("New draft updates must begin as offers.")
        self.workspace.validate_target(matter_id, ConversationTarget(matter_id=matter_id,
            artifact_path=parsed["artifact_path"], artifact_revision=parsed["base_revision"]), mutation=True)
        doc = self.workspace._document(matter_id, "workspace.md")
        offers = list(doc["metadata"].get("update_offers", []))
        prior = next((o for o in offers if o["offer_id"] == parsed["offer_id"]), None)
        if prior:
            return prior
        offers.append(parsed)
        doc["metadata"]["update_offers"] = offers
        self.vault.write_markdown(doc["path"], doc["content"], doc["metadata"])
        return parsed

    def reassess_changed_facts(self, matter_id: str, *, fact_ids: list[str], target: ConversationTarget | dict[str, Any],
                               source_action_key: str, conversation_id: str | None = None) -> dict[str, Any]:
        """Use actual recorded corrections for a focused analysis, never revise a draft."""
        import json
        target = ConversationTarget.model_validate(target)
        self.workspace.validate_target(matter_id, target)
        facts = self.workspace.records.get(matter_id)["facts"]
        changes = []
        for fact_id in fact_ids:
            current = next((f for f in facts if f["fact_id"] == fact_id and f.get("status") == "active"), None)
            if current is None:
                raise KeyError(f"Current fact not found: {fact_id}")
            prior = next((f for f in facts if f["fact_id"] == current.get("supersedes")), None)
            changes.append({"before": prior, "after": current})
        if not changes:
            raise ValueError("Select at least one actual changed fact.")
        if self.run_starter is None:
            raise RuntimeError("The existing chat run starter is not connected.")
        question = self.workspace.business_question(matter_id)
        message = ("Reassess the analysis using these actual reported fact changes. Explain the earlier and current paths, "
                   "which fact changes the reasoning, and why. If the conclusion stays the same, explain why; do not invent a reversal. "
                   "Give a supported conditional answer. Offer Update the draft only when an artifact is affected. "
                   "Do not create any document revision or work product proposal in this run. These are analysis updates only.\n\n"
                   + json.dumps(changes, ensure_ascii=False))
        return self.run_starter(matter_id, ChatRequest(message=message, matter_id=matter_id,
            target=target, expected_question_revision=question["revision"], source_action_key=source_action_key,
            conversation_id=conversation_id))

    @serialized
    def decline_offer(self, matter_id: str, offer_id: str, *, base_revision: str) -> dict[str, Any]:
        doc = self.workspace._document(matter_id, "workspace.md")
        offers = list(doc["metadata"].get("update_offers", []))
        offer = next((o for o in offers if o["offer_id"] == offer_id), None)
        if offer is None:
            raise KeyError("Draft update offer not found.")
        self.workspace._check(base_revision, offer["base_revision"])
        if offer["state"] not in {"offered", "declined"}:
            raise ValueError("This offer is no longer available to decline.")
        offer["state"] = "declined"
        doc["metadata"]["update_offers"] = offers
        self.vault.write_markdown(doc["path"], doc["content"], doc["metadata"])
        return offer
