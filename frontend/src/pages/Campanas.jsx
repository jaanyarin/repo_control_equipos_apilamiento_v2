import { useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AddIcon from '@mui/icons-material/Add'
import api from '../api'
import DataTable from '../components/DataTable'

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

  const columns = [
    { field: 'id', label: 'ID' },
    { field: 'nombre', label: 'Nombre' },
    { field: 'codigo', label: 'Código' },
    {
      field: 'fechaInicio', label: 'Fecha Inicio',
      render: (row) => row.fechaInicio ? new Date(row.fechaInicio).toLocaleDateString('es-PE') : '-',
    },
    {
      field: 'fechaFin', label: 'Fecha Fin',
      render: (row) => row.fechaFin ? new Date(row.fechaFin).toLocaleDateString('es-PE') : '-',
    },
    {
      field: 'estadoActivo', label: 'Estado',
      render: (row) => (
        <Chip
          label={row.estadoActivo ? 'Activa' : 'Cerrada'}
          size="small"
          color={row.estadoActivo ? 'success' : 'default'}
        />
      ),
    },
  ]

  const renderActions = (item) => (
    <>
      {item.estadoActivo ? (
        <Tooltip title="Cerrar campaña">
          <IconButton size="small" onClick={() => handleCerrar(item.id)}>
            <CancelIcon fontSize="small" color="error" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Activar campaña">
          <IconButton size="small" onClick={() => handleActivar(item.id)}>
            <CheckCircleIcon fontSize="small" color="success" />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Eliminar">
        <IconButton size="small" onClick={() => openDelete(item)}>
          <DeleteIcon fontSize="small" color="error" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Editar">
        <IconButton size="small" onClick={() => openEdit(item)}>
          <EditIcon fontSize="small" color="primary" />
        </IconButton>
      </Tooltip>
    </>
  )

  const renderCard = (item) => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.nombre}</Typography>
          <Typography variant="caption" color="text.secondary">Código: {item.codigo}</Typography>
        </Box>
        <Chip label={item.estadoActivo ? 'Activa' : 'Cerrada'} size="small"
          color={item.estadoActivo ? 'success' : 'default'} />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Inicio: {item.fechaInicio ? new Date(item.fechaInicio).toLocaleDateString('es-PE') : '-'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Fin: {item.fechaFin ? new Date(item.fechaFin).toLocaleDateString('es-PE') : '-'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 1 }}>
        {renderActions(item)}
      </Box>
    </Box>
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: 20, md: 24 } }}>Campañas Operativas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} size="small">
          Nueva
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={campanas}
        loading={loading}
        error={error}
        emptyMessage="No hay campañas registradas"
        actions={renderActions}
        renderCard={renderCard}
        getRowStyle={(row) => row.estadoActivo ? { bgcolor: 'success.lighter', '&:hover': { bgcolor: 'success.light' } } : {}}
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar Campaña' : 'Nueva Campaña'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Campaña" value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required fullWidth size="small" />
            <TextField label="Fecha Inicio" type="datetime-local" value={formData.fechaInicio}
              onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
              size="small" InputLabelProps={{ shrink: true }} />
            <TextField label="Fecha Fin" type="datetime-local" value={formData.fechaFin}
              onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
              size="small" InputLabelProps={{ shrink: true }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {editing ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de eliminar la campaña <strong>{campanaToDelete?.nombre}</strong>?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteDialogOpen(false); setCampanaToDelete(null) }}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
