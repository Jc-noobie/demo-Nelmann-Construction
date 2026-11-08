/**
 * Empty list state that tells the user what to do next.
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 */
export function EmptyState({ title, description }) {
  return (
    <div className="px-5 py-12 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
