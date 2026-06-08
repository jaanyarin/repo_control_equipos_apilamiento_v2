CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE dim_usuarios ALTER COLUMN id_microsoft DROP NOT NULL;
ALTER TABLE dim_usuarios ALTER COLUMN correo DROP NOT NULL;

ALTER TABLE dim_usuarios ADD COLUMN password_hash VARCHAR(255);
ALTER TABLE dim_usuarios ADD COLUMN dni VARCHAR(20);
ALTER TABLE dim_usuarios ADD COLUMN password_reset_required BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_usuarios_dni ON dim_usuarios(dni);
