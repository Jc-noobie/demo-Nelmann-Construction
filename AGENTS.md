# AGENTS.md

## Read first

- `project.md` and `spec.md` are the source of truth. Read both before coding; re-read when unsure. On conflict, stop and ask, do not guess.
- Current phase: **Phase 0 – Demo**. Mock data only, no backend, no auth, no persistence. Never add backend/auth/storage unless asked.

## Scope

- Do not invent business rules, tax rates, or legal requirements. Unknown rates = config value + `TODO(confirm with accountant)`.
- Do not add features, libraries, or fields beyond `project.md` §6 / `spec.md` without asking.
- Not an accounting or tax-filing system. No ledger, no e-filing, no BIR API.

## Commands

- `npm run dev` — Vite dev server (HMR)
- `npm run build` — production build
- `npm run lint` — eslint. **This is the only check.** No TypeScript, no test runner installed yet — do not run `npm test` or `tsc`.
- No pre-commit hooks, no CI.

## Stack constraints

- React 19 + **JavaScript (no TypeScript)**, Vite. Don't introduce TS.
- Tailwind CSS v4: CSS-first config in `src/index.css`, no `tailwind.config.js`. Via `@tailwindcss/vite` plugin.
- shadcn/ui, style `base-nova`, JS (no TSX) — see `components.json`. Icons: lucide-react.
- Path alias `@` → `src/` (set in `vite.config.js`).
- Ask before adding any new dependency (planned libs per `project.md` §11: React Router, TanStack Query/Table, React Hook Form + Zod, Recharts, date-fns, decimal.js).

## Money & data rules

- **Never use floating-point math for money.** Integer centavos or `decimal.js`. Currency: PHP. Display `₱1,234,567.89`.
- Statutory rates (VAT 12%, retention 10%, SSS/PhilHealth/Pag-IBIG/withholding) live in config (`lib/config.js`), never hardcoded in logic.
- **UI never talks to the data source directly.** Components call functions in `src/api/` (mock now, Supabase later — swap touches `api/` only).
- Business calculations (invoice totals, VAT, retention, payroll) = pure functions in `src/lib/`. No math inside components. Unit tests expected once a test runner exists.
- Invoice numbers sequential, no gaps. **Void, never delete.**

## Conventions

- Files `kebab-case.jsx`, components PascalCase, functions camelCase, DB columns snake_case (future).
- JSDoc on shared functions.
- Small, working increments. Half-built buttons not allowed — hide unbuilt features instead of faking them.
- Plain UI wording ("Sales and billing", not "Accounts receivable"; "Save invoice", "Approve payroll"). Show project name wherever money appears. Status colors: paid green, due amber, overdue red, draft gray.
- Every list needs an empty state. Forms validate on submit; totals update live while typing.

## Repo status

- Code is still the stock Vite template (`src/App.jsx` counter demo). Target structure from `project.md` §12 — `src/app/`, `src/features/`, `src/api/`, `src/data/seed.js` — not yet created.
