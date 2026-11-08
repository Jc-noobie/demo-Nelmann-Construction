import { differenceInCalendarDays, parseISO } from "date-fns"
import { percentOf, sumCentavos } from "./money"

const OVERHEAD_ID = "general-overhead"

/**
 * Status the owner sees for an invoice, derived from its payments and due date.
 * @param {object} invoice
 * @param {string} asOf ISO date the dashboard is shown for
 * @returns {"draft"|"void"|"paid"|"overdue"|"partial"|"sent"}
 */
export function deriveInvoiceStatus(invoice, asOf) {
  if (invoice.status === "draft" || invoice.status === "void") return invoice.status
  const paid = sumCentavos(invoice.payments.map((payment) => payment.amount))
  if (paid >= invoice.amountDue) return "paid"
  const daysLate = differenceInCalendarDays(parseISO(asOf), parseISO(invoice.dueDate))
  if (daysLate > 0) return "overdue"
  if (paid > 0) return "partial"
  return "sent"
}

/**
 * Amount still owed on an invoice.
 * @param {object} invoice
 * @returns {number} centavos
 */
export function invoiceOutstanding(invoice) {
  const paid = sumCentavos(invoice.payments.map((payment) => payment.amount))
  return Math.max(0, invoice.amountDue - paid)
}

/**
 * Profit per project, plus an explicit General / overhead row.
 * @param {object} data seed data
 * @returns {object[]}
 */
export function buildProjectLedger(data) {
  const rows = data.projects.map((project) => {
    const billed = sumCentavos(
      data.invoices
        .filter(
          (invoice) =>
            invoice.projectId === project.id &&
            invoice.status !== "draft" &&
            invoice.status !== "void",
        )
        .map((invoice) => invoice.subtotal),
    )
    const expenseCost = sumCentavos(
      data.expenses
        .filter((expense) => expense.projectId === project.id)
        .map((expense) => expense.amount),
    )
    const payrollCost = sumCentavos(
      data.payrollRuns.flatMap((run) =>
        run.payslips
          .filter((payslip) => payslip.projectId === project.id)
          .map((payslip) => payslip.gross),
      ),
    )
    const spent = expenseCost + payrollCost
    return {
      id: project.id,
      name: project.name,
      client: project.client,
      location: project.location,
      contractAmount: project.contractAmount,
      retentionPct: project.retentionPct,
      billed,
      billedPct: percentOf(billed, project.contractAmount),
      spent,
      profit: billed - spent,
      isOverhead: false,
    }
  })

  const overheadSpent = sumCentavos(
    data.expenses
      .filter((expense) => expense.projectId === null)
      .map((expense) => expense.amount),
  )

  rows.sort((a, b) => b.profit - a.profit)

  if (overheadSpent > 0) {
    rows.push({
      id: OVERHEAD_ID,
      name: "General / overhead",
      client: "Not charged to a project",
      location: "",
      contractAmount: 0,
      retentionPct: 0,
      billed: 0,
      billedPct: 0,
      spent: overheadSpent,
      profit: -overheadSpent,
      isOverhead: true,
    })
  }

  return rows
}

/**
 * Overdue invoices the owner should chase, most overdue first.
 * @param {object} data seed data
 * @param {string} asOf ISO date
 * @returns {object[]}
 */
export function buildAttentionList(data, asOf) {
  const projectById = new Map(data.projects.map((project) => [project.id, project]))

  return data.invoices
    .filter((invoice) => invoice.status !== "draft" && invoice.status !== "void")
    .map((invoice) => {
      const outstanding = invoiceOutstanding(invoice)
      const daysLate = differenceInCalendarDays(parseISO(asOf), parseISO(invoice.dueDate))
      const paid = invoice.amountDue - outstanding
      return {
        id: invoice.id,
        invoiceNo: invoice.invoiceNo,
        projectName: projectById.get(invoice.projectId)?.name ?? "Unknown project",
        client: projectById.get(invoice.projectId)?.client ?? "Unknown client",
        dueDate: invoice.dueDate,
        daysLate,
        outstanding,
        amountPaid: paid,
        statusLabel: paid > 0 ? "Partially paid" : "Overdue",
      }
    })
    .filter((invoice) => invoice.daysLate > 0 && invoice.outstanding > 0)
    .sort((a, b) => b.daysLate - a.daysLate)
}

/**
 * VAT figures for the period, computed from invoices and expenses.
 * @param {object} data seed data
 * @returns {{outputVat: number, inputVat: number, payable: number}}
 */
export function buildVatSummary(data) {
  const liveInvoices = data.invoices.filter(
    (invoice) => invoice.status !== "draft" && invoice.status !== "void",
  )
  const outputVat = sumCentavos(liveInvoices.map((invoice) => invoice.vatAmount))
  const inputVat = sumCentavos(
    data.expenses
      .filter((expense) => expense.hasVatReceipt)
      .map((expense) => expense.vatAmount),
  )
  return {
    outputVat,
    inputVat,
    payable: outputVat - inputVat,
  }
}

/**
 * Everything the dashboard renders, computed from the seed data.
 * @param {object} data seed data
 * @param {string} asOf ISO date the dashboard is shown for
 * @returns {object}
 */
export function buildDashboard(data, asOf) {
  const projects = buildProjectLedger(data)
  const liveInvoices = data.invoices.filter(
    (invoice) => invoice.status !== "draft" && invoice.status !== "void",
  )

  const billed = sumCentavos(projects.filter((row) => !row.isOverhead).map((row) => row.billed))
  const spent = sumCentavos(projects.map((row) => row.spent))
  const collected = sumCentavos(
    liveInvoices.flatMap((invoice) => invoice.payments.map((payment) => payment.amount)),
  )
  const unpaid = sumCentavos(
    liveInvoices.map((invoice) => invoiceOutstanding(invoice)),
  )
  const retentionHeld = sumCentavos(
    liveInvoices.map((invoice) => invoice.retentionAmount),
  )

  return {
    company: data.company,
    asOf,
    periodLabel: data.company.periodLabel,
    position: {
      billed,
      spent,
      profit: billed - spent,
      collected,
      unpaid,
      retentionHeld,
    },
    projects,
    attention: buildAttentionList(data, asOf),
    vat: buildVatSummary(data),
  }
}
