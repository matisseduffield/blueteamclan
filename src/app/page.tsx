import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";

export default function Home() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  {SITE_CONFIG.name}
                </h1>
                <p className="text-2xl text-blue-100 font-semibold">
                  Level 20 Clash of Clans Clan
                </p>
              </div>
              
              <p className="text-xl text-blue-100 max-w-lg">
                Join our competitive clan community. 114 war wins and counting. Play with the best, grow with us.
              </p>
              
              <div className="flex gap-4 flex-wrap pt-4">
                <Link href="/join">
                  <Button variant="primary" size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                    Request to Join
                  </Button>
                </Link>
                <a href={SITE_CONFIG.social.discord} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">
                    Join Our Discord
                  </Button>
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-blue-700">
                <div>
                  <p className="text-3xl font-bold">39</p>
                  <p className="text-blue-200">Members</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">114</p>
                  <p className="text-blue-200">War Wins</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">20</p>
                  <p className="text-blue-200">Level</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-80 h-80">
                <Image
                  src="/assets/images/logo-circular.png"
                  alt={SITE_CONFIG.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Join Blue Team?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're more than just a clan. We're a community committed to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <div className="space-y-4 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl">
                  ⚔️
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Competitive Wars</h3>
                <p className="text-gray-600 text-lg">
                  Participate in strategic clan wars, CWL, and challenges. Learn from the best.
                </p>
              </div>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <div className="space-y-4 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl">
                  👥
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Active Community</h3>
                <p className="text-gray-600 text-lg">
                  Connect with friendly players on Discord. Share strategies and grow together.
                </p>
              </div>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <div className="space-y-4 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-3xl">
                  🎯
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Organized</h3>
                <p className="text-gray-600 text-lg">
                  Clear rules, skilled leadership, and fair promotions. We're structured for success.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold">39</p>
              <p className="text-blue-200 text-lg mt-2">Active Members</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">114</p>
              <p className="text-blue-200 text-lg mt-2">War Wins</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">20</p>
              <p className="text-blue-200 text-lg mt-2">Clan Level</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">🌏</p>
              <p className="text-blue-200 text-lg mt-2">Global</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Our Clan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/members" className="group">
              <Card className="h-full hover:shadow-xl transition-all hover:scale-105">
                <div className="space-y-4">
                  <div className="text-5xl">👥</div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600">View Members</h3>
                  <p className="text-gray-600">
                    Meet our 39 members. See their stats, roles, and trophies.
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/events" className="group">
              <Card className="h-full hover:shadow-xl transition-all hover:scale-105">
                <div className="space-y-4">
                  <div className="text-5xl">📅</div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600">Upcoming Events</h3>
                  <p className="text-gray-600">
                    Check our war schedule and clan events. Stay updated.
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/join" className="group">
              <Card className="h-full hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="space-y-4">
                  <div className="text-5xl">✨</div>
                  <h3 className="text-2xl font-bold text-blue-900 group-hover:text-blue-700">Join Now</h3>
                  <p className="text-blue-700">
                    Ready to join? Submit your request and join our community.
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Clash?
          </h2>
          <p className="text-xl text-blue-100">
            Join {SITE_CONFIG.name} and become part of an elite Clash of Clans community.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/join">
              <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Request to Join
              </Button>
            </Link>
            <a href={SITE_CONFIG.social.discord} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                Join Discord
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
