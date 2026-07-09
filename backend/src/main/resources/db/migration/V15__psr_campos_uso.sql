-- Agregar campos de uso a fac_psr (motivo, fechas, meses)
ALTER TABLE fac_psr
    ADD COLUMN IF NOT EXISTS motivo_id BIGINT NOT NULL DEFAULT 1 REFERENCES dim_motivo_psr(id),
    ADD COLUMN IF NOT EXISTS fecha_inicio_uso DATE NOT NULL DEFAULT CURRENT_DATE,
    ADD COLUMN IF NOT EXISTS fecha_fin_uso DATE NOT NULL DEFAULT CURRENT_DATE,
    ADD COLUMN IF NOT EXISTS meses NUMERIC(5,2) NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_fac_psr_motivo ON fac_psr(motivo_id);