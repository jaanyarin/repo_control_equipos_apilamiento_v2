-- ============================================================
-- Horometro en el registro de averias
-- - Agrega columna horometro a fac_averias (mismo formato que
--   horometro_inicio de fac_equipos: NUMERIC(12,2))
-- - La evidencia de foto del horometro usa numero_foto = 3
--   (la constraint chk_numero_foto_averia ya permite 1..3)
-- ============================================================

ALTER TABLE fac_averias
    ADD COLUMN IF NOT EXISTS horometro NUMERIC(12,2);
