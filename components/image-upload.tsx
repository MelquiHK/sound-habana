"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsLoading(true)

    const newImages: string[] = []

    for (let i = 0; i < files.length; i++) {
      if (images.length + newImages.length >= maxImages) break

      const file = files[i]
      if (!file.type.startsWith("image/")) continue

      // Convertir a base64
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      newImages.push(base64)
    }

    onChange([...images, ...newImages])
    setIsLoading(false)

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Grid de imagenes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-secondary group">
              <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-2 left-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Boton de subida */}
      {images.length < maxImages && (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
          <div className="flex flex-col items-center gap-3">
            {isLoading ? (
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Subir imagenes</p>
                  <p className="text-sm text-muted-foreground">
                    Toca para seleccionar ({images.length}/{maxImages})
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
