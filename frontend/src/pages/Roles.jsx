import { useState, useEffect } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert,
} from '@mui/material'
import api from '../api'
import RoleChip from '../components/RoleChip'

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

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Box>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: 24 }}>Tabla de Roles</Typography>
      </Box>

      {roles.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>No hay roles registrados</Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.id}</TableCell>
                  <TableCell><RoleChip roleName={r.nombre} /></TableCell>
                  <TableCell>{r.descripcion || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
