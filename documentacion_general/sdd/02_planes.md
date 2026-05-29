# SOFTWARE DEVELOPMENT DOCUMENT (SDD)
# 02_PLAN.md

---

# 1. Objetivo del Plan

El presente documento tiene como finalidad definir la estrategia general de desarrollo, implementación, despliegue y evolución del sistema de control operativo de equipos de apilamiento.

Este documento establece los lineamientos técnicos, arquitectónicos y operacionales necesarios para garantizar que el desarrollo del proyecto sea mantenible, escalable, entendible y alineado a los procesos operativos de la organización.

El sistema estará orientado a la administración y trazabilidad de equipos alquilados utilizados en campañas operativas agrícolas, permitiendo controlar información documental, operativa y analítica mediante aplicaciones móviles y plataformas web.

---

# 2. Alcance del Desarrollo

## 2.1 Alcance Incluido

El proyecto contempla el desarrollo de:

- Aplicación móvil Android para operación de campo
- Backend centralizado basado en APIs REST
- Plataforma web para visualización de indicadores operativos
- Gestión de autenticación corporativa Microsoft
- Gestión de usuarios y roles
- Gestión de campañas operativas
- Gestión documental PSR / OSR
- Gestión operativa de equipos
- Gestión de averías
- Gestión de evidencias fotográficas
- Generación de reportes PDF
- Dashboard KPI
- Auditoría y trazabilidad operativa
- Gestión de catálogos y configuraciones

---

## 2.2 Alcance Excluido

El proyecto no contempla:

- Operación offline
- Integración con NISIRA
- Telemetría de equipos
- Inteligencia artificial
- Integraciones ERP externas
- Multiempresa
- Firma digital avanzada
- Integración con dispositivos IoT
- Aplicación iOS
- Automatización mediante bots

---

# 3. Estrategia de Implementación

El sistema será desarrollado bajo una arquitectura modular desacoplada basada en servicios REST centralizados.

La implementación seguirá una estrategia incremental orientada a módulos funcionales priorizados según criticidad operacional.

El proyecto estará dividido en fases de:
- análisis,
- arquitectura,
- desarrollo backend,
- desarrollo frontend,
- pruebas,
- despliegue,
- estabilización.

El desarrollo estará enfocado inicialmente en un MVP operativo que permita cubrir las necesidades críticas del proceso operacional de control de equipos.

---

# 4. Arquitectura General

La arquitectura del sistema estará basada en componentes desacoplados distribuidos en:

- Aplicación móvil Android
- Plataforma web administrativa y analítica
- Backend API REST centralizado
- Base de datos relacional PostgreSQL
- Servicio de autenticación Microsoft Identity
- Servicios de generación PDF
- Servicios de almacenamiento multimedia

La comunicación entre clientes y backend se realizará mediante HTTPS utilizando APIs REST seguras mediante JWT.

---

# 5. Stack Tecnológico

| Capa | Tecnología | Estado |
|---|---|---|---|
| Backend | Quarkus Java (3.14.4) |✅ Implementado|
| Frontend Mobile | Expo React Native |⏳ Pendiente|
| Frontend Web | React 18 SPA (Vite 5 + MUI 6, build → frontend/dist/) |✅ Implementado|
| Base de Datos | PostgreSQL 18 |✅ Implementado|
| Autenticación | Microsoft Entra ID OIDC + JWT manual (Httpclient) |✅ Implementado|
| Autenticación | Microsoft Graph API (app-only token, client credentials flow) |✅ Implementado|
| Seguridad | JWT (SmallRye JWT Build) |✅ Implementado|
| APIs | REST /api/v1 |✅ Implementado|
| Reverse Proxy | Nginx |✅ Implementado|
| Contenedorización | Docker |✅ Implementado|
| Orquestación Contenedores | Docker Compose |✅ Implementado|
| Control Versiones | GitHub |✅ Implementado|
| CI/CD | GitHub Actions |⏳ Pendiente|
| Generación PDF | iText PDF |⏳ Pendiente|
| Almacenamiento Fotografías | Filesystem + rutas en base de datos |⏳ Pendiente|
| Infraestructura Cloud | VPS Linux (Hetzner / DigitalOcean) |⏳ Pendiente|

---

# 6. Estructura de Módulos

El sistema estará organizado mediante módulos funcionales desacoplados:

| Código | Módulo |
|---|---|
| MOD-01 | Autenticación |
| MOD-02 | Usuarios |
| MOD-03 | Sedes |
| MOD-04 | Campañas |
| MOD-05 | PSR / OSR |
| MOD-06 | Equipos |
| MOD-07 | Tipos de Equipos |
| MOD-08 | Proveedores |
| MOD-09 | Averías |
| MOD-10 | Evidencias Fotográficas |
| MOD-11 | Dashboard KPI |
| MOD-12 | Reportes PDF |
| MOD-13 | Auditoría |
| MOD-14 | Catálogos |
| MOD-15 | Configuración |

La separación modular permitirá:
- mantenibilidad,
- crecimiento controlado,
- escalabilidad futura,
- reutilización de componentes,
- desacoplamiento técnico.

---

# 7. Fases del Proyecto

| Fase | Objetivo | Estado |
|---|---|---|---|
| Fase 1 | Definición funcional y documental | ✅ Completado |
| Fase 2 | Diseño arquitectónico | ✅ Completado |
| Fase 3 | Desarrollo backend (módulos base) | ✅ Completado |
| Fase 4 | Desarrollo frontend web SPA | ✅ Completado |
| Fase 5 | Desarrollo APK Android | ⏳ Pendiente |
| Fase 6 | Integración general | ⏳ Pendiente |
| Fase 7 | QA y pruebas operativas | ⏳ Pendiente |
| Fase 8 | Despliegue controlado | ⏳ Pendiente |
| Fase 9 | Estabilización y soporte inicial | ⏳ Pendiente |

