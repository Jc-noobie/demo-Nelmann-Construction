import { format, parseISO } from "date-fns"
import { getInvoices } from "@/api/invoices"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import { Panel } from "@/components/ui/panel"
import { StatCard } from "@/components/ui/stat-card"
import { formatPeso } from "@/lib/money"

/**
 * Read-only sales and billing list with derived statuses and outstanding amounts.
 */
export function SalesPage() {
  const { invoices, totals } = getInvoices()

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader
        title="Sales and billing"
        description="Every invoice is tied to a project. Statuses are derived from payments and the due date, so the list always matches the dashboard."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Billed" value={formatPeso(totals.billed)} note="Excludes VAT and draft invoices" />
        <StatCard label="Collected" value={formatPeso(totals.collected)} note="Payments recorded against sent invoices" />
        <StatCard
          label="Still unpaid"
          value={formatPeso(totals.outstanding)}
          note="Amount due after retention"
          tone={totals.outstanding > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Needs chasing"
          value={String(totals.overdueCount)}
          note={`${totals.draftCount} draft invoice${totals.draftCount === 1 ? "" : "s"} not yet sent`}
        />
      </div>

      <Panel title="Invoices" description="Newest first. Amount due is subtotal plus VAT less retention.">
        {invoices.length === 0 ? (
          <EmptyState
            title="No invoices yet"
            description="Create an invoice from a project to start billing progress and tracking payments."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <caption className="sr-only">
                Invoices with project, client, issue and due dates, status, amount due, and outstanding balance.
              </caption>
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th scope="col" className="px-5 py-2.5 font-medium">Invoice</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Project</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Issued</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Due</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Amount due</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Outstanding</th>
                  <th scope="col" className="px-5 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-border/70 align-middle transition-colors last:border-0 hover:bg-muted/60"
                  >
                    <th scope="row" className="whitespace-nowrap px-5 py-3 text-left font-medium tabular-nums">
                      {invoice.invoiceNo}
                    </th>
                    <td className="px-3 py-3">
                      <span className="block">{invoice.projectName}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{invoice.client}</span>
                    </td>
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
                      {invoice.status === "overdue" ? (
                        <span className="mt-1 block text-xs text-destructive">
                          {invoice.daysLate} {invoice.daysLate === 1 ? "day" : "days"} late
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-[3px] border-double border-foreground/60">
                  <th scope="row" colSpan={4} className="px-5 py-3 text-left text-sm font-semibold">
                    Total
                  </th>
                  <td className="px-3 py-3 text-right font-semibold tabular-nums">
                    {formatPeso(invoices.reduce((total, invoice) => total + invoice.amountDue, 0))}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold tabular-nums">
                    {formatPeso(totals.outstanding)}
                  </td>
                  <td className="px-5 py-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}
