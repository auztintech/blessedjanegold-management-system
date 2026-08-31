"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string; // ISO date string "YYYY-MM-DD"
  onChange: (value: string | undefined) => void;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = value ? new Date(value + "T00:00:00") : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50",
          !selectedDate && "text-gray-400"
        )}>
        <span>
          {selectedDate ? format(selectedDate, "dd MMM yyyy") : placeholder}
        </span>
        <CalendarIcon size={14} className="text-gray-400" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : undefined);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
