"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Video, Bell, Search, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/utils/helpers";
import { DateTimeDisplay } from "@/components/dashboard/DateTimeDisplay";

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="h-16 bg-[#000000] border-b border-[#111111] flex items-center px-6 sticky top-0 z-30 backdrop-blur gap-3">
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg text-[#8888AA] hover:bg-[#0F0F0F] hover:text-white transition"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      <Link href="/dashboard" className="flex items-center gap-2 font-display text-xl font-bold">
        <span className="w-8 h-8 rounded-lg bg-[#2D6FFF] flex items-center justify-center glow-blue">
          <Video className="w-4 h-4 text-white" />
        </span>
        ZoomX
      </Link>

      <div className="flex-1 flex justify-center">
        <DateTimeDisplay variant="navbar" />
      </div>

      <div className="flex items-center gap-2">
        <button aria-label="Search" className="p-2 rounded-lg text-[#8888AA] hover:bg-[#0F0F0F] hover:text-white transition">
          <Search className="w-5 h-5" />
        </button>
        <button aria-label="Notifications" className="p-2 rounded-lg text-[#8888AA] hover:bg-[#0F0F0F] hover:text-white transition relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF3B55] rounded-full" />
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 ml-2 pl-1 pr-2 py-1 rounded-xl hover:bg-[#0F0F0F] transition"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="w-9 h-9 rounded-full bg-[#2D6FFF] text-white flex items-center justify-center text-sm font-semibold">
                {user ? getInitials(user.name) : "?"}
              </span>
            )}
            <ChevronDown className="w-4 h-4 text-[#8888AA]" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#080808] border border-[#111111] rounded-xl p-2 shadow-2xl">
              <div className="px-3 py-2 border-b border-[#111111] mb-1">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-[#8888AA]">{user?.email}</div>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[#0F0F0F]"
              >
                Dashboard
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#FF8093] hover:bg-[#FF3B55]/10"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
