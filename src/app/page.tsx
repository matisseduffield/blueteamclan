"use client";

import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Ultra Modern */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

        {/* Content */}
        <div className={`relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Logo with glow effect */}
          <div className="flex justify-center mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <Image
                src="/assets/images/logo-circular.png"
                alt={SITE_CONFIG.name}
                width={120}
                height={120}
                className="relative rounded-full ring-2 ring-cyan-500/50 group-hover:ring-cyan-400 transition-all duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Main headline with gradient */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent leading-tight">
            {SITE_CONFIG.name}
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-400 font-light mb-4 max-w-3xl mx-auto">
            Elite Clash of Clans Community
          </p>

          {/* Stats bar */}
          <div className="flex justify-center gap-8 mb-12 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
              <span>Level 20</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
              <span>114 Wins</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
              <span>39 Members</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/join">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]">
                <span className="relative z-10">Join the Clan</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            <a href={SITE_CONFIG.social.discord} target="_blank" rel="noopener noreferrer">
              <button className="group px-8 py-4 border border-slate-700 hover:border-cyan-500 rounded-xl font-semibold text-slate-300 hover:text-white transition-all duration-300 hover:bg-slate-900/50">
                Discord
              </button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-700 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-cyan-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Stats Section - Glassmorphism */}
      <section className="relative py-24 bg-gradient-to-b from-black to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "👥", value: "39", label: "Active Members", link: "/members" },
              { icon: "⚔️", value: "114", label: "War Victories", link: null },
              { icon: "📅", value: "24/7", label: "Events Active", link: "/events" },
            ].map((stat, i) => (
              <Link key={i} href={stat.link || "#"} className={!stat.link ? "pointer-events-none" : ""}>
                <div className={`group relative bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 transition-all duration-500 ${stat.link ? 'hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1' : ''}`}>
                  <div className="text-6xl mb-4 filter grayscale group-hover:grayscale-0 transition-all duration-500">{stat.icon}</div>
                  <div className="text-5xl font-black text-white mb-2 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-slate-400 font-medium">{stat.label}</div>
                  {stat.link && (
                    <div className="absolute top-4 right-4 text-slate-600 group-hover:text-cyan-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Horizontal cards */}
      <section className="relative py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Why Join Us?</h2>
            <p className="text-slate-400 text-lg">What makes Blue Team Clan stand out</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🎯", title: "Competitive", desc: "Regular wars and CWL participation" },
              { icon: "🤝", title: "Community", desc: "Active Discord and friendly members" },
              { icon: "📈", title: "Growth", desc: "Help each other improve strategies" },
              { icon: "🏆", title: "Rewards", desc: "Max clan games and raid rewards" },
            ].map((feature, i) => (
              <div key={i} className="group relative bg-slate-900/30 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-1">
                <div className="text-5xl mb-4 filter grayscale group-hover:grayscale-0 transition-all duration-500">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Bold & Simple */}
      <section className="relative py-32 bg-gradient-to-b from-slate-950 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Ready to Dominate?
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Join Australia's most active Clash of Clans clan and start winning today
          </p>
          <Link href="/join">
            <button className="group relative px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-lg text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(6,182,212,0.6)]">
              <span className="relative z-10">Apply Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
