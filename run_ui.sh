#!/bin/bash
# Start the Streamlit dashboard
# Usage: bash run_ui.sh

cd "$(dirname "$0")"

if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "ERROR: ANTHROPIC_API_KEY is not set."
  echo "Run: export ANTHROPIC_API_KEY=sk-ant-..."
  exit 1
fi

echo "Starting FRONTLINE AI Dashboard at http://localhost:8501"
streamlit run ui/dashboard.py
