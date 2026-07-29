import { useState, useEffect } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import api from '../api'
import RoleChip from '../components/RoleChip'
import DataTable from '../components/DataTable'

export default function Roles() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const data = await api.get('/roles').then((r) => r.data || r)
        data.sort((a, b) => a.id - b.id)
        setRoles(data)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const columns = [
    { field: 'id', label: 'ID' },
    { field: 'nombre', label: 'Nombre', render: (row) => <RoleChip roleName={row.nombre} /> },
    { field: 'descripcion', label: 'Descripción', render: (row) => row.descripcion || '-' },
  ]

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Box>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: 20, md: 24 } }}>Roles</Typography>
      </Box>

      <DataTable
        columns={columns}
        data={roles}
        loading={false}
        error={null}
        emptyMessage="No hay roles registrados"
      />
    </Box>
  )
}
