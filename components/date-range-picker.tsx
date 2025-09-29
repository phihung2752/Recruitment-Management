"use client"

import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface DatePickerWithRangeProps {
  date: {
    from: Date
    to: Date
  }
  onDateChange: (date: { from: Date; to: Date }) => void
}

export function DatePickerWithRange({ date, onDateChange }: DatePickerWithRangeProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className={cn(
            "w-full sm:w-[300px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              onDateChange({ from: range.from, to: range.to })
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}