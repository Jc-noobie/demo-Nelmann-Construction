import { cn } from "@/lib/utils"

const TONES = {
  paid: "bg-primary text-primary-foreground",
  approved: "bg-primary text-primary-foreground",
  overdue: "bg-destructive text-destructive-foreground",
  draft: "bg-muted text-muted-foreground",
  void: "bg-muted text-muted-foreground line-through",
  due: "border border-border bg-card text-foreground",
  sent: "border border-border bg-card text-foreground",
  partial: "border border-border bg-card text-foreground",
  ongoing: "border border-border bg-card text-foreground",
  completed: "border border-border bg-card text-foreground",
}

/**
 * Small status pill. Tones follow the status vocabulary: paid black, due outlined
 * with an amber dot, overdue red, draft gray.
 * @param {object} props
 * @param {string} [props.tone]
 * @param {boolean} [props.dot] show the amber state dot
 * @param {React.ReactNode} props.children
 */
export function Badge({ tone = "draft", dot = false, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 align-middle text-xs font-medium",
        TONES[tone] ?? TONES.draft,
      )}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={cn("size-1.5 rounded-full", tone === "overdue" ? "bg-destructive-foreground" : "bg-chart-1")}
        />
      ) : null}
      {children}
    </span>
  )
}
