"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with Glow */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-cyan-500/30 group-hover:ring-cyan-400/50 transition-all duration-300">
                <Image
                  src="/assets/images/logo-circular.png"
                  alt={SITE_CONFIG.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>
            <span className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors duration-300">{SITE_CONFIG.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'text-cyan-400 bg-cyan-500/10' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={SITE_CONFIG.social.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 group relative px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white text-sm font-bold overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 00-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.042-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.125-.093.25-.19.371-.287a.075.075 0 01.078-.01c3.928 1.793 8.18 1.793 12.062 0a.075.075 0 01.079.009c.12.098.246.195.372.288a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.076.076 0 00-.041.107c.36.699.77 1.364 1.225 1.994a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.057c.5-4.565-.838-8.628-3.549-12.193a.06.06 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156 0-1.193.93-2.157 2.157-2.157 1.226 0 2.157.964 2.157 2.157 0 1.19-.93 2.155-2.157 2.155zm7.975 0c-1.183 0-2.157-.965-2.157-2.156 0-1.193.93-2.157 2.157-2.157 1.226 0 2.157.964 2.157 2.157 0 1.19-.931 2.155-2.157 2.155z" />
                </svg>
                Discord
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-400 hover:text-cyan-400 p-2 rounded-lg hover:bg-slate-800/50 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu - Animated Slide */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 border-t border-slate-800/50">
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive 
                        ? 'text-cyan-400 bg-cyan-500/10' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href={SITE_CONFIG.social.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg transition-all duration-300 text-sm font-bold text-center shadow-lg hover:shadow-cyan-500/50"
              >
                Join Discord
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
