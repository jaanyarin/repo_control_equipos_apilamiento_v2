-- ============================================================
-- V28 - Evidencia de EXTINTOR en ingreso y devolucion
-- El extintor es un accesorio marcable en fac_equipos y debe
-- exigirse como evidencia cuando este presente en el equipo.
-- ============================================================

ALTER TABLE fac_evidencias_ingreso_equipo
    DROP CONSTRAINT IF EXISTS chk_evidencia_ingreso_tipo;

ALTER TABLE fac_evidencias_ingreso_equipo
    ADD CONSTRAINT chk_evidencia_ingreso_tipo CHECK (tipo IN (
        'LATERAL_IZQUIERDO','LATERAL_DERECHO','FRONTAL','POSTERIOR',
        'EXTINTOR',
        'BATERIA_1','BATERIA_2','CONO','BOTIQUIN','CARGADOR',
        'TRANSFORMADOR','CABLE_ADICIONAL','MESA_RODILLOS',
        'ELEVADOR_BATERIA','CONECTOR_ADICIONAL','GUIA_REMISION',
        'HOROMETRO_INICIAL','DETALLE_1','DETALLE_2','DETALLE_3'
    ));

ALTER TABLE fac_evidencias_devolucion_equipo
    DROP CONSTRAINT IF EXISTS chk_evidencia_devolucion_tipo;

ALTER TABLE fac_evidencias_devolucion_equipo
    ADD CONSTRAINT chk_evidencia_devolucion_tipo CHECK (tipo IN (
        'DEVOLUCION_FRONTAL',
        'DEVOLUCION_LATERAL_IZQUIERDO',
        'DEVOLUCION_LATERAL_DERECHO',
        'DEVOLUCION_POSTERIOR',
        'EXTINTOR',
        'BATERIA_1',
        'BATERIA_2',
        'CONO',
        'BOTIQUIN',
        'CARGADOR',
        'TRANSFORMADOR',
        'CABLE_ADICIONAL',
        'MESA_RODILLOS',
        'ELEVADOR_BATERIA',
        'CONECTOR_ADICIONAL'
    ));