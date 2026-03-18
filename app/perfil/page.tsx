"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, User, Calendar, Package, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/auth-context"

export default function PerfilPage() {
  const router = useRouter()
  const { user, orders, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-primary/20 text-primary"
      case "entregado":
        return "bg-green-500/20 text-green-500"
      default:
        return "bg-yellow-500/20 text-yellow-500"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Link>
            </Button>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* User Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-card border-border mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl">{user.username}</h2>
                      {user.email && <p className="text-sm text-muted-foreground font-normal">{user.email}</p>}
                    </div>
                    {user.isAdmin && <Badge className="ml-auto">Administrador</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Miembro desde {formatDate(user.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order History */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-primary" />
                Historial de Compras
              </h2>

              {orders.length === 0 ? (
                <Card className="bg-card border-border">
                  <CardContent className="py-12 text-center">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground text-lg">No tienes compras todavía</p>
                    <Button asChild className="mt-4">
                      <Link href="/productos">Explorar Productos</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="bg-card border-border">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Pedido #{order.id.slice(-8)}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="space-y-2 mb-4">
                            {order.items.map((item, j) => (
                              <div key={j} className="flex justify-between text-sm">
                                <span className="text-foreground">
                                  {item.name} x{item.quantity}
                                </span>
                                <span className="text-muted-foreground">
                                  ${(item.price * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-border pt-4 flex justify-between font-bold">
                            <span className="text-foreground">Total</span>
                            <span className="text-primary">${order.total.toLocaleString()} CUP</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
