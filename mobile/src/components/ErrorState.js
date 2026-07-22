import React from 'react'
import EmptyState from './EmptyState'

export default function ErrorState({ title = 'Sin conexión con el servidor', message = 'Verifica tu red o la dirección configurada e inténtalo nuevamente.', onRetry }) {
  return <EmptyState icon="server-network-off" title={title} subtitle={message} actionLabel={onRetry ? 'Reintentar' : undefined} onAction={onRetry} tone="error" />
}
