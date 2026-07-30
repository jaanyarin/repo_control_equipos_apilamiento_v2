# SOFTWARE DEVELOPMENT DOCUMENT (SDD)
# 02_PLAN.md

---

# 1. Objetivo del Plan

El presente documento define la estrategia general de desarrollo, implementación, despliegue y evolución del sistema de control operativo de equipos de apilamiento.

El sistema estará orientado a la administración y trazabilidad de equipos alquilados utilizados en campañas operativas agrícolas, permitiendo controlar información documental, operativa y analítica mediante aplicación móvil Android, plataforma web, backend API REST y base de datos PostgreSQL.

---

# 2. Alcance del Desarrollo

## 2.1 Alcance Incluido

El proyecto contempla el desarrollo de:

- Aplicación móvil Android para operación de campo.
- Backend centralizado basado en APIs REST.
- Plataforma web para administración y visualización de indicadores operativos.
- Gestión de autenticación local con BCrypt (login por perfil + usuario + contraseña).
- Gestión de usuarios y roles.
- Gestión de sedes.
- Gestión de campañas operativas.
- Gestión documental PSR / OSR.
- Gestión operativa de equipos.
- Gestión de tipos de equipos.
- Gestión de proveedores.
- Gestión de averías.
- Gestión de evidencias fotográficas.
- Generación de reportes PDF.
- Dashboard KPI.
- Auditoría y trazabilidad operativa.
- Gestión de catálogos y configuraciones.

## 2.2 Alcance Excluido

El proyecto no contempla:

- Operación offline.
- Integración directa con NISIRA.
- Telemetría de equipos.
- Inteligencia artificial.
- Integraciones ERP externas.
- Multiempresa.
- Firma digital avanzada.
- Integración con dispositivos IoT.
- Aplicación iOS.
- Automatización mediante bots.

---

# 3. Estrategia de Implementación

El sistema será desarrollado bajo una arquitectura modular desacoplada basada en servicios REST centralizados.

La implementación seguirá una estrategia incremental orientada a módulos funcionales priorizados según criticidad operacional.

El proyecto estará dividido en fases de:

- análisis,
- arquitectura,
- desarrollo backend,
- desarrollo frontend web,
- desarrollo frontend mobile,
- pruebas,
- despliegue,
- estabilización.

El desarrollo estará enfocado inicialmente en un MVP operativo que permita cubrir las necesidades críticas del proceso operacional de control de equipos.

---

# 4. Arquitectura General

La arquitectura del sistema estará basada en componentes desacoplados distribuidos en:

- Aplicación móvil Android.
- Plataforma web administrativa y analítica.
- Backend API REST centralizado.
- Base de datos relacional PostgreSQL 18.
- Servicio de autenticación local con BCrypt + JWT.
- Servicio de generación PDF.
- Servicio de almacenamiento multimedia basado en filesystem con rutas persistidas en PostgreSQL.

La comunicación entre clientes y backend se realizará mediante HTTPS utilizando APIs REST seguras mediante JWT.

---

# 5. Stack Tecnológico Oficial

| Capa | Tecnología | Estado |
|---|---|---|
| Backend | Quarkus Java 3.14.4 | ✅ Implementado |
| Runtime Backend | Java 17 / Docker | ✅ Implementado |
| Frontend Mobile | Expo React Native SDK ~54.0.35 | ✅ Activo. CRUD operativo: PSR/OSR, catálogos, averías, usuarios, auditoría. Build EAS Cloud (local bloqueado por Sophos). NO migrado a CLI |
| Frontend Web | React 18 SPA, Vite 5, MUI 6 | ✅ Implementado |
| Base de Datos | PostgreSQL 18 | ✅ Oficial / Implementado |
| Migraciones | Flyway | ✅ Implementado |
| Autenticación | Login local BCrypt + JWT propio | ✅ Implementado |
| Seguridad | SmallRye JWT / JWT Build / jBCrypt | ✅ Implementado |
| APIs | REST /api/v1 | ✅ Implementado |
| Reverse Proxy | Nginx | ✅ Implementado |
| Contenedorización | Docker | ✅ Implementado |
| Orquestación | Docker Compose | ✅ Implementado |
| Control de versiones | GitHub | ✅ Implementado |
| CI/CD | GitHub Actions | ⏳ Pendiente |
| Generación PDF | iText PDF | ⏳ Pendiente |
| Fotografías | Filesystem + rutas en PostgreSQL | ⏳ Pendiente |
| Infraestructura Cloud | VPS Linux | ⏳ Pendiente |

## 5.1 Decisión Oficial de Base de Datos

La base de datos oficial del proyecto es PostgreSQL 18.

Esta decisión queda alineada con:

