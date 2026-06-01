# SOFTWARE DEVELOPMENT DOCUMENT (SDD)
# 04_IMPLEMENTATION.md

---

# 1. Control Documental

| Campo | Valor |
|---|---|
| Documento | 04_IMPLEMENTATION.md |
| Proyecto | Sistema de Control Operativo de Equipos de Apilamiento |
| Tipo Documento | Software Development Document |
| Estado | En Desarrollo |
| Versión | 1.1 |
| Fecha | 2026-05-27 |
| Responsable | Jose Anyarin |
| Repositorio | GitHub |
| Clasificación | Interno |

---

# 2. Objetivo del Documento

El presente documento tiene como finalidad definir la estrategia técnica de implementación del sistema de control operativo de equipos de apilamiento.

Este documento establece:
- lineamientos de desarrollo,
- arquitectura técnica,
- organización estructural,
- estándares de implementación,
- estrategias de despliegue,
- seguridad,
- trazabilidad,
- mantenibilidad,
- escalabilidad,
- control operacional.

La implementación deberá garantizar:
- estabilidad operacional,
- desacoplamiento,
- modularidad,
- mantenibilidad,
- crecimiento controlado,
- reutilización de componentes,
- trazabilidad técnica y funcional.

---

# 3. Alcance del Documento

El presente documento cubre:
- arquitectura backend,
- arquitectura frontend móvil,
- arquitectura frontend web,
- infraestructura,
- seguridad,
- APIs REST,
- persistencia,
- auditoría,
- logging,
- monitoreo,
- despliegue,
- backups,
- testing,
- estándares de desarrollo.

No contempla:
- manuales usuario,
- operación funcional detallada,
- procedimientos administrativos internos.

---

# 4. Referencias

| Documento | Descripción |
|---|---|
| 01_SPECIFICATION.md | Especificación funcional y reglas de negocio |
| 02_PLAN.md | Arquitectura, stack y planificación |
| 03_TASKS.md | Backlog técnico y tareas |
| Documento Word Usuario | Flujo operativo base del proyecto |

---

# 5. Definiciones y Acrónimos

| Término | Definición |
|---|---|
| PSR | Pedido de Servicio de Requerimiento |
| OSR | Orden de Servicio de Requerimiento |
| KPI | Indicador Clave de Desempeño |
| JWT | JSON Web Token |
| API | Application Programming Interface |
| CI/CD | Continuous Integration / Continuous Deployment |
| VPS | Virtual Private Server |
| DTO | Data Transfer Object |
| Audit Log | Registro de trazabilidad operacional |
| Timezone Oficial | America/Lima (UTC -5) |

---

# 6. Estrategia General de Implementación

La implementación del sistema será desarrollada bajo una arquitectura modular desacoplada, orientada a APIs REST y consumo centralizado de servicios.

La construcción del sistema será incremental y basada en módulos funcionales independientes.

La arquitectura priorizará:
- mantenibilidad,
- escalabilidad,
- estabilidad,
- seguridad,
- reutilización,
- trazabilidad,
- desacoplamiento.

La implementación se dividirá en:
- backend,
- frontend móvil,
- frontend web,
- infraestructura,
- auditoría,
- seguridad,
- monitoreo,
- despliegue.

---

# 7. Arquitectura General del Sistema

## Arquitectura Física

```text
Usuario
↓
Frontend Mobile (React Native)
Frontend Web (React)
↓
Nginx Reverse Proxy
↓
Backend API REST (Quarkus)
↓
PostgreSQL
↓
Filesystem Fotografías
```

## Arquitectura Lógica

```text
Frontend Mobile
        ↓
Frontend Web
        ↓
API Gateway (Nginx)
        ↓
Backend Quarkus
        ↓
Servicios Negocio
        ↓
Persistencia PostgreSQL
```

## Componentes Principales

