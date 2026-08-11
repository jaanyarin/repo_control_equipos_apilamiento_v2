# HDT-010 — Usuarios Mobile: solo Nombre obligatorio y Ubicación desde Sedes

| Campo | Valor |
|---|---|
| Estado | Implementado y validado |
| Fecha | 2026-08-06 |
| Responsable de desarrollo | Codex |
| Alcance | Backend Quarkus + Aplicación Android (mobile) |

## Objetivo

Simplificar el alta de usuarios en mobile: el formulario de `CreateEditUserScreen` debe mostrar únicamente **Nombre**, **Rol** y **Ubicación**, con **solo Nombre obligatorio**. La Ubicación pasa de ser un input libre a un **desplegable poblado con las Sedes** del sistema. El backend debe aceptar la creación sin correo y sin rol (asignando el rol **Usuario** por defecto).

## Problema

- El schema Zod del formulario seguía exigiendo `correo` y `rolId` aunque los campos estuvieran comentados en la UI → el submit quedaba bloqueado.
- `Ubicación` era un `AppInput` libre, no un catálogo.
- El backend rechazaba la creación sin correo (`UsuarioService.crear` lanzaba "El correo es obligatorio") y el `@NotNull` de `rolId` en `UsuarioDTO` + columna `rol_id NOT NULL` impedían crear sin rol.

## Solución

### Mobile — `CreateEditUserScreen.js`

| Aspecto | Detalle |
|---|---|
| Schema | Solo `nombre` obligatorio; `rolId` y `ubicacion` opcionales. |
| Catálogos | `loadCatalogs()` carga `/roles` + `/sedes` en paralelo (refetch silencioso en focus y `onOpen`). |
| Rol | `AppSelect` opcional (excluye Super Admin). |
| Ubicación | `AppSelect` con las **Sedes** activas (value = nombre de la sede). |
| Payload | `{ nombre, rolId, ubicacion }` — sin correo. |

### Backend

| Archivo | Cambio |
|---|---|
| `UsuarioDTO.java` | Eliminado `@NotNull` de `rolId`. |
| `RolRepository.java` | Nuevo `findByNombre`. |
| `UsuarioService.java` | `crear` sin correo obligatorio (null si vacío); rol por defecto **"Usuario"** si `rolId` nulo; `nombre` obligatorio (400 si nulo/vacío). |

## Archivos Modificados/Creados

| Archivo | Acción |
|---|---|
| `backend/.../dto/UsuarioDTO.java` | Modificado |
| `backend/.../repository/RolRepository.java` | Modificado |
| `backend/.../service/UsuarioService.java` | Modificado |
| `backend/.../service/UsuarioServiceTest.java` | Nuevo (6 tests) |
| `mobile/src/screens/CreateEditUserScreen.js` | Modificado |
| `mobile/src/__tests__/CreateEditUserScreen.test.js` | Nuevo (4 tests) |

## Validación

- **Backend**: `mvn test` (Docker) → `UsuarioServiceTest` 6/6. Los únicos 2 errores de la suite son **pre-existentes** (`MarcaResourceTest` por ruta `/app/target/classes` en QuarkusTest + entorno Docker; `MarcaServiceTest` UnnecessaryStubbing), confirmados en el commit base sin estos cambios.
- **Docker**: backend reconstruido → health check `UP`.
- **API real** (JWT de prueba RS256): solo nombre → 201 con `rolId:3` (Usuario); con rol+ubicación → 201 (`rolId:2`, `ubicacion:"Packing Uva"`); sin nombre → 400. Usuarios de prueba eliminados.
- **Mobile**: ESLint limpio, Jest **42/42**.
