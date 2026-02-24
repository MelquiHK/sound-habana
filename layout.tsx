import type React from "react"
import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/context/auth-context"

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Habana Sound - Electrónica Premium",
  description:
    "Tu tienda de electrónica y audio de confianza en La Habana. Productos de calidad probados y garantizados.",
  generator: "Habana Sound",
  keywords: ["electrónica", "audio", "bocinas", "audífonos", "La Habana", "Cuba"],
}

export const viewport: Viewport = {
  themeColor: "#ff6b35",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
