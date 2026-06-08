import { useNavigate } from 'react-router-dom'
import { Box, Typography, Card, CardActionArea, CardContent, Grid } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import BugReportIcon from '@mui/icons-material/BugReport'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useApp } from '../store'

const actions = [
  { label: 'Ingreso de PSR y OSR', icon: <AssignmentIcon sx={{ fontSize: 48 }} />, path: '/campanas', roles: ['Super Admin', 'Admin'] },
  { label: 'Ingreso de Equipo', icon: <PrecisionManufacturingIcon sx={{ fontSize: 48 }} />, path: '/equipos', roles: ['Super Admin', 'Admin', 'Usuario'] },
  { label: 'Registro de Avería', icon: <BugReportIcon sx={{ fontSize: 48 }} />, path: '/averias', roles: ['Super Admin', 'Admin', 'Usuario'] },
  { label: 'Detalles de Equipo', icon: <InfoIcon sx={{ fontSize: 48 }} />, path: '/equipos', roles: ['Super Admin', 'Admin', 'Usuario'] },
  { label: 'Finalización del Servicio', icon: <CheckCircleIcon sx={{ fontSize: 48 }} />, path: '/campanas', roles: ['Super Admin', 'Admin', 'Usuario'] },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useApp()
  const userRole = user?.rol || ''

  const visibleActions = actions.filter(a => a.roles.includes(userRole))

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Panel Principal
      </Typography>
      <Grid container spacing={3}>
        {visibleActions.map(action => (
          <Grid item xs={12} sm={6} md={4} key={action.label}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardActionArea onClick={() => navigate(action.path)} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                {action.icon}
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, textAlign: 'center' }}>
                    {action.label}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
