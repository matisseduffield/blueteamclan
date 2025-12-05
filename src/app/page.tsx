import Button from "@/components/common/Button";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";

export default function Home() {
  return (
    <div className="space-y-0 overflow-hidden">
      {/* Hero Section - Minimalist & Modern */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black opacity-80"></div>
        
        {/* Animated shapes in background */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-4000"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32 group">
              <Image
                src="/assets/images/logo-circular.png"
                alt={SITE_CONFIG.name}
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight">
              {SITE_CONFIG.name}
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-200 font-light max-w-2xl mx-auto">
              Level 20 Clash of Clans Clan • 114 War Wins • Based in {SITE_CONFIG.region}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap pt-8">
            <Link href="/join">
              <Button 
                variant="primary" 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-8 py-4 text-lg"
              >
                Request to Join
              </Button>
            </Link>
            <a href={SITE_CONFIG.social.discord} target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold px-8 py-4 text-lg"
              >
                Join Discord
              </Button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Info Sections - Clean & Focused */}
      <section className="bg-gradient-to-b from-black to-blue-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Members Card */}
            <Link href="/members" className="group">
              <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-8 transition-all duration-300 group-hover:border-white/50 group-hover:scale-105">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-white mb-2">39 Members</h3>
                <p className="text-blue-200">Competitive players from across Australia</p>
              </div>
            </Link>

            {/* Wars Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <div className="text-5xl mb-4">⚔️</div>
              <h3 className="text-2xl font-bold text-white mb-2">114 War Wins</h3>
              <p className="text-blue-200">Proven track record of success</p>
            </div>

            {/* Events Card */}
            <Link href="/events" className="group">
              <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-8 transition-all duration-300 group-hover:border-white/50 group-hover:scale-105">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-2xl font-bold text-white mb-2">Regular Events</h3>
                <p className="text-blue-200">Wars, CWL, and challenges year-round</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA - Sleek & Modern */}
      <section className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-black py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Clash?
          </h2>
          <p className="text-lg text-blue-200">
            Join an elite Australian Clash of Clans community. Apply now and let's dominate together.
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-4">
            <Link href="/join">
              <Button 
                variant="primary" 
                size="lg" 
                className="bg-white text-purple-900 hover:bg-blue-50 font-bold px-8 py-4"
              >
                Apply Now
              </Button>
            </Link>
            <a href={SITE_CONFIG.social.discord} target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-4"
              >
                Our Discord
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
