"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, type Variants, AnimatePresence } from "framer-motion";
import {
  Video,
  Shield,
  Calendar,
  Users,
  Globe,
  Zap,
  Star,
  ArrowRight,
  Mic,
  MicOff,
  Layers,
  MessageSquare,
  Megaphone,
  BadgeDollarSign,
  Bot,
  Sparkles,
  Plus,
  MousePointer,
  Send,
  ThumbsUp,
  Check,
  Activity,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
const Orb = dynamic(() => import("@/components/ui/Orb"), { ssr: false });
import { LandingLayout } from "@/components/layout/LandingLayout";

export default function Landing() {
  return (
    <LandingLayout>
      <Hero />
      <BrandsLogoBar />
      <Features />
      <PlatformSection />
      <StatsSection />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
      <CtaBanner />
    </LandingLayout>
  );
}



function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24">
      <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-full max-w-[1000px] h-[600px] opacity-80 pointer-events-none z-0 mix-blend-screen">
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
          <Orb
            hoverIntensity={2}
            rotateOnHover
            hue={0}
            forceHoverState={false}
            backgroundColor="#000000"
          />
        </div>
      </div>
      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <a
          href="/auth/register"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2D6FFF]/40 bg-[#2D6FFF]/10 text-sm text-[#82AAFF] mb-8"
        >
          🎉 Introducing ZoomX — The future of video conferencing. Sign up free
          <ArrowRight className="w-3.5 h-3.5" />
        </a>

        <h1 className="font-display font-extrabold tracking-tight text-5xl md:text-7xl leading-[1.05] max-w-4xl mx-auto">
          Connect Anywhere.<br />
          <span className="bg-gradient-to-r from-[#82AAFF] via-[#2D6FFF] to-[#7B5CFF] bg-clip-text text-transparent">
            Collaborate Everywhere.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[#8888AA] mt-6 max-w-2xl mx-auto">
          Premium video meetings for teams of all sizes. Crystal-clear audio, immersive video,
          and powerful collaboration tools — all in one place.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/auth/register"
            className="px-8 py-4 rounded-2xl bg-[#2D6FFF] hover:bg-[#1A5AE8] text-white font-semibold transition btn-glow inline-flex items-center gap-2"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="px-8 py-4 rounded-2xl border border-[#22223A] hover:bg-[#1A1A26] font-semibold transition"
          >
            See how it works
          </a>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 text-sm text-[#8888AA]">
          <div className="flex -space-x-2">
            {["SC", "MR", "PN", "AJ", "TK"].map((i, idx) => (
              <span
                key={i}
                className="w-7 h-7 rounded-full border-2 border-[#0A0A0F] text-[10px] flex items-center justify-center text-white font-semibold"
                style={{
                  background: ["#2D6FFF", "#7B5CFF", "#00C566", "#FF8A3D", "#FF3B9A"][idx],
                }}
              >
                {i}
              </span>
            ))}
          </div>
          <span>Trusted by 50,000+ teams worldwide</span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#FFB23D] text-[#FFB23D]" />
            <span className="text-white font-medium">4.9/5</span>
          </span>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  const tiles = [
    { name: "Sarah Chen", initials: "SC", gradient: "linear-gradient(135deg,#2D6FFF,#7B5CFF)", image: "/sarah_chen.png" },
    { name: "Marcus Reid", initials: "MR", gradient: "linear-gradient(135deg,#00C566,#2D6FFF)", image: "/marcus_reid.png" },
    { name: "Priya Nair", initials: "PN", gradient: "linear-gradient(135deg,#FF3B55,#FF8A3D)", muted: true, image: "/priya_nair.png" },
    { name: "You", initials: "YO", gradient: "linear-gradient(135deg,#7B5CFF,#FF3B9A)", image: "/you.png" },
  ];
  return (
    <div className="relative mt-14 mx-auto max-w-5xl">
      <div className="absolute -inset-8 rounded-3xl bg-[#2D6FFF]/15 blur-3xl pointer-events-none" />
      <div className="relative rounded-3xl bg-[#0D0D1A] border border-[#1E1E2E] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#1E1E2E]">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF3B55]/60" />
            <span className="w-3 h-3 rounded-full bg-[#FFB23D]/60" />
            <span className="w-3 h-3 rounded-full bg-[#00C566]/60" />
          </div>
          <div className="text-xs text-[#8888AA]">Product Sync — Q3 Roadmap • 00:14:32</div>
          <div className="text-xs flex items-center gap-1.5 text-[#3FE39B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C566] animate-pulse" />
            Live
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 bg-black">
          {tiles.map((t) => (
            <div
              key={t.name}
              className="relative aspect-video rounded-2xl overflow-hidden border border-[#1E1E2E] flex items-center justify-center group"
            >
              {/* Video Feed Image */}
              <img
                src={t.image}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                alt={t.name}
              />
              
              {/* Ambient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

              {/* Name Tag */}
              <span className="absolute bottom-2.5 left-2.5 text-xs px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-medium border border-white/10 shadow-lg flex items-center gap-1.5">
                {t.name}
              </span>

              {/* Mic Icon Status */}
              <span className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-lg flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
                {t.muted ? <MicOff className="w-3.5 h-3.5 text-[#FF4D6A]" /> : <Mic className="w-3.5 h-3.5 text-[#3FE39B]" />}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 py-3 bg-[#111118] border-t border-[#1E1E2E]">
          {[Mic, Video, Users, Calendar].map((Icon, i) => (
            <span key={i} className="w-9 h-9 rounded-lg bg-[#2D2D3D] flex items-center justify-center">
              <Icon className="w-4 h-4 text-white" />
            </span>
          ))}
          <span className="ml-2 px-4 h-9 rounded-lg bg-[#FF3B55] text-white text-xs flex items-center font-medium">Leave</span>
        </div>
      </div>
    </div>
  );
}

function BrandLogo({ name }: { name: string }) {
  const brandConfig: Record<string, { logoColor: string; glowColor: string }> = {
    Vercel: { logoColor: "text-white group-hover:text-white", glowColor: "rgba(255,255,255,0.4)" },
    Linear: { logoColor: "text-zinc-400 group-hover:text-[#5E6AD2]", glowColor: "rgba(94,106,210,0.5)" },
    Stripe: { logoColor: "text-zinc-400 group-hover:text-[#635BFF]", glowColor: "rgba(99,91,255,0.5)" },
    Notion: { logoColor: "text-zinc-400 group-hover:text-white", glowColor: "rgba(255,255,255,0.4)" },
    Figma: { logoColor: "text-white", glowColor: "rgba(242,78,30,0.5)" },
    Loom: { logoColor: "text-white", glowColor: "rgba(98,93,245,0.5)" },
    Slack: { logoColor: "text-white", glowColor: "rgba(54,197,240,0.4)" },
    Dropbox: { logoColor: "text-white", glowColor: "rgba(0,97,255,0.5)" },
    Atlassian: { logoColor: "text-white", glowColor: "rgba(0,82,204,0.5)" },
    GitHub: { logoColor: "text-zinc-400 group-hover:text-white", glowColor: "rgba(255,255,255,0.4)" },
  };

  const logos: Record<string, React.ReactNode> = {
    Vercel: (
      <svg viewBox="0 0 76 65" fill="currentColor" className="h-6 w-auto">
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
      </svg>
    ),
    Linear: (
      <svg viewBox="0 0 100 100" fill="currentColor" className="h-6 w-auto">
        <path d="M1.226 61.523a1.1 1.1 0 001.597.857l37.966-37.967a1.1 1.1 0 00-.857-1.596C17.69 18.96 5.607 30.683 1.226 61.523zM.002 46.889a1.1 1.1 0 00.289.76L52.35 99.709a1.1 1.1 0 00.76.289c2.37-.148 4.694-.46 6.963-.926a1.1 1.1 0 00.478-1.648L2.576 39.449a1.1 1.1 0 00-1.648.478 49.77 49.77 0 00-.926 6.962zM4.714 31.662a1.1 1.1 0 00.265 1.069l62.398 62.398a1.1 1.1 0 001.069.265c1.643-.39 3.262-.844 4.851-1.362a1.1 1.1 0 00.346-1.71L7.776 26.465a1.1 1.1 0 00-1.71.346 48.3 48.3 0 00-1.352 4.851zM12.059 18.877a1.1 1.1 0 00-.25 1.383l67.972 67.971a1.1 1.1 0 001.383-.25c.973-1.478 1.888-3.003 2.734-4.572a1.1 1.1 0 00-.502-1.74L16.106 16.16a1.1 1.1 0 00-1.739-.502 47.63 47.63 0 00-4.308 3.219zM22.711 8.913a1.1 1.1 0 00-.279.753L91.336 77.544a1.1 1.1 0 00.753-.279c1.095-.962 2.152-1.97 3.162-3.021a1.1 1.1 0 00-.039-1.558L24.59 8.556a1.1 1.1 0 00-1.557-.039 49.8 49.8 0 00-.322.396z" />
      </svg>
    ),
    Stripe: (
      <svg viewBox="0 0 60 25" fill="currentColor" className="h-6 w-auto">
        <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 01-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.23c0-1.85-1.07-2.58-2.06-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.44.94V6.27h3.94l.19 1.06c.55-.72 1.55-1.34 3.01-1.34 2.99 0 5.55 2.6 5.55 7.04 0 4.96-2.55 7.27-5.33 7.27zM40 9.38c-.95 0-1.54.34-1.97.81l.02 6.34c.43.44 1 .78 1.95.78 1.52 0 2.54-1.65 2.54-3.97 0-2.15-.99-3.96-2.54-3.96zM28.24 5.07c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.44.94V1.09L25.32.15l.19 1.06c.55-.72 1.55-1.34 3.01-1.34 2.99 0 5.55 2.6 5.55 7.04 0 4.96-2.55 7.27-5.33 7.27-.74 0-1.46-.16-2.08-.45v4.5l-4.44.94V6.27h3.94l.19 1.06c.55-.72 1.55-1.34 3.01-1.34 2.99 0 5.55 2.6 5.55 7.04 0 4.96-2.55 7.27-5.33 7.27zM16.35 5.07c-1.44 0-2.32-.6-2.9-1.04L13.43 8.66l-4.44.94V6.27h3.94l.19 1.06c.55-.72 1.55-1.34 3.01-1.34 2.99 0 5.55 2.6 5.55 7.04 0 .23-.01.45-.02.67h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 01-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48C9.46 8.4 11.85 5.07 16.35 5.07z" />
      </svg>
    ),
    Notion: (
      <svg viewBox="0 0 100 100" fill="currentColor" className="h-6 w-auto">
        <path d="M6.012 7.698C8.67 9.84 9.639 9.703 14.67 9.354l51.401-3.094c1.04 0 .14-.972-.347-1.114L57.79 1.724c-1.733-1.322-4.044-2.853-8.437-2.503L4.002 2.733c-1.802.14-2.152 1.045-1.39 1.74l3.4 3.225zm3.4 13.044v54.063c0 2.922 1.455 4.036 4.739 3.824l55.301-3.193c3.286-.208 3.636-2.295 3.636-4.734V17.032c0-2.365-1.04-3.687-3.288-3.476l-56.963 3.31c-2.39.21-3.426 1.392-3.426 3.876zm54.116 4.036c.35 1.532 0 3.06-1.533 3.26l-2.525.487v37.061c-2.18 1.115-4.18 1.74-5.852 1.74-2.668 0-3.356-.836-5.354-3.37L32.744 44.29v28.31l6.193 1.322s0 3.063-4.253 3.063L22.81 77.56c-.352-1.114 0-3.893 2.523-4.247l6.567-1.878V31.388l-9.082-.63c-.35-1.532.349-3.756 2.98-3.961l12.12-.836L54.01 48.047V22.29l-5.216-.556c-.35-1.878.698-3.59 2.389-3.756L61.18 17.73l2.347.048z" />
      </svg>
    ),
    Figma: (
      <svg viewBox="0 0 38 57" fill="currentColor" className="h-6 w-auto">
        <path d="M19 28.5a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z" fill="#1ABCFE"/>
        <path d="M0 47.5A9.5 9.5 0 019.5 38H19v9.5a9.5 9.5 0 01-19 0z" fill="#0ACF83"/>
        <path d="M19 0v19h9.5a9.5 9.5 0 000-19H19z" fill="#FF7262"/>
        <path d="M0 9.5A9.5 9.5 0 019.5 0H19v19H9.5A9.5 9.5 0 010 9.5z" fill="#F24E1E"/>
        <path d="M0 28.5A9.5 9.5 0 019.5 19H19v19H9.5A9.5 9.5 0 010 28.5z" fill="#A259FF"/>
      </svg>
    ),
    Loom: (
      <svg viewBox="0 0 36 36" className="h-6 w-auto">
        <circle cx="18" cy="18" r="18" fill="#625DF5"/>
        <path d="M27 18c0-4.971-4.029-9-9-9s-9 4.029-9 9 4.029 9 9 9 9-4.029 9-9zm-9 4.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" fill="white"/>
        <circle cx="18" cy="18" r="2.5" fill="white"/>
      </svg>
    ),
    Slack: (
      <svg viewBox="0 0 54 54" className="h-6 w-auto">
        <path d="M19.712.133a5.381 5.381 0 00-5.376 5.387 5.381 5.381 0 005.376 5.386h5.376V5.52A5.381 5.381 0 0019.712.133m0 14.365H5.376A5.381 5.381 0 000 19.884a5.381 5.381 0 005.376 5.387h14.336a5.381 5.381 0 005.376-5.387 5.381 5.381 0 00-5.376-5.386" fill="#36C5F0"/>
        <path d="M53.76 19.884a5.381 5.381 0 00-5.376-5.386 5.381 5.381 0 00-5.376 5.386v5.387h5.376a5.381 5.381 0 005.376-5.387m-14.336 0V5.52A5.381 5.381 0 0034.048.133a5.381 5.381 0 00-5.376 5.387v14.364a5.381 5.381 0 005.376 5.387 5.381 5.381 0 005.376-5.387" fill="#2EB67D"/>
        <path d="M34.048 54a5.381 5.381 0 005.376-5.387 5.381 5.381 0 00-5.376-5.386h-5.376v5.386A5.381 5.381 0 0034.048 54m0-14.365h14.336a5.381 5.381 0 005.376-5.386 5.381 5.381 0 00-5.376-5.387H34.048a5.381 5.381 0 00-5.376 5.387 5.381 5.381 0 005.376 5.386" fill="#ECB22E"/>
        <path d="M0 34.249a5.381 5.381 0 005.376 5.386 5.381 5.381 0 005.376-5.386v-5.387H5.376A5.381 5.381 0 000 34.249m14.336 0v14.364A5.381 5.381 0 0019.712 54a5.381 5.381 0 00-5.376-5.387V34.249a5.381 5.381 0 00-5.376-5.387 5.381 5.381 0 00-5.376 5.387" fill="#E01E5A"/>
      </svg>
    ),
    Dropbox: (
      <svg viewBox="0 0 43 40" className="h-6 w-auto">
        <path d="M12.6 0L0 8.027l8.917 7.18L21.5 7.28 12.6 0zm17.9 0l-8.9 7.28 12.583 7.926L43 7.207 30.5 0zM0 22.38l12.6 8.027 8.9-7.207-12.583-7.926L0 22.38zm43 .726L30.5 15.08l-8.9 7.28L34.1 30.407 43 23.106zM12.6 32.473L21.5 40l8.9-7.527-8.9-7.18-8.9 7.18z" fill="#0061FF"/>
      </svg>
    ),
    Atlassian: (
      <svg viewBox="0 0 32 32" className="h-6 w-auto">
        <path d="M11.53 15.73c-.32-.41-1.15-1.54-1.53-2.04-.44-.59-.3-1.39.31-1.8l5.5-3.53c.25-.16.53-.25.82-.25.47 0 .89.2 1.19.53l5.01 5.41c.44.47.44 1.21 0 1.68l-5.01 5.41c-.3.33-.72.53-1.19.53-.29 0-.57-.09-.82-.25l-5.5-3.53c-.49-.31-.7-.93-.45-1.44z" fill="#0052CC"/>
        <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm5.5 19.47l-5.5 3.53c-.25.16-.53.25-.82.25-.47 0-.89-.2-1.19-.53l-5.01-5.41a1.19 1.19 0 010-1.68l5.01-5.41c.3-.33.72-.53 1.19-.53.29 0 .57.09.82.25l5.5 3.53c.61.41.75 1.21.31 1.8-.38.5-1.21 1.63-1.53 2.04.25.51.04 1.13-.45 1.44z" fill="#2684FF"/>
      </svg>
    ),
    GitHub: (
      <svg viewBox="0 0 98 96" fill="currentColor" className="h-6 w-auto">
        <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0112.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
      </svg>
    ),
  };

  const svgLogo = logos[name];
  const { logoColor, glowColor } = brandConfig[name] || { logoColor: "text-white", glowColor: "rgba(255,255,255,0.3)" };

  return (
    <div 
      className="relative flex flex-col items-center justify-center w-44 h-20 rounded-2xl bg-gradient-to-b from-zinc-950/40 to-zinc-950/70 border border-white/[0.03] transition-all duration-500 hover:scale-[1.04] hover:bg-zinc-950/90 hover:border-white/[0.15] cursor-pointer group shrink-0"
      style={{ 
        boxShadow: `0 0 0px transparent, inset 0 0 0px transparent`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 10px 30px -10px ${glowColor}, inset 0 1px 0 0 rgba(255,255,255,0.1)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `none`;
      }}
    >
      {/* Dynamic colorful radial glow inside the card on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl rounded-2xl pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` 
        }}
      />
      
      {/* Neon reflection at the top of the card */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/30 transition-all duration-500" />
      
      {/* Brand Logo Wrapper */}
      <div 
        className={`h-7 flex items-center justify-center transition-all duration-500 group-hover:scale-108 filter grayscale opacity-45 group-hover:grayscale-0 group-hover:opacity-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${logoColor}`}
      >
        {svgLogo || <span className="text-lg font-bold text-white">{name}</span>}
      </div>
      
      {/* Brand Name */}
      <span className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase group-hover:text-zinc-300 transition-colors duration-300 mt-2 font-sans">
        {name}
      </span>
    </div>
  );
}

function BrandsLogoBar() {
  const logos = [
    "Vercel",
    "Linear",
    "Stripe",
    "Notion",
    "Figma",
    "Loom",
    "Slack",
    "Dropbox",
    "Atlassian",
    "GitHub"
  ];
  return (
    <section className="w-full py-12 bg-black border-y border-white/[0.04] overflow-hidden relative">
      {/* Decorative gradient lines at border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-[11px] tracking-[0.25em] uppercase text-zinc-400 font-bold bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Trusted by teams at the world's best companies
        </p>
      </div>
      
      <div className="flex overflow-hidden select-none gap-8 w-full group relative py-4">
        {/* Soft edge blur overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

        <div className="flex shrink-0 justify-around min-w-full gap-8 animate-marquee group-hover:[animation-play-state:paused]">
          {logos.map((logo, idx) => (
            <BrandLogo key={`${logo}-${idx}`} name={logo} />
          ))}
        </div>
        <div className="flex shrink-0 justify-around min-w-full gap-8 animate-marquee group-hover:[animation-play-state:paused]" aria-hidden="true">
          {logos.map((logo, idx) => (
            <BrandLogo key={`${logo}-dup-${idx}`} name={logo} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardItems = [
    { icon: Video, title: "HD Video & Audio", desc: "Crystal clear 1080p video with AI noise cancellation for distraction-free meetings" },
    { icon: Shield, title: "Enterprise Security", desc: "End-to-end encryption and SOC 2 compliant infrastructure for your peace of mind" },
    { icon: Calendar, title: "Smart Scheduling", desc: "One-click meeting scheduling with calendar integration and automatic reminders" },
    { icon: Users, title: "Team Collaboration", desc: "Breakout rooms, whiteboards, and real-time document collaboration built right in" },
    { icon: Globe, title: "Works Everywhere", desc: "Join from any device — browser, mobile, or desktop app. No downloads required" },
    { icon: Zap, title: "Instant Meetings", desc: "Start a meeting in one click and invite your team with a single shareable link" },
  ];

  return (
    <section id="features" className="relative py-24 bg-[#08090A] overflow-hidden">
      {/* Central faint radial blue glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none z-0" />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6] mb-4 font-sans">
            Features
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Everything you need to run{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              great meetings
            </span>
          </h2>
          <p className="mt-4 text-[#A0AEC0] text-lg max-w-2xl mx-auto font-sans font-medium">
            Powerful features designed to make every meeting more productive than the last.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cardItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="group relative flex flex-col justify-between p-8 rounded-2xl bg-[#0F1117]/60 backdrop-blur border border-white/10 hover:border-[#3B82F6]/50 hover:-translate-y-1 shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_35px_rgba(59,130,246,0.1)] transition-all duration-300 ease-out cursor-pointer h-full"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-indigo-500/10 border border-[#3B82F6]/30 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-300">
                    <Icon className="w-6 h-6 text-[#3B82F6] group-hover:animate-pulse" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#A0AEC0] text-sm leading-relaxed mb-6 font-medium">
                    {item.desc}
                  </p>
                </div>
                
                <div className="flex justify-end opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="w-5 h-5 text-[#3B82F6]" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function Counter({ value, duration = 2 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const isFloat = value.includes(".");
  const cleanVal = parseFloat(value.replace(/,/g, ""));
  
  useEffect(() => {
    if (!isInView) return;
    const end = cleanVal;
    const totalSteps = 60;
    const stepTime = (duration * 1000) / totalSteps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const current = end * (progress * (2 - progress));
      
      if (step >= totalSteps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [isInView, cleanVal, duration]);

  let formatted = "";
  if (isFloat) {
    formatted = count.toFixed(1);
  } else {
    formatted = Math.floor(count).toLocaleString();
  }

  return <span ref={ref}>{formatted}</span>;
}

function StatsSection() {
  const stats = [
    { value: "50,000", suffix: "+", label: "Teams worldwide" },
    { value: "99.9", suffix: "%", label: "Uptime SLA" },
    { value: "180", suffix: "+", label: "Countries supported" },
    { value: "4.9", suffix: " / 5", label: "Average rating" }
  ];

  return (
    <section className="relative py-24 bg-[#08090A] border-y border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="relative flex flex-col items-center group">
              <div className="absolute -inset-4 bg-[#3B82F6]/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-2">
                <Counter value={stat.value} />
                <span className="text-[#3B82F6]">{stat.suffix}</span>
              </div>
              <p className="text-[#A0AEC0] text-xs md:text-sm font-semibold uppercase tracking-wider font-sans">
                {stat.label}
              </p>
              
              {idx < 3 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-white/[0.08]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepConnector() {
  return (
    <div className="hidden md:block absolute top-12 left-[calc(100%-40px)] w-[calc(100%-80px)] z-0 pointer-events-none">
      <svg className="w-full h-2 text-white/10" fill="none">
        <line
          x1="0"
          y1="4"
          x2="100%"
          y2="4"
          stroke="currentColor"
          strokeWidth="2"
          className="animate-dash-offset text-[#3B82F6]/30"
        />
      </svg>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: Users,
      title: "Create Account",
      desc: "Register in 30 seconds"
    },
    {
      n: "02",
      icon: Calendar,
      title: "Start or Schedule",
      desc: "Launch instantly or plan ahead"
    },
    {
      n: "03",
      icon: Video,
      title: "Invite & Connect",
      desc: "Share a link, collaborate anywhere"
    }
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const stepVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
      },
    },
  };

  return (
    <section id="how" className="relative py-24 bg-[#08090A] bg-dot-grid overflow-hidden border-y border-white/[0.04]">
      <div className="absolute inset-0 bg-[#08090A]/90 pointer-events-none z-0" />
      
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6] mb-4 font-sans">
            How it works
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Up and running in{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              3 steps
            </span>
          </h2>
          <p className="mt-4 text-[#A0AEC0] text-lg max-w-xl mx-auto font-sans font-medium">
            From sign-up to your first meeting in under 60 seconds.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-12 relative"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.n}
                variants={stepVariants}
                className="relative flex flex-col items-center text-center group z-10"
              >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 font-display font-black text-8xl md:text-9xl text-white/[0.02] select-none pointer-events-none group-hover:text-blue-500/[0.04] transition-colors duration-500">
                  {step.n}
                </div>

                {idx < 2 && <StepConnector />}

                <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-[#0F1117] border border-white/10 group-hover:border-[#3B82F6]/50 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] mb-6 transition-all duration-300">
                  <Icon className="w-8 h-8 text-[#3B82F6]" />
                </div>

                <h3 className="font-display text-xl font-bold text-white mb-2 relative z-10">
                  {step.title}
                </h3>
                <p className="text-[#A0AEC0] text-sm md:text-base max-w-xs relative z-10 leading-relaxed font-sans font-medium">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

function TiltCard({ children, className }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;
    
    const rotX = -yc * 12;
    const rotY = xc * 12;
    
    setTransformStyle(`perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: transformStyle === "" ? "all 0.5s ease-out" : "transform 0.1s ease-out",
      }}
      className={`card-sweep ${className}`}
    >
      <div className="card-sweep-inner glassmorphism">
        {children}
      </div>
    </div>
  );
}

function Testimonials() {
  const testimonials = [
    {
      q: "ZoomX transformed how our remote team collaborates. The video quality is unmatched.",
      n: "Sarah Chen",
      t: "CTO at Dropwave",
      i: "SC",
      g: "from-[#3B82F6] to-indigo-500"
    },
    {
      q: "We switched from Zoom and never looked back. Cleaner UI, faster performance.",
      n: "Marcus Reid",
      t: "Product Lead at Fieldstack",
      i: "MR",
      g: "from-indigo-500 to-purple-500"
    },
    {
      q: "Scheduling meetings used to be painful. ZoomX makes it a 10-second task.",
      n: "Priya Nair",
      t: "Engineering Manager at Coreloop",
      i: "PN",
      g: "from-[#3B82F6] to-emerald-500"
    }
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 14,
      },
    },
  };

  return (
    <section id="testimonials" className="relative py-24 bg-[#08090A] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6] mb-4 font-sans">
            Customers
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Loved by{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              teams worldwide
            </span>
          </h2>
          <p className="mt-4 text-[#A0AEC0] text-lg max-w-xl mx-auto font-sans font-medium">
            See what teams are saying after making the switch.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div key={t.n} variants={cardVariants}>
              <TiltCard className="rounded-2xl h-full shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                <div className="relative p-8 h-full flex flex-col justify-between overflow-hidden">
                  
                  <span className="absolute -top-2 -left-2 font-serif text-[120px] text-blue-500/[0.04] leading-none pointer-events-none select-none">
                    “
                  </span>
                  
                  <div className="relative z-10">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    <p className="text-white text-[15px] md:text-base leading-relaxed font-normal mb-8">
                      "{t.q}"
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.g} p-[2px]`}>
                      <div className="w-full h-full rounded-full bg-[#0F1117] flex items-center justify-center text-white font-bold text-xs">
                        {t.i}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{t.n}</h4>
                      <p className="text-xs text-[#A0AEC0] font-sans font-medium">{t.t}</p>
                    </div>
                  </div>

                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 14,
      },
    },
  };

  return (
    <section id="pricing" className="relative py-24 bg-[#08090A] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6] mb-4 font-sans">
              Pricing
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Simple, transparent{" "}
              <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
                pricing
              </span>
            </h2>
            <p className="mt-4 text-[#A0AEC0] text-lg max-w-xl font-sans font-medium">
              No hidden fees. No surprise bills. Cancel anytime.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#0F1117]/80 border border-white/10 rounded-full p-1.5 self-start md:self-auto shadow-md">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
                !isYearly
                  ? "bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/25"
                  : "text-[#A0AEC0] hover:text-white cursor-pointer"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all duration-300 ${
                isYearly
                  ? "bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/25"
                  : "text-[#A0AEC0] hover:text-white cursor-pointer"
              }`}
            >
              Yearly
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-3 gap-8 items-stretch pt-4"
        >
          {/* Card 1: Starter */}
          <motion.div
            variants={cardVariants}
            className="flex flex-col justify-between p-8 rounded-2xl bg-[#0F1117]/60 backdrop-blur border border-white/10 hover:border-[#3B82F6]/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.05)] transition-all duration-300 ease-out cursor-pointer"
          >
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-2">Starter</h3>
              <p className="text-[#A0AEC0] text-sm mb-6 font-medium font-sans">Perfect for quick, casual meetings.</p>
              
              <div className="flex items-baseline text-white mb-8">
                <span className="text-4xl md:text-5xl font-black">$0</span>
                <span className="text-sm text-[#A0AEC0] ml-2 font-medium font-sans">/ month</span>
              </div>

              <ul className="space-y-4 border-t border-white/[0.06] pt-6 mb-8 text-sm">
                {["Up to 5 participants", "40 minute meeting limit", "HD video quality", "Basic scheduling", "Chat support"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-[#A0AEC0] font-medium font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <Link
              href="/auth/register"
              className="block w-full text-center py-3.5 rounded-xl border border-white/10 hover:border-[#3B82F6] hover:bg-[#3B82F6]/5 text-white font-semibold transition-all duration-300 font-sans"
            >
              Get started free
            </Link>
          </motion.div>

          {/* Card 2: Pro */}
          <motion.div
            variants={cardVariants}
            className="relative flex flex-col justify-between p-8 rounded-2xl bg-[#0F1117] border-2 border-[#3B82F6] lg:scale-105 hover:-translate-y-1 shadow-[0_15px_40px_rgba(59,130,246,0.15)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.25)] transition-all duration-300 ease-out cursor-pointer z-10"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#3B82F6] to-indigo-500 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-lg">
              Most Popular
            </div>

            <div>
              <h3 className="font-display font-bold text-xl text-white mb-2 mt-2">Pro</h3>
              <p className="text-[#A0AEC0] text-sm mb-6 font-medium font-sans">Designed for professional teams.</p>
              
              <div className="flex items-baseline text-white mb-8">
                <span className="text-4xl md:text-5xl font-black">
                  {isYearly ? "$9.60" : "$12"}
                </span>
                <span className="text-sm text-[#A0AEC0] ml-2 font-medium font-sans">/ month per user</span>
              </div>

              <ul className="space-y-4 border-t border-white/[0.08] pt-6 mb-8 text-sm">
                {[
                  "Unlimited participants",
                  "No time limit",
                  "1080p HD + AI noise cancellation",
                  "Smart scheduling + calendar sync",
                  "Breakout rooms + whiteboard",
                  "Priority support"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-[#A0AEC0] font-medium font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <Link
              href="/auth/register"
              className="block w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-indigo-500 text-white font-semibold shadow-lg shadow-[#3B82F6]/20 hover:shadow-[#3B82F6]/45 transition-all duration-300 btn-glow font-sans"
            >
              Start free trial
            </Link>
          </motion.div>

          {/* Card 3: Enterprise */}
          <motion.div
            variants={cardVariants}
            className="flex flex-col justify-between p-8 rounded-2xl bg-[#0F1117]/60 backdrop-blur border border-white/10 hover:border-[#3B82F6]/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.05)] transition-all duration-300 ease-out cursor-pointer"
          >
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-2">Enterprise</h3>
              <p className="text-[#A0AEC0] text-sm mb-6 font-medium font-sans">For large-scale organization needs.</p>
              
              <div className="flex items-baseline text-white mb-8">
                <span className="text-4xl md:text-5xl font-black">Custom</span>
              </div>

              <ul className="space-y-4 border-t border-white/[0.06] pt-6 mb-8 text-sm">
                {[
                  "Everything in Pro",
                  "SSO + SAML authentication",
                  "SOC 2 compliance",
                  "Dedicated account manager",
                  "SLA guarantee",
                  "Custom integrations"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-[#A0AEC0] font-medium font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <Link
              href="/auth/register"
              className="block w-full text-center py-3.5 rounded-xl border border-white/10 hover:border-[#3B82F6] hover:bg-[#3B82F6]/5 text-white font-semibold transition-all duration-300 font-sans"
            >
              Contact sales
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="relative py-24 bg-[#08090A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="relative rounded-3xl p-12 md:p-24 overflow-hidden border border-[#3B82F6]/25 shadow-[0_20px_50px_rgba(59,130,246,0.1)]"
          style={{
            background: "radial-gradient(circle at center, #0F1A3A 0%, #090B10 100%)"
          }}
        >
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-repeat bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')] pointer-events-none" />

          {/* Glowing blur orb blob 1: blue top-left */}
          <div className="absolute -top-24 -left-24 w-[350px] h-[350px] bg-[#3B82F6]/20 rounded-full blur-[80px] pointer-events-none" />

          {/* Glowing blur orb blob 2: violet bottom-right */}
          <div className="absolute -bottom-24 -right-24 w-[350px] h-[350px] bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Ready to transform how your{" "}
              <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                team meets?
              </span>
            </h2>
            <p className="text-[#A0AEC0] text-lg md:text-xl font-medium mb-10 font-sans">
              Start for free. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#08090A] font-bold hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 font-sans"
              >
                Start for free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-bold transition-all duration-300 flex items-center justify-center font-sans"
              >
                Talk to sales
              </Link>
            </div>

            <p className="text-[#A0AEC0]/60 text-xs md:text-sm tracking-wide font-sans font-medium">
              Join 50,000+ teams · Setup in 30 seconds · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type Workload = "collaboration" | "support" | "marketing" | "sales";

function PlatformSection() {
  const [activeTab, setActiveTab] = useState<Workload>("collaboration");

  const tabs = [
    {
      id: "collaboration" as Workload,
      title: "Collaboration",
      icon: Users,
      desc: "Connect your team with shared digital whiteboards, group channels, and collaborative instant meetings.",
      mockup: <CollaborationMockup />,
    },
    {
      id: "support" as Workload,
      title: "Customer Support",
      icon: MessageSquare,
      desc: "Empower helpdesk agents with AI-driven quick response suggestions, caller profiles, and live sentiment analysis.",
      mockup: <SupportMockup />,
    },
    {
      id: "marketing" as Workload,
      title: "Marketing & Events",
      icon: Megaphone,
      desc: "Produce premium webinars with live interactive polls, audience Q&A boards, and custom presentation controls.",
      mockup: <MarketingMockup />,
    },
    {
      id: "sales" as Workload,
      title: "Sales & Revenue",
      icon: BadgeDollarSign,
      desc: "Accelerate deal closure with real-time meeting transcription highlights, CRM syncing, and automated task tracking.",
      mockup: <SalesMockup />,
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section className="relative py-24 bg-[#08090A] border-y border-white/[0.04] overflow-hidden">
      {/* Background soft glowing orb */}
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6] mb-4 font-sans">
            Unified Platform
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            One platform.{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              Endless ways to work together.
            </span>
          </h2>
          <p className="mt-4 text-[#A0AEC0] text-sm md:text-base max-w-xl mx-auto font-sans font-medium">
            See how ZoomX helps teams of all departments align, convert, and support with video-first intelligence.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Tabs List */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 ${
                    isActive
                      ? "bg-gradient-to-b from-[#11131c] to-[#0a0b10] border-[#3B82F6]/40 shadow-xl"
                      : "bg-[#0c0d12]/40 border-white/[0.03] hover:border-white/10 hover:bg-[#11131c]/20"
                  }`}
                >
                  {/* Glowing card border gradient effect on active */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#3B82F6]/10 to-transparent pointer-events-none" />
                  )}

                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition ${
                    isActive 
                      ? "bg-gradient-to-br from-[#3B82F6] to-indigo-600 text-white border-transparent shadow-[0_0_15px_rgba(59,130,246,0.35)]" 
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-white"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h3 className={`font-display font-bold text-base transition-colors ${
                      isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                    }`}>
                      {tab.title}
                    </h3>
                    <p className={`text-xs leading-relaxed transition-colors ${
                      isActive ? "text-zinc-300 font-medium" : "text-zinc-500 font-sans"
                    }`}>
                      {tab.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Tab Mockup Display */}
          <div className="lg:col-span-7 relative flex flex-col justify-center">
            {/* Colorful ambient background light tied to active tab color */}
            <div className="absolute -inset-4 rounded-3xl bg-[#3B82F6]/10 blur-2xl pointer-events-none transition-all duration-500" />
            
            <div className="relative min-h-[380px] lg:min-h-[420px] bg-zinc-950/70 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl p-2.5 backdrop-blur-xl flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full h-full flex flex-col flex-1"
                >
                  {currentTab.mockup}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CollaborationMockup() {
  const [shapes, setShapes] = useState<{ id: number; type: string; x: number; y: number; text?: string; color?: string }[]>([
    { id: 1, type: "sticky", x: 60, y: 40, text: "Brainstorming Session", color: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300" },
    { id: 2, type: "sticky", x: 230, y: 70, text: "Next.js 15 Migration", color: "bg-purple-500/20 border-purple-500/50 text-purple-300" },
    { id: 3, type: "rect", x: 100, y: 150, text: "Auth Workflow", color: "bg-blue-500/10 border-blue-500/50 text-blue-300" },
  ]);

  const addShape = (type: string) => {
    const id = Date.now();
    const x = 40 + Math.random() * 150;
    const y = 60 + Math.random() * 100;
    let newShape;
    if (type === "sticky") {
      newShape = { id, type, x, y, text: "New Idea", color: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" };
    } else {
      newShape = { id, type, x, y, text: "New Block", color: "bg-amber-500/10 border-amber-500/50 text-amber-300" };
    }
    setShapes([...shapes, newShape]);
  };

  return (
    <div className="w-full h-full bg-[#0d0e12] rounded-2xl border border-zinc-850 overflow-hidden flex flex-col shadow-2xl">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#13151b] border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-[#FF3B55]/60" />
            <span className="w-3 h-3 rounded-full bg-[#FFB23D]/60" />
            <span className="w-3 h-3 rounded-full bg-[#00C566]/60" />
          </div>
          <span className="text-[10px] font-semibold text-zinc-400">Board: Q3 Design Sync</span>
        </div>
        <div className="flex -space-x-1.5">
          {["SC", "MR", "PN", "YO"].map((usr, i) => (
            <span 
              key={usr} 
              className="w-5.5 h-5.5 rounded-full border border-[#0d0e12] text-[8px] flex items-center justify-center text-white font-bold"
              style={{ 
                background: ["#2D6FFF", "#7B5CFF", "#00C566", "#FF8A3D"][i],
                width: "22px",
                height: "22px"
              }}
            >
              {usr}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 relative min-h-[300px]">
        {/* Left whiteboard toolbar */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-2 bg-[#181a20]/95 border border-zinc-800 rounded-xl z-20 shadow-xl">
          <button 
            onClick={() => addShape("sticky")} 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800/50 hover:bg-[#2D6FFF]/20 hover:text-[#2D6FFF] text-zinc-300 border border-transparent hover:border-[#2D6FFF]/30 transition-all"
            title="Add Sticky Note"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => addShape("rect")} 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800/50 hover:bg-[#2D6FFF]/20 hover:text-[#2D6FFF] text-zinc-300 border border-transparent hover:border-[#2D6FFF]/30 transition-all"
            title="Add Shape"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <span className="h-[1px] bg-zinc-800 my-0.5" />
          <div className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500">
            <MousePointer className="w-3.5 h-3.5 text-[#2D6FFF]" />
          </div>
        </div>

        {/* Board Canvas */}
        <div className="absolute inset-0 bg-[#0d0e12] bg-[linear-gradient(to_right,#1b1d25_1px,transparent_1px),linear-gradient(to_bottom,#1b1d25_1px,transparent_1px)] bg-[size:24px_24px] overflow-hidden p-6">
          {/* Cursors */}
          <div className="absolute top-[60px] left-[150px] flex items-center gap-1 z-10 pointer-events-none animate-bounce" style={{ animationDuration: "3s" }}>
            <MousePointer className="w-3 h-3 text-purple-400 fill-purple-400 rotate-[90deg] -translate-x-1 -translate-y-1" />
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500 text-white font-bold whitespace-nowrap shadow-md">Marcus</span>
          </div>

          <div className="absolute top-[200px] left-[270px] flex items-center gap-1 z-10 pointer-events-none animate-pulse">
            <MousePointer className="w-3 h-3 text-emerald-400 fill-emerald-400 rotate-[90deg] -translate-x-1 -translate-y-1" />
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500 text-white font-bold whitespace-nowrap shadow-md">Priya drawing</span>
          </div>

          {/* Render Shapes */}
          {shapes.map((s) => (
            <motion.div
              key={s.id}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ left: s.x, top: s.y }}
              className={`absolute p-3 rounded-xl border shadow-lg flex flex-col justify-between ${
                s.type === "sticky" ? "w-28 h-28 max-w-[120px] aspect-square" : "w-36 h-20"
              } ${s.color}`}
            >
              <span className="text-[10px] font-bold leading-tight line-clamp-3">{s.text}</span>
              <div className="flex justify-between items-center mt-1 border-t border-white/5 pt-1">
                <span className="text-[7px] opacity-60 uppercase tracking-widest">{s.type}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SupportMockup() {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot" | "agent"; text: string; time: string }>>([
    { sender: "user", text: "Hey! Can I switch from a Monthly Pro plan to Yearly? I want the 20% discount.", time: "10:32 AM" },
    { sender: "bot", text: "Hello! AI Copilot here. I can assist you with that right away. Let me check your account details...", time: "10:32 AM" },
  ]);

  const [aiSuggestions, setAiSuggestions] = useState([
    "Sure! Let me generate the checkout link with the yearly discount applied.",
    "Yes, I can upgrade you. It will be billed as $115.20 annually.",
    "Let me connect you with a billing representative."
  ]);

  const sendResponse = (text: string) => {
    setMessages((prev) => [...prev, { sender: "agent", text, time: "10:33 AM" }]);
    setAiSuggestions([]);
  };

  return (
    <div className="w-full h-full bg-[#0d0e12] rounded-2xl border border-zinc-850 overflow-hidden flex flex-col shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#13151b] border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40">
            <Bot className="w-3 h-3 text-[#3B82F6]" />
          </span>
          <span className="text-[10px] font-semibold text-zinc-300">ZoomX Support Console</span>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#00C566]/20 text-[#00C566] font-bold border border-[#00C566]/30">Active</span>
      </div>

      <div className="flex flex-1 flex-col sm:flex-row overflow-hidden min-h-[300px]">
        {/* Conversations list sidebar */}
        <div className="w-full sm:w-36 bg-[#101218] border-b sm:border-b-0 sm:border-r border-zinc-800/50 p-2 flex flex-col gap-1.5 shrink-0">
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider px-1">Chats Queue</span>
          <div className="p-1.5 rounded-lg bg-zinc-800/30 border border-zinc-700/50 flex flex-col gap-0.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-white truncate">Alex Mercer</span>
              <span className="w-1 h-1 rounded-full bg-orange-500" />
            </div>
            <span className="text-[8px] text-[#A0AEC0] truncate">Wants Pro Upgrade</span>
          </div>
          <div className="p-1.5 rounded-lg bg-transparent hover:bg-zinc-800/20 border border-transparent flex flex-col gap-0.5 cursor-pointer">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-medium text-zinc-400 truncate">Liam Vance</span>
            </div>
            <span className="text-[8px] text-zinc-500 truncate">Audio issues on iOS</span>
          </div>
        </div>

        {/* Chat Workspace */}
        <div className="flex-1 flex flex-col bg-[#0b0c10] p-3 justify-between">
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[160px] mb-2 pr-1">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`max-w-[90%] rounded-xl p-2 text-[10px] leading-relaxed ${
                  m.sender === "user" 
                    ? "bg-zinc-800/60 text-zinc-200 self-start border border-zinc-700/30" 
                    : m.sender === "bot"
                    ? "bg-[#3B82F6]/10 text-[#82AAFF] self-start border border-[#3B82F6]/25"
                    : "bg-[#3B82F6] text-white self-end"
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5 opacity-60 text-[8px] font-semibold">
                  <span>{m.sender === "user" ? "Alex Mercer" : m.sender === "bot" ? "AI Copilot" : "You (Agent)"}</span>
                  <span>•</span>
                  <span>{m.time}</span>
                </div>
                <p>{m.text}</p>
              </div>
            ))}
          </div>

          {/* AI Suggestions Panel */}
          {aiSuggestions.length > 0 && (
            <div className="bg-[#101218] border border-[#3B82F6]/20 p-2 rounded-xl mb-2">
              <div className="flex items-center gap-1 text-[8px] font-bold text-[#82AAFF] uppercase tracking-wider mb-1.5">
                <Sparkles className="w-2.5 h-2.5 text-[#3B82F6]" />
                <span>AI Suggested Responses (Click to send)</span>
              </div>
              <div className="flex flex-col gap-1">
                {aiSuggestions.map((s, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => sendResponse(s)}
                    className="w-full text-left p-1.5 rounded bg-zinc-900 hover:bg-[#3B82F6]/10 border border-zinc-800 hover:border-[#3B82F6]/30 text-[9px] text-zinc-300 hover:text-white transition-all truncate"
                  >
                    "{s}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Type message here..." 
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-[10px] text-white focus:outline-none focus:border-zinc-700 font-sans" 
              disabled
            />
            <button className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-400 flex items-center justify-center cursor-not-allowed">
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketingMockup() {
  const [votes, setVotes] = useState({ ai: 54, whiteboard: 32, security: 14 });
  const [userVoted, setUserVoted] = useState(false);
  const [messages, setMessages] = useState([
    { name: "Jessica K.", text: "Can we run this fully in the browser?", likes: 8 },
    { name: "Devon S.", text: "Is the AI transcription real-time?", likes: 4 }
  ]);

  const handleVote = (option: "ai" | "whiteboard" | "security") => {
    if (userVoted) return;
    setVotes((v) => ({
      ...v,
      [option]: v[option] + 1
    }));
    setUserVoted(true);
  };

  const handleLike = (idx: number) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[idx].likes += 1;
      return updated;
    });
  };

  const totalVotes = votes.ai + votes.whiteboard + votes.security;

  return (
    <div className="w-full h-full bg-[#0d0e12] rounded-2xl border border-zinc-850 overflow-hidden flex flex-col shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#13151b] border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Megaphone className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[10px] font-semibold text-zinc-300">Webinar Stage: ZoomX Global Keynote</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded-full">
          <span className="w-1 h-1 rounded-full bg-[#FF3B55] animate-pulse" />
          <span>1.8k Viewers</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col sm:flex-row overflow-hidden min-h-[300px]">
        {/* Main Stage (Presenter view) */}
        <div className="flex-1 bg-black relative flex items-center justify-center p-3">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/10 via-black to-zinc-950/20" />
          
          <div className="relative z-10 w-full max-w-[200px] aspect-video bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden flex flex-col items-center justify-center group shadow-xl">
            {/* Visual soundwave effect */}
            <div className="absolute bottom-2 left-2 right-2 h-2 flex items-end gap-0.5 justify-center opacity-65">
              {[...Array(12)].map((_, i) => (
                <span 
                  key={i} 
                  className="w-0.5 bg-violet-400 rounded-full animate-pulse"
                  style={{ 
                    height: `${20 + Math.random() * 80}%`,
                    animationDelay: `${i * 0.12}s`
                  }}
                />
              ))}
            </div>
            
            <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/40 text-violet-300 font-bold text-xs mb-1">
              SC
            </div>
            <span className="absolute top-1.5 left-1.5 text-[8px] px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white font-medium border border-white/10 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#FF3B55]" /> Presenter: Sarah Chen
            </span>
          </div>
        </div>

        {/* Right interactive Sidebar (Polls & Q&A) */}
        <div className="w-full sm:w-48 bg-[#101218] border-t sm:border-t-0 sm:border-l border-zinc-800/85 p-2.5 flex flex-col gap-3 overflow-y-auto shrink-0">
          {/* Live Poll */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[8px] font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>Live Audience Poll</span>
            </span>
            <span className="text-[10px] text-white font-semibold">Most excited feature?</span>
            
            <div className="flex flex-col gap-1.5 mt-1">
              {[
                { key: "ai", label: "AI Copilot suggestions", val: votes.ai },
                { key: "whiteboard", label: "Smart Virtual Whiteboard", val: votes.whiteboard },
                { key: "security", label: "End-to-End Encryption", val: votes.security },
              ].map((opt) => {
                const percentage = totalVotes > 0 ? Math.round((opt.val / totalVotes) * 100) : 0;
                return (
                  <button 
                    key={opt.key} 
                    onClick={() => handleVote(opt.key as any)}
                    className="w-full text-left relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 transition-all hover:bg-zinc-800/30 group"
                    disabled={userVoted}
                  >
                    {/* Background fill */}
                    <div 
                      className="absolute inset-y-0 left-0 bg-violet-500/10 transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                    
                    <div className="relative z-10 flex justify-between items-center text-[9px]">
                      <span className="font-semibold text-zinc-300 group-hover:text-white truncate max-w-[100px]">{opt.label}</span>
                      <span className="font-bold text-violet-400">{percentage}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {userVoted && <span className="text-[7px] text-zinc-500 text-center italic mt-0.5">Voted!</span>}
          </div>

          {/* Q&A section */}
          <div className="flex flex-col gap-1.5 border-t border-zinc-800/60 pt-2">
            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider">Audience Q&A</span>
            <div className="flex flex-col gap-1.5">
              {messages.map((msg, i) => (
                <div key={i} className="p-1.5 rounded bg-zinc-900/40 border border-zinc-800/80 flex justify-between items-start gap-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-bold text-white">{msg.name}</span>
                    <p className="text-[8px] text-[#A0AEC0] leading-relaxed line-clamp-2">{msg.text}</p>
                  </div>
                  <button 
                    onClick={() => handleLike(i)}
                    className="flex items-center gap-0.5 text-[8px] text-zinc-500 hover:text-white bg-zinc-850 px-1 py-0.5 rounded border border-zinc-800 transition shrink-0"
                  >
                    <ThumbsUp className="w-2 h-2" />
                    <span>{msg.likes}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function SalesMockup() {
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Verify Seat Licenses count (150 users)", completed: false },
    { id: 2, text: "Attach volume pricing tiers proposal", completed: false },
    { id: 3, text: "Schedule technical vetting demo with CTO", completed: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist((prev) => 
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  return (
    <div className="w-full h-full bg-[#0d0e12] rounded-2xl border border-zinc-850 overflow-hidden flex flex-col shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#13151b] border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <BadgeDollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-semibold text-zinc-300">Revenue Workspace: Enterprise Deal Review</span>
        </div>
        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-0.5">
          <span className="w-1 h-1 rounded-full bg-emerald-500" /> Synced
        </span>
      </div>

      <div className="flex flex-1 flex-col sm:flex-row overflow-hidden min-h-[300px]">
        {/* Deal details and CRM status */}
        <div className="w-full sm:w-36 bg-[#101218] border-b sm:border-b-0 sm:border-r border-zinc-800/50 p-2 flex flex-col gap-2 shrink-0">
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">Opportunity Detail</span>
          <div className="flex flex-col gap-0.5 bg-zinc-900/40 p-1.5 rounded-lg border border-zinc-800">
            <span className="text-[7px] text-zinc-500">Account</span>
            <span className="text-[10px] font-bold text-white">Scaler Tech</span>
          </div>
          <div className="flex flex-col gap-0.5 bg-zinc-900/40 p-1.5 rounded-lg border border-zinc-800">
            <span className="text-[7px] text-zinc-500">Expected Value</span>
            <span className="text-[10px] font-bold text-emerald-400">$34,500 / yr</span>
          </div>
          <div className="flex flex-col gap-0.5 bg-zinc-900/40 p-1.5 rounded-lg border border-zinc-800">
            <span className="text-[7px] text-zinc-500">Stage</span>
            <span className="text-[10px] font-bold text-indigo-400">Technical Val</span>
          </div>
        </div>

        {/* Conversation Transcript & CRM Tasks Checklist */}
        <div className="flex-1 flex flex-col bg-[#0b0c10] p-3 justify-between overflow-y-auto">
          {/* Transcript Annotations */}
          <div className="flex flex-col gap-1.5 mb-2">
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">AI Meeting Insights</span>
            
            <div className="p-2 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold text-[#82AAFF] bg-[#2D6FFF]/10 border border-[#2D6FFF]/20 px-1 py-0.5 rounded">Pricing Marker</span>
                <span className="text-[7px] text-zinc-500">08:14</span>
              </div>
              <p className="text-[9px] text-[#A0AEC0] italic leading-tight">
                "...if we migrate 150 team seats, will we fall into volume tiers?"
              </p>
            </div>
     
            <div className="p-2 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1 py-0.5 rounded">Action Item</span>
                <span className="text-[7px] text-zinc-500">12:35</span>
              </div>
              <p className="text-[9px] text-[#A0AEC0] italic leading-tight">
                "Sarah Chen: I will coordinate custom integration roadmap..."
              </p>
            </div>
          </div>

          {/* Sync checklist */}
          <div className="flex flex-col gap-1.5 border-t border-zinc-800/60 pt-2">
            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider">Required Actions (Click to toggle)</span>
            <div className="flex flex-col gap-1">
              {checklist.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`flex items-start gap-1.5 p-1.5 rounded border cursor-pointer transition-all ${
                    item.completed 
                      ? "bg-emerald-500/5 border-emerald-500/30 text-zinc-500 line-through" 
                      : "bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/40 text-zinc-300"
                  }`}
                >
                  <span className={`w-3 h-3 rounded flex items-center justify-center mt-0.5 transition shrink-0 ${
                    item.completed ? "bg-emerald-500 text-white" : "border border-zinc-700 bg-transparent"
                  }`}>
                    {item.completed && <Check className="w-2 h-2" />}
                  </span>
                  <span className="text-[9px] font-medium leading-tight select-none truncate">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

