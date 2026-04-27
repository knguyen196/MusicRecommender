#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend/Music-Recommender"
VENV_DIR="$BACKEND_DIR/.venv"

echo "==> Installing backend (Python)"
if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: python3 not found. Install Python 3.11+ and try again."
  exit 1
fi

if [[ ! -d "$VENV_DIR" ]]; then
  python3 -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"
python -m pip install --upgrade pip

if [[ -f "$BACKEND_DIR/requirements.txt" ]]; then
  pip install -r "$BACKEND_DIR/requirements.txt"
else
  pip install flask flask-cors scikit-learn pandas numpy requests librosa
fi

echo "==> Installing frontend (Node)"
if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm not found. Install Node.js (16+) and try again."
  exit 1
fi

if [[ ! -d "$FRONTEND_DIR" ]]; then
  echo "ERROR: Frontend directory not found at: $FRONTEND_DIR"
  exit 1
fi

(cd "$FRONTEND_DIR" && npm install)

echo
echo "Done."
echo
echo "Next:"
echo "  Backend:   (cd backend && source .venv/bin/activate && python app.py)"
echo "  Frontend:  (cd frontend/Music-Recommender && npm run dev)"
