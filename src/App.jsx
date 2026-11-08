import { Route, Routes } from "react-router-dom"
import { AppShell } from "@/app/app-shell"
import { DashboardPage } from "@/features/dashboard/dashboard-page"
import { ExpensesPage } from "@/features/expenses/expenses-page"
import { MasterDataPage } from "@/features/master-data/master-data-page"
import { PayrollPage } from "@/features/payroll/payroll-page"
import { ProjectDetailPage } from "@/features/projects/project-detail-page"
import { ProjectsPage } from "@/features/projects/projects-page"
import { SalesPage } from "@/features/sales/sales-page"
import { TaxPage } from "@/features/tax/tax-page"

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/tax" element={<TaxPage />} />
        <Route path="/master-data" element={<MasterDataPage />} />
        <Route path="*" element={<DashboardPage />} />
      </Routes>
    </AppShell>
  )
}

export default App
