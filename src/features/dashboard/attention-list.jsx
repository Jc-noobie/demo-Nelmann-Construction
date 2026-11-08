import { format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Panel } from "@/components/ui/panel"
import { formatPeso } from "@/lib/money"

/**
 * Overdue invoices to chase, with the project name beside every amount.
 * @param {object} props
 * @param {object[]} props.items computed overdue invoices
 */
export function AttentionList({ items }) {
  return (
    <Panel
      title="Needs attention"
      action={
        items.length === 0 ? "Nothing overdue" : `${items.length} overdue ${items.length === 1 ? "invoice" : "invoices"}`
      }
    >
      {items.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm font-medium">No overdue invoices</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Every sent invoice is current. Nothing to chase today.
          </p>
        </div>
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="border-b border-border/70 px-5 py-3.5 transition-colors last:border-0 hover:bg-muted/60"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-sm font-medium">{item.client}</span>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-destructive">
                  {formatPeso(item.outstanding)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.projectName} · <span className="tabular-nums">{item.invoiceNo}</span>
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
                <Badge tone={item.statusLabel === "Overdue" ? "overdue" : "partial"}>
                  {item.statusLabel} · {item.daysLate} {item.daysLate === 1 ? "day" : "days"} late
                </Badge>
                <span className="text-muted-foreground">
                  Due <span className="tabular-nums">{format(parseISO(item.dueDate), "d MMM yyyy")}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
