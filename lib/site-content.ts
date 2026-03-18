export interface SiteContent {
  info: {
    garantia: { titulo: string; contenido: string }
    politica: { titulo: string; contenido: string }
    mensajeria: { titulo: string; contenido: string }
    horario: { titulo: string; contenido: string }
  }
  contacto: {
    telefono: string
    whatsapp: string
    direccion: string
    horario: string
  }
  hero: {
    estadisticas: Array<{ valor: string; etiqueta: string }>
  }
}

export const defaultSiteContent: SiteContent = {
  info: {
    garantia: {
      titulo: "Garantía de Prueba",
      contenido:
        "Todos nuestros productos se prueban obligatoriamente frente al cliente antes de la entrega. Esto garantiza que recibas un producto 100% funcional y en perfectas condiciones.",
    },
    politica: {
      titulo: "Política de Ventas",
      contenido:
        "Como todos los productos son probados y verificados al momento de la compra, no aceptamos devoluciones. Esta política existe precisamente porque garantizamos la calidad al momento de la entrega.",
    },
    mensajeria: {
      titulo: "Servicio de Mensajería",
      contenido:
        "Ofrecemos servicio de mensajería para mayor comodidad. El costo de la mensajería varía según tu ubicación. Contáctanos por WhatsApp para conocer el precio exacto.",
    },
    horario: {
      titulo: "Horario de Atención",
      contenido:
        "Estamos disponibles las 24 horas del día, los 7 días de la semana. Puedes escribirnos por WhatsApp a cualquier hora.",
    },
  },
  contacto: {
    telefono: "+53 63180910",
    whatsapp: "5363180910",
    direccion: "D entre 21 y 23, La Habana",
    horario: "24 horas, 7 días a la semana",
  },
  hero: {
    estadisticas: [
      { valor: "500+", etiqueta: "Clientes Felices" },
      { valor: "100%", etiqueta: "Productos Probados" },
      { valor: "24/7", etiqueta: "Soporte" },
    ],
  },
}

export function getSiteContent(): SiteContent {
  if (typeof window === "undefined") return defaultSiteContent
  const saved = localStorage.getItem("habana-sound-site-content")
  return saved ? JSON.parse(saved) : defaultSiteContent
}

export function saveSiteContent(content: SiteContent) {
  localStorage.setItem("habana-sound-site-content", JSON.stringify(content))
}
