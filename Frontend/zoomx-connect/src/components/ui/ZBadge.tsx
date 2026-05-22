import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "blue" | "green" | "red" | "gray";

const styles: Record<Variant, string> = {
  blue: "bg-[#2D6FFF]/15 text-[#82AAFF] border-[#2D6FFF]/30",
  green: "bg-[#00C566]/15 text-[#3FE39B] border-[#00C566]/30",
  red: "bg-[#FF3B55]/15 text-[#FF8093] border-[#FF3B55]/30",
  gray: "bg-[#22223A] text-[#8888AA] border-[#1E1E2E]",
};

export function Badge({
  variant = "gray",
  children,
  className,
}: {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
