# HDT-011 — Horómetro en Averías y Trazabilidad de Usuario (Auditoría)

| Campo | Valor |
|---|---|
| Estado | Implementado y validado |
| Fecha | 2026-08-10 |
| Responsable de desarrollo | Codex |
| Alcance | Backend Quarkus, PostgreSQL (Flyway), aplicación Android, frontend web |
| Hitos incluidos | Migraciones V21–V25 · Fix 409 devolución · Horómetro en registro y atención de averías · Trazabilidad de `usuario_creacion`/`usuario_actualizacion` desde JWT |

---

## Objetivo

Cerrar la trazabilidad operativa del horómetro a lo largo del ciclo de vida de un equipo y garantizar que **cada registro en `fac_averias` y `fac_equipos` (y todos los catálogos operativos)** quede asociado al usuario autenticado que lo creó/actualizó, en lugar de registrarse siempre como el Super Admin (id `1`).

---

## Hito 1 — Bug 409 al devolver equipo (Fix)

### Problema

Al atender una avería sobre un equipo que ya había sido devuelto (`fecha_devolucion` seteada), `AveriaService.marcarAtendida` igualaba el equipo a `OPERATIVO`, revirtiendo la devolución. En el listado mobile, el equipo `DEVUELTO` seguía apareciendo en selecciones/gestión, y la API devolvía `409` con un mensaje genérico, sin detalle.

### Solución

| Archivo | Cambio |
|---|---|
| `service/AveriaService.java` | `marcarAtendida` solo restaura `estadoOperativo = "OPERATIVO"` si `fechaDevolucion == null` (no revierte un equipo devuelto). |
| `dto/ApiResponse.java` | Nuevo campo `error` en el wrapper `{ success, message, data, error, errorCode, timestamp }` para que el cliente reciba el mensaje real del backend. |
| `mobile/src/utils/equipmentForm.js` | `filterEquiposByMode` oculta equipos `DEVUELTO` en modos `select`/`manage` (ya no saturan listas operativas). |
| `test/.../DevolucionEquipoServiceTest.java` | Nuevo (7 tests). |
| `test/.../AveriaServiceTest.java` | Ampliado a 12/12 (caso: atender no revierte devolución). |
| `test/.../controller/MarcaServiceTest.java` | Se eliminó stub muerto (`when(repository.findById(any()))` no usado) que generaba `UnnecessaryStubbing`. Ahora 6/6. |

### Validación

- Marcaje manual del equipo 7 a `DEVUELTO` en BD; atención de avería deja `estadoOperativo` intacto.
- Suite backend unit: 67/67 (sin contar `MarcaResourceTest` @QuarkusTest que requiere env OIDC).
- Mobile: 16/16.

---

## Hito 2 — Horómetro en el registro de avería (V22)

### Problema

El registro de avería no capturaba el horómetro de la máquina en el momento de la falla, perdiéndose un dato operativo clave para planificar mantenimientos.

### Solución — Migración `V22__averias_horometro.sql`

```sql
ALTER TABLE fac_averias ADD COLUMN IF NOT EXISTS horometro NUMERIC(12,2);
```

| Archivo | Cambio |
|---|---|
| `entity/Averia.java` | Campo `horometro` (`BigDecimal`). |
| `dto/AveriaDTO.java` | `horometro` con validación `@DecimalMin`, `@Digits(integer=12, fraction=2)`. |
| `mapper/AveriaMapper.java` | Mapeo bidireccional. |
| `service/AveriaService.java` | `crear` valida `horometro` (1–6 enteros + 1 decimal) y lo persiste. |

### Validación (producción local)

- Crear avería con `fechaHoraAveria = 2026-06-30T10:30:00-05:00` y `horometro = 12800.5` → BD guarda la fecha reportada (no la actual) y el horómetro.
- `400` si el horómetro está fuera de formato.

---

## Hito 3 — Horómetro al atender la avería (V25)

