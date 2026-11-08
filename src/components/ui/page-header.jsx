/**
 * Page title, description, and the sample-data marker every page carries.
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {React.ReactNode} [props.children] extra header content, kept left of the sample badge
 */
export function PageHeader({ title, description, children }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div className="min-w-0">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        <span className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-xs">
          Sample data
        </span>
      </div>
    </header>
  )
}
