---
name: Nelmann Business System
description: A monochrome, project-centric business ledger for a Philippine construction contractor.
colors:
  background: "oklch(0.99 0 0)"
  foreground: "oklch(0 0 0)"
  card: "oklch(1 0 0)"
  primary: "oklch(0 0 0)"
  primary-foreground: "oklch(1 0 0)"
  secondary: "oklch(0.94 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.44 0 0)"
  accent: "oklch(0.94 0 0)"
  destructive: "oklch(0.63 0.19 23.03)"
  border: "oklch(0.92 0 0)"
  input: "oklch(0.94 0 0)"
  ring: "oklch(0 0 0)"
  chart-1: "oklch(0.81 0.17 75.35)"
  chart-2: "oklch(0.55 0.22 264.53)"
  sidebar: "oklch(0.99 0 0)"
  sidebar-accent: "oklch(0.94 0 0)"
typography:
  display:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  panel:
    backgroundColor: "{colors.card}"
    borderColor: "{colors.border}"
    rounded: "{rounded.xl}"
    shadow: "0 1px 2px 0 hsl(0 0% 0% / 0.18)"
  nav-item-active:
    backgroundColor: "{colors.sidebar-accent}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  badge-paid:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "999px"
    padding: "2px 10px"
  badge-overdue:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.primary-foreground}"
    rounded: "999px"
    padding: "2px 10px"
---

# Design System: Nelmann Business System

## Overview

**Creative North Star: "Monochrome, sharp & quiet."**

The system is a calm, precise business ledger built on black-on-white tokens, Geist type, 0.5rem radii, and thin shadows. It stays familiar like QuickBooks for non-technical users: a left navigation rail, a top page header, comfortable panels, and dense tables. The project is the spine: every invoice, expense, and payroll row shows the project name beside the money.

The surface mode is **Operate**. Ambition shows as precision, consistency, and scanability, not decoration. There are no gradients, no decorative charts, and no hero metrics. Color reports state, never mood.

The system ships a **light and dark theme** from the same semantic tokens. Dark is not a second palette: background goes black, card and sidebar lift a step, and text flips to near-white. A two-state appearance control lives in the sidebar footer (icon-only in the narrow header) and stores the choice between visits.

## Colors

Semantic tokens only; never raw values in components. The palette lives in `src/index.css` and is exposed to Tailwind through `@theme inline`.

### Core
- **Foreground** (`oklch(0 0 0)`): primary text, table figures, active navigation marks.
- **Background** (`oklch(0.99 0 0)`): page ground.
- **Card** (`oklch(1 0 0)`): every panel surface.
- **Primary** (`oklch(0 0 0)`): paid state, approved payroll, active marks, primary actions.
- **Secondary / Muted / Accent** (`oklch(0.94 / 0.97 / 0.94 0 0)`): quiet fills for navigation, draft states, and hover rows.
- **Muted foreground** (`oklch(0.44 0 0)`): notes, captions, secondary table cells.
- **Border** (`oklch(0.92 0 0)`): panel borders and row rules.
- **Ring** (`oklch(0 0 0)`): keyboard focus, 2px with 2px offset.
- **Destructive** (`oklch(0.63 0.19 23.03)`): overdue invoices, late days, unpaid money, losses, form errors.

### Chart
- **Chart 1 amber** (`oklch(0.81 0.17 75.35)`): the small due-state dot.
- **Chart 2–5**: reserved for real charts in later phases; not decoration.
- Working charts stay monochrome: **foreground** for the primary series, **muted foreground** for the secondary series and tracks. Amber and red never become chart fills; they keep meaning due and overdue.

### Named rules

**The One Red Rule.** Red means overdue or unpaid money. A merely due liability stays ink. If red marks everything, it marks nothing.

**The State-Only Rule.** Paid is black, due is an outlined pill with an amber dot, overdue is solid red, draft is gray. Status never colorizes body text.

## Typography

**Display / Body:** Geist Variable (self-hosted via `@fontsource-variable/geist`), with Geist and sans-serif fallbacks.
**Mono:** Geist Mono / monospace for invoice numbers in notes and config references.

**Character:** One workhorse sans. Hierarchy comes from size, weight, spacing, and tabular numerals, not from a second face.

### Hierarchy
- **Page title** (600, 1.875rem/1.15, -0.025em): one per page.
- **Panel title** (600, 0.875rem/1.4): section headings inside a panel.
- **Body** (400, 0.875rem/1.5): tables, statements, notes. Prose stays under 75ch.
- **Label** (400, 0.75rem/1.4): captions, table headers, secondary notes.
- **Figure** (600, 1.5rem/1.2, tabular): the number inside a stat card.

