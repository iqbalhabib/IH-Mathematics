"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  courseId: string;
  isLoggedIn: boolean;
  initialEnrolled: boolean;
  isFree: boolean;
  accessType: "free" | "paid" | "preview";
}

export default function EnrollButton({
  courseId,
  isLoggedIn,
  initialEnrolled,
  accessType,
}: Props) {
  const [enrolled, setEnrolled] = useState(initialEnrolled);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const router = useRouter();

  async function handleEnroll() {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/courses/${courseId}`);
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/enroll", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ courseId }),
    });

    setLoading(false);

    if (res.ok) {
      setEnrolled(true);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Enrollment failed. Please try again.");
    }
  }

  /* Already enrolled */
  if (enrolled) {
    return (
      <div className="space-y-3">
        <a
          href="/dashboard/student"
          className="block w-full text-center px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-200"
        >
          ✓ Enrolled — Continue Learning
        </a>
        <p className="text-center text-xs text-emerald-600 font-medium">
          You have access to all lessons
        </p>
      </div>
    );
  }

  /* ── Not logged in: show sign-up / login prompt ── */
  if (!isLoggedIn) {
    return (
      <div className="space-y-3">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-center mb-1">
          <p className="text-sm font-semibold text-indigo-800">
            Create a free account to enroll
          </p>
          <p className="text-xs text-indigo-500 mt-0.5">
            Free to join · Takes 30 seconds
          </p>
        </div>

        <a
          href={`/signup?redirect=/courses/${courseId}`}
          className="block w-full text-center px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-200"
        >
          Create Free Account
        </a>

        <a
          href={`/login?redirect=/courses/${courseId}`}
          className="block w-full text-center px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all text-sm"
        >
          Already have an account? Log in
        </a>
      </div>
    );
  }

  /* ── Logged in, not yet enrolled ── */
  const label =
    accessType === "free"    ? "Enroll Now — It's Free" :
    accessType === "preview" ? "Start Free Preview"     :
                               "Enroll Now";

  return (
    <div className="space-y-3">
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="block w-full text-center px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold transition-all shadow-lg shadow-indigo-200"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Enrolling…
          </span>
        ) : label}
      </button>

      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
