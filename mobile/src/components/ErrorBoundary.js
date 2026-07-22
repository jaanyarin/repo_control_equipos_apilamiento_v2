import { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Button, IconButton } from 'react-native-paper'
import { theme } from '../theme'

class ErrorBoundaryImpl extends Component {
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
          <IconButton icon="alert" size={56} iconColor={theme.colors.status.error} />
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

export default function ErrorBoundary({ children }) {
  return <ErrorBoundaryImpl>{children}</ErrorBoundaryImpl>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[6],
    backgroundColor: theme.colors.background.page,
  },
  title: {
    ...theme.typography.subtitle1,
    marginBottom: theme.spacing[2],
    color: theme.colors.status.error,
  },
  message: {
    textAlign: 'center',
    ...theme.typography.body2,
    marginBottom: theme.spacing[6],
    color: theme.colors.text.secondary,
  },
  button: {
    borderRadius: theme.radius.sm,
  },
})
