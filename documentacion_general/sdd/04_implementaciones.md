# SOFTWARE DEVELOPMENT DOCUMENT (SDD)
# 04_IMPLEMENTATION.md

---

# 1. Control Documental

| Campo | Valor |
|---|---|
| Documento | 04_IMPLEMENTATION.md |
| Proyecto | Sistema de Control Operativo de Equipos de Apilamiento |
| Estado | En desarrollo sincronizado con repositorio |
| Versión | 1.4 |
| Fecha | 2026-07-21 |
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
| PSR / OSR | ✅ Implementada |
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

# 10. Frontend Web — Acceso y Diagnóstico

## 10.1 Acceso

El frontend web se sirve a través de Nginx (contenedor `apilamiento-nginx`) en las siguientes URLs:

| Servicio | URL | Descripción |
|---|---|---|
| Frontend (SPA) | `http://localhost/` | Aplicación React (ruteo client-side) |
| API Backend | `http://localhost/api/v1/` | Proxy inverso hacia backend:8082 |
| Health Check | `http://localhost/health` | Estado del backend |
| Swagger UI | `http://localhost/swagger` | Documentación OpenAPI |

**Nota:** El frontend usa `BrowserRouter` de React Router v6. No hay soporte HTTPS configurado en Nginx. Usar siempre `http://localhost`.

## 10.2 Stack de Contenedores

| Contenedor | Puerto Host | Puerto Contenedor | Estado |
|---|---|---|---|
| `apilamiento-nginx` | 80 / 443 | 80 / 443 | Sirve SPA + proxy API |
| `apilamiento-backend` | 8082 | 8082 | API Quarkus |
| `apilamiento-postgres` | 5433 | 5432 | PostgreSQL 18 |

## 10.3 Diagnóstico Aplicado (2026-07-21)

**Síntoma reportado:** Servicios Docker levantados pero frontend web no visible.

**Diagnóstico:**
1. Todos los contenedores estaban en ejecución (`docker ps`).
2. Nginx servía correctamente el HTML (`curl http://localhost/` → 200).
3. Los assets JS/CSS se servían correctamente (HTTP 200).
4. La API respondía correctamente a través del proxy (`/api/v1/auth/roles` → datos).

**Causa raíz:** La imagen Docker del frontend (`apilamiento-nginx`) fue construida sin un archivo `.dockerignore`, lo que provocaba dos problemas:
- El contexto de build incluía `node_modules` (~128 MB), ralentizando el build.
- Los `node_modules` del host Windows se copiaban dentro del builder Alpine, potencialmente causando conflictos con binarios nativos de plataforma.

**Solución aplicada:**
1. Se creó `frontend/.dockerignore` excluyendo `node_modules`, `dist`, `.git`, `__tests__` y archivos markdown.
2. Se reconstruyó la imagen con `docker compose build --no-cache nginx`.
3. Se recreó el contenedor con `docker compose up -d --force-recreate nginx`.
4. Se verificó que el frontend responde correctamente (todos los endpoints 200 OK).

**Comando para reconstruir el frontend tras cambios:**
```bash
docker compose build nginx
docker compose up -d --force-recreate nginx
```

---

# 11. Configuración Operativa Congelada

La siguiente configuración de infraestructura está validada y en funcionamiento. NO MODIFICAR.

## 11.1 Mapa de Puertos Docker (HOST → Contenedor)

| Servicio | Puerto Host | Puerto Contenedor | Protocolo |
|---|---|---|---|
| Nginx (Frontend + Proxy) | 80 | 80 | HTTP |
| Nginx (HTTPS futuro) | 443 | 443 | HTTPS |
| Backend Quarkus | 8082 | 8082 | HTTP |
| PostgreSQL 18 | 5433 | 5432 | TCP |

## 11.2 URLs de Acceso (Entorno Local Docker)

| Servicio | URL |
|---|---|
| Frontend Web (SPA) | `http://localhost/` |
| API Backend | `http://localhost/api/v1/` |
| Health Check | `http://localhost/health` |
| Swagger UI | `http://localhost/swagger` |
| Swagger JSON | `http://localhost/q/openapi` |
| Conexión DB (externo) | `localhost:5433` |
| Conexión DB (Docker) | `postgres:5432` |

## 11.3 Cadena de Conexión a Base de Datos

| Contexto | Cadena |
|---|---|
| Backend (Docker) | `jdbc:postgresql://postgres:5432/repo_control_equipos_apilamiento` |
| Backend (dev local) | `jdbc:postgresql://localhost:5432/repo_control_equipos_apilamiento` |
| Cliente externo | `jdbc:postgresql://localhost:5433/repo_control_equipos_apilamiento` |

## 11.4 Configuración Mobile (APK)

| Parámetro | Valor |
|---|---|
| API URL (LAN) | `http://10.13.18.168:8082/api/v1` |
| API URL (debug) | `http://127.0.0.1:8082/api/v1` |
| Almacenamiento de token | `react-native-keychain` (SecureStore) |
| Timeout de API | 15000ms |

## 11.5 Configuración Backend

| Parámetro | Valor |
|---|---|
| Puerto HTTP | 8082 |
| Host | `0.0.0.0` |
| API Base Path | `/api/v1` |
| JWT Expiración | 28800s (8h) |
| Timezone | `America/Lima` |
| Tamaño máximo body | 10MB |
| Pool conexiones DB | min:2, max:20 |

## 11.6 Nombres de Contenedores

| Contenedor | Imagen |
|---|---|
| `apilamiento-nginx` | `nginx:alpine` (build local) |
| `apilamiento-backend` | `quarkus:3.14` (build local) |
| `apilamiento-postgres` | `postgres:18` |

## 11.7 Dependencias de Orquestación

```
postgres (healthcheck) → backend → nginx
```

---

# 12. Cierre

Este documento queda sincronizado con PostgreSQL 18 como base oficial y con el frontend web accesible en `http://localhost/`. La configuración de red, puertos y conexiones queda documentada y congelada en la sección 11.
