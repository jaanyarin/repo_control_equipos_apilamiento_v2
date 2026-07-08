CREATE EXTENSION IF NOT EXISTS pgcrypto;

UPDATE dim_usuarios
SET password_hash = crypt('00000000', gen_salt('bf')),
    password_reset_required = TRUE,
    fecha_actualizacion = CURRENT_TIMESTAMP,
    usuario_actualizacion = COALESCE(usuario_actualizacion, 1)
WHERE password_hash IS NULL OR btrim(password_hash) = '';
