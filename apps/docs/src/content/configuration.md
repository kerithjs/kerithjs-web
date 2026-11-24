# Configuration

## Configuration File {#51-config-file}

Kerith looks for a configuration file in the working directory (`process.cwd()`). It tries to load `kerith.config.ts` first and then `kerith.config.js`.

```typescript
// kerith.config.ts
import type { KerithConfig } from '@vlynk-studios/kerith-core'

export default {
  modules: 'src/modules/*',
  prefix:  '/api/v1',
  strict:  true,
  aliases: {
    '@shared': './src/shared',
  },
} satisfies KerithConfig
```

> **Note on TypeScript in production:** In production the environment generally cannot execute `.ts` files directly. Compile the config to `.js` with your build tool or use `kerith.config.js` directly.

---

## `CreateAppOptions` {#52-createappoptions}

```typescript
interface CreateAppOptions {
  modules?:        string;
  prefix?:         string;
  aliases?:        Record<string, string>;
  strict?:         boolean;
  resolveAliases?: boolean;
  logger?:         LogHandler;
  logLevel?:       LogLevel;
  nits?:           NitsConfig;
  domains?:        string;
  shared?:         string;
}
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `modules` | `string` | `'src/modules/*'` | Glob pointing to module directories. Must match directories, not files. |
| `prefix` | `string` | `''` | Global route prefix applied to all controllers. Example: `'/api/v1'`. |
| `aliases` | `Record<string, string>` | `{}` | Additional folder aliases beyond the auto-generated `@modules/*`. Keys are the alias (e.g. `'@shared'`), values are relative or absolute paths. |
| `strict` | `boolean` | `true` in development, `false` in production | Enables circular dependency detection and warnings for undeclared imports. Automatically disabled when `NODE_ENV=production`. |
| `resolveAliases` | `boolean` | `true` | If `false`, the ESM alias resolution hook is not activated. Useful when the project resolves aliases through a bundler (esbuild, Vite, etc.). |
| `logger` | `LogHandler` | Default handler to stdout/stderr | Custom function to receive all Kerith log events. |
| `logLevel` | `LogLevel` | `'info'` | Minimum log level. Events below this level are discarded. Can activate `'debug'` with `NODE_DEBUG=kerith`. |
| `nits` | `NitsConfig` | `{ enabled: true }` | Configuration for the NITS identity tracking system. |

---

## Default Values (`DEFAULTS`) {#53-defaults}

```typescript
const DEFAULTS: ResolvedConfig = {
  modules:        'src/modules/*',
  prefix:         '',
  aliases:        {},
  strict:         process.env.NODE_ENV !== 'production',
  resolveAliases: true,
  logger:         defaultLogHandler,
  logLevel:       'info',  // or 'debug' if NODE_DEBUG includes 'kerith'
  nits: {
    enabled:             true,
    similarityThreshold: undefined  // Dynamic threshold based on module size
  }
}
```

**Merge strategy:** `options` (passed to `createApp()`) > `kerith.config.ts/js` > `DEFAULTS`. Objects like `aliases` are merged in layers, not replaced.

---

## Examples

### Minimal configuration

```typescript
// kerith.config.ts
import type { KerithConfig } from '@vlynk-studios/kerith-core'

export default {
  modules: 'src/modules/*',
} satisfies KerithConfig
```

### Full configuration with custom logger

```typescript
// kerith.config.ts
import type { KerithConfig } from '@vlynk-studios/kerith-core'
import pino from 'pino'

const logger = pino()

export default {
  modules:  'src/modules/*',
  prefix:   '/api/v1',
  strict:   true,
  logLevel: 'debug',
  aliases: {
    '@shared':   './src/shared',
    '@config':   './src/config',
  },
  logger: (level, message, meta) => {
    logger[level]({ ...meta }, message)
  },
  nits: {
    enabled:             true,
    similarityThreshold: 0.6,
  },
} satisfies KerithConfig
```

### Disabling alias resolution (for Vite/esbuild projects)

```typescript
// kerith.config.ts
import type { KerithConfig } from '@vlynk-studios/kerith-core'

export default {
  modules:        'src/modules/*',
  resolveAliases: false,  // Aliases handled by Vite
} satisfies KerithConfig
```