| Componente | Tecnología | Estado |
|---|---|---|
| Frontend Mobile | Expo React Native | ✅ Implementado |
| Frontend Web | React 18 SPA (Vite 5 + MUI 6) | ✅ Implementado |
| Backend API | Quarkus Java 3.14.4 | ✅ Implementado |
| Base de Datos | PostgreSQL 18 | ✅ Implementado |
| Seguridad | Microsoft Entra ID OIDC | ✅ Implementado |
| Sesión | JWT (SmallRye JWT) | ✅ Implementado |
| Infraestructura | Docker Compose | ✅ Implementado |
| Proxy | Nginx | ✅ Implementado |
| CI/CD | GitHub Actions | ⏳ Pendiente |
| Repositorio | GitHub | ✅ Implementado |

---

# 8. Arquitectura Backend

## Objetivo

Implementar una arquitectura backend desacoplada, mantenible y escalable.

## Estructura General Backend

```text
src/main/java/
├── controller
├── service
├── repository
├── entity
├── dto
├── mapper
├── config
├── security
├── exception
├── audit
├── util
```

## Responsabilidades por Capa

| Capa | Responsabilidad |
|---|---|
| controller | Exposición APIs REST |
| service | Lógica de negocio |
| repository | Persistencia |
| entity | Entidades BD |
| dto | Transferencia datos |
| mapper | Conversión modelos |
| security | Seguridad JWT |
| config | Configuración |
| audit | Auditoría |
| exception | Manejo errores |

## Lineamientos Backend

- Arquitectura modular por dominio.
- DTOs obligatorios.
- Prohibido exponer entidades directamente.
- Validaciones centralizadas.
- Manejo global excepciones.
- APIs REST versionadas.
- Auditoría transversal.
- Logging estructurado.
- Soft delete obligatorio para datos operacionales (excepciones: usuarios, sedes y campañas se eliminan físicamente por funcionalidad administrativa).

## Arquitectura Modular

| Módulo | Responsabilidad |
|---|---|
| auth | Autenticación |
| users | Usuarios |
| campaigns | Campañas |
| sites | Sedes |
| equipment | Equipos |
| equipment-types | Tipos Equipos |
| providers | Proveedores |
| psr-osr | Gestión PSR/OSR |
| damages | Averías |
| evidences | Fotografías |
| dashboard | KPIs |
| reports | PDFs |
| audit | Auditoría |

---

# 9. Arquitectura Frontend Mobile

## Objetivo

Implementar una aplicación móvil operativa robusta para operación en campo.

## Stack Frontend Mobile

| Componente | Tecnología |
|---|---|
| Framework | Expo SDK 54.0.35 + React Native 0.81.5 |
| UI | React Native Paper (Material Design 3) |
| Estado Global | React Context |
| Navegación | React Navigation Native Stack |
| APIs | Axios |
| Almacenamiento Seguro | expo-secure-store |
| Autenticación | expo-web-browser + expo-auth-session |
| Deep Linking | expo-linking |
| JS Engine | Hermes (obligatorio con newArch) |
| New Architecture | Habilitado (newArchEnabled=true) |
| Entry Point | expo/AppEntry (registerRootComponent) |

## Estructura General Mobile (Actual)

```text
mobile/
├── App.js                          # Componente raíz con providers
├── app.json                        # Configuración Expo (jsEngine: hermes, plugins, scheme)
├── eas.json                        # Perfiles EAS Build (preview=APK, production=AAB)
├── package.json                    # main: expo/AppEntry (NO CAMBIAR)
├── assets/
│   └── fondo_login.png             # Imagen de fondo del login
├── src/
│   ├── AuthContext.js              # Contexto de autenticación (user, login, logout)
│   ├── api.js                      # Cliente Axios + SecureStore (JWT + API URL)
│   └── LoginScreen.js              # Pantalla de login OIDC + éxito
```

## Flujo de Autenticación Mobile

1. Usuario presiona "Iniciar sesión con Microsoft"
2. Se abre WebBrowser nativo con URL: `{API_BASE}/auth/login?redirect_uri={deep-link}`
3. Backend redirige a Microsoft Entra ID login
4. Usuario se autentica en Microsoft
5. Microsoft redirige al callback del backend (?code=...&state={deep-link})
6. Backend valida, genera JWT y redirige a: `{deep-link}?token={jwt}`
7. La app captura el deep link, extrae el token y lo guarda en SecureStore
8. Se muestra pantalla: "Ingresaste de forma correcta" + nombre del usuario

