"use client"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"

function getIcon(iconName: string): LucideIcon | null {
  const normalizedName = iconName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("")

  const pascalCaseName = iconName.charAt(0).toUpperCase() + iconName.slice(1)

  const icons = LucideIcons as unknown as Record<string, LucideIcon>
  const IconComponent = icons[normalizedName] || icons[pascalCaseName]

  return IconComponent || null
}

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-regular transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative",
  {
    variants: {
      variant: {
        default: "text-muted-foreground hover:text-foreground after:absolute after:bottom-0 after:left-0 after:bg-primary after:transition-all after:duration-300 after:ease-out after:w-0 hover:after:w-full",
      },
      size: {
        default: "py-2 after:h-[2px]",
        small: "py-2 after:h-[1px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function LinkButton({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  icon,
  iconLeft = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    icon?: string
    iconLeft?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  const IconComponent = icon ? getIcon(icon) : null;

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center">
        {iconLeft && IconComponent && (
          <IconComponent
            className={cn("mr-2", size === "small" ? "size-3" : "size-4")}
          />
        )}
        <div className={cn(IconComponent && "pb-[2px]")}>
          <p className="text-button">{children}</p>
        </div>
        {!iconLeft && IconComponent && (
          <IconComponent
            className={cn("ml-2", size === "small" ? "size-3" : "size-4")}
          />
        )}
      </div>
    </Comp>
  )
}

export { LinkButton, buttonVariants }
