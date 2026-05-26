# Sherpa Agent

Sherpa Agent is a smart-contract-backed spend manager for autonomous AI agents.
It gives an agent a real Arc Testnet USDC budget with daily caps,
per-counterparty caps, x402-aware payment checks, and public audit logs.

## Demo Loop

```text
Operator sets caps
  -> agent requests spend
  -> contract approves or rejects on Arc Testnet
  -> x402 policy layer explains payment decisions
  -> dashboard streams live audit events
```

## Sprint Target

- Arc Testnet cap-accounting contract
- TypeScript SDK for agent frameworks
- x402 guardrail helpers
- Demo agent that spends inside a cap and triggers rejections
- Dashboard connected to a deployed SpendAccount

## Safety

Never commit `.env`, private keys, mnemonics, wallet backups, or faucet-funded
deployment credentials.
