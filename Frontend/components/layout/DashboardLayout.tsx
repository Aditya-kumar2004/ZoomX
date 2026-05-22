import { useState, type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useRequireAuth, useAuth } from "@/hooks/useAuth";
import { FullPageLoader } from "@/components/ui/ZLoader";

export function DashboardLayout({ children }: { children: ReactNode }) {
  useRequireAuth();
  const { ready, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!ready || !isAuthenticated) return <FullPageLoader />;

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute left-0 top-0 h-full w-64 bg-[#000000]"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar className="flex w-full h-full border-r border-[#111111]" onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
