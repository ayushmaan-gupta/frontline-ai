import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

import asyncio
import pandas as pd
from llm.claude_client import call_claude

ground_truth = pd.read_csv("evaluation/ground_truth.csv")


async def evaluate():
    correct = 0

    print("\nEVALUATION RESULTS\n")

    for _, row in ground_truth.iterrows():
        message = row["message"]
        expected_category = row["category"]
        expected_priority = row["priority"]

        result = await call_claude(message)

        predicted_categories = ";".join(
            sorted(set(issue.category for issue in result.issues))
        )

        predicted_priority = (
            result.issues[0].priority if result.issues else "unknown"
        )

        category_match = expected_category == predicted_categories
        priority_match = expected_priority == predicted_priority

        if category_match and priority_match:
            correct += 1

        print("-" * 50)
        print("MESSAGE:", message)
        print("EXPECTED :", expected_category, expected_priority)
        print("PREDICTED:", predicted_categories, predicted_priority)

    total = len(ground_truth)

    print("\n" + "=" * 50)
    print(f"Agreement: {correct}/{total}")
    print("=" * 50)


asyncio.run(evaluate())