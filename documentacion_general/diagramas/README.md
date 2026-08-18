# Diagramas UML — Sistema de Control de Equipos de Apilamiento

Los diagramas se mantienen como código **PlantUML** para conservar trazabilidad, versionado y facilidad de actualización junto con el código fuente.

## Diagramas

| Archivo | Tipo UML | Propósito |
|---|---|---|
| `01_arquitectura_uml.puml` | Deployment / Component | Muestra el stack, nodos de despliegue, componentes y comunicación entre Mobile, Web, Nginx, Backend, PostgreSQL y FCM. |
| `02_actividad_ciclo_operativo.puml` | Activity | Representa el flujo completo del ciclo operativo del equipo: PSR/OSR → ingreso → operación → avería → reparación → finalización. |
| `03_secuencia_registro_averia.puml` | Sequence | Detalla la interacción entre usuario, Mobile, Nginx, API Quarkus, seguridad, servicio de averías, PostgreSQL y FCM. |

## Criterio UML

- **Arquitectura:** se utiliza una combinación de elementos de **Deployment Diagram** y **Component Diagram**, apropiada para representar infraestructura, componentes y relaciones de comunicación.
- **Actividades:** se utilizan acciones, decisiones, particiones y flujo de control propios de un **UML Activity Diagram**.
- **Secuencia:** se utilizan actores, lifelines, mensajes síncronos/asíncronos y retornos propios de un **UML Sequence Diagram**.

## Stack representado

La arquitectura se basa en el estado actual del repositorio:

- Mobile: React Native CLI 0.81.5 + React Native Paper / MD3.
- Web: React 18 + Vite 5 + Material UI 6.
- Backend: Quarkus 3.14.4 + Java 21.
- API: REST `/api/v1`.
- Seguridad: JWT propio + BCrypt.
- Persistencia: Hibernate ORM Panache + PostgreSQL 18.
- Migraciones: Flyway.
- Reverse proxy: Nginx.
- Infraestructura: Docker Compose.
- Push: Firebase Cloud Messaging (FCM).
- Auditoría: persistencia de eventos en PostgreSQL.

## Convención

Los diagramas describen la arquitectura y comportamiento implementados. No se deben introducir tecnologías o integraciones que no estén presentes en el repositorio sin actualizar primero la documentación técnica correspondiente.

> Nota: algunos documentos SDD anteriores contienen referencias históricas a Expo, Java 17, NISIRA u otras decisiones. Estos diagramas toman como referencia el estado actual del repositorio, especialmente `README.md`, `docker-compose.yml`, `backend/pom.xml` y `mobile/package.json`.

## Renderizado

Los archivos `.puml` pueden abrirse con PlantUML desde VS Code, IntelliJ IDEA u otra herramienta compatible. También pueden convertirse a PNG/SVG para incorporarlos posteriormente a una memoria técnica o documento de arquitectura.
