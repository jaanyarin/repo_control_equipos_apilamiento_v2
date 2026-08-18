# HDT-014 — Timeline Dinámico de Detalle de Equipo (segunda pantalla mobile)

| Campo | Valor |
|---|---|
| Estado | Implementado y validado (compile + tests) |
| Fecha | 2026-08-17 |
| Responsable de desarrollo | AI Full Stack (opencode) |
| Alcance | Backend Quarkus (endpoint consolidado) + Mobile React Native CLI (segunda pantalla) |
| Hitos incluidos | Endpoint `GET /api/v1/equipos/{id}/timeline` · `EquipoTimelineService` · `EquipoTimelineScreen` · componentes de timeline · botón "Ver Historial" |

---

## Objetivo

Implementar el **timeline dinámico de detalle de equipo** definido en `documentacion_general/base/Timeline_Dinamico_Detalle_Equipo.md` como una **segunda pantalla** de la app mobile React Native (React Native CLI puro, sin Expo), sin modificar `EquipoDetailScreen` (queda como backup). El backend es la **fuente de verdad**: un endpoint nuevo consolida los eventos reales del equipo (PSR, OSR, ingreso, averías, reparaciones, finalización) y calcula los tiempos de parada.

---

## Hito 1 — Backend: endpoint consolidado de timeline

### Problema

El mobile no tenía una vista cronológica del ciclo de vida de un equipo. Los datos vivían dispersos en PSR/OSR, ingreso, averías y devolución, y cada pantalla los consultaba por separado.

### Solución

Nuevo endpoint `GET /api/v1/equipos/{id}/timeline` que consolida los eventos reales y expone el resumen operativo del equipo.

| Archivo | Cambio |
|---|---|
| `dto/EquipoTimelineDTO.java` | DTO raíz: `equipmentId`, `currentStatus`, `summary`, `events`. |
| `dto/EquipoTimelineSummaryDTO.java` | Resumen: `entryDate`, `initialHourMeter`, `finalHourMeter`, `failureCount`, `totalDowntimeMinutes`, `finalDate`. |
| `dto/EquipoTimelineEventDTO.java` | Evento: `id`, `equipmentId`, `type`, `dateTime`, `title`, `description`, `status`, `metadata`, `photos`, `relatedId`. |
| `dto/EquipoTimelineMetadataDTO.java` | Metadatos por tipo: `documentNumber`, `provider`, `area`, `campana`, `costPerMonth`, `currency`, `failure`, `action`, `downtimeMinutes`, `userName`, `hourMeter`. |
| `dto/EquipoTimelinePhotoDTO.java` | Foto: `id`, `url` (relativa), `label`. |
| `service/EquipoTimelineService.java` | Consolidación de eventos: PSR, OSR, INGRESO, AVERIA, REPARACION, FINALIZACION. Cálculo de downtime con `ChronoUnit.MINUTES`. Nombre de usuario con caché (`UsuarioRepository.findByIdOptional`). Fotos con URLs relativas de evidencias. Orden cronológico descendente (null fechas al final). |
| `controller/EquipoResource.java` | `@GET @Path("/{id}/timeline")` → delega a `EquipoTimelineService`. 404 si el equipo no existe. |
| `test/.../EquipoTimelineServiceTest.java` | 7 tests Mockito (equipo no encontrado, eventos PSR/OSR/ingreso/finalización pendiente, avería atendida con downtime, avería abierta `EN_PROCESO`, devolución con foto, evidencias de ingreso, fotos de avería). |
| `test/.../EquipoResourceTest.java` | Ajuste constructor por nueva dependencia `EquipoTimelineService`. |

### Eventos y estados del timeline

| Evento | Fuente | Estado |
|---|---|---|
| `PSR` | PSR del equipo (vía `Osr.equipoId`) | `COMPLETADO` / `EN_PROCESO` |
| `OSR` | OSR del equipo | `COMPLETADO` / `EN_PROCESO` |
| `INGRESO` | `fechaIngreso` + evidencias de ingreso | `COMPLETADO` |
| `AVERIA` | avería reportada | `ATENDIDA` → `COMPLETADO` / `REPORTADA` → `EN_PROCESO` |
| `REPARACION` | avería atendida (fecha de atención) | `COMPLETADO` |
| `FINALIZACION` | `fechaDevolucion` (si `estadoOperativo == "DEVUELTO"`) | `COMPLETADO` |
| `FINALIZACION` pendiente | equipo no devuelto | `PENDIENTE` |

### Validación

