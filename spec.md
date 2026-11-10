# Nelmann Construction – Business System: Spec and Plan

Status: Draft v1 · Owner: dev team (2 devs) · Demo deadline: tomorrow

---

## 1. Purpose

Nelmann Construction Company runs its business in Excel. They want one system for payroll, expenses, sales, billing, VAT, BIR reporting, and invoice generation, working "like QuickBooks".

**This document covers two things:**
1. **Demo (Phase 0)**: due tomorrow. Goal is only to make the client say yes to the project. Mock data is fine.
2. **Real system (Phase 1+)**: what we build after they accept. Included so the demo is built on the right foundations and does not get thrown away.

### Success criteria for the demo
- Client sees their own world: projects, progress billing, daily-wage payroll, VAT.
- Client sees a clear "Excel → one system" story in under 10 minutes.
- Nothing breaks live. Every button on screen either works or is hidden.

### Non-goals (for now)
- Full double-entry accounting (chart of accounts, journal entries, bank reconciliation)
- Inventory, equipment tracking, attendance or biometrics
- Mobile app, e-filing integration with BIR

---

## 2. What we know and don't know

Requirements came second-hand through IT. The client is not technical. Treat everything below as **assumptions to confirm** in the meeting.

| Topic | Known | Unknown / to confirm |
|---|---|---|
| Modules | Payroll, expenses, sales, billing, VAT, BIR forms, invoice generation | Exact BIR forms wanted |
| "2303 BIR" | Said by client via IT | BIR Form 2303 is the **Certificate of Registration**, not a report. Likely meant: **2307** (creditable withholding certificate), **2550Q** (quarterly VAT return), or **1601-C** (monthly withholding on compensation) |
| Reference product | "Works like QuickBooks" | Which QuickBooks features they actually use |
| Users | Owner and team | Who approves payroll, who issues invoices, number of users |
| Data | They use Excel | Sample files unavailable, so demo uses fake data |

---

## 3. Domain glossary (draft)

Use these terms consistently in UI, code, and DB.

- **Project**: a construction job. Every cost and every billing belongs to one.
- **Client**: who we bill (owner of a project).
- **Contract amount**: agreed total price of a project.
- **Progress billing**: invoice for work completed so far in a period, usually a % of the contract amount.
- **Retention**: percentage of each billing held back by the client until project completion (commonly 10%).
- **Invoice**: billing document sent to a client. Has lines, VAT, retention, amount due.
- **Payment**: money received against an invoice. An invoice can have partial payments.
- **Expense**: money spent, charged to a Project, optionally with a Supplier and VAT.
- **Supplier**: who we buy from.
- **Employee / Worker**: person paid by payroll. Daily-wage or monthly.
- **Payroll run**: one pay period computed for all workers.
- **Payslip**: one worker's result inside a payroll run.
- **Output VAT**: VAT charged on our sales.
- **Input VAT**: VAT paid on our purchases that can be credited.
- **2550Q / 2307 / 1601-C**: BIR forms, see section 2.

---

## 4. Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React + JavaScript, Vite | JS only (no TS). Use JSDoc on shared helpers for editor hints |
| Styling | Tailwind CSS | |
| Components | shadcn/ui | Button, Card, Table, Dialog, Sheet, Form, Select, Tabs, Badge, Sidebar, Chart, Sonner toast |
| Routing | React Router | |
| Data fetching | TanStack Query | Wrap every data call in a function so mock → Supabase swap is one file |
| Tables | TanStack Table | via shadcn data-table pattern |
| Forms | React Hook Form + Zod | Zod for validation even in JS |
| Charts | Recharts (shadcn chart) | |
| Icons | lucide-react | |
| Dates | date-fns | |
| Money math | `decimal.js` or integer centavos | **Never use raw floats for money** |
| Invoice PDF | Print stylesheet first; `@react-pdf/renderer` later | Print CSS is enough for demo |
| Backend | Supabase (recommended) | See decision below |

### Decision needed: Neon or Supabase?
"Neon Supabase" in the request is ambiguous. Both are hosted Postgres.
- **Supabase** = Postgres + auth + row-level security + file storage + realtime + auto API. One product covers the whole backend.
- **Neon** = Postgres only. You would add your own auth, API, and storage.

**Recommendation: Supabase alone.** It removes the need to write a backend for a small team. Pick Neon only if the client or team requires it, in which case add a thin API (e.g., Node + Express) and separate auth.

**For tomorrow's demo: no backend.** Use mock data in code. Add Supabase after the client says yes.

---

## 5. Architecture

