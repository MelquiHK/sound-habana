"use client"

import { motion } from "framer-motion"
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const WHATSAPP_NUMBER = "5363180910"

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground">Contáctanos</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Escríbenos y te responderemos lo antes posible.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* WhatsApp CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl p-8 md:p-12 text-center border border-primary/30 mb-12"
            >
              <MessageCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Escríbenos por WhatsApp</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                La forma más rápida de contactarnos. Respondemos consultas, tomamos pedidos y coordinamos entregas.
              </p>
              <Button size="lg" asChild className="gap-2 text-lg">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  Abrir WhatsApp
                </a>
              </Button>
            </motion.div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="h-full bg-card border-border text-center">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-2">Teléfono</h3>
                    <p className="text-muted-foreground">+53 63180910</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="h-full bg-card border-border text-center">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-2">Ubicación</h3>
                    <p className="text-muted-foreground">D entre 21 y 23, La Habana</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="h-full bg-card border-border text-center">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-2">Horario</h3>
                    <p className="text-muted-foreground">Disponible 24 horas</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
