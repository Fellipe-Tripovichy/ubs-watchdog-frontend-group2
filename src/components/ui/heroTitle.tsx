import * as React from "react"
import { cn } from "@/lib/utils"

interface HeroTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  subtitle?: React.ReactNode
  as?: "h1"
}

export function HeroTitle({
  children,
  subtitle,
  as: Component = "h1",
  className,
  ...props
}: Readonly<HeroTitleProps>) {
  return (
    <div className="flex flex-col gap-2 pl-5 border-l-4 border-primary">
      <Component
        className={cn(
          "text-[32px] md:text-[40px] font-regular text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </Component>
      {subtitle && (
        <p className="text-[20px] text-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}

