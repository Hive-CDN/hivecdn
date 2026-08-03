# Contributing to HiveCDN

## Setup

```bash
git clone https://github.com/Hive-CDN/hivecdn.git
cd hivecdn
node --version   # requires >= 18
npm install
npm run build
```

## Structure

| Package | npm | Description |
|---------|-----|-------------|
| `packages/sdk` | `@hivecdn/sdk` | Node.js + browser client |
| `packages/cli` | `@hivecdn/cli` | CLI tool (`hcdn`) |

## Branching

```
main        ← stable, protected
dev         ← integration
feature/*   ← your work
```

Always branch from `dev`, PR back to `dev`.

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(sdk): add prefix-based cache purge
fix(cli): handle missing zone flag gracefully
docs: update quickstart example
```

## Tests

```bash
npm test                  # run all
npm test -- --watch       # watch mode
npm test -- --coverage    # with coverage
```

Target ≥ 90% coverage on new SDK code.

## Security

Email **security@hivecdn.xyz** — do not open public issues for vulnerabilities.
