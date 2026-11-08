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
  unbilled: { label: "Not yet billed", color: "var(--muted-foreground)" },
}

/**
 * How much of each contract has been billed, largest contract first.
 * @param {object} props
 * @param {object[]} props.projects project rows with contract and billed amounts
 */
export function ContractProgressChart({ projects }) {
  const data = [...projects]
    .sort((a, b) => b.contractAmount - a.contractAmount)
    .map((project) => ({
      name: project.name,
      billed: project.billed,
      unbilled: Math.max(0, project.contractAmount - project.billed),
      billedPct: project.billedPct,
    }))

  return (
    <Panel
      title="Contract progress"
      description="Ink is billed work; gray is the contract still to bill."
    >
      {data.length === 0 ? (
        <EmptyState
          title="No contracts to chart yet"
          description="Add a project with its contract amount to see progress here."
        />
      ) : (
        <>
          <div className="px-3 pt-4">
            <ChartContainer
              config={chartConfig}
              className="w-full"
              style={{ aspectRatio: "auto", height: Math.max(180, data.length * 48 + 56) }}
              role="img"
              aria-label="Billed share of each contract. Exact amounts are listed in the table below the chart."
            >
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
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
                <ChartTooltip content={<ChartTooltipContent valueFormatter={formatPeso} />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="billed" stackId="contract" fill="var(--color-billed)" barSize={14} />
                <Bar
                  dataKey="unbilled"
                  stackId="contract"
                  fill="var(--color-unbilled)"
                  barSize={14}
                  radius={[0, 3, 3, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
          <p className="border-t border-border px-5 py-2.5 text-xs leading-relaxed text-muted-foreground">
            Billed work is shown before VAT. A completed project can still have an unbilled balance.
          </p>
          <table className="sr-only">
            <caption>Contract progress by project</caption>
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">Contract</th>
                <th scope="col">Billed</th>
                <th scope="col">Billed share</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  <td>{formatPeso(row.billed + row.unbilled)}</td>
                  <td>{formatPeso(row.billed)}</td>
                  <td>{row.billedPct.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Panel>
  )
}
