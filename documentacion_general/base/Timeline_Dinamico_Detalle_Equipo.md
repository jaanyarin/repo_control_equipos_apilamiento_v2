# Especificación de implementación --- Timeline dinámico del detalle de equipo

## 1. Objetivo

Implementar en el módulo **Detalle de equipo** una línea de tiempo
dinámica que permita visualizar, de forma cronológica y orientada a la
operación, el ciclo de vida de cada equipo de apilamiento.

La timeline debe mostrar como mínimo:

1.  PSR registrada.
2.  OSR registrada.
3.  Ingreso del equipo.
4.  Reporte de avería.
5.  Atención/reparación de avería.
6.  Finalización del servicio.

La implementación debe soportar **múltiples averías por equipo**, por lo
que no debe modelarse como una lista fija de seis estados. Debe
construirse a partir de eventos reales almacenados en el backend.

------------------------------------------------------------------------

## 2. Base funcional

Según el documento funcional del aplicativo:

-   El PSR es registrado por un administrador.
-   La OSR se registra sobre un PSR existente.
-   El equipo se asigna al PSR/OSR durante el ingreso.
-   El ingreso registra información del equipo, accesorios, horómetro y
    evidencias fotográficas.
-   Las averías se registran en una base paralela.
-   Una avería registra descripción/falla, fecha y hora de reporte,
    acción, fecha y hora de atención, fotografías y tiempo de
    inactividad.
-   La atención de la avería representa el momento en que el equipo
    vuelve a estar operativo.
-   La finalización del servicio registra la devolución del equipo y sus
    evidencias.
-   El detalle del equipo debe permitir consultar información,
    fotografías, averías y emitir el reporte PDF.

La timeline debe integrar visualmente estos hitos sin reemplazar las
pantallas o acciones funcionales existentes.

------------------------------------------------------------------------

# 3. Principio de diseño

## 3.1. No implementar una timeline fija

No se debe implementar:

``` text
PSR
OSR
INGRESO
AVERÍA
REPARACIÓN
FINALIZACIÓN
```

como seis elementos estáticos.

Debe implementarse:

``` text
PSR
OSR
INGRESO
AVERÍA #1
REPARACIÓN #1
AVERÍA #2
REPARACIÓN #2
AVERÍA #3
REPARACIÓN #3
...
FINALIZACIÓN
```

La cantidad de eventos depende de la información real del equipo.

## 3.2. Timeline = historial

La timeline representa el **historial cronológico del equipo**, no
solamente su estado actual.

Debe ser posible reconstruir visualmente qué ocurrió con el equipo desde
la creación de su servicio hasta su finalización.

------------------------------------------------------------------------

# 4. UX propuesta

## 4.1. Cabecera del equipo

En la parte superior del detalle:

``` text
DETALLE DEL EQUIPO

LINDE E16
Código: EQ-000125
Serie: H2X-458921

● OPERATIVO
```

La cabecera debe mostrar como mínimo:

-   Marca.
-   Modelo.
-   Código.
-   Número de serie.
-   Estado actual.

------------------------------------------------------------------------

## 4.2. Resumen operativo

Mostrar un resumen compacto antes de la timeline:

``` text
┌────────────────┬────────────────┬───────────────┐
│ INGRESO        │ HORÓMETRO      │ AVERÍAS       │
│ 02/05/2026     │ 1,245 h        │ 3             │
└────────────────┴────────────────┴───────────────┘
```

Datos recomendados:

-   Fecha de ingreso.
-   Horómetro inicial.
-   Cantidad de averías.
-   Tiempo acumulado de inactividad.
-   Fecha de finalización, si existe.

------------------------------------------------------------------------

# 5. Timeline principal

## 5.1. Estructura visual

Se recomienda una timeline **vertical** para React Native.

Ejemplo:

``` text
● 17/08/2026 14:20
│
├── ✓ REPARACIÓN FINALIZADA
│      Equipo operativo
│      Tiempo de parada: 2 días 3 h 45 min
│      Proveedor: DERCO PERÚ SA
│
● 15/08/2026 10:35
│
├── ⚠ AVERÍA REPORTADA
│      Falla en sistema hidráulico
│      Reportado por: Juan Pérez
│      📷 3 fotografías
│
● 02/05/2026 08:15
│
├── 📦 INGRESO DEL EQUIPO
│      Área: Recepción Packing
│      N° GR: GR-2026-00125
│      Horómetro: 1,245 h
│
● 28/04/2026 14:30
│
├── OSR REGISTRADA
│      OSR: OSR-2026-00452
│      Costo mensual: US$ 850
│
● 25/04/2026 11:20
│
├── PSR REGISTRADA
│      PSR: PSR-2026-00231
│      Servicio: Apilador - litio
│
○ FINALIZACIÓN DEL SERVICIO
      Pendiente
```

