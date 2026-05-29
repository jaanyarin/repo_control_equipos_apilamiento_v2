import { createTheme } from '@mui/material/styles'
import tokens from './design-tokens.json'

function buildTheme(mode) {
  const t = mode === 'dark' ? tokens.dark : tokens
  return createTheme({
    palette: {
      mode,
      primary: { ...t.color.primary, contrastText: mode === 'dark' ? '#0F1419' : '#FFFFFF' },
      secondary: { ...t.color.secondary, contrastText: mode === 'dark' ? '#0F1419' : '#FFFFFF' },
      info: { ...t.color.info, contrastText: mode === 'dark' ? '#0F1419' : '#FFFFFF' },
      success: { ...t.color.success, contrastText: mode === 'dark' ? '#0F1419' : '#FFFFFF' },
      warning: { ...t.color.warning, contrastText: mode === 'dark' ? '#0F1419' : '#FFFFFF' },
      error: { ...t.color.error, contrastText: mode === 'dark' ? '#0F1419' : '#FFFFFF' },
      grey: t.color.grey,
      background: t.background,
      text: t.text,
      divider: t.divider,
      action: t.action,
      navigation: tokens.navigation,
    },
    typography: tokens.typography,
    shape: tokens.shape,
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: tokens.shape.borderRadius, textTransform: 'none', fontWeight: 600 },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: { '& .MuiOutlinedInput-root': { borderRadius: tokens.shape.borderRadius } },
        },
      },
      MuiChip: {
        styleOverrides: { root: { borderRadius: 6 } },
      },
      MuiCard: {
        styleOverrides: { root: { borderRadius: 12 } },
      },
      MuiAlert: {
        styleOverrides: { root: { borderRadius: tokens.shape.borderRadius } },
      },
    },
  })
}

export function createAppTheme(mode) {
  return buildTheme(mode)
}

const theme = buildTheme('light')
export default theme
