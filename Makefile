.PHONY: setup dev backend frontend test typecheck build verify

setup:
	./scripts/setup.sh

dev:
	./scripts/dev.sh

backend:
	cd backend && .venv/bin/uvicorn app.main:app --reload --port 8000

frontend:
	cd frontend && npm run dev

test:
	cd backend && .venv/bin/pytest

typecheck:
	cd frontend && npm run typecheck

build:
	cd frontend && npm run build

verify:
	./scripts/verify.sh
