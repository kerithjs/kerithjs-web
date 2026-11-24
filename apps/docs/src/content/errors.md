# Errors — `KerithError`

All Kerith errors are instances of `KerithError`, which extends `Error`.

```typescript
class KerithError extends Error {
  readonly name:     'KerithError';
  readonly code:     KerithErrorCode;
  readonly details?: string;

  constructor(code: KerithErrorCode, message: string, details?: string)
}
```

---

## Error Codes Reference

| Code | When it occurs |
| --- | --- |
| `MODULE_NOT_FOUND` | A glob directory has no `index.ts/js`, or the `index.ts/js` does not call `Module()`. |
| `DUPLICATE_MODULE` | Two modules have the same name, or the same directory calls `Module()` twice. |
| `MISSING_IMPORT` | A module declares in `imports` the name of another module that doesn't exist in the registry. |
| `UNDECLARED_IMPORT` | *(Only in `strict`)* A module imports from another module not in its `imports` array. |
| `CIRCULAR_DEPENDENCY` | *(Only in `strict`)* The dependency graph contains a cycle. |
| `EXPORT_MISMATCH` | A name declared in `exports` does not exist as a real export of `index.ts`. |
| `INVALID_CONTROLLER` | A file with `Controller()` does not have `export default router`, or the default is not an Express Router. Also when `Controller()` is called more than once in the same file. |
| `ALIAS_NOT_FOUND` | An alias points to a directory that doesn't exist. |
| `DUPLICATE_ALIAS` | Attempting to register an already existing alias with a different path. |
| `DUPLICATE_BOOTSTRAP` | `createApp()` is called twice with the same Express instance. |
| `REGISTRY_MISSING_CONTEXT` | An identifier (`Module()`, `Service()`, etc.) is called outside a `createApp()` context. |
| `INVALID_MODULE_DECLARATION` | `Module()` violates rules: name doesn't match folder, or was called from a file that is not `index.*`. |
| `DUPLICATE_SERVICE` | Two files call `Service()` with the same name. |
| `DUPLICATE_REPOSITORY` | Two files call `Repository()` with the same name. |
| `DUPLICATE_SCHEMA` | Two files call `Schema()` with the same name. |
| `INVALID_ESM_ENV` | The project's `package.json` does not have `"type": "module"`. |

---

## Catching Errors

### Basic Error Handling

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

### Handling Specific Error Codes

```typescript
import { KerithError } from '@vlynk-studios/kerith-core'

try {
  const kerith = await createApp(app)
} catch (err) {
  if (err instanceof KerithError) {
    switch (err.code) {
      case 'CIRCULAR_DEPENDENCY':
        console.error('Circular dependency detected!')
        console.error('Details:', err.details)
        break
      case 'INVALID_ESM_ENV':
        console.error('Add "type": "module" to your package.json')
        break
      case 'MODULE_NOT_FOUND':
        console.error(`Module not found: ${err.details}`)
        break
      default:
        console.error(`Kerith error [${err.code}]: ${err.message}`)
    }
    process.exit(1)
  }
  throw err
}
```

---

## Common Error Scenarios

### `EXPORT_MISMATCH`

Occurs when a symbol listed in `Module()` exports doesn't actually exist in the file.

```typescript
// ❌ Will throw EXPORT_MISMATCH — 'UserRepository' is not exported
Module('users', {
  exports: ['UserService', 'UserRepository'],  // UserRepository not exported!
})

export { UserService } from './users.service.js'
// Missing: export { UserRepository } from './users.repository.js'
```

```typescript
// ✅ Correct
Module('users', {
  exports: ['UserService', 'UserRepository'],
})

export { UserService } from './users.service.js'
export { UserRepository } from './users.repository.js'
```

### `CIRCULAR_DEPENDENCY`

Caught in `strict` mode when Module A imports Module B which imports Module A.

```typescript
// Module A
Module('auth', { imports: ['users'] })   // auth depends on users

// Module B
Module('users', { imports: ['auth'] })   // users depends on auth
// ❌ CIRCULAR_DEPENDENCY: auth → users → auth
```

### `INVALID_CONTROLLER`

Occurs when a file calls `Controller()` but doesn't export a default Express Router.

```typescript
// ❌ Will throw INVALID_CONTROLLER
Controller('/users')

// Missing: export default router
```

```typescript
// ✅ Correct
import { Router } from 'express'

Controller('/users')

const router = Router()
router.get('/', (req, res) => res.json({ users: [] }))

export default router  // Required!
```
