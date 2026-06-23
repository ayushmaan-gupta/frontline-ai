const pptxgen = require("pptxgenjs");

const C = {
  navy:    "1E2761",
  ice:     "CADCFC",
  white:   "FFFFFF",
  p0:      "991B1B",
  p0bg:    "FEE2E2",
  p1:      "92400E",
  p1bg:    "FEF3C7",
  p2:      "1E40AF",
  p2bg:    "DBEAFE",
  p3:      "166534",
  p3bg:    "DCFCE7",
  muted:   "64748B",
  light:   "F1F5F9",
  border:  "CBD5E1",
  accent:  "3B82F6",
};

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "FRONTLINE AI — Production Triage System";

// ── Slide 1: Title ──────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("FRONTLINE AI", {
    x: 0.6, y: 1.4, w: 8.8, h: 0.9,
    fontSize: 52, fontFace: "Arial", bold: true,
    color: C.white, charSpacing: 6,
  });

  s.addText("Production Triage System", {
    x: 0.6, y: 2.4, w: 8.8, h: 0.5,
    fontSize: 22, fontFace: "Arial",
    color: C.ice,
  });

  s.addText("FastAPI · Pydantic · Streamlit · Claude Sonnet 4.6", {
    x: 0.6, y: 3.1, w: 8.8, h: 0.4,
    fontSize: 13, fontFace: "Arial",
    color: C.muted,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.4, w: 8.8, h: 0.65,
    fill: { color: C.white, transparency: 90 },
    line: { color: C.white, transparency: 70, width: 0.5 },
  });

  s.addText("Converts arbitrary unstructured input into structured decisions that software and humans can trust.", {
    x: 0.75, y: 4.45, w: 8.6, h: 0.55,
    fontSize: 12, fontFace: "Arial",
    color: C.ice, italic: true,
  });
}

// ── Slide 2: Pipeline Architecture ──────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Pipeline Architecture", {
    x: 0.5, y: 0.25, w: 9, h: 0.55,
    fontSize: 28, fontFace: "Arial", bold: true,
    color: C.navy,
  });

  const steps = [
    { label: "Input", sub: "Any format", color: C.navy },
    { label: "Injection\nDetector", sub: "Pattern match", color: "374151" },
    { label: "Claude\nSonnet 4.6", sub: "LLM classify", color: C.accent },
    { label: "Pydantic\nValidator", sub: "Schema check", color: "0F766E" },
    { label: "Storage\n& Metrics", sub: "CSV + eval", color: "7C3AED" },
    { label: "API &\nDashboard", sub: "Output", color: C.navy },
  ];

  const boxW = 1.35, boxH = 0.9, startX = 0.35, y = 1.5, gap = 0.2;

  steps.forEach((st, i) => {
    const x = startX + i * (boxW + gap);

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: boxW, h: boxH,
      fill: { color: st.color },
      rectRadius: 0.08,
      shadow: { type: "outer", color: "000000", blur: 5, offset: 2, angle: 45, opacity: 0.12 },
    });

    s.addText(st.label, {
      x: x + 0.05, y: y + 0.06, w: boxW - 0.1, h: 0.52,
      fontSize: 11, fontFace: "Arial", bold: true,
      color: C.white, align: "center", valign: "middle", margin: 0,
    });

    s.addText(st.sub, {
      x: x + 0.05, y: y + 0.58, w: boxW - 0.1, h: 0.28,
      fontSize: 9, fontFace: "Arial",
      color: C.ice, align: "center", margin: 0,
    });

    if (i < steps.length - 1) {
      const arrowX = x + boxW + 0.03;
      s.addShape(pres.shapes.LINE, {
        x: arrowX, y: y + boxH / 2, w: gap - 0.04, h: 0,
        line: { color: C.border, width: 1.5 },
      });
      s.addText("▶", {
        x: arrowX + gap - 0.18, y: y + boxH / 2 - 0.1, w: 0.2, h: 0.2,
        fontSize: 9, color: C.muted, align: "center", margin: 0,
      });
    }
  });

  // Detail cards below
  const details = [
    { title: "Injection Detector", body: "Regex patterns catch \"ignore previous instructions\", \"output P0\", and 8 other attack vectors before the LLM ever sees them." },
    { title: "LLM + Retry", body: "Calls Claude Sonnet 4.6 with the FRONTLINE system prompt. On JSON parse failure, retries once with a stricter prompt. Falls back gracefully." },
    { title: "Pydantic Validation", body: "Enforces schema, validates priority (P0–P3) and category against the allowed list. Clamps confidence to [0.0–1.0]." },
    { title: "Evaluation Metrics", body: "Tracks accuracy, latency, JSON failure rate, human escalation rate, injection rate, priority distribution, and top categories." },
  ];

  details.forEach((d, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 4.75, y2 = 2.8 + row * 1.35;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: y2, w: 4.5, h: 1.2,
      fill: { color: C.light },
      line: { color: C.border, width: 0.5 },
      rectRadius: 0.06,
    });

    s.addText(d.title, {
      x: x + 0.15, y: y2 + 0.1, w: 4.2, h: 0.28,
      fontSize: 11, fontFace: "Arial", bold: true,
      color: C.navy, margin: 0,
    });

    s.addText(d.body, {
      x: x + 0.15, y: y2 + 0.38, w: 4.2, h: 0.72,
      fontSize: 10, fontFace: "Arial",
      color: C.muted, margin: 0,
    });
  });
}

