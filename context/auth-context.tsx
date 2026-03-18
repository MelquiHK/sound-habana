"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Profile, Order } from "@/lib/database.types"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  isAdmin: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  users: User[]
  orders: Order[]
  allOrders: Order[]
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (
    name: string,
    email: string,
    password: string,
    phone: string,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  addOrder: (order: Omit<Order, "id" | "created_at" | "updated_at">) => Promise<void>
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>
  updateOrderShipping: (orderId: string, shippingCost: number) => Promise<void>
  deleteOrder: (orderId: string) => Promise<void>
  clearAllOrders: () => Promise<void>
  clearUserOrders: () => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  updateUser: (userId: string, data: Partial<Profile>) => Promise<void>
  makeAdmin: (userId: string) => Promise<void>
  refreshOrders: () => Promise<void>
  refreshUsers: () => Promise<void>
  isLoading: boolean
  isFirstVisit: boolean
  setFirstVisitDone: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFirstVisit, setIsFirstVisit] = useState(false)

  const supabase = useMemo(() => createClient(), [])
  const supabaseEnabled = Boolean(supabase)

  // Cargar usuario al iniciar
  useEffect(() => {
    if (!supabaseEnabled) {
      console.warn("[v0] Supabase no está configurado. Se desactiva la autenticación basada en Supabase.")
      setIsLoading(false)
      return
    }

    const supabaseClient = supabase
    if (!supabaseClient) {
      setIsLoading(false)
      return
    }

    const loadUser = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabaseClient.auth.getUser()

        if (authUser) {
          const { data: profile, error } = await supabaseClient.from("profiles").select("*").eq("id", authUser.id).single()

          if (error) {
            console.error("[v0] Error loading profile:", error)
          }

          if (profile) {
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              phone: profile.phone,
              isAdmin: profile.role === "admin",
              createdAt: profile.created_at,
            })

            // Cargar pedidos del usuario
            await loadUserOrders(profile.id)

            // Si es admin, cargar todos los pedidos y usuarios
            if (profile.role === "admin") {
              await loadAllOrders()
              await loadAllUsers()
            }
          }
        } else {
          // Verificar si es primera visita
          const visited = localStorage.getItem("habana-sound-visited")
          if (!visited) {
            setIsFirstVisit(true)
          }
        }
      } catch (error) {
        console.error("[v0] Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: profile } = await supabaseClient.from("profiles").select("*").eq("id", session.user.id).single()

        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            isAdmin: profile.role === "admin",
            createdAt: profile.created_at,
          })
          await loadUserOrders(profile.id)
          if (profile.role === "admin") {
            await loadAllOrders()
            await loadAllUsers()
          }
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setOrders([])
        setAllOrders([])
        setUsers([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserOrders = async (userId: string) => {
    if (!supabase) return

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (data) setOrders(data)
  }

  const loadAllOrders = async () => {
    if (!supabase) return

    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (data) setAllOrders(data)
  }

  const loadAllUsers = async () => {
    if (!supabase) return

    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

    if (data) {
      setUsers(
        data.map((p) => ({
          id: p.id,
          name: p.name,
          email: p.email,
          phone: p.phone,
          isAdmin: p.role === "admin",
          createdAt: p.created_at,
        })),
      )
    }
  }

  const login = async (email: string, password: string) => {
    if (!supabase) {
      return { success: false, error: "Supabase no está configurado. Contacta con el administrador." }
    }

    try {
      console.log("[v0] Attempting login for:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("[v0] Login response:", { data: !!data.user, error: error?.message })

      if (error) {
        let errorMessage = "Error al iniciar sesión"

        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Correo o contraseña incorrectos"
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Debes confirmar tu correo electrónico primero"
        } else if (error.message.includes("User not found")) {
          errorMessage = "No existe una cuenta con este correo"
        } else {
          errorMessage = error.message
        }

        return { success: false, error: errorMessage }
      }

      if (!data.user) {
        return { success: false, error: "No se pudo autenticar el usuario" }
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          console.error("[v0] Error loading profile after login:", profileError)
          // No fallar el login si hay error cargando el perfil, solo hacer log
        } else if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            isAdmin: profile.role === "admin",
            createdAt: profile.created_at,
          })
        }
      } catch (profileError) {
        console.error("[v0] Exception loading profile:", profileError)
        // No fallar el login si hay error cargando el perfil
      }

      return { success: true }
    } catch (error: any) {
      console.error("[v0] Login exception:", error)

      let errorMessage = "Error al conectar con el servidor"

      if (error?.message?.includes("fetch")) {
        errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión a internet."
      } else if (error?.message) {
        errorMessage = error.message
      }

      return { success: false, error: errorMessage }
    }
  }

  const register = async (name: string, email: string, password: string, phone: string) => {
    if (!supabase) {
      return { success: false, error: "Supabase no está configurado. Contacta con el administrador." }
    }

    try {
      console.log("[v0] Attempting registration for:", email)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
          data: { name, phone },
        },
      })

      if (error) {
        let errorMessage = "Error al registrarse"

        if (error.message.includes("already registered")) {
          errorMessage = "Este correo ya está registrado"
        } else if (error.message.includes("Password should be")) {
          errorMessage = "La contraseña debe tener al menos 6 caracteres"
        } else {
          errorMessage = error.message
        }

        return { success: false, error: errorMessage }
      }

      // Crear perfil manualmente si el trigger no lo hizo
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: data.user.id,
          name,
          email,
          phone,
          role: "customer",
        })

        if (profileError) {
          console.error("[v0] Error creating profile:", profileError)
        }
      }

      return { success: true }
    } catch (error: any) {
      console.error("[v0] Registration exception:", error)
      return { success: false, error: error?.message || "Error al registrarse" }
    }
  }

  const logout = async () => {
    if (!supabase) {
      setUser(null)
      setOrders([])
      setAllOrders([])
      setUsers([])
      return
    }

    await supabase.auth.signOut()
    setUser(null)
    setOrders([])
    setAllOrders([])
    setUsers([])
  }

  const addOrder = async (order: Omit<Order, "id" | "created_at" | "updated_at">) => {
    if (!supabase) return

    const { data, error } = await supabase.from("orders").insert(order).select().single()

    if (data && !error) {
      if (user) {
        setOrders((prev) => [data, ...prev])
      }
      setAllOrders((prev) => [data, ...prev])
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    if (!supabase) return

    await supabase.from("orders").update({ status }).eq("id", orderId)

    setAllOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }

  const updateOrderShipping = async (orderId: string, shippingCost: number) => {
    if (!supabase) return

    const order = allOrders.find((o) => o.id === orderId)
    if (!order) return

    const total = order.subtotal + shippingCost

    await supabase.from("orders").update({ shipping_cost: shippingCost, total }).eq("id", orderId)

    setAllOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, shipping_cost: shippingCost, total } : o)))
  }

  const deleteOrder = async (orderId: string) => {
    if (!supabase) return

    await supabase.from("orders").delete().eq("id", orderId)
    setAllOrders((prev) => prev.filter((o) => o.id !== orderId))
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
  }

  const clearAllOrders = async () => {
    if (!supabase) return

    await supabase.from("orders").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    setAllOrders([])
    setOrders([])
  }

  const clearUserOrders = async () => {
    if (!supabase || !user) return

    await supabase.from("orders").delete().eq("user_id", user.id)
    setOrders([])
    await loadAllOrders()
  }

  const deleteUser = async (userId: string) => {
    if (!supabase) return

    // Eliminar pedidos del usuario primero
    await supabase.from("orders").delete().eq("user_id", userId)
    // Eliminar perfil (el trigger eliminará el auth user)
    await supabase.from("profiles").delete().eq("id", userId)
    await loadAllUsers()
    await loadAllOrders()
  }

  const updateUser = async (userId: string, data: Partial<Profile>) => {
    if (!supabase) return

    await supabase.from("profiles").update(data).eq("id", userId)
    await loadAllUsers()
  }

  const makeAdmin = async (userId: string) => {
    if (!supabase) return

    await supabase.from("profiles").update({ role: "admin" }).eq("id", userId)
    await loadAllUsers()
  }

  const refreshOrders = async () => {
    if (user?.isAdmin) {
      await loadAllOrders()
    }
    if (user) {
      await loadUserOrders(user.id)
    }
  }

  const refreshUsers = async () => {
    if (user?.isAdmin) {
      await loadAllUsers()
    }
  }

  const setFirstVisitDone = () => {
    localStorage.setItem("habana-sound-visited", "true")
    setIsFirstVisit(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        orders,
        allOrders,
        login,
        register,
        logout,
        addOrder,
        updateOrderStatus,
        updateOrderShipping,
        deleteOrder,
        clearAllOrders,
        clearUserOrders,
        deleteUser,
        updateUser,
        makeAdmin,
        refreshOrders,
        refreshUsers,
        isLoading,
        isFirstVisit,
        setFirstVisitDone,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