- Backend compilado y empaquetado OK vía Docker Maven.
- `EquipoTimelineServiceTest`: 7/7 PASS en contenedor.
- `EquipoResourceTest`: 2/2 PASS en contenedor.

> **Orden:** los eventos se entregan en orden **cronológico ascendente** (más antiguo arriba): PSR → OSR → INGRESO → AVERIA → REPARACION → FINALIZACION, con tie-break por tipo cuando la fecha coincide y los eventos pendientes (sin fecha) al final. DTOs y service lo garantizan; el mobile solo renderiza.

---

## Hito 2 — Mobile: segunda pantalla de timeline

### Solución

`EquipoTimelineScreen` se registra como **pantalla nueva** (`EquipoTimeline`) y se accede desde el botón **"Ver Historial"** (icono `history`) en `EquiposListScreen`. `EquipoDetailScreen` no se modifica.

| Archivo | Cambio |
|---|---|
| `mobile/src/components/equipment/timeline/timeline.config.js` | Catálogo de tipos/estados/colores (usa `colors.status.*`). |
| `mobile/src/components/equipment/timeline/timeline.utils.js` | Formatters: `formatDateTime`, `formatDate`, `formatHourMeter`, `formatCurrency`, `formatDowntime`, `formatDowntimeLong`. |
| `mobile/src/components/equipment/timeline/TimelineConnector.js` | Conector vertical entre nodos. |
| `mobile/src/components/equipment/timeline/TimelineEventDetails.js` | Detalle expandible por evento. |
| `mobile/src/components/equipment/timeline/TimelineEvent.js` | Nodo con animación expand/collapse, icono check/círculo, badge de estado. |
| `mobile/src/components/equipment/timeline/EquipmentTimeline.js` | `FlatList` con estados loading/vacío/error, `RefreshControl`, `ListHeaderComponent`, render de fotos. |
| `mobile/src/screens/EquipoTimelineScreen.js` | Fetch paralelo `GET /equipos/{id}` + `/equipos/{id}/timeline`; cards de resumen operativo (ingreso, horómetro inicial/final, averías, tiempo inactividad, finalización); visor de fotos full-screen con `ZoomableImage` + `StatusBar hidden`. |
| `mobile/src/navigation/AppNavigator.js` | Registro de `EquipoTimelineScreen` como `EquipoTimeline` (título "Historial del Equipo"). |
| `mobile/src/screens/EquiposListScreen.js` | Botón "Ver Historial" (icono `history`) en modo manage con edición, sin edición y otros modos. |
| `mobile/src/__tests__/timelineUtils.test.js` | 16 tests de formatters. |
| `mobile/src/__tests__/timeline.test.js` | 6 tests de componentes/config. |

### Validación

- Mobile: `npx eslint .` → EXIT 0 (sin warnings).
- Mobile: `npx jest` → 22 suites / 103 tests PASS (incluye test de re-expand tras contraer).
- Rebuild backend Docker + Rebuild APK release: OK.

---

## Correcciones de UX (feedback en campo)

| Hallazgo | Corrección |
|---|---|
| Los eventos se veían en orden **descendente** (el más reciente arriba) | Backend ahora ordena **ascendente** (PSR → OSR → ingreso → averías/reparaciones → finalización), cronológico con tie-break por tipo. |
| Al expandir → contraer → volver a expandir, el detalle **no volvía a mostrarse** | Bug en `TimelineEvent.js`: el estado `showDetails` nunca volvía a `false` (el callback del collapse exigía `!showDetailsRef.current` que era `false`). Se reemplazó por un estado único `expanded` con animación idempotente en `useEffect`. |
| El resumen operativo no tenía el orden pedido | Ahora es 2 filas × 3 columnas: `F.ingreso · Nro. averías · F. finalización` / `Horómetro inicio · T. inactividad · Horómetro fin`. |

---

## Decisiones de diseño

1. **Segunda pantalla en vez de modificar `EquipoDetailScreen`**: confirmado por el usuario (acceso desde botón "Ver Historial" en el listado). El detalle actual queda intacto como backup.
2. **Backend como fuente de verdad**: el endpoint consolida eventos y tiempos de parada; el mobile solo renderiza.
3. **Vínculo equipo↔OSR↔PSR**: `Osr.equipoId` es el puente para resolver la PSR asociada al equipo.
4. **Fotos con URL relativa**: se usan las mismas rutas de evidencias ya existentes (ingreso/devolución/avería) para que el cliente las resuelva contra su base URL con auth Bearer vía `ZoomableImage`.
