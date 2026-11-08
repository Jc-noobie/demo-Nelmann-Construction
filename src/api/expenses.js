import { seed } from "@/data/seed"
import { buildExpenseRows, buildExpenseTotals } from "@/lib/expenses"

/**
 * Expense list and totals. Mock implementation for Phase 0.
 * @returns {{expenses: object[], totals: object}}
 */
export function getExpenses() {
  const expenses = buildExpenseRows(seed)
  return { expenses, totals: buildExpenseTotals(expenses) }
}
