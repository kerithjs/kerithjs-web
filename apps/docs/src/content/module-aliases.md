# Aliases — `getAliases()`

## Signature

```typescript
function getAliases(options?: GetAliasesOptions): Promise<Record<string, string>>
```

Returns all active aliases from the cache. Must be called **after** `createApp()` has completed, since the cache is populated during bootstrap.

---

## Auto-generated Aliases

For every discovered module, Kerith automatically generates a `@modules/<name>` alias:

| Auto-generated Alias | Points to |
| --- | --- |
| `@modules/users` | `/absolute/path/src/modules/users` |
| `@modules/auth` | `/absolute/path/src/modules/auth` |
| `@shared` | *(if configured)* folder alias path |

---

## `GetAliasesOptions`

```typescript
interface GetAliasesOptions {
  includeFolders?: boolean;  // Default: true
  absolute?:       boolean;  // Default: false
}
```

| Field | Default | Description |
| --- | --- | --- |
| `includeFolders` | `true` | If `false`, only returns auto-generated `@modules/*` aliases. Folder aliases configured in `kerith.config.ts` are excluded. |
| `absolute` | `false` | If `true`, paths in values are absolute. Default is relative to CWD in POSIX format. |

---

## Examples

### Get all aliases (relative paths)

```typescript
const aliases = await getAliases({ absolute: false })
// {
//   '@modules/users':  './src/modules/users',
//   '@modules/auth':   './src/modules/auth',
//   '@shared':         './src/shared',
// }
```

### Get all aliases (absolute paths)

```typescript
const absAliases = await getAliases({ absolute: true })
// {
//   '@modules/users':  '/home/user/project/src/modules/users',
//   '@modules/auth':   '/home/user/project/src/modules/auth',
//   '@shared':         '/home/user/project/src/shared',
// }
```

### Only module aliases (no folder aliases)

```typescript
const moduleAliases = await getAliases({ includeFolders: false })
// {
//   '@modules/users':  './src/modules/users',
//   '@modules/auth':   './src/modules/auth',
//   // '@shared' is excluded
// }
```

---

## Using Aliases in Import Statements

Once `createApp()` has run, you can use these aliases in your module files:

```typescript
// src/modules/users/users.service.ts
import { Service } from '@vlynk-studios/kerith-core'
import { NotificationService } from '@modules/notifications'  // ✅ alias works

Service('UserService', { module: 'users' })

export class UserService {
  async createUser(data: { name: string; email: string }) {
    await NotificationService.sendWelcome(data.email)
  }
}
```

---

## Integration with `kerith sync-tsconfig`

To make TypeScript/IDE aware of these aliases, run:

```bash
pnpm exec kerith sync-tsconfig
```

This updates `tsconfig.json` automatically:

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
