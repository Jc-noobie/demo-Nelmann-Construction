import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { EmptyState } from "@/components/ui/empty-state"
import { Panel } from "@/components/ui/panel"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatPeso, formatPesoCompact } from "@/lib/money"

const chartConfig = {
  billed: { label: "Billed", color: "var(--foreground)" },
  spent: { label: "Spent", color: "var(--muted-foreground)" },
}

/**
 * The same project rows as the ledger, drawn on one shared scale so the owner can
 * compare billed work against cost at a glance.
 * @param {object} props
 * @param {object[]} props.rows computed project rows
 */
export function BilledSpentChart({ rows }) {
  const data = rows.map((row) => ({ name: row.name, billed: row.billed, spent: row.spent }))

  return (
    <Panel
      title="Billed and spent by project"
      description="One scale across projects, so bar lengths compare honestly."
    >
      {data.length === 0 ? (
        <EmptyState
          title="No projects to chart yet"
          description="Add a project to compare billed work against its costs."
        />
      ) : (
        <>
          <div className="px-3 pt-4">
            <ChartContainer
              config={chartConfig}
              className="w-full"
              style={{ aspectRatio: "auto", height: 260 }}
              role="img"
              aria-label="Billed and spent by project. Exact amounts are listed in the table after the chart."
            >
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
                barGap={2}
              >
                <CartesianGrid horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={formatPesoCompact}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={136}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent valueFormatter={formatPeso} />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="billed" fill="var(--color-billed)" radius={[0, 3, 3, 0]} barSize={9} />
                <Bar dataKey="spent" fill="var(--color-spent)" radius={[0, 3, 3, 0]} barSize={9} />
              </BarChart>
            </ChartContainer>
          </div>
          <p className="border-t border-border px-5 py-2.5 text-xs leading-relaxed text-muted-foreground">
            Billed excludes VAT; spent includes expenses and payroll.
          </p>
          <table className="sr-only">
            <caption>Billed and spent by project</caption>
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">Billed</th>
                <th scope="col">Spent</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  <td>{formatPeso(row.billed)}</td>
                  <td>{formatPeso(row.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Panel>
  )
}
