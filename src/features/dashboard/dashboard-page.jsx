import { format, parseISO } from "date-fns"
import { getDashboard } from "@/api/dashboard"
import { PageHeader } from "@/components/ui/page-header"
import { AttentionList } from "./attention-list"
import { BilledSpentChart } from "./billed-spent-chart"
import { PositionStatement } from "./position-statement"
import { ProjectLedger } from "./project-ledger"
import { VatSummary } from "./vat-summary"

export function DashboardPage() {
  const data = getDashboard()

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader
        title="Dashboard"
        description={`${data.company.name} · Owner view · As of ${format(parseISO(data.asOf), "d MMMM yyyy")}`}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <PositionStatement position={data.position} />
          <ProjectLedger rows={data.projects} />
          <BilledSpentChart rows={data.projects} />
        </div>

        <div className="min-w-0 space-y-6">
          <AttentionList items={data.attention} />
          <VatSummary vat={data.vat} periodLabel={data.periodLabel} />
        </div>
      </div>
    </div>
  )
}
