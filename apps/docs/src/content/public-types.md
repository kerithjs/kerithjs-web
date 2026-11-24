# Public Types

## `KerithApp` {#61-kerithapp}

Value returned by `createApp()` when bootstrap completes.

```typescript
interface KerithApp {
  modules: RegisteredModule[];
  routes:  MountedRoute[];
  registry: KerithRegistry;
}
```

| Field | Description |
| --- | --- |
| `modules` | Array with all registered and validated modules. |
| `routes` | Array with all routes mounted on the Express app. |
| `registry` | Instance of the queryable registry. |

---

## `RegisteredModule` {#62-registeredmodule}

Public representation of a registered module.

```typescript
interface RegisteredModule {
  name:        string;
  path:        string;     // Absolute path to the module directory
  imports:     string[];   // Names of modules it depends on
  exports:     string[];   // Declared and validated export names
  controllers: string[];   // Names of mounted controllers
}
```

---

## `MountedRoute` {#63-mountedroute}

Represents an individual HTTP route mounted on Express.

```typescript
interface MountedRoute {
  method:     'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'USE';
  path:       string;
  module:     string;
  controller: string;
}
```

The `'USE'` method is used as a fallback when individual routes cannot be extracted from Express's `router.stack`.

---

## `KerithRegistry` {#64-kerithregistry}

Stable registry interface guaranteed between minor versions.

```typescript
interface KerithRegistry {
  hasModule(name: string): boolean;
  getModule(name: string): RegisteredModule | undefined;
  getAllModules(): RegisteredModule[];
  resolveAlias(alias: string): string | undefined;
  getAllAliases(): Record<string, string>;
}
```

| Method | Description |
| --- | --- |
| `hasModule(name)` | Returns `true` if a module with that name exists. |
| `getModule(name)` | Returns the module or `undefined` if not found. |
| `getAllModules()` | Returns all registered modules as an array. |
| `resolveAlias(alias)` | Returns the target path of the alias or `undefined`. |
| `getAllAliases()` | Returns all aliases as a `{ alias: path }` object. |

---

## `KerithRegistryAdvanced` {#65-advancedregistry}

Extends `KerithRegistry` with graph utilities. Marked as `@unstable` — may change between minor versions.

```typescript
interface KerithRegistryAdvanced extends KerithRegistry {
  /** @unstable */
  getDependencyGraph(): Map<string, string[]>;
  /** @unstable */
  findCircularDependencies(): string[][];
}
```

| Method | Description |
| --- | --- |
| `getDependencyGraph()` | Returns a `Map` where each key is a module name and the value is its `imports` array. |
| `findCircularDependencies()` | Runs DFS over the dependency graph and returns arrays with found cycles. Each cycle is an array of module names that form the cycle. |

---

## Registry Entries (`*Entry`) {#66-registry-entries}

These interfaces represent the internal metadata stored in the registry for each identifier type.

### `ServiceEntry`

```typescript
interface ServiceEntry {
  name:         string;
  path:         string;
  type:         'service';
  module:       string;
  description?: string;
}
```

### `RepositoryEntry`

```typescript
interface RepositoryEntry {
  name:         string;
  path:         string;
  type:         'repository';
  module:       string;
  description?: string;
  source?:      string;
}
```

### `SchemaEntry`

```typescript
interface SchemaEntry {
  name:         string;
  path:         string;
  type:         'schema';
  module:       string;
  description?: string;
  library?:     string;
}
```

### `FileEntry` (discriminated union)

```typescript
type FileEntry = ServiceEntry | RepositoryEntry | SchemaEntry;
```

---

## Logging — `LogLevel` & `LogHandler` {#67-logging}

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogHandler = (
  level:    LogLevel,
  message:  string,
  meta?:    Record<string, unknown>
) => void;
```

**Level priority:** `debug(0)` < `info(1)` < `warn(2)` < `error(3)`. Events with a level lower than the configured `logLevel` are silently discarded.

**Default handler:** writes to `process.stdout` for `info`/`debug` and to `process.stderr` for `warn`/`error`. All lines carry the `[Kerith]` prefix.

**Enable debug:** `NODE_DEBUG=kerith node src/index.js` or pass `logLevel: 'debug'` in the options.

### Custom Logger Example

```typescript
import pino from 'pino'

const logger = pino()

await createApp(app, {
  logger: (level, message, meta) => {
    logger[level]({ ...meta }, message)
  },
  logLevel: 'debug',
})
```

---

## `NitsConfig` {#68-nitsconfig}

```typescript
interface NitsConfig {
  similarityThreshold?: number;  // 0.0 to 1.0
  enabled?:             boolean;
}
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Enables or disables the NITS module identity tracking system. |
| `similarityThreshold` | `number` | Dynamic based on module size | Similarity threshold to consider a moved/renamed module as maintaining its identity. Value between `0.0` (any similarity) and `1.0` (exact identity). |

---

## `GetAliasesOptions` {#69-getaliasesoptions}

Options for the `getAliases()` function.

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
