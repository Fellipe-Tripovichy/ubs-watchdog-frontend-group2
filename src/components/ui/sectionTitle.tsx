import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  as?: "h2"
}

export function SectionTitle({
  children,
  as: Component = "h2",
  className,
  ...props
}: Readonly<SectionTitleProps>) {
  return (
    <div className="flex flex-col mb-6">
      <Component
        className={cn(
          className
        )}
        {...props}
      >
        <p className="text-h2 font-regular text-foreground">{children}</p>
        <div className="h-1 w-20 bg-primary mt-3"></div>
      </Component>
    </div>
  )
}
