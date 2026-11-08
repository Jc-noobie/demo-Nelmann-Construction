import { formatPeso } from "@/lib/money"
import { Panel } from "@/components/ui/panel"
import { StatementRow } from "./statement-row"

/**
 * The owner's position: billed, spent, profit, and what is still unpaid.
 * @param {object} props
 * @param {object} props.position computed amounts in centavos
 */
export function PositionStatement({ position }) {
  return (
    <Panel title="Position" description="All projects · company total">
      <dl className="px-5 pt-1.5">
        <StatementRow
          label="Billed (excl. VAT)"
          value={formatPeso(position.billed)}
          note="Sent, partial, paid, and overdue invoices"
        />
        <StatementRow
          label="Spent"
          value={formatPeso(position.spent)}
          note="Expenses and payroll, including overhead"
        />
        <StatementRow
          label="Net profit"
          value={formatPeso(position.profit)}
          tone={position.profit < 0 ? "overdue" : "paid"}
          total
        />
      </dl>

      <div className="mt-2 border-y border-border bg-destructive/5 px-5 py-1">
        <dl>
          <StatementRow
            label="Still unpaid"
            value={formatPeso(position.unpaid)}
            note={`${formatPeso(position.collected)} collected · amount due after retention`}
            tone="overdue"
          />
        </dl>
      </div>

      <p className="px-5 py-3 text-xs text-muted-foreground">
        Retention held by clients:{" "}
        <span className="tabular-nums text-foreground">{formatPeso(position.retentionHeld)}</span>
      </p>
    </Panel>
  )
}
