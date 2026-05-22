"use client";

import { forwardRef, useRef } from "react";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value?: string; // ISO datetime-local string: "2026-06-22T14:30"
  onChange?: (value: string) => void;
  min?: string;
  label?: string;
  error?: string;
  className?: string;
  id?: string;
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  function DateTimePicker({ value, onChange, min, label, error, className, id }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);

    // Merge refs
    const setRef = (el: HTMLInputElement | null) => {
      (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
    };

    let formattedDate = "";
    let formattedTime = "";

    if (value) {
      try {
        const d = new Date(value);
        formattedDate = format(d, "EEE, MMM d, yyyy");
        formattedTime = format(d, "hh:mm a");
      } catch {
        /* noop */
      }
    }

    const openPicker = () => {
      inputRef.current?.showPicker?.();
      inputRef.current?.focus();
    };

    return (
      <div className={cn("block", className)}>
        {label && (
          <span className="block text-sm text-[#8888AA] mb-1.5 font-medium">{label}</span>
        )}

        {/* Styled visual trigger */}
        <div
          onClick={openPicker}
          className={cn(
            "relative flex items-center gap-3 cursor-pointer select-none",
            "bg-[#000000] border rounded-xl px-4 py-3 transition-all duration-200",
            "hover:border-[#2D6FFF]/60 hover:bg-[#0A0A16]",
            error
              ? "border-[#FF3B55] focus-within:border-[#FF3B55]"
              : "border-[#1A1A1A] focus-within:border-[#2D6FFF] focus-within:shadow-[0_0_0_3px_rgba(45,111,255,0.15)]",
          )}
        >
          {/* Date section */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Calendar className="w-4 h-4 text-[#2D6FFF] shrink-0" />
            <span
              className={cn(
                "text-sm font-medium truncate",
                formattedDate ? "text-[#F0F0FF]" : "text-[#44445A]",
              )}
            >
              {formattedDate || "Select date"}
            </span>
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-[#1E1E2E] shrink-0" />

          {/* Time section */}
          <div className="flex items-center gap-2 shrink-0">
            <Clock className="w-4 h-4 text-[#82AAFF] shrink-0" />
            <span
              className={cn(
                "text-sm font-medium",
                formattedTime ? "text-[#F0F0FF]" : "text-[#44445A]",
              )}
            >
              {formattedTime || "Select time"}
            </span>
          </div>

          {/* Hidden native datetime-local input overlaid for picker functionality */}
          <input
            ref={setRef}
            id={id}
            type="datetime-local"
            value={value ?? ""}
            min={min}
            onChange={(e) => onChange?.(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            style={{ colorScheme: "dark" }}
          />
        </div>

        {error && (
          <span className="block text-xs text-[#FF3B55] mt-1">{error}</span>
        )}
      </div>
    );
  },
);
