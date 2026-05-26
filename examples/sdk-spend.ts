import {
  ARC_TESTNET,
  createGuardrailsClient,
  formatUsdc,
  type HexAddress,
} from "@sherpa-agent/guardrails";
import { privateKeyToAccount } from "viem/accounts";

const accountAddress = process.env.SPEND_ACCOUNT_ADDRESS as HexAddress;
const counterparty = process.env.COUNTERPARTY_ADDRESS as HexAddress;
const agentKey = process.env.AGENT_PRIVATE_KEY as HexAddress;

if (!accountAddress || !counterparty || !agentKey) {
  throw new Error(
    "SPEND_ACCOUNT_ADDRESS, COUNTERPARTY_ADDRESS, and AGENT_PRIVATE_KEY are required",
  );
}

const agent = privateKeyToAccount(agentKey);
const client = createGuardrailsClient({
  accountAddress,
  account: agent,
  rpcUrl: process.env.ARC_TESTNET_RPC_URL ?? ARC_TESTNET.rpcUrl,
});

const before = await client.state();
console.log(`Remaining before: ${formatUsdc(before.remainingDailyCap)} USDC`);

const result = await client.spend({
  counterparty,
  amountUsdc: "1",
  action: "example:sdk-spend",
  recordRejection: true,
});

console.log(result);