```
src/
  app/            routes, layout, providers
  components/ui/  shadcn components
  features/
    dashboard/
    projects/
    invoices/
    expenses/
    payroll/
    tax/
  lib/
    money.js      money helpers and formatting (PHP)
    tax.js        VAT and withholding calculators
    payroll.js    contribution and net-pay calculators
    config.js     rates, tables (editable, not hardcoded in logic)
  api/            one file per feature, same function signatures
    mock/         in-memory data for demo
    supabase/     real implementation later
  data/seed.js    fake demo data
```

Rule: UI never imports mock data or Supabase directly. It calls `api/*`. Swapping backend later changes `api/index.js` only.

---

## 6. Data model (target, Postgres)

Money columns: `numeric(14,2)`. All tables have `id uuid`, `created_at`, `created_by`.

```sql
clients(id, name, tin, address)
projects(id, client_id, name, location, contract_amount, retention_pct default 10,
         status, start_date, end_date)
suppliers(id, name, tin, address)

invoices(id, project_id, client_id, invoice_no unique, issue_date, due_date,
         description, subtotal, vat_amount, retention_amount, amount_due,
         status)            -- draft | sent | partial | paid | overdue | void
invoice_lines(id, invoice_id, description, qty, unit, unit_price, amount)
payments(id, invoice_id, paid_on, amount, method, reference, wht_amount)

expenses(id, project_id, supplier_id, expense_date, category, description,
         amount, vat_amount, receipt_url)

employees(id, name, role, pay_type, rate, tin, sss_no, philhealth_no, pagibig_no)
payroll_runs(id, period_start, period_end, status)  -- draft | approved | paid
payslips(id, payroll_run_id, employee_id, project_id, days_worked, gross,
         sss, philhealth, pagibig, withholding_tax, other_deductions, net)

settings(key, value)        -- VAT rate, contribution tables, company info
```

VAT periods and BIR summaries are **computed views**, not stored tables.

**Security (real phase):** Supabase Auth, row-level security on every table, roles: `owner`, `accountant`, `staff`. Only `owner` and `accountant` approve payroll.

---

## 7. Business rules

All rates live in `lib/config.js` / `settings` so they can change without code changes. **Verify every rate with their accountant before going live.** Values below are the expected ones as of the spec date and must be re-checked.

### Invoice
- `subtotal` = sum of lines
- `vat_amount` = subtotal × 12% (if client is VAT-registered)
- `retention_amount` = subtotal × project retention % (default 10%)
- `amount_due` = subtotal + vat − retention
- Invoice numbers sequential, no gaps (BIR requirement). Void instead of delete.
- Status: becomes `partial` / `paid` from payments; `overdue` if past due date and unpaid.

### Expenses
- Always linked to a project (or the category "General / overhead").
- Input VAT captured only when a valid VAT receipt exists (checkbox).

### Payroll (daily-wage focus)
- Gross = daily rate × days worked (plus overtime later).
- Deductions: SSS, PhilHealth, Pag-IBIG, withholding tax on compensation.
- Expected rules (config, verify): SSS employee share about 5% of monthly salary credit within a min/max bracket; PhilHealth premium 5% split 50/50 with a floor and ceiling; Pag-IBIG 2% up to a salary cap; withholding tax from the TRAIN tax table.
- Employer shares tracked too (needed for remittance reports).
- Net pay = gross − all employee deductions.
- Payroll cost is allocated to a project (days per project).

### VAT and BIR
- Output VAT = sum of VAT on invoices in the period.
- Input VAT = sum of VAT on qualified expenses in the period.
- VAT payable = output − input (carry-over credit if negative).
- Quarterly summary shaped to fit the 2550Q fields.
- 2307 data per client payment: income payment, tax withheld, period.
- **Never claim the app files with BIR.** It prepares figures. Accountant reviews and files.

---

## 8. Screens

| # | Screen | Key content | Demo | Real |
|---|---|---|---|---|
| 1 | Dashboard | KPI cards (billed, spent, profit, unpaid), profit per project, needs-attention list | ✔ | ✔ |
| 2 | Projects | List, detail page with contract, billed %, costs, profit | ✔ | ✔ |
| 3 | Sales and billing | Invoice list, filters, status badges | ✔ | ✔ |
| 4 | New / view invoice | Form with lines, live totals, preview, print / PDF | ✔ | ✔ |
| 5 | Expenses | List, add dialog, filter by project | ✔ | ✔ |
| 6 | Payroll | Run table, computed deductions, payslip view | ✔ | ✔ |
| 7 | VAT and BIR | Output / input / payable, 2550Q summary, 2307 generator | ✔ | ✔ |
| 8 | Employees, clients, suppliers | CRUD | – | ✔ |
| 9 | Settings | Company info, rates, users | – | ✔ |
| 10 | Login, roles | Supabase Auth | – | ✔ |

Layout: left sidebar (QuickBooks-like), top bar with company name and user, content area. Responsive down to tablet; mobile acceptable but not a priority.

