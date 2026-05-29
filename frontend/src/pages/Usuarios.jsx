import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem,
  FormControl, InputLabel, IconButton, Tooltip, CircularProgress,
  Alert, Autocomplete,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import api from '../api'
import { useApp } from '../store'
import RoleChip from '../components/RoleChip'

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
    setSaving(true)
    try {
      if (editingUser) {
        await api.put(`/usuarios/${editingUser.id}`, {
          rolId: Number(formData.rolId),
          estadoActivo: formData.estadoActivo === 'true',
        })
      } else {
        await api.post('/usuarios', {
          correo: formData.correo,
          rolId: Number(formData.rolId),
          idMicrosoft: formData.correo,
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

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Alert severity="error">{error}</Alert>

  const filteredRoles = filterRolesByUserRole(roles)

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: 24 }}>Tabla de Usuarios</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Nuevo Usuario
        </Button>
      </Box>

      {usuarios.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          No hay usuarios registrados
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Correo electrónico</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Puesto</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Área</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Empresa</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Activo</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.nombre || '-'}</TableCell>
                  <TableCell>{u.correo || '-'}</TableCell>
                  <TableCell>{u.puesto || '-'}</TableCell>
                  <TableCell>{u.area || '-'}</TableCell>
                  <TableCell>{u.empresa || '-'}</TableCell>
                  <TableCell><RoleChip roleName={u.rolNombre} /></TableCell>
                  <TableCell>{u.estadoActivo ? 'Sí' : 'No'}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => openEdit(u)}>
                        <EditIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" onClick={() => openDelete(u)}>
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
            {saving ? <CircularProgress size={20} sx={{ mr: 0.5 }} /> : null}
            {editingUser ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar a <strong>{userToDelete?.nombre || userToDelete?.correo}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteDialogOpen(false); setUserToDelete(null) }}>
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
