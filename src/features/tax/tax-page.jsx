import { format, parseISO } from "date-fns"
import { getTaxSummary } from "@/api/tax"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import { Panel } from "@/components/ui/panel"
import { StatCard } from "@/components/ui/stat-card"
import { formatPeso } from "@/lib/money"
import { StatementRow } from "@/features/dashboard/statement-row"
import { VatChart } from "./vat-chart"

/**
 * Read-only VAT and BIR page: quarterly VAT position, the 2550Q-shaped summary,
 * and 2307 payment rows where withholding has been recorded.
 */
export function TaxPage() {
  const tax = getTaxSummary()

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader
        title="VAT and BIR"
        description={`Prepared figures for ${tax.periodLabel}. The accountant reviews these numbers and files with BIR outside this system.`}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Output VAT" value={formatPeso(tax.outputVat)} note="VAT charged on sales invoices" />
        <StatCard label="Input VAT" value={formatPeso(tax.inputVat)} note="VAT paid on qualified expenses" />
        <StatCard
          label={tax.isCredit ? "Carry-over credit" : "VAT payable"}
          value={formatPeso(Math.abs(tax.payable))}
          note={tax.isCredit ? "Input VAT exceeds output VAT" : "Output VAT less input VAT"}
        />
        <StatCard
          label="Receipts on file"
          value={String(tax.inputRows.length)}
          note={`${tax.withholdingRows.length} client payments recorded`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <VatChart tax={tax} />

          <Panel title="2550Q summary" description="Fields shaped for the quarterly VAT return">
            <dl className="px-5 pb-3">
              <StatementRow label="Output VAT" value={formatPeso(tax.outputVat)} note="From sales invoices in the period" />
              <StatementRow
                label="Input VAT"
                value={formatPeso(tax.inputVat)}
                note="From expenses backed by a valid VAT receipt"
              />
              <StatementRow
                label={tax.isCredit ? "Carry-over credit" : "VAT payable"}
                value={formatPeso(Math.abs(tax.payable))}
                total
              />
            </dl>
            <p className="border-t border-border px-5 py-2.5 text-xs leading-relaxed text-muted-foreground">
              Prepared figures only. The accountant checks the numbers against their records before filing.
            </p>
          </Panel>

          <Panel title="Expenses with input VAT" description="Only expenses marked with a valid VAT receipt">
            {tax.inputRows.length === 0 ? (
              <EmptyState
                title="No input VAT yet"
                description="Mark an expense as backed by a valid VAT receipt to include it here."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th scope="col" className="px-5 py-2.5 font-medium">Date</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Project</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Supplier</th>
                      <th scope="col" className="px-5 py-2.5 text-right font-medium">Input VAT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tax.inputRows.map((expense) => (
                      <tr key={expense.id} className="border-b border-border/70 last:border-0 hover:bg-muted/60">
                        <td className="whitespace-nowrap px-5 py-3 text-muted-foreground tabular-nums">
                          {format(parseISO(expense.expenseDate), "d MMM yyyy")}
                        </td>
                        <td className="px-3 py-3">{expense.projectName}</td>
                        <td className="px-3 py-3 text-muted-foreground">{expense.supplier}</td>
                        <td className="px-5 py-3 text-right tabular-nums">{formatPeso(expense.vatAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>

        <div className="min-w-0">
          <Panel title="2307 payments" description="Client payments in the period">
            {tax.withholdingRows.length === 0 ? (
              <EmptyState
                title="No payments recorded"
                description="Client payments appear here once they are recorded against an invoice."
              />
            ) : (
              <ul>
                {tax.withholdingRows.map((row) => (
                  <li key={row.id} className="border-b border-border/70 px-5 py-3.5 last:border-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 truncate text-sm font-medium">{row.client}</span>
                      <span className="shrink-0 text-sm font-medium tabular-nums">
                        {formatPeso(row.incomePayment)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {row.projectName} · <span className="tabular-nums">{row.invoiceNo}</span>
                    </p>
                    <div className="mt-1.5 flex items-baseline justify-between gap-3 text-xs">
                      <span className="text-muted-foreground">
                        Paid <span className="tabular-nums">{format(parseISO(row.paidOn), "d MMM yyyy")}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Withheld:{" "}
                        {row.taxWithheld === null ? (
                          <span className="italic">not recorded</span>
                        ) : (
                          <span className="tabular-nums">{formatPeso(row.taxWithheld)}</span>
                        )}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="border-t border-border px-5 py-2.5 text-xs leading-relaxed text-muted-foreground">
              This demo does not record withholding tax on payments yet, so 2307 amounts stay blank rather than
              guessed.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  )
}
