import React from 'react'
import { Text } from 'react-native'
import { render } from '@testing-library/react-native'
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView'

describe('KeyboardAwareScrollView', () => {
  it('renderiza a los hijos dentro del ScrollView', () => {
    const { getByText } = render(
      <KeyboardAwareScrollView>
        <Text>Contenido</Text>
      </KeyboardAwareScrollView>
    )
    expect(getByText('Contenido')).toBeTruthy()
  })

  it('respeta la prop behavior explicitamente', () => {
    const { UNSAFE_getByType } = render(
      <KeyboardAwareScrollView behavior="padding">
        <Text>Contenido</Text>
      </KeyboardAwareScrollView>
    )
    const keyboardAvoidingView = UNSAFE_getByType(
      require('react-native').KeyboardAvoidingView
    )
    expect(keyboardAvoidingView.props.behavior).toBe('padding')
    expect(keyboardAvoidingView.props.keyboardVerticalOffset).toBe(0)
  })

  it('configura keyboardShouldPersistTaps en handled por defecto', () => {
    const { UNSAFE_getByType } = render(
      <KeyboardAwareScrollView>
        <Text>Contenido</Text>
      </KeyboardAwareScrollView>
    )
    const scrollView = UNSAFE_getByType(require('react-native').ScrollView)
    expect(scrollView.props.keyboardShouldPersistTaps).toBe('handled')
  })
})
