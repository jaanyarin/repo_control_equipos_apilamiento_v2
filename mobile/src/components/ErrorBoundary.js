import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Button, IconButton } from 'react-native-paper'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <IconButton icon="alert" size={64} iconColor="#d32f2f" />
          <Text variant="titleMedium" style={styles.title}>
            Algo salió mal
          </Text>
          <Text variant="bodySmall" style={styles.message}>
            {this.state.error?.message || 'Ocurrió un error inesperado.'}
          </Text>
          <Button mode="contained" onPress={this.handleRetry} style={styles.button}>
            Reintentar
          </Button>
        </View>
      )
    }
    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontWeight: 700,
    marginBottom: 8,
    color: '#d32f2f',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  button: {
    borderRadius: 8,
  },
})
