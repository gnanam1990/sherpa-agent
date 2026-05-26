# Demo Video Script

Target length: 75-90 seconds.

## 0-10 Seconds

Open with the problem:

> AI agents can now trigger payments, but operators need hard spending limits
> that cannot be bypassed at the app layer.

Show the dashboard headline and Arc Testnet badge.

## 10-25 Seconds

Show the architecture:

> Sherpa Agent gives each agent a USDC SpendAccount on Arc Testnet. The operator
> sets daily, per-transaction, and per-counterparty caps.

Show `packages/contracts/src/SpendAccount.sol`.

## 25-45 Seconds

Show the live proof:

```bash
pnpm proof:verify
```

Narrate:

> This is querying Arc Testnet. One 8 USDC spend was approved, one 60 USDC
> overrun was rejected, and one unknown vendor was rejected.

## 45-65 Seconds

Show the dashboard audit trail:

> The dashboard is connected to the deployed contract and shows both approved
> and rejected spend attempts.

Open: https://sherpa-agent-mu.vercel.app

## 65-80 Seconds

Show x402:

> The x402 module lets API/payment requirements pass through the same policy
> layer before an agent spends.

Open `packages/x402/src/guardrails.ts`.

## 80-90 Seconds

Close:

> Sherpa Agent is a corporate card for autonomous agents: real budget,
> contract-level guardrails, and public audit proof.
