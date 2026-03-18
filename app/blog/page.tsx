"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Sparkles, Wrench, MessageCircle, Calendar, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getBlogPosts } from "@/lib/blog"

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<"todas" | "novedades" | "soluciones">("todas")

  const allPosts = getBlogPosts()

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "todas" || post.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [allPosts, searchQuery, selectedCategory])

  const noResults = searchQuery && filteredPosts.length === 0

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nuestro <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Novedades, consejos y soluciones para sacar el maximo provecho a tus dispositivos
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-12 space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar articulos, soluciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full text-base"
              />
            </div>

            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12 rounded-full">
                <TabsTrigger value="todas" className="rounded-full gap-2">
                  Todas
                </TabsTrigger>
                <TabsTrigger value="novedades" className="rounded-full gap-2">
                  <Sparkles className="w-4 h-4" />
                  Novedades
                </TabsTrigger>
                <TabsTrigger value="soluciones" className="rounded-full gap-2">
                  <Wrench className="w-4 h-4" />
                  Soluciones
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <Card className="group overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:border-primary/30 h-full">
                      {post.images?.[0] && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.images[0] || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant={post.category === "novedades" ? "default" : "secondary"}
                            className="rounded-full"
                          >
                            {post.category === "novedades" ? (
                              <Sparkles className="w-3 h-3 mr-1" />
                            ) : (
                              <Wrench className="w-3 h-3 mr-1" />
                            )}
                            {post.category === "novedades" ? "Novedad" : "Solucion"}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.createdAt).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                          Leer mas <ArrowRight className="w-4 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : allPosts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Proximamente</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Estamos preparando contenido increible para ti. Vuelve pronto para ver novedades y soluciones.
              </p>
            </motion.div>
          ) : noResults ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No encontramos resultados</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                No encontramos articulos que coincidan con "{searchQuery}". Pero puedes contactarnos directamente!
              </p>
              <Button asChild className="gap-2 rounded-full">
                <a href="https://wa.me/5363180910" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4" />
                  Contactar por WhatsApp
                </a>
              </Button>
            </motion.div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  )
}
