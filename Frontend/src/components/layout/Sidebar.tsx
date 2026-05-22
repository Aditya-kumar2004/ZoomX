"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Clock,
  ListChecks,
  Star,
  Film,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Video,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/utils/helpers";
import { cn } from "@/lib/utils";

const items = [
  { icon: Home, label: "Home", to: "/dashboard" as const },
  { icon: Clock, label: "Upcoming", to: "/dashboard" as const, hash: "upcoming" },
  { icon: ListChecks, label: "Previous", to: "/dashboard" as const, hash: "recent" },
  { icon: Star, label: "Starred", to: "/dashboard" as const },
  { icon: Film, label: "Recordings", to: "/dashboard/recordings" as const },
  { icon: Settings, label: "Settings", to: "/dashboard/settings" as const },
];

export function Sidebar({ className, onClose }: { className?: string; onClose?: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "shrink-0 bg-[#000000] border-r border-[#111111] flex flex-col transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[240px]",
        className
      )}
    >
      <div className="h-16 flex items-center px-4 border-b border-[#111111]">
        <div className="w-8 h-8 rounded-lg bg-[#2D6FFF] flex items-center justify-center shrink-0">
          <Video className="w-4 h-4 text-white" />
        </div>
        {!collapsed && <span className="ml-2 font-display font-bold text-lg">ZoomX</span>}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((it, i) => {
          const active = it.to === "/dashboard"
            ? (i === 0 && pathname === "/dashboard")
            : pathname === it.to;
          const Icon = it.icon;
          const onClick = (e: React.MouseEvent) => {
            if (it.hash) {
              e.preventDefault();
              document.getElementById(it.hash)?.scrollIntoView({ behavior: "smooth" });
            }
            if (onClose) {
              onClose();
            }
          };
          return (
            <Link
              key={it.label}
              href={it.to}
              onClick={onClick}
              className={cn(
                active
                  ? "flex items-center gap-3 px-3 py-2.5 rounded-lg border-l-[3px] border-[#2D6FFF] bg-[#1A1A26] text-white"
                  : "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#16161F] text-[#8888AA] hover:text-white transition-all duration-200"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", active ? "text-[#2D6FFF]" : "")} />
              {!collapsed && <span className="font-medium">{it.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#111111]">
        {!collapsed && user && (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#080808] mb-2">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="w-9 h-9 rounded-full bg-[#2D6FFF] text-white flex items-center justify-center text-sm font-semibold shrink-0">
                {getInitials(user.name)}
              </span>
            )}
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-xs text-[#8888AA] truncate">{user.email}</div>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[#8888AA] hover:bg-[#0F0F0F] hover:text-white transition"
        >
          {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
