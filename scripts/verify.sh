#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ ! -x "$ROOT/backend/.venv/bin/pytest" ]]; then
  echo "Backend environment missing. Run ./scripts/setup.sh first." >&2
  exit 1
fi

cd "$ROOT/backend"
"$ROOT/backend/.venv/bin/pytest" -q

cd "$ROOT/frontend"
npm run typecheck
npm run build

echo "Counsel OS verification passed."
