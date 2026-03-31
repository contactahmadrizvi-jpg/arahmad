"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8 animate-fade-in-up">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-violet-300">Powered by AR.js & Three.js</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up delay-100">
              <span className="text-white">Bring Your Menu </span>
              <br />
              <span className="gradient-text">To Life in AR</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
              Let customers explore your dishes in augmented reality before ordering.
              Increase engagement, reduce returns, and create unforgettable dining experiences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="gradient-btn px-8 py-4 rounded-xl text-lg font-semibold"
              >
                {user ? "Go to Dashboard" : "Start Free Trial"}
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 rounded-xl text-lg font-medium text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
              >
                See How It Works
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-fade-in-up delay-400">
              {[
                { value: "500+", label: "Restaurants" },
                { value: "50K+", label: "AR Views" },
                { value: "4.9★", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              A complete SaaS platform to transform your restaurant menu into an immersive AR experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 3L2 9l12 6 12-6L14 3z" />
                    <path d="M2 21l12 6 12-6" />
                    <path d="M2 15l12 6 12-6" />
                  </svg>
                ),
                title: "AR Menu Viewer",
                desc: "Customers scan a QR code and see your dishes in augmented reality on their phone — no app needed.",
                gradient: "from-violet-500 to-fuchsia-500",
              },
              {
                icon: (
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="22" height="22" rx="4" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="M25 18l-6-6-10 13" />
                  </svg>
                ),
                title: "Image Upload",
                desc: "Upload dish photos that are automatically stored on ImgBB. Add descriptions, prices, and ingredients.",
                gradient: "from-emerald-500 to-green-500",
              },
              {
                icon: (
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="8" height="8" rx="1" />
                    <rect x="17" y="3" width="8" height="8" rx="1" />
                    <rect x="3" y="17" width="8" height="8" rx="1" />
                    <rect x="17" y="17" width="8" height="8" rx="1" />
                  </svg>
                ),
                title: "QR Code Generation",
                desc: "Generate unique QR codes for your entire menu or individual dishes. Download and print for table placement.",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                icon: (
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h4" />
                    <path d="M14 3h7v7" />
                    <path d="M10 14L21 3" />
                  </svg>
                ),
                title: "Easy Management",
                desc: "Add, edit, and delete dishes from your dashboard. Manage categories, prices, and ingredients effortlessly.",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: (
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 20V10M12 20V4M6 20v-6" />
                  </svg>
                ),
                title: "Analytics",
                desc: "Track AR views for each dish. See which items are most popular and optimize your menu accordingly.",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                icon: (
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: "Secure & Reliable",
                desc: "Firebase Authentication protects your account. Your data is stored securely in Google Firestore.",
                gradient: "from-indigo-500 to-violet-500",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-[#12121a] border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-white/40">Three simple steps to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Sign Up", desc: "Create your restaurant account in seconds. No credit card required." },
              { step: "02", title: "Add Dishes", desc: "Upload photos, add descriptions and prices. We handle the rest." },
              { step: "03", title: "Share QR", desc: "Print QR codes for your tables. Customers scan and explore in AR." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center">
                  <span className="text-xl font-bold gradient-text">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Menu?
          </h2>
          <p className="text-lg text-white/40 mb-8">
            Join hundreds of restaurants already using ARMenu to delight their customers.
          </p>
          <Link
            href={user ? "/dashboard" : "/signup"}
            className="inline-block gradient-btn px-10 py-4 rounded-xl text-lg font-semibold"
          >
            {user ? "Open Dashboard" : "Get Started Free"}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white/60">ARMenu</span>
          </div>
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} ARMenu. Built with Next.js, Firebase & AR.js
          </p>
        </div>
      </footer>
    </div>
  );
}
