import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Snackbar } from 'react-native-paper'
import { theme } from '../theme'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const showToast = useCallback((message, tone = 'info', duration) => {
    const durations = { success: 3000, info: 3500, warning: 4000, error: 6000 }
    setToast({ message, tone, duration: duration || durations[tone] || durations.info })
  }, [])
  const value = useMemo(() => ({ showToast }), [showToast])
  const backgroundColor = toast ? (theme.colors.status[toast.tone] || theme.colors.action.primary) : theme.colors.action.primary
  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar visible={Boolean(toast)} duration={toast?.duration} onDismiss={() => setToast(null)} style={{ backgroundColor }} action={{ label: 'Cerrar', onPress: () => setToast(null) }}>
        {toast?.message}
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast debe usarse dentro de ToastProvider')
  return context
}
