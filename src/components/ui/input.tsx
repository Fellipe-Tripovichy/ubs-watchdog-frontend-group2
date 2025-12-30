import * as React from "react"

import { cn } from "@/lib/utils"

export type ValidationRule = (value: string) => boolean | string

export interface InputProps extends Omit<React.ComponentProps<"input">, "onChange" | "onBlur"> {
  validationRule?: ValidationRule
  errorMessage?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, validationRule, errorMessage, onChange, value, defaultValue, onBlur, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string>(
      value !== undefined ? String(value) : defaultValue !== undefined ? String(defaultValue) : ""
    )
    const [error, setError] = React.useState<string | null>(null)
    const [touched, setTouched] = React.useState(false)
    const validationTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    // Use controlled value if provided, otherwise use internal state
    const inputValue = value !== undefined ? String(value) : internalValue

    // Validate function
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
        // If validationRule returns false, use errorMessage prop or default message
        const error = errorMessage || "Invalid input"
        setError(error)
        return false
      }
    }, [validationRule, errorMessage])

    // Debounced validation function
    const debouncedValidate = React.useCallback((val: string, delay: number = 300) => {
      // Clear any existing timeout
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current)
      }

      // Set a new timeout for validation
      validationTimeoutRef.current = setTimeout(() => {
        validate(val)
      }, delay)
    }, [validate])

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (validationTimeoutRef.current) {
          clearTimeout(validationTimeoutRef.current)
        }
      }
    }, [])

    // Handle change
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

    // Handle blur
    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      // Clear any pending validation timeout
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current)
      }

      setTouched(true)
      // Validate immediately on blur (user is done with the field)
      validate(e.target.value)
      onBlur?.(e)
    }, [validate, onBlur])

    // Update error state when validationRule or errorMessage changes (only if touched)
    React.useEffect(() => {
      // Clear any pending validation timeout
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current)
      }

      if (touched && inputValue) {
        // Use immediate validation when rule changes (not user input)
        validate(inputValue)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validationRule, errorMessage])

    const isInvalid = error !== null

    return (
      <div className="flex flex-col gap-1 w-full">
        <input
          ref={ref}
          type={type}
          data-slot="input"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={isInvalid}
          className={cn("bg-background",
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-border h-9 w-full min-w-0 rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          {...props}
        />
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
