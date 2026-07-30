# SOFTWARE DEVELOPMENT DOCUMENT (SDD)
# 04_IMPLEMENTATION.md

---

# 1. Control Documental

| Campo | Valor |
|---|---|
| Documento | 04_IMPLEMENTATION.md |
| Proyecto | Sistema de Control Operativo de Equipos de Apilamiento |
| Estado | En desarrollo sincronizado con repositorio |
| Versión | 1.5 |
| Fecha | 2026-07-24 |
| Responsable | Jose Anyarin |
| Base de Datos Oficial | PostgreSQL 18 |

---

# 2. Decisión Técnica Oficial

PostgreSQL 18 queda definido como motor oficial de base de datos del proyecto.

Esta decisión está alineada con el estado actual del repositorio:

- Docker Compose usa PostgreSQL.
- Backend Quarkus usa driver PostgreSQL.
- Las migraciones se gestionan con Flyway.
- La persistencia relacional se implementa con Hibernate ORM Panache.
- El timezone operativo oficial es America/Lima.
- Las evidencias fotográficas usarán filesystem y rutas persistidas en PostgreSQL.

No se usará MySQL en este proyecto.

---

# 3. Arquitectura Consolidada

| Capa | Tecnología |
|---|---|
| Frontend Web | React 18, Vite, MUI |
| Frontend Mobile | Expo React Native SDK ~54.0.35 (NO migrado a CLI) |
| Backend | Quarkus Java 3.14.4 |
| API | REST versionada en /api/v1 |
| Seguridad | JWT propio + BCrypt |
| Base de Datos | PostgreSQL 18 |
| Migraciones | Flyway |
| Proxy | Nginx |
| Contenedores | Docker Compose |

---

# 4. Módulos Implementados

| Módulo | Estado |
|---|---|---|
| Autenticación local BCrypt | ✅ Validado |
| JWT propio | ✅ Validado |
| Usuarios (seed local + CRUD mobile con permisos) | ✅ Validado |
| Roles (Service + DTO + Mapper + CRUD mobile) | ✅ Validado |
| Sedes | ✅ Validado (mobile + web CRUD) |
| Campañas | ✅ Validado (mobile + web + activar/cerrar) |
| PSR / OSR | ✅ Validado (CRUD mobile + web + CreatePsrScreen con date picker) |
| Equipos | ✅ Validado (mobile + web + detalle con botón dinámico) |
| Tipos de Equipo | ✅ Validado (mobile + web CRUD) |
| Proveedores | ✅ Validado (mobile + web CRUD) |
| Marcas | ✅ Validado (mobile + web CRUD) |
| Averías | ✅ Validado (mobile + web + Finalización del Servicio) |
| Auditoría (backend audit/ + mobile screen + V10-V11) | ✅ Validado |
| Configuración (mobile SettingsScreen URL) | ✅ Validado |
| Frontend web (Nginx) | ✅ Validado |
| Mobile login local | ✅ Validado |
| APK inicial (Expo SDK 54, EAS Cloud) | ✅ Validado |
| Docker + PostgreSQL + Nginx | ✅ Validado |
| Migración V8: login_local | ✅ Validado |
| Migración V9: seed_usuarios_local | ✅ Validado |
| Migraciones V10-V11: auditoría | ✅ Validado |
| Componentes UI reutilizables mobile (14) | ✅ Validado |
| Sistema de tema mobile (Design Tokens + MD3) | ✅ Validado |
| Pantalla PSR/OSR mobile (listado + editar) | ✅ Validado |
| Pantalla crear PSR mobile (React Hook Form + Zod + date picker) | ✅ Validado |
| Pantallas catálogos mobile (CatalogScreen genérico) | ✅ Validado |
| Pantalla auditoría mobile | ✅ Validado |
| Pantalla configuración mobile | ✅ Validado |
| CreateEditUserScreen mobile (CRUD usuarios con permisos) | ✅ Validado |
| Finalización del Servicio (backend + mobile) | ✅ Validado |
| Navegación mobile (AuthStack + MainStack + BottomTabs 4 tabs) | ✅ Validado |
| Tests backend (7), web (2), mobile (3) | ✅ Validado |
| CI/CD GitHub Actions | ✅ Validado |
| Modo claro/oscuro frontend web | ✅ Validado |

---

# 5. Módulos Pendientes

| Módulo | Prioridad |
|---|---|---|
| Evidencias Fotográficas (integración completa ingreso/devolución) | Pendiente |
| Dashboard KPI | Pendiente |
| Reportes PDF | Pendiente |
| QA Integral | Pendiente |
| Firebase Crashlytics | Pendiente |
| Build APK producción (AAB) | Pendiente |
| Fix preview foto Xiaomi/HyperOS | Pendiente |

