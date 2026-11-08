import { sumCentavos } from "./money"

/**
 * Clients derived from projects. Contact details are not part of the demo data.
 * @param {object} data seed data
 * @returns {object[]}
 */
export function buildClients(data) {
  return data.projects.map((project) => ({
    id: project.id,
    name: project.client,
    projectName: project.name,
    location: project.location,
    contractAmount: project.contractAmount,
    status: project.status,
  }))
}

/**
 * Suppliers derived from expenses, with spend and VAT receipt coverage.
 * @param {object} data seed data
 * @returns {object[]}
 */
export function buildSuppliers(data) {
  const byName = new Map()

  data.expenses.forEach((expense) => {
    const entry = byName.get(expense.supplier) ?? {
      name: expense.supplier,
      expenseCount: 0,
      spend: [],
      categories: new Set(),
      withReceipt: 0,
    }
    entry.expenseCount += 1
    entry.spend.push(expense.amount)
    entry.categories.add(expense.category)
    if (expense.hasVatReceipt) entry.withReceipt += 1
    byName.set(expense.supplier, entry)
  })

  return [...byName.values()]
    .map((entry) => ({
      name: entry.name,
      expenseCount: entry.expenseCount,
      totalSpend: sumCentavos(entry.spend),
      categories: [...entry.categories].join(", "),
      withReceipt: entry.withReceipt,
    }))
    .sort((a, b) => b.totalSpend - a.totalSpend)
}

/**
 * Employees with their configured daily rate.
 * @param {object} data seed data
 * @returns {object[]}
 */
export function buildEmployees(data) {
  return data.employees.map((employee) => ({
    ...employee,
    monthlyEquivalent: employee.dailyRate * 22,
  }))
}
