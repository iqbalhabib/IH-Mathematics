"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { courses } from "@/lib/courses-data";

const TABS = ["All", "O Level", "A Level", "GRE"] as const;

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return courses.filter((c) => {
      const matchTab = activeTab === "All" || c.category === activeTab;
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.topics.some((t) => t.toLowerCase().includes(q));
      return matchTab && matchSearch;
    });
  }, [activeTab, search]);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-medium mb-5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Cambridge Certified Tutor
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              All Courses
            </h1>
            <p className="text-slate-300 text-lg mb-6">
              {courses.length} courses covering Cambridge O Level, A Level, and
              GRE Quantitative Reasoning — taught by an expert tutor.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 text-sm">
              {[
                { value: "996+", label: "Students Enrolled" },
                { value: "138", label: "Total Lessons" },
                { value: "4.8★", label: "Average Rating" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <span className="font-bold text-white text-xl">{value}</span>
                  <span className="text-slate-400 ml-2">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter + Grid ──────────────────────────────────────── */}
      <section className="bg-slate-50 min-h-screen">
        {/* Sticky filter bar */}
        <div className="sticky top-16 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            {/* Tabs */}
            <div className="flex gap-1.5">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Course grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No courses match your search.</p>
              <button
                onClick={() => { setSearch(""); setActiveTab("All"); }}
                className="mt-4 text-indigo-600 text-sm font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden card-hover flex flex-col"
                >
                  {/* Thumbnail */}
                  <div
                    className={`h-44 bg-gradient-to-br ${course.bg} relative flex items-center justify-center`}
                  >
                    <span className="text-7xl font-bold text-slate-300/60 select-none">
                      {course.symbol}
                    </span>
                    <span className="absolute top-3 left-3 text-2xl">
                      {course.icon}
                    </span>
                    {course.tag && (
                      <span
                        className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${course.tagColor}`}
                      >
                        {course.tag}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${course.badgeColor}`}
                      >
                        {course.badge}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {course.level}
                      </span>
                    </div>

                    <h2 className="font-bold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h2>
                    <p className="text-xs text-indigo-500 font-medium mb-3">
                      {course.subtitle}
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed flex-1 line-clamp-2">
                      {course.desc}
                    </p>

                    {/* Topics chips */}
                    <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                      {course.topics.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <span className="text-amber-400">★</span>
                        {course.rating}
                      </span>
                      <span>👤 {course.students}</span>
                      <span>📹 {course.lessons} lessons</span>
                      <span className="ml-auto text-indigo-600 font-semibold group-hover:underline">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 sm:p-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              Not sure which course to start?
            </h3>
            <p className="text-indigo-200 mb-6 max-w-md mx-auto">
              Message us on WhatsApp and we&apos;ll recommend the right course
              based on your current level and exam date.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/8801XXXXXXXXX"
                className="px-7 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-all text-center"
              >
                WhatsApp Us
              </a>
              <Link
                href="/signup"
                className="px-7 py-3 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all text-center"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