---

# 6. Convenciones PostgreSQL

| Tipo de tabla | Prefijo | Ejemplo |
|---|---|---|
| Catálogo | dim_ | dim_proveedores |
| Operación | fac_ | fac_equipos |
| Auditoría | auditoria_ | auditoria_eventos |

Tablas esperadas para el núcleo operativo:

- dim_tipos_equipo
- dim_proveedores
- dim_marcas
- fac_equipos
- fac_psr
- fac_osr
- fac_averias
- fac_evidencias
- auditoria_eventos

---

# 7. Flujo de Autenticación Local

## 7.1 Login

1. El usuario selecciona su perfil en un dropdown (Super Admin / Admin / Usuario).
2. El sistema filtra y muestra los usuarios según el perfil seleccionado.
3. El usuario selecciona su nombre.
4. El usuario ingresa su contraseña (por defecto "12345").
5. El backend valida la contraseña contra el hash BCrypt almacenado.
6. Si es correcto, retorna un JWT + indicador `passwordResetRequired`.

## 7.2 Cambio de Contraseña Obligatorio

1. Si `passwordResetRequired = true`, se redirige a la pantalla de cambio de contraseña.
2. El usuario debe ingresar su DNI como nueva contraseña (mínimo 6 caracteres).
3. El backend hashea la nueva contraseña con BCrypt y actualiza el registro.
4. Se genera un nuevo JWT con `passwordResetRequired = false`.

## 7.3 Menú Principal Post-Login

Según el perfil del usuario, se muestran hasta 5 botones:

| Botón | Perfiles | Pantalla destino |
|---|---|---|---|
| Ingreso de PSR y OSR | Super Admin, Admin | PsrOsrScreen |
| Ingreso de Equipo | Super Admin, Admin, Usuario | EquiposList (todos) |
| Registro de Avería | Super Admin, Admin, Usuario | EquiposList (todos) |
| Detalles de Equipo | Super Admin, Admin, Usuario | EquiposList (todos) |
| Finalización del Servicio | Super Admin, Admin, Usuario | EquiposList (filtro AVERIADO) → EquipoDetail → AtenderAveria |

---

# 8. HDT-002 — Núcleo Operativo (COMPLETADO ✅)

El núcleo operativo fue completado incluyendo todos los catálogos, entidades operativas y pantallas mobile/web.

Extensiones post-HDT-002:
- 14 componentes UI reutilizables mobile
- Sistema de tema MD3 con design tokens
- CRUD PSR/OSR con date picker nativo y catálogos integrados
- HDT-004: Catálogos, roles, usuarios, auditoría, settings screens mobile
- HDT-006: CreatePsrScreen con React Hook Form + Zod + date picker
- HDT-007: CreateEditUserScreen con permisos por rol
- Finalización del Servicio (backend + mobile)

---

# 9. Módulo PSR/OSR Mobile (2026-07-24)

## 9.1 Pantallas Implementadas

| Pantalla | Archivo | Funcionalidad |
|---|---|---|
| Listado PSR/OSR | `mobile/src/screens/PsrOsrScreen.js` | Tabla con scroll, botón + crear, lápiz editar, filtros por campaña |
| Crear/Editar PSR | `mobile/src/screens/CreatePsrScreen.js` | Formulario React Hook Form + Zod, date picker nativo, catálogos embebidos |

## 9.2 Formulario CreatePsrScreen

**Tecnologías usadas:**
- React Hook Form (`useForm`) para manejo de formulario
- Zod (`z.object`) para validación de esquema
- `@react-native-community/datetimepicker` para selección de fecha nativa
- Navigation params para modo creación vs edición

**Campos del formulario:**
| Campo | Tipo | Validación | Fuente de datos |
|---|---|---|---|
| Campaña | Select (Picker) | Requerido | API `/campanas` (autodetecta activa) |
| Sede | Select | Requerido | API `/sedes` |
| Fecha de ingreso | DatePicker | Requerido, no futuro | Nativo Android/iOS |
| Mes de ingreso | Select (meses) | Requerido | Generado desde fecha |
| Año de ingreso | Select (años) | Requerido | Generado desde fecha |
| Motivo de PSR | Select | Requerido | API `/motivos-psr` |
| Observación | TextInput multilinea | Opcional, máx. 500 chars | — |

