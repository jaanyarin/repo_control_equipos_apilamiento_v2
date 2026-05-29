import { createContext, useContext, useState } from 'react'

const ThemeModeContext = createContext()

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState('light')
  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeModeContext.Provider>
  )
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider')
  return ctx
}
