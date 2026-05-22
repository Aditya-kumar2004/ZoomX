import { useEffect, useState } from "react";
import { format } from "date-fns";

export function DateTimeDisplay({ variant = "dashboard" }: { variant?: "dashboard" | "navbar" }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (variant === "navbar") {
    return (
      <div className="text-sm text-[#8888AA] font-sans hidden md:block">
        {format(now, "EEEE, MMMM d, yyyy")}
        <span className="mx-3 text-[#44445A]">•</span>
        <span className="text-[#F0F0FF] font-mono">{format(now, "HH:mm:ss")}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="font-display text-4xl md:text-5xl font-bold tracking-tight">
        {format(now, "HH:mm:ss")}
      </div>
      <div className="text-[#8888AA] mt-1">{format(now, "EEEE, MMMM d, yyyy")}</div>
    </div>
  );
}

