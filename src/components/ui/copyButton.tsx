"use client"

import * as React from "react"
import { IconButton, buttonVariants } from "@/components/ui/iconButton"
import { useToast } from "@/lib/use-toast"
import type { VariantProps } from "class-variance-authority"

interface CopyButtonProps extends Omit<React.ComponentProps<"button">, "onClick">, VariantProps<typeof buttonVariants> {
  textToCopy: string
  successMessage?: string
  onCopySuccess?: () => void
  onCopyError?: (error: Error) => void
  asChild?: boolean
}

export function CopyButton({
  textToCopy,
  successMessage = "Copiado com sucesso!",
  onCopySuccess,
  onCopyError,
  ...iconButtonProps
}: CopyButtonProps) {
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      toast({
        title: successMessage,
        variant: "success",
      })
      onCopySuccess?.()
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to copy")
      onCopyError?.(err)
    }
  }

  return (
    <IconButton
      {...iconButtonProps}
      icon="copy"
      onClick={handleCopy}
    />
  )
}
