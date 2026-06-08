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

export default function Averias() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ equipoId: '', descripcionFalla: '', fechaHoraAveria: '' })
  const [saving, setSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.get('/averias').then((r) => r.data || r)
      data.sort((a, b) => a.id - b.id)
      setItems(data)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const openCreate = () => {
    setEditing(null)
    setFormData({ equipoId: '', descripcionFalla: '', fechaHoraAveria: '' })
    setDialogOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setFormData({
      equipoId: item.equipoId || '',
      descripcionFalla: item.descripcionFalla || '',
      fechaHoraAveria: item.fechaHoraAveria || '',
      fechaHoraAtencion: item.fechaHoraAtencion || '',
      accionRealizada: item.accionRealizada || '',
      estadoAveria: item.estadoAveria || '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      if (editing) {
        const payload = {
          equipoId: formData.equipoId,
          descripcionFalla: formData.descripcionFalla,
          fechaHoraAveria: formData.fechaHoraAveria,
          fechaHoraAtencion: formData.fechaHoraAtencion,
          accionRealizada: formData.accionRealizada,
          estadoAveria: formData.estadoAveria,
        }
        await api.put(`/averias/${editing.id}`, payload)
      } else {
        await api.post('/averias', {
          equipoId: formData.equipoId,
          descripcionFalla: formData.descripcionFalla,
          fechaHoraAveria: formData.fechaHoraAveria,
        })
      }
      setDialogOpen(false)
      loadData()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    } finally {
      setSaving(false)
    }
  }

  const openDelete = (item) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!itemToDelete) return
    try {
      await api.delete(`/averias/${itemToDelete.id}`)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      loadData()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' }) +
      ' ' + d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: 24 }}>Averías</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Nueva Avería
        </Button>
      </Box>

      {items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          No hay averías registradas
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Equipo ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Falla</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fecha Avería</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fecha Atención</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Días Inact.</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const fechaAveria = new Date(item.fechaHoraAveria)
                const fechaAtencion = item.fechaHoraAtencion ? new Date(item.fechaHoraAtencion) : null
                const diasInact = fechaAtencion
                  ? Math.max(0, Math.floor((fechaAtencion - fechaAveria) / (1000 * 60 * 60 * 24)))
                  : Math.floor((Date.now() - fechaAveria) / (1000 * 60 * 60 * 24))
                return (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.equipoId}</TableCell>
                    <TableCell>{item.descripcionFalla}</TableCell>
                    <TableCell>{item.estadoAveria || '-'}</TableCell>
                    <TableCell>{formatDate(item.fechaHoraAveria)}</TableCell>
                    <TableCell>{formatDate(item.fechaHoraAtencion)}</TableCell>
                    <TableCell>{diasInact}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => openEdit(item)}>
                          <EditIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" onClick={() => openDelete(item)}>
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar Avería' : 'Nueva Avería'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="ID Equipo"
              value={formData.equipoId}
              onChange={(e) => setFormData({ ...formData, equipoId: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Descripción de la Falla"
              value={formData.descripcionFalla}
              onChange={(e) => setFormData({ ...formData, descripcionFalla: e.target.value })}
              required
              fullWidth
              size="small"
              multiline
              rows={3}
            />
            <TextField
              label="Fecha y Hora de Avería"
              type="datetime-local"
              value={formData.fechaHoraAveria}
              onChange={(e) => setFormData({ ...formData, fechaHoraAveria: e.target.value })}
              required
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            {editing && (
              <>
                <TextField
                  label="Fecha y Hora de Atención"
                  type="datetime-local"
                  value={formData.fechaHoraAtencion || ''}
                  onChange={(e) => setFormData({ ...formData, fechaHoraAtencion: e.target.value })}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Acción Realizada"
                  value={formData.accionRealizada || ''}
                  onChange={(e) => setFormData({ ...formData, accionRealizada: e.target.value })}
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                />
                <TextField
                  label="Estado de Avería"
                  value={formData.estadoAveria || ''}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </>
            )}
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
            ¿Estás seguro de eliminar la avería <strong>{itemToDelete?.id}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteDialogOpen(false); setItemToDelete(null) }}>
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