// ── Slide 3: Priority & Category System ─────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Priority & Classification Rules", {
    x: 0.5, y: 0.25, w: 9, h: 0.55,
    fontSize: 28, fontFace: "Arial", bold: true,
    color: C.navy,
  });

  const priorities = [
    { p: "P0", label: "Critical", examples: "Security incident · Fraud · Data leak · Outage · Safety risk", bg: C.p0bg, fg: C.p0 },
    { p: "P1", label: "Major", examples: "Billing error · App blocking issue · Login failure", bg: C.p1bg, fg: C.p1 },
    { p: "P2", label: "Standard", examples: "Regular support · Shipping delay · Feature broken", bg: C.p2bg, fg: C.p2 },
    { p: "P3", label: "Minor", examples: "Feedback · Feature request · General inquiry", bg: C.p3bg, fg: C.p3 },
  ];

  priorities.forEach((p, i) => {
    const y = 1.0 + i * 0.95;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 1.0, h: 0.72,
      fill: { color: p.bg },
      line: { color: p.fg, width: 1 },
      rectRadius: 0.06,
    });

    s.addText(p.p, {
      x: 0.5, y: y + 0.04, w: 1.0, h: 0.38,
      fontSize: 20, fontFace: "Arial", bold: true,
      color: p.fg, align: "center", margin: 0,
    });

    s.addText(p.label, {
      x: 0.5, y: y + 0.42, w: 1.0, h: 0.25,
      fontSize: 9, fontFace: "Arial",
      color: p.fg, align: "center", margin: 0,
    });

    s.addText(p.examples, {
      x: 1.65, y: y + 0.18, w: 3.8, h: 0.36,
      fontSize: 11, fontFace: "Arial",
      color: "374151", margin: 0,
    });
  });

  // Categories grid
  s.addText("21 Allowed Categories", {
    x: 5.6, y: 0.9, w: 4.2, h: 0.35,
    fontSize: 14, fontFace: "Arial", bold: true,
    color: C.navy,
  });

  const cats = [
    "billing", "refund", "payment_failure",
    "technical_issue", "login_issue", "account_problem",
    "security", "fraud", "shipping",
    "complaint", "feature_request", "sales",
    "feedback", "general_question", "programming",
    "legal", "medical", "abuse",
    "spam", "out_of_scope", "unknown",
  ];

  cats.forEach((c, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 5.6 + col * 1.42, y = 1.35 + row * 0.52;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 1.32, h: 0.38,
      fill: { color: C.light },
      line: { color: C.border, width: 0.5 },
      rectRadius: 0.04,
    });

    s.addText(c, {
      x, y, w: 1.32, h: 0.38,
      fontSize: 8.5, fontFace: "Courier New",
      color: "374151", align: "center", valign: "middle", margin: 0,
    });
  });
}

