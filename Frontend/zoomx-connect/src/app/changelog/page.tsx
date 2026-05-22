"use client";

import { LandingLayout } from "@/components/layout/LandingLayout";
import { Zap, Sparkles, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function ChangelogPage() {
  const updates = [
    {
      date: "May 2026",
      version: "v2.4.0",
      title: "AI Noise Cancellation & HD Improvements",
      icon: Sparkles,
      details: [
        "Added standard smart noise removal to filter out background barking or typing sounds.",
        "Improved video stream quality to support smooth 1080p rendering on slower networks.",
        "Fixed minor lag issues when switching between breakout rooms.",
      ],
    },
    {
      date: "April 2026",
      version: "v2.3.0",
      title: "One-Click Calendar Integrations",
      icon: Zap,
      details: [
        "Direct synchronization with Google Calendar and Outlook calendar timelines.",
        "Enabled automatic guest notification email reminders.",
        "Created an option to schedule recurring meetings in under 10 seconds.",
      ],
    },
    {
      date: "March 2026",
      version: "v2.2.0",
      title: "Premium 3D Backdrop Engine",
      icon: Award,
      details: [
        "Integrated lightweight interactive WebGL elements into landing sections.",
        "Refreshed layout surfaces to use modern high-contrast glassmorphism borders.",
        "Optimized mobile screens to load page animations 40% faster.",
      ],
    },
  ];

  return (
    <LandingLayout>
      <section className="relative py-24 bg-[#08090A] overflow-hidden">
        {/* Glow */}
        <div className="absolute left-1/2 top-12 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6] mb-4">
            Changelog
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            See what is{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              new in ZoomX
            </span>
          </h1>
          <p className="text-[#A0AEC0] text-lg font-sans font-medium max-w-xl mx-auto">
            We release updates regularly to make our meetings faster, simpler, and more reliable.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto px-6 space-y-12">
          {updates.map((update, index) => {
            return (
              <motion.div
                key={update.version}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 md:pl-12 border-l border-white/10 group"
              >
                {/* Dot bullet marker */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#08090A] border-2 border-[#3B82F6] group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6] px-2.5 py-1 rounded bg-[#3B82F6]/10 border border-[#3B82F6]/20">
                      {update.version}
                    </span>
                    <h3 className="font-display font-bold text-xl text-white">
                      {update.title}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-[#A0AEC0] font-sans">
                    {update.date}
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-[#0F1117]/60 border border-white/10 hover:border-white/15 transition-all duration-300">
                  <ul className="space-y-3">
                    {update.details.map((detail, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-[#A0AEC0] font-sans font-medium leading-relaxed">
                        <span className="text-[#3B82F6] mt-0.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </LandingLayout>
  );
}
