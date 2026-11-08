import { format, parseISO } from "date-fns"
import { getExpenses } from "@/api/expenses"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import { Panel } from "@/components/ui/panel"
import { StatCard } from "@/components/ui/stat-card"
import { formatPeso } from "@/lib/money"

/**
 * Read-only expense list. Input VAT only appears when a valid receipt backs the cost.
 */
export function ExpensesPage() {
  const { expenses, totals } = getExpenses()

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader
        title="Expenses"
        description="Costs are charged to a project or to General / overhead. Only expenses with a valid VAT receipt contribute input VAT."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total spent" value={formatPeso(totals.total)} note={`${totals.entered} recorded expenses`} />
        <StatCard
          label="Input VAT"
          value={formatPeso(totals.inputVat)}
          note="From expenses with a valid receipt"
        />
        <StatCard
          label="With receipt"
          value={String(totals.withReceipt)}
          note={`${totals.entered - totals.withReceipt} without a valid VAT receipt`}
        />
        <StatCard
          label="Average expense"
          value={formatPeso(totals.entered ? Math.round(totals.total / totals.entered) : 0)}
          note="Across all recorded costs"
        />
      </div>

      <Panel title="All expenses" description="Newest first, with the project name beside every amount.">
        {expenses.length === 0 ? (
          <EmptyState
            title="No expenses yet"
            description="Record materials, equipment, fuel, and subcontractor costs against a project."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-sm">
              <caption className="sr-only">Expenses with project, supplier, category, amount, and input VAT.</caption>
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th scope="col" className="px-5 py-2.5 font-medium">Date</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Description</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Project</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Supplier</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Category</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Amount</th>
                  <th scope="col" className="px-5 py-2.5 text-right font-medium">Input VAT</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-border/70 align-middle transition-colors last:border-0 hover:bg-muted/60"
                  >
                    <td className="whitespace-nowrap px-5 py-3 text-muted-foreground tabular-nums">
                      {format(parseISO(expense.expenseDate), "d MMM yyyy")}
                    </td>
                    <td className="px-3 py-3">{expense.description}</td>
                    <td className="px-3 py-3">
                      <span className="block">{expense.projectName}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{expense.client}</span>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{expense.supplier}</td>
                    <td className="px-3 py-3 text-muted-foreground">{expense.category}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatPeso(expense.amount)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {expense.hasVatReceipt ? (
                        formatPeso(expense.vatAmount)
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-[3px] border-double border-foreground/60">
                  <th scope="row" colSpan={5} className="px-5 py-3 text-left text-sm font-semibold">
                    Total
                  </th>
                  <td className="px-3 py-3 text-right font-semibold tabular-nums">{formatPeso(totals.total)}</td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">
                    {formatPeso(totals.inputVat)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}
