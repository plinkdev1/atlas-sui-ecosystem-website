"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/lib/theme-provider"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 hover:bg-accent hover:text-accent-foreground dark:bg-gradient-to-br dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600 dark:text-blue-200 text-blue-600 hover:shadow-lg"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Current theme: ${theme}`}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-300 rotate-180" />
      )}
    </button>
  )
}
