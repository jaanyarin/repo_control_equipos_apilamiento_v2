import React, { createContext, useContext, useState, useEffect } from 'react'
import { parseToken, getToken, removeToken } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const token = await getToken()
        if (token) setUser(parseToken(token))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const refreshUser = async (accessToken) => {
    const token = accessToken || await getToken()
    const nextUser = parseToken(token)
    setUser(nextUser)
    return nextUser
  }

  const logout = async () => {
    try {
      await removeToken()
    } catch (_) {
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
