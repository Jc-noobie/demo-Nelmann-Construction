import { format, parseISO } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { getProject } from "@/api/projects"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import { Panel } from "@/components/ui/panel"
import { StatCard } from "@/components/ui/stat-card"
import { formatPeso } from "@/lib/money"

function BackToProjects() {
  return (
    <Link
      to="/projects"
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <ArrowLeft aria-hidden="true" className="size-3.5" />
      All projects
    </Link>
  )
}

/**
 * One project: contract position, invoices, expenses, and payroll charged to it.
 */
export function ProjectDetailPage() {
  const { projectId } = useParams()
  const detail = getProject(projectId)

  if (!detail) {
    return (
      <div className="mx-auto w-full max-w-[1180px]">
        <PageHeader title="Project not found" description="This project is not part of the sample data.">
          <BackToProjects />
        </PageHeader>
        <Panel>
          <EmptyState
            title="Nothing to show"
            description="Go back to the project list and choose a project from the sample data."
          />
        </Panel>
      </div>
    )
  }

  const { project, ledgerRow, invoices, expenses, payrollRuns } = detail
  const payrollCost = payrollRuns.reduce(
    (total, run) => total + run.payslips.reduce((sum, payslip) => sum + payslip.gross, 0),
    0,
  )

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader
        title={project.name}
        description={`${project.client}${project.location ? ` · ${project.location}` : ""} · ${project.retentionPct}% retention`}
      >
        <BackToProjects />
      </PageHeader>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Contract amount" value={formatPeso(project.contractAmount)} note="Agreed total price" />
        <StatCard
          label="Billed to date"
          value={formatPeso(ledgerRow.billed)}
          note={`${ledgerRow.billedPct.toFixed(1)}% of contract`}
        />
        <StatCard
          label="Spent"
          value={formatPeso(ledgerRow.spent)}
          note={`Expenses ${formatPeso(ledgerRow.spent - payrollCost)} · payroll ${formatPeso(payrollCost)}`}
        />
        <StatCard
          label="Profit"
          value={formatPeso(ledgerRow.profit)}
          note="Billed less all costs"
          tone={ledgerRow.profit < 0 ? "danger" : "default"}
        />
      </div>

      <div className="space-y-6">
        <Panel
          title="Invoices"
          description={`${invoices.length} invoice${invoices.length === 1 ? "" : "s"} on this project`}
        >
          {invoices.length === 0 ? (
            <EmptyState
              title="No invoices yet"
              description="Bill progress on this project to see it here and on the dashboard."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th scope="col" className="px-5 py-2.5 font-medium">Invoice</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Issued</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Due</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">Amount due</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">Outstanding</th>
                    <th scope="col" className="px-5 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border/70 last:border-0 hover:bg-muted/60">
                      <td className="whitespace-nowrap px-5 py-3 font-medium tabular-nums">{invoice.invoiceNo}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-muted-foreground tabular-nums">
                        {format(parseISO(invoice.issueDate), "d MMM yyyy")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-muted-foreground tabular-nums">
                        {format(parseISO(invoice.dueDate), "d MMM yyyy")}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">{formatPeso(invoice.amountDue)}</td>
                      <td
                        className={
                          invoice.outstanding > 0
                            ? "px-3 py-3 text-right font-medium tabular-nums"
                            : "px-3 py-3 text-right tabular-nums text-muted-foreground"
                        }
                      >
                        {formatPeso(invoice.outstanding)}
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={invoice.status} dot={invoice.status === "overdue" || invoice.status === "sent"}>
                          {invoice.statusLabel}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel
          title="Expenses"
          description={`${expenses.length} cost${expenses.length === 1 ? "" : "s"} charged to this project`}
        >
          {expenses.length === 0 ? (
            <EmptyState
              title="No expenses yet"
              description="Record materials, equipment, and subcontractor costs against this project."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th scope="col" className="px-5 py-2.5 font-medium">Date</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Description</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Supplier</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Category</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">Amount</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Input VAT</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-border/70 last:border-0 hover:bg-muted/60">
                      <td className="whitespace-nowrap px-5 py-3 text-muted-foreground tabular-nums">
                        {format(parseISO(expense.expenseDate), "d MMM yyyy")}
                      </td>
                      <td className="px-3 py-3">{expense.description}</td>
                      <td className="px-3 py-3 text-muted-foreground">{expense.supplier}</td>
                      <td className="px-3 py-3 text-muted-foreground">{expense.category}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{formatPeso(expense.amount)}</td>
                      <td className="px-5 py-3 text-right tabular-nums">
                        {expense.hasVatReceipt ? formatPeso(expense.vatAmount) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title="Payroll" description="Wages charged to this project">
          {payrollRuns.length === 0 ? (
            <EmptyState
              title="No payroll on this project"
              description="Payroll runs assigned to this project will appear here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th scope="col" className="px-5 py-2.5 font-medium">Period</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Employee</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">Days</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">Gross</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollRuns.flatMap((run) =>
                    run.payslips.map((payslip) => (
                      <tr
                        key={`${run.id}-${payslip.employeeId}`}
                        className="border-b border-border/70 last:border-0 hover:bg-muted/60"
                      >
                        <td className="whitespace-nowrap px-5 py-3 text-muted-foreground tabular-nums">
                          {format(parseISO(run.periodStart), "d MMM")} – {format(parseISO(run.periodEnd), "d MMM")}
                        </td>
                        <td className="px-3 py-3">
                          {payslip.employeeName}
                          <span className="mt-0.5 block text-xs text-muted-foreground">{payslip.role}</span>
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums">{payslip.daysWorked}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{formatPeso(payslip.gross)}</td>
                        <td className="px-5 py-3 text-right tabular-nums">{formatPeso(payslip.net)}</td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
