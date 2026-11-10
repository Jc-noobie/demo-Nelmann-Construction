# PROJECT.md – Nelmann Construction Business System

> This file tells any AI assistant or developer **what we are building and why**. Read it fully before writing code. For detailed screens, schema, and plan, see `spec.md`. If the two conflict, ask the human; do not guess.

---

## 1. Project name

**Nelmann Business System** (working title) – a web-based business management system for Nelmann Construction Company, a construction contractor in the Philippines.

## 2. Purpose

Replace the client's Excel-based process with one connected system that handles:

- Sales and billing (including invoice generation)
- Expenses
- Payroll
- VAT
- BIR report preparation

It should feel familiar to someone who has used **QuickBooks**: left sidebar, dashboard, simple forms, clear lists and reports. It is **not** a full accounting package.

**The core idea:** in a construction company, money moves by **project**. Every expense, payroll cost, and billing belongs to a project, so the system can answer "which project makes money, and who hasn't paid us?" This is the main advantage over generic accounting tools.

## 3. Context and current status

- The client is real and non-technical. Requirements arrived second-hand and are incomplete.
- **Current phase: Phase 0 – Demo.** A sales demo for the client, built with mock data and no backend. Purpose: persuade the client to approve the project.
- **Later phases:** real backend (Supabase), auth, real data, compliance outputs. See `spec.md` section 11.
- Assume that anything not stated here is **unknown**. Ask or leave a clearly marked `TODO`; do not invent business rules.

## 4. Target users

| Who | Description |
|---|---|
| Business owner | Wants a quick view of profit per project, unpaid invoices, and cash going out |
| Accountant / bookkeeper | Needs accurate VAT, withholding, and payroll figures to file BIR forms |
| Office staff | Encodes invoices, expenses, and payroll inputs daily |

Users are not technical. Many are comfortable with Excel and little else. Optimize for clarity over power.

## 5. User roles (real phase)

| Role | Can do |
|---|---|
| **Owner** | Everything, including approving payroll, voiding invoices, managing users, and settings |
| **Accountant** | View everything; edit invoices, expenses, payroll, tax reports; approve payroll; no user management |
| **Staff** | Create and edit invoices (draft), expenses, and payroll inputs; cannot approve payroll, void invoices, or change settings |

In the **demo**, there is no login. Treat the user as Owner.

## 6. Core features

1. **Dashboard** – billed, spent, profit, unpaid invoices, profit per project, items needing attention.
2. **Projects** – list and detail: contract amount, retention %, billed %, total costs, profit.
3. **Sales and billing** – invoices with lines, VAT, retention, amount due, statuses, and printable/PDF output.
4. **Expenses** – record costs against a project and supplier, with optional input VAT.
5. **Payroll** – daily-wage payroll runs with SSS, PhilHealth, Pag-IBIG, withholding tax, payslips.
6. **VAT and BIR** – output VAT, input VAT, VAT payable; data summaries shaped for **2550Q** and **2307**.
7. **Master data** (real phase) – clients, suppliers, employees.
8. **Auth, roles, settings** (real phase).

## 7. Business rules

Rules the system must follow. Rates and tables must be **configurable** (`lib/config.js` or `settings` table), never hardcoded in logic. Statutory rates **must be verified by the client's accountant** before real use.

**Money**
- Currency is Philippine peso (PHP, ₱). Store money as `numeric(14,2)` in the database; in JS use integer centavos or `decimal.js`. **Never use floating-point math for money.**
- Display format: `₱1,234,567.89`.

**Projects**
- Every expense, invoice, and payroll cost is linked to exactly one project (or the explicit category "General / overhead").
- Project profit = billed amount − costs charged to the project.

