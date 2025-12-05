"use client";

import { useState, useMemo } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface FormData {
  playerTag: string;
  playerName: string;
  email: string;
  age: string;
  experience: string;
  why: string;
}

interface FormErrors {
  playerTag?: string;
  playerName?: string;
  email?: string;
  age?: string;
  why?: string;
}

const validatePlayerTag = (tag: string): string | undefined => {
  if (!tag.trim()) return "Player tag is required";
  if (!/^#[A-Z0-9]{3,}$/.test(tag)) return "Player tag must start with # and contain letters/numbers (e.g., #CQRGLC)";
  return undefined;
};

const validatePlayerName = (name: string): string | undefined => {
  if (!name.trim()) return "Player name is required";
  if (name.trim().length < 2) return "Player name must be at least 2 characters";
  return undefined;
};

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
  return undefined;
};

const validateAge = (age: string): string | undefined => {
  if (age && (parseInt(age) < 13 || parseInt(age) > 120)) {
    return "Age must be between 13 and 120";
  }
  return undefined;
};

const validateWhy = (why: string): string | undefined => {
  if (why && why.trim().length < 10) return "Please tell us more (at least 10 characters)";
  return undefined;
};

export default function JoinPage() {
  const [formData, setFormData] = useState<FormData>({
    playerTag: "",
    playerName: "",
    email: "",
    age: "",
    experience: "",
    why: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormData>>(new Set());
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const tagError = validatePlayerTag(formData.playerTag);
    if (tagError) newErrors.playerTag = tagError;
    
    const nameError = validatePlayerName(formData.playerName);
    if (nameError) newErrors.playerName = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time validation
  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case "playerTag":
        return validatePlayerTag(value);
      case "playerName":
        return validatePlayerName(value);
      case "email":
        return validateEmail(value);
      case "age":
        return validateAge(value);
      case "why":
        return validateWhy(value);
      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const field = name as keyof FormData;
    
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouchedFields((prev) => new Set(prev).add(field));
    
    // Real-time validation
    const error = validateField(field, value);
    setErrors((prev) => {
      if (error) {
        return { ...prev, [field]: error };
      } else {
        const { [field]: _, ...rest } = prev as Record<string, any>;
        return rest as FormErrors;
      }
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    const field = name as keyof FormData;
    setTouchedFields((prev) => new Set(prev).add(field));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    
    if (!validateForm()) {
      setSubmitError("Please fix the errors above");
      return;
    }

    setLoading(true);

    try {
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
      setTouchedFields(new Set());
      setErrors({});
      setCurrentStep(1);

      // Reset after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit request");
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
              {/* Progress Indicator */}
              <div className="mb-8 pb-8 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep === 1 ? "bg-blue-600 text-white" : "bg-white/20 text-white/60"
                  }`}>
                    1
                  </div>
                  <div className="h-1 flex-1 bg-white/10"></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep === 2 ? "bg-blue-600 text-white" : "bg-white/20 text-white/60"
                  }`}>
                    2
                  </div>
                </div>
                <p className="text-sm text-white/60 mt-3">
                  {currentStep === 1 ? "Basic Information" : "Experience & Details"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 ? (
                  <>
                    {/* Player Tag */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white">
                        Player Tag <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="playerTag"
                          value={formData.playerTag}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="#XXXX"
                          className={`w-full px-4 py-3 border bg-white/5 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.playerTag && touchedFields.has("playerTag")
                              ? "border-red-500 focus:ring-red-500"
                              : "border-white/20 focus:ring-blue-500"
                          }`}
                        />
                        {errors.playerTag && touchedFields.has("playerTag") && (
                          <span className="absolute right-3 top-3 text-red-400 text-xl">⚠️</span>
                        )}
                      </div>
                      {errors.playerTag && touchedFields.has("playerTag") && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <span>✗</span> {errors.playerTag}
                        </p>
                      )}
                      <p className="text-sm text-white/50">Your Clash of Clans player tag (e.g., #CQRGLC)</p>
                    </div>

                    {/* Player Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white">
                        In-Game Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="playerName"
                          value={formData.playerName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Your in-game name"
                          className={`w-full px-4 py-3 border bg-white/5 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.playerName && touchedFields.has("playerName")
                              ? "border-red-500 focus:ring-red-500"
                              : "border-white/20 focus:ring-blue-500"
                          }`}
                        />
                        {errors.playerName && touchedFields.has("playerName") && (
                          <span className="absolute right-3 top-3 text-red-400 text-xl">⚠️</span>
                        )}
                      </div>
                      {errors.playerName && touchedFields.has("playerName") && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <span>✗</span> {errors.playerName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="your@email.com"
                          className={`w-full px-4 py-3 border bg-white/5 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.email && touchedFields.has("email")
                              ? "border-red-500 focus:ring-red-500"
                              : "border-white/20 focus:ring-blue-500"
                          }`}
                        />
                        {errors.email && touchedFields.has("email") && (
                          <span className="absolute right-3 top-3 text-red-400 text-xl">⚠️</span>
                        )}
                      </div>
                      {errors.email && touchedFields.has("email") && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <span>✗</span> {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={() => setCurrentStep(2)}
                        disabled={!!errors.playerTag || !!errors.playerName || !!errors.email}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Age */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white">
                        Age
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Optional"
                          className={`w-full px-4 py-3 border bg-white/5 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.age && touchedFields.has("age")
                              ? "border-red-500 focus:ring-red-500"
                              : "border-white/20 focus:ring-blue-500"
                          }`}
                        />
                        {errors.age && touchedFields.has("age") && (
                          <span className="absolute right-3 top-3 text-red-400 text-xl">⚠️</span>
                        )}
                      </div>
                      {errors.age && touchedFields.has("age") && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <span>✗</span> {errors.age}
                        </p>
                      )}
                    </div>

                    {/* Experience */}
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

                    {/* Why Join */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white">
                        Why do you want to join Blue Team?
                      </label>
                      <div className="relative">
                        <textarea
                          name="why"
                          value={formData.why}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Tell us about yourself and why you'd be a great addition to our clan..."
                          rows={4}
                          className={`w-full px-4 py-3 border bg-white/5 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                            errors.why && touchedFields.has("why")
                              ? "border-red-500 focus:ring-red-500"
                              : "border-white/20 focus:ring-blue-500"
                          }`}
                        />
                        {errors.why && touchedFields.has("why") && (
                          <span className="absolute right-3 top-3 text-red-400 text-xl">⚠️</span>
                        )}
                      </div>
                      {errors.why && touchedFields.has("why") && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <span>✗</span> {errors.why}
                        </p>
                      )}
                    </div>

                    {submitError && (
                      <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg flex items-start gap-3">
                        <span className="text-xl">❌</span>
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="flex-1"
                        onClick={() => setCurrentStep(1)}
                        disabled={loading}
                      >
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        size="lg"
                        className="flex-1"
                        disabled={loading}
                        onClick={handleSubmit}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="inline-block animate-spin">⏳</span>
                            Submitting...
                          </span>
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>

                    <p className="text-sm text-white/60 text-center">
                      We'll review your application and contact you within 48 hours via the email provided.
                    </p>
                  </>
                )}
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
