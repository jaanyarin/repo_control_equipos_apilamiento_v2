# Guía base de instalación, despliegue y publicación mediante proxy inverso

> **Proyecto:** Control de Equipos de Apilamiento V2  
> **Repositorio:** `repo_control_equipos_apilamiento_v2`  
> **Servidor de aplicación u origen:** `SERVIDOR_24`  
> **Servidor público o proxy:** `172.18.10.10`  
> **Estado del documento:** Plantilla base pendiente de completar tras revisar el repositorio y los servidores

---

## 1. Objetivo

Esta guía describe el proceso recomendado para preparar, instalar, ejecutar y publicar una aplicación alojada en el servidor `.24`, utilizando Nginx en `172.18.10.10` como proxy inverso para exponerla mediante una URL pública.

Flujo esperado:

```text
Usuario / navegador / aplicación móvil
                |
                | HTTPS
                v
      Dominio público de la app
                |
                v
       Servidor 172.18.10.10
          Nginx / proxy inverso
                |
                | HTTP o HTTPS por red interna
                v
         Servidor de origen .24
    Frontend, backend o contenedores
                |
                v
       Base de datos y servicios
```

> **Importante:** esta arquitectura publica una aplicación hacia Internet mediante un proxy inverso. No garantiza por sí sola que el servidor `.24` pueda iniciar conexiones hacia GitHub, Microsoft Graph u otros servicios externos. Esa salida debe validarse por separado.

---

## 2. Datos que deben completarse antes del despliegue

No continuar con cambios de firewall o Nginx hasta completar esta ficha.

| Dato | Valor |
|---|---|
| Nombre de la aplicación | `control-equipos-apilamiento-v2` |
| URL pública prevista | `https://________________` |
| Ruta pública, si se usa subruta | `/________________/` |
| IP completa del servidor `.24` | `________________` |
| Sistema operativo del `.24` | `________________` |
| Sistema operativo del `.10` | `________________` |
| Tecnología del frontend | `Pendiente de validar` |
| Tecnología del backend | `Pendiente de validar` |
| Puerto del frontend | `________________` |
| Puerto del backend/API | `________________` |
| Ruta base de la API | `________________` |
| Endpoint de salud | `________________` |
| Nombre del servicio systemd | `________________.service` |
| Ruta de instalación en `.24` | `/opt/________________` |
| Usuario Linux del servicio | `________________` |
| Archivo Nginx que se modificará | `/etc/nginx/conf.d/________________.conf` |
| Base de datos | `________________` |
| Responsable de red/firewall | `________________` |

---

## 3. Reglas de seguridad

1. No copiar claves SSH, tokens, certificados privados ni contraseñas dentro del repositorio.
2. No subir archivos `.env` reales a GitHub.
3. Utilizar un usuario Linux exclusivo para ejecutar la aplicación. Evitar `root` salvo obligación técnica documentada.
4. Abrir únicamente los puertos indispensables.
5. Restringir el acceso al puerto de la aplicación para que solo `172.18.10.10` pueda consumirlo, cuando la infraestructura lo permita.
6. Mantener PostgreSQL u otra base de datos fuera de la exposición pública.
7. Crear una copia de seguridad del archivo Nginx antes de modificarlo.
8. Ejecutar siempre `nginx -t` antes de recargar Nginx.
9. No mostrar secretos en capturas, comandos, logs ni documentación.
10. No ejecutar comandos destructivos sin verificar la ruta y el servidor actual.

---

## 4. Fase 1: inspección del repositorio

### 4.1 Obtener el código

En la laptop o en el servidor `.24`:

```bash
git clone https://github.com/jose-alejandro-v2/repo_control_equipos_apilamiento_v2.git
cd repo_control_equipos_apilamiento_v2
```

Si el repositorio ya existe:

```bash
cd /ruta/al/repo_control_equipos_apilamiento_v2
git status
git remote -v
git branch --show-current
git pull --ff-only
```

### 4.2 Identificar la arquitectura

```bash
find . -maxdepth 4 -type f \(
  -name "package.json" -o \
  -name "vite.config.*" -o \
  -name "next.config.*" -o \
  -name "pom.xml" -o \
  -name "build.gradle*" -o \
  -name "application.properties" -o \
  -name "application.yml" -o \
  -name "Dockerfile" -o \
  -name "docker-compose.yml" -o \
  -name "compose.yml" \
\) -print
```

### 4.3 Buscar puertos, URLs y rutas de API

