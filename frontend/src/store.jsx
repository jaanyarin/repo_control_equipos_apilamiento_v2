import { createContext, useContext, useState, useCallback } from 'react'
import { parseToken } from './api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => parseToken())

  const refreshUser = useCallback(() => {
    setUser(parseToken())
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    setUser(null)
  }, [])

  return (
    <AppContext.Provider value={{ user, setUser, refreshUser, logout }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
