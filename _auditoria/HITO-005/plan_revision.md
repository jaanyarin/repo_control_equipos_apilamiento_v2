# Plan-review — HDT-005

## Material de revisión

- ADR-A005: reconstrucción React Native CLI desde cero.
- SDD HDT-005: alcance, fases, gates y criterios de aceptación.

## Decisión solicitada al Auditor AI

Validar o devolver observaciones sobre:

1. Sustitución controlada de `mobile/` sin reutilizar código Expo.
2. Gates aplicables y exclusión explícita de offline.
3. Orden de implementación y evidencia requerida para el primer APK.
4. Política de conservar `mobile_expo_backup/` como rollback durante el hito.

## Resultado de revisión

| Gate | Resultado | Evidencia / condición |
|---|---|---|
| G-DOC | Pasa | ADR-A005 y SDD HDT-005 definen alcance, riesgos, gates y aceptación. |
| G-MOB | Pasa con condición | La arquitectura modular debe materializarse antes de los módulos funcionales. |
| G-MOB-NAV | Pasa con condición | Navegación por stacks/tabs y deep link se validan en Fase C. |
| G-MOB-SEC | Pasa con condición | JWT debe usar Keychain; no se admite AsyncStorage. |
| G-MOB-OFFLINE | No aplicable | El alcance oficial excluye operación offline. |
| G-MOB-BUILD | Bloqueante pendiente | Debe generarse `app-debug.apk` en GitHub Actions/Linux antes de sustituir `mobile/`. |

## Decisión del gate

Se aprueba la Fase A y se autoriza ejecutar exclusivamente la Fase B: generar
y validar una base React Native CLI limpia en CI Linux. No se autoriza todavía
eliminar o sustituir el contenido de `mobile/`; esa acción requiere evidencia
de build debug satisfactoria en GitHub Actions.
