# HDT-008 — UX Desplegables, Catálogos en Tiempo Real y Referencias PSR/OSR

| Campo | Valor |
|---|---|
| Estado | Implementado y validado |
| Fecha | 2026-08-06 |
| Responsable de desarrollo | Codex |
| Alcance | Backend Quarkus + Aplicación Android (mobile) |

## Objetivo

Resolver problemas de UX en el mobile: desplegables con scroll completo (sin quedar detrás de la barra de acciones), sincronización de catálogos en tiempo real entre dispositivos (lo que crea el admin en un equipo debe verse en el otro sin reiniciar), y visibilidad retroactiva de las referencias PSR/OSR en el detalle de equipo y en el listado PSR/OSR.

## Hito 1 — AppSelect con Portal + ScrollView completo (2026-08-05)

### Problema

El `Menu` de react-native-paper desplegaba las opciones con `contentStyle maxHeight` + `zIndex`, pero en el celular del usuario el listado quedaba **detrás de la barra de acciones** y no permitía hacer scroll hasta el último ítem (p.ej. listas largas de marcas/proveedores). Una primera solución con `Modal` + `ScrollView` dejaba el menú detrás de la barra de acciones inferior.

### Solución — `mobile/src/components/AppSelect.js` (reescritura)

| Aspecto | Detalle |
|---|---|
| Render | `Portal` de react-native-paper + `Pressable` overlay (`testID="select-overlay"`) para cerrar tocando fuera + `View` posicionado (`testID="select-menu"`) con `ScrollView` interno siempre scrolleable. |
| Posicionamiento | `measureInWindow` sobre el nodo ancla (`ref` + `collapsable={false}`) para calcular `{ x, y, width, height }`; el menú se ubica debajo del anchor. Fallback `{ left: 16, right: 16, top: 80 }` si no hay medida. |
| Altura máxima | `maxHeight = max(120, windowHeight - anchor.y - anchor.height - insets.bottom - 24)`, con fallback basado en insets. El `ScrollView` permite llegar al último ítem. |
| Prop `onOpen` | Callback opcional invocado al abrir el menú (antes de `setVisible(true)`) para refetch silencioso de catálogos. |
| Contrato `onChange` | `onChange(option.value, option)` — sin cambios en consumidores. |
| Overlay | `backgroundColor: theme.colors.background.backdrop` a pantalla completa, debajo del menú. |

### Hito 2 — Catálogos en tiempo real (refetch silencioso al enfocar y al abrir)

### Problema

Los catálogos (marcas, proveedores, tipos, sedes, campañas, motivos, roles) se cargaban una sola vez al montar cada pantalla. Si el admin creaba un catálogo en un dispositivo, el otro celular no lo veía hasta reiniciar la app.

### Solución

| Pantalla | Cambio |
|---|---|
| `EquipmentFormScreen.js` | `loadCatalogs(silent)`; `useFocusEffect` con `loadedRef` (primera vez carga con loader; re-enfoques recargan en silencio). `onOpen={() => loadCatalogs(true)}` en los 3 selects (proveedor, marca, tipo). |
| `CreatePsrScreen.js` | `loadCatalogs(silent)`; `useFocusEffect` + `loadedRef`; validaciones de negocio (campaña activa, sedes, motivos) solo en carga no-silenciosa; `onOpen={() => loadCatalogs(true)}` en campaña, sede y motivo. |
| `CreateEditUserScreen.js` | `loadRoles(silent)`; `useFocusEffect` + `loadedRef`; `onOpen={() => loadRoles(true)}` en el select de rol. |
| `LoginScreen.js` | `fetchRoles(silent)`; `onOpen={() => fetchRoles(true)}` en el select de Perfil. |

Comportamiento resultante: cada vez que se enfoca la pantalla o se abre un desplegable, los catálogos se refrescan en segundo plano; si un registro nuevo aparece (creado por el admin desde el otro dispositivo), se muestra sin reiniciar la app.

## Hito 3 — Filtro de equipos por modo de navegación (DEVUELTO)

### Problema

El listado de equipos mostraba indistintamente equipos `DEVUELTO` en todos los modos de navegación (gestión, selección, consulta), saturando listas con equipos fuera de servicio.

### Solución — `mobile/src/utils/equipmentForm.js`

Nueva función pura `filterEquiposByMode(equipos, { mode, filterEstado })`:

| Modo | Comportamiento |
|---|---|
| `select` / `manage` | Oculta equipos `DEVUELTO` (no operativos para gestionar/reportar). |
| `view` | Muestra todos (`OPERATIVO`, `AVERIADO`, `DEVUELTO`). |
| `filterEstado` | Si se define, solo equipos con ese `estadoOperativo`. |

