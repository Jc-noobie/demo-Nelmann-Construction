import { seed } from "@/data/seed"
import { buildProjects, buildProjectDetail } from "@/lib/projects"

/**
 * Project list for the projects page. Mock implementation for Phase 0.
 * @param {string} [asOf] ISO date
 * @returns {object[]}
 */
export function getProjects(asOf = seed.company.asOf) {
  return buildProjects(seed, asOf)
}

/**
 * One project with its invoices, expenses, and payroll.
 * @param {string} projectId
 * @param {string} [asOf] ISO date
 * @returns {object|null}
 */
export function getProject(projectId, asOf = seed.company.asOf) {
  return buildProjectDetail(seed, projectId, asOf)
}