La información debe aparecer en orden cronológico descendente, mostrando
primero el evento más reciente.

------------------------------------------------------------------------

# 6. Tipos de eventos

Definir un catálogo centralizado:

``` ts
export type EquipmentTimelineEventType =
  | 'PSR'
  | 'OSR'
  | 'INGRESO'
  | 'AVERIA'
  | 'REPARACION'
  | 'FINALIZACION';
```

No utilizar strings dispersos por los componentes.

Crear una configuración:

``` ts
export const TIMELINE_EVENT_CONFIG = {
  PSR: {
    title: 'PSR registrada',
    icon: 'assignment',
    category: 'DOCUMENTO',
  },

  OSR: {
    title: 'OSR registrada',
    icon: 'description',
    category: 'DOCUMENTO',
  },

  INGRESO: {
    title: 'Equipo ingresado',
    icon: 'inventory-2',
    category: 'OPERACION',
  },

  AVERIA: {
    title: 'Avería reportada',
    icon: 'warning',
    category: 'AVERIA',
  },

  REPARACION: {
    title: 'Reparación finalizada',
    icon: 'build',
    category: 'OPERACION',
  },

  FINALIZACION: {
    title: 'Finalización del servicio',
    icon: 'check-circle',
    category: 'CIERRE',
  },
};
```

Los nombres exactos de iconos deben adaptarse a la librería de iconos ya
utilizada por el proyecto.

------------------------------------------------------------------------

# 7. Estados visuales

Usar estados semánticos y no colores arbitrarios.

## Completado

``` text
✓
```

Representa un evento ejecutado.

## Pendiente

``` text
○
```

Representa una etapa futura o todavía no registrada.

## Advertencia / avería

``` text
⚠
```

Representa una condición que requiere atención.

## En proceso

``` text
●
```

Representa una actividad actualmente abierta.

La implementación final debe utilizar iconos vectoriales, no emojis.

------------------------------------------------------------------------

# 8. Modelo de datos de la timeline

El frontend no debe tener que reconstruir toda la lógica de negocio a
partir de varias tablas.

El backend debe entregar una colección normalizada de eventos.

Modelo recomendado:

``` ts
export interface EquipmentTimelineEvent {
  id: string;
  equipmentId: number;

  type: EquipmentTimelineEventType;

  dateTime: string | null;

  title: string;
  description?: string;

  status: 'COMPLETADO' | 'PENDIENTE' | 'EN_PROCESO';

  metadata?: {
    documentNumber?: string;
    provider?: string;
    area?: string;
    costPerMonth?: number;
    failure?: string;
    action?: string;
    downtimeMinutes?: number;
    userName?: string;
    hourMeter?: number;
  };

  photos?: EquipmentTimelinePhoto[];

  relatedId?: number | string;
}
```

Modelo para fotografías:

``` ts
export interface EquipmentTimelinePhoto {
  id: string;
  url: string;
  type?: string;
  description?: string;
}
```

------------------------------------------------------------------------

# 9. Ejemplo de respuesta del backend

Endpoint recomendado:

``` http
GET /api/equipments/{equipmentId}/timeline
```

Respuesta:

``` json
{
  "equipmentId": 125,
  "currentStatus": "OPERATIVO",
  "summary": {
    "entryDate": "2026-05-02T08:15:00",
    "initialHourMeter": 1245,
    "failureCount": 3,
    "totalDowntimeMinutes": 6240
  },
  "events": [
    {
      "id": "repair-82",
      "equipmentId": 125,
      "type": "REPARACION",
      "dateTime": "2026-08-17T14:20:00",
      "title": "Reparación finalizada",
      "description": "Equipo operativo",
      "status": "COMPLETADO",
      "metadata": {
        "action": "Reparación del sistema hidráulico",
        "downtimeMinutes": 3105,
        "provider": "DERCO PERÚ SA"
      },
      "relatedId": 82
    },
    {
      "id": "failure-82",
      "equipmentId": 125,
      "type": "AVERIA",
      "dateTime": "2026-08-15T10:35:00",
      "title": "Avería reportada",
      "description": "Falla en sistema hidráulico",
      "status": "COMPLETADO",
      "metadata": {
        "failure": "Falla en sistema hidráulico",
        "userName": "Juan Pérez"
      },
      "photos": [
        {
          "id": "photo-1",
          "url": "https://..."
        }
      ],
      "relatedId": 82
    }
  ]
}
```

