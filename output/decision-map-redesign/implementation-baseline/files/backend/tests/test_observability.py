from __future__ import annotations

import logging

from fastapi.testclient import TestClient

from app.main import app
from app.observability import configure_logging


def test_configure_logging_uses_log_level_for_application_logger(monkeypatch) -> None:
    monkeypatch.setenv("LOG_LEVEL", "DEBUG")

    configure_logging()

    assert logging.getLogger("app").isEnabledFor(logging.DEBUG)


def test_trusted_host_allows_local_hosts() -> None:
    client = TestClient(app)

    for host in ("localhost", "127.0.0.1", "testserver"):
        response = client.get("/", headers={"host": host})

        assert response.status_code == 200


def test_trusted_host_rejects_untrusted_hosts() -> None:
    client = TestClient(app)

    response = client.get("/", headers={"host": "untrusted.example"})

    assert response.status_code == 400
