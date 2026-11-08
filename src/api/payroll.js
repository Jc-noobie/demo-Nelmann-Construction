import { seed } from "@/data/seed"
import { buildPayrollRuns } from "@/lib/payroll"

/**
 * Payroll runs with computed employee deductions. Mock implementation for Phase 0.
 * @returns {object[]}
 */
export function getPayrollRuns() {
  return buildPayrollRuns(seed)
}
