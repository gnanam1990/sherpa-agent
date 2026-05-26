# Security

Sherpa Agent is hackathon software running on Arc Testnet. It is not audited and
must not be used with mainnet funds.

## Current Scope

- Testnet USDC only.
- Demo wallets only.
- No custody of user private keys in the repository or dashboard.
- Contract caps are enforced before funds move.

## Do Not Commit

- `.env`
- private keys
- mnemonics
- faucet wallet backups
- production API tokens

## Reporting

Open a GitHub issue with a minimal reproduction, affected package, and expected
impact. For key exposure, rotate the key immediately before filing details.
