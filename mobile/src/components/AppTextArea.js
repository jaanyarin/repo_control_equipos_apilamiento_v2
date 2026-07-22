import React from 'react'
import AppInput from './AppInput'

export default function AppTextArea(props) {
  return <AppInput {...props} multiline numberOfLines={5} contentStyle={{ minHeight: 112, textAlignVertical: 'top' }} />
}
