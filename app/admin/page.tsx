"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Package,
  Settings,
  ShoppingBag,
  Phone,
  MapPin,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MessageCircle,
  Users,
  FolderOpen,
  FileText,
  Newspaper,
  DollarSign,
  Sparkles,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { ImageUpload } from "@/components/image-upload"
import { useAuth, type Order } from "@/context/auth-context"
import { getProducts, saveProducts, getCategories, saveCategories, type Product, type Category } from "@/lib/products"
import { getBlogPosts, saveBlogPosts, type BlogPost } from "@/lib/blog"
import { getSiteContent, saveSiteContent, type SiteContent } from "@/lib/site-content"

const statusConfig = {
  pendiente: { label: "Pendiente", color: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30", icon: Clock },
  confirmado: { label: "Confirmado", color: "bg-blue-500/20 text-blue-600 border-blue-500/30", icon: CheckCircle },
  entregado: { label: "Entregado", color: "bg-green-500/20 text-green-600 border-green-500/30", icon: Truck },
  cancelado: { label: "Cancelado", color: "bg-red-500/20 text-red-600 border-red-500/30", icon: XCircle },
}

export default function AdminPage() {
  const router = useRouter()
  const { user, isLoading, allOrders, updateOrderStatus, updateOrderShipping, users, deleteUser } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null)

  // Dialogs
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null)
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false)
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false)
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null)
  const [shippingCost, setShippingCost] = useState("")

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    setProducts(getProducts())
    setCategories(getCategories())
    setBlogPosts(getBlogPosts())
    setSiteContent(getSiteContent())
  }, [])

  // Productos
  const handleSaveProduct = (product: Product) => {
    let updatedProducts: Product[]
    if (products.find((p) => p.id === product.id)) {
      updatedProducts = products.map((p) => (p.id === product.id ? product : p))
    } else {
      updatedProducts = [...products, product]
    }
    setProducts(updatedProducts)
    saveProducts(updatedProducts)
    setEditingProduct(null)
    setIsProductDialogOpen(false)
  }

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter((p) => p.id !== id)
    setProducts(updatedProducts)
    saveProducts(updatedProducts)
  }

  // Categorias
  const handleSaveCategory = (category: Category) => {
    let updatedCategories: Category[]
    if (categories.find((c) => c.id === category.id)) {
      updatedCategories = categories.map((c) => (c.id === category.id ? category : c))
    } else {
      updatedCategories = [...categories, category]
    }
    setCategories(updatedCategories)
    saveCategories(updatedCategories)
    setEditingCategory(null)
    setIsCategoryDialogOpen(false)
  }

  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories.filter((c) => c.id !== id)
    setCategories(updatedCategories)
    saveCategories(updatedCategories)
  }

  // Blog
  const handleSaveBlogPost = (post: BlogPost) => {
    let updatedPosts: BlogPost[]
    if (blogPosts.find((p) => p.id === post.id)) {
      updatedPosts = blogPosts.map((p) => (p.id === post.id ? { ...post, updatedAt: new Date().toISOString() } : p))
    } else {
      updatedPosts = [...blogPosts, post]
    }
    setBlogPosts(updatedPosts)
    saveBlogPosts(updatedPosts)
    setEditingBlogPost(null)
    setIsBlogDialogOpen(false)
  }

  const handleDeleteBlogPost = (id: string) => {
    const updatedPosts = blogPosts.filter((p) => p.id !== id)
    setBlogPosts(updatedPosts)
    saveBlogPosts(updatedPosts)
  }

  // Site Content
  const handleSaveSiteContent = (content: SiteContent) => {
    setSiteContent(content)
    saveSiteContent(content)
    setIsContentDialogOpen(false)
  }

  // Pedidos
  const handleContactCustomer = (order: Order) => {
    const shippingText = order.shippingCost
      ? `\n\n📦 *Costo de envio:* $${order.shippingCost.toLocaleString()} CUP\n💰 *Total final:* $${(order.total + order.shippingCost).toLocaleString()} CUP`
      : ""
    const itemsList = order.items
      .map((item) => `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}`)
      .join("\n")

    const message = `Hola ${order.customer.name}! Soy de *Habana Sound* 🎧\n\nTe contacto sobre tu pedido #${order.id.slice(-6).toUpperCase()}.\n\n*Productos:*\n${itemsList}\n\n*Subtotal:* $${order.total.toLocaleString()} CUP${shippingText}`
    const phone = order.customer.phone.replace(/[^0-9]/g, "")
    const whatsappUrl = `https://wa.me/${phone.startsWith("53") ? phone : "53" + phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleSetShipping = () => {
    if (shippingOrderId && shippingCost) {
      updateOrderShipping(shippingOrderId, Number(shippingCost))
      setShippingOrderId(null)
      setShippingCost("")
    }
  }

  const pendingOrders = allOrders.filter((o) => o.status === "pendiente").length
  const totalRevenue = allOrders
    .filter((o) => o.status !== "cancelado")
    .reduce((sum, o) => sum + o.total + (o.shippingCost || 0), 0)

  if (isLoading || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Panel de Administrador</h1>
                <p className="text-muted-foreground">Bienvenido, {user.username}</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                  <p className="text-2xl font-bold text-foreground">{allOrders.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold text-foreground">{pendingOrders}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos</p>
                  <p className="text-xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Productos</p>
                  <p className="text-2xl font-bold text-foreground">{products.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="flex flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                Pedidos
                {pendingOrders > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                    {pendingOrders}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <Package className="w-4 h-4" />
                Productos
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-2">
                <FolderOpen className="w-4 h-4" />
                Categorias
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" />
                Usuarios
              </TabsTrigger>
              <TabsTrigger value="blog" className="gap-2">
                <Newspaper className="w-4 h-4" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="content" className="gap-2">
                <FileText className="w-4 h-4" />
                Contenido
              </TabsTrigger>
            </TabsList>

            {/* Tab Pedidos */}
            <TabsContent value="orders" className="space-y-4">
              {allOrders.length === 0 ? (
                <Card className="py-16">
                  <div className="text-center">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground text-lg">No hay pedidos todavia</p>
                  </div>
                </Card>
              ) : (
                <div className="grid gap-4">
                  <AnimatePresence>
                    {allOrders
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((order, i) => {
                        const StatusIcon = statusConfig[order.status].icon
                        return (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                              <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row">
                                  <div className="flex-1 p-5 space-y-4">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                      <div>
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                          <h3 className="font-bold text-lg">
                                            Pedido #{order.id.slice(-6).toUpperCase()}
                                          </h3>
                                          <Badge className={`${statusConfig[order.status].color} border`}>
                                            <StatusIcon className="w-3 h-3 mr-1" />
                                            {statusConfig[order.status].label}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(order.date).toLocaleDateString("es-ES", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-lg font-bold text-primary">
                                          ${order.total.toLocaleString()} CUP
                                        </p>
                                        {order.shippingCost && (
                                          <p className="text-sm text-muted-foreground">
                                            + ${order.shippingCost.toLocaleString()} envio
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                                      <div className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4 text-primary" />
                                        <span className="font-medium">{order.customer.name}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-primary" />
                                        <span>{order.customer.phone}</span>
                                      </div>
                                      <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-primary mt-0.5" />
                                        <span>{order.customer.address}</span>
                                      </div>
                                      {order.customer.notes && (
                                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                          <MessageCircle className="w-4 h-4 mt-0.5" />
                                          <span>{order.customer.notes}</span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="space-y-2">
                                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        Productos
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                        {order.items.map((item, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2"
                                          >
                                            {item.image && (
                                              <img
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                className="w-8 h-8 rounded object-cover"
                                              />
                                            )}
                                            <div className="text-sm">
                                              <span className="font-medium">{item.name}</span>
                                              <span className="text-muted-foreground"> x {item.quantity}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="lg:w-56 bg-secondary/30 p-5 flex flex-col gap-3 lg:border-l">
                                    <Label className="text-sm font-medium">Estado</Label>
                                    <Select
                                      value={order.status}
                                      onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pendiente">Pendiente</SelectItem>
                                        <SelectItem value="confirmado">Confirmado</SelectItem>
                                        <SelectItem value="entregado">Entregado</SelectItem>
                                        <SelectItem value="cancelado">Cancelado</SelectItem>
                                      </SelectContent>
                                    </Select>

                                    <Label className="text-sm font-medium mt-2">Costo Envio</Label>
                                    <div className="flex gap-2">
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={shippingOrderId === order.id ? shippingCost : order.shippingCost || ""}
                                        onChange={(e) => {
                                          setShippingOrderId(order.id)
                                          setShippingCost(e.target.value)
                                        }}
                                        className="flex-1"
                                      />
                                      {shippingOrderId === order.id && (
                                        <Button size="icon" onClick={handleSetShipping}>
                                          <Save className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>

                                    <Separator className="my-2" />

                                    <Button className="w-full gap-2" onClick={() => handleContactCustomer(order)}>
                                      <MessageCircle className="w-4 h-4" />
                                      WhatsApp
                                    </Button>

                                    <Button
                                      variant="outline"
                                      className="w-full gap-2 bg-transparent"
                                      onClick={() => {
                                        const phone = order.customer.phone.replace(/[^0-9]/g, "")
                                        window.open(`tel:${phone}`, "_self")
                                      }}
                                    >
                                      <Phone className="w-4 h-4" />
                                      Llamar
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      })}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            {/* Tab Productos */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setEditingProduct({
                      id: `prod-${Date.now()}`,
                      name: "",
                      description: "",
                      price: 0,
                      images: [],
                      category: categories[0]?.id || "electronica",
                      specs: [],
                      useCases: [],
                      inStock: true,
                    })
                    setIsProductDialogOpen(true)
                  }}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Producto
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="overflow-hidden group">
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={product.images?.[0] || "/placeholder.svg?key=admin-product"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Badge variant="destructive">Agotado</Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
                          <span className="text-primary font-bold">${product.price.toLocaleString()}</span>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{product.description}</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => {
                              setEditingProduct(product)
                              setIsProductDialogOpen(true)
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground text-lg">No hay productos todavia</p>
                </div>
              )}
            </TabsContent>

            {/* Tab Categorias */}
            <TabsContent value="categories" className="space-y-6">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setEditingCategory({
                      id: `cat-${Date.now()}`,
                      name: "",
                      icon: "📦",
                      description: "",
                    })
                    setIsCategoryDialogOpen(true)
                  }}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nueva Categoria
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <Card key={category.id} className="group">
                    <CardContent className="p-6 text-center">
                      <span className="text-5xl mb-4 block">{category.icon}</span>
                      <h3 className="font-bold text-foreground text-lg mb-1">{category.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => {
                            setEditingCategory(category)
                            setIsCategoryDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab Usuarios */}
            <TabsContent value="users" className="space-y-4">
              {users.length === 0 ? (
                <Card className="py-16">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground text-lg">No hay usuarios registrados</p>
                  </div>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {users.map((u) => (
                    <Card key={u.id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{u.username}</h3>
                            <p className="text-sm text-muted-foreground">
                              {u.email || "Sin email"} • {u.phone || "Sin telefono"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Registrado: {new Date(u.createdAt).toLocaleDateString("es-ES")}
                            </p>
                          </div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => deleteUser(u.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Tab Blog */}
            <TabsContent value="blog" className="space-y-6">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setEditingBlogPost({
                      id: `blog-${Date.now()}`,
                      title: "",
                      content: "",
                      excerpt: "",
                      images: [],
                      category: "novedades",
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    })
                    setIsBlogDialogOpen(true)
                  }}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Articulo
                </Button>
              </div>

              {blogPosts.length === 0 ? (
                <Card className="py-16">
                  <div className="text-center">
                    <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground text-lg">No hay articulos en el blog</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      {post.images?.[0] && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.images[0] || "/placeholder.svg"}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={post.category === "novedades" ? "default" : "secondary"}>
                            {post.category === "novedades" ? (
                              <Sparkles className="w-3 h-3 mr-1" />
                            ) : (
                              <Wrench className="w-3 h-3 mr-1" />
                            )}
                            {post.category === "novedades" ? "Novedad" : "Solucion"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground line-clamp-1 mb-2">{post.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => {
                              setEditingBlogPost(post)
                              setIsBlogDialogOpen(true)
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteBlogPost(post.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Tab Contenido */}
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contenido del Sitio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Edita el contenido de la pagina de Informacion y otros textos del sitio.
                  </p>
                  <Button onClick={() => setIsContentDialogOpen(true)} className="gap-2">
                    <Edit className="w-4 h-4" />
                    Editar Contenido
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct?.name ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              categories={categories}
              onSave={handleSaveProduct}
              onCancel={() => setIsProductDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory?.name ? "Editar Categoria" : "Nueva Categoria"}</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              category={editingCategory}
              onSave={handleSaveCategory}
              onCancel={() => setIsCategoryDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Blog Dialog */}
      <Dialog open={isBlogDialogOpen} onOpenChange={setIsBlogDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlogPost?.title ? "Editar Articulo" : "Nuevo Articulo"}</DialogTitle>
          </DialogHeader>
          {editingBlogPost && (
            <BlogForm post={editingBlogPost} onSave={handleSaveBlogPost} onCancel={() => setIsBlogDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Content Dialog */}
      <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Contenido del Sitio</DialogTitle>
          </DialogHeader>
          {siteContent && (
            <ContentForm
              content={siteContent}
              onSave={handleSaveSiteContent}
              onCancel={() => setIsContentDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Product Form
function ProductForm({
  product,
  categories,
  onSave,
  onCancel,
}: {
  product: Product
  categories: Category[]
  onSave: (product: Product) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(product)
  const [specsText, setSpecsText] = useState(product.specs.join("\n"))
  const [useCasesText, setUseCasesText] = useState(product.useCases.join("\n"))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      specs: specsText.split("\n").filter((s) => s.trim()),
      useCases: useCasesText.split("\n").filter((s) => s.trim()),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Imagenes del Producto</Label>
        <ImageUpload
          images={formData.images || []}
          onChange={(images) => setFormData({ ...formData, images })}
          maxImages={5}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Precio (CUP)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripcion</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specs">Especificaciones (una por linea)</Label>
        <Textarea
          id="specs"
          value={specsText}
          onChange={(e) => setSpecsText(e.target.value)}
          rows={4}
          placeholder="Bluetooth 5.0&#10;Bateria 12 horas"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="useCases">Usos (uno por linea)</Label>
        <Textarea
          id="useCases"
          value={useCasesText}
          onChange={(e) => setUseCasesText(e.target.value)}
          rows={3}
          placeholder="Fiestas&#10;Viajes"
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="inStock"
          checked={formData.inStock}
          onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
        />
        <Label htmlFor="inStock">Disponible en Stock</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 gap-2">
          <Save className="w-4 h-4" />
          Guardar
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}

// Category Form
function CategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category: Category
  onSave: (category: Category) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(category)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: formData.id || formData.name.toLowerCase().replace(/\s+/g, "-"),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="icon">Icono (emoji)</Label>
        <Input
          id="icon"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="📱"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripcion</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 gap-2">
          <Save className="w-4 h-4" />
          Guardar
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}

// Blog Form
function BlogForm({
  post,
  onSave,
  onCancel,
}: {
  post: BlogPost
  onSave: (post: BlogPost) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(post)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Imagenes</Label>
        <ImageUpload
          images={formData.images || []}
          onChange={(images) => setFormData({ ...formData, images })}
          maxImages={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Titulo</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={formData.category}
          onValueChange={(value: "novedades" | "soluciones") => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="novedades">Novedades</SelectItem>
            <SelectItem value="soluciones">Soluciones</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Resumen corto</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={2}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenido completo</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={8}
          required
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 gap-2">
          <Save className="w-4 h-4" />
          Guardar
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}

// Content Form
function ContentForm({
  content,
  onSave,
  onCancel,
}: {
  content: SiteContent
  onSave: (content: SiteContent) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(content)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const updateInfo = (key: keyof SiteContent["info"], field: "titulo" | "contenido", value: string) => {
    setFormData({
      ...formData,
      info: {
        ...formData.info,
        [key]: {
          ...formData.info[key],
          [field]: value,
        },
      },
    })
  }

  const updateContacto = (field: keyof SiteContent["contacto"], value: string) => {
    setFormData({
      ...formData,
      contacto: {
        ...formData.contacto,
        [field]: value,
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Pagina de Informacion</h3>

        {(["garantia", "politica", "mensajeria", "horario"] as const).map((key) => (
          <div key={key} className="space-y-2 p-4 bg-secondary/50 rounded-lg">
            <Input
              value={formData.info[key].titulo}
              onChange={(e) => updateInfo(key, "titulo", e.target.value)}
              placeholder="Titulo"
              className="font-semibold"
            />
            <Textarea
              value={formData.info[key].contenido}
              onChange={(e) => updateInfo(key, "contenido", e.target.value)}
              rows={3}
              placeholder="Contenido"
            />
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold">Datos de Contacto</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Telefono</Label>
            <Input value={formData.contacto.telefono} onChange={(e) => updateContacto("telefono", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp (solo numeros)</Label>
            <Input value={formData.contacto.whatsapp} onChange={(e) => updateContacto("whatsapp", e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Direccion</Label>
          <Input value={formData.contacto.direccion} onChange={(e) => updateContacto("direccion", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Horario</Label>
          <Input value={formData.contacto.horario} onChange={(e) => updateContacto("horario", e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 gap-2">
          <Save className="w-4 h-4" />
          Guardar Cambios
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}
