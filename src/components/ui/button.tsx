"use client"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronRight, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { useState } from "react"

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-accent",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        secondary:
          "border bg-background shadow-xs hover:bg-background hover:text-foreground hover:border-2 dark:border-input dark:hover:bg-input/50",
        link: "text-foreground underline-offset-4",
      },
      size: {
        small: "py-2 px-3 has-[>svg]:px-2 text-xs",
        default: "h-12 px-4 py-2 has-[>svg]:px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  showArrow = true,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    showArrow?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div className={cn(variant === "secondary" && isHovered ? "" : "ml-[1px]")}>
        {children}
      </div>
      {showArrow && (
        <span className="relative inline-flex items-center ml-2">
        <ArrowRight
          size={size === "small" ? 16 : 24}
          className={cn(
            "absolute transition-all duration-300 ease-in-out",
            variant === "default" ? "text-primary-foreground" : "text-primary",
            isHovered ? "opacity-100 -translate-x-1" : "opacity-0 translate-x-0"
          )}
        />
        <ChevronRight
          size={size === "small" ? 16 : 24}
          className={cn(
            "transition-all duration-300 ease-in-out",
            variant === "default" ? "text-primary-foreground" : "text-primary",
            isHovered ? "opacity-0 translate-x-0" : "opacity-100 -translate-x-1"
            )}
          />
        </span>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
