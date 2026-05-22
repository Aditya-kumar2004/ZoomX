"use client";

import { LandingLayout } from "@/components/layout/LandingLayout";
import { Download, Newspaper } from "lucide-react";

export default function PressPage() {
  const assets = [
    {
      title: "ZoomX Logo Pack",
      desc: "Includes high-quality dark and light variants of the ZoomX logo icon and text.",
      size: "2.4 MB",
    },
    {
      title: "Brand Style Guide",
      desc: "A simple PDF showing our premium color system, fonts, and guidelines.",
      size: "1.1 MB",
    },
    {
      title: "Lander Screenshots",
      desc: "High-resolution mockups of our 3D hero prism section and video call layout.",
      size: "5.8 MB",
    },
  ];

  return (
    <LandingLayout>
      <section className="relative py-24 bg-[#08090A] overflow-hidden">
        {/* Glow */}
        <div className="absolute left-1/2 top-12 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6] mb-4">
            Press Room
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            News and brand{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              media resources
            </span>
          </h1>
          <p className="text-[#A0AEC0] text-lg font-sans font-medium max-w-xl mx-auto">
            Find official announcements, press kits, and standard brand assets to share the ZoomX story.
          </p>
        </div>

        {/* Media Kit Section */}
        <div className="relative max-w-3xl mx-auto px-6 mb-16">
          <h3 className="font-display font-bold text-2xl text-white mb-6">Brand Assets for Download</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {assets.map((asset) => {
              return (
                <div
                  key={asset.title}
                  className="p-6 rounded-2xl bg-[#0F1117]/60 border border-white/10 flex flex-col justify-between hover:border-[#3B82F6]/50 transition-colors duration-300"
                >
                  <div>
                    <h4 className="font-display font-bold text-base text-white mb-2">
                      {asset.title}
                    </h4>
                    <p className="text-xs text-[#A0AEC0] leading-relaxed font-sans font-medium mb-6">
                      {asset.desc}
                    </p>
                  </div>

                  <button className="w-full py-2.5 rounded-xl border border-white/10 hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                    <Download className="w-3.5 h-3.5 text-[#3B82F6]" />
                    Download ({asset.size})
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="relative max-w-3xl mx-auto px-6">
          <h3 className="font-display font-bold text-2xl text-white mb-8">Recent News</h3>
          
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#0F1117]/40 border border-white/5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/25 flex items-center justify-center text-[#3B82F6] shrink-0">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#3B82F6] block mb-1">MAY 2026</span>
                <h4 className="font-display font-bold text-lg text-white mb-2">ZoomX Releases Full WebGL-powered 3D Collaboration Framework</h4>
                <p className="text-[#A0AEC0] text-sm leading-relaxed font-sans font-medium">
                  We have launched standard WebGL enhancements to build rich interactive session backgrounds directly inside modern browsers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
