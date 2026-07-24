-- Recalcula los PSR existentes usando meses calendario e incluyendo la fecha final.
-- Ejemplo: 01/08/2026 al 31/10/2026 equivale a 3.00 meses.
UPDATE fac_psr
SET meses = ROUND((
    EXTRACT(YEAR FROM AGE(fecha_fin_uso + 1, fecha_inicio_uso)) * 12
    + EXTRACT(MONTH FROM AGE(fecha_fin_uso + 1, fecha_inicio_uso))
    + EXTRACT(DAY FROM AGE(fecha_fin_uso + 1, fecha_inicio_uso)) / 30.44
)::NUMERIC, 2)
WHERE fecha_inicio_uso IS NOT NULL
  AND fecha_fin_uso IS NOT NULL
  AND fecha_fin_uso >= fecha_inicio_uso;
