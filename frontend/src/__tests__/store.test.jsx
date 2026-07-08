import { render, screen, fireEvent } from '@testing-library/react'
import { AppProvider, useApp } from '../store'

function TestComponent() {
  const { user, logout } = useApp()
  return (
    <div>
      <span data-testid="user">{user ? user.nombre : 'no-user'}</span>
      <button data-testid="logout" onClick={logout}>Logout</button>
    </div>
  )
}

describe('AppProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deberia mostrar no-user cuando no hay sesion', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    )
    expect(screen.getByTestId('user').textContent).toBe('no-user')
  })

  it('deberia mostrar el usuario cuando hay token', () => {
    const payload = { nombre: 'Admin Test' }
    const token = `header.${btoa(JSON.stringify(payload))}.signature`
    localStorage.setItem('accessToken', token)

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    )
    expect(screen.getByTestId('user').textContent).toBe('Admin Test')
  })

  it('deberia limpiar sesion al hacer logout', () => {
    const payload = { nombre: 'Admin' }
    const token = `header.${btoa(JSON.stringify(payload))}.signature`
    localStorage.setItem('accessToken', token)

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    )
    expect(screen.getByTestId('user').textContent).toBe('Admin')

    fireEvent.click(screen.getByTestId('logout'))
    expect(screen.getByTestId('user').textContent).toBe('no-user')
  })
})
