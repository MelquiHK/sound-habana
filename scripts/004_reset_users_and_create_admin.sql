-- Limpiar todos los datos de usuarios y pedidos
DELETE FROM public.orders;
DELETE FROM public.profiles;
DELETE FROM auth.users;

-- Crear el nuevo usuario administrador
-- IMPORTANTE: Este script debe ejecutarse desde Supabase Dashboard SQL Editor
-- ya que necesitamos insertar directamente en auth.users

-- Insertar usuario en auth.users (esto normalmente lo hace Supabase Auth)
-- Necesitarás hacer esto manualmente desde el panel de Supabase:
-- 1. Ve a Authentication > Users en tu dashboard de Supabase
-- 2. Haz clic en "Invite user"
-- 3. Usa el email: melcraft96@gmail.com
-- 4. O crea el usuario directamente aquí:

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'melcraft96@gmail.com',
  crypt('melQUI06', gen_salt('bf')), -- Contraseña hasheada con bcrypt
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Melquisedec"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Crear el perfil del administrador
-- Nota: El trigger handle_new_user debería crear esto automáticamente,
-- pero lo hacemos manualmente para asegurar que sea admin
INSERT INTO public.profiles (id, name, phone, email, role)
SELECT 
  id,
  'Melquisedec',
  '+53 63180910',
  'melcraft96@gmail.com',
  'admin'
FROM auth.users
WHERE email = 'melcraft96@gmail.com'
ON CONFLICT (id) DO UPDATE
SET 
  name = 'Melquisedec',
  phone = '+53 63180910',
  role = 'admin';
