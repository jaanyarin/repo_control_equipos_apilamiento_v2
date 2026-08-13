# BUILD ANDROID — GUÍA LEGADA (OBSOLETA — NO USAR)

> ## ⚠️ ADVERTENCIA
> **Este documento está OBSOLETO.** El APK **NO usa Expo SDK ni EAS Cloud**.
>
> El proyecto es **React Native CLI puro** y el build se hace **localmente con Gradle** (debug/release):
> - Debug: `npm run android:debug` → `mobile/android/app/build/outputs/apk/debug/app-debug.apk`
> - Release: `npm run android:release` → `mobile/android/app/build/outputs/apk/release/app-release.apk`
>
> NO ejecutar `eas-cli` ni usar EAS Cloud para nada. Ver el documento vigente:
> **`documentacion_general/sdd/07_build_android_gradle.md`**

---

| Campo | Valor |
|---|---|
| Fecha | 2026-05-29 (legado) |
| Alcance | APK Android instalable |
| Estado | ⚠️ OBSOLETA — reemplazada por `07_build_android_gradle.md` |

---

## Contenido histórico (NO ejecutar)

- ~~Build mediante EAS Cloud (Expo)~~ → **REEMPLAZADO por build local Gradle.**
- ~~Perfiles EAS `preview`/`production`~~ → **NO aplica.**
- ~~`package.json` main = `expo/AppEntry`~~ → **NO aplica (el real es `index.js`).**

---

*Documento legado. Versión 0.0 — 2026-08-13*
