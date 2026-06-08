import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, Divider,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import LockIcon from '@mui/icons-material/Lock'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CampaignIcon from '@mui/icons-material/Campaign'
import CategoryIcon from '@mui/icons-material/Category'
import BusinessIcon from '@mui/icons-material/Business'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import BugReportIcon from '@mui/icons-material/BugReport'
import LogoutIcon from '@mui/icons-material/Logout'
import SecurityIcon from '@mui/icons-material/Security'
import PaletteIcon from '@mui/icons-material/Palette'
import { useApp } from '../store'

const DRAWER_WIDTH = 260

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Usuarios', path: '/usuarios', icon: <PeopleIcon /> },
  { label: 'Roles', path: '/roles', icon: <LockIcon /> },
  { label: 'Sedes', path: '/sedes', icon: <LocationOnIcon /> },
  { label: 'Campañas', path: '/campanas', icon: <CampaignIcon /> },
  { label: 'Tipos Equipo', path: '/tipos-equipo', icon: <CategoryIcon /> },
  { label: 'Proveedores', path: '/proveedores', icon: <BusinessIcon /> },
  { label: 'Marcas', path: '/marcas', icon: <LocalOfferIcon /> },
  { label: 'Equipos', path: '/equipos', icon: <PrecisionManufacturingIcon /> },
  { label: 'Averías', path: '/averias', icon: <BugReportIcon /> },
]

const devItems = [
  { label: 'Temas', path: '/theme-preview', icon: <PaletteIcon /> },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useApp()
  const isSuperAdmin = user?.rolId === 1

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    window.location.href = '/login?logout=1'
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            bgcolor: 'navigation.background',
            color: 'navigation.text',
            borderRight: 'none',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 2.5, borderBottom: '1px solid', borderColor: 'navigation.divider' }}>
          <SecurityIcon sx={{ color: 'navigation.icon', fontSize: 28 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 15, color: 'navigation.text' }}>
            Control de Equipos de Apilamiento
          </Typography>
        </Box>

        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'navigation.divider' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'navigation.text', fontSize: 13 }}>
            {user?.nombre || 'Invitado'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'navigation.textSecondary', fontSize: 12 }}>
            {user?.rol || ''}
          </Typography>
        </Box>

        <List sx={{ px: 1, py: 1, flex: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: 'navigation.menuItemText',
                '&:hover': { bgcolor: 'navigation.hoverBg', color: 'navigation.hoverText' },
                '&.Mui-selected': {
                  bgcolor: 'navigation.selectedBg',
                  color: 'navigation.selectedText',
                  '&:hover': { bgcolor: 'navigation.selectedHoverBg' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14 }} />
            </ListItemButton>
          ))}
        </List>

        {isSuperAdmin && (
          <>
            <Divider sx={{ borderColor: 'navigation.divider' }} />
            <List sx={{ px: 1, py: 1 }}>
              {devItems.map((item) => (
                <ListItemButton
                  key={item.path}
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2, mb: 0.5,
                    color: 'navigation.devItemText',
                    '&:hover': { bgcolor: 'navigation.devHoverBg', color: 'navigation.devHoverText' },
                    '&.Mui-selected': {
                      bgcolor: 'navigation.devSelectedBg',
                      color: 'navigation.devSelectedText',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 13 }} />
                </ListItemButton>
              ))}
            </List>
          </>
        )}

        <Divider sx={{ borderColor: 'navigation.divider' }} />

        <List sx={{ px: 1, py: 1 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 2, color: 'navigation.menuItemText', '&:hover': { bgcolor: 'navigation.hoverBg', color: 'navigation.hoverText' } }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontSize: 14 }} />
          </ListItemButton>
        </List>
      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontSize: 16, fontWeight: 600 }}>
              {[...menuItems, ...devItems].find((m) => m.path === location.pathname)?.label || 'Control de Equipos de Apilamiento'}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: 3, bgcolor: 'background.default' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
