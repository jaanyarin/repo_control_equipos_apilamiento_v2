import React, { createContext, useContext, useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { parseToken, getToken } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const token = await getToken()
      if (token) setUser(parseToken(token))
      setLoading(false)
    })()
  }, [])

  const refreshUser = async () => {
    const token = await getToken()
    setUser(parseToken(token))
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync('accessToken')
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
