-- ============================================================
-- Backfill de horometro_inicio en equipos existentes
-- Bug: IngresoEquipoService.applyData() no persistia
-- horometroInicio/horometroFin al crear borradores de ingreso,
-- por lo que los equipos existentes quedaron con NULL.
-- Se completa horometro_inicio con un valor aleatorio entre
-- 1234.5 y 24345.6 (2 decimales, NUMERIC(12,2)).
-- horometro_fin se deja NULL (se completa en la devolucion).
-- ============================================================

UPDATE fac_equipos
SET horometro_inicio = round((1234.5 + random() * (24345.6 - 1234.5))::numeric, 2),
    fecha_actualizacion = CURRENT_TIMESTAMP
WHERE horometro_inicio IS NULL;
