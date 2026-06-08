# SOFTWARE SPECIFICATION DOCUMENT
# Sistema de Control de Equipos de Apilamiento

---

# 1. Información General

| Campo | Detalle |
|---|---|
| Proyecto | Sistema de Control de Equipos de Apilamiento |
| Tipo de Sistema | Plataforma Full Stack Empresarial |
| Plataforma | Web SPA + Android APK |
| Backend | Quarkus Java |
| Base de Datos Oficial | PostgreSQL 18 |
| Versión Documento | 1.4 |
| Estado | En desarrollo sincronizado con repositorio |
| Fecha | 2026-06-08 |
| Responsable | Jose Anyarin |

---

# 2. Objetivo del Sistema

Desarrollar una plataforma digital empresarial para el control operativo de equipos de apilamiento alquilados, permitiendo gestionar el ciclo completo de solicitud, asignación, operación, averías, devoluciones y evidencias fotográficas, garantizando trazabilidad, control de tiempos de inactividad y soporte documental para la validación operacional y financiera del servicio.

---

# 3. Alcance del Sistema

## 3.1 Incluye

- Aplicación móvil Android para operación en campo.
- Plataforma web para administración y gestión operativa.
- Backend API REST centralizado.
- Base de datos PostgreSQL 18.
- Gestión de usuarios y autenticación local con contraseña hasheada (BCrypt).
- Gestión de roles y permisos (Super Admin, Admin, Usuario).
- Gestión de sedes operativas.
- Gestión de campañas operativas.
- Registro manual de PSR y OSR.
- Gestión de proveedores.
- Gestión de marcas.
- Gestión de tipos de equipos.
- Registro de equipos alquilados.
- Registro de accesorios y componentes asociados.
- Registro y gestión de averías.
- Control de estados operativos de equipos.
- Registro de evidencias fotográficas.
- Generación de reportes PDF.
- Dashboard web con indicadores operativos.
- Historial operativo de equipos.
- Auditoría y trazabilidad de operaciones.
- Validaciones operativas en tiempo real.
- Mensajes visuales de confirmación, validación y error.

## 3.2 No Incluye

- Integración directa con NISIRA.
- Operación offline.
- Geolocalización.
- Telemetría en tiempo real.
- Integración ERP.
- Facturación electrónica.
- Workflow de aprobaciones.
- Notificaciones push.
- Integraciones con WhatsApp.
- Integraciones con correo automático.
- Gestión financiera.
- Módulo de mantenimiento predictivo.
- MySQL.

---

# 4. Decisión Técnica Oficial: PostgreSQL

PostgreSQL 18 queda definido como motor de base de datos oficial del proyecto.

Esta decisión está sincronizada con:

- `docker-compose.yml`, que levanta PostgreSQL 18.
- Backend Quarkus con driver `quarkus-jdbc-postgresql`.
- Migraciones Flyway.
- Scripts SQL compatibles con PostgreSQL.
- Persistencia de rutas de evidencias fotográficas en PostgreSQL.
- Timezone oficial `America/Lima`.

No se usará MySQL en este proyecto.

---

# 5. Actores del Sistema

| Actor | Descripción |
|---|---|
| Super Admin | Acceso total al sistema, administración de usuarios, roles, sedes, configuración global, reportes e indicadores. |
| Admin | Administración operativa del sistema, gestión de campañas, equipos, PSR/OSR, averías, catálogos y reportes. |
| Usuario | Responsable del registro operativo de equipos, averías, actualización de estados y evidencias fotográficas desde el aplicativo móvil. |

---

# 6. Roles y Permisos

| ID | Rol | Color | Estado |
|---|---|---|---|
| 1 | Super Admin | Verde | Implementado |
| 2 | Admin | Azul | Implementado |
| 3 | Usuario | Amarillo | Implementado |

---

# 7. Módulos del Sistema

| Código | Módulo | Descripción | Estado Actual |
|---|---|---|---|
| MOD-01 | Autenticación | Login local con selección de perfil, usuario y contraseña + cambio de contraseña obligatorio en primer ingreso | Validado |
| MOD-02 | Usuarios | Administración de usuarios, roles y accesos | Validado |
| MOD-03 | Sedes | Gestión de sedes operativas | Validado |
| MOD-04 | Campañas | Gestión de campañas operativas | Validado |
| MOD-05 | PSR / OSR | Registro y control documental | Pendiente crítico |
| MOD-06 | Equipos | Gestión operativa de equipos alquilados | Pendiente crítico |
| MOD-07 | Tipos de Equipos | Administración de categorías y tipos | Pendiente inmediato |
| MOD-08 | Proveedores | Gestión de proveedores | Pendiente inmediato |
| MOD-09 | Averías | Registro, seguimiento y atención de averías | Pendiente crítico |
| MOD-10 | Evidencias Fotográficas | Gestión de fotografías asociadas | Pendiente |
| MOD-11 | Dashboard KPI | Indicadores operativos | Pendiente |
| MOD-12 | Reportes PDF | Generación y exportación PDF | Pendiente |
| MOD-13 | Auditoría | Trazabilidad de eventos | Pendiente |
| MOD-14 | Catálogos | Datos maestros auxiliares | Parcial |
| MOD-15 | Configuración | Parámetros generales | Pendiente |
| MOD-16 | Mobile App | Aplicación Android operativa | Login local validado / operación pendiente |

