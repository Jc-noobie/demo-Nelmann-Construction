import { formatPeso, sumCentavos } from "@/lib/money"
import { cn } from "@/lib/utils"
import { Panel } from "@/components/ui/panel"

function BalanceStrip({ row, scale }) {
  const spentWidth = Math.min(100, (row.spent / scale) * 100)
  const profitWidth = Math.max(0, Math.min(100 - spentWidth, (row.profit / scale) * 100))
  const isLoss = row.profit < 0

  return (
    <div className="w-[150px]">
      <div
        role="img"
        aria-label={`${row.name}: billed ${formatPeso(row.billed)}, spent ${formatPeso(row.spent)}, profit ${formatPeso(row.profit)}`}
        className="flex h-2 w-full items-stretch border-b border-border"
      >
        <span
          className={cn("h-full", isLoss ? "bg-destructive" : "bg-foreground/20")}
          style={{ width: `${spentWidth}%` }}
        />
        {row.profit > 0 ? <span className="h-full bg-foreground" style={{ width: `${profitWidth}%` }} /> : null}
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>spent</span>
        <span>{isLoss ? "loss" : "profit"}</span>
      </div>
    </div>
  )
}

/**
 * Profit per project, closed by a double-ruled total like a ledger page.
 * @param {object} props
 * @param {object[]} props.rows computed project rows
 */
export function ProjectLedger({ rows }) {
  const totals = {
    billed: sumCentavos(rows.map((row) => row.billed)),
    spent: sumCentavos(rows.map((row) => row.spent)),
    profit: sumCentavos(rows.map((row) => row.profit)),
  }
  const scale = Math.max(1, ...rows.map((row) => row.billed))

  return (
    <Panel title="Profit by project" description="Billed against spent, largest profit first">
      {rows.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-medium">No projects yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a project to start tracking its contract, costs, and profit.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <caption className="sr-only">
              Profit by project. Billed excludes VAT; spent includes expenses and payroll.
            </caption>
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th scope="col" className="px-5 py-2.5 font-medium">Project</th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">Billed</th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">Spent</th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">Profit</th>
                <th scope="col" className="px-5 py-2.5 font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/70 align-middle transition-colors last:border-0 hover:bg-muted/60"
                >
                  <th scope="row" className="px-5 py-3 text-left font-normal">
                    <span className="block font-medium">{row.name}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {row.client}
                      {row.location ? ` · ${row.location}` : ""}
                    </span>
                    {!row.isOverhead ? (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {row.billedPct.toFixed(1)}% of contract · {row.retentionPct}% retention
                      </span>
                    ) : null}
                  </th>
                  <td className="px-3 py-3 text-right tabular-nums">{formatPeso(row.billed)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{formatPeso(row.spent)}</td>
                  <td
                    className={cn(
                      "px-3 py-3 text-right font-medium tabular-nums",
                      row.profit < 0 ? "text-destructive" : "text-foreground",
                    )}
                  >
                    {formatPeso(row.profit)}
                  </td>
                  <td className="px-5 py-3">
                    <BalanceStrip row={row} scale={scale} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-[3px] border-double border-foreground/60">
                <th scope="row" className="px-5 py-3 text-left text-sm font-semibold">Total</th>
                <td className="px-3 py-3 text-right font-semibold tabular-nums">
                  {formatPeso(totals.billed)}
                </td>
                <td className="px-3 py-3 text-right font-semibold tabular-nums">
                  {formatPeso(totals.spent)}
                </td>
                <td
                  className={cn(
                    "px-3 py-3 text-right font-semibold tabular-nums",
                    totals.profit < 0 ? "text-destructive" : "text-foreground",
                  )}
                >
                  {formatPeso(totals.profit)}
                </td>
                <td className="px-5 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </Panel>
  )
}
