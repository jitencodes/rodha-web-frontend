# Rodha Web Frontend — Agent Instructions

1. **Read** [`docs/knowledge/README.md`](docs/knowledge/README.md) before any task
2. **Follow** rules in [`.cursor/rules/`](.cursor/rules/) (always-applied + glob-scoped)
3. **Next.js 16:** This is NOT the Next.js you know. Read `node_modules/next/dist/docs/` before writing framework-specific code. Heed deprecation notices.
4. **API integration:** Follow [`.cursor/skills/api-integration/SKILL.md`](.cursor/skills/api-integration/SKILL.md) for all website API work (SSR-first, module services/mappers)
5. **After meaningful work:** update `docs/knowledge/PROGRESS.md`, `FEATURE_CHECKLIST.md`, `DECISIONS.md` (if needed), and `REUSABLE_INVENTORY.md` (if new reusables)

## Quick Links

| Need | Path |
|------|------|
| Product / phase context | `docs/knowledge/PROJECT_CONTEXT.md` |
| Phase 1 + 2 scope | `docs/knowledge/SCOPE.md` |
| Phase 1 PRD detail | `docs/PHASE1_PRD.md` |
| Design tokens analysis | `docs/UI_DESIGN_ANALYSIS.md` |
| Live progress | `docs/knowledge/PROGRESS.md` |
| Component inventory | `docs/knowledge/REUSABLE_INVENTORY.md` |
| API integration skill | `.cursor/skills/api-integration/SKILL.md` |
| Implemented tokens | `src/app/globals.css` |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
