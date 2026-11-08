import { seed } from "@/data/seed"
import { buildTaxSummary } from "@/lib/tax"

/**
 * VAT and BIR figures prepared from invoices, expenses, and payments.
 * Mock implementation for Phase 0.
 * @returns {object}
 */
export function getTaxSummary() {
  return buildTaxSummary(seed)
}
