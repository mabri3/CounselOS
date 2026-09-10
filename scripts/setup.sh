#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ ! -f "$ROOT/.env" ]]; then
  cp "$ROOT/.env.example" "$ROOT/.env"
fi

# Keep browser-exposed settings in the location Next.js reads.
grep '^NEXT_PUBLIC_' "$ROOT/.env" > "$ROOT/frontend/.env.local" || true

PYTHON_CANDIDATES=(
  "${COUNSEL_OS_PYTHON:-}"
  python3.13
  python3.12
  python3.11
  python3
)

PYTHON_BIN=""
for candidate in "${PYTHON_CANDIDATES[@]}"; do
  [[ -n "$candidate" ]] || continue
  command -v "$candidate" >/dev/null 2>&1 || continue
  if "$candidate" -c 'import sys; raise SystemExit(sys.version_info < (3, 11))'; then
    PYTHON_BIN="$candidate"
    break
  fi
done

if [[ -z "$PYTHON_BIN" ]]; then
  echo "Python 3.11 or newer is required. Set COUNSEL_OS_PYTHON to a compatible executable." >&2
  exit 1
fi

"$PYTHON_BIN" -m venv --clear "$ROOT/backend/.venv"
"$ROOT/backend/.venv/bin/pip" install --upgrade pip
"$ROOT/backend/.venv/bin/pip" install -r "$ROOT/backend/requirements.txt"
"$ROOT/backend/.venv/bin/python" -m playwright install chromium

cd "$ROOT/frontend"
npm install

echo "Setup complete. Run ./scripts/dev.sh"
