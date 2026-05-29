import { useState, useMemo } from 'react'
import {
  createTheme, ThemeProvider, CssBaseline, useTheme, Box, Typography, Button, TextField,
  Switch, Checkbox, Chip, Card, CardContent, Divider, Stack,
  Slider, Radio, RadioGroup, ToggleButtonGroup, ToggleButton,
  FormControlLabel, Badge, Avatar, LinearProgress, Alert,
} from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import tokens from '../theme/design-tokens.json'

function makePalette(mode) {
  const t = mode === 'dark' ? tokens.dark : tokens
  return {
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
  }
}

function SwatchCard({ label, hex, isDark }) {
  const copy = () => navigator.clipboard?.writeText(hex)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 100 }}>
      <Box
        onClick={copy}
        sx={{
          width: '100%', height: 48, borderRadius: 1.5, bgcolor: hex,
          border: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.15s', '&:hover': { transform: 'scale(1.05)' },
        }}
      >
        <ContentCopyIcon sx={{ fontSize: 14, opacity: 0.5, color: isDark && parseInt(hex.slice(1), 16) > 0x666666 ? '#fff' : '#000' }} />
      </Box>
      <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{label}</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>{hex}</Typography>
    </Box>
  )
}

function ColorPaletteSection({ title, colors, isDark }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>{title}</Typography>
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        <SwatchCard label="Lighter" hex={colors.lighter} isDark={isDark} />
        <SwatchCard label="Light" hex={colors.light} isDark={isDark} />
        <SwatchCard label="Main" hex={colors.main} isDark={isDark} />
        <SwatchCard label="Dark" hex={colors.dark} isDark={isDark} />
        <SwatchCard label="Darker" hex={colors.darker} isDark={isDark} />
      </Stack>
    </Box>
  )
}

function GreyScaleSection({ greys, isDark }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Grey Scale</Typography>
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        {Object.entries(greys).map(([key, hex]) => (
          <SwatchCard key={key} label={`Grey ${key}`} hex={hex} isDark={isDark} />
        ))}
      </Stack>
    </Box>
  )
}

