import { createContext, useContext } from "react"

export const THEME_STORAGE_KEY = "nelmann-theme"

export const ThemeContext = createContext(null)

/**
 * Read and set the current light/dark appearance.
 * @returns {{theme: "light"|"dark", setTheme: (theme: "light"|"dark") => void, toggleTheme: () => void}}
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used inside <ThemeProvider>")
  }
  return context
}