### Problema

Al marcar una avería `ATENDIDA` no se registraba el horómetro de la máquina al quedar operativa, ni los días que estuvo inactiva. La trazabilidad quedaba incompleta: horómetro de reporte sí, horómetro de atención no.

### Solución — Migración `V25__averias_horometro_atencion.sql`

```sql
ALTER TABLE fac_averias ADD COLUMN IF NOT EXISTS horometro_atencion NUMERIC(12,2);
```

### Backend

| Archivo | Cambio |
|---|---|
| `entity/Averia.java` | Campo `horometroAtencion` + `diasInactividad` (transient, calculado). |
| `dto/AveriaDTO.java` | `horometroAtencion`, `diasInactividad`. |
| `mapper/AveriaMapper.java` | Mapeo bidireccional + cálculo de `diasInactividad` vía `ChronoUnit.DAYS.between(fechaHoraAveria, fechaHoraAtencion)`. |
| `service/AveriaService.java` | `actualizar(id, dto)` con `estadoAveria="ATENDIDA"`: exige `horometroAtencion` en la primera atención (400 si falta), valida formato (igual que `horometro`), valida `horometroAtencion >= horometro` reportado (400 si la máquina “retrocedió”), setea `fechaHoraAtencion = now`, calcula y persiste `diasInactividad`. |

### Mobile — `AtenderAveriaScreen.js`

| Aspecto | Detalle |
|---|---|
| Input | "Horómetro de atención *" (numérico, solo lectura si ya atendida). |
| Display | Tras atender, muestra horómetro de atención + "Días inactivo: N". |
| Validación UI | Bloquea submit si el horómetro vacío o menor al reportado. |

### Web — `frontend/src/pages/Averias.jsx`

- Columna "Horómetro Atención" en la tabla (muestra `horometroAtencion`).
- Columna "Días Inactivo" calculada desde `diasInactividad` del DTO.

### Pruebas

- `AveriaServiceTest` — 12/12 (incluye: atender exige horómetro, valida `>=` reportado, calcula días).
- `AtenderAveriaScreen.test.js` — 3/3 (requiere mocks de tema con `action.secondary` y `LoadingScreen`).

### Validación E2E (producción local Docker)

| Paso | Resultado |
|---|---|
| Reportar avería (fecha `2026-06-30`, horómetro `12800.5`) | BD guarda fecha y horómetro reportados |
| Atender con `horometroAtencion=12800.5` | `400` (debe ser `>` al reportado) |
| Atender con `horometroAtencion=12900.5` | `200`, `fechaHoraAtencion = now`, `dias_inactividad = 41` (ChronoUnit.DAYS entre 2026-06-30 y 2026-08-10) |
| Datos de prueba | Avería 19 eliminada, equipo 12 restaurado a `AVERIADO` |

---

## Hito 4 — Trazabilidad de usuario desde JWT (Auditoría transversal)

### Problema

Todos los `Resource` usaban el patrón `dto.getUsuarioCreacion() != null ? ... : 1L` en los services, pero los controllers **no inyectaban el usuario del JWT**. Como los clientes nunca envían `usuarioCreacion`/`usuarioActualizacion`, siempre caía al fallback `1L` (Super Admin). Resultado: en `fac_averias` y `fac_equipos`, **todos** los registros aparecían como creados/actualizados por el Super Admin (id 1), aun cuando el operador real era José Anyarín (id 17).

Verificación en BD: todas las averías tenían `usuario_creacion = 1` y `usuario_actualizacion = 1`. Lo mismo en `fac_equipos`.

### Solución —Usuario tomado del token, inmutable por el cliente

Cada controller inyecta `@Context SecurityContext context` en `crear`/`actualizar` y asigna el id del JWT al DTO/Request antes de delegar al service:

