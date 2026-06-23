from pydantic import BaseModel, Field, field_validator
from typing import List, Optional


class Issue(BaseModel):
    description: str
    category: str
    priority: str
    evidence: List[str] = []

    @field_validator("priority")
    @classmethod
    def valid_priority(cls, v):
        if v not in ("P0", "P1", "P2", "P3"):
            raise ValueError(f"Invalid priority: {v}")
        return v

    @field_validator("category")
    @classmethod
    def valid_category(cls, v):
        allowed = {
            "billing", "refund", "payment_failure", "technical_issue",
            "login_issue", "account_problem", "security", "fraud",
            "shipping", "complaint", "feature_request", "sales",
            "feedback", "general_question", "programming", "legal",
            "medical", "abuse", "spam", "out_of_scope", "unknown",
        }
        if v not in allowed:
            return "unknown"
        return v


class TriageResult(BaseModel):
    language: str = ""
    sentiment: str = ""
    emotion: str = ""
    summary: str = ""
    issues: List[Issue] = []
    suggested_action: str = ""
    needs_human: bool = False
    reason_for_escalation: str = ""
    missing_information: bool = False
    confidence: float = Field(ge=0.0, le=1.0, default=0.5)

    @field_validator("confidence")
    @classmethod
    def clamp(cls, v):
        return round(max(0.0, min(1.0, v)), 2)


class TriageRequest(BaseModel):
    text: str
    source: Optional[str] = "api"
