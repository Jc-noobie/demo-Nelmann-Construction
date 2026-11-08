import { cn } from "@/lib/utils"

/**
 * One headline figure with a supporting note.
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.value already formatted
 * @param {string} [props.note]
 * @param {"default"|"danger"} [props.tone]
 */
export function StatCard({ label, value, note, tone = "default" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold tracking-tight tabular-nums",
          tone === "danger" && "text-destructive",
        )}
      >
        {value}
      </p>
      {note ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</p> : null}
    </div>
  )
}
