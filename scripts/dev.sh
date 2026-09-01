#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
START_TIMEOUT_SECONDS="${DEV_START_TIMEOUT_SECONDS:-60}"
LOG_DIR="${DEV_LOG_DIR:-${TMPDIR:-/tmp}/themis-ai-dev}"
BACKEND_LOG=""
FRONTEND_LOG=""
BACKEND_PID=""
FRONTEND_PID=""
CLEANED_UP=0

fail() {
  echo "Error: $*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Required command '$1' is not installed."
}

require_port() {
  local name="$1"
  local port="$2"
  [[ "$port" =~ ^[0-9]+$ ]] && (( port >= 1 && port <= 65535 )) || \
    fail "$name must be an integer from 1 to 65535 (received '$port')."
}

check_port_available() {
  local name="$1"
  local port="$2"
  if ! "$PROJECT_ROOT/backend/.venv/bin/python" - "$port" <<'PY'
import socket
import sys

port = int(sys.argv[1])
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        sock.bind(("127.0.0.1", port))
    except OSError:
        raise SystemExit(1)
PY
  then
    fail "$name port $port is already in use. Stop the process using it or choose another port."
  fi
}

check_next_dev_lock() {
  local lock_path="$PROJECT_ROOT/frontend/.next/dev/lock"
  local lock_detail
  if ! lock_detail=$("$PROJECT_ROOT/backend/.venv/bin/python" - "$lock_path" <<'PY'
import fcntl
import json
import pathlib
import sys

lock_path = pathlib.Path(sys.argv[1])
if not lock_path.exists():
    raise SystemExit(0)

with lock_path.open("a+") as lock_file:
    try:
        fcntl.flock(lock_file, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        lock_file.seek(0)
        try:
            details = json.load(lock_file)
        except (json.JSONDecodeError, OSError):
            details = {}
        pid = details.get("pid", "unknown")
        url = details.get("appUrl", "unknown URL")
        print(f"PID {pid} at {url}")
        raise SystemExit(1)
    finally:
        try:
            fcntl.flock(lock_file, fcntl.LOCK_UN)
        except OSError:
            pass
PY
  ); then
    fail "Another frontend development server owns this repository (${lock_detail:-details unavailable}). Stop it before running this launcher."
  fi
}

start_service() {
  local working_directory="$1"
  local log_path="$2"
  shift 2
  (
    cd "$working_directory"
    exec "$PROJECT_ROOT/backend/.venv/bin/python" -c \
      'import os, sys; os.setsid(); os.execvp(sys.argv[1], sys.argv[1:])' "$@"
  ) >"$log_path" 2>&1 &
  STARTED_PID=$!
}

process_group_exists() {
  kill -0 -- "-$1" 2>/dev/null
}

service_exists() {
  process_group_exists "$1" || kill -0 "$1" 2>/dev/null
}

stop_process_group() {
  local pid="$1"
  local attempts=0
  service_exists "$pid" || return 0

  if process_group_exists "$pid"; then
    kill -TERM -- "-$pid" 2>/dev/null || true
  else
    kill -TERM "$pid" 2>/dev/null || true
  fi
  while service_exists "$pid" && (( attempts < 50 )); do
    sleep 0.1
    attempts=$((attempts + 1))
  done
  if service_exists "$pid"; then
    echo "Process group $pid did not stop after 5 seconds; forcing it to stop." >&2
    if process_group_exists "$pid"; then
      kill -KILL -- "-$pid" 2>/dev/null || true
    else
      kill -KILL "$pid" 2>/dev/null || true
    fi
  fi
}

cleanup() {
  local exit_status=$?
  (( CLEANED_UP == 0 )) || return "$exit_status"
  CLEANED_UP=1
  trap - EXIT INT TERM HUP

  if [[ -n "$FRONTEND_PID" ]] || [[ -n "$BACKEND_PID" ]]; then
    echo
    echo "Stopping Themis.ai development services..."
  fi
  [[ -z "$FRONTEND_PID" ]] || stop_process_group "$FRONTEND_PID"
  [[ -z "$BACKEND_PID" ]] || stop_process_group "$BACKEND_PID"
  [[ -z "$FRONTEND_PID" ]] || wait "$FRONTEND_PID" 2>/dev/null || true
  [[ -z "$BACKEND_PID" ]] || wait "$BACKEND_PID" 2>/dev/null || true
  return "$exit_status"
}

show_startup_failure() {
  echo >&2
  echo "The services did not become ready. Recent log output follows." >&2
  echo "Backend log: $BACKEND_LOG" >&2
  tail -n 30 "$BACKEND_LOG" >&2 || true
  echo "Frontend log: $FRONTEND_LOG" >&2
  tail -n 30 "$FRONTEND_LOG" >&2 || true
}

trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 129' HUP

require_command curl
require_command env
require_command node
require_command npm
require_command tail
require_port "BACKEND_PORT" "$BACKEND_PORT"
require_port "FRONTEND_PORT" "$FRONTEND_PORT"
require_port "DEV_START_TIMEOUT_SECONDS" "$START_TIMEOUT_SECONDS"
[[ "$BACKEND_PORT" != "$FRONTEND_PORT" ]] || fail "Backend and frontend ports must differ."

PYTHON_BIN="$PROJECT_ROOT/backend/.venv/bin/python"
UVICORN_BIN="$PROJECT_ROOT/backend/.venv/bin/uvicorn"
NEXT_BIN="$PROJECT_ROOT/frontend/node_modules/.bin/next"

[[ -x "$PYTHON_BIN" && -x "$UVICORN_BIN" ]] || \
  fail "Backend dependencies are missing. Run ./scripts/setup.sh first."
[[ -x "$NEXT_BIN" ]] || fail "Frontend dependencies are missing. Run ./scripts/setup.sh first."
"$PYTHON_BIN" -c 'import sys; raise SystemExit(sys.version_info < (3, 11))' || \
  fail "The backend environment must use Python 3.11 or newer. Run ./scripts/setup.sh."
"$PYTHON_BIN" -c 'import docx, fastapi, httpx, multipart, pydantic_settings, pypdf, reportlab, uvicorn, yaml' 2>/dev/null || \
  fail "Backend Python dependencies are incomplete. Run ./scripts/setup.sh."
(
  cd "$PROJECT_ROOT/frontend"
  node -e 'for (const name of ["next", "react", "react-dom", "typescript"]) require.resolve(name)'
) 2>/dev/null || fail "Frontend Node.js dependencies are incomplete. Run ./scripts/setup.sh."

check_port_available "Backend" "$BACKEND_PORT"
check_port_available "Frontend" "$FRONTEND_PORT"
check_next_dev_lock

if [[ -f "$PROJECT_ROOT/.env" ]]; then
  grep '^NEXT_PUBLIC_' "$PROJECT_ROOT/.env" > "$PROJECT_ROOT/frontend/.env.local" || true
fi

mkdir -p "$LOG_DIR"
RUN_ID="$(date '+%Y%m%d-%H%M%S')-$$"
BACKEND_LOG="$LOG_DIR/backend-$RUN_ID.log"
FRONTEND_LOG="$LOG_DIR/frontend-$RUN_ID.log"
BACKEND_URL="http://localhost:$BACKEND_PORT"
FRONTEND_URL="http://localhost:$FRONTEND_PORT"

start_service "$PROJECT_ROOT/backend" "$BACKEND_LOG" \
  env FRONTEND_ORIGIN="$FRONTEND_URL" \
  "$UVICORN_BIN" app.main:app --reload --host 127.0.0.1 --port "$BACKEND_PORT"
BACKEND_PID="$STARTED_PID"

start_service "$PROJECT_ROOT/frontend" "$FRONTEND_LOG" \
  env NEXT_PUBLIC_API_BASE_URL="$BACKEND_URL/api" \
  NEXT_PUBLIC_DISABLE_VAULT_CONFIRMATION=1 \
  npm run dev -- --hostname 127.0.0.1 --port "$FRONTEND_PORT"
FRONTEND_PID="$STARTED_PID"

echo "Starting Themis.ai development services..."
echo "Backend log: $BACKEND_LOG"
echo "Frontend log: $FRONTEND_LOG"

backend_healthy=0
backend_ready=0
frontend_ready=0
deadline=$((SECONDS + START_TIMEOUT_SECONDS))
while (( SECONDS < deadline )); do
  if ! service_exists "$BACKEND_PID" || ! service_exists "$FRONTEND_PID"; then
    show_startup_failure
    fail "A service stopped during startup."
  fi

  if (( backend_healthy == 0 )) && \
    curl --silent --fail --max-time 1 "$BACKEND_URL/api/health" >/dev/null 2>&1; then
    backend_healthy=1
  fi
  if (( backend_ready == 0 )) && \
    curl --silent --fail --max-time 1 "$BACKEND_URL/api/ready" >/dev/null 2>&1; then
    backend_ready=1
  fi
  if (( frontend_ready == 0 )) && \
    curl --silent --fail --max-time 1 "$FRONTEND_URL" >/dev/null 2>&1; then
    frontend_ready=1
  fi

  if (( backend_healthy == 1 && backend_ready == 1 && frontend_ready == 1 )); then
    break
  fi
  sleep 0.5
done

if (( backend_healthy == 0 || backend_ready == 0 || frontend_ready == 0 )); then
  show_startup_failure
  fail "Startup exceeded ${START_TIMEOUT_SECONDS} seconds."
fi

echo
echo "Themis.ai is ready."
echo "Frontend: $FRONTEND_URL"
echo "Backend API: $BACKEND_URL/api"
echo "Backend docs: $BACKEND_URL/docs"
echo "Backend log: $BACKEND_LOG"
echo "Frontend log: $FRONTEND_LOG"
echo "Press Ctrl-C to stop both services."

while true; do
  if ! service_exists "$BACKEND_PID"; then
    wait "$BACKEND_PID" 2>/dev/null || service_status=$?
    fail "Backend stopped unexpectedly with status ${service_status:-0}. See $BACKEND_LOG."
  fi
  if ! service_exists "$FRONTEND_PID"; then
    wait "$FRONTEND_PID" 2>/dev/null || service_status=$?
    fail "Frontend stopped unexpectedly with status ${service_status:-0}. See $FRONTEND_LOG."
  fi
  sleep 1
done
