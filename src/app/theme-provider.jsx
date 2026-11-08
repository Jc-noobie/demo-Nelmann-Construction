import { useCallback, useEffect, useMemo, useState } from "react"
import { THEME_STORAGE_KEY, ThemeContext } from "./theme-context"

function getInitialTheme() {
  if (typeof window === "undefined") return "light"
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light"
  } catch {
    return "light"
  }
}

/**
 * Applies the chosen appearance to the document and remembers it between visits.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    root.style.colorScheme = theme
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // A blocked storage API should not stop the theme from applying.
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    setThemeState(next === "dark" ? "dark" : "light")
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"))
  }, [])

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