```java
dto.setUsuarioCreacion(SecurityUtil.getUsuarioId(context));      // crear
dto.setUsuarioActualizacion(SecurityUtil.getUsuarioId(context)); // actualizar
```

`SecurityUtil.getUsuarioId(context)` lee el `subject` del `JsonWebToken` (numeric id del usuario autenticado). El service mantiene el fallback `1L` solo como defensa para llamadas internas/sin token, pero en el flujo HTTP el id siempre viene del JWT.

### Controllers corregidos (11 + 2 soporte)

| Controller | `crear` | `actualizar` |
|---|---|---|
| `AveriaResource` | ✅ | ✅ |
| `EquipoResource` | ✅ (nuevo) | ✅ (ya existía) |
| `CampanaResource` | ✅ | ✅ |
| `MarcaResource` | ✅ | ✅ |
| `MotivoPsrResource` | ✅ | ✅ |
| `ProveedorResource` | ✅ | ✅ |
| `RolResource` | ✅ | ✅ |
| `SedeResource` | ✅ | ✅ |
| `TipoEquipoResource` | ✅ | ✅ |
| `UsuarioResource` | ✅ | ✅ |
| `PsrResource` | ✅ (PsrRequest) | ✅ (PsrRequest, también setea `osr.usuarioActualizacion`) |
| `OsrResource` | ✅ (OsrRequest) | — (solo crear) |

`OsrRequest` no tenía campos de usuario: se añadió `usuarioCreacion` + getter/setter, y `OsrService.crear` dejó de hardcodear `1L` para leer `request.getUsuarioCreacion() != null ? ... : 1L`.

> Los endpoints de evidencias (`AveriaResource.subirEvidencia`, `DevolucionEquipoResource`, `IngresoEquipoResource`) **ya** pasaban `SecurityUtil.getUsuarioId(context)` explícitamente, por lo que sus registros sí quedaban correctos. Este hito cierra la brecha en los CRUD transaccionales.

### Pruebas

| Test | Resultado |
|---|---|
| `AveriaResourceTest` (nuevo) | 3/3 — crear asigna usuario del token, actualizar asigna usuario del token, sin token → null |
| `EquipoResourceTest` (nuevo) | 2/2 — crear/actualizar asignan usuario del token |
| Suite backend completa | **74 tests, 0 fallos**, 1 error pre-existente (`MarcaResourceTest` @QuarkusTest requiere env OIDC), 1 skipeado |

### Validación E2E (producción local Docker)

Autenticado como usuario **23** (Carla Huamanorqque, password `00000000`):

| Operación | Resultado BD |
|---|---|
| `POST /averias` (crear avería 19) | `fac_averias.usuario_creacion = 23` |
| `PUT /averias/19` (atender) | `fac_averias.usuario_actualizacion = 23` |
| `POST /equipos` (crear equipo 18) | `fac_equipos.usuario_creacion = 23` |
| `PUT /equipos/18` (actualizar) | `fac_equipos.usuario_actualizacion = 23` |

> Con el login real de José Anyarín (id 17) todos los registros quedan a su nombre. Los registros históricos (ya con `usuario_creacion = 1`) **no se modificaron**: el fix es hacia adelante.

Datos de prueba limpiados (avería 19 y equipo 18 eliminados).

---

## Migraciones aplicadas (V21–V25)

| Archivo | Contenido |
|---|---|
| `V21__evidencia_horometro_inicial.sql` | Amplía `chk_evidencia_ingreso_tipo` para aceptar `HOROMETRO_INICIAL` como tipo de evidencia de ingreso. |
| `V22__averias_horometro.sql` | Agrega `horometro NUMERIC(12,2)` a `fac_averias` (horómetro en el reporte). |
| `V23__superadmin_protegido.sql` | Corrige `rol_id` del Super Admin seed a 1 y crea trigger `proteger_super_admin` que impide eliminarlo, cambiar su rol/estado/id_microsoft/nombre/correo. |
| `V24__backfill_horometro_inicio.sql` | Completa `horometro_inicio` NULL en `fac_equipos` con un valor aleatorio entre 1234.5 y 24345.6 (bug: `IngresoEquipoService.applyData` no persistía horómetros en borradores). |
| `V25__averias_horometro_atencion.sql` | Agrega `horometro_atencion NUMERIC(12,2)` a `fac_averias` (horómetro al atender). |

