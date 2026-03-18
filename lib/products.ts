export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[] // Cambiado de image a images (múltiples imágenes)
  category: string
  specs: string[]
  useCases: string[]
  inStock: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  description: string
}

export function getCategories(): Category[] {
  if (typeof window === "undefined") return defaultCategories
  const saved = localStorage.getItem("habana-sound-categories")
  return saved ? JSON.parse(saved) : defaultCategories
}

export function saveCategories(categories: Category[]) {
  localStorage.setItem("habana-sound-categories", JSON.stringify(categories))
}

export const defaultCategories: Category[] = [
  { id: "bocinas", name: "Bocinas", icon: "🔊", description: "Bocinas y altavoces de alta calidad" },
  { id: "audifonos", name: "Audífonos", icon: "🎧", description: "Audífonos inalámbricos y con cable" },
  { id: "accesorios", name: "Accesorios", icon: "🔌", description: "Cables, cargadores y más" },
  { id: "electronica", name: "Electrónica", icon: "📱", description: "Dispositivos electrónicos variados" },
]

// Para compatibilidad con código existente
export const categories = defaultCategories

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Bocina Bluetooth Premium",
    description: "Bocina portátil con sonido potente y graves profundos. Perfecta para fiestas y reuniones.",
    price: 4500,
    images: ["/bluetooth-speaker-black-premium.jpg"],
    category: "bocinas",
    specs: ["Bluetooth 5.0", "Batería 12 horas", "Resistente al agua IPX5", "Potencia 40W"],
    useCases: ["Fiestas en casa", "Picnics y playa", "Reuniones familiares"],
    inStock: true,
  },
  {
    id: "prod-2",
    name: "Audífonos Inalámbricos Pro",
    description: "Audífonos con cancelación de ruido activa y sonido Hi-Fi. Comodidad premium.",
    price: 3200,
    images: ["/wireless-headphones-black-premium.jpg"],
    category: "audifonos",
    specs: ["Cancelación de ruido", "Bluetooth 5.2", "Batería 30 horas", "Micrófono HD"],
    useCases: ["Trabajo remoto", "Viajes", "Gaming"],
    inStock: true,
  },
  {
    id: "prod-3",
    name: "Cargador Rápido USB-C",
    description: "Cargador de 65W con tecnología de carga rápida para todos tus dispositivos.",
    price: 1500,
    images: ["/usb-c-fast-charger-white.jpg"],
    category: "accesorios",
    specs: ["65W de potencia", "USB-C PD 3.0", "Protección de sobrecarga", "Compacto"],
    useCases: ["Laptops", "Teléfonos", "Tablets"],
    inStock: true,
  },
  {
    id: "prod-4",
    name: "Smartwatch Deportivo",
    description: "Reloj inteligente con GPS, monitor cardíaco y múltiples modos deportivos.",
    price: 5800,
    images: ["/smart-watch-black-sport.jpg"],
    category: "electronica",
    specs: ["GPS integrado", "Monitor cardíaco", "Resistente al agua 5ATM", "Batería 14 días"],
    useCases: ["Deportes", "Seguimiento de salud", "Notificaciones"],
    inStock: true,
  },
]

export function getProducts(): Product[] {
  if (typeof window === "undefined") return initialProducts
  const saved = localStorage.getItem("habana-sound-products")
  if (saved) {
    const products = JSON.parse(saved)
    return products.map((p: any) => ({
      ...p,
      images: p.images || (p.image ? [p.image] : ["/diverse-products-still-life.png"]),
    }))
  }
  return initialProducts
}

export function saveProducts(products: Product[]) {
  localStorage.setItem("habana-sound-products", JSON.stringify(products))
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return getProducts().filter((p) => p.category === categoryId)
}
