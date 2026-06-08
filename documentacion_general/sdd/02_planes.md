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
- Gestión de autenticación corporativa Microsoft.
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
- Servicio de autenticación Microsoft Entra ID.
- Servicio de generación PDF.
- Servicio de almacenamiento multimedia basado en filesystem con rutas persistidas en PostgreSQL.

La comunicación entre clientes y backend se realizará mediante HTTPS utilizando APIs REST seguras mediante JWT.

---

# 5. Stack Tecnológico Oficial

| Capa | Tecnología | Estado |
|---|---|---|
| Backend | Quarkus Java 3.14.4 | ✅ Implementado |
| Runtime Backend | Java 17 / Docker | ✅ Implementado |
| Frontend Mobile | Expo React Native SDK 54 | ✅ Base implementada / login validado |
| Frontend Web | React 18 SPA, Vite 5, MUI 6 | ✅ Implementado |
| Base de Datos | PostgreSQL 18 | ✅ Oficial / Implementado |
| Migraciones | Flyway | ✅ Implementado |
| Autenticación | Microsoft Entra ID OIDC + JWT propio | ✅ Implementado |
| Microsoft Graph | App-only token, client credentials flow | ✅ Implementado |
| Seguridad | SmallRye JWT / JWT Build | ✅ Implementado |
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
|---|---|---|
| MOD-01 | Autenticación | ✅ Validado |
| MOD-02 | Usuarios | ✅ Validado |
| MOD-03 | Sedes | ✅ Validado |
| MOD-04 | Campañas | ✅ Validado |
| MOD-05 | PSR / OSR | ⏳ Pendiente |
| MOD-06 | Equipos | ⏳ Pendiente crítico |
| MOD-07 | Tipos de Equipos | ⏳ Pendiente crítico |
| MOD-08 | Proveedores | ⏳ Pendiente crítico |
| MOD-09 | Averías | ⏳ Pendiente crítico |
| MOD-10 | Evidencias Fotográficas | ⏳ Pendiente |
| MOD-11 | Dashboard KPI | ⏳ Pendiente |
| MOD-12 | Reportes PDF | ⏳ Pendiente |
| MOD-13 | Auditoría | ⏳ Pendiente |
| MOD-14 | Catálogos | ⏳ Parcial |
| MOD-15 | Configuración | ⏳ Pendiente |
| MOD-16 | Mobile App | ✅ Login validado / pantallas operativas pendientes |

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
| Fase 7 | Módulos operativos núcleo | ⏳ Pendiente crítico |
| Fase 8 | Evidencias, PDF, dashboard y auditoría | ⏳ Pendiente |
| Fase 9 | Integración general | ⏳ Pendiente |
| Fase 10 | QA y pruebas operativas | ⏳ Pendiente |
| Fase 11 | Despliegue controlado | ⏳ Pendiente |
| Fase 12 | Estabilización y soporte inicial | ⏳ Pendiente |

---

# 8. Roadmap General Actualizado

| # | Módulo | Estado |
|---|---|---|
| 1 | Infraestructura Docker | ✅ Completado |
| 2 | PostgreSQL 18 | ✅ Completado |
| 3 | Backend API REST Quarkus | ✅ Completado base |
| 4 | Frontend Web SPA | ✅ Completado base |
| 5 | Autenticación Microsoft OIDC + JWT | ✅ Completado |
| 6 | Microsoft Graph API | ✅ Completado |
| 7 | Usuarios | ✅ Completado |
| 8 | Roles | ✅ Completado |
| 9 | Sedes | ✅ Completado |
| 10 | Campañas | ✅ Completado |
| 11 | Mobile login + APK inicial | ✅ Validado |
| 12 | Tipos de Equipos | ⏳ Pendiente inmediato |
| 13 | Proveedores | ⏳ Pendiente inmediato |
| 14 | Equipos | ⏳ Pendiente crítico |
| 15 | PSR / OSR | ⏳ Pendiente crítico |
| 16 | Averías | ⏳ Pendiente crítico |
| 17 | Evidencias Fotográficas | ⏳ Pendiente |
| 18 | Dashboard KPI | ⏳ Pendiente |
| 19 | Reportes PDF | ⏳ Pendiente |
| 20 | Auditoría | ⏳ Pendiente |
| 21 | Configuración | ⏳ Pendiente |
| 22 | CI/CD | ⏳ Pendiente |
| 23 | QA Integral | ⏳ Pendiente |
| 24 | Despliegue Producción | ⏳ Pendiente |

---

# 9. Ambientes del Sistema

| Ambiente | Objetivo |
|---|---|
| Desarrollo | Construcción y pruebas técnicas |
| QA | Validación funcional y operativa |
| Producción | Operación oficial del sistema |

Cada ambiente deberá mantener configuraciones independientes y controladas.

---

# 10. Estrategia de Seguridad

La seguridad del sistema está basada en:

- Autenticación corporativa Microsoft.
- Control de acceso mediante JWT.
- Roles y permisos internos.
- Expiración automática de sesiones.
- Uso obligatorio de HTTPS en ambientes controlados.
- Protección de APIs REST.
- Auditoría de eventos críticos.
- Restricción de acceso por usuarios autorizados.
- Integración con Microsoft Graph API para búsqueda y validación de usuarios del tenant corporativo.

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

# 17. Punto Crítico Actual

El punto crítico actual es iniciar el núcleo operativo HDT-002:

1. Tipos de Equipo.
2. Proveedores.
3. Equipos.
4. PSR / OSR.
5. Averías.

La secuencia recomendada es:

1. Implementar catálogos base: tipos de equipo y proveedores.
2. Implementar equipos, porque es la entidad central del negocio.
3. Implementar PSR/OSR y asociación con equipo.
4. Implementar averías y cálculo de inactividad.
5. Implementar evidencias fotográficas.

---

# 18. Riesgos del Proyecto

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Cambios operativos no documentados | Alto | Validación por hito |
| Crecimiento no controlado de requerimientos | Alto | Backlog cerrado por MVP |
| Dependencia de servicios Microsoft | Medio | Manejo de errores y fallback controlado |
| Conectividad limitada en operación | Medio | Validación previa de red en campo |
| Cambios organizacionales | Medio | Roles configurables |
| Incremento futuro de módulos | Medio | Arquitectura modular |
| Retraso en módulos operativos | Alto | Priorizar HDT-002 inmediatamente |

---

# 19. Dependencias del Proyecto

El proyecto depende de:

- Infraestructura tecnológica.
- Servicios Microsoft.
- Accesos corporativos.
- Disponibilidad de usuarios operativos.
- Validaciones funcionales.
- Definición de formatos PDF.
- Definición final de campos obligatorios para evidencias.

---

# 20. Consideraciones Finales

PostgreSQL 18 queda establecido como base de datos oficial del proyecto.

La arquitectura actual ya permite continuar con los módulos operativos críticos. El siguiente avance debe enfocarse en HDT-002, evitando seguir extendiendo infraestructura antes de implementar el flujo real de negocio.