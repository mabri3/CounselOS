from __future__ import annotations

import pytest

from app.models.awareness import MitigationCreate, MitigationPatch
from app.services.mitigations import MitigationService


def test_mitigation_is_explicit_and_links_matter_and_decision(app_context):
    service = MitigationService(app_context.vault)
    created = service.create("MAT-DEMO-APEX", MitigationCreate(
        title="Short retention deletion job",
        description="Delete raw audio after seven days.",
        decision_ids=["DEC-DEMO-APEX-RETENTION"],
    ))

    assert created.matter_id == "MAT-DEMO-APEX"
    assert created.decision_ids == ["DEC-DEMO-APEX-RETENTION"]
    assert created.path.endswith(f"/mitigations/{created.mitigation_id}.md")
    app_context.decisions.link_mitigation(created.decision_ids[0], created.mitigation_id)
    assert created.mitigation_id in app_context.decisions.get(created.decision_ids[0])["mitigation_ids"]


def test_mitigation_update_requires_current_revision(app_context):
    service = MitigationService(app_context.vault)
    created = service.create("MAT-DEMO-APEX", MitigationCreate(title="Deletion job"))
    updated = service.update(
        created.matter_id,
        created.mitigation_id,
        MitigationPatch(expected_revision=1, status="complete"),
        1,
    )
    assert updated.revision == 2 and updated.status == "complete"

    with pytest.raises(ValueError, match="revision conflict"):
        service.update(
            created.matter_id,
            created.mitigation_id,
            MitigationPatch(expected_revision=1, status="retired"),
            1,
        )
