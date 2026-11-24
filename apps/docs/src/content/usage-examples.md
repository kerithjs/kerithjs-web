# Usage Examples

## Complete Entry Point

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

  kerith.routes.forEach(r => {
    console.log(`  ${r.method.padEnd(6)} ${r.path}`)
  })

  app.listen(3000, () => console.log('Server on port 3000'))
} catch (err) {
  if (err instanceof KerithError) {
    console.error(`Kerith Error [${err.code}]: ${err.message}`)
    if (err.details) console.error(err.details)
    process.exit(1)
  }
  throw err
}
```

---

## Module with Inter-Module Dependency

```typescript
// src/modules/users/index.ts
import { Module } from '@vlynk-studios/kerith-core'

Module('users', {
  imports: ['notifications'],
  exports: ['UserService'],
})

export { UserService } from './users.service.js'
```

```typescript
// src/modules/users/users.service.ts
import { Service } from '@vlynk-studios/kerith-core'
import { NotificationService } from '@modules/notifications'

Service('UserService', { module: 'users' })

export class UserService {
  async createUser(data: { name: string; email: string }) {
    // business logic...
    await NotificationService.sendWelcome(data.email)
  }
}
```

---

## Full Module Example (auth)

```typescript
// src/modules/auth/index.ts
import { Module } from '@vlynk-studios/kerith-core'

Module('auth', {
  imports: [],
  exports: ['AuthService', 'authMiddleware'],
  description: 'Authentication and authorization',
})

export { AuthService } from './auth.service.js'
export { authMiddleware } from './auth.middleware.js'
```

```typescript
// src/modules/auth/auth.routes.ts
import { Controller } from '@vlynk-studios/kerith-core'
import { Router } from 'express'
import { AuthService } from './auth.service.js'

Controller('/auth')

const router = Router()

router.post('/login', async (req, res) => {
  const token = await AuthService.login(req.body)
  res.json({ token })
})

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' })
})

export default router
```

```typescript
// src/modules/auth/auth.service.ts
import { Service } from '@vlynk-studios/kerith-core'

Service('AuthService', {
  module: 'auth',
  description: 'JWT authentication service',
})

export class AuthService {
  static async login(credentials: { email: string; password: string }) {
    // validate credentials...
    return 'jwt-token'
  }
}
```

---

## Logger Configuration with Pino

```typescript
// kerith.config.ts
import type { KerithConfig } from '@vlynk-studios/kerith-core'
import pino from 'pino'

const logger = pino()

export default {
  modules:  'src/modules/*',
  prefix:   '/api',
  logLevel: 'debug',
  logger: (level, message, meta) => {
    logger[level]({ ...meta }, message)
  },
} satisfies KerithConfig
```

---

## Using `kerith check` in CI

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  architecture:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 12.15.0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - name: Check architecture
        run: pnpm exec kerith check --strict --format json | tee architecture-report.json
      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: architecture-report
          path: architecture-report.json
```

---

## Querying the Registry at Runtime

```typescript
const { registry } = await createApp(app)

// Verify a module exists
if (registry.hasModule('payments')) {
  const mod = registry.getModule('payments')!
  console.log('Payments controllers:', mod.controllers)
}

// See all modules
registry.getAllModules().forEach(mod => {
  console.log(`${mod.name} → imports: [${mod.imports.join(', ')}]`)
})

// See registered aliases
const aliases = registry.getAllAliases()
console.log(aliases)
// { '@modules/users': '/path/src/modules/users', ... }
```

---

## Repository with Typed Queries

```typescript
// src/modules/users/users.repository.ts
import { Repository } from '@vlynk-studios/kerith-core'

Repository('UserRepository', {
  module: 'users',
  source: 'database',
  description: 'Access to the users table in PostgreSQL',
})

interface User {
  id:    string
  name:  string
  email: string
}

export class UserRepository {
  async findAll(): Promise<User[]> {
    // DB query...
    return []
  }

  async findById(id: string): Promise<User | null> {
    // DB query...
    return null
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    // DB insert...
    return { id: crypto.randomUUID(), ...data }
  }
}
```

---

## Typical Project Structure

```
my-project/
├── kerith.config.ts
├── package.json           (with "type": "module")
├── tsconfig.json
├── src/
│   ├── index.ts           (entry point)
│   ├── shared/
│   │   ├── middleware/
│   │   └── utils/
│   └── modules/
│       ├── auth/
│       │   ├── index.ts
│       │   ├── auth.routes.ts
│       │   ├── auth.service.ts
│       │   └── auth.middleware.ts
│       ├── users/
│       │   ├── index.ts
│       │   ├── users.routes.ts
│       │   ├── users.service.ts
│       │   ├── users.repository.ts
│       │   └── users.schema.ts
│       └── notifications/
│           ├── index.ts
│           └── notifications.service.ts
└── .kerith/
    └── registry.json
```
