"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Sparkles, Wrench, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getBlogPostById } from "@/lib/blog"

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const post = getBlogPostById(id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!post) {
    notFound()
  }

  const images = post.images || []

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Blog
              </Link>
            </Button>
          </motion.div>

          <article className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant={post.category === "novedades" ? "default" : "secondary"} className="rounded-full">
                    {post.category === "novedades" ? (
                      <Sparkles className="w-3 h-3 mr-1" />
                    ) : (
                      <Wrench className="w-3 h-3 mr-1" />
                    )}
                    {post.category === "novedades" ? "Novedad" : "Solucion"}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">{post.title}</h1>
              </div>

              {/* Images */}
              {images.length > 0 && (
                <div className="mb-8 space-y-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-secondary">
                    <img
                      src={images[currentImageIndex] || "/placeholder.svg"}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 justify-center">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            idx === currentImageIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div
                  className="text-foreground leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }}
                />
              </div>

              {/* CTA */}
              <div className="mt-12 p-6 bg-secondary/50 rounded-2xl text-center">
                <h3 className="font-semibold text-foreground mb-2">Tienes preguntas?</h3>
                <p className="text-muted-foreground mb-4">Contactanos por WhatsApp y te ayudamos con cualquier duda</p>
                <Button asChild className="gap-2 rounded-full">
                  <a href="https://wa.me/5363180910" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" />
                    Contactar por WhatsApp
                  </a>
                </Button>
              </div>
            </motion.div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  )
}