```bash
grep -RniE "localhost|127\.0\.0\.1|server\.port|quarkus\.http\.port|PORT=|VITE_|REACT_APP_|NEXT_PUBLIC_|/api" . \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  --exclude-dir=target \
  --exclude-dir=dist \
  --exclude-dir=build
```

### 4.4 Comprobar que no hay secretos versionados

```bash
find . -maxdepth 4 -type f \(
  -name ".env" -o \
  -name ".env.*" -o \
  -name "*.pem" -o \
  -name "*.key" -o \
  -name "id_rsa" \
\) -print
```

Registrar los resultados en la ficha de la sección 2.

---

## 5. Fase 2: inventario del servidor `.24`

Conectarse por SSH:

```bash
ssh USUARIO@IP_SERVIDOR_24
```

### 5.1 Confirmar el servidor actual

```bash
hostname
hostname -I
whoami
pwd
cat /etc/os-release
```

### 5.2 Revisar recursos

```bash
free -h
df -h
nproc
```

### 5.3 Revisar herramientas instaladas

```bash
git --version
java -version
mvn -version
node --version
npm --version
docker --version
docker compose version
```

> Algunos comandos pueden no existir. Instalar solo las herramientas que realmente requiera el repositorio.

### 5.4 Revisar puertos y procesos

```bash
sudo ss -lntp
ps aux | grep -E '[j]ava|[n]ode|[n]ginx|[d]ocker'
```

### 5.5 Revisar firewall

Oracle Linux, Rocky Linux o RHEL:

```bash
sudo firewall-cmd --state
sudo firewall-cmd --list-all
```

Ubuntu:

```bash
sudo ufw status numbered
```

---

## 6. Fase 3: preparación de carpetas y usuario de servicio

Ejemplo recomendado:

```bash
sudo useradd --system --home /opt/control-equipos --shell /usr/sbin/nologin controlapp
sudo mkdir -p /opt/control-equipos/app
sudo mkdir -p /opt/control-equipos/config
sudo mkdir -p /opt/control-equipos/logs
sudo chown -R controlapp:controlapp /opt/control-equipos
```

Estructura propuesta:

```text
/opt/control-equipos/
├── app/       # artefactos compilados
├── config/    # configuración externa sin versionar
├── logs/      # logs si la aplicación escribe en archivo
└── backup/    # versión anterior para reversión
```

---

## 7. Fase 4: compilación

Elegir únicamente la variante que corresponda al repositorio.

### 7.1 Frontend React con Vite

```bash
npm ci
npm run build
```

Salida habitual:

```text
dist/
```

### 7.2 Frontend React tradicional

```bash
npm ci
npm run build
```

Salida habitual:

```text
build/
```

### 7.3 Backend Maven, Spring Boot o Quarkus

```bash
./mvnw clean package -DskipTests
```

Si no existe Maven Wrapper:

```bash
mvn clean package -DskipTests
```

### 7.4 Backend Gradle

```bash
./gradlew clean build -x test
```

### 7.5 Validaciones posteriores

```bash
find . -maxdepth 4 -type f \(
  -name "*.jar" -o \
  -name "*.war" \
\) -print
```

No omitir las pruebas automáticamente en el despliegue definitivo. `-DskipTests` o `-x test` se utilizarán solo cuando exista una validación previa controlada.

---

## 8. Fase 5: configuración de producción

### 8.1 Principios

- El frontend no debe apuntar a `localhost` en producción.
- Preferir una ruta relativa como `/api` si frontend y backend se publican bajo el mismo dominio.
- Las credenciales deben mantenerse fuera del repositorio.
- El backend debe escuchar en la interfaz necesaria para aceptar la conexión desde `.10`.
- CORS debe restringirse al dominio público real.

### 8.2 Archivo de entorno de ejemplo

```dotenv
APP_ENV=production
APP_PORT=PUERTO_INTERNO
PUBLIC_BASE_URL=https://DOMINIO_PUBLICO
API_BASE_URL=/api
DB_HOST=HOST_INTERNO
DB_PORT=5432
DB_NAME=NOMBRE_BD
DB_USER=USUARIO_BD
DB_PASSWORD=SECRETO_NO_VERSIONADO
```

Guardar el archivo real con permisos restringidos:

```bash
sudo chown controlapp:controlapp /opt/control-equipos/config/app.env
sudo chmod 600 /opt/control-equipos/config/app.env
```

---

## 9. Fase 6: prueba manual en el servidor `.24`

