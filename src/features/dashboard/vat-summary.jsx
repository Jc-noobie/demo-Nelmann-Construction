import { Panel } from "@/components/ui/panel"
import { formatPeso } from "@/lib/money"
import { StatementRow } from "./statement-row"

/**
 * Output VAT, input VAT, and what is payable for the quarter.
 * @param {object} props
 * @param {{outputVat: number, inputVat: number, payable: number}} props.vat
 * @param {string} props.periodLabel
 */
export function VatSummary({ vat, periodLabel }) {
  const isCredit = vat.payable < 0

  return (
    <Panel title="VAT this quarter" action={periodLabel}>
      <dl className="px-5 py-1.5">
        <StatementRow label="Output VAT" value={formatPeso(vat.outputVat)} note="From sales invoices" />
        <StatementRow
          label="Input VAT"
          value={formatPeso(vat.inputVat)}
          note="From expenses with a valid receipt"
        />
        <StatementRow
          label={isCredit ? "Carry-over credit" : "VAT payable"}
          value={formatPeso(Math.abs(vat.payable))}
          total
        />
      </dl>

      <p className="border-t border-border px-5 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Prepared figures only. The accountant reviews the numbers and files with BIR outside this system.
      </p>
    </Panel>
  )
}
