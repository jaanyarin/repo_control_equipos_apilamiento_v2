# AUDITORIA TÉCNICA — HITO-002 (Pre-núcleo Operativo)

| Campo | Valor |
|---|---|
| Fecha | 2026-06-08 |
| Auditor | AI Auditor |
| Hito auditado | HDT-002 — Núcleo operativo |
| Estado HITO | En planificación técnica |
| Dependencia | HDT-001 validado |

---

## 1. Semáforo General

| Área | Estado |
|---|---|
| Backend (módulos base) | 🟢 Validado |
| Frontend Web (módulos base) | 🟢 Validado |
| Backend (módulos operativos) | 🟡 Parcial |
| Frontend Web (módulos operativos) | 🔴 Pendiente |
| Mobile APK (login + build) | 🟢 Validado |
| Mobile pantallas operativas | 🔴 No iniciado |
| Migraciones Flyway | 🟢 Existen V1-V7 |
| Documentación | 🟢 Adecuada |

---

## 2. Hallazgos por Gate

### G-MOB (Arquitectura Mobile) — 🔴 Crítico

| Archivo | Hallazgo |
|---|---|
| `mobile/App.js` | Solo renderiza `LoginScreen`. No hay estructura de navegación. No hay separación por features. |
| `mobile/src/` | Solo 3 archivos: `LoginScreen.js`, `AuthContext.js`, `api.js`. No hay estructura modular. |

**Evidencia:** App.js:22-23 renderiza únicamente `<LoginScreen />`. No existe navegador, stack, tabs ni estructura de pantallas.

**Remediación:** Implementar React Navigation con estructura de stacks (Auth stack vs Main stack), layout de navegación inferior (Bottom Tabs) para módulos operativos.

### G-MOB-NAV (Navegación Mobile) — 🔴 Crítico

| Archivo | Hallazgo |
|---|---|
| `mobile/package.json:19-20` | `@react-navigation/native` y `@react-navigation/native-stack` instalados pero NO configurados |
| `mobile/App.js` | No importa ni usa ningún navigator |

**Evidencia:** Dependencias existen en package.json pero App.js no las utiliza. No hay `NavigationContainer`, ni `createNativeStackNavigator`, ni `createBottomTabNavigator`.

**Remediación:** Configurar `NavigationContainer` + `NativeStackNavigator` para Auth → Main flow + Bottom Tabs para secciones operativas.

### G-MOB-STATE (Estado Global) — 🟡 Medio

| Archivo | Hallazgo |
|---|---|
| `mobile/src/AuthContext.js` | AuthContext implementado correctamente para sesión |
| — | No hay slices/store para datos operativos (equipos, averías, etc.) |

**Evidencia:** El AuthContext maneja solo estado de autenticación. No hay estado para datos de negocio. Se necesitará Redux Toolkit o Context API por feature según crezca la app.

**Remediación:** Evaluar si usar Context API o Redux Toolkit cuando se implementen las pantallas operativas.

### G-MOB-FORM (Formularios Mobile) — 🟡 Medio

| Archivo | Hallazgo |
|---|---|
| `mobile/package.json` | React Hook Form y Zod NO están en dependencias |

**Evidencia:** El perfil de desarrollo lista React Hook Form + Zod como stack de formularios, pero no están instalados en mobile. El LoginScreen usa useState manual.

**Remediación:** Instalar `react-hook-form` + `zod` + `@hookform/resolvers` antes de implementar formularios operativos.

### G-MOB-UI (UI Mobile) — 🟡 Medio

| Archivo | Hallazgo |
|---|---|
| `mobile/App.js:8-15` | MD3LightTheme configurado con colores primarios correctos |
| — | Solo existe 1 pantalla. No hay lista de equipos, formularios, ni componentes reutilizables. |

**Evidencia:** Tema MD3 funcional pero sin componentes de UI operativos más allá del login.

**Remediación:** Crear componentes base reutilizables (DataTable, EmptyState, ErrorBoundary, Card) siguiendo MD3.

### G-MOB-OFFLINE (Estrategia Offline) — 🟢 Bajo (Excluido por alcance)

**Evidencia:** El documento 02_planes.md sección 2.2 excluye operación offline del alcance actual. No es blocking.

### G-MOB-SEC (Seguridad Mobile) — 🟢 Validado

| Archivo | Hallazgo |
|---|---|
| `mobile/src/api.js:71-77` | `setToken()`/`removeToken()` usan `expo-secure-store` ✅ |
| `mobile/app.json:36-41` | Plugin `expo-secure-store` configurado ✅ |
| `mobile/src/api.js:57-65` | Interceptor 401 limpia token ✅ |