---

# 8. Roadmap General

| # | Módulo | Estado |
|---|---|---|
| 1 | Autenticación (Microsoft OIDC + JWT) | ✅ Completado |
| 2 | Usuarios (CRUD backend + frontend web) | ✅ Completado |
| 3 | Roles (CRUD backend + frontend web) | ✅ Completado |
| 4 | Sedes (CRUD backend + frontend web, delete físico) | ✅ Completado |
| 5 | Campañas (CRUD backend + frontend web, activar/cerrar, delete físico) | ✅ Completado |
| 6 | Tipos de Equipos | ⏳ Pendiente |
| 7 | Proveedores | ⏳ Pendiente |
| 8 | PSR / OSR | ⏳ Pendiente |
| 9 | Equipos | ⏳ Pendiente |
| 10 | Averías | ⏳ Pendiente |
| 11 | Evidencias Fotográficas | ⏳ Pendiente |
| 12 | Dashboard KPI | ⏳ Pendiente |
| 13 | Reportes PDF | ⏳ Pendiente |
| 14 | Auditoría | ⏳ Pendiente |
| 15 | Configuración | ⏳ Pendiente |
| 16 | Frontend Mobile (Expo React Native) | ⏳ Pendiente |
| 17 | QA Integral | ⏳ Pendiente |
| 18 | Despliegue Producción | ⏳ Pendiente |
| 19 | Plataforma Web SPA (React 18 + Vite 5 + MUI 6) | ✅ Completado |
| 20 | Backend API REST (Quarkus 3.14.4) | ✅ Completado |

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

La seguridad del sistema estará basada en:

- Autenticación corporativa Microsoft
- Control de acceso mediante JWT
- Roles y permisos internos
- Expiración automática de sesiones
- Uso obligatorio de HTTPS
- Protección de APIs REST
- Auditoría de eventos críticos
- Restricción de acceso por usuarios autorizados
- Integración con Microsoft Graph API (app-only token con permiso User.Read.All) para búsqueda y validación de usuarios del tenant corporativo

El acceso al sistema solo será permitido para usuarios previamente registrados y habilitados dentro de la plataforma.

---

# 11. Estrategia de Auditoría

El sistema deberá registrar eventos operativos relacionados a:

- Inicio y cierre de sesión
- Creación de registros
- Actualización de registros
- Eliminación lógica
- Cambios críticos
- Errores operacionales
- Eventos de seguridad

La auditoría permitirá mantener trazabilidad completa del sistema.

---

# 12. Estrategia de Fotografías y Archivos

El sistema permitirá gestionar evidencias fotográficas asociadas a:
- equipos,
- averías,
- operaciones.

Las fotografías podrán ser múltiples y deberán mantenerse asociadas a los registros operativos correspondientes.

La estrategia de almacenamiento final será definida durante la etapa arquitectónica.

---

# 13. Estrategia de Reportes PDF

El sistema permitirá generar reportes PDF relacionados a:
- equipos,
- PSR,
- OSR,
- averías,
- indicadores operativos.

Los reportes deberán permitir exportación y visualización desde las plataformas habilitadas.

---

# 14. Estrategia KPI y Dashboard

El sistema contará con dashboards orientados a visualización operativa y analítica.

Los indicadores permitirán:
- monitoreo operativo,
- control de campañas,
- seguimiento de averías,
- seguimiento de equipos,
- trazabilidad histórica.

Los dashboards deberán permitir filtros por:
- campaña,
- sede,
- equipo,
- proveedor,
- tipo de equipo.

---

# 15. Estrategia QA y Testing

El proyecto contemplará pruebas:

- funcionales,
- operativas,
- integración,
- APIs REST,
- frontend Android,
- frontend web.

Las validaciones deberán garantizar estabilidad y correcto funcionamiento antes de cada despliegue productivo.

---

# 16. Estrategia DevOps y Despliegue

La estrategia de despliegue considerará:

- control de versiones mediante GitHub,
- ramas controladas,
- despliegues controlados,
- validación QA previa,
- separación de ambientes,
- control de versiones backend y frontend.

La definición detallada de infraestructura será realizada durante la fase arquitectónica.

---

# 17. Escalabilidad Futura

La arquitectura del sistema deberá permitir crecimiento futuro mediante:

- nuevas sedes,
- nuevos módulos,
- nuevos indicadores,
- nuevas campañas,
- nuevas integraciones,
- crecimiento operacional.

La solución deberá mantenerse desacoplada y modular para facilitar futuras evoluciones.

---

# 18. Riesgos del Proyecto

| Riesgo | Impacto |
|---|---|
| Cambios operativos no documentados | Alto |
| Crecimiento no controlado de requerimientos | Alto |
| Dependencia de servicios Microsoft | Medio |
| Conectividad limitada en operación | Medio |
| Cambios organizacionales | Medio |
| Incremento futuro de módulos | Medio |

---

# 19. Dependencias del Proyecto

El proyecto dependerá de:

- Infraestructura tecnológica
- Servicios Microsoft
- Accesos corporativos
- Disponibilidad de usuarios operativos
- Validaciones funcionales
- Definiciones arquitectónicas pendientes

---

# 20. Consideraciones Finales

La estrategia planteada busca garantizar que el sistema pueda mantenerse escalable, mantenible y alineado a las necesidades operativas de la organización.

La arquitectura modular permitirá evolucionar el sistema de manera controlada, minimizando riesgos técnicos y permitiendo futuras ampliaciones funcionales sin comprometer la estabilidad operacional.
