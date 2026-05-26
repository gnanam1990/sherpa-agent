import { describe, expect, it } from "vitest";
import { buildDryRunSummary } from "./dry-run.js";

describe("demo agent dry-run summary", () => {
  it("covers approved and rejected spend paths", () => {
    const summary = buildDryRunSummary();

    expect(summary.flows).toHaveLength(3);
    expect(summary.approvedCount).toBe(1);
    expect(summary.rejectedCount).toBe(2);
    expect(summary.approvedAmountBaseUnits).toBe(8_000_000n);
    expect(summary.rejectedAmountBaseUnits).toBe(65_000_000n);
  });

  it("keeps rejection reasons visible for the demo", () => {
    const reasons = buildDryRunSummary().flows
      .filter((flow) => !flow.decision.ok)
      .map((flow) => flow.decision.reason);

    expect(reasons).toEqual([
      "PER_TX_CAP_EXCEEDED",
      "COUNTERPARTY_BLOCKED",
    ]);
  });
});