## Variables de Entorno

### Build-time (EAS Cloud)
Se puede definir `EXPO_PUBLIC_API_URL` para dejar una URL base por defecto en el APK.

### Runtime (URL del API configurable)
La URL del backend se almacena en `SecureStore` del dispositivo. Se puede cambiar sin rebuild mediante:

```js
import { setApiUrl } from './api'
await setApiUrl('http://192.168.18.229:8080/api/v1')
```

Valor por defecto en `src/api.js`:
```js
const FALLBACK_API_URL = 'http://192.168.18.229:8080/api/v1'
```

**ADVERTENCIA**: No cambiar el entry point `"main": "expo/AppEntry"` en `package.json`.
No cambiar `"jsEngine": "hermes"` en `app.json`.
No cambiar `hermesEnabled=true` ni `newArchEnabled=true` en `gradle.properties`.

## Lineamientos Frontend Mobile

- Componentes reutilizables.
- Estado centralizado vía React Context.
- Navegación desacoplada (React Navigation).
- Manejo global errores.
- Validaciones frontend obligatorias.
- Control automático sesión (SecureStore + AuthContext).
- Consumo APIs desacoplado vía Axios interceptors con URL dinámica desde SecureStore.
- Deep link callback manejado por expo-linking.
- Alcance APK configurado solo para Android en `mobile/app.json`.
- EAS Build configurado en `mobile/eas.json` con perfil `preview` para APK instalable y `production` para AAB.
- Build local solo como alternativa; el build oficial se realiza via EAS Cloud.
- Para build local: usar `GRADLE_USER_HOME=..\.gradle-home` (dentro del proyecto, no en C:\tmp).
- El login mobile muestra estado de carga, errores de autenticación y pantalla "Ingresaste de forma correcta" cuando existe JWT válido.
- El mobile obtiene la URL de Microsoft desde `/api/v1/auth/mobile-login-url` y la abre con `Linking.openURL`, escuchando el deep link de retorno.
- El JWT se decodifica como base64url para evitar fallos con tokens reales en APK.
- Hermes JS Engine obligatorio (incompatible JSC con newArchEnabled=true en RN 0.81).
- Entry point debe ser `expo/AppEntry` (no cambiar a `App.js` directo).
- La URL del API se configura en runtime via SecureStore, no via `EXPO_PUBLIC_*`.

---

# 10. Arquitectura Frontend Web

## Objetivo

Implementar una plataforma web analítica y administrativa como SPA estática servida por nginx.

## Stack Frontend Web

| Componente | Tecnología |
|---|---|
| Framework | React 18 + Vite 5 |
| Routing | React Router v6 |
| APIs | Axios |
| UI Framework | MUI 6 (Material UI) |
| Estado Global | React Context |
| Build | Vite (salida → frontend/dist/) |

## Estructura General Web

```text
frontend/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── fondo_login.png
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── api.js
│   ├── store.jsx
│   ├── components/
│   │   ├── Layout.jsx        # Sidebar in-line aquí
│   │   └── RoleChip.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Usuarios.jsx
│   │   └── Roles.jsx
│   ├── theme/
│   │   ├── theme.js
│   │   ├── design-tokens.json
│   │   └── mobile-theme.js
│   └── context/
│       └── ThemeModeContext.jsx
```

## Lineamientos Frontend Web