**Invoices**
- `subtotal` = sum of line amounts.
- `vat_amount` = subtotal × VAT rate (12%) when the client is VAT-registered.
- `retention_amount` = subtotal × project retention % (default 10%).
- `amount_due` = subtotal + vat_amount − retention_amount.
- Invoice numbers are sequential with no gaps. **Void, never delete.**
- Status: `draft` → `sent` → `partial` / `paid`; `overdue` is derived (past due date and not fully paid); `void` is final.

**Expenses**
- Input VAT is recorded only when the expense is marked as backed by a valid VAT receipt.

**Payroll**
- Gross pay = daily rate × days worked (overtime and holiday premiums come later).
- Deductions: SSS, PhilHealth, Pag-IBIG, withholding tax on compensation. Net = gross − employee deductions.
- Employer shares are also tracked (needed for remittances).
- Payroll runs: `draft` → `approved` → `paid`. Only Owner or Accountant can approve. An approved run cannot be edited.

**VAT**
- Output VAT = VAT on invoices in the period. Input VAT = VAT on qualified expenses in the period. VAT payable = output − input (negative means carry-over credit).

**BIR**
- The system **prepares figures**; it does **not** file with BIR. The accountant reviews and files.
- Forms in scope for preparation: 2550Q (quarterly VAT), 2307 (creditable withholding certificate), possibly 1601-C (monthly withholding on compensation). **"BIR 2303" was mentioned by the client; that is the Certificate of Registration, not a report. Do not build anything for 2303 until confirmed.**

## 8. Important limitations

- **Not an accounting system.** No chart of accounts, journal entries, general ledger, or bank reconciliation.
- **Not a tax filing tool.** No e-filing, no BIR integration.
- **Statutory values may be wrong or outdated.** Treat every rate and table as a config value to verify.
- **Requirements are incomplete.** Do not add features, fields, or workflows beyond what is listed without asking.
- **Demo data is fake.** Every demo screen must make clear that data is sample data.
- **Phase 0 has no backend, auth, or persistence.** State lives in memory and resets on reload.
- Desktop and tablet first; phone support is nice to have.
- English UI only for now.

## 9. Non-MVP features (do not build now)

- Double-entry ledger, bank reconciliation, financial statements
- Inventory, purchase orders, equipment and fleet tracking
- Attendance, biometrics, timesheet apps
- E-filing or API integration with BIR, SSS, PhilHealth, Pag-IBIG
- Multi-company or multi-currency
- Mobile app, offline mode
- Email or SMS notifications (Phase 2 at the earliest)
- Client portal
- AI features
- Advanced reporting and Excel import/export (planned for later phases)

## 10. Success criteria

**Phase 0 – Demo**
- Client sees the full flow in about 8 minutes: dashboard → create invoice → add expense → payroll → VAT/BIR.
- Numbers on the dashboard and VAT screens are **computed from the data**, so adding an invoice or expense changes them live.
- No broken buttons. Anything not built is hidden, not faked.
- Client agrees to move to a requirements meeting.

**MVP (real system)**
- Staff can issue a correct invoice (VAT, retention, sequential number) in under 2 minutes.
- Payroll for a period is computed with no spreadsheet, and the accountant confirms figures match their own calculation.
- The accountant confirms VAT figures match their records for a sample quarter.
- All data is secured with login, roles, and row-level security.
- Client stops using Excel for these workflows.

## 11. Tech stack

| Layer | Choice |
|---|---|
| Frontend | React + **JavaScript** (no TypeScript), Vite |
| Styling | Tailwind CSS |
| Components | shadcn/ui (primary); other libraries only when shadcn lacks it |
| Routing | React Router |
| Data fetching | TanStack Query |
| Tables | TanStack Table |
| Forms | React Hook Form + Zod |
| Charts | Recharts (via shadcn chart) |
| Icons | lucide-react |
| Dates | date-fns |
| Money | `decimal.js` or integer centavos |
| Backend (Phase 1+) | Supabase (Postgres, Auth, RLS, Storage). **Neon vs Supabase decision is open;** default to Supabase. |

## 12. Architecture and conventions

