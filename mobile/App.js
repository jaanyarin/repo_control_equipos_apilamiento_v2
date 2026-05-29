import React from 'react'
import { PaperProvider, MD3LightTheme } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from './src/AuthContext'
import LoginScreen from './src/LoginScreen'

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1565C0',
    secondary: '#0D47A1',
  },
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <LoginScreen />
          <StatusBar style="light" />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  )
}
