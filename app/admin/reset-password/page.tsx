"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Key } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("melcraft96@gmail.com")
  const [newPassword, setNewPassword] = useState("melQUI06")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const supabase = useMemo(() => createClient(), [])

  const handleResetPassword = async () => {
    if (!supabase) {
      setError("Supabase no está configurado. Contacta con el administrador.")
      return
    }

    setLoading(true)
    setMessage("")
    setError("")

    try {
      // Primero iniciar sesión como admin actual (si existe)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("Debes iniciar sesión como administrador primero")
        setLoading(false)
        return
      }

      // Actualizar la contraseña del usuario especificado
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setError(updateError.message)
      } else {
        setMessage("Contraseña actualizada exitosamente")
      }
    } catch (err) {
      setError("Error al actualizar contraseña")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-white to-blue-50 p-4">
      <div className="mx-auto max-w-md pt-20">
        <Link href="/admin" className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-coral-500">
          <ArrowLeft className="h-4 w-4" />
          Volver al Panel
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-coral-100">
                <Key className="h-6 w-6 text-coral-600" />
              </div>
              <div>
                <CardTitle>Restablecer Contraseña</CardTitle>
                <CardDescription>Actualiza la contraseña del administrador</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email del usuario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <Input
                id="password"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
              />
            </div>

            {message && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</div>}

            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <Button onClick={handleResetPassword} disabled={loading} className="w-full">
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </Button>

            <div className="text-xs text-gray-500">
              <p className="font-medium mb-1">Nota importante:</p>
              <p>
                Si no puedes acceder con ninguna cuenta, ejecuta el script SQL{" "}
                <code className="bg-gray-100 px-1 rounded">004_reset_users_and_create_admin.sql</code> desde el panel de
                Supabase.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