- `docker-compose.yml`, que levanta PostgreSQL 18.
- Backend Quarkus con driver `quarkus-jdbc-postgresql`.
- Scripts SQL orientados a PostgreSQL.
- Migraciones Flyway.
- Timezone oficial `America/Lima` configurado en contenedor y backend.

No se usará MySQL en este proyecto.

---

# 6. Estructura de Módulos

| Código | Módulo | Estado Actual |
|---|---|---|---|---|
| MOD-01 | Autenticación | ✅ Validado (local BCrypt) |
| MOD-02 | Usuarios | ✅ Validado (backend + web + mobile CRUD con CreateEditUserScreen) |
| MOD-03 | Sedes | ✅ Validado (mobile + web + mobile CRUD) |
| MOD-04 | Campañas | ✅ Validado (mobile + web + mobile activar/cerrar) |
| MOD-05 | PSR / OSR | ✅ Validado (CRUD mobile con formulario, date picker, catálogos) |
| MOD-06 | Equipos | ✅ Validado (backend + web + mobile, detalle con botón dinámico) |
| MOD-07 | Tipos de Equipos | ✅ Validado (backend + web + mobile CRUD) |
| MOD-08 | Proveedores | ✅ Validado (backend + web + mobile CRUD) |
| MOD-09 | Averías | ✅ Validado (mobile + web). Incluye Finalización del Servicio (restaura estado OPERATIVO) |
| MOD-10 | Evidencias Fotográficas | ⏳ Parcial (1 foto en atención de avería) |
| MOD-11 | Dashboard KPI | ⏳ Pendiente |
| MOD-12 | Reportes PDF | ⏳ Pendiente |
| MOD-13 | Auditoría | ✅ Validado (backend audit/ + mobile screen) |
| MOD-14 | Catálogos | ✅ Validado (mobile con CatalogScreen genérico) |
| MOD-15 | Configuración | ✅ Validado (mobile SettingsScreen con URL configurable) |
| MOD-16 | Mobile App | ✅ Expo SDK 54. 14 componentes UI reutilizables. Sistema de tema MD3. 19+ pantallas. Navegación completa (AuthStack+MainStack+BottomTabs). Build EAS Cloud (local bloqueado por Sophos). NO migrado a CLI |

---

# 7. Fases del Proyecto

| Fase | Objetivo | Estado |
|---|---|---|
| Fase 1 | Definición funcional y documental | ✅ Completado |
| Fase 2 | Diseño arquitectónico | ✅ Completado |
| Fase 3 | Infraestructura Docker + PostgreSQL + Nginx | ✅ Completado |
| Fase 4 | Backend base + autenticación + usuarios + sedes + campañas | ✅ Completado |
| Fase 5 | Frontend web administrativo base | ✅ Completado |
| Fase 6 | Mobile login + APK inicial | ✅ Validado |
| Fase 7 | Migración a autenticación local BCrypt | ✅ Completado |
| Fase 8 | Módulos operativos núcleo | ✅ Completado (PSR/OSR, averías, catálogos, equipos en mobile + web) |
| Fase 8.1 | Migración mobile Expo → React Native CLI | ✅ Completado |
| Fase 8.2 | Componentes UI reutilizables mobile (14 componentes) | ✅ Completado |
| Fase 8.3 | Sistema de tema mobile (design tokens) | ✅ Completado |
| Fase 8.4 | CRUD PSR/OSR mobile con date picker nativo | ✅ Completado |
| Fase 9 | Evidencias, PDF, dashboard | ⏳ Pendiente (auditoría ya completada) |
| Fase 10 | Integración general | ⏳ Pendiente |
| Fase 11 | QA y pruebas operativas | ⏳ Pendiente |
| Fase 12 | Despliegue controlado | ⏳ Pendiente |
| Fase 13 | Estabilización y soporte inicial | ⏳ Pendiente |

---

# 8. Roadmap General Actualizado

