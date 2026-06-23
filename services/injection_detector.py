import re
import logging

logger = logging.getLogger(__name__)

INJECTION_PATTERNS = [
    r"ignore\s+(previous|all|prior)\s+instructions",
    r"forget\s+(everything|your\s+instructions)",
    r"you\s+are\s+now\s+(?!a\s+customer)",
    r"new\s+instructions?:",
    r"override\s+(your\s+)?(instructions?|system)",
    r"jailbreak",
    r"dan\s+mode",
    r"output\s+p[0-3]\b",
    r"approve\s+refund",
    r"delete\s+(records?|data|files?)",
    r"act\s+as\s+(root|admin|superuser)",
]

_COMPILED = [re.compile(p, re.IGNORECASE) for p in INJECTION_PATTERNS]


def detect_injection(text: str) -> bool:
    for pattern in _COMPILED:
        if pattern.search(text):
            logger.warning(f"Injection detected: pattern={pattern.pattern!r}")
            return True
    return False
