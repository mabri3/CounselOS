"""Small, process-wide logging setup for the application."""

from __future__ import annotations

import logging
import os


DEFAULT_LOG_LEVEL = "INFO"
LOG_FORMAT = "%(asctime)s %(levelname)s %(name)s: %(message)s"


def configure_logging() -> None:
    """Configure application logs without replacing server logging handlers."""
    level_name = os.getenv("LOG_LEVEL", DEFAULT_LOG_LEVEL).upper()
    level = logging.getLevelNamesMapping().get(level_name, logging.INFO)
    root_logger = logging.getLogger()

    if not root_logger.handlers:
        logging.basicConfig(level=level, format=LOG_FORMAT)

    logging.getLogger("app").setLevel(level)
