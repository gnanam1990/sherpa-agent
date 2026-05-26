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

## Repository Layout

```text
apps/agent          Live demo agent that executes guarded spends
apps/api            Local API surface for policy, simulation, and x402 checks
apps/dashboard      Vite dashboard for live Arc Testnet audit logs
packages/contracts  Solidity SpendAccount and deployment scripts
packages/guardrails TypeScript SDK around the deployed contract
packages/policy     Deterministic spend policy evaluator
packages/x402       x402 payment requirement parser and guardrail adapter
examples            Minimal integration examples
docs                PRD, runbooks, architecture, and proof
```

## Safety

Never commit `.env`, private keys, mnemonics, wallet backups, or faucet-funded
deployment credentials.

## Local Setup

```bash
pnpm install
cp .env.example .env
pnpm wallets:demo
```

Fund the generated operator wallet from the Arc Testnet faucet, then run:

```bash
pnpm testnet:deploy
pnpm testnet:configure
pnpm testnet:fund
pnpm testnet:agent
pnpm testnet:dashboard
```

## Proof And Docs

- Product brief: `docs/PRODUCT_BRIEF.md`
- Architecture: `docs/ARCHITECTURE.md`
- x402 flow: `docs/AGENT_PAYMENT_FLOW.md`
- Arc runbook: `docs/ARC_TESTNET_RUNBOOK.md`
- Live proof: `docs/LIVE_ARC_PROOF.md`
