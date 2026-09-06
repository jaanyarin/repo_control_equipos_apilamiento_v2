-- HDT-015 PSR 1:N OSR: permitir multiples OSR por PSR
-- Antes: fac_osr.psr_id UNIQUE (1:1). Ahora: una PSR puede tener N OSR (ilimitado).
-- numero_osr sigue UNIQUE global.
DO $$
BEGIN
    -- El nombre del constraint UNIQUE puede variar segun el entorno (fac_osr_psr_id_key u otro).
    -- Intentar drop por nombre estandar; si no existe, buscar dinamicamente.
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fac_osr_psr_id_key') THEN
        ALTER TABLE fac_osr DROP CONSTRAINT fac_osr_psr_id_key;
    ELSE
        -- Buscar constraint UNIQUE sobre fac_osr.psr_id
        DECLARE
            cname TEXT;
        BEGIN
            SELECT conname INTO cname
            FROM pg_constraint
            WHERE conrelid = 'fac_osr'::regclass
              AND contype = 'u'
              AND array_length(conkey, 1) = 1
              AND conkey[1] = (SELECT attnum FROM pg_attribute WHERE attrelid='fac_osr'::regclass AND attname='psr_id');
            IF cname IS NOT NULL THEN
                EXECUTE format('ALTER TABLE fac_osr DROP CONSTRAINT %I', cname);
            END IF;
        END;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_fac_osr_psr_numero ON fac_osr(psr_id, numero_osr);
