import { useState, useEffect, useCallback, useRef } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import api from '../api'
import { useApp } from '../store'
import RoleChip from '../components/RoleChip'
import DataTable from '../components/DataTable'

function getCurrentUserRole() {
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return (payload.groups || [])[0] || null
  } catch { return null }
}

function filterRolesByUserRole(roles) {
  const userRole = getCurrentUserRole()
  if (userRole === 'Super Admin') return roles
  if (userRole === 'Admin') return roles.filter((r) => r.id !== 1)
  return roles.filter((r) => r.id === 3)
}

function buildNameFromEmail(email) {
  const localPart = email.split('@')[0] || 'Usuario'
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Usuario'
}

export default function Usuarios() {
  const { user } = useApp()
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ correo: '', rolId: '', estadoActivo: 'true' })
  const [saving, setSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [emailOptions, setEmailOptions] = useState([])
  const [searchingEmail, setSearchingEmail] = useState(false)
  const debounceRef = useRef(null)

  const searchEmails = useCallback(async (query) => {
    const q = query.toLowerCase()
    if (!q || q.length < 2) {
      setEmailOptions([])
      return
    }
    setSearchingEmail(true)
    try {
      const res = await api.get('/usuarios/buscar-por-correo', { params: { q } })
      setEmailOptions(res.data || [])
    } catch {
      setEmailOptions([])
    } finally {
      setSearchingEmail(false)
    }
  }, [])

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [usuariosData, rolesData] = await Promise.all([
        api.get('/usuarios').then((r) => r.data || r),
        api.get('/roles').then((r) => r.data || r),
      ])
      usuariosData.sort((a, b) => a.id - b.id)
      setUsuarios(usuariosData)
      setRoles(rolesData)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  const openCreate = () => {
    setEditingUser(null)
    setFormData({ correo: '', rolId: '', estadoActivo: 'true' })
    setDialogOpen(true)
  }

  const openEdit = (user) => {
    setEditingUser(user)
    setFormData({ correo: user.correo, rolId: user.rolId, estadoActivo: user.estadoActivo ? 'true' : 'false' })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (saving) return
    const correo = formData.correo.trim().toLowerCase()
    const rolId = Number(formData.rolId)
    if (!editingUser && !correo) {
      alert('Ingrese el correo del usuario')
      return
    }
    if (!rolId) {
      alert('Seleccione un rol')
      return
    }
    setSaving(true)
    try {
      if (editingUser) {
        await api.put(`/usuarios/${editingUser.id}`, {
          rolId,
          estadoActivo: formData.estadoActivo === 'true',
        })
      } else {
        await api.post('/usuarios', {
          correo,
          nombre: buildNameFromEmail(correo),
          rolId,
          idMicrosoft: correo,
          estadoActivo: true,
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

  const openDelete = (user) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    try {
      await api.delete(`/usuarios/${userToDelete.id}`)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      loadData()
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  const filteredRoles = filterRolesByUserRole(roles)

  const columns = [
    { field: 'id', label: 'ID' },
    { field: 'nombre', label: 'Nombre', render: (row) => row.nombre || '-' },
    { field: 'correo', label: 'Correo', render: (row) => row.correo || '-' },
    { field: 'puesto', label: 'Puesto', render: (row) => row.puesto || '-' },
    { field: 'area', label: 'Área', render: (row) => row.area || '-' },
    { field: 'empresa', label: 'Empresa', render: (row) => row.empresa || '-' },
    { field: 'rolNombre', label: 'Rol', render: (row) => <RoleChip roleName={row.rolNombre} /> },
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
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.nombre || item.correo}</Typography>
          <Typography variant="caption" color="text.secondary">{item.correo}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <RoleChip roleName={item.rolNombre} />
          <Chip label={item.estadoActivo ? 'Activo' : 'Inactivo'} size="small"
            color={item.estadoActivo ? 'success' : 'default'} />
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {[item.puesto, item.area, item.empresa].filter(Boolean).join(' | ') || '-'}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 1 }}>
        {renderActions(item)}
      </Box>
    </Box>
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: 20, md: 24 } }}>Usuarios</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} size="small">
          Nuevo Usuario
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={usuarios}
        loading={loading}
        error={error}
        emptyMessage="No hay usuarios registrados"
        actions={renderActions}
        renderCard={renderCard}
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {editingUser && (
              <TextField label="Nombre" value={editingUser.nombre || ''} InputProps={{ readOnly: true }} size="small" />
            )}
            <Autocomplete
              freeSolo
              options={emailOptions}
              inputValue={formData.correo}
              onInputChange={(_, value) => {
                const v = value.toLowerCase()
                setFormData({ ...formData, correo: v })
                if (debounceRef.current) clearTimeout(debounceRef.current)
                debounceRef.current = setTimeout(() => searchEmails(v), 300)
              }}
              onChange={(_, value) => {
                if (value) setFormData({ ...formData, correo: value.toLowerCase() })
              }}
              loading={searchingEmail}
              disableClearable
              filterOptions={(x) => x}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Correo electrónico"
                  required={!editingUser}
                  InputProps={{
                    ...params.InputProps,
                    readOnly: !!editingUser,
                    endAdornment: (
                      <>
                        {searchingEmail ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  size="small"
                />
              )}
            />
            {editingUser && (
              <>
                <TextField label="Puesto" value={editingUser.puesto || ''} InputProps={{ readOnly: true }} size="small" />
                <FormControl size="small" fullWidth>
                  <InputLabel>Activo</InputLabel>
                  <Select
                    value={formData.estadoActivo}
                    label="Activo"
                    onChange={(e) => setFormData({ ...formData, estadoActivo: e.target.value })}
                  >
                    <MenuItem value="true">Sí</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            <FormControl size="small" fullWidth required>
              <InputLabel>Rol</InputLabel>
              <Select
                value={formData.rolId}
                label="Rol"
                onChange={(e) => setFormData({ ...formData, rolId: e.target.value })}
              >
                {filteredRoles.map((r) => (
                  <MenuItem key={r.id} value={r.id}>{r.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {editingUser ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de eliminar a <strong>{userToDelete?.nombre || userToDelete?.correo}</strong>?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteDialogOpen(false); setUserToDelete(null) }}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
