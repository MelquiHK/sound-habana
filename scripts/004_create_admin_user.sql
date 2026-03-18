-- Script para crear el usuario administrador principal
-- Email: melcraft96@gmail.com
-- Usuario: Melquisedec
-- Contraseña: melQUI06

-- Nota: Este script debe ejecutarse manualmente desde el dashboard de Supabase
-- ve a Authentication > Users > Invite user, o usa el dashboard de Supabase Auth
-- para crear el usuario con email melcraft96@gmail.com y contraseña melQUI06

-- Una vez creado el usuario en Auth, actualiza su perfil a admin:
-- UPDATE public.profiles 
-- SET role = 'admin', name = 'Melquisedec'
-- WHERE email = 'melcraft96@gmail.com';

-- INSTRUCCIONES PARA CREAR EL ADMINISTRADOR:
-- 1. Registrate en la app usando: melcraft96@gmail.com / melQUI06
-- 2. Luego ejecuta este SQL en el SQL Editor de Supabase:

UPDATE public.profiles 
SET role = 'admin', name = 'Melquisedec'
WHERE email = 'melcraft96@gmail.com';