Antes de crear un servicio permanente, ejecutar la aplicación manualmente.

### 9.1 Aplicación Java ejecutable

```bash
cd /opt/control-equipos/app
java -jar NOMBRE_APLICACION.jar
```

### 9.2 Probar localmente

```bash
curl -i http://127.0.0.1:PUERTO/
curl -i http://127.0.0.1:PUERTO/RUTA_SALUD
```

### 9.3 Comprobar escucha

```bash
sudo ss -lntp | grep ':PUERTO'
```

Interpretación:

- `127.0.0.1:PUERTO`: solo acepta conexiones locales.
- `0.0.0.0:PUERTO`: acepta conexiones IPv4 por las interfaces habilitadas.
- `[::]:PUERTO`: escucha mediante IPv6 y, según configuración, también puede aceptar IPv4.

No continuar hasta obtener una respuesta local válida.

---

## 10. Fase 7: servicio systemd

Crear:

```bash
sudo nano /etc/systemd/system/control-equipos.service
```

Plantilla base:

```ini
[Unit]
Description=Control de Equipos de Apilamiento
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=controlapp
Group=controlapp
WorkingDirectory=/opt/control-equipos/app
EnvironmentFile=/opt/control-equipos/config/app.env
ExecStart=/usr/bin/java -jar /opt/control-equipos/app/NOMBRE_APLICACION.jar
SuccessExitStatus=143
Restart=on-failure
RestartSec=10
TimeoutStopSec=30
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Aplicar y arrancar:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now control-equipos.service
sudo systemctl status control-equipos.service --no-pager
```

Ver logs:

```bash
sudo journalctl -u control-equipos.service -n 100 --no-pager
sudo journalctl -u control-equipos.service -f
```

Después de actualizar el artefacto:

```bash
sudo systemctl restart control-equipos.service
sudo systemctl status control-equipos.service --no-pager
```

---

## 11. Fase 8: firewall del servidor `.24`

### 11.1 Opción recomendada: permitir solo el servidor `.10`

Con firewalld:

```bash
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="172.18.10.10/32" port protocol="tcp" port="PUERTO_APP" accept'
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

Con UFW:

```bash
sudo ufw allow from 172.18.10.10 to any port PUERTO_APP proto tcp
sudo ufw status numbered
```

### 11.2 Opción abierta, solo si la política interna lo exige

Con firewalld:

```bash
sudo firewall-cmd --permanent --add-port=PUERTO_APP/tcp
sudo firewall-cmd --reload
```

Con UFW:

```bash
sudo ufw allow PUERTO_APP/tcp
```

> Evitar la opción abierta cuando solo Nginx necesita conectarse al servicio.

---

## 12. Fase 9: prueba desde `172.18.10.10` hacia `.24`

Conectarse al servidor público:

```bash
ssh USUARIO@172.18.10.10
```

Confirmar identidad:

```bash
hostname
hostname -I
whoami
```

Probar TCP:

```bash
nc -vz IP_SERVIDOR_24 PUERTO_APP
```

Alternativa:

```bash
telnet IP_SERVIDOR_24 PUERTO_APP
```

Probar HTTP:

```bash
curl -v http://IP_SERVIDOR_24:PUERTO_APP/
curl -v http://IP_SERVIDOR_24:PUERTO_APP/RUTA_SALUD
```

Interpretación rápida:

| Resultado | Significado probable |
|---|---|
| `succeeded` o `Connected` | Puerto accesible |
| `Connection refused` | El host responde, pero no hay servicio escuchando o está ligado a localhost |
| `Connection timed out` | Firewall, ACL o problema de red |
| `No route to host` | Problema de ruta o regla de red |
| HTTP `200` | Servicio operativo |
| HTTP `404` | Servicio accesible, ruta incorrecta |
| HTTP `401` o `403` | Servicio accesible, requiere autorización |

No configurar Nginx hasta lograr conexión desde `.10` hacia `.24`.

---

## 13. Fase 10: configuración de Nginx en `172.18.10.10`

### 13.1 Inspeccionar configuración existente

```bash
sudo nginx -t
sudo nginx -T > /tmp/nginx-config-completa.txt
sudo grep -RniE "server_name|location|proxy_pass" /etc/nginx/conf.d/
```

### 13.2 Crear copia de seguridad

```bash
sudo cp /etc/nginx/conf.d/ARCHIVO.conf \
  /etc/nginx/conf.d/ARCHIVO.conf.bak.$(date +%Y%m%d_%H%M%S)
