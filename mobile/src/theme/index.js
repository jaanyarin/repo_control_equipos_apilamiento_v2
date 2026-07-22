import { MD3LightTheme } from 'react-native-paper'

export const primaryColors = {
  greyLighter: '#D4D6D9',
  greyLight: '#A7ACB1',
  greyDark: '#80878E',
  greyDarker: '#59626B',
  greyMain: '#3C4651',
  blueLighter: '#DDE8ED',
  blueLight: '#B8CED9',
  blueDark: '#96B7C7',
  blueDarker: '#74A0B5',
  blueMain: '#558BA5',
}

export const secondaryColors = {
  teal: '#30586B',
  blue: '#6BA6C2',
  sky: '#B3E1F8',
  ice: '#F5FCFF',
  wine: '#9F4F64',
  red: '#D7594E',
  orange: '#DB9647',
  yellow: '#F2CF68',
  lime: '#95BA21',
  green: '#54904C',
}

export const neutralColors = {
  100: '#F7F9FA',
  200: '#E8EDF2',
  300: '#D4DAE0',
  400: '#B5BEC8',
  500: '#8A95A3',
  600: '#5E6B78',
  700: '#4A5460',
  800: '#3C4651',
  900: '#262E36',
  white: '#FFFFFF',
  black: '#000000',
}

export const colors = {
  background: {
    default: neutralColors.white,
    page: neutralColors[100],
    paper: neutralColors.white,
    neutral: neutralColors[200],
    elevated: neutralColors.white,
    authOverlay: 'rgba(255,255,255,0.94)',
    backdrop: 'rgba(22,28,36,0.48)',
  },
  text: {
    primary: primaryColors.greyMain,
    secondary: neutralColors[600],
    tertiary: neutralColors[500],
    disabled: neutralColors[500],
    inverse: neutralColors.white,
    link: primaryColors.blueMain,
  },
  border: {
    default: neutralColors[300],
    subtle: neutralColors[200],
    strong: primaryColors.greyLight,
    focus: primaryColors.greyMain,
    error: secondaryColors.red,
  },
  action: {
    primary: primaryColors.greyMain,
    primaryHover: neutralColors[700],
    primaryPressed: neutralColors[900],
    secondary: primaryColors.blueMain,
    secondaryHover: primaryColors.blueDarker,
    disabled: neutralColors[300],
  },
  status: {
    info: secondaryColors.blue,
    infoBackground: primaryColors.blueLighter,
    success: secondaryColors.green,
    successBackground: '#E7F2E5',
    warning: secondaryColors.orange,
    warningBackground: '#FAEBD8',
    error: secondaryColors.red,
    errorBackground: '#FBE4E2',
    neutral: neutralColors[500],
    neutralBackground: neutralColors[200],
  },
}

export const fontFamily = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
}

export const typography = {
  display: { fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 40 },
  h1: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 36 },
  h2: { fontFamily: fontFamily.bold, fontSize: 24, lineHeight: 32 },
  h3: { fontFamily: fontFamily.semiBold, fontSize: 20, lineHeight: 28 },
  h4: { fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 26 },
  subtitle1: { fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 24 },
  subtitle2: { fontFamily: fontFamily.semiBold, fontSize: 14, lineHeight: 22 },
  body1: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 22 },
  body2: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 20 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 18 },
  button: { fontFamily: fontFamily.semiBold, fontSize: 14, lineHeight: 20 },
  title: { fontFamily: fontFamily.semiBold, fontSize: 20, lineHeight: 28 },
  subtitle: { fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 24 },
  body: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 22 },
}

export const spacing = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 }
export const radius = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, pill: 999 }
export const breakpoints = { compact: 360, medium: 480, expanded: 768 }

export const shadows = {
  z1: { shadowColor: neutralColors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 2, elevation: 2 },
  z2: { shadowColor: neutralColors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 8, elevation: 4 },
  modal: { shadowColor: neutralColors.black, shadowOffset: { width: -20, height: 20 }, shadowOpacity: 0.24, shadowRadius: 40, elevation: 12 },
}

export const statusStyles = {
  pending: { color: colors.status.warning, backgroundColor: colors.status.warningBackground, label: 'Pendiente' },
  approved: { color: colors.status.success, backgroundColor: colors.status.successBackground, label: 'Aprobado' },
  active: { color: colors.status.success, backgroundColor: colors.status.successBackground, label: 'Operativo' },
  fault: { color: colors.status.error, backgroundColor: colors.status.errorBackground, label: 'Averiado' },
  cancelled: { color: colors.status.neutral, backgroundColor: colors.status.neutralBackground, label: 'Anulado' },
  info: { color: secondaryColors.teal, backgroundColor: colors.status.infoBackground, label: 'Información' },
}

export const cardStyle = {
  backgroundColor: colors.background.paper,
  borderRadius: radius.md,
  borderWidth: 1,
  borderColor: colors.border.subtle,
  padding: spacing[4],
}

const paperFonts = Object.fromEntries(
  Object.entries(MD3LightTheme.fonts).map(([variant, value]) => {
    const family = variant.toLowerCase().includes('bold')
      ? fontFamily.bold
      : variant.toLowerCase().includes('medium') || variant.toLowerCase().includes('title') || variant.toLowerCase().includes('label')
        ? fontFamily.semiBold
        : fontFamily.regular
    return [variant, { ...value, fontFamily: family, fontWeight: 'normal' }]
  }),
)

export const paperTheme = {
  ...MD3LightTheme,
  roundness: radius.sm,
  fonts: paperFonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.action.primary,
    onPrimary: colors.text.inverse,
    primaryContainer: primaryColors.blueLighter,
    onPrimaryContainer: colors.text.primary,
    secondary: colors.action.secondary,
    onSecondary: colors.text.inverse,
    secondaryContainer: primaryColors.blueLighter,
    onSecondaryContainer: secondaryColors.teal,
    error: colors.status.error,
    onError: colors.text.inverse,
    errorContainer: colors.status.errorBackground,
    background: colors.background.page,
    surface: colors.background.paper,
    surfaceVariant: colors.background.neutral,
    outline: colors.border.default,
    outlineVariant: colors.border.subtle,
    onSurface: colors.text.primary,
    onSurfaceVariant: colors.text.secondary,
  },
}

export const theme = { colors, primaryColors, secondaryColors, neutralColors, typography, fontFamily, spacing, radius, shadows, breakpoints, statusStyles, cardStyle }

export default theme
