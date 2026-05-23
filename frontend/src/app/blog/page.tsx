"use client";

import { LandingLayout } from "@/components/layout/LandingLayout";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function BlogPage() {
  const posts = [
    {
      title: "5 Simple Ways to Make Remote Meetings Better",
      desc: "Short meetings with clear agendas save time. Learn how to keep your remote team happy and productive with basic schedule changes.",
      date: "May 18, 2026",
      readTime: "3 min read",
      category: "Guides",
    },
    {
      title: "Why We Switched to Web-Based Video Conferencing",
      desc: "Downloading app installers is old. Discover how in-browser web technologies allow teams to join calls immediately with zero setup.",
      date: "May 10, 2026",
      readTime: "4 min read",
      category: "Technology",
    },
    {
      title: "How to Protect Your Private Video Calls from Guests",
      desc: "Meeting safety does not have to be difficult. Read about SSO, smart waiting rooms, and basic tips to keep your private chats secure.",
      date: "April 29, 2026",
      readTime: "5 min read",
      category: "Security",
    },
  ];

  return (
    <LandingLayout>
      <section className="relative py-24 bg-[#08090A] overflow-hidden">
        {/* Glow */}
        <div className="absolute left-1/2 top-12 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6] mb-4">
            Blog
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Stories and useful{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              meeting tips
            </span>
          </h1>
          <p className="text-[#A0AEC0] text-lg font-sans font-medium max-w-xl mx-auto">
            Read our latest advice on how to communicate clearly, save scheduling time, and run better remote sessions.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {posts.map((post, index) => {
            return (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-[#0F1117]/60 border border-white/10 hover:border-[#3B82F6]/50 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/20">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-3 group-hover:text-[#3B82F6] transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-[#A0AEC0] text-xs md:text-sm leading-relaxed font-sans font-medium mb-6">
                    {post.desc}
                  </p>
                </div>

                <div className="border-t border-white/[0.06] pt-4 mt-auto">
                  <div className="flex items-center justify-between text-xs text-[#A0AEC0] font-sans font-medium mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
                      {post.readTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#3B82F6] group-hover:gap-2 transition-all duration-300">
                    Read article <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </LandingLayout>
  );
}