- SPA con build step (Vite: `npm run build`), el output (`frontend/dist/`) se sirve por nginx.
- Routing con React Router v6 (BrowserRouter o HashRouter).
- Token JWT almacenado en localStorage, con interceptor Axios para Authorization header.
- Control de permisos por rol (Super Admin ve todo, Admin filtrado, Usuario limitado).
- Layout común con Sidebar y Toolbar de MUI.
- Componentes reutilizables (MUI DataGrid, Dialog, etc.).
- Manejo de errores con notificaciones MUI Snackbar/Alert.
- Autocompletado de correos electrónicos del tenant Microsoft mediante MUI `<Autocomplete freeSolo>` con debounce (300ms) y conexión a endpoint `/api/v1/usuarios/buscar-por-correo`.
- Autenticación mediante flujo OIDC con fetch manual (HttpClient del backend).
- Cierre de sesión: `localStorage.removeItem('accessToken')` + `window.location.href = '/login?logout=1'` (hard redirect para evitar estado React obsoleto).
- Manejo de errores de autenticación: backend redirige a `/login?error=<mensaje>`, frontend muestra `Alert` con el mensaje y botón "Intentar de nuevo".
- Prevención de auto-login: cuando `?logout=1` o `?error=` están presentes, el frontend no redirige automáticamente a Microsoft.

---

# 11. Arquitectura Base de Datos

## Objetivo

Diseñar una estructura relacional consistente y mantenible.

## Convenciones Base Datos

| Convención | Descripción |
|---|---|
| Naming | snake_case |
| PK | autoincremental |
| FK | explícitas |
| Índices | obligatorios |
| timestamps | obligatorios |
| Soft Delete | estado_activo + fecha_baja (excepciones: usuarios, sedes, campañas → DELETE físico) |

## Campos Estándar Recomendados

```text
id
fecha_creacion          (TIMESTAMPTZ — TIMESTAMP WITH TIME ZONE)
fecha_actualizacion     (TIMESTAMPTZ)
usuario_creacion
usuario_actualizacion
estado_activo
fecha_baja              (TIMESTAMPTZ)
```

## Lineamientos Base Datos

- Integridad referencial obligatoria.
- Índices en búsquedas críticas.
- Auditoría transversal.
- No eliminación física de datos operacionales (excepciones: usuarios, sedes y campañas pueden eliminarse físicamente por administradores).
- Relaciones explícitas.
- Restricciones obligatorias.

Las migraciones de base de datos deberán gestionarse mediante Flyway.

### Timezone en Base de Datos

- Todas las columnas de tipo timestamp usan `TIMESTAMP WITH TIME ZONE` (TIMESTAMPTZ).
- El backend utiliza `OffsetDateTime` (Java) en lugar de `LocalDateTime` para preservar la zona horaria.
- La zona horaria oficial es `America/Lima` (UTC -5).
- Ejemplo: `OffsetDateTime.now(ZoneId.of("America/Lima"))` para obtener la fecha/hora actual.

## Convención Identificadores Funcionales

| Entidad | Ejemplo |
|---|---|
| Campaña Uva | UVA-2025 |
| Campaña Arándano | ARA-2025 |
| Equipo | EQ-00001 |
| Avería | AV-00001 |
| PSR | PSR-2025-0001 |
| OSR | OSR-2025-0001 |

Las campañas podrán extenderse operativamente entre distintos años calendario sin afectar su identificador funcional.

---

# 12. Estrategia APIs REST

## Objetivo

Garantizar APIs mantenibles, escalables y seguras.

## Convenciones APIs

| Elemento | Convención |
|---|---|
| Base URL | /api/v1 |
| Formato | JSON |
| Autenticación | JWT |
| Versionamiento | Obligatorio |

Las APIs deberán mantener compatibilidad backward compatible dentro de la misma versión principal.
La plataforma deberá soportar exportación de información en formato Excel para módulos operativos y dashboards.

### Endpoints de Integración Microsoft Graph

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/v1/usuarios/buscar-por-correo?q={query} | Busca correos electrónicos del tenant Microsoft por prefijo. Retorna `List<String>`. Usa internamente `$search="mail:{query}"` en Graph API con header `ConsistencyLevel: eventual`. Autenticación requerida: JWT |

## Estándar Respuesta APIs

Todas las APIs deberán responder mediante estructura estándar para garantizar:
- consistencia,
- mantenibilidad,
- trazabilidad,
- integración frontend/backend,
- control de errores.

### Respuesta Exitosa

