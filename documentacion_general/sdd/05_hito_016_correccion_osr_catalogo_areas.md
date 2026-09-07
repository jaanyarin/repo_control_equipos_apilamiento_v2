# HDT-016 — Corrección PSR/OSR y catálogo de áreas

| Campo | Valor |
|---|---|
| Estado | Implementado |
| Fecha | 2026-09-06 |
| Responsable | AI Full Stack |
| Versión mobile | 1.13.0 (minor) |

## Objetivo

Corregir el formulario mobile de creación y edición de OSR para conservar la información de la PSR asociada y permitir registrar una OSR nueva desde campos vacíos. Además, incorporar el catálogo de áreas y usarlo al crear o editar usuarios en las interfaces web y mobile.

## PSR/OSR

- El formulario `Agregar OSR` muestra número de PSR, fecha PSR, fecha de inicio, fecha de fin y meses calculados de la PSR asociada.
- Las fechas serializadas como `LocalDateTime` con segundos se normalizan para visualización y cálculo.
- Al crear una OSR, `numeroOsr` y `costoUnitario` inician vacíos.
- Al editar una OSR, se conservan el número, costo y moneda de la OSR seleccionada.
- El alcance existente de PSR 1:N OSR se mantiene.

## Catálogo de áreas

### Backend

- Migración `V34__dim_areas.sql` crea `dim_areas` y siembra:
  - Recepción Packing
  - Almacén de Materiales
  - Frío
  - Cámara de Producto Terminado
- Se añadieron las capas `Area`, `AreaDTO`, `AreaRepository`, `AreaService`, `AreaMapper` y `AreaResource`.
- Endpoints bajo `/api/v1/areas`:
  - `GET /areas` y `GET /areas/{id}` para consulta.
  - `POST /areas`, `PUT /areas/{id}` y `DELETE /areas/{id}` para Admin/Super Admin.
- `Usuario.area` conserva compatibilidad con datos existentes y recibe el valor seleccionado del catálogo.

### Web

- Nueva ruta `/areas` y entrada de navegación `Áreas`.
- CRUD con alta, edición, activación/desactivación y eliminación.
- Crear y editar usuario carga `/areas` y obliga a seleccionar un área activa.

### Mobile

- Nueva pantalla `AreasScreen` dentro de la pestaña Catálogos.
- CRUD reutilizando `CatalogScreen`.
- `CreateEditUserScreen` carga áreas en tiempo real y envía `area` al crear/actualizar.

## Validación

- Migración Flyway aplicada en PostgreSQL: versión `34`, cuatro áreas activas.
- Backend Docker construido y arrancado con JDK 21.
- Tests mobile enfocados: `CreatePsrScreen.test.js` y `CreateEditUserScreen.test.js`, 8/8.
- ESLint mobile: correcto.
- Build frontend web: correcto.
- APK release Gradle: `BUILD SUCCESSFUL`.

## Archivos principales

| Archivo | Cambio |
|---|---|
| `backend/src/main/resources/db/migration/V34__dim_areas.sql` | Nueva tabla y semillas |
| `backend/src/main/java/com/apilamiento/control/controller/AreaResource.java` | API CRUD de áreas |
| `mobile/src/screens/CreatePsrScreen.js` | Corrección del formulario OSR |
| `mobile/src/screens/CreateEditUserScreen.js` | Selector de área |
| `mobile/src/screens/AreasScreen.js` | CRUD mobile de áreas |
| `frontend/src/pages/Areas.jsx` | CRUD web de áreas |
| `frontend/src/pages/Usuarios.jsx` | Selector de área web |
