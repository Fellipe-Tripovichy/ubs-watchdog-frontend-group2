import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"

interface HeroTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  subtitle?: React.ReactNode
  as?: "h1"
  loading?: boolean
}

export function HeroTitle({
  children,
  subtitle,
  as: Component = "h1",
  className,
  loading = false,
  ...props
}: Readonly<HeroTitleProps>) {
  return (
    <div className="flex flex-col gap-2 pl-5 border-l-4 border-primary">
      {loading ? (
        <Skeleton className="w-full h-[40px] md:h-[48px]" />
      ) : (
        <Component
          className={cn(
            "text-[32px] md:text-[40px] font-regular text-foreground",
            className
          )}
          {...props}
        >
          {children}
        </Component>
      )}
      {subtitle && (
        <div className="text-[20px] text-foreground">
          {loading ? (
            <Skeleton className="w-full h-[20px] md:h-[24px]" />
          ) : (
            <>{subtitle}</>
          )}
        </div>
      )}
    </div>
  )
}