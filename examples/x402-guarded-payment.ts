import {
  createDemoPolicy,
  usdc,
} from "@sherpa-agent/policy";
import {
  encodePaymentRequiredHeader,
  guardX402Payment,
} from "@sherpa-agent/x402";

const requirement = {
  scheme: "exact" as const,
  network: "arc-testnet",
  asset: "USDC",
  amountBaseUnits: usdc("3"),
  payTo: "0x3b672B92efE7b381eaf87B7e64C90627D2776447",
  resource: "https://api.example.ai/v1/agents/research",
  description: "Premium agent research call",
};

const policy = createDemoPolicy();
const decision = guardX402Payment({ requirement, policy });

console.log("x402 payment requirement");
console.log(encodePaymentRequiredHeader(requirement));
console.log("");
console.log("Sherpa decision");
console.log(JSON.stringify(decision.decision, null, 2));