```json
{
  "success": true,
  "message": "Operación realizada correctamente",
  "data": {},
  "timestamp": "2026-05-18T10:00:00Z"
}
```

### Respuesta Error

```json
{
  "success": false,
  "message": "Descripción error",
  "errorCode": "ERR001",
  "timestamp": "2026-05-18T10:00:00Z"
}
```

### Lineamientos

- Todas las respuestas deberán retornar códigos HTTP correctos.
- Los errores deberán ser manejados centralizadamente.
- Los mensajes deberán ser entendibles para frontend y auditoría.
- La plataforma deberá mantener consistencia entre respuestas web y mobile.

## Métodos HTTP

| Método | Uso |
|---|---|
| GET | Consulta |
| POST | Creación |
| PUT | Actualización |
| DELETE | Desactivación lógica (excepciones: usuarios, sedes, campañas → DELETE físico por endpoint dedicado) |

## Respuestas APIs

Las APIs deberán responder:
- HTTP Status correcto,
- estructura consistente,
- mensajes controlados,
- errores estandarizados.

## Documentación APIs

La plataforma implementará:
- OpenAPI
- Swagger UI

La documentación deberá permitir:
- visualización de endpoints,
- validación de requests,
- pruebas de APIs,
- autenticación JWT,
- documentación automática de contratos REST.

La documentación Swagger deberá estar disponible en:
- ambiente desarrollo,
- ambiente QA.

---

# 13. Seguridad

## Objetivo

Garantizar autenticación segura y control de accesos.

## Seguridad Implementada

| Elemento | Implementación |
|---|---|
| Login | Microsoft Entra ID OIDC (flujo authorization_code manual vía Httpclient) con `prompt=select_account` para permitir selección/cambio de cuenta |
| Sesión | JWT (SmallRye JWT Build + SmallRye JWT) |
| Expiración | 8 horas (configurable en JwtService: Duration.ofHours(8)) |
| Refresh Token | No implementado (sesión única de 8h) |
| Roles | Super Admin (id=1), Admin (id=2), Usuario (id=3) |
| Filtro dropdown roles | El backend/ frontend filtra opciones según el rol del usuario logueado |
| Validación 3 condiciones login | 1. Existe en dim_usuarios 2. accountEnabled en Graph API 3. estadoActivo en dim_usuarios |
| Colores roles | Super Admin = verde, Admin = azul, Usuario = amarillo |
| Endpoints auth | /api/v1/auth/login, /api/v1/auth/callback (@PermitAll) |
| Endpoints protegidos | /api/v1/usuarios, /api/v1/roles (@RolesAllowed) |
| Endpoints públicos | /api/v1/usuarios/buscar-por-correo (autenticado con JWT) |
| IPv4 | Forzado via JAVA_TOOL_OPTIONS="-Djava.net.preferIPv4Stack=true" |

## Claims del JWT

| Claim | Valor |
|---|---|
| issuer | https://apilamiento.internal |
| sub | user.id |
| upn | user.correo |
| groups | rol.nombre |
| nombre | user.nombre |
| correo | user.correo |
| rolId | user.rolId |

## Lineamientos Seguridad

- Acceso únicamente corporativo (Microsoft Entra ID).
- Validación JWT obligatoria en endpoints @RolesAllowed.
- Endpoints de autenticación usan @PermitAll.
- Control permisos backend mediante @RolesAllowed.
- Control permisos frontend por rol (Super Admin, Admin, Usuario).
- Validaciones en AuthService.handleCallback:
  1. Busca usuario por correo en dim_usuarios → error si no existe
  2. Verifica accountEnabled en Graph API → error si inactivo en tenant
  3. Verifica estadoActivo en dim_usuarios → error si inactivo en app
- Correo en login: se usa userPrincipalName del token de Graph como fuente primaria, con mail como fallback (para usuarios cuyo mail use dominio onmicrosoft.com en vez del corporativo)
- Normalización: todo correo se normaliza a lowercase tanto en creación de usuario, búsqueda en Graph, como en login (comparación case-insensitive)

---

## Integración Microsoft Graph API

