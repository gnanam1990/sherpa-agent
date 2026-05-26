import {
  demoPaymentIntents,
  runIntentFlow,
  type IntentFlowResult,
} from "@sherpa-agent/intent";
import { createDemoPolicy, type SpendPolicy } from "@sherpa-agent/policy";

export type DryRunSummary = {
  flows: IntentFlowResult[];
  approvedCount: number;
  rejectedCount: number;
  approvedAmountBaseUnits: bigint;
  rejectedAmountBaseUnits: bigint;
};

export function buildDryRunSummary(
  policy: SpendPolicy = createDemoPolicy(),
  inputs = demoPaymentIntents,
): DryRunSummary {
  const flows = inputs.map((input) => runIntentFlow(policy, input));
  const approved = flows.filter((flow) => flow.decision.ok);
  const rejected = flows.filter((flow) => !flow.decision.ok);

  return {
    flows,
    approvedCount: approved.length,
    rejectedCount: rejected.length,
    approvedAmountBaseUnits: sumAmounts(approved),
    rejectedAmountBaseUnits: sumAmounts(rejected),
  };
}

function sumAmounts(flows: IntentFlowResult[]) {
  return flows.reduce(
    (total, flow) => total + flow.intent.amountBaseUnits,
    0n,
  );
}
