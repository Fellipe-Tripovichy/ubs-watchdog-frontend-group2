"use client"
import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { LinkButton } from "./linkButton"

const pathLabelMap: Record<string, string> = {
  "": "Home",
  "transactions": "Transações",
  "compliance": "Conformidade",
  "authentication": "Autenticação",
  "reports": "Relatórios",
  "new-transaction": "Nova transação",
}

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  const isIdSegment = (segment: string): boolean => {
    if (/^\d+$/.test(segment)) return true

    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) return true

    if (/^[a-z0-9]{20,}$/i.test(segment)) return true
    return false
  }

  const nonIdSegments = pathSegments
    .map((segment, index) => ({ segment, originalIndex: index }))
    .filter(({ segment }) => !isIdSegment(segment))
  
  const breadcrumbItems = [
    { href: "/", label: pathLabelMap[""] || "Home" },
    ...nonIdSegments.map(({ segment, originalIndex }, index) => {
      const hrefSegments = nonIdSegments.slice(0, index + 1).map(item => item.segment)
      const href = "/" + hrefSegments.join("/")
      return {
        href,
        label: pathLabelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      }
    }),
  ]

  return (
    <div className="flex items-center justify-center gap-2">
      <p className="text-muted-foreground font-semibold text-sm">Você está aqui:</p>
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
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-caption break-words sm:gap-2.5",
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
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight aria-hidden="true" />}
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
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal aria-hidden="true" />
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
