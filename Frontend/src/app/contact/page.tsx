"use client";

import { LandingLayout } from "@/components/layout/LandingLayout";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.msg) return;
    setSent(true);
    setFormState({ name: "", email: "", msg: "" });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <LandingLayout>
      <section className="relative py-24 bg-[#08090A] overflow-hidden">
        {/* Glow */}
        <div className="absolute left-1/2 top-12 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6] mb-4">
            Contact
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Get in touch{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              with our team
            </span>
          </h1>
          <p className="text-[#A0AEC0] text-lg font-sans font-medium max-w-xl mx-auto">
            Whether you want a custom enterprise plan, need help with your account, or just want to say hello, we are happy to chat!
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 grid md:grid-cols-5 gap-12 items-start">
          {/* Info Column */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="font-display font-bold text-2xl text-white">Contact Details</h3>
            
            <div className="space-y-4 font-sans font-medium text-sm text-[#A0AEC0]">
              <div className="flex gap-4 p-5 rounded-xl bg-[#0F1117]/60 border border-white/5">
                <Mail className="w-5 h-5 text-[#3B82F6] shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Email Us</h4>
                  <a href="mailto:hello@zoomx.com" className="hover:text-white transition">hello@zoomx.com</a>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-xl bg-[#0F1117]/60 border border-white/5">
                <MessageSquare className="w-5 h-5 text-[#3B82F6] shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Chat Support</h4>
                  <p>Available 24 hours a day, 7 days a week on all premium accounts.</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-xl bg-[#0F1117]/60 border border-white/5">
                <MapPin className="w-5 h-5 text-[#3B82F6] shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Office</h4>
                  <p>100 Pine Street, San Francisco, California</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="md:col-span-3">
            <div className="p-8 rounded-2xl bg-[#0F1117]/60 border border-white/10 shadow-lg">
              <h3 className="font-display font-bold text-xl text-white mb-6">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-2 font-sans">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#08090A] border border-white/10 text-white placeholder-[#A0AEC0]/30 text-sm focus:outline-none focus:border-[#3B82F6] transition-all duration-300 font-sans font-medium"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-2 font-sans">Your Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#08090A] border border-white/10 text-white placeholder-[#A0AEC0]/30 text-sm focus:outline-none focus:border-[#3B82F6] transition-all duration-300 font-sans font-medium"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="msg" className="block text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-2 font-sans">Your Message</label>
                  <textarea
                    id="msg"
                    rows={4}
                    placeholder="Tell us what you need help with..."
                    value={formState.msg}
                    onChange={(e) => setFormState({ ...formState, msg: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#08090A] border border-white/10 text-white placeholder-[#A0AEC0]/30 text-sm focus:outline-none focus:border-[#3B82F6] transition-all duration-300 font-sans font-medium resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#3B82F6] text-white font-bold text-sm shadow-lg shadow-[#3B82F6]/15 hover:shadow-[#3B82F6]/40 hover:scale-[1.01] transition-all duration-300 btn-glow flex items-center justify-center gap-2 cursor-pointer font-sans"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>

                {sent && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold text-center font-sans animate-pulse">
                    Thank you! Your message was sent successfully. We will get back to you shortly!
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
