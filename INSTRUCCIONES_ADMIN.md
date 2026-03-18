# Configuración del Administrador - Habana Sound

## Credenciales del Administrador Principal

- **Email**: melcraft96@gmail.com
- **Usuario**: Melquisedec  
- **Contraseña**: melQUI06

---

## 🚀 Inicio Rápido - Crear tu Cuenta de Admin

**La forma más fácil es registrarte directamente en la app:**

1. Ve a la página web y haz clic en "Iniciar Sesión"
2. Luego haz clic en "Regístrate aquí"
3. Completa el formulario con:
   - **Nombre**: Melquisedec
   - **Teléfono**: +53 63180910
   - **Email**: melcraft96@gmail.com
   - **Contraseña**: melQUI06
4. Una vez registrado, ve al dashboard de Supabase
5. Abre el **SQL Editor** y ejecuta:

\`\`\`sql
UPDATE public.profiles 
SET role = 'admin', name = 'Melquisedec', phone = '+53 63180910'
WHERE email = 'melcraft96@gmail.com';
\`\`\`

6. ¡Listo! Ya eres administrador. Recarga la página y verás el "Panel Admin" en el menú.

---

## 📋 Estado del Sistema

✅ **Base de Datos**: Todas las tablas creadas
- profiles (usuarios)
- products (productos)  
- categories (categorías)
- orders (pedidos)
- blog_posts (blog)
- site_config (configuración)
- revenue (ingresos)

✅ **Seguridad**: Row Level Security (RLS) habilitado
- Los usuarios solo pueden ver sus propios datos
- Los administradores tienen acceso completo
- Los invitados pueden ver productos y crear pedidos

✅ **Triggers**: Configurados
- Perfil automático al registrarse
- Actualización automática de timestamps

---

## 🔧 Alternativa: Eliminar Todos los Usuarios y Crear Solo el Admin

Si ya hay usuarios registrados y quieres empezar de cero:

1. Ve a **SQL Editor** en Supabase Dashboard
2. Ejecuta este script:

\`\`\`sql
-- Eliminar todos los pedidos
DELETE FROM public.orders;

-- Eliminar todos los perfiles (esto eliminará los usuarios de auth.users también)
DELETE FROM public.profiles;

-- No es necesario crear el usuario aquí, mejor usa el registro en la app
-- y luego ejecuta el UPDATE de arriba para hacerlo admin
\`\`\`

---

## 🎯 Verificar que Todo Funciona

1. **Inicia sesión** con melcraft96@gmail.com / melQUI06
2. Deberías ver el botón **"Panel Admin"** en el menú lateral
3. Desde el panel puedes:
   - ✅ Ver todos los pedidos de los clientes
   - ✅ Agregar, editar y eliminar productos
   - ✅ Subir imágenes de productos
   - ✅ Gestionar categorías
   - ✅ Ver y editar usuarios
   - ✅ Hacer a otros usuarios administradores
   - ✅ Crear y editar posts del blog
   - ✅ Editar la configuración del sitio
   - ✅ Gestionar ingresos

---

## 👤 Gestión de Usuarios desde el Panel

### Ver Todos los Usuarios
- Ve a **Panel Admin** → Pestaña **Usuarios**
- Verás la lista completa con email, teléfono y rol

### Eliminar un Usuario
- Haz clic en el ícono de **basura** 🗑️
- Esto eliminará el usuario y todos sus pedidos

### Hacer a Alguien Administrador
- Haz clic en el ícono de **corona** 👑
- El usuario tendrá acceso completo al panel

### Editar un Usuario
- Haz clic en el ícono de **editar** ✏️  
- Puedes cambiar nombre, teléfono, etc.

---

## 🛠️ Solución de Problemas

### No puedo iniciar sesión
- Verifica que el proyecto de Supabase esté activo (no pausado)
- Revisa que las variables de entorno estén configuradas
- Ve a las opciones de conexión en Supabase y confirma la URL

### No veo el botón "Panel Admin"
- Asegúrate de haber ejecutado el SQL UPDATE para hacerte admin
- Cierra sesión y vuelve a iniciar sesión
- Verifica en la tabla `profiles` que tu `role` sea `'admin'`

### Los datos no se sincronizan entre dispositivos
- Confirma que Supabase esté activo
- Revisa la consola del navegador en busca de errores
- Verifica que las políticas RLS estén habilitadas

---

## 📱 Datos de Contacto Configurados

- **WhatsApp**: +53 63180910
- **Dirección**: D entre 21 y 23, La Habana
- **Horario**: 24/7
- **Facebook**: https://www.facebook.com/share/17fTcvKM4o/

Estos datos se pueden editar desde **Panel Admin** → **Configuración del Sitio**