------------------------------------------------------------------------

# 10. Regla fundamental para averías

Cada avería debe generar como mínimo dos eventos relacionados:

``` text
AVERIA
   ↓
REPARACION
```

Ejemplo:

``` text
AVERÍA #82
15/08/2026 10:35
        ↓
REPARACIÓN #82
17/08/2026 14:20
```

Ambos deben compartir:

``` ts
relatedId: 82
```

Esto permite identificar que la reparación corresponde a la avería
específica.

------------------------------------------------------------------------

# 11. Avería abierta

Si una avería todavía no ha sido atendida:

``` text
● 18/08/2026 09:15
│
├── ⚠ AVERÍA REPORTADA
│      Equipo detenido
│      Falla: Problema eléctrico
│
│      Tiempo de parada:
│      11 h 32 min
│
└── Reparación pendiente
```

No debe generarse artificialmente una fecha de reparación.

El evento de reparación solamente aparece cuando existe una atención
real.

------------------------------------------------------------------------

# 12. Tiempo de inactividad

La timeline debe aprovechar la información de averías para mostrar el
impacto operativo.

Para una avería atendida:

``` text
Fecha reporte:
15/08/2026 10:35

Fecha atención:
17/08/2026 14:20

Tiempo de parada:
2 días 3 h 45 min
```

El backend debe ser la fuente de verdad para este cálculo.

El frontend solamente debe formatear el resultado.

No duplicar la lógica de cálculo en React Native.

------------------------------------------------------------------------

# 13. Finalización del servicio

Si el equipo todavía está activo:

``` text
○ FINALIZACIÓN DEL SERVICIO
  Pendiente
```

Cuando se registra la devolución:

``` text
● 30/09/2026 16:45

✓ FINALIZACIÓN DEL SERVICIO

Equipo devuelto

Horómetro final:
1,820 h

Usuario:
Carlos Pérez

📷 Evidencias de devolución
```

Debe utilizarse la fecha de devolución almacenada en el sistema.

La documentación funcional indica que la fecha de devolución se registra
al realizar la finalización del servicio y que el horómetro final se
registra en ese momento.

------------------------------------------------------------------------

# 14. Componente React Native

Crear un componente específico:

``` text
src/
└── components/
    └── equipment/
        └── timeline/
            ├── EquipmentTimeline.tsx
            ├── TimelineEvent.tsx
            ├── TimelineConnector.tsx
            ├── TimelineEventDetails.tsx
            ├── timeline.types.ts
            ├── timeline.config.ts
            └── timeline.utils.ts
```

Responsabilidades:

### EquipmentTimeline

-   Recibir los eventos.
-   Ordenarlos si fuera necesario.
-   Renderizar la lista.
-   Manejar estado de carga.
-   Manejar estado vacío.
-   Manejar errores.

### TimelineEvent

-   Renderizar fecha/hora.
-   Renderizar icono.
-   Renderizar título.
-   Renderizar resumen.
-   Mostrar estado.
-   Permitir expansión.

### TimelineEventDetails

-   Mostrar metadata.
-   Mostrar fotografías.
-   Mostrar información de avería.
-   Mostrar tiempo de parada.
-   Mostrar usuario.
-   Mostrar proveedor.

### TimelineConnector

-   Renderizar la línea vertical.
-   Conectar visualmente los eventos.
-   Adaptar el estado visual del evento.

------------------------------------------------------------------------

# 15. Uso de FlatList

La timeline debe utilizar `FlatList` o la abstracción de lista ya
utilizada por el proyecto.

No utilizar un `.map()` para grandes cantidades de eventos si el
historial puede crecer.

Ejemplo conceptual:

``` tsx
<FlatList
  data={events}
  keyExtractor={(item) => item.id}
  renderItem={({ item, index }) => (
    <TimelineEvent
      event={item}
      isLast={index === events.length - 1}
    />
  )}
/>
```

------------------------------------------------------------------------

# 16. Componente expandible

Cada evento debe poder mostrar un resumen y un detalle.

Estado cerrado:

