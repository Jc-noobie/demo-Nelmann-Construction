import { format, parseISO } from "date-fns"
import { getPayrollRuns } from "@/api/payroll"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import { Panel } from "@/components/ui/panel"
import { StatCard } from "@/components/ui/stat-card"
import { formatPeso } from "@/lib/money"

/**
 * Read-only payroll runs with computed statutory deductions and net pay.
 */
export function PayrollPage() {
  const runs = getPayrollRuns()
  const latest = runs[0]
  const totalGross = runs.reduce((total, run) => total + run.totals.gross, 0)
  const totalNet = runs.reduce((total, run) => total + run.totals.net, 0)
  const totalDeductions = totalGross - totalNet

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader
        title="Payroll"
        description="Daily-wage payroll runs with SSS, PhilHealth, Pag-IBIG, and withholding deductions. Rates are demo placeholders until the accountant confirms them."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Latest period" value={latest ? latest.statusLabel : "—"} note={latest ? `${format(parseISO(latest.periodStart), "d MMM")} – ${format(parseISO(latest.periodEnd), "d MMM yyyy")}` : "No payroll runs"} />
        <StatCard label="Gross wages" value={formatPeso(totalGross)} note="All runs shown" />
        <StatCard label="Deductions" value={formatPeso(totalDeductions)} note="Employee share only" />
        <StatCard label="Net pay" value={formatPeso(totalNet)} note="What workers take home" />
      </div>

      {runs.length === 0 ? (
        <Panel>
          <EmptyState
            title="No payroll runs yet"
            description="Create a payroll run for a pay period to compute gross pay, deductions, and net pay."
          />
        </Panel>
      ) : (
        <div className="space-y-6">
          {runs.map((run) => (
            <Panel
              key={run.id}
              title={`${format(parseISO(run.periodStart), "d MMM")} – ${format(parseISO(run.periodEnd), "d MMM yyyy")}`}
              description={`${run.payslips.length} payslips · ${run.statusLabel}`}
              action={<Badge tone={run.status}>{run.statusLabel}</Badge>}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-sm">
                  <caption className="sr-only">
                    Payslips with employee, project, days worked, gross pay, statutory deductions, and net pay.
                  </caption>
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th scope="col" className="px-5 py-2.5 font-medium">Employee</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Project</th>
                      <th scope="col" className="px-3 py-2.5 text-right font-medium">Days</th>
                      <th scope="col" className="px-3 py-2.5 text-right font-medium">Gross</th>
                      <th scope="col" className="px-3 py-2.5 text-right font-medium">SSS</th>
                      <th scope="col" className="px-3 py-2.5 text-right font-medium">PhilHealth</th>
                      <th scope="col" className="px-3 py-2.5 text-right font-medium">Pag-IBIG</th>
                      <th scope="col" className="px-3 py-2.5 text-right font-medium">Withholding</th>
                      <th scope="col" className="px-5 py-2.5 text-right font-medium">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {run.payslips.map((payslip) => (
                      <tr
                        key={payslip.employeeId}
                        className="border-b border-border/70 last:border-0 hover:bg-muted/60"
                      >
                        <th scope="row" className="px-5 py-3 text-left font-normal">
                          <span className="block font-medium">{payslip.employeeName}</span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">{payslip.role}</span>
                        </th>
                        <td className="px-3 py-3 text-muted-foreground">{payslip.projectName}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{payslip.daysWorked}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{formatPeso(payslip.gross)}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{formatPeso(payslip.sss)}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{formatPeso(payslip.philhealth)}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{formatPeso(payslip.pagibig)}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{formatPeso(payslip.withholding)}</td>
                        <td className="px-5 py-3 text-right font-medium tabular-nums">{formatPeso(payslip.net)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-[3px] border-double border-foreground/60">
                      <th scope="row" colSpan={3} className="px-5 py-3 text-left text-sm font-semibold">
                        Total
                      </th>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums">
                        {formatPeso(run.totals.gross)}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums">
                        {formatPeso(run.totals.sss)}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums">
                        {formatPeso(run.totals.philhealth)}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums">
                        {formatPeso(run.totals.pagibig)}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums">
                        {formatPeso(run.totals.withholding)}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums">
                        {formatPeso(run.totals.net)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        Deduction rates are demonstration estimates and are marked{" "}
        <span className="font-mono text-xs">TODO(confirm with accountant)</span> in the config. This system
        prepares figures; it does not remit or file them.
      </p>
    </div>
  )
}
