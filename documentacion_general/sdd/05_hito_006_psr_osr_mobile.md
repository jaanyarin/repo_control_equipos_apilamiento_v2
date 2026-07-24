# HDT-006 — Gestión móvil PSR/OSR

| Campo | Valor |
|---|---|
| Estado | Implementado y validado |
| Fecha | 2026-07-24 |
| Responsable de desarrollo | Codex |
| Alcance | Backend Quarkus, PostgreSQL, aplicación Android |

## Objetivo

Completar el flujo móvil de PSR/OSR: creación de una OSR relacionada, edición
administrativa conjunta, presentación de catálogos por nombre, cálculo de
duración por meses calendario y formulario de creación/edición de PSR con
date picker nativo y validación Zod.

## Hito 1 — Backend + Web + Mobile base

### Funcionalidad validada

- Una PSR admite una sola OSR relacionada.
- El número PSR y el número OSR son únicos e inmutables.
- La OSR registra costo unitario y moneda `PEN`, `USD` o `EUR`.
- Los perfiles Admin y Super Admin pueden crear OSR y editar PSR/OSR.
- La edición actualiza PSR, costo y moneda OSR en una sola transacción.
- Los cards muestran el nombre de campaña y sede, no sus identificadores.
- El período incluye la fecha final y usa meses calendario:
  `01/08/2026–31/10/2026 = 3.00`.
- Las migraciones V16 y V17 fueron aplicadas correctamente.

### Evidencia técnica

- Backend: 4 pruebas PSR/OSR aprobadas.
- Mobile: 17 pruebas Jest aprobadas.
- ESLint mobile sin errores.
- Build Docker backend exitoso y health check `UP`.
- Verificación en dispositivo Android mediante ADB:
  - card `Psr001 - Osr001`;
  - campaña `26-27`;
  - sede `Packing Uva`;
  - costo y moneda actualizados;
  - formulario Editar PSR con campos OSR;
  - navegación de retorno y refresco del card.

### Decisiones

- Los meses completos se calculan por períodos calendario inclusivos.
- Los días parciales se prorratean con el promedio de 30.44 días.
- La actualización OSR se incluye como objeto opcional en el request de
  actualización PSR para conservar atomicidad.

---

## Hito 2 — CreatePsrScreen Mobile (2026-07-24)

### Funcionalidad implementada

- **CreatePsrScreen.js:** Formulario completo de creación/edición de PSR con:
  - React Hook Form para manejo de estado del formulario.
  - Zod para validación de esquema (todos los campos requeridos, máx 500 chars observación, fecha no futura).
  - `@react-native-community/datetimepicker` para selección de fecha nativa Android/iOS.
  - Catálogos obtenidos de API: campañas (autodetecta activa), sedes, motivos de PSR.
  - Cálculo automático de mes y año al seleccionar fecha.
  - Formato display `dd/MM/yyyy`, envío API `yyyy-MM-dd`.
  - Modo creación (`mode='create'`) y edición (`mode='edit'`) con datos precargados desde navigation params.
  - POST a `/api/v1/psr` (201) o PUT a `/api/v1/psr/{id}` (200).
  - `goBack()` al listado tras submit exitoso.
- **PsrOsrScreen.js:** Botón lápiz (editar) por fila + botón `+` en header.
- **AppNavigator.js:** Ruta `CreatePsr`, título dinámico, `headerRight` con `+`.

### Dependencia instalada

- `@react-native-community/datetimepicker@7.6.1`

### Archivos modificados/creados

| Archivo | Acción |
|---|---|
| `mobile/src/screens/CreatePsrScreen.js` | Nuevo (396 líneas) |
| `mobile/src/screens/PsrOsrScreen.js` | Modificado (botón editar + navigation) |
| `mobile/src/navigation/AppNavigator.js` | Modificado (ruta + headerRight) |
| `mobile/package.json` | Modificado (dependencia) |

### Validación

- Código compila sin errores de sintaxis ni ESLint.
- Arquitectura: Clean Architecture (api.js → screens, navegación por params).
- Consistente con MD3, tema Vanguard y 14 componentes reutilizables.