---

# 8. Estado Funcional Actual

## Implementado y validado

- Infraestructura Docker.
- PostgreSQL 18.
- Backend Quarkus base.
- Nginx reverse proxy.
- Frontend web base.
- Autenticación local con BCrypt (login por selección de perfil → usuario → contraseña).
- Cambio de contraseña obligatorio en primer ingreso (password por defecto → DNI).
- JWT propio.
- Roles.
- Usuarios (seed local con datos de prueba).
- Sedes.
- Campañas.
- Mobile login local.
- APK inicial validado.
- Menú principal post-login con 5 botones según perfil.

## Pendiente crítico

- Tipos de equipo.
- Proveedores.
- Marcas.
- Equipos.
- PSR / OSR.
- Averías.
- Evidencias fotográficas.
- Reportes PDF.
- Dashboard KPI.
- Auditoría operacional.

---

# 9. Entidades Principales Esperadas

## Implementadas o base existente

- `dim_roles`
- `dim_usuarios`
- `dim_sedes`
- `dim_campanas`

## Pendientes para HDT-002

- `dim_tipos_equipo`
- `dim_proveedores`
- `dim_marcas`
- `fac_psr`
- `fac_osr`
- `fac_equipos`
- `fac_averias`
- `fac_evidencias`
- `auditoria_eventos`

---

# 10. Reglas de Negocio Principales

- El acceso se realiza mediante autenticación local con selección de perfil y usuario.
- El usuario debe estar registrado y activo en la plataforma.
- La contraseña por defecto es "12345" y debe cambiarse en el primer ingreso.
- La nueva contraseña debe ser el número de DNI del usuario.
- Solo una campaña puede estar activa a la vez.
- PSR y OSR se registran manualmente tomando como referencia la información proveniente de NISIRA.
- No existe integración directa con NISIRA.
- Cada equipo debe tener proveedor obligatorio.
- Cada equipo debe tener número de serie único.
- Cada equipo debe tener código interno único.
- Los estados operativos iniciales de equipo son Operativo y Averiado.
- Un equipo con historial no debe eliminarse físicamente.
- Las evidencias fotográficas son obligatorias para ingreso y devolución de equipos.
- Las averías deben registrar fecha/hora de reporte y fecha/hora de atención.
- El tiempo de inactividad se calcula en días calendario.
- La información operacional debe mantener trazabilidad histórica.
- PostgreSQL es la base de datos oficial.

---

# 11. Flujos Operativos Objetivo

1. Login local (seleccionar perfil → seleccionar usuario → ingresar contraseña).
2. Si es primer ingreso (password por defecto), forzar cambio de contraseña (DNI).
3. Validación de usuario autorizado.
4. Menú principal con 5 botones según perfil.
5. Gestión de campaña activa.
6. Registro de PSR.
7. Registro de OSR.
8. Registro de proveedor, marca y tipo de equipo.
9. Registro de equipo.
10. Asociación equipo con PSR/OSR.
11. Registro de evidencias de ingreso.
12. Registro de avería.
13. Atención de avería.
14. Cálculo de tiempo inactivo.
15. Finalización del servicio.
16. Registro de evidencias de devolución.
17. Consulta de historial.
18. Generación de PDF.
19. Visualización de indicadores.

---

# 12. Punto Crítico de Desarrollo

El siguiente punto crítico es HDT-002:

1. Tipos de equipo.
2. Proveedores.
3. Marcas.
4. Equipos.
5. PSR / OSR.
6. Averías.

La implementación debe iniciar por el modelo de datos operativo en PostgreSQL mediante migraciones Flyway.

---

# 13. Consideraciones Técnicas

- Backend: Quarkus Java.
- Base de datos: PostgreSQL 18.
- Persistencia: Hibernate ORM Panache.
- Migraciones: Flyway.
- Seguridad: JWT propio + BCrypt para hash de contraseñas.
- Frontend web: React + Vite + MUI.
- Mobile: Expo React Native.
- Proxy: Nginx.
- Contenedores: Docker Compose.
- Archivos: filesystem controlado con rutas en PostgreSQL.
- Timezone: America/Lima.

---

# 14. Pendientes Funcionales

- Definir y crear tablas operativas del núcleo.
- Implementar CRUD backend para catálogos operativos.
- Implementar pantallas web para catálogos operativos.
- Implementar CRUD de equipos.
- Implementar PSR/OSR.
- Implementar flujo de averías.
- Implementar flujo de evidencias.
- Implementar reportes PDF.
- Implementar dashboard KPI.
- Implementar auditoría operacional.
- Implementar pantallas operativas mobile.

---

# 15. Cierre

Este documento queda sincronizado con el estado actual del repositorio y establece PostgreSQL 18 como base de datos oficial del sistema.
