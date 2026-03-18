"use client"

import type React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/diverse-products-still-life.png",
      category: product.category,
    })
  }

  const mainImage = product.images?.[0] || "/diverse-products-still-life.png"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/productos/${product.id}`} className="block">
        <div className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
          <div className="relative aspect-square overflow-hidden bg-secondary/30">
            <img
              src={mainImage || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 rounded-full bg-white/90 text-foreground hover:bg-white shadow-lg"
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  Ver
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 rounded-full shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-1.5" />
                  Agregar
                </Button>
              </div>
            </div>

            {!product.inStock && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <Badge variant="destructive" className="text-sm px-4 py-2">
                  Agotado
                </Badge>
              </div>
            )}

            <Badge
              variant="secondary"
              className="absolute top-3 left-3 bg-white/90 text-foreground backdrop-blur-sm border-0 shadow-md text-xs font-medium"
            >
              {product.category}
            </Badge>
          </div>

          <div className="p-5">
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 text-lg">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mt-1.5 leading-relaxed">{product.description}</p>
            <div className="flex items-center justify-between mt-4">
              <p className="text-xl font-bold gradient-text">
                ${product.price.toLocaleString()}
                <span className="text-muted-foreground text-sm font-normal ml-1">CUP</span>
              </p>
              {product.inStock && (
                <span className="flex items-center gap-1.5 text-xs text-chart-3 font-medium">
                  <span className="w-2 h-2 rounded-full bg-chart-3 animate-pulse" />
                  Disponible
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
