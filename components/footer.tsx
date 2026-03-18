"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Phone, MapPin, Clock, MessageCircle, Instagram, Facebook, Mail, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedLogo } from "@/components/animated-logo"

const WHATSAPP_NUMBER = "5363180910"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      {/* Decorative gradient */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <AnimatedLogo size="small" />
              <div>
                <span className="font-bold text-2xl text-foreground">
                  Habana <span className="text-primary">Sound</span>
                </span>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Premium Audio</p>
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-sm">
              Tu tienda de electrónica y audio de confianza en La Habana. Productos de calidad probados y garantizados
              antes de cada entrega.
            </p>
            <Button asChild className="gap-2 rounded-full shadow-lg shadow-primary/25">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                Contáctanos por WhatsApp
              </a>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-foreground mb-6 text-lg">Navegación</h4>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/productos", label: "Productos" },
                { href: "/categorias", label: "Categorías" },
                { href: "/informacion", label: "Información" },
                { href: "/contacto", label: "Contacto" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  {link.label}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4">
            <h4 className="font-bold text-foreground mb-6 text-lg">Contacto</h4>
            <div className="space-y-4">
              {[
                { icon: Phone, text: "+53 63180910", href: "tel:+5363180910" },
                { icon: MapPin, text: "D entre 21 y 23, La Habana" },
                { icon: Clock, text: "Disponible 24 horas" },
                { icon: Mail, text: "habanasound@email.com" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  {item.href ? (
                    <a href={item.href} className="hover:text-primary transition-colors">
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: MessageCircle, href: `https://wa.me/${WHATSAPP_NUMBER}` },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Habana Sound. Todos los derechos reservados.
          </p>
          <p className="text-muted-foreground text-sm">
            Hecho con <span className="text-primary">♥</span> en La Habana
          </p>
        </div>
      </div>
    </footer>
  )
}