### Named rule

**The Tabular Rule.** Every amount, percentage, invoice number, and date uses `tabular-nums` and right-aligns in numeric columns.

## Layout

A 240px left rail on desktop and a content column capped at 1180px. Dashboard is a two-column grid above 1280px: a wide working column (Position, then Profit by project) and a 360px attention column (Needs attention, then VAT). Below 1280px it stacks in that order. Below 1024px the rail becomes a horizontally scrollable top strip.

Spacing follows a 4/8/12/16/24 rhythm. Page headers sit above a hairline and carry the sample-data badge. Tables scroll horizontally inside their panel rather than widening the page. Panels use a 20px inner gutter.

## Elevation & Depth

Flat paper with one thin shadow. Panels are `card` surfaces with a 1px border, 12px radius, and the `shadow-sm` token. There is no shadow vocabulary beyond that. Depth is tonal layering, not blur.

## Shapes

- Panels: 12px radius.
- Navigation items and buttons: 6px.
- Brand mark and small markers: 6px.
- Status badges: full pill (999px).
- Borders: 1px. Ledger totals close with a 3px double rule.

## Components

### Navigation rail
- Brand block with a black square monogram, company name, and descriptor.
- Items: 16px Lucide icons at 1.8 stroke, muted text, 6px radius.
- Active: sidebar-accent fill, ink text, a 6px black square mark before the icon.
- Hover: accent fill at 60%. Focus: 2px ring.
- Every module is a working link; there are no "Soon" tags.

### Page header
- Page title, one-sentence description, optional context link, and a sample-data badge.
- Bottom hairline separates it from the content.

### Panel
- The single bordered sheet for a job. Header with title, optional description, and a right-side meta slot. Body contains rows or a table.
- Never nest a panel inside a panel.

### Stat card
- Label, large tabular figure, and a short note. Danger tone turns the figure red only for losses or unpaid amounts.

### Statement rows
- Label and note left in muted ink; amount right in ink, tabular.
- Closing total sits above a 3px double rule at 600 weight.
- An unpaid band may use a 5% destructive wash; nothing else gets a tinted wash.

### Tables
- Header: 0.75rem muted ink, right-aligned over numeric columns.
- Rows: hairline dividers, hover at 60% muted, project/client stacked in the first column.
- Footer: double rule with a 600-weight total row.
- Invoices use pills: Paid (black), Sent/Partial (outlined), Overdue (red), Draft (gray).

### Balance strip
- An 8px stacked bar on a hairline baseline. Spent is ink at 20%, profit is solid ink, a loss is red.
- Shared scale across rows so lengths compare honestly. 10px "spent / profit" labels beneath.

### Charts
- Recharts through the shadcn chart frame: horizontal bars, one shared scale, hairline grid at `border/60`, no gradients, no 3D, no rounded card floating inside the panel.
- Series use ink for the primary value and muted ink for the comparison or track. Bars are 9–16px thick with a 3px end radius.
- Compact peso labels on the axis (`₱18.5M`, `₱850k`); full peso in the tooltip. Tooltip is a `popover` surface with a `shadow-sm` edge.
- Every chart sits inside a Panel with a one-line description and closes with a note. A screen-reader table repeats the values.

### Appearance control
- Two-state segmented control, 1px border, 6px radius, `card` fill.
- Active mode inverts: foreground fill, background text. The inactive mode is muted ink and gains a muted fill on hover.
- Full-width in the sidebar footer under an "Appearance" label; icon-only and compact in the narrow header.

## Do's and Don'ts

### Do
- Show the project name beside every monetary record.
- Use tabular figures and right-align money columns.
- Label sample data on every page.
- Close totals with the double rule.
- Keep one primary action per view; hide what is not built.
- Use a chart only to compare real amounts on a shared scale; keep axes in compact pesos and tooltips in full pesos.
- Keep the same semantic tokens in light and dark; let the token values carry the theme.

### Don't
- Don't use red for anything except overdue, unpaid, losses, and errors.
- Don't add gradients, decorative charts, or drop shadows beyond `shadow-sm`.
- Don't hand a chart a raw hex, amber, or red fill; series stay ink and muted ink unless the color reports state.
- Don't hardcode a light-only color in a component; theme-specific values belong in `src/index.css`.
- Don't use a serif or display face for UI labels, buttons, or data.
- Don't invent rates; every statutory value stays in `lib/config.js` with `TODO(confirm with accountant)`.
