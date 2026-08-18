export const VERSION_HISTORY = [
  {
    version: '1.11.0',
    fecha: '2026-08-17',
    titulo: 'HDT-014 — Timeline dinámico de detalle de equipo',
    cambios: [
      'Nueva pantalla "Historial del Equipo" accesible desde el botón "Ver Historial" en el listado',
      'Endpoint backend GET /api/v1/equipos/{id}/timeline (consolidación de eventos PSR/OSR/ingreso/averías/reparaciones/finalización)',
      'Resumen operativo: fecha de ingreso, horómetro inicial/final, cantidad de averías, tiempo de inactividad y fecha de finalización',
      'Timeline expandible por evento con detalle, estado y evidencias (fotos ampliables)',
    ],
  },
  {
    version: '1.10.1',
    fecha: '2026-08-13',
    titulo: 'HDT-013 — Fix registro de token FCM al abrir la app',
    cambios: [
      'Registro del token FCM al iniciar la app con sesión persistente',
      'Re-registro automático del token cuando FCM lo rota (onTokenRefresh)',
    ],
  },
  {
    version: '1.10.0',
    fecha: '2026-08-13',
    titulo: 'HDT-013 — Notificaciones push ampliadas',
    cambios: [
      'Plantilla de notificación nueva: Evento / Proveedor - Codigo / Registrado por',
      'Notificación al registrar una avería',
      'Notificación al atender una avería',
      'Notificación al finalizar el servicio (devolución)',
      'Corrección de warnings FCM deprecados (API v22)',
      'Navegación al detalle del equipo al tocar la notificación',
    ],
  },
  {
    version: '1.9.0',
    fecha: '2026-08-11',
    titulo: 'HDT-012 — UX operativo, evidencias, contraseña y sync de catálogos',
    cambios: [
      'Identificadores operativos en mayúsculas (número PSR, código, modelo, serie, guía de remisión)',
      'Layout de averías en detalle: fecha reporte → atención y horómetros',
      'Fecha y hora de atención editable y validada',
      'Sync de motivos PSR → tipos de equipo (find-or-create al crear)',
      'Evidencias de ingreso ampliadas (4 vistas + extintor) y de devolución por accesorios',
      'Máximo 5 fotos por avería y 2 evidencias obligatorias al atender',
      'Contraseña de exactamente 8 dígitos (DNI)',
      'PSR/OSR finalizado read-only',
      'Fix de eliminación de usuarios (trigger Super Admin V29)',
    ],
  },
  {
    version: '1.8.0',
    fecha: '2026-08-10',
    titulo: 'HDT-011 — Horómetro en averías y trazabilidad de usuario',
    cambios: [
      'Horómetro en registro y atención de averías con días de inactividad',
      'Trazabilidad de usuario_creacion/usuario_actualizacion desde el JWT',
      'Fix 409 al devolver equipos',
      'Super Admin protegido por trigger de base de datos',
    ],
  },
  {
    version: '1.7.0',
    fecha: '2026-08-10',
    titulo: 'HDT-010 — Usuarios mobile simplificado',
    cambios: [
      'Creación de usuarios con solo Nombre obligatorio y Ubicación desde Sedes',
      'Rol "Usuario" por defecto al crear sin rol',
    ],
  },
  {
    version: '1.6.0',
    fecha: '2026-08-10',
    titulo: 'HDT-009 — Teclado móvil no cubre los inputs',
    cambios: [
      'KeyboardAwareScrollView en pantallas con formularios y diálogos',
      'Footer fijo en formulario de equipos',
    ],
  },
  {
    version: '1.5.0',
    fecha: '2026-08-06',
    titulo: 'HDT-008 — Desplegables, catálogos en tiempo real y referencias PSR/OSR',
    cambios: [
      'AppSelect con Portal y ScrollView completo',
      'Catálogos sincronizados en tiempo real entre dispositivos',
      'Card PSR/OSR en detalle de equipo y Marca/Modelo/GRR',
      'CRUD completo de campañas mobile y tab Catálogos por permisos',
    ],
  },
  {
    version: '1.4.0',
    fecha: '2026-07-24',
    titulo: 'HDT-007 — CRUD de usuarios mobile',
    cambios: [
      'Crear y editar usuarios desde la app',
      'Permisos por rol (solo Super Admin edita Super Admin)',
      'Correcciones de autenticación (login y logout robustos)',
    ],
  },
  {
    version: '1.3.0',
    fecha: '2026-07-09',
    titulo: 'HDT-006 — Gestión móvil de PSR/OSR',
    cambios: [
      'Crear y editar PSR/OSR con date picker nativo',
      'Catálogos integrados (campañas, sedes, motivos)',
    ],
  },
  {
    version: '1.2.0',
    fecha: '2026-07-08',
    titulo: 'HDT-004 — Pantallas mobile faltantes',
    cambios: [
      'Catálogos (marcas, proveedores, tipos, sedes, motivos)',
      'Roles, usuarios, auditoría y configuración',
      'Tab Catálogos con menú de botones',
    ],
  },
  {
    version: '1.1.0',
    fecha: '2026-07-08',
    titulo: 'HDT-003 — Calidad, despliegue y auditoría',
    cambios: [
      'Tests backend, frontend y mobile',
      'Módulo de auditoría de eventos',
      'Configuración CORS/seguridad y CI/CD',
      'Modo claro/oscuro en el frontend web',
    ],
  },
  {
    version: '1.0.0',
    fecha: '2026-05-29',
    titulo: 'Base del sistema',
    cambios: [
      'Infraestructura Docker (PostgreSQL 18, Quarkus, Nginx)',
      'Autenticación local BCrypt + JWT',
      'Usuarios, roles, sedes y campañas',
      'Núcleo operativo: tipos de equipo, proveedores, marcas, equipos y averías',
      'Aplicación Android inicial',
    ],
  },
]
