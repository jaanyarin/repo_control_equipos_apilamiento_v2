import { useState, useEffect, useCallback } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, Tooltip,
  CircularProgress, Alert,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import api from '../api'

export default function Sedes() {
  const [sedes, setSedes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ nombre: '', codigo: '', direccion: '' })
  const [saving, setSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sedeToDelete, setSedeToDelete] = useState(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.get('/sedes').then((r) => r.data || r)
      data.sort((a, b) => a.id - b.id)
      setSedes(data)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const openCreate = () => {
    setEditing(null)
    setFormData({ nombre: '' })
    setDialogOpen(true)
  }

  const openEdit = (sede) => {
    setEditing(sede)
    setFormData({ nombre: sede.nombre })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/sedes/${editing.id}`, formData)
      } else {
        await api.post('/sedes', formData)
      }
      setDialogOpen(false)
      loadData()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    } finally {
      setSaving(false)
    }
  }

  const openDelete = (sede) => {
    setSedeToDelete(sede)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!sedeToDelete) return
    try {
      await api.delete(`/sedes/${sedeToDelete.id}`)
      setDeleteDialogOpen(false)
      setSedeToDelete(null)
      loadData()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: 24 }}>Sedes Operativas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Nueva Sede
        </Button>
      </Box>

      {sedes.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          No hay sedes registradas
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Código</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Dirección</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Activo</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sedes.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.nombre}</TableCell>
                  <TableCell>{s.codigo}</TableCell>
                  <TableCell>{s.direccion || '-'}</TableCell>
                  <TableCell>{s.estadoActivo ? 'Sí' : 'No'}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => openEdit(s)}>
                        <EditIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" onClick={() => openDelete(s)}>
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar Sede' : 'Nueva Sede'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Sede"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              fullWidth
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={20} sx={{ mr: 0.5 }} /> : null}
            {editing ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar la sede <strong>{sedeToDelete?.nombre}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteDialogOpen(false); setSedeToDelete(null) }}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
