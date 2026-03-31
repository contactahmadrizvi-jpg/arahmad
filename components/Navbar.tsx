"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Don't show navbar on AR view pages
  if (pathname?.includes("/ar")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              ARMenu
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/login")
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/dashboard")
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/5 pt-3 flex flex-col gap-1">
            {!user ? (
              <>
                <Link href="/login" className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5" onClick={() => setMobileOpen(false)}>Log In</Link>
                <Link href="/signup" className="px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="px-4 py-2 rounded-lg text-sm text-left text-white/60 hover:text-white hover:bg-white/5">Sign Out</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