### Objetivo
Permitir búsqueda y autocompletado de correos electrónicos del tenant Microsoft durante la creación de usuarios, además de la validación de existencia corporativa en el login.

### Flujo App-Only Token
1. AuthService.getAppAccessToken() solicita token a `https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token` con grant_type=client_credentials y scope `https://graph.microsoft.com/.default`
2. El token se cachea en memoria (RefreshTokenCache) y se reusa hasta 5 minutos antes de expirar
3. El token se usa para llamar a Graph API sin autenticación delegada de usuario

### Búsqueda de Usuarios
- Endpoint: `GET /api/v1/usuarios/buscar-por-correo?q={query}`
- Llama a `GET https://graph.microsoft.com/v1.0/users?$search="mail:{query}"&$select=mail&$top=10`
- Header requerido: `ConsistencyLevel: eventual` (necesario para $search)
- Retorna `List<String>` con los correos encontrados
- El query se normaliza a minúsculas antes de enviar a Graph
- Se usa el campo `mail` para la búsqueda (userPrincipalName no soporta $search)

### Frontend Autocomplete
- Componente MUI `<Autocomplete freeSolo>` en el campo de correo del formulario de creación de usuarios
- Debounce de 300ms antes de disparar la búsqueda al backend
- Se muestran solo los correos en el dropdown (sin nombre)
- Al seleccionar un correo, solo se llena el campo correo; el resto del formulario no se modifica
- freeSolo permite escribir un correo manualmente si no aparece en el tenant

### Normalización de Correos
- Todo correo se normaliza a `toLowerCase()` en:
  - Creación de usuario (UsuarioService.crear)
  - Búsqueda en Graph (AuthService.searchUsersByEmail)
  - Login (AuthService.handleCallback) — el email de Graph se pasa a lowercase antes de buscar en DB

### Prioridad userPrincipalName
- En AuthService.handleCallback, al recibir datos de Graph (/me), se usa:
  1. `userPrincipalName` como fuente primaria de correo
  2. `mail` como fallback si userPrincipalName no existe
- Esto resuelve el caso donde `mail` contiene dominio onmicrosoft.com (ej: usuario@vanguardfreshperu.onmicrosoft.com) en vez del dominio corporativo (ej: usuario@vanguardfresh.pe)

### Permisos Azure AD Requeridos
- `User.Read.All` (Application permission) — para búsqueda de usuarios en el tenant
- Consentimiento de administrador requerido en Azure Portal

---

# 14. Estrategia Fotografías

## Objetivo

Gestionar fotografías operativas de manera controlada.

## Configuración Fotografías

| Configuración | Valor |
|---|---|
| Tamaño Máximo | 5 MB |
| Formatos | JPG / PNG |
| Múltiples Fotos | Sí |
| Compresión | Obligatoria |
| Resolución Máxima | 1080x720 |
| Almacenamiento | Filesystem |

## Lineamientos Fotografías

- Validación tamaño obligatoria.
- Validación formato obligatoria.
- Asociación obligatoria.
- Rutas controladas.
- Prevención duplicados.
- Solo usuarios Administrador podrán eliminar fotografías.
- Toda eliminación de fotografías deberá quedar registrada en auditoría.
- Las fotografias no deben eliminarse fisicamente; solo se permite baja logica con trazabilidad de auditoria.
- El sistema deberá aplicar compresión automática server-side.

---

# 15. Estrategia Auditoría

## Objetivo

Garantizar trazabilidad operacional completa.

## Eventos Auditables

| Evento | Auditoría |
|---|---|---|
| Login | Sí |
| Logout | Sí |
| Creación | Sí |
| Actualización | Sí |
| Desactivación | Sí |
| Eliminación física | Sí |
| Errores críticos | Sí |

## Información Auditada

| Información | Registro |
|---|---|
| Usuario | Sí |
| Fecha | Sí |
| Hora | Sí |
| Módulo | Sí |
| Acción | Sí |

La auditoría funcional deberá conservarse históricamente mientras exista el sistema.

---

# 16. Estrategia Logging

## Objetivo

