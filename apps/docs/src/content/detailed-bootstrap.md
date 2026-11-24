# Detailed Bootstrap Flow

The following diagram shows the complete execution flow of `createApp()` with all validation steps and possible error points.

## Flow Diagram

```
createApp(app, options)
│
├─ 0.    Is app already bootstrapped?     → DUPLICATE_BOOTSTRAP
├─ 0.5   Does package.json have type:module? → INVALID_ESM_ENV
├─ 1.    loadConfig(options)
│          options > kerith.config.ts > DEFAULTS
│
├─ 2.    fast-glob(config.modules)
│          └─ For each directory
│               ├─ Does index.ts or index.js exist?  → if not: MODULE_NOT_FOUND
│               └─ push to resolvedModules[]
│
├─ 3.    ESM Alias Activation
│          └─ @modules/<name> → dirPath (for each module)
│             + aliases from config
│
├─ 4.    import(index.ts) per module
│          └─ Module(), Service(), etc. auto-register themselves
│               Validates declared exports vs. real exports
│               → EXPORT_MISMATCH if any is missing
│
├─ 5.    Dependency Validation
│          ├─ Do all imports exist?   → MISSING_IMPORT
│          └─ (strict) Are there cycles? → CIRCULAR_DEPENDENCY
│
├─ 6.    Controller Discovery (per module)
│          └─ fast-glob(**/*.{ts,js,mts,...})
│               └─ For each file with Controller():
│                    Is export default a Router? → if not: INVALID_CONTROLLER
│
├─ 7.    Route Mounting
│          └─ app.use(prefix + ctrl.prefix, [...mws], router)
│
└─ 8.    Return KerithApp { modules, routes, registry }
          app.__kerithBootstrapped = true
```

---

## Step-by-Step Breakdown

### Step 0 — Guard Against Double Bootstrap

Kerith checks if the Express instance has `__kerithBootstrapped = true` before proceeding. This prevents hard-to-debug issues from calling `createApp()` multiple times.

```typescript
// ❌ Will throw DUPLICATE_BOOTSTRAP
const kerith1 = await createApp(app)
const kerith2 = await createApp(app)  // Same app instance!
```

### Step 0.5 — ESM Validation

Reads the `package.json` from `process.cwd()` and verifies `"type": "module"` is present. This is a hard requirement since Kerith uses ESM-native features internally.

### Step 1 — Configuration Loading

Priority order for merging:

```
createApp(app, { prefix: '/api' })     ← highest priority
  └─ kerith.config.ts/js              ← second
        └─ DEFAULTS                    ← fallback
```

Objects like `aliases` are **deep-merged**, not replaced. The `prefix` from `createApp()` options will override the file config's `prefix`.

### Step 2 — Module Resolution

```typescript
// config.modules = 'src/modules/*'
// Resolves to directories only:
[
  'src/modules/auth',
  'src/modules/notifications',
  'src/modules/users',
]
// Sorted alphabetically — this determines import/validation order
```

### Step 3 — Alias Activation

Before importing any module file, Kerith activates the ESM resolution hook so that `@modules/<name>` imports work inside module files:

```typescript
// This works during bootstrap because aliases are activated in Step 3
import { AuthService } from '@modules/auth'
```

### Step 4 — Dynamic Import

Each `index.ts/js` is dynamically imported. Side effects (calling `Module()`, `Service()`, etc.) happen at import time. After each import, Kerith validates that every symbol in `exports: []` actually exists in the module's exported namespace.

### Step 5 — Dependency Validation

Two checks are performed:

1. **MISSING_IMPORT**: Every name in `imports: []` must correspond to an actual registered module.
2. **CIRCULAR_DEPENDENCY** *(strict mode only)*: Runs DFS across the whole dependency graph.

### Step 6 — Controller Discovery

For each module directory, Kerith scans all TypeScript/JavaScript files (excluding `index.*`, `*.spec.*`, `*.test.*`, `*.d.ts`). Files that called `Controller()` during the module import must have a valid Express Router as their default export.

### Step 7 — Route Mounting

```typescript
// For each controller:
const fullPath = config.prefix + controller.prefix
app.use(fullPath, [...controller.middlewares], router)
```

Routes are extracted from `router.stack` to populate the `routes` array in the `KerithApp` result.

### Step 8 — Cleanup on Error

If any step throws:

```typescript
// Pseudo-code of internal cleanup
try {
  // ... all steps ...
} catch (err) {
  clearRegistry()        // Remove all registered modules
  clearAliasCache()      // Remove all aliases
  delete app.__kerithBootstrapped
  throw err              // Re-throw original error
}
```

This ensures no partial state is left if bootstrap fails, making retries safe.

---

## AsyncLocalStorage Context

All identification functions (`Module()`, `Service()`, etc.) use Node.js `AsyncLocalStorage` to access the active registry context. This is why they must be called during a `createApp()` execution:

```typescript
// ✅ Inside createApp() context — works
import { Module } from '@vlynk-studios/kerith-core'
Module('users', { exports: ['UserService'] })

// ❌ Outside any context — throws REGISTRY_MISSING_CONTEXT
Module('users', { exports: ['UserService'] })
```
