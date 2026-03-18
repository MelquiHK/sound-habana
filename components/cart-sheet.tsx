"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { CheckoutModal } from "./checkout-modal"

export function CartSheet({ children }: { children: ReactNode }) {
  const { items, updateQuantity, removeItem, totalPrice } = useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleCheckout = () => {
    setSheetOpen(false)
    setTimeout(() => setCheckoutOpen(true), 200)
  }

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader>
            <SheetTitle className="text-xl flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Carrito de Compras
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 opacity-50" />
              </div>
              <p className="text-lg font-medium">Tu carrito está vacío</p>
              <p className="text-sm">Agrega productos para comenzar</p>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 py-4 border-b border-border"
                    >
                      <div className="w-20 h-20 rounded-xl bg-secondary overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                        <p className="text-primary font-bold">${item.price.toLocaleString()} CUP</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-destructive ml-auto hover:bg-destructive/10"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>

              <div className="pt-4 space-y-4">
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">${totalPrice.toLocaleString()} CUP</span>
                </div>
                <Button className="w-full gap-2 h-12" size="lg" onClick={handleCheckout}>
                  Continuar con el Pedido
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  )
}
