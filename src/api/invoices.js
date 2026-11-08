import { seed } from "@/data/seed"
import { buildInvoiceRows, buildInvoiceTotals } from "@/lib/invoices"

/**
 * Invoice list with derived statuses. Mock implementation for Phase 0.
 * @param {string} [asOf] ISO date
 * @returns {{invoices: object[], totals: object}}
 */
export function getInvoices(asOf = seed.company.asOf) {
  const invoices = buildInvoiceRows(seed, asOf)
  return { invoices, totals: buildInvoiceTotals(invoices) }
}
