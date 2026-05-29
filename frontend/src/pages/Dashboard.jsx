import { Box, Paper, Typography } from '@mui/material'

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, fontSize: 24 }}>
        Dashboard
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Bienvenido al Sistema de Control de Equipos de Apilamiento.
          Seleccione un módulo en el menú lateral para comenzar.
        </Typography>
      </Paper>
    </Box>
  )
}
