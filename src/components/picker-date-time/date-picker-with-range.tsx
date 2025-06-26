"use client";

import React, { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { isBefore, startOfDay } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";
import { enUS, vi } from "date-fns/locale";
import "@/../i18n";

export interface DatePickerWithRangeProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
}

export default function DatePickerWithRange({
  value,
  onChange,
  className,
}: DatePickerWithRangeProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>(
    value ?? {
      from: new Date(),
      to: addDays(new Date(), 0),
    }
  );

  useEffect(() => {
    setDate(value);
  }, [value]);

  useEffect(() => {
    if (date?.from && date?.to && date.from.getTime() !== date.to.getTime()) {
      setOpen(false);
    }
  }, [date]);

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    if (onChange) onChange(selectedDate);
  };

  return (
    <div className={cn("grid gap-2 w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-full ">
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to && date.from.getTime() !== date.to.getTime() ? (
                <>
                  {format(date.from, "dd/MM/yyyy", {
                    locale: i18n.language === "vi" ? vi : enUS,
                  })}{" "}
                  -{" "}
                  {format(date.to, "dd/MM/yyyy", {
                    locale: i18n.language === "vi" ? vi : enUS,
                  })}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy", {
                  locale: i18n.language === "vi" ? vi : enUS,
                })
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            disabled={(day) => {
              const today = startOfDay(new Date());
              const isBeforeToday = isBefore(startOfDay(day), today);

              const isSelected =
                (date?.from &&
                  startOfDay(day).getTime() ===
                    startOfDay(date.from).getTime()) ||
                (date?.to &&
                  startOfDay(day).getTime() === startOfDay(date.to).getTime());

              return isBeforeToday && !isSelected;
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
