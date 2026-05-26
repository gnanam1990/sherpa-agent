import {
  applyApprovedSpend,
  evaluateSpendPolicy,
  type SpendAttempt,
  type SpendPolicy,
} from "@sherpa-agent/policy";
import {
  createAuditRecord,
  summarizeAudit,
  type AuditRecord,
  type AuditSummary,
} from "@sherpa-agent/audit";

export type SimulationResult = {
  finalPolicy: SpendPolicy;
  records: AuditRecord[];
  summary: AuditSummary;
};

export function runSpendSimulation(
  initialPolicy: SpendPolicy,
  attempts: SpendAttempt[],
): SimulationResult {
  let policy = initialPolicy;
  const records: AuditRecord[] = [];

  for (const attempt of attempts) {
    const decision = evaluateSpendPolicy(policy, attempt);
    records.push(createAuditRecord({ attempt, decision }));
    if (decision.ok) {
      policy = applyApprovedSpend(policy, attempt);
    }
  }

  return {
    finalPolicy: policy,
    records,
    summary: summarizeAudit(records),
  };
}
