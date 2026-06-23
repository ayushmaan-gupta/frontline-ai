
# FRONTLINE AI – AI Decisions

## Model and Tools

* Model: Groq Llama-3.3-70B-Versatile
* Backend: FastAPI
* UI: Streamlit
* Validation: Pydantic
* Logging: CSV
* Evaluation: Pandas

## Prompt Strategy

A strong system prompt instructs the model to treat user messages as data only and return strict JSON. User instructions inside messages are never trusted.

## Reliability Measures

* Prompt injection detection using regex patterns.
* Confidence threshold for escalation.
* Retry mechanism on JSON parsing failures.
* Pydantic schema validation.
* Human escalation for uncertain outputs.

## Handling Bad Input

Garbage input, ambiguous text, and malformed messages are handled gracefully by assigning low confidence and escalating to a human reviewer.

## Cost and Latency

Average latency observed during testing was approximately 1–3 seconds per request.

Estimated token usage per message:

- Input: ~400 tokens
- Output: ~150 tokens
- Total: ~550 tokens

Development was performed using Groq free tier, so no direct API cost was incurred.

Future optimization:
Low-priority messages can be routed to smaller models to reduce latency and cost.

## Evaluation

10 messages were manually labeled and compared with model predictions.

Agreement: 7/10 (70%).

Correct classifications included billing, technical issues, login problems, multilingual input, and multi-issue extraction.

Observed failures:

* Prompt injection was classified as out_of_scope instead of spam.
* Spam advertisements were sometimes classified as out_of_scope.
* General questions and out_of_scope categories overlapped.

Average latency observed during testing was approximately 1–3 seconds per message.

## Future Improvements

* Stronger spam classification.
* Better prompt injection handling.
* Improved category boundaries.
* Use smaller models for low-priority messages to reduce cost and latency.
