-- HDT-015: reparar instalaciones donde fac_osr.psr_id aun conserva unicidad 1:1.
DO $$
DECLARE
    constraint_name TEXT;
    index_name TEXT;
BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'fac_osr'::regclass
      AND contype = 'u'
      AND conkey = ARRAY[(SELECT attnum
                         FROM pg_attribute
                         WHERE attrelid = 'fac_osr'::regclass
                           AND attname = 'psr_id')];

    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE fac_osr DROP CONSTRAINT %I', constraint_name);
    END IF;

    SELECT indexname INTO index_name
    FROM pg_indexes
    WHERE tablename = 'fac_osr'
      AND indexdef LIKE '%UNIQUE%'
      AND indexdef LIKE '%(psr_id)%';

    IF index_name IS NOT NULL THEN
        EXECUTE format('DROP INDEX IF EXISTS %I', index_name);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_fac_osr_psr_id ON fac_osr(psr_id);