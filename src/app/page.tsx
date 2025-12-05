import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { SITE_CONFIG } from "@/lib/constants";

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Welcome to {SITE_CONFIG.name}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {SITE_CONFIG.description}
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button variant="primary">Join Us</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Join Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
                ⚔️
              </div>
              <h3 className="text-xl font-bold">Competitive Wars</h3>
              <p className="text-gray-600">
                Participate in intense clan wars and prove your skills
              </p>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
                👥
              </div>
              <h3 className="text-xl font-bold">Strong Community</h3>
              <p className="text-gray-600">
                Join a friendly and supportive clan community
              </p>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
                🎯
              </div>
              <h3 className="text-xl font-bold">Growth Focused</h3>
              <p className="text-gray-600">
                We help members improve their strategies and skills
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Join?</h2>
          <p className="text-lg text-gray-600">
            Apply now and become part of {SITE_CONFIG.name}
          </p>
          <Button variant="primary" size="lg">
            Apply Now
          </Button>
        </div>
      </section>
    </div>
  );
}
