# SOFTWARE DEVELOPMENT DOCUMENT (SDD)
# 03_TASKS.md

---

# 1. Objetivo del Documento

Este documento define la estructura de tareas técnicas, operativas y organizacionales necesarias para continuar la construcción del sistema de control operativo de equipos de apilamiento.

La planificación queda sincronizada con el repositorio actual y con la decisión oficial de usar PostgreSQL 18 como base de datos del proyecto.

---

# 2. Decisión Técnica Oficial

| Decisión | Valor |
|---|---|
| Base de datos oficial | PostgreSQL 18 |
| Backend | Quarkus Java 3.14.4 |
| Persistencia | Hibernate ORM Panache |
| Migraciones | Flyway |
| Frontend web | React 18 + Vite + MUI |
| Mobile | Expo React Native SDK ~54.0.35 (NO migrado a CLI) |
| Autenticación | Local BCrypt + JWT propio |
| Infraestructura | Docker Compose + Nginx |

No se usará MySQL en este proyecto.

---

# 3. Estados de Tareas

| Estado | Descripción |
|---|---|
| Pendiente | Tarea no iniciada |
| En Progreso | Desarrollo activo |
| En Validación | En proceso QA |
| Completado | Finalizado y validado |
| Bloqueado | Dependencia pendiente |
| Cancelado | Tarea descartada |

---

# 4. Roadmap General Actualizado

| Orden | Componente | Estado |
|---|---|---|
| 1 | Infraestructura Docker | Completado |
| 2 | PostgreSQL 18 | Completado |
| 3 | Backend Quarkus base | Completado |
| 4 | Nginx reverse proxy | Completado |
| 5 | Frontend web base | Completado |
| 6 | Autenticación local BCrypt + JWT | Completado |
| 7 | Usuarios (seed local) | Completado |
| 8 | Roles | Completado |
| 9 | Sedes | Completado |
| 10 | Campañas | Completado |
| 11 | Mobile login local + menú perfil | Validado |
| 12 | APK inicial | Validado |
| 13 | Tipos de Equipos | ✅ Completado |
| 14 | Proveedores | ✅ Completado |
| 15 | Marcas | ✅ Completado |
| 16 | Equipos | ✅ Completado |
| 17 | PSR / OSR | ✅ Completado (CRUD mobile + web) |
| 18 | Averías | ✅ Completado (mobile + web) |
| 19 | Evidencias Fotográficas | ✅ Parcial (1 foto en atención de avería) |
| 20 | Dashboard KPI | Pendiente |
| 21 | Reportes PDF | Pendiente |
| 22 | Auditoría | ✅ Completado |
| 23 | Configuración | ✅ Completado |
| 24 | QA Integral | Pendiente |
| 25 | Despliegue Producción | Pendiente |
| 26 | Migración Expo → React Native CLI | ❌ Cancelado (se mantiene Expo) |
| 27 | Componentes UI reutilizables mobile (14) | ✅ Completado |
| 28 | Sistema de tema mobile (Design Tokens) | ✅ Completado |
| 29 | Pantalla PSR/OSR mobile (date picker, catálogos, CRUD) | ✅ Completado |
| 30 | Pantalla crear PSR mobile (React Hook Form + Zod) | ✅ Completado |
| 31 | HDT-004: Catálogos, roles, usuarios, auditoría, settings mobile | ✅ Completado |
| 32 | HDT-006: CreatePsrScreen con date picker nativo | ✅ Completado |
| 33 | HDT-007: CreateEditUserScreen con permisos por rol | ✅ Completado |
| 34 | Finalización del Servicio (backend + mobile) | ✅ Completado |
| 35 | HDT-008: AppSelect con Portal + ScrollView completo | ✅ Completado |
| 36 | HDT-008: Catálogos en tiempo real (refetch silencioso focus + onOpen) | ✅ Completado |
| 37 | HDT-008: Filtro de equipos por modo (oculta DEVUELTO) | ✅ Completado |
| 38 | HDT-008: Card PSR/OSR en detalle + Marca/Modelo/GRR en PSR/OSR | ✅ Completado |
| 39 | HDT-008: CRUD completo campañas mobile (Dialog + date picker) | ✅ Completado |
| 40 | HDT-008: Tab Catálogos con secciones + permisos por rol | ✅ Completado |
| 41 | HDT-009: Componente KeyboardAwareScrollView reutilizable | ✅ Completado |
| 42 | HDT-009: Migración pantallas con inputs (Login, PasswordChange, CreateEditUser, CreatePsr, RegistrarAveria, AtenderAveria, Settings) | ✅ Completado |
| 43 | HDT-009: EquipmentFormScreen con KeyboardAvoidingView + footer sticky | ✅ Completado |
| 44 | HDT-009: Diálogos con inputs protegidos (Campanas, Catalog) | ✅ Completado |
| 45 | HDT-009: Tests del componente + corrección PasswordChangeScreen/AuthContext (38/38) | ✅ Completado |
| 46 | HDT-010: CreateEditUserScreen solo Nombre/Rol/Ubicación (schema solo nombre obligatorio) | ✅ Completado |
| 47 | HDT-010: Ubicación como AppSelect con valores de Sedes | ✅ Completado |
| 48 | HDT-010: Backend crear usuario sin correo/rol (rol "Usuario" por defecto, nombre obligatorio) | ✅ Completado |
| 49 | HDT-010: Tests UsuarioServiceTest (6) + CreateEditUserScreen (4); Jest 42/42 | ✅ Completado |
| 50 | HDT-011: Fix 409 devolución (no revertir OPERATIVO si fecha_devolucion seteada) + ApiResponse.error | ✅ Completado |
| 51 | HDT-011: filterEquiposByMode oculta DEVUELTO en select/manage (mobile) | ✅ Completado |
| 52 | HDT-011: Migración V22 (horometro en fac_averias) + AveriaDTO/Mapper/Service | ✅ Completado |
| 53 | HDT-011: Migración V25 (horometro_atencion) + validar horómetro atención >= reportado + dias_inactividad | ✅ Completado |
| 54 | HDT-011: AtenderAveriaScreen (input horómetro atención + display días inactivo) + Averias.jsx web | ✅ Completado |
| 55 | HDT-011: Trazabilidad usuario JWT en 11 controllers (crear/actualizar setean usuario del token) | ✅ Completado |
| 56 | HDT-011: OsrRequest.usuarioCreacion + OsrService lee de request (no hardcodea 1L) | ✅ Completado |
| 57 | HDT-011: Tests AveriaResourceTest (3) + EquipoResourceTest (2); suite backend 74/0 | ✅ Completado |
| 58 | HDT-011: Migraciones soporte V21 (evidencia horómetro inicial), V23 (superadmin protegido), V24 (backfill horometro_inicio) | ✅ Completado |

