# AGENTS.md — Convenciones y Reglas del Proyecto

## Control de Equipos de Apilamiento

---

## 1. Identidad y Rol

Eres un **Arquitecto y Desarrollador Full Stack Senior Mobile/Web**. Trabajas bajo la supervisión de un **Auditor AI** que valida cada HITO antes de cerrarlo. Tu misión es implementar los módulos asignados siguiendo estrictamente las reglas de este documento.

---

## 2. Stack Tecnológico Oficial (NO CAMBIAR)

| Capa | Tecnología | Versión |
|---|---|---|
| Mobile Frontend | Expo React Native SDK | ~54.0.35 |
| Frontend Web | React + Vite | 18 / 5 |
| UI Mobile | react-native-paper (MD3) | ^5.12.0 |
| UI Web | Material UI (MUI) | 6 |
| Backend | Quarkus Java | 3.14.4 |
| ORM | Hibernate ORM Panache | — |
| Base de Datos | PostgreSQL | 18 |
| Migraciones | Flyway | — |
| Autenticación | BCrypt + JWT propio | — |
| Contenedorización | Docker + Docker Compose | — |
| Proxy | Nginx | — |
| CI/CD | GitHub Actions | — |

### Regla crítica
No cambiar versiones mayores de Expo SDK, React Native, React, Quarkus, PostgreSQL sin autorización expresa del arquitecto validad por auditoría.

---

## 3. Estructura del Repositorio

```
/
├── backend/              # Quarkus Java (API REST /api/v1)
│   └── src/main/
│       ├── java/com/apilamiento/control/
│       │   ├── controller/   # REST Resources
│       │   ├── service/      # Lógica de negocio
│       │   ├── repository/   # Panache Repository
│       │   ├── entity/       # JPA Entities
│       │   ├── dto/          # Data Transfer Objects
│       │   ├── mapper/       # MapStruct Mappers
│       │   ├── exception/    # Manejador global
│       │   ├── audit/        # Auditoría transversal
│       │   ├── security/     # Seguridad JWT
│       │   └── config/       # Configuraciones
│       └── resources/db/migration/  # Flyway SQL
├── frontend/             # React 18 + Vite + MUI
│   └── src/
│       ├── pages/        # Páginas del SPA
│       ├── components/   # Componentes reutilizables
│       ├── theme/        # Design tokens + temas
│       └── context/      # Contextos globales
├── mobile/               # Expo React Native
│   ├── App.js            # Entry point
│   ├── src/              # Código fuente mobile
│   └── android/          # Gradle Android
├── database/             # Scripts SQL auxiliares
├── docker-compose.yml    # Orquestación local
├── nginx/                # Config reverse proxy
└── documentacion_general/
    ├── sdd/              # SDD (especificación, plan, tareas, hitos)
    ├── perfiles/         # Perfiles de desarrollo y auditoría
    └── base/             # Documentos base
```

---

## 4. Arquitectura y Convenciones de Código

### 4.1 Backend — Capas por Módulo

Cada módulo nuevo DEBE implementar EXACTAMENTE esta estructura:

```
entity/Entidad.java        → JPA Entity con Panache
repository/EntidadRepository.java  → PanacheRepository
service/EntidadService.java        → Lógica de negocio
controller/EntidadResource.java    → REST (sin lógica de negocio)
dto/EntidadDTO.java                → DTO de entrada/salida
dto/EntidadRequest.java            → Request DTO (si aplica)
mapper/EntidadMapper.java          → MapStruct mapper
```

**REGLAS:**
- Controller: solo recibe request, delega a Service, retorna Response. MÁXIMO 10 líneas efectivas. NUNCA contener lógica de negocio.
- Service: contiene TODA la lógica de negocio y reglas de dominio. Anotar con `@ApplicationScoped` o `@Stateless`.
- Repository: extiende `PanacheRepository`. Consultas personalizadas aquí.
- Entity: anotaciones JPA. `@Table` con nombre en snake_case. `@Column` con nombre explícito.

### 4.2 Backend — REST API

- Base URL: `/api/v1/`
- Formato request/response: JSON (snake_case)
- Response wrapper estándar: `ApiResponse<T>` con `{ success, message, data, error }`
- Códigos HTTP semánticos: 200 (OK), 201 (Creado), 400 (Bad Request), 401 (No auth), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 422 (Validación), 500 (Error)
- Endpoints protegidos con `@RolesAllowed` o validación JWT manual

