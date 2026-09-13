from __future__ import annotations

from app.models.awareness import (
    DevelopmentCandidate,
    ProviderCheckpoint,
    ProviderScanResult,
    SourceReference,
)


class _CapturingProvider:
    def __init__(self, provider_id: str, results: list[object]):
        self.provider_id = provider_id
        self.results = list(results)
        self.queries = []

    async def scan(self, query, checkpoint):
        self.queries.append(query)
        result = self.results.pop(0)
        if isinstance(result, Exception):
            raise result
        return result


def _candidate() -> DevelopmentCandidate:
    return DevelopmentCandidate(
        title="Quantum lattice privacy enforcement update",
        canonical_url="https://agency.example/quantum-lattice",
        content_hash="public-version-1",
        summary="The agency published a quantum lattice privacy enforcement update.",
        provider_observation="Public agency text only.",
        sources=[SourceReference(
            title="Agency bulletin",
            canonical_url="https://agency.example/quantum-lattice",
            excerpt="A public privacy enforcement update.",
        )],
    )


def test_api_lifecycle_keeps_partial_output_dedupes_and_rematches_local_change(
    awareness_client, app_context
):
    native = _CapturingProvider("native", [
        ProviderScanResult(
            provider_id="native",
            status="success",
            next_checkpoint=ProviderCheckpoint(provider_id="native", cursor="page-2"),
            candidates=[_candidate()],
        ),
        ProviderScanResult(provider_id="native", status="success", candidates=[]),
        ProviderScanResult(provider_id="native", status="success", candidates=[]),
    ])
    polaris = _CapturingProvider("polaris", [
        RuntimeError("Polaris is offline"),
        RuntimeError("Polaris is still offline"),
        RuntimeError("Polaris is still offline"),
    ])
    app_context.intelligence._providers.update(native=native, polaris=polaris)

    created = awareness_client.post("/api/watches/drafts", json={
        "title": "Public privacy rules",
        "standing_question": "What public privacy enforcement rules changed?",
        "public_query": {
            "standing_question": "What public privacy enforcement rules changed?",
            "topics": ["privacy", "enforcement"],
        },
        "purposes": ["awareness"],
        "provider": "both",
    }).json()

    first = awareness_client.post(
        f"/api/watches/{created['watch_id']}/scan", json={"mode": "draft"}
    )
    assert first.status_code == 200
    first_body = first.json()
    assert first_body["scan"]["status"] == "partial"
    assert [result["status"] for result in first_body["scan"]["provider_results"]] == [
        "success", "failed",
    ]
    first_item = next(
        item for item in first_body["preview_items"] if item["title"] == _candidate().title
    )
    assert native.queries[0].model_dump(mode="json") == first_body["scan"]["outbound_query"]
    assert "page-2" == app_context.watches.get(created["watch_id"]).checkpoints["native"].cursor

    second = awareness_client.post(
        f"/api/watches/{created['watch_id']}/scan", json={"mode": "draft"}
    ).json()
    assert second["scan"]["status"] == "partial"
    rerun_items = [
        item for item in second["preview_items"]
        if item["development_id"] == first_item["development_id"]
    ]
    assert [item["item_id"] for item in rerun_items] == [first_item["item_id"]]
    page = awareness_client.get(
        f"/api/briefing/items?watch={created['watch_id']}"
    ).json()
    persisted = [
        item for item in page["items"]
        if item["development_id"] == first_item["development_id"]
    ]
    assert [item["item_id"] for item in persisted] == [first_item["item_id"]]

    app_context.vault.write_markdown(
        "02_Company_Knowledge/quantum-lattice.md",
        "# Quantum lattice controls\n\nInternal implementation notes.",
        {"policy_id": "POL-QUANTUM", "title": "Quantum lattice privacy controls"},
    )
    third = awareness_client.post(
        f"/api/watches/{created['watch_id']}/scan", json={"mode": "draft"}
    ).json()
    rematched = next(
        item for item in third["preview_items"]
        if item["development_id"] == first_item["development_id"]
    )
    assert rematched["company_connection"]["policies"] == ["POL-QUANTUM"]
    assert "company context overlaps" in rematched["why_shown"].lower()

    current = awareness_client.get(f"/api/watches/{created['watch_id']}").json()
    activated = awareness_client.post(
        f"/api/watches/{created['watch_id']}/activate",
        json={"expected_revision": current["revision"]},
    )
    assert activated.status_code == 200
    assert activated.json()["watch"]["enabled"] is True
    assert activated.json()["schedule"]["target_watch_id"] == created["watch_id"]


def test_private_outbound_value_is_blocked_before_provider_resolution(
    awareness_client, app_context
):
    private_name = "Caf\u00e9 Meridian Internal Product"
    app_context.vault.write_markdown(
        "02_Company_Knowledge/private-product.md",
        "# Private product\n",
        {"product_id": "PROD-PRIVATE", "product_name": private_name},
    )
    provider = _CapturingProvider(
        "native", [ProviderScanResult(provider_id="native", status="success")]
    )
    app_context.intelligence._providers["native"] = provider
    watch = awareness_client.post("/api/watches/drafts", json={
        "title": "Unsafe draft",
        "standing_question": f"Track CAFE\u0301 MERIDIAN internal product rules",
        "public_query": {
            "standing_question": f"Track CAFE\u0301 MERIDIAN internal product rules"
        },
        "purposes": ["awareness"],
        "provider": "native",
    }).json()

    response = awareness_client.post(
        f"/api/watches/{watch['watch_id']}/scan", json={"mode": "draft"}
    )
    assert response.status_code == 200
    assert response.json()["scan"]["status"] == "failed"
    assert "Outbound query validation failed" in response.json()["scan"]["warnings"][0]
    assert provider.queries == []
