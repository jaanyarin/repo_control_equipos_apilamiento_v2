-- ============================================================
-- V26 - Evidencias de averias ampliadas a 5 fotos
-- Registro: 1 (foto 1), 2 (foto 2), 3 (horometro inicial)
-- Atencion: 4 (horometro de atencion), 5 (evidencia del servicio)
-- ============================================================

ALTER TABLE fac_evidencias_averias
    DROP CONSTRAINT IF EXISTS chk_numero_foto_averia;

ALTER TABLE fac_evidencias_averias
    ADD CONSTRAINT chk_numero_foto_averia
    CHECK (numero_foto BETWEEN 1 AND 5);