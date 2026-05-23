"use client";

import Link from "next/link";
import { Video, Twitter, Github, Linkedin } from "lucide-react";

export function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-[#F0F0FF] bg-[#08090A]" suppressHydrationWarning>
      <Nav />
      {children}
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[#0A0A0F]/70 border-b border-[#1E1E2E]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="w-8 h-8 rounded-lg bg-[#2D6FFF] flex items-center justify-center glow-blue">
            <Video className="w-4 h-4 text-white" />
          </span>
          ZoomX
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-[#8888AA]">
          <Link href="/#features" className="hover:text-white transition">Features</Link>
          <Link href="/#how" className="hover:text-white transition">How it works</Link>
          <Link href="/#testimonials" className="hover:text-white transition">Customers</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/auth/signin" className="text-sm px-4 py-2 rounded-xl hover:bg-[#1A1A26] transition">Sign in</Link>
          <Link href="/auth/register" className="text-sm px-4 py-2 rounded-xl bg-[#2D6FFF] hover:bg-[#1A5AE8] text-white transition btn-glow">Get Started</Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const socialIcons = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  const columns = [
    {
      label: "Product",
      links: [
        { text: "Features", href: "/#features" },
        { text: "Pricing", href: "/#pricing" },
        { text: "Security", href: "/security" },
        { text: "Changelog", href: "/changelog" }
      ]
    },
    {
      label: "Company",
      links: [
        { text: "About", href: "/about" },
        { text: "Blog", href: "/blog" },
        { text: "Careers", href: "/careers" },
        { text: "Press", href: "/press" }
      ]
    },
    {
      label: "Support",
      links: [
        { text: "Help Center", href: "/help" },
        { text: "Contact", href: "/contact" },
        { text: "Status", href: "/status" },
        { text: "Documentation", href: "/docs" }
      ]
    }
  ];

  return (
    <footer className="bg-[#08090A] border-t border-white/[0.06] pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-12 pb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-2xl text-white mb-6 w-fit">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-indigo-500 flex items-center justify-center shadow-lg shadow-[#3B82F6]/20">
                <Video className="w-5 h-5 text-white" />
              </span>
              ZoomX
            </Link>
            <p className="text-[#A0AEC0] text-base leading-relaxed mb-6 max-w-sm font-sans font-medium">
              Premium video conferencing for modern teams. Secure, fast, crystal-clear.
            </p>
            <div className="flex gap-3">
              {socialIcons.map((soc) => {
                const Icon = soc.icon;
                return (
                  <a
                    key={soc.label}
                    href={soc.href}
                    aria-label={soc.label}
                    className="w-10 h-10 rounded-xl bg-[#0F1117] border border-white/10 hover:border-[#3B82F6]/50 flex items-center justify-center text-[#A0AEC0] hover:text-white transition-all duration-300 group"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                );
              })}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.label}>
              <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase mb-6 font-sans">
                {col.label}
              </h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.href}
                      className="underline-slide text-sm text-[#A0AEC0] hover:text-white transition-colors duration-300 font-sans font-medium"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/[0.06] text-center text-xs md:text-sm text-[#A0AEC0]/60 font-sans font-medium">
          <p>
            © 2025 ZoomX. All rights reserved. ·{" "}
            <a href="#" className="hover:text-white transition-colors duration-300">
              Privacy
            </a>{" "}
            ·{" "}
            <a href="#" className="hover:text-white transition-colors duration-300">
              Terms
            </a>{" "}
            ·{" "}
            <a href="#" className="hover:text-white transition-colors duration-300">
              Cookies
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