---

## Archivos Modificados/Creados (resumen)

### Backend

| Archivo | Acción |
|---|---|
| `dto/ApiResponse.java` | Modificado (campo `error`) |
| `dto/AveriaDTO.java` | Modificado (`horometro`, `horometroAtencion`, `diasInactividad`) |
| `dto/OsrRequest.java` | Modificado (`usuarioCreacion`) |
| `entity/Averia.java` | Modificado (`horometro`, `horometroAtencion`, `diasInactividad`) |
| `mapper/AveriaMapper.java` | Modificado (mapeo + cálculo días) |
| `service/AveriaService.java` | Modificado (crear usa fecha DTO, atender valida horómetro, no revierte devolución) |
| `service/OsrService.java` | Modificado (lee `usuarioCreacion` de request, no hardcodea 1L) |
| `controller/*.java` (11) | Modificados (inyectan `SecurityContext` y setean usuario del JWT en crear/actualizar) |
| `db/migration/V2[1-5]__*.sql` | Nuevas (5 migraciones) |
| `test/.../controller/AveriaResourceTest.java` | Nuevo (3 tests) |
| `test/.../controller/EquipoResourceTest.java` | Nuevo (2 tests) |
| `test/.../service/AveriaServiceTest.java` | Modificado/ampliado (12 tests) |
| `test/.../service/DevolucionEquipoServiceTest.java` | Nuevo (7 tests) |
| `test/.../service/MarcaServiceTest.java` | Modificado (eliminado stub muerto) |

### Mobile

| Archivo | Acción |
|---|---|
| `src/screens/AtenderAveriaScreen.js` | Modificado (input horómetro atención + display días inactivo) |
| `src/utils/equipmentForm.js` | Modificado (`filterEquiposByMode` oculta DEVUELTO) |
| `src/__tests__/AtenderAveriaScreen.test.js` | Nuevo (3 tests) |

### Web

| Archivo | Acción |
|---|---|
| `src/pages/Averias.jsx` | Modificado (columnas horómetro atención + días inactivo) |

---

## Decisiones

- **Usuario del JWT, no del cliente**: el id se asigna en el controller desde `SecurityContext`; el cliente no puede falsificarlo (defensa contra suplantación de auditoría).
- **Fallback `1L` conservado** en services: defensa para llamadas internas/sin `SecurityContext`, pero el flujo HTTP siempre setea el id real.
- **No se modificaron registros históricos** (`usuario_creacion = 1`): el fix es hacia adelante; los registros nuevos quedan asociados al operador real.
- **Horómetro atención ≥ horómetro reportado**: validación de dominio (una máquina no puede “retroceder” su horómetro).
- **`diasInactividad`** se calcula con `ChronoUnit.DAYS.between(fechaHoraAveria, fechaHoraAtencion)` (días calendario, no hábiles).
- **No revertir devolución al atender**: si el equipo ya fue devuelto (`fecha_devolucion` seteada), atender una avería no lo vuelve `OPERATIVO`.

---

## Estado del sistema tras el hito

- Backend reconstruido y desplegado (`docker compose build backend && up -d backend`), health check `UP`.
- Suite backend unit: **74 tests, 0 fallos** (1 error pre-existente `MarcaResourceTest` que requiere env OIDC; no relacionado).
- Migraciones V21–V25 aplicadas en la BD local Docker.
- Trazabilidad de usuario operativa para `fac_averias`, `fac_equipos` y todos los catálogos (`dim_*`/`fac_psr`/`fac_osr`).