**Formato de fechas:**
- Display: `dd/MM/yyyy`
- Envío API: `yyyy-MM-dd`
- Calculan automáticamente mes y año al seleccionar fecha

## 9.3 Integración con API

| Acción | Método | Endpoint | Códigos |
|---|---|---|---|
| Listar PSR | GET | `/api/v1/psr` | 200 OK |
| Crear PSR | POST | `/api/v1/psr` | 201 Created |
| Editar PSR | PUT | `/api/v1/psr/{id}` | 200 OK |
| Obtener catálogos | GET | `/api/v1/sedes`, `/api/v1/campanas`, `/api/v1/motivos-psr` | 200 OK |

## 9.4 Navegación

- Botón `+` en `headerRight` de PsrOsrScreen → navega a CreatePsr con `mode='create'`
- Botón lápiz en cada fila → navega a CreatePsr con `mode='edit'` y datos precargados
- Submit exitoso → `navigation.goBack()` retorna al listado
- Título dinámico: "Crear PSR" o "Editar PSR"

---

# 10. Criterios de Implementación

Cada módulo debe incluir:

- Entity.
- Repository.
- Service.
- Resource REST.
- DTOs.
- Mapper.
- Validaciones.
- Migración Flyway.
- Restricciones PostgreSQL.
- Pantalla web CRUD cuando aplique.

---

# 11. Frontend Web — Acceso y Diagnóstico

## 11.1 Acceso

El frontend web se sirve a través de Nginx (contenedor `apilamiento-nginx`) en las siguientes URLs:

| Servicio | URL | Descripción |
|---|---|---|
| Frontend (SPA) | `http://localhost/` | Aplicación React (ruteo client-side) |
| API Backend | `http://localhost/api/v1/` | Proxy inverso hacia backend:8082 |
| Health Check | `http://localhost/health` | Estado del backend |
| Swagger UI | `http://localhost/swagger` | Documentación OpenAPI |

**Nota:** El frontend usa `BrowserRouter` de React Router v6. No hay soporte HTTPS configurado en Nginx. Usar siempre `http://localhost`.

## 11.2 Stack de Contenedores

| Contenedor | Puerto Host | Puerto Contenedor | Estado |
|---|---|---|---|
| `apilamiento-nginx` | 80 / 443 | 80 / 443 | Sirve SPA + proxy API |
| `apilamiento-backend` | 8082 | 8082 | API Quarkus |
| `apilamiento-postgres` | 5433 | 5432 | PostgreSQL 18 |

## 11.3 Diagnóstico Aplicado (2026-07-21)

**Síntoma reportado:** Servicios Docker levantados pero frontend web no visible.

**Diagnóstico:**
1. Todos los contenedores estaban en ejecución (`docker ps`).
2. Nginx servía correctamente el HTML (`curl http://localhost/` → 200).
3. Los assets JS/CSS se servían correctamente (HTTP 200).
4. La API respondía correctamente a través del proxy (`/api/v1/auth/roles` → datos).

**Causa raíz:** La imagen Docker del frontend (`apilamiento-nginx`) fue construida sin un archivo `.dockerignore`, lo que provocaba dos problemas:
- El contexto de build incluía `node_modules` (~128 MB), ralentizando el build.
- Los `node_modules` del host Windows se copiaban dentro del builder Alpine, potencialmente causando conflictos con binarios nativos de plataforma.

**Solución aplicada:**
1. Se creó `frontend/.dockerignore` excluyendo `node_modules`, `dist`, `.git`, `__tests__` y archivos markdown.
2. Se reconstruyó la imagen con `docker compose build --no-cache nginx`.
3. Se recreó el contenedor con `docker compose up -d --force-recreate nginx`.
4. Se verificó que el frontend responde correctamente (todos los endpoints 200 OK).

**Comando para reconstruir el frontend tras cambios:**
```bash
docker compose build nginx
docker compose up -d --force-recreate nginx
```

---

# 12. Configuración Operativa Congelada

La siguiente configuración de infraestructura está validada y en funcionamiento. NO MODIFICAR.

## 12.1 Mapa de Puertos Docker (HOST → Contenedor)

| Servicio | Puerto Host | Puerto Contenedor | Protocolo |
|---|---|---|---|
| Nginx (Frontend + Proxy) | 80 | 80 | HTTP |
| Nginx (HTTPS futuro) | 443 | 443 | HTTPS |
| Backend Quarkus | 8082 | 8082 | HTTP |
| PostgreSQL 18 | 5433 | 5432 | TCP |

## 12.2 URLs de Acceso (Entorno Local Docker)

