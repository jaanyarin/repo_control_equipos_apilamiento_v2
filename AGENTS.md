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
| Autenticación | Microsoft Entra ID + JWT propio | — |
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
| 12 | NO crear componentes de clase en React | Solo functional components |
| 13 | NO poner lógica de negocio en Controllers (backend) | Violación de Clean Architecture |
| 14 | NO hacer barrel imports desde `@mui/material` | Impacta rendimiento |
| 15 | NO commitear archivos `.env` con secretos reales | Solo `.env.example` |

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

### HDT-003 — Calidad, Despliegue y Auditoría (EN PLANIFICACIÓN ⏳)

| Módulo | Prioridad |
|---|---|
| Tests (backend + frontend + mobile) | Crítica |
| Rebuild APK EAS Cloud | Crítica |
| Completar módulo Rol (Service + DTO + Mapper) | Alta |
| GitHub Actions CI/CD | Alta |
| Firebase Crashlytics | Media |
| Tabla auditoría V8 + backend | Media |

---

## 13. Referencias

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

*Documento generado por AI Auditor. Versión 1.0 — 2026-06-08*
