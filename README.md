# Sherpa Agent

**Live:** https://sherpa-agent-mu.vercel.app
**Repo:** https://github.com/gnanam1990/sherpa-agent
**Proof:** `docs/LIVE_ARC_PROOF.md`

Sherpa Agent is a smart-contract-backed spend manager for autonomous AI agents.
It gives an agent a real Arc Testnet USDC budget with daily caps,
per-counterparty caps, x402-aware payment checks, and public audit logs.

## Live Arc Proof

| Item | Value |
| --- | --- |
| Chain | Arc Testnet `5042002` |
| SpendAccount | `0x78E7F4a3e06997D5f2EEF35db20bD85C626EC60A` |
| Approved spend | `0x5549b9682b76b2069d462c06aab99b0521cd75835cefab15886f031b3323f5d0` |
| Rejected overrun | `0x08a950e7461c1862ea97b4e3825348e2767e27b5fdd8fc5fdd7303c65e88cfaf` |
| Rejected blocked vendor | `0x8960173ed5f6a82cb49ca44377650219ec11c9de5b9be77a9b685b844d2e6da3` |

Verify the same proof from Arc RPC:

```bash
pnpm proof:verify
```

## Demo Loop

```text
Operator sets caps
  -> agent requests spend
  -> contract approves or rejects on Arc Testnet
  -> x402 policy layer explains payment decisions
  -> dashboard streams live audit events
```

## Sprint Target

- [x] Arc Testnet cap-accounting contract
- [x] TypeScript SDK for agent frameworks
- [x] x402 guardrail helpers
- [x] Demo agent that spends inside a cap and triggers rejections
- [x] Dashboard connected to a deployed SpendAccount
- [ ] Demo video and final launch polish

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
