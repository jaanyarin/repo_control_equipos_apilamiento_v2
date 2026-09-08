# HDT-017 — Reporte PDF: mejora UX/UI y fix descarga mobile

| Campo | Valor |
|---|---|
| Estado | Implementado |
| Fecha | 2026-09-08 |
| Responsable | AI Full Stack |
| Versión mobile | 1.14.0 (minor) |

## Objetivo

Mejorar la experiencia de usuario del reporte PDF generado por el backend, optimizando el layout de las tablas de información, la distribución de fotografías en páginas separadas y corrigiendo el error de descarga en la aplicación mobile.

## Problema detectado

Al descargar el PDF desde la app mobile, se mostraba el error:

```
error descargando reporte: HTTP sin respuesta al descargar reporte. Detalle: %PDF-1.5...
```

**Causa raíz:** `ReactNativeBlobUtil.fetch` retornaba `statusCode: undefined` en el dispositivo, pero la respuesta SÍ contenía un PDF válido (el contenido `%PDF-1.5` se filtraba como texto del error).

**Solución:** Reemplazar la verificación de `statusCode` por validación de magic bytes PDF (`JVBER` = `%PDF` en base64).

## Cambios backend — ReporteService.java

### Layout de tablas (mejor UX)

| Sección | Antes | Ahora |
|---|---|---|
| Información General | Tabla 2 columnas vertical (label/value) | Tabla 4 columnas compacta (label1/value1/label2/value2) |
| Información de Accesorios | Tabla 2 columnas vertical | Tabla 4 columnas compacta (grid 2×2) |
| Información del Servicio | Tabla 2 columnas vertical (15 filas) | Tabla 4 columnas compacta (8 filas) |
| Títulos de sección | Centrados | Alineados a la izquierda |

### Colores y estilos

| Elemento | Valor |
|---|---|
| HEADER_BG | `Color(33, 150, 243)` — azul Material Design |
| LABEL_BG | `Color(232, 240, 254)` — fondo azul claro para celdas label |
| BORDER | `Color(200, 200, 200)` — gris neutro |
| Tipografía labels | Helvetica 9pt Bold + fondo LABEL_BG |
| Tipografía valores | Helvetica 9pt Normal |

### Distribución de fotografías (3 páginas)

| Página | Contenido |
|---|---|
| Hoja 1 | Información general + accesorios + servicio + averías |
| Hoja 2 | "Reporte Fotográfico — Recepción": fotos de recepción del equipo + fotos de accesorios recepcionados |
| Hoja 3 | "Reporte Fotográfico — Devolución": fotos de equipo devuelto + fotos de accesorios devueltos |

### Reducción de fotos

| Parámetro | Antes | Ahora | Reducción |
|---|---|---|---|
| photoWidth | 170 px | 128 px | -25% |
| photoHeight | 130 px | 98 px | -25% |
| Fuente leyenda | 8pt | 7pt | -12.5% |
| Padding celda | 4 px | 3 px | -25% |

### Métodos refactorizados

- `addPageHeader(doc, title, subtitle)` — extraído para reutilizar en las 3 hojas
- `createCompactInfoTable()` — retorna tabla de 4 columnas (22/28/22/28)
- `addRow4Col(tbl, l1, v1, l2, v2)` — agrega fila con 2 pares label/value
- `addLabelCell(tbl, text)` — celda label con fondo LABEL_BG
- `addValueCell(tbl, text)` — celda valor sin fondo

### Corrección de duplicación de fotos

**Antes:** Las fotos de accesorios se filtraban del mismo `evidenciaIngresoRepository.listByEquipo()`, lo que causaba duplicados (se mostraban las fotos de equipo Y las de accesorios en ambas secciones).

**Ahora:** Se separan explícitamente:
- Fotos NO accesorio → "Fotografías de recepción del equipo"
- Fotos accesorio → "Fotografías de accesorios recepcionados"
- Mismo patrón para devolución (antes no existía sección de accesorios devueltos)

### Método `isAccesorioType`

Se mantiene sin cambios. Detecta: BATERIA, EXTINTOR, CARGADOR, TRANSFORMADOR, CABLE, CONECTOR, MESA, ELEVADOR, CONO, BOTIQUIN.

## Cambios mobile — equipmentReport.js

| Cambio | Detalle |
|---|---|
| Verificación de respuesta | `res.info().statusCode` → validación de magic bytes `JVBER` en base64 |
| Manejo de errores | Si la respuesta no empieza con `JVBER`, intenta decodificar como texto y muestra el detalle del servidor |
| Timeout | Se mantiene sin cambio (la descarga usa `ReactNativeBlobUtil.fetch` nativo) |

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `backend/src/main/java/com/apilamiento/control/service/ReporteService.java` | Refactorización completa de layout, colores, fotos y páginas |
| `mobile/src/utils/equipmentReport.js` | Fix de descarga: magic bytes en lugar de statusCode |
| `mobile/package.json` | Versión 1.14.0 |
| `mobile/android/app/build.gradle` | versionCode 11400, versionName "1.14.0" |
| `mobile/src/constants/versionHistory.js` | Entrada HDT-017 |
| `README.md` | HDT-017 + features + versión actual |

## Verificación

- Backend: `docker compose build backend` → BUILD SUCCESS (135 source files compiled)
- Mobile: ESLint limpio en `equipmentReport.js`
- Test funcional: PDF generado con 3 páginas, tablas compactas, fotos reducidas, descarga exitosa en mobile
