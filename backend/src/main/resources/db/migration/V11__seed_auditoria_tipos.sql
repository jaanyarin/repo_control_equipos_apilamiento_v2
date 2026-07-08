-- ============================================================
-- HDT-003 - Datos semilla para eventos de auditoria
-- ============================================================

-- No hay tabla maestra de tipos de evento, se definen en código.
-- Esta migración inserta registros de referencia para monitoreo.
INSERT INTO auditoria_eventos (tipo_evento, entidad, accion, detalle, fecha_evento)
VALUES
    ('SISTEMA', 'Migracion', 'INICIAR', 'Migracion V11 ejecutada - seed de auditoria', CURRENT_TIMESTAMP);