### 4.3 Frontend Web — React + MUI

- Functional components con hooks. NUNCA componentes clase.
- Routing: React Router v6 con `createBrowserRouter` o `BrowserRouter`.
- Estado global: `AppContext` (store.jsx). Para nuevos módulos evaluar si usar Context o Redux Toolkit.
- API calls: instancia centralizada en `api.js` (Axios).
- Formularios: MUI TextField + validación manual (o React Hook Form si aplica).
- NO barrel imports desde `@mui/material` (importar desde submódulos: `@mui/material/Button`).

### 4.4 Mobile — Expo React Native

- Functional components con hooks.
- Navegación: React Navigation (NativeStackNavigator + BottomTabNavigator).
- Estado global: AuthContext para sesión. Context API o Redux Toolkit para datos operativos.
- Formularios: React Hook Form + Zod (instalar antes de usarlos).
- UI: react-native-paper (MD3) consistente con tema definido en App.js.
- Almacenamiento seguro: `expo-secure-store` para tokens. NUNCA AsyncStorage para tokens.
- API calls: instancia centralizada en `src/api.js` (Axios).
- Cada pantalla en su propio archivo dentro de `src/screens/`.

---

## 5. Base de Datos y Migraciones

- Motor: PostgreSQL 18. NUNCA MySQL.
- Prefijos de tablas: `dim_` (catálogos), `fac_` (operaciones), `auditoria_` (auditoría).
- Migraciones: Flyway SQL numeradas `V{version}__{descripcion}.sql`.
- Timezone: `America/Lima`.
- Soft delete: tablas operativas deben tener `activo` booleano o `fecha_baja` timestamp.
- Auditoría transversal: `created_by`, `created_at`, `updated_by`, `updated_at` en tablas operativas.

### Migraciones existentes (NO MODIFICAR sin validación)

| Archivo | Contenido |
|---|---|
| V1__init.sql | Esquema inicial (usuarios, roles, tablas base) |
| V2__seed.sql | Datos semilla |
| V3__campanas.sql | Tablas de campañas |
| V4__crear_catalogos_equipos.sql | Catálogos (tipos_equipo, proveedores, marcas) |
| V5__fac_equipos.sql | Tabla de equipos |
| V6__fac_psr_osr.sql | Tablas PSR/OSR |
| V7__fac_averias.sql | Tablas de averías y evidencias |
| V8__login_local.sql | Tablas para autenticación local |
| V9__seed_usuarios_local.sql | Datos semilla de usuarios locales |
| V10__auditoria_eventos.sql | Tabla de auditoría de eventos |
| V11__seed_auditoria_tipos.sql | Datos semilla de auditoría |
| V12__backfill_password_usuarios.sql | Backfill de contraseñas locales (BCrypt) |
| V13__hacer_osr_opcional.sql | OSR opcional en PSR |
| V14__dim_motivo_psr.sql | Catálogo de motivos de PSR |
| V15__psr_campos_uso.sql | Motivo, fechas y meses de uso en PSR |
| V16__osr_costo_moneda.sql | Costo unitario y moneda en OSR |
| V17__recalcular_meses_psr_calendario.sql | Recalcular meses PSR por calendario (inclusive) |
| V18__ingreso_equipo_evidencias.sql | Ingreso de equipos + evidencias |
| V19__averia_evidencias_contenido.sql | Contenido BYTEA en evidencias de avería |
| V20__devolucion_equipo.sql | Devolución de equipos (fecha_devolucion + estado DEVUELTO + 4 evidencias) |
| V21__evidencia_horometro_inicial.sql | Tipo de evidencia `HOROMETRO_INICIAL` |
| V22__averias_horometro.sql | Columna `horometro` en averías (reporte) |
| V23__superadmin_protegido.sql | Super Admin protegido (trigger BD: no eliminable, rol/estado inmutable) |
| V24__backfill_horometro_inicio.sql | Backfill `horometro_inicio` en equipos existentes |
| V25__averias_horometro_atencion.sql | Columna `horometro_atencion` en averías (atención) |

---

## 6. Mobile APK — Reglas Específicas

### 6.1 Configuración Congelada (NO CAMBIAR)

