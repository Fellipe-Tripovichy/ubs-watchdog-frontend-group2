import * as React from "react"


const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
} as const

export type Breakpoint = "sm" | "md" | "lg" | "default"

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>("default")

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width >= BREAKPOINTS.lg) {
        setBreakpoint("lg")
      } else if (width >= BREAKPOINTS.md) {
        setBreakpoint("md")
      } else if (width >= BREAKPOINTS.sm) {
        setBreakpoint("sm")
      } else {
        setBreakpoint("default")
      }
    }

    updateBreakpoint()
    window.addEventListener("resize", updateBreakpoint)
    return () => window.removeEventListener("resize", updateBreakpoint)
  }, [])

  return breakpoint
}

