"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Headphones, Shield, Star, TrendingUp, Award, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedLogo } from "@/components/animated-logo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { getProducts, getCategories } from "@/lib/products"

export default function HomePage() {
  const featuredProducts = getProducts().slice(0, 4)
  const categories = getCategories()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 mesh-gradient" />

        <motion.div
          className="absolute top-32 right-[15%] w-72 h-72 rounded-full opacity-60"
          style={{ background: "linear-gradient(135deg, oklch(0.65 0.2 25 / 0.3), oklch(0.6 0.18 250 / 0.2))" }}
          animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 left-[10%] w-48 h-48 rounded-3xl opacity-50"
          style={{ background: "linear-gradient(135deg, oklch(0.6 0.18 250 / 0.3), oklch(0.7 0.15 150 / 0.2))" }}
          animate={{ y: [20, -20, 20], rotate: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute top-1/4 right-[8%] hidden lg:block"
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 rotate-12">
            <img src="/wireless-headphones-coral-orange.jpg" alt="" className="w-full h-full object-cover" />
          </div>
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-[5%] hidden lg:block"
          animate={{ y: [15, -15, 15] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl shadow-accent/20 -rotate-12">
            <img src="/bluetooth-speaker-blue-modern.jpg" alt="" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <AnimatedLogo size="large" />

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                <Star className="w-4 h-4 fill-primary" />
                Electronica Premium en La Habana
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-balance leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className="text-foreground">Habana</span> <span className="gradient-text">Sound</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground mt-6 max-w-xl text-pretty leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Descubre la mejor seleccion de audio y electronica.
              <span className="text-foreground font-medium"> Calidad garantizada</span>, productos probados antes de
              cada entrega.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Button
                size="lg"
                asChild
                className="gap-2 text-lg px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                <Link href="/productos">
                  Explorar Productos
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="gap-2 text-lg px-8 rounded-full border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all bg-transparent"
              >
                <a href="https://wa.me/5363180910" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>
            </motion.div>

            {/* Stats - sin el cursor */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {[
                { value: "500+", label: "Clientes Felices" },
                { value: "100%", label: "Productos Probados" },
                { value: "24/7", label: "Soporte" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: Award,
                title: "Audio Premium",
                desc: "Sonido de alta fidelidad",
                color: "from-primary to-primary/70",
              },
              { icon: Shield, title: "Garantia Total", desc: "Productos probados", color: "from-accent to-accent/70" },
              {
                icon: Truck,
                title: "Entrega Rapida",
                desc: "Mensajeria disponible",
                color: "from-chart-3 to-chart-3/70",
              },
              {
                icon: Headphones,
                title: "Soporte 24/7",
                desc: "Siempre disponibles",
                color: "from-chart-5 to-chart-5/70",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
              <TrendingUp className="w-4 h-4" />
              Explora por Categoria
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Nuestras <span className="gradient-text">Categorias</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md mx-auto">
              Encuentra exactamente lo que buscas en nuestra amplia seleccion
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/categorias/${category.id}`}
                  className="group block relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="aspect-square p-6 flex flex-col items-center justify-center text-center">
                    <span className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
                      {category.icon}
                    </span>
                    <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12"
          >
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                <Star className="w-4 h-4 fill-primary" />
                Lo Mas Vendido
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Productos <span className="gradient-text">Destacados</span>
              </h2>
            </div>
            <Button
              variant="outline"
              asChild
              className="rounded-full border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all bg-transparent"
            >
              <Link href="/productos" className="gap-2">
                Ver Catalogo Completo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.65 0.2 25), oklch(0.55 0.18 35))",
            }}
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10 p-8 md:p-16 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-balance">
                Tienes dudas sobre algun producto?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Escribenos por WhatsApp y te asesoramos sin compromiso. Estamos disponibles las 24 horas para ayudarte.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="gap-2 bg-white text-primary hover:bg-white/90 rounded-full shadow-xl"
                >
                  <a href="https://wa.me/5363180910" target="_blank" rel="noopener noreferrer">
                    Contactar por WhatsApp
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="gap-2 border-2 border-white text-white hover:bg-white/10 rounded-full bg-transparent"
                >
                  <Link href="/contacto">Mas Informacion</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
