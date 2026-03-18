"use client"

import type React from "react"
import { useState } from "react"
import { User, Phone, MapPin, MessageSquare, ShoppingBag, CheckCircle, Send } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"

interface CheckoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const { items, totalPrice, clearCart } = useCart()
  const { user, addOrder } = useAuth()
  const [orderSent, setOrderSent] = useState(false)
  const [orderMethod, setOrderMethod] = useState<"app" | "whatsapp" | null>(null)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Si el usuario está logueado, enviar pedido a la base de datos
    if (user) {
      await addOrder({
        user_id: user.id,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        customer_notes: formData.notes,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: totalPrice,
        shipping_cost: 0,
        total: totalPrice,
        status: "pending",
        is_guest: false,
      })
      setOrderMethod("app")
    } else {
      // Si no está logueado, enviar por WhatsApp
      sendToWhatsApp()
      setOrderMethod("whatsapp")
    }

    clearCart()
    setIsSubmitting(false)
    setOrderSent(true)
  }

  const sendToWhatsApp = () => {
    const itemsList = items
      .map((item) => `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}`)
      .join("\n")

    const message = `🛒 *NUEVO PEDIDO - Habana Sound*

📦 *Productos:*
${itemsList}

💰 *Subtotal:* $${totalPrice.toLocaleString()} CUP

👤 *Cliente:* ${formData.name}
📱 *Teléfono:* ${formData.phone}
📍 *Dirección:* ${formData.address}
${formData.notes ? `📝 *Notas:* ${formData.notes}` : ""}

_Esperando confirmación de precio con envío_`

    const whatsappUrl = `https://wa.me/5363180910?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleClose = () => {
    setOrderSent(false)
    setOrderMethod(null)
    setFormData({ name: user?.name || "", phone: user?.phone || "", address: "", notes: "" })
    onOpenChange(false)
  }

  if (orderSent) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md text-center">
          <div className="py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {orderMethod === "app" ? "¡Pedido Enviado!" : "¡Mensaje Enviado!"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {orderMethod === "app"
                ? "Tu pedido ha sido recibido. Pronto nos pondremos en contacto contigo por WhatsApp para confirmar los detalles y el costo de envío."
                : "Tu pedido ha sido enviado por WhatsApp. Espera nuestra respuesta para confirmar los detalles."}
            </p>
            <Button onClick={handleClose} size="lg" className="w-full">
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Finalizar Pedido
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Resumen del Pedido</h3>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-foreground">
                  {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                </span>
                <span className="font-medium">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Subtotal</span>
              <span className="text-primary">${totalPrice.toLocaleString()} CUP</span>
            </div>
            <p className="text-xs text-muted-foreground">
              El costo de mensajería se te informará después de recibir tu pedido.
            </p>
          </div>

          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Send className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Pedido por WhatsApp</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Como no tienes cuenta, tu pedido se enviará directamente por WhatsApp. ¡Crea una cuenta para mejor
                    seguimiento!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Tus Datos</h3>

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Nombre Completo
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Tu nombre"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Teléfono
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+53 5XXXXXXX"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Dirección de Entrega
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Calle, número, municipio, provincia..."
                required
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Notas adicionales <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Horario preferido, referencias, etc."
                rows={2}
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full gap-2 h-12 text-base" disabled={isSubmitting}>
            {user ? (
              <>
                <ShoppingBag className="w-5 h-5" />
                Enviar Pedido
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar por WhatsApp
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            {user
              ? "Recibirás confirmación por WhatsApp con el precio final incluyendo envío"
              : "Se abrirá WhatsApp para enviar tu pedido directamente"}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