| Archivo | Clave | Valor | Razón |
|---|---|---|---|
| `package.json` | `main` | `"expo/AppEntry"` | Necesario para registerRootComponent |
| `app.json` | `jsEngine` | `"hermes"` | RN 0.81 con newArch exige Hermes |
| `app.json` | `platforms` | `["android"]` | Solo Android contemplado |
| `android/gradle.properties` | `hermesEnabled` | `true` | Debe coincidir con app.json |
| `android/gradle.properties` | `newArchEnabled` | `true` | Nueva arquitectura React Native |

### 6.2 Build APK

- Usar **EAS Cloud** para build (no local por bloqueo de Sophos).
- Perfiles disponibles: `preview` (APK), `production` (AAB).
- Build local es alternativa si Sophos no bloquea: `npm run build:android:local:debug`.
- NO modificar `eas.json` ni `app.json` sin validación.
- Para cambiar URL del backend en runtime: `setApiUrl(url)` desde `api.js`.

### 6.3 Pantallas Mobile — Orden de Implementación

```
1. Configurar navegación (AuthStack ↔ MainStack + BottomTabs)
2. Pantalla Home (resumen)
3. Pantalla Listado de Equipos
4. Pantalla Detalle de Equipo
5. Pantalla Registrar Avería (React Hook Form + Zod)
6. Pantalla Atender Avería
7. Pantalla Perfil de Usuario
```

---

## 7. LO QUE NO SE PUEDE HACER (Restricciones)

### ❌ Prohibiciones absolutas

| # | Prohibición | Razón |
|---|---|---|
| 1 | NO cambiar versiones mayores del stack (Expo SDK, React, Quarkus, PostgreSQL) | Validado y congelado |
| 2 | NO usar MySQL para nada | Decisión oficial PostgreSQL 18 |
| 3 | NO hardcodear secrets/tokens/contraseñas en código versionable | Seguridad |
| 4 | NO almacenar JWT en AsyncStorage (mobile) | Debe ser SecureStore |
| 5 | NO implementar operación offline | Excluido del alcance |
| 6 | NO implementar iOS | Excluido del alcance |
| 7 | NO integrar con NISIRA, ERP, IoT, IA | Excluido del alcance |
| 8 | NO modificar migraciones Flyway existentes (V1-V7) sin autorización | Pueden romper consistencia |
| 9 | NO cambiar `jsEngine` de `hermes` a `jsc` | Rompe el APK |
| 10 | NO cambiar `main` de `"expo/AppEntry"` a `"App.js"` | Rompe el registro de componentes |
| 11 | NO modificar `eas.json`, `app.json`, `gradle.properties` (secciones congeladas) | Build validado |
| 12 | NO crear componentes de clase en React (excepto ErrorBoundary, que React requiere como clase) | Solo functional components; ErrorBoundary es la única excepción documentada por limitación de React |
| 13 | NO poner lógica de negocio en Controllers (backend) | Violación de Clean Architecture |
| 14 | NO hacer barrel imports desde `@mui/material` | Impacta rendimiento |
| 15 | NO commitear archivos `.env` con secretos reales | Solo `.env.example` |
| 16 | NO cambiar mapa de puertos Docker (80, 443, 8082, 5433) | Configuración validada y funcionando |
| 17 | NO cambiar cadena de conexión a DB (postgres:5432 / host:5433) | Evita conflictos con PostgreSQL local |
| 18 | NO cambiar nombres de contenedores Docker (apilamiento-*) | Referenciados en configuración Nginx y red Docker |
| 19 | NO cambiar `application.properties` (puerto, host, CORS, JWT, timezone) | Configuración validada en producción local |
| 20 | NO cambiar URL de API Mobile sin validación | `10.13.18.168:8082` es la IP LAN validada |
| 21 | NO cambiar nginx/default.conf (rutas, upstreams, proxy) | Proxy inverso validado y funcionando |
| 22 | NO cambiar configuración de orquestación Docker Compose | Dependencias y healthchecks validados |
| 23 | NO cambiar versión de PostgreSQL 18 | Motor oficial congelado |
| 24 | NO cambiar timezone de `America/Lima` | Zona horaria operativa oficial |

### ❌ Restricciones condicionales

| # | Restricción | Se permite si… |
|---|---|---|
| 1 | No usar Redux Toolkit | Context API es suficiente para el alcance actual. Evaluar cuando haya 5+ pantallas con estado compartido. |
| 2 | No agregar nuevos providers de UI | Solo react-native-paper (mobile) y MUI (web) |
| 3 | No cambiar nombre del paquete Android | `com.apilamiento.mobile` está registrado en Azure |
| 4 | No cambiar scheme de deep linking | `com.apilamiento://callback/` está registrado en Azure |

