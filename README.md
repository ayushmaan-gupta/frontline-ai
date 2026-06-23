# FRONTLINE AI — Production Triage System

Autonomous triage: converts arbitrary text into structured decisions.

## Architecture

```
Input
 ↓
Injection Detector       (services/injection_detector.py)
 ↓
Claude API + Retry       (llm/claude_client.py)
 ↓
Pydantic Validator       (schemas/triage.py)
 ↓
CSV Storage              (services/storage.py)
 ↓
FastAPI REST API         (app/main.py)
 ↓
Streamlit Dashboard      (ui/dashboard.py)
 ↓
Evaluation Metrics       (evaluation/metrics.py)
```

## Setup

```bash
pip install -r requirements.txt

# Set your Anthropic API key
export ANTHROPIC_API_KEY=sk-ant-...
```

## Run

### FastAPI backend
```bash
cd frontline_ai
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Streamlit dashboard
```bash
cd frontline_ai
streamlit run ui/dashboard.py
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/triage` | POST | Triage a text input |
| `/metrics` | GET | Evaluation metrics |
| `/history` | GET | Last N triage records |
| `/health` | GET | Health check |

### Example request
```bash
curl -X POST http://localhost:8000/triage \
  -H "Content-Type: application/json" \
  -d '{"text": "I was charged twice and the app keeps crashing."}'
```

## Output Schema

```json
{
  "language": "English",
  "sentiment": "negative",
  "emotion": "frustration",
  "summary": "Customer reports duplicate charge and app crash.",
  "issues": [
    {
      "description": "Duplicate charge",
      "category": "billing",
      "priority": "P1",
      "evidence": ["charged twice"]
    },
    {
      "description": "App crash",
      "category": "technical_issue",
      "priority": "P1",
      "evidence": ["app keeps crashing"]
    }
  ],
  "suggested_action": "technical_investigation",
  "needs_human": false,
  "reason_for_escalation": "",
  "missing_information": false,
  "confidence": 0.94
}
```

## Project Structure

```
frontline_ai/
├── app/
│   └── main.py              # FastAPI app
├── llm/
│   └── claude_client.py     # Claude API + retry logic
├── schemas/
│   └── triage.py            # Pydantic models
├── services/
│   ├── injection_detector.py
│   └── storage.py           # CSV persistence
├── evaluation/
│   └── metrics.py           # Accuracy, latency, escalation rate
├── ui/
│   └── dashboard.py         # Streamlit UI
├── data/
│   └── triage_log.csv       # Auto-created
├── requirements.txt
└── README.md
```

## Metrics Tracked

- **Accuracy**: confidence score distribution
- **Latency**: end-to-end ms per request
- **JSON failure rate**: parse failures after retry
- **Human escalation rate**: % of requests flagged needs_human
- **Injection rate**: % of inputs with detected prompt injections
- **Priority distribution**: P0/P1/P2/P3 breakdown
- **Top categories**: most common issue categories
