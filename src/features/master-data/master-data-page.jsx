import { getMasterData } from "@/api/master-data"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import { Panel } from "@/components/ui/panel"
import { formatPeso } from "@/lib/money"

/**
 * Read-only master data: the clients, suppliers, and employees behind the figures.
 */
export function MasterDataPage() {
  const { clients, suppliers, employees } = getMasterData()

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader
        title="Master data"
        description="The people and companies behind every project. Contact details and TINs arrive with the real system."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Clients" description={`${clients.length} clients from the sample projects`}>
          {clients.length === 0 ? (
            <EmptyState title="No clients yet" description="Add a client when you create a project." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th scope="col" className="px-5 py-2.5 font-medium">Client</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Project</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Contract</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b border-border/70 last:border-0 hover:bg-muted/60">
                      <th scope="row" className="px-5 py-3 text-left font-medium">
                        {client.name}
                      </th>
                      <td className="px-3 py-3 text-muted-foreground">
                        {client.projectName}
                        {client.location ? ` · ${client.location}` : ""}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">{formatPeso(client.contractAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title="Suppliers" description={`${suppliers.length} suppliers from recorded expenses`}>
          {suppliers.length === 0 ? (
            <EmptyState title="No suppliers yet" description="A supplier is added when you record an expense." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th scope="col" className="px-5 py-2.5 font-medium">Supplier</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Categories</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">Expenses</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Total spend</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier.name} className="border-b border-border/70 last:border-0 hover:bg-muted/60">
                      <th scope="row" className="px-5 py-3 text-left font-medium">
                        {supplier.name}
                      </th>
                      <td className="px-3 py-3 text-muted-foreground">{supplier.categories}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{supplier.expenseCount}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{formatPeso(supplier.totalSpend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel
          title="Employees"
          description={`${employees.length} workers on daily rates`}
          className="xl:col-span-2"
        >
          {employees.length === 0 ? (
            <EmptyState title="No employees yet" description="Add workers before running payroll." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th scope="col" className="px-5 py-2.5 font-medium">Employee</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Role</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">Daily rate</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Monthly equivalent</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b border-border/70 last:border-0 hover:bg-muted/60">
                      <th scope="row" className="px-5 py-3 text-left font-medium">
                        {employee.name}
                      </th>
                      <td className="px-3 py-3 text-muted-foreground">{employee.role}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{formatPeso(employee.dailyRate)}</td>
                      <td className="px-5 py-3 text-right tabular-nums">
                        {formatPeso(employee.monthlyEquivalent)}
                        <span className="mt-0.5 block text-xs text-muted-foreground">22 working days</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        Master data is read-only in this demo. Creating and editing clients, suppliers, and employees is part of
        the real system.
      </p>
    </div>
  )
}
