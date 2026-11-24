# Module Identifiers

Module identifiers are registration functions called **at the root level** of each source file (not inside functions, classes, or conditionals). Their purpose is to register metadata in the active registry of the `createApp()` context.

---

## `Module()` {#41-module}

Declares a directory as a Kerith module. **Must be called in the `index.ts` or `index.js` file of the module directory.**

```typescript
function Module(name: string, options?: ModuleOptions): void
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Unique module name. **Must match exactly the name of the folder that contains it.** |
| `options` | `ModuleOptions` | Optional module configuration. |

### `ModuleOptions`

```typescript
interface ModuleOptions {
  imports?:     string[];   // Modules this one depends on
  exports?:     string[];   // Export names that form the public API
  description?: string;     // Description for documentation and tooling
}
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `imports` | `string[]` | `[]` | List of other module names this module uses. Kerith validates all exist in the registry. In `strict` mode, importing an undeclared module generates a warning. |
| `exports` | `string[]` | `[]` | Names of symbols exported by `index.ts` that constitute the public API. Kerith validates each name exists as a real export. Throws `EXPORT_MISMATCH` if any is missing. |
| `description` | `string` | `undefined` | Free text for documentation. Has no runtime effect. |

### Validation Rules

**Rule 1 — Name/folder match.** The `name` parameter must be identical to the folder name containing `index.ts`. If they differ, throws `INVALID_MODULE_DECLARATION`.

**Rule 2 — Index file.** `Module()` can only be called from a file named `index.ts`, `index.js`, `index.mts`, or `index.mjs`. If called from another file, throws `INVALID_MODULE_DECLARATION`.

### Example

```typescript
// src/modules/users/index.ts
import { Module } from '@vlynk-studios/kerith-core'

Module('users', {
  imports: ['notifications'],
  exports: ['UserService'],
  description: 'System user management',
})

export { UserService } from './users.service.js'
```

---

## `Controller()` {#42-controller}

Declares an Express route file as a module controller. There must be an `export default router` in the same file.

```typescript
function Controller(prefix: string, options?: ControllerOptions): void
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `prefix` | `string` | Route prefix for all routes in the router. Example: `'/users'`. |
| `options` | `ControllerOptions` | Optional controller configuration. |

### `ControllerOptions`

```typescript
interface ControllerOptions {
  middlewares?: RequestHandler[];  // Middlewares applied before the router
  enabled?:     boolean;           // If false, createApp() ignores the controller
}
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `middlewares` | `RequestHandler[]` | `[]` | Array of Express middlewares mounted **before** the router, at the `prefix` route. |
| `enabled` | `boolean` | `true` | When `false`, the controller and all its routes are completely ignored during bootstrap. |

The controller name in the registry is automatically derived from the file name (without extension). For example, `users.routes.ts` → name `users.routes`.

### Example

```typescript
// src/modules/users/users.routes.ts
import { Controller } from '@vlynk-studios/kerith-core'
import { Router } from 'express'
import { authMiddleware } from '@modules/auth'

Controller('/users', {
  middlewares: [authMiddleware],
  enabled: true,
})

const router = Router()

router.get('/', (req, res) => res.json({ users: [] }))
router.post('/', (req, res) => res.status(201).json({}))

export default router
```

---

## `Service()` {#43-service}

Declares a file as a service with business logic and registers it in the global registry.

```typescript
function Service(name: string, options?: ServiceOptions): void
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Unique service name in the registry. Example: `'UserService'`. |
| `options` | `ServiceOptions` | Optional service configuration. |

### `ServiceOptions`

```typescript
interface ServiceOptions {
  module?:      string;  // Module it belongs to
  description?: string;  // Description for tooling
}
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `module` | `string` | Name of the parent folder of the file | Name of the owning module. If omitted, inferred from the directory name containing the file. |
| `description` | `string` | `undefined` | Free text for documentation and tooling. |

If a service with the same `name` already exists in the registry, throws `DUPLICATE_SERVICE`.

### Example

```typescript
// src/modules/users/users.service.ts
import { Service } from '@vlynk-studios/kerith-core'

Service('UserService', {
  module: 'users',
  description: 'Main user management service',
})

export class UserService {
  async findAll() { /* ... */ }
  async findById(id: string) { /* ... */ }
}
```

---

## `Repository()` {#44-repository}

Declares a file as a data access repository.

```typescript
function Repository(name: string, options?: RepositoryOptions): void
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Unique repository name. Example: `'UserRepository'`. |
| `options` | `RepositoryOptions` | Optional repository configuration. |

### `RepositoryOptions`

```typescript
interface RepositoryOptions {
  module?:      string;
  description?: string;
  source?:      'database' | 'api' | 'cache' | 'file' | string;
}
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `module` | `string` | Name of the parent folder | Owning module. Inferred if omitted. |
| `description` | `string` | `undefined` | Description for tooling. |
| `source` | `string` | `undefined` | Data source type. Predefined values: `'database'`, `'api'`, `'cache'`, `'file'`. Accepts any custom string. |

If a repository with the same `name` already exists, throws `DUPLICATE_REPOSITORY`.

### Example

```typescript
// src/modules/users/users.repository.ts
import { Repository } from '@vlynk-studios/kerith-core'

Repository('UserRepository', {
  module: 'users',
  source: 'database',
  description: 'Access to the users table in PostgreSQL',
})

export class UserRepository {
  async findAll() { /* SQL queries */ }
}
```

---

## `Schema()` {#45-schema}

Declares a file as a validation schema.

```typescript
function Schema(name: string, options?: SchemaOptions): void
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Unique schema name. Example: `'CreateUserSchema'`. |
| `options` | `SchemaOptions` | Optional schema configuration. |

### `SchemaOptions`

```typescript
interface SchemaOptions {
  module?:      string;
  description?: string;
  library?:     'zod' | 'joi' | 'yup' | 'ajv' | string;
}
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `module` | `string` | Name of the parent folder | Owning module. Inferred if omitted. |
| `description` | `string` | `undefined` | Description for tooling. |
| `library` | `string` | `undefined` | Validation library used. Predefined values: `'zod'`, `'joi'`, `'yup'`, `'ajv'`. Accepts custom strings. |

If a schema with the same `name` already exists, throws `DUPLICATE_SCHEMA`.

### Example

```typescript
// src/modules/users/users.schema.ts
import { Schema } from '@vlynk-studios/kerith-core'
import { z } from 'zod'

Schema('CreateUserSchema', {
  module: 'users',
  library: 'zod',
  description: 'Schema for user creation',
})

export const CreateUserSchema = z.object({
  name:  z.string().min(1),
  email: z.string().email(),
})
```
