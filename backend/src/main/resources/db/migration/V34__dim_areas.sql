CREATE TABLE IF NOT EXISTS dim_areas (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    codigo VARCHAR(80) NOT NULL UNIQUE,
    estado_activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,
    usuario_creacion BIGINT,
    usuario_actualizacion BIGINT,
    version INTEGER NOT NULL DEFAULT 0
);

INSERT INTO dim_areas (nombre, codigo, usuario_creacion)
VALUES
    ('Recepción Packing', 'RECEPCION_PACKING', 1),
    ('Almacén de Materiales', 'ALMACEN_DE_MATERIALES', 1),
    ('Frío', 'FRIO', 1),
    ('Cámara de Producto Terminado', 'CAMARA_DE_PRODUCTO_TERMINADO', 1)
ON CONFLICT (nombre) DO NOTHING;