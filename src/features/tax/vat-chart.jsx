import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { Panel } from "@/components/ui/panel"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatPeso, formatPesoCompact } from "@/lib/money"

const chartConfig = {
  amount: { label: "VAT", color: "var(--foreground)" },
}

/**
 * The quarterly VAT arithmetic as three bars: output, input, and the result.
 * @param {object} props
 * @param {{outputVat: number, inputVat: number, payable: number, isCredit: boolean}} props.tax
 */
export function VatChart({ tax }) {
  const resultLabel = tax.isCredit ? "Carry-over credit" : "VAT payable"
  const data = [
    { label: "Output VAT", amount: tax.outputVat, fill: "var(--foreground)" },
    { label: "Input VAT", amount: tax.inputVat, fill: "var(--muted-foreground)" },
    { label: resultLabel, amount: Math.abs(tax.payable), fill: "var(--foreground)" },
  ]

  return (
    <Panel title="VAT for the quarter" description="Output less input, in one view.">
      <div className="px-3 pt-4">
        <ChartContainer
          config={chartConfig}
          className="w-full"
          style={{ aspectRatio: "auto", height: 200 }}
          role="img"
          aria-label={`${resultLabel} ${formatPeso(Math.abs(tax.payable))}. Output VAT ${formatPeso(tax.outputVat)}; input VAT ${formatPeso(tax.inputVat)}.`}
        >
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
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
              dataKey="label"
              width={128}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent valueFormatter={formatPeso} />} />
            <Bar dataKey="amount" barSize={16} radius={[0, 3, 3, 0]}>
              {data.map((entry) => (
                <Cell key={entry.label} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
      <p className="border-t border-border px-5 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Prepared figures only. The accountant reviews these numbers and files with BIR outside this system.
      </p>
      <table className="sr-only">
        <caption>VAT for the quarter</caption>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Output VAT</th>
            <td>{formatPeso(tax.outputVat)}</td>
          </tr>
          <tr>
            <th scope="row">Input VAT</th>
            <td>{formatPeso(tax.inputVat)}</td>
          </tr>
          <tr>
            <th scope="row">{resultLabel}</th>
            <td>{formatPeso(Math.abs(tax.payable))}</td>
          </tr>
        </tbody>
      </table>
    </Panel>
  )
}
