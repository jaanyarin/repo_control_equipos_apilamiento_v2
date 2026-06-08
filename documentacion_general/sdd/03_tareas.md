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
| Mobile | Expo React Native SDK 54 |
| Autenticación | Microsoft Entra ID + JWT propio |
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
| 6 | Autenticación Microsoft + JWT | Completado |
| 7 | Microsoft Graph API | Completado |
| 8 | Usuarios | Completado |
| 9 | Roles | Completado |
| 10 | Sedes | Completado |
| 11 | Campañas | Completado |
| 12 | Mobile login + APK inicial | Validado |
| 13 | Tipos de Equipos | Pendiente inmediato |
| 14 | Proveedores | Pendiente inmediato |
| 15 | Marcas | Pendiente inmediato |
| 16 | Equipos | Pendiente crítico |
| 17 | PSR / OSR | Pendiente crítico |
| 18 | Averías | Pendiente crítico |
| 19 | Evidencias Fotográficas | Pendiente |
| 20 | Dashboard KPI | Pendiente |
| 21 | Reportes PDF | Pendiente |
| 22 | Auditoría | Pendiente |
| 23 | Configuración | Pendiente |
| 24 | QA Integral | Pendiente |
| 25 | Despliegue Producción | Pendiente |

---

# 5. Tareas de Infraestructura

| ID | Tarea | Prioridad | Estado |
|---|---|---|---|
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
| DB-007 | Crear migración `dim_tipos_equipo` | Crítica | ⏳ |
| DB-008 | Crear migración `dim_proveedores` | Crítica | ⏳ |
| DB-009 | Crear migración `dim_marcas` | Alta | ⏳ |
| DB-010 | Crear migración `fac_equipos` | Crítica | ⏳ |
| DB-011 | Crear migración `fac_psr` | Crítica | ⏳ |
| DB-012 | Crear migración `fac_osr` | Crítica | ⏳ |
| DB-013 | Crear migración `fac_averias` | Alta | ⏳ |
| DB-014 | Crear migración `fac_evidencias` | Alta | ⏳ |
| DB-015 | Crear migración `auditoria_eventos` | Alta | ⏳ |
| DB-016 | Configurar índices y relaciones | Alta | ⏳ |
| DB-017 | Configurar restricciones de integridad | Alta | ⏳ |

---

# 7. Tareas Backend

| ID | Tarea | Prioridad | Estado |
|---|---|---|---|
| BE-001 | Inicializar proyecto Quarkus | Crítica | ✅ |
| BE-002 | Configurar conexión PostgreSQL | Crítica | ✅ |
| BE-003 | Configurar arquitectura modular | Crítica | ✅ |
| BE-004 | Configurar autenticación Microsoft OIDC manual | Crítica | ✅ |
| BE-005 | Configurar JWT propio | Crítica | ✅ |
| BE-006 | Implementar módulo usuarios | Alta | ✅ |
| BE-007 | Implementar módulo roles | Alta | ✅ |
| BE-008 | Implementar validación login: registrado, activo tenant, activo app | Alta | ✅ |
| BE-009 | Implementar módulo sedes | Alta | ✅ |
| BE-010 | Implementar módulo campañas | Alta | ✅ |
| BE-011 | Implementar módulo tipos equipos | Alta | ⏳ |
| BE-012 | Implementar módulo proveedores | Alta | ⏳ |
| BE-013 | Implementar módulo marcas | Alta | ⏳ |
| BE-014 | Implementar módulo equipos | Crítica | ⏳ |
| BE-015 | Implementar módulo PSR / OSR | Crítica | ⏳ |
| BE-016 | Implementar módulo averías | Alta | ⏳ |
| BE-017 | Implementar módulo evidencias | Alta | ⏳ |
| BE-018 | Implementar auditoría operacional | Alta | ⏳ |
| BE-019 | Implementar generación PDF | Media | ⏳ |
| BE-020 | Implementar APIs dashboard KPI | Media | ⏳ |
| BE-021 | Configurar manejo global de errores | Alta | ✅ |
| BE-022 | Configurar validaciones backend | Alta | ✅ |
| BE-023 | Configurar logs backend | Alta | ✅ |
| BE-024 | Configurar versionamiento APIs `/api/v1` | Alta | ✅ |
| BE-025 | Configurar OpenAPI / Swagger UI | Media | ✅ |

---

# 8. Tareas Frontend Web

