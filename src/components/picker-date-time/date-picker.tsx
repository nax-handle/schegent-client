"use client";

import React, { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value);
  const [month, setMonth] = useState<Date | undefined>(value);
  const [inputValue, setInputValue] = useState(formatDate(value));

  useEffect(() => {
    setDate(value);
    setMonth(value);
    setInputValue(formatDate(value));
  }, [value]);

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setInputValue(formatDate(selectedDate));
    setOpen(false);
    if (onChange) onChange(selectedDate);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="relative flex gap-2">
      <Input
        id="date"
        value={inputValue}
        placeholder="June 01, 2025"
        className="bg-background pr-10"
        onChange={(e) => {
          setInputValue(e.target.value);
          const parsedDate = new Date(e.target.value);
          if (isValidDate(parsedDate) && parsedDate >= today) {
            setDate(parsedDate);
            setMonth(parsedDate);
            if (onChange) onChange(parsedDate);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date</span>
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
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={handleDateChange}
            disabled={{ before: today }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
