-- ============================================================
-- V29 - Corregir trigger de protección del Super Admin
-- Bug: proteger_super_admin() siempre retornaba NEW; en un
-- DELETE, NEW es NULL y retornar NULL desde un trigger BEFORE
-- DELETE cancela el borrado para CUALQUIER fila, no solo para
-- el Super Admin protegido. El resultado era un borrado de
-- usuario "exitoso" (200 OK) pero SIN eliminar la fila.
-- Fix: para DELETE se devuelve OLD; solo el Super Admin seed
-- (id_microsoft = 'seed-superadmin') sigue protegido con
-- RAISE EXCEPTION.
-- ============================================================

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

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;