---

## 8. LO QUE SÍ SE DEBE HACER (Obligaciones)

### ✅ Reglas de implementación

| # | Regla |
|---|---|
| 1 | Cada módulo nuevo DEBE implementar las 6 capas backend (Entity, Repository, Service, Controller, DTO, Mapper) |
| 2 | Toda API DEBE retornar `ApiResponse` como wrapper |
| 3 | Toda API DEBE estar bajo `/api/v1/` |
| 4 | Toda API DEBE validar JWT (a menos que sea pública) |
| 5 | Los DTOs DEBEN usar Jakarta Validation (`@NotBlank`, `@NotNull`, etc.) |
| 6 | Las entidades DEBEN tener `createdAt`, `updatedAt` (auditoría transversal) |
| 7 | Las pantallas web DEBEN seguir el patrón de las existentes (Sedes, Campañas) |
| 8 | Las pantallas mobile DEBEN usar react-native-paper consistente con el tema MD3 |
| 9 | Los formularios mobile DEBEN usar React Hook Form + Zod |
| 10 | Los tokens DEBEN persistirse en SecureStore (mobile) o localStorage (web) |
| 11 | Las contraseñas/secretos DEBEN ir en `.env` NUNCA hardcodeados |
| 12 | Cada HITO DEBE documentarse en `documentacion_general/sdd/05_hito_NNN.md` |
| 13 | Los commits DEBEN seguir Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, etc.) |
| 14 | Cada cambio DEBE compilar sin errores antes de commitear |
| 15 | Las migraciones nuevas DEBEN numerarse secuencialmente (V8+, no repetir números) |

---

## 9. Flujo de Trabajo por HITO

```
1. Planificar → documento 02_planes.md actualizado
2. Implementar backend (capas completa por módulo)
3. Implementar frontend web (CRUD)
4. Implementar frontend mobile (pantalla)
5. Probar manualmente (curl, app, web)
6. Documentar hito → 05_hito_NNN.md
7. Solicitar auditoría
8. Cerrar hito solo con auditoría aprobada
```

---

## 10. Commits Convencionales

```
feat:     Nueva funcionalidad
fix:      Corrección de bug
docs:     Cambios en documentación
refactor: Refactorización (sin cambio funcional)
test:     Agregar o corregir tests
chore:    Cambios en build, CI, config
db:       Migraciones Flyway
mobile:   Cambios específicos de mobile
web:      Cambios específicos de frontend web
```

Ejemplos:
```
feat(backend): implementar CRUD de proveedores
feat(mobile): agregar pantalla de listado de equipos
fix(backend): corregir validación de fecha en campañas
db: crear migración V8 para tabla de evidencias
```

---

## 11. Reglas de Auditoría

- El auditor valida cada HITO contra los gates definidos en `perfil_auditor.md`.
- Hallazgos 🔴 Críticos bloquean el cierre del HITO.
- Hallazgos 🟠 Altos deben remediarse antes del siguiente HITO.
- El auditor emite su reporte en `_auditoria/HITO-NNN/auditoria.md`.
- No se puede cerrar un HITO sin la aprobación del auditor.

---

## 12. Hitos Completados

### HDT-001 — Base del Sistema (CERRADO ✅)

| Módulo | Estado |
|---|---|
| Infraestructura Docker | ✅ |
| PostgreSQL 18 + Flyway | ✅ |
| Backend Quarkus base | ✅ |
| Autenticación Microsoft + JWT | ✅ |
| Usuarios, Roles, Sedes, Campañas | ✅ |
| Frontend Web (login, usuarios, roles, sedes, campañas) | ✅ |
| Mobile login + APK inicial | ✅ |

### HDT-002 — Núcleo Operativo (CERRADO ✅)

| Módulo | Estado |
|---|---|
| Backend: TipoEquipo, Proveedor, Marca, Equipo, Avería | ✅ |
| Frontend Web: TiposEquipo, Proveedores, Marcas, Equipos, Averías | ✅ |
| Mobile: Navegación (AuthStack + MainStack + BottomTabs) | ✅ |
| Mobile: Home, EquiposList, EquipoDetail, RegistrarAvería, AtenderAvería, Perfil | ✅ |
| Mobile: LoadingScreen, ErrorBoundary, EmptyState | ✅ |
| Dependencias: react-hook-form + zod + bottom-tabs | ✅ |

