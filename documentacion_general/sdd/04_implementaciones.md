# SOFTWARE DEVELOPMENT DOCUMENT (SDD)
# 04_IMPLEMENTATION.md

---

# 1. Control Documental

| Campo | Valor |
|---|---|
| Documento | 04_IMPLEMENTATION.md |
| Proyecto | Sistema de Control Operativo de Equipos de Apilamiento |
| Estado | En desarrollo sincronizado con repositorio |
| Versión | 1.3 |
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
| Seguridad | JWT propio + BCrypt |
| Base de Datos | PostgreSQL 18 |
| Migraciones | Flyway |
| Proxy | Nginx |
| Contenedores | Docker Compose |

---

# 4. Módulos Implementados

| Módulo | Estado |
|---|---|
| Autenticación local BCrypt | Validado |
| JWT propio | Validado |
| Usuarios (seed local) | Validado |
| Roles | Validado |
| Sedes | Validado |
| Campañas | Validado |
| Frontend web base | Validado |
| Mobile login local | Validado |
| APK inicial | Validado |
| Docker + PostgreSQL + Nginx | Validado |
| Migración V8: login_local | Validado |
| Migración V9: seed_usuarios_local | Validado |

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

| Botón | Perfiles |
|---|---|
| Ingreso de PSR y OSR | Super Admin, Admin |
| Ingreso de Equipo | Super Admin, Admin, Usuario |
| Registro de Avería | Super Admin, Admin, Usuario |
| Detalles de Equipo | Super Admin, Admin, Usuario |
| Finalización del Servicio | Super Admin, Admin, Usuario |

---

# 8. HDT-002 — Siguiente Hito

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

# 9. Criterios de Implementación

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

# 10. Cierre

Este documento queda sincronizado con PostgreSQL 18 como base oficial y con HDT-002 como siguiente punto crítico de desarrollo.
