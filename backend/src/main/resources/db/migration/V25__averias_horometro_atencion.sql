-- ============================================================
-- Horometro al atender la averia
-- - Agrega columna horometro_atencion a fac_averias (mismo formato
--   que horometro/horometro_inicio: NUMERIC(12,2)).
-- - Registra el horometro en el momento en que la maquina queda
--   operativa, completando la trazabilidad: horometro (reporte) y
--   horometro_atencion (atencion).
-- ============================================================

ALTER TABLE fac_averias
    ADD COLUMN IF NOT EXISTS horometro_atencion NUMERIC(12,2);