`EquiposListScreen.js` usa `filterEquiposByMode(arr, { mode, filterEstado })`, unificando la lógica anterior de `esDevolucion`/`filterEstado`. Mensajes de vacío contextuales por modo.

Tests: `mobile/src/__tests__/equiposListFilter.test.js` (nuevo, casos por modo + DEVUELTO).

## Hito 4 — Referencias PSR/OSR en mobile (backend + mobile)

### Problema

- `EquipoDetailScreen` no mostraba a qué PSR/OSR está vinculado el equipo.
- Las cards de `PsrOsrScreen` no mostraban la marca, modelo y guía de remisión del equipo asociado.

### 4.1 Backend — `EquipoDTO` con bloque `psrOsr`

| Archivo | Cambio |
|---|---|
| `dto/PsrOsrRefDTO.java` (nuevo) | Referencia: `psrId`, `numeroPsr`, `numeroOsr`, `sedeNombre`, `campanaNombre`. |
| `dto/EquipoDTO.java` | Campo anidado `psrOsr` (tipo `PsrOsrRefDTO`). |
| `service/EquipoService.java` | Solo `buscarPorId(id)` resuelve la vinculación vía `osrRepository.findByEquipoId(equipoId)` → `psrRepository.findByIdOptional(osr.psrId)` → nombres de sede/campaña. `listarTodos` **no** resuelve (evita N+1). Métodos `toDTOConVinculacion`, `resolverPsrOsr`, `toPsrOsrRef`. |

Flujo de resolución:

```
Equipo → Osr.equipoId → Osr.psrId → Psr → (Sede, Campaña)
```

### 4.2 Backend — `PsrDTO` con `marca`, `modelo`, `grr`

| Archivo | Cambio |
|---|---|
| `dto/PsrDTO.java` | Campos `marca`, `modelo`, `grr` (String). |
| `service/PsrService.java` | `toDTO(psr)` resuelve vía `osrRepository.findByPsrId` → `resolverEquipoAsociado(dto, osr)`: si `osr.equipoId != null`, obtiene el equipo y llena `modelo`, `grr` (= `numeroGuiaRemision`) y `marca` (nombre vía `MarcaRepository`). Inyección de `EquipoRepository` y `MarcaRepository`. |

### 4.3 Mobile — `EquipoDetailScreen.js`

Card **"PSR / OSR"** insertada entre "Información General" y "Estado" (EquipoDetailScreen.js:166). Muestra PSR, OSR, Sede y Campaña desde `equipo.psrOsr`. Si el equipo no tiene vinculación (CRUD directo sin OSR), muestra el estado vacío "Sin PSR/OSR vinculada".

### 4.4 Mobile — `PsrOsrScreen.js`

Línea nueva tras la Sede (PsrOsrScreen.js:151): `Marca: {item.marca} | Modelo: {item.modelo} | GRR: {item.grr}`, renderizada solo cuando existe al menos un valor (PSR sin equipo asignado no muestra la línea).

## Retroactividad (validada en producción local)

Los cambios son **retroactivos**: leen el estado actual de la BD vía el vínculo `osr.equipo_id`. Se verificó con los 4 PSR existentes:

| PSR | OSR | Marca | Modelo | GRR |
|---|---|---|---|---|
| Psr001 | Osr001 | Linde | Modelo_001 | GRR-001 |
| Psr002 | Osr002 | Hangcha | Modelo 0002 | grr-002-0002 |
| Psr_003 | Osr_003 | Caterpillar | modelo 003 | grr 003 |
| PSR-2026-004 | OSR-2026-004 | Chamchung | modelito 01 | GRR-2026-0004A |

`GET /equipos/6` devolvió `psrOsr` con `{ psrId: 4, numeroPsr: "PSR-2026-004", numeroOsr: "OSR-2026-004", sedeNombre: "Packing Uva", campanaNombre: "26-27" }`.

## Hito 5 — Mejoras de administración en mobile (soporte)

### 5.1 `AppNavigator.js` — Tab Catálogos con secciones y permisos por rol

- Secciones agrupadas: **Catálogos** (Marcas, Proveedores, Tipos Equipo, Sedes, Motivos PSR), **Operación** (Campañas), **Administración** (Roles, Usuarios), **Sistema** (Auditoría, Configuración — solo Super Admin).
- El tab **Catálogos** se oculta para rol **Usuario** (`isAdminOrSuperAdmin`), con mensaje "No tienes permisos para acceder a esta sección." si se accede.

### 5.2 `CatalogScreen.js` + `RolesScreen.js`

