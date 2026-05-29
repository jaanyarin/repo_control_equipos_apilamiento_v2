import { Chip, useTheme } from '@mui/material'

export default function RoleChip({ roleName }) {
  const theme = useTheme()
  const chipConfig = {
    'Super Admin': { bgcolor: theme.palette.success.light, color: theme.palette.success.darker, label: 'Super Admin' },
    Admin: { bgcolor: theme.palette.primary.light, color: theme.palette.primary.darker, label: 'Admin' },
    Usuario: { bgcolor: theme.palette.warning.light, color: theme.palette.warning.darker, label: 'Usuario' },
  }
  const config = chipConfig[roleName] || chipConfig['Usuario']
  return (
    <Chip
      label={config.label}
      size="small"
      sx={{ bgcolor: config.bgcolor, color: config.color, fontWeight: 500, fontSize: 12 }}
    />
  )
}
