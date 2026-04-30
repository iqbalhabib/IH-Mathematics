"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAIL  = "mr.habibiqbal@gmail.com";
const SETUP_CODE   = process.env.NEXT_PUBLIC_ADMIN_SETUP_CODE ?? "";

type Step = "code" | "form" | "done";

export default function AdminSignupPage() {
  const [step,            setStep]            = useState<Step>("code");
  const [code,            setCode]            = useState("");
  const [codeError,       setCodeError]       = useState("");
  const [fullName,        setFullName]        = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass,        setShowPass]        = useState(false);
  const [error,           setError]           = useState("");
  const [loading,         setLoading]         = useState(false);

  const router = useRouter();

  /* ── Step 1: verify access code ─────────────────────────── */
  function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!SETUP_CODE) {
      setCodeError("Admin setup code is not configured. Add NEXT_PUBLIC_ADMIN_SETUP_CODE to .env.local");
      return;
    }
    if (code.trim() === SETUP_CODE) {
      setCodeError("");
      setStep("form");
    } else {
      setCodeError("Incorrect access code.");
    }
  }

  /* ── Step 2: create admin account ───────────────────────── */
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email:    ADMIN_EMAIL,
      password,
      options: {
        data: { full_name: fullName || "Admin", role: "admin" },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setStep("done");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-12">

      {/* Restricted banner */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/40 border border-red-700/40 text-red-400 text-xs font-semibold mb-8">
        <span>🔒</span>
        Restricted Area — Platform Administrators Only
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-700/60 overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-5">
            <Image src="/logo.png" alt="IH Mathematics" width={40} height={40} className="object-contain" />
            <div>
              <p className="font-bold text-white text-base">IH Mathematics</p>
              <p className="text-amber-400 text-xs font-semibold">Admin Registration</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            This page is not for students. Use the access code provided by the platform owner to register the admin account.
          </p>
        </div>

        {/* ── Step 1: Access Code ─────────────────────────────── */}
        {step === "code" && (
          <form onSubmit={handleVerifyCode} className="px-8 py-7 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Admin Access Code
              </label>
              <input
                type="password"
                value={code}
                onChange={(e) => { setCode(e.target.value); setCodeError(""); }}
                placeholder="Enter your access code"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {codeError && (
                <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                  <span>✗</span> {codeError}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                Contact <a href="mailto:mr.habibiqbal@gmail.com" className="text-amber-400 hover:underline">mr.habibiqbal@gmail.com</a> if you don&apos;t have the code.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-all shadow-lg shadow-amber-900/30"
            >
              Verify Code →
            </button>
          </form>
        )}

        {/* ── Step 2: Registration form ───────────────────────── */}
        {step === "form" && (
          <form onSubmit={handleSignup} className="px-8 py-7 space-y-4">

            {/* Verified badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-900/30 border border-emerald-700/40 text-emerald-400 text-xs font-semibold">
              <span>✓</span> Access code verified — fill in your details below
            </div>

            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Habib Iqbal"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Email — locked */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Admin Email
                <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-slate-700 text-slate-400 font-normal">locked</span>
              </label>
              <input
                type="email"
                value={ADMIN_EMAIL}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm cursor-not-allowed select-none"
              />
              <p className="mt-1 text-xs text-slate-500">
                The admin account is bound to this email address.
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs px-1"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                placeholder="Re-enter your password"
                required
                className={`w-full px-4 py-3 rounded-xl bg-slate-800 border text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  confirmPassword && password !== confirmPassword
                    ? "border-red-500"
                    : "border-slate-700"
                }`}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-900/30 border border-red-700/40 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-900 font-bold text-sm transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                "Create Admin Account"
              )}
            </button>
          </form>
        )}

        {/* ── Step 3: Success ─────────────────────────────────── */}
        {step === "done" && (
          <div className="px-8 py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h2 className="text-xl font-bold text-white">Account Created!</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              A confirmation email has been sent to{" "}
              <span className="text-amber-400 font-medium">{ADMIN_EMAIL}</span>.
              Click the link in the email to activate your account.
            </p>
            <div className="bg-slate-800 rounded-xl px-5 py-4 text-left text-xs text-slate-400 space-y-1.5 mt-2">
              <p className="font-semibold text-slate-300">Next steps:</p>
              <p>1. Check your inbox at {ADMIN_EMAIL}</p>
              <p>2. Click the confirmation link</p>
              <p>3. Log in at <span className="text-amber-400">/login</span></p>
              <p>4. Go to <span className="text-amber-400">/dashboard/admin</span></p>
            </div>
            <Link
              href="/login"
              className="inline-block mt-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-all"
            >
              Go to Login
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="px-8 py-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-600">
            Student?{" "}
            <Link href="/signup" className="text-slate-400 hover:text-white transition-colors">
              Sign up here
            </Link>
            {" · "}
            <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Not indexed warning */}
      <p className="mt-6 text-xs text-slate-600 text-center max-w-sm">
        This page is not linked anywhere on the website. Keep the URL and access code private.
      </p>
    </div>
  );
}
