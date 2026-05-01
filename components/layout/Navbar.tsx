"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { label: "Courses",     href: "/courses" },
  { label: "Past Papers", href: "/past-papers" },
  { label: "AI Solver",   href: "/ai-solver" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [user,     setUser]       = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();

  const hidden = pathname.startsWith("/dashboard") || pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  if (hidden) return null;

  const isAdmin = user?.email === "mr.habibiqbal@gmail.com";
  const dashboardHref = isAdmin ? "/dashboard/admin" : "/dashboard/student";
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Account";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="IH Mathematics Logo"
                width={42}
                height={42}
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
            <span className={`font-bold text-lg tracking-tight transition-colors ${scrolled ? "text-slate-900" : "text-white"}`}>
              IH <span className="text-yellow-400">Mathematics</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA — auth-aware */}
          <div className="hidden md:flex items-center gap-3">
            {!authReady ? (
              /* Skeleton while auth loads */
              <div className="w-24 h-8 rounded-lg bg-white/10 animate-pulse" />
            ) : user ? (
              /* Logged in */
              <div className="flex items-center gap-3">
                <Link
                  href={dashboardHref}
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                    scrolled
                      ? "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  My Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                    scrolled
                      ? "text-slate-500 hover:text-red-600 hover:bg-red-50"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  title={`Signed in as ${displayName}`}
                >
                  <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    {initials}
                  </span>
                  <span className="hidden lg:inline max-w-[100px] truncate">{displayName}</span>
                </button>
              </div>
            ) : (
              /* Logged out */
              <>
                <Link
                  href="/login"
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                    scrolled
                      ? "text-slate-600 hover:text-indigo-600"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200 hover:shadow-lg"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-white border-t border-slate-100 shadow-lg`}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 mt-2 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); handleSignOut(); }}
                  className="px-4 py-3 rounded-xl text-sm font-semibold bg-red-50 text-red-600 text-center hover:bg-red-100 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-semibold bg-indigo-600 text-white text-center hover:bg-indigo-700 transition-colors"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
