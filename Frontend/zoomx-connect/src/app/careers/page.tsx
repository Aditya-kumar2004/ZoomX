"use client";

import { LandingLayout } from "@/components/layout/LandingLayout";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function CareersPage() {
  const positions = [
    {
      title: "Full-Stack Engineer",
      team: "Product Team",
      location: "Remote (Global)",
      desc: "Help us build beautiful components and reliable real-time video features using Next.js and WebRTC.",
    },
    {
      title: "UI / UX Product Designer",
      team: "Design Team",
      location: "Remote (Global)",
      desc: "Design premium glassmorphism interfaces and smooth animations that keep our call platform simple to use.",
    },
    {
      title: "Customer Support Advocate",
      team: "Success Team",
      location: "Remote (Global)",
      desc: "Answer customer questions quickly and write helpful guidebooks to keep meeting hosts happy.",
    },
  ];

  return (
    <LandingLayout>
      <section className="relative py-24 bg-[#08090A] overflow-hidden">
        {/* Glow */}
        <div className="absolute left-1/2 top-12 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6] mb-4">
            Careers
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Build the future of{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              video meetings
            </span>
          </h1>
          <p className="text-[#A0AEC0] text-lg font-sans font-medium max-w-xl mx-auto">
            We are a remote-first team of developers, designers, and support professionals. Join us in making online calls fast and simple.
          </p>
        </div>

        {/* Perks Section */}
        <div className="relative max-w-4xl mx-auto px-6 grid md:grid-cols-3 gap-6 mb-20 text-center">
          <div className="p-6 rounded-2xl bg-[#0F1117]/40 border border-white/5">
            <h4 className="font-display font-bold text-white mb-2">Work Anywhere</h4>
            <p className="text-xs text-[#A0AEC0] font-sans font-medium">Work from the comfort of your home, a local café, or an office. You pick your workspace.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0F1117]/40 border border-white/5">
            <h4 className="font-display font-bold text-white mb-2">Flexible Hours</h4>
            <p className="text-xs text-[#A0AEC0] font-sans font-medium">Coordinate your own schedule. We focus on clear goals and great results, not hours on a clock.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0F1117]/40 border border-white/5">
            <h4 className="font-display font-bold text-white mb-2">Learning Support</h4>
            <p className="text-xs text-[#A0AEC0] font-sans font-medium">Get regular allowances for buying books, enrolling in courses, or attending helpful developer conferences.</p>
          </div>
        </div>

        {/* Roles Section */}
        <div className="relative max-w-3xl mx-auto px-6">
          <h3 className="font-display font-bold text-2xl text-white mb-8">Current Openings</h3>
          
          <div className="space-y-4">
            {positions.map((pos, index) => {
              return (
                <motion.div
                  key={pos.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-[#0F1117]/60 border border-white/10 hover:border-[#3B82F6]/50 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h4 className="font-display font-bold text-lg text-white group-hover:text-[#3B82F6] transition-colors duration-300">
                        {pos.title}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/20">
                        {pos.team}
                      </span>
                    </div>

                    <p className="text-[#A0AEC0] text-sm font-sans font-medium leading-relaxed mb-4">
                      {pos.desc}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#A0AEC0] font-sans font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
                        {pos.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-[#3B82F6]" />
                        Full-Time
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm font-bold text-[#3B82F6] group-hover:gap-2.5 transition-all duration-300 self-start md:self-auto shrink-0">
                    Apply now <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
