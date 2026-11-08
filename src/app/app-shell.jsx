import {
  Database,
  FileText,
  FolderKanban,
  Landmark,
  LayoutDashboard,
  Receipt,
  Users,
} from "lucide-react"
import { NavLink } from "react-router-dom"
import { getCompany } from "@/api/company"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, end: true },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Sales and billing", to: "/sales", icon: FileText },
  { label: "Expenses", to: "/expenses", icon: Receipt },
  { label: "Payroll", to: "/payroll", icon: Users },
  { label: "VAT and BIR", to: "/tax", icon: Landmark },
  { label: "Master data", to: "/master-data", icon: Database },
]

function Brand({ compact = false }) {
  return (
    <div className={cn("flex items-center gap-2.5", compact ? "" : "px-4 py-5")}>
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground"
      >
        N
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold tracking-tight">Nelmann</span>
        <span className="block text-xs text-muted-foreground">Construction Company</span>
      </span>
    </div>
  )
}

function NavItem({ item, compact = false }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          isActive
            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
          compact && "shrink-0 whitespace-nowrap",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            aria-hidden="true"
            className={cn("size-1.5 rounded-[1px]", isActive ? "bg-primary" : "bg-transparent")}
          />
          <Icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
          <span className="whitespace-nowrap">{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

export function AppShell({ children }) {
  const company = getCompany()

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden border-r border-border bg-sidebar lg:flex lg:min-h-screen lg:flex-col">
        <div className="border-b border-border">
          <Brand />
        </div>
        <nav aria-label="Main" className="flex flex-1 flex-col gap-0.5 p-3">
          {navItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>
        <div className="border-t border-border px-4 py-3">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Appearance</p>
          <ThemeToggle />
          <p className="mt-3 text-xs font-medium text-foreground">Demo build</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            All figures are sample data. Nothing is saved.
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col">
        <header className="border-b border-border bg-sidebar lg:hidden">
          <div className="flex items-center justify-between gap-3 pr-4 pl-4">
            <Brand compact />
            <div className="flex items-center gap-2">
              <ThemeToggle compact />
              <span className="rounded-md border border-border bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Sample data
              </span>
            </div>
          </div>
          <nav
            aria-label="Main"
            className="flex gap-1 overflow-x-auto px-3 pb-3 [scrollbar-width:thin]"
          >
            {navItems.map((item) => (
              <NavItem key={item.label} item={item} compact />
            ))}
          </nav>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</main>

        <footer className="border-t border-border px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-10">
          {company.name} · Sample data for the Phase 0 demo. Figures reset on reload.
        </footer>
      </div>
    </div>
  )
}
