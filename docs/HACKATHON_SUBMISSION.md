# Hackathon Submission

## Product

Sherpa Agent is an on-chain spend manager for autonomous AI agents. Operators
fund a SpendAccount on Arc Testnet, set daily and counterparty budgets, and let
agents transact inside hard smart-contract limits.

## Demo Links

- Repository: https://github.com/gnanam1990/sherpa-agent
- Dashboard: https://sherpa-agent-mu.vercel.app
- Live proof: `docs/LIVE_ARC_PROOF.md`
- Deployment metadata: `deployments/arc-testnet.json`
- Daily progress: `docs/DAILY_PROGRESS.md`
- Demo script: `docs/DEMO_VIDEO_SCRIPT.md`

## MVP Status

| Area | Status | Proof |
| --- | --- | --- |
| Arc Testnet contract | Done | `packages/contracts/src/SpendAccount.sol` |
| Live funded account | Done | `deployments/arc-testnet.json` |
| SDK | Done | `packages/guardrails/src/client.ts` |
| x402 guardrails | Done | `packages/x402/src/guardrails.ts` |
| Demo agent | Done | `apps/agent/src/index.ts` |
| Dashboard | Done | https://sherpa-agent-mu.vercel.app |
| Proof verifier | Done | `pnpm proof:verify` |
| Demo video | Next | `docs/DEMO_VIDEO_SCRIPT.md` |

## Live Proof

- SpendAccount: `0x78E7F4a3e06997D5f2EEF35db20bD85C626EC60A`
- Approved spend: `0x5549b9682b76b2069d462c06aab99b0521cd75835cefab15886f031b3323f5d0`
- Rejected overrun: `0x08a950e7461c1862ea97b4e3825348e2767e27b5fdd8fc5fdd7303c65e88cfaf`
- Rejected blocked vendor: `0x8960173ed5f6a82cb49ca44377650219ec11c9de5b9be77a9b685b844d2e6da3`

## Judge Flow

1. Open the dashboard and confirm the live SpendAccount address.
2. Review the approved and rejected audit events.
3. Run `pnpm proof:verify` to query the same events from Arc Testnet.
4. Inspect `packages/contracts/src/SpendAccount.sol` for hard cap enforcement.
5. Inspect `packages/x402` for payment requirement policy checks.

## Daily Form Summary

Built Sherpa Agent, an Arc Testnet and x402 spend-governance system for
autonomous AI agents. Completed a fresh GitHub repo, contract, SDK, x402 module,
demo agent, dashboard, live transaction proof, CI, runbooks, deployment metadata,
and proof verifier. Next focus is demo video, dashboard polish, and Wednesday MVP
packaging.
