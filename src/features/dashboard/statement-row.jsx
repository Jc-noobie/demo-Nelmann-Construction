import { cn } from "@/lib/utils"

/**
 * One label/value line in a statement panel.
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.value already formatted
 * @param {string} [props.note]
 * @param {"default"|"overdue"|"paid"} [props.tone]
 * @param {boolean} [props.total] closes the statement with a double rule
 */
export function StatementRow({ label, value, note, tone = "default", total = false }) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 py-2.5",
        total
          ? "mt-1 border-t-[3px] border-double border-foreground/60 pt-3"
          : "border-b border-border/70 last:border-0",
      )}
    >
      <dt className="min-w-0 text-sm text-muted-foreground">
        <span className={cn(total && "font-medium text-foreground")}>{label}</span>
        {note ? <span className="mt-0.5 block text-xs leading-relaxed">{note}</span> : null}
      </dt>
      <dd
        className={cn(
          "shrink-0 text-right text-sm tabular-nums",
          tone === "overdue" && "text-destructive",
          tone === "paid" && "text-foreground",
          total && "text-lg font-semibold text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  )
}
