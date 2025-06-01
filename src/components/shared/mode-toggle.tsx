"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const [theme, setThemeState] = React.useState<"theme-light" | "dark" | "system">("system")

  React.useEffect(() => {
    setMounted(true)
    const localTheme = localStorage.getItem("theme") as "theme-light" | "dark" | "system" | null
    if (localTheme) {
      setThemeState(localTheme)
      if (localTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark")
      setThemeState("dark")
    } else {
      setThemeState("theme-light")
    }
  }, [])

  const setTheme = (newTheme: "theme-light" | "dark") => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  if (!mounted) {
    return <Button variant="ghost" size="icon" disabled><Sun className="h-[1.2rem] w-[1.2rem]" /></Button>;
  }
  
  const currentThemeIsDark = document.documentElement.classList.contains("dark");

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => setTheme(currentThemeIsDark ? "theme-light" : "dark")}
      aria-label={currentThemeIsDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {currentThemeIsDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      )}
    </Button>
  )
}