function TypographySection({ mode }) {
  const samples = [
    { variant: 'h1', text: 'Vanguard Heading 1' },
    { variant: 'h2', text: 'Vanguard Heading 2' },
    { variant: 'h3', text: 'Vanguard Heading 3' },
    { variant: 'h4', text: 'Vanguard Heading 4' },
    { variant: 'h5', text: 'Vanguard Heading 5' },
    { variant: 'h6', text: 'Vanguard Heading 6' },
    { variant: 'subtitle1', text: 'Subtitle 1 — Lorem ipsum dolor sit amet' },
    { variant: 'subtitle2', text: 'Subtitle 2 — Lorem ipsum dolor sit amet' },
    { variant: 'body1', text: 'Body 1 — Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { variant: 'body2', text: 'Body 2 — Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { variant: 'caption', text: 'Caption — Lorem ipsum dolor sit amet' },
    { variant: 'button', text: 'Button Text' },
  ]
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Typography — Poppins</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {samples.map((s) => (
          <Box key={s.variant} sx={{ py: 1.5, px: 2, borderRadius: 1.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant={s.variant}>{s.text}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>{s.variant}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function ComponentShowcase() {
  const theme = useTheme()
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Componentes</Typography>
      <Card variant="outlined" sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>BUTTONS</Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Button variant="contained" color="primary">Primary</Button>
            <Button variant="contained" color="secondary">Secondary</Button>
            <Button variant="contained" color="success">Success</Button>
            <Button variant="contained" color="warning">Warning</Button>
            <Button variant="contained" color="error">Error</Button>
            <Button variant="contained" color="info">Info</Button>
            <Button variant="outlined" color="primary">Outlined</Button>
            <Button variant="text" color="primary">Text</Button>
          </Stack>
        </Box>
        <Divider />
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>TEXT FIELD</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <TextField label="Outlined" variant="outlined" size="small" sx={{ minWidth: 200 }} />
            <TextField label="Filled" variant="filled" size="small" sx={{ minWidth: 200 }} />
            <TextField label="Standard" variant="standard" size="small" sx={{ minWidth: 200 }} />
          </Stack>
          <Box sx={{ mt: 2 }}>
            <TextField label="With error" variant="outlined" size="small" error helperText="Campo requerido" sx={{ minWidth: 200 }} />
          </Box>
        </Box>
        <Divider />
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>SELECTION CONTROLS</Typography>
          <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" useFlexGap>
            <FormControlLabel control={<Checkbox defaultChecked color="primary" />} label="Primary" />
            <FormControlLabel control={<Checkbox defaultChecked color="secondary" />} label="Secondary" />
            <FormControlLabel control={<Checkbox defaultChecked color="success" />} label="Success" />
            <FormControlLabel control={<Checkbox defaultChecked color="error" />} label="Error" />
            <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Switch" />
          </Stack>
          <Box sx={{ mt: 1.5 }}>
            <RadioGroup row defaultValue="1">
              <FormControlLabel value="1" control={<Radio color="primary" />} label="Option 1" />
              <FormControlLabel value="2" control={<Radio color="primary" />} label="Option 2" />
              <FormControlLabel value="3" control={<Radio color="primary" />} label="Option 3" />
            </RadioGroup>
          </Box>
        </Box>
        <Divider />
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>CHIPS</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label="Default" />
            <Chip label="Primary" color="primary" />
            <Chip label="Secondary" color="secondary" />
            <Chip label="Success" color="success" />
            <Chip label="Warning" color="warning" />
            <Chip label="Error" color="error" />
            <Chip label="Info" color="info" />
            <Chip label="Outlined" variant="outlined" color="primary" />
            <Chip label="Avatar" avatar={<Avatar>V</Avatar>} color="primary" />
          </Stack>
        </Box>
        <Divider />
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>ALERTS & PROGRESS</Typography>
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Alert severity="success">Success alert — operación completada</Alert>
            <Alert severity="info">Info alert — información importante</Alert>
            <Alert severity="warning">Warning alert — advertencia</Alert>
            <Alert severity="error">Error alert — algo salió mal</Alert>
          </Stack>
          <LinearProgress variant="determinate" value={65} sx={{ mb: 1 }} />
          <LinearProgress color="success" variant="determinate" value={80} sx={{ mb: 1 }} />
          <LinearProgress color="warning" variant="determinate" value={45} sx={{ mb: 1 }} />
          <LinearProgress color="error" variant="determinate" value={30} />
        </Box>
        <Divider />
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>CARD</Typography>
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Card Title</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Sample card showing how the theme applies to Card components.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" size="small" color="primary">Action</Button>
                <Button variant="outlined" size="small" color="primary">Cancel</Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        <Divider />
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>SLIDER & BADGE</Typography>
          <Slider defaultValue={50} color="primary" sx={{ maxWidth: 300 }} />
          <Slider defaultValue={[20, 60]} color="secondary" sx={{ maxWidth: 300 }} />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Badge badgeContent={4} color="primary"><Avatar>U</Avatar></Badge>
            <Badge badgeContent={8} color="secondary"><Avatar>U</Avatar></Badge>
            <Badge badgeContent={12} color="error"><Avatar>U</Avatar></Badge>
            <Badge badgeContent={3} color="success"><Avatar>U</Avatar></Badge>
          </Stack>
        </Box>
      </Card>
    </Box>
  )
}

function BackgroundSection({ isDark }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Superficies y Fondos</Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <Box sx={{ flex: 1, minWidth: 150, p: 3, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }} color="text.primary">background.default</Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: 150, p: 3, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }} color="text.primary">background.paper</Typography>
        </Box>
        {isDark && (
            <Box sx={{ flex: 1, minWidth: 150, p: 3, borderRadius: 2, bgcolor: 'background.surface2', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }} color="text.primary">surface2 (elevated)</Typography>
          </Box>
        )}
      </Stack>
      <Box sx={{ mt: 2, p: 3, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.primary">text.primary — Lorem ipsum dolor sit amet</Typography>
        <Typography variant="body2" color="text.secondary">text.secondary — Lorem ipsum dolor sit amet</Typography>
        <Typography variant="body2" color="text.disabled">text.disabled — Lorem ipsum dolor sit amet</Typography>
      </Box>
    </Box>
  )
}

function ShadowSection() {
  const theme = useTheme()
  const shadows = theme.shadows.slice(1, 10)
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Sombras</Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {shadows.map((s, i) => (
          <Box
            key={i}
            sx={{
              width: 100, height: 60, borderRadius: 1.5, bgcolor: 'background.paper',
              boxShadow: i + 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid', borderColor: 'divider',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{i + 1}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

export default function ThemePreview() {
  const [mode, setMode] = useState('light')
  const isDark = mode === 'dark'

  const theme = useMemo(() => createTheme({
    palette: { mode, ...makePalette(mode) },
    typography: tokens.typography,
    shape: tokens.shape,
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 } } },
      MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 8 } } } },
      MuiChip: { styleOverrides: { root: { borderRadius: 6 } } },
      MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
      MuiAlert: { styleOverrides: { root: { borderRadius: 8 } } },
    },
  }), [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ px: { xs: 2, md: 4 }, py: 3, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Temas</Typography>
            <Typography variant="body2" color="text.secondary">Vanguard Design System — Modo {isDark ? 'Oscuro' : 'Claro'}</Typography>
          </Box>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, v) => v && setMode(v)}
            size="small"
          >
            <ToggleButton value="light"><LightModeIcon sx={{ fontSize: 18, mr: 0.5 }} />Claro</ToggleButton>
            <ToggleButton value="dark"><DarkModeIcon sx={{ fontSize: 18, mr: 0.5 }} />Oscuro</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Preview del sistema de diseño Vanguard. Usa el toggle para alternar entre modo claro y oscuro.
          </Typography>
        </Box>

        <BackgroundSection isDark={isDark} />
        <Divider sx={{ mb: 4 }} />
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 800 }}>Paleta de Colores</Typography>
        <ColorPaletteSection title="Primary" colors={makePalette(mode).primary} isDark={isDark} />
        <ColorPaletteSection title="Secondary" colors={makePalette(mode).secondary} isDark={isDark} />
        <ColorPaletteSection title="Info" colors={makePalette(mode).info} isDark={isDark} />
        <ColorPaletteSection title="Success" colors={makePalette(mode).success} isDark={isDark} />
        <ColorPaletteSection title="Warning" colors={makePalette(mode).warning} isDark={isDark} />
        <ColorPaletteSection title="Error" colors={makePalette(mode).error} isDark={isDark} />
        <Divider sx={{ mb: 4 }} />
        <GreyScaleSection greys={makePalette(mode).grey} isDark={isDark} />
        <Divider sx={{ mb: 4 }} />
        <TypographySection mode={mode} />
        <Divider sx={{ mb: 4 }} />
        <ShadowSection />
        <Divider sx={{ mb: 4 }} />
        <ComponentShowcase />
      </Box>
    </ThemeProvider>
  )
}
