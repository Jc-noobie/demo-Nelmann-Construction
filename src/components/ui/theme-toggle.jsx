import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/app/theme-context"
import { cn } from "@/lib/utils"

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
]

/**
 * Two-state appearance control. The active mode is filled with ink; the other stays quiet.
 * @param {object} props
 * @param {boolean} [props.compact] icon-only, for the narrow header
 */
export function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="group"
      aria-label="Appearance"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-border bg-card p-0.5",
        compact ? "" : "w-full",
      )}
    >
      {OPTIONS.map((option) => {
        const Icon = option.icon
        const isActive = theme === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-pressed={isActive}
            aria-label={option.label}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-[4px] py-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              isActive
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              compact ? "size-7 px-0" : "flex-1 px-2",
            )}
          >
            <Icon aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
            {compact ? null : <span>{option.label}</span>}
          </button>
        )
      })}
    </div>
  )
}
