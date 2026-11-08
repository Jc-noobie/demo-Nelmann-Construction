import { seed } from "@/data/seed"
import { buildDashboard } from "@/lib/dashboard"

/**
 * Everything the dashboard shows. Mock implementation for Phase 0.
 * @param {string} [asOf] ISO date
 * @returns {object}
 */
export function getDashboard(asOf = seed.company.asOf) {
  return buildDashboard(seed, asOf)
}
