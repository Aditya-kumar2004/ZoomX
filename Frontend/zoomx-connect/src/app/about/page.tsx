"use client";

import { LandingLayout } from "@/components/layout/LandingLayout";
import { Users, Heart, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const beliefs = [
    {
      icon: Users,
      title: "People First",
      desc: "We build tools that make it easy for teams to connect, listen, and solve problems together, no matter where they work.",
    },
    {
      icon: Heart,
      title: "Simplicity Always",
      desc: "Technology should never be confusing. We design interfaces that anyone can use on their very first day without guidebooks.",
    },
    {
      icon: Target,
      title: "Reliability Focus",
      desc: "Your conversations are important. We ensure that our video quality remains clear and stable under any connection speed.",
    },
  ];

  return (
    <LandingLayout>
      <section className="relative py-24 bg-[#08090A] overflow-hidden">
        {/* Glow */}
        <div className="absolute left-1/2 top-12 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6] mb-4">
            About Us
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Helping teams work{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              better together
            </span>
          </h1>
          <p className="text-[#A0AEC0] text-lg font-sans font-medium max-w-2xl mx-auto">
            At ZoomX, we make high-quality video meetings simple, safe, and fast so you can focus on building what matters.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="relative max-w-3xl mx-auto px-6 mb-20">
          <div className="p-8 rounded-2xl bg-[#0F1117]/60 border border-white/10 hover:border-white/15 transition-all duration-300">
            <h3 className="font-display font-bold text-2xl text-white mb-4">Our Mission</h3>
            <p className="text-[#A0AEC0] text-base leading-relaxed font-sans font-medium mb-6">
              We started ZoomX because we believe video calls should just work. You should not have to download large apps, copy complex codes, or deal with bad audio to talk with your friends or teammates. 
            </p>
            <p className="text-[#A0AEC0] text-base leading-relaxed font-sans font-medium">
              Today, thousands of developers, creators, and modern companies use ZoomX to run quick check-ins, plan roadmaps, and share stories in real-time. We are proud to build the simplest video platform on the web.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="relative max-w-4xl mx-auto px-6">
          <h3 className="font-display font-bold text-2xl text-white text-center mb-10">What We Believe In</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {beliefs.map((belief, index) => {
              const Icon = belief.icon;
              return (
                <motion.div
                  key={belief.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-[#0F1117]/60 border border-white/10 text-center flex flex-col items-center gap-4 hover:border-[#3B82F6]/40 transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/25 flex items-center justify-center text-[#3B82F6]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-white">
                    {belief.title}
                  </h4>
                  <p className="text-[#A0AEC0] text-sm leading-relaxed font-sans font-medium">
                    {belief.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
