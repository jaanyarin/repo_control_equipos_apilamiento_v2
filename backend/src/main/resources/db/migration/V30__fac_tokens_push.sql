-- ============================================================
-- V30 - Tokens de notificacion push FCM
-- Registra los tokens FCM por usuario para el envio de
-- notificaciones "Nuevo ingreso de equipo" a todos menos el que
-- registra (regla: total usuarios - 1).
-- ============================================================

CREATE TABLE IF NOT EXISTS fac_tokens_push (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    token VARCHAR(512) NOT NULL,
    plataforma VARCHAR(20) NOT NULL DEFAULT 'ANDROID',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,
    usuario_creacion BIGINT NOT NULL,
    usuario_actualizacion BIGINT,
    CONSTRAINT uq_tokens_push_token UNIQUE (token)
);

CREATE INDEX IF NOT EXISTS idx_tokens_push_usuario
    ON fac_tokens_push(usuario_id) WHERE activo = TRUE;