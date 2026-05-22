"use client";

import { LandingLayout } from "@/components/layout/LandingLayout";
import { HelpCircle, Search, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      q: "Do I need to download an app to use ZoomX?",
      a: "No! ZoomX runs completely in your web browser. Just click a meeting link, type your name, and you are ready to connect instantly.",
    },
    {
      q: "Is ZoomX free to use?",
      a: "Yes! Our Starter plan is 100% free and lets you run meetings for up to 40 minutes with up to 5 participants.",
    },
    {
      q: "How do I invite teammates to a call?",
      a: "Once you start an instant meeting, just copy the shareable link from the browser bar or call control panel, and paste it to your team.",
    },
    {
      q: "Can I schedule a meeting for later?",
      a: "Yes! Head to the Schedule page, pick a day and time, and click create. ZoomX will save your meeting and sync it with your calendar.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LandingLayout>
      <section className="relative py-24 bg-[#08090A] overflow-hidden">
        {/* Glow */}
        <div className="absolute left-1/2 top-12 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6] mb-4">
            Help Center
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            How can we{"   "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              help you today?
            </span>
          </h1>
          <p className="text-[#A0AEC0] text-lg font-sans font-medium max-w-xl mx-auto mb-8">
            Search common questions or browse categories to set up your video sessions smoothly.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search guides and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 pl-12 rounded-full bg-[#0F1117] border border-white/10 text-white placeholder-[#A0AEC0]/50 text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all duration-300 font-sans font-medium shadow-lg"
            />
            <Search className="w-5 h-5 text-[#A0AEC0]/50 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* FAQs */}
        <div className="relative max-w-3xl mx-auto px-6 mb-20">
          <h3 className="font-display font-bold text-2xl text-white mb-6">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#0F1117]/60 border border-white/10 hover:border-white/15 transition-all duration-300 flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/25 flex items-center justify-center text-[#3B82F6] shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-white mb-2">{faq.q}</h4>
                    <p className="text-[#A0AEC0] text-sm leading-relaxed font-sans font-medium">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#A0AEC0] text-sm font-sans font-medium text-center py-8">
                No matching answers found. Try searching for "free" or "app".
              </p>
            )}
          </div>
        </div>

        {/* Contact Support block */}
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0F1A3A] to-[#090B10] border border-[#3B82F6]/30 max-w-2xl mx-auto">
            <h4 className="font-display font-bold text-xl text-white mb-2">Still need help?</h4>
            <p className="text-sm text-[#A0AEC0] font-sans font-medium mb-6">Our support team is available 24/7. Get in touch with a real human advocate.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/contact" className="px-6 py-3 rounded-full bg-[#3B82F6] text-white font-bold text-xs hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 flex items-center gap-2 cursor-pointer">
                <MessageSquare className="w-4 h-4" />
                Start Chat Support
              </a>
              <a href="mailto:support@zoomx.com" className="px-6 py-3 rounded-full border border-white/20 text-white font-bold text-xs hover:bg-white/5 transition-all duration-300 flex items-center gap-2 cursor-pointer">
                <Mail className="w-4 h-4" />
                Email Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
