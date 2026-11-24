# Registry — `getRegistry()`

## Signature

```typescript
function getRegistry(): KerithRegistryAdvanced
```

Returns the registry instance active in the current async context. Must be called within code that executes in the context of `createApp()`. Marked as `@unstable`.

---

## Usage

The preferred way to access the registry is through the object returned by `createApp()`, which implements the stable `KerithRegistry` interface:

```typescript
const { registry } = await createApp(app)
```

Use `getRegistry()` only when you need to access the registry from deep within the bootstrap context.

---

## `KerithRegistry` — Stable API

```typescript
interface KerithRegistry {
  hasModule(name: string): boolean;
  getModule(name: string): RegisteredModule | undefined;
  getAllModules(): RegisteredModule[];
  resolveAlias(alias: string): string | undefined;
  getAllAliases(): Record<string, string>;
}
```

### Examples

```typescript
const { registry } = await createApp(app)

// Check if a module exists
registry.hasModule('users')  // true

// Get a specific module
const mod = registry.getModule('users')
console.log('Module controllers:', mod?.controllers)

// Get all modules
registry.getAllModules().forEach(mod => {
  console.log(`${mod.name} → imports: [${mod.imports.join(', ')}]`)
})

// Resolve an alias
const path = registry.resolveAlias('@modules/users')

// Get all registered aliases
const aliases = registry.getAllAliases()
console.log(aliases)
// { '@modules/users': '/path/src/modules/users', ... }
```

---

## `KerithRegistryAdvanced` — Unstable API

Extends the base registry with graph utilities. These methods may change between minor versions.

```typescript
interface KerithRegistryAdvanced extends KerithRegistry {
  /** @unstable */
  getDependencyGraph(): Map<string, string[]>;
  /** @unstable */
  findCircularDependencies(): string[][];
}
```

```typescript
const registry = getRegistry()

// View the dependency graph
const graph = registry.getDependencyGraph()
// Map { 'users' => ['notifications'], 'auth' => [], ... }

// Manually detect cycles
const cycles = registry.findCircularDependencies()
// [['auth', 'users', 'auth'], ...] or []
```

---

## Runtime Registry Inspection

This is useful for debugging, health checks, or generating documentation from live state:

```typescript
const { registry } = await createApp(app)

// Verify a module exists before using it
if (registry.hasModule('payments')) {
  const mod = registry.getModule('payments')!
  console.log('Payments controllers:', mod.controllers)
  console.log('Payments dependencies:', mod.imports)
  console.log('Payments public API:', mod.exports)
}

// Log all registered modules
registry.getAllModules().forEach(mod => {
  console.log(`
Module: ${mod.name}
  Path: ${mod.path}
  Imports: ${mod.imports.join(', ') || 'none'}
  Exports: ${mod.exports.join(', ') || 'none'}
  Controllers: ${mod.controllers.join(', ') || 'none'}
  `)
})
```

---

## Express Health Route Integration

```typescript
const { registry } = await createApp(app)

// Expose registry as a health/info endpoint
app.get('/api/health/modules', (req, res) => {
  res.json({
    modules: registry.getAllModules().map(m => ({
      name:        m.name,
      controllers: m.controllers,
      imports:     m.imports,
    })),
  })
})
```
