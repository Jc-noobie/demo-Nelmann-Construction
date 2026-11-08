import { cn } from "@/lib/utils"

/**
 * The single bordered sheet used for every block of content.
 * @param {object} props
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {React.ReactNode} [props.action]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {string} [props.bodyClassName]
 */
export function Panel({ title, description, action, children, className, bodyClassName }) {
  return (
    <section className={cn("overflow-hidden rounded-xl border border-border bg-card shadow-sm", className)}>
      {title ? (
        <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-5 py-3.5">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">{title}</h2>
            {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0 text-xs text-muted-foreground">{action}</div> : null}
        </header>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}
