import csv
import os
import uuid
from datetime import datetime
from pathlib import Path
from schemas.triage import TriageResult

DATA_DIR = Path(__file__).parent.parent / "data"
CSV_PATH = DATA_DIR / "triage_log.csv"

HEADERS = [
    "id", "timestamp", "input_preview", "language", "sentiment", "emotion",
    "summary", "categories", "priority", "confidence", "needs_human",
    "missing_information", "suggested_action", "reason_for_escalation",
    "injection_detected", "latency_ms",
]


def _ensure_csv():
    DATA_DIR.mkdir(exist_ok=True)
    if not CSV_PATH.exists():
        with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
            csv.DictWriter(f, fieldnames=HEADERS).writeheader()


def save_result(
    input_text: str,
    result: TriageResult,
    injection_detected: bool = False,
    latency_ms: float = 0.0,
) -> str:
    _ensure_csv()
    row_id = str(uuid.uuid4())[:8]
    categories = "|".join(i.category for i in result.issues)
    priorities = [i.priority for i in result.issues]
    top_priority = min(priorities, key=lambda p: int(p[1])) if priorities else "P3"

    row = {
        "id": row_id,
        "timestamp": datetime.utcnow().isoformat(),
        "input_preview": input_text[:120].replace("\n", " "),
        "language": result.language,
        "sentiment": result.sentiment,
        "emotion": result.emotion,
        "summary": result.summary[:200],
        "categories": categories,
        "priority": top_priority,
        "confidence": result.confidence,
        "needs_human": result.needs_human,
        "missing_information": result.missing_information,
        "suggested_action": result.suggested_action,
        "reason_for_escalation": result.reason_for_escalation,
        "injection_detected": injection_detected,
        "latency_ms": round(latency_ms, 1),
    }

    with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
        csv.DictWriter(f, fieldnames=HEADERS).writerow(row)

    return row_id


def load_all():
    _ensure_csv()
    import pandas as pd
    return pd.read_csv(CSV_PATH)
