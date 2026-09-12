"""Two synthetic, non-financial matters through the real dossier writer.

Run explicitly from backend with --provider, --model, and --effort. This makes
paid model calls. Creates a new isolated vault; never opens the active vault.
Read the resulting dossiers to assess quality. This is not an automatic grader.
"""
import argparse
import asyncio
import hashlib
from pathlib import Path
import shutil
import tempfile
import time

from app.config import Settings
from app.agents.runner import RunnerExecutionState
from app.models.api import MatterCreate, WorkItemCreate
from app.providers.base import ProviderSelection
from app.runtime import AppContext
from app.services.dossier_generation import generate_dossier
from app.services.recommendations import RecommendationService


CASES = [
    {
        "title": "Synthetic supplier renewal and exit",
        "question": "Can we switch suppliers on November 20, 2026 without another annual renewal?",
        "facts": ["The service term renews on December 1, 2026.",
            "The business plans a supplier switch on November 20, 2026.",
            "The signed agreement below governs this service. No emergency security event is reported.",
            "Whether any termination notice was already sent or received is unknown.",
            "Customer data must remain available during the switch. Export has not been tested."],
        "issues": ["Annual renewal and effective termination", "Data export and service continuity"],
        "clauses": ["Section 8.2: The agreement renews for one year on December 1, 2026 unless the supplier receives written non-renewal notice at legal-notices@example.test at least 30 calendar days before renewal. An emergency security event permits immediate suspension of affected access, not termination of the agreement. A different termination date requires a written agreement signed by both parties.",
            "Section 9.4: The customer may export its data for 30 calendar days after effective termination. The supplier deletes the data 45 calendar days after effective termination. Export is available only in CSV format. Paid service remains available until effective termination."],
        "old_view": "The planned November 20 switch itself avoids renewal; an emergency suspension ends the contract.",
        "finding": "A proposed monthly extension has been discussed but no supplier acceptance is saved. Do not treat it as available.",
        "next": "Check notice delivery evidence, then test whether the CSV export can be imported by the replacement supplier.",
        "work": "Check non-renewal notice delivery evidence",
        "owner": "Legal Operations", "due": "2026-10-28",
        "alternative": "Monthly bridge service",
        "hypothesis": "Assume the supplier signs a one-month extension. Price and termination mechanics remain unagreed.",
    },
    {
        "title": "Synthetic customer story campaign",
        "question": "Can we publish the customer story on the website and in paid social ads on October 5, 2026?",
        "facts": ["The October 5, 2026 campaign uses a customer's logo, a named employee's photo and quote, and a customer dashboard screenshot.",
            "The customer signed the supplied permission letter. It is the only saved approval.",
            "The screenshot contains customer contact names and work email addresses.",
            "No separate employee release is saved. Whether one exists is unknown.",
            "Marketing can publish a text-only, anonymized version without the screenshot, photo, logo, or attributed quote."],
        "issues": ["Customer brand and channel permission", "Employee likeness and quote", "Screenshot confidentiality"],
        "clauses": ["Paragraph 2: The customer permits use of its logo and approved story text on the supplier's own website for six months from first publication. Paid advertising, employee likenesses and employee quotes are excluded. Each such use requires separate written permission from the relevant rights holder.",
            "Paragraph 4: The customer does not grant rights in any employee's likeness or attributed quote. This letter is not an employee release.",
            "Paragraph 6: Public materials must not disclose customer confidential information, including contact names or email addresses visible in product screenshots. The customer must approve the final redacted screenshot in writing before publication."],
        "old_view": "The signed customer letter approves all campaign assets across all channels.",
        "finding": "A cropped screenshot still shows a contact name. A redaction alone does not satisfy the letter's final-approval requirement.",
        "next": "Choose between the approved website scope and an anonymized version while requesting the remaining permissions.",
        "work": "Prepare the anonymized text-only campaign copy",
        "owner": "Marketing", "due": "2026-09-25",
        "alternative": "Anonymized text-only story",
        "hypothesis": "Remove the logo, employee photo and quote, and dashboard screenshot; confirm the remaining text cannot identify the customer or disclose confidential facts.",
    },
]