| Servicio | URL |
|---|---|
| Frontend Web (SPA) | `http://localhost/` |
| API Backend | `http://localhost/api/v1/` |
| Health Check | `http://localhost/health` |
| Swagger UI | `http://localhost/swagger` |
| Swagger JSON | `http://localhost/q/openapi` |
| Conexión DB (externo) | `localhost:5433` |
| Conexión DB (Docker) | `postgres:5432` |

## 12.3 Cadena de Conexión a Base de Datos

| Contexto | Cadena |
|---|---|
| Backend (Docker) | `jdbc:postgresql://postgres:5432/repo_control_equipos_apilamiento` |
| Backend (dev local) | `jdbc:postgresql://localhost:5432/repo_control_equipos_apilamiento` |
| Cliente externo | `jdbc:postgresql://localhost:5433/repo_control_equipos_apilamiento` |

## 12.4 Configuración Mobile (APK)

| Parámetro | Valor |
|---|---|
| Framework | Expo React Native SDK ~54.0.35 (NO migrado a CLI — se mantiene Expo) |
| API URL (LAN) | `http://10.13.18.168:8082/api/v1` |
| API URL (debug) | `http://127.0.0.1:8082/api/v1` |
| Almacenamiento de token | `react-native-keychain` (Keychain/secure storage) |
| Timeout de API | 15000ms |
| Navegación | React Navigation 7 (NativeStackNavigator + BottomTabNavigator) |
| Formularios | React Hook Form + Zod + `@react-native-community/datetimepicker` |
| UI Components | 14 componentes reutilizables + sistema de tema (design tokens) |
| Theme | MD3 con claro/oscuro + modo Vanguard |
| Pantallas totales | 19 (login, home, equipos, PSR/OSR, averías, perfil, etc.) |
| Build local | Bloqueado por Sophos Endpoint (sin permisos admin). Usar EAS Cloud |

## 12.5 Configuración Backend

| Parámetro | Valor |
|---|---|
| Puerto HTTP | 8082 |
| Host | `0.0.0.0` |
| API Base Path | `/api/v1` |
| JWT Expiración | 28800s (8h) |
| Timezone | `America/Lima` |
| Tamaño máximo body | 10MB |
| Pool conexiones DB | min:2, max:20 |

## 12.6 Nombres de Contenedores

| Contenedor | Imagen |
|---|---|
| `apilamiento-nginx` | `nginx:alpine` (build local) |
| `apilamiento-backend` | `quarkus:3.14` (build local) |
| `apilamiento-postgres` | `postgres:18` |

## 12.7 Dependencias de Orquestación

```
postgres (healthcheck) → backend → nginx
```

---

# 13. Módulo Finalización del Servicio (2026-07-30)

## 13.1 Objetivo

Implementar el flujo completo de atención de averías: al marcar una avería como `ATENDIDA`, el equipo asociado debe restaurar su `estadoOperativo` a `OPERATIVO`, registrar la acción realizada, la fecha/hora de atención y los días de inactividad. Adicionalmente, la pantalla mobile debe permitir tomar 1 foto como evidencia y subirla al finalizar.

## 13.2 Problema Resuelto

Anteriormente, al atender una avería en mobile (`AtenderAveriaScreen`), el backend solo actualizaba el estado de la avería pero **no restauraba el estado operativo del equipo**. El equipo quedaba en `AVERIADO` incluso después de haber sido reparado. Esto impedía registrar una nueva avería sobre el mismo equipo.

Además, el endpoint `PUT /averias/{id}` tenía `@Valid` que forzaba `@NotNull equipoId` y `@NotBlank descripcionFalla` en toda actualización, incluso en actualizaciones parciales como la atención donde solo se envía `estadoAveria` y `accionRealizada`.

## 13.3 Backend — Capas Modificadas

### 13.3.1 AveriaService.java

| Método | Cambio |
|---|---|
| `actualizar(id, dto)` | Cuando `dto.estadoAveria == "ATENDIDA"`, además restaura `equipo.estadoOperativo = "OPERATIVO"` dentro de la misma transacción `@Transactional`. Calcula automáticamente `fechaHoraAtencion` (hora actual) y `diasInactividad` (diferencia entre fecha de atención y fecha de avería). |

### 13.3.2 AveriaResource.java

| Método | Cambio |
|---|---|
| `actualizar(id, dto)` | Removido `@Valid` del parámetro para permitir actualizaciones parciales. El service maneja nulos adecuadamente. |

### 13.3.3 Flujo Backend