- El botón de creación pasa de FAB a `headerRight` (`IconButton` `+`) vía `useLayoutEffect`, consistente con otras pantallas. Se elimina el FAB.
- `RolesScreen` pasa `canEdit={isAdminOrSuperAdmin(user)}`.

### 5.3 `CampanasScreen.js` — CRUD completo mobile

- Nuevo: crear/editar campañas en `Dialog` con `AppInput` (nombre, código) + `DateField` con `DateTimePicker` nativo (fechas inicio/fin). Guardado vía POST/PUT.
- `headerRight` con `+` (solo `canEdit`); tap en card abre edición; acciones activar/cerrar/eliminar conservadas.

## Archivos Modificados/Creados

| Archivo | Acción |
|---|---|
| `backend/.../dto/PsrOsrRefDTO.java` | Nuevo |
| `backend/.../dto/EquipoDTO.java` | Modificado (`psrOsr`) |
| `backend/.../dto/PsrDTO.java` | Modificado (`marca`, `modelo`, `grr`) |
| `backend/.../service/EquipoService.java` | Modificado (vinculación en `buscarPorId`) |
| `backend/.../service/PsrService.java` | Modificado (equipo asociado en `toDTO`) |
| `backend/.../service/EquipoServiceTest.java` | Modificado (nuevos mocks) |
| `backend/.../service/PsrServiceTest.java` | Modificado (nuevos mocks) |
| `mobile/src/components/AppSelect.js` | Reescrito (Portal + ScrollView + `onOpen`) |
| `mobile/src/screens/EquipmentFormScreen.js` | Modificado (focus + refetch silencioso + onOpen) |
| `mobile/src/screens/CreatePsrScreen.js` | Modificado (focus + refetch silencioso + onOpen) |
| `mobile/src/screens/CreateEditUserScreen.js` | Modificado (focus + refetch silencioso + onOpen) |
| `mobile/src/LoginScreen.js` | Modificado (fetchRoles silencioso + onOpen) |
| `mobile/src/utils/equipmentForm.js` | Modificado (`filterEquiposByMode`) |
| `mobile/src/screens/EquiposListScreen.js` | Modificado (usa `filterEquiposByMode`, vacíos contextuales) |
| `mobile/src/screens/EquipoDetailScreen.js` | Modificado (card PSR/OSR) |
| `mobile/src/screens/PsrOsrScreen.js` | Modificado (línea Marca/Modelo/GRR) |
| `mobile/src/screens/AppNavigator.js` | Modificado (secciones + permisos) |
| `mobile/src/screens/CatalogScreen.js` | Modificado (headerRight en vez de FAB) |
| `mobile/src/screens/RolesScreen.js` | Modificado (`canEdit`) |
| `mobile/src/screens/CampanasScreen.js` | Modificado (CRUD completo mobile) |
| `mobile/src/__tests__/AppSelect.test.js` | Nuevo (5 tests) |
| `mobile/src/__tests__/equiposListFilter.test.js` | Nuevo (filtros por modo) |
| `mobile/src/__tests__/CreatePsrScreen.test.js` | Modificado (mock `useFocusEffect`) |
| `set-adb-tunnels.ps1` | Nuevo (túneles ADB duales) |

## Validación

- **Backend**: `mvn compile` exitoso (JDK 21 vía Docker `maven:3.9-eclipse-temurin-21` con caché `.m2` local). `EquipoServiceTest` + `PsrServiceTest` pasan (exit 0). Contenedor `apilamiento-backend` reconstruido, health check `UP`. Verificación API con JWT de prueba: `GET /equipos/6` devuelve `psrOsr`; `GET /psr` devuelve `marca`/`modelo`/`grr` retroactivos.
- **Mobile**: ESLint limpio. Suite Jest: 33 pass / 2 fail pre-existentes ajenos (`PasswordChangeScreen` sin `SafeAreaProvider` en el test; `AuthContext` flaky de timing que pasa aislado).
- **Dispositivos**: verificado en 2 celulares (REDMI admin + Xiaomi usuario) — los nuevos campos PSR/OSR se visualizan en ambos perfiles.

## Decisiones

- La card PSR/OSR y la línea Marca/Modelo/GRR se resuelven **en el backend** (DTO enriquecido), evitando joins y llamadas extra en el cliente.
- `buscarPorId` (detalle) resuelve la vinculación; `listarTodos` (listado/resumen) no, para evitar N+1.
- El refetch silencioso en `onOpen` no muestra spinners ni errores (UX no intrusiva); los errores de carga inicial sí se muestran.
- Los campos nuevos son aditivos (snake_case JSON); no rompen el contrato existente.
