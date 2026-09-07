import { useCallback, useEffect, useState } from 'react'
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
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import api from '../api'
import DataTable from '../components/DataTable'
import { useApp } from '../store'

export default function Areas() {
  const { user } = useApp()
  const canEdit = user?.rolId === 1 || user?.rolId === 2
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ nombre: '' })
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.get('/areas').then((r) => r.data || r)
      setItems(data.sort((a, b) => a.id - b.id))
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const save = async () => {
    if (!formData.nombre.trim()) return
    setSaving(true)
    try {
      if (editing) await api.put(`/areas/${editing.id}`, formData)
      else await api.post('/areas', formData)
      setOpen(false)
      load()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggle = async (item) => {
    try {
      await api.put(`/areas/${item.id}`, { nombre: item.nombre, estadoActivo: !item.estadoActivo })
      load()
    } catch (err) { alert(err.response?.data?.message || err.message) }
  }

  const remove = async (item) => {
    if (!window.confirm(`¿Eliminar el área ${item.nombre}?`)) return
    try { await api.delete(`/areas/${item.id}`); load() }
    catch (err) { alert(err.response?.data?.message || err.message) }
  }

  const actions = item => canEdit ? (
    <>
      <Tooltip title={item.estadoActivo ? 'Desactivar' : 'Activar'}><IconButton size="small" onClick={() => toggle(item)}>{item.estadoActivo ? <ToggleOnIcon color="success" /> : <ToggleOffIcon />}</IconButton></Tooltip>
      <Tooltip title="Editar"><IconButton size="small" onClick={() => { setEditing(item); setFormData({ nombre: item.nombre }); setOpen(true) }}><EditIcon color="primary" /></IconButton></Tooltip>
      <Tooltip title="Eliminar"><IconButton size="small" onClick={() => remove(item)}><DeleteIcon color="error" /></IconButton></Tooltip>
    </>
  ) : null

  return <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
      <Typography variant="h4">Áreas</Typography>
      {canEdit ? <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setFormData({ nombre: '' }); setOpen(true) }}>Nueva Área</Button> : null}
    </Box>
    <DataTable columns={[{ field: 'id', label: 'ID' }, { field: 'nombre', label: 'Nombre' }, { field: 'codigo', label: 'Código' }, { field: 'estadoActivo', label: 'Activo', render: row => <Chip label={row.estadoActivo ? 'Sí' : 'No'} size="small" /> }]} data={items} loading={loading} error={error} emptyMessage="No hay áreas registradas" actions={actions} />
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{editing ? 'Editar Área' : 'Nueva Área'}</DialogTitle>
      <DialogContent><TextField autoFocus fullWidth required label="Nombre" value={formData.nombre} onChange={e => setFormData({ nombre: e.target.value })} sx={{ mt: 1 }} /></DialogContent>
      <DialogActions><Button onClick={() => setOpen(false)}>Cancelar</Button><Button variant="contained" onClick={save} disabled={saving}>{editing ? 'Actualizar' : 'Crear'}</Button></DialogActions>
    </Dialog>
  </Box>
}