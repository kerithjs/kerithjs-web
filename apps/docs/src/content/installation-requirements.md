# Installation & Requirements

## Environment Requirements

| Requirement | Minimum Value |
| --- | --- |
| Node.js | 20.6.0 |
| Express | 5.0.0 or higher |
| Module environment | ESM (`"type": "module"`) |

Kerith verifies the ESM environment at startup and throws `INVALID_ESM_ENV` if `"type": "module"` is missing from `package.json`.

## Installation

Install the package and its required peer dependency:

```bash
pnpm add @vlynk-studios/kerith-core
# required peerDependency
pnpm add express
```

## ESM Configuration

Your project's `package.json` must have:

```json
{
  "type": "module"
}
```

## TypeScript Configuration

A recommended `tsconfig.json` for Kerith projects:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "paths": {
      "@modules/*": ["./src/modules/*"]
    }
  },
  "include": ["src/**/*", "kerith.config.ts"]
}
```

> **Tip:** Run `pnpm exec kerith sync-tsconfig` to automatically keep `compilerOptions.paths` in sync with your Kerith module aliases.

## Quick Start

**1. Install dependencies:**

```bash
pnpm add @vlynk-studios/kerith-core express
pnpm add -D typescript @types/express
```

**2. Create `kerith.config.ts`:**

```typescript
import type { KerithConfig } from '@vlynk-studios/kerith-core'

export default {
  modules: 'src/modules/*',
  prefix:  '/api/v1',
  strict:  true,
} satisfies KerithConfig
```

**3. Create your first module:**

```bash
pnpm exec kerith create-module users
```

This generates:

```
src/modules/users/
├── index.ts
├── users.routes.ts
├── users.service.ts
├── users.repository.ts
└── users.schema.ts
```

**4. Bootstrap your Express app:**

```typescript
// src/index.ts
import express from 'express'
import { createApp, KerithError } from '@vlynk-studios/kerith-core'

const app = express()
app.use(express.json())

try {
  const kerith = await createApp(app, {
    prefix: '/api/v1',
    strict: true,
  })

  kerith.routes.forEach(r => {
    console.log(`  ${r.method.padEnd(6)} ${r.path}`)
  })

  app.listen(3000)
} catch (err) {
  if (err instanceof KerithError) {
    console.error(`[${err.code}] ${err.message}`)
    process.exit(1)
  }
  throw err
}
```

## Note on TypeScript in Production

In production, the environment generally cannot execute `.ts` files directly. Compile your config to `.js` with your build tool, or use `kerith.config.js` directly.
