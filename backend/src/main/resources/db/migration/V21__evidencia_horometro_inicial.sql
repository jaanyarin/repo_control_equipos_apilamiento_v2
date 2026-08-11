ALTER TABLE fac_evidencias_ingreso_equipo
    DROP CONSTRAINT IF EXISTS chk_evidencia_ingreso_tipo;

ALTER TABLE fac_evidencias_ingreso_equipo
    ADD CONSTRAINT chk_evidencia_ingreso_tipo CHECK (tipo IN (
        'LATERAL_IZQUIERDO','LATERAL_DERECHO','FRONTAL','POSTERIOR',
        'BATERIA_1','BATERIA_2','CONO','BOTIQUIN','CARGADOR',
        'TRANSFORMADOR','CABLE_ADICIONAL','MESA_RODILLOS',
        'ELEVADOR_BATERIA','CONECTOR_ADICIONAL','GUIA_REMISION',
        'HOROMETRO_INICIAL',
        'DETALLE_1','DETALLE_2','DETALLE_3'
    ));
