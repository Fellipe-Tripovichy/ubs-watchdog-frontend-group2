"use client"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

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
  "cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "text-primary",
        destructive:
          "text-destructive",
        secondary:
          "text-secondary-foreground",
      },
      size: {
        small: "p-0 h-8 w-8",
        default: "p-0 h-12 w-12",
        large: "p-0 h-16 w-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function getIconSize(size: "small" | "default" | "large" | null | undefined): string {
  if (size === "small") {
    return "size-4"
  }
  if (size === "large") {
    return "size-8"
  }
  return "size-6"
}

function IconButton({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  icon,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    icon: string
  }) {
  const Comp = asChild ? Slot : "button"
  
  const IconComponent = icon ? getIcon(icon) : null

  const iconElement = IconComponent && (
    <IconComponent
      className={cn(getIconSize(size))}
    />
  )

  if (asChild) {
    if (!React.isValidElement(children)) {
      throw new Error('IconButton with asChild requires a single React element as a child')
    }
    
    const childElement = children as React.ReactElement<{ children?: React.ReactNode }>
    const existingChildren = childElement.props.children
    
    let newChildren: React.ReactNode
    if (iconElement) {
      const existingChildrenArray = React.Children.toArray(existingChildren)
      const childrenWithKeys = existingChildrenArray.map((child, index) => {
        if (React.isValidElement(child) && child.key == null) {
          return React.cloneElement(child, { key: `icon-button-child-${index}` })
        }
        return child
      })
      const iconWithKey = React.isValidElement(iconElement)
        ? React.cloneElement(iconElement, { key: 'icon-button-icon' })
        : iconElement
      newChildren = [...childrenWithKeys, iconWithKey]
    } else {
      newChildren = existingChildren
    }
    
    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {React.cloneElement(childElement, {}, newChildren)}
      </Comp>
    )
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {iconElement}
    </Comp>
  )
}

export { IconButton, buttonVariants }
