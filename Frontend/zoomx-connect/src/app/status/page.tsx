"use client";

import { LandingLayout } from "@/components/layout/LandingLayout";
import { CheckCircle2 } from "lucide-react";

export default function StatusPage() {
  const systems = [
    { name: "Video Conferencing Engine", status: "Operational", desc: "Allows active live audio and video streams." },
    { name: "Scheduling & API Services", status: "Operational", desc: "Handles appointment planning and database synchronization." },
    { name: "User Authentication & Sign-in", status: "Operational", desc: "Handles accounts log-ins and signup security tokens." },
    { name: "Web Presence & Landing Pages", status: "Operational", desc: "Serves standard site pages and assets downloads." },
  ];

  return (
    <LandingLayout>
      <section className="relative py-24 bg-[#08090A] overflow-hidden">
        {/* Glow */}
        <div className="absolute left-1/2 top-12 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 text-xs font-semibold text-emerald-400 mb-4 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            All Systems Operational
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            System Status &{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              Uptime Details
            </span>
          </h1>
          <p className="text-[#A0AEC0] text-lg font-sans font-medium max-w-xl mx-auto">
            We maintain an average uptime rate of 99.9% to make sure your video meetings are always ready when you are.
          </p>
        </div>

        {/* Global operational indicator */}
        <div className="relative max-w-2xl mx-auto px-6 mb-12">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-white font-bold text-base">All Services Are Running Great</h4>
                <p className="text-xs text-[#A0AEC0] font-sans font-medium">No active disruptions or scheduled maintenance outages right now.</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase font-sans">99.98% Uptime</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="relative max-w-2xl mx-auto px-6">
          <h3 className="font-display font-bold text-xl text-white mb-6">Service Health</h3>
          
          <div className="space-y-4">
            {systems.map((sys) => {
              return (
                <div
                  key={sys.name}
                  className="p-6 rounded-2xl bg-[#0F1117]/60 border border-white/10 flex items-center justify-between gap-6 hover:border-white/15 transition-all duration-300"
                >
                  <div>
                    <h4 className="font-display font-bold text-base text-white mb-1">
                      {sys.name}
                    </h4>
                    <p className="text-xs text-[#A0AEC0] font-sans font-medium leading-relaxed">
                      {sys.desc}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0 font-sans">
                    {sys.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
