"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function formatPtBr(date: Date | undefined) {
  if (!date) return ""
  return date.toLocaleDateString("pt-BR")
}

function parsePtBr(value: string): Date | undefined {
  const v = value.trim()
  if (!v) return undefined
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return undefined

  const dd = Number(m[1])
  const mm = Number(m[2])
  const yyyy = Number(m[3])

  const d = new Date(yyyy, mm - 1, dd)

  if (
    d.getFullYear() !== yyyy ||
    d.getMonth() !== mm - 1 ||
    d.getDate() !== dd
  ) {
    return undefined
  }

  return d
}

type DatePickerInputProps = {
  label: string
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  minDate?: Date
  maxDate?: Date
  placeholder?: string
}

export function DatePickerInput({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "dd/mm/aaaa",
}: Readonly<DatePickerInputProps>) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(value)
  const [text, setText] = React.useState(formatPtBr(value))

  React.useEffect(() => {
    setText(formatPtBr(value))
    setMonth(value)
  }, [value])

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>

      <div className="relative w-full">
        <Input
          value={text}
          placeholder={placeholder}
          className="pr-10"
          onChange={(e) => {
            const next = e.target.value
            setText(next)

            const parsed = parsePtBr(next)
            if (!parsed && next.trim() !== "") return

            if (!next.trim()) {
              onChange(undefined)
              return
            }

            if (minDate && parsed && parsed < minDate) return
            if (maxDate && parsed && parsed > maxDate) return

            onChange(parsed)
            setMonth(parsed)
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="small"
              showArrow={false}
              className="absolute top-1/2 right-2 h-7 w-7 p-0 -translate-y-1/2"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="sr-only">Selecionar data</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={value}
              month={month}
              onMonthChange={setMonth}
              captionLayout="dropdown"
              disabled={[
                ...(minDate ? [{ before: minDate }] : []),
                ...(maxDate ? [{ after: maxDate }] : []),
              ]}
              onSelect={(d) => {
                onChange(d)
                setText(formatPtBr(d))
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
