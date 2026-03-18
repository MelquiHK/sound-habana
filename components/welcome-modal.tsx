"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserPlus, ShoppingBag, History, Bell, Heart, Truck, X, ArrowRight } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { AnimatedLogo } from "@/components/animated-logo"
import Link from "next/link"

const benefits = [
  { icon: History, title: "Historial de Compras", description: "Accede a todos tus pedidos anteriores" },
  { icon: Bell, title: "Notificaciones", description: "Recibe alertas de ofertas y novedades" },
  { icon: Heart, title: "Lista de Favoritos", description: "Guarda productos para comprar después" },
  { icon: Truck, title: "Seguimiento", description: "Rastrea el estado de tus pedidos" },
]

export function WelcomeModal() {
  const { isFirstVisit, setFirstVisitDone } = useAuth()
  const [open, setOpen] = useState(isFirstVisit)

  const handleClose = () => {
    setFirstVisitDone()
    setOpen(false)
  }

  if (!isFirstVisit) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-0">
        <div className="bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-4 mb-4">
            <AnimatedLogo size="small" />
            <div>
              <h2 className="text-2xl font-bold">¡Bienvenido a Habana Sound!</h2>
              <p className="text-primary-foreground/80">Tu tienda de electrónica de confianza</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Crea una cuenta y disfruta de:</h3>
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 p-3 rounded-xl bg-secondary/50"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{benefit.title}</p>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800">
              <strong>Importante:</strong> Recuerda tu correo electrónico y contraseña para poder acceder a tu cuenta en
              cualquier dispositivo.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full gap-2" onClick={handleClose}>
              <Link href="/auth/register">
                <UserPlus className="w-5 h-5" />
                Crear mi Cuenta
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full gap-2 bg-transparent" onClick={handleClose}>
              <ShoppingBag className="w-5 h-5" />
              Continuar sin Cuenta
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Si continúas sin cuenta, tus pedidos se enviarán directamente por WhatsApp
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