### HDT-003 — Calidad, Despliegue y Auditoría (EN AUDITORÍA 🔍)

| Módulo | Estado |
|---|---|
| Tests backend (JUnit 5 + Mockito, 7 archivos) | ✅ |
| Tests frontend web (Jest, 2 archivos + config) | ✅ |
| Tests mobile (Jest + RNTL, 3 archivos + config) | ✅ |
| Módulo Rol completo (Service + DTO + Mapper) | ✅ |
| Paquete audit/ (entidad, repositorio, servicio, API) | ✅ |
| Paquete config/ (CORS, AppConfig) | ✅ |
| Paquete security/ (JwtFilter, SecurityUtil) | ✅ |
| Migraciones V10 (auditoria_eventos) + V11 (seed) | ✅ |
| GitHub Actions CI/CD | ✅ |
| Modo claro/oscuro frontend | ✅ |
| Rebuild APK EAS Cloud | ⏳ Pendiente |
| Firebase Crashlytics | ⏳ Pendiente |

### HDT-004 — Pantallas Mobile Faltantes (CERRADO ✅)

| Módulo | Estado |
|---|---|
| CatalogScreen genérico + screens catálogos (marcas, proveedores, tipos, sedes, motivos) | ✅ |
| Roles, Usuarios, Auditoría, Settings screens | ✅ |
| Tab Catálogos con menú de botones | ✅ |

### HDT-005 — Migración a React Native CLI (CANCELADO ❌)

| Módulo | Estado |
|---|---|
| Migración Expo → CLI | ❌ Cancelado (se mantiene Expo, validado) |

### HDT-006 — Gestión móvil PSR/OSR (CERRADO ✅)

| Módulo | Estado |
|---|---|
| CreatePsrScreen (React Hook Form + Zod + date picker nativo) | ✅ |
| Edición PSR/OSR con atomicidad transaccional | ✅ |
| Catálogos integrados (campañas, sedes, motivos) | ✅ |

### HDT-007 — CRUD Usuarios Mobile (CERRADO ✅)

| Módulo | Estado |
|---|---|
| CreateEditUserScreen (crear/editar usuarios) | ✅ |
| Permisos por rol (solo Super Admin edita Super Admin) | ✅ |
| Correcciones de autenticación (race condition login, logout robusto) | ✅ |

### HDT-008 — UX Desplegables, Catálogos en Tiempo Real y Referencias PSR/OSR (IMPLEMENTADO ✅)

| Módulo | Estado |
|---|---|
| AppSelect con Portal + ScrollView completo (onOpen refetch) | ✅ |
| Catálogos en tiempo real (refetch silencioso en focus + onOpen) | ✅ |
| Filtro de equipos por modo (filterEquiposByMode, oculta DEVUELTO) | ✅ |
| Backend: PsrOsrRefDTO + EquipoDTO.psrOsr + PsrDTO marca/modelo/grr | ✅ |
| Mobile: card PSR/OSR en EquipoDetail + Marca\|Modelo\|GRR en PsrOsrScreen (retroactivo) | ✅ |
| CRUD completo campañas mobile (Dialog + date picker) | ✅ |
| Tab Catálogos con secciones + permisos por rol | ✅ |
| Rebuild Docker backend + verificación retroactiva | ✅ |

### HDT-009 — Teclado móvil no cubre los inputs (IMPLEMENTADO ✅)

| Módulo | Estado |
|---|---|
| Componente KeyboardAwareScrollView (KeyboardAvoidingView + ScrollView) | ✅ |
| Migración pantallas con inputs: Login, PasswordChange, CreateEditUser, CreatePsr, RegistrarAveria, AtenderAveria, Settings | ✅ |
| EquipmentFormScreen con KeyboardAvoidingView + footer sticky fuera del scroll | ✅ |
| Diálogos con inputs protegidos (Campanas, Catalog) | ✅ |
| Suite Jest 38/38 (test nuevo + corrección PasswordChangeScreen/AuthContext) | ✅ |

### HDT-010 — Usuarios Mobile simplificado (IMPLEMENTADO ✅)

