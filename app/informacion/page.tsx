"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Truck, Clock, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSiteContent, type SiteContent } from "@/lib/site-content"

const iconMap = {
  garantia: Shield,
  politica: XCircle,
  mensajeria: Truck,
  horario: Clock,
}

export default function InformacionPage() {
  const [content, setContent] = useState<SiteContent | null>(null)

  useEffect(() => {
    setContent(getSiteContent())
  }, [])

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const infoItems = [
    { key: "garantia" as const, icon: Shield, color: "bg-primary/10 text-primary" },
    { key: "politica" as const, icon: XCircle, color: "bg-secondary text-muted-foreground" },
    { key: "mensajeria" as const, icon: Truck, color: "bg-primary/10 text-primary" },
    { key: "horario" as const, icon: Clock, color: "bg-primary/10 text-primary" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground">Informacion Importante</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Todo lo que necesitas saber sobre nuestros productos y servicios
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {infoItems.map((item, i) => {
              const Icon = item.icon
              const info = content.info[item.key]
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full bg-card border-border hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-foreground">
                        <div className={`p-2 rounded-lg ${item.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        {info.titulo}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground space-y-3">
                      <p className="whitespace-pre-wrap">{info.contenido}</p>
                      <div className="flex items-center gap-2 text-primary">
                        <CheckCircle className="w-5 h-5" />
                        <span>
                          {item.key === "garantia" && "Prueba completa antes de pagar"}
                          {item.key === "politica" && "Verificas antes de pagar = Sin sorpresas"}
                          {item.key === "mensajeria" && "Entrega a domicilio disponible"}
                          {item.key === "horario" && content.contacto.telefono}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