def seed(app, case):
    matter = app.matters.create(MatterCreate(title=case["title"], request_text=case["question"],
        description="Synthetic quality test. Use the supplied fictional agreements, not unstated law.",
        target_date="2026-11-20" if "supplier" in case["title"] else "2026-10-05"))
    mid, root = matter["matter_id"], matter["path"]
    app.dossiers.propose_update(mid, "# Dossier\n\n## Current position\n\n" + case["old_view"]
        + "\n\n## Decision question\n\n" + case["question"], expected_hash=None, generated=True)
    app.matter_records.apply_update(mid, facts=[{"text": text} for text in case["facts"]], actor="Lawyer")
    app.vault.write_markdown(root + "/issues.md", "# Issues\n\n" + "\n".join("- " + title for title in case["issues"]), {"matter_id": mid})
    source_path = root + "/documents/signed-permission.md"
    app.vault.write_markdown(source_path, "# Supplied fictional agreement\n\n" + "\n\n".join(case["clauses"]),
        {"matter_id": mid, "source_id": "SRC-agreement", "title": "Supplied fictional agreement"})
    positions = {}
    for issue, clause in zip(app.workspace.issues(mid), case["clauses"]):
        iid = issue["issue_id"]
        positions[iid] = {"position": "Earlier summary needs reconciliation with the saved clause.",
            "analysis_markdown": case["old_view"], "packet_path": source_path,
            "source_records": [{"source_id": "SRC-agreement", "source_version": "signed-v1", "path": source_path,
                "source_label": "Supplied fictional agreement", "support_state": "supplied", "source_type": "workspace",
                "selected_passages": [{"text": clause, "section_label": clause.split(":", 1)[0], "unit_id": "s000001"}]}]}
    RecommendationService(app.vault, app.matters).propose(mid, case["old_view"], actor="counsel-copilot",
        publication={"view_version": 3, "issue_positions": positions, "updated_issue_ids": list(positions)})
    baseline = app.solution_paths.ensure_baseline(mid)
    conversation = app.chat_history.append(mid, None, role="user", content="Keep this analysis for the current direction.")
    app.matter_memory.save(mid, baseline["scenario_id"], {"current_task": "Evaluate the requested launch.",
        "findings": [{"text": case["finding"], "status": "qualified"}], "next_action": case["next"]},
        expected_sequence=0, run_id="RUN-synthetic", conversation_id=conversation["conversation_id"],
        message_id=conversation["messages"][-1]["message_id"])
    app.solution_paths.explore(mid, parent_path_id=baseline["scenario_id"],
        parent_revision=app.workspace_scenarios.get(mid, baseline["scenario_id"])["revision"],
        source_action_key="quality-alternative", title=case["alternative"], hypothesis_summary=case["hypothesis"])
    app.matters.create_work_item(WorkItemCreate(matter_id=mid, title=case["work"], owner=case["owner"], due_at=case["due"]))
    return mid, root


