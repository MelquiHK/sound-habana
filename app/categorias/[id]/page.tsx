"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { categories, getProductsByCategory } from "@/lib/products"

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const category = categories.find((c) => c.id === id)

  if (!category) {
    notFound()
  }

  const products = getProductsByCategory(id)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/categorias">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Categorías
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-4"
          >
            <span className="text-5xl">{category.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-foreground">{category.name}</h1>
              <p className="text-muted-foreground mt-1">{category.description}</p>
            </div>
          </motion.div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No hay productos en esta categoría</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
