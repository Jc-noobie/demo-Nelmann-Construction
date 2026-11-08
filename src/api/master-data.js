import { seed } from "@/data/seed"
import { buildClients, buildEmployees, buildSuppliers } from "@/lib/master-data"

/**
 * Clients, suppliers, and employees for the master data page.
 * Mock implementation for Phase 0.
 * @returns {{clients: object[], suppliers: object[], employees: object[]}}
 */
export function getMasterData() {
  return {
    clients: buildClients(seed),
    suppliers: buildSuppliers(seed),
    employees: buildEmployees(seed),
  }
}
