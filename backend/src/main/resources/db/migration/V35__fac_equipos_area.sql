ALTER TABLE fac_equipos ADD COLUMN IF NOT EXISTS area_id BIGINT;

UPDATE fac_equipos e
SET area_id = a.id
FROM dim_usuarios u
JOIN dim_areas a ON lower(trim(u.area)) = lower(trim(a.nombre))
WHERE e.usuario_creacion = u.id
  AND e.area_id IS NULL;

ALTER TABLE fac_equipos
    DROP CONSTRAINT IF EXISTS fk_fac_equipos_area;

ALTER TABLE fac_equipos
    ADD CONSTRAINT fk_fac_equipos_area
    FOREIGN KEY (area_id) REFERENCES dim_areas(id);

CREATE INDEX IF NOT EXISTS idx_fac_equipos_area_activo
    ON fac_equipos(area_id, estado_activo, ingreso_completo);