``` text
⚠ Avería reportada
15/08/2026 10:35
Falla en sistema hidráulico
                         >
```

Estado abierto:

``` text
⚠ Avería reportada
15/08/2026 10:35

Falla:
Falla en sistema hidráulico

Reportado por:
Juan Pérez

Fotos:
[imagen] [imagen] [imagen]

Atención:
17/08/2026 14:20

Tiempo de parada:
2d 03h 45m
```

Esto evita saturar visualmente el detalle del equipo.

------------------------------------------------------------------------

# 17. Navegación desde eventos

La timeline debe permitir acciones contextualizadas.

Ejemplos:

### Avería

``` text
Ver detalle de avería
Ver fotografías
```

### Ingreso

``` text
Ver datos de ingreso
Ver fotografías de ingreso
```

### Finalización

``` text
Ver devolución
Ver fotografías de devolución
```

### PSR / OSR

``` text
Ver información del documento
```

No todas las acciones deben estar visibles simultáneamente. Utilizar
expansión o menú contextual.

------------------------------------------------------------------------

# 18. Integración con el estado actual

La timeline debe convivir con el estado actual del equipo.

Ejemplo:

``` text
Estado actual:
● OPERATIVO
```

Si existe una avería sin atender:

``` text
Estado actual:
⚠ AVERIADO
```

Si el servicio terminó:

``` text
Estado actual:
✓ SERVICIO FINALIZADO
```

La timeline no debe determinar por sí misma el estado de negocio. El
estado debe venir del backend.

------------------------------------------------------------------------

# 19. Reglas de ordenamiento

El backend debe entregar los eventos ordenados por fecha descendente.

Si por alguna razón el frontend necesita ordenar:

``` ts
events.sort(
  (a, b) =>
    new Date(b.dateTime ?? 0).getTime() -
    new Date(a.dateTime ?? 0).getTime()
);
```

Los eventos sin fecha deben tratarse como pendientes y ubicarse según
una regla explícita, no mediante una fecha ficticia.

------------------------------------------------------------------------

# 20. Eventos pendientes

La timeline puede representar etapas pendientes que todavía no tienen
fecha.

Ejemplo:

``` text
● INGRESO
│
● OPERACIÓN
│
○ FINALIZACIÓN DEL SERVICIO
```

Pero no deben crearse eventos históricos falsos.

La diferencia es:

-   Evento histórico: existe registro real.
-   Evento pendiente: representa una etapa funcional esperada.
-   Evento inexistente: no debe mostrarse.

------------------------------------------------------------------------

# 21. Timeline completa recomendada

Para un equipo con dos averías:

``` text
● FINALIZACIÓN DEL SERVICIO
│
○ Pendiente
│
● REPARACIÓN #2
│
├── Equipo operativo
│   Tiempo de parada: 1d 05h
│
● AVERÍA #2
│
├── Falla: Sistema eléctrico
│   Equipo detenido
│
● REPARACIÓN #1
│
├── Equipo operativo
│   Tiempo de parada: 4h 30m
│
● AVERÍA #1
│
├── Falla: Sistema hidráulico
│   Equipo detenido
│
● INGRESO
│
├── GR: GR-00125
│   Horómetro: 1,245 h
│
● OSR
│
├── OSR: OSR-00452
│   US$ 850 / mes
│
● PSR
│
├── PSR: PSR-00231
│   Apilador - litio
```

------------------------------------------------------------------------

# 22. No duplicar información innecesariamente

La timeline debe mostrar un **resumen**.

La pantalla de detalle puede mantener otras secciones:

``` text
DETALLE DEL EQUIPO
│
├── Información general
├── Estado
├── Timeline
├── Información contractual
├── Accesorios
├── Averías
├── Fotografías
└── Reporte PDF
```

La timeline no debe reemplazar el detalle completo.

Su función es proporcionar contexto y navegación rápida.

------------------------------------------------------------------------

# 23. Responsive / UX mobile

La timeline debe diseñarse primero para pantallas móviles.

Recomendaciones:

-   Timeline vertical.
-   Área táctil mínima de 44 px aproximadamente.
-   Tarjetas con suficiente separación.
-   Fecha/hora claramente visible.
-   No utilizar tablas horizontales.
-   Evitar textos excesivamente largos.
-   Fotos en miniaturas.
-   Expandir detalles bajo demanda.
-   Mantener el estado actual visible.
-   Permitir scroll natural.

------------------------------------------------------------------------