def seed_history(app, mid, root, case):
    """Material work outside the issue list and outside the active conversation."""
    supplier = "supplier" in case["title"]
    topic = "deletion certificate" if supplier else "campaign withdrawal"
    earlier = ("The customer requires a deletion certificate. I think it is due 14 days after deletion."
               if supplier else "The customer can withdraw its campaign permission. I think we have 72 hours to stop using the material.")
    corrected = ("Correction to my earlier message: the signed rider requires a deletion certificate within seven calendar days after deletion, not 14."
                 if supplier else "Correction: the signed rider requires website removal within 24 hours after withdrawal, not 72. Paid placements must stop within 48 hours if separately authorized.")
    clause = ("Section 9.5: The supplier must provide a signed deletion certificate within seven calendar days after deleting the customer's data. Export and successful restoration must be checked before irreversible deletion."
              if supplier else "Paragraph 8: The customer may withdraw its permission by written notice. The supplier must remove website materials within 24 hours after receipt, and stop any separately authorized paid placements within 48 hours. This rider grants no additional advertising rights.")
    earlier_chat = app.chat_history.append(mid, None, role="user", content=earlier)
    app.chat_history.append(mid, earlier_chat["conversation_id"], role="assistant",
        content="## Additional dependency: " + topic + "\n\n" +
        "Earlier analysis to revisit. " * 400 + "\n\n" + clause +
        "\n\nThis affects the business objective even though it is not in the saved issue list.")
    current = app.chat_history.append(mid, None, role="user", content=corrected)
    app.chat_history.append(mid, current["conversation_id"], role="user",
        content="Hypothetical only: suppose the counterparty waives that requirement. No waiver is signed. Do not adopt that assumption.")
    for n in range(10):
        app.chat_history.append(mid, current["conversation_id"], role="user", content=f"Formatting note {n}: use short paragraphs.")
    app.chat_history.append(mid, current["conversation_id"], role="user", content="What does CSV mean?" if supplier else "What is an impression in advertising?")
    app.vault.write_markdown(root + "/documents/signed-rider.md", "# Signed rider\n\n" +
        ("Administrative background. No operative term in this paragraph.\n\n" * 150) + clause,
        {"matter_id": mid, "title": "Signed rider — " + topic, "source_id": "SRC-rider"})
    return current["conversation_id"]


async def main(args):
    destination = Path(tempfile.mkdtemp(prefix="dossier-quality-")) / "vault"
    shutil.copytree(Path(__file__).resolve().parents[1] / "fixtures/vault", destination)
    # AppContext loads saved fixture settings. Override only this owned copy.
    app = AppContext(Settings(_env_file=None, vault_path=str(destination), scheduler_enabled=False,
        llm_provider="mock", llm_api_key=None, polaris_api_key=None, search_provider="disabled"))
    selected = ProviderSelection("counsel-copilot", args.provider, args.model, args.effort)
    resolved = app.provider_router.resolve_selection(selected)
    print(f"Isolated vault: {destination}", flush=True)
    try:
        for case in CASES:
            mid, root = seed(app, case)
            cid = seed_history(app, mid, root, case) if args.history else None
            protected = [root + "/" + name for name in ("facts.md", "issues.md", "recommendations.md", "paths/state.md")]
            before = {p: hashlib.sha256(app.vault.read_text(p).encode()).hexdigest() for p in protected}
            for iteration in range(args.repeat):
                started = time.monotonic()
                state = RunnerExecutionState()
                result = await generate_dossier(app, mid, resolved_provider=resolved,
                    request="Generate the complete dossier using saved material only.",
                    frozen_context={"conversation_id": cid}, execution_state=state)
                after = {p: hashlib.sha256(app.vault.read_text(p).encode()).hexdigest() for p in protected}
                assert before == after, "Dossier changed a protected matter record"
                assert app.workspace.business_question(mid)["text"] == case["question"], "Business question drifted"
                print({"title": case["title"], "iteration": iteration + 1, "state": result["state"], "seconds": round(time.monotonic() - started, 1),
                    "warnings": result["warnings"], "path": str(destination / result.get("revision_path", root + "/dossier.md")),
                    "record_reads": state.frozen_context.get("dossier_record_reads", []),
                    "protected_records_unchanged": before == after}, flush=True)
    finally:
        await app.close_providers()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--provider", required=True)
    parser.add_argument("--model", required=True)
    parser.add_argument("--effort", required=True)
    parser.add_argument("--history", action="store_true", help="Test older conversations, corrections and long source passages.")
    parser.add_argument("--repeat", type=int, choices=(1, 2), default=1)
    asyncio.run(main(parser.parse_args()))
