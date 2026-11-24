# Overview

> Current version: **1.3.1** · License: MIT · Node.js ≥ 20.6.0 · Requires ESM (`"type": "module"`)

## What is Kerith?

**Kerith** is a lightweight structural layer for Express applications written in ESM + TypeScript. Its goal is to enforce explicit modular architecture: each module declares its dependencies (`imports`) and its public API (`exports`), Kerith validates them at runtime, automatically mounts Express controllers, and exposes a queryable registry of all modules, services, repositories, and schemas in the project.

The package exports identification functions that are called **once** when each source file is imported. These calls are not decorators or TypeScript metadata — they are pure function invocations that write to a registry with async context (`AsyncLocalStorage`), managed by `createApp()`.

## Key Features

| Feature | Description |
| --- | --- |
| **Modular Architecture** | Each module explicitly declares its dependencies and public API. |
| **Runtime Validation** | Kerith validates imports, exports, and controller structure at startup. |
| **Automatic Route Mounting** | Controllers are automatically mounted to the Express app. |
| **Alias Resolution** | Generates `@modules/<name>` aliases for clean cross-module imports. |
| **Queryable Registry** | Inspect all modules, services, repositories, and schemas at runtime. |
| **CLI Tooling** | Built-in CLI for architecture checks, module scaffolding, and tsconfig sync. |
| **NITS Identity Tracking** | Persistent module identity across renames and file system moves. |

## Architecture Philosophy

Kerith is built around the idea that a project's module structure should be **explicit and validated**. By declaring what each module needs (`imports`) and what it exposes (`exports`), you get:

- **Early error detection** — structural violations are caught at bootstrap, not in production
- **Enforced boundaries** — modules cannot secretly depend on each other without declaring it  
- **Living documentation** — the registry always reflects the current state of your codebase
- **Safe refactoring** — NITS tracking ensures module identity survives moves and renames

## Quick Example

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

  console.log(`Modules loaded: ${kerith.modules.length}`)
  console.log(`Routes mounted: ${kerith.routes.length}`)

  app.listen(3000, () => console.log('Server on port 3000'))
} catch (err) {
  if (err instanceof KerithError) {
    console.error(`Kerith Error [${err.code}]: ${err.message}`)
    process.exit(1)
  }
  throw err
}
```

## Typical Project Structure

```
my-project/
├── kerith.config.ts
├── package.json           (with "type": "module")
├── tsconfig.json
├── src/
│   ├── index.ts           (entry point)
│   └── modules/
│       ├── auth/
│       │   ├── index.ts
│       │   ├── auth.routes.ts
│       │   └── auth.service.ts
│       ├── users/
│       │   ├── index.ts
│       │   ├── users.routes.ts
│       │   ├── users.service.ts
│       │   └── users.repository.ts
│       └── notifications/
│           ├── index.ts
│           └── notifications.service.ts
└── .kerith/
    └── registry.json
```