# 24. Accesibilidad

Los eventos deben tener:

-   Texto descriptivo.
-   Icono + texto, nunca icono únicamente.
-   Contraste suficiente.
-   Área táctil adecuada.
-   Estado no dependiente exclusivamente del color.

Ejemplo:

No:

``` text
●
```

Sí:

``` text
⚠ AVERÍA — Equipo detenido
```

El icono y el color complementan al texto.

------------------------------------------------------------------------

# 25. Performance

La timeline debe:

-   Usar `FlatList`.
-   Evitar renders innecesarios.
-   Usar `React.memo` cuando corresponda.
-   No cargar todas las fotografías originales al abrir la pantalla.
-   Utilizar thumbnails para previews.
-   Cargar imágenes completas bajo demanda.
-   Mantener el payload del endpoint razonable.

Para equipos con muchos eventos, considerar paginación:

``` http
GET /api/equipments/{id}/timeline?page=0&size=30
```

La paginación puede implementarse posteriormente si el volumen real no
lo requiere inicialmente.

------------------------------------------------------------------------

# 26. Loading

Mientras se consulta la timeline:

``` text
DETALLE DEL EQUIPO

────────────────────

HISTORIAL

○ Cargando eventos...
○
○
○
```

Preferiblemente utilizar skeleton loading si ya existe un sistema de
skeletons en el proyecto.

------------------------------------------------------------------------

# 27. Estado vacío

Si el equipo no tiene eventos históricos adicionales:

``` text
HISTORIAL DEL EQUIPO

No existen eventos registrados.
```

No mostrar una timeline vacía con líneas o iconos sin contenido.

------------------------------------------------------------------------

# 28. Error

Si falla la consulta:

``` text
No fue posible cargar el historial del equipo.

[Reintentar]
```

El error de la timeline no debe impedir necesariamente que el usuario
consulte la información básica del equipo.

------------------------------------------------------------------------

# 29. Seguridad

El endpoint debe respetar las mismas reglas de autorización existentes
en el backend.

No confiar en:

``` text
equipmentId
```

enviado por el cliente como mecanismo de autorización.

El backend debe validar que el usuario autenticado tenga acceso al
equipo.

La timeline no debe exponer fotografías o información de otros equipos.

------------------------------------------------------------------------

# 30. API recomendada

Endpoint principal:

``` http
GET /api/equipments/{equipmentId}/timeline
```

Opcionalmente:

``` http
GET /api/equipments/{equipmentId}/timeline?eventType=AVERIA
```

Esto permitiría filtrar posteriormente:

``` text
Todos
PSR / OSR
Ingresos
Averías
Reparaciones
Finalización
```

------------------------------------------------------------------------

# 31. Filtros opcionales

En una primera versión no son obligatorios.

Si el historial crece, implementar:

``` text
[ Todos ] [ Averías ] [ Operación ] [ Documentos ]
```

Esto es especialmente útil para usuarios administrativos que quieran
revisar solamente las averías del equipo.

------------------------------------------------------------------------

# 32. Indicadores operativos recomendados

En el resumen del equipo se pueden calcular:

``` text
Averías totales
Tiempo acumulado de parada
Promedio de atención
Última avería
Última reparación
```

Ejemplo:

``` text
3 averías
4d 08h detenido
Promedio atención: 1d 09h
Última avería: 15/08/2026
```

Estos indicadores deben utilizar datos del backend.

------------------------------------------------------------------------

# 33. Criterios de aceptación

## CA-01 --- Visualización

Al ingresar al detalle de un equipo, el usuario puede visualizar su
historial cronológico.

## CA-02 --- PSR

Si existe PSR asociada, aparece como evento.

## CA-03 --- OSR

Si existe OSR asociada, aparece como evento posterior al PSR.

## CA-04 --- Ingreso

Si existe ingreso registrado, aparece el evento de ingreso.

## CA-05 --- Múltiples averías

Un equipo puede mostrar múltiples pares:

``` text
AVERÍA → REPARACIÓN
```

sin límite artificial de seis eventos.

## CA-06 --- Avería abierta

Una avería no atendida aparece como evento pendiente de reparación.

## CA-07 --- Tiempo de parada

Las averías atendidas muestran el tiempo de inactividad calculado por
backend.

## CA-08 --- Finalización

Si existe devolución, aparece el evento de finalización.

## CA-09 --- Servicio activo

