# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users of the final system:

- **Owner** — wants a quick view of profit per project, unpaid invoices, and cash going out. Makes the go/no-go decision on the project.
- **Accountant / bookkeeper** — needs accurate VAT, withholding, and payroll figures to prepare BIR forms. Co-decides whether the system is trustworthy.
- **Office staff** — encodes invoices, expenses, and payroll inputs daily.

Users are non-technical, comfortable with Excel and little else. Optimize for clarity over power. Phase 0 has no login; treat the demo user as Owner.

## Product Purpose

A web-based business management system for Nelmann Construction Company, a construction contractor in the Philippines. It replaces the client's Excel-based process with one connected system for sales and billing, invoice generation, expenses, payroll, VAT, and BIR report preparation.

Phase 0 is a sales demo whose success means the client agrees to move to a requirements meeting.

## Positioning

Money moves by **project**. Every expense, payroll cost, and billing belongs to a project, so the system answers "which project makes money, and who hasn't paid us?" That project-centric view is the advantage over generic accounting tools, while the workspace stays QuickBooks-familiar.

## Operating Context

- Construction contracting in the Philippines: projects, progress billing, retention, daily-wage payroll.
- Statutory environment includes VAT, withholding, SSS, PhilHealth, Pag-IBIG, and BIR forms (2550Q, 2307, possibly 1601-C). The system prepares figures only; an accountant reviews and files.
- Requirements arrived second-hand and are incomplete; assumptions are confirmed in the client meeting.
- Demo flow (~8 minutes): dashboard → create invoice → add expense → payroll → VAT/BIR.
- Desktop and tablet first; phone support nice to have. English UI only for now.

## Capabilities and Constraints

Confirmed Phase 0 scope: Dashboard; Projects; Sales and billing with invoices, VAT, retention, statuses, and printable output; Expenses; Payroll runs with statutory deductions and payslips; VAT and BIR summaries (2550Q, 2307).

Constraints:

- Phase 0 is mock only — no backend, auth, or persistence; state resets on reload.
- Not an accounting system (no chart of accounts, ledger, or bank reconciliation) and not a tax-filing tool.
- Currency PHP (₱1,234,567.89); money never uses floating-point math.
- Invoice numbers sequential with no gaps; void, never delete.
- Statutory rates live in config and must be verified with the client's accountant before real use.
- Do not add features, fields, or workflows beyond `project.md` §6 / `spec.md` without asking.
- Open: exact BIR forms, VAT-registration coverage, billing method and standard retention %, payroll pay period and attendance source, backend (Neon vs Supabase), data volume, hosting, budget, go-live date.

## Brand Commitments

The company name "Nelmann Construction" is established. A brand reportedly exists but its assets are unknown to the team, so work starts clean with no logo, wordmark, tagline, or colors to preserve. Tone: professional and calm; plain, non-technical wording.

## Evidence on Hand

No real Excel files, sample invoices, or payslips are available. All demo data is fabricated and must be labeled as sample data. Do not fabricate testimonials, customers, benchmarks, pricing, or compliance claims. The only trusted inputs are `project.md` and `spec.md`.

## Product Principles

1. **Project is the spine.** Every financial record belongs to a project (or explicit overhead), and every money view shows the project name.
2. **Clarity over power.** Non-technical users must understand every screen without accounting jargon.
3. **Connected numbers.** Dashboard and tax figures are computed from the data, never typed in, so changes propagate visibly.
4. **No faking.** Anything not built is hidden, not stubbed; demo data is always labeled sample.
5. **Compliance is prepared, not performed.** The app produces figures for the accountant to review and file.

## Accessibility & Inclusion

Visible keyboard focus, sufficient contrast, and labeled inputs are required. UI is responsive down to tablet width.