Garantizar monitoreo técnico y soporte operativo.

## Tipos Logs

| Archivo | Propósito |
|---|---|
| application.log | Operación general |
| security.log | Seguridad |
| audit.log | Auditoría |
| error.log | Errores críticos |

## Política Logs

| Configuración | Valor |
|---|---|
| Retención | 6 meses |
| Rotación | Automática |

La auditoría funcional y trazabilidad operacional serán independientes de la política de rotación de logs técnicos.

---

# 17. Estrategia Manejo Errores

## Objetivo

Centralizar y controlar errores técnicos y funcionales.

## Lineamientos

- Manejo global excepciones backend.
- Mensajes controlados frontend.
- Logs automáticos.
- Errores estandarizados.
- No exposición información sensible.

La aplicación móvil deberá manejar:
- expiración automática de sesión,
- reintentos controlados,
- mensajes amigables al usuario,
- redirección automática al login en caso de token inválido,
- manejo controlado de pérdida de conectividad.

---

# 18. Estrategia Nginx (Frontend Serving)

## Objetivo

Servir la SPA frontend estática y hacer reverse proxy al backend.

## Configuración

| Ruta | Destino |
|---|---|
| /api/ | backend:8080 |
| /q/openapi | backend (OpenAPI spec JSON) |
| /q/health | backend (health check) |
| /swagger | backend (Swagger UI) |
| / (default) | /usr/share/nginx/html (frontend SPA) |

## Frontend Serving

- El frontend se construye via Vite (`npm run build`) y el output `frontend/dist/` se copia o monta en nginx.
- El nginx usa `try_files $uri $uri/ /index.html` para soportar SPA routing.
- En desarrollo, cambios en archivos JS/CSS/HTML requieren rebuild (`npm run build`) o montar `frontend/dist/` como volumen.
- En producción, el build se ejecuta durante el pipeline CI/CD y la salida `dist/` se copia al contenedor nginx.

---

# 19. Estrategia Docker

## Objetivo

Estandarizar despliegue y operación.

## Contenedores

| Servicio | Contenedor | Puerto |
|---|---|---|
| Backend | Docker (multi-stage: maven build + JRE runtime) | 8080 |
| Frontend Web | Nginx (sirve archivos estáticos) | 80, 443 |
| PostgreSQL | PostgreSQL 18 oficial | 5432 |
| Nginx Reverse Proxy | Nginx Alpine oficial | 80, 443 |

## Backend Dockerfile

```text
Stage 1 (build): maven:3.9-eclipse-temurin-21 → mvn package con uber-jar
Stage 2 (runtime): eclipse-temurin:21-jre-alpine → copia *-runner.jar como app.jar
Entrypoint: java -jar app.jar
```

## Nota sobre versiones Java

| Ambiente | Versión |
|---|---|
| Host local (dev) | JDK 17 (por disponibilidad) |
| Contenedor Docker | JDK 21 (eclipse-temurin:21-jre-alpine) |
| POM Backend | Quarkus 3.14.4 (última versión compatible con JDK 17) |

## Lineamientos Docker

- Docker Compose obligatorio.
- Persistencia volúmenes (postgres-data).
- Variables entorno externas obligatorias (vía `.env` o ambiente del sistema); los secretos no deben tener valores reales hardcodeados en archivos versionables.
- Red privada interna automática (docker compose).
- Dependencia de servicios: nginx → backend → postgres (healthcheck).
- IPv4 forzado via JAVA_TOOL_OPTIONS para evitar fallos de red en Docker.
- Healthcheck en PostgreSQL con pg_isready.
- Frontend montado como volumen: ./frontend → /usr/share/nginx/html (live reload).
- Cambios en frontend no requieren reinicio de contenedor.

---

<!-- # 19. Estrategia CI/CD (Pendiente)

A implementar cuando se defina la infraestructura de producción.

--- -->

# 20. Estrategia Despliegue

## Objetivo

Garantizar estabilidad operacional productiva.

## Infraestructura

