import sys
import time
import logging
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas.triage import TriageRequest, TriageResult
from llm.claude_client import call_claude
from services.injection_detector import detect_injection
from services.storage import save_result
from evaluation.metrics import compute_metrics

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("frontline_ai")

app = FastAPI(
    title="FRONTLINE AI",
    description="Autonomous triage system — converts arbitrary input into structured decisions.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "FRONTLINE AI"}


@app.post("/triage", response_model=TriageResult)
async def triage(req: TriageRequest):
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=422, detail="Input text is required.")

    t0 = time.time()
    injection = detect_injection(req.text)
    if injection:
        logger.warning("Prompt injection detected in input")

    result = await call_claude(req.text)
    latency_ms = (time.time() - t0) * 1000

    row_id = save_result(req.text, result, injection_detected=injection, latency_ms=latency_ms)
    logger.info(
        f"[{row_id}] priority={[i.priority for i in result.issues]} "
        f"confidence={result.confidence} latency={latency_ms:.0f}ms "
        f"injection={injection}"
    )
    return result


@app.get("/metrics")
def metrics():
    return compute_metrics()


@app.get("/history")
def history(limit: int = 50):
    from services.storage import load_all
    df = load_all()
    return df.tail(limit).to_dict(orient="records")
