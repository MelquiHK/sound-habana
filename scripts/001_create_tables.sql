-- Tabla de perfiles de usuario (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'Package',
  color TEXT DEFAULT 'bg-primary',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  main_image_index INTEGER DEFAULT 0,
  specifications JSONB DEFAULT '[]',
  uses TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_notes TEXT,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  is_guest BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de artículos del blog
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  image TEXT,
  category TEXT DEFAULT 'novedades' CHECK (category IN ('novedades', 'soluciones')),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de configuración del sitio
CREATE TABLE IF NOT EXISTS public.site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de ingresos manuales
CREATE TABLE IF NOT EXISTS public.revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar categorías iniciales
INSERT INTO public.categories (name, icon, color) VALUES
  ('Audio', 'Headphones', 'bg-primary'),
  ('Accesorios', 'Cable', 'bg-blue-500'),
  ('Smartphones', 'Smartphone', 'bg-green-500'),
  ('Computadoras', 'Monitor', 'bg-purple-500')
ON CONFLICT (name) DO NOTHING;

-- Insertar configuración inicial del sitio
INSERT INTO public.site_config (key, value) VALUES
  ('business_info', '{"name": "Habana Sound", "slogan": "Tu destino para audio premium", "phone": "+53 63180910", "address": "D entre 21 y 23, La Habana", "hours": "24/7", "facebook": "https://www.facebook.com/share/17fTcvKM4o/", "instagram": "", "whatsapp": "+53 63180910"}'),
  ('about_info', '{"title": "Sobre Nosotros", "description": "En Habana Sound nos especializamos en ofrecer los mejores productos de electrónica y audio. Con años de experiencia en el mercado, garantizamos calidad y servicio excepcional.", "mission": "Llevar la mejor tecnología de audio a cada hogar cubano.", "vision": "Ser la tienda líder de electrónica en Cuba."}'),
  ('stats', '{"customers": 500, "products_sold": 100, "support_hours": "24/7"}')
ON CONFLICT (key) DO NOTHING;
