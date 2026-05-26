# Contributing

## Development

```bash
pnpm install
pnpm build
pnpm test
```

Contract-only checks:

```bash
pnpm contracts:build
pnpm contracts:test
```

## Commit Style

Use small, reviewable commits:

- `feat:` for product behavior
- `fix:` for bug fixes
- `docs:` for docs and runbooks
- `chore:` for tooling and metadata
- `ci:` for GitHub Actions and verification

## Branch Safety

Keep `.env` local. Use `.env.example` for public configuration names only.
