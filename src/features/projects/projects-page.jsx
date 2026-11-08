import { Link } from "react-router-dom"
import { getProjects } from "@/api/projects"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import { Panel } from "@/components/ui/panel"
import { StatCard } from "@/components/ui/stat-card"
import { formatPeso, sumCentavos } from "@/lib/money"
import { ContractProgressChart } from "./contract-progress-chart"

/**
 * Read-only project list: contract, billed, spent, and profit per project.
 */
export function ProjectsPage() {
  const projects = getProjects()
  const active = projects.filter((project) => project.status === "ongoing")
  const contractValue = sumCentavos(projects.map((project) => project.contractAmount))
  const billed = sumCentavos(projects.map((project) => project.billed))
  const profit = sumCentavos(projects.map((project) => project.profit))

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader
        title="Projects"
        description="Every expense, invoice, and payroll cost belongs to a project. Compare contract value, billed work, and profit in one place."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active projects"
          value={String(active.length)}
          note={`${projects.length} total, including completed work`}
        />
        <StatCard label="Contract value" value={formatPeso(contractValue)} note="All projects combined" />
        <StatCard label="Billed to date" value={formatPeso(billed)} note="Excludes draft and void invoices" />
        <StatCard
          label="Net profit"
          value={formatPeso(profit)}
          note="Billed less expenses and payroll"
          tone={profit < 0 ? "danger" : "default"}
        />
      </div>

      <div className="mb-6">
        <ContractProgressChart projects={projects} />
      </div>

      <Panel
        title="All projects"
        description="Largest profit first. Billed excludes VAT; spent includes expenses and payroll."
      >
        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Add a project with its client and contract amount to start tracking costs and profit."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <caption className="sr-only">Projects with contract, billed, spent, and profit amounts.</caption>
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th scope="col" className="px-5 py-2.5 font-medium">Project</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Contract</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Billed</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Spent</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Profit</th>
                  <th scope="col" className="px-5 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-border/70 align-middle transition-colors last:border-0 hover:bg-muted/60">
                    <th scope="row" className="px-5 py-3 text-left font-normal">
                      <Link
                        to={`/projects/${project.id}`}
                        className="block font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {project.name}
                      </Link>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {project.client}
                        {project.location ? ` · ${project.location}` : ""}
                      </span>
                    </th>
                    <td className="px-3 py-3 text-right tabular-nums">{formatPeso(project.contractAmount)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {formatPeso(project.billed)}
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {project.billedPct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatPeso(project.spent)}</td>
                    <td
                      className={
                        project.profit < 0
                          ? "px-3 py-3 text-right font-medium tabular-nums text-destructive"
                          : "px-3 py-3 text-right font-medium tabular-nums"
                      }
                    >
                      {formatPeso(project.profit)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={project.status === "completed" ? "completed" : "ongoing"}>
                        {project.status === "completed" ? "Completed" : "Ongoing"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}
