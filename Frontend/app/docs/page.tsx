"use client";

import { LandingLayout } from "@/components/layout/LandingLayout";
import { BookOpen, Terminal, Code, Users } from "lucide-react";

export default function DocsPage() {
  const sections = [
    {
      icon: BookOpen,
      title: "Getting Started Guide",
      desc: "Learn the absolute basics of ZoomX. Follow these 3 quick steps to create your account, launch an instant meeting, and copy your invite link in under 30 seconds.",
    },
    {
      icon: Users,
      title: "User Control Basics",
      desc: "Discover how to share your screen, manage breakout rooms, use interactive whiteboards, and turn on AI noise cancellation during active calls.",
    },
    {
      icon: Terminal,
      title: "SSO & Security Integration",
      desc: "Detailed instructions for enterprise administrators to configure secure Single Sign-On (SSO), manage compliant SOC 2 logging, and protect access keys.",
    },
  ];

  return (
    <LandingLayout>
      <section className="relative py-24 bg-[#08090A] overflow-hidden">
        {/* Glow */}
        <div className="absolute left-1/2 top-12 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6] mb-4">
            Documentation
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            ZoomX Platform{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              user & developer guides
            </span>
          </h1>
          <p className="text-[#A0AEC0] text-lg font-sans font-medium max-w-xl mx-auto">
            Welcome to the ZoomX setup docs. Read our simple guides to launch seamless meetings or integrate calendar schedules.
          </p>
        </div>

        {/* Narrative introduction */}
        <div className="relative max-w-3xl mx-auto px-6 grid md:grid-cols-3 gap-6 mb-16">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.title}
                className="p-6 rounded-2xl bg-[#0F1117]/60 border border-white/10 hover:border-[#3B82F6]/40 transition-colors duration-300 flex flex-col gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/25 flex items-center justify-center text-[#3B82F6]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-white">
                  {sec.title}
                </h3>
                <p className="text-xs text-[#A0AEC0] leading-relaxed font-sans font-medium">
                  {sec.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Technical quick start code block */}
        <div className="relative max-w-3xl mx-auto px-6">
          <div className="p-8 rounded-2xl bg-[#0F1117] border border-white/10 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white font-sans">Quick API Embed Code</span>
              </div>
              <span className="text-[10px] font-bold text-[#A0AEC0] uppercase font-mono">HTML / JS</span>
            </div>

            <p className="text-xs text-[#A0AEC0] font-sans font-medium mb-4">
              Developers can easily embed our meetings directly inside any web app by pasting this simple iframe code block:
            </p>

            <div className="p-4 rounded-xl bg-[#08090A] border border-white/5 font-mono text-xs text-[#82AAFF] overflow-x-auto leading-relaxed select-all">
              {`<iframe \n  src="https://zoomx.com/embed/meeting-room-id" \n  allow="camera; microphone; display-capture" \n  style="width: 100%; height: 600px; border: none; border-radius: 16px;"\n/>`}
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
