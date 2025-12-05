"use client";

import { useState } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function JoinPage() {
  const [formData, setFormData] = useState({
    playerTag: "",
    playerName: "",
    email: "",
    age: "",
    experience: "",
    why: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate form
      if (!formData.playerTag || !formData.playerName || !formData.email) {
        throw new Error("Please fill in all required fields");
      }

      // Add to Firestore
      await addDoc(collection(db, "joinRequests"), {
        playerTag: formData.playerTag,
        playerName: formData.playerName,
        email: formData.email,
        age: formData.age,
        experience: formData.experience,
        why: formData.why,
        status: "pending",
        submittedAt: serverTimestamp(),
      });

      setSubmitted(true);
      setFormData({
        playerTag: "",
        playerName: "",
        email: "",
        age: "",
        experience: "",
        why: "",
      });

      // Reset after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-0 min-h-screen bg-gradient-to-b from-black to-blue-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900/50 via-purple-900/50 to-black/50 text-white py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold">Apply to Blue Team</h1>
            <p className="text-xl text-blue-200">
              Think you have what it takes? Apply now and let's see if you're a good fit!
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <Card className="bg-green-500/20 border-2 border-green-500 backdrop-blur-md">
              <div className="text-center space-y-4">
                <div className="text-5xl">✨</div>
                <h2 className="text-2xl font-bold text-green-300">Application Submitted!</h2>
                <p className="text-green-200">
                  Thanks for your interest in joining Blue Team! Our leadership will review your
                  application and get back to you on Discord or email within 48 hours.
                </p>
                <p className="text-sm text-green-300">
                  Make sure to join our Discord and check your email regularly for updates.
                </p>
              </div>
            </Card>
          ) : (
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Player Tag <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="playerTag"
                    value={formData.playerTag}
                    onChange={handleChange}
                    placeholder="#XXXX"
                    className="w-full px-4 py-3 border border-white/20 bg-white/5 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-sm text-white/50">Your Clash of Clans player tag (e.g., #CQRGLC)</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    In-Game Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="playerName"
                    value={formData.playerName}
                    onChange={handleChange}
                    placeholder="Your in-game name"
                    className="w-full px-4 py-3 border border-white/20 bg-white/5 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-white/20 bg-white/5 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-white/20 bg-white/5 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Clash Experience
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-white/20 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your experience level</option>
                    <option value="beginner">Beginner (New to clans)</option>
                    <option value="intermediate">Intermediate (1-2 years)</option>
                    <option value="advanced">Advanced (2+ years)</option>
                    <option value="expert">Expert (Competitive player)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Why do you want to join Blue Team?
                  </label>
                  <textarea
                    name="why"
                    value={formData.why}
                    onChange={handleChange}
                    placeholder="Tell us about yourself and why you'd be a great addition to our clan..."
                    rows={4}
                    className="w-full px-4 py-3 border border-white/20 bg-white/5 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Apply"}
                </Button>

                <p className="text-sm text-white/60 text-center">
                  We'll review your application and contact you within 48 hours via the email provided.
                </p>
              </form>
            </Card>
          )}
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            What We're Looking For
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Requirements</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-400 text-2xl">✓</span>
                    <span className="text-white/80">Active player (war participation)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-400 text-2xl">✓</span>
                    <span className="text-white/80">Discord access for communication</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-400 text-2xl">✓</span>
                    <span className="text-white/80">Open to learning strategies</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-400 text-2xl">✓</span>
                    <span className="text-white/80">Respectful and mature attitude</span>
                  </li>
                </ul>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">What We Offer</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-400 text-2xl">★</span>
                    <span className="text-white/80">Regular wars and CWL participation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-400 text-2xl">★</span>
                    <span className="text-white/80">Mentorship from experienced players</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-400 text-2xl">★</span>
                    <span className="text-white/80">Active Discord community</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-400 text-2xl">★</span>
                    <span className="text-white/80">Fair and transparent clan leadership</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
