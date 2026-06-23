#!/bin/bash
# Start the FastAPI backend
# Usage: bash run_api.sh

cd "$(dirname "$0")"

if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "ERROR: ANTHROPIC_API_KEY is not set."
  echo "Run: export ANTHROPIC_API_KEY=sk-ant-..."
  exit 1
fi

echo "Starting FRONTLINE AI API on http://localhost:8000"
echo "API docs: http://localhost:8000/docs"
uvicorn app.main:app --reload --port 8000
