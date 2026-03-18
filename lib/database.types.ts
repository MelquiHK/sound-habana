export interface Profile {
  id: string
  name: string
  phone: string
  email: string
  role: "customer" | "admin"
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string | null
  images: string[]
  main_image_index: number
  specifications: { label: string; value: string }[]
  uses: string[]
  stock: number
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  user_id: string | null
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_notes: string | null
  items: OrderItem[]
  subtotal: number
  shipping_cost: number
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  is_guest: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image: string | null
  category: "novedades" | "soluciones"
  published: boolean
  created_at: string
  updated_at: string
}

export interface SiteConfig {
  id: string
  key: string
  value: Record<string, unknown>
  updated_at: string
}

export interface Revenue {
  id: string
  amount: number
  description: string | null
  order_id: string | null
  created_at: string
}
