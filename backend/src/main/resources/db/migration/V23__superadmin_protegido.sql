-- ============================================================
-- Super Admin protegido
-- 1. Corrige el rol del usuario Super Admin (id_microsoft =
--    'seed-superadmin') a rol_id = 1 (Super Admin), ya que
--    estaba mal asignado como Admin (rol_id = 2).
-- 2. Crea un trigger que impide:
--    - Eliminar el registro del Super Admin.
--    - Cambiar su rol (debe ser siempre Super Admin).
--    - Desactivarlo (estado_activo = false).
--    - Cambiar su id_microsoft.
--    Los UPDATE normales (ultimo_acceso, fecha_actualizacion)
--    del login NO se bloquean.
-- ============================================================

UPDATE dim_usuarios
SET rol_id = 1
WHERE id_microsoft = 'seed-superadmin'
  AND rol_id <> 1;

CREATE OR REPLACE FUNCTION proteger_super_admin()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.id_microsoft = 'seed-superadmin' THEN
        IF TG_OP = 'DELETE' THEN
            RAISE EXCEPTION 'El usuario Super Admin no puede ser eliminado';
        END IF;

        IF NEW.id_microsoft IS DISTINCT FROM 'seed-superadmin' THEN
            RAISE EXCEPTION 'El id_microsoft del Super Admin no puede ser cambiado';
        END IF;

        IF NEW.rol_id IS DISTINCT FROM 1 THEN
            RAISE EXCEPTION 'El rol del Super Admin no puede ser cambiado';
        END IF;

        IF NEW.estado_activo IS DISTINCT FROM TRUE THEN
            RAISE EXCEPTION 'El Super Admin no puede ser desactivado';
        END IF;

        IF NEW.nombre IS DISTINCT FROM OLD.nombre THEN
            RAISE EXCEPTION 'El nombre del Super Admin no puede ser cambiado';
        END IF;

        IF NEW.correo IS DISTINCT FROM OLD.correo THEN
            RAISE EXCEPTION 'El correo del Super Admin no puede ser cambiado';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_proteger_super_admin
BEFORE UPDATE OR DELETE ON dim_usuarios
FOR EACH ROW
EXECUTE FUNCTION proteger_super_admin();
