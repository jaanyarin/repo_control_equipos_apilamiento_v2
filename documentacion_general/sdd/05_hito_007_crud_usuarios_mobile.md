# HDT-007 — CRUD Usuarios Mobile y Correcciones de Autenticación

| Campo | Valor |
|---|---|
| Estado | Implementado y validado |
| Fecha | 2026-07-24 |
| Responsable de desarrollo | Codex |
| Alcance | Aplicación Android (mobile) |

## Objetivo

Implementar CRUD completo de usuarios en mobile (CreateEditUserScreen), agregar permisos por rol (solo Super Admin modifica Super Admin), y corregir bugs de autenticación en LoginScreen (race condition), AuthContext (logout robusto), y PasswordChangeScreen (logging).

## Funcionalidad Validada

### CreateEditUserScreen
- Formulario completo crear/editar usuario con React Hook Form + Zod
- Campos: nombre, correo, rol (dropdown solo Admin/Usuario), área, puesto, empresa, departamento, ubicación
- Contraseña por defecto `00000000` en creación
- Validación: nombre y correo requeridos, contraseña mínimo 6 caracteres
- Modo creación (`mode='create'`) y edición (`mode='edit'`) con datos precargados

### UsuariosScreen — Permisos por Rol
- Botón `+` en headerRight (consistente con pantalla PSR/OSR)
- Botón lápiz para editar, botón papelera para eliminar (con confirmación)
- **Regla:** Solo Super Admin puede editar/eliminar usuarios con rol Super Admin
- Helpers: `isSuperAdmin()`, `isAdminOrSuperAdmin()` en `mobile/src/utils/roles.js`

### Correcciones de Autenticación

| Archivo | Problema | Solución |
|---|---|---|
| `LoginScreen.js` | `refreshUser()` sin `await` cuando `passwordResetRequired=true` causa race condition que impide mostrar PasswordChangeScreen | Usar `await refreshUser()` siempre |
| `AuthContext.js` | Si `removeToken()` (Keychain) falla, `setUser(null)` no se ejecuta dejando al usuario atascado | Envolver en try/catch |
| `PasswordChangeScreen.js` | Sin logging en catch, difícil diagnosticar fallos de API | Agregar `console.error` con status y mensaje |

### Archivos modificados/creados

| Archivo | Acción |
|---|---|
| `mobile/src/screens/CreateEditUserScreen.js` | Nuevo (formulario React Hook Form + Zod) |
| `mobile/src/utils/roles.js` | Nuevo (helpers de permisos) |
| `mobile/src/screens/UsuariosScreen.js` | Modificado (headerRight `+`, permisos por rol, editar/eliminar) |
| `mobile/src/navigation/AppNavigator.js` | Modificado (ruta CreateEditUser) |
| `mobile/src/LoginScreen.js` | Modificado (await refreshUser) |
| `mobile/src/AuthContext.js` | Modificado (try/catch en logout) |
| `mobile/src/screens/PasswordChangeScreen.js` | Modificado (console.error en catch) |
| `documentacion_general/sdd/02_planes.md` | Modificado (roadmap + módulos) |
| `documentacion_general/sdd/03_tareas.md` | Modificado (tareas AND-024 a AND-028) |
| `documentacion_general/sdd/04_implementaciones.md` | Modificado (§10 Módulo Usuarios Mobile) |

### Validación

- ESLint mobile: 0 errores
- Tests Jest: 6 suites, 17 tests — todos pass (1 timeout pre-existente no relacionado)
- Verificación en dispositivo Android (Motorola 24049RN28L):
  - Login Benito Peña (passwordResetRequired=true) → PasswordChangeScreen
  - Cambio de contraseña exitoso
  - CRUD usuarios: crear, editar, eliminar con permisos por rol
  - Cancelar en PasswordChangeScreen redirige a login

### Decisiones

- El dropdown de roles en CreateEditUserScreen filtra solo Admin y Usuario (Super Admin no se asigna desde mobile)
- El permiso para modificar Super Admin se evalúa del lado del cliente (UX) + backend (seguridad)
- La contraseña por defecto `00000000` sigue la convención de seed local
- ADB inalámbrico reemplazado por USB por estabilidad
