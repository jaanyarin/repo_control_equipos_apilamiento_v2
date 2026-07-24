-- Agregar información comercial para el registro manual de OSR.
ALTER TABLE fac_osr
    ADD COLUMN IF NOT EXISTS costo_unitario NUMERIC(14,2),
    ADD COLUMN IF NOT EXISTS tipo_moneda VARCHAR(3);

ALTER TABLE fac_osr
    DROP CONSTRAINT IF EXISTS chk_fac_osr_costo_unitario,
    DROP CONSTRAINT IF EXISTS chk_fac_osr_tipo_moneda;

ALTER TABLE fac_osr
    ADD CONSTRAINT chk_fac_osr_costo_unitario
        CHECK (costo_unitario IS NULL OR costo_unitario > 0),
    ADD CONSTRAINT chk_fac_osr_tipo_moneda
        CHECK (tipo_moneda IS NULL OR tipo_moneda IN ('PEN', 'USD', 'EUR'));
