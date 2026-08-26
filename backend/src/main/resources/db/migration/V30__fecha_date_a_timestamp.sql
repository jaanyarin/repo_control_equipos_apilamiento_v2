ALTER TABLE fac_psr
    ALTER COLUMN fecha_psr TYPE TIMESTAMP WITHOUT TIME ZONE USING fecha_psr::timestamp,
    ALTER COLUMN fecha_inicio_uso TYPE TIMESTAMP WITHOUT TIME ZONE USING fecha_inicio_uso::timestamp,
    ALTER COLUMN fecha_fin_uso TYPE TIMESTAMP WITHOUT TIME ZONE USING fecha_fin_uso::timestamp;

ALTER TABLE fac_osr
    ALTER COLUMN fecha_osr TYPE TIMESTAMP WITHOUT TIME ZONE USING fecha_osr::timestamp;

ALTER TABLE fac_equipos
    ALTER COLUMN fecha_ingreso TYPE TIMESTAMP WITHOUT TIME ZONE USING fecha_ingreso::timestamp;
