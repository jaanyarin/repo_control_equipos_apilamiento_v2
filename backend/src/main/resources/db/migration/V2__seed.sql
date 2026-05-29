INSERT INTO dim_roles (nombre, descripcion, usuario_creacion)
VALUES ('Super Admin', 'Acceso total al sistema: configuración, reportes, dashboard, catálogos, campañas, auditoría, monitoreo operativo y gestión de administradores', 1)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO dim_roles (nombre, descripcion, usuario_creacion)
VALUES ('Admin', 'Acceso administrativo: gestión de usuarios, equipos, campañas, PSR/OSR, reportes y dashboard sin acceso a configuración crítica', 1)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO dim_roles (nombre, descripcion, usuario_creacion)
VALUES ('Usuario', 'Acceso operativo básico: registro de equipos, averías, evidencias fotográficas y actualización de estados', 1)
ON CONFLICT (nombre) DO NOTHING;
