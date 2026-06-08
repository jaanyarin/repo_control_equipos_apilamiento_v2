# SOFTWARE DEVELOPMENT DOCUMENT (SDD)
# 04_IMPLEMENTATION.md

---

# 1. Control Documental

| Campo | Valor |
|---|---|
| Documento | 04_IMPLEMENTATION.md |
| Proyecto | Sistema de Control Operativo de Equipos de Apilamiento |
| Estado | En desarrollo sincronizado con repositorio |
| Versión | 1.2 |
| Fecha | 2026-06-08 |
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
| Frontend Mobile | Expo React Native SDK 54 |
| Backend | Quarkus Java 3.14.4 |
| API | REST versionada en /api/v1 |
| Seguridad | Microsoft Entra ID y JWT propio |
| Base de Datos | PostgreSQL 18 |
| Migraciones | Flyway |
| Proxy | Nginx |
| Contenedores | Docker Compose |

---

# 4. Módulos Implementados

| Módulo | Estado |
|---|---|
| Autenticación Microsoft | Validado |
| JWT propio | Validado |
| Microsoft Graph API | Validado |
| Usuarios | Validado |
| Roles | Validado |
| Sedes | Validado |
| Campañas | Validado |
| Frontend web base | Validado |
| Mobile login | Validado |
| APK inicial | Validado |
| Docker + PostgreSQL + Nginx | Validado |

---

# 5. Módulos Pendientes

| Módulo | Prioridad |
|---|---|
| Tipos de Equipo | Inmediata |
| Proveedores | Inmediata |
| Marcas | Inmediata |
| Equipos | Crítica |
| PSR / OSR | Crítica |
| Averías | Crítica |
| Evidencias Fotográficas | Alta |
| Auditoría Operacional | Alta |
| Reportes PDF | Media |
| Dashboard KPI | Media |
| CI/CD | Media |

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

# 7. HDT-002 — Siguiente Hito

El siguiente hito debe construir el núcleo operativo mínimo del sistema.

Orden recomendado:

1. Diseñar ERD operativo PostgreSQL.
2. Crear migraciones Flyway de catálogos.
3. Implementar backend de tipos de equipo.
4. Implementar backend de proveedores.
5. Implementar backend de marcas.
6. Implementar frontend web de catálogos.
7. Implementar equipos.
8. Implementar PSR / OSR.
9. Implementar averías.
10. Documentar HDT-002.

---

# 8. Criterios de Implementación

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

# 9. Cierre

Este documento queda sincronizado con PostgreSQL 18 como base oficial y con HDT-002 como siguiente punto crítico de desarrollo.