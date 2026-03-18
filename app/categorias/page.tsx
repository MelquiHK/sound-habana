"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"
import { getProducts, getProductsFromSupabase, getCategories, getCategoriesFromSupabase, type Category, type Product } from "@/lib/products"

export default function CategoriasPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const loadData = async () => {
      const supaProducts = await getProductsFromSupabase()
      const supaCategories = await getCategoriesFromSupabase()

      if (supaProducts.length > 0) {
        setProducts(supaProducts)
      } else {
        setProducts(getProducts())
      }

      if (supaCategories.length > 0) {
        setCategories(supaCategories)
      } else {
        setCategories(getCategories())
      }
    }

    loadData()
  }, [])

  const getCategoryCount = (categoryId: string) => {
    return products.filter((p) => p.category === categoryId).length
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl font-bold text-foreground">Categorías</h1>
            <p className="text-muted-foreground mt-2">Explora nuestros productos por categoría</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/categorias/${category.id}`}
                  className="group block p-8 bg-card hover:bg-secondary rounded-2xl border border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-6xl">{category.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-muted-foreground mt-1">{category.description}</p>
                      <p className="text-primary font-medium mt-2">{getCategoryCount(category.id)} productos</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
