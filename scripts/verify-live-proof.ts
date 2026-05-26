import {
  ARC_TESTNET,
  createGuardrailsClient,
  formatUsdc,
  type HexAddress,
} from "../packages/guardrails/src/index.js";

const spendAccount = (
  process.env.SPEND_ACCOUNT_ADDRESS ??
  "0x78E7F4a3e06997D5f2EEF35db20bD85C626EC60A"
) as HexAddress;

const fromBlock = BigInt(process.env.VITE_FROM_BLOCK ?? "44090700");

const expectedTransactions = new Set([
  "0x5549b9682b76b2069d462c06aab99b0521cd75835cefab15886f031b3323f5d0",
  "0x08a950e7461c1862ea97b4e3825348e2767e27b5fdd8fc5fdd7303c65e88cfaf",
  "0x8960173ed5f6a82cb49ca44377650219ec11c9de5b9be77a9b685b844d2e6da3",
]);

async function main() {
  const rpcUrl = process.env.ARC_TESTNET_RPC_URL ?? ARC_TESTNET.rpcUrl;
  const client = createGuardrailsClient({
    accountAddress: spendAccount,
    rpcUrl,
  });

  const [state, events] = await Promise.all([
    client.state(),
    client.auditEvents({ fromBlock }),
  ]);

  console.log("Sherpa Agent live proof");
  console.log(`SpendAccount: ${spendAccount}`);
  console.log(`Spent today: ${formatUsdc(state.daySpent)} USDC`);
  console.log(`Remaining today: ${formatUsdc(state.remainingDailyCap)} USDC`);
  console.log("");

  for (const event of events) {
    console.log(
      [
        event.status.toUpperCase(),
        `${formatUsdc(event.amountBaseUnits)} USDC`,
        event.reason ?? "EXECUTED",
        event.transactionHash,
      ].join(" | "),
    );
  }

  const observed = new Set(events.map((event) => event.transactionHash));
  const missing = [...expectedTransactions].filter((tx) => !observed.has(tx));

  if (missing.length > 0) {
    throw new Error(`Missing expected proof transaction(s): ${missing.join(", ")}`);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
