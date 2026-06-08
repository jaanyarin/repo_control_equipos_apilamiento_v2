import { useState, useEffect, useCallback } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, Tooltip,
  CircularProgress, Alert, MenuItem,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import api from '../api'

const booleanOptions = [
  { value: false, label: 'No' },
  { value: true, label: 'Sí' },
]

const defaultForm = {
  modelo: '',
  codigo: '',
  numeroSerie: '',
  proveedorId: '',
  marcaId: '',
  tipoEquipoId: '',
  capacidad: '',
  alturaMaxima: '',
  bateria: false,
  bateriaAdicional: false,
  cargador: false,
  transformador: false,
  serieBateria: '',
  serieBateriaAdicional: '',
  serieCargador: '',
  serieTransformador: '',
  extintor: false,
  conoSeguridad: false,
  botiquin: false,
  mesaRodillos: false,
  elevadorBateria: false,
  cableAdicional: false,
  conectorAdicional: false,
  horometroInicio: '',
  horometroFin: '',
  observaciones: '',
}

export default function Equipos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ ...defaultForm })
  const [saving, setSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.get('/equipos').then((r) => r.data || r)
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
    setFormData({ ...defaultForm })
    setDialogOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setFormData({
      modelo: item.modelo || '',
      codigo: item.codigo || '',
      numeroSerie: item.numeroSerie || '',
      proveedorId: item.proveedorId || '',
      marcaId: item.marcaId || '',
      tipoEquipoId: item.tipoEquipoId || '',
      capacidad: item.capacidad || '',
      alturaMaxima: item.alturaMaxima || '',
      bateria: item.bateria || false,
      bateriaAdicional: item.bateriaAdicional || false,
      cargador: item.cargador || false,
      transformador: item.transformador || false,
      serieBateria: item.serieBateria || '',
      serieBateriaAdicional: item.serieBateriaAdicional || '',
      serieCargador: item.serieCargador || '',
      serieTransformador: item.serieTransformador || '',
      extintor: item.extintor || false,
      conoSeguridad: item.conoSeguridad || false,
      botiquin: item.botiquin || false,
      mesaRodillos: item.mesaRodillos || false,
      elevadorBateria: item.elevadorBateria || false,
      cableAdicional: item.cableAdicional || false,
      conectorAdicional: item.conectorAdicional || false,
      horometroInicio: item.horometroInicio || '',
      horometroFin: item.horometroFin || '',
      observaciones: item.observaciones || '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/equipos/${editing.id}`, formData)
      } else {
        await api.post('/equipos', formData)
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
      await api.delete(`/equipos/${itemToDelete.id}`)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      loadData()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  const handleBoolChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value === 'true' })
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: 24 }}>Equipos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Nuevo Equipo
        </Button>
      </Box>

      {items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          No hay equipos registrados
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Código</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Modelo</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Serie</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.codigo}</TableCell>
                  <TableCell>{item.modelo}</TableCell>
                  <TableCell>{item.numeroSerie}</TableCell>
                  <TableCell>{item.estadoActivo ? 'Activo' : 'Inactivo'}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { maxHeight: '90vh' } }}
      >
        <DialogTitle>{editing ? 'Editar Equipo' : 'Nuevo Equipo'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Modelo"
              value={formData.modelo}
              onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Código"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Número de Serie"
              value={formData.numeroSerie}
              onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Proveedor ID"
              value={formData.proveedorId}
              onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Marca ID"
              value={formData.marcaId}
              onChange={(e) => setFormData({ ...formData, marcaId: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Tipo de Equipo ID"
              value={formData.tipoEquipoId}
              onChange={(e) => setFormData({ ...formData, tipoEquipoId: e.target.value })}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Capacidad"
              value={formData.capacidad}
              onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Altura Máxima"
              value={formData.alturaMaxima}
              onChange={(e) => setFormData({ ...formData, alturaMaxima: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Batería"
              value={formData.bateria ? 'true' : 'false'}
              onChange={handleBoolChange('bateria')}
              fullWidth
              size="small"
              select
            >
              {booleanOptions.map((opt) => (
                <MenuItem key={opt.label} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Batería Adicional"
              value={formData.bateriaAdicional ? 'true' : 'false'}
              onChange={handleBoolChange('bateriaAdicional')}
              fullWidth
              size="small"
              select
            >
              {booleanOptions.map((opt) => (
                <MenuItem key={opt.label} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Cargador"
              value={formData.cargador ? 'true' : 'false'}
              onChange={handleBoolChange('cargador')}
              fullWidth
              size="small"
              select
            >
              {booleanOptions.map((opt) => (
                <MenuItem key={opt.label} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Transformador"
              value={formData.transformador ? 'true' : 'false'}
              onChange={handleBoolChange('transformador')}
              fullWidth
              size="small"
              select
            >
              {booleanOptions.map((opt) => (
                <MenuItem key={opt.label} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Serie Batería"
              value={formData.serieBateria}
              onChange={(e) => setFormData({ ...formData, serieBateria: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Serie Batería Adicional"
              value={formData.serieBateriaAdicional}
              onChange={(e) => setFormData({ ...formData, serieBateriaAdicional: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Serie Cargador"
              value={formData.serieCargador}
              onChange={(e) => setFormData({ ...formData, serieCargador: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Serie Transformador"
              value={formData.serieTransformador}
              onChange={(e) => setFormData({ ...formData, serieTransformador: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Extintor"
              value={formData.extintor ? 'true' : 'false'}
              onChange={handleBoolChange('extintor')}
              fullWidth
              size="small"
              select
            >
              {booleanOptions.map((opt) => (
                <MenuItem key={opt.label} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Cono de Seguridad"
              value={formData.conoSeguridad ? 'true' : 'false'}
              onChange={handleBoolChange('conoSeguridad')}
              fullWidth
              size="small"
              select
            >
              {booleanOptions.map((opt) => (
                <MenuItem key={opt.label} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Botiquín"
              value={formData.botiquin ? 'true' : 'false'}
              onChange={handleBoolChange('botiquin')}
              fullWidth
              size="small"
              select
            >
              {booleanOptions.map((opt) => (
                <MenuItem key={opt.label} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Mesa de Rodillos"
              value={formData.mesaRodillos ? 'true' : 'false'}
              onChange={handleBoolChange('mesaRodillos')}
              fullWidth
              size="small"
              select
            >
              {booleanOptions.map((opt) => (
                <MenuItem key={opt.label} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Elevador de Batería"
              value={formData.elevadorBateria ? 'true' : 'false'}
              onChange={handleBoolChange('elevadorBateria')}
              fullWidth
              size="small"
              select
            >
              {booleanOptions.map((opt) => (
                <MenuItem key={opt.label} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Cable Adicional"
              value={formData.cableAdicional ? 'true' : 'false'}
              onChange={handleBoolChange('cableAdicional')}
              fullWidth
              size="small"
              select
            >
              {booleanOptions.map((opt) => (
                <MenuItem key={opt.label} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Conector Adicional"
              value={formData.conectorAdicional ? 'true' : 'false'}
              onChange={handleBoolChange('conectorAdicional')}
              fullWidth
              size="small"
              select
            >
              {booleanOptions.map((opt) => (
                <MenuItem key={opt.label} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Horómetro Inicio"
              type="number"
              value={formData.horometroInicio}
              onChange={(e) => setFormData({ ...formData, horometroInicio: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Horómetro Fin"
              type="number"
              value={formData.horometroFin}
              onChange={(e) => setFormData({ ...formData, horometroFin: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              fullWidth
              size="small"
              multiline
              rows={3}
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
            ¿Estás seguro de eliminar el equipo <strong>{itemToDelete?.codigo}</strong>?
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
