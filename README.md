# Next.js Boilerplate

A production-grade Next.js boilerplate with a carefully chosen, minimal toolchain. Built to scale — from solo projects to team codebases.

---

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| UI Primitives | [shadcn/ui](https://ui.shadcn.com/) |
| Toasts | [Sonner](https://sonner.emilkowal.ski/) |
| Linting & Formatting | [Ultracite](https://ultracite.ai/) |
| Git Hooks | [Lefthook](https://lefthook.dev/) |
| Commit Linting | [commitlint](https://commitlint.js.org/) |
| Dead Code Detection | [Knip](https://knip.dev/) |
| Env Validation | [@t3-oss/env-nextjs](https://env.t3.gg/) |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router — routing only
│   ├── (dashboard)/            # Route groups
│   │   └── layout.tsx
│   ├── layout.tsx              # Root layout
│   └── page.tsx
├── components/
│   ├── ui/                     # shadcn primitives — do not modify directly
│   └── shared/                 # Cross-feature composites
├── features/                   # Domain features — business logic lives here
│   └── [feature]/
│       ├── api.ts              # Raw HTTP calls
│       ├── components/         # Feature-owned components
│       └── types.ts
├── lib/
│   ├── env.ts                  # Validated environment variables
│   └── utils.ts                # Shared utilities (cn, etc.)
├── store/
│   └── ui-store.ts             # Global UI state only
└── providers/
    └── index.tsx               # Composed React providers
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/JaberHPranto/nextjs-boilerplate.git
cd nextjs-boilerplate

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
```

Fill in the required values in `.env` — the app will fail to build if any required variables are missing.

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

---

## Environment Variables

All environment variables are validated at build time via `@t3-oss/env-nextjs`. The app will not build if required variables are missing or malformed.

See `.env.example` for all required and optional variables. Add new variables to both `.env.example` and `src/lib/env.ts`.

```bash
# Server-only
NODE_ENV=development

# Client-safe (must be prefixed NEXT_PUBLIC_)
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Toolchain

### Linting & Formatting — Ultracite

This project uses [Ultracite](https://ultracite.ai/) — a zero-config, opinionated linter and formatter that replaces both ESLint and Prettier. Runs automatically on every save.

```bash
# Check for issues
pnpm ultracite check

# Auto-fix
pnpm ultracite fix
```

Formatting and lint fixes are applied on save in VS Code. See `.vscode/settings.json`.

> If your other projects use ESLint + Prettier, disable those extensions **for this workspace only** via the Extensions sidebar. They won't conflict globally.

### Git Hooks — Lefthook

[Lefthook](https://lefthook.dev/) manages git hooks. Hooks run automatically on commit — no manual setup needed after `pnpm install`.

| Hook | What it runs |
|---|---|
| `pre-commit` | Ultracite fix on staged files + TypeScript typecheck |
| `commit-msg` | commitlint |

To skip hooks in an emergency:
```bash
git commit --no-verify
```

Use sparingly.

### Commit Convention — commitlint

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

feat(auth): add login page
fix(ui): correct button alignment
chore(deps): update dependencies
docs(readme): update setup instructions
```

**Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `perf`, `revert`

**Rules:**
- Scope is required
- Subject must be lowercase
- Max 72 characters in the header

### Dead Code Detection — Knip

[Knip](https://knip.dev/) finds unused files, exports, and dependencies.

```bash
# Full report
pnpm knip

# Auto-fix safe removals
pnpm knip:fix

# Production-only audit (strictest)
pnpm knip:production
```

Run this before opening a PR. It also runs in CI.

> Don't use `ignore` to silence Knip output without understanding why something is flagged. Investigate first.

---

## Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Production build
pnpm start            # Start production server
pnpm tsc              # TypeScript typecheck (no emit)
pnpm knip             # Dead code detection
pnpm knip:fix         # Auto-fix dead code
pnpm knip:production  # Strict production audit
```

---

## VS Code

Recommended extensions are in `.vscode/extensions.json`. VS Code will prompt you to install them when you open the project.

| Extension | Purpose |
|---|---|
| `biomejs.biome` | Ultracite's underlying engine — linting + formatting on save |
| `bradlc.vscode-tailwindcss` | Tailwind IntelliSense |
| `ms-vscode.vscode-typescript-next` | Latest TypeScript features |

The workspace settings in `.vscode/settings.json` automatically disable the ESLint and Prettier extensions for this project.

---

## CI

GitHub Actions runs on every push to `main` and every pull request:

1. Lint — `ultracite check`
2. Typecheck — `tsc --noEmit`
3. Dead code — `knip`
4. Commitlint — validates commit messages in the PR range
5. Build — `next build`

All checks must pass before merging.

---

## Branches

| Branch | Purpose |
|---|---|
| `main` | Clean base — framework + toolchain only |
| `feat/data-layer` | TanStack Query + Zustand data fetching layer |

Start new projects from `main`. Cherry-pick `feat/data-layer` if your project needs a server state + client state combo.

---

## Conventions

- **Pages are thin** — `app/` files compose features, no business logic
- **Features are flat** — never nest a feature folder inside another feature
- **No `any`** — use `unknown` and narrow it
- **Named exports** everywhere except Next.js page/layout files
- **`cn()`** from `@/lib/utils` for all conditional class names
- **New shadcn components** — `pnpm dlx shadcn@latest add <component>`

---

## License

MIT