"use client";

import { LandingLayout } from "@/components/layout/LandingLayout";
import { Shield, Lock, Eye, Key } from "lucide-react";
import { motion } from "framer-motion";

export default function SecurityPage() {
  const points = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      desc: "All your video meetings and chat messages are encrypted from the start to the end. No one else can read or watch them — not even us.",
    },
    {
      icon: Shield,
      title: "Compliance & Standards",
      desc: "We follow industry security rules like SOC 2 to protect your data. Your trust is our top priority, and we keep our systems safe day and night.",
    },
    {
      icon: Eye,
      title: "Data Privacy",
      desc: "We do not sell your personal information or meeting details to anyone. Your conversations belong solely to you.",
    },
    {
      icon: Key,
      title: "Secure Access Controls",
      desc: "Use single sign-on (SSO), passwords, and waiting rooms to control exactly who can join your meetings. Keep unwanted guests out with ease.",
    },
  ];

  return (
    <LandingLayout>
      <section className="relative py-24 bg-[#08090A] overflow-hidden">
        {/* Glow */}
        <div className="absolute left-1/2 top-12 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6] mb-4">
            Security
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Your meetings are{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              safe and private
            </span>
          </h1>
          <p className="text-[#A0AEC0] text-lg font-sans font-medium max-w-2xl mx-auto">
            We use strong security tools and standards to protect your conversations and data.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-[#0F1117]/60 border border-white/10 hover:border-[#3B82F6]/50 transition-all duration-300 flex flex-col gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/25 flex items-center justify-center text-[#3B82F6]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  {point.title}
                </h3>
                <p className="text-[#A0AEC0] text-sm leading-relaxed font-sans font-medium">
                  {point.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </LandingLayout>
  );
}
