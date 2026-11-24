# NITS — Module Identity System

**NITS (Native Identity Tracking System)** is a persistent identity tracking mechanism for modules. Its function is to maintain stable IDs for each module over time, even when modules are moved or renamed.

---

## How It Works

On each run of `kerith check`, NITS reads the registry persisted in `.kerith/registry.json`, compares the current state of the project with the previous registry, and runs a three-step reconciliation process:

### Step 1 — Match by Exact Path

If the module's relative path has not changed, the same ID is reused.

### Step 2 — Match by Identity Similarity

If the path changed but the module's "internal identifiers" (names of declared services, repositories, schemas) are sufficiently similar to the previous registry, it is considered the same moved/renamed module and the ID is preserved.

### Step 3 — New Modules

Modules that don't match by any criterion receive a new randomly generated ID (`nd_xxxxxxxx`).

---

## Conflict Curation

If during reconciliation two modules are found to have the same ID (can occur due to merge conflicts in the registry file), NITS generates a new ID for the conflicting one and reports the number of curated conflicts in the `kerith check` output.

---

## Registry Format (`.kerith/registry.json`)

```json
{
  "version": "1.0.0",
  "modules": {
    "users": {
      "id": "nd_a1b2c3d4",
      "path": "src/modules/users",
      "identifiers": ["UserService", "UserRepository", "CreateUserSchema"]
    },
    "auth": {
      "id": "nd_e5f6g7h8",
      "path": "src/modules/auth",
      "identifiers": ["AuthService"]
    }
  }
}
```

> **Important:** This file should be in version control (not in `.gitignore`) so that identity tracking is effective across developers.

---

## Configuration

```typescript
await createApp(app, {
  nits: {
    enabled:             true,
    similarityThreshold: 0.6,  // 60% minimum similarity for match
  }
})
```

### `NitsConfig`

```typescript
interface NitsConfig {
  similarityThreshold?: number;  // 0.0 to 1.0
  enabled?:             boolean;
}
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Enables or disables the NITS identity tracking system. |
| `similarityThreshold` | `number` | Dynamic based on module size | Similarity threshold to consider a moved/renamed module as maintaining its identity. Value between `0.0` (any similarity) and `1.0` (exact identity). |

### Disabling NITS

```typescript
await createApp(app, {
  nits: { enabled: false }
})
```

---

## Why Identity Tracking Matters

Without NITS, every module rename or move would lose its history in CI reports, analytics tools, and architecture changelogs. With NITS:

| Scenario | Without NITS | With NITS |
| --- | --- | --- |
| Rename `users` → `accounts` | New ID assigned, history lost | Same ID preserved |
| Move `modules/auth` → `modules/identity/auth` | New ID assigned | Same ID if identifiers match |
| Merge conflict in registry | Unpredictable IDs | Auto-curated, reported |

---

## Output in `kerith check`

When NITS is active, `kerith check` reports module IDs in its output:

```
Kerith Architecture Analysis

✔ auth [nd_e5f6g7h8] — OK
✔ users [nd_a1b2c3d4] — OK
✔ notifications [nd_x9y8z7w6] — OK

All modules passed. 0 problem(s) found.
```

The ID in brackets (`[nd_xxxx]`) is the persistent identity assigned by NITS. This ID remains stable even after renames and moves.

---

## `.gitignore` Recommendation

Do **not** add `.kerith/registry.json` to `.gitignore`:

```gitignore
# ✅ Track this file — it maintains module identity history
# .kerith/registry.json

# ✅ These are safe to ignore (build artifacts)
.kerith/cache/
```