| ID | Tarea | Prioridad | Estado |
|---|---|---|---|
| WEB-001 | Inicializar React SPA | Crítica | ✅ |
| WEB-002 | Configurar Vite | Alta | ✅ |
| WEB-003 | Configurar MUI | Alta | ✅ |
| WEB-004 | Implementar layout base | Alta | ✅ |
| WEB-005 | Implementar login Microsoft | Crítica | ✅ |
| WEB-006 | Implementar usuarios | Alta | ✅ |
| WEB-007 | Implementar roles | Alta | ✅ |
| WEB-008 | Implementar sedes | Alta | ✅ |
| WEB-009 | Implementar campañas | Alta | ✅ |
| WEB-010 | Implementar tipos de equipo | Alta | ⏳ |
| WEB-011 | Implementar proveedores | Alta | ⏳ |
| WEB-012 | Implementar marcas | Alta | ⏳ |
| WEB-013 | Implementar equipos | Crítica | ⏳ |
| WEB-014 | Implementar PSR / OSR | Crítica | ⏳ |
| WEB-015 | Implementar averías | Alta | ⏳ |
| WEB-016 | Implementar evidencias | Alta | ⏳ |
| WEB-017 | Implementar dashboard KPI | Media | ⏳ |
| WEB-018 | Implementar reportes PDF | Media | ⏳ |

---

# 9. Tareas Frontend Mobile

| ID | Tarea | Prioridad | Estado |
|---|---|---|---|
| AND-001 | Inicializar proyecto Expo React Native | Crítica | ✅ |
| AND-002 | Configurar Expo SDK 54 | Crítica | ✅ |
| AND-003 | Implementar login Microsoft | Crítica | ✅ |
| AND-004 | Persistir JWT en SecureStore | Alta | ✅ |
| AND-005 | Recuperar sesión al abrir app | Alta | ✅ |
| AND-006 | Compilar APK inicial con EAS Cloud | Alta | ✅ |
| AND-007 | Validar APK en dispositivo físico | Alta | ✅ |
| AND-008 | Configurar navegación operativa | Alta | ⏳ |
| AND-009 | Implementar listado de equipos | Crítica | ⏳ |
| AND-010 | Implementar registro de averías | Alta | ⏳ |
| AND-011 | Implementar atención de averías | Alta | ⏳ |
| AND-012 | Implementar captura de fotografías | Alta | ⏳ |
| AND-013 | Implementar consumo de APIs operativas | Crítica | ⏳ |
| AND-014 | Implementar manejo global de errores | Alta | ⏳ |
| AND-015 | Implementar visualización de PDF | Media | ⏳ |

---

# 10. HDT-002 — Siguiente Hito Crítico

El siguiente hito crítico es HDT-002.

## Objetivo

Construir el núcleo operativo mínimo del sistema sobre PostgreSQL, backend Quarkus y frontend web.

## Alcance HDT-002

| Orden | Componente | Justificación |
|---|---|---|
| 1 | `dim_tipos_equipo` | Catálogo base para registrar equipos |
| 2 | `dim_proveedores` | Catálogo obligatorio para equipos |
| 3 | `dim_marcas` | Catálogo auxiliar de equipos |
| 4 | `fac_equipos` | Entidad central del negocio |
| 5 | `fac_psr` | Documento operativo de solicitud |
| 6 | `fac_osr` | Documento operativo asociado a PSR/equipo |
| 7 | `fac_averias` | Control de inactividad y reparaciones |

## Criterio de finalización

HDT-002 se considera terminado cuando existan:

- migraciones PostgreSQL/Flyway,
- entidades backend,
- repositorios,
- servicios,
- resources REST,
- DTOs,
- validaciones,
- pantallas web CRUD,
- endpoints protegidos por JWT,
- pruebas manuales básicas,
- actualización documental del hito.

---

# 11. Secuencia Recomendada de Implementación

1. Diseñar ERD operativo PostgreSQL.
2. Crear migraciones Flyway para catálogos.
3. Implementar backend de tipos de equipo.
4. Implementar backend de proveedores.
5. Implementar backend de marcas.
6. Implementar pantallas web de catálogos.
7. Crear migración de equipos.
8. Implementar backend y web de equipos.
9. Crear migraciones PSR/OSR.
10. Implementar backend y web PSR/OSR.
11. Crear migración averías.
12. Implementar backend y web de averías.
13. Documentar HDT-002.

---

# 12. Cierre

Este documento queda sincronizado con el estado actual del repositorio y con PostgreSQL 18 como motor oficial del sistema.