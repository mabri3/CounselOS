from __future__ import annotations


def _empty_settings(app_context):
    from app.services.settings import SettingsService

    app_context.vault.resolve(SettingsService.PATH).unlink(missing_ok=True)


def test_settings_merge_rather_than_replace(app_context):
    _empty_settings(app_context)
    assert app_context.settings_store.read()["values"] == {}
    app_context.settings_store.write(
        {
            "general.organisation": "DemoCo Financial",
            "general.serif_long_documents": False,
        }
    )
    merged = app_context.settings_store.write(
        {"matters.default_owner": "Brian Harris"}
    )["values"]
    assert merged["general.organisation"] == "DemoCo Financial"
    assert merged["general.serif_long_documents"] is False
    assert merged["matters.default_owner"] == "Brian Harris"


def test_settings_are_on_disk_not_in_memory(app_context):
    from app.services.settings import SettingsService

    _empty_settings(app_context)
    app_context.settings_store.write({"general.organisation": "DemoCo Financial"})
    fresh = SettingsService(app_context.vault)
    assert fresh.read()["values"]["general.organisation"] == "DemoCo Financial"


def test_training_attestation_is_stamped_once(app_context, monkeypatch):
    _empty_settings(app_context)
    timestamps = iter(
        [
            "2026-08-26T08:40:00+00:00",
            "2026-08-26T08:41:00+00:00",
            "2026-08-26T08:42:00+00:00",
            "2026-08-26T08:43:00+00:00",
        ]
    )
    monkeypatch.setattr("app.services.settings.iso_now", lambda: next(timestamps))

    app_context.settings_store.write({"matters.default_owner": "Brian Harris"})
    values = app_context.settings_store.write(
        {"data.provider_no_training_attested": True}
    )["values"]
    assert values["data.provider_no_training_attested"] is True
    assert values["data.provider_no_training_attested_by"] == "Brian Harris"
    stamped_at = values["data.provider_no_training_attested_at"]
    assert stamped_at == "2026-08-26T08:41:00+00:00"

    # Re-writing the same value must not re-stamp.
    again = app_context.settings_store.write(
        {"data.provider_no_training_attested": True}
    )["values"]
    assert again["data.provider_no_training_attested_at"] == stamped_at

    # Changing it does re-stamp.
    changed = app_context.settings_store.write(
        {"data.provider_no_training_attested": False}
    )["values"]
    assert changed["data.provider_no_training_attested_at"] == "2026-08-26T08:43:00+00:00"
