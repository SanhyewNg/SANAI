// ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    const applyTheme = (newTheme: Theme) => {
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark")
        document.documentElement.classList.remove("light")
      } else if (newTheme === "light") {
        document.documentElement.classList.remove("dark")
        document.documentElement.classList.add("light")
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
        if (prefersDark) {
          document.documentElement.classList.add("dark")
          document.documentElement.classList.remove("light")
        } else {
          document.documentElement.classList.remove("dark")
          document.documentElement.classList.add("light")
        }
      }
    }

    applyTheme(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
