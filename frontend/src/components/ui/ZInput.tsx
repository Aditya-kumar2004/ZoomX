import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, leftIcon, rightIcon, className, ...rest },
  ref,
) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm text-[#8888AA] mb-1.5 font-medium">
          {label}
        </span>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888AA]">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "input-base",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-[#FF3B55] focus:border-[#FF3B55]",
            className,
          )}
          {...rest}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8888AA]">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <span className="block text-xs text-[#FF3B55] mt-1">{error}</span>}
    </label>
  );
});