---

# 5. Tareas de Infraestructura

| ID | Tarea | Prioridad | Estado |
|---|---|---|---|---|
| INF-001 | Crear estructura inicial del repositorio | Crítica | ✅ |
| INF-002 | Configurar Docker Backend | Crítica | ✅ |
| INF-003 | Configurar Docker Frontend Web | Crítica | ✅ |
| INF-004 | Configurar Docker PostgreSQL 18 | Crítica | ✅ |
| INF-005 | Configurar Docker Compose | Crítica | ✅ |
| INF-006 | Configurar variables de entorno | Alta | ✅ |
| INF-007 | Configurar Nginx reverse proxy | Alta | ✅ |
| INF-008 | Configurar timezone America/Lima | Alta | ✅ |
| INF-009 | Configurar healthchecks | Alta | ✅ |
| INF-010 | Configurar GitHub Actions CI/CD | Alta | ⏳ |
| INF-011 | Configurar backups PostgreSQL | Alta | ⏳ |
| INF-012 | Configurar restauración backups PostgreSQL | Alta | ⏳ |
| INF-013 | Configurar ambientes Desarrollo / QA / Producción | Alta | ⏳ |
| INF-014 | Documentar configuración de red y puertos congelada en AGENTS.md | Alta | ✅ |
| INF-015 | Documentar configuración de red y puertos en SDD 01, 02, 04 | Alta | ✅ |
| INF-016 | Congelar versiones de infraestructura (PostgreSQL 18, Nginx, Quarkus 3.14) | Alta | ✅ |

---

# 6. Tareas Base de Datos PostgreSQL

