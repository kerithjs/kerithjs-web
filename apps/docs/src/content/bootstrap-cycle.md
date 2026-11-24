# Bootstrap Cycle — CreateApp()

## Signature

```typescript
import { createApp } from '@vlynk-studios/kerith-core'
import express from 'express'

const app = express()
const kerith = await createApp(app, options?)
```

```typescript
function createApp(
  app: Application,
  options?: CreateAppOptions
): Promise<KerithApp>
```

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `app` | `express.Application` | The Express instance to which routes will be mounted. |
| `options` | `CreateAppOptions` | Configuration options. Merged with `kerith.config.ts` and default values. |

## Return Value

Returns a `Promise<KerithApp>` that resolves when all modules have been loaded, validated, and their routes mounted in the Express app.

## Bootstrap Steps

`createApp()` executes 8 steps in sequence inside an `AsyncLocalStorage` context. If any step fails, the registry is completely cleaned up before re-throwing the error.

### Step 0 — Double Bootstrap Prevention

If `createApp()` is called twice with the same Express instance, throws `DUPLICATE_BOOTSTRAP`.

### Step 0.5 — ESM Validation

Reads `package.json` from the working directory and checks that `"type": "module"` is present. Throws `INVALID_ESM_ENV` if missing.

### Step 1 — Configuration Loading

Calls `loadConfig(options)` which merges options in order: `options` > `kerith.config.ts/js` > `DEFAULTS`.

### Step 2 — Module Resolution

Expands the `config.modules` glob with `fast-glob` using `onlyDirectories: true`. The resulting directories are sorted alphabetically. Each one must have `index.ts` or `index.js`; otherwise throws `MODULE_NOT_FOUND`.

### Step 3 — Runtime Alias Activation

For each module directory, registers `@modules/<name>` → absolute path. Activates the ESM alias resolution hook. Updates the alias cache.

### Step 4 — Dynamic Module Import

Imports each `index.ts/js` via `import(pathToFileURL(...))`. Executing that file calls `Module()`, `Service()`, etc., which register metadata in the context. After each import, validates that the `exports` declared in `Module()` exist as real exports of the file.

### Step 5 — Dependency Validation

Checks that all names in each module's `imports` exist in the registry. In `strict` mode, detects cycles with DFS and throws `CIRCULAR_DEPENDENCY` if found.

### Step 6 — Controller Discovery

For each module, scans all `.ts/.js/.mts/.mjs/.cjs` files excluding types, specs, tests, and `index.*`. If a file called `Controller()` during import, expects its `export default` to be an Express Router; otherwise throws `INVALID_CONTROLLER`.

### Step 7 — Route Mounting

For each enabled controller, calculates the full path as `config.prefix + controller.prefix` and calls `app.use(fullPath, [...middlewares], router)`. Extracts individual routes from `router.stack` for the result.

### Step 8 — Return

Marks the Express instance with `__kerithBootstrapped = true` and returns `KerithApp`.

## Error Handling

```typescript
import { KerithError } from '@vlynk-studios/kerith-core'

try {
  const kerith = await createApp(app)
} catch (err) {
  if (err instanceof KerithError) {
    console.error(`[${err.code}] ${err.message}`)
    if (err.details) console.error('Details:', err.details)
    process.exit(1)
  }
  throw err
}
```
