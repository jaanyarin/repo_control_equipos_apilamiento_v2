ALTER TABLE fac_evidencias_averias
  ADD COLUMN contenido BYTEA,
  ALTER COLUMN ruta_archivo DROP NOT NULL;