| ID | Tarea | Prioridad | Estado |
|---|---|---|---|
| DB-001 | Definir PostgreSQL 18 como motor oficial | Crítica | ✅ |
| DB-002 | Configurar conexión PostgreSQL en Quarkus | Crítica | ✅ |
| DB-003 | Configurar Flyway | Alta | ✅ |
| DB-004 | Crear tablas base roles / usuarios / sedes | Crítica | ✅ |
| DB-005 | Crear tabla campañas | Alta | ✅ |
| DB-006 | Diseñar modelo operativo HDT-002 | Crítica | ⏳ |
| DB-007 | V8 login_local: password_hash, dni, password_reset_required | Crítica | ✅ |
| DB-008 | V9 seed_usuarios_local: datos de prueba | Crítica | ✅ |
| DB-009 | Crear migración `dim_tipos_equipo` (V4) | Crítica | ✅ |
| DB-010 | Crear migración `dim_proveedores` (V4) | Crítica | ✅ |
| DB-011 | Crear migración `dim_marcas` (V4) | Alta | ✅ |
| DB-012 | Crear migración `fac_equipos` (V5) | Crítica | ✅ |
| DB-013 | Crear migración `fac_psr` (V6) | Crítica | ✅ |
| DB-014 | Crear migración `fac_osr` (V6) | Crítica | ✅ |
| DB-015 | Crear migración `fac_averias` (V7) | Alta | ✅ |
| DB-016 | Crear migración `fac_evidencias` (V7) | Alta | ✅ |
| DB-017 | Crear migración `auditoria_eventos` (V10) | Alta | ✅ |
| DB-018 | Configurar índices y relaciones | Alta | ✅ |
| DB-019 | Configurar restricciones de integridad | Alta | ✅ |
| DB-020 | HDT-011: V21 evidencia horómetro inicial + V22 horómetro avería + V23 superadmin protegido + V24 backfill horómetro_inicio + V25 horómetro_atención | Alta | ✅ |

---

# 7. Tareas Backend

| ID | Tarea | Prioridad | Estado |
|---|---|---|---|
| BE-001 | Inicializar proyecto Quarkus | Crítica | ✅ |
| BE-002 | Configurar conexión PostgreSQL | Crítica | ✅ |
| BE-003 | Configurar arquitectura modular | Crítica | ✅ |
| BE-004 | Configurar autenticación local BCrypt | Crítica | ✅ |
| BE-005 | Configurar JWT propio | Crítica | ✅ |
| BE-006 | Implementar módulo usuarios | Alta | ✅ |
| BE-007 | Implementar módulo roles | Alta | ✅ |
| BE-008 | Implementar validación login local + cambio contraseña | Alta | ✅ |
| BE-009 | Implementar módulo sedes | Alta | ✅ |
| BE-010 | Implementar módulo campañas | Alta | ✅ |
| BE-011 | Implementar LocalAuthService | Alta | ✅ |
| BE-012 | Endpoints: /auth/roles, /auth/usuarios-by-rol, /auth/local-login, /auth/change-password | Alta | ✅ |
| BE-013 | Implementar módulo tipos equipos | Alta | ✅ |
| BE-014 | Implementar módulo proveedores | Alta | ✅ |
| BE-015 | Implementar módulo marcas | Alta | ✅ |
| BE-016 | Implementar módulo equipos | Crítica | ✅ |
| BE-017 | Implementar módulo PSR / OSR | Crítica | ✅ |
| BE-018 | Implementar módulo averías | Alta | ✅ |
| BE-019 | Implementar módulo evidencias | Alta | ✅ |
| BE-020 | Implementar auditoría operacional | Alta | ✅ |
| BE-021 | Implementar generación PDF | Media | ⏳ |
| BE-022 | Implementar APIs dashboard KPI | Media | ⏳ |
| BE-023 | Finalización del Servicio: restaurar estado operativo del equipo al atender avería | Alta | ✅ |
| BE-023 | Configurar manejo global de errores | Alta | ✅ |
| BE-024 | Configurar validaciones backend | Alta | ✅ |
| BE-025 | Configurar logs backend | Alta | ✅ |
| BE-026 | Configurar versionamiento APIs `/api/v1` | Alta | ✅ |
| BE-027 | Configurar OpenAPI / Swagger UI | Media | ✅ |
| BE-028 | HDT-008: Crear `PsrOsrRefDTO` y campo `EquipoDTO.psrOsr` (resolución en `buscarPorId`) | Alta | ✅ |
| BE-029 | HDT-008: Campos `PsrDTO.marca/modelo/grr` (resolución vía OSR→Equipo→Marca) | Alta | ✅ |
| BE-030 | HDT-008: Tests EquipoServiceTest + PsrServiceTest con nuevos mocks | Alta | ✅ |
| BE-031 | HDT-008: Rebuild Docker backend + verificación retroactiva (GET /equipos/6, GET /psr) | Alta | ✅ |
| BE-032 | HDT-011: AveriaService no revierte OPERATIVO si equipo ya devuelto + ApiResponse.error | Alta | ✅ |
| BE-033 | HDT-011: Horómetro en crear (V22) y atender (V25) avería + dias_inactividad | Alta | ✅ |
| BE-034 | HDT-011: Trazabilidad usuario JWT en 11 controllers (crear/actualizar) + OsrService/OsrRequest | Alta | ✅ |

