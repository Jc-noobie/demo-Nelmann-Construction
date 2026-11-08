import { buildProjectLedger } from "./dashboard"
import { buildInvoiceRows } from "./invoices"
import { buildExpenseRows } from "./expenses"
import { buildPayrollRuns } from "./payroll"

/**
 * Project rows for the projects list, with status from the project record.
 * @param {object} data seed data
 * @param {string} asOf ISO date
 * @returns {object[]}
 */
export function buildProjects(data, asOf) {
  const statusById = new Map(data.projects.map((project) => [project.id, project.status]))
  const ledger = buildProjectLedger(data)

  return ledger
    .filter((row) => !row.isOverhead)
    .map((row) => ({
      ...row,
      status: statusById.get(row.id) ?? "ongoing",
      invoiceCount: data.invoices.filter(
        (invoice) =>
          invoice.projectId === row.id && invoice.status !== "draft" && invoice.status !== "void",
      ).length,
      expenseCount: data.expenses.filter((expense) => expense.projectId === row.id).length,
      asOf,
    }))
}

/**
 * One project with its invoices, expenses, and payroll charged to it.
 * @param {object} data seed data
 * @param {string} projectId
 * @param {string} asOf ISO date
 * @returns {object|null}
 */
export function buildProjectDetail(data, projectId, asOf) {
  const project = data.projects.find((item) => item.id === projectId)
  if (!project) return null

  const ledgerRow = buildProjects(data, asOf).find((row) => row.id === projectId)
  const invoices = buildInvoiceRows(data, asOf).filter((invoice) => invoice.projectId === projectId)
  const expenses = buildExpenseRows(data).filter((expense) => expense.projectId === projectId)
  const payrollRuns = buildPayrollRuns(data)
    .map((run) => ({
      ...run,
      payslips: run.payslips.filter((payslip) => payslip.projectId === projectId),
    }))
    .filter((run) => run.payslips.length > 0)

  return { project, ledgerRow, invoices, expenses, payrollRuns }
}
