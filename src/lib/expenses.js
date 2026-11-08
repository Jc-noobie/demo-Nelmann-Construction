import { sumCentavos } from "./money"

/**
 * Expense rows with the project name attached, newest first.
 * @param {object} data seed data
 * @returns {object[]}
 */
export function buildExpenseRows(data) {
  const projectById = new Map(data.projects.map((project) => [project.id, project]))

  return data.expenses
    .map((expense) => ({
      ...expense,
      projectName: expense.projectId
        ? projectById.get(expense.projectId)?.name ?? "Unknown project"
        : "General / overhead",
      client: expense.projectId ? projectById.get(expense.projectId)?.client ?? "" : "Not charged to a project",
    }))
    .sort((a, b) => b.expenseDate.localeCompare(a.expenseDate))
}

/**
 * Totals for the expense list.
 * @param {object[]} expenses rows from buildExpenseRows
 * @returns {object}
 */
export function buildExpenseTotals(expenses) {
  const inputVat = buildInputVatRows(expenses)
  return {
    total: sumCentavos(expenses.map((expense) => expense.amount)),
    entered: expenses.length,
    withReceipt: inputVat.length,
    inputVat: sumCentavos(inputVat.map((expense) => expense.vatAmount)),
  }
}

/**
 * Only expenses backed by a valid VAT receipt earn input VAT.
 * @param {object[]} expenses rows from buildExpenseRows
 * @returns {object[]}
 */
export function buildInputVatRows(expenses) {
  return expenses.filter((expense) => expense.hasVatReceipt)
}
