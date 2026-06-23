from pathlib import Path
import pandas as pd


CSV_PATH = Path(__file__).parent.parent / "data" / "triage_log.csv"


def compute_metrics() -> dict:
    if not CSV_PATH.exists():
        return {}

    df = pd.read_csv(CSV_PATH)
    if df.empty:
        return {}

    total = len(df)
    json_failures = int((df["confidence"] == 0.0).sum())
    human_escalations = int(df["needs_human"].astype(str).str.lower().eq("true").sum())
    injections = int(df["injection_detected"].astype(str).str.lower().eq("true").sum())
    avg_latency = round(df["latency_ms"].mean(), 1)
    avg_confidence = round(df["confidence"].mean(), 3)

    priority_dist = df["priority"].value_counts().to_dict()
    category_dist = {}
    for cats in df["categories"].dropna():
        for c in str(cats).split("|"):
            category_dist[c] = category_dist.get(c, 0) + 1

    return {
        "total_requests": total,
        "json_failure_rate": round(json_failures / total, 3) if total else 0,
        "human_escalation_rate": round(human_escalations / total, 3) if total else 0,
        "injection_rate": round(injections / total, 3) if total else 0,
        "avg_latency_ms": avg_latency,
        "avg_confidence": avg_confidence,
        "priority_distribution": priority_dist,
        "top_categories": dict(sorted(category_dist.items(), key=lambda x: -x[1])[:8]),
    }