| # | Módulo | Estado |
|---|---|---|
| 1 | Infraestructura Docker | ✅ Completado |
| 2 | PostgreSQL 18 | ✅ Completado |
| 3 | Backend API REST Quarkus | ✅ Completado base |
| 4 | Frontend Web SPA | ✅ Completado base |
| 5 | Autenticación local BCrypt + JWT | ✅ Completado |
| 6 | Usuarios (seed local) | ✅ Completado |
| 7 | Roles | ✅ Completado |
| 8 | Sedes | ✅ Completado |
| 9 | Campañas | ✅ Completado |
| 10 | Mobile login local | ✅ Validado |
| 11 | APK inicial | ✅ Validado |
| 12 | Tipos de Equipos | ✅ Completado |
| 13 | Proveedores | ✅ Completado |
| 14 | Equipos | ✅ Completado |
| 15 | PSR / OSR | ✅ Completado (CRUD mobile + web) |
| 16 | Averías | ✅ Completado (mobile + web) |
| 17 | Evidencias Fotográficas | ⏳ Parcial (1 foto en atención) |
| 18 | Dashboard KPI | ⏳ Pendiente |
| 19 | Reportes PDF | ⏳ Pendiente |
| 20 | Auditoría | ✅ Completado |
| 21 | Configuración | ✅ Completado |
| 22 | CI/CD | ⏳ Pendiente |
| 23 | QA Integral | ⏳ Pendiente |
| 24 | Despliegue Producción | ⏳ Pendiente |
| 25 | Migración mobile Expo → React Native CLI | ✅ Completado |
| 26 | Componentes UI reutilizables mobile | ✅ Completado |
| 27 | Sistema de tema mobile (Design Tokens) | ✅ Completado |
| 28 | Pantalla PSR/OSR mobile con date picker, catálogos y CRUD | ✅ Completado |
| 29 | Pantalla crear PSR mobile (React Hook Form + Zod + date picker nativo) | ✅ Completado |
| 30 | Finalización del Servicio (atención de averías con restauración estado equipo) | ✅ Completado |

---

# 9. Ambientes del Sistema

| Ambiente | Objetivo |
|---|---|
| Desarrollo | Construcción y pruebas técnicas |
| QA | Validación funcional y operativa |
| Producción | Operación oficial del sistema |

Cada ambiente deberá mantener configuraciones independientes y controladas.

## 9.1 Configuración de Infraestructura — Congelada

La siguiente configuración corresponde al ambiente de desarrollo local y está validada como funcionando. NO MODIFICAR sin autorización.

### Mapa de Puertos

| Servicio | Puerto Host | Puerto Contenedor | Uso |
|---|---|---|---|
| Nginx | 80 / 443 | 80 / 443 | Frontend SPA + Proxy API |
| Backend Quarkus | 8082 | 8082 | API REST |
| PostgreSQL 18 | 5433 | 5432 | Base de datos |

### URLs de Acceso

| URL | Descripción |
|---|---|
| `http://localhost/` | Frontend Web SPA |
| `http://localhost/api/v1/` | API Backend (proxy Nginx) |
| `http://localhost/health` | Health Check |
| `http://localhost/swagger` | Swagger UI |
| `localhost:5433` | Conexión DB externa (DBeaver, pgAdmin) |

### Dependencias de Contenedores

```
postgres (healthcheck) → backend → nginx
```

---

# 10. Estrategia de Seguridad

La seguridad del sistema está basada en:

- Autenticación local con contraseñas hasheadas (BCrypt).
- Control de acceso mediante JWT.
- Roles y permisos internos.
- Expiración automática de sesiones (8 horas).
- Cambio de contraseña obligatorio en primer ingreso.
- Uso obligatorio de HTTPS en ambientes controlados.
- Protección de APIs REST.
- Auditoría de eventos críticos.
- Restricción de acceso por usuarios autorizados.

El acceso al sistema solo será permitido para usuarios previamente registrados y habilitados dentro de la plataforma.

---

# 11. Estrategia de Auditoría

El sistema deberá registrar eventos operativos relacionados a:

- Inicio y cierre de sesión.
- Creación de registros.
- Actualización de registros.
- Eliminación física administrativa.
- Eliminación lógica operacional.
- Cambios críticos.
- Errores operacionales.
- Eventos de seguridad.

La auditoría permitirá mantener trazabilidad completa del sistema.

---

# 12. Estrategia de Fotografías y Archivos

El sistema gestionará evidencias fotográficas asociadas a:

- equipos,
- ingreso de equipos,
- devolución de equipos,
- averías,
- atención de averías,
- operaciones documentales.

La decisión oficial es almacenar archivos en filesystem controlado y persistir metadatos/rutas en PostgreSQL.

---

# 13. Estrategia de Reportes PDF

El sistema permitirá generar reportes PDF relacionados a:

- equipos,
- PSR,
- OSR,
- averías,
- indicadores operativos,
- historial de uso,
- evidencias asociadas.

La generación PDF se implementará en backend usando iText PDF u otra librería Java compatible con Quarkus.

---

# 14. Estrategia KPI y Dashboard

El sistema contará con dashboards orientados a visualización operativa y analítica.

Los indicadores permitirán:

- monitoreo operativo,
- control de campañas,
- seguimiento de averías,
- seguimiento de equipos,
- trazabilidad histórica,
- análisis por proveedor,
- análisis por tipo de equipo.

Los dashboards deberán permitir filtros por:

- campaña,
- sede,
- equipo,
- proveedor,
- tipo de equipo,
- estado operativo.

---

# 15. Estrategia QA y Testing

El proyecto contemplará pruebas:

- funcionales,
- operativas,
- integración,
- APIs REST,
- frontend Android,
- frontend web,
- autenticación,
- persistencia PostgreSQL,
- carga y consulta de evidencias.

