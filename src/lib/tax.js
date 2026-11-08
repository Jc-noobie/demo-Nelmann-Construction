import { sumCentavos } from "./money"

/**
 * VAT figures and the supporting expense/payment rows for the tax page.
 * @param {object} data seed data
 * @returns {object}
 */
export function buildTaxSummary(data) {
  const liveInvoices = data.invoices.filter(
    (invoice) => invoice.status !== "draft" && invoice.status !== "void",
  )
  const projectById = new Map(data.projects.map((project) => [project.id, project]))

  const inputRows = data.expenses
    .filter((expense) => expense.hasVatReceipt)
    .map((expense) => ({
      ...expense,
      projectName: expense.projectId
        ? projectById.get(expense.projectId)?.name ?? "Unknown project"
        : "General / overhead",
    }))
    .sort((a, b) => b.expenseDate.localeCompare(a.expenseDate))

  const withholdingRows = liveInvoices
    .flatMap((invoice) =>
      invoice.payments.map((payment) => ({
        id: `${invoice.id}-${payment.paidOn}`,
        client: projectById.get(invoice.projectId)?.client ?? "Unknown client",
        projectName: projectById.get(invoice.projectId)?.name ?? "Unknown project",
        invoiceNo: invoice.invoiceNo,
        paidOn: payment.paidOn,
        incomePayment: payment.amount,
        taxWithheld: payment.whtAmount ?? null,
      })),
    )
    .sort((a, b) => b.paidOn.localeCompare(a.paidOn))

  const outputVat = sumCentavos(liveInvoices.map((invoice) => invoice.vatAmount))
  const inputVat = sumCentavos(inputRows.map((expense) => expense.vatAmount))
  const payable = outputVat - inputVat

  return {
    periodLabel: data.company.periodLabel,
    outputVat,
    inputVat,
    payable,
    isCredit: payable < 0,
    inputRows,
    withholdingRows,
  }
}