// ── Slide 4: Key Features ─────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Key Features", {
    x: 0.5, y: 0.25, w: 9, h: 0.55,
    fontSize: 28, fontFace: "Arial", bold: true,
    color: C.navy,
  });

  const features = [
    { title: "Multi-language Support", body: "Auto-detects English, Hindi, Hinglish, Gujarati, French, Spanish, Arabic, Chinese, programming languages, and mixed-language inputs. Summaries always in English." },
    { title: "Prompt Injection Defense", body: "Detects 10 injection patterns before the LLM call. Injected instructions are logged, flagged, and treated as data — never executed." },
    { title: "Multi-issue Splitting", body: "\"My order never arrived and the app crashes\" becomes two independent issues: Shipping (P2) + Technical Issue (P1) — each routed separately." },
    { title: "Graceful Failure", body: "Corrupted input, garbage text, and empty strings never crash the system. They return category=unknown, priority=P2, needs_human=true." },
    { title: "Confidence-gated Escalation", body: "Confidence < 0.70 automatically sets needs_human=true. Prevents low-confidence decisions from reaching automated workflows." },
    { title: "Full Audit Trail", body: "Every request logged to CSV with ID, timestamp, latency, injection flag, confidence, and priority. Download from the Streamlit dashboard." },
  ];

  features.forEach((f, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 4.75, y = 1.0 + row * 1.4;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 4.5, h: 1.25,
      fill: { color: C.light },
      line: { color: C.border, width: 0.5 },
      rectRadius: 0.08,
      shadow: { type: "outer", color: "000000", blur: 4, offset: 1, angle: 45, opacity: 0.08 },
    });

    s.addText(f.title, {
      x: x + 0.15, y: y + 0.1, w: 4.2, h: 0.3,
      fontSize: 12, fontFace: "Arial", bold: true,
      color: C.navy, margin: 0,
    });

    s.addText(f.body, {
      x: x + 0.15, y: y + 0.42, w: 4.2, h: 0.72,
      fontSize: 10, fontFace: "Arial",
      color: C.muted, margin: 0,
    });
  });
}

// ── Slide 5: Output Schema ────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("Output Schema", {
    x: 0.5, y: 0.25, w: 5, h: 0.55,
    fontSize: 28, fontFace: "Arial", bold: true,
    color: C.white,
  });

  s.addText("Every field present in every response. No hallucinated facts.", {
    x: 0.5, y: 0.82, w: 5, h: 0.35,
    fontSize: 12, fontFace: "Arial",
    color: C.ice, italic: true,
  });

  const schemaCode = `{
  "language":             "English",
  "sentiment":            "negative",
  "emotion":              "frustration",
  "summary":              "Customer reports billing error and crash.",
  "issues": [
    {
      "description":      "Duplicate charge",
      "category":         "billing",
      "priority":         "P1",
      "evidence":         ["charged twice"]
    }
  ],
  "suggested_action":     "technical_investigation",
  "needs_human":          false,
  "reason_for_escalation":"",
  "missing_information":  false,
  "confidence":           0.94
}`;

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.2, w: 5.4, h: 4.1,
    fill: { color: "0F172A" },
    line: { color: "1E293B", width: 0.5 },
    rectRadius: 0.08,
  });

  s.addText(schemaCode, {
    x: 0.55, y: 1.3, w: 5.1, h: 3.9,
    fontSize: 8.5, fontFace: "Courier New",
    color: "94A3B8", valign: "top", margin: 0,
  });

  // Side annotations
  const annotations = [
    { y: 1.4, label: "Auto-detected language" },
    { y: 1.7, label: "negative / positive / neutral" },
    { y: 2.0, label: "anger / frustration / urgency / neutral" },
    { y: 2.3, label: "Always in English" },
    { y: 2.75, label: "One entry per independent issue" },
    { y: 3.4, label: "P0 / P1 / P2 / P3" },
    { y: 3.7, label: "Phrases verbatim from input only" },
    { y: 4.2, label: "Auto-set if confidence < 0.70" },
    { y: 4.8, label: "0.0 – 1.0 — triggers escalation if < 0.70" },
  ];

  annotations.forEach(a => {
    s.addShape(pres.shapes.LINE, {
      x: 5.82, y: a.y + 0.05, w: 0.35, h: 0,
      line: { color: "334155", width: 0.5 },
    });
    s.addText(a.label, {
      x: 6.2, y: a.y, w: 3.5, h: 0.28,
      fontSize: 9.5, fontFace: "Arial",
      color: C.ice, valign: "middle", margin: 0,
    });
  });
}

