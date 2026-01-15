import * as React from "react"

import { cn } from "@/lib/utils"

export type ValidationRule = (value: string) => boolean | string

export interface InputProps extends Omit<React.ComponentProps<"input">, "onChange" | "onBlur" | "prefix"> {
  validationRule?: ValidationRule
  errorMessage?: string
  prefix?: React.ReactNode
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

function getInitialValue(value: string | number | readonly string[] | undefined, defaultValue: string | number | readonly string[] | undefined): string {
  if (value !== undefined) {
    return String(value)
  }
  if (defaultValue !== undefined) {
    return String(defaultValue)
  }
  return ""
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, validationRule, errorMessage, prefix, onChange, value, defaultValue, onBlur, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string>(
      getInitialValue(value, defaultValue)
    )
    const [error, setError] = React.useState<string | null>(null)
    const [touched, setTouched] = React.useState(false)
    const validationTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    const inputValue = value === undefined ? internalValue : String(value)

    const validate = React.useCallback((val: string) => {
      if (!validationRule) {
        setError(null)
        return true
      }

      const result = validationRule(val)
      
      if (result === true) {
        setError(null)
        return true
      } else if (typeof result === "string") {
        setError(result)
        return false
      } else {
        const error = errorMessage || "Invalid input"
        setError(error)
        return false
      }
    }, [validationRule, errorMessage])

    const debouncedValidate = React.useCallback((val: string, delay: number = 300) => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current)
      }

      validationTimeoutRef.current = setTimeout(() => {
        validate(val)
      }, delay)
    }, [validate])

    React.useEffect(() => {
      return () => {
        if (validationTimeoutRef.current) {
          clearTimeout(validationTimeoutRef.current)
        }
      }
    }, [])

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      
      if (value === undefined) {
        setInternalValue(newValue)
      }
      
      if (touched || newValue.length > 0) {
        debouncedValidate(newValue)
      }
      
      onChange?.(e)
    }, [value, touched, debouncedValidate, onChange])

    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current)
      }

      setTouched(true)
      validate(e.target.value)
      onBlur?.(e)
    }, [validate, onBlur])

    React.useEffect(() => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current)
      }

      if (touched && inputValue) {
        validate(inputValue)
      }
    }, [validationRule, errorMessage])

    const isInvalid = Boolean(error)

    return (
      <div className="flex flex-col gap-1 w-full">
        <div className={cn(
          "relative flex items-center w-full",
          "bg-background dark:bg-input/30 border-border rounded-xs border shadow-xs transition-[color,box-shadow]",
          isInvalid && "border-destructive ring-destructive/20 dark:ring-destructive/40"
        )}>
          {prefix && (
            <div className="flex items-center px-3 text-muted-foreground pointer-events-none">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            data-slot="input"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={isInvalid}
            className={cn(
              "bg-transparent",
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
              "h-9 w-full min-w-0 py-2 text-input outline-none",
              "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-input file:font-medium",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              prefix ? "pl-0 pr-3" : "px-3",
              className
            )}
            {...props}
          />
        </div>
        {isInvalid && (
          <span className="text-sm text-destructive">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
