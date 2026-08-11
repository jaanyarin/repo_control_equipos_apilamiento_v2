-- ============================================================
-- V27 - Evidencias de devolucion ampliadas a accesorios
-- Vistas obligatorias + accesorios con los que ingreso el equipo
-- ============================================================

ALTER TABLE fac_evidencias_devolucion_equipo
    DROP CONSTRAINT IF EXISTS chk_evidencia_devolucion_tipo;

ALTER TABLE fac_evidencias_devolucion_equipo
    ADD CONSTRAINT chk_evidencia_devolucion_tipo CHECK (tipo IN (
        'DEVOLUCION_FRONTAL',
        'DEVOLUCION_LATERAL_IZQUIERDO',
        'DEVOLUCION_LATERAL_DERECHO',
        'DEVOLUCION_POSTERIOR',
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