// ── Slide 6: File Structure & Setup ──────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Project Structure & Setup", {
    x: 0.5, y: 0.25, w: 9, h: 0.55,
    fontSize: 28, fontFace: "Arial", bold: true,
    color: C.navy,
  });

  const tree = `frontline_ai/
├── app/
│   └── main.py              FastAPI app + endpoints
├── llm/
│   └── claude_client.py     Claude API + retry logic
├── schemas/
│   └── triage.py            Pydantic models + validators
├── services/
│   ├── injection_detector.py  Pattern-based injection guard
│   └── storage.py           CSV persistence layer
├── evaluation/
│   └── metrics.py           Latency, accuracy, escalation rate
├── ui/
│   └── dashboard.py         Streamlit dashboard
├── data/
│   └── triage_log.csv       Auto-created on first request
└── requirements.txt`;

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 0.9, w: 5.2, h: 4.45,
    fill: { color: C.light },
    line: { color: C.border, width: 0.5 },
    rectRadius: 0.08,
  });

  s.addText(tree, {
    x: 0.55, y: 0.98, w: 4.9, h: 4.3,
    fontSize: 9, fontFace: "Courier New",
    color: "1E293B", valign: "top", margin: 0,
  });

  // Setup commands
  const cmds = [
    { label: "Install dependencies", cmd: "pip install -r requirements.txt" },
    { label: "Set API key", cmd: "export ANTHROPIC_API_KEY=sk-ant-..." },
    { label: "Start FastAPI", cmd: "uvicorn app.main:app --reload --port 8000" },
    { label: "Start Streamlit", cmd: "streamlit run ui/dashboard.py" },
    { label: "API docs", cmd: "http://localhost:8000/docs" },
  ];

  cmds.forEach((c, i) => {
    const y = 1.0 + i * 0.78;

    s.addText(c.label, {
      x: 5.85, y, w: 3.8, h: 0.3,
      fontSize: 10, fontFace: "Arial", bold: true,
      color: C.navy, margin: 0,
    });

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 5.85, y: y + 0.3, w: 3.8, h: 0.36,
      fill: { color: "0F172A" },
      line: { color: "1E293B", width: 0.5 },
      rectRadius: 0.05,
    });

    s.addText(c.cmd, {
      x: 6.0, y: y + 0.32, w: 3.5, h: 0.32,
      fontSize: 9, fontFace: "Courier New",
      color: "94A3B8", valign: "middle", margin: 0,
    });
  });
}

// ── Write file ───────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "/home/claude/frontline_ai_overview.pptx" })
  .then(() => console.log("Done: /home/claude/frontline_ai_overview.pptx"))
  .catch(e => { console.error(e); process.exit(1); });
