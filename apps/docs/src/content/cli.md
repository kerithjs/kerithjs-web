# CLI Reference

The package installs the `kerith` executable. Available at `./node_modules/.bin/kerith` or directly with `pnpm exec kerith`.

```
Usage: kerith [command] [options]
```

---

## `kerith check` {#101-kerith-check}

Analyzes the structural integrity of the project detecting architecture violations **without** needing to start the app.

```bash
kerith check [options]
```

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `--strict` | flag | `false` | Exits with code `1` if there are any violations. Useful in CI pipelines. |
| `--module <name>` | string | (all) | Filters analysis to a single module by its name. |
| `--format <format>` | `text` \| `json` | `text` | Output format. `json` returns an object with `{ domains, modules, violations }`. |
| `--no-circular` | flag | (not active) | Skips circular dependency detection. |

### Types of Violation Detected

| Type | Internal Key | Description |
| --- | --- | --- |
| **Private import** | `private-import` | A module imports an internal path of another module (more than 2 segments in `@modules/name/...`). |
| **Undeclared import** | `undeclared-import` | A module imports from another but doesn't have it in its `imports` array. |
| **Circular dependency** | `circular-dependency` | A cycle is detected in the declared dependency graph. |

### Text Output Example

```
Kerith Architecture Analysis

✔ auth [nd_a1b2c3] — OK
✗ orders — 1 problem(s)
  WARN  Undeclared import: module "orders" imports from "users" but it is not declared. (src/modules/orders/orders.service.ts:3)
         Suggestion: Add "users" to the imports array in the Module() declaration of "orders".

1 problem(s) found.
```

### JSON Output Example

```json
{
  "domains": [],
  "modules": [
    {
      "name": "orders",
      "dirPath": "/abs/path/src/modules/orders",
      "declaredImports": [],
      "actualImports": [{ "specifier": "@modules/users", "file": "...", "line": 3 }],
      "internalIdentifiers": ["OrderService"]
    }
  ],
  "violations": [
    {
      "type": "undeclared-import",
      "module": "orders",
      "message": "Undeclared import: ...",
      "suggestion": "Add \"users\" to the imports array...",
      "location": { "file": "src/modules/orders/orders.service.ts", "line": 3 }
    }
  ]
}
```

### CI Integration

```yaml
# .github/workflows/ci.yml
- name: Check architecture
  run: pnpm exec kerith check --strict --format json | tee architecture-report.json
```

---

## `kerith create-module` {#102-kerith-create-module}

Generates the scaffolding for a new Kerith module.

```bash
kerith create-module <name> [options]
```

### Arguments

| Argument | Description |
| --- | --- |
| `<name>` | Module name. Must be lowercase and contain only letters, numbers, or hyphens (`[a-z0-9-]+`). |

### Options

| Option | Description |
| --- | --- |
| `-p, --path <path>` | Destination path. Default: `src/modules/<name>`. |
| `--no-repository` | Does not generate the `<name>.repository.ts` file. |
| `--no-schema` | Does not generate the `<name>.schema.ts` file. |
| `--js` | Forces `.js` file generation. |
| `--ts` | Forces `.ts` file generation. |

If neither `--js` nor `--ts` are present, auto-detects TypeScript by checking for the presence of `tsconfig.json`.

### Generated Files

| File | Description |
| --- | --- |
| `index.ts` | Calls `Module('name', { imports: [], exports: [] })`. |
| `<name>.routes.ts` | Calls `Controller('/<name>')` and exports an empty router. |
| `<name>.service.ts` | Calls `Service('<Name>Service', { module: '<name>' })` and exports a class. |
| `<name>.repository.ts` | *(Optional)* Calls `Repository(...)` and exports a class. |
| `<name>.schema.ts` | *(Optional)* Calls `Schema(...)` with a Zod comment. |

### Example

```bash
pnpm exec kerith create-module payments --no-schema
# ✔ Module 'payments' created successfully at src/modules/payments/
#   index.ts
#   payments.routes.ts
#   payments.service.ts
#   payments.repository.ts
```

### Generated Content Preview

```typescript
// src/modules/payments/index.ts
import { Module } from '@vlynk-studios/kerith-core'

Module('payments', {
  imports: [],
  exports: [],
})
```

```typescript
// src/modules/payments/payments.routes.ts
import { Controller } from '@vlynk-studios/kerith-core'
import { Router } from 'express'

Controller('/payments')

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'payments module' })
})

export default router
```

---

## `kerith sync-tsconfig` {#103-kerith-sync-tsconfig}

Synchronizes Kerith aliases (modules and configured folders) in the `compilerOptions.paths` of `tsconfig.json`, so the IDE and TypeScript type-checker can recognize them.

```bash
kerith sync-tsconfig [options]
```

### Options

| Option | Default | Description |
| --- | --- | --- |
| `--tsconfig <path>` | `tsconfig.json` | Path to the `tsconfig.json` to update (relative to CWD). |

The command reads the Kerith configuration, generates the corresponding paths and writes them to `tsconfig.json` **preserving existing comments** (using `comment-json`). It also removes stale entries of modules that no longer exist.

### Result in `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "@modules/auth/*":  ["./src/modules/auth/*"],
      "@modules/users/*": ["./src/modules/users/*"],
      "@shared/*":        ["./src/shared/*"]
    }
  }
}
```

### Recommended Workflow

Add it to your `package.json` scripts to keep paths in sync automatically:

```json
{
  "scripts": {
    "dev":      "kerith sync-tsconfig && tsx watch src/index.ts",
    "sync":     "kerith sync-tsconfig",
    "check":    "kerith check --strict"
  }
}
```
