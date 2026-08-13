# FIREBASE FCM — GUÍA DE CONFIGURACIÓN (Fase 0 / Prerrequisito manual)

| Campo | Valor |
|---|---|
| Fecha | 2026-08-13 |
| Alcance | Proyecto Firebase + app Android + Service Account para notificaciones push FCM |
| Propósito | Habilitar push reales al celular cuando ocurren eventos operativos: ingreso de equipo, avería reportada, avería atendida y finalización del servicio |
| Estado | ✅ CONFIGURADO en `.env` (`FCM_PROJECT_ID` + `FCM_SERVICE_ACCOUNT`) — pasos manuales de consola ya ejecutados |
| Requiere | Cuenta de Google con acceso a Firebase console |

---

## 1. Contexto

El sistema envía notificaciones push cuando un usuario ejecuta una de estas acciones:

| Evento | `data.tipo` | Título | Ocurre en |
|---|---|---|---|
| Finalizar ingreso de un equipo | `INGRESO_EQUIPO` | Nuevo ingreso de equipo | `IngresoEquipoService.finalizar` |
| Registrar una avería | `AVERIA_REPORTADA` | Nueva avería reportada | `AveriaService.crear` |
| Atender una avería | `AVERIA_ATENDIDA` | Avería atendida | `AveriaService.actualizar` (primera atención) |
| Finalizar el servicio (devolución) | `SERVICIO_FINALIZADO` | Servicio finalizado | `DevolucionEquipoService.finalizar` |

Plantilla del mensaje:

```
Evento: Nuevo ingreso de Equipo
Proveedor: ACME S.A.C. - Codigo: EQ-001
Registrado por: JUAN PEREZ
```

Según la regla aprobada:

> **Destinatarios = todos los usuarios con APK instalado y sesión iniciada, EXCEPTO el que registró la acción.**
> Ejemplo: con 25 usuarios logueados → la notificación llega a los otros 24.

Esto requiere dos piezas externas que **solo el usuario (cuenta de Google) puede crear**:

1. **`google-services.json`** → identifica la app Android frente a Firebase (va dentro del proyecto mobile).
2. **Service Account (JSON de clave privada)** → permite al backend enviar push firmando el OAuth2 de Google (se guarda como secreto, NUNCA versionado).

Sin estos 2 archivos el backend no puede enviar y el celular no puede recibir notificaciones.

---

## 2. Paso 1 — Crear el proyecto Firebase

1. Ir a https://console.firebase.google.com e iniciar sesión con la cuenta Google corporativa.
2. Click en **"Crear un proyecto"** (o "Add project").
3. Nombre del proyecto sugerido: `apilamiento-notificaciones` (puede ser otro mientras se identifique).
4. Google Analytics: **desactivar** ("No habilitar Google Analytics para este proyecto") — no lo necesitamos.
5. Click **"Crear proyecto"** y esperar a que termine la creación.

---

## 3. Paso 2 — Registrar la app Android

1. En la consola del proyecto, click en el ícono **Android** (`+` `Agregar app` → `Android`).
2. **Nombre del paquete (obligatorio y exacto):** `com.apilamiento.mobile`
   > ⚠️ REGISTRAR ESTE PAQUETE EXACTO. Es el `applicationId` del APK (definido en
   > `mobile/android/app/build.gradle` → `applicationId "com.apilamiento.mobile"`).
   > Si el paquete no coincide, `google-services.json` no funcionará.
3. Apodo de la app (opcional): `Apilamiento Mobile`.
4. Click **"Registrar la app"**.
5. En el siguiente paso, Firebase ofrece descargar **`google-services.json`**. Descargarlo y
   guardarlo temporalmente (en esta guía se colocará dentro del repo en el paso de build mobile,
   en `mobile/android/app/google-services.json`).
   - Click **"Descargar google-services.json"**.
   - Guardar el archivo (NO modificar su contenido).
6. En el paso "Agregar el SDK de Firebase" NO hace falta agregar nada manualmente: la integración
   se hará por código en el proyecto mobile (Fase 2). Se puede hacer click en **"Siguiente"** hasta
   finalizar, o simplemente cerrar el asistente.

---

## 4. Paso 3 — Verificar Cloud Messaging

1. En el menú izquierdo de la consola: **Configuración del proyecto** (ícono de engranaje).
2. Pestaña **"Cloud Messaging"** (o "Mensajería en la nube").
3. Verificar que aparece la app Android registrada (sección "Aplicaciones de Android").
4. No es necesaria la "API legacy de servidor" ni la clave del servidor (legacy): el backend usará
   **FCM HTTP v1** (protocolo nuevo, firmado con el Service Account).
5. Anotar el **ID del proyecto** (se muestra en Configuración → General, campo "ID de proyecto"),
   porque el backend lo necesita para armar la URL del mensaje:
   `https://fcm.googleapis.com/v1/projects/{PROJECT_ID}/messages:send`.

---

## 5. Paso 4 — Crear el Service Account (clave privada para el backend)

1. En la consola Firebase: **Configuración del proyecto** → pestaña **"Cuentas de servicio"**.
2. Hacer click en **"Generar nueva clave privada"**.
3. Confirmar en el diálogo → Firebase descarga un **archivo JSON** (el JSON del Service Account,
   que incluye `client_email`, `private_key`, `project_id`, etc.).
4. Guardar este archivo en un lugar **seguro y fuera del control de versiones**, por ejemplo:
   `C:\secrets\apilamiento-fcm-service-account.json` (o el path que prefieras).
5. El contenido de ese JSON se inyectará como variable de entorno del backend
   (`FCM_SERVICE_ACCOUNT`, ver Fase 1 del plan). **NUNCA** copiar el contenido al repo.

> ⚠️ Seguridad: este JSON concede capacidad de enviar notificaciones a nombre del proyecto.
> No compartirlo, no commitearlo, no pegarlo en chats/código.

---

## 6. Paso 5 — Entregables que debes tener listos

Al completar los pasos anteriores, debes tener:

| # | Archivo | Formato | Destino final |
|---|---|---|---|
| 1 | `google-services.json` | JSON público de la app | `mobile/android/app/google-services.json` (dentro del repo, Fase 2) |
| 2 | JSON del Service Account | JSON con clave privada | Fuera del repo: `C:\secrets\apilamiento-fcm-service-account.json` (ejemplo) |
| 3 | **PROJECT_ID** | texto | Se anota en `application.properties` / `.env` del backend (Fase 1) |

---

## 7. Verificación rápida (opcional, antes de la Fase 2)

En la consola Firebase → **"Mensajería"** → **"Enviar primera notificación"** puedes probar el envío
a la app SOLO cuando el APK ya tenga integrado el SDK de Firebase (después de la Fase 2 / rebuild).
No intentes esta prueba antes del rebuild, porque el APK actual no tiene el SDK de FCM.

---

## 8. Notas y prohibiciones

- ❌ No registrar el paquete Android con otro nombre que `com.apilamiento.mobile`.
- ❌ No versionar `google-services.json` con secretos modificados (es un archivo de cliente, no secreto, pero pertenece al proyecto).
- ❌ NO versionar el JSON del Service Account (es un secreto de envío).
- ✅ Si el proyecto mobile ya no usa Expo sino React Native CLI puro (`index.js`), la integración se hace vía Gradle + `@react-native-firebase`, no vía Expo config plugins.