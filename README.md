# KerithJS Web

Web applications in the KerithJS pnpm workspace.

## Workspace

| App | Path | Purpose |
| --- | --- | --- |
| Docs | `apps/docs` | Kerith documentation site |
| Landing | `apps/landing` | Kerith landing page |

## Requirements

- Node.js `>=20.19.0`
- pnpm `12.15.0` (managed through the root `packageManager` field)

## Setup

Install dependencies once from the repository root:

```bash
pnpm install
```

## Development

Run an app's Vite development server:

```bash
pnpm dev:docs
pnpm dev:landing
```

## Quality checks

These commands run in each workspace app that defines the corresponding script:

```bash
pnpm build
pnpm lint
```

## Managing dependencies

Add a dependency to the app that uses it:

```bash
pnpm --filter docs add <package>
pnpm --filter landing add <package>
```

The root `pnpm-lock.yaml` is the single source of truth for workspace dependencies.