**Evidencia:** Tokens almacenados en SecureStore, no en AsyncStorage. Manejo seguro correcto.

### G-MOB-FCM (Firebase) — 🟡 Medio

| Hallazgo |
|---|
| Firebase NO está configurado. No hay `google-services.json`, ni dependencias FCM/Analytics/Crashlytics en package.json. |

**Remediación:** Configurar Firebase project, agregar google-services.json y dependencias cuando se requieran notificaciones push. No blocking para HDT-002.

### G-MOB-BUILD (Build & Distribución) — 🟢 Validado

| Archivo | Hallazgo |
|---|---|
| `mobile/eas.json` | Perfiles preview (APK) y production (AAB) configurados ✅ |
| `mobile/app.json:12-14` | Android package configurado ✅ |
| `07_build_android_eas.md` | APK compilado, instalado y probado en Android 14 (realme C21Y) ✅ |

**Evidencia:** APK funcional compilado y probado. Build local documentado con workaround por Sophos. Documentación de errores conocidos. **No modificar configuración sin validación.**

### G-ARQ (Arquitectura Backend) — 🟢 Parcial

| Archivo | Hallazgo |
|---|---|
| `backend/.../entity/TipoEquipo.java` | ✅ Entity existe |
| `backend/.../repository/TipoEquipoRepository.java` | ✅ Repository existe |
| — | ❌ NO existe Service, Controller, DTO, Mapper para TipoEquipo |

**Evidencia:** TipoEquipo tiene Entity + Repository pero no tiene Service, Controller, DTO ni Mapper. Las migraciones V4 (catálogos), V5 (equipos), V6 (PSR/OSR), V7 (averías) ya existen en Flyway.

**Remediación:** Completar capas faltantes de TipoEquipo como primer paso de HDT-002.

### G-API (API REST) — 🟡 Medio

| Hallazgo |
|---|
| APIs de usuarios, sedes, campañas funcionando en `/api/v1/`. No hay endpoints para tipos_equipo, proveedores, marcas, equipos, psr, osr, averías. |

### G-MIG (Migraciones) — 🟢 Validado

| Hallazgo |
|---|
| V1 a V7 existen y están numeradas secuencialmente. Naming consistente. Migraciones para catálogos, equipos, PSR/OSR y averías ya creadas. Pendiente: sincronizar implementación backend con migraciones existentes. |

### G-TEST-BE / G-TEST-FE — 🔴 Pendiente

| Hallazgo |
|---|
| No existen tests automatizados (backend ni frontend). Mencionado en auditoría previa como hallazgo medio. |

### G-DOC (Documentación) — 🟢 Validado

| Hallazgo |
|---|
| SDD completa (01-07). Hitos documentados. Perfiles actualizados. Auditoría pre-APK documentada. Build Android documentado. |

---

## 3. Mapa de Implementación Actual

### Backend (módulos completos)
```
✅ AuthResource       ✅ AuthMeResource      ✅ UsuarioResource
✅ RolResource        ✅ SedeResource        ✅ CampanaResource
```

### Backend (módulos incompletos)
```
⚠️ TipoEquipo:       Entity + Repository (falta Service, Controller, DTO, Mapper)
❌ Proveedor:        Nada implementado (migración V4 existe)
❌ Marca:            Nada implementado (migración V4 existe)
❌ Equipo:           Nada implementado (migración V5 existe)
❌ PSR:              Nada implementado (migración V6 existe)
❌ OSR:              Nada implementado (migración V6 existe)
❌ Avería:           Nada implementado (migración V7 existe)
❌ Evidencia:        Nada implementado
❌ Auditoría:        Nada implementado
```

### Frontend Web
```
✅ Login      ✅ Usuarios     ✅ Roles      ✅ Sedes      ✅ Campañas
❌ TipoEquipo ❌ Proveedores  ❌ Marcas     ❌ Equipos    ❌ PSR/OSR
❌ Averías    ❌ Dashboard KPI
```

### Mobile (pantallas)
```
✅ LoginScreen (Microsoft OAuth + PKCE + JWT SecureStore) 
❌ Home/Dashboard screen
❌ Listado de Equipos
❌ Registro de Averías
❌ Atención de Averías
❌ Captura de Fotografías
❌ Perfil de usuario
❌ Navegación entre pantallas
```

---

## 4. Hoja de Ruta para Desarrollo Mobile (APK)

### Prioridad 1 — Infraestructura Mobile (Debe hacerse antes de cualquier pantalla)

