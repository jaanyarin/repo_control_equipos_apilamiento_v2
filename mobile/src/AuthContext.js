import React, { createContext, useContext, useState, useEffect } from 'react'
import { parseToken, getToken, removeToken, registrarTokenPush, eliminarTokenPush } from './api'
import { getFcmToken, deleteFcmToken, getDevicePlatform } from './push'

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

  const registerPushToken = async () => {
    try {
      const fcmToken = await getFcmToken()
      if (!fcmToken) return null
      await registrarTokenPush(fcmToken, getDevicePlatform())
      return fcmToken
    } catch (_) {
      return null
    }
  }

  const refreshUser = async (accessToken) => {
    const token = accessToken || await getToken()
    const nextUser = parseToken(token)
    setUser(nextUser)
    if (nextUser) {
      await registerPushToken()
    }
    return nextUser
  }

  const logout = async () => {
    try {
      const fcmToken = await getFcmToken()
      if (fcmToken) {
        try {
          await eliminarTokenPush(fcmToken)
        } catch (_) {
        }
        await deleteFcmToken()
      }
    } catch (_) {
    }
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
