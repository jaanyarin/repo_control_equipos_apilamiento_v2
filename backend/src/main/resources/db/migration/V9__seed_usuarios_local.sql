-- Super Admin (rol_id = 1)
INSERT INTO dim_usuarios (correo, nombre, area, rol_id, sitio_id, dni, password_hash, password_reset_required, estado_activo, usuario_creacion)
SELECT 'admin.powers@apilamiento.local', 'Admin Power Apps', 'SOPORTE IC', 1, NULL, '00000001', crypt('12345', gen_salt('bf')), TRUE, TRUE, 1
WHERE NOT EXISTS (SELECT 1 FROM dim_usuarios WHERE correo = 'admin.powers@apilamiento.local');

-- Admin (rol_id = 2)
INSERT INTO dim_usuarios (correo, nombre, area, rol_id, sitio_id, dni, password_hash, password_reset_required, estado_activo, usuario_creacion)
SELECT 'carla.huamanorqque.recepcion@apilamiento.local', 'Carla Huamanorqque', 'RECEPCIÓN PACKING', 2, NULL, '00000002', crypt('12345', gen_salt('bf')), TRUE, TRUE, 1
WHERE NOT EXISTS (SELECT 1 FROM dim_usuarios WHERE correo = 'carla.huamanorqque.recepcion@apilamiento.local');

INSERT INTO dim_usuarios (correo, nombre, area, rol_id, sitio_id, dni, password_hash, password_reset_required, estado_activo, usuario_creacion)
SELECT 'carla.huamanorqque.almacen@apilamiento.local', 'Carla Huamanorqque', 'ALMACÉN DE MATERIALES', 2, NULL, '00000003', crypt('12345', gen_salt('bf')), TRUE, TRUE, 1
WHERE NOT EXISTS (SELECT 1 FROM dim_usuarios WHERE correo = 'carla.huamanorqque.almacen@apilamiento.local');

INSERT INTO dim_usuarios (correo, nombre, area, rol_id, sitio_id, dni, password_hash, password_reset_required, estado_activo, usuario_creacion)
SELECT 'rosa.navarrete@apilamiento.local', 'Rosa Navarrete', 'FRIO', 2, NULL, '00000004', crypt('12345', gen_salt('bf')), TRUE, TRUE, 1
WHERE NOT EXISTS (SELECT 1 FROM dim_usuarios WHERE correo = 'rosa.navarrete@apilamiento.local');

INSERT INTO dim_usuarios (correo, nombre, area, rol_id, sitio_id, dni, password_hash, password_reset_required, estado_activo, usuario_creacion)
SELECT 'victor.valdivia@apilamiento.local', 'Victor Valdivia', 'CAMARA DE PRODUCTO TERMINADO', 2, NULL, '00000005', crypt('12345', gen_salt('bf')), TRUE, TRUE, 1
WHERE NOT EXISTS (SELECT 1 FROM dim_usuarios WHERE correo = 'victor.valdivia@apilamiento.local');

-- Usuario (rol_id = 3)
INSERT INTO dim_usuarios (correo, nombre, area, rol_id, sitio_id, dni, password_hash, password_reset_required, estado_activo, usuario_creacion)
SELECT 'jean.alfaro@apilamiento.local', 'Jean Pierre Alfaro', 'RECEPCIÓN PACKING', 3, NULL, '00000006', crypt('12345', gen_salt('bf')), TRUE, TRUE, 1
WHERE NOT EXISTS (SELECT 1 FROM dim_usuarios WHERE correo = 'jean.alfaro@apilamiento.local');

INSERT INTO dim_usuarios (correo, nombre, area, rol_id, sitio_id, dni, password_hash, password_reset_required, estado_activo, usuario_creacion)
SELECT 'luis.arroyo@apilamiento.local', 'Luis Arroyo', 'ALMACÉN DE MATERIALES', 3, NULL, '00000007', crypt('12345', gen_salt('bf')), TRUE, TRUE, 1
WHERE NOT EXISTS (SELECT 1 FROM dim_usuarios WHERE correo = 'luis.arroyo@apilamiento.local');

INSERT INTO dim_usuarios (correo, nombre, area, rol_id, sitio_id, dni, password_hash, password_reset_required, estado_activo, usuario_creacion)
SELECT 'benito.pena@apilamiento.local', 'Benito Peña', 'FRIO', 3, NULL, '00000008', crypt('12345', gen_salt('bf')), TRUE, TRUE, 1
WHERE NOT EXISTS (SELECT 1 FROM dim_usuarios WHERE correo = 'benito.pena@apilamiento.local');

INSERT INTO dim_usuarios (correo, nombre, area, rol_id, sitio_id, dni, password_hash, password_reset_required, estado_activo, usuario_creacion)
SELECT 'diego.licapa@apilamiento.local', 'Diego Licapa', 'CAMARA DE PRODUCTO TERMINADO', 3, NULL, '00000009', crypt('12345', gen_salt('bf')), TRUE, TRUE, 1
WHERE NOT EXISTS (SELECT 1 FROM dim_usuarios WHERE correo = 'diego.licapa@apilamiento.local');
