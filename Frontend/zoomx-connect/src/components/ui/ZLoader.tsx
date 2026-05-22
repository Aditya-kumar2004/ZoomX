import { Loader2 } from "lucide-react";

export function Spinner({ className = "w-5 h-5" }: { className?: string }) {
  return <Loader2 className={`${className} animate-spin text-[#2D6FFF]`} />;
}

export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="w-8 h-8" />
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[#1A1A26] rounded-xl ${className}`}
    />
  );
}