```
PUT /averias/{id} { estadoAveria: "ATENDIDA", accionRealizada: "..." }
  → Service.actualizar()
    → Calcula fechaHoraAtencion = now
    → Calcula diasInactividad = diff(fechaHoraAtencion - fechaHoraAveria)
    → Actualiza avería
    → equipo.estadoOperativo = "OPERATIVO"
    → equipo.fechaActualizacion = now
    → Commit transaccional
```

## 13.4 Mobile — Pantallas Modificadas

### 13.4.1 AtenderAveriaScreen.js — Simplificación y Correcciones

| Aspecto | Antes | Después |
|---|---|---|
| Fotos solicitadas | 3 fotos | 1 foto (Evidencia) |
| Botón foto | Siempre "Tomar foto" | "Tomar foto" / "Cambiar foto" según estado |
| Texto botón submit | "Guardar Reparacición" | "Finalizar Servicio" |
| Preview de foto | Usaba URI copiada a caché con `ReactNativeBlobUtil.fs.cp()` | Usa `asset.uri` directo (mismo patrón que RegistrarAveriaScreen) |
| Upload de foto | Inmediato al tomar foto | Al hacer submit con "Finalizar Servicio" |
| Estado de foto | `evidencias` integrado con datos del servidor | `localPhotoUri` separado del servidor |
| Dependencias | `ReactNativeBlobUtil`, `loadApiUrl`, `getToken`, `ZoomableImage`, Modal viewer | Solo `api` y componentes básicos |

**Estructura actual de la pantalla:**
1. InfoCard: descripción, fecha, estado de la avería
2. PhotoCard: 1 slot con preview local + botón "Tomar foto"/"Cambiar foto"
3. FormCard: campo "Acción realizada" (React Hook Form + Zod, min 10 caracteres) + botón "Finalizar Servicio"
4. Submit: sube la foto (si existe) vía `PUT /averias/{id}/evidencias/1`, luego `PUT /averias/{id}` con `estadoAveria: "ATENDIDA"`, navega back

### 13.4.2 HomeScreen.js

| Cambio | Detalle |
|---|---|
| Menú "Finalización del Servicio" | Pasa `params: { filterEstado: 'AVERIADO' }` a `EquiposList` |

### 13.4.3 EquiposListScreen.js

| Cambio | Detalle |
|---|---|
| Filtro por estado | Lee `route.params?.filterEstado`. Si es `'AVERIADO'` usa endpoint `/equipos/por-estado/AVERIADO` |

### 13.4.4 EquipoDetailScreen.js

| Cambio | Detalle |
|---|---|
| Botón dinámico | Si `estadoOperativo === 'AVERIADO'`: muestra "Registrar Reparación", busca avería `REPORTADA` del equipo, navega a `AtenderAveria` con su ID |
| Botón dinámico | Si `estadoOperativo === 'OPERATIVO'`: muestra "Registrar Avería", navega a `RegistrarAveria` (comportamiento original) |

## 13.5 Archivos Modificados

| Archivo | Cambio |
|---|---|
| `backend/src/main/java/.../service/AveriaService.java` | `actualizar()` restaura `estadoOperativo = "OPERATIVO"` |
| `backend/src/main/java/.../controller/AveriaResource.java` | Removido `@Valid` del PUT |
| `mobile/src/screens/AtenderAveriaScreen.js` | Simplificado a 1 foto, preview local, upload en submit, botón "Finalizar Servicio" |
| `mobile/src/screens/HomeScreen.js` | Menú con `filterEstado: 'AVERIADO'` |
| `mobile/src/screens/EquiposListScreen.js` | Filtro por `filterEstado` en route params |
| `mobile/src/screens/EquipoDetailScreen.js` | Botón condicional "Registrar Reparación" vs "Registrar Avería" |

## 13.6 Problema Conocido

La preview de foto en `AtenderAveriaScreen` no se muestra en el dispositivo Xiaomi/HyperOS a pesar de usar el mismo patrón que `RegistrarAveriaScreen.js` (que sí funciona). Pendiente de debuggear si `launchCamera` devuelve una URI no renderizable por `<Image>` en este dispositivo específico.

---

# 14. Cierre

Este documento queda sincronizado con PostgreSQL 18 como base oficial, frontend web accesible en `http://localhost/`, y módulo PSR/OSR mobile funcional con formulario React Hook Form + Zod + date picker nativo. La configuración de red, puertos y conexiones queda documentada y congelada en la sección 12. Adicionalmente, el flujo de Finalización del Servicio (atención de averías con restauración de estado operativo) queda implementado en backend y mobile.