```
src/
  app/            routes, layout, providers
  components/ui/  shadcn components
  features/       dashboard, projects, invoices, expenses, payroll, tax
  lib/            money.js, tax.js, payroll.js, config.js
  api/            one file per feature; mock/ and supabase/ implementations
  data/seed.js    fake demo data
```

- **UI never talks to the data source directly.** Components call functions in `api/`. Swapping mock for Supabase changes `api/` only.
- Business calculations (invoice totals, VAT, payroll) are **pure functions** in `lib/`, with unit tests. No calculations inside components.
- One feature folder per module; keep components small.
- Use JSDoc on shared functions to describe inputs and outputs.
- File names: `kebab-case.jsx`; components `PascalCase`; functions `camelCase`; DB columns `snake_case`.

## 13. UI and UX guidelines

- QuickBooks-like: left sidebar, top bar with company name, content area.
- Plain, non-technical wording: "Sales and billing", not "Accounts receivable". Sentence case. Action buttons say what they do ("Save invoice", "Approve payroll").
- Show the project name wherever money appears.
- Status badges: paid (green), due (amber), overdue (red), draft (gray).
- Every list needs an empty state that tells the user what to do next.
- Forms validate on submit with clear messages. Totals update live as the user types.
- Accessible: visible keyboard focus, sufficient contrast, labels on inputs.
- Looks professional and calm. This is a business tool for a construction firm, not a flashy app.

## 14. Glossary

| Term | Meaning |
|---|---|
| Project | A construction job; the spine of all financial data |
| Client | Who we bill |
| Progress billing | Invoice for work done in a period, usually a % of contract |
| Retention | Percentage of billing the client holds until project completion |
| Output VAT | VAT charged on our sales |
| Input VAT | VAT paid on purchases that can be credited |
| Payroll run | One pay period computed for all workers |
| Payslip | One worker's result in a payroll run |
| 2550Q | BIR quarterly VAT return |
| 2307 | BIR certificate of creditable tax withheld at source |
| 1601-C | BIR monthly remittance of tax withheld on compensation |
| 2303 | BIR Certificate of Registration (not a report; see section 7) |
| SSS / PhilHealth / Pag-IBIG | Mandatory contributions deducted from wages |

## 15. Instructions for AI assistants

1. Read this file and `spec.md` before coding. Re-read when unsure.
2. **Stay in scope.** If a feature is not in sections 6 or the spec, ask before adding it.
3. **Do not invent** business rules, tax rates, or legal requirements. Use config values and mark unknowns with `TODO(confirm with accountant)`.
4. Keep money math safe: no floats.
5. Keep UI free of direct data access; use `api/`.
6. Write pure calculation functions with tests for: invoice totals, VAT, retention, payroll deductions.
7. Use JavaScript, Tailwind, and shadcn components as listed. Ask before adding a new library.
8. Prefer small, working increments. Do not leave half-built buttons.
9. In Phase 0, never add a backend, auth, or persistence unless asked.
10. If requirements conflict or are unclear, stop and ask the human with a specific question.

## 16. Definition of done (any feature)

- Works with seed data and updates dashboards where relevant.
- Calculations covered by tests.
- No console errors; empty and error states handled.
- Uses glossary terms consistently.
- Accessible and responsive to tablet width.
- No hardcoded rates or secrets.

## 17. Open questions

1. Which BIR forms exactly? (2307, 2550Q, 1601-C?)
2. Are all clients VAT-registered? Any VAT-exempt or zero-rated sales?
3. How is billing done: progress billing, milestones, lump sum? Standard retention %?
4. Payroll: daily-wage only, or monthly staff too? Pay period? How is attendance tracked?
5. Who are the users, and what should each role see or approve?
6. Neon or Supabase for the backend?
7. Volume: number of projects, employees, invoices per month; how much history to migrate?
8. Does an external accountant file their taxes?
9. Budget and go-live date.
