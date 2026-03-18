"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ShoppingCart, Check, MessageCircle, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/context/cart-context"
import { getProductById } from "@/lib/products"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = getProductById(id)
  const { addItem } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!product) {
    notFound()
  }

  const images = product.images || ["/placeholder.svg?key=product-detail"]

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
        category: product.category,
      },
      quantity,
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/productos">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Productos
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {/* Imagen principal */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Controles de navegación */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            idx === currentImageIndex ? "bg-primary w-6" : "bg-white/70"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Miniaturas */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col"
            >
              <Badge variant="outline" className="w-fit mb-4">
                {product.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{product.name}</h1>
              <p className="text-primary text-3xl font-bold mt-4">${product.price.toLocaleString()} CUP</p>

              <p className="text-muted-foreground mt-6 text-lg leading-relaxed">{product.description}</p>

              <Separator className="my-6" />

              {/* Specs */}
              {product.specs && product.specs.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Especificaciones:</h3>
                  <ul className="space-y-2">
                    {product.specs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 text-primary" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Use Cases */}
              {product.useCases && product.useCases.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-foreground mb-3">Ideal para:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.useCases.map((useCase, i) => (
                      <Badge key={i} variant="secondary">
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Cantidad:</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-full">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-l-full transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-r-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-muted-foreground">
                    Total:{" "}
                    <span className="text-primary font-bold">${(product.price * quantity).toLocaleString()} CUP</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart} disabled={!product.inStock}>
                  <ShoppingCart className="w-5 h-5" />
                  {product.inStock ? `Agregar ${quantity > 1 ? `(${quantity})` : ""} al Carrito` : "Agotado"}
                </Button>
                <Button size="lg" variant="outline" asChild className="gap-2 bg-transparent">
                  <a href="https://wa.me/5363180910" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5" />
                    Preguntar
                  </a>
                </Button>
              </div>

              {product.inStock && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Todos los productos se prueban antes de la entrega
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
