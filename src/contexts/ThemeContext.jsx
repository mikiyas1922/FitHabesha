import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(undefined)
const STORAGE_KEY = 'fit-habesha-theme'

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.dataset.theme = resolved
  return resolved
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY) || 'system')
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    applyTheme(localStorage.getItem(STORAGE_KEY) || 'system')
  )

  useEffect(() => {
    const nextResolved = applyTheme(theme)
    setResolvedTheme(nextResolved)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => setResolvedTheme(applyTheme('system'))

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme: () => {
        setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')
      },
    }),
    [theme, resolvedTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