| Componente | Tecnología |
|---|---|
| Hosting | VPS |
| Proxy | Nginx |
| SSL | HTTPS |
| Contenedores | Docker |

## Ambientes

| Ambiente | Uso |
|---|---|
| Desarrollo | Desarrollo interno |
| QA | Validaciones |
| Producción | Operación real |

La infraestructura deberá operar bajo timezone oficial:
- America/Lima
- UTC -5
---

# 21. Estrategia Backups

## Objetivo

Garantizar recuperación operacional.

## Política Backups

| Tipo | Frecuencia |
|---|---|
| Base Datos | Diario |
| Fotografías | Diario |
| Full Backup | Semanal |

## Lineamientos Backups

- Automatización obligatoria.
- Validación restauración.
- Persistencia externa recomendada.
- Control histórico backups.

Las fotografías eliminadas manualmente por administradores no deberán recuperarse automáticamente mediante restauraciones parciales.

---

# 22. Estrategia Monitoreo

## Objetivo

Garantizar monitoreo técnico básico.

## Monitoreo Implementado

| Elemento | Estado |
|---|---|
| Healthchecks | Sí |
| Logs | Sí |
| Estado APIs | Sí |
| Estado DB | Sí |

## Endpoints Recomendados

```text
/health
/metrics
```

---

# 23. Estándares de Desarrollo

## Objetivo

Mantener uniformidad técnica y mantenibilidad.

## Convenciones

| Área | Convención |
|---|---|
| Backend | camelCase |
| Base Datos | snake_case |
| APIs | kebab-case |
| Branches | feature/fix/hotfix |
| Commits | Convencionales |

## Buenas Prácticas

- Clean Code obligatorio.
- Componentes reutilizables.
- Métodos pequeños.
- DTOs obligatorios.
- Separación responsabilidades.
- Evitar lógica duplicada.

La plataforma implementará optimistic locking en fases futuras para evitar conflictos de concurrencia en actualizaciones simultáneas.

---

# 24. Estrategia Testing

## Objetivo

Garantizar estabilidad y calidad operacional.

## Tipos Testing

| Tipo | Aplicación |
|---|---|
| Unitario | Backend |
| Integración | APIs |
| Funcional | Frontend |
| Manual | Operación |

## Lineamientos Testing

- Validación APIs obligatoria.
- Validación autenticación.
- Validación permisos.
- Validación formularios.
- Validación auditoría.

---

# 25. Riesgos Técnicos

| Riesgo | Impacto |
|---|---|
| Dependencia VPS único | Medio |
| No operación offline | Medio |
| Crecimiento fotografías | Alto |
| Escalabilidad dashboards | Medio |

---

# 26. Deuda Técnica Controlada

| Elemento | Estado |
|---|---|
| Offline Mode | Futuro |
| Storage distribuido | Futuro |
| Alta disponibilidad | Futuro |
| Queue processing | Futuro |
| BI avanzado | Futuro |

---

# 27. Roadmap Técnico Futuro

## Posibles Evoluciones

- Implementación almacenamiento distribuido.
- Implementación telemetría.
- Implementación analítica avanzada.
- Implementación procesamiento asíncrono.
- Implementación escalabilidad horizontal.
- Implementación balanceo carga.

---

# 28. Consideraciones Finales

Toda futura ampliación deberá mantener compatibilidad con:
- arquitectura definida,
- lineamientos técnicos,
- estándares establecidos,
- seguridad,
- mantenibilidad,
- trazabilidad operacional.

El desarrollo deberá respetar:
- desacoplamiento,
- modularidad,
- estabilidad,
- reutilización,
- mantenibilidad,
- crecimiento controlado.

El presente documento servirá como referencia oficial para:
- desarrollo,
- validación,
- mantenimiento,
- evolución futura del sistema.

---

# 29. Aprobaciones

| Rol | Responsable | Estado |
|---|---|---|
| Responsable Funcional | Pendiente | Pendiente |
| Responsable Técnico | Pendiente | Pendiente |
| Responsable Proyecto | Pendiente | Pendiente |
| Aprobación Final | Pendiente | Pendiente |


