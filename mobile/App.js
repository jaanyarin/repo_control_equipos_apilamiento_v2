import React from 'react'
import { StatusBar } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider } from './src/AuthContext'
import AppNavigator from './src/navigation/AppNavigator'
import { ToastProvider } from './src/components/ToastProvider'
import { paperTheme, theme } from './src/theme'

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <ToastProvider>
          <AuthProvider>
            <AppNavigator />
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.action.primary} translucent={false} />
          </AuthProvider>
        </ToastProvider>
      </PaperProvider>
    </SafeAreaProvider>
  )
}
