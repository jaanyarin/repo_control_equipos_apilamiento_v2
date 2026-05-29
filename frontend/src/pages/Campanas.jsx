import { useState, useEffect, useCallback } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, Tooltip,
  CircularProgress, Alert, Chip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AddIcon from '@mui/icons-material/Add'
import api from '../api'

export default function Campanas() {
  const [campanas, setCampanas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ nombre: '', codigo: '', fechaInicio: '', fechaFin: '' })
  const [saving, setSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [campanaToDelete, setCampanaToDelete] = useState(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.get('/campanas').then((r) => r.data || r)
      data.sort((a, b) => a.id - b.id)
      setCampanas(data)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const openCreate = () => {
    setEditing(null)
    setFormData({ nombre: '', fechaInicio: '', fechaFin: '' })
    setDialogOpen(true)
  }

  const openEdit = (campana) => {
    setEditing(campana)
    setFormData({
      nombre: campana.nombre,
      fechaInicio: campana.fechaInicio ? campana.fechaInicio.slice(0, 16) : '',
      fechaFin: campana.fechaFin ? campana.fechaFin.slice(0, 16) : '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      const payload = {
        nombre: formData.nombre,
        fechaInicio: formData.fechaInicio ? new Date(formData.fechaInicio).toISOString() : null,
        fechaFin: formData.fechaFin ? new Date(formData.fechaFin).toISOString() : null,
      }
      if (editing) {
        await api.put(`/campanas/${editing.id}`, payload)
      } else {
        await api.post('/campanas', payload)
      }
      setDialogOpen(false)
      loadData()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleActivar = async (id) => {
    try {
      await api.post(`/campanas/${id}/activar`)
      loadData()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  const handleCerrar = async (id) => {
    try {
      await api.post(`/campanas/${id}/cerrar`)
      loadData()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  const openDelete = (campana) => {
    setCampanaToDelete(campana)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!campanaToDelete) return
    try {
      await api.delete(`/campanas/${campanaToDelete.id}`)
      setDeleteDialogOpen(false)
      setCampanaToDelete(null)
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
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: 24 }}>Campañas Operativas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Nueva Campaña
        </Button>
      </Box>

      {campanas.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          No hay campañas registradas
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Código</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fecha Inicio</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fecha Fin</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campanas.map((c) => (
                <TableRow
                  key={c.id}
                  hover
                  sx={c.estadoActivo ? { bgcolor: 'success.lighter', '&:hover': { bgcolor: 'success.light' } } : {}}
                >
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.nombre}</TableCell>
                  <TableCell>{c.codigo}</TableCell>
                  <TableCell>
                    {c.fechaInicio ? new Date(c.fechaInicio).toLocaleDateString('es-PE') : '-'}
                  </TableCell>
                  <TableCell>
                    {c.fechaFin ? new Date(c.fechaFin).toLocaleDateString('es-PE') : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={c.estadoActivo ? 'Activa' : 'Cerrada'}
                      size="small"
                      color={c.estadoActivo ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    {c.estadoActivo ? (
                      <Tooltip title="Cerrar campaña">
                        <IconButton size="small" onClick={() => handleCerrar(c.id)}>
                          <CancelIcon fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Activar campaña">
                        <IconButton size="small" onClick={() => handleActivar(c.id)}>
                          <CheckCircleIcon fontSize="small" color="success" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Eliminar">
                      <IconButton size="small" onClick={() => openDelete(c)}>
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => openEdit(c)}>
                        <EditIcon fontSize="small" color="primary" />
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
        <DialogTitle>{editing ? 'Editar Campaña' : 'Nueva Campaña'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Campaña"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Fecha Inicio"
              type="datetime-local"
              value={formData.fechaInicio}
              onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Fecha Fin"
              type="datetime-local"
              value={formData.fechaFin}
              onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
              size="small"
              InputLabelProps={{ shrink: true }}
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
            ¿Estás seguro de eliminar la campaña <strong>{campanaToDelete?.nombre}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteDialogOpen(false); setCampanaToDelete(null) }}>
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
