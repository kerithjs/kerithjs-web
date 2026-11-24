# Kerith Docs

Official documentation for [Kerith](https://github.com/kerithjs/kerith) — a TypeScript/ESM framework for Node.js/Express focused on structural discipline, static auditability, and a deterministic bootstrap pipeline.

Built with **Vite + React + TypeScript**, using a custom design system.

## Stack

- **Vite** — build tool and dev server
- **React + TypeScript** — UI
- **Custom design system** — Void/Carbon/Obsidian palette, Berkeley Mono + Inter Variable typography, zero border-radius, no box shadows, Acid Lime accent

## Structure

The information architecture (sections, pages, in-page anchors) lives in `docs-manifest.ts`, which serves as the single source of truth for site navigation.

```
src/
├── layouts/       # DocsLayout, Navbar, Sidebar
├── pages/         # Home, NotFound (404), content pages
├── docs-manifest.ts
└── ...
```

## Development

This app is part of the pnpm workspace. The pnpm version is declared in the repository root, and all dependencies are locked in the root `pnpm-lock.yaml`.

```bash
pnpm install        # Run once from the repository root
pnpm dev:docs       # Run from the repository root
```

## Build

```bash
pnpm build          # Build all workspace apps from the repository root
```

## Contributing

This project is under active development. Style and structural changes must respect the existing design system — any visual modification should be explicit, not incidental.

## License

[MIT](LICENSE)

---

Part of the [Kerith](https://github.com/kerithjs) ecosystem — maintained by [Vlynk Studios](https://github.com/kerithjs).
