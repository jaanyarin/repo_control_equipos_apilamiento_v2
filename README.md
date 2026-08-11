# Sistema de Control de Equipos de Apilamiento

Plataforma full-stack para la gestión operativa de equipos de apilamiento alquilados en campañas agrícolas. Controla el ciclo completo: solicitud, asignación, operación, averías, atención y trazabilidad documental.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Backend** | Quarkus Java 3.14.4 — Hibernate ORM Panache — REST `/api/v1` |
| **Frontend Web** | React 18 + Vite 5 + Material UI 6 |
| **Mobile** | Expo React Native SDK ~54.0.35 + react-native-paper (MD3) + React Navigation |
| **Base de Datos** | PostgreSQL 18 — Flyway migrations |
| **Autenticación** | BCrypt + JWT propio |
| **Infraestructura** | Docker Compose + Nginx |
| **Build APK** | EAS Cloud (local bloqueado por Sophos) |
| **CI/CD** | GitHub Actions |

---

## Estado del Proyecto

| Hito | Estado |
|---|---|
| HDT-001 — Base del Sistema (Docker, PostgreSQL, Backend, Auth) | ✅ Cerrado |
| HDT-002 — Núcleo Operativo (catálogos, equipos, averías) | ✅ Cerrado |
| HDT-003 — Calidad, Despliegue y Auditoría | ✅ En auditoría |
| HDT-004 — Catálogos y screens mobile faltantes | ✅ Cerrado |
| HDT-005 — Migración a React Native CLI | ❌ Cancelado (se mantiene Expo) |
| HDT-006 — Gestión móvil PSR/OSR | ✅ Cerrado |
| HDT-007 — CRUD Usuarios Mobile | ✅ Cerrado |
| HDT-008 — UX Desplegables, Catálogos en Tiempo Real y Referencias PSR/OSR | ✅ Implementado |
| HDT-009 — Teclado móvil no cubre los inputs (UX) | ✅ Implementado |
| HDT-010 — Usuarios Mobile: solo Nombre obligatorio y Ubicación desde Sedes | ✅ Implementado |
| HDT-011 — Horómetro en Averías y Trazabilidad de Usuario (Auditoría) | ✅ Implementado |
| HDT-012 — UX Operativo, Evidencias, Contraseña 8 dígitos, PSR/OSR Finalizado y Sync Motivos→Tipos | ✅ Implementado |

**Features adicionales:** Finalización del Servicio (al atender una avería se restaura el estado operativo del equipo) · Devolución de equipos con evidencias por accesorios · Desplegables AppSelect con Portal + ScrollView completo · Catálogos sincronizados en tiempo real entre dispositivos · Card PSR/OSR en detalle de equipo y Marca/Modelo/GRR en PSR/OSR (retroactivo) · Teclado móvil que no cubre los inputs (KeyboardAwareScrollView en pantallas y diálogos) · Creación de usuarios mobile con solo Nombre obligatorio y Ubicación desplegable desde Sedes · Horómetro en registro y atención de averías con cálculo de días de inactividad · Trazabilidad de `usuario_creacion`/`usuario_actualizacion` desde el JWT en todos los CRUD (auditoría real) · Super Admin protegido por trigger de BD · Identificadores operativos en mayúsculas (número PSR, código, modelo, serie, guía) · Layout de averías en detalle con fecha reporte→atención y horómetros · Fecha y hora de atención editable y validada · Sync `motivos_psr → tipos_equipo` (find-or-create solo en crear) · Evidencias de ingreso ampliadas (4 vistas + extintor) y máximo 5 fotos por avería · Contraseña de exactamente 8 dígitos (DNI) · PSR/OSR finalizado read-only (409 backend + UI deshabilitada) · Fix trigger Super Admin que permite eliminar usuarios (el seed sigue protegido).

---

## Módulos Implementados

| Módulo | Backend | Web | Mobile |
|---|---|---|---|
| Autenticación local BCrypt | ✅ | ✅ | ✅ |
| Usuarios (CRUD + permisos por rol) | ✅ | ✅ | ✅ |
| Roles | ✅ | ✅ | ✅ |
| Sedes | ✅ | ✅ | ✅ |
| Campañas (activar/cerrar) | ✅ | ✅ | ✅ |
| Tipos de Equipo | ✅ | ✅ | ✅ |
| Proveedores | ✅ | ✅ | ✅ |
| Marcas | ✅ | ✅ | ✅ |
| Equipos (con detalle + estado dinámico) | ✅ | ✅ | ✅ |
| PSR / OSR (con date picker nativo) | ✅ | ✅ | ✅ |
| Averías (registrar + atender + finalizar, con horómetro y días de inactividad) | ✅ | ✅ | ✅ |
| Finalización del Servicio | ✅ | — | ✅ |
| Evidencias Fotográficas (1 foto) | ✅ | — | ✅ |
| Auditoría de Eventos | ✅ | ✅ | ✅ |
| Configuración (URL API) | — | — | ✅ |

---

## Puerto de Inicio Rápido

```bash
# Clonar
git clone <repo-url>
cd repo_control_equipos_apilamiento_v2

# Backend (Docker)
docker compose up -d

# Frontend Web (dev)
cd frontend
npm install
npm run dev

# Mobile
cd mobile
npx expo start

# Build APK
cd mobile
npm run build:android:apk   # EAS Cloud
```

## URLs de Acceso (Local)

| Servicio | URL |
|---|---|
| Frontend SPA | `http://localhost/` |
| API REST | `http://localhost/api/v1/` |
| Swagger UI | `http://localhost/swagger` |
| Health Check | `http://localhost/health` |
| DB (externo) | `localhost:5433` |

---

## Documentación

- Especificaciones: `documentacion_general/sdd/01_epecificaciones.md`
- Plan de desarrollo: `documentacion_general/sdd/02_planes.md`
- Tareas y roadmap: `documentacion_general/sdd/03_tareas.md`
- Implementación detallada: `documentacion_general/sdd/04_implementaciones.md`
- Convenciones del proyecto: `AGENTS.md`
- Hitos: `documentacion_general/sdd/05_hito_*.md` (001–012)
