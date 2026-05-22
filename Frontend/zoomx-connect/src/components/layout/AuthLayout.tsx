import { Video } from "lucide-react";
import type { ReactNode } from "react";

export function AuthLayout({
  side,
  children,
  stats,
}: {
  side: ReactNode;
  children: ReactNode;
  stats?: { label: string; value: string }[];
}) {
  return (
    <div className="h-screen max-h-screen overflow-hidden grid md:grid-cols-2" suppressHydrationWarning>
      <div className="hidden md:flex relative overflow-hidden bg-[#000000] bg-dot-grid py-10 px-12 flex-col justify-between h-full border-r border-white/[0.04]">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none opacity-80"
          style={{ background: "radial-gradient(circle, rgba(45,111,255,0.22), transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-[350px] h-[350px] rounded-full pointer-events-none opacity-50 blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(123,92,255,0.15), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none opacity-70"
          style={{ background: "radial-gradient(circle, rgba(45,111,255,0.18), transparent 70%)" }}
        />
        
        <a href="/" className="relative flex items-center gap-2.5 font-display font-extrabold text-xl tracking-tight text-white group w-fit">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D6FFF] to-[#7B5CFF] flex items-center justify-center shadow-lg shadow-[#2D6FFF]/25 transition-transform duration-300 group-hover:scale-105">
            <Video className="w-4.5 h-4.5 text-white" />
          </span>
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">ZoomX</span>
        </a>

        <div className="relative my-auto py-8">
          {side}
          {stats && (
            <div className="grid grid-cols-3 gap-3.5 mt-8">
              {stats.map((s) => (
                <div key={s.label} className="relative group bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-300 backdrop-blur-md shadow-xl">
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="font-display text-2xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{s.value}</div>
                  <div className="text-[10px] text-[#8888AA] font-extrabold tracking-wider uppercase mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex items-center justify-between text-[10px] text-[#44445A] font-extrabold tracking-widest uppercase">
          <span>© 2025 ZoomX</span>
          <div className="flex gap-4">
            <a href="/security" className="hover:text-[#8888AA] transition-colors duration-200">Security</a>
            <a href="/help" className="hover:text-[#8888AA] transition-colors duration-200">Support</a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-4 md:p-6 lg:p-8 h-full overflow-y-auto">
        <div className="w-full max-w-md card-base bg-[#080808] py-6 px-6 md:py-8 md:px-10 rounded-2xl shadow-xl my-auto border border-white/[0.05]">
          {children}
        </div>
      </div>
    </div>
  );
}

export function GoogleButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white text-gray-800 hover:bg-white/90 transition rounded-xl py-2 flex items-center justify-center gap-3 font-medium text-sm"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.2-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.5-5.2l-6.2-5.2c-2 1.5-4.6 2.4-7.3 2.4-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.6 39.1 16.2 43.5 24 43.5z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.2-.1-2.3-.4-3.5z" />
      </svg>
      {label}
    </button>
  );
}