---

# 16. Estrategia DevOps y Despliegue

La estrategia de despliegue considerará:

- control de versiones mediante GitHub,
- ramas controladas,
- despliegues controlados,
- validación QA previa,
- separación de ambientes,
- control de versiones backend y frontend,
- backups PostgreSQL,
- variables de entorno seguras.

---

# 17. Estado Actual del Desarrollo

## HDT-002 — Núcleo Operativo ✅ (CERRADO)

1. Tipos de Equipo ✅
2. Proveedores ✅
3. Marcas ✅
4. Equipos ✅
5. PSR / OSR ✅ (CRUD mobile + web)
6. Averías ✅ (mobile + web)

## HDT-003 — Calidad, Despliegue y Auditoría ✅ (EN AUDITORÍA)

1. Tests backend (JUnit 5 + Mockito, 7 archivos) ✅
2. Tests frontend web (Jest, 2 archivos) ✅
3. Tests mobile (Jest + RNTL, 3 archivos) ✅
4. Módulo Rol completo ✅
5. Paquete audit/ (entidad, repositorio, servicio, API) ✅
6. Paquete config/ (CORS, AppConfig) ✅
7. Paquete security/ (JwtFilter, SecurityUtil) ✅
8. Migraciones V10 (auditoria_eventos) + V11 (seed) ✅
9. GitHub Actions CI/CD ✅
10. Modo claro/oscuro frontend ✅

## HDT-004 — Pantallas Mobile Faltantes ✅ (CERRADO)

1. CatalogScreen genérico reutilizable ✅
2. Marcas, Proveedores, TiposEquipo, Sedes Screens (CRUD) ✅
3. Roles, Usuarios, Auditoría, Settings Screens ✅
4. Tab Catálogos con menú de 9 botones ✅
5. PSR/OSR backend + web + mobile ✅

## HDT-006 — Gestión móvil PSR/OSR ✅ (CERRADO)

1. CreatePsrScreen con React Hook Form + Zod + date picker nativo ✅
2. Edición PSR/OSR con atomicidad transaccional ✅
3. Catálogos integrados (campañas, sedes, motivos) ✅

## HDT-007 — CRUD Usuarios Mobile ✅ (CERRADO)

1. CreateEditUserScreen (crear/editar usuarios) ✅
2. Permisos por rol (solo Super Admin edita Super Admin) ✅
3. Correcciones de autenticación (race condition en login, logout robusto) ✅

## Feature: Finalización del Servicio ✅ (COMPLETADO)

- Backend: al marcar `ATENDIDA`, restaura `equipo.estadoOperativo = "OPERATIVO"`
- Backend: removido `@Valid` del PUT para permitir actualizaciones parciales
- Mobile: AtenderAveriaScreen simplificado a 1 foto, botón "Finalizar Servicio"
- Mobile: foto se sube en submit junto con la atención
- Mobile: EquipoDetail muestra "Registrar Reparación" si `AVERIADO`, "Registrar Avería" si `OPERATIVO`
- Mobile: HomeScreen menú "Finalización del Servicio" filtra equipos AVERIADOS

## Extensiones realizadas (post-HDT-002)

- 14 componentes UI reutilizables ✅
- Sistema de tema (Design Tokens) ✅
- CRUD PSR/OSR mobile con date picker nativo ✅
- Catálogos integrados en mobile (sedes, motivos, campañas) ✅

## Próximo foco

Evidencias Fotográficas (integración completa), Dashboard KPI, Reportes PDF, QA Integral, rebuild APK EAS Cloud, Firebase Crashlytics, fix preview foto Xiaomi/HyperOS. Fix de preview fotográfica en dispositivo Xiaomi/HyperOS.

---

# 18. Riesgos del Proyecto

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Cambios operativos no documentados | Alto | Validación por hito |
| Crecimiento no controlado de requerimientos | Alto | Backlog cerrado por MVP |
| Conectividad limitada en operación | Medio | Validación previa de red en campo |
| Cambios organizacionales | Medio | Roles configurables |
| Incremento futuro de módulos | Medio | Arquitectura modular |
| Retraso en módulos operativos | Alto | Priorizar HDT-002 inmediatamente |

---

# 19. Dependencias del Proyecto

El proyecto depende de:

- Infraestructura tecnológica.
- Accesos corporativos.
- Disponibilidad de usuarios operativos.
- Validaciones funcionales.
- Definición de formatos PDF.
- Definición final de campos obligatorios para evidencias.

---

# 20. Consideraciones Finales

PostgreSQL 18 queda establecido como base de datos oficial del proyecto.

HDT-002 (núcleo operativo) fue completado incluyendo extensiones mobile. El próximo avance debe enfocarse en evidencias fotográficas, dashboard KPI, reportes PDF, QA integral y build APK vía EAS Cloud.
