#!/usr/bin/env python3
"""One-use Step 13 configured-model exercise.

The prepare phase makes only local fixture records. The run phase records the
attempt before the first configured-model call and refuses every later rerun.
"""
from __future__ import annotations

import argparse
import asyncio
from datetime import datetime, timezone
import json
from pathlib import Path
import shutil
import sys
import time
from typing import Any


REPO = Path(__file__).resolve().parents[2]
BACKEND = REPO / "backend"
sys.path.insert(0, str(BACKEND))

from app.config import Settings  # noqa: E402
from app.models.api import ChatRequest, MatterCreate  # noqa: E402
from app.services.settings import SettingsService  # noqa: E402
from app.services.vault import VaultService  # noqa: E402
from app.services.workspace import digest  # noqa: E402


OUT = REPO / "output/dossier-research-first"
VAULT_PATH = OUT / "live-quality-vault"
ATTEMPT_PATH = OUT / "live-quality-attempt.json"
RESULT_PATH = OUT / "live-quality-result.json"
FIXTURE_ID = "dossier-live-quality-20260912-01"
MATTER_ACTION = "step13:live-quality:matter:20260912-01"
PREP_ACTION = "step13:live-quality:prepare:20260912-01"
START_ACTION = "step13:live-quality:start:20260912-01"
PREP_RUN_ID = "DORPREP-STEP13-20260912-01"
SELECTED_MAIN = {
    "provider": "opencode_go",
    "model": "deepseek-v4.1-flash",
    "reasoning_effort": "max",
}
SELECTED_COLLECTOR = {
    "provider": "opencode_go",
    "model": "deepseek-v4.1-flash",
    "reasoning_effort": "default",
}
PUBLIC_QUERY = (
    "United States federal and California primary sources for consumer "
    "subscription cancellation, privacy notice and service-provider contract requirements"
)
ISSUES = [
    (
        "Subscription enrollment and cancellation",
        "Confirm affirmative consent, renewal disclosure, cancellation, and any material exception before launch.",
        "legal",
    ),
    (
        "Consumer privacy notice and vendor controls",
        "Confirm notice at collection and limits for a service provider handling account data.",
        "legal",
    ),
    (
        "Vendor termination, export, and continuity",
        "Apply the synthetic vendor contract's access-loss and export conditions to launch continuity.",
        "legal",
    ),
    (
        "Accessibility readiness",
        "Keep the product accessibility review visible while legal research proceeds.",
        "other_workstream",
    ),
    (
        "Brand and trademark clearance",
        "Keep brand clearance visible while legal research proceeds.",
        "other_workstream",
    ),
]


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def write_json(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    temporary.replace(path)


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def synthetic_settings() -> Settings:
    base = Settings()
    return base.model_copy(
        update={
            "vault_path": str(VAULT_PATH),
            "scheduler_enabled": False,
            "llm_provider": SELECTED_MAIN["provider"],
            "llm_model": SELECTED_MAIN["model"],
            "llm_reasoning_effort": SELECTED_MAIN["reasoning_effort"],
        }
    )


def prepare_fixture() -> None:
    if ATTEMPT_PATH.exists() or RESULT_PATH.exists() or VAULT_PATH.exists():
        raise SystemExit("Refusing to replace an existing Step 13 attempt or fixture.")
    shutil.copytree(BACKEND / "tests/fixtures/vault", VAULT_PATH)
    vault = VaultService(VAULT_PATH)
    vault.write_bytes(
        ".dossier-live-quality-fixture.json",
        (json.dumps({"fixture_id": FIXTURE_ID, "vault": str(VAULT_PATH.resolve())}, indent=2) + "\n").encode(),
    )
    SettingsService(vault).write(
        {
            "agents.provider": SELECTED_MAIN["provider"],
            "agents.reasoning_model": SELECTED_MAIN["model"],
            "agents.reasoning_effort": SELECTED_MAIN["reasoning_effort"],
            "research.primary_external_provider": "firecrawl",
            "research.fallback_external_provider": "polaris",
            "research.model_fallback_provider": SELECTED_COLLECTOR["provider"],
            "research.model_fallback_model": SELECTED_COLLECTOR["model"],
            "research.collection_reasoning_effort": SELECTED_COLLECTOR["reasoning_effort"],
            "research.collection_enabled": True,
        }
    )

    from app.runtime import AppContext

    app = AppContext(synthetic_settings(), recover_interrupted=False)
    matter = app.matters.create(
        MatterCreate(
            title="Northstar Subscription Launch — Synthetic Quality Check",
            request_text=(
                "Synthetic request only. Can Northstar launch a monthly subscription on November 2, 2026? "
                "Research the three legal issues and state launch conditions. Keep accessibility and brand "
                "clearance visible. No real customer, employee, or transaction data is included."
            ),
            description="One bounded research-first dossier quality check on fictional facts.",
            matter_type="product_launch",
            product_area="Synthetic subscription service",
            business_team="Synthetic Product",
            requester="Synthetic requester",
            legal_owner="Synthetic product lawyer",
            business_owner="Synthetic product owner",
            priority="high",
            target_date="2026-11-02",
            jurisdiction_scope=["United States", "California"],
            source_action_key=MATTER_ACTION,
        )
    )
    matter_id = matter["matter_id"]
    root = app.matters.matter_path(matter_id)

    launch_path = f"{root}/documents/synthetic-product-brief.md"
    vendor_path = f"{root}/documents/synthetic-vendor-contract.md"
    launch_text = """# Synthetic product brief

This is fictional test material. It contains no private person or transaction data.

Product reports that Northstar plans a public launch event on November 2, 2026. The product offers a monthly subscription that renews until cancelled. Product wants one online cancellation path. The launch covers United States users, including California.

The administration date for this fixture record is September 12, 2026. That administration date is not the launch event date and is not a legal deadline.

Accessibility readiness and brand clearance remain open workstreams outside the three legal research issues.
"""
    vendor_text = """# SYNTHETIC vendor contract — not law

This fictional contract exists only for the Step 13 quality test. It is not a real agreement and is not public law.

## 1. Service

Fictional vendor Kestrel Access hosts the subscription identity and account console.

## 2. Data use

Kestrel may process account data only to provide the contracted service and must follow Northstar's written instructions.

## 3. Product dependency

Northstar uses the Kestrel console to retrieve account status and cancellation audit records.

## 4. Ordinary support

Kestrel provides routine exports while the agreement is active.

## 5. Termination

Console access ends immediately when the agreement terminates. A complete export is available only if Kestrel receives Northstar's written export request before termination.

## 6. Limited exception

If termination results only from Kestrel's uncured material breach, and Northstar has paid all undisputed invoices, Kestrel will keep a read-only export portal available for ten calendar days after termination. No other termination receives that post-termination access.
"""
    app.vault.write_markdown(
        launch_path,
        launch_text,
        {
            "matter_id": matter_id,
            "record_type": "source",
            "source_label": "Synthetic product brief",
            "source_class": "synthetic_supplied_material",
            "source_revision": digest(launch_text),
            "administered_at": "2026-09-12",
        },
    )
    app.vault.write_markdown(
        vendor_path,
        vendor_text,
        {
            "matter_id": matter_id,
            "record_type": "source",
            "source_label": "SYNTHETIC vendor contract — not law",
            "source_class": "synthetic_supplied_contract",
            "source_revision": digest(vendor_text),
            "synthetic": True,
        },
    )
    issue_text = "# Issues\n\n" + "\n".join(
        f"{position}. {title}: {detail}" for position, (title, detail, _kind) in enumerate(ISSUES, 1)
    )
    app.vault.write_markdown(
        f"{root}/issues.md",
        issue_text,
        {"matter_id": matter_id, "record_type": "issues"},
    )
    app.dossiers.propose_update(
        matter_id,
        "# Northstar synthetic dossier\n\n## Decision question\n\nCan the synthetic launch proceed on November 2, 2026, and on what conditions?\n",
        expected_hash=None,
        generated=True,
    )
    source_action = app.matter_records.apply_update(
        matter_id,
        sources=[
            {"kind": "file", "label": "Synthetic product brief", "path": launch_path, "version": digest(launch_text)},
            {"kind": "file", "label": "SYNTHETIC vendor contract — not law", "path": vendor_path, "version": digest(vendor_text)},
        ],
        summary="Record synthetic quality-check sources",
        actor="Synthetic fixture",
        source_action_key="step13:live-quality:sources:20260912-01",
    )
    source_ids = source_action["created"]["sources"]
    app.matter_records.apply_update(
        matter_id,
        facts=[
            {"text": "Product reports a planned public launch event on November 2, 2026.", "source_ids": [source_ids[0]]},
            {"text": "The fixture record was administered on September 12, 2026; this is not the launch event date or a legal deadline.", "source_ids": [source_ids[0]]},
            {"text": "Product reports that the monthly subscription renews until cancelled and should have an online cancellation path.", "source_ids": [source_ids[0]]},
            {"text": "The synthetic vendor contract makes console access end at termination and generally requires a written export request before termination.", "source_ids": [source_ids[1]]},
        ],
        assumptions=[
            {
                "text": "Inferred assumption: the planned California subscription flow is offered to at least one person covered by applicable California consumer rules.",
                "reason": "The product brief gives geography and a consumer subscription model but not legal classification for each user.",
            }
        ],
        summary="Record synthetic reported facts and one explicit inferred assumption",
        actor="Synthetic fixture",
        source_action_key="step13:live-quality:facts:20260912-01",
    )
    app.matters.append_event(
        matter_id,
        "planned_launch",
        {
            "title": "Synthetic public launch event",
            "event_date": "2026-11-02",
            "administration_date": "2026-09-12",
            "source_path": launch_path,
            "note": "The event date is supported by the synthetic product brief; the administration date only records fixture handling.",
        },
        rebuild=False,
    )
    app.index.rebuild()
    issues = app.workspace.issues(matter_id)
    issue_by_prefix = {
        next(title for title, _detail, _kind in ISSUES if str(item["title"]).startswith(title)): item["issue_id"]
        for item in issues
        if any(str(item["title"]).startswith(title) for title, _detail, _kind in ISSUES)
    }
    legal_issue_ids = [issue_by_prefix[title] for title, _detail, kind in ISSUES if kind == "legal"]
    other_issue_ids = [issue_by_prefix[title] for title, _detail, kind in ISSUES if kind == "other_workstream"]
    source_choice = {
        "external": True,
        "other_matters": False,
        "public_query": PUBLIC_QUERY,
        "provider_ids": app.research.search_options()["provider_ids"],
        "native": False,
        "collection_enabled": True,
        "allow_firecrawl": True,
        "allow_followup_queries": True,
    }
    resolved = app.runner.resolve("counsel-copilot").selection
    evidence = {
        "fixture_id": FIXTURE_ID,
        "fixture_vault": str(VAULT_PATH.resolve()),
        "phase": "prepared_no_external_calls",
        "external_attempt_count": 0,
        "prepared_at": now(),
        "matter_id": matter_id,
        "matter_source_action_key": MATTER_ACTION,
        "preparation_source_action_key": PREP_ACTION,
        "start_source_action_key": START_ACTION,
        "preparation_run_id": PREP_RUN_ID,
        "parent_request_id": None,
        "selected_main": resolved.__dict__,
        "selected_collector": SELECTED_COLLECTOR,
        "source_choice": source_choice,
        "planned_issue_workers": [
            {"issue_id": issue_id, "planned_identity": f"{FIXTURE_ID}:{issue_id}", "run_id": None}
            for issue_id in legal_issue_ids
        ],
        "retained_other_issue_ids": other_issue_ids,
        "synthetic_sources": [launch_path, vendor_path],
        "cost": None,
        "cost_note": "Provider cost is not exposed; no dollar estimate will be guessed.",
    }
    if evidence["selected_main"] != {"agent_id": "counsel-copilot", **SELECTED_MAIN}:
        raise SystemExit(f"Selected main model changed: {evidence['selected_main']}")
    if source_choice["provider_ids"] != ["firecrawl", "polaris"]:
        raise SystemExit(f"Configured search choices changed: {source_choice['provider_ids']}")
    write_json(ATTEMPT_PATH, evidence)
    asyncio.run(app.close_providers())
    print(json.dumps(evidence, indent=2))


def seconds_between(start: str | None, end: str | None) -> float | None:
    if not start or not end:
        return None
    return (datetime.fromisoformat(end) - datetime.fromisoformat(start)).total_seconds()


def tool_counts(checkpoint: dict[str, Any]) -> dict[str, int]:
    seen: set[str] = set()
    counts: dict[str, int] = {}
    for message in checkpoint.get("main_messages") or []:
        for call in message.get("tool_calls") or []:
            call_id = str(call.get("id") or "")
            name = str((call.get("function") or {}).get("name") or "")
            if not name or call_id in seen:
                continue
            seen.add(call_id)
            counts[name] = counts.get(name, 0) + 1
    return counts


async def run_once() -> None:
    evidence = read_json(ATTEMPT_PATH)
    if evidence.get("external_attempt_count") != 0 or evidence.get("phase") != "prepared_no_external_calls":
        raise SystemExit("Refusing to run: the one configured-model attempt was already started.")
    marker = json.loads(VaultService(VAULT_PATH).read_text(".dossier-live-quality-fixture.json"))
    if marker != {"fixture_id": FIXTURE_ID, "vault": str(VAULT_PATH.resolve())}:
        raise SystemExit("Fixture ownership marker is missing or changed.")

    from app.runtime import AppContext

    app = AppContext(synthetic_settings(), recover_interrupted=False)
    resolved = app.runner.resolve("counsel-copilot").selection.__dict__
    if resolved != evidence["selected_main"]:
        raise SystemExit(f"Selected main model changed: {resolved}")
    if app.research.search_options()["provider_ids"] != evidence["source_choice"]["provider_ids"]:
        raise SystemExit("Configured search providers changed.")

    evidence.update(
        phase="configured_model_attempt_started",
        external_attempt_count=1,
        external_started_at=now(),
    )
    write_json(ATTEMPT_PATH, evidence)
    exercise_started = time.monotonic()
    matter_id = evidence["matter_id"]
    try:
        preparation_started = time.monotonic()
        status = await app.dossier_requests.prepare(
            ChatRequest(
                matter_id=matter_id,
                message="Generate a research-first dossier for this synthetic matter.",
                source_action_key=PREP_ACTION,
                experimental_chat=True,
            ),
            run_id=PREP_RUN_ID,
        )
        preparation_seconds = time.monotonic() - preparation_started
        evidence.update(
            phase="parent_prepared",
            parent_request_id=status["request_id"],
            preparation_seconds=preparation_seconds,
            preparation_completed_at=now(),
            saved_model_selections=status.get("model_selections"),
        )
        write_json(ATTEMPT_PATH, evidence)

        legal_issue_ids = [item["issue_id"] for item in evidence["planned_issue_workers"]]
        start_choices = {
            "execution_mode": "research",
            "expected_sequence": status["sequence"],
            "plan_revision": status["plan_revision"],
            "priorities": status["priorities"],
            "first_issue_ids": legal_issue_ids,
            "scope": "top_three",
            "source_choice": evidence["source_choice"],
            "accepted_candidate_keys": [],
            "source_action_key": START_ACTION,
        }
        await app.dossier_requests.start(
            matter_id,
            status["request_id"],
            start_choices,
            expected_sequence=status["sequence"],
        )
        started_record = app.dossier_requests.get_record(matter_id, status["request_id"])["metadata"]
        for item in evidence["planned_issue_workers"]:
            item["run_id"] = (started_record.get("issues") or {}).get(item["issue_id"], {}).get("child_run_id")
        evidence.update(phase="children_started", children_recorded_at=now())
        write_json(ATTEMPT_PATH, evidence)

        await asyncio.wait_for(app.dossier_requests.wait_for_active_work(), timeout=1800)
        await asyncio.wait_for(app.research_runs.wait_for_active_work(), timeout=60)
        total_seconds = time.monotonic() - exercise_started
        final_record = app.dossier_requests.get_record(matter_id, status["request_id"])
        final = final_record["metadata"]
        child_summaries = []
        for item in evidence["planned_issue_workers"]:
            run = app.research_runs.get(matter_id, item["run_id"])
            checkpoint = run.get("checkpoint") or {}
            requests = list((checkpoint.get("requests") or {}).values())
            child_summaries.append(
                {
                    "issue_id": item["issue_id"],
                    "run_id": item["run_id"],
                    "state": run.get("state"),
                    "managed_state": run.get("managed_state"),
                    "started_at": run.get("started_at"),
                    "finished_at": run.get("finished_at"),
                    "active_seconds": seconds_between(run.get("started_at"), run.get("finished_at")),
                    "main_call_count": (checkpoint.get("budget_used") or {}).get("main_calls", 0),
                    "tool_counts": tool_counts(checkpoint),
                    "evidence_reads": len(checkpoint.get("passages") or []),
                    "retrieved_sources": len(checkpoint.get("sources") or []),
                    "request_traces": [
                        {
                            "public_query": request.get("public_query"),
                            "status": request.get("status"),
                            "source_goal": request.get("source_goal"),
                            "provider_legs": request.get("provider_legs") or [],
                            "sources": [
                                {
                                    "source_id": source.get("source_id"),
                                    "url": source.get("url"),
                                    "support_state": source.get("support_state"),
                                    "path": source.get("path"),
                                }
                                for source in request.get("sources") or []
                            ],
                        }
                        for request in requests
                    ],
                    "packet_paths": [result.get("path") for result in run.get("results") or [] if result.get("path")],
                }
            )
        first_ready_seconds = seconds_between(evidence["external_started_at"], final.get("first_pass_ready_at"))
        result = {
            **evidence,
            "phase": "configured_model_attempt_completed",
            "completed_at": now(),
            "final_parent_state": final.get("state"),
            "final_parent_phase": final.get("phase"),
            "first_pass_ready_at": final.get("first_pass_ready_at"),
            "first_useful_dossier_seconds": first_ready_seconds,
            "full_request_seconds": total_seconds,
            "publication_count": len(final.get("publications") or []),
            "publications": final.get("publications") or [],
            "child_summaries": child_summaries,
            "dossier_path": app.dossiers._path(matter_id),
            "dossier_revision_paths": [entry.get("revision_path") for entry in final.get("publications") or [] if entry.get("revision_path")],
            "retained_other_issue_ids": evidence["retained_other_issue_ids"],
            "cost": None,
            "cost_note": "The configured provider did not expose cost for this exercise; no dollar value was estimated.",
        }
        write_json(RESULT_PATH, result)
        evidence.update(phase="configured_model_attempt_completed", completed_at=result["completed_at"])
        write_json(ATTEMPT_PATH, evidence)
        print(json.dumps(result, indent=2))
    except BaseException as exc:
        evidence.update(
            phase="configured_model_attempt_failed_or_interrupted",
            failed_at=now(),
            error_type=type(exc).__name__,
            error=str(exc),
        )
        write_json(ATTEMPT_PATH, evidence)
        raise
    finally:
        await app.close_providers()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("phase", choices=("prepare", "run"))
    args = parser.parse_args()
    if args.phase == "prepare":
        prepare_fixture()
    else:
        if not ATTEMPT_PATH.exists():
            raise SystemExit("Prepare and save fixture identities before the configured-model attempt.")
        asyncio.run(run_once())


if __name__ == "__main__":
    main()