| Módulo | Estado |
|---|---|
| CreateEditUserScreen solo Nombre/Rol/Ubicación (schema Zod solo exige nombre) | ✅ |
| Ubicación como AppSelect con valores de Sedes activas | ✅ |
| Backend: crear usuario sin correo ni rol (rol "Usuario" por defecto) y 400 si falta nombre | ✅ |
| Tests: UsuarioServiceTest 6/6 + CreateEditUserScreen 4 tests; Jest 42/42 | ✅ |

### HDT-011 — Horómetro en Averías y Trazabilidad de Usuario (IMPLEMENTADO ✅)

| Módulo | Estado |
|---|---|
| Fix 409 devolución: AveriaService no revierte OPERATIVO si equipo ya devuelto + ApiResponse.error | ✅ |
| filterEquiposByMode oculta DEVUELTO en select/manage (mobile) | ✅ |
| Horómetro en registro de avería (V22) + fecha reportada respetada (no siempre now) | ✅ |
| Horómetro al atender (V25): validación >= reportado, fechaHoraAtencion, diasInactividad | ✅ |
| Mobile AtenderAveriaScreen (input horómetro atención + días inactivo) + Web Averias.jsx | ✅ |
| Trazabilidad usuario JWT: 11 controllers inyectan SecurityContext (usuarioCreacion/usuarioActualizacion desde token) | ✅ |
| OsrRequest.usuarioCreacion + OsrService lee de request (no hardcodea 1L) | ✅ |
| Tests: AveriaServiceTest 12/12, AveriaResourceTest 3/3, EquipoResourceTest 2/2, DevolucionEquipoServiceTest 7/7; suite backend 74/0 | ✅ |
| Migraciones soporte V21 (evidencia horómetro inicial), V23 (superadmin protegido), V24 (backfill horómetro_inicio) | ✅ |

---

## 13. Configuración de Red y Puertos Congelados (NO CAMBIAR)

Esta sección documenta la configuración actual de puertos, conexiones y URLs del sistema en funcionamiento. Cualquier modificación requiere autorización expresa del arquitecto validada por auditoría.

### 13.1 Mapa de Puertos Docker (HOST → Contenedor)

| Servicio | Puerto Host | Puerto Contenedor | Protocolo | Uso |
|---|---|---|---|---|
| Nginx (Frontend + Proxy) | 80 | 80 | HTTP | Frontend SPA + Proxy API |
| Nginx (HTTPS futuro) | 443 | 443 | HTTPS | Reservado para SSL |
| Backend Quarkus | 8082 | 8082 | HTTP | API REST |
| PostgreSQL 18 | 5433 | 5432 | TCP | Base de datos (Host:5433 para evitar conflicto con PostgreSQL local en 5432) |

### 13.2 URLs de Acceso (Entorno Local Docker)

| Servicio | URL | Descripción |
|---|---|---|
| Frontend Web (SPA) | `http://localhost/` | Aplicación React con ruteo client-side |
| API Backend | `http://localhost/api/v1/` | Proxy inverso Nginx → backend:8082 |
| Health Check | `http://localhost/health` | Estado del backend Quarkus |
| Swagger UI | `http://localhost/swagger` | Documentación OpenAPI |
| Swagger JSON | `http://localhost/q/openapi` | Especificación OpenAPI en JSON |
| Conexión DB (externo) | `localhost:5433` | Clientes externos (VS Code, DBeaver, pgAdmin) |
| Conexión DB (Docker) | `postgres:5432` | Red interna Docker entre contenedores |

### 13.3 Nombres de Contenedores (NO CAMBIAR)

| Contenedor | Imagen | Puerto Expuesto |
|---|---|---|
| `apilamiento-nginx` | `nginx:alpine` (build local) | 80, 443 |
| `apilamiento-backend` | `quarkus:3.14` (build local) | 8082 |
| `apilamiento-postgres` | `postgres:18` | 5433 → 5432 |

### 13.4 Cadena de Conexión a Base de Datos

| Contexto | Cadena |
|---|---|
| Backend (Docker) | `jdbc:postgresql://postgres:5432/repo_control_equipos_apilamiento` |
| Backend (dev local) | `jdbc:postgresql://localhost:5432/repo_control_equipos_apilamiento` |
| Cliente externo | `jdbc:postgresql://localhost:5433/repo_control_equipos_apilamiento` |

### 13.5 Configuración Mobile (APK)

