import { useState, useEffect, useCallback } from 'react'
import {
  Box, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, Tooltip, Chip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import api from '../api'
import DataTable from '../components/DataTable'

export default function TiposEquipo() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' })
  const [saving, setSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.get('/tipos-equipo').then((r) => r.data || r)
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
    setFormData({ nombre: '', descripcion: '' })
    setDialogOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setFormData({ nombre: item.nombre, descripcion: item.descripcion || '' })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/tipos-equipo/${editing.id}`, formData)
      } else {
        await api.post('/tipos-equipo', formData)
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
      await api.delete(`/tipos-equipo/${itemToDelete.id}`)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      loadData()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  const columns = [
    { field: 'id', label: 'ID' },
    { field: 'nombre', label: 'Nombre' },
    { field: 'codigo', label: 'Código' },
    { field: 'descripcion', label: 'Descripción', render: (row) => row.descripcion || '-' },
    {
      field: 'estadoActivo', label: 'Activo',
      render: (row) => (
        <Chip label={row.estadoActivo ? 'Sí' : 'No'} size="small"
          color={row.estadoActivo ? 'success' : 'default'} />
      ),
    },
  ]

  const renderActions = (item) => (
    <>
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
    </>
  )

  const renderCard = (item) => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.nombre}</Typography>
          <Typography variant="caption" color="text.secondary">Código: {item.codigo}</Typography>
        </Box>
        <Chip label={item.estadoActivo ? 'Activo' : 'Inactivo'} size="small"
          color={item.estadoActivo ? 'success' : 'default'} />
      </Box>
      <Typography variant="caption" color="text.secondary">{item.descripcion || '-'}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 1 }}>
        {renderActions(item)}
      </Box>
    </Box>
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: 20, md: 24 } }}>Tipos de Equipo</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} size="small">
          Nuevo Tipo
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        error={error}
        emptyMessage="No hay tipos de equipo registrados"
        actions={renderActions}
        renderCard={renderCard}
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar Tipo de Equipo' : 'Nuevo Tipo de Equipo'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Nombre" value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required fullWidth size="small" />
            <TextField label="Descripción" value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              fullWidth size="small" multiline rows={3} />
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
          <Typography>¿Estás seguro de eliminar el tipo de equipo <strong>{itemToDelete?.nombre}</strong>?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteDialogOpen(false); setItemToDelete(null) }}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