```

### 13.3 Plantilla para publicar la API en una subruta

```nginx
location /control-equipos/api/ {
    proxy_pass http://IP_SERVIDOR_24:PUERTO_BACKEND/;

    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_connect_timeout 10s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

> **Atención con la barra final:** `proxy_pass http://IP:PUERTO/;` puede reemplazar el prefijo coincidente de `location`. Si el backend necesita recibir la ruta pública completa, la configuración debe ajustarse después de revisar los endpoints reales.

### 13.4 Plantilla para una SPA estática servida por Nginx

```nginx
location /control-equipos/ {
    alias /var/www/control-equipos/dist/;
    try_files $uri $uri/ /control-equipos/index.html;
}
```

La ruta `dist` puede ser `build`, según la herramienta del frontend.

### 13.5 Validar y recargar

```bash
sudo nginx -t
```

Solo si el resultado es correcto:

```bash
sudo systemctl reload nginx
sudo systemctl status nginx --no-pager
```

---

## 14. Fase 11: pruebas de extremo a extremo

### 14.1 Desde el servidor `.10`

```bash
curl -vk https://DOMINIO_PUBLICO/control-equipos/
curl -vk https://DOMINIO_PUBLICO/control-equipos/api/RUTA_SALUD
```

### 14.2 Desde una laptop autorizada

```bash
curl -vk https://DOMINIO_PUBLICO/control-equipos/
```

También validar en navegador:

- Carga del `index.html`.
- Carga de JavaScript, CSS, fuentes e imágenes.
- Inicio de sesión.
- Consumo de API.
- Recarga directa de una ruta interna de React.
- Operaciones de lectura y escritura.
- Carga de archivos, si existe.
- Acceso desde móvil, si corresponde.

### 14.3 Logs durante la prueba

En `.24`:

```bash
sudo journalctl -u control-equipos.service -f
```

En `.10`:

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 15. Diagnóstico de errores frecuentes

### Error 502 Bad Gateway

Comprobar desde `.10`:

```bash
curl -v http://IP_SERVIDOR_24:PUERTO_APP/RUTA
nc -vz IP_SERVIDOR_24 PUERTO_APP
```

Revisar:

- Servicio detenido.
- Puerto incorrecto.
- Aplicación ligada únicamente a `127.0.0.1`.
- Firewall bloqueando.
- Protocolo incorrecto entre Nginx y backend.
- Ruta incorrecta en `proxy_pass`.

### Error 404

Revisar:

- Ruta pública.
- Context path del backend.
- Barra final de `location` y `proxy_pass`.
- `try_files` para aplicaciones React.

### Error CORS

Revisar:

- Dominio permitido por el backend.
- Puerto y protocolo del origen.
- Cabeceras requeridas.
- Métodos `GET`, `POST`, `PUT`, `DELETE` y `OPTIONS`.

Preferir frontend y API bajo el mismo dominio cuando sea viable.

### La web carga, pero la API apunta a localhost

Buscar referencias compiladas:

```bash
grep -Rni "localhost" dist/ build/ 2>/dev/null
```

Corregir variables de producción y volver a compilar.

### El servicio funciona manualmente, pero falla con systemd

Revisar:

```bash
sudo systemctl status control-equipos.service --no-pager
sudo journalctl -u control-equipos.service -n 200 --no-pager
```

Posibles causas:

- Ruta incorrecta en `WorkingDirectory`.
- Java o Node no está en la ruta indicada.
- Permisos insuficientes.
- Archivo de entorno inexistente.
- Directorio o artefacto no accesible por el usuario del servicio.

---

## 16. Actualización de una nueva versión

### 16.1 Preparar copia anterior

```bash
sudo mkdir -p /opt/control-equipos/backup
sudo cp /opt/control-equipos/app/NOMBRE_APLICACION.jar \
  /opt/control-equipos/backup/NOMBRE_APLICACION.$(date +%Y%m%d_%H%M%S).jar
```

### 16.2 Instalar el nuevo artefacto

```bash
sudo systemctl stop control-equipos.service
sudo cp NUEVO_ARTEFACTO.jar /opt/control-equipos/app/NOMBRE_APLICACION.jar
sudo chown controlapp:controlapp /opt/control-equipos/app/NOMBRE_APLICACION.jar
sudo systemctl start control-equipos.service
```

### 16.3 Validar

```bash
sudo systemctl status control-equipos.service --no-pager
curl -i http://127.0.0.1:PUERTO_APP/RUTA_SALUD
```

Después probar desde `.10` y desde la URL pública.

---

## 17. Procedimiento de reversión

Si la nueva versión falla:

```bash
sudo systemctl stop control-equipos.service
sudo cp /opt/control-equipos/backup/ARTEFACTO_ANTERIOR.jar \
  /opt/control-equipos/app/NOMBRE_APLICACION.jar
sudo chown controlapp:controlapp /opt/control-equipos/app/NOMBRE_APLICACION.jar
sudo systemctl start control-equipos.service
sudo systemctl status control-equipos.service --no-pager
```

Si el problema está en Nginx:

```bash
sudo cp /etc/nginx/conf.d/ARCHIVO.conf.bak.FECHA \
  /etc/nginx/conf.d/ARCHIVO.conf
sudo nginx -t
sudo systemctl reload nginx
```

---

## 18. Validación de salida desde `.24` hacia Internet

Esta prueba es independiente de la publicación mediante Nginx.

### 18.1 DNS

```bash
getent hosts github.com
```

### 18.2 HTTPS

```bash
curl -I https://github.com
```

### 18.3 Git

```bash
git ls-remote https://github.com/jose-alejandro-v2/repo_control_equipos_apilamiento_v2.git HEAD
```

### 18.4 Proxy corporativo, si existe

```bash
env | grep -i proxy
git config --global --get http.proxy
git config --global --get https.proxy
```

No configurar valores de proxy sin recibir oficialmente host, puerto y política de autenticación del área de infraestructura.

---

## 19. Lista de comprobación final

### Repositorio

- [ ] Arquitectura identificada.
- [ ] Rama de despliegue definida.
- [ ] No hay secretos versionados.
- [ ] Comando de compilación validado.
- [ ] Artefacto de producción identificado.

### Servidor `.24`

- [ ] Sistema operativo confirmado.
- [ ] Dependencias instaladas.
- [ ] Carpetas y permisos preparados.
- [ ] Configuración externa creada.
- [ ] Aplicación probada manualmente.
- [ ] Servicio systemd activo y habilitado.
- [ ] Endpoint de salud responde localmente.
- [ ] Puerto interno documentado.
- [ ] Firewall restringido a `.10`.

### Servidor `172.18.10.10`

- [ ] Conexión TCP hacia `.24` validada.
- [ ] Respuesta HTTP directa validada.
- [ ] Copia de seguridad de Nginx creada.
- [ ] Ruta o dominio configurado.
- [ ] `nginx -t` correcto.
- [ ] Nginx recargado sin errores.
- [ ] Certificado HTTPS válido.

### Aplicación

- [ ] Frontend carga correctamente.
- [ ] Recursos estáticos cargan.
- [ ] Recarga de rutas SPA funciona.
- [ ] API responde desde la URL pública.
- [ ] CORS validado.
- [ ] Autenticación validada.
- [ ] Base de datos validada.
- [ ] Logs revisados.
- [ ] Procedimiento de reversión probado o documentado.

---

## 20. Registro de evidencias

Guardar capturas o salidas, ocultando datos sensibles:

| Evidencia | Fecha | Resultado |
|---|---|---|
| `systemctl status` en `.24` | | |
| `curl localhost` en `.24` | | |
| `nc` o `telnet` desde `.10` | | |
| `curl` directo desde `.10` a `.24` | | |
| `nginx -t` | | |
| `curl` a URL pública | | |
| Prueba en navegador | | |

---

## 21. Información pendiente para convertir esta plantilla en guía definitiva

- Estructura real del repositorio.
- Tecnología y versiones del frontend y backend.
- Dirección IP completa del servidor `.24`.
- Puerto o puertos definitivos.
- Dominio y ruta pública.
- Sistema operativo de ambos servidores.
- Ubicación de la base de datos.
- Método de autenticación.
- Reglas corporativas de firewall y certificados.
- Decisión de despliegue: systemd, Docker o ambos.

---

## 22. Referencia interna utilizada

Esta guía se basa en el procedimiento interno de publicación mediante proxy inverso: ejecutar el servicio en el servidor origen, habilitar la conectividad necesaria, probar desde `172.18.10.10`, añadir la ruta correspondiente en Nginx, validar con `nginx -t` y recargar el servicio.

La plantilla mejora ese procedimiento incorporando separación de usuarios, restricción de firewall, comprobaciones por capas, logs, seguridad, reversión y una distinción clara entre publicación de entrada y salida hacia Internet.