---

## 9. Demo plan (tomorrow)

### Scope: **mock only, no backend, no auth**
Hard-code a "logged in" user. All data from `data/seed.js`. State kept in memory with TanStack Query so adding an invoice or expense visibly updates dashboards during the demo.

### Seed data (realistic, clearly marked as sample)
- 4 projects, e.g. Warehouse Building – Laguna, Residential Units – Cavite, Road Widening – Batangas, Office Fit-out – Makati
- 5 to 8 invoices in mixed statuses (paid, due, overdue)
- 8 to 12 expenses across projects and categories
- 6 workers, one payroll run
- VAT figures derived from the data above, not typed in

### Must-work interactions
1. Dashboard numbers come from the data (not hardcoded), so adding an invoice changes them.
2. Create invoice: pick project, add lines, totals update live, save, appears in list, print preview.
3. Add expense: dialog, saves, appears in list, project profit drops.
4. Payroll: run shows computed deductions; "Approve" changes status.
5. VAT and BIR: figures reflect the invoices and expenses; buttons show a generated summary preview.

### Demo script (about 8 minutes)
1. **Owner story** (2 min): Dashboard. "Which project makes money? Who hasn't paid?"
2. **Billing** (2 min): create an invoice live, show retention and VAT computed.
3. **Costs** (1 min): add an expense, watch profit change.
4. **Payroll** (2 min): run with deductions. "No more formulas."
5. **Accountant story** (1 min): VAT and BIR from the same data.
6. **Close**: "Everything you saw is connected. Excel can't do that." Ask what is missing for them.

### Demo risks
- Fake numbers presented as real: label "Sample data" in the UI footer.
- Live-demo bugs: rehearse the exact script; keep a recorded screen capture as backup.
- Promising features not built: keep a "Later" list ready (section 11).

---

## 10. Work split (2 developers, 1 day)

| Block | Dev A | Dev B |
|---|---|---|
| Setup (together, 1 h) | Vite, Tailwind, shadcn, router, layout shell, `lib/money.js`, seed data | same |
| Core | Dashboard, Projects, Sales and billing, invoice form and print | Expenses, Payroll (`lib/payroll.js`), VAT and BIR (`lib/tax.js`) |
| Integration | Shared mock `api/`, connect dashboards to live data | Same, plus polish tables and forms |
| Final (2 h) | Rehearse script together, fix bugs, empty states, "sample data" label | |

Agree up front on: money representation, `seed.js` shape, `api/` function names. Mismatch here is the biggest time sink.

---

## 11. Roadmap after "yes"

**Phase 1: Foundation (2 to 3 weeks)**
- Meeting with owner and accountant to confirm requirements, BIR forms, and which reports matter
- Get real Excel files; import tool for projects, employees, past invoices
- Supabase: schema, auth, roles, RLS, storage for receipts
- Replace `api/mock` with `api/supabase`

**Phase 2: Core modules**
- Full CRUD for clients, suppliers, employees
- Payments and partial payment tracking, aging report
- Payroll with attendance input, overtime, 13th month, payslip PDF
- Invoice PDF, email sending

**Phase 3: Compliance and reporting**
- 2550Q, 2307, 1601-C data outputs validated by accountant
- Audit trail, void/credit-note flow, period locking
- Project profit reports, exports to Excel

**Later / maybe**: bank reconciliation, double-entry ledger, mobile capture of receipts, attendance integration.

---

## 12. Open questions for the client meeting

1. Which BIR forms exactly? (Clarify "2303": 2307, 2550Q, 1601-C?)
2. Are all clients VAT-registered? Any VAT-exempt or zero-rated sales?
3. How do you bill: progress billing, milestones, lump sum? Standard retention %?
4. Payroll: daily-wage only or also monthly staff? Weekly or semi-monthly? How is attendance tracked now?
5. Who uses the system and what can each person see or approve?
6. How many projects and employees at once? How much history to migrate?
7. Do you already use accounting software or an external accountant? Who files taxes?
8. Hosting and data: any preference, any compliance concern about cloud storage?
9. Budget range and desired go-live date.

---

## 13. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Requirements unclear, second-hand | Build wrong thing | Confirm in meeting; keep demo scope small; get Excel samples |
| Wrong statutory rates | Wrong payroll / tax | Rates in config; accountant sign-off before go-live |
| Scope creep ("like QuickBooks") | Never finishes | Define "QuickBooks-like" as UX and key workflows, not full accounting |
| Neon vs Supabase unresolved | Rework | Decide before Phase 1; `api/` layer isolates the backend |
| Float money errors | Wrong totals | Integer centavos or `decimal.js` from the first commit |
| Demo day bugs | Lose client | Rehearse; screen-recording backup |
