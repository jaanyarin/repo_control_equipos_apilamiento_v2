# HDT-005 — Reconstrucción Mobile React Native CLI (CANCELADO ❌)

| Campo | Valor |
|---|---|
| Estado | **CANCELADO** — No se ejecutó la migración |
| Fecha de cancelación | 2026-07-30 |
| Responsable | Jose Anyarin |
| Dependencia | ADR-A005 aprobado |

## Motivo de Cancelación

Este hito proponía reconstruir la aplicación mobile desde cero usando React Native CLI puro, abandonando Expo. Sin embargo, se determinó que:

1. **Expo SDK 54 cumple con todos los requisitos operativos** actuales (navegación, formularios, cámara, almacenamiento seguro, APK).
2. **El build local está bloqueado por Sophos** de todos modos, por lo que migrar a CLI no resolvería la restricción de build local.
3. **EAS Cloud** proporciona build en la nube para Expo, eliminando la necesidad de build local.
4. **El esfuerzo de reconstrucción** (reescribir 19+ pantallas, navegación, tema, componentes) no se justifica para el valor agregado actual.
5. **No hay requerimiento funcional** que Expo no pueda satisfacer.

## Decisión

El proyecto **se mantiene con Expo React Native SDK ~54.0.35** como stack mobile oficial.

| Aspecto | Decisión |
|---|---|
| Stack mobile | Expo SDK 54 (NO CLI) |
| Build APK | EAS Cloud (perfiles: preview, production) |
| Almacenamiento seguro | expo-secure-store |
| Navegación | React Navigation v7 (NativeStackNavigator + BottomTabNavigator) |
| Formularios | React Hook Form + Zod |
| UI | react-native-paper (MD3) |
| Tema | Design tokens con modo claro/oscuro |

## Archivos de Configuración Congelados (NO MODIFICAR)

| Archivo | Clave | Valor |
|---|---|---|
| `package.json` | `main` | `"expo/AppEntry"` |
| `app.json` | `jsEngine` | `"hermes"` |
| `app.json` | `platforms` | `["android"]` |
| `android/gradle.properties` | `hermesEnabled` | `true` |
| `android/gradle.properties` | `newArchEnabled` | `true` |
