# USERFLOW.md – Nelmann Business System (MVP)

> Source: `project.md` + `spec.md`. MVP only. No edge cases yet.
> Demo (Phase 0) = same flows, no login, user is Owner, sample data, state in memory.

---

## 1. System map

```
LOGIN -> DASHBOARD -+-> PROJECTS
                    +-> SALES AND BILLING (invoices)
                    +-> EXPENSES
                    +-> PAYROLL
                    +-> VAT AND BIR
                    +-> MASTER DATA (clients, suppliers, employees)
                    +-> SETTINGS (owner only)
```

---

## 2. Roles (real phase)

| Role | Can do |
|---|---|
| Owner | Everything: users, settings, approve payroll, void invoice |
| Accountant | View all; edit invoices, expenses, payroll, tax; approve payroll; void invoice; no user management |
| Staff | Draft invoices, expenses, payroll inputs; cannot approve payroll, void, or change settings |

```
Staff       : draft invoice, expense, payroll inputs
Accountant  : + approve payroll, void invoice, tax reports
Owner       : + users, settings
```

---

## 3. Journeys

### J0. Setup (once, before anything works)

```
Owner login
  -> Settings: company info, VAT rate, contribution tables   [TODO(confirm with accountant)]
  -> Add users + roles
  -> Add clients (VAT-registered? yes/no)
  -> Add suppliers
  -> Add employees (daily rate)
  -> Add project (client, contract amount, retention %)
  -> READY
```

### J1. Owner: "Which project makes money? Who hasn't paid?"

```
Login
  -> Dashboard (billed, spent, profit, unpaid)
  -> See profit per project + needs-attention list
  -> Click overdue invoice -> Invoice view
        or
  -> Click project -> Project detail
        (contract, billed %, costs, profit, its invoices, its expenses)
  -> Decide who to chase
```

### J2. Staff: bill a client

```
Sales and billing
  -> New invoice
  -> Pick project (client auto-fills)
  -> Add lines (progress billing)
  -> Totals live: subtotal + VAT - retention = amount due
  -> Save invoice          (status: draft)
  -> Print / PDF preview
  -> Mark as sent          (status: sent, sequential number, no gaps)
  -> [client pays]
  -> Record payment
        -> partial -> status: partial
        -> full    -> status: paid
  -> [past due date, unpaid] -> overdue (derived) -> shows on Dashboard
  -> Mistake? Owner/Accountant: Void (never delete)
```

### J3. Staff: record a cost

```
Expenses
  -> Add expense
  -> Pick project (or "General / overhead")
  -> Supplier, category, amount
  -> Tick "valid VAT receipt?"
        yes -> input VAT captured
        no  -> no input VAT
  -> Save
  -> Project profit drops, Dashboard updates
```

### J4. Payroll (daily-wage)

```
Payroll
  -> New payroll run (period start / end)
  -> Per worker: days worked, per project
  -> System computes: gross -> SSS, PhilHealth, Pag-IBIG, withholding tax -> net
  -> Review payslips            (draft: staff can edit)
  -> Accountant / Owner: Approve payroll   (status: approved, LOCKED)
        [staff cannot approve]
  -> Mark paid                  (status: paid)
  -> Payroll cost lands on each project's costs
  -> View / print payslip
```

### J5. Accountant: tax figures

```
VAT and BIR
  -> Pick quarter
  -> Output VAT   (from invoices)
     Input VAT    (from expenses with valid receipt)
     Payable      (or carry-over credit if negative)
  -> 2550Q summary preview
  -> 2307 data per client payment
  -> Accountant reviews figures
  -> Accountant files with BIR OUTSIDE the system
        (system never files)
```

---

## 4. The loop (the pitch)

```
Invoice + Expense + Payroll
        -> tag to PROJECT
        -> Dashboard profit
        -> VAT and BIR figures
```

---

## 5. Status flows

```
Invoice : draft -> sent -> partial -> paid
                      \-> overdue (derived: past due, not fully paid)
          any (before final) -> void (final)

Payroll : draft -> approved (locked) -> paid
```

---

## 6. Demo path (about 8 min)

```
Dashboard (J1)
  -> New invoice live (J2, up to Save + print preview)
  -> Add expense, watch profit change (J3)
  -> Payroll run + Approve (J4)
  -> VAT and BIR preview (J5)
  -> Close: "Everything connected. Excel can't do that."
```

---

## 7. Not in flow (on purpose)

- BIR 2303: Certificate of Registration, not a report. Do not build until confirmed.
- 1601-C: unconfirmed.
- Ledger, bank reconciliation, attendance, e-filing, Excel import, notifications, client portal.

---

## 8. Open question

- Is "Record payment" (partial + full) in MVP? `spec.md` section 11 puts partial payments in Phase 2, but `partial` / `paid` statuses and 2307 data depend on it.
- **Assumed: yes, minimal** (amount, date, method, withheld amount).
