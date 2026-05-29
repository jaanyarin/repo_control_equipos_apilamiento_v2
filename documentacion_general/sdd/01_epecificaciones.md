# SOFTWARE SPECIFICATION DOCUMENT
# Sistema de Control de Equipos de Apilamiento

# Tabla de Contenido

- [1. Información General](#1-información-general)
- [2. Objetivo del Sistema](#2-objetivo-del-sistema)
- [3. Alcance del Sistema](#3-alcance-del-sistema)
- [4. Problemática Actual](#4-problemática-actual)
- [5. Actores del Sistema](#5-actores-del-sistema)
- [6. Roles y Permisos](#6-roles-y-permisos)
- [7. Módulos del Sistema](#7-módulos-del-sistema)
- [8. Requerimientos Funcionales](#8-requerimientos-funcionales)
- [9. Reglas de Negocio](#9-reglas-de-negocio)
- [10. Requerimientos No Funcionales](#10-requerimientos-no-funcionales)
- [11. Entidades Principales](#11-entidades-principales)
- [12. Flujos Operativos](#12-flujos-operativos)
- [13. Reportes](#13-reportes)
- [14. Consideraciones Técnicas](#14-consideraciones-técnicas)
- [15. Pendientes Funcionales](#15-pendientes-funcionales)
- [16. Anexos](#16-anexos)



# 1. Información General

| Campo | Detalle |
| Proyecto | Sistema de Control de Equipos de Apilamiento |
| Tipo de Sistema | Plataforma Full Stack Empresarial |
| Plataforma | Web (SPA) + Android (futuro) |
| Versión Documento | 1.2 |
| Estado | En desarrollo |
| Fecha | 2026-05-27 |
| Responsable | Jose Anyarin |



# 2. OBJETIVO DEL SISTEMA

## 2.1 Objetivo General

Desarrollar una plataforma digital empresarial para el control operativo de equipos de apilamiento alquilados, permitiendo gestionar el ciclo completo de solicitud, asignación, operación, averías, devoluciones y evidencias fotográficas, garantizando trazabilidad, control de tiempos de inactividad y soporte documental para la validación operacional y financiera del servicio.



## 2.2 Objetivos Específicos

- Centralizar el registro operativo de equipos alquilados.
- Controlar la entrega y devolución de equipos mediante evidencias fotográficas.
- Registrar y monitorear averías operativas.
- Calcular automáticamente tiempos de inactividad.
- Reducir sobrecostos asociados a sobre-uso y averías.
- Mantener trazabilidad histórica de cada equipo.
- Permitir consulta y emisión de reportes operativos.
- Facilitar la supervisión y auditoría de equipos alquilados.
- Digitalizar procesos manuales actualmente gestionados en Excel.



# 3. ALCANCE DEL SISTEMA

## 3.1 Incluye

- Aplicativo móvil Android para operación en campo.
- Plataforma web para visualización y gestión administrativa.
- Gestión de usuarios y autenticación mediante cuenta Microsoft corporativa.
- Gestión de roles y permisos.
- Gestión multi-sede operativa.
- Registro manual de PSR y OSR.
- Gestión de campañas operativas.
- Registro de equipos alquilados.
- Gestión de múltiples tipos de equipos.
- Registro de accesorios y componentes asociados.
- Registro y gestión de averías.
- Control de estados operativos de equipos.
- Registro de evidencias fotográficas.
- Generación de reportes PDF.
- Dashboard web con indicadores operativos.
- Gestión de proveedores.
- Gestión de marcas y catálogos.
- Historial operativo de equipos.
- Auditoría y trazabilidad de operaciones mediante autenticación y registros de actividad.
- Validaciones operativas en tiempo real.
- Mensajes visuales de confirmación, validación y error durante las operaciones ejecutadas por el usuario.



## 3.2 No Incluye

- Integración con NISIRA.
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



# 4. PROBLEMÁTICA ACTUAL

## 4.1 Situación Actual

Actualmente el control operativo de equipos de apilamiento alquilados se realiza mediante procesos manuales y registros dispersos en archivos Excel, lo que genera limitaciones en la trazabilidad, control operativo y validación de información relacionada con el uso de equipos.

No existe una plataforma centralizada que permita gestionar el ciclo completo de los equipos, desde la generación de solicitudes PSR/OSR hasta la entrega, operación, averías y devolución final.

La gestión actual presenta dificultades para controlar:

- tiempos reales de uso,
- tiempos de inactividad,
- evidencias fotográficas,
- historial de averías,
- validación de responsabilidades,
- control documental,
- indicadores operativos.

Esto ocasiona riesgos operativos, pagos indebidos por sobre-uso, dificultades de auditoría y baja capacidad de análisis para la toma de decisiones.



## 4.2 Problemas Identificados

| Código | Problema |
|||
| PRB-001 | No existe trazabilidad centralizada de equipos alquilados |
| PRB-002 | No existe control estructurado de averías |
| PRB-003 | No existe validación visual documentada mediante evidencias |
| PRB-004 | Existen riesgos de pagos indebidos por tiempos inactivos |
| PRB-005 | El proceso depende de archivos Excel manuales |
| PRB-006 | No existen indicadores operativos centralizados |
| PRB-007 | No existe historial operacional consolidado por equipo |
| PRB-008 | No existe control estructurado de responsabilidades operativas |

# 5. Actores del Sistema

| Actor | Descripción |
|---|---|---|
| Super Administrador | Acceso total al sistema, administración de usuarios, roles, configuración global, reportes e indicadores |
| Administrador | Administración operativa del sistema, gestión de campañas, equipos, PSR/OSR, averías y reportes |
| Usuario | Responsable del registro operativo de equipos, averías, actualización de estados y evidencias fotográficas desde el aplicativo móvil |

# 6. Roles y Permisos

| ID | Rol | Color | Descripción |
|---|---|---|---|
| 1 | Super Admin | Verde | Acceso total al sistema, incluyendo gestión de usuarios, roles, sedes y configuración global |
| 2 | Admin | Azul | Administración operativa del sistema, catálogos, campañas, reportes y dashboard |
| 3 | Usuario | Amarillo | Acceso operativo para registro de equipos, averías, evidencias fotográficas y actualización de estados |

# 7. Módulos del Sistema

| Código | Módulo | Descripción |
|---|---|---|
| MOD-01 | Autenticación | Gestión de autenticación mediante cuenta Microsoft corporativa y control de sesiones |
| MOD-02 | Usuarios | Administración de usuarios, roles y accesos al sistema |
| MOD-03 | Sedes | Gestión de sedes operativas como Packing Uva y Packing Arándano |
| MOD-04 | Campañas | Gestión de campañas operativas |
| MOD-05 | PSR / OSR | Registro y control documental de solicitudes operativas |
| MOD-06 | Equipos | Gestión operativa de equipos alquilados |
| MOD-07 | Tipos de Equipos | Administración de categorías y tipos de equipos |
| MOD-08 | Proveedores | Gestión de proveedores asociados a equipos |
| MOD-09 | Averías | Registro, seguimiento y control de averías operativas |
| MOD-10 | Evidencias Fotográficas | Gestión de fotografías asociadas a operaciones y averías |
| MOD-11 | Dashboard KPI | Visualización de indicadores y métricas operativas |
| MOD-12 | Reportes PDF | Generación y exportación de reportes operativos en PDF |
| MOD-13 | Auditoría | Registro de trazabilidad y actividad operacional del sistema |
| MOD-14 | Catálogos | Administración de datos maestros y configuraciones auxiliares |
| MOD-15 | Configuración | Configuración general del sistema |
| MOD-16 | Mobile App | Aplicación móvil Android para autenticación y operación en campo |

# 8. REQUERIMIENTOS FUNCIONALES

# MOD-01 — AUTENTICACIÓN

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-001 | Autenticación | Inicio de sesión Microsoft | El sistema deberá permitir el inicio de sesión únicamente mediante cuentas Microsoft corporativas pertenecientes al dominio empresarial autorizado | Usuario, Administrador | Alta |
| RF-002 | Autenticación | Validación de dominio corporativo | El sistema deberá validar que la cuenta autenticada pertenezca al dominio corporativo autorizado antes de permitir el acceso | Usuario, Administrador | Alta |
| RF-003 | Autenticación | Validación de usuario registrado | El sistema deberá permitir el acceso únicamente a usuarios previamente registrados y habilitados en la base de datos interna del sistema | Usuario, Administrador | Alta |
| RF-004 | Autenticación | Validación de usuario activo | El sistema deberá validar que el usuario se encuentre en estado activo dentro del sistema antes de autorizar el acceso | Usuario, Administrador | Alta |
| RF-005 | Autenticación | Validación de estado Microsoft | El sistema deberá validar que la cuenta corporativa del usuario se encuentre habilitada dentro del entorno Microsoft empresarial | Usuario, Administrador | Alta |
| RF-006 | Autenticación | Asignación de roles | El sistema deberá recuperar y aplicar el rol asignado al usuario autenticado para controlar el acceso a funcionalidades y módulos | Usuario, Administrador | Alta |
| RF-007 | Autenticación | Persistencia de sesión | El sistema deberá mantener la sesión activa mediante mecanismos seguros de autenticación mientras el token de sesión permanezca vigente | Usuario, Administrador | Alta |
| RF-008 | Autenticación | Recuperación automática de sesión | El sistema deberá permitir la recuperación automática de sesión sin requerir nuevo inicio de sesión mientras las credenciales de autenticación continúen vigentes | Usuario, Administrador | Media |
| RF-009 | Autenticación | Expiración de sesión | El sistema deberá cerrar automáticamente la sesión del usuario después de un periodo configurable de inactividad | Usuario, Administrador | Alta |
| RF-010 | Autenticación | Cierre manual de sesión | El sistema deberá permitir al usuario cerrar sesión manualmente desde la aplicación móvil y plataforma web | Usuario, Administrador | Alta |
| RF-011 | Autenticación | Registro de auditoría de acceso | El sistema deberá registrar eventos de autenticación incluyendo inicio de sesión, cierre de sesión, fecha, hora y usuario asociado | Usuario, Administrador | Alta |
| RF-012 | Autenticación | Acceso multi-dispositivo | El sistema deberá permitir que un usuario autenticado pueda acceder desde múltiples dispositivos simultáneamente | Usuario, Administrador | Media |
| RF-013 | Autenticación | Bloqueo de acceso no autorizado | El sistema deberá denegar el acceso a usuarios no registrados, inactivos o sin permisos asignados | Usuario, Administrador | Alta |
| RF-014 | Autenticación | Administración de usuarios | El sistema deberá permitir al administrador registrar, habilitar, deshabilitar y actualizar usuarios autorizados | Administrador | Alta |
| RF-015 | Autenticación | Administración de roles | El sistema deberá permitir al administrador asignar y modificar roles de usuario dentro del sistema | Administrador | Alta |
| RF-016 | Autenticación | Control de permisos por rol | El sistema deberá restringir el acceso a funcionalidades y módulos según el rol asignado al usuario autenticado | Usuario, Administrador | Alta |
| RF-017 | Autenticación | Mensajes de validación de acceso | El sistema deberá mostrar mensajes visuales de confirmación o error durante el proceso de autenticación y validación de acceso | Usuario, Administrador | Media |
| RF-018 | Autenticación | Seguridad de tokens | El sistema deberá utilizar mecanismos seguros de autenticación basados en tokens para proteger las sesiones activas | Usuario, Administrador | Alta |
| RF-019 | Autenticación | Validación de sede asignada | El sistema deberá validar que el usuario autenticado tenga al menos una sede operativa asignada antes de permitir el acceso al sistema | Usuario, Administrador | Alta |
| RF-020 | Autenticación | Sincronización de información corporativa | El sistema deberá sincronizar información básica del usuario autenticado desde Microsoft corporativo, incluyendo nombre y correo electrónico | Usuario, Administrador | Media |
| RF-021 | Autenticación | Registro de intentos fallidos | El sistema deberá registrar intentos fallidos de autenticación para fines de auditoría y seguridad | Usuario, Administrador | Media |
| RF-022 | Autenticación | Restricción de navegación por rol | El sistema deberá mostrar únicamente las funcionalidades autorizadas según el rol asignado al usuario autenticado | Usuario, Administrador | Alta |
| RF-023 | Autenticación | Revocación inmediata de acceso | El sistema deberá invalidar sesiones activas cuando un usuario sea deshabilitado por un administrador | Administrador | Alta |

# MOD-16 — MOBILE APP

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-240 | Mobile App | Inicio de sesión Microsoft | La aplicación móvil deberá permitir el inicio de sesión mediante cuenta Microsoft corporativa usando WebBrowser nativo y flujo OIDC | Usuario, Administrador | Alta |
| RF-241 | Mobile App | Pantalla de ingreso exitoso | La aplicación móvil deberá mostrar un mensaje "Ingresaste de forma correcta" junto con el nombre del usuario autenticado | Usuario, Administrador | Alta |
| RF-242 | Mobile App | Persistencia de sesión móvil | La aplicación móvil deberá almacenar el token JWT de forma segura usando SecureStore para mantener la sesión entre reinicios de la aplicación | Usuario, Administrador | Alta |
| RF-243 | Mobile App | Cierre de sesión móvil | La aplicación móvil deberá permitir al usuario cerrar sesión manualmente, eliminando el token almacenado y mostrando la pantalla de inicio de sesión | Usuario, Administrador | Alta |
| RF-244 | Mobile App | Configuración de URL de API | La aplicación móvil deberá permitir configurar la URL del backend mediante la variable de entorno EXPO_PUBLIC_API_URL sin modificar código fuente | Desarrollador | Alta |
| RF-245 | Mobile App | Recuperación automática de sesión | La aplicación móvil deberá verificar la existencia de un token válido al iniciar y mostrar la pantalla de ingreso exitoso si el usuario ya está autenticado | Usuario, Administrador | Media |

# MOD-02 — USUARIOS

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-024 | Usuarios | Registro de usuarios | El sistema deberá permitir al administrador registrar usuarios autorizados para el acceso al sistema | Administrador | Alta |
| RF-025 | Usuarios | Actualización de usuarios | El sistema deberá permitir al administrador actualizar información asociada a usuarios registrados | Administrador | Alta |
| RF-026 | Usuarios | Eliminación de usuarios | El sistema deberá permitir eliminar físicamente usuarios del sistema, eliminando todos sus registros de la base de datos | Administrador | Alta |
| RF-027 | Usuarios | Reactivación de usuarios | ❌ No aplica — los usuarios se eliminan físicamente, no se desactivan | Administrador | Media |
| RF-028 | Usuarios | Asignación de roles | El sistema deberá permitir asignar roles operativos a usuarios registrados | Administrador | Alta |
| RF-029 | Usuarios | Modificación de roles | El sistema deberá permitir modificar roles asignados a usuarios existentes | Administrador | Alta |
| RF-030 | Usuarios | Asignación de sede | El sistema deberá permitir asignar una sede operativa a cada usuario registrado | Administrador | Alta |
| RF-031 | Usuarios | Cambio de sede operativa | El sistema deberá permitir modificar la sede asignada a un usuario registrado | Administrador | Media |
| RF-032 | Usuarios | Visualización de información corporativa | El sistema deberá mostrar información corporativa sincronizada desde Microsoft incluyendo nombre, correo, puesto, área, empresa, departamento y ubicación de trabajo | Administrador | Alta |
| RF-033 | Usuarios | Sincronización de información Microsoft | El sistema deberá sincronizar información corporativa del usuario desde Microsoft corporativo | Administrador | Alta |
| RF-034 | Usuarios | Edición de información local | El sistema deberá permitir editar información administrativa local asociada al usuario | Administrador | Media |
| RF-035 | Usuarios | Consulta de usuarios | El sistema deberá permitir visualizar el listado de usuarios registrados | Administrador | Alta |
| RF-036 | Usuarios | Búsqueda de usuarios | El sistema deberá permitir realizar búsquedas de usuarios mediante filtros de texto | Administrador | Alta |
| RF-037 | Usuarios | Filtro por sede | El sistema deberá permitir filtrar usuarios por sede operativa | Administrador | Media |
| RF-038 | Usuarios | Filtro por rol | El sistema deberá permitir filtrar usuarios según el rol asignado | Administrador | Media |
| RF-039 | Usuarios | Visualización de último acceso | El sistema deberá mostrar la fecha y hora del último acceso realizado por cada usuario | Administrador | Media |
| RF-040 | Usuarios | Registro de fecha de creación | El sistema deberá almacenar la fecha y hora de creación de cada usuario registrado | Administrador | Alta |
| RF-041 | Usuarios | Historial de cambios de usuario | El sistema deberá registrar cambios realizados sobre información de usuarios para fines de auditoría | Administrador | Alta |
| RF-042 | Usuarios | Visualización de estado de usuario | El sistema deberá mostrar el estado actual del usuario como activo o inactivo | Administrador | Media |
| RF-043 | Usuarios | Validación de usuarios duplicados | El sistema deberá impedir el registro de usuarios con el mismo correo corporativo ya existente en el sistema | Administrador | Alta |
| RF-044 | Usuarios | Validación de rol asignado | El sistema deberá requerir que todo usuario tenga un rol asignado antes de habilitar su acceso | Administrador | Alta |
| RF-045 | Usuarios | Validación de sede asignada | El sistema deberá requerir que todo usuario tenga una sede operativa asignada antes de habilitar su acceso | Administrador | Alta |
| RF-046 | Usuarios | Validación de existencia corporativa | El sistema deberá validar que el usuario registrado exista dentro del entorno corporativo Microsoft antes de habilitar su acceso | Administrador | Alta |
| RF-046.1 | Usuarios | Búsqueda de correos en Microsoft Graph | El sistema deberá permitir buscar y autocompletar correos electrónicos del tenant Microsoft mientras el administrador escribe en el campo de correo durante la creación de usuarios | Administrador | Alta |
| RF-046.2 | Usuarios | Normalización de correo a minúsculas | El sistema deberá normalizar automáticamente los correos electrónicos a minúsculas tanto al crear usuarios como al buscar en el tenant, para evitar duplicados por diferencias de mayúsculas/minúsculas | Administrador | Alta |
| RF-046.3 | Usuarios | Prioridad de userPrincipalName sobre mail | El sistema deberá usar el campo userPrincipalName de Microsoft Graph como fuente primaria de correo durante el inicio de sesión, usando mail como fallback, para garantizar compatibilidad con usuarios cuyo mail use dominio onmicrosoft.com | Sistema | Alta |
| RF-047 | Usuarios | Consulta de detalle de usuario | El sistema deberá permitir visualizar el detalle completo de información asociada a un usuario registrado | Administrador | Media |
| RF-048 | Usuarios | Ordenamiento de usuarios | El sistema deberá permitir ordenar el listado de usuarios por nombre, sede, rol o estado | Administrador | Baja |
| RF-049 | Usuarios | Restricción de acceso por estado | El sistema deberá impedir el acceso de usuarios que se encuentren en estado inactivo | Administrador | Alta |
| RF-050 | Usuarios | Visualización de rol asignado | El sistema deberá mostrar el rol operativo asignado a cada usuario dentro del módulo de administración | Administrador | Media |
| RF-051 | Usuarios | Visualización de sede asignada | El sistema deberá mostrar la sede operativa asociada a cada usuario registrado | Administrador | Media |
| RF-052 | Usuarios | Mensajes de validación administrativa | El sistema deberá mostrar mensajes visuales de confirmación y error durante las operaciones administrativas de usuarios | Administrador | Media |

# MOD-03 — SEDES

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-053 | Sedes | Registro de sedes | El sistema deberá permitir registrar nuevas sedes operativas dentro de la plataforma | Administrador | Alta |
| RF-054 | Sedes | Actualización de sedes | El sistema deberá permitir actualizar información asociada a sedes registradas | Administrador | Alta |
| RF-055 | Sedes | Visualización de sedes | El sistema deberá permitir visualizar el listado de sedes registradas | Administrador | Alta |
| RF-056 | Sedes | Búsqueda de sedes | El sistema deberá permitir realizar búsquedas de sedes mediante filtros de texto | Administrador | Media |
| RF-057 | Sedes | Ordenamiento de sedes | El sistema deberá permitir ordenar sedes por nombre o código operativo | Administrador | Baja |
| RF-058 | Sedes | Registro de código operativo | El sistema deberá permitir asignar un código único a cada sede registrada | Administrador | Alta |
| RF-059 | Sedes | Validación de código único | El sistema deberá impedir el registro de sedes con códigos operativos duplicados | Administrador | Alta |
| RF-060 | Sedes | Validación de nombre único | El sistema deberá impedir el registro de sedes con nombres duplicados | Administrador | Alta |
| RF-061 | Sedes | Eliminación de sedes | El sistema deberá permitir eliminar físicamente sedes operativas que no tengan registros asociados | Administrador | Media |
| RF-062 | Sedes | Restricción de eliminación | El sistema deberá impedir la eliminación física de sedes que tengan registros operativos asociados | Administrador | Alta |
| RF-063 | Sedes | Filtro global por sede | El sistema deberá permitir filtrar información operativa global mediante sede | Usuario, Administrador | Alta |
| RF-064 | Sedes | Visualización en dashboard | El sistema deberá permitir visualizar indicadores y métricas filtradas por sede operativa | Usuario, Administrador | Alta |
| RF-065 | Sedes | Inclusión de sede en reportes PDF | El sistema deberá incluir la sede operativa asociada dentro de los reportes PDF generados | Usuario, Administrador | Media |
| RF-066 | Sedes | Registro de sede en auditoría | El sistema deberá registrar la sede operativa asociada dentro de los eventos de auditoría | Usuario, Administrador | Alta |
| RF-067 | Sedes | Visualización de usuarios asociados | El sistema deberá mostrar la cantidad de usuarios asociados a cada sede | Administrador | Media |
| RF-068 | Sedes | Visualización de campañas asociadas | El sistema deberá mostrar las campañas relacionadas a cada sede operativa | Administrador | Media |
| RF-069 | Sedes | Historial de modificaciones | El sistema deberá registrar cambios realizados sobre la información de sedes para fines de auditoría | Administrador | Alta |
| RF-070 | Sedes | Configuración de periodo operativo | El sistema deberá permitir configurar periodos operativos referenciales para cada sede | Administrador | Baja |
| RF-071 | Sedes | Visualización de estado de sede | El sistema deberá mostrar el estado actual de cada sede como activa o inactiva | Administrador | Media |
| RF-072 | Sedes | Mensajes de validación administrativa | El sistema deberá mostrar mensajes visuales de confirmación y error durante las operaciones administrativas de sedes | Administrador | Media |

# MOD-04 — CAMPAÑAS

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-073 | Campañas | Registro de campañas | El sistema deberá permitir registrar nuevas campañas operativas dentro de la plataforma | Administrador | Alta |
| RF-074 | Campañas | Actualización de campañas | El sistema deberá permitir actualizar información asociada a campañas registradas | Administrador | Alta |
| RF-075 | Campañas | Visualización de campañas | El sistema deberá permitir visualizar el listado de campañas registradas | Usuario, Administrador | Alta |
| RF-076 | Campañas | Búsqueda de campañas | El sistema deberá permitir realizar búsquedas de campañas mediante filtros de texto | Usuario, Administrador | Media |
| RF-077 | Campañas | Ordenamiento de campañas | El sistema deberá permitir ordenar campañas por nombre, código o estado operativo | Usuario, Administrador | Baja |
| RF-078 | Campañas | Registro de código operativo | El sistema deberá permitir asignar un código único a cada campaña registrada | Administrador | Alta |
| RF-079 | Campañas | Validación de código único | El sistema deberá impedir el registro de campañas con códigos duplicados | Administrador | Alta |
| RF-080 | Campañas | Validación de nombre único | El sistema deberá impedir el registro de campañas con nombres duplicados | Administrador | Alta |
| RF-081 | Campañas | Estado de campaña | El sistema deberá permitir administrar el estado operativo de una campaña como activa o cerrada | Administrador | Alta |
| RF-082 | Campañas | Validación de campaña activa única | El sistema deberá permitir únicamente una campaña activa dentro de la plataforma | Administrador | Alta |
| RF-083 | Campañas | Asignación automática de campaña actual | El sistema deberá asociar automáticamente la campaña activa a los nuevos registros operativos | Usuario, Administrador | Alta |
| RF-084 | Campañas | Restricción de operaciones en campañas cerradas | El sistema deberá impedir el registro de nuevas operaciones sobre campañas cerradas | Usuario, Administrador | Alta |
| RF-085 | Campañas | Eliminación de campañas | El sistema deberá permitir eliminar físicamente campañas operativas que no tengan registros asociados | Administrador | Alta |
| RF-086 | Campañas | Activación manual de campaña | El sistema deberá permitir activar manualmente una campaña operativa | Administrador | Alta |
| RF-087 | Campañas | Cierre manual de campaña | El sistema deberá permitir cerrar manualmente campañas operativas para mantener historial histórico | Administrador | Alta |
| RF-088 | Campañas | Asociación de equipos a campaña | El sistema deberá permitir asociar equipos operativos a campañas activas | Administrador | Alta |
| RF-089 | Campañas | Asociación de equipos históricos | El sistema deberá permitir asociar equipos previamente registrados a nuevas campañas operativas | Administrador | Media |
| RF-090 | Campañas | Asociación de PSR/OSR a campaña | El sistema deberá asociar registros PSR y OSR a la campaña activa correspondiente | Usuario, Administrador | Alta |
| RF-091 | Campañas | Visualización de campaña activa | El sistema deberá mostrar visualmente la campaña activa actual dentro de la plataforma | Usuario, Administrador | Media |
| RF-092 | Campañas | Visualización de estado de campaña | El sistema deberá mostrar el estado actual de cada campaña como activa o cerrada | Usuario, Administrador | Media |
| RF-093 | Campañas | Historial de modificaciones | El sistema deberá registrar cambios realizados sobre campañas para fines de auditoría | Administrador | Alta |
| RF-094 | Campañas | Filtro global por campaña | El sistema deberá permitir filtrar información operativa global mediante campaña | Usuario, Administrador | Alta |
| RF-095 | Campañas | Visualización de indicadores por campaña | El sistema deberá permitir visualizar indicadores y métricas asociadas a campañas operativas | Usuario, Administrador | Alta |
| RF-096 | Campañas | Inclusión de campaña en reportes PDF | El sistema deberá incluir la campaña operativa asociada dentro de los reportes PDF generados | Usuario, Administrador | Media |
| RF-097 | Campañas | Registro de campaña en auditoría | El sistema deberá registrar la campaña operativa asociada dentro de los eventos de auditoría | Usuario, Administrador | Alta |
| RF-098 | Campañas | Visualización de campañas activas e históricas | El sistema deberá permitir visualizar campañas activas e históricas dentro del sistema | Usuario, Administrador | Media |
| RF-099 | Campañas | Mensajes de validación administrativa | El sistema deberá mostrar mensajes visuales de confirmación y error durante las operaciones administrativas de campañas | Administrador | Media |

# MOD-05 — PSR / OSR

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-100 | PSR / OSR | Registro de PSR | El sistema deberá permitir registrar pedidos de servicio de requerimiento (PSR) dentro de la campaña activa | Administrador | Alta |
| RF-101 | PSR / OSR | Actualización de PSR | El sistema deberá permitir actualizar información asociada a registros PSR | Administrador | Alta |
| RF-102 | PSR / OSR | Eliminación de PSR | El sistema deberá permitir eliminar registros PSR que no tengan información operativa dependiente | Administrador | Media |
| RF-103 | PSR / OSR | Registro de OSR | El sistema deberá permitir registrar órdenes de servicio de requerimiento (OSR) asociadas a un PSR existente | Administrador | Alta |
| RF-104 | PSR / OSR | Actualización de OSR | El sistema deberá permitir actualizar información asociada a registros OSR | Administrador | Alta |
| RF-105 | PSR / OSR | Eliminación de OSR | El sistema deberá permitir eliminar registros OSR que no tengan operaciones dependientes | Administrador | Media |
| RF-106 | PSR / OSR | Visualización de registros documentales | El sistema deberá permitir visualizar el listado de registros PSR y OSR registrados | Usuario, Administrador | Alta |
| RF-107 | PSR / OSR | Consulta de detalle documental | El sistema deberá permitir visualizar el detalle completo de registros PSR y OSR asociados | Usuario, Administrador | Alta |
| RF-108 | PSR / OSR | Búsqueda documental | El sistema deberá permitir realizar búsquedas de registros PSR y OSR mediante filtros operativos y documentales | Usuario, Administrador | Alta |
| RF-109 | PSR / OSR | Ordenamiento documental | El sistema deberá permitir ordenar registros PSR y OSR por número, campaña o fecha de registro | Usuario, Administrador | Baja |
| RF-110 | PSR / OSR | Validación de número PSR único | El sistema deberá impedir el registro de números PSR duplicados dentro de la plataforma | Administrador | Alta |
| RF-111 | PSR / OSR | Validación de número OSR único | El sistema deberá impedir el registro de números OSR duplicados dentro de la plataforma | Administrador | Alta |
| RF-112 | PSR / OSR | Relación obligatoria OSR-PSR | El sistema deberá requerir que todo registro OSR esté asociado obligatoriamente a un PSR existente | Administrador | Alta |
| RF-113 | PSR / OSR | Asociación obligatoria a campaña activa | El sistema deberá asociar obligatoriamente los registros PSR y OSR a la campaña activa | Administrador | Alta |
| RF-114 | PSR / OSR | Restricción de equipo único | El sistema deberá permitir asociar únicamente un equipo por cada registro OSR | Administrador | Alta |
| RF-115 | PSR / OSR | Restricción de reutilización simultánea | El sistema deberá impedir asociar un equipo a múltiples registros OSR activos simultáneamente | Administrador | Alta |
| RF-116 | PSR / OSR | Asociación de equipo a OSR | El sistema deberá permitir asociar un equipo operativo a registros OSR | Administrador | Alta |
| RF-117 | PSR / OSR | Visualización de relación documental | El sistema deberá visualizar la relación existente entre registros PSR y OSR asociados | Usuario, Administrador | Media |
| RF-118 | PSR / OSR | Historial documental | El sistema deberá permitir visualizar el historial de registros PSR y OSR generados históricamente | Usuario, Administrador | Media |
| RF-119 | PSR / OSR | Registro de observaciones | El sistema deberá permitir registrar observaciones asociadas a registros PSR y OSR | Usuario, Administrador | Media |
| RF-120 | PSR / OSR | Generación de PDF documental | El sistema deberá permitir generar reportes PDF asociados a registros PSR y OSR | Usuario, Administrador | Media |
| RF-121 | PSR / OSR | Auditoría documental | El sistema deberá registrar eventos de creación, actualización y eliminación de registros PSR y OSR | Usuario, Administrador | Alta |
| RF-122 | PSR / OSR | Filtro global documental | El sistema deberá permitir filtrar registros PSR y OSR mediante criterios operativos y documentales | Usuario, Administrador | Alta |
| RF-123 | PSR / OSR | Inclusión de campaña en registros documentales | El sistema deberá mostrar la campaña operativa asociada en registros PSR y OSR | Usuario, Administrador | Media |
| RF-124 | PSR / OSR | Mensajes de validación documental | El sistema deberá mostrar mensajes visuales de confirmación y error durante las operaciones de PSR y OSR | Usuario, Administrador | Media |

# MOD-06 — EQUIPOS

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-125 | Equipos | Registro de equipos | El sistema deberá permitir registrar equipos operativos asociados a un registro OSR | Administrador | Alta |
| RF-126 | Equipos | Actualización de equipos | El sistema deberá permitir actualizar información asociada a equipos registrados | Administrador | Alta |
| RF-127 | Equipos | Desactivación de equipos | El sistema deberá permitir desactivar equipos manteniendo su historial operativo | Administrador | Media |
| RF-128 | Equipos | Visualización de equipos | El sistema deberá permitir visualizar el listado de equipos registrados | Usuario, Administrador | Alta |
| RF-129 | Equipos | Consulta de detalle de equipo | El sistema deberá permitir visualizar el detalle completo de un equipo operativo | Usuario, Administrador | Alta |
| RF-130 | Equipos | Búsqueda de equipos | El sistema deberá permitir realizar búsquedas de equipos mediante filtros operativos | Usuario, Administrador | Alta |
| RF-131 | Equipos | Filtrado de equipos | El sistema deberá permitir filtrar equipos por campaña, proveedor, tipo y estado operativo | Usuario, Administrador | Alta |
| RF-132 | Equipos | Ordenamiento de equipos | El sistema deberá permitir ordenar equipos mediante criterios operativos y documentales | Usuario, Administrador | Baja |
| RF-133 | Equipos | Registro de código interno | El sistema deberá permitir asignar un código interno único a cada equipo registrado | Administrador | Alta |
| RF-134 | Equipos | Registro de número de serie | El sistema deberá permitir registrar un número de serie único para cada equipo | Administrador | Alta |
| RF-135 | Equipos | Validación de serie única | El sistema deberá impedir el registro de equipos con números de serie duplicados | Administrador | Alta |
| RF-136 | Equipos | Relación obligatoria con OSR | El sistema deberá requerir que todo equipo registrado esté asociado obligatoriamente a un registro OSR | Administrador | Alta |
| RF-137 | Equipos | Asociación de proveedor | El sistema deberá permitir asociar obligatoriamente un proveedor a cada equipo registrado | Administrador | Alta |
| RF-138 | Equipos | Restricción de cambio de proveedor | El sistema no deberá permitir modificar el proveedor asociado a un equipo registrado | Administrador | Alta |
| RF-139 | Equipos | Asociación de tipo de equipo | El sistema deberá permitir asociar un tipo de equipo a cada equipo registrado | Administrador | Alta |
| RF-140 | Equipos | Registro de marca y modelo | El sistema deberá permitir registrar marca y modelo asociados al equipo | Administrador | Alta |
| RF-141 | Equipos | Registro de fechas operativas | El sistema deberá permitir registrar fechas de ingreso y devolución operativa de equipos | Administrador | Alta |
| RF-142 | Equipos | Estado operativo del equipo | El sistema deberá permitir administrar el estado operativo del equipo como operativo o averiado | Usuario, Administrador | Alta |
| RF-143 | Equipos | Visualización de estado operativo | El sistema deberá mostrar el estado operativo actual del equipo | Usuario, Administrador | Media |
| RF-144 | Equipos | Restricción de eliminación física | El sistema no deberá permitir la eliminación física de equipos registrados | Administrador | Alta |
| RF-145 | Equipos | Historial de campañas asociadas | El sistema deberá mantener el historial de campañas asociadas a cada equipo | Usuario, Administrador | Alta |
| RF-146 | Equipos | Historial operacional | El sistema deberá visualizar el historial operativo completo del equipo incluyendo PSR, OSR, averías y campañas asociadas | Usuario, Administrador | Alta |
| RF-147 | Equipos | Historial de averías | El sistema deberá visualizar el historial de averías registradas para cada equipo | Usuario, Administrador | Media |
| RF-148 | Equipos | Reutilización entre campañas | El sistema deberá permitir reutilizar equipos registrados en nuevas campañas operativas | Administrador | Media |
| RF-149 | Equipos | Restricción de asociación simultánea | El sistema deberá impedir asociar un equipo simultáneamente a múltiples registros OSR activos | Administrador | Alta |
| RF-150 | Equipos | Registro de observaciones | El sistema deberá permitir registrar observaciones asociadas a equipos operativos | Usuario, Administrador | Media |
| RF-151 | Equipos | Gestión de fotografías | El sistema deberá permitir registrar fotografías asociadas a equipos operativos | Usuario, Administrador | Media |
| RF-152 | Equipos | Gestión de múltiples fotografías | El sistema deberá permitir registrar múltiples fotografías asociadas a un equipo | Usuario, Administrador | Media |
| RF-153 | Equipos | Registro de devolución | El sistema deberá permitir registrar la devolución operativa del equipo al proveedor | Administrador | Media |
| RF-154 | Equipos | Desactivación lógica | El sistema deberá permitir desactivar equipos sin eliminar su información histórica | Administrador | Media |
| RF-155 | Equipos | Generación de PDF operativo | El sistema deberá permitir generar reportes PDF asociados a equipos registrados | Usuario, Administrador | Media |
| RF-156 | Equipos | Indicadores operativos de equipos | El sistema deberá permitir visualizar indicadores asociados a equipos operativos | Usuario, Administrador | Alta |
| RF-157 | Equipos | Dashboard filtrado por equipos | El sistema deberá permitir filtrar indicadores operativos mediante equipos registrados | Usuario, Administrador | Alta |
| RF-158 | Equipos | Auditoría de equipos | El sistema deberá registrar eventos de creación, actualización y desactivación de equipos | Usuario, Administrador | Alta |
| RF-159 | Equipos | Mensajes de validación operativa | El sistema deberá mostrar mensajes visuales de confirmación y error durante operaciones relacionadas a equipos | Usuario, Administrador | Media |

# MOD-07 — TIPOS DE EQUIPOS

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-160 | Tipos de Equipos | Registro de tipos de equipo | El sistema deberá permitir registrar tipos de equipos operativos | Administrador | Alta |
| RF-161 | Tipos de Equipos | Actualización de tipos | El sistema deberá permitir actualizar información de tipos de equipos | Administrador | Alta |
| RF-162 | Tipos de Equipos | Visualización de tipos | El sistema deberá permitir visualizar tipos de equipos registrados | Usuario, Administrador | Alta |
| RF-163 | Tipos de Equipos | Búsqueda de tipos | El sistema deberá permitir realizar búsquedas por nombre o código | Usuario, Administrador | Media |
| RF-164 | Tipos de Equipos | Código único | El sistema deberá validar códigos únicos por tipo de equipo | Administrador | Alta |
| RF-165 | Tipos de Equipos | Estado operativo | El sistema deberá permitir activar o desactivar tipos de equipos | Administrador | Media |
| RF-166 | Tipos de Equipos | Asociación a equipos | El sistema deberá permitir asociar tipos a equipos registrados | Administrador | Alta |
| RF-167 | Tipos de Equipos | Restricción de eliminación | El sistema no deberá permitir eliminar tipos asociados a equipos | Administrador | Alta |
| RF-168 | Tipos de Equipos | Auditoría de tipos | El sistema deberá registrar cambios realizados sobre tipos de equipos | Administrador | Alta |
| RF-169 | Tipos de Equipos | Mensajes operativos | El sistema deberá mostrar mensajes visuales durante operaciones administrativas | Administrador | Media |
| RF-170 | Tipos de Equipos | Clasificación por tecnología de batería | El sistema deberá permitir clasificar tipos de equipos según tecnología de batería como Litio o Plomo | Administrador | Alta |
| RF-171 | Tipos de Equipos | Clasificación por categoría operacional | El sistema deberá permitir clasificar equipos como Transpaleta, Apilador o Montacargas | Administrador | Alta |
| RF-172 | Tipos de Equipos | Asociación automática desde motivos PSR | El sistema deberá permitir relacionar automáticamente el tipo de equipo según el motivo PSR seleccionado | Sistema | Alta |
| RF-173 | Tipos de Equipos | Visualización de compatibilidad operacional | El sistema deberá mostrar los tipos de equipos permitidos según el servicio registrado en PSR | Usuario, Administrador | Media |
| RF-174 | Tipos de Equipos | Configuración de accesorios requeridos | El sistema deberá permitir definir accesorios obligatorios por tipo de equipo | Administrador | Alta |
| RF-175 | Tipos de Equipos | Configuración de evidencias obligatorias | El sistema deberá permitir definir fotografías obligatorias según el tipo de equipo | Administrador | Alta |
| RF-176 | Tipos de Equipos | Configuración de componentes asociados | El sistema deberá permitir parametrizar componentes asociados por tipo de equipo | Administrador | Media |
| RF-177 | Tipos de Equipos | Validación de accesorios obligatorios | El sistema deberá validar que los accesorios requeridos sean registrados durante la recepción del equipo | Sistema | Alta |
| RF-178 | Tipos de Equipos | Validación de evidencias obligatorias | El sistema deberá validar que las fotografías obligatorias sean registradas antes de finalizar la recepción o devolución | Sistema | Alta |
| RF-179 | Tipos de Equipos | Configuración de checklist operativo | El sistema deberá permitir configurar checklist operativos específicos por tipo de equipo | Administrador | Media |
| RF-180 | Tipos de Equipos | Configuración de campos dinámicos | El sistema deberá permitir habilitar o deshabilitar campos operativos según el tipo de equipo | Administrador | Media |
| RF-181 | Tipos de Equipos | Visualización de estadísticas por tipo | El sistema deberá visualizar indicadores operativos agrupados por tipo de equipo | Usuario, Administrador | Media |
| RF-182 | Tipos de Equipos | Historial operacional por tipo | El sistema deberá permitir consultar historial operativo consolidado por tipo de equipo | Usuario, Administrador | Media |
| RF-183 | Tipos de Equipos | Restricción de incompatibilidad operacional | El sistema deberá impedir asignar tipos de equipos incompatibles con el servicio PSR registrado | Sistema | Alta |
| RF-184 | Tipos de Equipos | Configuración de horómetro obligatorio | El sistema deberá permitir definir si el registro de horómetro es obligatorio según el tipo de equipo | Administrador | Media |
| RF-185 | Tipos de Equipos | Configuración de batería obligatoria | El sistema deberá permitir definir obligatoriedad de información de baterías según el tipo de equipo | Administrador | Media |
| RF-186 | Tipos de Equipos | Configuración de cargador obligatorio | El sistema deberá permitir definir obligatoriedad de información de cargadores según el tipo de equipo | Administrador | Media |
| RF-187 | Tipos de Equipos | Configuración de transformador obligatorio | El sistema deberá permitir definir obligatoriedad de transformadores según el tipo de equipo | Administrador | Baja |

# MOD-08 — PROVEEDORES

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-188 | Proveedores | Registro de proveedores | El sistema deberá permitir registrar proveedores operativos | Administrador | Alta |
| RF-189 | Proveedores | Actualización de proveedores | El sistema deberá permitir actualizar información de proveedores | Administrador | Alta |
| RF-190 | Proveedores | Visualización de proveedores | El sistema deberá permitir visualizar proveedores registrados | Usuario, Administrador | Alta |
| RF-191 | Proveedores | Búsqueda de proveedores | El sistema deberá permitir realizar búsquedas por nombre o RUC | Usuario, Administrador | Media |
| RF-192 | Proveedores | Registro de datos comerciales | El sistema deberá permitir registrar información comercial y de contacto | Administrador | Alta |
| RF-193 | Proveedores | Estado de proveedor | El sistema deberá permitir activar o desactivar proveedores | Administrador | Media |
| RF-194 | Proveedores | Asociación de equipos | El sistema deberá permitir visualizar equipos asociados por proveedor | Usuario, Administrador | Alta |
| RF-195 | Proveedores | Indicadores de averías | El sistema deberá visualizar indicadores de averías por proveedor | Usuario, Administrador | Alta |
| RF-196 | Proveedores | Restricción de eliminación | El sistema no deberá permitir eliminar proveedores con historial operativo | Administrador | Alta |
| RF-197 | Proveedores | Historial de operaciones | El sistema deberá permitir visualizar historial operativo por proveedor | Usuario, Administrador | Media |
| RF-198 | Proveedores | Auditoría de proveedores | El sistema deberá registrar cambios administrativos sobre proveedores | Administrador | Alta |
| RF-199 | Proveedores | Mensajes operativos | El sistema deberá mostrar mensajes de confirmación y error | Administrador | Media |
| RF-200 | Proveedores | Validación de proveedor único | El sistema deberá validar unicidad de proveedores mediante RUC o razón social | Sistema | Alta |
| RF-201 | Proveedores | Registro de RUC | El sistema deberá permitir registrar identificación tributaria del proveedor | Administrador | Alta |
| RF-202 | Proveedores | Registro de contacto operativo | El sistema deberá permitir registrar información de contacto operativo del proveedor | Administrador | Alta |
| RF-203 | Proveedores | Asociación de marcas autorizadas | El sistema deberá permitir relacionar proveedores con marcas de equipos soportadas | Administrador | Media |
| RF-204 | Proveedores | Asociación de tipos de equipos | El sistema deberá permitir relacionar proveedores con tipos de equipos operativos | Administrador | Alta |
| RF-205 | Proveedores | Indicadores de disponibilidad operativa | El sistema deberá visualizar indicadores de disponibilidad operativa asociados al proveedor | Usuario, Administrador | Alta |
| RF-206 | Proveedores | Historial de incidencias | El sistema deberá permitir visualizar historial de averías e incidencias por proveedor | Usuario, Administrador | Alta |
| RF-207 | Proveedores | Restricción de operaciones con proveedor inactivo | El sistema no deberá permitir registrar operaciones usando proveedores inactivos | Sistema | Alta |
| RF-208 | Proveedores | Asociación automática en averías | El sistema deberá asociar automáticamente el proveedor relacionado al registrar averías desde un equipo | Sistema | Alta |
| RF-209 | Proveedores | Inclusión en reportes PDF | El sistema deberá incluir información del proveedor en reportes operativos PDF | Usuario, Administrador | Media |

# MOD-09 — AVERÍAS

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-210 | Averías | Registro de avería | El sistema deberá permitir registrar averías operativas asociadas a un equipo | Usuario, Administrador | Alta |
| RF-211 | Averías | Registro de descripción de falla | El sistema deberá permitir registrar descripción detallada de la falla | Usuario, Administrador | Alta |
| RF-212 | Averías | Registro automático de fecha de reporte | El sistema deberá registrar automáticamente fecha y hora del reporte | Sistema | Alta |
| RF-213 | Averías | Registro de atención de avería | El sistema deberá permitir registrar la atención y solución de una avería | Usuario, Administrador | Alta |
| RF-214 | Averías | Registro de acción correctiva | El sistema deberá permitir registrar acciones correctivas ejecutadas | Usuario, Administrador | Alta |
| RF-215 | Averías | Cálculo de tiempo inactivo | El sistema deberá calcular automáticamente el tiempo de inactividad del equipo | Sistema | Alta |
| RF-216 | Averías | Cambio automático de estado | El sistema deberá cambiar automáticamente el estado del equipo a averiado al registrar una avería | Sistema | Alta |
| RF-217 | Averías | Recuperación de estado operativo | El sistema deberá retornar el estado del equipo a operativo al finalizar la avería | Sistema | Alta |
| RF-218 | Averías | Registro de fotografías | El sistema deberá permitir registrar fotografías asociadas a averías | Usuario, Administrador | Alta |
| RF-219 | Averías | Registro múltiple de evidencias | El sistema deberá permitir registrar múltiples fotografías de evidencia | Usuario, Administrador | Media |
| RF-220 | Averías | Visualización de averías activas | El sistema deberá visualizar averías pendientes de atención | Usuario, Administrador | Alta |
| RF-221 | Averías | Visualización de averías históricas | El sistema deberá visualizar averías atendidas históricamente | Usuario, Administrador | Media |
| RF-222 | Averías | Búsqueda de averías | El sistema deberá permitir búsquedas mediante filtros operativos | Usuario, Administrador | Alta |
| RF-223 | Averías | Filtrado por estado | El sistema deberá permitir filtrar averías por estado operativo | Usuario, Administrador | Alta |
| RF-224 | Averías | Filtrado por proveedor | El sistema deberá permitir filtrar averías por proveedor | Usuario, Administrador | Media |
| RF-225 | Averías | Filtrado por rango de fechas | El sistema deberá permitir filtrar averías por rango de fechas | Usuario, Administrador | Media |
| RF-226 | Averías | Historial por equipo | El sistema deberá visualizar historial de averías por equipo | Usuario, Administrador | Alta |
| RF-227 | Averías | Indicadores de averías | El sistema deberá visualizar indicadores operativos asociados a averías | Usuario, Administrador | Alta |
| RF-228 | Averías | Inclusión en reportes PDF | El sistema deberá incluir averías dentro de reportes operativos PDF | Usuario, Administrador | Media |
| RF-229 | Averías | Auditoría de averías | El sistema deberá registrar eventos asociados a averías | Usuario, Administrador | Alta |
| RF-230 | Averías | Mensajes operativos | El sistema deberá mostrar mensajes visuales durante operaciones de averías | Usuario, Administrador | Media |
| RF-231 | Averías | Validación de equipo operativo | El sistema deberá validar que el equipo exista y se encuentre operativo antes de registrar una avería | Sistema | Alta |
| RF-232 | Averías | Restricción de avería duplicada | El sistema no deberá permitir registrar múltiples averías activas para un mismo equipo | Sistema | Alta |
| RF-233 | Averías | Registro de usuario responsable | El sistema deberá registrar automáticamente el usuario responsable del reporte de avería | Sistema | Alta |
| RF-234 | Averías | Registro de estado de avería | El sistema deberá manejar estados operativos de avería como Pendiente, En Atención y Cerrada | Sistema | Alta |
| RF-235 | Averías | Validación de cierre de avería | El sistema deberá validar el registro de solución antes de permitir cerrar una avería | Sistema | Alta |
| RF-236 | Averías | Asociación automática de proveedor | El sistema deberá asociar automáticamente el proveedor relacionado al equipo averiado | Sistema | Alta |
| RF-237 | Averías | Registro de fecha de cierre | El sistema deberá registrar automáticamente la fecha y hora de cierre de averías | Sistema | Alta |
| RF-238 | Averías | Cálculo de duración de avería | El sistema deberá calcular automáticamente la duración total de la avería | Sistema | Alta |
| RF-239 | Averías | Visualización de equipos averiados | El sistema deberá permitir visualizar equipos que se encuentren actualmente averiados | Usuario, Administrador | Alta |
| RF-240 | Averías | Restricción de operaciones sobre equipos averiados | El sistema no deberá permitir operaciones incompatibles sobre equipos con averías activas | Sistema | Alta |
| RF-241 | Averías | Evidencia obligatoria de avería | El sistema deberá validar el registro de evidencias fotográficas para averías críticas | Sistema | Alta |
| RF-242 | Averías | Trazabilidad de cambios de estado | El sistema deberá registrar cambios de estado realizados durante el ciclo de vida de la avería | Sistema | Alta |

# MOD-10 — EVIDENCIAS FOTOGRÁFICAS

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-243 | Evidencias | Captura de fotografías | El sistema deberá permitir capturar fotografías desde dispositivo móvil | Usuario, Administrador | Alta |
| RF-244 | Evidencias | Carga de fotografías | El sistema deberá permitir cargar fotografías desde galería del dispositivo | Usuario, Administrador | Media |
| RF-245 | Evidencias | Asociación documental | El sistema deberá asociar fotografías a equipos, averías y devoluciones | Usuario, Administrador | Alta |
| RF-246 | Evidencias | Visualización multimedia | El sistema deberá permitir visualizar evidencias fotográficas registradas | Usuario, Administrador | Alta |
| RF-247 | Evidencias | Descarga de fotografías | El sistema deberá permitir descargar fotografías registradas | Usuario, Administrador | Media |
| RF-248 | Evidencias | Validación de formatos | El sistema deberá validar formatos permitidos de imágenes | Sistema | Alta |
| RF-249 | Evidencias | Compresión automática | El sistema deberá optimizar imágenes antes del almacenamiento | Sistema | Media |
| RF-250 | Evidencias | Almacenamiento seguro | El sistema deberá almacenar fotografías de manera segura y organizada | Sistema | Alta |
| RF-251 | Evidencias | Restricción de eliminación | El sistema no deberá permitir eliminación física de evidencias históricas | Administrador | Alta |
| RF-252 | Evidencias | Auditoría multimedia | El sistema deberá registrar eventos relacionados a evidencias | Administrador | Alta |
| RF-253 | Evidencias | Validación de tamaño de archivo | El sistema deberá validar tamaños máximos permitidos para archivos multimedia | Sistema | Alta |
| RF-254 | Evidencias | Asociación automática de usuario | El sistema deberá registrar automáticamente el usuario responsable de la evidencia cargada | Sistema | Alta |
| RF-255 | Evidencias | Registro automático de fecha | El sistema deberá registrar automáticamente fecha y hora de carga de evidencias | Sistema | Alta |
| RF-256 | Evidencias | Evidencias obligatorias por operación | El sistema deberá validar evidencias obligatorias según la operación realizada | Sistema | Alta |
| RF-257 | Evidencias | Validación de integridad de archivos | El sistema deberá validar integridad de archivos antes de almacenarlos | Sistema | Alta |
| RF-258 | Evidencias | Restricción de formatos inválidos | El sistema no deberá permitir cargar formatos multimedia no autorizados | Sistema | Alta |
| RF-259 | Evidencias | Visualización por entidad asociada | El sistema deberá permitir visualizar evidencias agrupadas por equipo, avería o devolución | Usuario, Administrador | Alta |
| RF-260 | Evidencias | Asociación múltiple de evidencias | El sistema deberá permitir asociar múltiples evidencias a un mismo registro operativo | Usuario, Administrador | Alta |
| RF-261 | Evidencias | Validación de existencia de entidad | El sistema deberá validar existencia del registro operativo antes de asociar evidencias | Sistema | Alta |
| RF-262 | Evidencias | Restricción de modificación histórica | El sistema no deberá permitir modificar evidencias asociadas a operaciones cerradas | Sistema | Alta |
| RF-263 | Evidencias | Trazabilidad de evidencias | El sistema deberá mantener trazabilidad completa de carga y consulta de evidencias | Sistema | Alta |
| RF-264 | Evidencias | Recuperación segura de archivos | El sistema deberá permitir recuperar evidencias almacenadas de forma segura | Sistema | Alta |

# MOD-11 — DASHBOARD KPI

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-265 | Dashboard KPI | Visualización de indicadores | El sistema deberá visualizar indicadores operativos consolidados | Usuario, Administrador | Alta |
| RF-266 | Dashboard KPI | KPI de equipos activos | El sistema deberá mostrar cantidad de equipos operativos activos | Usuario, Administrador | Alta |
| RF-267 | Dashboard KPI | KPI de equipos averiados | El sistema deberá mostrar cantidad de equipos averiados | Usuario, Administrador | Alta |
| RF-268 | Dashboard KPI | KPI de tiempos inactivos | El sistema deberá visualizar tiempos acumulados de inactividad | Usuario, Administrador | Alta |
| RF-269 | Dashboard KPI | KPI por proveedor | El sistema deberá visualizar indicadores operativos por proveedor | Usuario, Administrador | Alta |
| RF-270 | Dashboard KPI | KPI por campaña | El sistema deberá visualizar indicadores operativos por campaña | Usuario, Administrador | Alta |
| RF-271 | Dashboard KPI | Filtros dinámicos | El sistema deberá permitir filtros dinámicos sobre indicadores | Usuario, Administrador | Alta |
| RF-272 | Dashboard KPI | Gráficos estadísticos | El sistema deberá visualizar gráficos estadísticos operativos | Usuario, Administrador | Media |
| RF-273 | Dashboard KPI | Exportación de dashboard | El sistema deberá permitir exportar indicadores operativos | Usuario, Administrador | Baja |
| RF-274 | Dashboard KPI | Actualización en tiempo real | El sistema deberá actualizar indicadores al registrar operaciones | Sistema | Media |
| RF-275 | Dashboard KPI | KPI de equipos disponibles | El sistema deberá visualizar cantidad de equipos disponibles para operación | Usuario, Administrador | Alta |
| RF-276 | Dashboard KPI | KPI de equipos en mantenimiento | El sistema deberá visualizar cantidad de equipos en mantenimiento | Usuario, Administrador | Alta |
| RF-277 | Dashboard KPI | KPI de averías abiertas | El sistema deberá visualizar cantidad de averías activas pendientes de cierre | Usuario, Administrador | Alta |
| RF-278 | Dashboard KPI | KPI de tiempo promedio de atención | El sistema deberá calcular y visualizar tiempos promedio de atención de averías | Usuario, Administrador | Alta |
| RF-279 | Dashboard KPI | KPI de disponibilidad operativa | El sistema deberá calcular indicadores de disponibilidad operativa de equipos | Usuario, Administrador | Alta |
| RF-280 | Dashboard KPI | KPI de utilización de equipos | El sistema deberá visualizar indicadores de utilización operacional de equipos | Usuario, Administrador | Alta |
| RF-281 | Dashboard KPI | KPI por sede | El sistema deberá visualizar indicadores operativos agrupados por sede | Usuario, Administrador | Alta |
| RF-282 | Dashboard KPI | KPI por tipo de equipo | El sistema deberá visualizar indicadores agrupados por tipo de equipo | Usuario, Administrador | Alta |
| RF-283 | Dashboard KPI | Visualización de tendencias | El sistema deberá visualizar tendencias operativas mediante gráficos históricos | Usuario, Administrador | Media |
| RF-284 | Dashboard KPI | Validación de actualización automática | El sistema deberá recalcular indicadores automáticamente ante cambios operativos | Sistema | Alta |
| RF-285 | Dashboard KPI | Dashboard resumido gerencial | El sistema deberá visualizar resumen ejecutivo de indicadores críticos | Usuario, Administrador | Alta |
| RF-286 | Dashboard KPI | Indicadores de devoluciones | El sistema deberá visualizar indicadores asociados a devoluciones operativas | Usuario, Administrador | Media |
| RF-287 | Dashboard KPI | Indicadores de proveedores críticos | El sistema deberá identificar proveedores con mayor cantidad de incidencias | Usuario, Administrador | Alta |
| RF-288 | Dashboard KPI | Validación de integridad estadística | El sistema deberá validar consistencia de información estadística mostrada | Sistema | Alta |
| RF-289 | Dashboard KPI | Restricción por permisos | El sistema deberá mostrar indicadores según permisos y roles del usuario | Sistema | Alta |

# MOD-12 — REPORTES PDF

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-290 | Reportes PDF | Generación de reporte de equipo | El sistema deberá generar reportes PDF de equipos registrados | Usuario, Administrador | Alta |
| RF-291 | Reportes PDF | Generación de reporte de averías | El sistema deberá generar reportes PDF de averías registradas | Usuario, Administrador | Alta |
| RF-292 | Reportes PDF | Inclusión de fotografías | El sistema deberá incluir evidencias fotográficas en reportes PDF | Usuario, Administrador | Alta |
| RF-293 | Reportes PDF | Descarga de reportes | El sistema deberá permitir descargar reportes generados | Usuario, Administrador | Alta |
| RF-294 | Reportes PDF | Generación por filtros | El sistema deberá permitir generar reportes mediante filtros operativos | Usuario, Administrador | Media |
| RF-295 | Reportes PDF | Generación histórica | El sistema deberá permitir generar reportes históricos | Usuario, Administrador | Media |
| RF-296 | Reportes PDF | Inclusión de auditoría | El sistema deberá incluir información de trazabilidad en reportes | Usuario, Administrador | Media |
| RF-297 | Reportes PDF | Validación de generación | El sistema deberá validar consistencia documental antes de generar PDF | Sistema | Media |
| RF-298 | Reportes PDF | Reporte consolidado operativo | El sistema deberá generar reportes consolidados de operaciones | Usuario, Administrador | Alta |
| RF-299 | Reportes PDF | Reporte por proveedor | El sistema deberá generar reportes operativos agrupados por proveedor | Usuario, Administrador | Alta |
| RF-300 | Reportes PDF | Reporte por campaña | El sistema deberá generar reportes operativos agrupados por campaña | Usuario, Administrador | Alta |
| RF-301 | Reportes PDF | Reporte de historial de equipos | El sistema deberá generar historial completo de operaciones por equipo | Usuario, Administrador | Alta |
| RF-302 | Reportes PDF | Reporte de tiempos de inactividad | El sistema deberá generar reportes de tiempos acumulados de inactividad | Usuario, Administrador | Alta |
| RF-303 | Reportes PDF | Inclusión de indicadores KPI | El sistema deberá incluir indicadores operativos dentro de reportes PDF | Usuario, Administrador | Alta |
| RF-304 | Reportes PDF | Inclusión de fecha de generación | El sistema deberá registrar fecha y hora de generación del reporte | Sistema | Alta |
| RF-305 | Reportes PDF | Inclusión de usuario generador | El sistema deberá registrar el usuario responsable de la generación del reporte | Sistema | Alta |
| RF-306 | Reportes PDF | Validación de información obligatoria | El sistema deberá validar existencia de información mínima antes de generar reportes | Sistema | Alta |
| RF-307 | Reportes PDF | Generación de reportes por rango de fechas | El sistema deberá permitir generar reportes utilizando rangos de fechas operativas | Usuario, Administrador | Alta |
| RF-308 | Reportes PDF | Generación de reportes de averías activas | El sistema deberá permitir generar reportes de averías pendientes de atención | Usuario, Administrador | Alta |
| RF-309 | Reportes PDF | Generación de reportes de auditoría | El sistema deberá generar reportes asociados a trazabilidad y auditoría del sistema | Administrador | Alta |
| RF-310 | Reportes PDF | Restricción por permisos | El sistema deberá restringir generación de reportes según roles y permisos | Sistema | Alta |
| RF-311 | Reportes PDF | Inclusión de estado operativo | El sistema deberá incluir estados operativos de equipos y averías en reportes | Usuario, Administrador | Alta |
| RF-312 | Reportes PDF | Validación de integridad documental | El sistema deberá validar integridad de información antes de exportar documentos PDF | Sistema | Alta |

# MOD-13 — AUDITORÍA

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-313 | Auditoría | Registro de eventos | El sistema deberá registrar eventos operativos relevantes | Sistema | Alta |
| RF-314 | Auditoría | Registro de autenticación | El sistema deberá registrar eventos de acceso y cierre de sesión | Sistema | Alta |
| RF-315 | Auditoría | Registro de operaciones CRUD | El sistema deberá registrar creación, actualización y desactivación de registros | Sistema | Alta |
| RF-316 | Auditoría | Registro de usuario responsable | El sistema deberá almacenar el usuario responsable de cada operación | Sistema | Alta |
| RF-317 | Auditoría | Registro de fecha y hora | El sistema deberá almacenar fecha y hora exacta de eventos | Sistema | Alta |
| RF-318 | Auditoría | Consulta de auditoría | El sistema deberá permitir consultar eventos registrados | Administrador | Alta |
| RF-319 | Auditoría | Filtrado de eventos | El sistema deberá permitir filtrar eventos mediante múltiples criterios | Administrador | Media |
| RF-320 | Auditoría | Exportación de auditoría | El sistema deberá permitir exportar registros de auditoría | Administrador | Baja |
| RF-321 | Auditoría | Restricción de modificación | El sistema no deberá permitir modificar registros de auditoría | Sistema | Alta |
| RF-322 | Auditoría | Retención histórica | El sistema deberá mantener historial completo de eventos operativos | Sistema | Alta |
| RF-323 | Auditoría | Registro de módulo afectado | El sistema deberá registrar el módulo funcional asociado a cada evento | Sistema | Alta |
| RF-324 | Auditoría | Registro de dirección IP | El sistema deberá almacenar dirección IP asociada a eventos críticos | Sistema | Alta |
| RF-325 | Auditoría | Registro de cambios de estado | El sistema deberá registrar cambios de estado realizados sobre entidades operativas | Sistema | Alta |
| RF-326 | Auditoría | Registro de errores operativos | El sistema deberá registrar errores generados durante operaciones críticas | Sistema | Alta |
| RF-327 | Auditoría | Registro de operaciones de seguridad | El sistema deberá registrar eventos relacionados a seguridad y autenticación JWT | Sistema | Alta |
| RF-328 | Auditoría | Consulta por usuario | El sistema deberá permitir consultar auditoría por usuario responsable | Administrador | Alta |
| RF-329 | Auditoría | Consulta por rango de fechas | El sistema deberá permitir consultar auditoría mediante rango de fechas | Administrador | Alta |
| RF-330 | Auditoría | Restricción de acceso a auditoría | El sistema deberá restringir acceso a información de auditoría según permisos | Sistema | Alta |
| RF-331 | Auditoría | Trazabilidad de evidencias | El sistema deberá registrar operaciones realizadas sobre evidencias fotográficas | Sistema | Alta |
| RF-332 | Auditoría | Registro de generación de reportes | El sistema deberá registrar generación y descarga de reportes PDF | Sistema | Alta |
| RF-333 | Auditoría | Validación de integridad de auditoría | El sistema deberá garantizar integridad y consistencia de registros de auditoría | Sistema | Alta |

# MOD-14 — CATÁLOGOS

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-334 | Catálogos | Gestión de marcas | El sistema deberá permitir administrar marcas de equipos | Administrador | Alta |
| RF-335 | Catálogos | Gestión de motivos PSR | El sistema deberá permitir administrar motivos de solicitudes PSR | Administrador | Alta |
| RF-336 | Catálogos | Gestión de estados | El sistema deberá permitir administrar estados operativos | Administrador | Media |
| RF-337 | Catálogos | Gestión de configuraciones auxiliares | El sistema deberá administrar tablas maestras auxiliares | Administrador | Media |
| RF-338 | Catálogos | Validación de duplicidad | El sistema deberá validar registros duplicados en catálogos | Sistema | Alta |
| RF-339 | Catálogos | Estado de registros | El sistema deberá permitir activar y desactivar registros maestros | Administrador | Media |
| RF-340 | Catálogos | Restricción de eliminación | El sistema no deberá permitir eliminar registros asociados a operaciones | Administrador | Alta |
| RF-341 | Catálogos | Auditoría de catálogos | El sistema deberá registrar cambios sobre datos maestros | Sistema | Alta |
| RF-342 | Catálogos | Gestión de tipos de avería | El sistema deberá permitir administrar tipos de averías operativas | Administrador | Alta |
| RF-343 | Catálogos | Gestión de tipos de equipos | El sistema deberá permitir administrar categorías de equipos operativos | Administrador | Alta |
| RF-344 | Catálogos | Gestión de accesorios | El sistema deberá permitir administrar accesorios operativos de equipos | Administrador | Alta |
| RF-345 | Catálogos | Gestión de estados de avería | El sistema deberá permitir administrar estados operativos de averías | Administrador | Alta |
| RF-346 | Catálogos | Gestión de campañas | El sistema deberá permitir administrar parámetros base de campañas | Administrador | Alta |
| RF-347 | Catálogos | Validación de códigos únicos | El sistema deberá validar unicidad de códigos maestros | Sistema | Alta |
| RF-348 | Catálogos | Restricción de uso de registros inactivos | El sistema no deberá permitir utilizar registros maestros inactivos en operaciones | Sistema | Alta |
| RF-349 | Catálogos | Visualización de catálogos | El sistema deberá permitir visualizar registros maestros configurados | Usuario, Administrador | Alta |
| RF-350 | Catálogos | Búsqueda en catálogos | El sistema deberá permitir realizar búsquedas sobre registros maestros | Usuario, Administrador | Media |
| RF-351 | Catálogos | Asociación de catálogos | El sistema deberá permitir relacionar registros maestros entre módulos operativos | Administrador | Media |
| RF-352 | Catálogos | Validación de integridad referencial | El sistema deberá validar integridad referencial entre catálogos y operaciones | Sistema | Alta |

# MOD-15 — CONFIGURACIÓN

| Código | Módulo | Nombre | Descripción | Actor | Prioridad |
|---|---|---|---|---|---|
| RF-353 | Configuración | Configuración general | El sistema deberá permitir administrar parámetros generales | Administrador | Alta |
| RF-354 | Configuración | Configuración de tiempos de sesión | El sistema deberá permitir configurar expiración de sesiones | Administrador | Media |
| RF-355 | Configuración | Configuración de almacenamiento | El sistema deberá permitir configurar políticas de almacenamiento multimedia | Administrador | Media |
| RF-356 | Configuración | Configuración de tamaños multimedia | El sistema deberá permitir configurar límites de tamaño de archivos | Administrador | Media |
| RF-357 | Configuración | Configuración de auditoría | El sistema deberá permitir configurar niveles de trazabilidad | Administrador | Baja |
| RF-358 | Configuración | Configuración de campañas | El sistema deberá permitir parametrizar campañas operativas | Administrador | Media |
| RF-359 | Configuración | Configuración de seguridad | El sistema deberá permitir administrar parámetros de seguridad JWT | Administrador | Alta |
| RF-360 | Configuración | Historial de configuraciones | El sistema deberá registrar cambios realizados en configuraciones | Sistema | Alta |
| RF-361 | Configuración | Configuración de parámetros operativos | El sistema deberá permitir administrar parámetros operativos globales | Administrador | Alta |
| RF-362 | Configuración | Configuración de políticas de evidencias | El sistema deberá permitir configurar reglas obligatorias de evidencias fotográficas | Administrador | Alta |
| RF-363 | Configuración | Configuración de políticas de averías | El sistema deberá permitir configurar parámetros operativos de gestión de averías | Administrador | Alta |
| RF-364 | Configuración | Configuración de expiración JWT | El sistema deberá permitir parametrizar tiempos de expiración de tokens JWT | Administrador | Alta |
| RF-365 | Configuración | Configuración de roles y permisos | El sistema deberá permitir administrar configuraciones de permisos del sistema | Administrador | Alta |
| RF-366 | Configuración | Restricción de acceso a configuraciones | El sistema deberá restringir acceso a configuraciones según roles administrativos | Sistema | Alta |
| RF-367 | Configuración | Validación de parámetros críticos | El sistema deberá validar integridad de configuraciones críticas antes de aplicarlas | Sistema | Alta |
| RF-368 | Configuración | Registro de cambios de configuración | El sistema deberá registrar auditoría de cambios realizados sobre configuraciones | Sistema | Alta |
| RF-369 | Configuración | Configuración de estados operativos | El sistema deberá permitir configurar estados operativos utilizados en el sistema | Administrador | Media |
| RF-370 | Configuración | Configuración de límites operativos | El sistema deberá permitir configurar límites y validaciones operativas globales | Administrador | Media |
| RF-371 | Configuración | Restauración de configuraciones | El sistema deberá permitir restaurar configuraciones previamente registradas | Administrador | Media |

# 9. REGLAS DE NEGOCIO

## Reglas de Negocio Críticas y No Negociables

| Código | Regla de Negocio | Motivo Crítico |
|---|---|---|
| RN-001 | Todo usuario deberá autenticarse mediante cuenta Microsoft corporativa válida | Garantiza control de acceso corporativo y trazabilidad real de usuarios |
| RN-002 | Solo usuarios activos podrán acceder al sistema | Evita accesos no autorizados o cuentas deshabilitadas |
| RN-003 | Todo equipo deberá estar asociado obligatoriamente a un OSR | Garantiza trazabilidad contractual y operacional |
| RN-004 | Un equipo no podrá estar asociado simultáneamente a múltiples OSR activos | Evita inconsistencias operativas y duplicidad logística |
| RN-005 | Todo registro operativo deberá asociarse automáticamente a la campaña activa | Garantiza segmentación y consolidación correcta de información |
| RN-006 | Solo podrá existir una campaña activa al mismo tiempo | Evita contaminación de métricas y operaciones cruzadas |
| RN-007 | El estado del equipo cambiará automáticamente a AVERIADO al registrar una avería | Garantiza consistencia operativa en tiempo real |
| RN-008 | El estado del equipo retornará automáticamente a OPERATIVO al finalizar una avería | Evita estados inconsistentes de disponibilidad |
| RN-009 | No se permitirá eliminar información histórica operacional | Garantiza auditoría, trazabilidad y control histórico |
| RN-010 | Toda operación relevante deberá generar trazabilidad de auditoría | Permite seguimiento y control de operaciones críticas |
| RN-011 | El sistema deberá validar unicidad de PSR, OSR y número de serie | Evita duplicidad documental y conflictos operativos |
| RN-012 | Las evidencias fotográficas deberán mantenerse vinculadas al registro operativo asociado | Garantiza respaldo documental y validación operativa |
| RN-013 | Solo administradores podrán editar información crítica operacional | Protege integridad de la información |
| RN-014 | Los tiempos de inactividad deberán calcularse automáticamente | Garantiza métricas KPI confiables |
| RN-015 | Los reportes PDF deberán reflejar información consolidada y trazable | Garantiza confiabilidad documental |
| RN-016 | No se permitirá registrar averías sobre equipos con averías activas abiertas | Evita duplicidad de incidencias y corrupción operativa |
| RN-017 | Todo registro de avería deberá asociarse obligatoriamente a un equipo existente | Garantiza integridad referencial |
| RN-018 | El sistema no deberá permitir operaciones sobre proveedores inactivos | Evita asignaciones inválidas y errores operacionales |
| RN-019 | Todo equipo deberá tener un estado operativo válido y único | Garantiza control operacional consistente |
| RN-020 | El sistema deberá validar obligatoriedad de evidencias según tipo de operación | Garantiza respaldo documental obligatorio |
| RN-021 | Las operaciones críticas deberán registrar automáticamente usuario, fecha y hora | Garantiza trazabilidad completa |
| RN-022 | El sistema no deberá permitir modificar registros cerrados históricamente | Evita alteración de información histórica |
| RN-023 | Todo equipo deberá pertenecer a una sede operativa válida | Garantiza distribución operacional correcta |
| RN-024 | El sistema deberá validar integridad referencial antes de eliminar o desactivar registros maestros | Evita corrupción de datos |
| RN-025 | Los JWT deberán validarse en cada solicitud protegida | Garantiza seguridad transaccional |
| RN-026 | El sistema no deberá permitir registrar números de serie duplicados | Evita duplicidad física de activos |
| RN-027 | Toda devolución deberá registrar evidencias fotográficas obligatorias | Garantiza validación del estado del equipo |
| RN-028 | El sistema deberá impedir cierre de averías sin registrar solución o acción correctiva | Garantiza consistencia operativa |
| RN-029 | Todo registro operativo deberá mantener relación con su proveedor asociado | Garantiza trazabilidad contractual |
| RN-030 | El sistema deberá restringir acceso a módulos según roles y permisos | Garantiza seguridad funcional |
| RN-031 | Las evidencias multimedia deberán almacenarse de manera persistente y segura | Garantiza disponibilidad documental |
| RN-032 | El sistema deberá validar formatos y tamaños permitidos de archivos multimedia | Evita corrupción y sobrecarga del sistema |
| RN-033 | Los indicadores KPI deberán calcularse utilizando información validada y consolidada | Garantiza confiabilidad gerencial |
| RN-034 | No se permitirá utilizar registros maestros inactivos en operaciones nuevas | Garantiza consistencia operacional |
| RN-035 | Toda generación de reportes deberá registrarse en auditoría | Garantiza trazabilidad documental |
| RN-036 | El sistema deberá impedir inconsistencias de estados entre equipos y averías | Garantiza integridad operacional |
| RN-037 | Los cambios de configuración crítica deberán registrarse obligatoriamente en auditoría | Garantiza gobierno y control técnico |
| RN-038 | Toda operación deberá validarse server-side independientemente del frontend | Garantiza seguridad y control transaccional |
| RN-039 | El sistema deberá validar permisos por endpoint API | Garantiza seguridad backend |
| RN-040 | El sistema deberá mantener integridad transaccional en operaciones críticas | Evita corrupción de datos ante errores parciales |

| RN-041 | El sistema no deberá permitir registrar un equipo sin proveedor asociado | Todo equipo alquilado debe tener trazabilidad contractual |
| RN-042 | El sistema deberá validar que las OSR pertenezcan al PSR correspondiente | Evita relaciones inválidas entre documentos |
| RN-043 | El sistema deberá impedir registrar devoluciones de equipos no entregados | Garantiza consistencia logística |
| RN-044 | Toda avería deberá mantener historial completo de atención | Necesario para trazabilidad técnica y auditoría |
| RN-045 | El sistema deberá impedir registrar operaciones fuera de campañas activas | Evita contaminación histórica y KPI incorrectos |
| RN-046 | Las fotografías asociadas a operaciones no deberán eliminarse físicamente | Necesario para respaldo legal y operativo |
| RN-047 | El sistema deberá mantener trazabilidad completa de cambios de estado de equipos | Fundamental para control operacional |
| RN-048 | El sistema deberá impedir duplicidad de equipos mediante número de serie | Garantiza unicidad de activos |
| RN-049 | Los registros críticos deberán ejecutarse mediante transacciones atómicas | Evita inconsistencias en base de datos |
| RN-050 | El backend deberá ser la única fuente válida de reglas operativas | Evita manipulación desde frontend o APK |
| RN-051 | Toda operación crítica deberá validar sesión JWT vigente | Garantiza seguridad continua |
| RN-052 | El sistema deberá impedir acceso a información fuera del alcance del rol asignado | Garantiza segregación funcional |
| RN-053 | El sistema deberá mantener consistencia entre dashboard KPI y operaciones reales | Garantiza confiabilidad gerencial |
| RN-054 | El sistema deberá impedir cierre manual inconsistente de estados operativos | Evita corrupción operacional |
| RN-055 | Toda operación deberá registrar auditoría incluso ante errores críticos | Garantiza investigación y soporte técnico posterior |

## Restricciones Técnicas de Implementación

Estas reglas deberán implementarse principalmente en:

- Backend Quarkus.
- Servicios de dominio.
- Validaciones transaccionales.
- Middleware JWT.
- Base de datos PostgreSQL mediante constraints.
- Auditoría transversal.

Las validaciones críticas no deberán depender exclusivamente del frontend React o React Native.

## Consideraciones Generales

- Las reglas de negocio deberán validarse principalmente en backend.
- Las operaciones críticas deberán ejecutarse mediante transacciones seguras.
- Toda operación relevante deberá generar auditoría.

# 10. REQUERIMIENTOS NO FUNCIONALES

## 10.1 Rendimiento

| Código | Requerimiento No Funcional | Descripción | Prioridad |
|---|---|---|---|
| RNF-001 | Tiempo de respuesta API | El sistema deberá responder solicitudes API en un tiempo menor o igual a 3 segundos bajo condiciones normales | Alta |
| RNF-002 | Tiempo de carga frontend | Las pantallas principales deberán cargar en menos de 5 segundos | Alta |
| RNF-003 | Procesamiento concurrente | El sistema deberá soportar múltiples usuarios concurrentes sin degradación crítica | Alta |
| RNF-004 | Optimización multimedia | El sistema deberá comprimir imágenes antes de almacenarlas | Media |
| RNF-005 | Procesamiento transaccional | Las operaciones críticas deberán ejecutarse mediante transacciones atómicas | Alta |

---

## 10.2 Seguridad

| Código | Requerimiento No Funcional | Descripción | Prioridad |
|---|---|---|---|
| RNF-006 | Autenticación corporativa | El sistema deberá autenticarse mediante Microsoft OAuth2/OpenID Connect | Alta |
| RNF-007 | Seguridad JWT | Todas las APIs protegidas deberán validar JWT en cada solicitud | Alta |
| RNF-008 | Autorización basada en roles | El sistema deberá controlar acceso mediante roles y permisos | Alta |
| RNF-009 | Protección de endpoints | Los endpoints protegidos no deberán permitir acceso anónimo | Alta |
| RNF-010 | Cifrado de comunicaciones | Toda comunicación deberá realizarse mediante HTTPS/TLS | Alta |
| RNF-011 | Protección de credenciales | Las credenciales y secretos no deberán almacenarse en frontend | Alta |
| RNF-012 | Seguridad server-side | Las validaciones críticas deberán ejecutarse en backend | Alta |
| RNF-013 | Restricción de acceso administrativo | Solo usuarios autorizados podrán acceder a configuraciones críticas | Alta |
| RNF-014 | Protección multimedia | Las evidencias deberán almacenarse de forma segura y controlada | Alta |
| RNF-015 | Expiración de sesión | El sistema deberá invalidar sesiones expiradas automáticamente | Media |

---

## 10.3 Disponibilidad

| Código | Requerimiento No Funcional | Descripción | Prioridad |
|---|---|---|---|
| RNF-016 | Disponibilidad del sistema | El sistema deberá mantener disponibilidad mínima del 99% | Alta |
| RNF-017 | Persistencia de información | La información operacional deberá mantenerse persistente ante fallos | Alta |
| RNF-018 | Recuperación ante fallos | El sistema deberá permitir recuperación controlada ante errores críticos | Alta |
| RNF-019 | Respaldos de información | El sistema deberá permitir respaldos periódicos de base de datos | Alta |
| RNF-020 | Tolerancia a fallos | El sistema deberá manejar errores sin afectar integridad transaccional | Alta |

---

## 10.4 Escalabilidad

| Código | Requerimiento No Funcional | Descripción | Prioridad |
|---|---|---|---|
| RNF-021 | Arquitectura desacoplada | El sistema deberá implementar arquitectura desacoplada frontend/backend | Alta |
| RNF-022 | Contenerización | Los servicios deberán desplegarse mediante Docker | Alta |
| RNF-023 | Escalabilidad horizontal | La arquitectura deberá permitir escalabilidad horizontal futura | Media |
| RNF-024 | Separación de responsabilidades | El backend deberá centralizar reglas de negocio y validaciones | Alta |
| RNF-025 | Modularidad | El sistema deberá mantener estructura modular por dominios funcionales | Alta |

---

## 10.5 Base de Datos

| Código | Requerimiento No Funcional | Descripción | Prioridad |
|---|---|---|---|
| RNF-026 | Integridad referencial | La base de datos deberá garantizar integridad referencial | Alta |
| RNF-027 | Restricciones de unicidad | La base de datos deberá validar unicidad de registros críticos | Alta |
| RNF-028 | Auditoría persistente | La información de auditoría deberá mantenerse históricamente | Alta |
| RNF-029 | Transacciones seguras | Las operaciones críticas deberán ejecutarse mediante transacciones ACID | Alta |
| RNF-030 | Optimización de consultas | Las consultas críticas deberán encontrarse indexadas | Media |

---

## 10.6 Compatibilidad

| Código | Requerimiento No Funcional | Descripción | Prioridad |
|---|---|---|---|
| RNF-031 | Compatibilidad Web | El frontend web deberá ser compatible con navegadores modernos | Alta |
| RNF-032 | Compatibilidad Android | La APK deberá ejecutarse en dispositivos Android compatibles | Alta |
| RNF-033 | Responsive Design | El frontend web deberá adaptarse a diferentes resoluciones | Media |
| RNF-034 | Compatibilidad API REST | El backend deberá exponer servicios RESTful estándar | Alta |
| RNF-035 | Compatibilidad multimedia | El sistema deberá soportar formatos estándar de imágenes | Media |

---

## 10.7 Usabilidad

| Código | Requerimiento No Funcional | Descripción | Prioridad |
|---|---|---|---|
| RNF-036 | Interfaz intuitiva | El sistema deberá presentar interfaces simples e intuitivas | Alta |
| RNF-037 | Retroalimentación visual | El sistema deberá mostrar mensajes visuales de confirmación y error | Alta |
| RNF-038 | Navegación consistente | El sistema deberá mantener navegación uniforme entre módulos | Media |
| RNF-039 | Validaciones visuales | El sistema deberá mostrar validaciones antes de procesar operaciones | Alta |
| RNF-040 | Accesibilidad operativa | El sistema deberá facilitar operaciones rápidas en campo | Alta |

---

## 10.8 Mantenibilidad

| Código | Requerimiento No Funcional | Descripción | Prioridad |
|---|---|---|---|
| RNF-041 | Arquitectura mantenible | El sistema deberá mantener separación clara de capas y responsabilidades | Alta |
| RNF-042 | Código modular | El código deberá organizarse por módulos funcionales | Alta |
| RNF-043 | Trazabilidad de errores | El sistema deberá registrar errores críticos para soporte técnico | Alta |
| RNF-044 | Configuración centralizada | Las configuraciones críticas deberán administrarse centralizadamente | Media |
| RNF-045 | Auditoría técnica | El sistema deberá registrar eventos técnicos y operacionales | Alta |

---

## 10.9 Infraestructura

| Código | Requerimiento No Funcional | Descripción | Prioridad |
|---|---|---|---|
| RNF-046 | Despliegue contenerizado | Los componentes deberán ejecutarse mediante contenedores Docker | Alta |
| RNF-047 | Variables de entorno | Las configuraciones sensibles deberán manejarse mediante variables de entorno | Alta |
| RNF-048 | Separación de ambientes | El sistema deberá manejar ambientes DEV, QA y PROD | Alta |
| RNF-049 | Persistencia multimedia | Las evidencias deberán almacenarse en almacenamiento persistente | Alta |
| RNF-050 | Monitoreo operativo | La solución deberá permitir monitoreo básico de servicios y errores | Media |

---

## 10.10 Auditoría y Trazabilidad

| Código | Requerimiento No Funcional | Descripción | Prioridad |
|---|---|---|---|
| RNF-051 | Trazabilidad operacional | Toda operación crítica deberá generar trazabilidad | Alta |
| RNF-052 | Auditoría de autenticación | El sistema deberá registrar eventos de autenticación | Alta |
| RNF-053 | Auditoría de cambios | El sistema deberá registrar modificaciones de información crítica | Alta |
| RNF-054 | Trazabilidad documental | El sistema deberá mantener relación entre operaciones y evidencias | Alta |
| RNF-055 | Integridad histórica | Los registros históricos no deberán alterarse físicamente | Alta |

---

# Restricciones Técnicas Obligatorias

- El backend deberá desarrollarse utilizando Quarkus.
- El frontend web deberá desarrollarse utilizando React.
- La aplicación móvil deberá desarrollarse utilizando React Native.
- La base de datos relacional deberá implementarse sobre PostgreSQL.
- La infraestructura deberá desplegarse mediante Docker.
- La autenticación deberá implementarse mediante JWT y Microsoft OAuth2/OpenID Connect.
- Las reglas de negocio deberán validarse principalmente en backend.
- Las operaciones críticas deberán ejecutarse mediante transacciones seguras.
- Las validaciones críticas no deberán depender exclusivamente del frontend React o React Native.


# 11. ENTIDADES PRINCIPALES

## 11.1 Usuario

### Descripción

Representa a los usuarios autenticados del sistema que ejecutan operaciones según los permisos asignados.

### Responsabilidades

- Acceso al sistema.
- Ejecución de operaciones.
- Registro de actividades.
- Gestión operacional.

### Atributos Principales

| Campo | Descripción | Tipo |
|---|---|---|---|
| id_usuario | Identificador único | BIGSERIAL |
| nombres | Nombres del usuario | VARCHAR |
| apellidos | Apellidos del usuario | VARCHAR |
| correo | Correo corporativo (login vía Microsoft) | VARCHAR |
| username | Usuario de acceso | VARCHAR |
| estado_activo | Estado operativo | BOOLEAN |
| id_rol | Rol asociado (FK a dim_roles) | BIGINT |
| fecha_creacion | Fecha de creación (TIMESTAMP WITH TIME ZONE) | TIMESTAMPTZ |
| fecha_actualizacion | Última actualización (TIMESTAMP WITH TIME ZONE) | TIMESTAMPTZ |
| ultimo_login | Último acceso (TIMESTAMP WITH TIME ZONE) | TIMESTAMPTZ |

### Reglas Críticas

- Todo usuario deberá pertenecer a un rol válido.
- El correo corporativo deberá ser único.
- Solo usuarios activos podrán acceder al sistema.
- Toda operación deberá registrar usuario responsable.

# 11.2 Rol

### Descripción

Representa perfiles de acceso y permisos funcionales del sistema.

### Responsabilidades

- Gestión de permisos.
- Restricción de accesos.
- Segmentación funcional.

### Atributos Principales

| Campo | Descripción |
|---|---|
| id_rol | Identificador único |
| nombre | Nombre del rol |
| descripcion | Descripción funcional |
| estado | Estado operativo |

### Reglas Críticas

- Todo usuario deberá asociarse a un rol.
- Los permisos deberán validarse server-side.
- Solo administradores podrán gestionar roles críticos.

# 11.3 Sede

### Descripción

Representa las ubicaciones operativas donde se distribuyen equipos y operaciones.

### Responsabilidades

- Segmentación geográfica.
- Asociación operacional.
- Distribución logística.

### Atributos Principales

| Campo | Descripción |
|---|---|
| id_sede | Identificador único |
| nombre | Nombre sede |
| direccion | Dirección |
| estado | Estado operativo |

### Reglas Críticas

- Toda operación deberá asociarse a una sede válida.
- No deberán utilizarse sedes inactivas.

# 11.4 Campaña

### Descripción

Representa campañas operativas activas e históricas.

### Responsabilidades

- Agrupación operacional.
- Consolidación de KPI.
- Segmentación histórica.

### Atributos Principales

| Campo | Descripción |
|---|---|
| id_campana | Identificador único |
| nombre | Nombre campaña |
| fecha_inicio | Fecha inicio |
| fecha_fin | Fecha fin |
| estado | Estado operativo |

### Reglas Críticas

- Solo podrá existir una campaña activa.
- Toda operación deberá asociarse a campaña activa.

# 11.5 PSR

### Descripción

Representa pedidos de servicio requeridos asociados a operaciones.

### Responsabilidades

- Gestión documental.
- Asociación contractual.
- Relación operacional.

### Atributos Principales

| Campo | Descripción |
|---|---|
| id_psr | Identificador único |
| codigo_psr | Código PSR |
| descripcion | Descripción |
| fecha_registro | Fecha registro |
| estado | Estado operativo |

### Reglas Críticas

- El código PSR deberá ser único.
- Toda OSR deberá pertenecer a un PSR válido.

# 11.6 OSR

### Descripción

Representa órdenes de servicio relacionadas a operaciones y equipos.

### Responsabilidades

- Asociación de equipos.
- Gestión operacional.
- Relación documental.

### Atributos Principales

| Campo | Descripción |
|---|---|
| id_osr | Identificador único |
| codigo_osr | Código OSR |
| id_psr | PSR asociado |
| fecha_registro | Fecha registro |
| estado | Estado operativo |

### Reglas Críticas

- El código OSR deberá ser único.
- Toda OSR deberá pertenecer a un PSR válido.
- Todo equipo deberá asociarse a una OSR válida.

# 11.7 Equipo

### Descripción

Representa equipos operativos alquilados utilizados en operación.

### Responsabilidades

- Gestión operacional.
- Control de estados.
- Asociación documental.
- Registro de averías.

### Atributos Principales

| Campo | Descripción |
|---|---|
| id_equipo | Identificador único |
| numero_serie | Número serie |
| codigo_interno | Código interno |
| id_tipo_equipo | Tipo equipo |
| id_marca | Marca |
| id_proveedor | Proveedor |
| id_osr | OSR asociada |
| id_sede | Sede asociada |
| estado | Estado operativo |
| fecha_registro | Fecha registro |

### Reglas Críticas

- El número de serie deberá ser único.
- Todo equipo deberá pertenecer a proveedor válido.
- Todo equipo deberá asociarse a una OSR válida.
- No deberán existir equipos duplicados.
- Todo equipo deberá mantener estado operativo válido.

# 11.8 TipoEquipo

### Descripción

Representa categorías de equipos operativos.

### Responsabilidades

- Clasificación operacional.
- Segmentación técnica.

### Atributos Principales

| Campo | Descripción |
|---|---|
| id_tipo_equipo | Identificador único |
| nombre | Nombre categoría |
| descripcion | Descripción |
| estado | Estado operativo |

### Reglas Críticas

- Todo equipo deberá asociarse a un tipo válido.
- No deberán utilizarse tipos inactivos.

# 11.9 Proveedor

### Descripción

Representa empresas proveedoras de equipos operativos.

### Responsabilidades

- Gestión contractual.
- Asociación de equipos.
- Gestión operacional.

### Atributos Principales

| Campo | Descripción |
|---|---|
| id_proveedor | Identificador único |
| razon_social | Razón social |
| ruc | Número RUC |
| telefono | Teléfono |
| correo | Correo |
| direccion | Dirección |
| estado | Estado operativo |

### Reglas Críticas

- El RUC deberá ser único.
- No deberán utilizarse proveedores inactivos.
- Todo equipo deberá asociarse a proveedor válido.

# 11.10 Marca

### Descripción

Representa marcas comerciales de equipos operativos.

### Responsabilidades

- Clasificación técnica.
- Organización operacional.

### Atributos Principales

| Campo | Descripción |
|---|---|
| id_marca | Identificador único |
| nombre | Nombre marca |
| descripcion | Descripción |
| estado | Estado operativo |

### Reglas Críticas

- Todo equipo deberá asociarse a marca válida.
- No deberán utilizarse marcas inactivas.

# 11.11 Avería

### Descripción

Representa incidencias operativas registradas sobre equipos.

### Responsabilidades

- Gestión de fallas.
- Registro correctivo.
- Control operacional.

### Atributos Principales

| Campo | Descripción |
|---|---|
| id_averia | Identificador único |
| id_equipo | Equipo asociado |
| descripcion | Descripción falla |
| fecha_reporte | Fecha reporte |
| fecha_cierre | Fecha cierre |
| estado | Estado avería |
| tiempo_inactivo | Tiempo inactividad |

### Reglas Críticas

- Toda avería deberá asociarse a un equipo válido.
- No deberán existir averías activas duplicadas.
- El sistema deberá cambiar automáticamente el estado del equipo.
- Toda avería deberá mantener trazabilidad histórica.

# 11.12 Evidencia

### Descripción

Representa fotografías y archivos multimedia asociados a operaciones.

### Responsabilidades

- Respaldo documental.
- Evidencia operacional.
- Soporte auditoría.

### Atributos Principales

| Campo | Descripción |
|---|---|
| id_evidencia | Identificador único |
| nombre_archivo | Nombre archivo |
| ruta_archivo | Ruta almacenamiento |
| tipo_archivo | Tipo multimedia |
| entidad_asociada | Entidad relacionada |
| fecha_registro | Fecha registro |

### Reglas Críticas

- Toda evidencia deberá asociarse a entidad válida.
- Las evidencias no deberán eliminarse físicamente.
- Las evidencias deberán almacenarse persistentemente.

# 11.13 Auditoría

### Descripción

Representa eventos de trazabilidad y control operacional.

### Responsabilidades

- Registro de operaciones.
- Trazabilidad.
- Seguimiento técnico.

### Atributos Principales

| Campo | Descripción |
|---|---|
| id_auditoria | Identificador único |
| usuario | Usuario responsable |
| operacion | Operación ejecutada |
| modulo | Módulo afectado |
| fecha | Fecha evento |
| ip | Dirección IP |
| detalle | Información adicional |

### Reglas Críticas

- Toda operación crítica deberá generar auditoría.
- La auditoría deberá mantenerse históricamente.
- Los registros auditados no deberán alterarse.

# 11.14 Configuración

### Descripción

Representa parámetros globales y configuraciones del sistema.

### Responsabilidades

- Parametrización operacional.
- Gestión técnica.
- Configuración global.

### Atributos Principales

| Campo | Descripción |
|---|---|
| id_configuracion | Identificador único |
| clave | Clave configuración |
| valor | Valor configuración |
| descripcion | Descripción |
| estado | Estado operativo |

### Reglas Críticas

- Solo administradores podrán modificar configuraciones.
- Toda modificación deberá generar auditoría.
- Las configuraciones críticas deberán validarse server-side.

# 11.15 Consideraciones Generales de Entidades

- Todas las entidades deberán manejar identificadores únicos.
- Las relaciones deberán garantizar integridad referencial.
- Las entidades críticas deberán mantener auditoría histórica.
- No deberá permitirse eliminación física de información histórica (excepción: usuarios pueden eliminarse físricamente mediante funcionalidad administrativa).
- Las entidades deberán manejar estados operativos válidos.
- Toda operación crítica deberá ejecutarse mediante transacciones seguras.
- Toda validación crítica deberá ejecutarse en backend.
- Las operaciones deberán registrar usuario, fecha y hora.
- El backend será la única fuente válida de reglas operativas.
- Las evidencias deberán mantenerse persistentes y seguras.

# 11.16 Restricciones de Integridad

| Código | Restricción |
|---|---|
| RI-001 | Todo equipo deberá pertenecer a un proveedor válido |
| RI-002 | Todo equipo deberá pertenecer a un tipo de equipo válido |
| RI-003 | Toda avería deberá asociarse a un equipo existente |
| RI-004 | Toda evidencia deberá asociarse a una entidad válida |
| RI-005 | Toda OSR deberá pertenecer a un PSR válido |
| RI-006 | No deberá existir duplicidad de número de serie |
| RI-007 | No deberá existir más de una campaña activa |
| RI-008 | Toda operación crítica deberá registrar usuario responsable |
| RI-009 | Toda operación crítica deberá registrar fecha y hora |
| RI-010 | Los registros históricos no deberán eliminarse físicamente (excepción: eliminación administrativa de usuarios) |
| RI-011 | No deberán existir averías activas duplicadas por equipo |
| RI-012 | No deberán permitirse operaciones sobre registros inactivos |
| RI-013 | Las evidencias deberán mantener relación persistente con operaciones |
| RI-014 | Los estados operativos deberán mantenerse consistentes |
| RI-015 | Toda operación crítica deberá ejecutarse mediante transacciones atómicas |

# 12. FLUJOS OPERATIVOS

# 12.1 Flujo de Autenticación Corporativa

### Objetivo

Permitir el acceso seguro de usuarios mediante autenticación corporativa Microsoft y generación de JWT.

### Actores Involucrados

- Usuario
- Sistema
- Microsoft OAuth2/OpenID

### Descripción del Flujo

1. El usuario inicia sesión.
2. El sistema redirecciona autenticación Microsoft con `prompt=select_account` para permitir selección/ cambio de cuenta.
3. Microsoft valida credenciales.
4. El backend recibe el código de autorización y lo canjea por un token de acceso.
5. El backend valida el token con Microsoft Graph API verificando: (a) usuario existe en `dim_usuarios`, (b) `accountEnabled` en Azure AD, (c) `estado_activo` en base de datos.
6. El backend genera JWT interno y redirige al frontend con el token.
7. El frontend almacena el token en `localStorage` y redirige al dashboard.

### Manejo de errores y cierre de sesión

- Si el usuario cierra sesión, se limpia `localStorage` y se redirige a `/login?logout=1`, mostrando una pantalla de "Sesión cerrada".
- Si ocurre un error de autenticación, el backend redirige a `/login?error=<mensaje>`, y el frontend muestra un `Alert` con el mensaje y un botón "Intentar de nuevo".
- El frontend no redirige automáticamente a Microsoft cuando los parámetros `?logout=1` o `?error=` están presentes, para evitar bucles de auto-login.

### Validaciones Críticas

- Validación JWT en cada solicitud protegida.
- Validación cuenta activa en Microsoft Graph API.
- Validación expiración token (8 horas).
- Validación de 3 condiciones de login.
- Validación permisos y roles.

### Resultado Esperado

Usuario autenticado correctamente con acceso según permisos asignados.

# 12.2 Flujo de Gestión de Usuarios

### Objetivo

Gestionar usuarios operativos y administrativos del sistema.

### Actores Involucrados

- Administrador
- Sistema

### Descripción del Flujo

1. El administrador registra usuario.
2. El sistema valida unicidad.
3. El sistema asigna rol.
4. El sistema registra auditoría.
5. El usuario queda habilitado.

### Eliminación de Usuarios

1. El administrador selecciona un usuario para eliminar.
2. El sistema muestra un diálogo de confirmación MUI Dialog.
3. Al confirmar, el backend elimina físicamente el registro de `dim_usuarios` (DELETE físico).
4. El sistema registra auditoría de la eliminación.
5. La tabla se recarga automáticamente.

### Validaciones Críticas

- Validación correo único.
- Validación rol válido.
- Validación permisos administrativos.
- Confirmación antes de eliminar (MUI Dialog).
- Eliminación física (no desactivación lógica).

### Resultado Esperado

Usuario registrado y habilitado operativamente, o eliminado físicamente del sistema.

# 12.3 Flujo de Gestión de Campañas

### Objetivo

Administrar campañas operativas activas e históricas.

### Actores Involucrados

- Administrador
- Sistema

### Descripción del Flujo

1. El administrador registra campaña.
2. El sistema valida existencia de campaña activa.
3. El sistema registra campaña.
4. El sistema actualiza estado operacional.

### Validaciones Críticas

- Solo una campaña activa.
- Validación fechas operativas.
- Validación permisos administrativos.

### Resultado Esperado

Campaña registrada y habilitada correctamente.

# 12.4 Flujo de Gestión PSR

### Objetivo

Gestionar pedidos de servicio requeridos asociados a operaciones.

### Actores Involucrados

- Administrador
- Usuario
- Sistema

### Descripción del Flujo

1. El usuario registra PSR.
2. El sistema valida unicidad.
3. El sistema registra información.
4. El sistema genera auditoría.

### Validaciones Críticas

- Validación código único.
- Validación obligatoriedad campos.
- Validación campaña activa.

### Resultado Esperado

PSR registrado correctamente.

# 12.5 Flujo de Gestión OSR

### Objetivo

Gestionar órdenes de servicio relacionadas a operaciones.

### Actores Involucrados

- Administrador
- Usuario
- Sistema

### Descripción del Flujo

1. El usuario registra OSR.
2. El sistema valida PSR asociado.
3. El sistema registra OSR.
4. El sistema habilita asociación de equipos.

### Validaciones Críticas

- Validación PSR existente.
- Validación código único.
- Validación permisos.

### Resultado Esperado

OSR registrada correctamente.

# 12.6 Flujo de Registro de Equipos

### Objetivo

Registrar equipos operativos dentro del sistema.

### Actores Involucrados

- Administrador
- Usuario
- Sistema

### Descripción del Flujo

1. El usuario registra equipo.
2. El sistema valida serie única.
3. El sistema valida proveedor y OSR.
4. El sistema registra equipo.
5. El sistema genera auditoría.

### Validaciones Críticas

- Validación número de serie.
- Validación proveedor activo.
- Validación OSR válida.
- Validación sede asociada.

### Resultado Esperado

Equipo registrado correctamente y disponible operativamente.

# 12.7 Flujo de Recepción de Equipos

### Objetivo

Registrar la recepción física y operacional de equipos.

### Actores Involucrados

- Usuario
- Administrador
- Sistema

### Descripción del Flujo

1. El usuario registra recepción.
2. El sistema valida equipo.
3. El usuario registra evidencias.
4. El sistema actualiza estado.
5. El sistema registra auditoría.

### Validaciones Críticas

- Validación equipo existente.
- Validación evidencias obligatorias.
- Validación estado operacional.

### Resultado Esperado

Recepción registrada correctamente con trazabilidad completa.

# 12.8 Flujo de Entrega de Equipos

### Objetivo

Gestionar la entrega operacional de equipos.

### Actores Involucrados

- Usuario
- Administrador
- Sistema

### Descripción del Flujo

1. El usuario registra entrega.
2. El sistema valida disponibilidad.
3. El sistema actualiza estado.
4. El sistema registra responsable.
5. El sistema genera auditoría.

### Validaciones Críticas

- Validación disponibilidad equipo.
- Validación estado operativo.
- Validación permisos.

### Resultado Esperado

Equipo entregado correctamente.

# 12.9 Flujo de Devolución de Equipos

### Objetivo

Gestionar la devolución operativa de equipos.

### Actores Involucrados

- Usuario
- Administrador
- Sistema

### Descripción del Flujo

1. El usuario registra devolución.
2. El sistema valida entrega previa.
3. El usuario registra evidencias.
4. El sistema actualiza estado.
5. El sistema registra auditoría.

### Validaciones Críticas

- Validación equipo entregado.
- Validación evidencias obligatorias.
- Validación estado final.

### Resultado Esperado

Devolución registrada correctamente.

# 12.10 Flujo de Registro de Averías

### Objetivo

Registrar incidencias operativas asociadas a equipos.

### Actores Involucrados

- Usuario
- Administrador
- Sistema

### Descripción del Flujo

1. El usuario registra avería.
2. El sistema valida equipo.
3. El usuario registra descripción y evidencias.
4. El sistema cambia estado del equipo.
5. El sistema registra auditoría.

### Validaciones Críticas

- Validación equipo existente.
- Validación avería activa.
- Validación evidencias requeridas.

### Resultado Esperado

Avería registrada correctamente.

# 12.11 Flujo de Atención de Averías

### Objetivo

Gestionar la atención y solución de averías operativas.

### Actores Involucrados

- Usuario
- Administrador
- Sistema

### Descripción del Flujo

1. El usuario registra atención.
2. El sistema registra acción correctiva.
3. El sistema calcula tiempo inactivo.
4. El sistema actualiza estado operativo.
5. El sistema registra auditoría.

### Validaciones Críticas

- Validación avería activa.
- Validación solución registrada.
- Validación integridad operacional.

### Resultado Esperado

Avería atendida y cerrada correctamente.

# 12.12 Flujo de Gestión de Evidencias

### Objetivo

Gestionar almacenamiento y asociación de evidencias multimedia.

### Actores Involucrados

- Usuario
- Sistema

### Descripción del Flujo

1. El usuario captura evidencia.
2. El sistema valida formato.
3. El sistema almacena archivo.
4. El sistema asocia evidencia.
5. El sistema registra auditoría.

### Validaciones Críticas

- Validación formato permitido.
- Validación tamaño máximo.
- Validación asociación válida.

### Resultado Esperado

Evidencia almacenada correctamente.

# 12.13 Flujo de Gestión de Proveedores

### Objetivo

Gestionar proveedores operativos del sistema.

### Actores Involucrados

- Administrador
- Sistema

### Descripción del Flujo

1. El administrador registra proveedor.
2. El sistema valida RUC.
3. El sistema registra proveedor.
4. El sistema habilita asociación operacional.

### Validaciones Críticas

- Validación RUC único.
- Validación datos obligatorios.
- Validación estado operacional.

### Resultado Esperado

Proveedor registrado correctamente.

# 12.14 Flujo de Dashboard KPI

### Objetivo

Visualizar indicadores operativos consolidados.

### Actores Involucrados

- Usuario
- Administrador
- Sistema

### Descripción del Flujo

1. El usuario accede al dashboard.
2. El sistema consolida información.
3. El sistema calcula KPI.
4. El sistema visualiza indicadores.

### Validaciones Críticas

- Validación información consolidada.
- Validación campaña activa.
- Validación permisos acceso.

### Resultado Esperado

Dashboard mostrado correctamente con métricas actualizadas.

# 12.15 Flujo de Generación de Reportes PDF

### Objetivo

Generar reportes operativos en formato PDF.

### Actores Involucrados

- Usuario
- Administrador
- Sistema

### Descripción del Flujo

1. El usuario selecciona filtros.
2. El sistema consolida información.
3. El sistema genera PDF.
4. El sistema registra auditoría.
5. El usuario descarga reporte.

### Validaciones Críticas

- Validación filtros.
- Validación información existente.
- Validación permisos.

### Resultado Esperado

Reporte PDF generado correctamente.

# 12.16 Flujo de Auditoría

### Objetivo

Registrar trazabilidad completa de operaciones críticas.

### Actores Involucrados

- Sistema
- Administrador

### Descripción del Flujo

1. El sistema detecta operación crítica.
2. El sistema registra evento.
3. El sistema almacena trazabilidad.
4. El administrador consulta historial.

### Validaciones Críticas

- Validación integridad registros.
- Validación persistencia histórica.
- Validación usuario asociado.

### Resultado Esperado

Operación auditada correctamente.

# 12.17 Flujo de Configuración del Sistema

### Objetivo

Gestionar parámetros globales del sistema.

### Actores Involucrados

- Administrador
- Sistema

### Descripción del Flujo

1. El administrador modifica configuración.
2. El sistema valida permisos.
3. El sistema actualiza parámetros.
4. El sistema registra auditoría.

### Validaciones Críticas

- Validación permisos administrativos.
- Validación parámetros válidos.
- Validación integridad operacional.

### Resultado Esperado

Configuración actualizada correctamente.

# 12.18 Flujo de Cambio de Estado de Equipos

### Objetivo

Gestionar cambios operativos de estado de equipos.

### Actores Involucrados

- Sistema
- Usuario
- Administrador

### Descripción del Flujo

1. Se ejecuta operación operacional.
2. El sistema valida transición de estado.
3. El sistema actualiza estado equipo.
4. El sistema registra auditoría.

### Validaciones Críticas

- Validación estado actual.
- Validación transición permitida.
- Validación integridad operacional.

### Resultado Esperado

Estado del equipo actualizado consistentemente.

# 12.19 Flujo de Validación de Evidencias Obligatorias

### Objetivo

Garantizar registro obligatorio de evidencias operativas.

### Actores Involucrados

- Usuario
- Sistema

### Descripción del Flujo

1. El usuario ejecuta operación.
2. El sistema valida obligatoriedad.
3. El usuario adjunta evidencias.
4. El sistema valida archivos.
5. El sistema permite continuar operación.

### Validaciones Críticas

- Validación cantidad mínima.
- Validación formatos permitidos.
- Validación tamaño máximo.

### Resultado Esperado

Operación registrada con evidencias válidas.

# 12.20 Flujo de Validaciones Transaccionales

### Objetivo

Garantizar integridad transaccional en operaciones críticas.

### Actores Involucrados

- Sistema

### Descripción del Flujo

1. El sistema inicia transacción.
2. El sistema ejecuta operación.
3. El sistema valida integridad.
4. El sistema confirma o revierte cambios.

### Validaciones Críticas

- Validación atomicidad.
- Validación integridad referencial.
- Validación persistencia completa.

### Resultado Esperado

Operaciones ejecutadas consistentemente.

# 12.21 Flujo de Manejo de Errores Operacionales

### Objetivo

Gestionar errores operativos y técnicos del sistema.

### Actores Involucrados

- Usuario
- Sistema

### Descripción del Flujo

1. El sistema detecta error.
2. El sistema registra incidente.
3. El sistema muestra mensaje operacional.
4. El sistema mantiene integridad transaccional.

### Validaciones Críticas

- Validación rollback.
- Validación auditoría errores.
- Validación mensajes controlados.

### Resultado Esperado

Errores gestionados sin afectar integridad del sistema.

# 12.22 Flujo de Integración Mobile Backend

### Objetivo

Gestionar comunicación entre APK React Native y backend Quarkus.

### Actores Involucrados

- APK Mobile
- Backend
- Sistema

### Descripción del Flujo

1. La APK consume API REST.
2. El backend valida JWT.
3. El backend procesa operación.
4. El backend responde información.
5. La APK actualiza interfaz.

### Validaciones Críticas

- Validación JWT.
- Validación conectividad.
- Validación integridad request/response.

### Resultado Esperado

Integración mobile-backend ejecutada correctamente.´

# 13. REPORTES

## 13.1 Objetivo de los Reportes

El sistema deberá permitir la generación de reportes operativos, técnicos, gerenciales y de auditoría con el fin de garantizar trazabilidad, control operacional, seguimiento técnico y consolidación de indicadores KPI.

Los reportes deberán permitir exportación en formato PDF y deberán utilizar información validada y consolidada desde el backend.

## 13.2 Consideraciones Generales

- Todos los reportes deberán validar permisos de acceso.
- Los reportes deberán generarse utilizando información consolidada y validada.
- Toda generación de reportes deberá registrarse en auditoría.
- Los reportes deberán permitir filtros operacionales.
- Los reportes deberán mantener trazabilidad histórica.
- Los reportes deberán generarse desde backend.
- El sistema deberá permitir exportación PDF.
- Los reportes críticos deberán utilizar información transaccional consistente.

# 13.3 Reportes Operativos

## 13.3.1 Reporte General de Equipos

### Objetivo

Visualizar información consolidada de equipos operativos registrados.

### Tipo de Reporte

Operacional

### Actores Involucrados

- Usuario
- Administrador

### Información Incluida

- Código equipo
- Número serie
- Tipo equipo
- Marca
- Proveedor
- Estado operativo
- Sede
- OSR asociada
- Campaña

### Filtros Disponibles

- Estado
- Proveedor
- Sede
- Campaña
- Tipo equipo

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación permisos
- Validación información consolidada
- Validación integridad operacional

### Resultado Esperado

Reporte generado correctamente con información operacional actualizada.

## 13.3.2 Reporte de Equipos Averiados

### Objetivo

Visualizar equipos con incidencias operativas registradas.

### Tipo de Reporte

Operacional

### Actores Involucrados

- Usuario
- Administrador

### Información Incluida

- Equipo
- Estado avería
- Fecha reporte
- Tiempo inactividad
- Responsable
- Acción correctiva

### Filtros Disponibles

- Estado avería
- Fecha
- Proveedor
- Campaña

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación averías activas
- Validación integridad histórica
- Validación permisos

### Resultado Esperado

Reporte generado correctamente con incidencias operativas.

## 13.3.3 Reporte Histórico de Averías

### Objetivo

Visualizar historial completo de averías registradas.

### Tipo de Reporte

Operacional

### Actores Involucrados

- Usuario
- Administrador

### Información Incluida

- Equipo
- Descripción avería
- Fecha reporte
- Fecha cierre
- Acción correctiva
- Tiempo atención
- Evidencias

### Filtros Disponibles

- Fecha
- Equipo
- Proveedor
- Estado

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación trazabilidad
- Validación historial consistente
- Validación permisos

### Resultado Esperado

Reporte histórico generado correctamente.

## 13.3.4 Reporte de Recepción de Equipos

### Objetivo

Visualizar operaciones de recepción de equipos.

### Tipo de Reporte

Operacional

### Actores Involucrados

- Usuario
- Administrador

### Información Incluida

- Equipo
- Fecha recepción
- Responsable
- Estado recepción
- Evidencias
- Observaciones

### Filtros Disponibles

- Fecha
- Estado
- Proveedor
- Sede

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación evidencias
- Validación operaciones registradas
- Validación permisos

### Resultado Esperado

Reporte de recepciones generado correctamente.

## 13.3.5 Reporte de Devolución de Equipos

### Objetivo

Visualizar operaciones de devolución de equipos.

### Tipo de Reporte

Operacional

### Actores Involucrados

- Usuario
- Administrador

### Información Incluida

- Equipo
- Fecha devolución
- Responsable
- Estado final
- Evidencias
- Observaciones

### Filtros Disponibles

- Fecha
- Proveedor
- Estado
- Campaña

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación evidencias obligatorias
- Validación integridad operacional
- Validación permisos

### Resultado Esperado

Reporte de devoluciones generado correctamente.

## 13.3.6 Reporte de Campañas

### Objetivo

Visualizar operaciones asociadas a campañas.

### Tipo de Reporte

Operacional

### Actores Involucrados

- Usuario
- Administrador

### Información Incluida

- Campaña
- Equipos asociados
- Averías
- KPI
- Estado campaña

### Filtros Disponibles

- Campaña
- Fecha
- Estado

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación campaña existente
- Validación integridad información
- Validación permisos

### Resultado Esperado

Reporte de campañas generado correctamente.

## 13.3.7 Reporte de OSR y PSR

### Objetivo

Visualizar información documental operacional.

### Tipo de Reporte

Operacional

### Actores Involucrados

- Usuario
- Administrador

### Información Incluida

- Código PSR
- Código OSR
- Equipos asociados
- Estado operacional
- Fechas registro

### Filtros Disponibles

- PSR
- OSR
- Estado
- Fecha

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación relaciones documentales
- Validación integridad operacional
- Validación permisos

### Resultado Esperado

Reporte documental generado correctamente.

# 13.4 Reportes Gerenciales KPI

## 13.4.1 Reporte KPI Operacional

### Objetivo

Visualizar indicadores operativos consolidados del sistema.

### Tipo de Reporte

Gerencial

### Actores Involucrados

- Administrador
- Supervisor

### Información Incluida

- Disponibilidad equipos
- Total averías
- Tiempo inactividad
- KPI proveedor
- KPI campañas

### Filtros Disponibles

- Fecha
- Campaña
- Sede
- Proveedor

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación cálculos KPI
- Validación consolidación información
- Validación permisos

### Resultado Esperado

Reporte KPI generado correctamente.

## 13.4.2 Reporte de Disponibilidad Operacional

### Objetivo

Visualizar disponibilidad operacional de equipos.

### Tipo de Reporte

Gerencial

### Actores Involucrados

- Administrador
- Supervisor

### Información Incluida

- Equipos operativos
- Equipos averiados
- Porcentaje disponibilidad
- Disponibilidad por proveedor
- Disponibilidad por sede

### Filtros Disponibles

- Fecha
- Proveedor
- Sede
- Campaña

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación estados operativos
- Validación cálculos porcentuales
- Validación permisos

### Resultado Esperado

Reporte de disponibilidad generado correctamente.

## 13.4.3 Reporte de Tiempos de Inactividad

### Objetivo

Visualizar tiempos de indisponibilidad operacional.

### Tipo de Reporte

Gerencial

### Actores Involucrados

- Administrador
- Supervisor

### Información Incluida

- Tiempo fuera servicio
- Tiempo atención
- Tiempo recuperación
- Promedio averías

### Filtros Disponibles

- Fecha
- Equipo
- Proveedor
- Campaña

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación cálculos automáticos
- Validación historial averías
- Validación permisos

### Resultado Esperado

Reporte de inactividad generado correctamente.

## 13.4.4 Reporte por Proveedor

### Objetivo

Visualizar desempeño operacional de proveedores.

### Tipo de Reporte

Gerencial

### Actores Involucrados

- Administrador
- Supervisor

### Información Incluida

- Equipos asociados
- Total averías
- Disponibilidad
- Incidencias
- Estado proveedor

### Filtros Disponibles

- Proveedor
- Fecha
- Campaña

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación proveedor válido
- Validación KPI proveedor
- Validación permisos

### Resultado Esperado

Reporte por proveedor generado correctamente.

# 13.5 Reportes de Auditoría

## 13.5.1 Reporte de Auditoría

### Objetivo

Visualizar trazabilidad completa de operaciones críticas.

### Tipo de Reporte

Auditoría

### Actores Involucrados

- Administrador

### Información Incluida

- Usuario
- Operación
- Fecha
- Hora
- IP
- Módulo
- Resultado operación

### Filtros Disponibles

- Usuario
- Fecha
- Módulo
- Operación

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación integridad auditoría
- Validación historial persistente
- Validación permisos administrativos

### Resultado Esperado

Reporte de auditoría generado correctamente.

## 13.5.2 Reporte de Operaciones por Usuario

### Objetivo

Visualizar operaciones ejecutadas por usuario.

### Tipo de Reporte

Auditoría

### Actores Involucrados

- Administrador

### Información Incluida

- Usuario
- Operaciones ejecutadas
- Módulos utilizados
- Fecha actividad
- Cantidad operaciones

### Filtros Disponibles

- Usuario
- Fecha
- Módulo

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación trazabilidad
- Validación permisos
- Validación integridad operacional

### Resultado Esperado

Reporte de actividad por usuario generado correctamente.

## 13.5.3 Reporte de Trazabilidad de Estados

### Objetivo

Visualizar historial de cambios de estado operativos.

### Tipo de Reporte

Auditoría

### Actores Involucrados

- Administrador
- Supervisor

### Información Incluida

- Equipo
- Estado anterior
- Estado nuevo
- Fecha cambio
- Usuario responsable

### Filtros Disponibles

- Equipo
- Fecha
- Estado
- Usuario

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación historial cambios
- Validación integridad estados
- Validación permisos

### Resultado Esperado

Reporte de trazabilidad generado correctamente.

# 13.6 Reportes Técnicos

## 13.6.1 Reporte de Evidencias

### Objetivo

Visualizar evidencias multimedia asociadas a operaciones.

### Tipo de Reporte

Técnico

### Actores Involucrados

- Usuario
- Administrador

### Información Incluida

- Evidencia
- Operación asociada
- Usuario
- Fecha
- Tipo archivo

### Filtros Disponibles

- Fecha
- Tipo operación
- Usuario
- Equipo

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación archivos existentes
- Validación asociaciones
- Validación permisos

### Resultado Esperado

Reporte de evidencias generado correctamente.

## 13.6.2 Reporte de Incidencias Críticas

### Objetivo

Visualizar errores e incidencias operativas críticas.

### Tipo de Reporte

Técnico

### Actores Involucrados

- Administrador
- Supervisor

### Información Incluida

- Error registrado
- Operación afectada
- Fecha incidente
- Estado incidente
- Equipo asociado

### Filtros Disponibles

- Fecha
- Tipo incidente
- Estado

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación incidencias registradas
- Validación integridad operacional
- Validación permisos

### Resultado Esperado

Reporte de incidencias generado correctamente.

## 13.6.3 Reporte de Integridad Operacional

### Objetivo

Detectar inconsistencias operacionales y referenciales.

### Tipo de Reporte

Técnico

### Actores Involucrados

- Administrador

### Información Incluida

- Equipos sin proveedor
- Equipos sin OSR
- Averías inconsistentes
- Evidencias faltantes
- Registros inválidos

### Filtros Disponibles

- Tipo inconsistencia
- Fecha
- Módulo

### Formato de Salida

- PDF

### Validaciones Críticas

- Validación integridad referencial
- Validación consistencia operacional
- Validación permisos administrativos

### Resultado Esperado

Reporte de integridad generado correctamente.

# 14. CONSIDERACIONES TÉCNICAS

## 14.1 Objetivo Técnico

El sistema deberá implementar una arquitectura tecnológica moderna, segura, mantenible y escalable que permita gestionar operaciones logísticas, control de equipos, averías, evidencias multimedia y trazabilidad operacional mediante aplicaciones web y mobile integradas con servicios backend centralizados.

La arquitectura deberá garantizar:

- Seguridad transaccional.
- Integridad operacional.
- Trazabilidad completa.
- Persistencia segura.
- Escalabilidad controlada.
- Mantenibilidad del sistema.
- Separación de responsabilidades.
- Integración multiplataforma.

## 14.2 Arquitectura General del Sistema

La solución estará compuesta por:

- Backend API REST desarrollado en Quarkus.
- Frontend web desarrollado en React.
- Aplicación móvil APK desarrollada en React Native.
- Base de datos relacional PostgreSQL.
- Infraestructura contenerizada mediante Docker Compose.
- Autenticación JWT integrada con Microsoft (pendiente configuración OIDC).
- Persistencia de archivos multimedia mediante Docker Volumes Persistentes.
- Comunicación mediante APIs REST JSON.
- Migraciones de esquema gestionadas mediante Flyway.

## 14.3 Backend Quarkus

### Descripción

El backend será desarrollado utilizando Quarkus como framework principal para la exposición de APIs REST y lógica de negocio.

### Responsabilidades

- Gestión de lógica operacional.
- Validaciones de negocio.
- Seguridad JWT.
- Persistencia de datos.
- Auditoría.
- Gestión transaccional.
- Exposición de APIs REST.
- Integración con frontend web y APK.

### Consideraciones Técnicas

- Uso de Quarkus 3.15.1 con Java 21.
- Uso de RESTEasy Reactive para APIs REST.
- Uso de Hibernate ORM con Panache para persistencia.
- Uso de transacciones JPA.
- Validaciones Bean Validation.
- Arquitectura basada en capas (Resource → Service → Repository → Entity).
- Validaciones server-side obligatorias.
- JWT gestionado mediante SmallRye JWT (OIDC pendiente configuración Microsoft).
- Migraciones de base de datos gestionadas con Flyway.
- OpenAPI/Swagger UI integrado en `/swagger/`.
- Health checks con SmallRye Health en `/q/health`.

## 14.4 Frontend Web React

### Descripción

El frontend web será desarrollado utilizando React para operaciones administrativas y visualización operacional.

### Responsabilidades

- Gestión administrativa.
- Visualización KPI.
- Gestión operacional.
- Consumo APIs REST.
- Gestión autenticación JWT.

### Consideraciones Técnicas

- Arquitectura SPA.
- Consumo APIs REST JSON.
- Gestión estado frontend.
- Manejo seguro JWT.
- Validaciones cliente complementarias.
- Manejo controlado de errores.

## 14.5 Frontend Mobile React Native APK

### Descripción

La aplicación móvil será desarrollada utilizando React Native para operaciones de campo y captura operacional.

### Responsabilidades

- Registro operativo.
- Captura evidencias.
- Registro averías.
- Recepción y devolución equipos.
- Consumo APIs REST.

### Consideraciones Técnicas

- Operación completamente online.
- Consumo APIs REST.
- Captura multimedia.
- Validación JWT.
- Manejo de cámara y archivos.
- Manejo de errores de conectividad.

### Restricciones Técnicas

- La APK requerirá conexión permanente a internet.
- No se contemplará funcionamiento offline.
- No se implementará sincronización local.

## 14.6 Base de Datos PostgreSQL

### Descripción

El sistema utilizará PostgreSQL 18 como motor de base de datos relacional principal, ejecutándose en un contenedor Docker.

### Responsabilidades

- Persistencia operacional.
- Relaciones transaccionales.
- Integridad referencial.
- Auditoría histórica.

### Consideraciones Técnicas

- Uso de claves primarias y foráneas.
- Constraints relacionales.
- Índices operacionales.
- Integridad transaccional ACID.
- Optimización consultas críticas.
- Migraciones de esquema mediante Flyway.
- Tablas con prefijo `dim_` (dim_roles, dim_sedes, dim_usuarios, etc.).

## 14.7 Persistencia ORM

### Descripción

La persistencia será gestionada mediante Hibernate ORM y Panache sobre Quarkus.

### Responsabilidades

- Mapeo objeto-relacional.
- Gestión transaccional.
- Persistencia entidades.
- Integridad relacional.

### Consideraciones Técnicas

- Uso JPA/Hibernate.
- Relaciones OneToMany y ManyToOne.
- Lazy Loading controlado.
- Transacciones atómicas.
- Validación persistencia.

## 14.8 Infraestructura Docker

### Descripción

La solución será desplegada mediante contenedores Docker.

### Responsabilidades

- Aislamiento servicios.
- Portabilidad despliegue.
- Gestión entornos.
- Persistencia controlada.

### Consideraciones Técnicas

- Contenedor backend (Quarkus uber-jar, Java 21).
- Contenedor frontend web (React, servido por Nginx).
- Contenedor PostgreSQL 18.
- Contenedor Nginx (reverse proxy).
- Redes Docker internas (bridge).
- Docker Volumes persistentes (postgres_data, multimedia_data).
- Variables de entorno (`.env`).
- Orquestación mediante Docker Compose.

## 14.9 Persistencia de Evidencias Multimedia

### Descripción

Las evidencias multimedia serán almacenadas persistentemente dentro del servidor mediante Docker Volumes Persistentes.

### Justificación Técnica

La utilización de Docker Volumes Persistentes permitirá:

- Persistencia segura de archivos multimedia.
- Integración directa con infraestructura Docker.
- Menor complejidad operativa.
- Reducción de costos de infraestructura.
- Facilidad de despliegue y mantenimiento.
- Administración centralizada dentro del servidor VPS.

### Consideraciones Técnicas

- Persistencia obligatoria.
- Asociación relacional con operaciones.
- Restricción eliminación física.
- Validación formatos multimedia.
- Validación tamaño máximo archivos.
- Organización estructurada de directorios.
- Acceso controlado desde backend.

## 14.10 API REST

### Descripción

La comunicación entre frontend y backend se realizará mediante APIs REST.

### Consideraciones Técnicas

- Comunicación JSON.
- Uso HTTP/HTTPS.
- Versionamiento API.
- Endpoints protegidos JWT.
- Validaciones server-side.
- Respuestas estandarizadas.

### Estructura Implementada

```text
/api/v1/usuarios        # CRUD Usuarios
/api/v1/roles           # CRUD Roles
```

### Configuración

- Base path configurado en `application.properties` mediante `quarkus.resteasy-reactive.path=/api/v1`.
- Documentación OpenAPI disponible en `/q/openapi`.
- Swagger UI disponible en `/swagger/`.
- Health check en `/q/health` (expuesto públicamente como `/health`).

## 14.11 Seguridad JWT y Microsoft Authentication

### Descripción

La autenticación utilizará integración Microsoft OAuth2/OpenID y JWT para autorización interna.

### Responsabilidades

- Autenticación corporativa.
- Validación sesiones.
- Protección endpoints.
- Gestión permisos.

### Consideraciones Técnicas

- Validación JWT por request.
- Middleware autenticación.
- Expiración sesiones.
- Claims y roles.
- Protección APIs REST.

## 14.12 Reverse Proxy NGINX

### Descripción

NGINX será utilizado como reverse proxy principal.

### Responsabilidades

- Routing servicios.
- Gestión HTTPS.
- Balanceo futuro.
- Protección frontend/backend.

### Consideraciones Técnicas

- Proxy frontend/backend.
- Configuración HTTPS.
- Manejo uploads.
- Compresión respuestas.
- Seguridad cabeceras.

## 14.13 Gestión de Configuración

### Descripción

La configuración del sistema será gestionada mediante variables de entorno y propiedades Quarkus.

### Consideraciones Técnicas

- Variables ENV.
- application.properties.
- Configuración por ambiente.
- Separación dev/qa/prod.
- Configuración segura credenciales.

## 14.14 Manejo de Logs

### Descripción

El sistema deberá generar logs técnicos y operacionales para monitoreo y soporte.

### Consideraciones Técnicas

- Logs backend Quarkus.
- Logs errores críticos.
- Logs autenticación.
- Logs operaciones críticas.
- Persistencia eventos importantes.

## 14.15 Gestión Multimedia

### Descripción

El sistema permitirá gestión controlada de evidencias multimedia.

### Consideraciones Técnicas

- Validación formatos permitidos.
- Validación tamaño máximo.
- Compresión archivos.
- Naming controlado.
- Persistencia segura.

### Formatos Permitidos

- JPG
- JPEG
- PNG

## 14.16 Seguridad CORS

### Descripción

El backend deberá implementar políticas CORS controladas.

### Consideraciones Técnicas

- Restricción orígenes permitidos.
- Restricción métodos HTTP.
- Restricción cabeceras.
- Protección APIs.

## 14.17 Swagger/OpenAPI

### Descripción

El backend expondrá documentación técnica de APIs mediante Swagger/OpenAPI.

### Responsabilidades

- Documentación APIs.
- Testing endpoints.
- Integración frontend.
- Validación contratos API.

### Consideraciones Técnicas

- OpenAPI Quarkus.
- Documentación automática.
- Endpoints documentados.
- Seguridad endpoints protegidos.

## 14.18 Auditoría Técnica

### Descripción

Las operaciones críticas deberán registrar trazabilidad técnica automática.

### Consideraciones Técnicas

- Interceptores backend.
- Registro operaciones críticas.
- Registro errores críticos.
- Persistencia auditoría.
- Asociación usuario/IP.

## 14.19 Estrategia de Backup

### Descripción

El sistema deberá implementar mecanismos de respaldo para información crítica.

### Consideraciones Técnicas

- Backup PostgreSQL (pg_dump).
- Backup evidencias multimedia (Docker Volumes).
- Persistencia Docker Volumes.
- Recuperación operacional.
- Respaldo histórico.

## 14.20 Estrategia de Despliegue

### Descripción

El sistema será desplegado sobre infraestructura on-premise VPS/Servidor mediante Docker Compose.

### Consideraciones Técnicas

- Despliegue contenerizado con Docker Compose.
- Redes internas Docker (bridge).
- Persistencia volúmenes (postgres_data, multimedia_data).
- Exposición controlada servicios (puerto 80 Nginx, backend interno).
- Backend expuesto como uber-jar construido con Maven multi-stage.
- Nginx como reverse proxy para API, Swagger UI y frontend.
- Health checks de contenedores para PostgreSQL y backend.
- Construcción de imágenes con Dockerfile multi-etapa.

## 14.21 Gestión de Roles y Permisos

### Descripción

La seguridad funcional será gestionada mediante roles y permisos JWT.

### Consideraciones Técnicas

- Middleware autorización.
- Protección endpoints.
- Validación roles.
- Claims JWT.
- Restricción acceso módulos.

## 14.22 Validaciones Backend

### Descripción

Las reglas críticas deberán validarse principalmente desde backend.

### Consideraciones Técnicas

- Bean Validation.
- Validaciones negocio.
- Validaciones transaccionales.
- Validaciones integridad referencial.
- Validaciones estados operativos.

## 14.23 Gestión de Estados Operacionales

### Descripción

Los estados operativos serán controlados desde backend.

### Consideraciones Técnicas

- Uso ENUM controlados.
- Restricción transiciones inválidas.
- Integridad estados.
- Consistencia operacional.

## 14.24 Monitoreo y Health Checks

### Descripción

El sistema deberá implementar monitoreo técnico básico.

### Consideraciones Técnicas

- Quarkus Health Checks.
- Estado servicios.
- Validación conectividad DB.
- Validación disponibilidad APIs.
- Validación estado aplicación.

## 14.25 Estado de Implementación Actual

### Implementado (v1.1)

- Infraestructura Docker Compose completa (PostgreSQL + Backend + Nginx).
- Backend Quarkus 3.15.1 con Java 21 compilado como uber-jar.
- Entidades base: `dim_roles`, `dim_usuarios` con JPA/Hibernate Panache.
- Repositorios, servicios y controladores REST para Usuarios y Roles.
- Flyway migrations para creación inicial y seed de datos (roles ADMIN/USER).
- API REST documentada con Swagger/OpenAI accesible en `/swagger/`.
- Health checks del backend y base de datos en `/health`.
- Nginx como reverse proxy con enrutamiento a backend y frontend.

### Pendiente

- Integración Microsoft OIDC (quarkus-oidc deshabilitado temporalmente).
- Frontend React (SPA de administración).
- Módulos restantes (Sedes, Campañas, PSR/OSR, Equipos, Averías, etc.).
- APK React Native.
- Reportes PDF.

## 14.26 Consideraciones Generales

- Toda validación crítica deberá ejecutarse server-side.
- El backend será la única fuente válida de reglas operativas.
- Las operaciones críticas deberán ejecutarse mediante transacciones seguras.
- Los endpoints deberán protegerse mediante JWT.
- La información histórica no deberá eliminarse físicamente.
- La arquitectura deberá mantener separación de responsabilidades.
- La solución deberá permitir mantenibilidad y escalabilidad controlada.
- Toda integración deberá realizarse mediante APIs REST.
- El despliegue deberá soportar entornos dev, qa y producción.
- Las evidencias multimedia deberán mantenerse persistentes y seguras.

# 15. PENDIENTES FUNCIONALES

## 15.1 Objetivo

El presente apartado documenta las funcionalidades, restricciones y capacidades no contempladas dentro de la fase actual del sistema, pero que podrían formar parte de futuras evoluciones funcionales o técnicas del proyecto.

El objetivo es establecer claramente el alcance funcional actual del sistema y mantener trazabilidad sobre posibles mejoras futuras, evitando ambigüedades durante el desarrollo, implementación y mantenimiento de la solución.

## 15.2 Consideraciones Generales

- Los pendientes funcionales documentados no forman parte del alcance obligatorio de la versión actual.
- Las funcionalidades pendientes no deberán afectar la estabilidad operacional del sistema actual.
- Las funcionalidades futuras deberán respetar la arquitectura tecnológica definida.
- Toda evolución funcional deberá mantener compatibilidad con la seguridad JWT y validaciones backend.
- Los pendientes funcionales no deberán comprometer la integridad operacional existente.
- Las funcionalidades futuras deberán evaluarse según prioridad operacional y complejidad técnica.
- La arquitectura actual deberá permitir escalabilidad controlada para futuras implementaciones.

# 15.3 Pendientes Funcionales Identificados

## 15.3.1 Gestión Avanzada de Permisos

### Descripción

Actualmente el sistema contempla manejo de roles y permisos básicos mediante JWT y validaciones backend.

No se contempla una administración granular avanzada de permisos por acción específica, módulo dinámico o configuración personalizada por usuario.

### Estado Actual

No contemplado en la fase actual.

### Impacto Operacional

El modelo actual cubre correctamente las necesidades operacionales iniciales.

### Consideración Técnica

La arquitectura backend deberá permitir futura ampliación de políticas RBAC avanzadas.

### Prioridad

Media.

### Observaciones

La implementación futura podría requerir:

- matrices dinámicas de permisos,
- permisos parametrizables,
- políticas avanzadas de autorización.

## 15.3.2 Notificaciones Automáticas

### Descripción

No se contempla implementación de notificaciones automáticas push, correos electrónicos o alertas operacionales automáticas.

### Estado Actual

No contemplado en la fase actual.

### Impacto Operacional

Las operaciones deberán gestionarse manualmente desde el sistema.

### Consideración Técnica

La arquitectura deberá permitir futuras integraciones de servicios de mensajería y notificaciones.

### Prioridad

Media.

### Observaciones

En futuras versiones podrían contemplarse:

- alertas de averías,
- alertas de campañas,
- recordatorios operacionales,
- notificaciones administrativas.

## 15.3.3 Dashboard KPI Avanzado

### Descripción

El sistema contemplará indicadores KPI operacionales básicos, pero no incluirá analítica avanzada ni herramientas BI empresariales.

### Estado Actual

Parcialmente contemplado.

### Impacto Operacional

La operación contará con indicadores suficientes para control operacional inicial.

### Consideración Técnica

La arquitectura deberá permitir futura integración con herramientas analíticas.

### Prioridad

Media.

### Observaciones

No se contempla actualmente:

- BI avanzado,
- análisis predictivo,
- analytics complejos,
- consolidación histórica avanzada.

## 15.3.4 Exportaciones Adicionales

### Descripción

La generación de reportes se limitará inicialmente a exportación PDF.

### Estado Actual

Limitado a PDF.

### Impacto Operacional

La exportación PDF cubre las necesidades documentales actuales.

### Consideración Técnica

La arquitectura podrá ampliarse posteriormente para soportar otros formatos.

### Prioridad

Baja.

### Observaciones

No se contemplan actualmente:

- Excel,
- CSV,
- Power BI,
- integraciones analíticas externas.

## 15.3.5 Operación Offline APK

### Descripción

La aplicación móvil React Native operará exclusivamente mediante conexión online.

### Estado Actual

No contemplado funcionamiento offline.

### Impacto Operacional

La APK requerirá conectividad permanente para operar correctamente.

### Consideración Técnica

No se implementarán mecanismos de sincronización local ni almacenamiento offline.

### Prioridad

Baja.

### Observaciones

No se contemplan actualmente:

- SQLite local,
- sincronización diferida,
- colas offline,
- resolución de conflictos.

## 15.3.6 Integración Cloud Storage

### Descripción

El almacenamiento multimedia utilizará Docker Volumes Persistentes dentro del servidor VPS.

### Estado Actual

Implementación local persistente.

### Impacto Operacional

La solución actual cubre adecuadamente el alcance operacional definido.

### Consideración Técnica

La arquitectura podrá evolucionar hacia almacenamiento cloud si el crecimiento operacional lo requiere.

### Prioridad

Media.

### Observaciones

No se contemplan actualmente integraciones con:

- Amazon S3,
- Azure Blob Storage,
- MinIO,
- almacenamiento distribuido.

## 15.3.7 Alta Disponibilidad Infraestructura

### Descripción

La solución será desplegada inicialmente sobre infraestructura VPS/Servidor único.

### Estado Actual

No contemplada arquitectura HA.

### Impacto Operacional

La solución dependerá inicialmente de una única infraestructura principal.

### Consideración Técnica

La arquitectura Docker permitirá futura escalabilidad horizontal controlada.

### Prioridad

Media.

### Observaciones

No se contemplan actualmente:

- clustering,
- balanceadores HA,
- replicas activas,
- redundancia multi-servidor.

## 15.3.8 Monitoreo Avanzado

### Descripción

El sistema implementará únicamente monitoreo básico mediante health checks y logs backend.

### Estado Actual

Monitoreo básico contemplado.

### Impacto Operacional

El monitoreo básico será suficiente para soporte inicial.

### Consideración Técnica

La arquitectura podrá integrarse posteriormente con plataformas de observabilidad enterprise.

### Prioridad

Media.

### Observaciones

No se contemplan actualmente:

- Prometheus,
- Grafana,
- ELK Stack,
- observabilidad distribuida.

## 15.3.9 Integraciones Externas

### Descripción

El sistema operará inicialmente de manera independiente sin integraciones externas empresariales.

### Estado Actual

No contempladas integraciones externas.

### Impacto Operacional

La operación será administrada completamente desde el sistema principal.

### Consideración Técnica

La arquitectura REST permitirá futuras integraciones.

### Prioridad

Media.

### Observaciones

No se contemplan actualmente integraciones con:

- ERP,
- SAP,
- sistemas logísticos externos,
- plataformas corporativas adicionales.

## 15.3.10 Versionado Histórico de Evidencias

### Descripción

Las evidencias multimedia serán persistentes, pero no contarán con control de versiones históricas.

### Estado Actual

Persistencia simple contemplada.

### Impacto Operacional

La operación mantendrá trazabilidad básica de evidencias.

### Consideración Técnica

La arquitectura podrá evolucionar posteriormente hacia control histórico multimedia.

### Prioridad

Baja.

### Observaciones

No se contempla actualmente:

- versionado archivos,
- historial reemplazos,
- control versiones multimedia.

## 15.3.11 Firma Digital Operacional

### Descripción

El sistema no contemplará firma digital para validaciones operacionales.

### Estado Actual

No contemplado en fase actual.

### Impacto Operacional

Las validaciones operacionales se realizarán mediante autenticación y auditoría estándar.

### Consideración Técnica

La arquitectura podrá integrar mecanismos de firma digital posteriormente.

### Prioridad

Baja.

### Observaciones

No se contemplan actualmente:

- firmas manuscritas digitales,
- conformidad biométrica,
- certificados digitales.

## 15.3.12 Arquitectura Multiempresa

### Descripción

La solución operará inicialmente bajo un esquema single-tenant.

### Estado Actual

No contemplado entorno multiempresa.

### Impacto Operacional

La solución será utilizada para una única organización operacional.

### Consideración Técnica

La arquitectura actual no contempla segregación multiempresa.

### Prioridad

Baja.

### Observaciones

No se contemplan actualmente:

- multicliente,
- multiempresa,
- segregación tenant,
- administración corporativa distribuida.

# 15.4 Restricciones Funcionales Actuales

## 15.4.1 Restricciones Operacionales

- La APK requerirá conexión permanente a internet.
- No existirá funcionamiento offline.
- El sistema utilizará autenticación Microsoft corporativa obligatoria.
- El almacenamiento multimedia será local mediante Docker Volumes Persistentes.
- El sistema utilizará exportación PDF como único formato documental inicial.
- La infraestructura inicial será desplegada sobre VPS/Servidor on-premise.

## 15.4.2 Restricciones Técnicas

- No se contemplarán microservicios en la fase actual.
- No se contemplará infraestructura Kubernetes.
- No se implementarán colas distribuidas.
- No se implementarán integraciones cloud avanzadas.
- No se contemplará inteligencia artificial ni analítica predictiva.
- No se implementará sincronización offline.

# 15.5 Consideraciones Finales

- Los pendientes funcionales deberán evaluarse según crecimiento operacional.
- Toda ampliación funcional deberá respetar la arquitectura definida.
- Las futuras implementaciones deberán mantener compatibilidad con reglas de negocio existentes.
- Las ampliaciones futuras deberán priorizar mantenibilidad y estabilidad operacional.
- El alcance funcional actual cubre las necesidades críticas identificadas para la operación inicial del sistema.

# 16. ANEXOS

## 16.1 Objetivo

El presente apartado documenta los anexos técnicos, operacionales y arquitectónicos complementarios al SDD, con el objetivo de proporcionar información adicional relevante para el desarrollo, despliegue, mantenimiento, soporte y evolución del sistema.

Los anexos permitirán mantener trazabilidad documental y complementar la información funcional y técnica definida dentro del documento principal.

## 16.2 Consideraciones Generales

- Los anexos deberán mantenerse alineados con la arquitectura oficial del sistema.
- Los anexos podrán actualizarse conforme evolucione la solución.
- Los diagramas y estructuras técnicas deberán representar el comportamiento real del sistema.
- Los anexos técnicos deberán utilizar nomenclatura consistente.
- Los anexos deberán facilitar mantenimiento, soporte y escalabilidad.
- Los anexos podrán mantenerse en documentos independientes complementarios al SDD.

# 16.3 Anexos Técnicos

## 16.3.1 Diagrama de Arquitectura General

### Descripción

Representa la arquitectura general de la solución y la interacción entre los principales componentes tecnológicos.

### Objetivo

Visualizar la estructura general del sistema y las relaciones entre frontend, backend, base de datos e infraestructura.

### Componentes Incluidos

- Frontend Web React
- Frontend Mobile React Native APK
- Backend Quarkus (Java 21)
- API REST
- JWT Authentication (SmallRye JWT)
- Microsoft Authentication (pendiente OIDC)
- PostgreSQL 18
- Docker
- NGINX (reverse proxy)
- Flyway (migraciones DB)
- Docker Volumes Persistentes

### Estructura Base Referencial

```text
[React Web]     [React Native APK]
        |               |
        +-------+-------+
                |
              [NGINX] :80
                |
        [Quarkus API] :8080
           |         |
      [PostgreSQL]  [Flyway Migrations]
           |
     [Docker Volumes]
           |
   [Evidencias Multimedia]

[Microsoft Auth] ─── [JWT / SmallRye]
```

### Consideraciones

- La arquitectura deberá mantener separación de responsabilidades.
- Toda validación crítica deberá ejecutarse desde backend.
- Las evidencias multimedia deberán mantenerse persistentes.

## 16.3.2 Diagrama Entidad Relación (ERD)

### Descripción

Representa las entidades principales y relaciones del sistema.

### Objetivo

Visualizar integridad referencial y relaciones operacionales.

### Entidades Principales Incluidas

- Usuario
- Rol
- Sede
- Campaña
- PSR
- OSR
- Equipo
- TipoEquipo
- Marca
- Proveedor
- Avería
- Evidencia
- Auditoría
- Configuración

### Estructura Base Referencial

```text
Proveedor
    |
    | 1:N
    |
Equipo
    |
    | 1:N
    |
Avería
    |
    | 1:N
    |
Evidencia

Usuario
    |
    | 1:N
    |
Auditoría
```

### Consideraciones

- Toda entidad deberá mantener integridad referencial.
- Las relaciones críticas deberán validarse server-side.
- Las entidades históricas no deberán eliminarse físicamente.

## 16.3.3 Diccionario de Datos

### Descripción

Documenta campos relevantes y estructura lógica de entidades principales.

### Objetivo

Mantener trazabilidad y comprensión estructural de datos.

### Estructura Base Referencial

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | Long | Sí | Identificador único |
| codigo | String | Sí | Código operacional |
| estado | Enum | Sí | Estado operacional |
| fechaRegistro | DateTime | Sí | Fecha creación |

### Consideraciones

- Los nombres de campos deberán mantener consistencia técnica.
- Los tipos de datos deberán alinearse con PostgreSQL y JPA.
- Los campos críticos deberán mantener restricciones obligatorias.

## 16.3.4 Matriz de Roles y Permisos

### Descripción

Define accesos funcionales según roles operacionales.

### Objetivo

Garantizar control de acceso y seguridad funcional.

### Roles Principales

- Administrador
- Usuario
- Supervisor

### Estructura Base Referencial

| Módulo | Usuario | Administrador | Supervisor |
|---|---|---|---|
| Equipos | Lectura | Total | Lectura |
| Averías | Registro | Total | Lectura |
| Reportes | Lectura | Total | Lectura |
| Auditoría | No | Total | Parcial |

### Consideraciones

- Toda autorización deberá validarse mediante JWT.
- El backend será responsable del control de permisos.
- Los endpoints deberán validar roles obligatoriamente.

## 16.3.5 Catálogo de Estados Operacionales

### Descripción

Define estados válidos y transiciones operacionales permitidas.

### Objetivo

Garantizar consistencia operacional.

### Estados Referenciales Equipos

- OPERATIVO
- AVERIADO
- EN_MANTENIMIENTO
- INACTIVO

### Estados Referenciales Averías

- ABIERTA
- EN_PROCESO
- CERRADA

### Estructura Base Referencial

```text
OPERATIVO
    |
    v
AVERIADO
    |
    v
EN_MANTENIMIENTO
    |
    v
OPERATIVO
```

### Consideraciones

- Los estados deberán validarse desde backend.
- No deberán existir transiciones inválidas.
- Toda transición deberá registrar auditoría.

## 16.3.6 Convenciones Técnicas API REST

### Descripción

Define estándares técnicos utilizados por las APIs REST.

### Objetivo

Mantener consistencia entre frontend y backend.

### Estructura Base Referencial

```text
/api/v1/equipos
/api/v1/averias
/api/v1/proveedores
```

### Convenciones

- Uso JSON.
- Uso HTTP Status Codes.
- Uso versionamiento API.
- Uso JWT Bearer Token.

### Respuesta Base Referencial

```json
{
  "success": true,
  "message": "Operación realizada correctamente",
  "data": {}
}
```

### Consideraciones

- Las APIs deberán documentarse mediante OpenAPI.
- Los errores deberán estandarizarse.
- Toda validación crítica deberá ejecutarse server-side.

## 16.3.7 Convenciones Multimedia

### Descripción

Define estándares técnicos para almacenamiento multimedia.

### Objetivo

Garantizar control y persistencia de evidencias.

### Formatos Permitidos

- JPG
- JPEG
- PNG

### Restricciones Referenciales

| Restricción | Valor |
|---|---|
| Tamaño máximo | Configurable |
| Formatos válidos | JPG, JPEG, PNG |
| Persistencia | Obligatoria |

### Estructura Base Referencial

```text
/evidencias/
    /equipos/
    /averias/
    /devoluciones/
```

### Consideraciones

- Las evidencias deberán mantenerse persistentes.
- No deberá permitirse eliminación física directa.
- Los archivos deberán asociarse a operaciones válidas.

## 16.3.8 Estructura Docker

### Descripción

Representa la organización contenerizada del sistema.

### Objetivo

Facilitar despliegue, mantenimiento y portabilidad.

### Componentes Docker

- Backend Container (Quarkus uber-jar, Java 21)
- Frontend Web Container (React, servido por Nginx)
- PostgreSQL 18 Container
- NGINX Container (reverse proxy)
- Docker Volumes (postgres_data, multimedia_data)

### Estructura Base Referencial

```text
docker-compose.yml

services:
  backend (puerto 8080, interno)
  postgres (puerto 5432)
  nginx (puerto 80/443, externo)

volumes:
  postgres_data
  multimedia_data

networks:
  app-network (bridge)
```

### Consideraciones

- Los volúmenes deberán ser persistentes.
- Los servicios deberán comunicarse mediante red interna Docker.
- La configuración deberá separarse por ambientes.

## 16.3.9 Referencias Tecnológicas

### Descripción

Documenta tecnologías principales utilizadas por la solución.

### Objetivo

Mantener trazabilidad tecnológica y compatibilidad técnica.

### Tecnologías Principales

| Tecnología | Uso Principal |
|---|---|---|
| Quarkus 3.15.1 | Backend API REST |
| Java 21 | Lenguaje backend |
| React | Frontend Web |
| React Native | APK Mobile |
| PostgreSQL 18 | Base de Datos |
| Flyway | Migraciones DB |
| Docker | Contenerización |
| Docker Compose | Orquestación |
| NGINX | Reverse Proxy |
| SmallRye JWT | Seguridad tokens |
| Microsoft OAuth2/OpenID | Autenticación (pendiente) |
| Hibernate ORM Panache | Persistencia ORM |
| Swagger UI | Documentación APIs |

### Consideraciones

- Las versiones deberán mantenerse estables.
- Las dependencias deberán mantenerse compatibles.
- Las tecnologías deberán soportar mantenibilidad empresarial.

# 16.4 Anexos Operacionales

## 16.4.1 Glosario Operacional

### Descripción

Define términos funcionales y técnicos utilizados dentro del sistema.

### Objetivo

Facilitar comprensión documental y operacional.

### Términos Principales

| Término | Descripción |
|---|---|---|
| PSR | Pedido de Servicio Requerido |
| OSR | Orden de Servicio Relacionada |
| KPI | Indicador Clave de Rendimiento |
| JWT | JSON Web Token |
| Flyway | Herramienta de migraciones de base de datos |
| OIDC | OpenID Connect (autenticación Microsoft) |
| Avería | Incidencia operacional registrada |
| Evidencia | Archivo multimedia asociado |
| Campaña | Agrupación operacional activa |

### Consideraciones

- Los términos deberán utilizar nomenclatura consistente.
- El glosario deberá mantenerse actualizado.
- Los conceptos deberán alinearse con reglas operacionales.

# 16.5 Referencias Documentales

## Documentación Relacionada

- Documento SDD principal.
- Requerimientos funcionales.
- Reglas de negocio.
- Diagramas técnicos.
- Modelo entidad relación.
- Arquitectura infraestructura.
- Documentación APIs REST.

## Consideraciones Finales

- Los anexos deberán mantenerse alineados con la evolución del sistema.
- Los anexos técnicos deberán facilitar soporte y mantenimiento.
- Toda modificación arquitectónica deberá reflejarse en anexos correspondientes.
- La documentación deberá mantenerse consistente entre frontend, backend e infraestructura.
