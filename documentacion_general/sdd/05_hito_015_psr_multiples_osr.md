# HDT-015 — PSR 1:N OSR (múltiples OSR por PSR)

| Campo | Valor |
|---|---|
| Estado | Implementado (sin build, pendiente validación en server) |
| Fecha | 2026-08-26 |
| Responsable | AI Full Stack (opencode) |
| Alcance | Backend Quarkus (migración + DTO + services + controllers + ingreso) + Mobile React Native CLI (3 screens) |
| Versión | 1.12.0 (minor) |

---

## Objetivo
Una PSR (Pedido de Servicio) podía tener 1 OSR (Orden de Servicio) como máximo (constraint `fac_osr.psr_id UNIQUE`). Se requiere que una PSR pueda contener **N OSRs (ilimitado)**, cada una con su propio número, costo/moneda y equipo. El PSR se considera **FINALIZADO** solo cuando **todas** sus OSRs tienen equipo `DEVUELTO`; con `x/N` devueltas queda **PARCIAL**. Los datos históricos deben seguir funcionando y permitir agregar más OSRs.

---

## Análisis previo (Ley 1)
- **Contrato backend verificado**: `PsrService.toDTO` usaba `findByPsrId Optional` (1:1), `OsrService.crear` hacía `409 si ya tiene OSR`, `PsrService.eliminar` bloqueaba si existe OSR. Todos deben pasar a lista.
- **Patrones reutilizados**: `CampanaResource.activar/cerrar` no aplica; se reutiliza `WebApplicationException 409` con mensaje accionable (ya usado en `MarcaService.eliminar`), `ApiResponse.ok(data)` y `SecurityUtil.getUsuarioId`.
- **Config tests**: backend JUnit5 + Mockito (14 mocks), mobile Jest 29 + eslint 8. Fallos pre-existentes: `MarcaResourceTest` @QuarkusTest requiere env OIDC (no bloquea).
- **Estimación build**: backend `mvn package` 60-80s, mobile lint 5s. No se hace build APK por indicación explícita.
- **Alternativas**: A) 1:N directo (DROP UNIQUE) — elegida (mínimo diff); B) tabla puente N:M — descartada (over-engineering, no hay caso N:M).

---

## Backend

### Migración
| Archivo | Cambio |
|---|---|
| `V32__psr_multiples_osr.sql` | `DROP CONSTRAINT fac_osr_psr_id_key` (UNIQUE) vía bloque DO dinámico + `CREATE INDEX psr_numero` |

### Entidades y Repos
- `Osr.java`: `@Column(psr_id, unique=true)` → sin unique.
- `OsrRepository.java`: `listByPsrId`, `listByPsrIdForUpdate`, `countByPsrId`; mantiene `findByPsrId` para compat.

### DTOs
- `PsrDTO.java`: `List<OsrDTO> osrs` + `estadoPsr` (ACTIVO/PARCIAL/FINALIZADO) + `osrsTotal/osrsFinalizadas`; `osr` alias deprecated al primero para APK vieja.
- `OsrDTO.java`: `equipoId`, `estadoEquipo`, `marca`, `modelo`, `grr`, `finalizado`.
- `IngresoEquipoRequest.java`: `osrId` opcional.
- `OsrMapper.java`: mapea `equipoId`.

### Services
- `PsrService.toDTO`: lista `osrs`, enriquece cada una con equipo, calcula `estadoPsr`/`finalizado` por `allMatch DEVUELTO`, `osrsFinalizadas`. Backward: `marca/modelo/grr` del primer equipo.
- `PsrService.estaFinalizado`: `allMatch DEVUELTO`, vacío → false. `tieneOsrConEquipo` para `eliminar` (bloquea solo si alguna OSR tiene equipo; vacías se borran en cascada). `actualizar` edita primera OSR por compat si `request.osr` viene.
- `OsrService`: permite N (elimina 409), `listarPorPsrId`, `buscarPorId`, `actualizar`, `eliminar` (409 si `equipoId !=null`).
- `IngresoEquipoService`: `listarPsrPendientes` itera `psr × osrs` (1 fila por OSR); `crearBorrador` con `osrId` (si no viene y hay >1 disponible exige `osrId`).

### Controllers
- `OsrResource.java`: `GET /osr/{id}`, `GET /osr/por-psr/{id}` (lista), `GET /por-psr/{id}/unica` (compat), `POST /osr`, `PUT /osr/{id}`, `DELETE /osr/{id}`. Todos `@RolesAllowed Admin/Super Admin` excepto GET lista (también Usuario via PsrResource).

### Validación
- `numero_osr` sigue `UNIQUE` global; `numero_psr` idem.
- `PUT /osr/{id}` y `PUT /psr/{id}` con OSR finalizada → 409.
- `DELETE /psr` con OSR con equipo → 409 accionable.

---

## Mobile

| Pantalla | Cambio |
|---|---|
| `PsrOsrScreen.js` | Card PSR con `StatusChip` ACTIVO / `1/3 Finalizadas` (PARCIAL) / FINALIZADO, lista de OSRs con costo/equipo/estado y acciones por OSR (pencil/delete). `Agregar OSR` siempre visible si no FINALIZADO. Búsqueda en `numeroPsr` + todos `osr.numeroOsr`. |
| `CreatePsrScreen.js` | Modos `osr` (crear) + `editOsr` (PUT /osr/{id} costo/moneda). `numeroOsr` upperCase, editable solo al crear. PSR edit mantiene inline primera OSR. |
| `SelectPsrEquipmentScreen.js` | `keyExtractor` por `osrId`, selección por OSR, `FlatList` de OSRs pendientes. |
| `EquipmentFormScreen.js` | `POST /ingresos-equipo/borradores` envía `osrId` además de `psrId`. |

---

## Tests
- `PsrServiceTest` 7 tests (nuevo: parcial `1/2`), `OsrServiceTest` 3 tests (múltiples OSR, duplicado numero), `IngresoEquipoServiceTest` 8 tests (múltiples OSR por PSR, borrador con horómetro).
- Mobile no añade tests nuevos (cambios UI puros); suite existente debe pasar.

---

## Documentación y versionado
- `AGENTS.md`: V30-V32, HDT-015, versión 1.12.0.
- `README.md`: HDT-015, versión 1.12.0.
- `04_implementaciones.md` §42.
- `mobile/package.json` + `android/app/build.gradle` 1.12.0 (11200), `versionHistory.js` entrada 1.12.0.

---

## Instrucciones de retorno
1. Backend: `docker compose up -d` aplicará `V32`; verificar `GET /psr` incluye `osrs[]` y `GET /osr/por-psr/{id}` lista.
2. Mobile: probar PSR con 3 OSRs (1 devuelta, 2 activas) → chip PARCIAL y acciones por OSR.
3. Ingreso: `GET /ingresos-equipo/psr-pendientes` debe listar 1 fila por OSR sin equipo.
4. No se requiere rebuild APK; el usuario lo hará.

---

## Pendientes de auditoría
- Gate G-MIG: V32 sin rollback explícito (es DROP UNIQUE, reversible con ADD UNIQUE solo si no hay duplicados).
- Gate G-TEST-FE: sin tests nuevos mobile para 1:N (deuda 🟢).
