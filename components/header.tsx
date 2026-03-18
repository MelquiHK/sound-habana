"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Menu, LogOut, History, Settings, Home, Newspaper, UserPlus, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AnimatedLogo } from "@/components/animated-logo"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { CartSheet } from "@/components/cart-sheet"

const navLinks = [
  { href: "/", label: "Bienvenida", icon: Home },
  { href: "/productos", label: "Productos" },
  { href: "/categorias", label: "Categorías" },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/informacion", label: "Información" },
  { href: "/contacto", label: "Contacto" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { totalItems } = useCart()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-card/90 backdrop-blur-xl shadow-lg shadow-primary/5 border-b border-border" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 h-18 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <AnimatedLogo size="small" />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-foreground leading-tight">
              Habana <span className="text-primary">Sound</span>
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Premium Audio</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 bg-secondary/50 rounded-full px-2 py-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground hover:bg-card px-4 py-2 rounded-full transition-all font-medium text-sm"
            >
              {link.label}
            </Link>
          ))}
          {user?.isAdmin && (
            <Link
              href="/admin"
              className="text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-full transition-all font-medium text-sm flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 rounded-full">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium">{user.name.split(" ")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Mi Historial
                  </Link>
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Panel Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="rounded-full gap-1.5">
                <Link href="/auth/login">
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </Link>
              </Button>
              <Button size="sm" asChild className="rounded-full gap-1.5">
                <Link href="/auth/register">
                  <UserPlus className="w-4 h-4" />
                  Registrarse
                </Link>
              </Button>
            </div>
          )}

          <CartSheet>
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full border-2 hover:border-primary hover:bg-primary/5 bg-transparent"
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </CartSheet>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-l-0 bg-gradient-to-b from-card to-background">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <AnimatedLogo size="small" />
                  <span>Habana Sound</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-foreground hover:text-primary hover:bg-primary/5 transition-all font-medium text-lg py-3 px-4 rounded-xl flex items-center gap-2"
                  >
                    {link.icon && <link.icon className="w-5 h-5" />}
                    {link.label}
                  </Link>
                ))}

                {!user && (
                  <>
                    <div className="border-t border-border my-2" />
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-foreground hover:text-primary hover:bg-primary/5 transition-all font-medium text-lg py-3 px-4 rounded-xl flex items-center gap-2"
                    >
                      <LogIn className="w-5 h-5" />
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-primary-foreground bg-primary hover:bg-primary/90 transition-all font-medium text-lg py-3 px-4 rounded-xl flex items-center gap-2"
                    >
                      <UserPlus className="w-5 h-5" />
                      Registrarse
                    </Link>
                  </>
                )}

                {user?.isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-primary-foreground bg-primary hover:bg-primary/90 transition-all font-medium text-lg py-3 px-4 rounded-xl flex items-center gap-2 mt-2"
                  >
                    <Settings className="w-5 h-5" />
                    Panel Admin
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