| # | Tarea | Gate | Estimación |
|---|---|---|---|
| 1.1 | Configurar React Navigation: AuthStack + MainStack + BottomTabs | G-MOB-NAV | — |
| 1.2 | Separar App.js en estructura de navegación con `NavigationContainer` | G-MOB-NAV | — |
| 1.3 | Crear layout base con Bottom Navigation (equipos, averías, perfil) | G-MOB, G-MOB-NAV | — |
| 1.4 | Instalar `react-hook-form`, `zod`, `@hookform/resolvers` | G-MOB-FORM | — |

### Prioridad 2 — Backend para APIs Mobile (Sincronizar con frontend web)

| # | Tarea | Gate |
|---|---|---|
| 2.1 | Completar TipoEquipo: Service + Controller + DTO + Mapper | G-ARQ, G-API |
| 2.2 | Implementar Proveedores (completo) | G-ARQ, G-API |
| 2.3 | Implementar Marcas (completo) | G-ARQ, G-API |
| 2.4 | Implementar Equipos (completo) + endpoints de consulta mobile | G-ARQ, G-API |
| 2.5 | Implementar Averías (completo) + endpoints de registro mobile | G-ARQ, G-API |

### Prioridad 3 — Pantallas Mobile Operativas

| # | Tarea | Gate | API Requerida |
|---|---|---|---|
| 3.1 | Pantalla Home con resumen/estado de equipos | G-MOB-UI | `/api/v1/equipos/resumen` |
| 3.2 | Pantalla Listado de Equipos (con filtros por estado/sede/campaña) | G-MOB-UI | `GET /api/v1/equipos` |
| 3.3 | Pantalla Detalle de Equipo (info + estado + averías activas) | G-MOB-UI | `GET /api/v1/equipos/{id}` |
| 3.4 | Pantalla Registrar Avería (formulario con React Hook Form + Zod) | G-MOB-FORM | `POST /api/v1/averias` |
| 3.5 | Pantalla Atender Avería (cerrar avería con observaciones) | G-MOB-FORM | `PUT /api/v1/averias/{id}` |
| 3.6 | Pantalla Perfil de Usuario (datos + cerrar sesión) | G-MOB-UI | `GET /api/v1/auth/me` |

### Prioridad 4 — Mejoras Transversales

| # | Tarea | Gate |
|---|---|---|
| 4.1 | Implementar manejo global de errores en mobile (toasts, error boundary) | G-MOB |
| 4.2 | Agregar loading states y ActivityIndicator en todas las pantallas | G-MOB-UI |
| 4.3 | Implementar refresh-to-update en listados | G-MOB |
| 4.4 | Agregar pruebas unitarias con Jest + React Native Testing Library | G-TEST-FE |
| 4.5 | Configurar Firebase Crashlytics para reporte de errores | G-MOB-FCM |

---

## 5. Hallazgos Críticos y Altos

### 🔴 Críticos (bloquean cierre de HITO)

| ID | Hallazgo | Remedio |
|---|---|---|
| C-001 | App.js no tiene navegación configurada. Solo renderiza LoginScreen. | Implementar React Navigation con estructura AuthStack/MainStack antes de agregar nuevas pantallas. |
| C-002 | No existe ninguna pantalla operativa mobile (equipos, averías, etc.). | Desarrollar mínimo 2 pantallas operativas para validar el flujo completo (login → listado equipos → detalle). |

### 🟠 Altos (deben remediarse antes del siguiente HITO)

| ID | Hallazgo | Remedio |
|---|---|---|
| A-001 | TipoEquipo tiene Entity+Repository pero no Service/Controller/DTO/Mapper. | Completar capas faltantes como primer backend del HITO-002. |
| A-002 | Proveedores y Marcas no tienen backend ni frontend. | Implementar backend completo y frontend web para ambos catálogos. |
| A-003 | Equipos no tiene backend ni frontend (migración V5 existe). | Implementar backend completo y frontend web. |
| A-004 | React Hook Form + Zod no están instalados en mobile/package.json. | Instalar dependencias antes de crear formularios operativos. |

---

## 6. Recomendación

**Secuencia de implementación recomendada:**

1. **Primero backend** (TipoEquipo → Proveedores → Marcas → Equipos → Averías): completar todas las capas
2. **Luego frontend web** (mismos módulos en el mismo orden): CRUD web funcional
3. **Luego infraestructura mobile**: navegación instalada y configurada
4. **Luego pantallas mobile**: Home → Listado Equipos → Detalle Equipo → Registrar Avería → Atender Avería

Este orden garantiza que cuando el desarrollador mobile construya pantallas, las APIs ya estén disponibles y probadas desde el frontend web.

---

*Documento generado por AI Auditor. Versión 1.0 — 2026-06-08*
