import Decimal from "decimal.js"
import { payrollConfig } from "./config"
import { sumCentavos } from "./money"

const STATUS_LABELS = {
  draft: "Draft",
  approved: "Approved",
  paid: "Paid",
}

/**
 * Employee deductions for one payslip. Demo estimate only.
 * @param {number} gross centavos
 * @returns {{sss: number, philhealth: number, pagibig: number, withholding: number, total: number, net: number}}
 */
export function computeDeductions(gross) {
  const grossAmount = new Decimal(gross)
  const round = (value) => value.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber()

  const sss = round(grossAmount.mul(payrollConfig.sssEmployeeRate))
  const philhealth = round(grossAmount.mul(payrollConfig.philhealthEmployeeRate))
  const pagibig = round(
    Decimal.min(
      grossAmount.mul(payrollConfig.pagibigEmployeeRate),
      new Decimal(payrollConfig.pagibigCapCentavos),
    ),
  )
  const withholding = round(grossAmount.mul(payrollConfig.withholdingRate))
  const total = sss + philhealth + pagibig + withholding

  return { sss, philhealth, pagibig, withholding, total, net: gross - total }
}

/**
 * Payroll runs with employee names, computed deductions, and run totals.
 * @param {object} data seed data
 * @returns {object[]}
 */
export function buildPayrollRuns(data) {
  const employeeById = new Map(data.employees.map((employee) => [employee.id, employee]))
  const projectById = new Map(data.projects.map((project) => [project.id, project]))

  return data.payrollRuns
    .map((run) => {
      const payslips = run.payslips.map((payslip) => {
        const employee = employeeById.get(payslip.employeeId)
        return {
          ...payslip,
          employeeName: employee?.name ?? "Unknown employee",
          role: employee?.role ?? "",
          projectName: projectById.get(payslip.projectId)?.name ?? "Unknown project",
          ...computeDeductions(payslip.gross),
        }
      })

      return {
        ...run,
        statusLabel: STATUS_LABELS[run.status] ?? run.status,
        payslips,
        totals: {
          gross: sumCentavos(payslips.map((payslip) => payslip.gross)),
          sss: sumCentavos(payslips.map((payslip) => payslip.sss)),
          philhealth: sumCentavos(payslips.map((payslip) => payslip.philhealth)),
          pagibig: sumCentavos(payslips.map((payslip) => payslip.pagibig)),
          withholding: sumCentavos(payslips.map((payslip) => payslip.withholding)),
          net: sumCentavos(payslips.map((payslip) => payslip.net)),
        },
      }
    })
    .sort((a, b) => b.periodStart.localeCompare(a.periodStart))
}
