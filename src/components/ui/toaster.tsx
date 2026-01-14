"use client"

import {
  ToastProvider,
  ToastViewport,
  ToastWithIcon,
} from "@/components/ui/toast"
import { useToast } from "@/lib/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, variant, action, ...props }) {
        return (
          <ToastWithIcon
            key={id}
            variant={variant}
            title={title}
            description={description}
            {...props}
          />
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
