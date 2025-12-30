"use client"
import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { LinkButton } from "./linkButton"

// Map path segments to readable labels
const pathLabelMap: Record<string, string> = {
  "": "Home",
  "transactions": "Transações",
  "compliance": "Conformidade",
  "authentication": "Autenticação",
  "reports": "Relatórios",
}

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)
  
  // Build breadcrumb items
  const breadcrumbItems = [
    { href: "/", label: pathLabelMap[""] || "Home" },
    ...pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/")
      return {
        href,
        label: pathLabelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      }
    }),
  ]

  return (
    <div className="flex items-center justify-center gap-2">
      <p className="text-muted-foreground font-semibold text-sm flex">Você está aqui:</p>
      <nav aria-label="breadcrumb" data-slot="breadcrumb" className="flex items-center" {...props}>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1
            return (
              <React.Fragment key={item.href}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>
                      <LinkButton size="small">{item.label}</LinkButton>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href}>
                      <LinkButton size="small" asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </LinkButton>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </nav>
    </div>
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  href,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  href?: string
}) {
  return (
    <div
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