Si no existe devolución, la finalización se muestra como pendiente
únicamente si la etapa forma parte del flujo esperado.

## CA-10 --- Orden

Los eventos se muestran cronológicamente.

## CA-11 --- Fotografías

Los eventos que tengan evidencias permiten acceder a ellas.

## CA-12 --- Detalle

El usuario puede expandir un evento para consultar información
adicional.

## CA-13 --- Estado

El estado actual del equipo se muestra independientemente de la
timeline.

## CA-14 --- Error

Un error de timeline muestra una opción de reintento sin bloquear
necesariamente el resto del detalle.

------------------------------------------------------------------------

# 34. Pruebas mínimas

Crear pruebas para los siguientes escenarios:

### Escenario 1

Equipo recién ingresado:

``` text
PSR
OSR
INGRESO
FINALIZACIÓN PENDIENTE
```

### Escenario 2

Equipo con una avería atendida:

``` text
PSR
OSR
INGRESO
AVERÍA
REPARACIÓN
FINALIZACIÓN PENDIENTE
```

### Escenario 3

Equipo con varias averías:

``` text
PSR
OSR
INGRESO
AVERÍA
REPARACIÓN
AVERÍA
REPARACIÓN
AVERÍA
REPARACIÓN
FINALIZACIÓN PENDIENTE
```

### Escenario 4

Equipo con avería abierta:

``` text
PSR
OSR
INGRESO
AVERÍA
REPARACIÓN PENDIENTE
```

### Escenario 5

Equipo finalizado:

``` text
PSR
OSR
INGRESO
AVERÍA
REPARACIÓN
FINALIZACIÓN
```

------------------------------------------------------------------------

# 35. Decisión tecnológica

## No utilizar una librería de timeline inicialmente

Para este proyecto se recomienda construir un componente propio
utilizando las capacidades existentes de React Native:

``` text
FlatList
View
Pressable
Text
Image
Animated (si posteriormente se requiere)
```

y la librería de iconos que ya esté instalada en el proyecto.

Ventajas:

-   Menos dependencias.
-   Mayor control visual.
-   Integración directa con Material Design.
-   Fácil adaptación a eventos propios del negocio.
-   Soporte para múltiples averías.
-   Fácil evolución.
-   Menor dependencia de una API externa de timeline.

Una librería especializada puede evaluarse posteriormente si existe una
necesidad real que el componente propio no cubra.

------------------------------------------------------------------------

# 36. Arquitectura recomendada

``` text
                    BACKEND
                       │
                       │
            GET /equipments/{id}/timeline
                       │
                       ▼
             EquipmentTimelineDTO
                       │
                       ▼
                React Native
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
 EquipmentSummary          EquipmentTimeline
                                    │
                           ┌────────┴────────┐
                           │                 │
                           ▼                 ▼
                    TimelineEvent    TimelineConnector
                           │
                           ▼
                  TimelineEventDetails
                           │
                  ┌────────┼────────┐
                  ▼        ▼        ▼
                Fotos    Metadata  Acciones
```

------------------------------------------------------------------------

# 37. Evolución futura

La arquitectura debe permitir incorporar nuevos eventos sin modificar la
estructura principal.

Por ejemplo, posteriormente podrían agregarse:

``` text
TRASLADO
CAMBIO_DE_AREA
MANTENIMIENTO_PREVENTIVO
CAMBIO_DE_BATERIA
INSPECCION
REINGRESO
BAJA
```

El nuevo evento debería requerir principalmente:

1.  Agregar el tipo.
2.  Agregar configuración visual.
3.  Mapearlo en backend.
4.  Implementar su detalle específico si corresponde.

No se debe rediseñar la timeline completa.

------------------------------------------------------------------------

# 38. Resultado esperado

El usuario debe poder entrar a un equipo y responder rápidamente:

-   ¿Qué equipo es?
-   ¿Cuál es su estado actual?
-   ¿Cuándo ingresó?
-   ¿Qué PSR/OSR lo originó?
-   ¿Cuántas averías tuvo?
-   ¿Cuándo ocurrió cada avería?
-   ¿Cuándo fue reparada?
-   ¿Cuánto tiempo estuvo detenido?
-   ¿Quién registró el evento?
-   ¿Qué evidencias fotográficas existen?
-   ¿Cuándo terminó el servicio?

La timeline debe funcionar como una **historia visual del equipo**,
mientras que las demás secciones del detalle mantienen el nivel completo
de información y las acciones operativas.
