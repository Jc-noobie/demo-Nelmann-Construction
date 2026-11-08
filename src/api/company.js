import { company } from "@/data/seed"

/**
 * Company details for the app shell. Mock implementation for Phase 0.
 * @returns {{name: string, asOf: string, periodLabel: string, vatRate: number}}
 */
export function getCompany() {
  return company
}
