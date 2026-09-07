-- V36: Agregar area_id FK en dim_usuarios (reemplaza texto por FK)
-- Backfill desde dim_usuarios.area (texto) → dim_areas.id
-- Mantiene dim_usuarios.area como compatibilidad temporal

ALTER TABLE dim_usuarios ADD COLUMN area_id BIGINT;

UPDATE dim_usuarios u
SET area_id = a.id
FROM dim_areas a
WHERE lower(trim(u.area)) = lower(trim(a.nombre))
  AND u.area IS NOT NULL
  AND trim(u.area) != '';

ALTER TABLE dim_usuarios
    ADD CONSTRAINT fk_dim_usuarios_area
    FOREIGN KEY (area_id) REFERENCES dim_areas(id)
    ON DELETE SET NULL;

CREATE INDEX idx_dim_usuarios_area_id ON dim_usuarios(area_id);
