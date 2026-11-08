import { differenceInCalendarDays, parseISO } from "date-fns"
import { deriveInvoiceStatus, invoiceOutstanding } from "./dashboard"
import { sumCentavos } from "./money"

const STATUS_LABELS = {
  draft: "Draft",
  sent: "Sent",
  partial: "Partially paid",
  paid: "Paid",
  overdue: "Overdue",
  void: "Void",
}

/**
 * Invoice rows with the project and client attached, newest first.
 * @param {object} data seed data
 * @param {string} asOf ISO date the list is shown for
 * @returns {object[]}
 */
export function buildInvoiceRows(data, asOf) {
  const projectById = new Map(data.projects.map((project) => [project.id, project]))

  return data.invoices
    .map((invoice) => {
      const project = projectById.get(invoice.projectId)
      const status = deriveInvoiceStatus(invoice, asOf)
      const paid = sumCentavos(invoice.payments.map((payment) => payment.amount))

      return {
        ...invoice,
        projectName: project?.name ?? "Unknown project",
        client: project?.client ?? "Unknown client",
        status,
        statusLabel: STATUS_LABELS[status] ?? status,
        paid,
        outstanding: invoiceOutstanding(invoice),
        daysLate: differenceInCalendarDays(parseISO(asOf), parseISO(invoice.dueDate)),
      }
    })
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
}

/**
 * Billed, collected, outstanding, and overdue counts across live invoices.
 * @param {object[]} invoices rows from buildInvoiceRows
 * @returns {object}
 */
export function buildInvoiceTotals(invoices) {
  const live = invoices.filter((invoice) => invoice.status !== "draft" && invoice.status !== "void")
  const drafted = invoices.filter((invoice) => invoice.status === "draft")
  return {
    billed: sumCentavos(live.map((invoice) => invoice.subtotal)),
    collected: sumCentavos(live.map((invoice) => invoice.paid)),
    outstanding: sumCentavos(live.map((invoice) => invoice.outstanding)),
    overdueCount: live.filter((invoice) => invoice.status === "overdue").length,
    draftCount: drafted.length,
  }
}
