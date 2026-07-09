-- Hacer numero_osr y fecha_osr opcionales en fac_osr
ALTER TABLE fac_osr ALTER COLUMN numero_osr DROP NOT NULL;
ALTER TABLE fac_osr ALTER COLUMN fecha_osr DROP NOT NULL;
ALTER TABLE fac_osr ALTER COLUMN equipo_id DROP NOT NULL;