---

# 8. Tareas Frontend Web

| ID | Tarea | Prioridad | Estado |
|---|---|---|---|
| WEB-001 | Inicializar React SPA | Crítica | ✅ |
| WEB-002 | Configurar Vite | Alta | ✅ |
| WEB-003 | Configurar MUI | Alta | ✅ |
| WEB-004 | Implementar layout base | Alta | ✅ |
| WEB-005 | Implementar login local (select perfil → select usuario → password) | Crítica | ✅ |
| WEB-006 | Implementar cambio de contraseña obligatorio | Alta | ✅ |
| WEB-007 | Implementar menú principal con 5 botones según perfil | Alta | ✅ |
| WEB-008 | Implementar usuarios | Alta | ✅ |
| WEB-009 | Implementar roles | Alta | ✅ |
| WEB-010 | Implementar sedes | Alta | ✅ |
| WEB-011 | Implementar campañas | Alta | ✅ |
| WEB-012 | Implementar tipos de equipo | Alta | ✅ |
| WEB-013 | Implementar proveedores | Alta | ✅ |
| WEB-014 | Implementar marcas | Alta | ✅ |
| WEB-015 | Implementar equipos | Crítica | ✅ |
| WEB-016 | Implementar PSR / OSR | Crítica | ✅ |
| WEB-017 | Implementar averías | Alta | ✅ |
| WEB-018 | HDT-011: Averias.jsx columnas horómetro atención + días inactivo | Alta | ✅ |
| WEB-018 | Implementar evidencias | Alta | ⏳ |
| WEB-019 | Implementar dashboard KPI | Media | ⏳ |
| WEB-020 | Implementar reportes PDF | Media | ⏳ |

---

# 9. Tareas Frontend Mobile

| ID | Tarea | Prioridad | Estado |
|---|---|---|---|---|
| AND-001 | Inicializar proyecto Expo React Native | Crítica | ✅ |
| AND-002 | Configurar Expo SDK 54 | Crítica | ✅ (luego migrado a CLI) |
| AND-003 | Implementar login local (select perfil → select usuario → password) | Crítica | ✅ |
| AND-004 | Implementar cambio de contraseña obligatorio | Alta | ✅ |
| AND-005 | Implementar menú principal con 5 botones según perfil | Alta | ✅ |
| AND-006 | Persistir JWT en SecureStore | Alta | ✅ (migrado a Keychain) |
| AND-007 | Recuperar sesión al abrir app | Alta | ✅ |
| AND-008 | Compilar APK inicial con EAS Cloud | Alta | ⏳ Bloqueado (requiere EAS Cloud config) |
| AND-009 | Validar APK en dispositivo físico | Alta | ⏳ |
| AND-010 | Configurar navegación operativa (AuthStack + MainStack + BottomTabs) | Alta | ✅ |
| AND-011 | Implementar listado de equipos | Crítica | ✅ |
| AND-012 | Implementar registro de averías | Alta | ✅ |
| AND-013 | Implementar atención de averías | Alta | ✅ |
| AND-013.1 | Finalización del Servicio: restaurar estado operativo del equipo al atender | Alta | ✅ |
| AND-013.2 | Finalización del Servicio: 1 foto evidencia + botón "Finalizar Servicio" | Alta | ✅ |
| AND-013.3 | Finalización del Servicio: botón "Registrar Reparación" en EquipoDetail cuando AVERIADO | Alta | ✅ |
| AND-013.4 | Backend: remover `@Valid` del PUT para permitir actualizaciones parciales | Alta | ✅ |
| AND-013.5 | Backend: restaurar `estadoOperativo = "OPERATIVO"` al marcar ATENDIDA | Alta | ✅ |
| AND-014 | Implementar captura de fotografías | Alta | ⏳ Parcial (1 foto en atención) |
| AND-015 | Implementar consumo de APIs operativas | Crítica | ✅ |
| AND-016 | Implementar manejo global de errores | Alta | ✅ |
| AND-017 | Implementar visualización de PDF | Media | ⏳ Pendiente |
| AND-018 | Migrar de Expo a React Native CLI puro | Crítica | ✅ |
| AND-019 | Crear 14 componentes UI reutilizables | Alta | ✅ |
| AND-020 | Implementar sistema de tema con design tokens | Alta | ✅ |
| AND-021 | Implementar pantalla PSR/OSR con listado + botón crear/editar | Crítica | ✅ |
| AND-022 | Implementar pantalla crear PSR con React Hook Form + Zod + date picker nativo | Crítica | ✅ |
| AND-023 | Integrar catálogos (sedes, motivos, campañas) en formularios mobile | Alta | ✅ |
| AND-024 | Reescribir AppSelect con Portal + ScrollView completo (opciones nunca detrás de la barra de acciones) | Alta | ✅ |
| AND-025 | Refetch silencioso de catálogos en focus (`useFocusEffect` + `loadedRef`) y en `onOpen` de selects | Alta | ✅ |
| AND-026 | Implementar `filterEquiposByMode` (oculta DEVUELTO en select/manage) + tests | Alta | ✅ |
| AND-027 | Card PSR/OSR en EquipoDetail + línea Marca/Modelo/GRR en PsrOsrScreen | Alta | ✅ |
| AND-028 | CRUD completo campañas mobile (crear/editar en Dialog + date picker nativo) | Alta | ✅ |
| AND-029 | Tab Catálogos con secciones agrupadas + ocultar para rol Usuario; headerRight en Catalog/Roles | Alta | ✅ |
| AND-030 | HDT-011: filterEquiposByMode oculta DEVUELTO en select/manage | Alta | ✅ |
| AND-031 | HDT-011: AtenderAveriaScreen input horómetro atención + display días inactivo | Alta | ✅ |