| Parámetro | Valor | Dónde se define |
|---|---|---|
| API URL (LAN) | `http://10.13.18.168:8082/api/v1` | `mobile/src/api.js:6` |
| API URL (debug) | `http://127.0.0.1:8082/api/v1` | `mobile/src/api.js:7` |
| API URL (production) | Configurable en runtime con `setApiUrl(url)` | `mobile/src/api.js` |
| Almacenamiento de token | `react-native-keychain` (SecureStore) | `mobile/src/api.js` |
| Timeout de API | 15000ms | `mobile/src/api.js:53` |

### 13.6 Configuración Frontend Web

| Parámetro | Valor | Dónde se define |
|---|---|---|
| API Base URL | `/api/v1` (proxy Nginx) | `nginx/default.conf` |
| CORS Origins | `http://localhost:3000, http://localhost:5173, http://localhost:5174` | `application.properties:30` |
| Puerto dev Vite | 5173 (por defecto) | `vite.config` implícito |

### 13.7 Configuración Backend

| Parámetro | Valor | Dónde se define |
|---|---|---|
| Puerto HTTP | 8082 | `application.properties:26` |
| Host | `0.0.0.0` | `application.properties:25` |
| API Base Path | `/api/v1` | `application.properties:36` |
| JWT Expiración | 28800s (8h) | `application.properties:63` |
| Timezone | `America/Lima` | `application.properties:61` |
| Tamaño máximo body | 10MB | `application.properties:67` |
| Pool conexiones DB | min:2, max:20 | `application.properties:8-9` |

### 13.8 Variables de Entorno Requeridas

| Variable | Propósito | Valor por defecto |
|---|---|---|
| `DB_USERNAME` | Usuario PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña PostgreSQL | *(requerido en .env)* |
| `OIDC_TENANT_ID` | Tenant ID Microsoft Entra ID | *(requerido en .env)* |
| `OIDC_CLIENT_ID` | Client ID Microsoft Entra ID | *(requerido en .env)* |
| `OIDC_CLIENT_SECRET` | Client Secret Microsoft Entra ID | *(requerido en .env)* |
| `OIDC_REDIRECT_URI` | Redirect URI OIDC | `http://localhost/api/v1/auth/callback` |
| `QUARKUS_PROFILE` | Perfil Quarkus | `dev` |

### 13.9 Dependencias de Orquestación

```
postgres (healthcheck) → backend → nginx
```

- El backend espera a que PostgreSQL esté saludable antes de iniciar (`condition: service_healthy`).
- Nginx depende del backend para el proxy inverso.
- El frontend web se sirve estáticamente desde Nginx.

### 13.10 Dispositivos ADB para Pruebas Mobile

| Dispositivo | Serial ADB | Modelo | Conexión |
|---|---|---|---|
| Xiaomi (principal) | `qctoduvsa6v4cyhi` | 25100RA69G | USB/Wi-Fi |
| Xiaomi (alterno) | `85ijey5tdax8ob5p` | — | USB/Wi-Fi |

Uso alternado según disponibilidad. Definir con:
```powershell
$serial = "qctoduvsa6v4cyhi"  # o 85ijey5tdax8ob5p
```

Script automatizado (selector interactivo de serial):
```powershell
.\deploy-mobile.ps1
```

Comandos comunes (manual):
```powershell
adb devices -l
adb -s $serial reverse tcp:8081 tcp:8081
adb -s $serial reverse tcp:8082 tcp:8082
adb -s $serial install -r $apk
```

---

## 14. Referencias

- Perfil de Desarrollo: `documentacion_general/perfiles/perfil_desarrollador.md`
- Perfil de Auditoría: `documentacion_general/perfiles/perfil_auditor.md`
- SDD Especificaciones: `documentacion_general/sdd/01_epecificaciones.md`
- SDD Plan: `documentacion_general/sdd/02_planes.md`
- SDD Tareas: `documentacion_general/sdd/03_tareas.md`
- SDD Implementación: `documentacion_general/sdd/04_implementaciones.md`
- Build Android: `documentacion_general/sdd/07_build_android_eas.md`
- Auditoría base: `documentacion_general/sdd/06_auditoria_pre_apk.md`
- DC: `docker-compose.yml`
- Config Nginx: `nginx/default.conf`

---

*Documento generado por AI Auditor. Versión 2.1 — 2026-07-21*
