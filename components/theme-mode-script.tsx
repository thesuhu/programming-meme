"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function ThemeModeScript() {
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    // Log untuk debugging
    console.log("Current theme:", theme)

    // Coba paksa tema ke light jika user memilih light
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem("meme-theme-preference")
      if (savedTheme) {
        console.log("Saved theme:", savedTheme)
        setTheme(savedTheme)
      }
    }

    handleThemeChange()

    // Tambahkan listener untuk perubahan storage
    window.addEventListener("storage", handleThemeChange)
    return () => window.removeEventListener("storage", handleThemeChange)
  }, [setTheme, theme])

  return null
}