---

# 10. HDT-002 — Núcleo Operativo (COMPLETADO ✅)

El núcleo operativo del sistema fue completado e incluye todos los componentes del alcance original.

## Alcance Completado HDT-002

| Orden | Componente | Estado |
|---|---|---|
| 1 | `dim_tipos_equipo` | ✅ Implementado |
| 2 | `dim_proveedores` | ✅ Implementado |
| 3 | `dim_marcas` | ✅ Implementado |
| 4 | `fac_equipos` | ✅ Implementado |
| 5 | `fac_psr` | ✅ Implementado |
| 6 | `fac_osr` | ✅ Implementado |
| 7 | `fac_averias` | ✅ Implementado |

## Extensiones Post-HDT-002

| Orden | Componente | Estado |
|---|---|---|
| 8 | Migración mobile Expo → React Native CLI | ✅ Completado |
| 9 | Componentes UI reutilizables mobile (14 componentes) | ✅ Completado |
| 10 | Sistema de tema mobile con design tokens | ✅ Completado |
| 11 | Pantalla PSR/OSR mobile con CRUD completo | ✅ Completado |
| 12 | Pantalla crear PSR mobile (React Hook Form + Zod + date picker) | ✅ Completado |
| 13 | Catálogos integrados en mobile (sedes, motivos, campañas) | ✅ Completado |
| 14 | Auditoría operacional (tablas V10-V11 + backend audit/ + mobile screen) | ✅ Completado |
| 15 | Finalización del Servicio (backend restaura OPERATIVO, mobile 1 foto + "Finalizar Servicio") | ✅ Completado |
| 16 | HDT-004: Pantallas mobile catálogos, roles, usuarios, auditoría, settings | ✅ Completado |
| 17 | HDT-006: CreatePsrScreen con date picker nativo + Zod | ✅ Completado |
| 18 | HDT-007: CreateEditUserScreen con permisos por rol | ✅ Completado |
| 19 | HDT-008: Desplegables AppSelect Portal + ScrollView + onOpen | ✅ Completado |
| 20 | HDT-008: Catálogos en tiempo real (EquipmentForm, CreatePsr, CreateEditUser, Login) | ✅ Completado |
| 21 | HDT-008: Filtro de equipos por modo + tests (equiposListFilter) | ✅ Completado |
| 22 | HDT-008: Backend PsrOsrRefDTO + EquipoDTO.psrOsr + PsrDTO marca/modelo/grr | ✅ Completado |
| 23 | HDT-008: Card PSR/OSR en EquipoDetail + Marca/Modelo/GRR en PsrOsrScreen | ✅ Completado |
| 24 | HDT-008: CRUD campañas mobile + tab Catálogos con secciones/perfiles | ✅ Completado |

---

# 11. Cierre

Este documento queda sincronizado con el estado actual del repositorio y con PostgreSQL 18 como motor oficial del sistema.
