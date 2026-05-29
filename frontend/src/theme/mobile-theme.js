/**
 * Vanguard Design Tokens
 *
 * Fuente de verdad única para web y mobile.
 * Los valores provienen del archivo Figma "Vanguard - Sistema de Diseño v1".
 *
 * Uso en React Native (Expo):
 *
 *   import tokens from '../theme/design-tokens.json'
 *
 *   const theme = {
 *     colors: { ...tokens.color, ...tokens.background, ...tokens.text },
 *     fonts: tokens.typography,
 *     dark: {
 *       colors: { ...tokens.dark.color, ...tokens.dark.background, ...tokens.dark.text },
 *     },
 *   }
 *
 * Uso con styled-components:
 *
 *   const Button = styled.TouchableOpacity`
 *     background-color: ${props => props.theme.colors.primary.main};
 *     border-radius: ${props => props.theme.shape.borderRadius}px;
 *   `
 */
export const lightTheme = {
  colors: {
    primary: '#558BA5',
    primaryLight: '#A8CFE0',
    primaryLighter: '#D6E8EF',
    primaryDark: '#3E6D83',
    primaryDarker: '#2B4F60',
    secondary: '#30586B',
    secondaryLight: '#8CC5D2',
    secondaryLighter: '#DCF5F7',
    secondaryDark: '#18354D',
    secondaryDarker: '#091A33',
    info: '#3B82F6',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    grey50: '#FAFBFC',
    grey100: '#F7F9FA',
    grey200: '#E8EDF2',
    grey300: '#D4DAE0',
    grey400: '#B5BEC8',
    grey500: '#8A95A3',
    grey600: '#5E6B78',
    grey700: '#4A5460',
    grey800: '#3C4651',
    grey900: '#262E36',
    background: '#F7F9FA',
    surface: '#FFFFFF',
    surface2: '#F0F3F7',
    textPrimary: '#262E36',
    textSecondary: '#5E6B78',
    textDisabled: '#B5BEC8',
    divider: 'rgba(0,0,0,0.08)',
  },
  fonts: {
    family: 'Poppins',
    h1: { size: 64, weight: '800', lineHeight: 80 },
    h2: { size: 48, weight: '800', lineHeight: 64 },
    h3: { size: 32, weight: '700', lineHeight: 48 },
    h4: { size: 24, weight: '700', lineHeight: 36 },
    h5: { size: 18, weight: '700', lineHeight: 28 },
    h6: { size: 18, weight: '600', lineHeight: 28 },
    body: { size: 14, weight: '400', lineHeight: 22 },
    caption: { size: 12, weight: '400', lineHeight: 18 },
  },
  borderRadius: 8,
}

export const darkTheme = {
  colors: {
    primary: '#6BB5D0',
    primaryLight: '#A8CFE0',
    primaryLighter: '#D6E8EF',
    primaryDark: '#3E6D83',
    primaryDarker: '#2B4F60',
    secondary: '#5BA0B8',
    secondaryLight: '#8CC5D2',
    secondaryLighter: '#DCF5F7',
    secondaryDark: '#18354D',
    secondaryDarker: '#091A33',
    info: '#64B5F6',
    success: '#34D36E',
    warning: '#FFB74D',
    error: '#F06363',
    grey50: '#1A1D24',
    grey100: '#262E36',
    grey200: '#3C4651',
    grey300: '#4A5460',
    grey400: '#5E6B78',
    grey500: '#8A95A3',
    grey600: '#B5BEC8',
    grey700: '#D4DAE0',
    grey800: '#E8EDF2',
    grey900: '#F7F9FA',
    background: '#12131A',
    surface: '#1C1E26',
    surface2: '#262933',
    textPrimary: '#E8EDF2',
    textSecondary: '#9AA4B2',
    textDisabled: '#5E6B78',
    divider: 'rgba(255,255,255,0.08)',
  },
  fonts: { ...lightTheme.fonts },
  borderRadius: 8,
}
